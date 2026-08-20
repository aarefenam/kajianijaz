<?php
/* Siapa yang sedang masuk. Dipanggil sekali saat ERP dimuat. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
$u = penggunaAktif();
jawab($u
  ? ['pengguna' => bersihkanPengguna($u), 'sandiAwal' => (int) ($u['sandiAwal'] ?? 0) === 1]
  : ['pengguna' => null]);
