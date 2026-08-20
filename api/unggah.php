<?php
/* Terima gambar, tulis sebagai berkas, kembalikan URL-nya.
   Gambar dahulu disimpan sebagai data-URI di dalam JSON — 44% dari
   seluruh data, dan itu baru data contoh. Sebagai berkas, JSON tetap
   ramping dan peramban dapat menyinggahkan gambarnya. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();
wajibMasuk();

const BATAS_BYTE = 3 * 1024 * 1024;
const JENIS = [
  'image/jpeg' => 'jpg', 'image/png' => 'png',
  'image/webp' => 'webp', 'image/svg+xml' => 'svg',
];

$d = bacaJson();
$data = (string) ($d['data'] ?? '');
if (!preg_match('#^data:([a-z+/]+);base64,#i', $data, $m)) galat('Kiriman bukan data-URI gambar.');
$mime = strtolower($m[1]);
if (!isset(JENIS[$mime])) galat('Jenis gambar tidak didukung.');

$biner = base64_decode(substr($data, strlen($m[0])), true);
if ($biner === false) galat('Data gambar rusak.');
if (strlen($biner) > BATAS_BYTE) galat('Gambar melebihi 3 MB.');

/* SVG boleh memuat <script>. Berkas di sini selalu dipasang lewat
   <img src>, dan peramban tidak menjalankan skrip pada SVG yang dimuat
   begitu — tetapi bila alamatnya dibuka langsung, skripnya berjalan
   pada domain ini. Karena itu SVG unggahan disaring. */
if ($mime === 'image/svg+xml') {
  $teks = (string) $biner;
  if (preg_match('/<\s*script|javascript:|on[a-z]+\s*=/i', $teks)) {
    galat('SVG memuat skrip dan ditolak.');
  }
}

$dir = __DIR__ . '/../berkas';
if (!is_dir($dir) && !mkdir($dir, 0775, true)) galat('Folder berkas tidak dapat dibuat.', 500);

$nama = gmdate('Ymd') . '-' . bin2hex(random_bytes(6)) . '.' . JENIS[$mime];
if (file_put_contents("$dir/$nama", $biner) === false) galat('Gambar gagal disimpan.', 500);

jawab(['url' => '/berkas/' . $nama, 'ukuran' => strlen($biner)]);
