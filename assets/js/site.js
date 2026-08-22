/* ============================================================
   SITE.JS — Perender website publik
   ------------------------------------------------------------
   Halaman publik TIDAK menyimpan konten di HTML. Setiap section
   dirender dari Store.cms (versi tayang), yang kini datang dari
   server. Karena itu perubahan yang disetujui Ketua di ERP benar-benar
   terlihat oleh pengunjung — dulu ia hanya berlaku di peramban Ketua
   sendiri, dan aturan dua kunci bekerja di ruang hampa.
   ============================================================ */

/* ---------------- ikon (inline SVG) ---------------- */
const IK = {
  cari: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  menu: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  panah: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  bawah: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  tutup: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  buku: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M9 3v14"/></svg>',
  toga: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/></svg>',
  orang: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>',
  grup: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="8" r="3.4"/><path d="M2 20c0-3.4 3.2-5 7-5s7 1.6 7 5"/><path d="M17 5.3A3.4 3.4 0 0 1 17 12M18 20c0-2.4-.7-4-2-5"/></svg>',
  bintang: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.7 6.7 19.5l1.1-6L3.4 9.3l6-.8z"/></svg>',
  kalender: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  dokumen: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  rumah: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z"/></svg>',
  email: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3 7 9 6 9-6"/></svg>',
  telepon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.2 2 2 0 0 1 6 3z"/></svg>',
  pin: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  jam: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  mata: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.6"/></svg>',
  target: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></svg>',
  pena: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/></svg>',
  gembok: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4.5" y="10" width="15" height="10.5" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
  facebook: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V7.2c0-.8.2-1.2 1.4-1.2H17V3h-2.6C11.6 3 10.6 4.4 10.6 6.8V9H8.6v3h2v9h3.4v-9h2.4l.4-3z"/></svg>',
  youtube: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8M10 15V9l5.2 3z"/></svg>',
  telegram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 4.3 18.5 19c-.2 1-.9 1.3-1.8.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.4-5 9-8.1c.4-.4-.1-.6-.6-.2L6.3 12.1 1.5 10.6c-1-.3-1-1 .2-1.5l18.5-7.1c.9-.3 1.6.2 1.4 1.3z"/></svg>',
  kutip: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 20V10a6 6 0 0 1 6-6"/><path d="M4 20V10a6 6 0 0 1 6-6"/></svg>',
  kirim: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 3 10.5l7 3 3 7z"/><path d="m10 13.5 11-10.5"/></svg>',
  kotakKosong: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 8.5 12 4l9 4.5V16l-9 4.5L3 16z"/><path d="m3 8.5 9 4.5 9-4.5M12 13v7.5"/></svg>',
};
/* Ikon struktur organisasi */
const IK_ORG = {
  ketua: IK.bintang, surat: IK.dokumen, kas: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/></svg>',
  kamera: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 8h3l1.5-2.5h9L18 8h3v11.5H3z"/><circle cx="12" cy="13" r="3.6"/></svg>',
  monitor: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M9 20.5h6M12 16.5v4"/></svg>',
  pena: IK.pena, kajian: IK.buku,
};
const ikonOrg = (k) => `<span style="display:grid;place-items:center">${IK_ORG[k] || IK.orang}</span>`;

/* ---------------- util ---------------- */
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tglID = (s) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
/* Bentuk pendek untuk kartu. "1 September 2026" pecah jadi dua baris di
   kolom selebar seperempat panel, dan tanggal yang terpotong dua baris
   membuat seluruh baris meta terlihat berantakan. */
const tglPendek = (s) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

function toast(pesan, galat = false) {
  let box = document.querySelector('.toast-tempat');
  if (!box) { box = el('<div class="toast-tempat"></div>'); document.body.appendChild(box); }
  const t = el(`<div class="toast${galat ? ' galat' : ''}">${esc(pesan)}</div>`);
  box.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(28px)'; setTimeout(() => t.remove(), 300); }, 3800);
}

/* ---------------- tema: CMS -> CSS variables ---------------- */
function terapkanTema() {
  const t = Store.cms.theme, r = document.documentElement.style;
  r.setProperty('--hijau-tua', t.hijauTua);
  r.setProperty('--hijau', t.hijau);
  r.setProperty('--hijau-muda', t.hijauMuda);
  r.setProperty('--oranye', t.oranye);
  r.setProperty('--krem', t.krem);
  r.setProperty('--teks', t.teks);
  terapkanFont(t, r);
  r.setProperty('--radius', t.radius + 'px');
  r.setProperty('--lebar', t.lebarKonten + 'px');
  terapkanFavicon(Store.cms.situs.favicon);
}

/**
 * Pasang font pilihan: tumpukan CSS-nya diterapkan, berkasnya diunduh.
 * Keduanya harus berjalan bersama — menerapkan nama font tanpa
 * mengunduhnya persis kegagalan yang membuat pengaturan lama tak
 * pernah berlaku.
 */
function terapkanFont(t, r) {
  const utama = FONT.tumpuk('utama', t.fontUtama);
  /* "Sama dengan font utama" disimpan sebagai tumpukan kosong. */
  const merek = FONT.tumpuk('merek', t.fontMerek) || utama;
  r.setProperty('--font-judul', utama);
  r.setProperty('--font-merek', merek);
  r.setProperty('--font-arab', FONT.tumpuk('arab', t.fontArab));
  FONT.muat({ utama: t.fontUtama, merek: t.fontMerek, arab: t.fontArab });
}

/* ---------------- kerangka: header, footer, nav ---------------- */
/* Lambang tidak lagi ditanam di kode — ia dibaca dari CMS agar
   PJ Website dapat menggantinya lewat ERP. */
const lambang = () => `<img src="${Store.cms.situs.logo}" alt="Lambang ${esc(Store.cms.situs.nama)}">`;

/** Ganti ikon tab peramban mengikuti pengaturan CMS. */
function terapkanFavicon(url) {
  if (!url) return;
  document.querySelectorAll('link[rel~="icon"]').forEach((l) => l.remove());
  const l = document.createElement('link');
  l.rel = 'icon';
  l.href = url;
  document.head.appendChild(l);
}

function renderHeader(aktif) {
  const s = Store.cms.situs;
  const menu = s.menu.map((m) => `<a href="${esc(m.href)}" class="${m.href === aktif ? 'aktif' : ''}">${esc(m.label)}</a>`).join('');
  const h = el(`<header class="header"><div class="wrap header-in">
    <a class="merek" href="index.html">
      <span class="merek-lambang">${lambang()}</span>
      <span><span class="merek-nama">${esc(s.nama)}</span><br><span class="merek-tag">${esc(s.tagline)}</span></span>
    </a>
    <nav class="nav">${menu}</nav>
    <button class="tombol-menu" aria-label="Menu">${IK.menu}</button>
  </div></header>`);
  h.querySelector('.tombol-menu').onclick = () => {
    const n = h.querySelector('.nav');
    const buka = n.style.display === 'flex';
    Object.assign(n.style, buka ? { display: '' } : {
      display: 'flex', position: 'absolute', top: '78px', left: 0, right: 0,
      flexDirection: 'column', background: 'var(--hijau-tua)', padding: '14px',
      borderBottom: '1px solid rgba(255,255,255,.1)',
    });
  };
  return h;
}

function renderFooter() {
  const s = Store.cms.situs;
  const sos = Object.entries(s.sosmed).filter(([, v]) => v)
    .map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener" aria-label="${k}">${IK[k] || IK.email}</a>`).join('');
  return el(`<footer class="footer"><div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="merek" style="margin-bottom:14px">
          <span class="merek-lambang">${lambang()}</span>
          <span><span class="merek-nama">${esc(s.nama)}</span><br><span class="merek-tag">${esc(s.tagline)}</span></span>
        </div>
        <p>${esc(s.deskripsi)}</p>
        <div class="sosmed-baris">${sos}</div>
      </div>
      <div><h5>Navigasi</h5><ul class="footer-daftar">
        ${s.menu.map((m) => `<li><a href="${esc(m.href)}">${esc(m.label)}</a></li>`).join('')}
      </ul></div>
      <div><h5>Program</h5><ul class="footer-daftar">
        <li>Pembekalan Intensif (Tatsqif)</li>
        <li>Kajian Reguler Level 1</li>
        <li>Kajian Reguler Level 2</li>
        <li>Kajian Reguler Level 3</li>
      </ul></div>
      <div><h5>Kontak</h5><ul class="footer-daftar">
        <li>${esc(s.alamat)}</li>
        <li><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></li>
        <li>${esc(s.telepon)}</li>
        <li style="color:var(--hijau-muda);margin-top:6px">${esc(s.naungan)}</li>
      </ul></div>
    </div>
    <div class="footer-bawah">
      <span>© ${new Date().getFullYear()} ${esc(s.nama)}. Seluruh hak cipta dilindungi.</span>
      <span>Dikelola melalui <a href="erp.html" style="color:var(--hijau-muda)">ERP Kajian Al-I'jaz</a></span>
    </div>
  </div></footer>`);
}

function renderNavBawah(aktif) {
  const ikon = { 'index.html': IK.rumah, 'tentang.html': IK.buku, 'artikel.html': IK.dokumen, 'kontak.html': IK.email };
  return el(`<nav class="nav-bawah"><div class="nav-bawah-in">
    ${Store.cms.situs.menu.map((m) => `<a href="${esc(m.href)}" class="${m.href === aktif ? 'aktif' : ''}">${ikon[m.href] || IK.rumah}<span>${esc(m.label)}</span></a>`).join('')}
  </div></nav>`);
}

/* ---------------- ornamen ----------------
   Ragam hias geometris, bukan gambar: seluruhnya SVG sebaris supaya
   ikut berganti warna mengikuti tema panel dan tetap tajam di layar
   mana pun — tanpa satu pun permintaan berkas tambahan. */
const OR = {
  /* Sepasang daun, mengapit judul panel. */
  daun: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5c0 7.2-3.4 11.4-9 11.9-1.9.2-3.4-.3-4.4-1.4-1.1-1.2-1.4-2.9-.8-4.6C7.4 5.6 12.5 3.5 20.5 3.5z"/><path d="M4 20.5c1.6-3.6 4.2-6.4 7.8-8.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  /* Medalion sudut panel — samar, hanya untuk memberi tekstur. */
  medali: '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true"><circle cx="60" cy="60" r="46"/><circle cx="60" cy="60" r="33"/><circle cx="60" cy="60" r="15"/><path d="M60 6v108M6 60h108M22 22l76 76M98 22l-76 76"/><path d="M60 22l27 38-27 38-27-38z"/><path d="M22 60l38-27 38 27-38 27z"/></svg>',
  /* Tiang berhias di kedua tepi hero halaman dalam: batang tegak dengan
     rozet di pucuknya, seperti tiang lampu masjid. */
  tiang: '<svg viewBox="0 0 60 300" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M30 78v222"/><circle cx="30" cy="46" r="26"/><circle cx="30" cy="46" r="17"/><path d="M30 20l18 26-18 26-18-26z"/><path d="M4 46l26-18 26 18-26 18z"/><path d="M30 84l7 9-7 9-7-9z"/><path d="M22 300h16"/></svg>',
  /* Untaian yang menggantung dari bibir atas panel. */
  untai: '<svg viewBox="0 0 24 96" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M12 0v40"/><circle cx="12" cy="46" r="5"/><path d="M12 51v9"/><path d="M12 60l6 8-6 8-6-8z"/><path d="M12 76v8"/><circle cx="12" cy="88" r="3"/></svg>',
  /* Garis pemisah dengan wajik di tengah. */
  pemisah: '<svg viewBox="0 0 220 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M0 8h92M128 8h92"/><path d="M110 2l7 6-7 6-7-6z" fill="currentColor" stroke="none"/></svg>',
  main: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
  /* Panah lengkung bergaya tulisan tangan, menunjuk ke judul. */
  panahLengkung: '<svg viewBox="0 0 110 140" fill="none" aria-hidden="true"><path d="M28 132c30-14-6-38 20-54s6-34 26-48" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><path d="M56 4 88 24 56 42z" fill="currentColor"/></svg>',
  bagi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.4 10.8l7.2-4.2M8.4 13.2l7.2 4.2"/></svg>',
};

/* Tombol bagikan pada kartu. Ia hanya dipasang pada isi yang memang
   punya alamat sendiri — artikel lewat ?buka=, video lewat tautannya.
   Tombol berbagi yang tidak menghasilkan alamat apa pun sama saja
   dengan tombol mati. */
function pasangBagi(akar) {
  akar.querySelectorAll('[data-bagi]').forEach((b) => {
    b.onclick = async (e) => {
      e.preventDefault(); e.stopPropagation();
      const url = new URL(b.dataset.bagi, location.href).href;
      const judul = b.dataset.judul || Store.cms.situs.nama;
      try {
        if (navigator.share) { await navigator.share({ title: judul, url }); return; }
        await navigator.clipboard.writeText(url);
        toast('Tautan disalin ke papan klip.');
      } catch (_) { /* dibatalkan pengguna — bukan galat */ }
    };
  });
}

/* Ikon untuk sidebar kategori di hero. Dipetakan lewat kata kunci, bukan
   lewat urutan: nama kategori boleh diubah dan ditambah dari ERP, dan
   ikon yang tergeser satu baris karena ada kategori baru di tengah akan
   terlihat seperti kekeliruan. Yang tak dikenali memakai ikon kitab. */
function ikonKategori(nama) {
  const n = String(nama).toLowerCase();
  if (/tokoh|ulama|biografi/.test(n)) return IK.orang;
  if (/ulum|ilmu|metodolog|kaidah/.test(n)) return IK.pena;
  if (/berita|acara|kegiatan|agenda/.test(n)) return IK.kalender;
  if (/wawasan|keislaman|tematik|umum/.test(n)) return IK.target;
  return IK.buku;
}

/* Daftar kategori tinggal di satu tempat saja: section "Daftar Artikel"
   pada halaman Artikel — yang sama yang disunting lewat ERP → Kategori
   Artikel. Hero membacanya dari sana, bukan menyimpan salinannya sendiri,
   supaya menambah kategori cukup dilakukan sekali. */
function kategoriArtikel() {
  const sec = (Store.cms.halaman.artikel?.sections || [])
    .find((x) => x.tipe === 'daftar-artikel');
  return sec?.data?.kategori || [];
}


/* ---------------- kepala section ---------------- */
/**
 * Kepala bagian — bentuknya sama persis dengan kepala panel, sebab
 * itulah yang membuat seluruh halaman terbaca sebagai satu rancangan
 * alih-alih dua yang kebetulan bertetangga.
 *
 * Nomor urut dan garis bawah dilepas. Nomor pada bagian yang urutannya
 * dapat digeser dari ERP hanya menjadi janji yang tak ditepati: begitu
 * satu bagian dipindahkan, penomorannya salah dan tak ada yang
 * membetulkannya.
 */
function kepala(d) {
  return `<header class="pn-kepala">
    ${d.skrip ? `<div class="pn-label">${esc(d.skrip)}</div>` : ''}
    <h2 class="pn-judul">
      <span class="pn-hias">${OR.daun}</span>${esc(d.judul)}<span class="pn-hias">${OR.daun}</span>
    </h2>
  </header>`;
}

/**
 * Bungkus sebuah bagian ke dalam kotak panel — sudut tumpul, ragam hias
 * di keempat penjurunya, dan tema hijau atau krem berselang. Dipakai
 * bagian-bagian bercerita, sehingga ia sejajar dengan panel isi di
 * sekitarnya alih-alih tampil sebagai pita selebar layar.
 */
function panelBungkus(d, isi, kelasTambahan = '') {
  const tema = d.tema === 'hijau' ? 'hijau' : 'krem';
  return el(`<section class="panel panel-${tema} ${kelasTambahan}">
    <div class="panel-kotak">
      <span class="pn-medali ka" aria-hidden="true">${OR.medali}</span>
      <span class="pn-medali ki" aria-hidden="true">${OR.medali}</span>
      <span class="pn-untai ki" aria-hidden="true">${OR.untai}</span>
      <span class="pn-untai ka" aria-hidden="true">${OR.untai}</span>
      <div class="pn-badan">${isi}</div>
    </div>
  </section>`);
}

/* ============================================================
   PERENDER PER TIPE SECTION
   Menambah tipe baru cukup menambah entri di objek ini.
   ============================================================ */
/* ============================================================
   SUMBER ISI PANEL
   ------------------------------------------------------------
   Satu tempat yang tahu, untuk tiap jenis isi: bagaimana
   mengambilnya, bagaimana menggambarkan kartunya, dan kata apa saja
   yang dicari. Menambah panel baru di beranda berarti menambah satu
   entri di sini — bukan menambah satu section baru di site.js.

   Kolom yang dibaca di bawah sengaja terbatas pada yang memang
   dikirim api/muat.php untuk pengunjung. Yang tidak dikirim —
   presensi, notulensi, modal buku — tak akan pernah bisa bocor lewat
   sini, sebab ia memang tidak pernah sampai ke peramban.
   ============================================================ */
const SUMBER = {
  kajian: {
    label: 'Kajian',
    ambil: () => [...(Store.db.kajian || [])].sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || '')),
    cari : (x) => [x.judul, x.materi, x.tempat, x.angkatan],
    kartu: (x) => `<article class="kk kk-kajian">
      <div class="kk-atas">
        <span class="kk-pil ${x.status === 'terjadwal' ? 'pil-akan' : ''}">${x.status === 'terjadwal' ? 'Akan datang' : 'Selesai'}</span>
        <span class="kk-tgl">${IK.kalender} ${tglPendek(x.tanggal)}</span>
      </div>
      <h3 class="kk-judul">${esc(x.judul)}</h3>
      ${x.materi ? `<p class="kk-teks">${esc(String(x.materi).slice(0, 110))}</p>` : ''}
      <div class="kk-kaki">
        <span>${IK.orang} ${esc(Store.namaUser(x.pemakalahId))}</span>
        <span>${IK.pin} ${esc(x.tempat || '—')}</span>
      </div>
    </article>`,
  },

  artikel: {
    label: 'Artikel',
    ambil: () => (Store.db.artikel || []).filter((a) => a.status === 'terbit')
      .slice().sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || '')),
    cari : (x) => [x.judul, x.ringkas, x.kategori],
    buka : (x) => bukaArtikel(x.id),
    kartu: (x) => `<article class="kk kk-artikel" data-buka="${esc(x.id)}">
      <div class="kk-gambar"><img src="${x.cover}" alt="" loading="lazy"></div>
      <div class="kk-isi">
        <span class="kk-tag">${esc(x.kategori)}</span>
        <h3 class="kk-judul">${esc(x.judul)}</h3>
        <div class="kk-kaki kk-garis">
          <span>${IK.orang} ${esc(Store.namaUser(x.penulisId))}</span>
          <span class="kk-kanan">${tglPendek(x.tanggal)}</span>
          <button class="kk-bagi" type="button" title="Bagikan artikel ini"
                  data-bagi="artikel.html?buka=${encodeURIComponent(x.id)}"
                  data-judul="${esc(x.judul)}">${OR.bagi}</button>
        </div>
      </div>
    </article>`,
  },

  video: {
    label: 'Video',
    ambil: () => [...(Store.db.video || [])].sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || '')),
    cari : (x) => [x.judul, x.platform],
    kartu: (x) => `<article class="kk kk-video">
      <a class="kk-gambar" ${x.tautan ? `href="${esc(x.tautan)}" target="_blank" rel="noopener"` : ''}>
        <img src="${x.thumb}" alt="" loading="lazy">
        <span class="kk-main">${OR.main}</span>
        ${x.durasi ? `<span class="kk-durasi">${esc(x.durasi)}</span>` : ''}
      </a>
      <div class="kk-isi">
        <h3 class="kk-judul">${esc(x.judul)}</h3>
        <div class="kk-kaki kk-garis">
          <span>${esc(x.platform || 'Video')}</span>
          <span class="kk-kanan">${tglPendek(x.tanggal)}</span>
          ${x.tautan ? `<button class="kk-bagi" type="button" title="Bagikan video ini"
            data-bagi="${esc(x.tautan)}" data-judul="${esc(x.judul)}">${OR.bagi}</button>` : ''}
        </div>
      </div>
    </article>`,
  },

  buku: {
    label: 'Buku',
    ambil: () => [...(Store.db.buku || [])],
    cari : (x) => [x.judul, x.ringkas],
    /* Tanpa gambar sampul: yang ada di data hanyalah naskah yang masih
       digarap. Punggung buku tipografis lebih jujur daripada sampul
       contoh yang bukan sampul aslinya. */
    kartu: (x) => `<article class="kk kk-buku">
      <div class="kk-sampul"><span>${esc(x.judul)}</span><i></i></div>
      <div class="kk-isi">
        <h3 class="kk-judul">${esc(x.judul)}</h3>
        ${x.ringkas ? `<p class="kk-teks">${esc(String(x.ringkas).slice(0, 96))}</p>` : ''}
        <div class="kk-kaki kk-garis"><span class="kk-tag">${esc(x.tahap || 'proses')}</span>
        ${x.targetTerbit ? `<span>Target ${tglPendek(x.targetTerbit)}</span>` : ''}</div>
      </div>
    </article>`,
  },

  agenda: {
    label: 'Agenda',
    /* Yang sudah lewat turun sendiri — daftar acara yang memuat tanggal
       kemarin membuat seluruh halaman terasa terbengkalai. */
    ambil: () => {
      const hariIni = new Date().toISOString().slice(0, 10);
      const semua = Store.db.event || [];
      const akan = semua.filter((x) => (x.tanggal || '') >= hariIni)
        .sort((a, b) => (a.tanggal || '').localeCompare(b.tanggal || ''));
      return akan.length ? akan
        : [...semua].sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));
    },
    cari : (x) => [x.judul, x.ket, x.lokasi],
    kartu: (x) => {
      const t = new Date(x.tanggal + 'T00:00:00');
      const bln = isNaN(t) ? '' : t.toLocaleDateString('id-ID', { month: 'short' });
      return `<article class="kk kk-agenda">
        <div class="kk-tanggal"><b>${isNaN(t) ? '—' : t.getDate()}</b><span>${esc(bln)}</span></div>
        <div class="kk-isi">
          <h3 class="kk-judul">${esc(x.judul)}</h3>
          ${x.ket ? `<p class="kk-teks">${esc(String(x.ket).slice(0, 96))}</p>` : ''}
          <div class="kk-kaki kk-garis"><span>${IK.jam} ${esc(x.jam || '—')}</span><span>${IK.pin} ${esc(x.lokasi || '—')}</span></div>
        </div>
      </article>`;
    },
  },
};

/* ---------------- pencarian lintas isi ----------------
   Mencari di lima sumber sekaligus, hasilnya muncul langsung di bawah
   kolom. Semua di peramban, tanpa satu pun permintaan ke server —
   datanya memang sudah ada di memori sejak halaman dimuat. */
function pasangPencarian(akar) {
  const inp = akar.querySelector('#cariGlobal');
  const sar = akar.querySelector('#cariSaring');
  const kotak = akar.querySelector('#cariHasil');
  let sorot = -1;

  const BATAS = 8;

  const cocok = (q) => {
    const kunci = q.toLowerCase().trim();
    if (kunci.length < 2) return [];
    const pilih = sar.value ? [sar.value] : Object.keys(SUMBER);

    const per = pilih.map((nama) => {
      const s = SUMBER[nama];
      return s.ambil()
        .filter((x) => s.cari(x).filter(Boolean).join(' ').toLowerCase().includes(kunci))
        .map((x) => ({ nama, label: s.label, x }));
    });

    /* Diambil bergiliran satu per sumber, bukan sumber per sumber sampai
       penuh. Kalau tidak, kata seumum "tafsir" akan menghabiskan seluruh
       delapan baris dengan kajian saja — dan artikel yang dicari orang
       tak pernah sempat muncul, padahal ada. */
    const hasil = [];
    for (let putaran = 0; hasil.length < BATAS; putaran++) {
      let adaSisa = false;
      for (const daftar of per) {
        if (putaran >= daftar.length) continue;
        adaSisa = true;
        hasil.push(daftar[putaran]);
        if (hasil.length >= BATAS) break;
      }
      if (!adaSisa) break;
    }
    return hasil;
  };

  const tutup = () => { kotak.hidden = true; inp.setAttribute('aria-expanded', 'false'); sorot = -1; };

  const gambar = () => {
    const hasil = cocok(inp.value);
    if (!hasil.length) {
      if (inp.value.trim().length < 2) return tutup();
      kotak.innerHTML = `<div class="ch-kosong">Tidak ada yang cocok dengan "${esc(inp.value.trim())}".</div>`;
      kotak.hidden = false; inp.setAttribute('aria-expanded', 'true');
      return;
    }
    kotak.innerHTML = hasil.map((h, i) => `<button class="ch-baris" role="option" data-i="${i}">
      <span class="ch-jenis">${esc(h.label)}</span>
      <span class="ch-judul">${esc(h.x.judul)}</span>
    </button>`).join('');
    kotak.hidden = false;
    inp.setAttribute('aria-expanded', 'true');
    sorot = -1;
    kotak.querySelectorAll('.ch-baris').forEach((b) => {
      b.onclick = () => { tutup(); pilihHasil(hasil[+b.dataset.i]); };
    });
  };

  /* Artikel dibuka di tempat lewat modal yang sudah ada; sisanya belum
     punya halaman sendiri, jadi diarahkan ke panelnya di beranda —
     lebih baik daripada tautan yang tidak menuju ke mana-mana. */
  function pilihHasil(h) {
    inp.value = '';
    if (h.nama === 'artikel') return bukaArtikel(h.x.id);
    const panel = document.querySelector(`[data-sumber="${h.nama}"]`);
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const kartu = panel.querySelectorAll('.kk')[SUMBER[h.nama].ambil().findIndex((y) => y.id === h.x.id)];
      if (kartu) { kartu.classList.add('kk-sorot'); setTimeout(() => kartu.classList.remove('kk-sorot'), 2200); }
    }
  }

  let tunda;
  inp.oninput = () => { clearTimeout(tunda); tunda = setTimeout(gambar, 140); };
  sar.onchange = () => { if (inp.value.trim().length >= 2) gambar(); };
  inp.onfocus = () => { if (inp.value.trim().length >= 2) gambar(); };

  inp.onkeydown = (e) => {
    const baris = [...kotak.querySelectorAll('.ch-baris')];
    if (e.key === 'Escape') return tutup();
    if (!baris.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      sorot = (sorot + (e.key === 'ArrowDown' ? 1 : -1) + baris.length) % baris.length;
      baris.forEach((b, i) => b.classList.toggle('aktif', i === sorot));
      baris[sorot].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && sorot >= 0) {
      e.preventDefault(); baris[sorot].click();
    }
  };

  akar.querySelector('.cari-kotak').onsubmit = (e) => {
    e.preventDefault();
    const b = kotak.querySelector('.ch-baris');
    if (b) b.click();
  };

  /* Menutup lewat pointerdown, bukan click: klik pada hasil pencarian
     sendiri akan menutup kotaknya lebih dulu kalau memakai click. */
  document.addEventListener('pointerdown', (e) => {
    if (!akar.contains(e.target) || !e.target.closest('.hero-cari')) tutup();
  });
}

const RENDER = {

  hero(d) {
    const kategori = kategoriArtikel();
    const lencana = (d.lencana || "Kajian Al-I'jaz").toUpperCase();

    const n = el(`<section class="hero hero-utama">
      <div class="wrap hu-in">

        <!-- Judul raksasa: lapisan paling belakang. Sosok di depannya
             sengaja menutupi sebagian huruf — itulah yang membuat
             keduanya terbaca satu bidang, bukan dua elemen bertumpuk. -->
        <h1 class="hu-judul">${esc(d.judul)}</h1>

        <span class="hero-panah" aria-hidden="true">${OR.panahLengkung}</span>

        ${d.lencana === '' ? '' : `<span class="hero-lencana" aria-hidden="true">
          <svg viewBox="0 0 132 132">
            <defs><path id="lingkarLencana" d="M66,66 m-49,0 a49,49 0 1,1 98,0 a49,49 0 1,1 -98,0"/></defs>
            <text><textPath href="#lingkarLencana" startOffset="0">${esc(lencana)} &#183; ${esc(lencana)} &#183; </textPath></text>
          </svg>
          <span class="hl-tengah">${lambang()}</span>
        </span>`}

        <div class="hero-kartu">
          <div class="hk-kiri">
            <p class="hu-sub">${esc(d.subjudul)}</p>

            ${d.cariPetunjuk ? `<div class="hero-cari">
              <form class="cari-kotak" role="search" autocomplete="off">
                <span class="cari-ikon">${IK.cari}</span>
                <input type="search" id="cariGlobal" placeholder="${esc(d.cariPetunjuk)}"
                       aria-label="Cari isi situs" aria-expanded="false" aria-controls="cariHasil">
                <label class="cari-saring">
                  <select id="cariSaring" aria-label="Batasi pencarian">
                    <option value="">Semua</option>
                    <option value="kajian">Kajian</option>
                    <option value="artikel">Artikel</option>
                    <option value="video">Video</option>
                    <option value="buku">Buku</option>
                    <option value="agenda">Agenda</option>
                  </select>
                  ${IK.bawah}
                </label>
              </form>
              <div class="cari-hasil" id="cariHasil" role="listbox" hidden></div>
            </div>` : ''}

            <div class="hero-tombol">
              ${d.tombolTeks ? `<a class="tombol tombol-gelap" href="${esc(d.tombolLink)}">${esc(d.tombolTeks)}</a>` : ''}
              ${d.tombol2Teks ? `<a class="tombol tombol-garis" href="${esc(d.tombol2Link)}">${esc(d.tombol2Teks)}</a>` : ''}
            </div>
          </div>

          ${kategori.length ? `<div class="hk-kanan">
            <ul class="hero-pil">
              ${kategori.map((k, i) => `<li><a href="artikel.html?kategori=${encodeURIComponent(k)}"
                class="pil-kat ${i % 2 ? 'pil-isi' : ''}">${esc(k)}</a></li>`).join('')}
            </ul>
          </div>` : ''}
        </div>

        ${d.masjid ? `<div class="hero-sosok" aria-hidden="true"><img src="${d.masjid}" alt=""></div>` : ''}
      </div>
    </section>`);

    /* Gerak masuk sosok dipicu satu frame SETELAH elemen terpasang.
       Animasi CSS yang mulai bersamaan dengan pelukisan pertama membuat
       Chrome tidak pernah melukis gambar ini sama sekali; menunda satu
       frame menghindari jalur render bermasalah itu. Keadaan dasarnya
       sudah terlihat, jadi kegagalan skrip tidak menghilangkannya. */
    const sosok = n.querySelector('.hero-sosok');
    if (sosok) {
      sosok.classList.add('siap-masuk');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        sosok.classList.remove('siap-masuk');
        sosok.classList.add('masuk');
      }));
    }

    if (n.querySelector('#cariGlobal')) pasangPencarian(n);
    return n;
  },

  /* ---------------- pemisah berkata ----------------
     Satu kalimat di antara hero dan panel pertama, diapit dua garis
     tipis. Gunanya bukan hiasan: ia memberi jeda baca sebelum mata
     masuk ke deretan kartu, dan jeda itulah yang membuat panel pertama
     terasa sebagai bagian baru, bukan lanjutan hero.

     Kutipan dan sumbernya disunting lewat ERP → Beranda seperti isi
     lainnya, jadi ia bisa berganti tiap pekan tanpa menyentuh kode. */
  pemisah(d) {
    return el(`<section class="pemisah"><div class="wrap">
      <blockquote class="pm-kutip">
        <p>&ldquo;${esc(d.kutipan)}&rdquo;</p>
        ${d.sumber ? `<cite>(${esc(d.sumber)})</cite>` : ''}
      </blockquote>
    </div></section>`);
  },

  /* ---------------- galeri kegiatan ----------------
     Dibaca dari koleksi Media — yang sama yang dikelola PJ Media &
     Website lewat ERP → Galeri Media. Jadi menambah foto kegiatan
     cukup mengunggahnya sekali di sana, tanpa menyentuh halaman ini.

     Disaring menurut jenis: koleksi itu juga memuat logo, banner, dan
     template yang tak ada urusannya dengan dokumentasi kegiatan. */
  galeri(d) {
    const semua = (Store.db.media || [])
      .filter((x) => x.berkas && (!d.jenis || x.jenis === d.jenis))
      .sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''))
      .slice(0, d.jumlah || 12);

    const n = panelBungkus(d, `
      ${kepala(d)}
      ${d.teks ? `<p class="pn-teks pn-intro">${esc(d.teks)}</p>` : ''}
      ${semua.length ? `<div class="grid-galeri">
        ${semua.map((x, i) => `<figure class="gl-bingkai" data-i="${i}" tabindex="0" role="button"
            aria-label="Perbesar ${esc(x.nama)}">
          <img src="${x.berkas}" alt="${esc(x.nama)}" loading="lazy">
          <figcaption><span>${esc(x.nama)}</span><small>${tglPendek(x.tanggal)}</small></figcaption>
        </figure>`).join('')}
      </div>` : `<p class="pn-kosong">Belum ada dokumentasi untuk ditampilkan.</p>`}`);

    /* Diperbesar di tempat. Tanpa ini, satu-satunya cara melihat fotonya
       utuh adalah membuka alamat berkasnya sendiri — dan bingkai galeri
       memang memotong gambarnya agar barisnya rata. */
    n.querySelectorAll('.gl-bingkai').forEach((f) => {
      const buka = () => bukaGambar(semua[+f.dataset.i], semua);
      f.onclick = buka;
      f.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); buka(); } };
    });
    return n;
  },

  /* ---------------- panel isi (generik) ----------------
     Satu renderer untuk lima panel. Yang membedakan hanya `sumber`,
     dan itu dipilih dari daftar di ERP — jadi menambah panel baru di
     beranda tidak menuntut kode baru sama sekali. */
  panel(d) {
    const s = SUMBER[d.sumber];
    if (!s) { console.warn('Sumber panel tidak dikenal:', d.sumber); return el('<div></div>'); }
    const data = s.ambil().slice(0, d.jumlah || 6);

    /* Tiap panel diakhiri satu tombol emas. Yang menuju halaman lain
       memakai tautan; sisanya membentangkan kartu yang tadinya harus
       digeser menjadi kisi utuh. Tak ada tombol yang tidak menuju ke
       mana-mana — itu lebih membingungkan daripada tidak ada tombol. */
    /* Tombol bentang hanya berguna bila jalurnya memang meluber, dan itu
       baru ketahuan setelah digambar — enam kartu meluber di ponsel tapi
       tidak di layar lebar. Karena itu ia dipasang dulu lalu disembunyikan
       sendiri oleh perbarui() bila ternyata tak ada yang perlu dibentang. */
    const aksi = d.tombolLink
      ? `<a class="tombol tombol-emas" href="${esc(d.tombolLink)}">${esc(d.tombolTeks || 'Lihat Semua')}</a>`
      : `<button class="tombol tombol-emas" type="button" data-bentang>Lihat Semua</button>`;

    const n = el(`<section class="panel panel-${d.tema === 'krem' ? 'krem' : 'hijau'}" data-sumber="${esc(d.sumber)}">
      <div class="panel-kotak">
        <span class="pn-medali ka" aria-hidden="true">${OR.medali}</span>
        <span class="pn-medali ki" aria-hidden="true">${OR.medali}</span>
        <span class="pn-untai ki" aria-hidden="true">${OR.untai}</span>
        <span class="pn-untai ka" aria-hidden="true">${OR.untai}</span>

        <header class="pn-kepala">
          <h2 class="pn-judul">
            <span class="pn-hias">${OR.daun}</span>
            ${esc(d.judul)}
            <span class="pn-hias">${OR.daun}</span>
          </h2>
          ${d.teks ? `<p class="pn-teks">${esc(d.teks)}</p>` : ''}
        </header>

        ${data.length ? `<div class="pn-rel">
          <button class="pn-nav mundur" type="button" aria-label="Geser ke kiri">${IK.panah}</button>
          <div class="pn-jalur${data.length < 4 ? ' sedikit' : ''}">${data.map(s.kartu).join('')}</div>
          <button class="pn-nav maju" type="button" aria-label="Geser ke kanan">${IK.panah}</button>
        </div>` : `<p class="pn-kosong">Belum ada isi untuk ditampilkan di sini.</p>`}

        ${aksi ? `<div class="pn-aksi">${aksi}</div>` : ''}
      </div>
    </section>`);

    const jalur = n.querySelector('.pn-jalur');
    if (jalur) {
      const geser = (arah) => {
        const kartu = jalur.querySelector('.kk');
        const langkah = kartu ? kartu.getBoundingClientRect().width + 18 : 300;
        jalur.scrollBy({ left: arah * langkah, behavior: 'smooth' });
      };
      n.querySelector('.mundur').onclick = () => geser(-1);
      n.querySelector('.maju').onclick = () => geser(1);

      /* Tombol yang tidak menuju ke mana-mana lebih buruk daripada
         tombol yang tidak ada: keduanya dimatikan saat jalurnya sudah
         mentok, dan seluruh baris tombol disembunyikan bila isinya
         memang muat seluruhnya. */
      const perbarui = () => {
        const mekar = n.querySelector('.pn-rel').classList.contains('mekar');
        const sisaKiri = !mekar && jalur.scrollLeft > 4;
        const sisaKanan = !mekar && jalur.scrollLeft + jalur.clientWidth < jalur.scrollWidth - 4;
        n.querySelector('.mundur').disabled = !sisaKiri;
        n.querySelector('.maju').disabled = !sisaKanan;
        n.querySelector('.pn-rel').classList.toggle('tanpa-nav', !sisaKiri && !sisaKanan);

        const t = n.querySelector('[data-bentang]');
        if (t) {
          const meluber = jalur.scrollWidth > jalur.clientWidth + 4;
          t.parentElement.hidden = !mekar && !meluber;
        }
      };
      jalur.addEventListener('scroll', perbarui, { passive: true });
      window.addEventListener('resize', perbarui);
      requestAnimationFrame(perbarui);

      const bentang = n.querySelector('[data-bentang]');
      if (bentang) {
        bentang.onclick = () => {
          const mekar = n.querySelector('.pn-rel').classList.toggle('mekar');
          bentang.textContent = mekar ? 'Ringkaskan' : 'Lihat Semua';
          if (!mekar) jalur.scrollTo({ left: 0, behavior: 'smooth' });
          requestAnimationFrame(perbarui);
        };
      }

      if (s.buka) {
        jalur.querySelectorAll('[data-buka]').forEach((k) => {
          k.onclick = (e) => { if (!e.target.closest('[data-bagi]')) s.buka({ id: k.dataset.buka }); };
        });
      }
      pasangBagi(n);
    }
    return n;
  },

  /* ---------------- panel kontak ----------------
     Nomor, surel, dan alamatnya dibaca dari Identitas Situs, bukan
     diketik ulang di sini. Satu fakta, satu tempat — kalau nomornya
     berubah, ia berubah di footer, di halaman Kontak, dan di sini
     sekaligus. */
  'panel-kontak'(d) {
    const c = Store.cms.situs;
    const wa = String(c.telepon || '').replace(/[^0-9]/g, '');
    const kartu = [
      c.telepon && { ikon: IK.telepon, judul: 'Chat WhatsApp', ket: 'Balasan pada jam kerja',
        nilai: c.telepon, href: wa ? `https://wa.me/${wa}` : '' },
      c.email && { ikon: IK.email, judul: 'Kirim Surel', ket: 'Untuk pertanyaan & kerja sama',
        nilai: c.email, href: `mailto:${c.email}` },
      c.alamat && { ikon: IK.pin, judul: 'Sekretariat', ket: 'Silakan bertandang',
        nilai: c.alamat, href: c.maps || '' },
    ].filter(Boolean);

    return el(`<section class="panel panel-${d.tema === 'hijau' ? 'hijau' : 'krem'}">
      <div class="panel-kotak">
        <span class="pn-medali ka" aria-hidden="true">${OR.medali}</span>
        <span class="pn-medali ki" aria-hidden="true">${OR.medali}</span>
        <span class="pn-untai ki" aria-hidden="true">${OR.untai}</span>
        <span class="pn-untai ka" aria-hidden="true">${OR.untai}</span>

        <header class="pn-kepala">
          <h2 class="pn-judul">
            <span class="pn-hias">${OR.daun}</span>${esc(d.judul)}<span class="pn-hias">${OR.daun}</span>
          </h2>
          ${d.teks ? `<p class="pn-teks">${esc(d.teks)}</p>` : ''}
        </header>

        ${d.subJudul ? `<div class="pn-sub">
          <h3>${esc(d.subJudul)}</h3>
          <span class="pn-pemisah">${OR.pemisah}</span>
        </div>` : ''}

        <div class="pn-kontak">
          ${kartu.map((k) => `<${k.href ? 'a' : 'div'} class="kt"
              ${k.href ? `href="${esc(k.href)}" target="_blank" rel="noopener"` : ''}>
            <span class="kt-ikon">${k.ikon}</span>
            <b class="kt-judul">${esc(k.judul)}</b>
            <span class="kt-ket">${esc(k.ket)}</span>
            <span class="kt-nilai">${esc(k.nilai)}</span>
          </${k.href ? 'a' : 'div'}>`).join('')}
        </div>
      </div>
    </section>`);
  },

  /* Hero halaman dalam — Tentang, Artikel, Kontak.

     Terpusat di atas foto yang benar-benar terlihat, bukan pita hijau
     dengan foto samar di belakangnya. Fotonya memang bagian dari
     rancangan; menutupinya dengan gradasi pekat sama saja dengan tidak
     memasangnya. */
  'hero-halaman'(d) {
    return el(`<section class="hero hero-halaman">
      <div class="hero-bg"><img src="${d.gambar}" alt=""></div>
      <span class="hh-tiang ki" aria-hidden="true">${OR.tiang}</span>
      <span class="hh-tiang ka" aria-hidden="true">${OR.tiang}</span>
      <div class="wrap hero-halaman-in">
        ${d.skrip ? `<div class="hero-skrip">${esc(d.skrip)}</div>` : ''}
        <h1 class="hero-judul">${esc(d.judul)}</h1>
        <p class="hero-sub">${esc(d.subjudul)}</p>
        ${d.tombolTeks ? `<a class="tombol tombol-emas" href="${esc(d.tombolLink)}">${esc(d.tombolTeks)}</a>` : ''}
      </div>
    </section>`);
  },

  'teks-gambar'(d) {
    return panelBungkus(d, `
      ${kepala(d)}
      <div class="grid-teks-gambar ${d.posisiGambar === 'kanan' ? 'kanan' : ''}">
        <div class="kotak-gambar"><img src="${d.gambar}" alt=""></div>
        <div class="isi-teks">${d.paragraf.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      </div>`);
  },

  timeline(d) {
    return panelBungkus(d, `
      ${kepala(d)}
      <div class="grid-timeline">
        <div class="timeline">
          ${d.butir.map((b) => `<div class="tl-butir"><span class="tl-ikon">${IK.buku}</span><p>${esc(b.teks)}</p></div>`).join('')}
        </div>
        <div class="gambar-tegak"><img src="${d.gambar}" alt=""></div>
      </div>`);
  },

  'dua-kolom'(d) {
    const kol = (k) => `<div class="kartu-metode">
      <h3><span class="ik">${k.ikon === 'kitab' ? IK.buku : IK.dokumen}</span>${esc(k.label)}</h3>
      <p>${esc(k.teks)}</p>
      ${k.subJudul ? `<h4>${esc(k.subJudul)}</h4>` : ''}
      ${k.level ? `<ol class="daftar-level">${k.level.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}
      ${k.subJudul2 ? `<h4>${esc(k.subJudul2)}</h4>` : ''}
      ${k.poin ? `<ul class="daftar-poin">${k.poin.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${k.penutup ? `<p class="penutup-metode">${esc(k.penutup)}</p>` : ''}
    </div>`;
    return panelBungkus(d, `
      ${kepala(d)}
      ${d.intro ? `<p class="pn-teks pn-intro">${esc(d.intro)}</p>` : ''}
      <div class="grid-dua">${d.kolom.map(kol).join('')}</div>`);
  },

  'visi-misi'(d) {
    return panelBungkus(d, `
      ${kepala(d)}
      <div class="grid-visi">
        <div class="kartu-visi">
          <div class="label-vm"><span class="ik">${IK.mata}</span>A. Visi</div>
          <p>${esc(d.visi)}</p>
        </div>
        <div class="kartu-misi">
          <div class="label-vm"><span class="ik">${IK.target}</span>B. Misi</div>
          <ol class="daftar-misi">${d.misi.map((m) => `<li><span>${esc(m)}</span></li>`).join('')}</ol>
        </div>
      </div>`);
  },

  organisasi(d) {
    const kartu = d.jabatan.map((j) => `<div class="kartu-org">
      <div class="org-ikon">${ikonOrg(j.ikon)}</div>
      <div class="org-jabatan">${esc(RBAC.roleLabel(j.role))}</div>
      <div class="org-nama">${esc(j.nama)}</div>
    </div>`).join('');
    return panelBungkus(d, `
      ${kepala(d)}
      ${d.intro ? `<p class="pn-teks pn-intro">${esc(d.intro)}</p>` : ''}
      <div class="grid-org">${kartu}</div>`);
  },

  /* --------- daftar anggota dengan filter + pencarian --------- */
  anggota(d) {
    const sec = el(`<section class="sec pola-terang"><div class="wrap">
      ${kepala(d)}
      ${d.tampilkanFilter ? `<div class="tab-filter">
        <button data-f="semua" class="aktif">${IK.grup} Semua</button>
        <button data-f="pendiri">${IK.bintang} Pendiri</button>
        <button data-f="anggota">${IK.orang} Anggota</button>
        <button data-f="alumni">${IK.toga} Alumni</button>
      </div>` : ''}
      <div class="baris-cari">
        <div class="kotak-cari"><input type="search" placeholder="Cari nama anggota..." id="cariAnggota">${IK.cari}</div>
        <select id="filterAngkatan"><option value="">Semua Angkatan</option></select>
      </div>
      <div class="grid-anggota" id="gridAnggota"></div>
    </div></section>`);

    const grid = sec.querySelector('#gridAnggota');
    const cari = sec.querySelector('#cariAnggota');
    const selAng = sec.querySelector('#filterAngkatan');
    let filter = 'semua';

    [...new Set(Store.db.users.map((u) => u.angkatan))].forEach((a) =>
      selAng.appendChild(el(`<option value="${esc(a)}">${esc(a)}</option>`)));

    function gambar() {
      const q = cari.value.toLowerCase().trim();
      const ang = selAng.value;
      const data = Store.db.users.filter((u) =>
        (filter === 'semua' || u.kategori === filter) &&
        (!ang || u.angkatan === ang) &&
        (!q || u.nama.toLowerCase().includes(q)));

      if (!data.length) {
        grid.innerHTML = `<div class="kosong" style="grid-column:1/-1">${IK.kotakKosong}<p>Tidak ada anggota yang cocok dengan pencarian.</p></div>`;
        return;
      }
      grid.innerHTML = data.map((u) => {
        const pil = u.kategori === 'pendiri' ? '<span class="pil pil-pendiri">Pendiri</span>'
          : u.kategori === 'alumni' ? '<span class="pil pil-alumni">Alumni</span>'
            : '<span class="pil">Anggota Aktif</span>';
        return `<div class="kartu-anggota">
          <div class="ang-atas">
            <div class="ang-foto"><img src="${u.foto}" alt="${esc(u.nama)}"><span class="ang-lencana">${u.kategori === 'pendiri' ? IK.bintang : IK.toga}</span></div>
            <div style="min-width:0">
              ${pil}
              <div class="ang-nama">${esc(u.nama)}</div>
              <div class="ang-meta">${esc(u.angkatan)}${u.level && u.level !== '-' ? ' · ' + esc(u.level) : ''}</div>
            </div>
          </div>
          <div class="ang-detail">${IK.toga}<span>${esc(u.pendidikan)}</span></div>
          <div class="ang-detail">${IK.orang}<span>${esc(u.jabatan || RBAC.roleLabel(u.role))}</span></div>
          <div class="ang-sosmed">
            <a href="#" aria-label="Facebook">${IK.facebook}</a>
            <a href="#" aria-label="Instagram">${IK.instagram}</a>
            ${u.email ? `<a href="mailto:${esc(u.email)}" aria-label="Email">${IK.email}</a>` : ''}
          </div>
        </div>`;
      }).join('');
    }

    sec.querySelectorAll('.tab-filter button').forEach((b) => {
      b.onclick = () => {
        sec.querySelectorAll('.tab-filter button').forEach((x) => x.classList.remove('aktif'));
        b.classList.add('aktif'); filter = b.dataset.f; gambar();
      };
    });
    cari.oninput = gambar; selAng.onchange = gambar;
    gambar();
    return sec;
  },

  /* --------- daftar artikel: sidebar + pencarian + paginasi --------- */
  'daftar-artikel'(d) {
    const sec = el(`<section class="sec pola-terang"><div class="wrap">
      <div class="tata-artikel">
        <aside class="samping">
          <div class="kotak-cari"><input type="search" placeholder="Cari artikel..." id="cariArtikel">${IK.cari}</div>
          <h4>Kategori</h4>
          <ul class="daftar-kategori" id="daftarKategori"></ul>
          <h4>Terbaru</h4>
          <div id="miniTerbaru"></div>
        </aside>
        <div>
          <div class="kepala" style="margin-bottom:26px"><div>
            <h2 class="judul-teks">${esc(d.judul)}</h2><div class="garis-bawah"></div>
          </div></div>
          <div id="daftarArtikel"></div>
          <div class="paginasi" id="paginasi"></div>
        </div>
      </div>
    </div></section>`);

    const wadah = sec.querySelector('#daftarArtikel');
    const pag = sec.querySelector('#paginasi');
    const cari = sec.querySelector('#cariArtikel');

    /* Kategori boleh datang dari alamatnya — inilah yang membuat sidebar
       di hero berguna: kliknya mendarat langsung pada filter yang tepat,
       bukan pada daftar seluruh artikel yang harus disaring ulang.
       Nama yang tak dikenal diabaikan, supaya alamat yang dikarang
       tidak menghasilkan halaman yang kosong tanpa penjelasan. */
    const diminta = new URLSearchParams(location.search).get('kategori') || '';
    let kategori = d.kategori.includes(diminta) ? diminta : '';
    let halaman = 1;
    const perHal = d.perHalaman || 4;
    const terbit = () => Store.db.artikel.filter((a) => a.status === 'terbit');

    function daftarKategori() {
      const ul = sec.querySelector('#daftarKategori');
      const semua = terbit();
      ul.innerHTML = `<li><button data-k="" class="${kategori === '' ? 'aktif' : ''}">Semua Kategori <span class="hitung">${semua.length}</span></button></li>` +
        d.kategori.map((k) => {
          const n = semua.filter((a) => a.kategori === k).length;
          return `<li><button data-k="${esc(k)}" class="${kategori === k ? 'aktif' : ''}">${esc(k)} <span class="hitung">${n}</span></button></li>`;
        }).join('');
      ul.querySelectorAll('button').forEach((b) => {
        b.onclick = () => { kategori = b.dataset.k; halaman = 1; gambar(); daftarKategori(); };
      });
    }

    function miniTerbaru() {
      const box = sec.querySelector('#miniTerbaru');
      box.innerHTML = terbit().slice(0, 3).map((a) => `<div class="mini-artikel" data-id="${a.id}">
        <img src="${a.cover}" alt="">
        <div><div class="mini-judul">${esc(a.judul.slice(0, 52))}${a.judul.length > 52 ? '…' : ''}</div>
        <div class="mini-meta">${esc(Store.namaUser(a.penulisId))} · ${tglID(a.tanggal)}</div></div>
      </div>`).join('') || '<p style="font-size:13px;color:var(--abu)">Belum ada artikel.</p>';
      box.querySelectorAll('.mini-artikel').forEach((m) => m.onclick = () => bukaArtikel(m.dataset.id));
    }

    function gambar() {
      const q = cari.value.toLowerCase().trim();
      const data = terbit().filter((a) =>
        (!kategori || a.kategori === kategori) &&
        (!q || a.judul.toLowerCase().includes(q) || a.ringkas.toLowerCase().includes(q)));

      const total = Math.max(1, Math.ceil(data.length / perHal));
      halaman = Math.min(halaman, total);
      const potong = data.slice((halaman - 1) * perHal, halaman * perHal);

      wadah.innerHTML = potong.length ? potong.map((a) => `<article class="kartu-artikel" data-id="${a.id}">
        <div class="art-gambar"><img src="${a.cover}" alt=""></div>
        <div class="art-isi">
          <span class="art-kategori">${esc(a.kategori)}</span>
          <h3 class="art-judul">${esc(a.judul)}</h3>
          <div class="art-meta">
            <span>${IK.orang} ${esc(Store.namaUser(a.penulisId))}</span>
            <span>${IK.kalender} ${tglID(a.tanggal)}</span>
            <span>${IK.mata} ${a.dilihat}x</span>
          </div>
          <p class="art-ringkas">${esc(a.ringkas.slice(0, 175))}…</p>
          <span class="art-baca">Baca Selengkapnya ${IK.panah}</span>
        </div>
      </article>`).join('')
        : `<div class="kosong">${IK.kotakKosong}<p>Belum ada artikel pada kategori ini.</p></div>`;

      wadah.querySelectorAll('.kartu-artikel').forEach((k) => k.onclick = () => bukaArtikel(k.dataset.id));

      pag.innerHTML = '';
      if (data.length > perHal) {
        pag.appendChild(Object.assign(el(`<button ${halaman === 1 ? 'disabled' : ''}>←</button>`), { onclick: () => { halaman--; gambar(); } }));
        for (let i = 1; i <= total; i++) {
          pag.appendChild(Object.assign(el(`<button class="${i === halaman ? 'aktif' : ''}">${i}</button>`), { onclick: () => { halaman = i; gambar(); } }));
        }
        pag.appendChild(Object.assign(el(`<button ${halaman === total ? 'disabled' : ''}>→</button>`), { onclick: () => { halaman++; gambar(); } }));
      }
    }

    cari.oninput = () => { halaman = 1; gambar(); };
    daftarKategori(); miniTerbaru(); gambar();

    /* Tautan bagikan menunjuk ke sini. Artikelnya dibuka langsung supaya
       yang menerima tautan mendarat pada tulisannya, bukan pada daftar
       yang harus dicari-cari lagi. */
    const dibuka = new URLSearchParams(location.search).get('buka');
    if (dibuka && terbit().some((a) => a.id === dibuka)) {
      requestAnimationFrame(() => bukaArtikel(dibuka));
    }
    return sec;
  },

  kutipan(d) {
    const sec = el(`<section class="sec" style="padding-top:0"><div class="wrap">
      <div class="pita-kutipan">
        <div>
          <div class="kutip-tanda">"</div>
          <p class="kutip-teks">${esc(d.kutipan)}</p>
          <div class="kutip-sumber">— ${esc(d.sumber)}</div>
        </div>
        <div>
          <h3 class="nl-judul">${esc(d.nlJudul)}</h3>
          <p class="nl-teks">${esc(d.nlTeks)}</p>
          <form class="nl-form">
            <input type="email" placeholder="Masukkan email anda" required>
            <button class="tombol" type="submit">Berlangganan ${IK.panah}</button>
          </form>
        </div>
      </div>
    </div></section>`);
    sec.querySelector('.nl-form').onsubmit = async (e) => {
      e.preventDefault();
      const inp = e.target.querySelector('input');
      const tbl = e.target.querySelector('button');
      tbl.disabled = true;
      try {
        const baru = await Store.berlanggananNewsletter(inp.value);
        toast(baru ? 'Terima kasih! Email Anda berhasil didaftarkan.' : 'Email ini sudah terdaftar sebelumnya.');
        inp.value = '';
      } catch (err) {
        toast(err.message || 'Pendaftaran gagal. Coba lagi sebentar lagi.');
      } finally { tbl.disabled = false; }
    };
    return sec;
  },

  'form-kontak'(d) {
    const s = Store.cms.situs;
    const sec = el(`<section class="sec pola-terang"><div class="wrap">
      ${kepala(d)}
      <div class="grid-kontak">
        <form class="kartu-form" id="formKontak">
          ${d.intro ? `<p style="margin:0 0 22px;font-size:14px;color:#55645A">${esc(d.intro)}</p>` : ''}
          <div class="grup"><label>Nama Lengkap</label><input name="nama" required placeholder="Nama Anda"></div>
          <div class="grup"><label>Alamat Email</label><input type="email" name="email" required placeholder="email@contoh.com"></div>
          <div class="grup"><label>Subjek</label><select name="subjek" style="max-width:none">
            ${d.subjek.map((x) => `<option>${esc(x)}</option>`).join('')}
          </select></div>
          <div class="grup"><label>Pesan</label><textarea name="isi" required placeholder="Tuliskan pesan Anda..."></textarea></div>
          <button class="tombol" type="submit">Kirim Pesan ${IK.kirim}</button>
        </form>
        <div class="kartu-info">
          <h3 style="margin:0 0 6px;font-size:18px;color:var(--hijau-tua)">Informasi Kontak</h3>
          <p style="font-size:13.4px;color:var(--abu);margin:0 0 8px">${esc(s.naungan)}</p>
          <div class="info-butir"><span class="info-ik">${IK.pin}</span><div><div class="info-label">Alamat</div><div class="info-nilai">${esc(s.alamat)}</div></div></div>
          <div class="info-butir"><span class="info-ik">${IK.email}</span><div><div class="info-label">Email</div><div class="info-nilai">${esc(s.email)}</div></div></div>
          <div class="info-butir"><span class="info-ik">${IK.telepon}</span><div><div class="info-label">Telepon</div><div class="info-nilai">${esc(s.telepon)}</div></div></div>
          <div class="info-butir"><span class="info-ik">${IK.jam}</span><div><div class="info-label">Waktu Kajian</div><div class="info-nilai">Sabtu, 19.30 – 21.30 WK</div></div></div>
          <div class="sosmed-baris" style="margin-top:18px">
            ${Object.entries(s.sosmed).filter(([, v]) => v).map(([k, v]) =>
              `<a href="${esc(v)}" target="_blank" rel="noopener" style="background:rgba(14,46,28,.06);color:var(--hijau)">${IK[k] || IK.email}</a>`).join('')}
          </div>
        </div>
      </div>
    </div></section>`);

    sec.querySelector('#formKontak').onsubmit = async (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const tbl = e.target.querySelector('button[type=submit]') || e.target.querySelector('button');
      if (tbl) tbl.disabled = true;
      try {
        await Store.kirimPesan({
          nama: f.get('nama'), email: f.get('email'),
          subjek: f.get('subjek'), isi: f.get('isi'),
        });
        e.target.reset();
        toast('Pesan terkirim. Masuk ke kotak masuk Sekretaris di ERP.');
      } catch (err) {
        /* Jangan kosongkan formulirnya bila gagal — yang sudah diketik
           pengunjung tidak boleh hilang hanya karena jaringan tersendat. */
        toast(err.message || 'Pesan gagal terkirim. Coba lagi sebentar lagi.');
      } finally { if (tbl) tbl.disabled = false; }
    };
    return sec;
  },

  faq(d) {
    const sec = el(`<section class="sec" style="padding-top:0"><div class="wrap" style="max-width:840px">
      ${kepala(d)}
      <div id="daftarFaq">${d.butir.map((b) => `<div class="akordeon">
        <button class="akordeon-kepala">${esc(b.t)} ${IK.bawah}</button>
        <div class="akordeon-isi"><p>${esc(b.j)}</p></div>
      </div>`).join('')}</div>
    </div></section>`);
    sec.querySelectorAll('.akordeon-kepala').forEach((b) => {
      b.onclick = () => {
        const a = b.parentElement, sudah = a.classList.contains('buka');
        sec.querySelectorAll('.akordeon').forEach((x) => x.classList.remove('buka'));
        if (!sudah) a.classList.add('buka');
      };
    });
    return sec;
  },
};

/* ---------------- pembesar gambar galeri ----------------
   Satu tirai dipakai ulang, bukan satu per gambar: membuat elemen baru
   tiap kali dibuka meninggalkan tumpukan tirai yang tak pernah dibuang.
   Panah kiri-kanan berpindah gambar tanpa menutup dulu. */
let tiraiGambar;
function bukaGambar(item, daftar) {
  if (!tiraiGambar) {
    tiraiGambar = el(`<div class="tirai-gambar" role="dialog" aria-modal="true">
      <button class="tg-tutup" aria-label="Tutup">${IK.tutup}</button>
      <button class="tg-nav mundur" aria-label="Sebelumnya">${IK.panah}</button>
      <figure class="tg-isi"><img alt=""><figcaption></figcaption></figure>
      <button class="tg-nav maju" aria-label="Berikutnya">${IK.panah}</button>
    </div>`);
    document.body.appendChild(tiraiGambar);
    tiraiGambar.onclick = (e) => { if (e.target === tiraiGambar) tutupGambar(); };
    tiraiGambar.querySelector('.tg-tutup').onclick = tutupGambar;
    document.addEventListener('keydown', (e) => {
      if (!tiraiGambar?.classList.contains('buka')) return;
      if (e.key === 'Escape') tutupGambar();
      if (e.key === 'ArrowLeft') tiraiGambar.querySelector('.mundur').click();
      if (e.key === 'ArrowRight') tiraiGambar.querySelector('.maju').click();
    });
  }

  let i = daftar.indexOf(item);
  const gambar = () => {
    const x = daftar[i];
    tiraiGambar.querySelector('img').src = x.berkas;
    tiraiGambar.querySelector('img').alt = x.nama;
    tiraiGambar.querySelector('figcaption').textContent = `${x.nama} · ${tglPendek(x.tanggal)}`;
    /* Pada satu gambar, tombol geser hanya menipu — ia menjanjikan ada
       gambar lain yang sebenarnya tidak ada. */
    tiraiGambar.classList.toggle('sendiri', daftar.length < 2);
  };
  const geser = (arah) => { i = (i + arah + daftar.length) % daftar.length; gambar(); };
  tiraiGambar.querySelector('.mundur').onclick = () => geser(-1);
  tiraiGambar.querySelector('.maju').onclick = () => geser(1);

  gambar();
  tiraiGambar.classList.add('buka');
}
function tutupGambar() { tiraiGambar?.classList.remove('buka'); }

/* ---------------- modal baca artikel ---------------- */
let tirai;
function bukaArtikel(id) {
  const a = Store.db.artikel.find((x) => x.id === id);
  if (!a) return;
  /* Naikkan di layar seketika, catat di server menyusul. Pembacanya
     pengunjung yang belum masuk, jadi ia tidak menulis koleksi sendiri —
     api/lihat.php hanya boleh menambah kolom `dilihat`. */
  a.dilihat = (a.dilihat || 0) + 1;
  Store.catatBaca(id);

  if (!tirai) {
    tirai = el('<div class="tirai"><div class="modal-baca"></div></div>');
    document.body.appendChild(tirai);
    tirai.onclick = (e) => { if (e.target === tirai) tutupArtikel(); };
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') tutupArtikel(); });
  }
  tirai.querySelector('.modal-baca').innerHTML = `
    <button class="baca-tutup" aria-label="Tutup">${IK.tutup}</button>
    <div class="baca-sampul"><img src="${a.cover}" alt=""></div>
    <div class="baca-isi">
      <span class="art-kategori">${esc(a.kategori)}</span>
      <h1>${esc(a.judul)}</h1>
      <div class="art-meta" style="margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid var(--garis)">
        <span>${IK.orang} ${esc(Store.namaUser(a.penulisId))}</span>
        <span>${IK.kalender} ${tglID(a.tanggal)}</span>
        <span>${IK.mata} ${a.dilihat}x dibaca</span>
      </div>
      ${a.isi.map((p) => `<p>${esc(p)}</p>`).join('')}
      ${a.tag?.length ? `<div class="baca-tag">${a.tag.map((t) => `<span>#${esc(t)}</span>`).join('')}</div>` : ''}
    </div>`;
  tirai.querySelector('.baca-tutup').onclick = tutupArtikel;
  tirai.classList.add('buka');
  tirai.querySelector('.modal-baca').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}
function tutupArtikel() {
  tirai?.classList.remove('buka');
  document.body.style.overflow = '';
}

/* ============================================================
   ENTRI — dipanggil tiap halaman publik
   ============================================================ */
function render(namaHalaman, fileAktif) {
  terapkanTema();

  /* Catat kunjungan sekali per pemuatan halaman, bukan tiap kali render
     dipanggil ulang — sebab render() juga berjalan lagi ketika ERP
     menyetujui perubahan di tab lain, dan itu bukan kunjungan baru. */
  if (!window.__tercatat) {
    window.__tercatat = true;
    try { Store.catatKunjungan(namaHalaman); } catch (_) {}
  }

  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(renderHeader(fileAktif));

  const hal = Store.cms.halaman[namaHalaman];
  document.title = `${hal.judul} — ${Store.cms.situs.nama} | ${Store.cms.situs.tagline}`;

  hal.sections.filter((s) => s.aktif).forEach((s) => {
    const fn = RENDER[s.tipe];
    if (!fn) { console.warn('Tipe section belum didukung:', s.tipe); return; }
    try { app.appendChild(fn(s.data)); }
    catch (e) { console.error('Gagal merender section', s.id, e); }
  });

  app.appendChild(renderFooter());
  app.appendChild(renderNavBawah(fileAktif));

  if (!document.querySelector('.pintas-erp')) {
    document.body.appendChild(el(`<a class="pintas-erp" href="erp.html">${IK.gembok} Masuk ERP</a>`));
  }
}

/* ============================================================
   MULAI — dipanggil tiap halaman, menggantikan render() langsung
   ------------------------------------------------------------
   Isinya kini datang dari server, jadi ada jeda sebelum apa pun dapat
   digambar. Jeda itu diakui terang-terangan lewat layar tunggu, bukan
   disembunyikan di balik halaman kosong.
   ============================================================ */
async function mulai(nama, file) {
  window.__halamanAktif = { nama, file };
  const app = document.getElementById('app');
  app.innerHTML = `<div class="layar-tunggu"><div class="putar"></div><p>Memuat…</p></div>`;

  await Store.siap;

  if (!Store.cms) {
    app.innerHTML = `<div class="layar-tunggu">
      <p><b>Website belum dapat ditampilkan.</b></p>
      <p>${Store.perluPasang()
        ? 'Data awal belum dipasang. Buka ERP untuk memasangnya sekali.'
        : 'Sambungan ke server sedang bermasalah. Coba muat ulang sebentar lagi.'}</p>
      ${Store.perluPasang() ? '<p><a href="erp.html">Buka ERP →</a></p>' : ''}
    </div>`;
    return;
  }

  render(nama, file);
  terakhir = JSON.stringify(Store.cms);
  sudahGambar = true;
}

/* Auto-render ulang bila ERP menyetujui perubahan. Sejak isinya dijajaki
   dari server, ini berlaku antar-PENGGUNA — bukan sekadar antar-tab. */
let terakhir = null;
let sudahGambar = false;
Store.berlangganan(() => {
  if (!sudahGambar || !window.__halamanAktif) return;
  const kini = JSON.stringify(Store.cms);
  if (kini !== terakhir) {
    terakhir = kini;
    render(window.__halamanAktif.nama, window.__halamanAktif.file);
    toast('Website diperbarui dari ERP.');
  }
});

window.Situs = { mulai, render, toast, IK, el, esc, tglID, terapkanTema };
