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

/** Gabungkan baris audit kiriman peramban ke yang tersimpan: yang baru
    ditambahkan, yang sudah ada tak tersentuh, 400 terbaru dipertahankan. */
function gabungAudit($kiriman): array {
  $tersimpan = bacaKoleksi('audit')['isi'] ?? [];
  if (!is_array($tersimpan)) $tersimpan = [];
  $ada = [];
  foreach ($tersimpan as $b) $ada[$b['id'] ?? ''] = true;
  foreach (is_array($kiriman) ? $kiriman : [] as $b) {
    if (!is_array($b) || ($b['id'] ?? '') === '' || isset($ada[$b['id']])) continue;
    $tersimpan[] = $b;
    $ada[$b['id']] = true;
  }
  usort($tersimpan, fn($a, $b) => strcmp((string) ($b['ts'] ?? ''), (string) ($a['ts'] ?? '')));
  return array_slice($tersimpan, 0, 400);
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
  if ($nama === 'users') { jagaHapusPengguna($user, $isiBaru); jagaUbahPengguna($user, $isiBaru); }
  if ($nama === 'keuangan' || $nama === 'aturKas' || $nama === 'tutupBuku') jagaKas($user, $nama, $isiBaru);
  if ($nama === 'kajian') jagaKajian($user, $isiBaru);
  if ($nama === 'artikel') susunArtikel($user, $isiBaru);
  if ($nama === 'buku') jagaBuku($isiBaru);
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

/**
 * Penjaga baris `buku`. Proyek yang sudah memuat naskah, dokumen,
 * kegiatan produksi, penjualan, atau transaksi Buku Kas tidak dapat
 * dibuang: ia dihentikan beserta alasannya. Tanpa ini, satu kiriman dapat
 * melenyapkan proyek yang masih dirujuk catatan Bendahara.
 */
function jagaBuku($isiBaru): void {
  if (!is_array($isiBaru)) galat('Bentuk data buku tidak sah.');
  $tersisa = [];
  foreach ($isiBaru as $b) {
    if (is_array($b) && ($b['id'] ?? '') !== '') $tersisa[$b['id']] = true;
  }
  $kas = null;
  foreach (bacaKoleksi('buku')['isi'] ?? [] as $b) {
    $id = $b['id'] ?? '';
    if ($id === '' || isset($tersisa[$id])) continue;
    /* Proyek contoh bawaan kedua dibuang migrasiBuku() di store.js. */
    if ($id === 'bk2' && ($b['judul'] ?? '') === 'Kaidah-Kaidah Tafsir Nusantara') continue;
    foreach (['naskah', 'dokumen', 'produksi', 'penjualan'] as $bagian) {
      if (!empty($b[$bagian])) galat('Proyek "' . ($b['judul'] ?? $id) . '" sudah memuat pekerjaan — hentikan, jangan dihapus.', 403);
    }
    if ($kas === null) $kas = bacaKoleksi('keuangan')['isi'] ?? [];
    foreach ($kas as $t) {
      if (($t['bukuId'] ?? '') === $id) galat('Proyek "' . ($b['judul'] ?? $id) . '" dirujuk transaksi Buku Kas — hentikan, jangan dihapus.', 403);
    }
  }
}

/** Boleh melihat naskah orang lain yang belum terbit? */
function pengurusArtikel(?array $user): bool {
  return bolehSalahSatu($user, ['artikel.review', 'artikel.publish', 'artikel.view', 'redaksi.manage']);
}

/**
 * Penjaga dan penyusun koleksi `artikel`.
 *
 * `artikel` boleh ditulis setiap anggota — mereka memang menulis — tetapi
 * izin koleksi saja berarti siapa pun dapat menerbitkan tulisannya sendiri
 * ke website publik, mengubah tulisan orang, atau menghapus semuanya dengan
 * satu kiriman. Di sini tiap baris dibandingkan dengan yang tersimpan:
 *
 *   penulis biasa : hanya naskahnya sendiri, dan hanya selagi draf atau
 *                   perlu revisi; ia mengirimnya untuk ditinjau atau
 *                   menariknya kembali, tak lebih.
 *   peninjau      : menyunting dan mengembalikan naskah siapa pun.
 *   penerbit      : menerbitkan dan menarik — tetapi tulisannya sendiri
 *                   diterbitkan Ketua Umum, bukan dirinya.
 *   siapa pun     : artikel terbit tidak dapat dihapus; tarik dulu.
 *
 * Penulis biasa hanya menerima naskahnya sendiri dan yang sudah terbit
 * (lihat muat.php), jadi kirimannya pun tidak utuh. Karena itu hasilnya
 * DISUSUN dari yang tersimpan: baris orang lain dipertahankan apa adanya,
 * apa pun yang dikirim. Hitungan baca selalu milik server.
 */
function susunArtikel(array $user, $isiBaru): array {
  if (!is_array($isiBaru)) galat('Bentuk data artikel tidak sah.');
  $aku = $user['id'] ?? '';
  $tinjau = bolehkah($user, 'artikel.review');
  $terbitkan = bolehkah($user, 'artikel.publish');
  $penuh = $tinjau || $terbitkan;
  $sama = fn($a, $b) => json_encode($a) === json_encode($b);
  $kini = gmdate('c');

  $lama = [];
  foreach (bacaKoleksi('artikel')['isi'] ?? [] as $a) {
    if (is_array($a) && ($a['id'] ?? '') !== '') $lama[$a['id']] = $a;
  }
  $cekTerbit = function (array $b) use ($user, $aku, $terbitkan) {
    if (!$terbitkan) galat('Hanya PJ Artikel atau Ketua Umum yang dapat menerbitkan artikel.', 403);
    if (($b['penulisId'] ?? '') === $aku && !bolehkah($user, 'user.manage')) {
      galat('Tulisan Anda sendiri diterbitkan oleh Ketua Umum.', 403);
    }
  };

  $baruDulu = [];
  $ubah = [];
  foreach ($isiBaru as $b) {
    if (!is_array($b) || ($b['id'] ?? '') === '') galat('Bentuk data artikel tidak sah.');
    $id = (string) $b['id'];
    $st = (string) ($b['status'] ?? 'draft');
    if (!in_array($st, ['draft', 'review', 'revisi', 'terbit'], true)) galat('Status artikel tidak dikenal.');

    if (!isset($lama[$id])) {
      $penulis = (string) ($b['penulisId'] ?? '');
      if ($penulis !== $aku) {
        /* Naskah atas nama orang lain: hanya sebagai draf, oleh peninjau
           atau penugas (makalah kajian yang dijadikan draf artikel). */
        if (!bolehSalahSatu($user, ['artikel.review', 'artikel.assign'])) galat('Anda hanya dapat membuat naskah atas nama sendiri.', 403);
        if ($st !== 'draft') galat('Naskah atas nama orang lain hanya dapat dibuat sebagai draf.', 403);
      }
      if ($st === 'terbit') $cekTerbit($b);
      if ($st === 'revisi' && !$tinjau) galat('Status itu hanya ditetapkan peninjau.', 403);
      $b['dilihat'] = 0;
      unset($b['_catatan'], $b['terbitPertama']);
      $b['riwayat'] = $st === 'draft' ? [] : [['dari' => 'draft', 'ke' => $st, 'oleh' => $aku, 'pada' => $kini, 'catatan' => '']];
      if ($st === 'terbit') $b['terbitPertama'] = $kini;
      $baruDulu[$id] = $b;
      continue;
    }

    $a = $lama[$id];
    $milikku = ($a['penulisId'] ?? '') === $aku;
    if (!$penuh && !$milikku) continue;            // baris orang lain: kirimannya diabaikan
    $b['dilihat'] = (int) ($a['dilihat'] ?? 0);
    /* Riwayat tinjauan dan tanggal terbit pertama ditulis server, bukan
       peramban: kiriman peramban untuk keduanya diabaikan, dan catatan
       perpindahan status dititipkan lewat `_catatan`. */
    $catatanPindah = mb_substr(trim((string) ($b['_catatan'] ?? '')), 0, 1000);
    unset($b['_catatan'], $b['riwayat'], $b['terbitPertama']);
    if (isset($a['riwayat'])) $b['riwayat'] = $a['riwayat'];
    if (isset($a['terbitPertama'])) $b['terbitPertama'] = $a['terbitPertama'];
    $urut = function (array $x) { ksort($x); return $x; };
    if ($sama($urut($a), $urut($b))) { $ubah[$id] = $a; continue; }
    $stA = (string) ($a['status'] ?? 'draft');

    if (!$tinjau) {
      if (!$milikku) galat('Anda hanya dapat menyunting artikel tulisan sendiri.', 403);
      if ($stA === 'terbit') galat('Artikel sudah terbit. Minta PJ Artikel menariknya lebih dulu.', 403);
      if ($stA === 'review' && $st !== 'draft') galat('Naskah sedang ditinjau. Tarik kembali ke draf untuk mengubahnya.', 403);
      if (!in_array($st, ['draft', 'review'], true) && $st !== $stA) galat('Status itu hanya ditetapkan peninjau.', 403);
      if (($b['penulisId'] ?? '') !== ($a['penulisId'] ?? '') || ($b['reviewerId'] ?? '') !== ($a['reviewerId'] ?? '')) {
        galat('Penulis dan peninjau naskah tidak dapat diubah.', 403);
      }
      $catatan = (string) ($b['reviewNote'] ?? '');
      if ($catatan !== '' && $catatan !== (string) ($a['reviewNote'] ?? '')) galat('Catatan peninjau hanya ditulis peninjau.', 403);
    } else {
      if ($st === 'terbit' && $stA !== 'terbit') $cekTerbit($b);
      if ($stA === 'terbit' && !$terbitkan) galat('Artikel terbit hanya diubah oleh yang berwenang menerbitkan.', 403);
      if ($st === 'revisi' && $stA !== 'revisi' && trim((string) ($b['reviewNote'] ?? '')) === '') galat('Catatan revisi wajib diisi.');
      if ($stA === 'terbit' && $st !== 'terbit' && $catatanPindah === '') galat('Alasan menarik artikel wajib diisi.');
    }
    if ($st !== $stA) {
      $b['riwayat'] = is_array($b['riwayat'] ?? null) ? $b['riwayat'] : [];
      $b['riwayat'][] = ['dari' => $stA, 'ke' => $st, 'oleh' => $aku, 'pada' => $kini,
        'catatan' => $st === 'revisi' ? mb_substr(trim((string) ($b['reviewNote'] ?? '')), 0, 1000)
          : ($stA === 'terbit' ? $catatanPindah : '')];
      if ($st === 'terbit' && empty($b['terbitPertama'])) $b['terbitPertama'] = $kini;
    }
    $ubah[$id] = $b;
  }

  $hasil = array_values($baruDulu);
  foreach ($lama as $id => $a) {
    if (isset($ubah[$id])) { $hasil[] = $ubah[$id]; continue; }
    $milikku = ($a['penulisId'] ?? '') === $aku;
    if (!$penuh && !$milikku) { $hasil[] = $a; continue; }   // tak terlihat olehnya, jadi tak terkirim
    /* Baris ini benar-benar dihapus. */
    $stA = (string) ($a['status'] ?? 'draft');
    if ($stA === 'terbit') galat('Artikel "' . ($a['judul'] ?? $id) . '" sudah terbit — tarik dulu ke draf, baru hapus.', 403);
    if (!$tinjau) {
      if (!$milikku) galat('Anda hanya dapat menghapus artikel tulisan sendiri.', 403);
      if ($stA === 'review') galat('Naskah sedang ditinjau. Tarik kembali ke draf untuk menghapusnya.', 403);
    }
  }
  return $hasil;
}

/** Baris artikel yang boleh dilihat pengguna ini: yang terbit, dan — bagi
    yang bukan pengurus artikel — naskahnya sendiri saja. */
function artikelUntuk(?array $user, array $isi): array {
  if (pengurusArtikel($user)) return $isi;
  $aku = $user['id'] ?? null;
  return array_values(array_filter($isi, fn($a) => is_array($a)
    && (($a['status'] ?? '') === 'terbit' || ($a['penulisId'] ?? null) === $aku)));
}

/** Tulis isi koleksi TANPA memajukan versinya — untuk pencacah yang
    bukan suntingan (hitungan baca). Memajukan versi di sana berarti tiap
    pengunjung website membatalkan penyimpanan penulis yang sedang bekerja. */
function tulisTanpaVersi(string $nama, $isi): void {
  pdo()->prepare('UPDATE koleksi SET isi = ? WHERE nama = ?')
    ->execute([json_encode($isi, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $nama]);
}

/**
 * Penjaga baris `kajian`. Koleksi ini ditulis empat izin — menjadwalkan,
 * presensi, notulen, materi — tetapi menambah dan membuang kajian hanya
 * urusan penjadwal. Kajian yang sudah memuat presensi atau notulen tidak
 * dapat dibuang siapa pun: ia dibatalkan beserta alasannya, sehingga
 * catatan yang sudah terjadi tak hilang oleh satu kiriman.
 */
function jagaKajian(array $user, $isiBaru): void {
  if (!is_array($isiBaru)) return;
  $baru = [];
  foreach ($isiBaru as $k) {
    if (is_array($k) && ($k['id'] ?? '') !== '') $baru[$k['id']] = true;
  }
  $lama = [];
  foreach (bacaKoleksi('kajian')['isi'] ?? [] as $k) {
    $id = $k['id'] ?? '';
    if ($id === '') continue;
    $lama[$id] = $k;
    if (isset($baru[$id])) continue;

    if (!bolehkah($user, 'kajian.manage')) galat('Anda tidak berwenang menghapus jadwal kajian.', 403);
    if (!empty($k['presensi']) || trim((string) ($k['notulensi'] ?? '')) !== '') {
      galat('Kajian "' . ($k['judul'] ?? $id) . '" sudah memuat presensi atau notulen — batalkan, jangan dihapus.', 403);
    }
  }
  if (!bolehkah($user, 'kajian.manage') && array_diff_key($baru, $lama)) {
    galat('Anda tidak berwenang menambah jadwal kajian.', 403);
  }

  /* Presensi, kuncinya, dan pengajuan izin hanya berubah lewat
     api/presensi.php — di sanalah jatah izin, kunci, dan alasan perubahan
     ditegakkan. Lewat simpan.php kolom-kolom itu harus kembali persis
     seperti yang tersimpan. Satu kekecualian: daftar peserta yang belum
     ada boleh dibubuhkan penjadwal (pembekuan kajian lama). */
  $sama = fn($a, $b) => json_encode($a ?? null) === json_encode($b ?? null);
  foreach ($isiBaru as $k) {
    if (!is_array($k)) galat('Bentuk data kajian tidak sah.');
    $id = $k['id'] ?? '';
    if ($id === '' || !isset($lama[$id])) {
      if (!empty($k['presensi']) || !empty($k['izin']) || !empty($k['presensiTutup'])) {
        galat('Kajian baru tidak dapat langsung memuat presensi.', 403);
      }
      continue;
    }
    $a = $lama[$id];
    foreach (['presensi', 'presensiTutup', 'izin', 'ubahPresensi'] as $kunci) {
      $kosongA = empty($a[$kunci]); $kosongB = empty($k[$kunci]);
      if ($kosongA && $kosongB) continue;
      if (!$sama($a[$kunci] ?? null, $k[$kunci] ?? null)) {
        galat('Presensi hanya dapat diubah lewat halaman presensi.', 403);
      }
    }
    if (isset($a['peserta']) && !$sama($a['peserta'], $k['peserta'] ?? null)) {
      galat('Daftar peserta kajian yang sudah dibekukan tidak dapat diubah.', 403);
    }
    if (!isset($a['peserta']) && isset($k['peserta']) && !bolehkah($user, 'kajian.manage')) {
      galat('Daftar peserta hanya dibekukan oleh penjadwal kajian.', 403);
    }
  }
}

/** Boleh melihat alasan izin dan pengajuan milik orang lain? */
function pengurusPresensi(?array $user): bool {
  return bolehSalahSatu($user, ['kajian.attendance', 'kajian.manage']);
}

/**
 * Baris kajian sebagaimana boleh dilihat pengguna ini. Alasan izin dan
 * sakit adalah urusan pribadi: anggota biasa hanya menerima miliknya
 * sendiri, dan catatan perubahan presensi tidak ikut sama sekali.
 */
function kajianUntuk(?array $user, array $k): array {
  if (pengurusPresensi($user)) return $k;
  $aku = $user['id'] ?? null;
  if (isset($k['izin']) && is_array($k['izin'])) {
    $k['izin'] = array_values(array_filter($k['izin'], fn($x) => ($x['userId'] ?? null) === $aku));
  }
  if (isset($k['presensi']) && is_array($k['presensi'])) {
    $k['presensi'] = array_map(function ($p) use ($aku) {
      if (($p['userId'] ?? null) !== $aku) unset($p['alasan']);
      return $p;
    }, $k['presensi']);
  }
  unset($k['ubahPresensi']);
  return $k;
}

/** Anggota aktif yang masih berjenjang — sama dengan berkajian() di store.js. */
function berkajian(array $u): bool {
  return ($u['status'] ?? '') === 'aktif' && ($u['angkatan'] ?? '') !== ''
    && !in_array($u['level'] ?? '', ['Alumni', '-', ''], true);
}

/**
 * Mulai transaksi tulis yang mengunci koleksi sampai selesai, supaya dua
 * pemindai yang mencatat pada detik yang sama tidak saling menimpa.
 */
function mulaiTulis(string $nama): void {
  $pdo = pdo();
  if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
    $pdo->exec('BEGIN IMMEDIATE');
  } else {
    $pdo->beginTransaction();
    $pdo->prepare('SELECT versi FROM koleksi WHERE nama = ? FOR UPDATE')->execute([$nama]);
  }
}
function selesaiTulis(): void {
  $pdo = pdo();
  if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') $pdo->exec('COMMIT');
  else $pdo->commit();
}

/**
 * Penjaga isi `users`. Izin koleksi saja tidak cukup: `users` boleh
 * ditulis tiga macam orang dengan wewenang yang sangat berbeda, dan
 * peramban selalu mengirim SELURUH koleksi. Tanpa pemeriksaan per baris,
 * PJ Koordinator — yang hanya berhak mengatur jenjang dan kelompok —
 * dapat menaikkan perannya sendiri menjadi Ketua Umum dengan satu
 * kiriman, dan Sekretaris pun demikian.
 *
 *   user.manage      : bebas.
 *   anggota.manage   : menambah dan mengubah data anggota, tetapi tidak
 *                      peran; akun baru lahir sebagai 'anggota'.
 *   anggota.kelompok : hanya jenjang, kelompok, dan keaktifan — tak
 *                      menambah akun. Pada barisnya sendiri ia tetap
 *                      boleh menyunting profilnya.
 *
 * Yang tak memegang satu pun izin itu tidak diperiksa di sini; jalurnya
 * hanyaProfilSendiri().
 */
function jagaUbahPengguna(array $user, $isiBaru): void {
  if (!is_array($isiBaru) || bolehkah($user, 'user.manage')) return;
  $kelola   = bolehkah($user, 'anggota.manage');
  $kelompok = bolehkah($user, 'anggota.kelompok');
  if (!$kelola && !$kelompok) return;

  $lama = [];
  foreach (bacaKoleksi('users')['isi'] ?? [] as $u) {
    if (($u['id'] ?? '') !== '') $lama[$u['id']] = $u;
  }
  /* Kosong, null, dan tak ada dianggap sama: peramban kerap melengkapi
     kolom yang belum ada dengan nilai kosong. */
  $beda = function ($a, $b): bool {
    $a = ($a === null || $a === '') ? null : $a;
    $b = ($b === null || $b === '') ? null : $b;
    return $a != $b;
  };

  foreach ($isiBaru as $u) {
    if (!is_array($u)) galat('Bentuk data anggota tidak sah.');
    $id = $u['id'] ?? '';

    if ($id === '' || !isset($lama[$id])) {
      if (!$kelola) galat('Anda tidak berwenang menambah anggota.', 403);
      if (kunciRole((string) ($u['role'] ?? 'anggota')) !== 'anggota') {
        galat('Hanya Ketua Umum yang dapat menetapkan peran.', 403);
      }
      continue;
    }

    $a = $lama[$id];
    $berubah = [];
    foreach (array_unique(array_merge(array_keys($a), array_keys($u))) as $kunci) {
      if ($kunci === 'password' || $kunci === 'sandiAwal') continue;   // diurus jagaRahasiaPengguna
      /* Nama peran lama dan barunya setara — migrasi peramban boleh menggantinya. */
      if ($kunci === 'role') {
        if (kunciRole((string) ($a['role'] ?? '')) !== kunciRole((string) ($u['role'] ?? ''))) $berubah[] = 'role';
        continue;
      }
      if ($beda($a[$kunci] ?? null, $u[$kunci] ?? null)) $berubah[] = $kunci;
    }
    if (!$berubah) continue;

    if (in_array('role', $berubah, true)) {
      galat('Hanya Ketua Umum yang dapat mengubah peran.', 403);
    }
    $sendiri = $id === ($user['id'] ?? null);
    if (!$sendiri && bolehkah($a, 'user.manage') && array_intersect($berubah, ['email', 'status'])) {
      galat('Surel dan status akun Ketua Umum hanya dapat diubah Ketua Umum.', 403);
    }
    if ($kelola) continue;

    /* Tinggal pemegang anggota.kelompok saja. */
    $terlarang = $sendiri
      ? array_intersect($berubah, ['angkatan', 'nia'])
      : array_diff($berubah, ['level', 'kelompok', 'status']);
    if ($terlarang) {
      galat('Koordinator hanya dapat mengubah jenjang, kelompok, dan keaktifan anggota.', 403);
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
