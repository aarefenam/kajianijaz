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

  // --- Operasional Kajian --------------------------------------------
  'kajian.manage'      : 'Membuat & mengatur jadwal kajian, silabus, pemakalah',
  'kajian.attendance'  : 'Mengisi & mengunci absensi peserta',
  'kajian.notulensi'   : 'Menulis notulensi / risalah kajian',

  // --- Keanggotaan & Sekretariat --------------------------------------
  'anggota.manage'     : 'Menambah, mengubah, menonaktifkan data anggota',
  'surat.manage'       : 'Mengelola surat masuk/keluar & arsip',
  'pesan.read'         : 'Membaca pesan masuk dari form kontak',

  // --- Keuangan --------------------------------------------------------
  'keuangan.manage'    : 'Mencatat kas masuk/keluar & iuran',
  'keuangan.report'    : 'Melihat laporan & rekapitulasi keuangan',

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
      'cms.submit', 'cms.approve', 'cms.rollback',
      'artikel.review', 'artikel.publish', 'artikel.assign',
      'kajian.manage', 'kajian.attendance', 'kajian.notulensi',
      'anggota.manage', 'surat.manage', 'pesan.read',
      'keuangan.report',
      'user.manage', 'audit.view',
    ],
  },

  sekretaris: {
    label: 'Sekretaris Umum',
    badge: 'BPH',
    warna: '#4FA3D1',
    ringkas: 'Administrasi, keanggotaan, notulensi, dan arsip surat.',
    permissions: [
      'cms.page.edit', 'cms.submit',
      'kajian.notulensi', 'kajian.attendance',
      'anggota.manage', 'surat.manage', 'pesan.read',
      'audit.view',
    ],
  },

  bendahara: {
    label: 'Bendahara',
    badge: 'BPH',
    warna: '#E8A33D',
    ringkas: 'Kas organisasi, iuran anggota, dan laporan keuangan.',
    permissions: [
      'keuangan.manage', 'keuangan.report',
    ],
  },

  pj_website: {
    label: 'PJ Website',
    badge: 'Divisi',
    warna: '#7C5CD6',
    ringkas: 'Mengubah foto, warna, dan teks CMS. Publish tetap butuh Ketua.',
    permissions: [
      'cms.page.edit', 'cms.theme.edit', 'cms.media.upload',
      'cms.section.toggle', 'cms.submit',
    ],
  },

  pj_media: {
    label: 'PJ Media',
    badge: 'Divisi',
    warna: '#D9536F',
    ringkas: 'Dokumentasi kegiatan, galeri, dan aset publikasi.',
    permissions: [
      'cms.media.upload', 'cms.page.edit', 'cms.submit',
      'pesan.read',
    ],
  },

  pj_kti: {
    label: 'PJ Karya Tulis Ilmiah',
    badge: 'Divisi',
    warna: '#2FA98C',
    ringkas: 'Koordinator penulis. Meninjau dan menerbitkan artikel.',
    permissions: [
      'artikel.write', 'artikel.review', 'artikel.publish', 'artikel.assign',
    ],
  },

  pj_kajian: {
    label: 'PJ Koordinator Kajian',
    badge: 'Divisi',
    warna: '#C77A2B',
    ringkas: 'Jadwal kajian, silabus berjenjang, pemakalah, dan absensi.',
    permissions: [
      'kajian.manage', 'kajian.attendance', 'kajian.notulensi',
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

/* ---------------------- API ---------------------- */

function can(user, permission) {
  if (!user) return false;
  const role = ROLES[user.role];
  if (!role) return false;
  return role.permissions.includes(permission);
}

/** Minimal satu dari daftar izin. */
function canAny(user, permissions) {
  return permissions.some((p) => can(user, p));
}

function roleLabel(roleKey) {
  return ROLES[roleKey]?.label || roleKey;
}

function roleColor(roleKey) {
  return ROLES[roleKey]?.warna || '#7A8B7F';
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

window.RBAC = { PERMISSIONS, ROLES, can, canAny, roleLabel, roleColor, assertCan };
