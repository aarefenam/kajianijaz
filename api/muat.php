<?php
/* Muat seluruh data. Peramban memegangnya di memori dan menggambar
   dari sana — persis seperti dulu dari localStorage, hanya sumbernya
   yang berpindah. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';

$semua = bacaSemua();
if (!$semua['isi']) galat('Database belum diisi. Jalankan pemasangan lebih dulu.', 503, ['perluPasang' => true]);

$u = penggunaAktif();

/* Kata sandi tidak pernah meninggalkan server, bahkan yang ter-hash. */
if (isset($semua['isi']['users']) && is_array($semua['isi']['users'])) {
  $semua['isi']['users'] = array_map('bersihkanPengguna', $semua['isi']['users']);
}

/* Sebelum masuk, yang boleh terbaca hanyalah yang memang tampil di
   halaman publik: isi website, artikel, SEO — dan daftar anggota, yang
   memang dipampangkan di halaman Tentang.

   Keuangan, surat, pesan masuk, presensi, dan jejak audit tidak termasuk. */
if (!$u) {
  $publik = ['cms', 'artikel', 'seo', 'users'];
  $semua['isi'] = array_intersect_key($semua['isi'], array_flip($publik));
  $semua['versi'] = array_intersect_key($semua['versi'], array_flip($publik));

  /* Anggota tampil di halaman publik, tetapi hanya sebatas yang memang
     dipampangkan di kartunya. Alamat surel sengaja TIDAK ikut: surel
     pengurus adalah identitas masuk mereka, dan masuk.php susah payah
     menjawab seragam agar surel terdaftar tidak dapat ditebak — membagikan
     daftarnya di sini akan meniadakan upaya itu sama sekali. */
  if (isset($semua['isi']['users']) && is_array($semua['isi']['users'])) {
    $tampak = ['id', 'nama', 'angkatan', 'level', 'pendidikan', 'kategori', 'foto', 'role'];
    $semua['isi']['users'] = array_values(array_map(
      fn($x) => array_intersect_key($x, array_flip($tampak)),
      array_filter($semua['isi']['users'], fn($x) => ($x['status'] ?? 'aktif') !== 'nonaktif')
    ));
  }
}

jawab([
  'isi'      => $semua['isi'],
  'versi'    => $semua['versi'],
  'pengguna' => $u ? bersihkanPengguna($u) : null,
  'sandiAwal'=> $u ? (int) ($u['sandiAwal'] ?? 0) === 1 : false,
]);
