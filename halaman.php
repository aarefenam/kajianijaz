<?php
/* ============================================================
   Penyaji halaman publik — tempat SEO benar-benar terjadi.
   ------------------------------------------------------------
   Isi website dirender JavaScript, jadi tanpa berkas ini mesin pencari
   dan pratinjau tautan (WhatsApp, Telegram, Facebook) hanya melihat
   judul statis yang tertulis di tiap berkas .html — dan pengaturan di
   halaman SEO pada ERP tidak dibaca siapa pun.

   Di sini halaman disajikan lewat PHP: berkas .html-nya dibaca apa
   adanya, lalu <title>, deskripsi, kata kunci, robots, alamat kanonik,
   dan tag Open Graph di <head>-nya diganti dengan yang diatur di ERP.
   Artikel yang dibuka langsung (/artikel?buka=ID) memakai judul,
   ringkasan, dan sampulnya sendiri.

   Berkas yang sama juga membuat /robots.txt dan /sitemap.xml.

   .htaccess (bagian 7) mengarahkan /, /tentang, /artikel, /kontak, dan
   /daftar ke sini. Bila basis data tak terjangkau, halaman tetap
   tersaji — dengan <head> aslinya.
   ============================================================ */
declare(strict_types=1);

const HALAMAN_PUBLIK = ['index', 'tentang', 'artikel', 'kontak', 'daftar'];

$h = (string) ($_GET['h'] ?? 'index');
if ($h === '') $h = 'index';

/* ---------- jaring pengaman ----------
   inti.php menjawab galat dengan JSON lalu berhenti (exit). Untuk sebuah
   halaman itu berarti pengunjung melihat JSON galat. Karena itu keluaran
   ditampung, dan bila proses berhenti sebelum selesai, yang dikirim
   adalah berkas .html aslinya — status 200, tanpa tambahan apa pun. */
$mentah = in_array($h, HALAMAN_PUBLIK, true) ? @file_get_contents(__DIR__ . "/$h.html") : false;
$selesai = false;
ob_start();
register_shutdown_function(function () use (&$selesai, $mentah, $h) {
  if ($selesai) return;
  while (ob_get_level()) ob_end_clean();
  if ($mentah === false) { http_response_code($h === 'robots' ? 200 : 404); header('Content-Type: text/plain; charset=utf-8');
    echo $h === 'robots' ? "User-agent: *\nDisallow: /erp\nDisallow: /api/\n" : 'Tidak ditemukan.'; return; }
  http_response_code(200);
  header('Content-Type: text/html; charset=utf-8');
  header('Cache-Control: no-store, must-revalidate');
  echo $mentah;
});

require_once __DIR__ . '/api/inti.php';

$seo = bacaKoleksi('seo')['isi'] ?? [];
$cms = bacaKoleksi('cms')['isi'] ?? [];
if (!is_array($seo)) $seo = [];
$situs = is_array($cms['situs'] ?? null) ? $cms['situs'] : [];

$domain = preg_replace('#^https?://#i', '', trim((string) ($seo['domain'] ?? '')));
$domain = rtrim($domain !== '' ? $domain : (string) ($_SERVER['HTTP_HOST'] ?? ''), '/');
$akar = 'https://' . $domain;
$robots = (string) ($seo['robots'] ?? 'index, follow');
$bolehIndeks = stripos($robots, 'noindex') === false;
/* Alamat mutlak untuk gambar bagikan: hanya berkas unggahan atau alamat
   http(s) — gambar tertanam (data:) tidak dapat dipakai di luar halaman. */
$mutlak = function (string $u) use ($akar): string {
  if (preg_match('#^https?://#i', $u)) return $u;
  if (preg_match('#^/?berkas/[\w.\-]+$#', $u)) return $akar . '/' . ltrim($u, '/');
  return '';
};

/* ---------- robots.txt ---------- */
if ($h === 'robots') {
  $selesai = true; ob_end_clean();
  header('Content-Type: text/plain; charset=utf-8');
  header('Cache-Control: public, max-age=3600');
  echo "User-agent: *\n", ($bolehIndeks ? "Allow: /\n" : "Disallow: /\n"),
    "Disallow: /erp\nDisallow: /api/\n", ($bolehIndeks ? "\nSitemap: $akar/sitemap.xml\n" : '');
  exit;
}

/* ---------- sitemap.xml ---------- */
if ($h === 'sitemap') {
  $url = [['', date('Y-m-d')], ['tentang', ''], ['artikel', ''], ['kontak', ''], ['daftar', '']];
  foreach (bacaKoleksi('artikel')['isi'] ?? [] as $a) {
    if (is_array($a) && ($a['status'] ?? '') === 'terbit' && preg_match('/^[A-Za-z0-9_-]{1,24}$/', (string) ($a['id'] ?? ''))) {
      $url[] = ['artikel?buka=' . $a['id'], preg_match('/^\d{4}-\d{2}-\d{2}/', (string) ($a['tanggal'] ?? ''), $m) ? $m[0] : ''];
    }
  }
  $selesai = true; ob_end_clean();
  header('Content-Type: application/xml; charset=utf-8');
  header('Cache-Control: public, max-age=3600');
  echo '<?xml version="1.0" encoding="UTF-8"?>', "\n", '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', "\n";
  foreach ($url as [$jalur, $ubah]) {
    echo '  <url><loc>', htmlspecialchars("$akar/$jalur", ENT_XML1), '</loc>',
      ($ubah !== '' ? "<lastmod>$ubah</lastmod>" : ''), "</url>\n";
  }
  echo "</urlset>\n";
  exit;
}

if ($mentah === false) { $selesai = true; ob_end_clean(); http_response_code(404); header('Content-Type: text/plain; charset=utf-8'); echo 'Tidak ditemukan.'; exit; }

/* ---------- kepala halaman ---------- */
$nama = (string) ($situs['nama'] ?? "Kajian Al-I'jaz");
$judulHal = ['tentang' => 'Tentang Kajian', 'artikel' => 'Artikel', 'kontak' => 'Kontak', 'daftar' => 'Pendaftaran Anggota'];
if (isset($cms['halaman'][$h]['judul']) && is_string($cms['halaman'][$h]['judul'])) $judulHal[$h] = $cms['halaman'][$h]['judul'];

$judul = $h === 'index'
  ? (string) (($seo['judulBeranda'] ?? '') ?: $nama)
  : ($judulHal[$h] ?? ucfirst($h)) . ' — ' . $nama;
$deskripsi = (string) (($seo['deskripsi'] ?? '') ?: ($situs['deskripsi'] ?? ''));
$gambar = $mutlak((string) ($seo['ogGambar'] ?? ''));
$kanonik = $akar . '/' . ($h === 'index' ? '' : $h);
$jenis = 'website';

/* Artikel yang dibuka langsung membawa judul, ringkasan, dan sampulnya. */
$buka = (string) ($_GET['buka'] ?? '');
if ($h === 'artikel' && preg_match('/^[A-Za-z0-9_-]{1,24}$/', $buka)) {
  foreach (bacaKoleksi('artikel')['isi'] ?? [] as $a) {
    if (!is_array($a) || ($a['id'] ?? '') !== $buka || ($a['status'] ?? '') !== 'terbit') continue;
    $judul = (string) ($a['judul'] ?? $judul) . ' — ' . $nama;
    if (trim((string) ($a['ringkas'] ?? '')) !== '') $deskripsi = (string) $a['ringkas'];
    $sampul = $mutlak((string) ($a['cover'] ?? ''));
    if ($sampul !== '') $gambar = $sampul;
    $kanonik = "$akar/artikel?buka=$buka";
    $jenis = 'article';
    break;
  }
}

$e = fn(string $v) => htmlspecialchars(trim(preg_replace('/\s+/u', ' ', $v)), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$kunci = is_array($seo['kataKunci'] ?? null) ? implode(', ', array_filter(array_map('strval', $seo['kataKunci']))) : (string) ($seo['kataKunci'] ?? '');

$tag = ['<title>' . $e($judul) . '</title>',
  '<meta name="description" content="' . $e(mb_substr($deskripsi, 0, 300)) . '">',
  '<meta name="robots" content="' . $e($robots) . '">',
  '<link rel="canonical" href="' . $e($kanonik) . '">',
  '<meta property="og:type" content="' . $jenis . '">',
  '<meta property="og:site_name" content="' . $e($nama) . '">',
  '<meta property="og:title" content="' . $e($judul) . '">',
  '<meta property="og:description" content="' . $e(mb_substr($deskripsi, 0, 300)) . '">',
  '<meta property="og:url" content="' . $e($kanonik) . '">',
  '<meta property="og:locale" content="id_ID">',
  '<meta name="twitter:card" content="' . ($gambar !== '' ? 'summary_large_image' : 'summary') . '">'];
if ($kunci !== '') $tag[] = '<meta name="keywords" content="' . $e($kunci) . '">';
if (trim((string) ($seo['penulisMeta'] ?? '')) !== '') $tag[] = '<meta name="author" content="' . $e((string) $seo['penulisMeta']) . '">';
if ($gambar !== '') $tag[] = '<meta property="og:image" content="' . $e($gambar) . '">';

/* Judul dan deskripsi bawaan berkas dibuang, lalu yang baru disisipkan
   tepat sesudah tag viewport. */
$html = preg_replace('#<title>.*?</title>\s*#is', '', $mentah, 1);
$html = preg_replace('#<meta\s+name="(description|robots|keywords|author)"[^>]*>\s*#i', '', $html);
$sisip = implode("\n", $tag) . "\n";
$hasil = preg_replace('#(<meta\s+name="viewport"[^>]*>\s*)#i', '$1' . str_replace(['\\', '$'], ['\\\\', '\\$'], $sisip), $html, 1, $kena);
if (!$kena) $hasil = preg_replace('#<head>#i', "<head>\n" . str_replace(['\\', '$'], ['\\\\', '\\$'], $sisip), $html, 1);

$selesai = true;
ob_end_clean();
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store, must-revalidate');
echo $hasil;
