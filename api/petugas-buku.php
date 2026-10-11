<?php
/* ============================================================
   Tulisan petugas atas proyek buku yang menugasinya.
   ------------------------------------------------------------
   Penulis sub judul menyerahkan tautan naskahnya; anggota tim editor
   menyerahkan tautan suntingannya. Keduanya anggota biasa yang tidak
   berwenang menulis koleksi `buku`. Berkas ini hanya menyentuh kolom
   tugasnya, pada sub judul yang memang ditugaskan — siapa petugasnya
   dibaca dari proyek yang tersimpan dan dicocokkan dengan sesi.

   Menyerahkan bukan menyatakan siap: PJ Buku yang menerima atau
   mengembalikannya. Naskah yang sudah dinyatakan siap terkunci.
   Yang disimpan tautannya (Google Drive dan sejenisnya), bukan berkas.
   ============================================================ */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();
$aku = wajibMasuk();

$d = bacaJson();
$aksi = (string) ($d['aksi'] ?? '');
$idBuku = (string) ($d['idBuku'] ?? '');
$idNaskah = (string) ($d['idNaskah'] ?? '');

mulaiTulis('buku');
$kol = bacaKoleksi('buku');
$isi = is_array($kol['isi']) ? $kol['isi'] : [];
$i = null;
foreach ($isi as $n => $baris) {
  if (($baris['id'] ?? '') === $idBuku) { $i = $n; break; }
}
if ($i === null) galat('Proyek buku tidak ditemukan.', 404);
$b = $isi[$i];
if (!in_array($b['status'] ?? '', ['rencana', 'berjalan', 'aktif'], true)) galat('Proyek ini tidak sedang berjalan.');
$j = null;
foreach (($b['naskah'] ?? []) as $n => $x) {
  if (($x['id'] ?? '') === $idNaskah) { $j = $n; break; }
}
if ($j === null) galat('Sub judul tidak ditemukan.', 404);
$x = $b['naskah'][$j];
$kini = gmdate('c');

$t = trim((string) ($d['tautan'] ?? ''));
if ($t === '' || strlen($t) > 500 || !preg_match('#^https?://[^\s<>"\']+$#i', $t)) {
  galat('Tautan harus alamat lengkap yang diawali http:// atau https://');
}

switch ($aksi) {
  /* ---------- penulis menyerahkan naskahnya ---------- */
  case 'naskah':
    if (($x['userId'] ?? '') !== $aku['id']) galat('Sub judul ini bukan tugas Anda.', 403);
    if (($x['progressTulis'] ?? '') === 'siap') galat('Naskah ini sudah diterima. Hubungi PJ Buku bila perlu mengubahnya.');
    $x['tautan'] = $t;
    $x['diserahkan'] = $kini;
    $x['progressTulis'] = 'proses';
    $x['dikembalikan'] = false;
    $jejak = ($aku['nama'] ?? '?') . ' menyerahkan naskah "' . ($x['subJudul'] ?? '') . '"';
    break;

  /* ---------- anggota tim editor menyerahkan suntingan ---------- */
  case 'sunting':
    if (!in_array($aku['id'], $b['editorIds'] ?? [], true)) galat('Anda bukan anggota tim editor proyek ini.', 403);
    if (($x['progressTulis'] ?? '') !== 'siap') galat('Naskah ini belum diterima PJ Buku untuk disunting.');
    if (($x['progressEdit'] ?? '') === 'siap') galat('Suntingan ini sudah diterima. Hubungi PJ Buku bila perlu mengubahnya.');
    $x['tautanSunting'] = $t;
    $x['suntingDiserahkan'] = $kini;
    $x['penyuntingId'] = $aku['id'];
    $x['progressEdit'] = 'proses';
    $x['suntingDikembalikan'] = false;
    $jejak = ($aku['nama'] ?? '?') . ' menyerahkan suntingan "' . ($x['subJudul'] ?? '') . '"';
    break;

  default:
    galat('Aksi tidak dikenal.');
}

$b['naskah'][$j] = $x;
$isi[$i] = $b;
$versi = tulisKoleksi('buku', $isi, null);
catatAudit($aku, 'buku.petugas', $idBuku, $jejak . ' pada "' . ($b['judul'] ?? '') . '"');
selesaiTulis();

$jawab = ['buku' => bukuUntuk($aku, $b), 'versi' => ['buku' => $versi]];
if (isset($d['versi']) && (int) $d['versi'] !== (int) $kol['versi']) {
  $jawab['semua'] = array_map(fn($y) => is_array($y) ? bukuUntuk($aku, $y) : $y, $isi);
}
jawab($jawab);
