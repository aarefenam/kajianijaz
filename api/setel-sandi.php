<?php
/* ============================================================
   Setel ulang kata sandi orang lain.
   ------------------------------------------------------------
   Layar masuk sejak awal berkata "Lupa kata sandi? Hubungi Sekretaris
   untuk penyetelan ulang" — dan sampai berkas ini ada, janji itu tak
   pernah dapat ditepati. Tidak ada satu pun jalan memulihkan sandi yang
   hilang; akun yang sandinya tak sempat tersalin praktis mati, dan
   satu-satunya siasat adalah menghapus orangnya lalu membuatnya lagi.

   Sandi barunya dikembalikan sekali, dalam bentuk polos, untuk
   disampaikan kepada yang bersangkutan. Sesudah itu ia hanya tersimpan
   teracak dan tak dapat dibaca siapa pun — termasuk yang menyetelnya.
   ============================================================ */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();
$aku = wajibMasuk();

if (!bolehSalahSatu($aku, ['anggota.manage', 'user.manage'])) {
  galat('Anda tidak berwenang menyetel ulang kata sandi.', 403);
}

$d = bacaJson();
$id = (string) ($d['id'] ?? '');
if ($id === '') galat('Id anggota wajib disertakan.');

$k = bacaKoleksi('users');
$isi = is_array($k['isi']) ? $k['isi'] : [];

$sasaran = null;
foreach ($isi as $u) { if (($u['id'] ?? null) === $id) { $sasaran = $u; break; } }
if (!$sasaran) galat('Anggota tidak ditemukan.', 404);

/* Penjagaan yang sungguh diperlukan: tanpa ini, Sekretaris — yang
   memegang anggota.manage — dapat menyetel ulang sandi Ketua Umum lalu
   masuk sebagai dia. Menyetel sandi pemegang wewenang tertinggi
   menuntut wewenang yang sama. */
if (bolehkah($sasaran, 'user.manage') && !bolehkah($aku, 'user.manage')) {
  galat('Kata sandi pemegang wewenang tertinggi hanya dapat disetel oleh Ketua Umum.', 403);
}

$mentah = sandiAcak();
foreach ($isi as &$u) {
  if (($u['id'] ?? null) !== $id) continue;
  $u['password'] = password_hash($mentah, PASSWORD_DEFAULT);
  /* Ditandai sandi awal: yang menerimanya wajib menggantinya saat
     pertama masuk, sebab sandi ini sempat berpindah tangan. */
  $u['sandiAwal'] = 1;
}
unset($u);

$versi = tulisKoleksi('users', $isi, $k['versi']);
catatAudit($aku, 'sandi.setel', $id,
  ($aku['nama'] ?? '?') . ' menyetel ulang kata sandi ' . ($sasaran['nama'] ?? $id));

jawab([
  'sandi' => $mentah,
  'nama'  => $sasaran['nama'] ?? '',
  'email' => $sasaran['email'] ?? '',
  'versi' => ['users' => $versi],
]);
