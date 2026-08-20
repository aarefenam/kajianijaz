<?php
/* Daftar versi tiap koleksi — dijajaki berkala untuk mengendus
   perubahan dari pengguna lain tanpa mengunduh seluruh data. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
jawab(['versi' => bacaVersi()]);
