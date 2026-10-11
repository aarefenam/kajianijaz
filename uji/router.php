<?php
/* ============================================================
   Perute untuk server bawaan PHP — HANYA untuk mencoba setempat.
   ------------------------------------------------------------
   `php -S` tidak membaca .htaccess, jadi alamat tanpa .html tidak akan
   terbuka. Berkas ini menirukan dua aturan bagian 7 .htaccess:

     /tentang.html  ->  301 ke /tentang
     /tentang       ->  isi tentang.html

   Jalankan dari akar proyek:
     php -S 127.0.0.1:8137 uji/router.php

   Di server sungguhan berkas ini tidak dipakai (folder uji/ ditutup).
   ============================================================ */
$akar = dirname(__DIR__);
$jalur = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$kueri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
$ekor = $kueri !== null && $kueri !== '' ? '?' . $kueri : '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && !preg_match('#^/(api|berkas|uji)#', $jalur)
    && preg_match('#^/(.+)\.html$#i', $jalur, $m)) {
  header('Location: ' . ($m[1] === 'index' ? '/' : '/' . $m[1]) . $ekor, true, 301);
  return true;
}
if (is_file($akar . $jalur)) return false;                  // berkas nyata: biarkan server melayaninya
if ($jalur === '/' || $jalur === '') { readfile($akar . '/index.html'); return true; }
if (!preg_match('#^/(api|berkas)/#', $jalur) && is_file($akar . $jalur . '.html')) {
  header('Content-Type: text/html; charset=utf-8');
  readfile($akar . $jalur . '.html');
  return true;
}
http_response_code(404);
echo 'Tidak ditemukan.';
return true;
