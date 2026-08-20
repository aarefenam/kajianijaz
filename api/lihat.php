<?php
/* Tambah satu hitungan baca pada sebuah artikel. Terbuka tanpa masuk —
   pembacanya memang pengunjung. Yang bisa diubahnya hanya kolom
   `dilihat`; seluruh isi artikel dibiarkan apa adanya. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();

$d = bacaJson();
$id = (string) ($d['id'] ?? '');
if (!preg_match('/^[A-Za-z0-9_-]{1,24}$/', $id)) galat('Id artikel tidak sah.');

$k = bacaKoleksi('artikel');
$isi = is_array($k['isi']) ? $k['isi'] : [];

$ketemu = false;
foreach ($isi as &$a) {
  if (($a['id'] ?? '') !== $id) continue;
  /* Hanya artikel yang benar-benar terbit yang dapat dihitung — kalau
     tidak, hitungan bisa dinaikkan pada naskah yang belum tayang. */
  if (($a['status'] ?? '') !== 'terbit') galat('Artikel tidak tersedia.', 404);
  $a['dilihat'] = (int) ($a['dilihat'] ?? 0) + 1;
  $ketemu = true;
  break;
}
unset($a);
if (!$ketemu) galat('Artikel tidak ditemukan.', 404);

/* Tanpa kunci optimistis, sama seperti kunjung.php: hitungan baca tidak
   pernah bertentangan, dan menolaknya hanya membuang bacaan. */
$versi = tulisKoleksi('artikel', $isi, null);
jawab(['dilihat' => true, 'versi' => ['artikel' => $versi]]);
