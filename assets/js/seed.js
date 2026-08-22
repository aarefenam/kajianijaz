/* ============================================================
   SEED — Data awal Kajian Al-I'jaz
   ------------------------------------------------------------
   Semua isi halaman publik hidup di sini sebagai DATA, bukan
   sebagai HTML. Inilah yang membuat website ini "CMS": halaman
   publik hanya me-render objek ini, dan ERP mengubah objek ini.
   ============================================================ */

/* Placeholder gambar berbasis SVG data-URI supaya prototipe
   berjalan penuh tanpa file eksternal / koneksi internet. */
function ph(label, c1, c2, arab) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
      </linearGradient>
      <pattern id="p" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="rgba(255,255,255,.10)" stroke-width="1.2"/>
      </pattern>
    </defs>
    <rect width="800" height="560" fill="url(#g)"/>
    <rect width="800" height="560" fill="url(#p)"/>
    <text x="400" y="270" text-anchor="middle" font-family="Amiri, Georgia, serif" font-size="72" fill="rgba(255,255,255,.30)">${arab || ''}</text>
    <text x="400" y="330" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="21" letter-spacing="3" fill="rgba(255,255,255,.60)">${label}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s+/g, ' '));
}

/* Lambang & ikon bawaan sebagai data-URI, bukan SVG sebaris.
   Bentuk data-URI penting: itulah yang membuat editor CMS mengenalinya
   sebagai gambar dan otomatis menyediakan pengunggah, sehingga PJ Website
   dapat menggantinya dengan berkas sendiri tanpa menyentuh kode. */
function lambangBawaan() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" stroke="rgba(255,255,255,.55)" stroke-width="1.2"/>
    <path d="M20 7c5 4 8 8 8 13a8 8 0 0 1-16 0c0-5 3-9 8-13z" stroke="#8CC63F" stroke-width="1.5" fill="rgba(140,198,63,.20)"/>
    <path d="M20 15v10M16 19h8" stroke="#F0951E" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s+/g, ' '));
}

function ikonBawaan(latar, tinta) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="7" fill="${latar}"/>
    <text x="16" y="23.5" text-anchor="middle" font-size="20" fill="${tinta}" font-family="Amiri, Georgia, serif">ا</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s+/g, ' '));
}

/* Siluet masjid untuk hero — digambar sebagai SVG, bukan foto, agar
   ringan, tajam di segala ukuran, dan tetap berjalan tanpa internet.
   Berbentuk data-URI supaya editor CMS mengenalinya sebagai gambar dan
   menyediakan pengunggah, sehingga bisa diganti foto asli lewat ERP. */
function masjidBawaan() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 580" fill="none"> <defs> <linearGradient id="batu" x1="0" y1="0" x2="0.35" y2="1"> <stop offset="0" stop-color="#EFE4D2"/><stop offset="1" stop-color="#A98F6E"/> </linearGradient> <linearGradient id="kubah" x1="0.15" y1="0" x2="0.9" y2="1"> <stop offset="0" stop-color="#F6EFE1"/><stop offset="1" stop-color="#BBA383"/> </linearGradient> <linearGradient id="menara" x1="0" y1="0" x2="1" y2="0"> <stop offset="0" stop-color="#F2E7D5"/><stop offset="1" stop-color="#A38A69"/> </linearGradient> </defs> <g> <path d="M388 34 v-16" stroke="#F0951E" stroke-width="3" stroke-linecap="round"/> <circle cx="388" cy="30" r="5.5" fill="#F0951E"/> <path d="M369 74 c0-17 9-28 19-36 10 8 19 19 19 36 z" fill="url(#kubah)"/> <rect x="366" y="74" width="44" height="9" rx="2.5" fill="#C9B393"/> <rect x="358" y="83" width="60" height="7" rx="2" fill="#D8C5A6"/> <rect x="364" y="90" width="48" height="30" fill="url(#menara)"/> <rect x="356" y="120" width="64" height="11" rx="3" fill="#E4D3B5"/> <g fill="#6E5B41" opacity=".55"> <rect x="369" y="96" width="6" height="18" rx="3"/> <rect x="385" y="96" width="6" height="18" rx="3"/> <rect x="401" y="96" width="6" height="18" rx="3"/> </g> <path d="M366 131 h48 l7 200 h-62 z" fill="url(#menara)"/> <g stroke="#8B7455" stroke-width="1" opacity=".45"> <path d="M372 160 h36M371 196 h39M370 232 h41M369 268 h43M368 304 h45"/> </g> <g fill="#6E5B41" opacity=".5"> <path d="M381 176 c0-6 4-10 9-10 s9 4 9 10 v26 h-18 z"/> <path d="M380 250 c0-6 4-10 9-10 s9 4 9 10 v26 h-18 z"/> </g> <rect x="349" y="331" width="82" height="12" rx="3" fill="#E4D3B5"/> <path d="M355 343 h70 l6 237 h-82 z" fill="url(#menara)"/> <g fill="#6E5B41" opacity=".45"> <path d="M377 384 c0-7 5-12 11-12 s11 5 11 12 v34 h-22 z"/> <path d="M376 470 c0-7 5-12 11-12 s11 5 11 12 v34 h-22 z"/> </g> </g> <g> <path d="M170 106 v-14" stroke="#F0951E" stroke-width="3" stroke-linecap="round"/> <circle cx="170" cy="110" r="5.5" fill="#F0951E"/> <path d="M118 262 c-24-46 -2-86 34-112 14-10 16-20 18-32 2 12 4 22 18 32 36 26 58 66 34 112 z" fill="url(#kubah)"/> <path d="M118 262 c-24-46 -2-86 34-112 14-10 16-20 18-32" stroke="#F6EFE1" stroke-width="1.6" opacity=".7"/> <g stroke="#A38A69" stroke-width="1.2" opacity=".5"> <path d="M170 122 v140M143 138 c-14 34-18 82 -8 124M197 138 c14 34 18 82 8 124"/> </g> <rect x="112" y="262" width="116" height="16" rx="4" fill="#D8C5A6"/> <rect x="120" y="278" width="100" height="34" fill="url(#batu)"/> <g fill="#6E5B41" opacity=".5"> <path d="M133 292 c0-4 3-7 7-7 s7 3 7 7 v18h-14z"/> <path d="M163 292 c0-4 3-7 7-7 s7 3 7 7 v18h-14z"/> <path d="M193 292 c0-4 3-7 7-7 s7 3 7 7 v18h-14z"/> </g> <rect x="112" y="312" width="116" height="11" rx="3" fill="#E4D3B5"/> <path d="M124 323 h92 l10 45 h-112 z" fill="url(#batu)"/> <path d="M64 276 v-10" stroke="#F0951E" stroke-width="2.4" stroke-linecap="round"/> <circle cx="64" cy="280" r="4" fill="#F0951E"/> <path d="M40 356 c-13-25 -1-46 18-60 2-2 4-5 6-9 2 4 4 7 6 9 19 14 31 35 18 60 z" fill="url(#kubah)"/> <rect x="36" y="356" width="56" height="10" rx="3" fill="#D8C5A6"/> <path d="M36 366 h216 v214 h-216 z" fill="url(#batu)"/> <g fill="#DCC9A9"> <path d="M22 350 c0-9 5-15 12-19 7 4 12 10 12 19 z"/> <rect x="20" y="350" width="28" height="7" rx="2"/> <rect x="24" y="357" width="20" height="223"/> <path d="M242 350 c0-9 5-15 12-19 7 4 12 10 12 19 z"/> <rect x="240" y="350" width="28" height="7" rx="2"/> <rect x="244" y="357" width="20" height="223"/> </g> <g fill="#6E5B41" opacity=".45"> <path d="M56 432 c0-12 9-22 21-22 s21 10 21 22 v58 h-42 z"/> <path d="M112 432 c0-12 9-22 21-22 s21 10 21 22 v58 h-42 z"/> <path d="M168 432 c0-12 9-22 21-22 s21 10 21 22 v58 h-42 z"/> </g> <g stroke="#8B7455" stroke-width="1.2" opacity=".4"> <path d="M36 400 h216M36 506 h216"/> </g> <path d="M120 580 v-74 c0-13 10-24 24-24 s24 11 24 24 v74 z" fill="#5C4A34" opacity=".55"/> <path d="M120 580 v-74 c0-13 10-24 24-24 s24 11 24 24 v74" stroke="#E4D3B5" stroke-width="2" opacity=".55"/> </g> <rect x="0" y="574" width="460" height="6" fill="#A98F6E" opacity=".35"/> </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function avatar(nama, warna) {
  const inisial = nama.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <rect width="240" height="240" fill="${warna}"/>
    <text x="120" y="120" text-anchor="middle" dominant-baseline="central" font-family="Helvetica, Arial, sans-serif" font-size="86" font-weight="600" fill="rgba(255,255,255,.92)">${inisial}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s+/g, ' '));
}

/* Tanda tangan bawaan: coretan SVG yang dibangkitkan dari nama, bukan
   teks berhuruf sambung. Coretan selalu terbaca sebagai tanda tangan
   di peramban mana pun, sedangkan font sambung tidak dimuat di dalam
   SVG yang dipasang lewat <img>. Berbentuk data-URI supaya editor
   mengenalinya sebagai gambar dan menyediakan pengunggah — tanda
   tangan asli bisa dipindai lalu diunggah menggantikannya. */
function ttdBawaan(nama) {
  let benih = 7;
  for (const c of nama) benih = (benih * 31 + c.charCodeAt(0)) % 2147483647;
  if (benih <= 0) benih = 12345;
  /* Pengali kecil disengaja: 16807 × 2147483647 masih di bawah batas
     bilangan bulat aman JavaScript. Pengali LCG yang lazim justru
     kehilangan presisi di sini, dan deretnya merosot jadi seragam —
     seluruh tanda tangan lantas tampak serupa. */
  const acak = () => { benih = (benih * 16807) % 2147483647; return benih / 2147483647; };
  let d = `M12 ${38 + acak() * 14}`;
  for (let i = 0; i < 8; i++) {
    const x = 12 + (i + 1) * 22;
    const naik = i % 2 === 0;
    d += ` Q${x - 14} ${naik ? 8 + acak() * 18 : 44 + acak() * 18} ${x} ${26 + acak() * 20}`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 72">
    <path d="${d}" fill="none" stroke="#1D2A21" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M20 60 q40 7 84 1 t62-4" fill="none" stroke="#1D2A21" stroke-width="1.5" stroke-linecap="round" opacity=".75"/>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s+/g, ' '));
}

const SEED = {

  /* ==========================================================
     1. TEMA — dikendalikan penuh oleh PJ Website lewat ERP.
     Setiap key di sini di-inject sebagai CSS custom property.
     ========================================================== */
  theme: {
    hijauTua   : '#0E2E1C',
    hijau      : '#1B5E20',
    hijauMuda  : '#8CC63F',
    oranye     : '#F0951E',
    krem       : '#F7F5EF',
    teks       : '#1D2A21',
    /* Kunci dari daftar di font.js, bukan tumpukan CSS mentah — lihat
       keterangan di sana untuk alasannya. */
    fontUtama  : 'jakarta',
    fontMerek  : 'playfair',
    fontArab   : 'amiri',
    radius     : 16,
    lebarKonten: 1180,
  },

  /* ==========================================================
     2. IDENTITAS SITUS — footer, header, kontak, sosmed
     ========================================================== */
  situs: {
    nama      : "Al-I'jaz",
    tagline   : "Kajian Tafsir & 'Ulum al-Quran",
    /* Identitas visual — seluruhnya dapat diganti dari ERP.
       logo       : lambang di header & footer website, sidebar & layar masuk ERP
       favicon    : ikon tab peramban untuk website publik
       faviconErp : ikon tab peramban untuk ERP, sengaja dibedakan warnanya
                    agar tab admin mudah dibedakan dari tab website */
    logo      : lambangBawaan(),
    favicon   : ikonBawaan('#0E2E1C', '#8CC63F'),
    faviconErp: ikonBawaan('#8CC63F', '#0E2E1C'),
    naungan   : 'Di bawah naungan IKPM Kairo, Mesir',
    deskripsi : "Forum keilmuan yang berfokus pada studi tafsir al-Quran dan 'ulum al-Quran.",
    email     : 'kajianalijaz@gmail.com',
    telepon   : '+20 100 000 0000',
    alamat    : 'Sekretariat IKPM Kairo, Hay Asyir, Nasr City, Kairo, Mesir',
    maps      : 'Nasr City, Kairo, Mesir',
    sosmed    : {
      instagram: 'https://instagram.com/kajian.alijaz',
      facebook : 'https://facebook.com/kajianalijaz',
      youtube  : 'https://youtube.com/@kajianalijaz',
      telegram : 'https://t.me/kajianalijaz',
    },
    /* Menu navigasi — bisa ditambah/kurangi dari ERP */
    /* "Artikel" sengaja tidak ada di sini — tempatnya di sidebar kategori
       pada hero, sebab pengunjung yang datang untuk membaca hampir selalu
       datang untuk satu topik tertentu, bukan untuk daftar seluruhnya. */
    menu: [
      { label: 'Beranda',        href: 'index.html'   },
      { label: 'Tentang Kajian', href: 'tentang.html' },
      { label: 'Kontak',         href: 'kontak.html'  },
    ],
  },

  /* ==========================================================
     3. HALAMAN — array section. Urutan array = urutan tampil.
     `aktif:false` menyembunyikan section tanpa menghapus datanya.
     ========================================================== */
  halaman: {

    /* ---------- PAGE 1 : BERANDA ---------- */
    beranda: {
      judul: 'Beranda',
      sections: [
        {
          id: 'hero', tipe: 'hero', nama: 'Hero — Sambutan & Pencarian', aktif: true,
          data: {
            judul       : "Kajian Al-I'jaz",
            subjudul    : 'Menggali al-Quran dengan ilmu, menghidupkan hati dengan tafsir. '
                        + 'Forum kajian dan kepenulisan makalah di bawah naungan IKPM Kairo — '
                        + 'terbuka bagi siapa pun yang ingin menekuni tafsir secara bersungguh-sungguh.',
            cariPetunjuk: 'Cari kajian, artikel, atau buku…',
            tombolTeks  : 'Kenali Lebih Dekat',
            tombolLink  : 'tentang.html',
            tombol2Teks : 'Baca Artikel',
            tombol2Link : 'artikel.html',
            lencana     : "Kajian Al-I'jaz",
            masjid      : masjidBawaan(),
          },
        },
        {
          id: 'pemisah-hero', tipe: 'pemisah', nama: 'Pemisah — Kutipan', aktif: true,
          data: {
            kutipan: 'Sebaik-baik kalian adalah yang mempelajari al-Quran dan mengajarkannya.',
            sumber : 'HR. Bukhari',
          },
        },
        {
          id: 'tentang-singkat', tipe: 'teks-gambar', nama: 'About Us Singkat', aktif: true,
          data: {
            tema      : 'krem',
            judul   : "Apa itu Kajian Al-I'jaz?",
            gambar: ph('QALAM & KITAB', '#E8E4D8', '#BFCBA8', 'علم'),
            posisiGambar: 'kiri',
            paragraf: [
              "Kajian Al-I'jaz merupakan sebuah forum kajian dan kepenulisan makalah yang secara khusus berfokus pada studi tafsir al-Quran dan ilmu-ilmu yang berkaitan dengannya (baca: 'Ulum al-Quran). Kajian ini berada di bawah naungan IKPM Kairo Mesir, dan menjadi salah satu wadah pembinaan intelektual bagi mahasiswa, khususnya yang memiliki perhatian dan minat mendalam terhadap kajian al-Quran dan tafsir.",
              "Sebagai forum akademik, Kajian Al-I'jaz tidak hanya berfungsi sebagai tempat penyampaian materi, tetapi juga sebagai ruang dialektika ilmiah yang mendorong anggotanya untuk aktif berdiskusi, menganalisis, serta mengembangkan pemahaman terhadap al-Quran secara komprehensif.",
              "Selain itu, Kajian Al-I'jaz juga berperan sebagai sarana penguatan tradisi akademik di kalangan mahasiswa Indonesia di Kairo, khususnya dalam bidang tafsir dan 'ulum al-Quran, yang menuntut ketelitian, kedalaman analisis, serta kemampuan literasi yang tinggi.",
            ],
          },
        },
        {
          id: 'panel-kajian', tipe: 'panel', nama: 'Panel — Kajian Terbaru', aktif: true,
          data: {
            sumber    : 'kajian',
            tema      : 'hijau',
            judul     : 'Kajian Terbaru',
            teks      : 'Jadwal kajian pekanan beserta pemakalah dan tempatnya. Terbuka untuk diikuti — datang, simak, lalu ikut berdiskusi.',
            jumlah    : 6,
            tombolTeks: '',
            tombolLink: '',
          },
        },
        {
          id: 'syarah', tipe: 'timeline', nama: "Syarah / Sejarah Kajian Al-I'jaz", aktif: true,
          data: {
            tema      : 'krem',
            judul   : "Syarah Kajian Al-I'jaz",
            gambar: ph('AL-AZHAR KAIRO', '#1B5E20', '#0E2E1C', 'الأزهر'),
            butir : [
              { teks: "Kajian Al-I'jaz didirikan pada tanggal 23 November 2011 di sekretariat IKPM lama, Kairo. Pendirian kajian ini dilatarbelakangi oleh kebutuhan akan adanya forum khusus yang secara intensif membahas ilmu tafsir dan 'ulum al-Quran, mengingat pentingnya kedua disiplin tersebut dalam memahami al-Quran secara mendalam." },
              { teks: "Kajian ini digagas oleh beberapa mahasiswa yang memiliki latar belakang dan perhatian khusus dalam bidang tersebut, di antaranya: al-Ustadz Jauhar Ridloni Marzuq, al-Ustadz Novan Hariansyah, al-Ustadz Dede Permana, dan al-Ustadz Saeful Luthfy. Mereka melihat bahwa diperlukan sebuah ruang kajian yang lebih fokus, sistematis, dan berkelanjutan untuk mendalami ilmu-ilmu al-Quran." },
              { teks: "Sebelum berdirinya Kajian Al-I'jaz, para penggagas merupakan bagian dari Kajian Nun, yaitu sebuah kajian umum yang berada di bawah IKPM. Namun, karena sifatnya yang masih umum dan belum terfokus pada satu disiplin tertentu, muncul inisiatif untuk membentuk kajian khusus yang secara spesifik mengkaji tafsir dan 'ulum al-Quran." },
              { teks: "Dari latar belakang tersebut, lahirlah Kajian Al-I'jaz sebagai bentuk pengkhususan bidang keilmuan, sekaligus upaya menjaga dan mengembangkan tradisi keilmuan yang lebih mendalam dan terarah. Sejak saat itu, kajian ini terus berkembang dan menjadi salah satu forum keilmuan yang konsisten dalam mengkaji al-Quran dari berbagai perspektif ilmiah." },
            ],
          },
        },
        {
          id: 'panel-artikel', tipe: 'panel', nama: 'Panel — Artikel Terbaru', aktif: true,
          data: {
            sumber    : 'artikel',
            tema      : 'hijau',
            judul     : 'Artikel Terbaru',
            teks      : 'Tulisan ilmiah seputar tafsir dan ilmu-ilmu al-Quran, disusun anggota dan ditinjau redaksi sebelum tayang.',
            jumlah    : 6,
            tombolTeks: 'Baca Artikel Lainnya',
            tombolLink: 'artikel.html',
          },
        },
        {
          id: 'sistem-metode', tipe: 'dua-kolom', nama: 'Sistem & Metode Kajian', aktif: true,
          data: {
            tema      : 'krem',
            judul   : 'Sistem & Metode Kajian',
            intro : 'Dalam pelaksanaannya, Kajian Al-I\'jaz menerapkan sistem pembelajaran yang terstruktur dan berjenjang, guna memastikan bahwa setiap anggota memperoleh pemahaman yang komprehensif dan berkesinambungan. Sistem kajian ini terbagi menjadi dua metode utama, yaitu:',
            kolom : [
              {
                label: 'A. Pembekalan Intensif (Tatsqif)',
                ikon : 'kitab',
                teks : "Tatsqif merupakan tahap awal yang wajib diikuti oleh anggota baru sebelum memasuki kajian reguler. Tahap ini bertujuan untuk memberikan bekal dasar dalam memahami ilmu-ilmu al-Quran, baik dari sisi konsep maupun metodologi.",
                poin : [
                  "Mengkaji satu kitab utama: al-Laali al-Hisan fi 'Ulum al-Quran karya Prof. Dr. Musa Syahin Lasyin.",
                  'Materi dibagi ke dalam beberapa tema yang dipresentasikan oleh peserta secara bergantian.',
                  'Dilengkapi sesi diskusi dan evaluasi untuk memperkuat pemahaman serta melatih kemampuan berpikir kritis.',
                  'Menjadi fondasi penting sebelum anggota melanjutkan ke tahap kajian reguler.',
                ],
              },
              {
                label: 'B. Kajian Reguler (Makalah)',
                ikon : 'makalah',
                teks : 'Setelah menyelesaikan tahap tatsqif, anggota akan mengikuti kajian reguler yang menjadi inti dari proses pembelajaran di Kajian Al-I\'jaz. Fokus pada penyusunan dan presentasi makalah ilmiah berdasarkan tema-tema tertentu yang telah ditentukan.',
                subJudul: 'Kajian reguler dibagi menjadi tiga level:',
                level: [
                  "Level 1: Ilmu-ilmu al-Quran ('Ulum al-Quran).",
                  'Level 2: Ilmu Tafsir dan Tokoh Tafsir beserta Karya-karyanya.',
                  'Level 3: Grand Tema dan Pembuatan Buku.',
                ],
                subJudul2: 'Melalui sistem ini, anggota dilatih untuk:',
                poin: [
                  'Mengkaji literatur secara mendalam.',
                  'Menyusun tulisan ilmiah secara sistematis.',
                  'Menyampaikan gagasan secara argumentatif.',
                  'Menanggapi dan mengkritisi pendapat secara ilmiah.',
                ],
                penutup: "Selain itu, kajian reguler juga menjadi sarana untuk memperkuat tradisi akademik, khususnya dalam bidang penulisan ilmiah yang menjadi salah satu keterampilan penting bagi mahasiswa, terutama di lingkungan akademik seperti al-Azhar.",
              },
            ],
          },
        },
        {
          id: 'panel-video', tipe: 'panel', nama: 'Panel — Video Kajian', aktif: true,
          data: {
            sumber    : 'video',
            tema      : 'hijau',
            judul     : 'Video Kajian',
            teks      : 'Rekaman dan cuplikan kajian yang sudah tayang, agar yang berhalangan hadir tetap dapat menyimaknya.',
            jumlah    : 6,
            tombolTeks: '',
            tombolLink: '',
          },
        },
        {
          id: 'panel-buku', tipe: 'panel', nama: 'Panel — Buku & Karya', aktif: true,
          data: {
            sumber    : 'buku',
            tema      : 'krem',
            judul     : 'Buku & Karya',
            teks      : 'Naskah yang sedang digarap bersama — dari pengumpulan tulisan, penyuntingan, sampai siap terbit.',
            jumlah    : 6,
            tombolTeks: '',
            tombolLink: '',
          },
        },
        {
          id: 'panel-agenda', tipe: 'panel', nama: 'Panel — Agenda Kegiatan', aktif: true,
          data: {
            sumber    : 'agenda',
            tema      : 'hijau',
            judul     : 'Agenda Kegiatan',
            teks      : 'Kegiatan yang akan datang. Yang sudah lewat turun sendiri dari daftar ini.',
            jumlah    : 6,
            tombolTeks: '',
            tombolLink: '',
          },
        },
        {
          id: 'panel-kontak', tipe: 'panel-kontak', nama: 'Panel — Hubungi Kami', aktif: true,
          data: {
            tema    : 'krem',
            judul   : 'Hubungi Kami',
            teks    : 'Untuk pertanyaan, kerja sama, atau sekadar bersilaturahmi. Nomor, surel, dan alamat di bawah dibaca langsung dari Identitas Situs — cukup diubah sekali di sana.',
            subJudul: 'Kontak Kami',
          },
        },
        {
          id: 'organisasi', tipe: 'organisasi', nama: 'Struktur Organisasi', aktif: true,
          data: {
            tema      : 'hijau',
            judul   : 'Susunan Organisasi',
            intro : 'Struktur kepengurusan yang menopang jalannya kajian, publikasi, dan administrasi organisasi.',
            /* Terhubung ke modul Anggota di ERP lewat field `role` */
            jabatan: [
              { role: 'ketua',      nama: 'Ust. Jauhar Ridloni Marzuq', ikon: 'ketua'    },
              { role: 'sekretaris', nama: 'Ust. Novan Hariansyah',      ikon: 'surat'    },
              { role: 'bendahara',  nama: 'Ust. Dede Permana',          ikon: 'kas'      },
              { role: 'pj_mediaweb',nama: 'Abdul Haris',                ikon: 'monitor'  },
              { role: 'pj_kti',     nama: 'Nur Silvia Salsabila',       ikon: 'pena'     },
              { role: 'pj_buku',    nama: 'Ust. Ahmad Zaky',            ikon: 'buku'     },
              { role: 'pj_kajian',  nama: 'Ust. Anwar Sadad',           ikon: 'kajian'   },
            ],
          },
        },
      ],
    },

    /* ---------- PAGE 2 : TENTANG KAJIAN ---------- */
    tentang: {
      judul: 'Tentang Kajian',
      sections: [
        {
          id: 'hero-tentang', tipe: 'hero-halaman', nama: 'Hero Halaman', aktif: true,
          data: {
            skrip   : 'Tentang Kami',
            judul   : "Keluarga Besar\nKajian Al-I'jaz",
            subjudul: "Berkenalan dengan para pendiri dan anggota Kajian Al-I'jaz yang berkomitmen dalam mendalami tafsir al-Quran dan 'ulum al-Quran.",
            gambar  : ph('MASJID & MENARA', '#0E2E1C', '#3D6B3F', 'مسجد'),
          },
        },
        {
          id: 'visi-misi', tipe: 'visi-misi', nama: 'Visi & Misi', aktif: true,
          data: {
            tema      : 'krem',
            judul   : 'Visi & Misi',
            visi : 'Menjadi kajian unggulan dalam pengembangan studi tafsir dan ilmu-ilmu al-Quran yang mampu melahirkan generasi yang berilmu, kritis, berintegritas, serta berkontribusi nyata bagi umat.',
            misi : [
              'Mengkaji dan mendalami ilmu-ilmu al-Quran secara sistematis, terarah, dan berkelanjutan.',
              "Meningkatkan kemampuan analisis, pemahaman, serta interpretasi anggota dalam bidang tafsir al-Qur'an.",
              'Mencetak kader-kader intelektual yang mampu berkontribusi dalam pengembangan studi al-Quran, baik dalam ranah akademik maupun sosial.',
              'Membangun tradisi keilmuan yang aktif dan produktif melalui diskusi ilmiah, presentasi, serta penulisan karya ilmiah.',
              'Menumbuhkan budaya berpikir kritis dan argumentatif yang tetap berlandaskan pada kaidah-kaidah ilmiah yang benar.',
            ],
          },
        },
        {
          id: 'keluarga-besar', tipe: 'anggota', nama: 'Keluarga Besar', aktif: true,
          data: {
            judul   : "Keluarga Besar Al-I'jaz",
            intro : 'Para pendiri, pengurus, dan anggota aktif yang menjaga keberlangsungan tradisi keilmuan.',
            tampilkanFilter: true,
          },
        },
      ],
    },

    /* ---------- PAGE 3 : ARTIKEL ---------- */
    artikel: {
      judul: 'Artikel',
      sections: [
        {
          id: 'hero-artikel', tipe: 'hero-halaman', nama: 'Hero Halaman', aktif: true,
          data: {
            skrip   : 'Artikel',
            judul   : "Tafsir &\n'Ulum al-Quran",
            subjudul: 'Kumpulan artikel ilmiah seputar tafsir al-Quran dan ilmu-ilmu yang berkaitan dengannya.',
            gambar  : ph('KITAB & QALAM', '#14351F', '#6B4A1E', 'تفسير'),
          },
        },
        {
          id: 'daftar-artikel', tipe: 'daftar-artikel', nama: 'Daftar Artikel', aktif: true,
          data: {
            judul     : 'Artikel Terbaru',
            perHalaman: 4,
            kategori  : ['Seputar Tafsir', 'Ulumul Quran', 'Tokoh Tafsir', 'Wawasan Keislaman', 'Berita Acara'],
          },
        },
        {
          id: 'kutipan', tipe: 'kutipan', nama: 'Kutipan & Newsletter', aktif: true,
          data: {
            kutipan: 'Al-Quran adalah laut ilmu yang dalam, dan tafsir adalah perahu yang mengantarkan kita memahaminya.',
            sumber : "Imam Asy-Syafi'i",
            nlJudul: 'Dapatkan Artikel Terbaru',
            nlTeks : "Berlangganan newsletter kami untuk mendapatkan artikel terbaru seputar tafsir dan 'ulum al-Quran.",
          },
        },
      ],
    },

    /* ---------- PAGE 4 : KONTAK ---------- */
    kontak: {
      judul: 'Kontak',
      sections: [
        {
          id: 'hero-kontak', tipe: 'hero-halaman', nama: 'Hero Halaman', aktif: true,
          data: {
            skrip   : 'Hubungi Kami',
            judul   : 'Mari Terhubung\nBersama Kami',
            subjudul: 'Punya pertanyaan seputar kajian, ingin bergabung, atau menjalin kerja sama? Sampaikan melalui form di bawah ini.',
            gambar  : ph('SEKRETARIAT', '#0E2E1C', '#2E5B4A', 'تواصل'),
          },
        },
        {
          id: 'form-kontak', tipe: 'form-kontak', nama: 'Form & Info Kontak', aktif: true,
          data: {
            judul   : 'Sampaikan Pesan Anda',
            intro : 'Tim kami akan membalas melalui email dalam 1–3 hari kerja.',
            subjek: ['Pendaftaran Anggota Baru', 'Pertanyaan Seputar Kajian', 'Kerja Sama & Kolaborasi', 'Kontribusi Artikel', 'Lainnya'],
          },
        },
        {
          id: 'faq', tipe: 'faq', nama: 'Pertanyaan Umum', aktif: true,
          data: {
            judul   : 'Pertanyaan yang Sering Diajukan',
            butir: [
              { t: "Siapa saja yang boleh bergabung dengan Kajian Al-I'jaz?", j: 'Terbuka bagi mahasiswa Indonesia di Kairo yang memiliki minat mendalam pada studi tafsir dan \'ulum al-Quran, khususnya anggota IKPM Kairo.' },
              { t: 'Apakah anggota baru langsung mengikuti kajian reguler?', j: 'Tidak. Setiap anggota baru wajib menyelesaikan tahap Pembekalan Intensif (Tatsqif) terlebih dahulu sebagai fondasi keilmuan sebelum masuk ke kajian reguler.' },
              { t: 'Kitab apa yang dikaji pada tahap Tatsqif?', j: "Kitab al-Laali al-Hisan fi 'Ulum al-Quran karya Prof. Dr. Musa Syahin Lasyin, yang dibagi ke dalam beberapa tema dan dipresentasikan peserta secara bergantian." },
              { t: 'Bagaimana jenjang kajian regulernya?', j: "Terdapat tiga level: Level 1 (Ilmu-ilmu al-Quran), Level 2 (Ilmu Tafsir dan Tokoh Tafsir beserta karyanya), dan Level 3 (Grand Tema dan Pembuatan Buku)." },
              { t: 'Apakah saya bisa mengirim artikel untuk dimuat di website?', j: 'Bisa. Anggota dapat mengirim draft melalui ERP, lalu ditinjau oleh PJ Artikel sebelum diterbitkan.' },
            ],
          },
        },
      ],
    },
  },

  /* ==========================================================
     4. AKUN ERP — password sengaja polos, ini prototipe.
     ========================================================== */
  users: [
    { id:'u1', nama:'Ust. Jauhar Ridloni Marzuq', email:'ketua@alijaz.id',      role:'ketua',      status:'aktif', angkatan:'Pendiri',      level:'-',       pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'pendiri', foto:avatar('Jauhar Ridloni','#1B5E20') },
    { id:'u2', nama:'Ust. Novan Hariansyah',      email:'sekretaris@alijaz.id', role:'sekretaris', status:'aktif', angkatan:'Pendiri',      level:'-',       pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'pendiri', foto:avatar('Novan Hariansyah','#2E6B33') },
    { id:'u3', nama:'Ust. Dede Permana',          email:'bendahara@alijaz.id',  role:'bendahara',  status:'aktif', angkatan:'Pendiri',      level:'-',       pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'pendiri', foto:avatar('Dede Permana','#3D7A42') },
    { id:'u4', nama:'Ust. Saeful Luthfy',         email:'saeful@alijaz.id',     role:'anggota',    status:'aktif', angkatan:'Pendiri',      level:'-',       pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'pendiri', foto:avatar('Saeful Luthfy','#4A8751') },
    { id:'u5', nama:'Abdul Haris',                email:'web@alijaz.id',        role:'pj_mediaweb',status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Abdul Haris','#7C5CD6') },
    { id:'u6', nama:'M. Hariz Farezi',            email:'media@alijaz.id',      role:'pj_mediaweb',status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Hariz Farezi','#D9536F') },
    { id:'u7', nama:'Nur Silvia Salsabila',       email:'kti@alijaz.id',        role:'pj_kti',     status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Nur Silvia','#2FA98C') },
    { id:'u8', nama:'Ust. Ahmad Zaky',            email:'buku@alijaz.id',       role:'pj_buku',    status:'aktif', angkatan:'Angkatan X',  level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Ahmad Zaky','#C77A2B') },
    { id:'u9', nama:'Fadhlur Rahman',             email:'fadhlur@alijaz.id',    role:'anggota',    status:'aktif', angkatan:'Angkatan XII',level:'Level 1', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Fadhlur Rahman','#5B7C5F') },
    { id:'u10',nama:'Rizky Maulana',              email:'rizky@alijaz.id',      role:'anggota',    status:'aktif', angkatan:'Angkatan XII',level:'Tatsqif', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Rizky Maulana','#6B8E6F') },
    { id:'u11',nama:'Ilham Nurhakim',             email:'ilham@alijaz.id',      role:'anggota',    status:'alumni',angkatan:'Angkatan VIII',level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni',  foto:avatar('Ilham Nurhakim','#8A7A5C') },
    { id:'u12', nama:'Salma Nabila', email:'salma@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan XII', level:'Tatsqif', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Salma Nabila','#5B7C5F') },
    { id:'u13', nama:'Aisyah Kamila', email:'aisyah@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan XII', level:'Tatsqif', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Aisyah Kamila','#6B8E6F') },
    { id:'u14', nama:'Hanif Musthafa', email:'hanif@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Hanif Musthafa','#4A8751') },
    { id:'u15', nama:'Zaki Mubarak', email:'zaki@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Zaki Mubarak','#3D7A42') },
    { id:'u16', nama:'Yusuf Abdurrahman', email:'yusuf@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Yusuf Abdurrahman','#8A7A5C') },
    { id:'u17', nama:'Imam Baihaqi', email:'imam@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Imam Baihaqi','#7A8B7F') },
    { id:'u18', nama:'Nuzul Fikri Ramadhan', email:'nuzul@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Nuzul Fikri Ramadhan','#5B7C5F') },
    { id:'u19', nama:'Faiz Abdillah', email:'faiz@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Faiz Abdillah','#6B8E6F') },
    { id:'u20', nama:'Lutfi Hakim', email:'lutfi@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan XII', level:'Level 1', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Lutfi Hakim','#4A8751') },
    { id:'u21', nama:'Raihan Maulida', email:'raihan@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan XII', level:'Level 1', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Raihan Maulida','#3D7A42') },
    { id:'u22', nama:'Syifa Aulia', email:'syifa@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Syifa Aulia','#8A7A5C') },
    { id:'u23', nama:'Naufal Ihsan', email:'naufal@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Naufal Ihsan','#7A8B7F') },
    { id:'u24', nama:'Adib Fauzan', email:'adib@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan IX', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Adib Fauzan','#5B7C5F') },
    { id:'u25', nama:'Hamzah Ridwan', email:'hamzah@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan IX', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Hamzah Ridwan','#6B8E6F') },
    { id:'u26', nama:'Ulya Rahmah', email:'ulya@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan IX', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Ulya Rahmah','#4A8751') },
    { id:'u27', nama:'Bilal Arkan', email:'bilal@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan VIII', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Bilal Arkan','#3D7A42') },
    { id:'u28', nama:'Zahra Husna', email:'zahra@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan VIII', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Zahra Husna','#8A7A5C') },
    { id:'u29', nama:'Rifqi Anwar', email:'rifqi@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan VII', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Rifqi Anwar','#7A8B7F') },
    { id:'u30', nama:'Sulthan Habib', email:'sulthan@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan VII', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Sulthan Habib','#5B7C5F') },
    { id:'u31', nama:'Nabil Fathan', email:'nabil@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan VI', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Nabil Fathan','#6B8E6F') },
    { id:'u32', nama:'Aqila Zahira', email:'aqila@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan VI', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Aqila Zahira','#4A8751') },
    { id:'u33', nama:'Umar Faruq', email:'umar@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan V', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Umar Faruq','#3D7A42') },
    { id:'u34', nama:'Ikhsan Nabawi', email:'ikhsan@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan IV', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Ikhsan Nabawi','#8A7A5C') },
    { id:'u35', nama:'Zulfa Amalia', email:'zulfa@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan III', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Zulfa Amalia','#7A8B7F') },
    { id:'u36', nama:'Hasan Basri', email:'hasanb@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan II', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Hasan Basri','#5B7C5F') },
    { id:'u37', nama:'Anas Mubarok', email:'anas@alijaz.id', role:'anggota', status:'alumni', angkatan:'Angkatan I', level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni', foto:avatar('Anas Mubarok','#6B8E6F') },
    { id:'u38', nama:'Ust. Anwar Sadad', email:'kajian@alijaz.id', role:'pj_kajian', status:'aktif', angkatan:'Angkatan IX', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Anwar Sadad','#C77A2B') },
    { id:'u39', nama:'Rezi Fahrezi', email:'rezi@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Rezi Fahrezi','#5B7C5F') },
    { id:'u40', nama:'Irfan Maulana', email:'irfan@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Irfan Maulana','#6B8E6F') },
    { id:'u41', nama:'Lalu Hakim', email:'lalu@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Lalu Hakim','#4A8751') },
    { id:'u42', nama:'Adya Rahmani', email:'adya@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Adya Rahmani','#3D7A42') },
    { id:'u43', nama:'Mona Khairunnisa', email:'mona@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan XII', level:'Level 1', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Mona Khairunnisa','#8A7A5C') },
    { id:'u44', nama:'Ridho Alfarizi', email:'ridho@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Ridho Alfarizi','#4A8751') },
    { id:'u45', nama:'Syahrul Munir', email:'syahrul@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Syahrul Munir','#3D7A42') },
    { id:'u46', nama:'Anisa Fitria', email:'anisa@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Anisa Fitria','#8A7A5C') },
    { id:'u47', nama:'Bagas Prakoso', email:'bagas@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Bagas Prakoso','#7A8B7F') },
    { id:'u48', nama:'Dina Maulida', email:'dina@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Dina Maulida','#5B7C5F') },
    { id:'u49', nama:'Fauzan Adhim', email:'fauzan@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Fauzan Adhim','#6B8E6F') },
    { id:'u50', nama:'Ghina Salsabila', email:'ghina@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Ghina Salsabila','#4A8751') },
    { id:'u51', nama:'Hafizh Rahman', email:'hafizh@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Hafizh Rahman','#3D7A42') },
    { id:'u52', nama:'Iqbal Ramadhan', email:'iqbal@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Iqbal Ramadhan','#8A7A5C') },
    { id:'u53', nama:'Julia Rahmawati', email:'julia@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Julia Rahmawati','#7A8B7F') },
    { id:'u54', nama:'Kamal Abdullah', email:'kamal@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Kamal Abdullah','#5B7C5F') },
    { id:'u55', nama:'Laila Nurhaliza', email:'laila@alijaz.id', role:'anggota', status:'aktif', angkatan:'Angkatan X', level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Laila Nurhaliza','#6B8E6F') },
  ],

  /* ==========================================================
     5. ARTIKEL — alur: draft → review → terbit
     ========================================================== */
  artikel: [
    {
      id:'a1', judul:'Tafsir al-Manar: Relevansinya dalam Menanggulangi Penyimpangan Ajaran Islam di Indonesia',
      slug:'tafsir-al-manar-relevansi', kategori:'Seputar Tafsir', penulisId:'u5', status:'terbit',
      tanggal:'2025-05-27', cover: ph('TAFSIR AL-MANAR','#1E4D2B','#0E2E1C','المنار'),
      ringkas:'Tafsir al-Manar karya Muhammad Abduh dan Rasyid Ridha merupakan salah satu karya tafsir modern yang memiliki relevansi besar dalam konteks umat Islam di Indonesia melalui pendekatan rasional dan kontekstual.',
      isi:[
        'Tafsir al-Manar merupakan salah satu karya tafsir modern yang lahir dari tangan Syaikh Muhammad Abduh dan dilanjutkan oleh muridnya, Sayyid Muhammad Rasyid Ridha. Karya ini menempati posisi penting dalam khazanah tafsir kontemporer karena pendekatannya yang rasional, sosial, dan kontekstual.',
        "Berbeda dengan tafsir klasik yang cenderung menitikberatkan pada aspek kebahasaan dan riwayat, al-Manar hadir dengan semangat ishlah (reformasi). Abduh memandang bahwa al-Quran diturunkan sebagai hidayah bagi kehidupan nyata, bukan semata objek kajian teoretis.",
        "Dalam konteks Indonesia, relevansi Tafsir al-Manar terlihat jelas pada upayanya memurnikan pemahaman keagamaan dari praktik-praktik yang tidak berlandaskan dalil. Metode ini memberi bekal bagi umat untuk menimbang setiap ajaran dengan kaidah ilmiah yang benar.",
        "Meski demikian, pembacaan atas al-Manar tetap memerlukan sikap kritis. Sebagian ulama mencatat kecenderungan Abduh yang terlalu mengedepankan rasio dalam menakwil ayat-ayat tertentu. Di sinilah pentingnya penguasaan 'ulum al-Quran sebagai perangkat pengendali.",
      ],
      tag:['Tafsir Modern','Muhammad Abduh','Rasyid Ridha'], dilihat:1240, reviewNote:'', reviewerId:'u7',
    },
    {
      id:'a2', judul:"Tafsir al-Qurthubi: Kajian atas Dimensi Balaghah dalam al-Quran",
      slug:'tafsir-al-qurthubi-balaghah', kategori:'Tokoh Tafsir', penulisId:'u6', status:'terbit',
      tanggal:'2025-05-24', cover: ph('TAFSIR AL-QURTHUBI','#123C22','#265E33','القرطبي'),
      ringkas:"Tafsir al-Qurthubi dikenal luas sebagai salah satu tafsir yang tidak hanya menekankan aspek hukum, tetapi juga keindahan bahasa (balaghah) al-Quran melalui penjelasan mendalam terhadap struktur bahasa.",
      isi:[
        "Al-Jami' li Ahkam al-Quran, atau yang lebih masyhur dengan sebutan Tafsir al-Qurthubi, adalah magnum opus Imam Abu Abdillah Muhammad bin Ahmad al-Qurthubi. Meski namanya menonjolkan aspek ahkam, isinya jauh lebih luas dari sekadar pembahasan fiqih.",
        'Salah satu keistimewaan yang kerap luput dari perhatian adalah kepiawaian al-Qurthubi dalam membedah dimensi balaghah. Ia kerap berhenti pada satu kata untuk menjelaskan mengapa al-Quran memilih diksi tersebut dan bukan sinonimnya.',
        'Pendekatan ini menunjukkan bahwa penguasaan ilmu balaghah adalah syarat mutlak bagi seorang mufassir. Tanpanya, seseorang akan kehilangan lapisan makna yang justru menjadi bukti kemukjizatan al-Quran (i\'jaz al-Quran).',
      ],
      tag:['Balaghah','Al-Qurthubi','Ahkam'], dilihat:876, reviewNote:'', reviewerId:'u7',
    },
    {
      id:'a3', judul:'Tafsir az-Zamakhsyari: Karya yang Membuat Para Ulama Takjub Sekaligus Waspada',
      slug:'tafsir-zamakhsyari-kasysyaf', kategori:'Tokoh Tafsir', penulisId:'u7', status:'terbit',
      tanggal:'2025-05-20', cover: ph('TAFSIR AZ-ZAMAKHSYARI','#0F3320','#1F5C35','الكشاف'),
      ringkas:'Tafsir al-Kasysyaf karya az-Zamakhsyari adalah salah satu karya tafsir paling berpengaruh dalam sejarah Islam. Gaya bahasanya lugas, analisis linguistiknya tajam, serta kedalaman maknanya membuat banyak ulama mengaguminya.',
      isi:[
        'Al-Kasysyaf an Haqaiq at-Tanzil karya Abu al-Qasim Mahmud bin Umar az-Zamakhsyari menempati posisi unik dalam sejarah tafsir: dikagumi sekaligus dikritisi oleh generasi sesudahnya.',
        'Kekaguman itu bersumber dari kemampuan az-Zamakhsyari menyingkap sisi balaghah al-Quran dengan ketajaman yang jarang tertandingi. Ia menjelaskan rahasia di balik pendahuluan sebuah kata, pemilihan bentuk ma\'rifah atau nakirah, hingga fungsi setiap huruf.',
        "Namun kewaspadaan muncul karena latar belakang teologis penulisnya sebagai penganut Mu'tazilah. Di sejumlah ayat, ia menakwilkan makna agar selaras dengan prinsip-prinsip mazhabnya.",
        'Karena itulah para ulama menganjurkan membaca al-Kasysyaf bersama syarah kritisnya, seperti al-Intishaf karya Ibnu al-Munayyir. Inilah teladan tradisi ilmiah: mengambil ilmu dari siapa pun, dengan timbangan yang jelas.',
      ],
      tag:['Al-Kasysyaf','Balaghah','I\'tizal'], dilihat:1533, reviewNote:'', reviewerId:'u7',
    },
    {
      id:'a4', judul:"Asbabun Nuzul dan Kaidah al-'Ibrah bi 'Umum al-Lafzh",
      slug:'asbabun-nuzul-kaidah-ibrah', kategori:'Ulumul Quran', penulisId:'u9', status:'review',
      tanggal:'2025-06-02', cover: ph("'ULUM AL-QURAN",'#1A4A2E','#0E2E1C','أسباب'),
      ringkas:"Pembahasan kaidah usuliyah masyhur: apakah yang menjadi patokan hukum adalah keumuman lafal atau kekhususan sebab turunnya ayat?",
      isi:[
        "Salah satu kaidah paling fundamental dalam 'ulum al-Quran adalah al-'ibrah bi 'umum al-lafzh la bi khusus as-sabab — yang menjadi patokan adalah keumuman lafal, bukan kekhususan sebab.",
        'Kaidah ini menjadi kunci agar al-Quran tetap relevan lintas zaman. Andaikan hukum hanya berlaku bagi orang dan peristiwa saat ayat turun, maka mayoritas syariat akan berhenti bersama generasi sahabat.',
        'Namun kaidah ini tidak berlaku mutlak. Sebagian ulama merinci bahwa jika terdapat qarinah yang membatasi, maka keumuman lafal dapat ditakhsis.',
      ],
      tag:['Asbabun Nuzul','Ushul Fiqih'], dilihat:0, reviewNote:'', reviewerId:'u7',
    },
    {
      id:'a5', judul:'Munasabah Antar Surat: Merangkai Keutuhan Pesan al-Quran',
      slug:'munasabah-antar-surat', kategori:'Wawasan Keislaman', penulisId:'u10', status:'draft',
      tanggal:'2025-06-08', cover: ph('MUNASABAH','#20402C','#3A6B45','مناسبة'),
      ringkas:'Ilmu munasabah membuktikan bahwa susunan surat dan ayat dalam al-Quran bukanlah kebetulan, melainkan tersusun dengan hikmah yang dalam.',
      isi:[
        'Ilmu munasabah membahas keterkaitan antara satu ayat dengan ayat sesudahnya, serta antara satu surat dengan surat berikutnya.',
        'Imam as-Suyuthi dalam al-Itqan menegaskan bahwa siapa yang memahami munasabah, ia akan melihat al-Quran sebagai satu kesatuan yang utuh dan padu.',
      ],
      tag:['Munasabah','As-Suyuthi'], dilihat:0, reviewNote:'', reviewerId:'',
    },
  ],

  /* ==========================================================
     6. JADWAL KAJIAN — operasional PJ Koordinator Kajian
     ========================================================== */
  /* Tiap kajian kini memuat angkatan, notulen, berkas PPT, dan catatan
     revisi — semuanya dipantau PJ Koordinator Kajian. `presensi` mengganti
     `absensi` yang dulu hanya daftar id: kehadiran punya tiga keadaan
     berbeda (hadir, terlambat, tidak hadir) yang tak bisa diwakili satu
     larik nama, dan jam datang ikut dicatat. */
  /* Diisi setelah literal ini selesai — pembangkitnya membaca daftar
     anggota, yang belum ada saat objek SEED masih tersusun. */
  kajian: [],

  /* ==========================================================
     7. KEUANGAN — modul Bendahara
     ========================================================== */
  /* Diisi setelah literal ini — pembangkitnya bertanggal relatif hari ini. */
  keuangan: [],

  /* ==========================================================
     8. PESAN MASUK dari form kontak publik
     ========================================================== */
  pesan: [
    { id:'p1', nama:'Muhammad Fikri', email:'fikri@example.com', subjek:'Pendaftaran Anggota Baru',
      isi:'Assalamualaikum. Saya mahasiswa tingkat 2 Fakultas Ushuluddin Al-Azhar, ingin bergabung dengan Kajian Al-I\'jaz. Bagaimana prosedurnya?',
      tanggal:'2025-06-09', dibaca:false },
    { id:'p2', nama:'Redaksi Buletin IKPM', email:'buletin@ikpm.example', subjek:'Kerja Sama & Kolaborasi',
      isi:'Kami ingin mengajak Kajian Al-I\'jaz mengisi rubrik tafsir pada buletin bulanan IKPM Kairo.',
      tanggal:'2025-06-07', dibaca:true },
  ],

  /* Arsip persuratan — modul Sekretaris.
     Satu koleksi untuk lima kategori (internal, eksternal, keputusan,
     masuk, keluar) agar penomoran dan arsipnya tetap satu kesatuan.
     Khusus kategori 'keputusan', `jenisSk` menentukan jenis SK-nya. */
  surat: [
    { id:'sr1', nomor:'001/AI/I/2025', kategori:'internal', perihal:'Undangan Rapat Koordinasi Pengurus', tujuan:'Seluruh Pengurus', tanggal:'2025-01-03', status:'terkirim' },
    { id:'sr2', nomor:'002/AI/I/2025', kategori:'internal', perihal:'Pemberitahuan Jadwal Kajian Tatsqif', tujuan:'Seluruh Anggota', tanggal:'2025-01-05', status:'terkirim' },
    { id:'sr3', nomor:'003/AI/II/2025', kategori:'internal', perihal:'Permohonan Kesediaan Menjadi Pemakalah', tujuan:'Koordinator Angkatan X', tanggal:'2025-02-07', status:'terkirim' },
    { id:'sr4', nomor:'004/AI/II/2025', kategori:'internal', perihal:'Instruksi Penyusunan Laporan Divisi', tujuan:'Seluruh Kepala Divisi', tanggal:'2025-02-09', status:'terkirim' },
    { id:'sr5', nomor:'005/AI/III/2025', kategori:'internal', perihal:'Undangan Musyawarah Kerja Tahunan', tujuan:'Seluruh Pengurus', tanggal:'2025-03-11', status:'terkirim' },
    { id:'sr6', nomor:'006/AI/III/2025', kategori:'internal', perihal:'Pemberitahuan Rotasi Koordinator Angkatan', tujuan:'Biro Kajian', tanggal:'2025-03-13', status:'terkirim' },
    { id:'sr7', nomor:'007/AI/IV/2025', kategori:'internal', perihal:'Permohonan Data Anggota Aktif', tujuan:'Biro Kajian', tanggal:'2025-04-15', status:'terkirim' },
    { id:'sr8', nomor:'008/AI/IV/2025', kategori:'internal', perihal:'Edaran Tata Tertib Kajian Reguler', tujuan:'Seluruh Anggota', tanggal:'2025-04-17', status:'terkirim' },
    { id:'sr9', nomor:'009/AI/V/2025', kategori:'internal', perihal:'Undangan Evaluasi Tengah Periode', tujuan:'Seluruh Pengurus', tanggal:'2025-05-19', status:'terkirim' },
    { id:'sr10', nomor:'010/AI/V/2025', kategori:'internal', perihal:'Pemberitahuan Libur Kajian Ramadan', tujuan:'Seluruh Anggota', tanggal:'2025-05-21', status:'diarsipkan' },
    { id:'sr11', nomor:'011/AI/VI/2025', kategori:'internal', perihal:'Permohonan Peminjaman Inventaris Sekretariat', tujuan:'Divisi Perpustakaan', tanggal:'2025-06-23', status:'terkirim' },
    { id:'sr12', nomor:'012/AI/VI/2025', kategori:'internal', perihal:'Instruksi Pengumpulan Makalah Level 2', tujuan:'Koordinator Level 2', tanggal:'2025-06-25', status:'draft' },
    { id:'sr13', nomor:'001/AI-E/I/2025', kategori:'eksternal', perihal:'Permohonan Peminjaman Aula IKPM', tujuan:'Ketua IKPM Kairo', tanggal:'2025-01-04', status:'terkirim' },
    { id:'sr14', nomor:'002/AI-E/II/2025', kategori:'eksternal', perihal:'Undangan Seminar Ulumul Quran', tujuan:'Lembaga Kajian Al-Azhar', tanggal:'2025-02-07', status:'terkirim' },
    { id:'sr15', nomor:'003/AI-E/II/2025', kategori:'eksternal', perihal:'Permohonan Narasumber Kajian Tafsir', tujuan:'Dr. Muhammad Abdul Halim', tanggal:'2025-02-10', status:'terkirim' },
    { id:'sr16', nomor:'004/AI-E/III/2025', kategori:'eksternal', perihal:'Permohonan Kerja Sama Penerbitan Buletin', tujuan:'Redaksi Buletin IKPM', tanggal:'2025-03-13', status:'terkirim' },
    { id:'sr17', nomor:'005/AI-E/IV/2025', kategori:'eksternal', perihal:'Ucapan Terima Kasih Kepada Pemateri', tujuan:'Ust. Abdurrahman Hakim', tanggal:'2025-04-16', status:'terkirim' },
    { id:'sr18', nomor:'006/AI-E/IV/2025', kategori:'eksternal', perihal:'Permohonan Rekomendasi Kegiatan', tujuan:'Atase Pendidikan KBRI Kairo', tanggal:'2025-04-19', status:'terkirim' },
    { id:'sr19', nomor:'007/AI-E/V/2025', kategori:'eksternal', perihal:'Undangan Silaturahmi Antar Lembaga', tujuan:'Forum Studi Islam Kairo', tanggal:'2025-05-22', status:'terkirim' },
    { id:'sr20', nomor:'008/AI-E/VI/2025', kategori:'eksternal', perihal:'Permohonan Izin Kegiatan Rihlah Ilmiah', tujuan:'Perpustakaan Al-Azhar', tanggal:'2025-06-25', status:'draft' },
    { id:'sr21', nomor:'001/SK-AI/I/2025', kategori:'keputusan', jenisSk:'mulai', perihal:'SK Pembukaan Kajian Tatsqif Angkatan XII', tujuan:'Angkatan XII', tanggal:'2025-01-03', status:'berlaku' },
    { id:'sr22', nomor:'002/SK-AI/II/2025', kategori:'keputusan', jenisSk:'mulai', perihal:'SK Pembukaan Kajian Reguler Level 1', tujuan:'Peserta Level 1', tanggal:'2025-02-05', status:'berlaku' },
    { id:'sr23', nomor:'003/SK-AI/V/2025', kategori:'keputusan', jenisSk:'mulai', perihal:'SK Pembukaan Grand Tema Level 3', tujuan:'Peserta Level 3', tanggal:'2025-05-07', status:'berlaku' },
    { id:'sr24', nomor:'004/SK-AI/III/2025', kategori:'keputusan', jenisSk:'tawaquf', perihal:'SK Tawaquf Kajian Selama Ramadan', tujuan:'Seluruh Anggota', tanggal:'2025-03-09', status:'berlaku' },
    { id:'sr25', nomor:'005/SK-AI/V/2025', kategori:'keputusan', jenisSk:'tawaquf', perihal:'SK Tawaquf Kajian Masa Ujian Termin II', tujuan:'Seluruh Anggota', tanggal:'2025-05-11', status:'berlaku' },
    { id:'sr26', nomor:'006/SK-AI/I/2025', kategori:'keputusan', jenisSk:'anggota-aktif', perihal:'SK Penetapan Anggota Aktif Periode 2025', tujuan:'Seluruh Anggota', tanggal:'2025-01-13', status:'berlaku' },
    { id:'sr27', nomor:'007/SK-AI/II/2025', kategori:'keputusan', jenisSk:'anggota-aktif', perihal:'SK Penetapan Anggota Aktif Angkatan XI', tujuan:'Angkatan XI', tanggal:'2025-02-15', status:'berlaku' },
    { id:'sr28', nomor:'008/SK-AI/IV/2025', kategori:'keputusan', jenisSk:'anggota-aktif', perihal:'SK Penetapan Anggota Aktif Angkatan XII', tujuan:'Angkatan XII', tanggal:'2025-04-17', status:'berlaku' },
    { id:'sr29', nomor:'009/SK-AI/III/2025', kategori:'keputusan', jenisSk:'anggota-keluar', perihal:'SK Pengunduran Diri Anggota Angkatan X', tujuan:'Angkatan X', tanggal:'2025-03-19', status:'berlaku' },
    { id:'sr30', nomor:'010/SK-AI/VI/2025', kategori:'keputusan', jenisSk:'anggota-keluar', perihal:'SK Pemberhentian Keanggotaan Tidak Aktif', tujuan:'Biro Kajian', tanggal:'2025-06-21', status:'berlaku' },
    { id:'sr31', nomor:'011/SK-AI/II/2025', kategori:'keputusan', jenisSk:'alumni', perihal:'SK Penetapan Alumni Angkatan VIII', tujuan:'Angkatan VIII', tanggal:'2025-02-23', status:'berlaku' },
    { id:'sr32', nomor:'012/SK-AI/VI/2025', kategori:'keputusan', jenisSk:'alumni', perihal:'SK Penetapan Alumni Angkatan IX', tujuan:'Angkatan IX', tanggal:'2025-06-25', status:'berlaku' },
    { id:'sr33', nomor:'001/MSK/I/2025', kategori:'masuk', perihal:'Undangan Rapat Koordinasi Kajian', tujuan:'IKPM Kairo', tanggal:'2025-01-03', status:'ditindaklanjuti' },
    { id:'sr34', nomor:'002/MSK/I/2025', kategori:'masuk', perihal:'Undangan Seminar Nasional Tafsir', tujuan:'PPI Mesir', tanggal:'2025-01-05', status:'ditindaklanjuti' },
    { id:'sr35', nomor:'003/MSK/II/2025', kategori:'masuk', perihal:'Permohonan Pengisi Kajian Bulanan', tujuan:'Wisma Nusantara Kairo', tanggal:'2025-02-07', status:'diterima' },
    { id:'sr36', nomor:'004/MSK/II/2025', kategori:'masuk', perihal:'Pemberitahuan Jadwal Ujian Termin', tujuan:'Universitas Al-Azhar', tanggal:'2025-02-09', status:'ditindaklanjuti' },
    { id:'sr37', nomor:'005/MSK/III/2025', kategori:'masuk', perihal:'Undangan Halaqah Ilmiah Bersama', tujuan:'Forum Studi Islam Kairo', tanggal:'2025-03-11', status:'ditindaklanjuti' },
    { id:'sr38', nomor:'006/MSK/III/2025', kategori:'masuk', perihal:'Permohonan Kerja Sama Rubrik Tafsir', tujuan:'Redaksi Buletin IKPM', tanggal:'2025-03-13', status:'diterima' },
    { id:'sr39', nomor:'007/MSK/III/2025', kategori:'masuk', perihal:'Pemberitahuan Bantuan Buku Kajian', tujuan:'Perpustakaan Al-Azhar', tanggal:'2025-03-15', status:'ditindaklanjuti' },
    { id:'sr40', nomor:'008/MSK/IV/2025', kategori:'masuk', perihal:'Undangan Musyawarah Besar IKPM', tujuan:'IKPM Kairo', tanggal:'2025-04-17', status:'ditindaklanjuti' },
    { id:'sr41', nomor:'009/MSK/IV/2025', kategori:'masuk', perihal:'Permohonan Data Anggota untuk Pendataan', tujuan:'Atase Pendidikan KBRI', tanggal:'2025-04-19', status:'diterima' },
    { id:'sr42', nomor:'010/MSK/IV/2025', kategori:'masuk', perihal:'Undangan Peringatan Nuzulul Quran', tujuan:'Masjid Indonesia Kairo', tanggal:'2025-04-21', status:'ditindaklanjuti' },
    { id:'sr43', nomor:'011/MSK/V/2025', kategori:'masuk', perihal:'Pemberitahuan Perubahan Jadwal Aula', tujuan:'Sekretariat IKPM', tanggal:'2025-05-23', status:'ditindaklanjuti' },
    { id:'sr44', nomor:'012/MSK/V/2025', kategori:'masuk', perihal:'Permohonan Delegasi Lomba Karya Tulis', tujuan:'PPI Dunia', tanggal:'2025-05-25', status:'diterima' },
    { id:'sr45', nomor:'013/MSK/V/2025', kategori:'masuk', perihal:'Undangan Buka Puasa Bersama', tujuan:'Keluarga Mahasiswa Jawa Barat', tanggal:'2025-05-27', status:'ditindaklanjuti' },
    { id:'sr46', nomor:'014/MSK/VI/2025', kategori:'masuk', perihal:'Pemberitahuan Hasil Verifikasi Lembaga', tujuan:'KBRI Kairo', tanggal:'2025-06-02', status:'ditindaklanjuti' },
    { id:'sr47', nomor:'015/MSK/VI/2025', kategori:'masuk', perihal:'Permohonan Kesediaan Menjadi Juri', tujuan:'Forum Studi Islam Kairo', tanggal:'2025-06-04', status:'diterima' },
    { id:'sr48', nomor:'001/KLR/I/2025', kategori:'keluar', perihal:'Balasan Undangan Rapat Koordinasi', tujuan:'IKPM Kairo', tanggal:'2025-01-04', status:'terkirim' },
    { id:'sr49', nomor:'002/KLR/I/2025', kategori:'keluar', perihal:'Permohonan Peminjaman Proyektor', tujuan:'Sekretariat IKPM', tanggal:'2025-01-05', status:'terkirim' },
    { id:'sr50', nomor:'003/KLR/I/2025', kategori:'keluar', perihal:'Pengajuan Proposal Seminar Ulumul Quran', tujuan:'Atase Pendidikan KBRI', tanggal:'2025-01-06', status:'terkirim' },
    { id:'sr51', nomor:'004/KLR/II/2025', kategori:'keluar', perihal:'Permohonan Dana Kegiatan Tatsqif', tujuan:'Bendahara IKPM', tanggal:'2025-02-07', status:'terkirim' },
    { id:'sr52', nomor:'005/KLR/II/2025', kategori:'keluar', perihal:'Undangan Pemateri Kajian Reguler', tujuan:'Dr. Ahmad Syauqi', tanggal:'2025-02-08', status:'diarsipkan' },
    { id:'sr53', nomor:'006/KLR/II/2025', kategori:'keluar', perihal:'Laporan Kegiatan Triwulan I', tujuan:'Ketua IKPM Kairo', tanggal:'2025-02-09', status:'terkirim' },
    { id:'sr54', nomor:'007/KLR/III/2025', kategori:'keluar', perihal:'Permohonan Publikasi Kegiatan', tujuan:'Divisi Media IKPM', tanggal:'2025-03-10', status:'terkirim' },
    { id:'sr55', nomor:'008/KLR/III/2025', kategori:'keluar', perihal:'Balasan Permohonan Rubrik Tafsir', tujuan:'Redaksi Buletin IKPM', tanggal:'2025-03-11', status:'terkirim' },
    { id:'sr56', nomor:'009/KLR/III/2025', kategori:'keluar', perihal:'Permohonan Izin Penggunaan Aula', tujuan:'Sekretariat IKPM', tanggal:'2025-03-12', status:'terkirim' },
    { id:'sr57', nomor:'010/KLR/III/2025', kategori:'keluar', perihal:'Ucapan Terima Kasih Bantuan Buku', tujuan:'Perpustakaan Al-Azhar', tanggal:'2025-03-13', status:'diarsipkan' },
    { id:'sr58', nomor:'011/KLR/IV/2025', kategori:'keluar', perihal:'Pengajuan Nama Delegasi Lomba', tujuan:'PPI Dunia', tanggal:'2025-04-14', status:'terkirim' },
    { id:'sr59', nomor:'012/KLR/IV/2025', kategori:'keluar', perihal:'Undangan Halal Bihalal Anggota', tujuan:'Seluruh Alumni', tanggal:'2025-04-15', status:'terkirim' },
    { id:'sr60', nomor:'013/KLR/IV/2025', kategori:'keluar', perihal:'Laporan Pertanggungjawaban Seminar', tujuan:'Ketua IKPM Kairo', tanggal:'2025-04-16', status:'terkirim' },
    { id:'sr61', nomor:'014/KLR/V/2025', kategori:'keluar', perihal:'Permohonan Cetak Sertifikat Kegiatan', tujuan:'Percetakan Nasr City', tanggal:'2025-05-17', status:'terkirim' },
    { id:'sr62', nomor:'015/KLR/V/2025', kategori:'keluar', perihal:'Balasan Undangan Musyawarah Besar', tujuan:'IKPM Kairo', tanggal:'2025-05-18', status:'diarsipkan' },
    { id:'sr63', nomor:'016/KLR/V/2025', kategori:'keluar', perihal:'Permohonan Rekomendasi Studi Banding', tujuan:'KBRI Kairo', tanggal:'2025-05-19', status:'terkirim' },
    { id:'sr64', nomor:'017/KLR/V/2025', kategori:'keluar', perihal:'Undangan Rapat Evaluasi Koordinator', tujuan:'Seluruh Koordinator', tanggal:'2025-05-20', status:'terkirim' },
    { id:'sr65', nomor:'018/KLR/VI/2025', kategori:'keluar', perihal:'Laporan Kegiatan Triwulan II', tujuan:'Ketua IKPM Kairo', tanggal:'2025-06-21', status:'terkirim' },
    { id:'sr66', nomor:'019/KLR/VI/2025', kategori:'keluar', perihal:'Permohonan Perpanjangan Sekretariat', tujuan:'Sekretariat IKPM', tanggal:'2025-06-22', status:'terkirim' },
    { id:'sr67', nomor:'020/KLR/VI/2025', kategori:'keluar', perihal:'Undangan Penutupan Kajian Periode', tujuan:'Seluruh Anggota', tanggal:'2025-06-23', status:'diarsipkan' },
  ],
  /* Sertifikat — anggota, pemateri, dan kegiatan. */
  sertifikat: [
    { id:'st1', nomor:'001/SRT-A/AI/II/2025', judul:'Sertifikat Keanggotaan Fadhlur Rahman', jenis:'anggota', penerima:'Fadhlur Rahman', tanggal:'2025-02-03' },
    { id:'st2', nomor:'002/SRT-A/AI/III/2025', judul:'Sertifikat Keanggotaan Rizky Maulana', jenis:'anggota', penerima:'Rizky Maulana', tanggal:'2025-03-05' },
    { id:'st3', nomor:'003/SRT-A/AI/IV/2025', judul:'Sertifikat Keanggotaan Nur Silvia Salsabila', jenis:'anggota', penerima:'Nur Silvia Salsabila', tanggal:'2025-04-07' },
    { id:'st4', nomor:'004/SRT-A/AI/V/2025', judul:'Sertifikat Keanggotaan Ahmad Zaky', jenis:'anggota', penerima:'Ahmad Zaky', tanggal:'2025-05-09' },
    { id:'st5', nomor:'005/SRT-A/AI/VI/2025', judul:'Sertifikat Keanggotaan Abdul Haris', jenis:'anggota', penerima:'Abdul Haris', tanggal:'2025-06-11' },
    { id:'st6', nomor:'006/SRT-A/AI/I/2025', judul:'Sertifikat Keanggotaan M. Hariz Farezi', jenis:'anggota', penerima:'M. Hariz Farezi', tanggal:'2025-01-13' },
    { id:'st7', nomor:'007/SRT-A/AI/II/2025', judul:'Sertifikat Keanggotaan Ilham Nurhakim', jenis:'anggota', penerima:'Ilham Nurhakim', tanggal:'2025-02-15' },
    { id:'st8', nomor:'008/SRT-A/AI/III/2025', judul:'Sertifikat Keanggotaan Zaki Mubarak', jenis:'anggota', penerima:'Zaki Mubarak', tanggal:'2025-03-17' },
    { id:'st9', nomor:'009/SRT-A/AI/IV/2025', judul:'Sertifikat Keanggotaan Hanif Musthafa', jenis:'anggota', penerima:'Hanif Musthafa', tanggal:'2025-04-19' },
    { id:'st10', nomor:'010/SRT-A/AI/V/2025', judul:'Sertifikat Keanggotaan Yusuf Abdurrahman', jenis:'anggota', penerima:'Yusuf Abdurrahman', tanggal:'2025-05-21' },
    { id:'st11', nomor:'011/SRT-A/AI/VI/2025', judul:'Sertifikat Keanggotaan Imam Baihaqi', jenis:'anggota', penerima:'Imam Baihaqi', tanggal:'2025-06-23' },
    { id:'st12', nomor:'012/SRT-A/AI/I/2025', judul:'Sertifikat Keanggotaan Nuzul Fikri Ramadhan', jenis:'anggota', penerima:'Nuzul Fikri Ramadhan', tanggal:'2025-01-25' },
    { id:'st13', nomor:'013/SRT-A/AI/II/2025', judul:'Sertifikat Keanggotaan Salma Nabila', jenis:'anggota', penerima:'Salma Nabila', tanggal:'2025-02-27' },
    { id:'st14', nomor:'014/SRT-A/AI/III/2025', judul:'Sertifikat Keanggotaan Aisyah Kamila', jenis:'anggota', penerima:'Aisyah Kamila', tanggal:'2025-03-02' },
    { id:'st15', nomor:'001/SRT-P/AI/II/2025', judul:"Sertifikat Pemateri — Metodologi Tafsir bil-Ma'tsur", jenis:'pemateri', penerima:'Dr. Ahmad Syauqi', tanggal:'2025-02-04' },
    { id:'st16', nomor:'002/SRT-P/AI/III/2025', judul:"Sertifikat Pemateri — Pengantar 'Ulum al-Quran", jenis:'pemateri', penerima:'Ust. Jauhar Ridloni Marzuq', tanggal:'2025-03-07' },
    { id:'st17', nomor:'003/SRT-P/AI/IV/2025', judul:'Sertifikat Pemateri — Asbabun Nuzul & Kaidahnya', jenis:'pemateri', penerima:'Ust. Novan Hariansyah', tanggal:'2025-04-10' },
    { id:'st18', nomor:'004/SRT-P/AI/V/2025', judul:"Sertifikat Pemateri — I'jaz al-Quran", jenis:'pemateri', penerima:'Dr. Muhammad Abdul Halim', tanggal:'2025-05-13' },
    { id:'st19', nomor:'005/SRT-P/AI/VI/2025', judul:'Sertifikat Pemateri — Munasabah Antar Surat', jenis:'pemateri', penerima:'Ust. Dede Permana', tanggal:'2025-06-16' },
    { id:'st20', nomor:'006/SRT-P/AI/I/2025', judul:"Sertifikat Pemateri — Qiraat Sab'ah", jenis:'pemateri', penerima:'Ust. Saeful Luthfy', tanggal:'2025-01-19' },
    { id:'st21', nomor:'007/SRT-P/AI/II/2025', judul:'Sertifikat Pemateri — Balaghah dalam al-Quran', jenis:'pemateri', penerima:'Ahmad Zaky', tanggal:'2025-02-22' },
    { id:'st22', nomor:'008/SRT-P/AI/III/2025', judul:'Sertifikat Pemateri — Tafsir Tematik Kontemporer', jenis:'pemateri', penerima:'Nur Silvia Salsabila', tanggal:'2025-03-25' },
    { id:'st23', nomor:'009/SRT-P/AI/IV/2025', judul:'Sertifikat Pemateri — Tafsir al-Manar', jenis:'pemateri', penerima:'Abdul Haris', tanggal:'2025-04-01' },
    { id:'st24', nomor:'010/SRT-P/AI/V/2025', judul:'Sertifikat Pemateri — Nasikh & Mansukh', jenis:'pemateri', penerima:'Fadhlur Rahman', tanggal:'2025-05-04' },
    { id:'st25', nomor:'001/SRT-K/AI/II/2025', judul:'Sertifikat Kegiatan — Seminar Ulumul Quran 2025', jenis:'kegiatan', penerima:'Seluruh Peserta', tanggal:'2025-02-03' },
    { id:'st26', nomor:'002/SRT-K/AI/III/2025', judul:'Sertifikat Kegiatan — Kajian Tatsqif Angkatan XII', jenis:'kegiatan', penerima:'Seluruh Peserta', tanggal:'2025-03-05' },
    { id:'st27', nomor:'003/SRT-K/AI/IV/2025', judul:'Sertifikat Kegiatan — Upgrading Koordinator Kajian', jenis:'kegiatan', penerima:'Seluruh Peserta', tanggal:'2025-04-07' },
    { id:'st28', nomor:'004/SRT-K/AI/V/2025', judul:'Sertifikat Kegiatan — Musyawarah Kerja Tahunan', jenis:'kegiatan', penerima:'Seluruh Peserta', tanggal:'2025-05-09' },
    { id:'st29', nomor:'005/SRT-K/AI/VI/2025', judul:'Sertifikat Kegiatan — Rihlah Ilmiah Perpustakaan Azhar', jenis:'kegiatan', penerima:'Seluruh Peserta', tanggal:'2025-06-11' },
    { id:'st30', nomor:'006/SRT-K/AI/I/2025', judul:'Sertifikat Kegiatan — Lomba Karya Tulis Ilmiah', jenis:'kegiatan', penerima:'Seluruh Peserta', tanggal:'2025-01-13' },
    { id:'st31', nomor:'007/SRT-K/AI/II/2025', judul:'Sertifikat Kegiatan — Halaqah Ilmiah Bersama', jenis:'kegiatan', penerima:'Seluruh Peserta', tanggal:'2025-02-15' },
    { id:'st32', nomor:'008/SRT-K/AI/III/2025', judul:'Sertifikat Kegiatan — Pelatihan Penulisan Makalah', jenis:'kegiatan', penerima:'Seluruh Peserta', tanggal:'2025-03-17' },
    { id:'st33', nomor:'009/SRT-K/AI/IV/2025', judul:'Sertifikat Kegiatan — Peringatan Nuzulul Quran', jenis:'kegiatan', penerima:'Seluruh Peserta', tanggal:'2025-04-19' },
    { id:'st34', nomor:'010/SRT-K/AI/V/2025', judul:'Sertifikat Kegiatan — Penutupan Kajian Periode 2025', jenis:'kegiatan', penerima:'Seluruh Peserta', tanggal:'2025-05-21' },
  ],
  /* Kumpulan tanda tangan tiap divisi kepengurusan — dipakai
     untuk membubuhi surat dan sertifikat. */
  tandaTangan: [
    { id:'tt1', divisi:'Ketua Umum', jabatan:'Ketua Umum', nama:'Ust. Jauhar Ridloni Marzuq', gambar: ttdBawaan('Ust. Jauhar Ridloni Marzuq') },
    { id:'tt2', divisi:'Sekretaris Umum', jabatan:'Sekretaris Umum', nama:'Ust. Novan Hariansyah', gambar: ttdBawaan('Ust. Novan Hariansyah') },
    { id:'tt3', divisi:'Bendahara Umum', jabatan:'Bendahara Umum', nama:'Ust. Dede Permana', gambar: ttdBawaan('Ust. Dede Permana') },
    { id:'tt4', divisi:'Biro Kajian', jabatan:'Ketua Biro Kajian', nama:'Ust. Saeful Luthfy', gambar: ttdBawaan('Ust. Saeful Luthfy') },
    { id:'tt5', divisi:'Divisi Website', jabatan:'Kepala Divisi', nama:'Abdul Haris', gambar: ttdBawaan('Abdul Haris') },
    { id:'tt6', divisi:'Divisi Media', jabatan:'Kepala Divisi', nama:'M. Hariz Farezi', gambar: ttdBawaan('M. Hariz Farezi') },
    { id:'tt7', divisi:'Divisi Karya Tulis Ilmiah', jabatan:'Kepala Divisi', nama:'Nur Silvia Salsabila', gambar: ttdBawaan('Nur Silvia Salsabila') },
    { id:'tt8', divisi:'Biro Humas', jabatan:'Kepala Biro', nama:'Fadhlur Rahman', gambar: ttdBawaan('Fadhlur Rahman') },
    { id:'tt9', divisi:'Divisi Perpustakaan', jabatan:'Kepala Divisi', nama:'Nuzul Fikri Ramadhan', gambar: ttdBawaan('Nuzul Fikri Ramadhan') },
  ],

  /* ==========================================================
     9. KEPENGURUSAN — ruang kerja Ketua Umum

     Lima daftar di bawah ini adalah isi Dashboard Ketua Umum.
     Sengaja dipisah dari `users`: `users` adalah AKUN (siapa yang
     boleh masuk ERP), sedangkan `pengurus` adalah STRUKTUR
     (siapa memegang jabatan apa). Seorang pengurus belum tentu
     punya akun, dan seorang pemilik akun belum tentu pengurus.
     ========================================================== */
  pengurus: [
    { id:'pg1',  nama:'Ust. Novan Hariansyah',    jabatan:'Sekretaris Umum',                wa:'+20 984058 7712' },
    { id:'pg2',  nama:'Ust. Dede Permana',        jabatan:'Bendahara Umum',                 wa:'+20 101234 5590' },
    { id:'pg3',  nama:'Ust. Saeful Luthfy',       jabatan:'Ketua Biro Kajian',              wa:'+20 112233 8841' },
    { id:'pg4',  nama:'Ahmad Zaky',               jabatan:'Sekretaris Biro Kajian',         wa:'+20 100455 2073' },
    { id:'pg5',  nama:'Abdul Haris',              jabatan:'Kepala Divisi Website',          wa:'+20 106677 3318' },
    { id:'pg6',  nama:'M. Hariz Farezi',          jabatan:'Kepala Divisi Media',            wa:'+20 109988 4426' },
    { id:'pg7',  nama:'Nur Silvia Salsabila',     jabatan:'Kepala Divisi Karya Tulis Ilmiah', wa:'+20 115544 9062' },
    { id:'pg8',  nama:'Fadhlur Rahman',           jabatan:'Kepala Biro Humas',              wa:'+20 128877 6134' },
    { id:'pg9',  nama:'Rizky Maulana',            jabatan:'Staf Biro Humas',                wa:'+20 103322 7789' },
    { id:'pg10', nama:'Ilham Nurhakim',           jabatan:'Dewan Penasihat',                wa:'+20 121100 5547' },
    { id:'pg11', nama:'Nuzul Fikri Ramadhan',     jabatan:'Kepala Divisi Perpustakaan',     wa:'+20 114466 2298' },
    { id:'pg12', nama:'Zaki Mubarak',             jabatan:'Staf Divisi Perpustakaan',       wa:'+20 107733 1165' },
    { id:'pg13', nama:'Hanif Musthafa',           jabatan:'Staf Divisi Website',            wa:'+20 126655 8803' },
    { id:'pg14', nama:'Yusuf Abdurrahman',        jabatan:'Staf Divisi Karya Tulis Ilmiah', wa:'+20 102244 6671' },
    { id:'pg15', nama:'Imam Baihaqi',             jabatan:'Staf Divisi Media',              wa:'+20 155566 3390' },
  ],

  koordinator: [
    { id:'kd1',  nama:'Ilham Nurhakim',       angkatan:'Angkatan I',    wa:'+20 984058 4471' },
    { id:'kd2',  nama:'Zaki Mubarak',         angkatan:'Angkatan II',   wa:'+20 123456 7708' },
    { id:'kd3',  nama:'Hanif Musthafa',       angkatan:'Angkatan III',  wa:'+20 654321 9925' },
    { id:'kd4',  nama:'Yusuf Abdurrahman',    angkatan:'Angkatan IV',   wa:'+20 118822 3364' },
    { id:'kd5',  nama:'Imam Baihaqi',         angkatan:'Angkatan V',    wa:'+20 104477 1286' },
    { id:'kd6',  nama:'Nuzul Fikri Ramadhan', angkatan:'Angkatan VI',   wa:'+20 129933 5510' },
    { id:'kd7',  nama:'Fadhlur Rahman',       angkatan:'Angkatan VII',  wa:'+20 113355 7742' },
    { id:'kd8',  nama:'Abdul Haris',          angkatan:'Angkatan VIII', wa:'+20 106611 2298' },
    { id:'kd9',  nama:'M. Hariz Farezi',      angkatan:'Angkatan IX',   wa:'+20 122244 8836' },
    { id:'kd10', nama:'Ahmad Zaky',           angkatan:'Angkatan X',    wa:'+20 998877 6103' },
  ],

  /* status: selesai | proses | rencana. Kolom `selesai` sengaja
     disimpan terpisah agar Ketua bisa mencentang tanpa mengubah
     status yang dipakai laporan. */
  kaleidoskop: [
    { id:'kl1', kegiatan:'Pembuatan Website',                waktu:'Jan 2025', status:'selesai', selesai:true  },
    { id:'kl2', kegiatan:'Kajian Tafsir Surah Al-Kahfi',     waktu:'Feb 2025', status:'selesai', selesai:true  },
    { id:'kl3', kegiatan:'Seminar Ulumul Quran',             waktu:'Mar 2025', status:'selesai', selesai:true  },
    { id:'kl4', kegiatan:'Upgrading Koordinator',            waktu:'Apr 2025', status:'proses',  selesai:false },
    { id:'kl5', kegiatan:'Pengabdian Masyarakat',            waktu:'Mei 2025', status:'rencana', selesai:false },
    { id:'kl6', kegiatan:"Penerbitan Buletin Al-I'jaz",      waktu:'Jun 2025', status:'proses',  selesai:false },
    { id:'kl7', kegiatan:'Rihlah Ilmiah Perpustakaan Azhar', waktu:'Jul 2025', status:'rencana', selesai:false },
  ],

  pencapaian: [
    { id:'pc1', pencapaian:'Terbit Buku Pertama',                        tanggal:'2024-01-12', lampiran: ph('BUKU PERTAMA','#1E4D2B','#0E2E1C','الإعجاز') },
    { id:'pc2', pencapaian:'Terbit Buku Kedua',                          tanggal:'2024-08-18', lampiran: ph('BUKU KEDUA','#26262A','#0F0F12','التفسير') },
    { id:'pc3', pencapaian:'Terbit Buku Ketiga',                         tanggal:'2025-02-20', lampiran: ph('BUKU KETIGA','#123C22','#265E33','علوم القرآن') },
    { id:'pc4', pencapaian:"Al-I'jaz Milestone 5 Tahun",                 tanggal:'2025-04-15', lampiran: ph('MILESTONE 5 TAHUN','#3E7FB8','#1B4B72','٥') },
    { id:'pc5', pencapaian:'Terbentuknya 10 Angkatan Koordinator Kajian',tanggal:'2025-05-10', lampiran: ph('10 ANGKATAN','#C77A2B','#7A4A17','١٠') },
  ],

  evaluasi: [
    { id:'ev1', evaluasi:'Anggota sering telat hadir kajian',      masukan:'Kumpul bareng koordinator kajian, bikin komitmen dan pengingat rutin', tanggal:'2025-05-21' },
    { id:'ev2', evaluasi:'Partisipasi diskusi masih rendah',       masukan:'Buat sesi sharing per kelompok kecil & berikan tema menarik',          tanggal:'2025-05-21' },
    { id:'ev3', evaluasi:'Dokumentasi kegiatan belum maksimal',    masukan:'Buat tim dokumentasi khusus di setiap kegiatan',                       tanggal:'2025-05-22' },
    { id:'ev4', evaluasi:'Kurang maksimalnya publikasi kegiatan',  masukan:'Optimalkan media sosial dan jadwal posting rutin',                     tanggal:'2025-05-22' },
  ],
};

/* ==========================================================
   10. REDAKSI — ruang kerja PJ Artikel

   Penugasan artikel bulanan. PJ menetapkan judul di awal bulan,
   lalu memantau progressnya; ketika anggota benar-benar mengirim
   naskah, penugasan tersambung ke artikelnya lewat `artikelId`
   dan progress naik sendiri. Karena itu tabel progress tidak
   pernah berbohong tentang apa yang sudah benar-benar ditulis.

   Dibangkitkan, bukan ditulis satu per satu: dua penugasan per
   penulis per bulan selama tiga bulan menghasilkan ratusan baris,
   yang kalau ditulis manual justru menyembunyikan polanya.
   ========================================================== */
const JUDUL_TUGAS = [
  'Muhammad Abduh dan Pembaruan Tafsir', "Metode Tafsir Ma'tsur dan Ra'yi",
  "Kaidah-Kaidah Ulumul Quran", 'Makna Takwa dalam al-Quran',
  'Tafsir Tematik: Keadilan Sosial', 'Pendekatan Linguistik dalam Tafsir',
  'Sejarah Kodifikasi al-Quran', 'Muhkam dan Mutasyabih',
  'Nasikh dan Mansukh dalam al-Quran', 'Qiraat Sab‘ah dan Implikasinya',
  'Israiliyyat dalam Kitab Tafsir', 'Amtsal al-Quran dan Fungsi Didaktisnya',
  'Qasam al-Quran: Sumpah dan Maknanya', 'Fawatih as-Suwar',
  'Munasabah Ayat dan Surat', "I'jaz al-Quran dari Sisi Ilmiah",
  'Tafsir Maqashidi Kontemporer', 'Wujuh dan Nazhair',
  'Asbabun Nuzul dan Batas Keberlakuannya', 'Balaghah dalam Ayat Hukum',
  'Tafsir Sufi: Antara Isyarat dan Takwil', 'Perempuan dalam Narasi al-Quran',
  'Kisah Nabi Yusuf: Struktur Naratif', 'Konsep Ummah dalam al-Quran',
  'Tafsir al-Mizan dan Metodologinya', 'Ayat-Ayat Kauniyah dan Sains Modern',
  'Terjemah al-Quran: Batas dan Problemnya', 'Tafsir Nusantara Abad ke-20',
  'Makna Hidayah dan Dhalalah', 'Konsep Rizki dalam al-Quran',
];

/* Bulan berjalan dalam data contoh sengaja tetap (bukan bulan hari ini)
   supaya angka pada dasbor tidak berubah-ubah saat prototipe dibuka
   kapan pun. Pemilih bulan di ERP membuka bulan terbaru yang berisi. */
function bangunPenugasan(users) {
  const penulis = users.filter((u) => u.status === 'aktif'
    && !['ketua', 'sekretaris', 'bendahara'].includes(u.role));
  const bulan = ['2025-04', '2025-05', '2025-06'];
  const akhir = { '2025-04': '2025-04-30', '2025-05': '2025-05-31', '2025-06': '2025-06-30' };
  const hasil = [];
  let n = 0, j = 0;
  bulan.forEach((bl, bi) => {
    penulis.forEach((u, ui) => {
      for (let k = 0; k < 2; k++) {
        n += 1;
        const judul = JUDUL_TUGAS[j++ % JUDUL_TUGAS.length];
        /* Bulan lampau hampir rampung; bulan berjalan masih beragam. */
        const putar = (ui * 2 + k) % 3;
        const progress = bi < 2 ? (putar === 2 && ui % 4 === 0 ? 'proses' : 'siap')
          : ['belum', 'proses', 'siap'][putar];
        hasil.push({
          id: 'tg' + n, userId: u.id, bulan: bl, judul, progress,
          deadline: akhir[bl], artikelId: '', catatan: '',
        });
      }
    });
  });
  return hasil;
}

SEED.penugasan = bangunPenugasan(SEED.users);

/* Target & panduan redaksi — disunting PJ Artikel dari ERP. */
SEED.redaksi = {
  targetBulanan: 2,
  panduan: [
    { judul: 'Sistematika Naskah',
      isi: ['Naskah dibuka dengan pendahuluan yang menyebut persoalan dan alasan mengapa ia layak dibahas, bukan sekadar mendefinisikan istilah.',
            'Isi dibagi menjadi tiga sampai lima bagian. Tiap bagian membawa satu gagasan utama dan ditutup dengan simpul yang menyambung ke bagian berikutnya.',
            'Penutup merangkum temuan, bukan mengulang pendahuluan.'] },
    { judul: 'Rujukan & Kutipan',
      isi: ['Setiap pernyataan yang menukil pendapat ulama wajib menyebut kitab dan juz atau halamannya.',
            'Ayat ditulis lengkap dengan nama surat dan nomor ayat. Hadis disertai perawi dan derajatnya.',
            'Hindari mengutip dari kutipan. Bila terpaksa, sebutkan sumber perantaranya secara jujur.'] },
    { judul: 'Transliterasi & Bahasa',
      isi: ['Gunakan transliterasi yang konsisten sepanjang naskah, mengikuti pedoman yang dipakai buletin kajian.',
            'Istilah Arab yang sudah lazim diserap ditulis dalam bentuk serapannya: tafsir, hadis, ijmak.',
            'Kalimat panjang dipecah. Satu kalimat sebaiknya membawa satu maksud.'] },
    { judul: 'Panjang & Tenggat',
      isi: ['Panjang naskah 900–1.500 kata, di luar daftar rujukan.',
            'Naskah dikirim melalui ERP paling lambat pada tanggal tenggat yang tertera di penugasan.',
            'Naskah yang dikembalikan untuk revisi diberi waktu tujuh hari sejak catatan diterima.'] },
  ],
};

/* ==========================================================
   11. PENERBITAN BUKU — ruang kerja PJ Buku

   Satu proyek buku memuat seluruh tahapnya sekaligus: rencana,
   tenggat, pembagian tugas, naskah, produksi, distribusi, dan
   kasaran modalnya. Menyimpannya sebagai satu objek per buku —
   bukan koleksi terpisah per tahap — membuat buku kedua tidak
   pernah menimpa arsip buku pertama.

   Perhatikan `naskah`: satu baris per sub judul, memuat penulis,
   progress tulis, progress edit, dan bukti layout sekaligus.
   Tahap Penulisan, Editing, dan Layouting adalah tiga cara
   memandang daftar yang sama, sehingga nama penulis dan sub
   judulnya mustahil berbeda antar tahap.
   ========================================================== */
const KASARAN = (uraian, rp, egp) => ({ id: 'md' + rp, uraian, rp, egp });

SEED.buku = [
  {
    id: 'bk1', status: 'aktif', tahap: 'penulisan',
    judul: 'Peta Intelektual Mufassir',
    ringkas: 'Bunga rampai kajian atas sepuluh kitab tafsir beserta corak dan kecenderungan mufassirnya.',
    kumpulPerdana: '2025-06-10',
    targetTerbit: '2025-09-30',
    pjUtamaId: 'u5',
    editorIds: ['u41', 'u42'],
    layouterIds: ['u15'],
    desainerIds: ['u43'],
    pjProduksiId: 'u42',

    timeline: [
      { id: 'tl1', tahapan: 'Pengumpulan Tulisan', tanggal: '2025-07-30' },
      { id: 'tl2', tahapan: 'Editing',             tanggal: '2025-08-10' },
      { id: 'tl3', tahapan: 'Layouting',           tanggal: '2025-08-20' },
      { id: 'tl4', tahapan: 'Desain',              tanggal: '2025-08-25' },
      { id: 'tl5', tahapan: 'Cetak',               tanggal: '2025-09-10' },
      { id: 'tl6', tahapan: 'Distribusi',          tanggal: '2025-09-20' },
    ],

    naskah: [
      { id: 'nk1',  userId: 'u39', subJudul: 'Tafsir Zamakhsyari', progressTulis: 'proses', progressEdit: 'proses', deadline: '2025-07-30', buktiLayout: ph('TAFSIR ZAMAKHSYARI', '#1E4D2B', '#0E2E1C', 'الكشاف') },
      { id: 'nk2',  userId: 'u7',  subJudul: 'Tafsir Al-Qurthubi',  progressTulis: 'siap',   progressEdit: 'siap',   deadline: '2025-07-30', buktiLayout: ph('TAFSIR AL-QURTHUBI', '#123C22', '#265E33', 'القرطبي') },
      { id: 'nk3',  userId: 'u9',  subJudul: 'Tafsir Al-Manar',     progressTulis: 'belum',  progressEdit: 'belum',  deadline: '2025-07-30', buktiLayout: ph('TAFSIR AL-MANAR', '#1A4A2E', '#0E2E1C', 'المنار') },
      { id: 'nk4',  userId: 'u2',  subJudul: 'Tafsir Ibnu Katsir',  progressTulis: 'belum',  progressEdit: 'belum',  deadline: '2025-07-30', buktiLayout: '' },
      { id: 'nk5',  userId: 'u3',  subJudul: 'Tafsir Al-Munir',     progressTulis: 'proses', progressEdit: 'belum',  deadline: '2025-07-30', buktiLayout: '' },
      { id: 'nk6',  userId: 'u8',  subJudul: 'Tafsir Ath-Thabrani', progressTulis: 'siap',   progressEdit: 'proses', deadline: '2025-07-30', buktiLayout: '' },
      { id: 'nk7',  userId: 'u13', subJudul: 'Tafsir Al-Jalalain',  progressTulis: 'proses', progressEdit: 'belum',  deadline: '2025-07-30', buktiLayout: '' },
      { id: 'nk8',  userId: 'u5',  subJudul: 'Tafsir Al-Baghawi',   progressTulis: 'siap',   progressEdit: 'siap',   deadline: '2025-07-30', buktiLayout: '' },
      { id: 'nk9',  userId: 'u40', subJudul: 'Tafsir Al-Razi',      progressTulis: 'belum',  progressEdit: 'belum',  deadline: '2025-07-30', buktiLayout: '' },
      { id: 'nk10', userId: 'u16', subJudul: 'Tafsir Al-Tabari',    progressTulis: 'proses', progressEdit: 'belum',  deadline: '2025-07-30', buktiLayout: '' },
    ],

    desain: [
      { id: 'ds1', keterangan: 'Cover Depan',    bukti: ph('COVER DEPAN', '#14361F', '#0A2314', 'الغلاف') },
      { id: 'ds2', keterangan: 'Cover Belakang', bukti: ph('COVER BELAKANG', '#1D1D20', '#0E0E11', 'الخلفي') },
      { id: 'ds3', keterangan: 'Isi Contoh',     bukti: ph('ISI CONTOH', '#26402C', '#16281B', 'نموذج') },
    ],

    produksi: [
      { id: 'pd1', kegiatan: 'Cetak Sampel',                 selesai: true  },
      { id: 'pd2', kegiatan: 'Pembuatan G-Form Pemesanan',   selesai: true  },
      { id: 'pd3', kegiatan: 'Cetak untuk Penulis & Editor', selesai: true  },
      { id: 'pd4', kegiatan: 'Cetak untuk Pemesan',          selesai: false },
    ],

    distribusi: [
      { id: 'db1', wilayah: 'Darrosah', pjId: 'u5'  },
      { id: 'db2', wilayah: 'Sabi',     pjId: 'u42' },
      { id: 'db3', wilayah: 'Asyir',    pjId: 'u39' },
    ],

    modal: [
      KASARAN('Cetak (100 eksemplar)',    2500000, 1500),
      KASARAN('Desain & Layout',           500000,  300),
      KASARAN('Transportasi & Distribusi', 300000,  200),
      KASARAN('Lain-lain',                 200000,  150),
    ],

    dokumen: [
      { id: 'dk1', nama: 'Proposal Penerbitan Buku', jenis: 'Proposal',  tanggal: '2025-06-12' },
      { id: 'dk2', nama: 'Surat Permohonan ISBN',    jenis: 'Surat',     tanggal: '2025-07-02' },
      { id: 'dk3', nama: 'Penawaran Percetakan',     jenis: 'Penawaran', tanggal: '2025-07-18' },
      { id: 'dk4', nama: 'Notulensi Kumpul Perdana', jenis: 'Notulensi', tanggal: '2025-06-10' },
    ],
  },

  {
    id: 'bk2', status: 'arsip', tahap: 'selesai',
    judul: "Kaidah-Kaidah Tafsir Nusantara",
    ringkas: 'Terbit perdana Kajian Al-I\'jaz, memuat delapan kajian atas tradisi tafsir di Nusantara.',
    kumpulPerdana: '2024-02-05',
    targetTerbit: '2024-08-18',
    pjUtamaId: 'u2',
    editorIds: ['u7'], layouterIds: ['u5'], desainerIds: ['u6'], pjProduksiId: 'u3',
    timeline: [
      { id: 'tl7',  tahapan: 'Pengumpulan Tulisan', tanggal: '2024-04-30' },
      { id: 'tl8',  tahapan: 'Editing',             tanggal: '2024-05-30' },
      { id: 'tl9',  tahapan: 'Layouting & Desain',  tanggal: '2024-06-25' },
      { id: 'tl10', tahapan: 'Cetak',               tanggal: '2024-07-28' },
      { id: 'tl11', tahapan: 'Distribusi',          tanggal: '2024-08-18' },
    ],
    naskah: [
      { id: 'nk11', userId: 'u4',  subJudul: 'Tafsir Marah Labid',      progressTulis: 'siap', progressEdit: 'siap', deadline: '2024-04-30', buktiLayout: '' },
      { id: 'nk12', userId: 'u11', subJudul: 'Tafsir al-Ibriz',         progressTulis: 'siap', progressEdit: 'siap', deadline: '2024-04-30', buktiLayout: '' },
      { id: 'nk13', userId: 'u14', subJudul: 'Tafsir al-Azhar',         progressTulis: 'siap', progressEdit: 'siap', deadline: '2024-04-30', buktiLayout: '' },
      { id: 'nk14', userId: 'u18', subJudul: 'Tafsir al-Misbah',        progressTulis: 'siap', progressEdit: 'siap', deadline: '2024-04-30', buktiLayout: '' },
    ],
    desain: [{ id: 'ds4', keterangan: 'Cover Depan', bukti: ph('KAIDAH TAFSIR NUSANTARA', '#1E4D2B', '#0E2E1C', 'قواعد') }],
    produksi: [
      { id: 'pd5', kegiatan: 'Cetak 150 eksemplar', selesai: true },
      { id: 'pd6', kegiatan: 'Distribusi ke wilayah', selesai: true },
    ],
    distribusi: [{ id: 'db4', wilayah: 'Seluruh Wilayah', pjId: 'u3' }],
    modal: [KASARAN('Cetak (150 eksemplar)', 3200000, 1900), KASARAN('Desain & Layout', 600000, 360)],
    dokumen: [{ id: 'dk5', nama: 'Laporan Pertanggungjawaban Terbit', jenis: 'Laporan', tanggal: '2024-09-01' }],
  },
];

/* ==========================================================
   12. MEDIA & WEBSITE — ruang kerja PJ Media & Website

   Kalender Konten pada dasbor tidak punya koleksi sendiri: ia
   gabungan berurut-tanggal dari artikel, agenda, media sosial,
   dan video. Satu hal dicatat di satu tempat saja, lalu dilihat
   dari beberapa sudut — sama seperti `naskah` di ruang PJ Buku.
   ========================================================== */
const STATUS_KONTEN = ['draft', 'editing', 'dijadwalkan', 'siap', 'terbit'];

SEED.event = [
  { id:'ev1', judul:'Kajian Rutin Al-I\'jaz',            tanggal:'2025-07-04', jam:'19:30', lokasi:'Aula IKPM Kairo',        status:'terbit',      ket:'Kajian pekanan terbuka untuk umum.' },
  { id:'ev2', judul:'Seminar Ulumul Quran',              tanggal:'2025-07-12', jam:'09:00', lokasi:'Aula IKPM Kairo',        status:'dijadwalkan', ket:'Seminar tahunan bersama pemateri undangan.' },
  { id:'ev3', judul:'Bedah Buku Peta Intelektual Mufassir', tanggal:'2025-08-02', jam:'16:00', lokasi:'Sekretariat IKPM Kairo', status:'draft',    ket:'Menunggu kepastian tanggal terbit buku.' },
  { id:'ev4', judul:'Halaqah Ilmiah Bersama',            tanggal:'2025-06-21', jam:'20:00', lokasi:'Wisma Nusantara',        status:'terbit',      ket:'Kolaborasi dengan Forum Studi Islam Kairo.' },
  { id:'ev5', judul:'Peringatan Nuzulul Quran',          tanggal:'2025-06-14', jam:'19:00', lokasi:'Masjid Indonesia Kairo',  status:'terbit',      ket:'Kajian tematik dan tadarus bersama.' },
];

SEED.sosmed = [
  { id:'sm1', judul:'Quote Ulama Tafsir',        platform:'Instagram', tanggal:'2025-07-02', status:'dijadwalkan', interaksi:0,   isi:'Kutipan Imam az-Zarkasyi tentang adab menafsirkan al-Quran.', gambar: ph('QUOTE ULAMA','#1E4D2B','#0E2E1C','اقتباس') },
  { id:'sm2', judul:'Poster Seminar Ulumul Quran',platform:'Instagram', tanggal:'2025-06-25', status:'terbit',      interaksi:486, isi:'Pengumuman seminar beserta tautan pendaftaran.', gambar: ph('POSTER SEMINAR','#123C22','#265E33','ندوة') },
  { id:'sm3', judul:'Cuplikan Kajian Sabtu',      platform:'Instagram', tanggal:'2025-06-22', status:'terbit',      interaksi:392, isi:'Potongan satu menit pembahasan kaidah asbabun nuzul.', gambar: ph('CUPLIKAN KAJIAN','#26402C','#16281B','مقطع') },
  { id:'sm4', judul:'Utas Metodologi Tafsir',     platform:'Twitter',   tanggal:'2025-07-08', status:'draft',       interaksi:0,   isi:'Utas tujuh bagian tentang tafsir bil-ma\'tsur dan bir-ra\'yi.', gambar:'' },
  { id:'sm5', judul:'Pengumuman Buku Baru',       platform:'Facebook',  tanggal:'2025-07-15', status:'dijadwalkan', interaksi:0,   isi:'Kabar terbitnya buku ketiga beserta cara pemesanan.', gambar:'' },
];

SEED.video = [
  { id:'vd1', judul:'Highlight Kajian Sabtu',            platform:'YouTube',  tanggal:'2025-07-05', durasi:'08:24', status:'editing',     tautan:'', thumb: ph('HIGHLIGHT KAJIAN','#1A4A2E','#0E2E1C','فيديو') },
  { id:'vd2', judul:'Kajian Sabtu: Metode Tafsir',       platform:'YouTube',  tanggal:'2025-06-22', durasi:'46:10', status:'terbit',      tautan:'https://youtube.com/@kajianalijaz', thumb: ph('METODE TAFSIR','#14361F','#0A2314','منهج') },
  { id:'vd3', judul:'Podcast: Mengenal Ulumul Quran',    platform:'Spotify',  tanggal:'2025-07-18', durasi:'32:00', status:'dijadwalkan', tautan:'', thumb:'' },
  { id:'vd4', judul:'Dokumentasi Seminar Tahun Lalu',    platform:'YouTube',  tanggal:'2025-05-30', durasi:'12:38', status:'terbit',      tautan:'https://youtube.com/@kajianalijaz', thumb:'' },
];

SEED.media = [
  { id:'md1', nama:'Kajian Sabtu',        jenis:'Foto',   tanggal:'2025-06-25', berkas: ph('KAJIAN SABTU','#1E4D2B','#0E2E1C','السبت') },
  { id:'md2', nama:'Quote Tafsir',        jenis:'Grafis', tanggal:'2025-06-25', berkas: ph('QUOTE TAFSIR','#1D1D20','#0E0E11','تفسير') },
  { id:'md3', nama:'Poster Event',        jenis:'Grafis', tanggal:'2025-06-24', berkas: ph('POSTER EVENT','#123C22','#265E33','فعالية') },
  { id:'md4', nama:'Banner Website',      jenis:'Grafis', tanggal:'2025-06-23', berkas: ph('BANNER WEBSITE','#26402C','#16281B','بانر') },
  { id:'md5', nama:'Dokumentasi Kajian',  jenis:'Foto',   tanggal:'2025-06-22', berkas: ph('DOKUMENTASI','#1A4A2E','#0E2E1C','توثيق') },
  { id:'md6', nama:'Cover Artikel',       jenis:'Grafis', tanggal:'2025-06-22', berkas: ph('COVER ARTIKEL','#14361F','#0A2314','غلاف') },
];

SEED.desain = [
  { id:'dg1', nama:'Sampul Buku Ketiga',       jenis:'Cover',   tanggal:'2025-06-20', status:'selesai', berkas: ph('SAMPUL BUKU','#1E4D2B','#0E2E1C','غلاف') },
  { id:'dg2', nama:'Template Feed Instagram',  jenis:'Template',tanggal:'2025-06-18', status:'selesai', berkas: ph('TEMPLATE FEED','#26402C','#16281B','قالب') },
  { id:'dg3', nama:'Banner Seminar Juli',      jenis:'Banner',  tanggal:'2025-07-03', status:'proses',  berkas:'' },
  { id:'dg4', nama:'Kop Surat & Sertifikat',   jenis:'Cetak',   tanggal:'2025-05-28', status:'selesai', berkas:'' },
];

SEED.tugas = [
  { id:'tg1', userId:'u5', judul:'Update halaman beranda website',  prioritas:'tinggi', tenggat:'2025-06-30', selesai:false },
  { id:'tg2', userId:'u5', judul:'Upload video highlight kajian',   prioritas:'sedang', tenggat:'2025-07-02', selesai:false },
  { id:'tg3', userId:'u6', judul:'Desain banner event Juli',        prioritas:'sedang', tenggat:'2025-07-03', selesai:false },
  { id:'tg4', userId:'u5', judul:'Optimasi SEO artikel terbaru',    prioritas:'rendah', tenggat:'2025-07-05', selesai:false },
  { id:'tg5', userId:'u6', judul:'Backup database & keamanan',      prioritas:'rendah', tenggat:'2025-07-07', selesai:false },
  { id:'tg6', userId:'u5', judul:'Pasang favicon baru',             prioritas:'rendah', tenggat:'2025-06-18', selesai:true  },
];

SEED.seo = {
  /* Alamat situs disimpan sebagai data supaya pindah domain cukup
     disunting dari ERP — bukan dengan menyentuh kode. */
  domain      : 'alijazqurancenter.com',
  judulBeranda: "Kajian Al-I'jaz — Forum Kajian Tafsir & 'Ulum al-Quran",
  deskripsi   : "Forum keilmuan mahasiswa Indonesia di Kairo yang berfokus pada studi tafsir al-Quran dan 'ulum al-Quran, di bawah naungan IKPM Kairo.",
  kataKunci   : ['kajian tafsir', "ulum al-quran", 'tafsir al-quran', 'IKPM Kairo', 'mahasiswa Al-Azhar'],
  ogGambar    : ph('KAJIAN AL-IJAZ','#0E2E1C','#1B5E20','الإعجاز'),
  penulisMeta : "Kajian Al-I'jaz",
  robots      : 'index, follow',
};

/* Riwayat kunjungan sebagai titik awal. Selanjutnya angka ini tumbuh
   sendiri: tiap halaman publik yang dibuka memanggil Store.catatKunjungan().
   Penyimpanannya per-peramban, jadi ia mengukur pemakaian prototipe —
   bukan pengunjung sedunia, dan memang tidak berpura-pura begitu. */
function bangunKunjungan() {
  const halaman = ['beranda', 'tentang', 'artikel', 'kontak'];
  const bobot = { beranda: 1, tentang: 0.42, artikel: 0.68, kontak: 0.22 };
  const hasil = [];
  let benih = 9151;
  const acak = () => { benih = (benih * 16807) % 2147483647; return benih / 2147483647; };
  /* Berakhir kemarin, dihitung dari hari ini — bukan tanggal tetap. Riwayat
     yang membeku di masa lampau akan membuat panel "30 hari terakhir" kosong
     ketika prototipe dibuka beberapa bulan kemudian.
     Dibuat 60 hari supaya perbandingan "dari bulan lalu" punya pembanding
     sungguhan, bukan sekadar nol. */
  const mulai = new Date(Date.now() - 60 * 86400000);
  mulai.setHours(0, 0, 0, 0);
  for (let d = 0; d < 60; d++) {
    const hari = new Date(mulai.getTime() + d * 86400000);
    const tgl = hari.toISOString().slice(0, 10);
    /* Akhir pekan lebih ramai, dan tren naik tipis sepanjang bulan. */
    const akhirPekan = [5, 6].includes(hari.getDay()) ? 1.35 : 1;
    const tren = 1 + d * 0.012;
    let tayang = 0;
    halaman.forEach((h) => {
      const n = Math.round((26 + acak() * 22) * bobot[h] * akhirPekan * tren);
      hasil.push({ tgl, halaman: h, n });
      tayang += n;
    });
    /* Satu kunjungan biasanya membuka lebih dari satu halaman, dan
       sebagian besar pengunjung datang untuk pertama kalinya. */
    const sesi = Math.max(1, Math.round(tayang / (1.7 + acak() * 0.5)));
    hasil.push({ tgl, halaman: '(sesi)', n: sesi });
    hasil.push({ tgl, halaman: '(baru)', n: Math.round(sesi * (0.58 + acak() * 0.18)) });
  }
  return hasil;
}


/* ==========================================================
   13. KAJIAN — ruang kerja PJ Koordinator Kajian
   ========================================================== */
function bangunKajian() {
  const H = 86400000;
  const hari = (n) => new Date(Date.now() + n * H).toISOString().slice(0, 10);
  /* Peserta diturunkan dari data anggota, bukan daftar id yang ditulis
     tangan — kalau tidak, presensi bisa memuat orang dari angkatan lain. */
  const anggotaX = SEED.users
    .filter((u) => u.angkatan === 'Angkatan X' && u.status === 'aktif')
    .map((u) => u.id);

  /* Kehadiran dibangkitkan agar rata-ratanya masuk akal, bukan sempurna:
     sebagian besar hadir, beberapa terlambat, sedikit berhalangan. */
  let benih = 4211;
  const acak = () => { benih = (benih * 16807) % 2147483647; return benih / 2147483647; };
  const presensiUntuk = (jam) => anggotaX.map((id) => {
    const r = acak();
    const status = r < 0.86 ? 'hadir' : r < 0.94 ? 'terlambat' : 'tidak-hadir';
    const menit = status === 'terlambat' ? 8 + Math.floor(acak() * 20) : Math.floor(acak() * 4);
    const [h, m] = jam.split(':').map(Number);
    const total = h * 60 + m + menit;
    return { userId: id, status, jam: status === 'tidak-hadir' ? '' :
      `${String(Math.floor(total / 60)).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}` };
  });

  const dasar = [
    { d:-24, judul:"Al-Laali al-Hisan: Pengertian & Ruang Lingkup 'Ulum al-Quran", pem:'u10', mod:'u8',  not:'u13', tempat:'Aula 1',  materi:"Bab 1–2 al-Laali al-Hisan", ppt:true, revisi:true },
    { d:-17, judul:'Nuzul al-Quran & Tahapan Penurunannya',                        pem:'u9',  mod:'u8',  not:'u12', tempat:'Aula 1',  materi:'Bab 3 al-Laali al-Hisan', ppt:true, revisi:true },
    { d:-12, judul:'Ulumul Quran: Muhkam dan Mutasyabih',                          pem:'u16', mod:'u17', not:'u13', tempat:'Aula 2',  materi:'Kajian ayat muhkam-mutasyabih', ppt:true, revisi:true },
    { d:-8,  judul:'Sejarah Kodifikasi al-Quran',                                  pem:'u18', mod:'u9',  not:'u12', tempat:'Ruang 3', materi:'Pengumpulan mushaf masa Utsmani', ppt:true, revisi:true },
    { d:-5,  judul:"Tafsir Al-Ma'tsur: Kaidah dan Batasannya",                     pem:'u40', mod:'u41', not:'u13', tempat:'Aula 1',  materi:'Kaidah tafsir bil-ma\'tsur', ppt:true, revisi:true },
    { d:-2,  judul:"Qira'at dan Pengaruhnya pada Tafsir",                          pem:'u39', mod:'u8',  not:'u12', tempat:'Aula 2',  materi:"Qira'at sab'ah dan implikasi tafsir", ppt:true, revisi:true },
    { d:2,   judul:'Metodologi Tafsir',                                            pem:'u8',  mod:'u16', not:'u13', tempat:'Aula 1',  materi:'Perbandingan metodologi tafsir', ppt:true, revisi:true },
    { d:4,   judul:"Tafsir Al-Ma'tsur",                                            pem:'u17', mod:'u9',  not:'u12', tempat:'Aula 2',  materi:'Lanjutan kajian tafsir ma\'tsur', ppt:false, revisi:true },
    { d:6,   judul:"Ulumul Qur'an",                                                pem:'u40', mod:'u18', not:'',    tempat:'',        materi:'', ppt:true, revisi:false },
    { d:9,   judul:'Sejarah Tafsir',                                               pem:'u39', mod:'u41', not:'u13', tempat:'Ruang 3', materi:'Perkembangan tafsir lintas masa', ppt:true, revisi:true },
    { d:11,  judul:"Qira'at & Tafsir",                                             pem:'u16', mod:'u8',  not:'u12', tempat:'Aula 1',  materi:'', ppt:false, revisi:false },
  ];

  return dasar.map((x, i) => {
    const tanggal = hari(x.d);
    const jam = i % 2 ? '20:00' : '19:30';
    const lampau = x.d < 0;
    return {
      id: 'k' + (i + 1), judul: x.judul, jenis: 'reguler',
      angkatan: 'Angkatan X', level: 'Level 3', kelompok: '',
      tanggal, jam, tempat: x.tempat,
      pemakalahId: x.pem, moderatorId: x.mod, notulenId: x.not,
      status: lampau ? 'selesai' : 'terjadwal',
      materi: x.materi, ppt: x.ppt, revisi: x.revisi,
      presensi: lampau ? presensiUntuk(jam) : [],
      notulensi: lampau ? 'Ringkasan pembahasan dan simpul diskusi tercatat lengkap.' : '',
    };
  });
}

/* Kelompok belajar dalam satu angkatan — dipakai untuk membagi tugas
   dan memantau kehadiran per kelompok. */
SEED.users.forEach((u, i) => {
  if (u.angkatan === 'Angkatan X' && u.status === 'aktif') u.kelompok = 'Kelompok ' + ((i % 4) + 1);
  else u.kelompok = u.kelompok || '';
});


/* ==========================================================
   14. KEUANGAN — ruang kerja Bendahara

   Rupiah dan pound Mesir adalah dua kantong terpisah, bukan hasil
   konversi satu sama lain: organisasi benar-benar memegang keduanya.
   Karena itu tiap transaksi punya `rp` dan `egp` sendiri — salah
   satunya boleh nol — dan saldonya tidak pernah dijumlahkan, sebab
   menjumlahkan dua mata uang menghasilkan angka yang tak berarti.

   `akunId` menunjuk tempat uang itu disimpan. Satu akun memegang
   kedua mata uang sekaligus, sehingga satu setoran yang berisi
   rupiah dan pound tidak perlu dipecah jadi dua catatan.
   ========================================================== */
SEED.akunKas = [
  { id:'ak1', nama:'Kas Tunai Sekretariat', jenis:'tunai', saldoAwalRp:  500000, saldoAwalEgp: 400, ket:'Uang tunai yang dipegang di sekretariat.' },
  { id:'ak2', nama:'Rekening Bank BSI',     jenis:'bank',  saldoAwalRp: 1500000, saldoAwalEgp:   0, ket:'Rekening atas nama kepengurusan.' },
  { id:'ak3', nama:'Kas Pegangan Bendahara',jenis:'tunai', saldoAwalRp:  200000, saldoAwalEgp: 300, ket:'Uang operasional harian.' },
];

SEED.kategoriKeuangan = [
  { id:'kt1', nama:'Iuran Anggota',       jenis:'masuk'  },
  { id:'kt2', nama:'Infaq/Donasi',        jenis:'masuk'  },
  { id:'kt3', nama:'Donasi Kajian',       jenis:'masuk'  },
  { id:'kt4', nama:'Donasi Kegiatan',     jenis:'masuk'  },
  { id:'kt5', nama:'Penjualan Buku',      jenis:'masuk'  },
  { id:'kt6', nama:'Sewa Sekretariat',    jenis:'keluar' },
  { id:'kt7', nama:'Konsumsi Kajian',     jenis:'keluar' },
  { id:'kt8', nama:'Percetakan & ATK',    jenis:'keluar' },
  { id:'kt9', nama:'Transportasi',        jenis:'keluar' },
  { id:'kt10',nama:'Operasional Web',     jenis:'keluar' },
  { id:'kt11',nama:'Lain-lain',           jenis:'keluar' },
];

/* Tiga bulan terakhir, bertanggal relatif hari ini supaya kartu
   "bulan ini" dan laporan bulanan selalu berisi. */
function bangunKeuangan() {
  const kini = new Date();
  const bulan = (mundur) => {
    const d = new Date(kini.getFullYear(), kini.getMonth() - mundur, 1);
    return (hari) => new Date(d.getFullYear(), d.getMonth(), hari).toISOString().slice(0, 10);
  };
  const hasil = [];
  let n = 0;
  const tambah = (x) => hasil.push({ id: 'f' + (++n), oleh: 'u3', akunId: 'ak1', egp: 0, ...x });

  [0, 1, 2].forEach((mundur) => {
    const tg = bulan(mundur);
    const skala = 1 - mundur * 0.08;
    const bulat = (v) => Math.round((v * skala) / 10000) * 10000;

    /* pemasukan internal — iuran per angkatan */
    [['Angkatan IX', 300000, 700], ['Angkatan X', 350000, 850], ['Angkatan XI', 400000, 900],
     ['Angkatan XII', 300000, 0], ['Anggota Lainnya', 150000, 0]].forEach(([sumber, rp, egp], i) => {
      tambah({ tanggal: tg(20 + (i > 2 ? 2 : i > 1 ? 1 : 0)), jenis: 'masuk', arus: 'internal',
        kategori: 'Iuran Anggota', sumber, rp: bulat(rp), egp: Math.round(egp * skala),
        ket: 'Iuran anggota', akunId: egp ? 'ak1' : 'ak2' });
    });

    /* pemasukan eksternal — infaq & donasi */
    [['Bu Amel', 500000, 'Infaq/Donasi'], ['Donatur Anonim', 250000, 'Infaq/Donasi'],
     ['Ust. Ahmad', 750000, 'Donasi Kajian'], ['Ikhwan Mesir', 300000, 'Donasi Kegiatan']].forEach(([sumber, rp, kat], i) => {
      tambah({ tanggal: tg(19 + (i > 1 ? 1 : 0)), jenis: 'masuk', arus: 'eksternal',
        kategori: kat, sumber, rp: bulat(rp), ket: kat, akunId: 'ak2' });
    });

    /* pengeluaran */
    [['Sewa Sekretariat', 500000, 350, 'Sewa bulanan'], ['Konsumsi Kajian', 250000, 200, 'Konsumsi rutin'],
     ['Percetakan & ATK', 150000, 0, 'Cetak materi'], ['Transportasi', 100000, 0, 'Transport kegiatan'],
     ['Lain-lain', 200000, 50, 'Kebutuhan lain']].forEach(([sumber, rp, egp, ket], i) => {
      tambah({ tanggal: tg(20 + (i > 2 ? 2 : i > 1 ? 1 : 0)), jenis: 'keluar', arus: null,
        kategori: sumber, sumber, rp: bulat(rp), egp: Math.round(egp * skala), ket,
        akunId: egp ? 'ak1' : 'ak3' });
    });
  });
  return hasil;
}

SEED.keuangan = bangunKeuangan();

SEED.kajian = bangunKajian();

SEED.kunjungan = bangunKunjungan();

/* Jejak aktivitas awal, supaya panel "Aktivitas Terbaru" sudah bercerita
   sejak pemakaian pertama. Selanjutnya ia terisi sendiri dari log audit. */
SEED.audit = [
  { aksi:'artikel.status',  target:'a1',  detail:'Artikel "Tafsir al-Manar: Relevansinya dalam Menanggulangi Penyimpangan Ajaran Islam di Indonesia" dipublikasikan', userId:'u7', jam:2 },
  { aksi:'event.tambah',    target:'ev2', detail:'Event "Seminar Ulumul Quran" dibuat',              userId:'u5', jam:5 },
  { aksi:'sosmed.tambah',   target:'sm1', detail:'Konten Instagram "Quote Ulama Tafsir" dijadwalkan',userId:'u6', jam:26 },
  { aksi:'pesan.masuk',     target:'p1',  detail:'Pesan baru dari Muhammad Fikri — Pendaftaran Anggota Baru', userId:'u2', jam:30 },
  { aksi:'video.tambah',    target:'vd2', detail:'Video "Kajian Sabtu: Metode Tafsir" diunggah',     userId:'u6', jam:50 },
  { aksi:'cms.publish',     target:'website', detail:'Menyetujui & menayangkan perubahan halaman Beranda', userId:'u1', jam:72 },
].map((x, i) => ({
  id: 'seedlog' + i,
  ts: new Date(Date.now() - x.jam * 3600000).toISOString(),
  userId: x.userId,
  userNama: (SEED.users.find((u) => u.id === x.userId) || {}).nama || 'Sistem',
  role: (SEED.users.find((u) => u.id === x.userId) || {}).role || 'sistem',
  aksi: x.aksi, target: x.target, detail: x.detail,
}));

window.SEED = SEED;
window.__ph = ph;
window.__avatar = avatar;
