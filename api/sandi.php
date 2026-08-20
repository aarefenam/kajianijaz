<?php
/* Ganti kata sandi sendiri. Jalur SATU-SATUNYA yang menyentuh kolom
   password — simpan.php sengaja mengembalikan nilai lama, sehingga
   kata sandi tak bisa diubah lewat penyimpanan koleksi biasa. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();
$u = wajibMasuk();

$d = bacaJson();
$lama = (string) ($d['lama'] ?? '');
$baru = (string) ($d['baru'] ?? '');

/* Saat sandi masih bawaan, yang lama tidak diminta — pengguna memang
   baru menerimanya dan sedang diwajibkan menggantinya. */
$wajibLama = (int) ($u['sandiAwal'] ?? 0) !== 1;
if ($wajibLama && !password_verify($lama, $u['password'] ?? '')) {
  galat('Kata sandi lama tidak sesuai.', 403);
}
if (strlen($baru) < 8) galat('Kata sandi baru minimal 8 karakter.');
if (password_verify($baru, $u['password'] ?? '')) galat('Kata sandi baru sama dengan yang lama.');

$users = bacaKoleksi('users');
$isi = $users['isi'];
foreach ($isi as &$x) {
  if ($x['id'] === $u['id']) {
    $x['password'] = password_hash($baru, PASSWORD_DEFAULT);
    $x['sandiAwal'] = 0;
  }
}
unset($x);
$versi = tulisKoleksi('users', $isi, $users['versi']);
jawab(['ganti' => true, 'versi' => ['users' => $versi]]);
