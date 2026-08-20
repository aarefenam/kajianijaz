<?php
/* Simpan koleksi yang berubah. Peramban hanya mengirim yang kotor,
   masing-masing beserta versi yang dipegangnya — sehingga tulisan
   yang berdiri di atas data usang ditolak, bukan menimpa diam-diam. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();
$u = wajibMasuk();

$d = bacaJson();
$perubahan = $d['koleksi'] ?? null;
if (!is_array($perubahan) || !$perubahan) galat('Tidak ada koleksi yang dikirim.');
if (count($perubahan) > 40) galat('Terlalu banyak koleksi dalam satu permintaan.');

/* Periksa SELURUH wewenang lebih dulu. Kalau satu saja ditolak, tak ada
   yang ditulis — supaya penyimpanan tidak pernah setengah jadi. */
foreach ($perubahan as $nama => $bagian) {
  if (!is_array($bagian) || !array_key_exists('isi', $bagian)) galat("Bentuk kiriman '$nama' tidak sah.");
  periksaTulis($u, (string) $nama, $bagian['isi']);
}

$sandiBaru = [];
$versiBaru = [];
foreach ($perubahan as $nama => $bagian) {
  $isi = $bagian['isi'];
  if ($nama === 'users') $isi = jagaRahasiaPengguna($isi, $sandiBaru);
  $versiBaru[$nama] = tulisKoleksi((string) $nama, $isi, isset($bagian['versi']) ? (int) $bagian['versi'] : null);
}

jawab(['versi' => $versiBaru] + ($sandiBaru ? ['sandiBaru' => $sandiBaru] : []));
