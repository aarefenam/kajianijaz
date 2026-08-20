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

$k = bacaKoleksi('kunjungan');
$isi = is_array($k['isi']) ? $k['isi'] : [];
$tgl = gmdate('Y-m-d');

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

/* Tanpa kunci optimistis: penambahan seperti ini tidak pernah
   bertentangan, dan menolaknya hanya akan membuang kunjungan. */
tulisKoleksi('kunjungan', $isi, null);
jawab(['dicatat' => count($daftar)]);
