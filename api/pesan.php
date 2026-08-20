<?php
/* Pesan dari form kontak halaman publik. Terbuka tanpa masuk, tetapi
   hanya dapat menambah satu pesan — bukan menulis koleksi sesuka hati. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();

$d = bacaJson();
$bersih = fn($v, $maks) => mb_substr(trim(strip_tags((string) $v)), 0, $maks);
$nama   = $bersih($d['nama'] ?? '', 80);
$email  = $bersih($d['email'] ?? '', 120);
$subjek = $bersih($d['subjek'] ?? '', 120);
$isiPesan = $bersih($d['isi'] ?? '', 4000);

if ($nama === '' || $isiPesan === '') galat('Nama dan isi pesan wajib diisi.');
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) galat('Alamat email tidak sah.');

$k = bacaKoleksi('pesan');
$isi = is_array($k['isi']) ? $k['isi'] : [];
if (count($isi) > 500) array_splice($isi, 500);

array_unshift($isi, [
  'id' => 'p' . bin2hex(random_bytes(4)),
  'nama' => $nama, 'email' => $email, 'subjek' => $subjek ?: '(tanpa subjek)',
  'isi' => $isiPesan, 'tanggal' => gmdate('Y-m-d'), 'dibaca' => false,
]);
tulisKoleksi('pesan', $isi, null);
catatAudit(null, 'pesan.masuk', 'kontak', "Pesan baru dari $nama — " . ($subjek ?: '(tanpa subjek)'));
jawab(['terkirim' => true]);
