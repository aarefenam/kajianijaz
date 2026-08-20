<?php
/* Pemeriksaan kemampuan server — sementara, dibuang setelah terjawab.
   Sengaja tidak memuat versi rinci apa pun yang tak perlu diketahui publik. */
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
  'php'      => PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION,
  'pdo_mysql'=> extension_loaded('pdo_mysql'),
  'json'     => extension_loaded('json'),
  'mbstring' => extension_loaded('mbstring'),
  'tulis'    => is_writable(__DIR__ . '/..'),
], JSON_PRETTY_PRINT);
