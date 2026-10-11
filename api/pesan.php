<?php
/* Pesan dari form kontak halaman publik. Terbuka tanpa masuk, tetapi
   hanya dapat menambah satu pesan — bukan menulis koleksi sesuka hati. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();

$d = bacaJson();

/* Jebakan bot: kolom "situs" tersembunyi dari manusia. Yang mengisinya
   dijawab seolah berhasil, supaya ia tidak mencoba cara lain. */
if (trim((string) ($d['situs'] ?? '')) !== '') jawab(['terkirim' => true]);
$bersih = fn($v, $maks) => mb_substr(trim(strip_tags((string) $v)), 0, $maks);
$nama   = $bersih($d['nama'] ?? '', 80);
$email  = $bersih($d['email'] ?? '', 120);
$subjek = $bersih($d['subjek'] ?? '', 120);
$isiPesan = $bersih($d['isi'] ?? '', 4000);

if ($nama === '' || $isiPesan === '') galat('Nama dan isi pesan wajib diisi.');
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) galat('Alamat email tidak sah.');

/* Pembatas laju: paling banyak LIMA pesan per jam dari satu alamat.
   Alamatnya disimpan sebagai sidik, bukan apa adanya. Dibaca dan ditulis
   di dalam satu transaksi pengunci, supaya dua pesan yang tiba bersamaan
   tidak saling menimpa. */
const PESAN_PER_JAM = 5;
$sidik = substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '?') . '|' . (konfig()['rahasia'] ?: 'alijaz')), 0, 16);
mulaiTulis('pesan');
$k = bacaKoleksi('pesan');
$isi = is_array($k['isi']) ? $k['isi'] : [];
$sejam = gmdate('c', time() - 3600);
$baruSaja = array_filter($isi, fn($x) => ($x['sidik'] ?? '') === $sidik && ($x['ts'] ?? '') > $sejam);
if (count($baruSaja) >= PESAN_PER_JAM) galat('Terlalu banyak pesan dari alamat ini. Coba lagi satu jam lagi.', 429);
if (count($isi) > 500) array_splice($isi, 500);

array_unshift($isi, [
  'id' => 'p' . bin2hex(random_bytes(4)),
  'nama' => $nama, 'email' => $email, 'subjek' => $subjek ?: '(tanpa subjek)',
  'isi' => $isiPesan, 'tanggal' => gmdate('Y-m-d'), 'dibaca' => false,
  'ts' => gmdate('c'), 'sidik' => $sidik,
]);
tulisKoleksi('pesan', $isi, null);
catatAudit(null, 'pesan.masuk', 'kontak', "Pesan baru dari $nama — " . ($subjek ?: '(tanpa subjek)'));
selesaiTulis();
jawab(['terkirim' => true]);
