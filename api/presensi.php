<?php
/* ============================================================
   Presensi kajian — satu-satunya jalur yang mengubahnya.
   ------------------------------------------------------------
   Presensi dulu ikut terkirim sebagai bagian dari SELURUH koleksi
   `kajian`. Dua ponsel yang memindai di pintu yang sama lalu saling
   menolak (409), dan pindaian yang kalah hilang. Di sini tiap catatan
   adalah satu perubahan kecil pada satu kajian, ditulis di dalam
   transaksi yang mengunci — sehingga berapa pun pemindainya, tak ada
   yang tertimpa.

   Karena semua perubahan lewat sini, aturannya pun ditegakkan di sini:
     - jatah izin + sakit tiap anggota per jenjang (JATAH_IZIN);
     - presensi yang sudah ditutup terkunci: mengubahnya hanya oleh
       penjadwal kajian, dengan alasan yang tercatat;
     - anggota mengajukan izin hanya untuk dirinya sendiri.

   Hadir atau terlambat diputuskan peramban petugas dari jam setempat —
   server tidak tahu zona waktu tempat kajiannya berlangsung.
   ============================================================ */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();
$aku = wajibMasuk();

const JATAH_IZIN = 2;
const STATUS_HADIR = ['hadir', 'terlambat'];
const STATUS_IZIN = ['izin', 'sakit'];

$d = bacaJson();
$aksi = (string) ($d['aksi'] ?? '');
$idKajian = (string) ($d['idKajian'] ?? '');

mulaiTulis('kajian');
$kol = bacaKoleksi('kajian');
$isi = is_array($kol['isi']) ? $kol['isi'] : [];
$i = null;
foreach ($isi as $n => $baris) {
  if (($baris['id'] ?? '') === $idKajian) { $i = $n; break; }
}
if ($i === null) galat('Kajian tidak ditemukan.', 404);
$k = $isi[$i];
if (in_array($k['status'] ?? '', ['ditunda', 'dibatalkan'], true)) {
  galat('Kajian ini ' . $k['status'] . ' — presensinya tidak dapat diubah.');
}
$k['presensi'] = is_array($k['presensi'] ?? null) ? $k['presensi'] : [];
$k['izin'] = is_array($k['izin'] ?? null) ? $k['izin'] : [];

$users = [];
foreach (bacaKoleksi('users')['isi'] ?? [] as $u) {
  if (($u['id'] ?? '') !== '') $users[$u['id']] = $u;
}
$terkunci = !empty($k['presensiTutup']);
$kini = gmdate('c');
$tambahan = [];
$jejak = null;

/** Peserta dibekukan pada catatan pertama — lihat idPesertaKajian() di store.js. */
$bekukan = function () use (&$k, $users) {
  if (isset($k['peserta']) && is_array($k['peserta'])) return;
  $id = [];
  foreach ($users as $u) {
    if (berkajian($u) && ($u['angkatan'] ?? '') === ($k['angkatan'] ?? '')) $id[$u['id']] = true;
  }
  foreach ($k['presensi'] as $p) $id[$p['userId'] ?? ''] = true;
  unset($id['']);
  $k['peserta'] = array_keys($id);
};
$cari = function (string $userId) use (&$k): ?int {
  foreach ($k['presensi'] as $n => $p) if (($p['userId'] ?? '') === $userId) return $n;
  return null;
};
/** Izin + sakit yang sudah terpakai seorang anggota pada jenjang ini,
    di luar kajian yang sedang diubah. Pengajuan yang masih menunggu ikut
    dihitung — kalau tidak, jatahnya dapat dilampaui dengan mengajukan
    banyak sekaligus. */
$terpakai = function (string $userId) use ($isi, $k): int {
  $n = 0;
  foreach ($isi as $x) {
    if (($x['id'] ?? '') === $k['id']) continue;
    if (in_array($x['status'] ?? '', ['ditunda', 'dibatalkan'], true)) continue;
    if (($x['angkatan'] ?? '') !== ($k['angkatan'] ?? '') || ($x['level'] ?? '') !== ($k['level'] ?? '')) continue;
    $kena = false;
    foreach ($x['presensi'] ?? [] as $p) {
      if (($p['userId'] ?? '') === $userId && in_array($p['status'] ?? '', STATUS_IZIN, true)) $kena = true;
    }
    foreach ($x['izin'] ?? [] as $z) {
      if (($z['userId'] ?? '') === $userId && ($z['status'] ?? '') === 'menunggu') $kena = true;
    }
    if ($kena) $n++;
  }
  return $n;
};
$periksaJatah = function (string $userId) use ($terpakai, $users) {
  if ($terpakai($userId) >= JATAH_IZIN) {
    galat(($users[$userId]['nama'] ?? 'Anggota ini') . ' sudah memakai ' . JATAH_IZIN
      . ' kali izin/sakit pada jenjang ini. Jatahnya habis.', 422);
  }
};
$catatUbah = function (string $userId, ?string $dari, string $ke, string $alasan) use (&$k, $aku, $kini) {
  $k['ubahPresensi'] = is_array($k['ubahPresensi'] ?? null) ? $k['ubahPresensi'] : [];
  $k['ubahPresensi'][] = ['userId' => $userId, 'dari' => $dari ?? '', 'ke' => $ke,
    'alasan' => $alasan, 'oleh' => $aku['id'], 'pada' => $kini];
};

switch ($aksi) {

  /* ---------- catat satu orang ---------- */
  case 'catat': {
    if (!bolehkah($aku, 'kajian.attendance')) galat('Anda tidak berwenang mengisi presensi.', 403);
    $userId = (string) ($d['userId'] ?? '');
    $status = (string) ($d['status'] ?? '');
    $alasan = trim((string) ($d['alasan'] ?? ''));
    $alasanUbah = trim((string) ($d['alasanUbah'] ?? ''));
    if (!isset($users[$userId])) galat('Anggota tidak ditemukan.');
    if (!in_array($status, ['hadir', 'terlambat', 'izin', 'sakit', 'tidak-hadir', 'kosong'], true)) {
      galat('Status presensi tidak dikenal.');
    }
    $n = $cari($userId);
    $lama = $n === null ? null : ($k['presensi'][$n]['status'] ?? null);

    /* Kartu yang terpindai dua kali tidak menggeser jam datang pertamanya. */
    if (empty($d['timpa']) && $lama !== null && in_array($lama, STATUS_HADIR, true)) {
      $tambahan = ['sudah' => true, 'entri' => $k['presensi'][$n]];
      break;
    }
    if ($terkunci) {
      if (!bolehkah($aku, 'kajian.manage')) galat('Presensi kajian ini sudah ditutup. Hanya koordinator yang dapat mengubahnya.', 403);
      if ($alasanUbah === '') galat('Presensi sudah ditutup — alasan perubahan wajib diisi.');
    }
    if (in_array($status, STATUS_IZIN, true)) {
      if ($alasan === '') galat('Alasan ' . $status . ' wajib diisi.');
      if (!in_array($lama, STATUS_IZIN, true)) $periksaJatah($userId);
    }
    $bekukan();
    if (!in_array($userId, $k['peserta'], true)) $k['peserta'][] = $userId;

    if ($status === 'kosong') {
      if ($n !== null) array_splice($k['presensi'], $n, 1);
    } else {
      $entri = ['userId' => $userId, 'status' => $status,
        'jam' => in_array($status, STATUS_HADIR, true) ? substr((string) ($d['jam'] ?? ''), 0, 5) : '',
        'oleh' => $aku['id'], 'pada' => $kini];
      if (in_array($status, STATUS_IZIN, true)) $entri['alasan'] = mb_substr($alasan, 0, 300);
      if ($n === null) $k['presensi'][] = $entri; else $k['presensi'][$n] = $entri;
      $tambahan = ['entri' => $entri];
    }
    if ($terkunci) $catatUbah($userId, $lama, $status, mb_substr($alasanUbah, 0, 300));
    $jejak = ($users[$userId]['nama'] ?? $userId) . ' → ' . $status . ' pada "' . ($k['judul'] ?? '') . '"'
      . ($terkunci ? ' (sesudah ditutup: ' . $alasanUbah . ')' : '');
    break;
  }

  /* ---------- tutup: yang belum tercatat menjadi tidak hadir ---------- */
  case 'tutup': {
    if (!bolehkah($aku, 'kajian.attendance')) galat('Anda tidak berwenang menutup presensi.', 403);
    if ($terkunci) galat('Presensi kajian ini sudah ditutup.');
    $bekukan();
    $absen = 0;
    foreach ($k['peserta'] as $id) {
      if ($cari((string) $id) !== null) continue;
      $k['presensi'][] = ['userId' => $id, 'status' => 'tidak-hadir', 'jam' => '', 'oleh' => $aku['id'], 'pada' => $kini];
      $absen++;
    }
    $k['presensiTutup'] = $kini;
    $k['presensiTutupOleh'] = $aku['id'];
    $tambahan = ['absen' => $absen];
    $jejak = 'Menutup presensi "' . ($k['judul'] ?? '') . '" — ' . $absen . ' orang dicatat tidak hadir';
    break;
  }

  /* ---------- buka kembali ---------- */
  case 'buka': {
    if (!bolehkah($aku, 'kajian.manage')) galat('Hanya koordinator yang dapat membuka kembali presensi.', 403);
    if (!$terkunci) galat('Presensi kajian ini belum ditutup.');
    $alasan = trim((string) ($d['alasan'] ?? ''));
    if ($alasan === '') galat('Alasan membuka kembali wajib diisi.');
    unset($k['presensiTutup'], $k['presensiTutupOleh']);
    $catatUbah('', 'ditutup', 'dibuka', mb_substr($alasan, 0, 300));
    $jejak = 'Membuka kembali presensi "' . ($k['judul'] ?? '') . '" — ' . $alasan;
    break;
  }

  /* ---------- anggota mengajukan izin untuk dirinya sendiri ---------- */
  case 'ajukan': {
    $jenis = (string) ($d['jenis'] ?? '');
    $alasan = trim((string) ($d['alasan'] ?? ''));
    if (!in_array($jenis, STATUS_IZIN, true)) galat('Pilih izin atau sakit.');
    if (mb_strlen($alasan) < 5) galat('Tuliskan alasannya dengan jelas.');
    if (!berkajian($aku) || ($aku['angkatan'] ?? '') !== ($k['angkatan'] ?? '')) {
      galat('Anda bukan peserta kajian ini.', 403);
    }
    if ($terkunci) galat('Presensi kajian ini sudah ditutup. Hubungi koordinator.');
    /* Selisih zona waktu paling jauh sehari; lebih dari itu kajiannya pasti sudah lewat. */
    if (($k['tanggal'] ?? '') < gmdate('Y-m-d', time() - 86400)) galat('Kajian ini sudah lewat.');
    $n = $cari($aku['id']);
    if ($n !== null && in_array($k['presensi'][$n]['status'] ?? '', array_merge(STATUS_HADIR, STATUS_IZIN), true)) {
      galat('Kehadiran Anda pada kajian ini sudah tercatat.');
    }
    foreach ($k['izin'] as $z) {
      if (($z['userId'] ?? '') === $aku['id'] && ($z['status'] ?? '') === 'menunggu') galat('Pengajuan Anda untuk kajian ini masih menunggu keputusan.');
    }
    $periksaJatah($aku['id']);
    $k['izin'][] = ['id' => 'iz' . bin2hex(random_bytes(4)), 'userId' => $aku['id'], 'jenis' => $jenis,
      'alasan' => mb_substr($alasan, 0, 300), 'status' => 'menunggu', 'pada' => $kini];
    $jejak = ($aku['nama'] ?? '?') . ' mengajukan ' . $jenis . ' untuk "' . ($k['judul'] ?? '') . '"';
    break;
  }

  /* ---------- anggota menarik pengajuannya ---------- */
  case 'tarik': {
    $ada = false;
    foreach ($k['izin'] as $n => $z) {
      if (($z['id'] ?? '') !== (string) ($d['idIzin'] ?? '')) continue;
      if (($z['userId'] ?? '') !== $aku['id']) galat('Itu bukan pengajuan Anda.', 403);
      if (($z['status'] ?? '') !== 'menunggu') galat('Pengajuan ini sudah diputuskan.');
      array_splice($k['izin'], $n, 1);
      $ada = true;
      break;
    }
    if (!$ada) galat('Pengajuan tidak ditemukan.', 404);
    $jejak = ($aku['nama'] ?? '?') . ' menarik pengajuan izin untuk "' . ($k['judul'] ?? '') . '"';
    break;
  }

  /* ---------- koordinator memutuskan pengajuan ---------- */
  case 'putuskan': {
    if (!bolehkah($aku, 'kajian.attendance')) galat('Anda tidak berwenang memutuskan pengajuan izin.', 403);
    $setuju = !empty($d['setuju']);
    $catatan = trim((string) ($d['catatan'] ?? ''));
    $ada = false;
    foreach ($k['izin'] as $n => $z) {
      if (($z['id'] ?? '') !== (string) ($d['idIzin'] ?? '')) continue;
      if (($z['status'] ?? '') !== 'menunggu') galat('Pengajuan ini sudah diputuskan.');
      $ada = true;
      $pemohon = (string) $z['userId'];
      if ($setuju) {
        $m = $cari($pemohon);
        $lama = $m === null ? null : ($k['presensi'][$m]['status'] ?? null);
        if (in_array($lama, STATUS_HADIR, true)) galat('Anggota ini sudah tercatat hadir pada kajian tersebut.');
        /* Pengajuan ini sendiri masih "menunggu" dan sudah terhitung pada
           kajian lain; pada kajian ini ia dikecualikan oleh $terpakai. */
        $periksaJatah($pemohon);
        $bekukan();
        if (!in_array($pemohon, $k['peserta'], true)) $k['peserta'][] = $pemohon;
        $entri = ['userId' => $pemohon, 'status' => $z['jenis'], 'jam' => '', 'alasan' => $z['alasan'] ?? '',
          'oleh' => $aku['id'], 'pada' => $kini];
        if ($m === null) $k['presensi'][] = $entri; else $k['presensi'][$m] = $entri;
        if ($terkunci) $catatUbah($pemohon, $lama, (string) $z['jenis'], 'Pengajuan izin disetujui');
      } elseif ($catatan === '') {
        galat('Alasan penolakan wajib diisi.');
      }
      $k['izin'][$n]['status'] = $setuju ? 'disetujui' : 'ditolak';
      $k['izin'][$n]['catatan'] = mb_substr($catatan, 0, 300);
      $k['izin'][$n]['oleh'] = $aku['id'];
      $k['izin'][$n]['diputuskan'] = $kini;
      $jejak = ($setuju ? 'Menyetujui ' : 'Menolak ') . ($z['jenis'] ?? 'izin') . ' '
        . ($users[$pemohon]['nama'] ?? $pemohon) . ' untuk "' . ($k['judul'] ?? '') . '"';
      break;
    }
    if (!$ada) galat('Pengajuan tidak ditemukan.', 404);
    break;
  }

  default:
    galat('Aksi presensi tidak dikenal.');
}

$versi = (int) $kol['versi'];
if ($jejak !== null) {
  if (!$k['izin']) unset($k['izin']);
  $isi[$i] = $k;
  $versi = tulisKoleksi('kajian', $isi, null);
  catatAudit($aku, 'kajian.presensi', $idKajian, $jejak);
}
selesaiTulis();

/* Peramban menyebut versi yang dipegangnya. Bila tertinggal — ada ponsel
   lain yang menulis lebih dulu — seluruh koleksi dikirim sekalian, supaya
   peramban ini segar kembali tanpa permintaan kedua. */
if (isset($d['versi']) && (int) $d['versi'] !== (int) $kol['versi']) {
  $tambahan['semua'] = array_map(fn($x) => is_array($x) ? kajianUntuk($aku, $x) : $x, $isi);
}
jawab(['kajian' => kajianUntuk($aku, $k), 'versi' => ['kajian' => $versi]] + $tambahan);
