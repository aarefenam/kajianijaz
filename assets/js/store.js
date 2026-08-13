/* ============================================================
   STORE — Sumber data tunggal (localStorage)
   ------------------------------------------------------------
   KONSEP KUNCI — pemisahan DRAFT vs LIVE:

     db.cms       -> versi TAYANG. Hanya ini yang dibaca website publik.
     db.cmsDraft  -> ruang kerja PJ Website / PJ Media. Bebas diubah.
     db.pengajuan -> antrean draft yang menunggu persetujuan Ketua.
     db.versi     -> arsip snapshot setiap kali publish (untuk rollback).

   Tidak ada satu pun jalur yang menulis langsung ke db.cms selain
   approve() dan rollback(), dan keduanya menuntut izin 'cms.approve'
   / 'cms.rollback'. Inilah pengaman utama sistem.
   ============================================================ */

const DB_KEY = 'alijaz_db_v1';
const SESSION_KEY = 'alijaz_sesi_v1';

/* ---------- util ---------- */
const clone = (o) => JSON.parse(JSON.stringify(o));
const uid = (p = 'x') => p + Math.random().toString(36).slice(2, 9);
const nowISO = () => new Date().toISOString();

function bacaDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('DB rusak, memuat ulang dari seed.', e);
  }
  return null;
}

function dbAwal() {
  const s = window.SEED;
  const cms = { theme: clone(s.theme), situs: clone(s.situs), halaman: clone(s.halaman) };
  return {
    cms,                       // TAYANG
    cmsDraft: clone(cms),      // ruang kerja
    versi: [{
      id: uid('v'), ts: nowISO(), oleh: 'sistem', olehNama: 'Sistem',
      catatan: 'Rilis awal website', snapshot: clone(cms),
    }],
    pengajuan: [],
    users    : clone(s.users),
    artikel  : clone(s.artikel),
    kajian   : clone(s.kajian),
    keuangan : clone(s.keuangan),
    pesan    : clone(s.pesan),
    surat    : clone(s.surat),
    audit    : [],
    langganan: [],
  };
}

let db = bacaDB() || dbAwal();

/* ---------- persistensi + pub/sub ---------- */
const pendengar = new Set();

function simpan() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    alert('Penyimpanan penuh. Kecilkan ukuran gambar yang diunggah.\n\n' + e.message);
    throw e;
  }
  pendengar.forEach((fn) => { try { fn(db); } catch (_) {} });
  // Sinkron antar-tab: ERP di tab A, website publik di tab B.
  try { localStorage.setItem('alijaz_ping', String(Date.now())); } catch (_) {}
}

function berlangganan(fn) { pendengar.add(fn); return () => pendengar.delete(fn); }

// Perubahan dari tab lain -> muat ulang lalu beri tahu.
window.addEventListener('storage', (e) => {
  if (e.key === DB_KEY || e.key === 'alijaz_ping') {
    const baru = bacaDB();
    if (baru) { db = baru; pendengar.forEach((fn) => { try { fn(db); } catch (_) {} }); }
  }
});

/* ---------- sesi / autentikasi ---------- */
function login(email, password) {
  const u = db.users.find(
    (x) => x.email.toLowerCase() === String(email).toLowerCase().trim() && x.password === password
  );
  if (!u) throw new Error('Email atau kata sandi tidak sesuai.');
  if (u.status === 'nonaktif') throw new Error('Akun Anda dinonaktifkan. Hubungi Sekretaris.');
  sessionStorage.setItem(SESSION_KEY, u.id);
  catat(u, 'login', 'sesi', `${u.nama} masuk ke ERP`);
  return u;
}

function logout() {
  const u = userAktif();
  if (u) catat(u, 'logout', 'sesi', `${u.nama} keluar dari ERP`);
  sessionStorage.removeItem(SESSION_KEY);
}

function userAktif() {
  const id = sessionStorage.getItem(SESSION_KEY);
  return db.users.find((u) => u.id === id) || null;
}

/* ---------- audit log ---------- */
function catat(user, aksi, target, detail) {
  db.audit.unshift({
    id: uid('log'), ts: nowISO(),
    userId: user?.id || '-', userNama: user?.nama || 'Sistem',
    role: user?.role || 'sistem', aksi, target, detail,
  });
  if (db.audit.length > 400) db.audit.length = 400;
}

/* ============================================================
   CMS — operasi pada DRAFT
   ============================================================ */

/** Ubah nilai di draft memakai path bertitik, mis. "halaman.beranda.sections.0.data.judul" */
function ubahDraft(user, path, nilai, izin = 'cms.page.edit') {
  RBAC.assertCan(user, izin);
  const bagian = path.split('.');
  let node = db.cmsDraft;
  for (let i = 0; i < bagian.length - 1; i++) {
    if (node[bagian[i]] === undefined) throw new Error('Path tidak ditemukan: ' + path);
    node = node[bagian[i]];
  }
  const kunci = bagian[bagian.length - 1];
  const lama = node[kunci];
  if (JSON.stringify(lama) === JSON.stringify(nilai)) return false; // tidak ada perubahan
  node[kunci] = nilai;
  simpan();
  return true;
}

function toggleSection(user, halaman, index, aktif) {
  RBAC.assertCan(user, 'cms.section.toggle');
  db.cmsDraft.halaman[halaman].sections[index].aktif = aktif;
  catat(user, 'cms.toggle', halaman, `Section "${db.cmsDraft.halaman[halaman].sections[index].nama}" -> ${aktif ? 'tampil' : 'disembunyikan'}`);
  simpan();
}

function geserSection(user, halaman, index, arah) {
  RBAC.assertCan(user, 'cms.section.toggle');
  const arr = db.cmsDraft.halaman[halaman].sections;
  const tujuan = index + arah;
  if (tujuan < 0 || tujuan >= arr.length) return;
  [arr[index], arr[tujuan]] = [arr[tujuan], arr[index]];
  catat(user, 'cms.urutkan', halaman, `Urutan section diubah pada halaman ${halaman}`);
  simpan();
}

function resetDraft(user) {
  RBAC.assertCan(user, 'cms.page.edit');
  db.cmsDraft = clone(db.cms);
  catat(user, 'cms.reset', 'draft', 'Draft dikembalikan menyamai versi tayang');
  simpan();
}

/* ---------- diff draft vs live ---------- */
function ringkasPerubahan() {
  const hasil = [];
  const jelajah = (a, b, path) => {
    if (hasil.length > 80) return;
    const tipeA = Object.prototype.toString.call(a);
    const tipeB = Object.prototype.toString.call(b);
    if (tipeA !== tipeB) { hasil.push({ path, dari: a, ke: b }); return; }
    if (tipeB === '[object Object]') {
      new Set([...Object.keys(a || {}), ...Object.keys(b || {})]).forEach((k) =>
        jelajah(a?.[k], b?.[k], path ? path + '.' + k : k));
    } else if (tipeB === '[object Array]') {
      if (a.length !== b.length) { hasil.push({ path, dari: `${a.length} item`, ke: `${b.length} item` }); return; }
      b.forEach((_, i) => jelajah(a[i], b[i], `${path}.${i}`));
    } else if (a !== b) {
      hasil.push({ path, dari: a, ke: b });
    }
  };
  jelajah(db.cms, db.cmsDraft, '');
  return hasil;
}

function adaPerubahan() { return ringkasPerubahan().length > 0; }

/* ---------- alur persetujuan ---------- */
function ajukan(user, catatanPengaju) {
  RBAC.assertCan(user, 'cms.submit');
  const perubahan = ringkasPerubahan();
  if (!perubahan.length) throw new Error('Tidak ada perubahan untuk diajukan.');
  if (db.pengajuan.some((p) => p.status === 'menunggu'))
    throw new Error('Masih ada pengajuan yang menunggu. Tunggu keputusan Ketua terlebih dahulu.');

  db.pengajuan.unshift({
    id: uid('req'), ts: nowISO(), olehId: user.id, olehNama: user.nama, olehRole: user.role,
    catatan: catatanPengaju || '(tanpa catatan)', status: 'menunggu',
    jumlahPerubahan: perubahan.length, ringkasan: perubahan.slice(0, 30),
    snapshot: clone(db.cmsDraft),
    reviewerId: '', reviewerNama: '', catatanReview: '', tsReview: '',
  });
  catat(user, 'cms.ajukan', 'pengajuan', `Mengajukan ${perubahan.length} perubahan untuk ditinjau`);
  simpan();
}

function setujui(user, idPengajuan, catatanReview) {
  RBAC.assertCan(user, 'cms.approve');
  const p = db.pengajuan.find((x) => x.id === idPengajuan);
  if (!p) throw new Error('Pengajuan tidak ditemukan.');
  if (p.status !== 'menunggu') throw new Error('Pengajuan ini sudah diproses.');
  if (p.olehId === user.id && db.users.filter(u => RBAC.can(u, 'cms.approve')).length > 1)
    throw new Error('Anda tidak dapat menyetujui pengajuan Anda sendiri.');

  // Arsipkan versi tayang saat ini SEBELUM ditimpa, agar rollback mungkin.
  db.versi.unshift({
    id: uid('v'), ts: nowISO(), oleh: p.olehId, olehNama: p.olehNama,
    catatan: p.catatan, disetujuiOleh: user.nama, snapshot: clone(p.snapshot),
  });
  if (db.versi.length > 25) db.versi.length = 25;

  db.cms = clone(p.snapshot);   // <-- SATU-SATUNYA titik tulis ke versi tayang
  db.cmsDraft = clone(p.snapshot);
  p.status = 'disetujui';
  p.reviewerId = user.id; p.reviewerNama = user.nama;
  p.catatanReview = catatanReview || ''; p.tsReview = nowISO();

  catat(user, 'cms.publish', 'website', `Menyetujui & menayangkan ${p.jumlahPerubahan} perubahan dari ${p.olehNama}`);
  simpan();
}

function tolak(user, idPengajuan, alasan) {
  RBAC.assertCan(user, 'cms.approve');
  const p = db.pengajuan.find((x) => x.id === idPengajuan);
  if (!p) throw new Error('Pengajuan tidak ditemukan.');
  if (p.status !== 'menunggu') throw new Error('Pengajuan ini sudah diproses.');
  if (!alasan || !alasan.trim()) throw new Error('Alasan penolakan wajib diisi.');

  p.status = 'ditolak';
  p.reviewerId = user.id; p.reviewerNama = user.nama;
  p.catatanReview = alasan; p.tsReview = nowISO();
  // Draft dibiarkan utuh supaya pengaju bisa memperbaiki, bukan mengulang dari nol.
  catat(user, 'cms.tolak', 'pengajuan', `Menolak pengajuan ${p.olehNama}: ${alasan}`);
  simpan();
}

function rollback(user, idVersi) {
  RBAC.assertCan(user, 'cms.rollback');
  const v = db.versi.find((x) => x.id === idVersi);
  if (!v) throw new Error('Versi tidak ditemukan.');
  db.versi.unshift({
    id: uid('v'), ts: nowISO(), oleh: user.id, olehNama: user.nama,
    catatan: `Rollback ke versi ${new Date(v.ts).toLocaleString('id-ID')}`,
    disetujuiOleh: user.nama, snapshot: clone(v.snapshot),
  });
  db.cms = clone(v.snapshot);
  db.cmsDraft = clone(v.snapshot);
  catat(user, 'cms.rollback', 'website', `Mengembalikan website ke versi ${v.id}`);
  simpan();
}

/* ============================================================
   ARTIKEL — alur: draft -> review -> terbit
   ============================================================ */
function simpanArtikel(user, data) {
  RBAC.assertCan(user, 'artikel.write');
  if (data.id) {
    const a = db.artikel.find((x) => x.id === data.id);
    if (!a) throw new Error('Artikel tidak ditemukan.');
    const pemilik = a.penulisId === user.id;
    if (!pemilik && !RBAC.can(user, 'artikel.review'))
      throw new Error('Anda hanya dapat menyunting artikel tulisan sendiri.');
    if (a.status === 'terbit' && !RBAC.can(user, 'artikel.publish'))
      throw new Error('Artikel sudah terbit. Minta PJ KTI untuk menariknya kembali ke draft.');
    Object.assign(a, data);
    catat(user, 'artikel.ubah', a.id, `Menyunting artikel "${a.judul}"`);
  } else {
    const baru = {
      id: uid('a'), status: 'draft', penulisId: user.id, dilihat: 0,
      tanggal: nowISO().slice(0, 10), reviewNote: '', reviewerId: '',
      cover: window.__ph('ARTIKEL BARU', '#1B5E20', '#0E2E1C', 'مقال'),
      tag: [], isi: [], ...data,
    };
    db.artikel.unshift(baru);
    catat(user, 'artikel.buat', baru.id, `Membuat artikel "${baru.judul}"`);
  }
  simpan();
}

function ubahStatusArtikel(user, id, status, catatanReview) {
  const a = db.artikel.find((x) => x.id === id);
  if (!a) throw new Error('Artikel tidak ditemukan.');

  if (status === 'review') {
    if (a.penulisId !== user.id && !RBAC.can(user, 'artikel.review'))
      throw new Error('Hanya penulis yang dapat mengirim artikelnya untuk ditinjau.');
  } else if (status === 'terbit') {
    RBAC.assertCan(user, 'artikel.publish');
  } else if (status === 'revisi') {
    RBAC.assertCan(user, 'artikel.review');
    if (!catatanReview?.trim()) throw new Error('Catatan revisi wajib diisi.');
  } else if (status === 'draft') {
    if (a.penulisId !== user.id) RBAC.assertCan(user, 'artikel.review');
  }

  a.status = status;
  if (catatanReview !== undefined) a.reviewNote = catatanReview;
  if (['terbit', 'revisi'].includes(status)) a.reviewerId = user.id;
  if (status === 'terbit') a.tanggal = nowISO().slice(0, 10);

  catat(user, 'artikel.status', id, `Artikel "${a.judul}" -> ${status}`);
  simpan();
}

function hapusArtikel(user, id) {
  const a = db.artikel.find((x) => x.id === id);
  if (!a) return;
  if (a.penulisId !== user.id) RBAC.assertCan(user, 'artikel.review');
  db.artikel = db.artikel.filter((x) => x.id !== id);
  catat(user, 'artikel.hapus', id, `Menghapus artikel "${a.judul}"`);
  simpan();
}

/* ============================================================
   KAJIAN / ANGGOTA / KEUANGAN / PESAN
   ============================================================ */
function simpanKajian(user, data) {
  RBAC.assertCan(user, 'kajian.manage');
  if (data.id) {
    const k = db.kajian.find((x) => x.id === data.id);
    Object.assign(k, data);
    catat(user, 'kajian.ubah', k.id, `Mengubah jadwal "${k.judul}"`);
  } else {
    const baru = { id: uid('k'), status: 'terjadwal', absensi: [], notulensi: '', ...data };
    db.kajian.push(baru);
    catat(user, 'kajian.buat', baru.id, `Menjadwalkan kajian "${baru.judul}"`);
  }
  simpan();
}

function setAbsensi(user, idKajian, daftarUserId) {
  RBAC.assertCan(user, 'kajian.attendance');
  const k = db.kajian.find((x) => x.id === idKajian);
  k.absensi = daftarUserId;
  catat(user, 'kajian.absensi', idKajian, `Absensi "${k.judul}": ${daftarUserId.length} hadir`);
  simpan();
}

function setNotulensi(user, idKajian, teks) {
  RBAC.assertCan(user, 'kajian.notulensi');
  const k = db.kajian.find((x) => x.id === idKajian);
  k.notulensi = teks;
  if (teks.trim() && k.status === 'terjadwal') k.status = 'selesai';
  catat(user, 'kajian.notulensi', idKajian, `Notulensi "${k.judul}" diperbarui`);
  simpan();
}

function hapusKajian(user, id) {
  RBAC.assertCan(user, 'kajian.manage');
  db.kajian = db.kajian.filter((x) => x.id !== id);
  catat(user, 'kajian.hapus', id, 'Menghapus jadwal kajian');
  simpan();
}

function simpanAnggota(user, data) {
  RBAC.assertCan(user, 'anggota.manage');
  if (data.role && data.role !== db.users.find(u => u.id === data.id)?.role)
    RBAC.assertCan(user, 'user.manage'); // ganti role butuh izin lebih tinggi
  if (data.id) {
    const u = db.users.find((x) => x.id === data.id);
    Object.assign(u, data);
    catat(user, 'anggota.ubah', u.id, `Memperbarui data ${u.nama}`);
  } else {
    const baru = {
      id: uid('u'), status: 'aktif', role: 'anggota', password: '123456',
      kategori: 'anggota', foto: window.__avatar(data.nama || 'Anggota', '#5B7C5F'), ...data,
    };
    db.users.push(baru);
    catat(user, 'anggota.tambah', baru.id, `Menambah anggota ${baru.nama}`);
  }
  simpan();
}

function simpanTransaksi(user, data) {
  RBAC.assertCan(user, 'keuangan.manage');
  if (data.id) {
    Object.assign(db.keuangan.find((x) => x.id === data.id), data);
    catat(user, 'keuangan.ubah', data.id, 'Mengubah transaksi');
  } else {
    const baru = { id: uid('f'), oleh: user.id, ...data, nominal: Number(data.nominal) };
    db.keuangan.unshift(baru);
    catat(user, 'keuangan.catat', baru.id,
      `${baru.jenis === 'masuk' ? 'Kas masuk' : 'Kas keluar'} Rp${Number(baru.nominal).toLocaleString('id-ID')} — ${baru.kategori}`);
  }
  simpan();
}

function hapusTransaksi(user, id) {
  RBAC.assertCan(user, 'keuangan.manage');
  db.keuangan = db.keuangan.filter((x) => x.id !== id);
  catat(user, 'keuangan.hapus', id, 'Menghapus transaksi');
  simpan();
}

/** Dipanggil dari halaman publik (tanpa login) — satu-satunya tulis publik. */
function kirimPesan(data) {
  db.pesan.unshift({
    id: uid('p'), tanggal: nowISO().slice(0, 10), dibaca: false, ...data,
  });
  catat(null, 'pesan.masuk', 'kontak', `Pesan baru dari ${data.nama} — ${data.subjek}`);
  simpan();
}

function tandaiDibaca(user, id) {
  RBAC.assertCan(user, 'pesan.read');
  const p = db.pesan.find((x) => x.id === id);
  if (p) { p.dibaca = true; simpan(); }
}

function berlanggananNewsletter(email) {
  if (db.langganan.includes(email)) return false;
  db.langganan.push(email);
  simpan();
  return true;
}

/* ---------- kompresi gambar untuk unggahan ---------- */
/* localStorage hanya ~5MB. Foto mentah dari kamera bisa 4MB sendiri,
   jadi setiap unggahan dikecilkan dulu lewat canvas. */
function unggahGambar(file, lebarMaks = 1400, mutu = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Berkas harus berupa gambar.'));
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const skala = Math.min(1, lebarMaks / img.width);
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * skala);
        c.height = Math.round(img.height * skala);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', mutu));
      };
      img.onerror = () => reject(new Error('Gambar tidak dapat dibaca.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas.'));
    reader.readAsDataURL(file);
  });
}

function resetPabrik() {
  localStorage.removeItem(DB_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  db = dbAwal();
  simpan();
}

/* ---------- pembantu baca ---------- */
const getUser = (id) => db.users.find((u) => u.id === id);
const namaUser = (id) => getUser(id)?.nama || '—';

window.Store = {
  get db() { return db; },
  get cms() { return db.cms; },           // versi TAYANG — dibaca website publik
  get draft() { return db.cmsDraft; },    // ruang kerja — dibaca ERP

  berlangganan, simpan, clone, uid,
  login, logout, userAktif,
  ubahDraft, toggleSection, geserSection, resetDraft,
  ringkasPerubahan, adaPerubahan, ajukan, setujui, tolak, rollback,
  simpanArtikel, ubahStatusArtikel, hapusArtikel,
  simpanKajian, setAbsensi, setNotulensi, hapusKajian,
  simpanAnggota, simpanTransaksi, hapusTransaksi,
  kirimPesan, tandaiDibaca, berlanggananNewsletter,
  unggahGambar, resetPabrik, catat,
  getUser, namaUser,
};
