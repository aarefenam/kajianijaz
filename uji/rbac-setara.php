<?php
/* ============================================================
   Apakah dua salinan matriks wewenang masih sama?
   ------------------------------------------------------------
   api/rbac.php menolak permintaan; assets/js/rbac.js menyusun menu.
   Keduanya harus mengatakan hal yang sama. Bila menyimpang, yang
   terjadi bukan galat yang kentara melainkan sesuatu yang jauh lebih
   buruk: menu yang tampil tetapi aksinya ditolak, atau — lebih parah —
   tombol yang tersembunyi padahal servernya mengizinkan.

   Jalankan:  php uji/rbac-setara.php
   ============================================================ */
declare(strict_types=1);
require_once __DIR__ . '/../api/rbac.php';

$js = file_get_contents(__DIR__ . '/../assets/js/rbac.js');
if ($js === false) { fwrite(STDERR, "rbac.js tidak terbaca.\n"); exit(2); }

/** Baca literal objek ROLES / ROLE_LAMA dari rbac.js apa adanya. */
function petikBlok(string $js, string $nama): string {
  $i = strpos($js, "const $nama");
  if ($i === false) { fwrite(STDERR, "$nama tidak ditemukan di rbac.js\n"); exit(2); }
  $i = strpos($js, '{', $i);
  $dalam = 0;
  for ($j = $i; $j < strlen($js); $j++) {
    if ($js[$j] === '{') $dalam++;
    elseif ($js[$j] === '}') { $dalam--; if ($dalam === 0) return substr($js, $i, $j - $i + 1); }
  }
  fwrite(STDERR, "Kurung $nama tidak tertutup\n"); exit(2);
}

/* Komentar dibuang lebih dulu — di dalamnya ada tanda kutip yang akan
   ditangkap pemindai sebagai izin palsu. */
function tanpaKomentar(string $t): string {
  $t = preg_replace('#/\*.*?\*/#s', '', $t);
  return preg_replace('#//[^\n]*#', '', $t);
}

/* Tiap peran di rbac.js adalah objek — label, warna, ringkasan, lalu
   `permissions`. Yang dibandingkan hanya `permissions`; label dan warna
   memang urusan tampilan saja dan tidak punya padanan di server. */
function bacaRolesJs(string $blok): array {
  $blok = tanpaKomentar($blok);
  $hasil = [];
  $n = strlen($blok);
  for ($i = 1; $i < $n; $i++) {                       // lewati '{' pembuka
    if (!preg_match('/\G\s*([a-z_]+)\s*:\s*\{/', $blok, $c, 0, $i)) continue;
    $peran = $c[1];
    $awal = strpos($blok, '{', $i + strlen($c[0]) - 1);
    $dalam = 0; $akhir = $awal;
    for ($j = $awal; $j < $n; $j++) {
      if ($blok[$j] === '{') $dalam++;
      elseif ($blok[$j] === '}') { $dalam--; if ($dalam === 0) { $akhir = $j; break; } }
    }
    $isi = substr($blok, $awal, $akhir - $awal + 1);
    if (preg_match('/permissions\s*:\s*\[(.*?)\]/s', $isi, $m)) {
      preg_match_all("/'([^']+)'/", $m[1], $izin);
      $hasil[$peran] = $izin[1];
    } else {
      $hasil[$peran] = [];
    }
    $i = $akhir;
  }
  return $hasil;
}

function bacaRoleLamaJs(string $blok): array {
  $blok = tanpaKomentar($blok);
  preg_match_all("/([a-z_]+)\s*:\s*'([^']+)'/", $blok, $c, PREG_SET_ORDER);
  $hasil = [];
  foreach ($c as $x) $hasil[$x[1]] = $x[2];
  return $hasil;
}

$rolesJs = bacaRolesJs(petikBlok($js, 'ROLES'));
$lamaJs  = bacaRoleLamaJs(petikBlok($js, 'ROLE_LAMA'));

$masalah = [];

/* ---------- peran ---------- */
$hanyaPhp = array_diff(array_keys(ROLES), array_keys($rolesJs));
$hanyaJs  = array_diff(array_keys($rolesJs), array_keys(ROLES));
foreach ($hanyaPhp as $r) $masalah[] = "Peran '$r' ada di rbac.php tetapi tidak di rbac.js";
foreach ($hanyaJs as $r)  $masalah[] = "Peran '$r' ada di rbac.js tetapi tidak di rbac.php";

/* ---------- izin tiap peran ---------- */
foreach (ROLES as $peran => $izinPhp) {
  if (!isset($rolesJs[$peran])) continue;
  $izinJs = $rolesJs[$peran];
  foreach (array_diff($izinPhp, $izinJs) as $i) $masalah[] = "[$peran] '$i' hanya di rbac.php";
  foreach (array_diff($izinJs, $izinPhp) as $i) $masalah[] = "[$peran] '$i' hanya di rbac.js";
}

/* ---------- peran yang dipensiunkan ---------- */
if ($lamaJs != ROLE_LAMA) $masalah[] = 'ROLE_LAMA berbeda antara rbac.js dan rbac.php';

/* ---------- tiap izin yang dijaga benar-benar ada ---------- */
$semuaIzin = array_unique(array_merge(...array_values(ROLES)));
foreach (IZIN_KOLEKSI as $koleksi => $daftar) {
  foreach ($daftar as $i) {
    if ($i === '*') continue;
    if (!in_array($i, $semuaIzin, true)) {
      $masalah[] = "IZIN_KOLEKSI['$koleksi'] menunjuk izin '$i' yang tidak dimiliki peran mana pun";
    }
  }
}

$jml = count(ROLES);
$jmlIzin = count($semuaIzin);
if ($masalah) {
  echo "GAGAL — matriks wewenang menyimpang:\n";
  foreach ($masalah as $m) echo "  · $m\n";
  exit(1);
}
echo "LULUS — $jml peran, $jmlIzin izin, " . count(IZIN_KOLEKSI) . " koleksi terjaga; rbac.php = rbac.js\n";
