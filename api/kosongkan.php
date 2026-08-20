<?php
/* Kosongkan seluruh database. Hanya Ketua Umum, dan hanya dengan
   kalimat penegasan yang diketik utuh — supaya tak pernah terjadi
   karena salah klik. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();
$u = wajibMasuk();
if (!bolehkah($u, 'user.manage')) galat('Hanya Ketua Umum yang dapat mengosongkan database.', 403);

$d = bacaJson();
if (($d['penegasan'] ?? '') !== 'KOSONGKAN SELURUH DATA') {
  galat('Kalimat penegasan tidak sesuai.', 400);
}
pdo()->exec('DELETE FROM koleksi');
mulaiSesi(); $_SESSION = []; session_destroy();
jawab(['dikosongkan' => true]);
