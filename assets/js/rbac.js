/* ============================================================
   RBAC — Role Based Access Control
   Kajian Al-I'jaz ERP
   ------------------------------------------------------------
   Sumber kebenaran tunggal untuk "siapa boleh apa".
   Dipakai oleh erp.js untuk: menyusun menu, mengunci tombol,
   dan memvalidasi setiap aksi sebelum menyentuh store.
   ============================================================ */

const PERMISSIONS = {
  // --- CMS / Website -------------------------------------------------
  'cms.page.edit'      : 'Mengubah teks & konten section halaman (masuk draft)',
  'cms.theme.edit'     : 'Mengubah warna, font, dan tema visual (masuk draft)',
  'cms.media.upload'   : 'Mengunggah / mengganti foto & aset gambar',
  'cms.section.toggle' : 'Menyalakan / mematikan & mengurutkan section',
  'cms.submit'         : 'Mengajukan draft perubahan untuk ditinjau',
  'cms.approve'        : 'Menyetujui / menolak draft agar tayang (publish)',
  'cms.rollback'       : 'Mengembalikan website ke versi sebelumnya',

  // --- Karya Tulis Ilmiah / Artikel ----------------------------------
  'artikel.write'      : 'Menulis & mengirim draft artikel',
  'artikel.review'     : 'Meninjau, meminta revisi, menyetujui artikel',
  'artikel.publish'    : 'Menerbitkan artikel ke halaman publik',
  'artikel.assign'     : 'Menugaskan penulis & menentukan tema',
  'redaksi.manage'     : 'Ruang kerja redaksi: target, penugasan, dan rekap artikel',
  'cms.kategori.edit'  : 'Mengubah daftar kategori artikel (masuk draft)',

  // --- Media & Website -------------------------------------------------
  'mediaweb.manage'    : 'Ruang kerja media & website: konten, agenda, galeri, desain, video',
  'analitik.view'      : 'Melihat statistik kunjungan & performa website',
  'seo.manage'         : 'Mengatur SEO, kata kunci, dan metadata halaman',
  'artikel.view'       : 'Menelusuri naskah artikel tanpa menyuntingnya',
  'user.view'          : 'Melihat daftar akun & perannya tanpa mengubahnya',

  // --- Penerbitan Buku -------------------------------------------------
  'buku.manage'        : 'Ruang kerja buku: perencanaan, tugas, produksi, distribusi',
  'buku.anggaran'      : 'Menyusun kasaran modal & anggaran penerbitan',
  'buku.arsip'         : 'Mengelola dokumen & arsip proyek buku',

  // --- Operasional Kajian --------------------------------------------
  'kajian.manage'      : 'Membuat & mengatur jadwal kajian, silabus, pemakalah',
  'kajian.attendance'  : 'Mengisi & mengunci absensi peserta',
  'kajian.notulensi'   : 'Menulis notulensi / risalah kajian',

  'koordinator.manage' : 'Ruang kerja koordinator: jadwal, presensi, tugas, materi kajian',
  'kajian.materi'      : 'Mengunggah materi, PPT, dan catatan revisi kajian',
  'anggota.kelompok'   : 'Mengatur jenjang, kelompok, dan keaktifan anggota angkatannya',

  // --- Kepengurusan Organisasi ----------------------------------------
  'organisasi.manage'  : 'Mengelola pengurus, koordinator, kaleidoskop, pencapaian, evaluasi',
  'organisasi.report'  : 'Melihat laporan & ringkasan organisasi',

  // --- Keanggotaan & Sekretariat --------------------------------------
  'anggota.manage'     : 'Menambah, mengubah, menonaktifkan data anggota',
  'surat.manage'       : 'Mengelola surat internal, eksternal, keputusan, masuk & keluar',
  'pesan.read'         : 'Membaca pesan masuk dari form kontak',
  'sekretariat.manage' : 'Ruang kerja sekretariat: persuratan, dokumen, keanggotaan',
  'sertifikat.manage'  : 'Mengelola sertifikat anggota, pemateri, dan kegiatan',
  'ttd.manage'         : 'Mengelola kumpulan tanda tangan divisi kepengurusan',
  'arsip.view'         : 'Menelusuri arsip kepenulisan & dokumentasi kajian',

  // --- Keuangan --------------------------------------------------------
  'keuangan.manage'    : 'Mencatat kas masuk/keluar & iuran',
  'keuangan.report'    : 'Melihat laporan & rekapitulasi keuangan',

  'bendahara.manage'   : 'Ruang kerja bendahara: pemasukan, pengeluaran, saldo, laporan',
  'keuangan.akun'      : 'Mengelola kategori transaksi & tempat penyimpanan uang',

  // --- Sistem -----------------------------------------------------------
  'user.manage'        : 'Mengelola akun & menetapkan role',
  'audit.view'         : 'Melihat log aktivitas seluruh sistem',
};

/* ------------------------------------------------------------------
   Matriks Role
   Catatan desain penting:
   PJ Website punya SEMUA izin mengubah tampilan, tetapi TIDAK punya
   'cms.approve'. Ketua Umum yang memegang kunci publish.
   Ini "two-man rule": tidak ada satu orang pun yang bisa mengubah
   wajah website publik sendirian.
   ------------------------------------------------------------------ */
const ROLES = {
  ketua: {
    label: 'Ketua Umum',
    badge: 'BPH',
    warna: '#8CC63F',
    ringkas: 'Penanggung jawab tertinggi. Pemegang kunci publish & approval.',
    permissions: [
      'cms.page.edit', 'cms.theme.edit', 'cms.media.upload', 'cms.section.toggle',
      'cms.submit', 'cms.approve', 'cms.rollback', 'cms.kategori.edit',
      'artikel.review', 'artikel.publish', 'artikel.assign',
      'kajian.manage', 'kajian.attendance', 'kajian.notulensi',
      'organisasi.manage', 'organisasi.report',
      'anggota.manage', 'surat.manage', 'pesan.read',
      'keuangan.report',
      'user.manage', 'audit.view',
    ],
  },

  sekretaris: {
    label: 'Sekretaris Umum',
    badge: 'BPH',
    warna: '#4FA3D1',
    ringkas: 'Persuratan, dokumen, keanggotaan, dan arsip organisasi.',
    permissions: [
      'cms.page.edit', 'cms.submit',
      'kajian.notulensi', 'kajian.attendance',
      'sekretariat.manage', 'sertifikat.manage', 'ttd.manage', 'arsip.view',
      'anggota.manage', 'surat.manage', 'pesan.read',
      'audit.view',
    ],
  },

  bendahara: {
    label: 'Bendahara',
    badge: 'BPH',
    warna: '#E8A33D',
    ringkas: 'Pemasukan, pengeluaran, saldo, dan laporan keuangan.',
    permissions: [
      'keuangan.manage', 'keuangan.report',
      'bendahara.manage', 'keuangan.akun',
    ],
  },

  /* PJ Website dan PJ Media dulu dua peran terpisah, kini melebur.
     Kunci lamanya dipetakan ke sini saat memuat DB tersimpan, sehingga
     akun yang sudah ada tidak kehilangan ruang kerjanya. */
  pj_mediaweb: {
    label: 'PJ Media & Website',
    badge: 'Divisi',
    warna: '#7C5CD6',
    ringkas: 'Konten, media, agenda, dan performa website. Publish tetap butuh Ketua.',
    permissions: [
      'cms.page.edit', 'cms.theme.edit', 'cms.media.upload',
      'cms.section.toggle', 'cms.submit',
      'mediaweb.manage', 'analitik.view', 'seo.manage',
      /* Jendela baca-saja: naskah tetap milik PJ Artikel, akun tetap
         milik Ketua. Melihat boleh, mengubah tidak. */
      'artikel.view', 'user.view',
      'pesan.read',
    ],
  },

  pj_kti: {
    label: 'PJ Artikel',
    badge: 'Divisi',
    warna: '#2FA98C',
    ringkas: 'Target penulisan, penugasan, tinjauan, dan penerbitan artikel.',
    permissions: [
      'artikel.write', 'artikel.review', 'artikel.publish', 'artikel.assign',
      'redaksi.manage',
      /* Kategori artikel hidup di CMS halaman Artikel dan dibaca halaman
         publik dari versi TAYANG. PJ Artikel boleh menyuntingnya, tetapi
         hanya ke draft — penayangannya tetap menunggu Ketua. */
      'cms.kategori.edit', 'cms.submit',
    ],
  },

  pj_buku: {
    label: 'PJ Buku',
    badge: 'Divisi',
    warna: '#8B6F47',
    ringkas: 'Proyek penerbitan buku, dari perencanaan hingga distribusi.',
    permissions: [
      'buku.manage', 'buku.anggaran', 'buku.arsip',
    ],
  },

  pj_kajian: {
    label: 'PJ Koordinator Kajian',
    badge: 'Divisi',
    warna: '#C77A2B',
    ringkas: 'Jadwal, presensi, pembagian tugas, materi, dan rekap kajian.',
    permissions: [
      'kajian.manage', 'kajian.attendance', 'kajian.notulensi',
      'koordinator.manage', 'kajian.materi',
      /* Terbatas pada angkatan yang sedang aktif, dan hanya kolom yang
         memang urusannya — menambah akun tetap milik Sekretaris. */
      'anggota.kelompok',
      'artikel.assign',
    ],
  },

  anggota: {
    label: 'Anggota',
    badge: 'Anggota',
    warna: '#7A8B7F',
    ringkas: 'Menulis makalah/artikel dan melihat jadwal kajiannya sendiri.',
    permissions: [
      'artikel.write',
    ],
  },
};

/* Peran yang sudah dipensiunkan tetap dikenali. DB tersimpan, isi CMS,
   dan catatan audit lama masih menyebut kunci lamanya; tanpa peta ini
   mereka akan kehilangan wewenang dan tampil sebagai kunci mentah. */
const ROLE_LAMA = { pj_website: 'pj_mediaweb', pj_media: 'pj_mediaweb' };
const kunciRole = (k) => (ROLES[k] ? k : ROLE_LAMA[k] || k);

/* ---------------------- API ---------------------- */

/* ------------------------------------------------------------
   Izin yang menjaga tiap koleksi — salinan dari api/rbac.php.

   Di server, daftar ini yang MENOLAK permintaan. Di sini gunanya lain:
   supaya peramban tidak pernah mengirim koleksi yang sudah pasti
   ditolak. Itu penting karena api/simpan.php menolak SELURUH kiriman
   bila satu saja koleksinya tak berwenang — jadi satu koleksi yang
   terbawa tanpa sengaja, misalnya hasil migrasi bentuk yang berjalan
   saat siapa pun masuk, akan ikut menjatuhkan simpanan orang itu.

   Yang menegakkan wewenang tetap server; ini hanya sopan santun.
   uji/rbac-setara.php gagal bila kedua salinan berbeda.
   ------------------------------------------------------------ */
const IZIN_KOLEKSI = {
  cms             : ['cms.approve', 'cms.rollback'],
  cmsDraft        : ['cms.page.edit', 'cms.theme.edit', 'cms.media.upload',
                     'cms.section.toggle', 'cms.kategori.edit'],
  versi           : ['cms.approve', 'cms.rollback'],
  pengajuan       : ['cms.submit', 'cms.approve'],
  users           : ['anggota.manage', 'user.manage', 'anggota.kelompok'],
  artikel         : ['artikel.write', 'artikel.review', 'artikel.publish'],
  kajian          : ['kajian.manage', 'kajian.attendance', 'kajian.notulensi', 'kajian.materi'],
  keuangan        : ['keuangan.manage'],
  akunKas         : ['keuangan.akun'],
  kategoriKeuangan: ['keuangan.akun'],
  pesan           : ['pesan.read'],
  surat           : ['surat.manage'],
  sertifikat      : ['sertifikat.manage'],
  tandaTangan     : ['ttd.manage'],
  pengurus        : ['organisasi.manage'],
  koordinator     : ['organisasi.manage'],
  kaleidoskop     : ['organisasi.manage'],
  pencapaian      : ['organisasi.manage'],
  evaluasi        : ['organisasi.manage'],
  penugasan       : ['redaksi.manage'],
  redaksi         : ['redaksi.manage'],
  buku            : ['buku.manage', 'buku.anggaran', 'buku.arsip'],
  event           : ['mediaweb.manage'],
  sosmed          : ['mediaweb.manage'],
  video           : ['mediaweb.manage'],
  media           : ['mediaweb.manage'],
  desain          : ['mediaweb.manage'],
  tugas           : ['mediaweb.manage'],
  seo             : ['seo.manage'],

  /* Tiap aksi mencatat jejaknya, jadi koleksi ini terbuka bagi siapa
     pun yang sudah masuk — tetapi hanya untuk menambah. */
  audit           : ['*'],

  /* Ditulis pengunjung yang belum masuk, lewat endpoint tersendiri
     yang hanya bisa menambah — bukan lewat simpan.php. */
  kunjungan       : [],
  langganan       : [],
};

/**
 * Bolehkah pengguna ini menulis koleksi tersebut?
 *
 * `users` punya kekecualian yang perlu: tiap orang berhak menyunting
 * akunnya sendiri lewat Pengaturan Akun tanpa memegang izin mengelola
 * anggota. Server memeriksa bahwa yang berubah memang hanya barisnya
 * sendiri; di sini cukup dibiarkan lewat.
 */
function bolehTulisKoleksi(user, koleksi) {
  const izin = IZIN_KOLEKSI[koleksi];
  if (izin === undefined) return false;      // koleksi tak dikenal server
  if (izin.length === 0) return false;       // hanya lewat endpoint sendiri
  if (izin[0] === '*') return !!user;
  if (koleksi === 'users') return !!user;    // diperiksa lebih teliti di server
  return canAny(user, izin);
}

function can(user, permission) {
  if (!user) return false;
  const role = ROLES[kunciRole(user.role)];
  if (!role) return false;
  return role.permissions.includes(permission);
}

/** Minimal satu dari daftar izin. */
function canAny(user, permissions) {
  return permissions.some((p) => can(user, p));
}

function roleLabel(roleKey) {
  return ROLES[kunciRole(roleKey)]?.label || roleKey;
}

function roleColor(roleKey) {
  return ROLES[kunciRole(roleKey)]?.warna || '#7A8B7F';
}

/** Dipakai untuk melempar error yang seragam saat aksi ditolak. */
function assertCan(user, permission) {
  if (!can(user, permission)) {
    throw new Error(
      `Akses ditolak. Role "${roleLabel(user?.role)}" tidak memiliki izin: ${permission}`
    );
  }
  return true;
}

window.RBAC = { PERMISSIONS, ROLES, ROLE_LAMA, IZIN_KOLEKSI, kunciRole, can, canAny,
                bolehTulisKoleksi, roleLabel, roleColor, assertCan };
