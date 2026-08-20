<?php
/* Pemasangan sekali jalan: buat tabel lalu isi dari data contoh.
   Data contohnya dikirim peramban, sebab ia hidup di seed.js — jadi
   tidak ada dua salinan data awal yang bisa menyimpang.

   Menolak berjalan bila database sudah berisi. Mengisi ulang menuntut
   pengosongan yang disengaja lewat api/kosongkan.php. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();

$sudah = bacaVersi();
if ($sudah) galat('Database sudah berisi. Pemasangan ditolak.', 409, ['koleksi' => count($sudah)]);

$d = bacaJson();
$isi = $d['isi'] ?? null;
if (!is_array($isi) || !isset($isi['users'])) galat('Data awal tidak lengkap.');

$dikenal = daftarKoleksi();
$sandiAwal = [];
$jumlah = 0;

foreach ($isi as $nama => $nilai) {
  if (!in_array($nama, $dikenal, true)) continue;      // abaikan yang tak dikenal

  if ($nama === 'users') {
    foreach ($nilai as &$u) {
      /* Kata sandi polos dari seed diganti hash acak sekali pakai.
         Yang lama ('123456') tidak pernah sampai ke database. */
      $mentah = sandiAcak();
      $u['password'] = password_hash($mentah, PASSWORD_DEFAULT);
      $u['sandiAwal'] = 1;
      $sandiAwal[] = ['id' => $u['id'], 'nama' => $u['nama'], 'email' => $u['email'],
                      'role' => $u['role'], 'sandi' => $mentah];
    }
    unset($u);
  }
  tulisKoleksi((string) $nama, $nilai, null);
  $jumlah++;
}

jawab(['dipasang' => $jumlah, 'sandiAwal' => $sandiAwal]);
