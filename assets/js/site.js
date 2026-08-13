/* ============================================================
   SITE.JS — Perender website publik
   ------------------------------------------------------------
   Halaman publik TIDAK menyimpan konten di HTML. Setiap section
   dirender dari Store.cms (versi tayang). Karena itu perubahan
   yang disetujui di ERP langsung terlihat di sini setelah reload
   — bahkan otomatis, lewat Store.berlangganan (sinkron antar-tab).
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
  r.setProperty('--font-judul', t.fontJudul);
  r.setProperty('--font-skrip', t.fontSkrip);
  r.setProperty('--radius', t.radius + 'px');
  r.setProperty('--lebar', t.lebarKonten + 'px');
}

/* ---------------- kerangka: header, footer, nav ---------------- */
const LAMBANG = `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,.5)" stroke-width="1.2"/><path d="M20 7c5 4 8 8 8 13a8 8 0 0 1-16 0c0-5 3-9 8-13z" stroke="var(--hijau-muda)" stroke-width="1.5" fill="rgba(140,198,63,.18)"/><path d="M20 15v10M16 19h8" stroke="var(--oranye)" stroke-width="1.5" stroke-linecap="round"/></svg>`;

function renderHeader(aktif) {
  const s = Store.cms.situs;
  const menu = s.menu.map((m) => `<a href="${esc(m.href)}" class="${m.href === aktif ? 'aktif' : ''}">${esc(m.label)}</a>`).join('');
  const h = el(`<header class="header"><div class="wrap header-in">
    <a class="merek" href="index.html">
      <span class="merek-lambang">${LAMBANG}</span>
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
          <span class="merek-lambang">${LAMBANG}</span>
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

const GELOMBANG = `<div class="gelombang"><svg viewBox="0 0 1440 110" preserveAspectRatio="none">
  <path d="M0,62 C240,110 480,10 720,42 C960,74 1200,110 1440,58 L1440,110 L0,110 Z" fill="var(--oranye)" opacity=".92"/>
  <path d="M0,76 C240,124 480,24 720,56 C960,88 1200,120 1440,72 L1440,110 L0,110 Z" fill="var(--hijau-muda)"/>
  <path d="M0,92 C240,136 480,40 720,72 C960,102 1200,132 1440,88 L1440,110 L0,110 Z" fill="var(--krem)"/>
</svg></div>`;

/* ---------------- kepala section ---------------- */
function kepala(d, tengah = false) {
  return `<div class="kepala${tengah ? ' kepala-tengah' : ''}">
    ${d.nomor ? `<div class="nomor">${esc(d.nomor)}</div>` : ''}
    <div>
      ${d.skrip ? `<div class="judul-skrip">${esc(d.skrip)}</div>` : ''}
      <h2 class="judul-teks">${esc(d.judul)}</h2>
      <div class="garis-bawah"></div>
    </div>
  </div>`;
}

/* ============================================================
   PERENDER PER TIPE SECTION
   Menambah tipe baru cukup menambah entri di objek ini.
   ============================================================ */
const RENDER = {

  hero(d) {
    const n = el(`<section class="hero">
      <div class="hero-bg"><img src="${d.gambar}" alt=""></div>
      <div class="wrap hero-in">
        <div class="kaligrafi" style="--durasi:${d.durasiAnimasi || 4.5}s">
          <svg viewBox="0 0 400 120" role="img" aria-label="${esc(d.arab)}">
            <text x="380" y="82" text-anchor="start" direction="rtl">${esc(d.arab)}</text>
            <circle class="pena" r="3.6"/>
          </svg>
        </div>
        <div class="hero-skrip">${esc(d.skrip)}</div>
        <h1 class="hero-judul">${esc(d.judul)}</h1>
        <p class="hero-sub">${esc(d.subjudul)}</p>
        ${d.tombolTeks ? `<a class="tombol" href="${esc(d.tombolLink)}">${esc(d.tombolTeks)} ${IK.panah}</a>` : ''}
      </div>
      ${GELOMBANG}
    </section>`);
    return n;
  },

  'hero-halaman'(d) {
    return el(`<section class="hero hero-halaman">
      <div class="hero-bg"><img src="${d.gambar}" alt=""></div>
      <div class="wrap hero-halaman-in">
        <div class="hero-skrip">${esc(d.skrip)}</div>
        <h1 class="hero-judul">${esc(d.judul)}</h1>
        <p class="hero-sub">${esc(d.subjudul)}</p>
      </div>
      ${GELOMBANG}
    </section>`);
  },

  'teks-gambar'(d) {
    return el(`<section class="sec pola-terang"><div class="wrap">
      ${kepala(d)}
      <div class="grid-teks-gambar ${d.posisiGambar === 'kanan' ? 'kanan' : ''}">
        <div class="kotak-gambar"><img src="${d.gambar}" alt=""></div>
        <div class="isi-teks">${d.paragraf.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      </div>
    </div></section>`);
  },

  timeline(d) {
    return el(`<section class="sec sec-gelap"><div class="wrap">
      ${kepala(d)}
      <div class="grid-timeline">
        <div class="timeline">
          ${d.butir.map((b) => `<div class="tl-butir"><span class="tl-ikon">${IK.buku}</span><p>${esc(b.teks)}</p></div>`).join('')}
        </div>
        <div class="gambar-tegak"><img src="${d.gambar}" alt=""></div>
      </div>
    </div></section>`);
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
    return el(`<section class="sec sec-gelap"><div class="wrap">
      ${kepala(d)}
      ${d.intro ? `<p class="intro-sec">${esc(d.intro)}</p>` : ''}
      <div class="grid-dua">${d.kolom.map(kol).join('')}</div>
    </div></section>`);
  },

  'visi-misi'(d) {
    return el(`<section class="sec pola-terang"><div class="wrap">
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
      </div>
    </div></section>`);
  },

  organisasi(d) {
    const kartu = d.jabatan.map((j) => `<div class="kartu-org">
      <div class="org-ikon">${ikonOrg(j.ikon)}</div>
      <div class="org-jabatan">${esc(RBAC.roleLabel(j.role))}</div>
      <div class="org-nama">${esc(j.nama)}</div>
    </div>`).join('');
    return el(`<section class="sec pola-terang"><div class="wrap">
      ${kepala(d)}
      ${d.intro ? `<p style="max-width:640px;margin:-18px 0 32px;color:#55645A;font-size:15px">${esc(d.intro)}</p>` : ''}
      <div class="grid-org">${kartu}</div>
    </div></section>`);
  },

  /* --------- daftar anggota dengan filter + pencarian --------- */
  anggota(d) {
    const sec = el(`<section class="sec pola-terang"><div class="wrap">
      ${kepala(d, true)}
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
          <div class="ang-detail">${IK.orang}<span>${esc(RBAC.roleLabel(u.role))}</span></div>
          <div class="ang-sosmed">
            <a href="#" aria-label="Facebook">${IK.facebook}</a>
            <a href="#" aria-label="Instagram">${IK.instagram}</a>
            <a href="mailto:${esc(u.email)}" aria-label="Email">${IK.email}</a>
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
    let kategori = '', halaman = 1;
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
    sec.querySelector('.nl-form').onsubmit = (e) => {
      e.preventDefault();
      const inp = e.target.querySelector('input');
      const baru = Store.berlanggananNewsletter(inp.value);
      toast(baru ? 'Terima kasih! Email Anda berhasil didaftarkan.' : 'Email ini sudah terdaftar sebelumnya.');
      inp.value = '';
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

    sec.querySelector('#formKontak').onsubmit = (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      Store.kirimPesan({
        nama: f.get('nama'), email: f.get('email'),
        subjek: f.get('subjek'), isi: f.get('isi'),
      });
      e.target.reset();
      toast('Pesan terkirim. Masuk ke kotak masuk Sekretaris di ERP.');
    };
    return sec;
  },

  faq(d) {
    const sec = el(`<section class="sec" style="padding-top:0"><div class="wrap" style="max-width:840px">
      ${kepala(d, true)}
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

/* ---------------- modal baca artikel ---------------- */
let tirai;
function bukaArtikel(id) {
  const a = Store.db.artikel.find((x) => x.id === id);
  if (!a) return;
  a.dilihat = (a.dilihat || 0) + 1;
  Store.simpan();

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

/* Auto-render ulang bila ERP menyetujui perubahan di tab lain. */
let terakhir = JSON.stringify(Store.cms);
Store.berlangganan(() => {
  const kini = JSON.stringify(Store.cms);
  if (kini !== terakhir && window.__halamanAktif) {
    terakhir = kini;
    render(window.__halamanAktif.nama, window.__halamanAktif.file);
    toast('Website diperbarui dari ERP.');
  }
});

window.Situs = { render, toast, IK, el, esc, tglID, terapkanTema };
