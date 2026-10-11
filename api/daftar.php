<?php
/* ============================================================
   Pendaftaran anggota dari halaman publik.
   ------------------------------------------------------------
   Terbuka tanpa masuk, jadi ia hanya dapat melakukan satu hal:
   menambah SATU permohonan ke antrean `pendaftaran`. Ia tidak membuat
   akun, tidak memberi nomor induk, dan tidak menyentuh `users` —
   semua itu baru terjadi saat Sekretaris menerima permohonannya.

   Permohonan memuat nomor paspor dan alamat. Keduanya tak pernah
   dikirim balik ke siapa pun kecuali pemegang `anggota.manage`
   (lihat muat.php), dan jawaban berkas ini tak pernah membedakan
   surel yang sudah terdaftar dari yang belum — sama seperti masuk.php.
   ============================================================ */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();

const BATAS_FOTO = 400 * 1024;                 // sesudah dikecilkan peramban
const FOTO_JENIS = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
const BATAS_PER_JAM = 3;                       // per alamat pengirim
const BATAS_ANTREAN = 300;                     // permohonan menunggu, seluruhnya

$d = bacaJson();

/* Kolom jebakan: tersembunyi dari manusia, tetapi robot pengisi form
   mengisinya. Dijawab seolah berhasil supaya ia tak mencoba cara lain. */
if (trim((string) ($d['situs'] ?? '')) !== '') jawab(['terkirim' => true]);

$bersih = fn($v, $maks) => mb_substr(trim(preg_replace('/\s+/u', ' ', strip_tags((string) $v))), 0, $maks);
$nama        = $bersih($d['nama'] ?? '', 80);
$email       = strtolower($bersih($d['email'] ?? '', 120));
$telepon     = $bersih($d['telepon'] ?? '', 30);
$paspor      = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', (string) ($d['paspor'] ?? '')));
$paspor      = substr($paspor, 0, 20);
$tempatLahir = $bersih($d['tempatLahir'] ?? '', 60);
$tglLahir    = $bersih($d['tglLahir'] ?? '', 10);
$angkatan    = $bersih($d['angkatan'] ?? '', 40);
$pendidikan  = $bersih($d['pendidikan'] ?? '', 160);
$catatan     = $bersih($d['catatan'] ?? '', 500);
/* Alamat boleh beberapa baris. */
$alamat = mb_substr(trim(strip_tags((string) ($d['alamat'] ?? ''))), 0, 300);

if ($nama === '' || $email === '' || $paspor === '' || $alamat === '')
  galat('Nama, surel, nomor paspor, dan alamat wajib diisi.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) galat('Alamat surel tidak sah.');
if (strlen($paspor) < 5) galat('Nomor paspor terlalu pendek.');
if ($tglLahir !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $tglLahir)) galat('Tanggal lahir tidak sah.');
if ($telepon !== '' && !preg_match('/^[0-9+\-() ]{6,30}$/', $telepon)) galat('Nomor telepon tidak sah.');

$k = bacaKoleksi('pendaftaran');
$isi = is_array($k['isi']) ? $k['isi'] : [];

/* Pembatas laju. Alamat pengirim disimpan sebagai sidik, bukan apa
   adanya — cukup untuk menghitung, tak cukup untuk melacak orangnya. */
$sidik = substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '?') . '|' . (konfig()['rahasia'] ?: 'alijaz')), 0, 16);
$sejam = gmdate('c', time() - 3600);
$baruSaja = array_filter($isi, fn($x) => ($x['sidik'] ?? '') === $sidik && ($x['ts'] ?? '') > $sejam);
if (count($baruSaja) >= BATAS_PER_JAM) galat('Terlalu banyak permohonan dari perangkat ini. Coba lagi sejam lagi.', 429);
$menunggu = array_filter($isi, fn($x) => ($x['status'] ?? '') === 'menunggu');
if (count($menunggu) >= BATAS_ANTREAN) galat('Antrean pendaftaran sedang penuh. Hubungi Sekretaris.', 503);

/* Pas foto — opsional. Diperiksa sebagai gambar sungguhan, bukan
   dipercaya dari namanya; SVG ditolak sebab ia dapat memuat skrip. */
$foto = '';
$data = (string) ($d['foto'] ?? '');
if ($data !== '') {
  if (!preg_match('#^data:([a-z/]+);base64,#i', $data, $m)) galat('Pas foto bukan gambar yang sah.');
  $mime = strtolower($m[1]);
  if (!isset(FOTO_JENIS[$mime])) galat('Pas foto harus JPG, PNG, atau WebP.');
  $biner = base64_decode(substr($data, strlen($m[0])), true);
  if ($biner === false) galat('Data pas foto rusak.');
  if (strlen($biner) > BATAS_FOTO) galat('Pas foto terlalu besar.');
  $info = @getimagesizefromstring($biner);
  if (!$info || ($info['mime'] ?? '') !== $mime) galat('Pas foto bukan gambar yang sah.');

  $dir = __DIR__ . '/../berkas';
  if (!is_dir($dir) && !mkdir($dir, 0775, true)) galat('Folder berkas tidak dapat dibuat.', 500);
  $berkas = gmdate('Ymd') . '-' . bin2hex(random_bytes(6)) . '.' . FOTO_JENIS[$mime];
  if (file_put_contents("$dir/$berkas", $biner) === false) galat('Pas foto gagal disimpan.', 500);
  $foto = '/berkas/' . $berkas;
}

array_unshift($isi, [
  'id' => 'dft' . bin2hex(random_bytes(4)),
  'status' => 'menunggu', 'ts' => gmdate('c'), 'sidik' => $sidik,
  'nama' => $nama, 'email' => $email, 'telepon' => $telepon, 'paspor' => $paspor,
  'alamat' => $alamat, 'tempatLahir' => $tempatLahir, 'tglLahir' => $tglLahir,
  'angkatan' => $angkatan, 'pendidikan' => $pendidikan, 'catatan' => $catatan, 'foto' => $foto,
]);
tulisKoleksi('pendaftaran', $isi, null);
catatAudit(null, 'pendaftaran.masuk', 'daftar', "Permohonan pendaftaran dari $nama");
jawab(['terkirim' => true]);
