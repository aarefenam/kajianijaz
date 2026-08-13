/* ============================================================
   ERP.JS — Panel operasional Kajian Al-I'jaz
   ------------------------------------------------------------
   Router hash sederhana. Menu, tombol, dan setiap aksi dijaga
   oleh RBAC. Editor CMS bersifat GENERIK: ia membaca bentuk
   objek data section lalu membangun medan isian yang sesuai —
   sehingga menambah section baru di seed.js tidak menuntut
   penulisan form baru di sini.
   ============================================================ */

/* ---------------- ikon ---------------- */
const I = {
  dasbor:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3" y="3" width="7.5" height="8.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="5.5" rx="2"/><rect x="13.5" y="11.5" width="7.5" height="9.5" rx="2"/><rect x="3" y="14.5" width="7.5" height="6.5" rx="2"/></svg>',
  layout:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M9 9.5V20"/></svg>',
  kuas:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14c2-2 4-1 5.5-2.5L18 3l3 3-8.5 8.5C11 16 12 18 10 20a4 4 0 0 1-6-6z"/></svg>',
  cek:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  cekBulat:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
  jam:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  dok:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  kalender:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  orang:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>',
  grup:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="9" cy="8" r="3.4"/><path d="M2 20c0-3.4 3.2-5 7-5s7 1.6 7 5"/><path d="M17 5.3A3.4 3.4 0 0 1 17 12M18 20c0-2.4-.7-4-2-5"/></svg>',
  uang:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6 12h.01M18 12h.01"/></svg>',
  surat:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3 7 9 6 9-6"/></svg>',
  arsip:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3" y="4" width="18" height="4.5" rx="1.5"/><path d="M5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5M10 12.5h4"/></svg>',
  riwayat:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 4v4h4M12 7.5V12l3 2"/></svg>',
  perisai:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7.5 3v5.5c0 4.6-3.1 8.4-7.5 9.5-4.4-1.1-7.5-4.9-7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  log:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  keluar:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
  tutup:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  tambah:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  sunting:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/></svg>',
  hapus:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></svg>',
  mata:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.6"/></svg>',
  atas:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m6 15 6-6 6 6"/></svg>',
  bawah:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  nyala:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M12 4v8M7.5 6.5a7 7 0 1 0 9 0"/></svg>',
  kirim:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 3 10.5l7 3 3 7z"/><path d="m10 13.5 11-10.5"/></svg>',
  peringatan:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 4 2.5 20h19z"/><path d="M12 10v4M12 17h.01"/></svg>',
  info:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  kotak:'<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 8.5 12 4l9 4.5V16l-9 4.5L3 16z"/><path d="m3 8.5 9 4.5 9-4.5M12 13v7.5"/></svg>',
  gambar:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/></svg>',
  putar:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/></svg>',
};

/* ---------------- util ---------------- */
const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const rp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
const tgl = (s) => s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const tglJam = (s) => new Date(s).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function toast(pesan, galat = false) {
  let box = document.querySelector('.toast-erp-tempat');
  if (!box) { box = el('<div class="toast-erp-tempat"></div>'); document.body.appendChild(box); }
  const t = el(`<div class="toast-erp${galat ? ' galat' : ''}">${galat ? I.peringatan : I.cekBulat}<span>${esc(pesan)}</span></div>`);
  box.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(26px)'; setTimeout(() => t.remove(), 260); }, 4200);
}

/** Bungkus aksi agar setiap penolakan RBAC tampil rapi, bukan crash. */
function aman(fn) {
  try { fn(); return true; }
  catch (e) { toast(e.message, true); return false; }
}

/* ---------------- modal ---------------- */
let tirai;
function modal({ judul, isi, kaki, lebar }) {
  if (!tirai) {
    tirai = el('<div class="tirai-erp"><div class="modal"></div></div>');
    document.body.appendChild(tirai);
    tirai.onclick = (e) => { if (e.target === tirai) tutupModal(); };
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') tutupModal(); });
  }
  const m = tirai.querySelector('.modal');
  m.className = 'modal' + (lebar ? ' modal-lebar' : '');
  m.innerHTML = `
    <div class="modal-kepala"><h3>${esc(judul)}</h3><button class="tutup">${I.tutup}</button></div>
    <div class="modal-isi"></div>
    ${kaki ? '<div class="modal-kaki"></div>' : ''}`;
  const isiEl = m.querySelector('.modal-isi');
  if (typeof isi === 'string') isiEl.innerHTML = isi; else isiEl.appendChild(isi);
  if (kaki) { const k = m.querySelector('.modal-kaki'); if (typeof kaki === 'string') k.innerHTML = kaki; else k.appendChild(kaki); }
  m.querySelector('.tutup').onclick = tutupModal;
  tirai.classList.add('buka');
  return m;
}
function tutupModal() { tirai?.classList.remove('buka'); }

function konfirmasi(judul, pesan, onYa, labelYa = 'Ya, lanjutkan', bahaya = true) {
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button>
    <button class="btn ${bahaya ? 'btn-merah' : 'btn-lime'}" data-y>${esc(labelYa)}</button>
  </div>`);
  modal({ judul, isi: `<p style="margin:0;font-size:14px;color:#44534A">${esc(pesan)}</p>`, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-y]').onclick = () => { tutupModal(); onYa(); };
}

/* ---------------- state ---------------- */
let U = null;              // pengguna aktif
let rute = 'dasbor';
let cmsHalaman = 'beranda';
let cmsIndex = 0;

/* ============================================================
   MENU — tiap entri dijaga izin. Menu tidak muncul kalau tak berhak.
   ============================================================ */
const MENU = [
  { grup: 'Ringkasan' },
  { id: 'dasbor',    label: 'Dasbor',            ikon: I.dasbor,   izin: null },

  { grup: 'Website (CMS)', izin: ['cms.page.edit', 'cms.theme.edit', 'cms.approve', 'cms.media.upload'] },
  { id: 'cms',       label: 'Editor Halaman',    ikon: I.layout,   izin: ['cms.page.edit'] },
  { id: 'tema',      label: 'Tema & Identitas',  ikon: I.kuas,     izin: ['cms.theme.edit'] },
  { id: 'pengajuan', label: 'Persetujuan',       ikon: I.cek,      izin: ['cms.approve', 'cms.submit'], lonceng: () => Store.db.pengajuan.filter((p) => p.status === 'menunggu').length },
  { id: 'versi',     label: 'Riwayat Versi',     ikon: I.riwayat,  izin: ['cms.rollback'] },

  { grup: 'Program Kerja', izin: ['artikel.write', 'artikel.review', 'kajian.manage'] },
  { id: 'artikel',   label: 'Karya Tulis Ilmiah',ikon: I.dok,      izin: ['artikel.write', 'artikel.review'], lonceng: () => RBAC.can(U, 'artikel.review') ? Store.db.artikel.filter((a) => a.status === 'review').length : 0 },
  { id: 'kajian',    label: 'Jadwal Kajian',     ikon: I.kalender, izin: ['kajian.manage', 'kajian.attendance', 'kajian.notulensi'] },

  { grup: 'Sekretariat', izin: ['anggota.manage', 'pesan.read', 'surat.manage'] },
  { id: 'anggota',   label: 'Data Anggota',      ikon: I.grup,     izin: ['anggota.manage'] },
  { id: 'pesan',     label: 'Kotak Masuk',       ikon: I.surat,    izin: ['pesan.read'], lonceng: () => Store.db.pesan.filter((p) => !p.dibaca).length },
  { id: 'surat',     label: 'Arsip Surat',       ikon: I.arsip,    izin: ['surat.manage'] },

  { grup: 'Keuangan', izin: ['keuangan.manage', 'keuangan.report'] },
  { id: 'keuangan',  label: 'Kas & Iuran',       ikon: I.uang,     izin: ['keuangan.manage', 'keuangan.report'] },

  { grup: 'Sistem', izin: ['user.manage', 'audit.view'] },
  { id: 'akses',     label: 'Hak Akses',         ikon: I.perisai,  izin: ['user.manage'] },
  { id: 'log',       label: 'Log Aktivitas',     ikon: I.log,      izin: ['audit.view'] },
];

const bolehMenu = (m) => !m.izin || RBAC.canAny(U, m.izin);

/* ============================================================
   LAYAR LOGIN
   ============================================================ */
function layarLogin() {
  const akun = ['ketua', 'sekretaris', 'bendahara', 'pj_website', 'pj_media', 'pj_kti', 'pj_kajian', 'anggota']
    .map((r) => Store.db.users.find((u) => u.role === r)).filter(Boolean);

  const n = el(`<div class="layar-login">
    <div class="login-kiri">
      <div class="login-merek">
        <span class="lambang"><svg width="32" height="32" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,.5)" stroke-width="1.2"/><path d="M20 7c5 4 8 8 8 13a8 8 0 0 1-16 0c0-5 3-9 8-13z" stroke="#8CC63F" stroke-width="1.5" fill="rgba(140,198,63,.18)"/><path d="M20 15v10M16 19h8" stroke="#F0951E" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        <span><span class="nama">Al-I'jaz</span><br><span class="tag">ERP — Sistem Informasi Organisasi</span></span>
      </div>
      <h1>Satu sistem untuk website<br>dan operasional kajian.</h1>
      <p>Kelola konten website, karya tulis ilmiah, jadwal kajian, keanggotaan, dan keuangan dalam satu tempat — dengan pembagian wewenang yang jelas.</p>
      <div class="demo-akun">
        <div class="demo-judul">Akun demo — klik untuk mengisi otomatis</div>
        ${akun.map((u) => `<button class="demo-baris" data-mail="${esc(u.email)}">
          <span class="demo-titik" style="background:${RBAC.roleColor(u.role)}"></span>
          <span><span class="demo-nama">${esc(RBAC.roleLabel(u.role))}</span></span>
          <span class="demo-mail">${esc(u.email)}</span>
        </button>`).join('')}
      </div>
    </div>
    <div class="login-kanan"><div class="kotak-login">
      <h2>Masuk ke ERP</h2>
      <p class="sub">Gunakan akun yang diberikan Sekretaris.</p>
      <form id="formLogin">
        <div class="grup"><label>Alamat Email</label><input name="email" type="email" required placeholder="nama@alijaz.id" autocomplete="username"></div>
        <div class="grup"><label>Kata Sandi</label><input name="password" type="password" required value="123456" autocomplete="current-password"></div>
        <button class="btn btn-lime" style="width:100%;padding:13px" type="submit">Masuk</button>
      </form>
      <p style="font-size:12.4px;color:var(--e-abu);margin-top:20px;text-align:center">
        Kata sandi seluruh akun demo: <b>123456</b><br>
        <a href="index.html" style="color:var(--e-hijau);font-weight:700">← Kembali ke website</a>
      </p>
    </div></div>
  </div>`);

  n.querySelectorAll('.demo-baris').forEach((b) => {
    b.onclick = () => { n.querySelector('[name=email]').value = b.dataset.mail; n.querySelector('[name=password]').value = '123456'; };
  });
  n.querySelector('#formLogin').onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    aman(() => {
      U = Store.login(f.get('email'), f.get('password'));
      rute = 'dasbor';
      gambar();
      toast(`Selamat datang, ${U.nama.split(' ').slice(-1)[0]}.`);
    });
  };
  return n;
}

/* ============================================================
   KERANGKA APLIKASI
   ============================================================ */
function kerangka() {
  /* Judul grup memakai gabungan izin anak-anaknya, sehingga grup yang
     seluruh menunya tersembunyi ikut hilang dengan sendirinya. */
  const menuHtml = MENU.filter(bolehMenu).map((m) => {
    if (m.grup) return `<div class="sb-grup">${esc(m.grup)}</div>`;
    const n = m.lonceng?.() || 0;
    return `<button class="sb-item ${rute === m.id ? 'aktif' : ''}" data-rute="${m.id}">
      ${m.ikon}<span>${esc(m.label)}</span>${n ? `<span class="sb-lonceng">${n}</span>` : ''}
    </button>`;
  }).join('');

  const n = el(`<div class="tata">
    <aside class="sidebar" id="sidebar">
      <div class="sb-merek">
        <span class="lambang"><svg width="26" height="26" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,.5)" stroke-width="1.2"/><path d="M20 7c5 4 8 8 8 13a8 8 0 0 1-16 0c0-5 3-9 8-13z" stroke="#8CC63F" stroke-width="1.5" fill="rgba(140,198,63,.18)"/></svg></span>
        <span><span class="nama">Al-I'jaz</span><br><span class="tag">ERP ORGANISASI</span></span>
      </div>
      <nav class="sb-nav">${menuHtml}</nav>
      <div class="sb-bawah">
        <div class="sb-user">
          <img src="${U.foto}" alt="">
          <div style="min-width:0">
            <div class="nm">${esc(U.nama)}</div>
            <div class="rl" style="color:${RBAC.roleColor(U.role)}">${esc(RBAC.roleLabel(U.role))}</div>
          </div>
        </div>
        <button class="sb-keluar" id="btnKeluar">${I.keluar} Keluar</button>
      </div>
    </aside>
    <main class="konten">
      <div class="topbar">
        <button class="tombol-sidebar" id="btnSidebar">${I.log}</button>
        <div><h1 id="judulHal"></h1><div class="sub" id="subHal"></div></div>
        <div class="topbar-aksi">
          <a class="btn btn-garis btn-kecil" href="index.html" target="_blank">${I.mata} Lihat Website</a>
        </div>
      </div>
      <div class="halaman" id="isiHal"></div>
    </main>
  </div>`);

  n.querySelectorAll('.sb-item').forEach((b) => {
    b.onclick = () => { rute = b.dataset.rute; location.hash = rute; gambar(); n.querySelector('#sidebar').classList.remove('buka'); };
  });
  n.querySelector('#btnKeluar').onclick = () => konfirmasi('Keluar dari ERP', 'Anda yakin ingin mengakhiri sesi?', () => { Store.logout(); U = null; gambar(); }, 'Keluar');
  n.querySelector('#btnSidebar').onclick = () => n.querySelector('#sidebar').classList.toggle('buka');
  return n;
}

/* ============================================================
   HALAMAN — DASBOR
   ============================================================ */
const HAL = {};

HAL.dasbor = () => {
  const d = Store.db;
  const box = el('<div></div>');
  const menunggu = d.pengajuan.filter((p) => p.status === 'menunggu');
  const perubahan = Store.ringkasPerubahan().length;

  /* Statistik disesuaikan peran — tiap orang melihat angka yang relevan baginya. */
  const stat = [];
  if (RBAC.canAny(U, ['cms.page.edit', 'cms.approve']))
    stat.push({ ik: I.layout, n: perubahan, l: 'Perubahan draft belum tayang', w: 'rgba(240,149,30,.14)', wc: '#B87310' });
  if (RBAC.can(U, 'cms.approve'))
    stat.push({ ik: I.cek, n: menunggu.length, l: 'Pengajuan menunggu keputusan', w: 'rgba(62,127,184,.14)', wc: '#2C6091' });
  if (RBAC.canAny(U, ['artikel.review', 'artikel.write']))
    stat.push({ ik: I.dok, n: d.artikel.filter((a) => RBAC.can(U, 'artikel.review') ? a.status === 'review' : a.penulisId === U.id).length,
      l: RBAC.can(U, 'artikel.review') ? 'Artikel menunggu ditinjau' : 'Artikel tulisan Anda', w: 'rgba(47,169,140,.14)', wc: '#1F7A64' });
  if (RBAC.canAny(U, ['kajian.manage', 'kajian.attendance']))
    stat.push({ ik: I.kalender, n: d.kajian.filter((k) => k.status === 'terjadwal').length, l: 'Kajian terjadwal', w: 'rgba(199,122,43,.14)', wc: '#96591C' });
  if (RBAC.can(U, 'anggota.manage'))
    stat.push({ ik: I.grup, n: d.users.filter((u) => u.status === 'aktif').length, l: 'Anggota aktif', w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' });
  if (RBAC.can(U, 'pesan.read'))
    stat.push({ ik: I.surat, n: d.pesan.filter((p) => !p.dibaca).length, l: 'Pesan belum dibaca', w: 'rgba(229,83,75,.12)', wc: '#B23E37' });
  if (RBAC.can(U, 'keuangan.report')) {
    const saldo = d.keuangan.reduce((s, t) => s + (t.jenis === 'masuk' ? t.nominal : -t.nominal), 0);
    stat.push({ ik: I.uang, n: rp(saldo), l: 'Saldo kas organisasi', w: 'rgba(140,198,63,.16)', wc: '#4A7A1E', kecil: true });
  }
  if (!stat.length)
    stat.push({ ik: I.dok, n: d.artikel.filter((a) => a.penulisId === U.id).length, l: 'Artikel tulisan Anda', w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' });

  box.appendChild(el(`<div class="grid-stat">${stat.map((s) => `<div class="stat" style="--w:${s.w};--wc:${s.wc}">
    <div class="stat-ik">${s.ik}</div>
    <div class="stat-nilai" style="${s.kecil ? 'font-size:21px' : ''}">${s.n}</div>
    <div class="stat-label">${esc(s.l)}</div>
  </div>`).join('')}</div>`));

  /* Sorotan tugas yang menuntut tindakan */
  if (RBAC.can(U, 'cms.approve') && menunggu.length) {
    const a = el(`<div class="notis notis-kuning">${I.peringatan}<div style="flex:1">
      <b>${menunggu.length} pengajuan perubahan website menunggu keputusan Anda</b>
      Diajukan oleh ${esc(menunggu.map((p) => p.olehNama).join(', '))}. Website publik belum berubah sampai Anda menyetujuinya.
    </div><button class="btn btn-kecil">Tinjau</button></div>`);
    a.querySelector('button').onclick = () => { rute = 'pengajuan'; gambar(); };
    box.appendChild(a);
  }
  if (RBAC.can(U, 'cms.submit') && !RBAC.can(U, 'cms.approve') && perubahan) {
    const a = el(`<div class="notis notis-info">${I.info}<div style="flex:1">
      <b>Anda punya ${perubahan} perubahan yang belum diajukan</b>
      Perubahan tersimpan di draft dan belum terlihat publik. Ajukan agar ditinjau Ketua Umum.
    </div><button class="btn btn-kecil">Ajukan</button></div>`);
    a.querySelector('button').onclick = () => { rute = 'pengajuan'; gambar(); };
    box.appendChild(a);
  }
  const ditolak = d.pengajuan.find((p) => p.status === 'ditolak' && p.olehId === U.id);
  if (ditolak) box.appendChild(el(`<div class="notis notis-merah">${I.peringatan}<div>
    <b>Pengajuan Anda dikembalikan</b>${esc(ditolak.catatanReview)} — oleh ${esc(ditolak.reviewerNama)}
  </div></div>`));

  /* Agenda terdekat */
  const agenda = d.kajian.filter((k) => k.status === 'terjadwal').sort((a, b) => a.tanggal.localeCompare(b.tanggal)).slice(0, 3);
  if (agenda.length) {
    box.appendChild(el(`<div class="panel">
      <div class="panel-kepala"><h3>Agenda Kajian Terdekat</h3></div>
      <div class="tabel-bungkus"><table>
        <thead><tr><th>Tanggal</th><th>Judul</th><th>Jenjang</th><th>Pemakalah</th></tr></thead>
        <tbody>${agenda.map((k) => `<tr>
          <td><b>${tgl(k.tanggal)}</b><br><span style="color:var(--e-abu);font-size:12px">${esc(k.jam)} WK</span></td>
          <td>${esc(k.judul)}<br><span style="color:var(--e-abu);font-size:12px">${esc(k.tempat)}</span></td>
          <td><span class="lencana ${k.jenis === 'tatsqif' ? 'l-kuning' : 'l-hijau'}">${esc(k.level)}</span></td>
          <td>${esc(Store.namaUser(k.pemakalahId))}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`));
  }

  /* Aktivitas terakhir */
  if (RBAC.can(U, 'audit.view') && d.audit.length) {
    box.appendChild(el(`<div class="panel">
      <div class="panel-kepala"><h3>Aktivitas Terakhir</h3></div>
      <div class="panel-isi rapat">${d.audit.slice(0, 6).map((l) => `<div class="log">
        <span class="log-ik">${I.log}</span>
        <div><div class="log-teks">${esc(l.detail)}</div>
        <div class="log-meta">${esc(l.userNama)} · ${esc(RBAC.roleLabel(l.role))} · ${tglJam(l.ts)}</div></div>
      </div>`).join('')}</div>
    </div>`));
  }
  return box;
}
HAL.dasbor.judul = () => ['Dasbor', `${RBAC.roleLabel(U.role)} — ${RBAC.ROLES[U.role].ringkas}`];

/* ============================================================
   EDITOR CMS — generik berdasarkan bentuk data
   ============================================================ */
const LABEL = {
  arab: 'Teks Arab (kaligrafi)', skrip: 'Teks Skrip (tulisan tangan)', judul: 'Judul', subjudul: 'Sub Judul',
  tombolTeks: 'Label Tombol', tombolLink: 'Tautan Tombol', gambar: 'Gambar', nomor: 'Nomor Section',
  paragraf: 'Paragraf', intro: 'Paragraf Pembuka', visi: 'Isi Visi', misi: 'Poin Misi', butir: 'Butir',
  teks: 'Isi Teks', poin: 'Poin', level: 'Daftar Level', label: 'Label', penutup: 'Kalimat Penutup',
  subJudul: 'Sub Judul', subJudul2: 'Sub Judul Kedua', kutipan: 'Isi Kutipan', sumber: 'Sumber Kutipan',
  nlJudul: 'Judul Newsletter', nlTeks: 'Teks Newsletter', kategori: 'Daftar Kategori',
  perHalaman: 'Artikel per Halaman', durasiAnimasi: 'Durasi Animasi (detik)', posisiGambar: 'Posisi Gambar',
  nama: 'Nama', jabatan: 'Daftar Jabatan', t: 'Pertanyaan', j: 'Jawaban', subjek: 'Pilihan Subjek',
  tampilkanFilter: 'Tampilkan Filter', tema: 'Tema Warna', ikon: 'Ikon',
};
const labelKunci = (k) => LABEL[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

const adalahGambar = (v) => typeof v === 'string' && (v.startsWith('data:image') || /\.(jpe?g|png|webp|svg|gif)$/i.test(v));
const adalahWarna = (v) => typeof v === 'string' && /^#[0-9a-f]{3,8}$/i.test(v);

/** Bangun medan isian untuk sebuah nilai. Rekursif untuk objek & array. */
function medan(kunci, nilai, path, bisaEdit, bisaGambar) {
  const w = el(`<div class="medan"></div>`);
  const kepala = el(`<div class="medan-kepala"><label>${esc(labelKunci(kunci))}</label><span class="medan-path">${esc(path.split('.').slice(-3).join('.'))}</span></div>`);
  w.appendChild(kepala);

  const simpan = (v, izin) => {
    if (Store.ubahDraft(U, path, v, izin)) { tandaiKotor(); }
  };

  /* --- gambar --- */
  if (adalahGambar(nilai)) {
    const p = el(`<div class="pratinjau-gambar">
      <img src="${nilai}" alt="">
      <div style="flex:1;min-width:0">
        <p style="margin:0 0 10px;font-size:12.4px;color:var(--e-abu)">Format JPG/PNG/WebP. Gambar otomatis dikecilkan ke lebar maks 1400px agar hemat penyimpanan.</p>
        <label class="btn btn-garis btn-kecil" style="display:inline-flex;cursor:pointer;margin:0">
          ${I.gambar} Ganti Gambar<input type="file" accept="image/*" hidden ${bisaGambar ? '' : 'disabled'}>
        </label>
      </div>
    </div>`);
    const inp = p.querySelector('input[type=file]');
    if (!bisaGambar) { p.querySelector('label.btn').classList.add('btn-garis'); p.querySelector('label.btn').style.opacity = '.5'; p.querySelector('label.btn').style.cursor = 'not-allowed'; }
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      try {
        const dataUri = await Store.unggahGambar(f);
        RBAC.assertCan(U, 'cms.media.upload');
        simpan(dataUri, 'cms.media.upload');
        p.querySelector('img').src = dataUri;
        toast('Gambar diperbarui pada draft.');
      } catch (e) { toast(e.message, true); }
      inp.value = '';
    };
    w.appendChild(p);
    return w;
  }

  /* --- warna --- */
  if (adalahWarna(nilai)) {
    const p = el(`<div class="pilih-warna">
      <input type="color" value="${nilai}" ${bisaEdit ? '' : 'disabled'}>
      <input type="text" value="${nilai}" ${bisaEdit ? '' : 'disabled'}>
    </div>`);
    const [c, t] = p.querySelectorAll('input');
    const pakai = (v) => { c.value = v; t.value = v; simpan(v, 'cms.theme.edit'); document.documentElement.style.setProperty('--pratinjau', v); };
    c.oninput = () => pakai(c.value);
    t.onchange = () => { if (adalahWarna(t.value)) pakai(t.value); else { t.value = c.value; toast('Format warna harus heksadesimal, mis. #1B5E20', true); } };
    w.appendChild(p);
    return w;
  }

  /* --- boolean --- */
  if (typeof nilai === 'boolean') {
    const p = el(`<label style="display:flex;align-items:center;gap:10px;font-weight:600;cursor:pointer">
      <input type="checkbox" ${nilai ? 'checked' : ''} ${bisaEdit ? '' : 'disabled'} style="width:auto;accent-color:var(--e-hijau)">
      <span>Aktif</span></label>`);
    p.querySelector('input').onchange = (e) => simpan(e.target.checked);
    w.appendChild(p);
    return w;
  }

  /* --- angka --- */
  if (typeof nilai === 'number') {
    const p = el(`<input type="number" step="any" value="${nilai}" ${bisaEdit ? '' : 'disabled'}>`);
    p.onchange = () => simpan(Number(p.value), kunci === 'radius' || kunci === 'lebarKonten' ? 'cms.theme.edit' : 'cms.page.edit');
    w.appendChild(p);
    return w;
  }

  /* --- teks --- */
  if (typeof nilai === 'string') {
    const panjang = nilai.length > 110 || nilai.includes('\n');
    const p = el(panjang
      ? `<textarea ${bisaEdit ? '' : 'disabled'} style="min-height:${Math.min(220, 60 + nilai.length / 4)}px">${esc(nilai)}</textarea>`
      : `<input type="text" value="${esc(nilai)}" ${bisaEdit ? '' : 'disabled'}>`);
    p.onchange = () => simpan(p.value);
    w.appendChild(p);
    return w;
  }

  /* --- array --- */
  if (Array.isArray(nilai)) {
    const box = el('<div style="display:flex;flex-direction:column;gap:10px"></div>');
    nilai.forEach((item, i) => {
      if (typeof item === 'string') {
        const baris = el(`<div style="display:flex;gap:8px;align-items:flex-start">
          <span style="flex:none;width:24px;height:24px;border-radius:7px;background:#F0F3F0;display:grid;place-items:center;font-size:11px;font-weight:800;color:var(--e-abu);margin-top:9px">${i + 1}</span>
          <textarea style="min-height:${item.length > 90 ? 88 : 46}px" ${bisaEdit ? '' : 'disabled'}>${esc(item)}</textarea>
          <button class="btn btn-merah btn-ikon" title="Hapus" ${bisaEdit ? '' : 'disabled'} style="margin-top:4px">${I.hapus}</button>
        </div>`);
        baris.querySelector('textarea').onchange = (e) => {
          const arr = [...nilai]; arr[i] = e.target.value; simpan(arr);
        };
        baris.querySelector('button').onclick = () => {
          const arr = nilai.filter((_, x) => x !== i); simpan(arr); gambar();
        };
        box.appendChild(baris);
      } else if (item && typeof item === 'object') {
        const sub = el(`<div style="border:1px solid var(--e-garis);border-radius:11px;padding:14px;background:#FAFBFA">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <b style="font-size:12.4px">${esc(labelKunci(kunci))} ${i + 1}</b>
            <button class="btn btn-merah btn-ikon" style="margin-left:auto" title="Hapus" ${bisaEdit ? '' : 'disabled'}>${I.hapus}</button>
          </div>
        </div>`);
        Object.entries(item).forEach(([k2, v2]) => sub.appendChild(medan(k2, v2, `${path}.${i}.${k2}`, bisaEdit, bisaGambar)));
        sub.querySelector('button').onclick = () => { simpan(nilai.filter((_, x) => x !== i)); gambar(); };
        box.appendChild(sub);
      }
    });

    if (bisaEdit) {
      const tambah = el(`<button class="btn btn-garis btn-kecil" style="align-self:flex-start">${I.tambah} Tambah ${esc(labelKunci(kunci))}</button>`);
      tambah.onclick = () => {
        const contoh = nilai[0];
        let baru = '';
        if (contoh && typeof contoh === 'object') {
          baru = {}; Object.keys(contoh).forEach((k) => { baru[k] = typeof contoh[k] === 'string' ? '' : Array.isArray(contoh[k]) ? [] : contoh[k]; });
        }
        simpan([...nilai, baru]); gambar();
      };
      box.appendChild(tambah);
    }
    w.appendChild(box);
    return w;
  }

  /* --- objek --- */
  if (nilai && typeof nilai === 'object') {
    const box = el('<div style="padding-left:14px;border-left:2px solid var(--e-garis)"></div>');
    Object.entries(nilai).forEach(([k2, v2]) => box.appendChild(medan(k2, v2, `${path}.${k2}`, bisaEdit, bisaGambar)));
    w.appendChild(box);
    return w;
  }

  return w;
}

function barDraft() {
  const n = Store.ringkasPerubahan().length;
  if (!n) return el(`<div class="notis notis-hijau">${I.cekBulat}<div><b>Draft identik dengan versi tayang</b>Tidak ada perubahan yang menunggu.</div></div>`);
  const bar = el(`<div class="bar-draft">
    <span class="titik"></span>
    <div class="isi"><b>${n} perubahan tersimpan di draft.</b> Belum terlihat oleh pengunjung website.</div>
    <button class="btn btn-garis btn-kecil" data-reset>${I.putar} Buang Draft</button>
    ${RBAC.can(U, 'cms.submit') ? `<button class="btn btn-lime btn-kecil" data-ajukan>${I.kirim} Ajukan untuk Ditinjau</button>` : ''}
  </div>`);
  bar.querySelector('[data-reset]').onclick = () => konfirmasi('Buang seluruh draft',
    'Semua perubahan yang belum diajukan akan hilang dan draft dikembalikan menyamai versi tayang.',
    () => aman(() => { Store.resetDraft(U); toast('Draft dikembalikan ke versi tayang.'); gambar(); }), 'Ya, buang draft');
  bar.querySelector('[data-ajukan]')?.addEventListener('click', dialogAjukan);
  return bar;
}

function tandaiKotor() {
  const bar = document.querySelector('#barDraft');
  if (bar) { bar.replaceChildren(barDraft()); }
  const l = document.querySelector('.sb-item[data-rute=pengajuan] .sb-lonceng');
  if (l) l.textContent = Store.db.pengajuan.filter((p) => p.status === 'menunggu').length;
}

function dialogAjukan() {
  const per = Store.ringkasPerubahan();
  const isi = el(`<div>
    <div class="notis notis-info" style="margin-bottom:18px">${I.info}<div>
      <b>${per.length} perubahan akan diajukan</b>Website publik baru berubah setelah Ketua Umum menyetujui.
    </div></div>
    <div class="grup"><label>Catatan untuk peninjau</label>
      <textarea id="cat" placeholder="Contoh: Memperbarui foto hero dan menyesuaikan teks sejarah sesuai arahan rapat."></textarea>
      <div class="bantu">Jelaskan apa yang diubah dan alasannya agar peninjau mudah menilai.</div>
    </div>
    <div class="panel" style="margin:0"><div class="panel-kepala"><h3 style="font-size:13.4px">Rincian Perubahan</h3></div>
      <div class="diff">${per.slice(0, 30).map(rowDiff).join('')}</div>
    </div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-k>${I.kirim} Kirim Pengajuan</button>
  </div>`);
  modal({ judul: 'Ajukan Perubahan Website', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-k]').onclick = () => {
    aman(() => {
      Store.ajukan(U, isi.querySelector('#cat').value.trim());
      tutupModal(); toast('Pengajuan terkirim. Menunggu keputusan Ketua Umum.'); rute = 'pengajuan'; gambar();
    });
  };
}

const potong = (v, n = 60) => {
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  return esc(String(s ?? '').slice(0, n)) + (String(s ?? '').length > n ? '…' : '');
};
const rowDiff = (d) => `<div class="diff-baris">
  <div class="diff-path">${esc(d.path)}</div>
  <div class="diff-nilai">
    <span class="diff-dari">${potong(d.dari) || '(kosong)'}</span>
    <span style="color:var(--e-abu)">→</span>
    <span class="diff-ke">${potong(d.ke) || '(kosong)'}</span>
  </div></div>`;

HAL.cms = () => {
  const bisaEdit = RBAC.can(U, 'cms.page.edit');
  const bisaGambar = RBAC.can(U, 'cms.media.upload');
  const bisaAtur = RBAC.can(U, 'cms.section.toggle');
  const hal = Store.draft.halaman;
  const namaHal = Object.keys(hal);
  if (!hal[cmsHalaman]) cmsHalaman = namaHal[0];
  const sections = hal[cmsHalaman].sections;
  cmsIndex = Math.min(cmsIndex, sections.length - 1);

  const box = el('<div></div>');
  box.appendChild(el('<div id="barDraft"></div>'));
  box.querySelector('#barDraft').appendChild(barDraft());

  const pilihHal = el(`<div style="display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap">
    ${namaHal.map((h) => `<button class="btn ${h === cmsHalaman ? '' : 'btn-garis'} btn-kecil" data-h="${h}">${esc(hal[h].judul)}</button>`).join('')}
  </div>`);
  pilihHal.querySelectorAll('button').forEach((b) => b.onclick = () => { cmsHalaman = b.dataset.h; cmsIndex = 0; gambar(); });
  box.appendChild(pilihHal);

  const tata = el('<div class="cms-tata"></div>');

  /* daftar section */
  const kiri = el('<div class="cms-daftar"></div>');
  sections.forEach((s, i) => {
    const n = el(`<div class="cms-sec ${i === cmsIndex ? 'aktif' : ''} ${s.aktif ? '' : 'mati'}">
      <span class="no">${i + 1}</span>
      <span class="nm">${esc(s.nama)}<br><span class="tp">${esc(s.tipe)}</span></span>
      <span class="cms-alat">
        <button data-a="atas" title="Naikkan" ${!bisaAtur || i === 0 ? 'disabled' : ''}>${I.atas}</button>
        <button data-a="bawah" title="Turunkan" ${!bisaAtur || i === sections.length - 1 ? 'disabled' : ''}>${I.bawah}</button>
        <button data-a="nyala" title="${s.aktif ? 'Sembunyikan' : 'Tampilkan'}" ${bisaAtur ? '' : 'disabled'}>${I.nyala}</button>
      </span>
    </div>`);
    n.onclick = (e) => { if (e.target.closest('button')) return; cmsIndex = i; gambar(); };
    n.querySelector('[data-a=atas]').onclick = () => aman(() => { Store.geserSection(U, cmsHalaman, i, -1); cmsIndex = i - 1; gambar(); });
    n.querySelector('[data-a=bawah]').onclick = () => aman(() => { Store.geserSection(U, cmsHalaman, i, 1); cmsIndex = i + 1; gambar(); });
    n.querySelector('[data-a=nyala]').onclick = () => aman(() => { Store.toggleSection(U, cmsHalaman, i, !s.aktif); gambar(); });
    kiri.appendChild(n);
  });
  tata.appendChild(kiri);

  /* editor section terpilih */
  const s = sections[cmsIndex];
  const kanan = el(`<div class="panel" style="margin:0">
    <div class="panel-kepala">
      <h3>${esc(s.nama)}</h3>
      <span class="lencana ${s.aktif ? 'l-hijau' : 'l-abu'}">${s.aktif ? 'Tampil' : 'Disembunyikan'}</span>
      <span class="ket">tipe: ${esc(s.tipe)}</span>
    </div>
    <div class="panel-isi" id="medanBox"></div>
  </div>`);
  const mb = kanan.querySelector('#medanBox');
  if (!bisaEdit) mb.appendChild(el(`<div class="notis notis-kuning" style="margin-bottom:16px">${I.peringatan}<div><b>Mode baca saja</b>Role ${esc(RBAC.roleLabel(U.role))} tidak memiliki izin mengubah konten halaman.</div></div>`));
  Object.entries(s.data).forEach(([k, v]) =>
    mb.appendChild(medan(k, v, `halaman.${cmsHalaman}.sections.${cmsIndex}.data.${k}`, bisaEdit, bisaGambar)));
  tata.appendChild(kanan);

  box.appendChild(tata);
  return box;
};
HAL.cms.judul = () => ['Editor Halaman', 'Ubah teks, gambar, dan urutan section. Perubahan masuk ke draft.'];

/* ============================================================
   TEMA & IDENTITAS
   ============================================================ */
HAL.tema = () => {
  const bisa = RBAC.can(U, 'cms.theme.edit');
  const box = el('<div></div>');
  box.appendChild(el('<div id="barDraft"></div>'));
  box.querySelector('#barDraft').appendChild(barDraft());

  const t = Store.draft.theme;
  const kiri = el(`<div class="panel" style="margin:0">
    <div class="panel-kepala"><h3>Palet Warna & Tipografi</h3><span class="ket">berlaku ke seluruh halaman</span></div>
    <div class="panel-isi" id="mt"></div></div>`);
  Object.entries(t).forEach(([k, v]) => kiri.querySelector('#mt').appendChild(medan(k, v, `theme.${k}`, bisa, bisa)));

  const s = Store.draft.situs;
  const kanan = el(`<div class="panel" style="margin:0">
    <div class="panel-kepala"><h3>Identitas & Kontak</h3><span class="ket">header, footer, halaman kontak</span></div>
    <div class="panel-isi" id="ms"></div></div>`);
  Object.entries(s).forEach(([k, v]) =>
    kanan.querySelector('#ms').appendChild(medan(k, v, `situs.${k}`, RBAC.can(U, 'cms.page.edit'), RBAC.can(U, 'cms.media.upload'))));

  /* pratinjau langsung palet */
  const pra = el(`<div class="panel"><div class="panel-kepala"><h3>Pratinjau Palet</h3>
    <span class="ket">warna draft, belum tentu sama dengan yang tayang</span></div>
    <div class="panel-isi" style="display:flex;gap:12px;flex-wrap:wrap">
      ${[['hijauTua', 'Hijau Tua'], ['hijau', 'Hijau'], ['hijauMuda', 'Hijau Muda'], ['oranye', 'Oranye'], ['krem', 'Krem'], ['teks', 'Teks']]
        .map(([k, l]) => `<div style="text-align:center">
          <div style="width:78px;height:56px;border-radius:11px;background:${t[k]};border:1px solid var(--e-garis)"></div>
          <div style="font-size:11.4px;margin-top:6px;font-weight:700">${l}</div>
          <div style="font-size:10.5px;color:var(--e-abu);font-family:monospace">${t[k]}</div>
        </div>`).join('')}
    </div></div>`);
  box.appendChild(pra);

  const g = el('<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start"></div>');
  if (window.innerWidth < 1100) g.style.gridTemplateColumns = '1fr';
  g.append(kiri, kanan);
  box.appendChild(g);
  return box;
};
HAL.tema.judul = () => ['Tema & Identitas', 'Warna, font, logo, dan data kontak organisasi.'];

/* ============================================================
   PERSETUJUAN
   ============================================================ */
HAL.pengajuan = () => {
  const box = el('<div></div>');
  const bisaSetuju = RBAC.can(U, 'cms.approve');
  box.appendChild(el('<div id="barDraft"></div>'));
  box.querySelector('#barDraft').appendChild(barDraft());

  box.appendChild(el(`<div class="notis ${bisaSetuju ? 'notis-hijau' : 'notis-info'}">${I.perisai}<div>
    <b>${bisaSetuju ? 'Anda pemegang kunci publikasi' : 'Alur persetujuan dua tahap'}</b>
    ${bisaSetuju
      ? 'Perubahan website hanya tayang setelah Anda menyetujuinya di halaman ini. Setiap keputusan tercatat pada log aktivitas.'
      : 'Perubahan yang Anda buat masuk ke draft, lalu ditinjau Ketua Umum sebelum tayang di website publik.'}
  </div></div>`));

  const daftar = Store.db.pengajuan;
  if (!daftar.length) {
    box.appendChild(el(`<div class="panel"><div class="kosong-erp">${I.kotak}<p>Belum ada pengajuan</p><small>Ubah sesuatu di Editor Halaman, lalu ajukan untuk ditinjau.</small></div></div>`));
    return box;
  }

  daftar.forEach((p) => {
    const lenc = p.status === 'menunggu' ? '<span class="lencana l-kuning">Menunggu Keputusan</span>'
      : p.status === 'disetujui' ? '<span class="lencana l-hijau">Disetujui & Tayang</span>'
        : '<span class="lencana l-merah">Dikembalikan</span>';
    const n = el(`<div class="panel">
      <div class="panel-kepala">
        <h3>${p.jumlahPerubahan} perubahan</h3>${lenc}
        <span class="ket">oleh ${esc(p.olehNama)} · ${esc(RBAC.roleLabel(p.olehRole))} · ${tglJam(p.ts)}</span>
        <div class="kanan">
          <button class="btn btn-garis btn-kecil" data-rinci>${I.mata} Rincian</button>
          ${p.status === 'menunggu' && bisaSetuju ? `
            <button class="btn btn-merah btn-kecil" data-tolak>Kembalikan</button>
            <button class="btn btn-lime btn-kecil" data-setuju>${I.cek} Setujui & Tayangkan</button>` : ''}
        </div>
      </div>
      <div class="panel-isi">
        <p style="margin:0 0 10px;font-size:13.4px"><b>Catatan pengaju:</b> ${esc(p.catatan)}</p>
        ${p.status !== 'menunggu' ? `<p style="margin:0;font-size:13px;color:var(--e-abu)">
          <b>${p.status === 'disetujui' ? 'Disetujui' : 'Dikembalikan'} oleh ${esc(p.reviewerNama)}</b> · ${tglJam(p.tsReview)}
          ${p.catatanReview ? '<br>Catatan: ' + esc(p.catatanReview) : ''}</p>` : ''}
      </div>
    </div>`);

    n.querySelector('[data-rinci]').onclick = () => modal({
      judul: `Rincian ${p.jumlahPerubahan} Perubahan`, lebar: true,
      isi: `<div class="diff" style="max-height:none">${p.ringkasan.map(rowDiff).join('')}
        ${p.jumlahPerubahan > p.ringkasan.length ? `<div class="diff-baris" style="color:var(--e-abu)">…dan ${p.jumlahPerubahan - p.ringkasan.length} perubahan lain.</div>` : ''}</div>`,
    });

    n.querySelector('[data-setuju]')?.addEventListener('click', () => {
      konfirmasi('Setujui & tayangkan', `${p.jumlahPerubahan} perubahan akan langsung terlihat oleh pengunjung website. Versi lama tetap tersimpan dan dapat dikembalikan.`,
        () => aman(() => { Store.setujui(U, p.id, ''); toast('Perubahan berhasil ditayangkan.'); gambar(); }), 'Setujui & Tayangkan', false);
    });

    n.querySelector('[data-tolak]')?.addEventListener('click', () => {
      const isi = el(`<div class="grup"><label>Alasan pengembalian <span style="color:var(--e-merah)">*</span></label>
        <textarea id="al" placeholder="Contoh: Foto hero terlalu gelap, mohon diganti dengan versi yang lebih terang."></textarea>
        <div class="bantu">Draft pengaju tidak dihapus, sehingga ia dapat langsung memperbaikinya.</div></div>`);
      const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
        <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-merah" data-k>Kembalikan Pengajuan</button></div>`);
      modal({ judul: 'Kembalikan untuk Diperbaiki', isi, kaki });
      kaki.querySelector('[data-b]').onclick = tutupModal;
      kaki.querySelector('[data-k]').onclick = () => aman(() => {
        Store.tolak(U, p.id, isi.querySelector('#al').value.trim());
        tutupModal(); toast('Pengajuan dikembalikan kepada pengaju.'); gambar();
      });
    });
    box.appendChild(n);
  });
  return box;
};
HAL.pengajuan.judul = () => ['Persetujuan Perubahan', 'Gerbang antara draft dan website publik.'];

/* ============================================================
   RIWAYAT VERSI
   ============================================================ */
HAL.versi = () => {
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Setiap publikasi tersimpan sebagai versi</b>
    Bila terjadi kekeliruan, website dapat dikembalikan ke versi mana pun di bawah ini tanpa kehilangan data lain.
  </div></div></div>`);
  const p = el(`<div class="panel"><div class="tabel-bungkus"><table>
    <thead><tr><th>Waktu</th><th>Catatan</th><th>Diajukan</th><th>Disetujui</th><th></th></tr></thead>
    <tbody></tbody></table></div></div>`);
  const tb = p.querySelector('tbody');
  Store.db.versi.forEach((v, i) => {
    const tr = el(`<tr>
      <td><b>${tglJam(v.ts)}</b>${i === 0 ? ' <span class="lencana l-hijau">Tayang</span>' : ''}</td>
      <td>${esc(v.catatan)}</td>
      <td>${esc(v.olehNama)}</td>
      <td>${esc(v.disetujuiOleh || '—')}</td>
      <td class="aksi-sel">${i === 0 ? '' : `<button class="btn btn-garis btn-kecil">${I.putar} Kembalikan</button>`}</td>
    </tr>`);
    tr.querySelector('button')?.addEventListener('click', () => konfirmasi('Kembalikan ke versi ini',
      `Website akan dikembalikan ke kondisi ${tglJam(v.ts)}. Draft yang belum diajukan akan tertimpa.`,
      () => aman(() => { Store.rollback(U, v.id); toast('Website dikembalikan ke versi terpilih.'); gambar(); }), 'Ya, kembalikan'));
    tb.appendChild(tr);
  });
  box.appendChild(p);
  return box;
};
HAL.versi.judul = () => ['Riwayat Versi', 'Arsip publikasi dan pemulihan website.'];

/* ============================================================
   KARYA TULIS ILMIAH
   ============================================================ */
const STATUS_ART = {
  draft:  { l: 'Draft',            c: 'l-abu' },
  review: { l: 'Menunggu Tinjauan', c: 'l-kuning' },
  revisi: { l: 'Perlu Revisi',      c: 'l-merah' },
  terbit: { l: 'Terbit',            c: 'l-hijau' },
};

HAL.artikel = () => {
  const bisaTinjau = RBAC.can(U, 'artikel.review');
  const box = el('<div></div>');

  box.appendChild(el(`<div class="notis notis-info">${I.info}<div>
    <b>Alur karya tulis</b>
    Anggota menulis <b>Draft</b> → kirim untuk <b>Tinjauan</b> → PJ Karya Tulis Ilmiah menyetujui (<b>Terbit</b>) atau mengembalikan (<b>Perlu Revisi</b>). Hanya artikel berstatus Terbit yang muncul di halaman Artikel.
  </div></div>`));

  const kepala = el(`<div class="panel-kepala" style="background:#fff;border:1px solid var(--e-garis);border-radius:var(--e-radius);margin-bottom:18px">
    <h3>${bisaTinjau ? 'Seluruh Artikel' : 'Artikel Tulisan Anda'}</h3>
    <div class="kanan">
      <select id="fStatus" style="width:190px"><option value="">Semua Status</option>
        ${Object.entries(STATUS_ART).map(([k, v]) => `<option value="${k}">${v.l}</option>`).join('')}</select>
      ${RBAC.can(U, 'artikel.write') ? `<button class="btn btn-lime btn-kecil" id="btnBaru">${I.tambah} Tulis Artikel</button>` : ''}
    </div></div>`);
  box.appendChild(kepala);

  const wadah = el('<div></div>');
  box.appendChild(wadah);

  function gambarDaftar() {
    const f = kepala.querySelector('#fStatus').value;
    const data = Store.db.artikel
      .filter((a) => bisaTinjau || a.penulisId === U.id)
      .filter((a) => !f || a.status === f);

    if (!data.length) {
      wadah.innerHTML = `<div class="panel"><div class="kosong-erp">${I.kotak}<p>Belum ada artikel</p><small>Mulai dengan menekan "Tulis Artikel".</small></div></div>`;
      return;
    }
    wadah.innerHTML = '';
    data.forEach((a) => {
      const st = STATUS_ART[a.status];
      const milikSaya = a.penulisId === U.id;
      const n = el(`<div class="panel">
        <div class="panel-kepala">
          <img src="${a.cover}" style="width:56px;height:42px;border-radius:8px;object-fit:cover">
          <div style="min-width:0;flex:1">
            <h3 style="margin-bottom:2px">${esc(a.judul)}</h3>
            <span class="ket">${esc(Store.namaUser(a.penulisId))} · ${esc(a.kategori)} · ${tgl(a.tanggal)}${a.status === 'terbit' ? ` · ${a.dilihat}x dibaca` : ''}</span>
          </div>
          <span class="lencana ${st.c}">${st.l}</span>
          <div class="kanan" data-aksi></div>
        </div>
        ${a.reviewNote ? `<div class="panel-isi" style="padding-top:14px;padding-bottom:14px">
          <div class="notis notis-merah" style="margin:0">${I.peringatan}<div><b>Catatan peninjau</b>${esc(a.reviewNote)}</div></div></div>` : ''}
      </div>`);
      const aks = n.querySelector('[data-aksi]');

      const btn = (label, ikon, kelas, fn) => {
        const b = el(`<button class="btn ${kelas} btn-kecil">${ikon} ${label}</button>`);
        b.onclick = fn; aks.appendChild(b);
      };

      if (milikSaya || bisaTinjau) btn('Sunting', I.sunting, 'btn-garis', () => formArtikel(a));
      if (milikSaya && ['draft', 'revisi'].includes(a.status))
        btn('Kirim untuk Ditinjau', I.kirim, 'btn-lime', () => aman(() => {
          Store.ubahStatusArtikel(U, a.id, 'review', ''); toast('Artikel dikirim ke PJ Karya Tulis Ilmiah.'); gambarDaftar();
        }));
      if (bisaTinjau && a.status === 'review') {
        btn('Minta Revisi', I.putar, 'btn-merah', () => {
          const isi = el(`<div class="grup"><label>Catatan revisi <span style="color:var(--e-merah)">*</span></label>
            <textarea id="cr" placeholder="Contoh: Mohon lengkapi rujukan pada paragraf ketiga dan periksa transliterasi istilah Arab."></textarea></div>`);
          const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
            <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-merah" data-k>Kirim Catatan Revisi</button></div>`);
          modal({ judul: 'Minta Revisi', isi, kaki });
          kaki.querySelector('[data-b]').onclick = tutupModal;
          kaki.querySelector('[data-k]').onclick = () => aman(() => {
            Store.ubahStatusArtikel(U, a.id, 'revisi', isi.querySelector('#cr').value.trim());
            tutupModal(); toast('Catatan revisi dikirim ke penulis.'); gambarDaftar();
          });
        });
        btn('Setujui & Terbitkan', I.cek, 'btn-lime', () => konfirmasi('Terbitkan artikel',
          'Artikel akan langsung muncul di halaman Artikel website publik.',
          () => aman(() => { Store.ubahStatusArtikel(U, a.id, 'terbit', ''); toast('Artikel terbit di website.'); gambarDaftar(); }), 'Terbitkan', false));
      }
      if (bisaTinjau && a.status === 'terbit')
        btn('Tarik ke Draft', I.putar, 'btn-garis', () => konfirmasi('Tarik artikel',
          'Artikel akan disembunyikan dari website dan kembali berstatus draft.',
          () => aman(() => { Store.ubahStatusArtikel(U, a.id, 'draft', ''); toast('Artikel ditarik dari website.'); gambarDaftar(); })));
      if (milikSaya || bisaTinjau)
        btn('', I.hapus, 'btn-merah btn-ikon', () => konfirmasi('Hapus artikel', `"${a.judul}" akan dihapus permanen.`,
          () => aman(() => { Store.hapusArtikel(U, a.id); toast('Artikel dihapus.'); gambarDaftar(); })));

      wadah.appendChild(n);
    });
  }

  kepala.querySelector('#fStatus').onchange = gambarDaftar;
  kepala.querySelector('#btnBaru')?.addEventListener('click', () => formArtikel(null));
  gambarDaftar();
  return box;
};
HAL.artikel.judul = () => ['Karya Tulis Ilmiah', RBAC.can(U, 'artikel.review') ? 'Koordinasi penulis, tinjauan, dan publikasi artikel.' : 'Tulis dan kirim karya Anda untuk ditinjau.'];

function formArtikel(a) {
  const kat = Store.cms.halaman.artikel.sections.find((s) => s.tipe === 'daftar-artikel')?.data.kategori || [];
  const isi = el(`<div>
    <div class="grup"><label>Judul Artikel</label><input id="j" value="${esc(a?.judul || '')}" placeholder="Judul lengkap artikel"></div>
    <div class="grid-form">
      <div class="grup"><label>Kategori</label><select id="k">${kat.map((x) => `<option ${a?.kategori === x ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></div>
      <div class="grup"><label>Tag (pisahkan dengan koma)</label><input id="t" value="${esc((a?.tag || []).join(', '))}" placeholder="Balaghah, Tafsir Modern"></div>
    </div>
    <div class="grup"><label>Ringkasan</label><textarea id="r" style="min-height:70px" placeholder="Dua sampai tiga kalimat yang merangkum isi artikel.">${esc(a?.ringkas || '')}</textarea></div>
    <div class="grup"><label>Isi Artikel</label>
      <textarea id="i" style="min-height:250px" placeholder="Tulis isi artikel. Pisahkan antar paragraf dengan satu baris kosong.">${esc((a?.isi || []).join('\n\n'))}</textarea>
      <div class="bantu">Satu baris kosong = paragraf baru.</div></div>
    <div class="grup"><label>Gambar Sampul</label>
      <div class="pratinjau-gambar">
        <img id="pv" src="${a?.cover || window.__ph('ARTIKEL BARU', '#1B5E20', '#0E2E1C', 'مقال')}">
        <div style="flex:1"><p style="margin:0 0 10px;font-size:12.4px;color:var(--e-abu)">Rasio 4:3 disarankan.</p>
        <label class="btn btn-garis btn-kecil" style="display:inline-flex;cursor:pointer;margin:0">${I.gambar} Pilih Gambar<input type="file" accept="image/*" hidden id="fc"></label></div>
      </div></div>
  </div>`);

  let cover = a?.cover || window.__ph('ARTIKEL BARU', '#1B5E20', '#0E2E1C', 'مقال');
  isi.querySelector('#fc').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { cover = await Store.unggahGambar(f, 1000); isi.querySelector('#pv').src = cover; }
    catch (err) { toast(err.message, true); }
  };

  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: a ? 'Sunting Artikel' : 'Tulis Artikel Baru', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const judul = isi.querySelector('#j').value.trim();
    if (!judul) return toast('Judul artikel wajib diisi.', true);
    aman(() => {
      Store.simpanArtikel(U, {
        id: a?.id, judul, kategori: isi.querySelector('#k').value,
        tag: isi.querySelector('#t').value.split(',').map((s) => s.trim()).filter(Boolean),
        ringkas: isi.querySelector('#r').value.trim(),
        isi: isi.querySelector('#i').value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
        cover, slug: judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60),
      });
      tutupModal(); toast('Artikel tersimpan.'); gambar();
    });
  };
}

/* ============================================================
   JADWAL KAJIAN
   ============================================================ */
HAL.kajian = () => {
  const bisaKelola = RBAC.can(U, 'kajian.manage');
  const box = el('<div></div>');

  box.appendChild(el(`<div class="panel-kepala" style="background:#fff;border:1px solid var(--e-garis);border-radius:var(--e-radius);margin-bottom:18px">
    <h3>Jadwal & Silabus Kajian</h3>
    <span class="ket">Tatsqif (pembekalan) dan Kajian Reguler Level 1–3</span>
    <div class="kanan">${bisaKelola ? `<button class="btn btn-lime btn-kecil" id="bk">${I.tambah} Jadwalkan Kajian</button>` : ''}</div>
  </div>`));
  box.querySelector('#bk')?.addEventListener('click', () => formKajian(null));

  const urut = [...Store.db.kajian].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  if (!urut.length) box.appendChild(el(`<div class="panel"><div class="kosong-erp">${I.kotak}<p>Belum ada jadwal kajian</p></div></div>`));

  urut.forEach((k) => {
    const hadir = k.absensi.length;
    const total = Store.db.users.filter((u) => u.status === 'aktif').length;
    const n = el(`<div class="panel">
      <div class="panel-kepala">
        <div style="width:52px;flex:none;text-align:center;background:var(--e-hijau-tua);color:#fff;border-radius:10px;padding:7px 4px">
          <div style="font-size:18px;font-weight:800;line-height:1">${new Date(k.tanggal).getDate()}</div>
          <div style="font-size:10px;opacity:.7">${new Date(k.tanggal).toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()}</div>
        </div>
        <div style="min-width:0;flex:1">
          <h3 style="margin-bottom:2px">${esc(k.judul)}</h3>
          <span class="ket">${esc(k.jam)} WK · ${esc(k.tempat)} · Pemakalah: ${esc(Store.namaUser(k.pemakalahId))}</span>
        </div>
        <span class="lencana ${k.jenis === 'tatsqif' ? 'l-kuning' : 'l-biru'}">${esc(k.level)}</span>
        <span class="lencana ${k.status === 'selesai' ? 'l-hijau' : 'l-abu'}">${k.status === 'selesai' ? 'Selesai' : 'Terjadwal'}</span>
        <div class="kanan" data-aksi></div>
      </div>
      <div class="panel-isi" style="padding-top:15px;padding-bottom:15px">
        <p style="margin:0 0 8px;font-size:13.2px"><b>Materi:</b> ${esc(k.materi)}</p>
        <p style="margin:0;font-size:13.2px"><b>Kehadiran:</b> ${hadir} dari ${total} anggota aktif
        ${k.notulensi ? `<br><b>Notulensi:</b> <span style="color:var(--e-abu)">${esc(k.notulensi.slice(0, 170))}${k.notulensi.length > 170 ? '…' : ''}</span>` : ''}</p>
      </div>
    </div>`);
    const aks = n.querySelector('[data-aksi]');
    const btn = (l, ik, kls, fn) => { const b = el(`<button class="btn ${kls} btn-kecil">${ik} ${l}</button>`); b.onclick = fn; aks.appendChild(b); };

    if (RBAC.can(U, 'kajian.attendance')) btn('Absensi', I.grup, 'btn-garis', () => dialogAbsensi(k));
    if (RBAC.can(U, 'kajian.notulensi')) btn('Notulensi', I.dok, 'btn-garis', () => dialogNotulensi(k));
    if (bisaKelola) {
      btn('', I.sunting, 'btn-garis btn-ikon', () => formKajian(k));
      btn('', I.hapus, 'btn-merah btn-ikon', () => konfirmasi('Hapus jadwal', `"${k.judul}" akan dihapus.`,
        () => aman(() => { Store.hapusKajian(U, k.id); toast('Jadwal dihapus.'); gambar(); })));
    }
    box.appendChild(n);
  });
  return box;
};
HAL.kajian.judul = () => ['Jadwal Kajian', 'Perencanaan kajian, penugasan pemakalah, absensi, dan notulensi.'];

function formKajian(k) {
  const anggota = Store.db.users.filter((u) => u.status === 'aktif');
  const opt = (sel) => anggota.map((u) => `<option value="${u.id}" ${sel === u.id ? 'selected' : ''}>${esc(u.nama)}</option>`).join('');
  const isi = el(`<div>
    <div class="grup"><label>Judul / Tema Kajian</label><input id="j" value="${esc(k?.judul || '')}" placeholder="Contoh: Nuzul al-Quran & Tahapan Penurunannya"></div>
    <div class="grid-form">
      <div class="grup"><label>Jenis Kajian</label><select id="jn">
        <option value="tatsqif" ${k?.jenis === 'tatsqif' ? 'selected' : ''}>Pembekalan Intensif (Tatsqif)</option>
        <option value="reguler" ${k?.jenis === 'reguler' ? 'selected' : ''}>Kajian Reguler (Makalah)</option></select></div>
      <div class="grup"><label>Jenjang</label><select id="lv">
        ${['Tatsqif', 'Level 1', 'Level 2', 'Level 3'].map((x) => `<option ${k?.level === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    </div>
    <div class="grid-form-3">
      <div class="grup"><label>Tanggal</label><input type="date" id="tg" value="${k?.tanggal || ''}"></div>
      <div class="grup"><label>Waktu</label><input type="time" id="jm" value="${k?.jam || '19:30'}"></div>
      <div class="grup"><label>Tempat</label><input id="tp" value="${esc(k?.tempat || 'Sekretariat IKPM Kairo')}"></div>
    </div>
    <div class="grid-form">
      <div class="grup"><label>Pemakalah</label><select id="pm">${opt(k?.pemakalahId)}</select></div>
      <div class="grup"><label>Moderator</label><select id="md">${opt(k?.moderatorId)}</select></div>
    </div>
    <div class="grup"><label>Materi / Rujukan</label><textarea id="mt" style="min-height:80px">${esc(k?.materi || '')}</textarea></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan Jadwal</button></div>`);
  modal({ judul: k ? 'Ubah Jadwal Kajian' : 'Jadwalkan Kajian Baru', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const g = (id) => isi.querySelector('#' + id).value;
    if (!g('j').trim() || !g('tg')) return toast('Judul dan tanggal wajib diisi.', true);
    aman(() => {
      Store.simpanKajian(U, {
        id: k?.id, judul: g('j').trim(), jenis: g('jn'), level: g('lv'), tanggal: g('tg'),
        jam: g('jm'), tempat: g('tp'), pemakalahId: g('pm'), moderatorId: g('md'), materi: g('mt'),
      });
      tutupModal(); toast('Jadwal kajian tersimpan.'); gambar();
    });
  };
}

function dialogAbsensi(k) {
  const anggota = Store.db.users.filter((u) => u.status === 'aktif');
  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.4px;color:var(--e-abu)">Centang anggota yang hadir pada kajian <b>${esc(k.judul)}</b>.</p>
    <div class="grid-absen">${anggota.map((u) => `<label class="absen-item ${k.absensi.includes(u.id) ? 'hadir' : ''}">
      <input type="checkbox" value="${u.id}" ${k.absensi.includes(u.id) ? 'checked' : ''}>
      <img src="${u.foto}"><span>${esc(u.nama)}</span></label>`).join('')}</div>
    <p style="margin:16px 0 0;font-size:13px"><b id="hit">${k.absensi.length}</b> dari ${anggota.length} anggota hadir.</p>
  </div>`);
  isi.querySelectorAll('.absen-item input').forEach((c) => c.onchange = () => {
    c.closest('.absen-item').classList.toggle('hadir', c.checked);
    isi.querySelector('#hit').textContent = isi.querySelectorAll('input:checked').length;
  });
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan Absensi</button></div>`);
  modal({ judul: 'Absensi Kehadiran', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => aman(() => {
    Store.setAbsensi(U, k.id, [...isi.querySelectorAll('input:checked')].map((c) => c.value));
    tutupModal(); toast('Absensi tersimpan.'); gambar();
  });
}

function dialogNotulensi(k) {
  const isi = el(`<div class="grup"><label>Notulensi / Risalah Kajian</label>
    <textarea id="n" style="min-height:220px" placeholder="Ringkasan pembahasan, poin diskusi penting, dan kesimpulan kajian.">${esc(k.notulensi || '')}</textarea>
    <div class="bantu">Mengisi notulensi otomatis menandai kajian sebagai selesai.</div></div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan Notulensi</button></div>`);
  modal({ judul: `Notulensi — ${k.judul}`, isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => aman(() => {
    Store.setNotulensi(U, k.id, isi.querySelector('#n').value);
    tutupModal(); toast('Notulensi tersimpan.'); gambar();
  });
}

/* ============================================================
   DATA ANGGOTA
   ============================================================ */
HAL.anggota = () => {
  const box = el(`<div><div class="panel-kepala" style="background:#fff;border:1px solid var(--e-garis);border-radius:var(--e-radius);margin-bottom:18px">
    <h3>Data Keanggotaan</h3><span class="ket">${Store.db.users.length} orang terdaftar</span>
    <div class="kanan"><button class="btn btn-lime btn-kecil" id="ba">${I.tambah} Tambah Anggota</button></div></div></div>`);
  box.querySelector('#ba').onclick = () => formAnggota(null);

  const p = el(`<div class="panel"><div class="tabel-bungkus"><table>
    <thead><tr><th>Nama</th><th>Jabatan / Role</th><th>Angkatan</th><th>Jenjang</th><th>Status</th><th></th></tr></thead>
    <tbody></tbody></table></div></div>`);
  const tb = p.querySelector('tbody');
  Store.db.users.forEach((u) => {
    const tr = el(`<tr>
      <td><div style="display:flex;align-items:center;gap:11px">
        <img src="${u.foto}" style="width:36px;height:36px;border-radius:50%">
        <div><b>${esc(u.nama)}</b><br><span style="color:var(--e-abu);font-size:12px">${esc(u.email)}</span></div></div></td>
      <td><span class="lencana" style="background:${RBAC.roleColor(u.role)}22;color:${RBAC.roleColor(u.role)}">${esc(RBAC.roleLabel(u.role))}</span></td>
      <td>${esc(u.angkatan)}</td><td>${esc(u.level)}</td>
      <td><span class="lencana ${u.status === 'aktif' ? 'l-hijau' : u.status === 'alumni' ? 'l-biru' : 'l-abu'}">${esc(u.status)}</span></td>
      <td class="aksi-sel"><button class="btn btn-garis btn-ikon">${I.sunting}</button></td>
    </tr>`);
    tr.querySelector('button').onclick = () => formAnggota(u);
    tb.appendChild(tr);
  });
  box.appendChild(p);
  return box;
};
HAL.anggota.judul = () => ['Data Anggota', 'Keanggotaan, jenjang kajian, dan penetapan jabatan.'];

function formAnggota(u) {
  const bisaRole = RBAC.can(U, 'user.manage');
  const isi = el(`<div>
    <div class="grid-form">
      <div class="grup"><label>Nama Lengkap</label><input id="n" value="${esc(u?.nama || '')}"></div>
      <div class="grup"><label>Email</label><input type="email" id="e" value="${esc(u?.email || '')}"></div>
    </div>
    <div class="grid-form-3">
      <div class="grup"><label>Angkatan</label><input id="a" value="${esc(u?.angkatan || '')}" placeholder="Angkatan XII"></div>
      <div class="grup"><label>Jenjang</label><select id="l">${['Tatsqif', 'Level 1', 'Level 2', 'Level 3', 'Alumni', '-'].map((x) => `<option ${u?.level === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="grup"><label>Status</label><select id="s">${['aktif', 'nonaktif', 'alumni'].map((x) => `<option ${u?.status === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    </div>
    <div class="grid-form">
      <div class="grup"><label>Jabatan / Role ERP</label>
        <select id="r" ${bisaRole ? '' : 'disabled'}>${Object.entries(RBAC.ROLES).map(([k, v]) => `<option value="${k}" ${u?.role === k ? 'selected' : ''}>${esc(v.label)}</option>`).join('')}</select>
        <div class="bantu">${bisaRole ? 'Menentukan menu dan wewenang orang ini di ERP.' : 'Hanya Ketua Umum yang dapat mengubah role.'}</div></div>
      <div class="grup"><label>Kategori Tampil di Website</label>
        <select id="kt">${['pendiri', 'anggota', 'alumni'].map((x) => `<option ${u?.kategori === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    </div>
    <div class="grup"><label>Riwayat Pendidikan</label><input id="p" value="${esc(u?.pendidikan || '')}" placeholder="S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo"></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: u ? 'Ubah Data Anggota' : 'Tambah Anggota Baru', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const g = (id) => isi.querySelector('#' + id).value;
    if (!g('n').trim() || !g('e').trim()) return toast('Nama dan email wajib diisi.', true);
    aman(() => {
      Store.simpanAnggota(U, {
        id: u?.id, nama: g('n').trim(), email: g('e').trim(), angkatan: g('a'), level: g('l'),
        status: g('s'), role: g('r'), kategori: g('kt'), pendidikan: g('p'),
      });
      tutupModal(); toast('Data anggota tersimpan.'); gambar();
    });
  };
}

/* ============================================================
   KOTAK MASUK
   ============================================================ */
HAL.pesan = () => {
  const box = el('<div></div>');
  const d = Store.db.pesan;
  if (!d.length) { box.appendChild(el(`<div class="panel"><div class="kosong-erp">${I.kotak}<p>Kotak masuk kosong</p><small>Pesan dari form kontak website akan muncul di sini.</small></div></div>`)); return box; }
  d.forEach((p) => {
    const n = el(`<div class="panel" style="${p.dibaca ? '' : 'border-left:3px solid var(--e-oranye)'}">
      <div class="panel-kepala">
        <h3>${esc(p.subjek)}</h3>
        ${p.dibaca ? '' : '<span class="lencana l-kuning">Baru</span>'}
        <span class="ket">${esc(p.nama)} &lt;${esc(p.email)}&gt; · ${tgl(p.tanggal)}</span>
        <div class="kanan">
          <a class="btn btn-garis btn-kecil" href="mailto:${esc(p.email)}?subject=Re: ${encodeURIComponent(p.subjek)}">Balas via Email</a>
          ${p.dibaca ? '' : '<button class="btn btn-kecil" data-b>Tandai Dibaca</button>'}
        </div>
      </div>
      <div class="panel-isi"><p style="margin:0;font-size:13.6px">${esc(p.isi)}</p></div>
    </div>`);
    n.querySelector('[data-b]')?.addEventListener('click', () => aman(() => { Store.tandaiDibaca(U, p.id); gambar(); }));
    box.appendChild(n);
  });
  return box;
};
HAL.pesan.judul = () => ['Kotak Masuk', 'Pesan yang dikirim melalui form kontak website.'];

/* ============================================================
   ARSIP SURAT
   ============================================================ */
HAL.surat = () => {
  const p = el(`<div class="panel"><div class="panel-kepala"><h3>Arsip Surat Masuk & Keluar</h3>
    <span class="ket">${Store.db.surat.length} dokumen terarsip</span></div>
    <div class="tabel-bungkus"><table>
    <thead><tr><th>Nomor</th><th>Jenis</th><th>Perihal</th><th>Tujuan / Asal</th><th>Tanggal</th><th>Status</th></tr></thead>
    <tbody>${Store.db.surat.map((s) => `<tr>
      <td><b>${esc(s.nomor)}</b></td>
      <td><span class="lencana ${s.jenis === 'masuk' ? 'l-biru' : 'l-hijau'}">${esc(s.jenis)}</span></td>
      <td>${esc(s.perihal)}</td><td>${esc(s.tujuan)}</td><td>${tgl(s.tanggal)}</td>
      <td><span class="lencana l-abu">${esc(s.status)}</span></td></tr>`).join('')}</tbody>
    </table></div></div>`);
  return p;
};
HAL.surat.judul = () => ['Arsip Surat', 'Administrasi persuratan organisasi.'];

/* ============================================================
   KEUANGAN
   ============================================================ */
HAL.keuangan = () => {
  const d = Store.db.keuangan;
  const masuk = d.filter((t) => t.jenis === 'masuk').reduce((s, t) => s + t.nominal, 0);
  const keluar = d.filter((t) => t.jenis === 'keluar').reduce((s, t) => s + t.nominal, 0);
  const bisa = RBAC.can(U, 'keuangan.manage');

  const box = el(`<div>
    <div style="display:grid;grid-template-columns:1fr;gap:16px;margin-bottom:20px">
      <div class="saldo-kartu">
        <div class="saldo-label">Saldo Kas Kajian Al-I'jaz</div>
        <div class="saldo-nilai">${rp(masuk - keluar)}</div>
        <div class="saldo-rinci">
          <div><span>Total Pemasukan</span><b style="color:#B8E986">${rp(masuk)}</b></div>
          <div><span>Total Pengeluaran</span><b style="color:#FFB4AE">${rp(keluar)}</b></div>
          <div><span>Jumlah Transaksi</span><b>${d.length}</b></div>
        </div>
      </div>
    </div>
    <div class="panel-kepala" style="background:#fff;border:1px solid var(--e-garis);border-radius:var(--e-radius);margin-bottom:18px">
      <h3>Buku Kas</h3><span class="ket">${bisa ? 'Anda dapat mencatat transaksi' : 'Mode baca saja — pencatatan oleh Bendahara'}</span>
      <div class="kanan">${bisa ? `<button class="btn btn-lime btn-kecil" id="bt">${I.tambah} Catat Transaksi</button>` : ''}</div>
    </div>
  </div>`);
  box.querySelector('#bt')?.addEventListener('click', () => formTransaksi(null));

  const p = el(`<div class="panel"><div class="tabel-bungkus"><table>
    <thead><tr><th>Tanggal</th><th>Kategori</th><th>Keterangan</th><th style="text-align:right">Masuk</th><th style="text-align:right">Keluar</th>${bisa ? '<th></th>' : ''}</tr></thead>
    <tbody></tbody></table></div></div>`);
  const tb = p.querySelector('tbody');
  [...d].sort((a, b) => b.tanggal.localeCompare(a.tanggal)).forEach((t) => {
    const tr = el(`<tr>
      <td>${tgl(t.tanggal)}</td>
      <td><span class="lencana ${t.jenis === 'masuk' ? 'l-hijau' : 'l-merah'}">${esc(t.kategori)}</span></td>
      <td>${esc(t.ket)}</td>
      <td style="text-align:right;color:#4A7A1E;font-weight:700">${t.jenis === 'masuk' ? rp(t.nominal) : '—'}</td>
      <td style="text-align:right;color:#B23E37;font-weight:700">${t.jenis === 'keluar' ? rp(t.nominal) : '—'}</td>
      ${bisa ? `<td class="aksi-sel"><button class="btn btn-garis btn-ikon" data-e>${I.sunting}</button><button class="btn btn-merah btn-ikon" data-h>${I.hapus}</button></td>` : ''}
    </tr>`);
    tr.querySelector('[data-e]')?.addEventListener('click', () => formTransaksi(t));
    tr.querySelector('[data-h]')?.addEventListener('click', () => konfirmasi('Hapus transaksi', `"${t.ket}" akan dihapus dari buku kas.`,
      () => aman(() => { Store.hapusTransaksi(U, t.id); toast('Transaksi dihapus.'); gambar(); })));
    tb.appendChild(tr);
  });
  box.appendChild(p);
  return box;
};
HAL.keuangan.judul = () => ['Kas & Iuran', 'Pencatatan pemasukan, pengeluaran, dan saldo organisasi.'];

function formTransaksi(t) {
  const isi = el(`<div>
    <div class="grid-form">
      <div class="grup"><label>Jenis</label><select id="j">
        <option value="masuk" ${t?.jenis === 'masuk' ? 'selected' : ''}>Kas Masuk</option>
        <option value="keluar" ${t?.jenis === 'keluar' ? 'selected' : ''}>Kas Keluar</option></select></div>
      <div class="grup"><label>Tanggal</label><input type="date" id="tg" value="${t?.tanggal || new Date().toISOString().slice(0, 10)}"></div>
    </div>
    <div class="grid-form">
      <div class="grup"><label>Kategori</label><input id="k" value="${esc(t?.kategori || '')}" list="katList" placeholder="Iuran Anggota">
        <datalist id="katList">${['Iuran Anggota', 'Donasi', 'Konsumsi Kajian', 'Cetak & ATK', 'Operasional Web', 'Transport', 'Lainnya'].map((x) => `<option>${x}</option>`).join('')}</datalist></div>
      <div class="grup"><label>Nominal (Rp)</label><input type="number" id="n" value="${t?.nominal || ''}" min="0" placeholder="0"></div>
    </div>
    <div class="grup"><label>Keterangan</label><textarea id="ket" style="min-height:70px">${esc(t?.ket || '')}</textarea></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: t ? 'Ubah Transaksi' : 'Catat Transaksi Baru', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const g = (id) => isi.querySelector('#' + id).value;
    if (!g('k').trim() || !Number(g('n'))) return toast('Kategori dan nominal wajib diisi.', true);
    aman(() => {
      Store.simpanTransaksi(U, { id: t?.id, jenis: g('j'), tanggal: g('tg'), kategori: g('k').trim(), nominal: Number(g('n')), ket: g('ket') });
      tutupModal(); toast('Transaksi tercatat.'); gambar();
    });
  };
}

/* ============================================================
   HAK AKSES — matriks role × izin
   ============================================================ */
HAL.akses = () => {
  const roles = Object.entries(RBAC.ROLES);
  const izin = Object.entries(RBAC.PERMISSIONS);
  const box = el(`<div><div class="notis notis-info">${I.perisai}<div>
    <b>Prinsip pemisahan wewenang</b>
    PJ Website dapat mengubah seluruh tampilan, namun tidak dapat menayangkannya. Ketua Umum memegang izin <code>cms.approve</code>. Dengan begitu tidak ada satu orang pun yang bisa mengubah wajah website publik seorang diri.
  </div></div></div>`);

  box.appendChild(el(`<div class="panel"><div class="panel-kepala"><h3>Ringkasan Peran</h3></div>
    <div class="panel-isi" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:13px">
      ${roles.map(([k, v]) => `<div style="border:1px solid var(--e-garis);border-radius:12px;padding:15px;border-left:3px solid ${v.warna}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
          <b style="font-size:13.6px">${esc(v.label)}</b><span class="lencana l-abu">${esc(v.badge)}</span></div>
        <div style="font-size:12.4px;color:var(--e-abu);margin-bottom:9px">${esc(v.ringkas)}</div>
        <div style="font-size:11.6px"><b>${v.permissions.length}</b> izin · ${Store.db.users.filter((u) => u.role === k).length} orang</div>
      </div>`).join('')}
    </div></div>`));

  box.appendChild(el(`<div class="panel"><div class="panel-kepala"><h3>Matriks Hak Akses</h3>
    <span class="ket">${izin.length} izin × ${roles.length} peran</span></div>
    <div class="tabel-bungkus"><table class="matriks">
      <thead><tr><th>Izin</th>${roles.map(([, v]) => `<th class="putar">${esc(v.label)}</th>`).join('')}</tr></thead>
      <tbody>${izin.map(([k, ket]) => `<tr>
        <td><b style="font-family:ui-monospace,monospace;font-size:11.4px">${esc(k)}</b><br>
          <span style="color:var(--e-abu);font-size:11.4px">${esc(ket)}</span></td>
        ${roles.map(([rk]) => `<td style="text-align:center" class="${RBAC.ROLES[rk].permissions.includes(k) ? 'cek' : 'silang'}">
          ${RBAC.ROLES[rk].permissions.includes(k) ? '✓' : '·'}</td>`).join('')}
      </tr>`).join('')}</tbody>
    </table></div></div>`));
  return box;
};
HAL.akses.judul = () => ['Hak Akses', 'Peta wewenang setiap peran dalam organisasi.'];

/* ============================================================
   LOG AKTIVITAS
   ============================================================ */
HAL.log = () => {
  const d = Store.db.audit;
  if (!d.length) return el(`<div class="panel"><div class="kosong-erp">${I.kotak}<p>Belum ada aktivitas tercatat</p></div></div>`);
  return el(`<div class="panel">
    <div class="panel-kepala"><h3>Jejak Audit</h3><span class="ket">${d.length} catatan terakhir</span></div>
    <div class="panel-isi rapat">${d.map((l) => `<div class="log">
      <span class="log-ik">${I.log}</span>
      <div><div class="log-teks">${esc(l.detail)}</div>
      <div class="log-meta">${esc(l.userNama)} · ${esc(RBAC.roleLabel(l.role))} · ${esc(l.aksi)} · ${tglJam(l.ts)}</div></div>
    </div>`).join('')}</div></div>`);
};
HAL.log.judul = () => ['Log Aktivitas', 'Seluruh tindakan tercatat untuk pertanggungjawaban.'];

/* ============================================================
   RENDER UTAMA
   ============================================================ */
function gambar() {
  const app = document.getElementById('erp');
  app.innerHTML = '';

  if (!U) { app.appendChild(layarLogin()); return; }

  const entri = MENU.find((m) => m.id === rute);
  if (entri && !bolehMenu(entri)) rute = 'dasbor';   // penjaga rute
  if (!HAL[rute]) rute = 'dasbor';

  app.appendChild(kerangka());
  const [j, s] = HAL[rute].judul();
  app.querySelector('#judulHal').textContent = j;
  app.querySelector('#subHal').textContent = s;
  app.querySelector('#isiHal').appendChild(HAL[rute]());
}

/* ---------------- mulai ---------------- */
U = Store.userAktif();
if (location.hash) rute = location.hash.slice(1);
window.addEventListener('hashchange', () => { const r = location.hash.slice(1); if (r && r !== rute) { rute = r; gambar(); } });
gambar();

/* Segarkan lonceng bila ada perubahan dari tab lain. */
Store.berlangganan(() => {
  if (!U) return;
  document.querySelectorAll('.sb-item').forEach((b) => {
    const m = MENU.find((x) => x.id === b.dataset.rute);
    const n = m?.lonceng?.() || 0;
    let lb = b.querySelector('.sb-lonceng');
    if (n && !lb) { b.appendChild(el(`<span class="sb-lonceng">${n}</span>`)); }
    else if (n && lb) lb.textContent = n;
    else if (!n && lb) lb.remove();
  });
});
