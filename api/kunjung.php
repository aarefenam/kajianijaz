<?php
/* Catat kunjungan halaman publik. Terbuka tanpa masuk — inilah yang
   membuat statistik menghitung pengunjung sungguhan. Hanya bisa
   MENAMBAH hitungan; tidak dapat dipakai menulis apa pun yang lain.

   Beberapa penanda dikirim sekaligus dalam satu permintaan (halaman,
   "(sesi)", "(baru)") karena ketiganya menyentuh koleksi yang sama:
   tiga permintaan terpisah akan saling menimpa dan hitungannya hilang. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();

$d = bacaJson();
$daftar = $d['halaman'] ?? null;
if (is_string($daftar)) $daftar = [$daftar];
if (!is_array($daftar) || !$daftar || count($daftar) > 5) galat('Daftar halaman tidak sah.');

foreach ($daftar as $h) {
  if (!is_string($h) || !preg_match('/^[a-z()\-]{1,24}$/', $h)) galat('Nama halaman tidak sah.');
}

/* Pembatas laju: hitungan ini terbuka bagi siapa pun, jadi satu alamat
   dibatasi 120 penanda per jam — cukup untuk pengunjung sungguhan, tidak
   cukup untuk menggelembungkan angka. Alamatnya disimpan sebagai sidik.
   Lewat batas dijawab seperti biasa, hanya tidak dihitung. */
const KUNJUNG_PER_JAM = 120;
$sidik = substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '?') . '|' . (konfig()['rahasia'] ?: 'alijaz')), 0, 16);

/* Dibaca dan ditulis dalam satu transaksi pengunci: dua kunjungan yang
   tiba bersamaan dulu saling menimpa, dan salah satunya hilang. */
mulaiTulis('kunjungan');
$laju = bacaKoleksi('lajuKunjung');
$catat = is_array($laju['isi']) ? $laju['isi'] : [];
$batas = time() - 3600;
foreach ($catat as $s => $waktu) {
  $catat[$s] = array_values(array_filter(is_array($waktu) ? $waktu : [], fn($t) => (int) $t > $batas));
  if (!$catat[$s]) unset($catat[$s]);
}
$terpakai = count($catat[$sidik] ?? []);
if ($terpakai + count($daftar) > KUNJUNG_PER_JAM) { selesaiTulis(); jawab(['dicatat' => 0]); }
for ($i = 0; $i < count($daftar); $i++) $catat[$sidik][] = time();
tulisKoleksi('lajuKunjung', $catat ?: new stdClass(), null);

$k = bacaKoleksi('kunjungan');
$isi = is_array($k['isi']) ? $k['isi'] : [];
$tgl = gmdate('Y-m-d');
/* Hitungan lebih tua dari 400 hari dibuang, supaya koleksinya tak tumbuh tanpa batas. */
$tua = gmdate('Y-m-d', time() - 400 * 86400);
$isi = array_values(array_filter($isi, fn($b) => is_array($b) && ($b['tgl'] ?? '') >= $tua));

foreach ($daftar as $halaman) {
  $ada = false;
  foreach ($isi as &$b) {
    if (($b['tgl'] ?? '') === $tgl && ($b['halaman'] ?? '') === $halaman) {
      $b['n'] = (int) $b['n'] + 1; $ada = true; break;
    }
  }
  unset($b);
  if (!$ada) $isi[] = ['tgl' => $tgl, 'halaman' => $halaman, 'n' => 1];
}

tulisKoleksi('kunjungan', $isi, null);
selesaiTulis();
jawab(['dicatat' => count($daftar)]);
