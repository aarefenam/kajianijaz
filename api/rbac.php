<?php
/* ============================================================
   RBAC sisi server
   ------------------------------------------------------------
   Salinan matriks wewenang dari assets/js/rbac.js.

   Kenapa disalin, bukan dibaca dari sana? Karena keduanya berjalan
   di dunia yang berbeda: yang di JavaScript menyusun menu dan
   mengunci tombol, yang di sini menolak permintaan. Yang menegakkan
   wewenang sesungguhnya adalah berkas INI — yang di peramban hanya
   sopan santun antarmuka, dan siapa pun dapat melewatinya dengan
   memanggil API langsung.

   Supaya kedua salinan tidak menyimpang diam-diam, ada pemeriksaan
   kesetaraan di uji/rbac-setara.php yang gagal bila berbeda.
   ============================================================ */

const ROLES = [
  'ketua' => [
    'cms.page.edit', 'cms.theme.edit', 'cms.media.upload', 'cms.section.toggle',
    'cms.submit', 'cms.approve', 'cms.rollback', 'cms.kategori.edit',
    'artikel.review', 'artikel.publish', 'artikel.assign',
    'kajian.manage', 'kajian.attendance', 'kajian.notulensi',
    'organisasi.manage', 'organisasi.report',
    'anggota.manage', 'surat.manage', 'pesan.read',
    'keuangan.report',
    'user.manage', 'audit.view',
  ],
  'sekretaris' => [
    'cms.page.edit', 'cms.submit',
    'kajian.notulensi', 'kajian.attendance',
    'sekretariat.manage', 'sertifikat.manage', 'ttd.manage', 'arsip.view',
    'anggota.manage', 'surat.manage', 'pesan.read',
    'audit.view',
  ],
  'bendahara' => [
    'keuangan.manage', 'keuangan.report',
    'bendahara.manage', 'keuangan.akun',
  ],
  'pj_mediaweb' => [
    'cms.page.edit', 'cms.theme.edit', 'cms.media.upload',
    'cms.section.toggle', 'cms.submit',
    'mediaweb.manage', 'analitik.view', 'seo.manage',
    'artikel.view', 'user.view',
    'pesan.read',
  ],
  'pj_kti' => [
    'artikel.write', 'artikel.review', 'artikel.publish', 'artikel.assign',
    'redaksi.manage',
    'cms.kategori.edit', 'cms.submit',
  ],
  'pj_buku' => [
    'buku.manage', 'buku.anggaran', 'buku.arsip',
  ],
  'pj_kajian' => [
    'kajian.manage', 'kajian.attendance', 'kajian.notulensi',
    'koordinator.manage', 'kajian.materi',
    'anggota.kelompok',
    'artikel.assign',
  ],
  'anggota' => [
    'artikel.write',
  ],
];

/* Peran yang sudah dipensiunkan tetap dikenali — sama seperti di rbac.js. */
const ROLE_LAMA = ['pj_website' => 'pj_mediaweb', 'pj_media' => 'pj_mediaweb'];

function kunciRole(?string $k): string {
  if ($k !== null && isset(ROLES[$k])) return $k;
  return ROLE_LAMA[$k] ?? (string) $k;
}

function bolehkah(?array $user, string $izin): bool {
  if (!$user) return false;
  $peran = ROLES[kunciRole($user['role'] ?? '')] ?? null;
  return $peran !== null && in_array($izin, $peran, true);
}

function bolehSalahSatu(?array $user, array $daftar): bool {
  foreach ($daftar as $izin) if (bolehkah($user, $izin)) return true;
  return false;
}

/* ------------------------------------------------------------
   Izin yang menjaga tiap koleksi. Nilainya daftar — cukup punya
   salah satunya. Beberapa koleksi disentuh lebih dari satu peran:
   `kajian`, misalnya, ditulis PJ Koordinator saat menjadwalkan dan
   Sekretaris saat menulis notulensi.
   ------------------------------------------------------------ */
const IZIN_KOLEKSI = [
  'cms'              => ['cms.approve', 'cms.rollback'],
  'cmsDraft'         => ['cms.page.edit', 'cms.theme.edit', 'cms.media.upload',
                         'cms.section.toggle', 'cms.kategori.edit'],
  'versi'            => ['cms.approve', 'cms.rollback'],
  'pengajuan'        => ['cms.submit', 'cms.approve'],
  'users'            => ['anggota.manage', 'user.manage', 'anggota.kelompok'],
  'artikel'          => ['artikel.write', 'artikel.review', 'artikel.publish'],
  'kajian'           => ['kajian.manage', 'kajian.attendance', 'kajian.notulensi', 'kajian.materi'],
  'keuangan'         => ['keuangan.manage'],
  'akunKas'          => ['keuangan.akun'],
  'kategoriKeuangan' => ['keuangan.akun'],
  'pesan'            => ['pesan.read'],
  'surat'            => ['surat.manage'],
  'sertifikat'       => ['sertifikat.manage'],
  'tandaTangan'      => ['ttd.manage'],
  'pengurus'         => ['organisasi.manage'],
  'koordinator'      => ['organisasi.manage'],
  'kaleidoskop'      => ['organisasi.manage'],
  'pencapaian'       => ['organisasi.manage'],
  'evaluasi'         => ['organisasi.manage'],
  'penugasan'        => ['redaksi.manage'],
  'redaksi'          => ['redaksi.manage'],
  'buku'             => ['buku.manage', 'buku.anggaran', 'buku.arsip'],
  'event'            => ['mediaweb.manage'],
  'sosmed'           => ['mediaweb.manage'],
  'video'            => ['mediaweb.manage'],
  'media'            => ['mediaweb.manage'],
  'desain'           => ['mediaweb.manage'],
  'tugas'            => ['mediaweb.manage'],
  'seo'              => ['seo.manage'],

  /* Tiap aksi mencatat jejaknya, jadi koleksi ini terbuka bagi
     siapa pun yang sudah masuk — tetapi hanya untuk menambah. */
  'audit'            => ['*'],

  /* Ditulis pengunjung yang belum masuk, lewat endpoint tersendiri
     yang hanya bisa menambah — bukan lewat simpan.php. */
  'kunjungan'        => [],
  'langganan'        => [],
];

/** Seluruh nama koleksi yang dikenal. */
function daftarKoleksi(): array {
  return array_keys(IZIN_KOLEKSI);
}
