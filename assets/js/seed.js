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
    fontJudul  : "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    fontSkrip  : "'Caveat', 'Segoe Script', 'Bradley Hand', cursive",
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
    menu: [
      { label: 'Beranda',        href: 'index.html'   },
      { label: 'Tentang Kajian', href: 'tentang.html' },
      { label: 'Artikel',        href: 'artikel.html' },
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
          id: 'hero', tipe: 'hero', nama: 'Hero — Kaligrafi Selamat Datang', aktif: true,
          data: {
            arab      : 'السَّلامُ عَلَيْكُم',
            skrip     : 'Selamat Datang di',
            judul     : "Kajian Al-I'jaz",
            subjudul  : 'Menggali al-Quran dengan Ilmu,\nMenghidupkan Hati dengan Tafsir',
            tombolTeks: 'Kenali Lebih Dekat',
            tombolLink: 'tentang.html',
            gambar    : ph('MUSHAF & TAFSIR', '#0E2E1C', '#2E6B33', 'القرآن'),
            masjid    : masjidBawaan(),
            durasiAnimasi: 4.5,
          },
        },
        {
          id: 'tentang-singkat', tipe: 'teks-gambar', nama: 'About Us Singkat', aktif: true,
          data: {
            nomor : '01',
            skrip : 'Apa itu',
            judul : "Kajian Al-I'jaz?",
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
          id: 'syarah', tipe: 'timeline', nama: "Syarah / Sejarah Kajian Al-I'jaz", aktif: true,
          data: {
            nomor : '02',
            skrip : 'Syarah',
            judul : "Kajian Al-I'jaz",
            gambar: ph('AL-AZHAR KAIRO', '#1B5E20', '#0E2E1C', 'الأزهر'),
            tema  : 'gelap',
            butir : [
              { teks: "Kajian Al-I'jaz didirikan pada tanggal 23 November 2011 di sekretariat IKPM lama, Kairo. Pendirian kajian ini dilatarbelakangi oleh kebutuhan akan adanya forum khusus yang secara intensif membahas ilmu tafsir dan 'ulum al-Quran, mengingat pentingnya kedua disiplin tersebut dalam memahami al-Quran secara mendalam." },
              { teks: "Kajian ini digagas oleh beberapa mahasiswa yang memiliki latar belakang dan perhatian khusus dalam bidang tersebut, di antaranya: al-Ustadz Jauhar Ridloni Marzuq, al-Ustadz Novan Hariansyah, al-Ustadz Dede Permana, dan al-Ustadz Saeful Luthfy. Mereka melihat bahwa diperlukan sebuah ruang kajian yang lebih fokus, sistematis, dan berkelanjutan untuk mendalami ilmu-ilmu al-Quran." },
              { teks: "Sebelum berdirinya Kajian Al-I'jaz, para penggagas merupakan bagian dari Kajian Nun, yaitu sebuah kajian umum yang berada di bawah IKPM. Namun, karena sifatnya yang masih umum dan belum terfokus pada satu disiplin tertentu, muncul inisiatif untuk membentuk kajian khusus yang secara spesifik mengkaji tafsir dan 'ulum al-Quran." },
              { teks: "Dari latar belakang tersebut, lahirlah Kajian Al-I'jaz sebagai bentuk pengkhususan bidang keilmuan, sekaligus upaya menjaga dan mengembangkan tradisi keilmuan yang lebih mendalam dan terarah. Sejak saat itu, kajian ini terus berkembang dan menjadi salah satu forum keilmuan yang konsisten dalam mengkaji al-Quran dari berbagai perspektif ilmiah." },
            ],
          },
        },
        {
          id: 'sistem-metode', tipe: 'dua-kolom', nama: 'Sistem & Metode Kajian', aktif: true,
          data: {
            nomor : '03',
            skrip : 'Sistem & Metode Kajian',
            judul : "Kajian Al-I'jaz",
            intro : 'Dalam pelaksanaannya, Kajian Al-I\'jaz menerapkan sistem pembelajaran yang terstruktur dan berjenjang, guna memastikan bahwa setiap anggota memperoleh pemahaman yang komprehensif dan berkesinambungan. Sistem kajian ini terbagi menjadi dua metode utama, yaitu:',
            tema  : 'gelap',
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
          id: 'organisasi', tipe: 'organisasi', nama: 'Struktur Organisasi', aktif: true,
          data: {
            nomor : '04',
            skrip : 'Organisasi',
            judul : "Kajian Al-I'jaz",
            intro : 'Struktur kepengurusan yang menopang jalannya kajian, publikasi, dan administrasi organisasi.',
            /* Terhubung ke modul Anggota di ERP lewat field `role` */
            jabatan: [
              { role: 'ketua',      nama: 'Ust. Jauhar Ridloni Marzuq', ikon: 'ketua'    },
              { role: 'sekretaris', nama: 'Ust. Novan Hariansyah',      ikon: 'surat'    },
              { role: 'bendahara',  nama: 'Ust. Dede Permana',          ikon: 'kas'      },
              { role: 'pj_media',   nama: 'M. Hariz Farezi',            ikon: 'kamera'   },
              { role: 'pj_website', nama: 'Abdul Haris',                ikon: 'monitor'  },
              { role: 'pj_kti',     nama: 'Nur Silvia Salsabila',       ikon: 'pena'     },
              { role: 'pj_kajian',  nama: 'Ahmad Zaky',                 ikon: 'kajian'   },
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
            nomor: '01',
            skrip: 'Visi & Misi',
            judul: "Kajian Al-I'jaz",
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
            nomor : '02',
            skrip : 'Keluarga Besar',
            judul : "Kajian Al-I'jaz",
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
            kategori  : ["Tafsir al-Quran", "'Ulum al-Quran", 'Tokoh Tafsir', 'Metodologi Tafsir', 'Kajian Tematik', 'Lainnya'],
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
            nomor : '01',
            skrip : 'Kirim Pesan',
            judul : 'Sampaikan Pesan Anda',
            intro : 'Tim kami akan membalas melalui email dalam 1–3 hari kerja.',
            subjek: ['Pendaftaran Anggota Baru', 'Pertanyaan Seputar Kajian', 'Kerja Sama & Kolaborasi', 'Kontribusi Artikel', 'Lainnya'],
          },
        },
        {
          id: 'faq', tipe: 'faq', nama: 'Pertanyaan Umum', aktif: true,
          data: {
            nomor: '02',
            skrip: 'Pertanyaan Umum',
            judul: 'FAQ',
            butir: [
              { t: "Siapa saja yang boleh bergabung dengan Kajian Al-I'jaz?", j: 'Terbuka bagi mahasiswa Indonesia di Kairo yang memiliki minat mendalam pada studi tafsir dan \'ulum al-Quran, khususnya anggota IKPM Kairo.' },
              { t: 'Apakah anggota baru langsung mengikuti kajian reguler?', j: 'Tidak. Setiap anggota baru wajib menyelesaikan tahap Pembekalan Intensif (Tatsqif) terlebih dahulu sebagai fondasi keilmuan sebelum masuk ke kajian reguler.' },
              { t: 'Kitab apa yang dikaji pada tahap Tatsqif?', j: "Kitab al-Laali al-Hisan fi 'Ulum al-Quran karya Prof. Dr. Musa Syahin Lasyin, yang dibagi ke dalam beberapa tema dan dipresentasikan peserta secara bergantian." },
              { t: 'Bagaimana jenjang kajian regulernya?', j: "Terdapat tiga level: Level 1 (Ilmu-ilmu al-Quran), Level 2 (Ilmu Tafsir dan Tokoh Tafsir beserta karyanya), dan Level 3 (Grand Tema dan Pembuatan Buku)." },
              { t: 'Apakah saya bisa mengirim artikel untuk dimuat di website?', j: 'Bisa. Anggota dapat mengirim draft melalui ERP, lalu ditinjau oleh PJ Karya Tulis Ilmiah sebelum diterbitkan.' },
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
    { id:'u1', nama:'Ust. Jauhar Ridloni Marzuq', email:'ketua@alijaz.id',      password:'123456', role:'ketua',      status:'aktif', angkatan:'Pendiri',      level:'-',       pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'pendiri', foto:avatar('Jauhar Ridloni','#1B5E20') },
    { id:'u2', nama:'Ust. Novan Hariansyah',      email:'sekretaris@alijaz.id', password:'123456', role:'sekretaris', status:'aktif', angkatan:'Pendiri',      level:'-',       pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'pendiri', foto:avatar('Novan Hariansyah','#2E6B33') },
    { id:'u3', nama:'Ust. Dede Permana',          email:'bendahara@alijaz.id',  password:'123456', role:'bendahara',  status:'aktif', angkatan:'Pendiri',      level:'-',       pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'pendiri', foto:avatar('Dede Permana','#3D7A42') },
    { id:'u4', nama:'Ust. Saeful Luthfy',         email:'saeful@alijaz.id',     password:'123456', role:'anggota',    status:'aktif', angkatan:'Pendiri',      level:'-',       pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'pendiri', foto:avatar('Saeful Luthfy','#4A8751') },
    { id:'u5', nama:'Abdul Haris',                email:'web@alijaz.id',        password:'123456', role:'pj_website', status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Abdul Haris','#7C5CD6') },
    { id:'u6', nama:'M. Hariz Farezi',            email:'media@alijaz.id',      password:'123456', role:'pj_media',   status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Hariz Farezi','#D9536F') },
    { id:'u7', nama:'Nur Silvia Salsabila',       email:'kti@alijaz.id',        password:'123456', role:'pj_kti',     status:'aktif', angkatan:'Angkatan XI', level:'Level 2', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Nur Silvia','#2FA98C') },
    { id:'u8', nama:'Ahmad Zaky',                 email:'kajian@alijaz.id',     password:'123456', role:'pj_kajian',  status:'aktif', angkatan:'Angkatan X',  level:'Level 3', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Ahmad Zaky','#C77A2B') },
    { id:'u9', nama:'Fadhlur Rahman',             email:'fadhlur@alijaz.id',    password:'123456', role:'anggota',    status:'aktif', angkatan:'Angkatan XII',level:'Level 1', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Fadhlur Rahman','#5B7C5F') },
    { id:'u10',nama:'Rizky Maulana',              email:'rizky@alijaz.id',      password:'123456', role:'anggota',    status:'aktif', angkatan:'Angkatan XII',level:'Tatsqif', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'anggota', foto:avatar('Rizky Maulana','#6B8E6F') },
    { id:'u11',nama:'Ilham Nurhakim',             email:'ilham@alijaz.id',      password:'123456', role:'anggota',    status:'alumni',angkatan:'Angkatan VIII',level:'Alumni', pendidikan:"S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo", kategori:'alumni',  foto:avatar('Ilham Nurhakim','#8A7A5C') },
  ],

  /* ==========================================================
     5. ARTIKEL — alur: draft → review → terbit
     ========================================================== */
  artikel: [
    {
      id:'a1', judul:'Tafsir al-Manar: Relevansinya dalam Menanggulangi Penyimpangan Ajaran Islam di Indonesia',
      slug:'tafsir-al-manar-relevansi', kategori:'Tafsir al-Quran', penulisId:'u5', status:'terbit',
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
      slug:'asbabun-nuzul-kaidah-ibrah', kategori:"'Ulum al-Quran", penulisId:'u9', status:'review',
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
      slug:'munasabah-antar-surat', kategori:'Kajian Tematik', penulisId:'u10', status:'draft',
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
  kajian: [
    { id:'k1', judul:"Al-Laali al-Hisan: Pengertian & Ruang Lingkup 'Ulum al-Quran", jenis:'tatsqif', level:'Tatsqif',
      tanggal:'2025-06-14', jam:'19:30', tempat:'Sekretariat IKPM Kairo', pemakalahId:'u10', moderatorId:'u8',
      status:'selesai', materi:"Bab 1–2 kitab al-Laali al-Hisan fi 'Ulum al-Quran", absensi:['u5','u6','u7','u9','u10'], notulensi:'Pembahasan definisi \'ulum al-Quran dan perbedaannya dengan ilmu tafsir. Diskusi berlangsung aktif pada poin batasan cakupan disiplin.' },
    { id:'k2', judul:'Nuzul al-Quran & Tahapan Penurunannya', jenis:'tatsqif', level:'Tatsqif',
      tanggal:'2025-06-21', jam:'19:30', tempat:'Sekretariat IKPM Kairo', pemakalahId:'u9', moderatorId:'u8',
      status:'terjadwal', materi:'Bab 3 kitab al-Laali al-Hisan', absensi:[], notulensi:'' },
    { id:'k3', judul:'Metodologi Tafsir bil-Ma\'tsur dan bir-Ra\'yi', jenis:'reguler', level:'Level 2',
      tanggal:'2025-06-28', jam:'20:00', tempat:'Aula IKPM Kairo', pemakalahId:'u5', moderatorId:'u1',
      status:'terjadwal', materi:'Makalah perbandingan dua metodologi utama tafsir', absensi:[], notulensi:'' },
    { id:'k4', judul:'Grand Tema: Menyusun Kerangka Buku Kajian Tafsir', jenis:'reguler', level:'Level 3',
      tanggal:'2025-07-05', jam:'20:00', tempat:'Aula IKPM Kairo', pemakalahId:'u8', moderatorId:'u1',
      status:'terjadwal', materi:'Presentasi outline buku dan pembagian bab', absensi:[], notulensi:'' },
  ],

  /* ==========================================================
     7. KEUANGAN — modul Bendahara
     ========================================================== */
  keuangan: [
    { id:'f1', tanggal:'2025-05-01', jenis:'masuk',  kategori:'Iuran Anggota',   nominal:1400000, ket:'Iuran bulanan Mei 2025 (14 anggota)', oleh:'u3' },
    { id:'f2', tanggal:'2025-05-05', jenis:'keluar', kategori:'Konsumsi Kajian', nominal:350000,  ket:'Konsumsi kajian tatsqif pekan I',      oleh:'u3' },
    { id:'f3', tanggal:'2025-05-12', jenis:'keluar', kategori:'Cetak & ATK',     nominal:220000,  ket:'Penggandaan modul al-Laali al-Hisan',  oleh:'u3' },
    { id:'f4', tanggal:'2025-05-20', jenis:'masuk',  kategori:'Donasi',          nominal:2000000, ket:'Donasi alumni untuk program buku',     oleh:'u3' },
    { id:'f5', tanggal:'2025-06-01', jenis:'masuk',  kategori:'Iuran Anggota',   nominal:1400000, ket:'Iuran bulanan Juni 2025',              oleh:'u3' },
    { id:'f6', tanggal:'2025-06-03', jenis:'keluar', kategori:'Operasional Web', nominal:480000,  ket:'Perpanjangan domain & hosting 1 tahun',oleh:'u3' },
  ],

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

  /* Arsip surat — modul Sekretaris */
  surat: [
    { id:'s1', nomor:'001/AI/VI/2025', jenis:'keluar', perihal:'Permohonan Peminjaman Aula IKPM', tujuan:'Ketua IKPM Kairo', tanggal:'2025-06-02', status:'terkirim' },
    { id:'s2', nomor:'014/IKPM/VI/2025', jenis:'masuk', perihal:'Undangan Rapat Koordinasi Kajian', tujuan:"Kajian Al-I'jaz", tanggal:'2025-06-05', status:'diterima' },
  ],
};

window.SEED = SEED;
window.__ph = ph;
window.__avatar = avatar;
