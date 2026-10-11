<?php
/* ============================================================
   Tulisan petugas atas kajiannya sendiri.
   ------------------------------------------------------------
   Pemakalah menyerahkan tautan makalah dan PPT-nya; notulen menulis
   notulennya. Keduanya anggota biasa yang tidak berwenang menulis
   koleksi `kajian`, dan memang tidak perlu: berkas ini hanya menyentuh
   kolom tugasnya, pada kajian yang menugasinya. Siapa petugasnya dibaca
   dari kajian yang tersimpan dan dicocokkan dengan sesi — bukan dari
   kiriman peramban.

   Berkas tidak diunggah ke server ini; yang disimpan tautannya
   (Google Drive dan sejenisnya), sebab ruang hosting terbatas.
   ============================================================ */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();
$aku = wajibMasuk();

/* Urutan dan judul bagian harus sama dengan BAGIAN_NOTULEN di store.js. */
const BAGIAN_NOTULEN = [
  'ringkasan'    => 'Ringkasan Pembahasan',
  'diskusi'      => 'Poin Diskusi',
  'kesimpulan'   => 'Kesimpulan',
  'tindakLanjut' => 'Tindak Lanjut',
];

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
if (in_array($k['status'] ?? '', ['ditunda', 'dibatalkan'], true)) galat('Kajian ini ' . $k['status'] . '.');
$kini = gmdate('c');
$jejak = '';

$tautan = function (string $kunci) use ($d): string {
  $t = trim((string) ($d[$kunci] ?? ''));
  if ($t === '') return '';
  if (strlen($t) > 500 || !preg_match('#^https?://[^\s<>"\']+$#i', $t)) {
    galat('Tautan harus alamat lengkap yang diawali http:// atau https://');
  }
  return $t;
};

switch ($aksi) {

  /* ---------- pemakalah menyerahkan makalah & PPT ---------- */
  case 'materi': {
    if (($k['pemakalahId'] ?? '') !== $aku['id']) galat('Hanya pemakalah kajian ini yang dapat menyerahkan makalahnya.', 403);
    if (($k['revisiStatus'] ?? '') === 'final') galat('Makalah ini sudah dinyatakan final. Hubungi koordinator bila perlu mengubahnya.');
    $makalah = $tautan('tautanMakalah');
    $ppt = $tautan('tautanPpt');
    if ($makalah === '' && $ppt === '') galat('Isi tautan makalah atau PPT.');
    if ($makalah !== ($k['tautanMakalah'] ?? '')) {
      $k['tautanMakalah'] = $makalah;
      if ($makalah !== '') {
        $k['makalahDikirim'] = $kini;
        /* Makalah baru atau hasil perbaikan kembali ke meja koordinator. */
        $k['revisiStatus'] = 'diperiksa';
        $k['revisi'] = false;
      }
    }
    $k['tautanPpt'] = $ppt;
    if ($ppt !== '') $k['ppt'] = true;
    $jejak = ($aku['nama'] ?? '?') . ' menyerahkan makalah/PPT untuk "' . ($k['judul'] ?? '') . '"';
    break;
  }

  /* ---------- notulen menulis notulennya ---------- */
  case 'notulen': {
    if (($k['notulenId'] ?? '') !== $aku['id']) galat('Hanya notulen kajian ini yang dapat menulis notulennya.', 403);
    $lama = is_array($k['notulen'] ?? null) ? $k['notulen'] : [];
    if (($lama['status'] ?? '') === 'sah') galat('Notulen ini sudah disahkan. Hubungi koordinator bila perlu mengubahnya.');
    $n = [];
    foreach (BAGIAN_NOTULEN as $kunci => $label) {
      $n[$kunci] = mb_substr(trim((string) ($d[$kunci] ?? '')), 0, 6000);
    }
    $ajukan = !empty($d['ajukan']);
    if ($ajukan && $n['ringkasan'] === '') galat('Ringkasan pembahasan wajib diisi sebelum diajukan.');
    $n['status'] = $ajukan ? 'diajukan' : 'draf';
    $n['penulis'] = $aku['id'];
    $n['diubah'] = $kini;
    if (!$ajukan && ($lama['catatan'] ?? '') !== '') $n['catatan'] = $lama['catatan'];
    $k['notulen'] = $n;
    /* `notulensi` — teks polosnya — tetap dipelihara: halaman lama dan
       rekap membacanya untuk tahu notulen sudah ditulis atau belum. */
    $teks = [];
    foreach (BAGIAN_NOTULEN as $kunci => $label) {
      if ($n[$kunci] !== '') $teks[] = $label . "\n" . $n[$kunci];
    }
    $k['notulensi'] = implode("\n\n", $teks);
    $jejak = ($aku['nama'] ?? '?') . ($ajukan ? ' mengajukan' : ' menyimpan draf') . ' notulen "' . ($k['judul'] ?? '') . '"';
    break;
  }

  default:
    galat('Aksi tidak dikenal.');
}

$isi[$i] = $k;
$versi = tulisKoleksi('kajian', $isi, null);
catatAudit($aku, 'kajian.petugas', $idKajian, $jejak);
selesaiTulis();

$jawab = ['kajian' => kajianUntuk($aku, $k), 'versi' => ['kajian' => $versi]];
if (isset($d['versi']) && (int) $d['versi'] !== (int) $kol['versi']) {
  $jawab['semua'] = array_map(fn($x) => is_array($x) ? kajianUntuk($aku, $x) : $x, $isi);
}
jawab($jawab);
