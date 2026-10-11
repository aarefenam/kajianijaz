<?php
/* ============================================================
   Pas foto kartu anggota — diunggah pemiliknya sendiri.
   ------------------------------------------------------------
   Pas foto adalah data diri, dan `dataDiri` hanya boleh ditulis
   pengelola keanggotaan. Supaya tiap anggota tetap dapat memasang
   fotonya sendiri tanpa diberi wewenang atas data diri orang lain,
   jalurnya dipisah di sini: berkas ini hanya menyentuh SATU kolom
   pada SATU baris — foto milik yang sedang masuk. Id sasarannya
   diambil dari sesi, bukan dari kiriman peramban.
   ============================================================ */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();
$aku = wajibMasuk();

const BATAS_FOTO = 400 * 1024;
const FOTO_JENIS = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

$d = bacaJson();
$data = (string) ($d['data'] ?? '');
if (!preg_match('#^data:([a-z/]+);base64,#i', $data, $m)) galat('Kiriman bukan gambar yang sah.');
$mime = strtolower($m[1]);
if (!isset(FOTO_JENIS[$mime])) galat('Pas foto harus JPG, PNG, atau WebP.');
$biner = base64_decode(substr($data, strlen($m[0])), true);
if ($biner === false) galat('Data gambar rusak.');
if (strlen($biner) > BATAS_FOTO) galat('Pas foto terlalu besar. Pilih foto lain atau potong lebih dulu.');
$info = @getimagesizefromstring($biner);
if (!$info || ($info['mime'] ?? '') !== $mime) galat('Berkas itu bukan gambar yang sah.');

$dir = __DIR__ . '/../berkas';
if (!is_dir($dir) && !mkdir($dir, 0775, true)) galat('Folder berkas tidak dapat dibuat.', 500);
$berkas = gmdate('Ymd') . '-' . bin2hex(random_bytes(6)) . '.' . FOTO_JENIS[$mime];
if (file_put_contents("$dir/$berkas", $biner) === false) galat('Pas foto gagal disimpan.', 500);
$url = '/berkas/' . $berkas;

$k = bacaKoleksi('dataDiri');
$isi = is_array($k['isi']) ? $k['isi'] : [];
$lama = '';
$ada = false;
foreach ($isi as &$baris) {
  if (($baris['userId'] ?? null) !== $aku['id']) continue;
  $lama = (string) ($baris['foto'] ?? '');
  $baris['foto'] = $url;
  $ada = true;
}
unset($baris);
if (!$ada) $isi[] = ['userId' => $aku['id'], 'foto' => $url];
$versi = tulisKoleksi('dataDiri', $isi, null);

/* Foto lamanya dibuang dari disk — hanya bila namanya berpola berkas
   unggahan sendiri, supaya tak ada jalan menghapus berkas lain. */
if (preg_match('#^/berkas/(\d{8}-[a-f0-9]{12}\.(?:jpg|png|webp))$#', $lama, $c)) {
  @unlink("$dir/{$c[1]}");
}

catatAudit($aku, 'kartu.foto', $aku['id'], ($aku['nama'] ?? '?') . ' memperbarui pas foto kartunya');
jawab(['url' => $url, 'versi' => $versi]);
