<?php
/* ============================================================
   CETAKAN KONFIGURASI — salin menjadi config.php
   ------------------------------------------------------------
   Berkas ini OPSIONAL. Tanpa config.php, situs tetap berjalan
   memakai SQLite di folder data/ — tak ada yang perlu disiapkan.

   Buat config.php hanya bila ingin memakai MySQL. Isinya diambil dari
   hPanel → Database → MySQL, dan berkas ini TIDAK boleh masuk repo.
   Karena tak terlacak Git, ia selamat melewati penerapan otomatis:
   `git pull` tidak menghapus berkas yang tidak dikenalnya.
   ============================================================ */

return [
  /* 'sqlite' (bawaan, tanpa persiapan) atau 'mysql'. */
  'driver'   => 'mysql',

  /* --- dipakai bila driver = mysql --- */
  'host'     => 'localhost',
  'database' => 'ISI_NAMA_DATABASE',
  'user'     => 'ISI_PENGGUNA_DATABASE',
  'password' => 'ISI_KATA_SANDI_DATABASE',

  /* --- dipakai bila driver = sqlite --- */
  'berkas'   => __DIR__ . '/../data/alijaz.sqlite',

  /* Kunci acak untuk menandatangani hal-hal kecil. Ganti dengan
     deretan acak apa pun sepanjang 32 karakter atau lebih. */
  'rahasia'  => 'GANTI_DENGAN_DERETAN_ACAK_PANJANG',
];
