/* ============================================================
   FONT — daftar pilihan & pemuatnya
   ------------------------------------------------------------
   Sebelumnya font disimpan sebagai tumpukan CSS mentah di dalam tema,
   dan disunting lewat kolom teks biasa di ERP. Bentuknya memang bisa
   diketik, tetapi hasilnya tidak pernah berlaku: mengetik "Poppins"
   di sana tak menjadikan Poppins terpasang, sebab berkas fontnya tak
   pernah diunduh. Kolom yang tampak bekerja padahal tidak adalah
   kegagalan yang paling sulit disadari.

   Karena itu font kini dipilih dari daftar. Tiap pilihan membawa dua
   hal sekaligus: tumpukan CSS-nya, DAN alamat unduhnya. Yang dipilih
   pasti terpasang; yang tidak ada di daftar tidak bisa dipilih.

   Berkas ini dimuat halaman publik maupun ERP, sehingga keduanya
   membaca daftar yang sama persis.
   ============================================================ */

/* Berat huruf ditulis per font, bukan seragam. Google Fonts menolak
   SELURUH permintaan bila satu berat saja tidak tersedia pada salah
   satu keluarga — Merriweather tak punya 600, misalnya — dan
   penolakan itu berarti seluruh halaman kehilangan fontnya sekaligus. */
const FONT_UTAMA = {
  jakarta: {
    label: 'Plus Jakarta Sans', ket: 'Bawaan — modern, bulat, mudah dibaca',
    q: 'Plus+Jakarta+Sans:wght@400;600;700;800',
    tumpuk: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
  },
  inter: {
    label: 'Inter', ket: 'Netral dan sangat jernih di layar kecil',
    q: 'Inter:wght@400;600;700;800',
    tumpuk: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },
  poppins: {
    label: 'Poppins', ket: 'Geometris, judulnya tegas',
    q: 'Poppins:wght@400;600;700;800',
    tumpuk: "'Poppins', 'Segoe UI', system-ui, sans-serif",
  },
  nunito: {
    label: 'Nunito Sans', ket: 'Lembut, ramah, cocok untuk teks panjang',
    q: 'Nunito+Sans:wght@400;600;700;800',
    tumpuk: "'Nunito Sans', 'Segoe UI', system-ui, sans-serif",
  },
  lora: {
    label: 'Lora', ket: 'Berkait — bernuansa naskah dan keilmuan',
    q: 'Lora:wght@400;600;700',
    tumpuk: "'Lora', Georgia, 'Times New Roman', serif",
  },
  merriweather: {
    label: 'Merriweather', ket: 'Berkait, tebal, nyaman dibaca lama',
    q: 'Merriweather:wght@400;700',
    tumpuk: "'Merriweather', Georgia, 'Times New Roman', serif",
  },
  sourceserif: {
    label: 'Source Serif 4', ket: 'Berkait modern, bersih untuk artikel',
    q: 'Source+Serif+4:wght@400;600;700',
    tumpuk: "'Source Serif 4', Georgia, 'Times New Roman', serif",
  },
  /* Tanpa unduhan sama sekali: paling cepat, dan satu-satunya yang
     tetap utuh ketika Google Fonts tak dapat dijangkau. */
  sistem: {
    label: 'Bawaan Perangkat', ket: 'Tanpa unduhan — tercepat, selalu tersedia',
    q: '',
    tumpuk: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
};

const FONT_AKSEN = {
  caveat: {
    label: 'Caveat', ket: 'Bawaan — tulisan tangan yang mengalir',
    q: 'Caveat:wght@600;700',
    tumpuk: "'Caveat', 'Segoe Script', cursive",
  },
  kalam: {
    label: 'Kalam', ket: 'Tulisan tangan tegak, lebih terbaca',
    q: 'Kalam:wght@400;700',
    tumpuk: "'Kalam', 'Segoe Script', cursive",
  },
  patrick: {
    label: 'Patrick Hand', ket: 'Sederhana, seperti tulisan pensil',
    q: 'Patrick+Hand',
    tumpuk: "'Patrick Hand', 'Segoe Script', cursive",
  },
  shadows: {
    label: 'Shadows Into Light', ket: 'Tipis dan miring, berkesan ringan',
    q: 'Shadows+Into+Light',
    tumpuk: "'Shadows Into Light', 'Segoe Script', cursive",
  },
  /* Nilai kosong berarti "ikut font utama" — dipetakan saat diterapkan. */
  sama: { label: 'Sama dengan Font Utama', ket: 'Tanpa aksen tulisan tangan', q: '', tumpuk: '' },
};

const FONT_ARAB = {
  amiri: {
    label: 'Amiri', ket: 'Bawaan — naskh klasik, lazim untuk mushaf',
    q: 'Amiri:wght@400;700',
    tumpuk: "'Amiri', 'Traditional Arabic', Georgia, serif",
  },
  scheherazade: {
    label: 'Scheherazade New', ket: 'Naskh lapang, harakatnya jelas',
    q: 'Scheherazade+New:wght@400;700',
    tumpuk: "'Scheherazade New', 'Traditional Arabic', Georgia, serif",
  },
  notonaskh: {
    label: 'Noto Naskh Arabic', ket: 'Naskh modern, rapi di layar',
    q: 'Noto+Naskh+Arabic:wght@400;700',
    tumpuk: "'Noto Naskh Arabic', 'Traditional Arabic', Georgia, serif",
  },
};

/* Yang sudah dimuat lewat <link> statis di kepala tiap halaman. Tidak
   perlu diminta ulang — dan membiarkannya statis membuat tampilan
   bawaan tampil seketika, tanpa menunggu data tema tiba dari server. */
const FONT_BAWAAN = new Set(['jakarta', 'caveat', 'amiri']);

const kel = (jenis) => (jenis === 'aksen' ? FONT_AKSEN : jenis === 'arab' ? FONT_ARAB : FONT_UTAMA);

/** Tumpukan CSS untuk sebuah kunci; jatuh ke bawaan bila tak dikenal. */
function tumpuk(jenis, kunci) {
  const d = kel(jenis);
  const bawaan = jenis === 'aksen' ? 'caveat' : jenis === 'arab' ? 'amiri' : 'jakarta';
  return (d[kunci] || d[bawaan]).tumpuk;
}

/**
 * Pastikan font terpilih benar-benar terunduh.
 *
 * Seluruh keluarga digabung ke SATU <link>, dan link itu ditulis ulang
 * di tempat alih-alih ditambah: kalau tidak, tiap pergantian pilihan
 * meninggalkan satu berkas font yang tak dipakai lagi tetapi terus
 * ikut diunduh pengunjung berikutnya.
 */
function muat(pilihan) {
  if (typeof document === 'undefined') return;
  const q = [];
  Object.entries(pilihan || {}).forEach(([jenis, kunci]) => {
    if (FONT_BAWAAN.has(kunci)) return;          // sudah ada di <link> statis
    const f = kel(jenis)[kunci];
    if (f && f.q) q.push(f.q);
  });

  const lama = document.getElementById('fontPilihan');
  if (!q.length) { if (lama) lama.remove(); return; }

  const href = 'https://fonts.googleapis.com/css2?family=' + q.join('&family=') + '&display=swap';
  if (lama) { if (lama.href !== href) lama.href = href; return; }

  const l = document.createElement('link');
  l.id = 'fontPilihan';
  l.rel = 'stylesheet';
  l.href = href;
  document.head.appendChild(l);
}

/**
 * Unduh SELURUH keluarga di daftar sekaligus. Hanya dipakai halaman
 * Tema di ERP, tempat tiap pilihan ditampilkan dengan contoh hurufnya
 * sendiri — contoh yang digambar memakai font cadangan tidak ada
 * gunanya, sebab yang hendak dibandingkan justru rupa fontnya.
 *
 * Halaman publik tidak pernah memanggil ini: ia hanya mengunduh yang
 * benar-benar terpakai.
 */
function muatSemua() {
  if (typeof document === 'undefined') return;
  const q = [];
  [FONT_UTAMA, FONT_AKSEN, FONT_ARAB].forEach((d) => {
    Object.values(d).forEach((f) => { if (f.q && !q.includes(f.q)) q.push(f.q); });
  });
  const l = document.getElementById('fontContoh') || document.createElement('link');
  l.id = 'fontContoh';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=' + q.join('&family=') + '&display=swap';
  if (!l.parentNode) document.head.appendChild(l);
}

/** Petakan tumpukan CSS lama menjadi kunci — dipakai saat migrasi. */
function kenali(jenis, tumpukLama) {
  const teks = String(tumpukLama || '').toLowerCase();
  const d = kel(jenis);
  const ketemu = Object.keys(d).find((k) => {
    const nama = d[k].label.toLowerCase();
    return nama !== 'bawaan perangkat' && teks.includes(nama);
  });
  return ketemu || (jenis === 'aksen' ? 'caveat' : jenis === 'arab' ? 'amiri' : 'jakarta');
}

window.FONT = { UTAMA: FONT_UTAMA, AKSEN: FONT_AKSEN, ARAB: FONT_ARAB,
                kel, tumpuk, muat, muatSemua, kenali };
