<?php
/* Masuk: email + kata sandi → sesi. Satu-satunya tempat kata sandi
   diperiksa, dan pemeriksaannya di server — bukan di peramban. */
declare(strict_types=1);
require_once __DIR__ . '/inti.php';
wajibPost();

$d = bacaJson();
$email = strtolower(trim((string) ($d['email'] ?? '')));
$sandi = (string) ($d['password'] ?? '');
if ($email === '' || $sandi === '') galat('Email dan kata sandi wajib diisi.');

$ketemu = null;
foreach (bacaKoleksi('users')['isi'] ?? [] as $u) {
  if (strtolower($u['email'] ?? '') === $email) { $ketemu = $u; break; }
}

/* Jawaban yang sama untuk email tak dikenal maupun sandi keliru, supaya
   tak ada yang bisa menebak-nebak alamat surel mana yang terdaftar. */
if (!$ketemu || !password_verify($sandi, $ketemu['password'] ?? '')) {
  usleep(random_int(120000, 320000));
  galat('Email atau kata sandi tidak sesuai.', 401);
}
if (($ketemu['status'] ?? '') === 'nonaktif') {
  galat('Akun Anda dinonaktifkan. Hubungi Sekretaris.', 403);
}

mulaiSesi();
session_regenerate_id(true);
$_SESSION['userId'] = $ketemu['id'];

jawab([
  'pengguna'  => bersihkanPengguna($ketemu),
  'sandiAwal' => (int) ($ketemu['sandiAwal'] ?? 0) === 1,
]);
