<?php
/* Pendaftaran newsletter dari halaman publik. Seperti kunjung.php dan
   pesan.php: terbuka tanpa masuk, tetapi hanya dapat MENAMBAH satu
   alamat — bukan menulis koleksi sesuka hati. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();

$d = bacaJson();
$email = strtolower(trim((string) ($d['email'] ?? '')));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) galat('Alamat email tidak sah.');
if (strlen($email) > 120) galat('Alamat email terlalu panjang.');

$k = bacaKoleksi('langganan');
$isi = is_array($k['isi']) ? $k['isi'] : [];

/* Sudah terdaftar bukan galat — jawabannya jujur saja, dan halaman
   publik menyampaikannya apa adanya. */
if (in_array($email, $isi, true)) jawab(['baru' => false]);

if (count($isi) >= 5000) galat('Daftar langganan penuh.', 507);
$isi[] = $email;
tulisKoleksi('langganan', $isi, null);
jawab(['baru' => true]);
