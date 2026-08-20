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
    /* Keuangan — ruang kerja Bendahara */
    akunKas         : clone(s.akunKas),
    kategoriKeuangan: clone(s.kategoriKeuangan),
    /* Media & Website — ruang kerja PJ Media & Website */
    event      : clone(s.event),
    sosmed     : clone(s.sosmed),
    video      : clone(s.video),
    media      : clone(s.media),
    desain     : clone(s.desain),
    tugas      : clone(s.tugas),
    seo        : clone(s.seo),
    kunjungan  : clone(s.kunjungan),
    /* Penerbitan — ruang kerja PJ Buku */
    buku       : clone(s.buku),
    /* Redaksi — ruang kerja PJ Artikel */
    penugasan  : clone(s.penugasan),
    redaksi    : clone(s.redaksi),
    /* Sekretariat — ruang kerja Sekretaris */
    sertifikat : clone(s.sertifikat),
    tandaTangan: clone(s.tandaTangan),
    /* Kepengurusan — ruang kerja Ketua Umum */
    pengurus   : clone(s.pengurus),
    koordinator: clone(s.koordinator),
    kaleidoskop: clone(s.kaleidoskop),
    pencapaian : clone(s.pencapaian),
    evaluasi   : clone(s.evaluasi),
    audit    : clone(s.audit),
    langganan: [],
  };
}

/* DB yang sudah tersimpan di peramban tidak mengenal koleksi yang baru
   ditambahkan kemudian. Tanpa penambalan ini, ERP yang pernah dibuka
   sebelumnya akan menemukan `undefined` dan gagal menggambar halaman —
   sementara memaksa reset akan membuang seluruh kerja pengguna. */
function lengkapiDB(tersimpan) {
  if (!tersimpan) return dbAwal();
  const awal = dbAwal();
  let kurang = false;
  Object.keys(awal).forEach((k) => {
    if (tersimpan[k] === undefined) { tersimpan[k] = awal[k]; kurang = true; }
  });

  /* Arsip surat dahulu hanya mengenal `jenis: masuk|keluar`. Sekarang ia
     terbagi lima kategori. Petakan bentuk lamanya alih-alih membuangnya —
     nomor surat yang sudah terarsip tidak boleh hilang. */
  (tersimpan.surat || []).forEach((x) => {
    if (x.kategori === undefined) { x.kategori = x.jenis === 'masuk' ? 'masuk' : 'keluar'; kurang = true; }
  });

  /* Absensi dahulu hanya larik id — kehadiran cuma punya dua keadaan.
     Sekarang ia berstatus dan berjam. Yang sudah tercatat dipetakan
     sebagai 'hadir', bukan dibuang. */
  (tersimpan.kajian || []).forEach((k) => {
    if (Array.isArray(k.presensi)) return;
    k.presensi = (k.absensi || []).map((id) => ({ userId: id, status: 'hadir', jam: '' }));
    delete k.absensi;
    k.angkatan = k.angkatan || 'Angkatan X';
    k.notulenId = k.notulenId || '';
    if (k.ppt === undefined) k.ppt = false;
    if (k.revisi === undefined) k.revisi = false;
    kurang = true;
  });

  /* Kas dahulu hanya mengenal satu `nominal`. Sekarang rupiah dan pound
     dicatat terpisah, sebab keduanya benar-benar dipegang dan tak boleh
     dijumlahkan. Nominal lama menjadi rupiah; pound dimulai dari nol. */
  (tersimpan.keuangan || []).forEach((x) => {
    if (x.rp !== undefined) return;
    x.rp = Number(x.nominal || 0);
    x.egp = 0;
    x.arus = x.jenis === 'masuk' ? (x.kategori === 'Iuran Anggota' ? 'internal' : 'eksternal') : null;
    x.sumber = x.sumber || x.kategori || '';
    x.akunId = x.akunId || 'ak1';
    delete x.nominal;
    kurang = true;
  });

  /* Domain baru ditambahkan belakangan; DB lama belum mengenalnya. */
  if (tersimpan.seo && !tersimpan.seo.domain) {
    tersimpan.seo.domain = 'alijazqurancenter.com';
    kurang = true;
  }

  if (selaraskanAkunSeed(tersimpan)) kurang = true;
  if (petakanRoleLama(tersimpan)) kurang = true;

  if (kurang) { try { localStorage.setItem(DB_KEY, JSON.stringify(tersimpan)); } catch (_) {} }
  return tersimpan;
}

/* Menambal koleksi yang hilang saja tidak cukup: `users` sudah ada sejak
   awal, sehingga akun demo yang ditambahkan kemudian — atau jabatan yang
   berpindah tangan — tidak pernah sampai ke peramban yang sudah menyimpan
   DB. Akibatnya akun baru gagal masuk, dan penugasan yang menunjuk anggota
   baru kehilangan namanya.

   Daftar akun demo adalah bagian dari kontrak seed, bukan karangan
   pengguna. Karena itu di sini diselaraskan dua hal saja: `email` dan
   `role` — keduanya menentukan siapa bisa masuk dan ruang kerja mana yang
   ia lihat. Nama, foto, kata sandi, dan status dibiarkan apa adanya supaya
   suntingan pengguna tidak hilang, dan anggota yang ditambahkan sendiri
   (id di luar seed) tidak disentuh sama sekali. */
function selaraskanAkunSeed(tersimpan) {
  if (!Array.isArray(tersimpan.users)) return false;
  let berubah = false;
  (window.SEED.users || []).forEach((s) => {
    const ada = tersimpan.users.find((u) => u.id === s.id);
    if (!ada) { tersimpan.users.push(clone(s)); berubah = true; return; }
    if (ada.email !== s.email) { ada.email = s.email; berubah = true; }
    if (ada.role !== s.role) { ada.role = s.role; berubah = true; }
  });
  return berubah;
}

/* PJ Website dan PJ Media melebur jadi satu peran. Kunci lamanya masih
   tercatat pada anggota buatan pengguna dan pada daftar jabatan di dalam
   CMS — RBAC sudah mengenali keduanya lewat ROLE_LAMA, tapi daftar jabatan
   perlu dirapikan juga supaya halaman publik tidak memampangkan dua baris
   dengan nama jabatan yang sama persis. */
function petakanRoleLama(tersimpan) {
  let berubah = false;
  (tersimpan.users || []).forEach((u) => {
    const baru = RBAC.ROLE_LAMA[u.role];
    if (baru) { u.role = baru; berubah = true; }
  });
  [tersimpan.cms, tersimpan.cmsDraft].forEach((sisi) => {
    Object.values(sisi?.halaman || {}).forEach((hal) => {
      (hal.sections || []).forEach((sec) => {
        const jab = sec.data?.jabatan;
        if (!Array.isArray(jab)) return;
        const dilihat = new Set();
        const bersih = [];
        jab.forEach((j) => {
          const peran = RBAC.ROLE_LAMA[j.role] || j.role;
          if (peran !== j.role) { j.role = peran; berubah = true; }
          if (dilihat.has(peran)) { berubah = true; return; }   // buang kembarannya
          dilihat.add(peran); bersih.push(j);
        });
        if (bersih.length !== jab.length) sec.data.jabatan = bersih;
      });
    });
  });
  return berubah;
}

let db = lengkapiDB(bacaDB());

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
    if (baru) { db = lengkapiDB(baru); pendengar.forEach((fn) => { try { fn(db); } catch (_) {} }); }
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
  let simpul;
  if (data.id) {
    const a = db.artikel.find((x) => x.id === data.id);
    if (!a) throw new Error('Artikel tidak ditemukan.');
    const pemilik = a.penulisId === user.id;
    if (!pemilik && !RBAC.can(user, 'artikel.review'))
      throw new Error('Anda hanya dapat menyunting artikel tulisan sendiri.');
    if (a.status === 'terbit' && !RBAC.can(user, 'artikel.publish'))
      throw new Error('Artikel sudah terbit. Minta PJ Artikel untuk menariknya kembali ke draft.');
    Object.assign(a, data);
    simpul = a;
    catat(user, 'artikel.ubah', a.id, `Menyunting artikel "${a.judul}"`);
  } else {
    const baru = {
      id: uid('a'), status: 'draft', penulisId: user.id, dilihat: 0,
      tanggal: nowISO().slice(0, 10), reviewNote: '', reviewerId: '',
      cover: window.__ph('ARTIKEL BARU', '#1B5E20', '#0E2E1C', 'مقال'),
      tag: [], isi: [], ...data,
    };
    db.artikel.unshift(baru);
    simpul = baru;
    catat(user, 'artikel.buat', baru.id, `Membuat artikel "${baru.judul}"`);
  }
  selaraskanPenugasan(simpul);
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

  selaraskanPenugasan(a);
  catat(user, 'artikel.status', id, `Artikel "${a.judul}" -> ${status}`);
  simpan();
}

function hapusArtikel(user, id) {
  const a = db.artikel.find((x) => x.id === id);
  if (!a) return;
  if (a.penulisId !== user.id) RBAC.assertCan(user, 'artikel.review');
  db.artikel = db.artikel.filter((x) => x.id !== id);
  lepasPenugasan(id);
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
    const baru = { id: uid('k'), status: 'terjadwal', presensi: [], notulensi: '',
      angkatan: 'Angkatan X', notulenId: '', ppt: false, revisi: false, ...data };
    db.kajian.push(baru);
    catat(user, 'kajian.buat', baru.id, `Menjadwalkan kajian "${baru.judul}"`);
  }
  simpan();
}

const STATUS_PRESENSI = ['hadir', 'terlambat', 'tidak-hadir'];

/** Kode QR anggota. Sengaja hanya membawa id, bukan nama atau surel:
    QR ini dicetak dan ditempel, jadi ia tidak boleh membocorkan apa pun
    kepada siapa saja yang kebetulan memindainya. */
const kodeQr = (userId) => 'AIJZ-' + userId;

function setPresensi(user, idKajian, userId, status, jam) {
  RBAC.assertCan(user, 'kajian.attendance');
  if (!STATUS_PRESENSI.includes(status)) throw new Error('Status presensi tidak dikenal.');
  const k = db.kajian.find((x) => x.id === idKajian);
  if (!k) throw new Error('Kajian tidak ditemukan.');
  k.presensi = k.presensi || [];
  const ada = k.presensi.find((p) => p.userId === userId);
  const waktu = jam !== undefined ? jam
    : (status === 'tidak-hadir' ? '' : new Date().toTimeString().slice(0, 5));
  if (ada) { ada.status = status; ada.jam = waktu; }
  else k.presensi.push({ userId, status, jam: waktu });
  catat(user, 'kajian.presensi', idKajian, `${namaUser(userId)} → ${status} pada "${k.judul}"`);
  simpan();
  return k.presensi.find((p) => p.userId === userId);
}

/** Catat presensi dari kode hasil pindai. Terlambat ditentukan jam
    sesungguhnya terhadap jam mulai kajian, bukan ditebak petugas. */
function presensiDariKode(user, idKajian, kode) {
  RBAC.assertCan(user, 'kajian.attendance');
  const k = db.kajian.find((x) => x.id === idKajian);
  if (!k) throw new Error('Kajian tidak ditemukan.');
  const userId = String(kode || '').trim().replace(/^AIJZ-/i, '');
  const u = db.users.find((x) => x.id === userId);
  if (!u) throw new Error(`Kode "${kode}" tidak dikenali sebagai anggota.`);
  if (u.angkatan !== k.angkatan)
    throw new Error(`${u.nama} bukan peserta ${k.angkatan}.`);

  const sekarang = new Date().toTimeString().slice(0, 5);
  const menit = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const status = menit(sekarang) > menit(k.jam) + 10 ? 'terlambat' : 'hadir';
  setPresensi(user, idKajian, userId, status, sekarang);
  return { user: u, status, jam: sekarang };
}

/** Penyuntingan anggota versi koordinator: terbatas pada jenjang,
    kelompok, dan keaktifan. Surel, peran, dan akun baru bukan urusannya. */
function simpanAnggotaKajian(user, data) {
  RBAC.assertCan(user, 'anggota.kelompok');
  const u = db.users.find((x) => x.id === data.id);
  if (!u) throw new Error('Anggota tidak ditemukan.');
  ['level', 'kelompok', 'status'].forEach((k) => {
    if (data[k] !== undefined) u[k] = data[k];
  });
  catat(user, 'anggota.kelompok', u.id, `Memperbarui jenjang/kelompok ${u.nama}`);
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

/** Pengguna menyunting akunnya sendiri. Sengaja terpisah dari
    simpanAnggota(): di sini tidak ada izin 'anggota.manage' yang
    dituntut, tetapi juga tidak ada jalan mengubah role, status,
    atau akun orang lain. */
function simpanProfil(user, data) {
  const u = db.users.find((x) => x.id === user?.id);
  if (!u) throw new Error('Sesi tidak dikenali. Masuk ulang untuk melanjutkan.');
  const email = String(data.email || '').trim().toLowerCase();
  if (!data.nama?.trim() || !email) throw new Error('Nama dan email wajib diisi.');
  if (db.users.some((x) => x.id !== u.id && x.email.toLowerCase() === email))
    throw new Error('Email itu sudah dipakai akun lain.');
  if (data.password !== undefined && String(data.password).length < 6)
    throw new Error('Kata sandi minimal 6 karakter.');

  u.nama = data.nama.trim();
  u.email = data.email.trim();
  if (data.foto) u.foto = data.foto;
  if (data.password) u.password = data.password;
  catat(u, 'akun.ubah', u.id, `${u.nama} memperbarui data akunnya`);
  simpan();
  return u;
}

function simpanTransaksi(user, data) {
  RBAC.assertCan(user, 'keuangan.manage');
  const rapi = { ...data, rp: Number(data.rp || 0), egp: Number(data.egp || 0) };
  if (!rapi.rp && !rapi.egp) throw new Error('Isi nominal rupiah atau pound, minimal salah satu.');
  if (rapi.id) {
    const t = db.keuangan.find((x) => x.id === rapi.id);
    if (!t) throw new Error('Transaksi tidak ditemukan.');
    Object.assign(t, rapi);
    catat(user, 'keuangan.ubah', t.id, `Mengubah transaksi "${t.sumber || t.kategori}"`);
  } else {
    const baru = { id: uid('f'), oleh: user.id, akunId: 'ak1', arus: null, ...rapi };
    db.keuangan.unshift(baru);
    catat(user, 'keuangan.catat', baru.id,
      `${baru.jenis === 'masuk' ? 'Kas masuk' : 'Kas keluar'} ${nominalGabung(baru)} — ${baru.kategori}`);
  }
  simpan();
}

const nominalGabung = (t) => [
  t.rp ? 'Rp ' + Number(t.rp).toLocaleString('id-ID') : '',
  t.egp ? 'EGP ' + Number(t.egp).toLocaleString('id-ID') : '',
].filter(Boolean).join(' + ') || 'Rp 0';

/** Saldo sebuah akun, dua mata uang sekaligus — tidak pernah dijumlahkan. */
function saldoAkun(idAkun) {
  const a = db.akunKas.find((x) => x.id === idAkun);
  if (!a) return { rp: 0, egp: 0 };
  let rp = a.saldoAwalRp || 0, egp = a.saldoAwalEgp || 0;
  db.keuangan.filter((t) => t.akunId === idAkun).forEach((t) => {
    const tanda = t.jenis === 'masuk' ? 1 : -1;
    rp += tanda * Number(t.rp || 0);
    egp += tanda * Number(t.egp || 0);
  });
  return { rp, egp };
}

function hapusTransaksi(user, id) {
  RBAC.assertCan(user, 'keuangan.manage');
  db.keuangan = db.keuangan.filter((x) => x.id !== id);
  catat(user, 'keuangan.hapus', id, 'Menghapus transaksi');
  simpan();
}

/* ============================================================
   KOLEKSI SEDERHANA — daftar ber-id di ruang kerja tiap peran
   ------------------------------------------------------------
   Bentuknya seragam (array objek ber-id), jadi satu pasang fungsi
   melayani semuanya. Yang berbeda hanya izin penjaganya dan nama
   kolom judulnya — keduanya disimpan di peta ini, dipakai untuk
   menegakkan wewenang dan menyusun kalimat log audit yang enak
   dibaca. Menambah modul baru cukup menambah satu baris di sini.
   ============================================================ */
const KOLEKSI = {
  /* ruang kerja Ketua Umum */
  pengurus   : { izin: 'organisasi.manage', tunggal: 'pengurus',     judul: (x) => x.nama       },
  koordinator: { izin: 'organisasi.manage', tunggal: 'koordinator',  judul: (x) => x.nama       },
  kaleidoskop: { izin: 'organisasi.manage', tunggal: 'kegiatan',     judul: (x) => x.kegiatan   },
  pencapaian : { izin: 'organisasi.manage', tunggal: 'pencapaian',   judul: (x) => x.pencapaian },
  evaluasi   : { izin: 'organisasi.manage', tunggal: 'evaluasi',     judul: (x) => x.evaluasi   },
  /* ruang kerja Sekretaris */
  surat      : { izin: 'surat.manage',      tunggal: 'surat',        judul: (x) => x.perihal    },
  /* ruang kerja Bendahara */
  akunKas         : { izin: 'keuangan.akun', tunggal: 'akun kas', judul: (x) => x.nama },
  kategoriKeuangan: { izin: 'keuangan.akun', tunggal: 'kategori', judul: (x) => x.nama },
  /* ruang kerja PJ Artikel */
  penugasan  : { izin: 'redaksi.manage',    tunggal: 'penugasan',    judul: (x) => x.judul      },
  sertifikat : { izin: 'sertifikat.manage', tunggal: 'sertifikat',   judul: (x) => x.judul      },
  tandaTangan: { izin: 'ttd.manage',        tunggal: 'tanda tangan', judul: (x) => x.nama       },
};

function petaKoleksi(nama) {
  const k = KOLEKSI[nama];
  if (!k) throw new Error('Koleksi tidak dikenal: ' + nama);
  return k;
}

function simpanKoleksi(user, koleksi, data) {
  const k = petaKoleksi(koleksi);
  RBAC.assertCan(user, k.izin);
  if (data.id) {
    const item = db[koleksi].find((x) => x.id === data.id);
    if (!item) throw new Error('Data tidak ditemukan.');
    Object.assign(item, data);
    catat(user, koleksi + '.ubah', item.id, `Mengubah data ${k.tunggal} "${k.judul(item)}"`);
  } else {
    const baru = { id: uid(koleksi.slice(0, 2)), ...data };
    db[koleksi].push(baru);
    catat(user, koleksi + '.tambah', baru.id, `Menambah data ${k.tunggal} "${k.judul(baru)}"`);
  }
  simpan();
}

function hapusKoleksi(user, koleksi, id) {
  const k = petaKoleksi(koleksi);
  RBAC.assertCan(user, k.izin);
  const item = db[koleksi].find((x) => x.id === id);
  if (!item) return;
  db[koleksi] = db[koleksi].filter((x) => x.id !== id);
  catat(user, koleksi + '.hapus', id, `Menghapus data ${k.tunggal} "${k.judul(item)}"`);
  simpan();
}

/** Centang "Selesai" pada kaleidoskop. Status ikut menyesuaikan supaya
    lencana di tabel tidak pernah berlawanan dengan kotak centangnya. */
function centangKegiatan(user, id, selesai) {
  RBAC.assertCan(user, 'organisasi.manage');
  const k = db.kaleidoskop.find((x) => x.id === id);
  if (!k) throw new Error('Kegiatan tidak ditemukan.');
  k.selesai = selesai;
  if (selesai) k.status = 'selesai';
  else if (k.status === 'selesai') k.status = 'proses';
  catat(user, 'kaleidoskop.centang', id, `Kegiatan "${k.kegiatan}" ditandai ${selesai ? 'selesai' : 'belum selesai'}`);
  simpan();
}

/* ============================================================
   REDAKSI — target & penugasan artikel bulanan
   ============================================================ */

/** Sambungkan artikel ke penugasan penulisnya pada bulan yang sama,
    lalu selaraskan progressnya. Dipanggil setiap kali artikel dibuat,
    berubah status, atau dihapus — sehingga tabel progress PJ Artikel
    tidak pernah mengaku sebuah naskah sudah siap padahal tidak ada. */
function selaraskanPenugasan(artikel) {
  const bulan = String(artikel.tanggal || nowISO().slice(0, 10)).slice(0, 7);
  let t = db.penugasan.find((p) => p.artikelId === artikel.id);
  if (!t) {
    t = db.penugasan.find((p) => p.userId === artikel.penulisId && p.bulan === bulan && !p.artikelId);
    if (t) t.artikelId = artikel.id;
  }
  if (!t) return;
  t.progress = ['draft', 'revisi'].includes(artikel.status) ? 'proses' : 'siap';
}

function lepasPenugasan(idArtikel) {
  db.penugasan.filter((p) => p.artikelId === idArtikel).forEach((p) => {
    p.artikelId = ''; p.progress = 'belum';
  });
}

function setTargetArtikel(user, jumlah) {
  RBAC.assertCan(user, 'redaksi.manage');
  const n = Math.max(1, Math.min(20, Math.round(Number(jumlah) || 0)));
  db.redaksi.targetBulanan = n;
  catat(user, 'redaksi.target', 'redaksi', `Target artikel per anggota diubah menjadi ${n} per bulan`);
  simpan();
  return n;
}

function simpanPanduan(user, panduan) {
  RBAC.assertCan(user, 'redaksi.manage');
  db.redaksi.panduan = panduan;
  catat(user, 'redaksi.panduan', 'redaksi', 'Panduan penulis diperbarui');
  simpan();
}

/* ============================================================
   PENERBITAN BUKU — proyek beserta seluruh tahapnya
   ------------------------------------------------------------
   Setiap tahap adalah larik di dalam objek proyek, bukan koleksi
   tersendiri. Satu pasang fungsi melayani semuanya, dengan nama
   larik disebut pemanggil — sehingga menambah tahap baru tidak
   menuntut fungsi simpan/hapus yang baru pula.
   ============================================================ */
const BAGIAN_BUKU = {
  timeline  : { tunggal: 'tahapan',    judul: (x) => x.tahapan   },
  naskah    : { tunggal: 'naskah',     judul: (x) => x.subJudul  },
  desain    : { tunggal: 'desain',     judul: (x) => x.keterangan },
  produksi  : { tunggal: 'kegiatan',   judul: (x) => x.kegiatan  },
  distribusi: { tunggal: 'distribusi', judul: (x) => x.wilayah   },
  modal     : { tunggal: 'pos modal',  judul: (x) => x.uraian, izin: 'buku.anggaran' },
  dokumen   : { tunggal: 'dokumen',    judul: (x) => x.nama, izin: 'buku.arsip' },
};

/** Proyek yang sedang dikerjakan. Bila belum ada yang ditandai aktif,
    ambil yang terbaru — supaya halaman tidak pernah kosong tanpa sebab. */
function bukuAktif() {
  return db.buku.find((b) => b.status === 'aktif') || db.buku[0] || null;
}

function cariBuku(id) {
  const b = db.buku.find((x) => x.id === id);
  if (!b) throw new Error('Proyek buku tidak ditemukan.');
  return b;
}

function simpanBuku(user, data) {
  RBAC.assertCan(user, 'buku.manage');
  if (data.id) {
    const b = cariBuku(data.id);
    Object.assign(b, data);
    catat(user, 'buku.ubah', b.id, `Memperbarui proyek buku "${b.judul}"`);
  } else {
    const baru = {
      id: uid('bk'), status: 'rencana', tahap: 'perencanaan',
      pjUtamaId: '', editorIds: [], layouterIds: [], desainerIds: [], pjProduksiId: '',
      timeline: [], naskah: [], desain: [], produksi: [], distribusi: [], modal: [], dokumen: [],
      ...data,
    };
    db.buku.unshift(baru);
    catat(user, 'buku.buat', baru.id, `Membuat proyek buku "${baru.judul}"`);
  }
  simpan();
}

/** Hanya satu proyek boleh aktif; menandai yang baru otomatis
    mengarsipkan yang lama, jadi dasbor tak pernah bercabang. */
function aktifkanBuku(user, id) {
  RBAC.assertCan(user, 'buku.manage');
  const b = cariBuku(id);
  db.buku.forEach((x) => { if (x.status === 'aktif') x.status = 'arsip'; });
  b.status = 'aktif';
  catat(user, 'buku.aktif', b.id, `Menjadikan "${b.judul}" proyek buku yang aktif`);
  simpan();
}

function hapusBuku(user, id) {
  RBAC.assertCan(user, 'buku.manage');
  const b = cariBuku(id);
  db.buku = db.buku.filter((x) => x.id !== id);
  catat(user, 'buku.hapus', id, `Menghapus proyek buku "${b.judul}"`);
  simpan();
}

function petaBagian(bagian) {
  const k = BAGIAN_BUKU[bagian];
  if (!k) throw new Error('Bagian buku tidak dikenal: ' + bagian);
  return k;
}

function simpanBagianBuku(user, bagian, data, idBuku) {
  const k = petaBagian(bagian);
  RBAC.assertCan(user, k.izin || 'buku.manage');
  const b = idBuku ? cariBuku(idBuku) : bukuAktif();
  if (!b) throw new Error('Belum ada proyek buku. Buat proyeknya lebih dulu.');
  const arr = (b[bagian] ||= []);
  if (data.id) {
    const item = arr.find((x) => x.id === data.id);
    if (!item) throw new Error('Data tidak ditemukan.');
    Object.assign(item, data);
    catat(user, `buku.${bagian}.ubah`, item.id, `Mengubah ${k.tunggal} "${k.judul(item)}" pada "${b.judul}"`);
  } else {
    const baru = { id: uid(bagian.slice(0, 2)), ...data };
    arr.push(baru);
    catat(user, `buku.${bagian}.tambah`, baru.id, `Menambah ${k.tunggal} "${k.judul(baru)}" pada "${b.judul}"`);
  }
  simpan();
}

function hapusBagianBuku(user, bagian, id, idBuku) {
  const k = petaBagian(bagian);
  RBAC.assertCan(user, k.izin || 'buku.manage');
  const b = idBuku ? cariBuku(idBuku) : bukuAktif();
  if (!b) return;
  const item = (b[bagian] || []).find((x) => x.id === id);
  if (!item) return;
  b[bagian] = b[bagian].filter((x) => x.id !== id);
  catat(user, `buku.${bagian}.hapus`, id, `Menghapus ${k.tunggal} "${k.judul(item)}" dari "${b.judul}"`);
  simpan();
}

/** Centang kegiatan produksi. Terpisah dari simpanBagianBuku agar
    sekali klik tidak menuntut seluruh form dibuka lebih dulu. */
function centangProduksi(user, id, selesai) {
  RBAC.assertCan(user, 'buku.manage');
  const b = bukuAktif();
  const k = b?.produksi.find((x) => x.id === id);
  if (!k) throw new Error('Kegiatan produksi tidak ditemukan.');
  k.selesai = selesai;
  catat(user, 'buku.produksi.centang', id, `Kegiatan "${k.kegiatan}" ditandai ${selesai ? 'selesai' : 'belum selesai'}`);
  simpan();
}

/* ============================================================
   MEDIA & WEBSITE
   ============================================================ */
const KOLEKSI_MW = {
  event : { izin: 'mediaweb.manage', tunggal: 'agenda',     judul: (x) => x.judul },
  sosmed: { izin: 'mediaweb.manage', tunggal: 'posting',    judul: (x) => x.judul },
  video : { izin: 'mediaweb.manage', tunggal: 'video',      judul: (x) => x.judul },
  media : { izin: 'mediaweb.manage', tunggal: 'berkas',     judul: (x) => x.nama  },
  desain: { izin: 'mediaweb.manage', tunggal: 'desain',     judul: (x) => x.nama  },
  tugas : { izin: 'mediaweb.manage', tunggal: 'tugas',      judul: (x) => x.judul },
};
Object.assign(KOLEKSI, KOLEKSI_MW);

/** Dipanggil halaman publik pada tiap pemuatan. Inilah yang membuat
    statistik di ERP berisi angka sungguhan, bukan karangan — walau
    lingkupnya sebatas peramban ini, sebab prototipe tak punya server. */
const KUNJUNG_SESI = '(sesi)';
const KUNJUNG_BARU = '(baru)';

function catatKunjungan(halaman) {
  if (!halaman) return;
  const tgl = nowISO().slice(0, 10);
  const tambah = (h) => {
    const baris = db.kunjungan.find((k) => k.tgl === tgl && k.halaman === h);
    if (baris) baris.n += 1; else db.kunjungan.push({ tgl, halaman: h, n: 1 });
  };
  tambah(halaman);

  /* Tayangan halaman dihitung tiap pemuatan; kunjungan sekali per sesi
     peramban; pengunjung baru sekali seumur peramban. Ketiganya memang
     hal yang berbeda, dan hanya dengan membedakannya angka "halaman per
     kunjungan" dan "pengunjung baru" punya arti. */
  try {
    if (!sessionStorage.getItem('alijaz_sesi_kunjung')) {
      sessionStorage.setItem('alijaz_sesi_kunjung', '1');
      tambah(KUNJUNG_SESI);
      if (!localStorage.getItem('alijaz_pernah')) {
        localStorage.setItem('alijaz_pernah', '1');
        tambah(KUNJUNG_BARU);
      }
    }
  } catch (_) {}
  /* Simpan tanpa membangunkan pendengar: halaman publik hanya membaca,
     dan menggambar ulang dirinya sendiri saat mencatat kunjungan justru
     membuat tampilan berkedip tiap kali dibuka. */
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (_) {}
}

function centangTugas(user, id, selesai) {
  RBAC.assertCan(user, 'mediaweb.manage');
  const t = db.tugas.find((x) => x.id === id);
  if (!t) throw new Error('Tugas tidak ditemukan.');
  t.selesai = selesai;
  catat(user, 'tugas.centang', id, `Tugas "${t.judul}" ditandai ${selesai ? 'selesai' : 'belum selesai'}`);
  simpan();
}

function simpanSeo(user, data) {
  RBAC.assertCan(user, 'seo.manage');
  Object.assign(db.seo, data);
  catat(user, 'seo.ubah', 'seo', 'Pengaturan SEO diperbarui');
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

/* ---------- kompresi gambar untuk unggahan ----------
   localStorage hanya ~5MB, jadi foto dikecilkan dulu lewat canvas.

   Format keluaran mengikuti format masukan, bukan selalu JPEG:
   - SVG   diteruskan apa adanya. Ia sudah ringan dan bebas skala;
           melewatkannya ke canvas justru merusaknya jadi raster.
   - PNG / WebP / GIF menjadi PNG, agar latar transparan tetap utuh.
           Logo tanpa transparansi akan tampil sebagai kotak putih
           di atas header hijau.
   - Selebihnya menjadi JPEG, yang jauh lebih hemat untuk foto.        */
function unggahGambar(file, lebarMaks = 1400, mutu = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Berkas harus berupa gambar.'));

    const reader = new FileReader();
    reader.onload = () => {
      /* SVG: simpan langsung, tanpa melewati canvas.
         Catatan keamanan — SVG boleh memuat <script>. Di sini aman sebab
         logo & ikon SELALU dipasang lewat <img src> dan <link rel=icon>,
         dan peramban tidak menjalankan skrip pada SVG yang dimuat begitu.
         Bila kelak ada fitur yang menyisipkan SVG langsung ke DOM, berkas
         unggahan wajib disanitasi lebih dulu di sisi server. */
      if (file.type === 'image/svg+xml') {
        if (String(reader.result).length > 400_000)
          return reject(new Error('Berkas SVG terlalu besar. Sederhanakan gambarnya lebih dulu.'));
        return resolve(reader.result);
      }

      const punyaAlfa = ['image/png', 'image/webp', 'image/gif'].includes(file.type);
      const img = new Image();
      img.onload = () => {
        const skala = Math.min(1, lebarMaks / img.width);
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * skala));
        c.height = Math.max(1, Math.round(img.height * skala));
        const ctx = c.getContext('2d');
        if (!punyaAlfa) {                 // JPEG tidak mengenal transparansi
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, c.width, c.height);
        }
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(punyaAlfa ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', mutu));
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
  simpanKajian, setPresensi, presensiDariKode, setNotulensi, hapusKajian,
  simpanAnggotaKajian, kodeQr, STATUS_PRESENSI,
  simpanAnggota, simpanTransaksi, hapusTransaksi, saldoAkun, nominalGabung,
  simpanKoleksi, hapusKoleksi, centangKegiatan,
  setTargetArtikel, simpanPanduan, simpanProfil,
  bukuAktif, simpanBuku, aktifkanBuku, hapusBuku,
  simpanBagianBuku, hapusBagianBuku, centangProduksi,
  catatKunjungan, centangTugas, simpanSeo,
  KUNJUNG_SESI, KUNJUNG_BARU,
  kirimPesan, tandaiDibaca, berlanggananNewsletter,
  unggahGambar, resetPabrik, catat,
  getUser, namaUser,
};
