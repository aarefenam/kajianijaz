<?php
/* ============================================================
   CETAKAN KONFIGURASI — salin menjadi config.php
   ------------------------------------------------------------
   Berkas config.php TIDAK boleh masuk repo. Ia dibuat sekali di
   server lewat hPanel → File Manager, dan diisi dari
   hPanel → Database → MySQL.

   Karena tak terlacak Git, ia selamat melewati penerapan otomatis:
   `git pull` tidak menghapus berkas yang tidak dikenalnya.
   ============================================================ */

return [
  /* 'mysql' di server, 'sqlite' saat menguji di mesin sendiri. */
  'driver'   => 'mysql',

  /* --- dipakai bila driver = mysql --- */
  'host'     => 'localhost',
  'database' => 'ISI_NAMA_DATABASE',
  'user'     => 'ISI_PENGGUNA_DATABASE',
  'password' => 'ISI_KATA_SANDI_DATABASE',

  /* --- dipakai bila driver = sqlite --- */
  'berkas'   => __DIR__ . '/../data/uji.sqlite',

  /* Kunci acak untuk menandatangani hal-hal kecil. Ganti dengan
     deretan acak apa pun sepanjang 32 karakter atau lebih. */
  'rahasia'  => 'GANTI_DENGAN_DERETAN_ACAK_PANJANG',
];
