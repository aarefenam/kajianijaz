<?php
/* ============================================================
   INTI — sambungan, sesi, dan penjagaan wewenang
   ------------------------------------------------------------
   Dimuat oleh semua endpoint. Tidak menghasilkan keluaran apa pun
   sendiri.
   ============================================================ */

declare(strict_types=1);
require_once __DIR__ . '/rbac.php';

/* Jawaban API selalu JSON. Peringatan atau catatan PHP yang ikut
   tercetak akan mendahului JSON-nya dan membuat seluruh jawaban tak
   dapat dibaca — dengan status tetap 200, sehingga kegagalannya tampak
   seperti keberhasilan. Karena itu keluhan PHP dialihkan ke log server,
   tempatnya memang di sana. */
ini_set('display_errors', '0');
ini_set('log_errors', '1');

/* ---------- konfigurasi ----------
   Tanpa config.php, situs tetap jalan memakai SQLite di folder data/.
   Ini disengaja: satu berkas yang lupa dibuat tidak boleh menjatuhkan
   seluruh website, dan pada skala organisasi ini SQLite sudah lebih
   dari cukup — puluhan pengurus, bukan puluhan ribu pengunjung
   serentak menulis.

   Begitu api/config.php dibuat dan berisi kredensial MySQL, ia langsung
   dipakai menggantikan yang di bawah. Tidak ada yang perlu diubah di
   tempat lain. */
function konfig(): array {
  static $c = null;
  if ($c !== null) return $c;

  $bawaan = [
    'driver'   => 'sqlite',
    'host'     => 'localhost',
    'database' => '',
    'user'     => '',
    'password' => '',
    'berkas'   => __DIR__ . '/../data/alijaz.sqlite',
    'rahasia'  => '',
  ];

  $berkas = __DIR__ . '/config.php';
  $c = is_file($berkas) ? (require $berkas) + $bawaan : $bawaan;

  /* Konfigurasi yang masih memuat isian cetakan sama saja dengan tidak
     ada — lebih baik memakai SQLite daripada gagal menyambung MySQL. */
  if (($c['driver'] ?? '') === 'mysql' && str_starts_with((string) $c['database'], 'ISI_')) {
    $c['driver'] = 'sqlite';
  }
  return $c;
}

/* ---------- sambungan ---------- */
function pdo(): PDO {
  static $pdo = null;
  if ($pdo !== null) return $pdo;
  $k = konfig();

  if (($k['driver'] ?? 'mysql') === 'sqlite' && !in_array('sqlite', PDO::getAvailableDrivers(), true)) {
    galat('PHP di server ini tanpa pdo_sqlite. Buat database MySQL lalu isi api/config.php.', 500);
  }

  try {
    if (($k['driver'] ?? 'mysql') === 'sqlite') {
      $dir = dirname($k['berkas']);
      if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
        galat('Folder data/ tidak dapat dibuat. Beri izin tulis pada akar situs.', 500);
      }
      if (!is_writable($dir)) {
        galat('Folder data/ tidak dapat ditulis. Setel izinnya ke 755 lewat File Manager.', 500);
      }
      $pdo = new PDO('sqlite:' . $k['berkas']);
      /* Tanpa ini, dua permintaan yang menulis bersamaan langsung
         menyerah dengan "database is locked" alih-alih menunggu. */
      $pdo->setAttribute(PDO::ATTR_TIMEOUT, 5);
    } else {
      $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $k['host'], $k['database']);
      $pdo = new PDO($dsn, $k['user'], $k['password']);
    }
  } catch (PDOException $e) {
    /* Pesan asli PDO memuat nama database dan pengguna — jangan
       diteruskan ke peramban. Rinciannya cukup di log server. */
    error_log('Sambungan database gagal: ' . $e->getMessage());
    galat('Tidak dapat menyambung ke database.', 500);
  }

  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  if (($k['driver'] ?? '') === 'sqlite') $pdo->exec('PRAGMA journal_mode = WAL');
  siapkanTabel($pdo);
  return $pdo;
}

/* Satu DDL untuk MySQL maupun SQLite: keduanya menerima nama tipe ini,
   dan `diubah` diurus PHP agar tak bergantung pada ON UPDATE yang
   hanya ada di MySQL. */
function siapkanTabel(PDO $pdo): void {
  $pdo->exec('CREATE TABLE IF NOT EXISTS koleksi (
    nama   VARCHAR(40) NOT NULL PRIMARY KEY,
    isi    LONGTEXT    NOT NULL,
    versi  INTEGER     NOT NULL DEFAULT 1,
    diubah VARCHAR(32) NOT NULL
  )');
}

/* ---------- jawaban ---------- */
function jawab($data, int $kode = 200): never {
  http_response_code($kode);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function galat(string $pesan, int $kode = 400, array $tambahan = []): never {
  jawab(['galat' => $pesan] + $tambahan, $kode);
}

function bacaJson(): array {
  $mentah = file_get_contents('php://input');
  if ($mentah === '' || $mentah === false) return [];
  $d = json_decode($mentah, true);
  if (!is_array($d)) galat('Badan permintaan bukan JSON yang sah.');
  return $d;
}

function wajibPost(): void {
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') galat('Metode harus POST.', 405);
}

/* ---------- sesi ---------- */
function mulaiSesi(): void {
  if (session_status() === PHP_SESSION_ACTIVE) return;
  session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'httponly' => true,
    'samesite' => 'Lax',
    'secure'   => (($_SERVER['HTTPS'] ?? '') !== '') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https'),
  ]);
  session_start();
}

/** Pengguna yang sedang masuk, lengkap — termasuk kolom rahasia. */
function penggunaAktif(): ?array {
  mulaiSesi();
  $id = $_SESSION['userId'] ?? null;
  if (!$id) return null;
  foreach (bacaKoleksi('users')['isi'] as $u) {
    if (($u['id'] ?? null) === $id) return $u;
  }
  return null;
}

function wajibMasuk(): array {
  $u = penggunaAktif();
  if (!$u) galat('Sesi berakhir. Masuk ulang untuk melanjutkan.', 401);
  return $u;
}

/** Buang kolom yang tidak boleh meninggalkan server. */
function bersihkanPengguna(array $u): array {
  unset($u['password']);
  return $u;
}

/* ---------- koleksi ---------- */
function bacaKoleksi(string $nama): array {
  static $singgahan = [];
  if (isset($singgahan[$nama])) return $singgahan[$nama];

  $s = pdo()->prepare('SELECT isi, versi FROM koleksi WHERE nama = ?');
  $s->execute([$nama]);
  $b = $s->fetch();
  $hasil = $b
    ? ['isi' => json_decode($b['isi'], true), 'versi' => (int) $b['versi']]
    : ['isi' => null, 'versi' => 0];
  return $singgahan[$nama] = $hasil;
}

function bacaSemua(): array {
  $s = pdo()->query('SELECT nama, isi, versi FROM koleksi');
  $isi = []; $versi = [];
  foreach ($s->fetchAll() as $b) {
    $isi[$b['nama']]   = json_decode($b['isi'], true);
    $versi[$b['nama']] = (int) $b['versi'];
  }
  return ['isi' => $isi, 'versi' => $versi];
}

function bacaVersi(): array {
  $s = pdo()->query('SELECT nama, versi FROM koleksi');
  $v = [];
  foreach ($s->fetchAll() as $b) $v[$b['nama']] = (int) $b['versi'];
  return $v;
}

/**
 * Tulis satu koleksi dengan kunci optimistis.
 * $versiDipegang = versi yang dipegang peramban saat memuat.
 * Bila versi di server sudah bergerak, tulisan ditolak — bukan ditimpa.
 */
function tulisKoleksi(string $nama, $isi, ?int $versiDipegang): int {
  $pdo = pdo();
  $s = $pdo->prepare('SELECT versi FROM koleksi WHERE nama = ?');
  $s->execute([$nama]);
  $b = $s->fetch();
  $versiKini = $b ? (int) $b['versi'] : 0;

  if ($versiDipegang !== null && $versiKini !== 0 && $versiDipegang !== $versiKini) {
    galat('Data ini sudah diubah orang lain.', 409, ['koleksi' => $nama, 'versi' => $versiKini]);
  }

  $baru = $versiKini + 1;
  $teks = json_encode($isi, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  $waktu = gmdate('c');

  if ($b) {
    $pdo->prepare('UPDATE koleksi SET isi = ?, versi = ?, diubah = ? WHERE nama = ?')
        ->execute([$teks, $baru, $waktu, $nama]);
  } else {
    $pdo->prepare('INSERT INTO koleksi (nama, isi, versi, diubah) VALUES (?, ?, ?, ?)')
        ->execute([$nama, $teks, $baru, $waktu]);
  }
  return $baru;
}

/**
 * Catat satu baris jejak. Aksi yang dilakukan pengguna dicatat peramban
 * dan ikut terkirim lewat simpan.php; yang dicatat DI SINI hanyalah
 * tulisan publik — pesan kontak, misalnya — sebab pengirimnya belum
 * masuk dan tidak berwenang menulis koleksi audit sendiri.
 */
function catatAudit(?array $user, string $aksi, string $target, string $detail): void {
  $k = bacaKoleksi('audit');
  $isi = is_array($k['isi']) ? $k['isi'] : [];
  /* Bentuk barisnya harus persis sama dengan yang disusun catat() di
     store.js — ERP membaca `userNama`, dan baris yang memakai nama kolom
     lain akan tampil sebagai "undefined" di layar Jejak Aktivitas. */
  array_unshift($isi, [
    'id'       => 'log' . bin2hex(random_bytes(4)),
    'ts'       => gmdate('c'),
    'userId'   => $user['id'] ?? '-',
    'userNama' => $user['nama'] ?? 'Pengunjung',
    'role'     => $user['role'] ?? 'sistem',
    'aksi'     => $aksi,
    'target'   => $target,
    'detail'   => $detail,
  ]);
  /* Batas yang sama dengan di peramban (400). Bila berbeda, tiap kali
     ERP menyimpan ia akan memangkas selisihnya lagi dan mengirim ulang
     seluruh jejak tanpa guna. */
  if (count($isi) > 400) array_splice($isi, 400);
  tulisKoleksi('audit', $isi, null);
}

/* ---------- penjagaan tulis ---------- */

/**
 * Boleh atau tidak pengguna ini menulis koleksi tersebut.
 *
 * `users` punya kekecualian yang perlu: tiap orang berhak menyunting
 * akunnya sendiri lewat Pengaturan Akun, tanpa memegang izin mengelola
 * anggota. Karena yang dikirim peramban adalah SELURUH koleksi, server
 * membandingkannya dengan yang tersimpan dan memastikan tak ada baris
 * lain yang ikut berubah.
 */
function periksaTulis(array $user, string $nama, $isiBaru): void {
  if (!array_key_exists($nama, IZIN_KOLEKSI)) {
    galat("Koleksi tidak dikenal: $nama", 400);
  }
  $izin = IZIN_KOLEKSI[$nama];

  if ($izin === []) {
    galat("Koleksi '$nama' tidak dapat ditulis lewat jalur ini.", 403);
  }
  if ($izin === ['*']) return;                 // cukup sudah masuk
  if ($nama === 'users') jagaHapusPengguna($user, $isiBaru);
  if ($nama === 'keuangan' || $nama === 'aturKas' || $nama === 'tutupBuku') jagaKas($user, $nama, $isiBaru);
  if (bolehSalahSatu($user, $izin)) return;

  if ($nama === 'users' && hanyaProfilSendiri($user, $isiBaru)) return;

  galat("Role \"{$user['role']}\" tidak berwenang mengubah $nama.", 403);
}

/* ---------- kas: persetujuan pengeluaran ----------
   Aturannya sederhana: Bendahara mencatat, Ketua Umum menyetujui.
   Karena peramban mengirim seluruh koleksi `keuangan`, aturan itu tak
   dapat dititipkan pada antarmuka — siapa pun yang dapat memanggil API
   bisa menandai pengeluarannya sendiri "sah". Karena itu ditegakkan di
   sini, pada selisih antara yang tersimpan dan yang dikirim. */

/** Pengeluaran ini perlu disetujui? Batas 0 berarti semua nominal perlu. */
function perluSetujuKas(array $t, array $atur): bool {
  if (($t['jenis'] ?? '') !== 'keluar') return false;
  $rp = (float) ($t['rp'] ?? 0); $egp = (float) ($t['egp'] ?? 0);
  return ($rp > 0 && $rp >= (float) ($atur['batasSetujuRp'] ?? 0))
      || ($egp > 0 && $egp >= (float) ($atur['batasSetujuEgp'] ?? 0));
}
function kasSah(array $t): bool { $s = $t['status'] ?? 'sah'; return $s === 'sah' || $s === ''; }

/** Bulan ("2026-09") yang bukunya sedang tertutup. */
function bulanTertutup(): array {
  $t = bacaKoleksi('tutupBuku')['isi'];
  $hasil = [];
  foreach ((is_array($t) ? $t : []) as $x) {
    if (!empty($x['bulan']) && empty($x['dibuka'])) $hasil[$x['bulan']] = true;
  }
  return $hasil;
}

function jagaKas(array $user, string $nama, $isiBaru): void {
  /* Tutup buku: Bendahara hanya boleh MENAMBAH penutupan; yang sudah ada
     tak boleh ia ubah atau buang. Membuka kembali adalah hak Ketua, dan
     Ketua pun hanya boleh mengisi `dibuka` — tak menutup bulan sendiri. */
  if ($nama === 'tutupBuku') {
    $lama = bacaKoleksi('tutupBuku')['isi'];
    $lama = is_array($lama) ? $lama : [];
    $baru = is_array($isiBaru) ? $isiBaru : [];
    $petaBaru = [];
    foreach ($baru as $x) { if (!empty($x['id'])) $petaBaru[$x['id']] = $x; }
    $bolehBuka = bolehkah($user, 'keuangan.approve');
    $bolehTutup = bolehkah($user, 'keuangan.manage');
    foreach ($lama as $x) {
      $b = $petaBaru[$x['id'] ?? ''] ?? null;
      if ($b === null) galat('Catatan tutup buku tidak dapat dihapus.', 403);
      if ($b == $x) continue;
      $a2 = $x; $b2 = $b; unset($a2['dibuka'], $b2['dibuka']);
      if ($a2 != $b2 || !$bolehBuka) galat('Buku yang sudah ditutup hanya dapat dibuka kembali oleh Ketua Umum.', 403);
    }
    if (count($baru) > count($lama) && !$bolehTutup) galat('Menutup buku adalah tugas Bendahara.', 403);
    return;
  }

  $bolehCatat   = bolehSalahSatu($user, $nama === 'keuangan' ? ['keuangan.manage'] : ['keuangan.akun']);
  $bolehSetuju  = bolehkah($user, 'keuangan.approve');
  $lama = bacaKoleksi($nama)['isi'];

  if ($nama === 'aturKas') {
    $a = is_array($lama) ? $lama : []; $b = is_array($isiBaru) ? $isiBaru : [];
    $beda = fn(array $kunci) => array_filter($kunci, fn($k) => ($a[$k] ?? null) != ($b[$k] ?? null));
    if (!$bolehSetuju && $beda(['batasSetujuRp', 'batasSetujuEgp']))
      galat('Batas persetujuan pengeluaran hanya dapat diubah Ketua Umum.', 403);
    if (!$bolehCatat && $beda(['iuranRp', 'iuranEgp', 'periode']))
      galat('Nominal iuran dan periode kepengurusan diatur Bendahara.', 403);
    return;
  }

  if (!is_array($isiBaru)) return;
  $petaLama = [];
  foreach ((is_array($lama) ? $lama : []) as $t) { if (isset($t['id'])) $petaLama[$t['id']] = $t; }

  /* Bulan yang bukunya ditutup terkunci bagi siapa pun: tak ada transaksi
     yang boleh masuk, keluar, atau berubah nilainya di sana. Yang
     dibandingkan hanya kolom yang menentukan uang — mengganti nama
     kategori, misalnya, tetap boleh merambat ke transaksi lama. */
  $tutup = bulanTertutup();
  if ($tutup) {
    $uang = ['jenis', 'rp', 'egp', 'akunId', 'akunTujuanId', 'rpTujuan', 'egpTujuan', 'tanggal', 'status'];
    $inti = fn(array $t) => array_map(fn($k) => (string) ($t[$k] ?? ''), $uang);
    $bulan = fn(array $t) => substr((string) ($t['tanggal'] ?? ''), 0, 7);
    $terlihat = [];
    foreach ($isiBaru as $t) {
      if (!is_array($t)) continue;
      $id = $t['id'] ?? ''; $terlihat[$id] = true;
      $a = $petaLama[$id] ?? null;
      if ($a !== null && $inti($a) === $inti($t)) continue;
      if (isset($tutup[$bulan($t)]) || ($a !== null && isset($tutup[$bulan($a)])))
        galat('Buku bulan ' . ($a !== null && isset($tutup[$bulan($a)]) ? $bulan($a) : $bulan($t)) . ' sudah ditutup. Minta Ketua Umum membukanya kembali.', 403);
    }
    foreach ($petaLama as $id => $a) {
      if (!isset($terlihat[$id]) && isset($tutup[$bulan($a)])) galat('Buku bulan ' . $bulan($a) . ' sudah ditutup.', 403);
    }
  }

  /* Yang hanya berwenang menyetujui (Ketua) tak boleh menambah, membuang,
     atau mengubah transaksi — selain memutuskan yang sedang menunggu. */
  if (!$bolehCatat) {
    if (count($isiBaru) !== count($petaLama)) galat('Ketua Umum tidak mencatat transaksi; hanya menyetujuinya.', 403);
    foreach ($isiBaru as $t) {
      $id = $t['id'] ?? null;
      if ($id === null || !isset($petaLama[$id])) galat('Ketua Umum tidak mencatat transaksi; hanya menyetujuinya.', 403);
      $a = $petaLama[$id]; $b = $t;
      unset($a['status'], $a['persetujuan'], $b['status'], $b['persetujuan']);
      if ($a != $b) galat('Ketua Umum hanya dapat menyetujui atau menolak pengeluaran, bukan mengubah isinya.', 403);
      if (($petaLama[$id]['status'] ?? 'sah') !== ($t['status'] ?? 'sah')
          && ($petaLama[$id]['status'] ?? '') !== 'menunggu')
        galat('Hanya pengeluaran yang sedang menunggu yang dapat diputuskan.', 403);
    }
    return;
  }
  if ($bolehSetuju) return;       // memegang keduanya: tak dibatasi

  /* Bendahara: pengeluaran yang perlu persetujuan tak boleh ia sahkan
     sendiri — baik yang baru, yang sedang menunggu, maupun yang sudah
     sah lalu dinaikkan nominalnya. */
  $atur = bacaKoleksi('aturKas')['isi'];
  $atur = is_array($atur) ? $atur : [];
  foreach ($isiBaru as $t) {
    if (!is_array($t) || !kasSah($t) || !perluSetujuKas($t, $atur)) continue;
    $a = $petaLama[$t['id'] ?? ''] ?? null;
    $tetap = $a && kasSah($a) && ($a['jenis'] ?? '') === 'keluar'
      && (float) ($t['rp'] ?? 0) <= (float) ($a['rp'] ?? 0)
      && (float) ($t['egp'] ?? 0) <= (float) ($a['egp'] ?? 0);
    if (!$tetap) galat('Pengeluaran ini perlu disetujui Ketua Umum lebih dulu.', 403);
  }
}

/**
 * Penjaga penghapusan anggota. Peramban mengirim seluruh koleksi
 * `users`, jadi "menghapus" hanyalah baris yang tak ikut terkirim —
 * dan tanpa pemeriksaan ini siapa pun yang boleh menulis `users` dapat
 * membuang Ketua Umum, atau dirinya sendiri, dengan satu kiriman.
 */
function jagaHapusPengguna(array $user, $isiBaru): void {
  if (!is_array($isiBaru)) return;
  $tersisa = [];
  foreach ($isiBaru as $u) {
    if (is_array($u) && ($u['id'] ?? '') !== '') $tersisa[$u['id']] = true;
  }
  foreach (bacaKoleksi('users')['isi'] ?? [] as $u) {
    $id = $u['id'] ?? '';
    if ($id === '' || isset($tersisa[$id])) continue;

    if (!bolehSalahSatu($user, ['anggota.manage', 'user.manage'])) {
      galat('Anda tidak berwenang menghapus anggota.', 403);
    }
    if ($id === ($user['id'] ?? null)) {
      galat('Anda tidak dapat menghapus akun sendiri.', 403);
    }
    if (bolehkah($u, 'user.manage') && !bolehkah($user, 'user.manage')) {
      galat('Akun pemegang wewenang tertinggi hanya dapat dihapus oleh Ketua Umum.', 403);
    }
  }
}

/** Benarkah perubahan pada `users` hanya menyentuh baris milik sendiri? */
function hanyaProfilSendiri(array $user, $isiBaru): bool {
  if (!is_array($isiBaru)) return false;
  $lama = bacaKoleksi('users')['isi'] ?? [];
  if (count($lama) !== count($isiBaru)) return false;      // ada yang ditambah/dihapus

  $petaLama = [];
  foreach ($lama as $u) $petaLama[$u['id']] = $u;

  foreach ($isiBaru as $u) {
    $id = $u['id'] ?? null;
    if ($id === null || !isset($petaLama[$id])) return false;
    $a = $petaLama[$id];
    unset($a['password']);                                  // tak pernah dikirim peramban
    $b = $u; unset($b['password']);
    if ($a == $b) continue;                                 // tak berubah
    if ($id !== $user['id']) return false;                  // menyentuh milik orang lain

    /* Pada barisnya sendiri pun, hanya kolom ini yang boleh berubah —
       peran dan status bukan urusan pemilik akun. */
    foreach (['role', 'status', 'angkatan', 'level', 'kelompok', 'nia'] as $kunci) {
      if (($a[$kunci] ?? null) !== ($b[$kunci] ?? null)) return false;
    }
  }
  return true;
}

/**
 * Kolom rahasia tidak pernah dikirim ke peramban, jadi ia juga tidak
 * pernah kembali. Sebelum menyimpan `users`, kembalikan nilai yang
 * tersimpan di server; kalau tidak, seluruh kata sandi akan terhapus
 * pada penyimpanan pertama.
 *
 * Anggota yang baru ditambahkan belum punya kata sandi — server
 * membuatkannya sekali dan mengembalikannya agar dapat disampaikan.
 */
function jagaRahasiaPengguna(array $isiBaru, array &$sandiBaru): array {
  $lama = bacaKoleksi('users')['isi'] ?? [];
  $peta = [];
  foreach ($lama as $u) {
    /* Baris tanpa id pernah tersimpan — lihat catatan di bawah. Tanpa
       penjaga ini PHP mengeluh "Undefined array key", dan keluhannya
       tercetak ke badan jawaban sebelum JSON, sehingga peramban
       menerima 200 dengan isi yang tak dapat dibaca. */
    $id = $u['id'] ?? '';
    if ($id !== '') $peta[$id] = $u;
  }

  foreach ($isiBaru as &$u) {
    /* Anggota tanpa id tak dapat masuk sama sekali: masuk.php menyimpan
       userId null, dan penggunaAktif() tak pernah menemukannya kembali.
       Peramban sempat mengirim bentuk seperti itu, jadi server
       membubuhkan id sendiri alih-alih menyimpan baris yang mati. */
    if (($u['id'] ?? '') === '') $u['id'] = 'u' . bin2hex(random_bytes(4));

    $id = $u['id'];
    if (isset($peta[$id]['password'])) {
      /* Peramban boleh mengusulkan kata sandi baru hanya lewat
         api/sandi.php, bukan lewat simpan biasa. */
      $u['password'] = $peta[$id]['password'];
      $u['sandiAwal'] = $peta[$id]['sandiAwal'] ?? 0;
    } else {
      $mentah = sandiAcak();
      $u['password'] = password_hash($mentah, PASSWORD_DEFAULT);
      $u['sandiAwal'] = 1;
      $sandiBaru[$id] = ['sandi' => $mentah, 'nama' => $u['nama'] ?? '', 'email' => $u['email'] ?? ''];
    }
  }
  return $isiBaru;
}

function sandiAcak(int $panjang = 10): string {
  /* Tanpa huruf dan angka yang mudah tertukar saat dibacakan. */
  $abjad = 'abcdefghijkmnpqrstuvwxyz23456789';
  $s = '';
  for ($i = 0; $i < $panjang; $i++) $s .= $abjad[random_int(0, strlen($abjad) - 1)];
  return $s;
}
