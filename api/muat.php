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
  $publik = ['cms', 'artikel', 'seo', 'users', 'kajian', 'video', 'buku', 'event', 'media'];
  $semua['isi'] = array_intersect_key($semua['isi'], array_flip($publik));
  $semua['versi'] = array_intersect_key($semua['versi'], array_flip($publik));

  /* Empat koleksi berikut adalah ruang kerja pengurus, bukan halaman
     publik: di dalamnya ada presensi, notulensi, anggaran, dan nama
     penanggung jawab tiap tahap. Yang boleh keluar hanya baris yang
     memang sudah tayang, dan hanya kolom yang memang dipampangkan di
     kartunya. Menyaring di sini, bukan di peramban — yang di peramban
     hanya menyembunyikan, sedangkan datanya tetap terkirim. */
  $saring = function (array $baris, array $kolom, ?callable $lolos) {
    $hasil = [];
    foreach ($baris as $x) {
      if (!is_array($x)) continue;
      if ($lolos && !$lolos($x)) continue;
      $hasil[] = array_intersect_key($x, array_flip($kolom));
    }
    return $hasil;
  };

  $aturan = [
    /* Jadwal kajian memang untuk diketahui umum — tetapi presensi,
       notulensi, dan siapa notulennya jelas bukan. */
    'kajian' => [
      ['id', 'judul', 'jenis', 'angkatan', 'level', 'tanggal', 'jam',
       'tempat', 'pemakalahId', 'moderatorId', 'status', 'materi'],
      null,
    ],
    /* Hanya video yang benar-benar sudah tayang. Yang berstatus
       'editing' atau 'dijadwalkan' belum tentu layak dilihat. */
    'video' => [
      ['id', 'judul', 'platform', 'tanggal', 'durasi', 'tautan', 'thumb'],
      fn($x) => ($x['status'] ?? '') === 'terbit',
    ],
    /* Buku: judul dan ringkasannya saja. Modal, honor, timeline, dan
       daftar penanggung jawab tiap tahap tidak ikut. */
    'buku' => [
      ['id', 'judul', 'ringkas', 'tahap', 'status', 'targetTerbit'],
      fn($x) => ($x['status'] ?? '') !== 'arsip',
    ],
    'event' => [
      ['id', 'judul', 'tanggal', 'jam', 'lokasi', 'ket'],
      fn($x) => ($x['status'] ?? '') === 'terbit',
    ],
    /* Galeri kegiatan di halaman Tentang. Hanya berkas yang benar-benar
       ada — baris tanpa gambar akan tampil sebagai bingkai kosong. */
    'media' => [
      ['id', 'nama', 'jenis', 'tanggal', 'berkas'],
      fn($x) => ($x['berkas'] ?? '') !== '',
    ],
  ];

  foreach ($aturan as $nama => [$kolom, $lolos]) {
    if (!isset($semua['isi'][$nama]) || !is_array($semua['isi'][$nama])) continue;
    $semua['isi'][$nama] = $saring($semua['isi'][$nama], $kolom, $lolos);
  }

  /* Anggota tampil di halaman publik, tetapi hanya sebatas yang memang
     dipampangkan di kartunya. Alamat surel sengaja TIDAK ikut: surel
     pengurus adalah identitas masuk mereka, dan masuk.php susah payah
     menjawab seragam agar surel terdaftar tidak dapat ditebak — membagikan
     daftarnya di sini akan meniadakan upaya itu sama sekali. */
  if (isset($semua['isi']['users']) && is_array($semua['isi']['users'])) {
    $tampak = ['id', 'nama', 'angkatan', 'level', 'pendidikan', 'kategori', 'foto', 'role', 'jabatan'];
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
