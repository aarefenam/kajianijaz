/* ============================================================
   STORE — Sumber data tunggal
   ------------------------------------------------------------
   Data hidup di MySQL pada server, bukan lagi di localStorage.

   Yang TIDAK berubah: objek `db` tetap utuh di memori, dan seluruh
   kode lain membacanya secara sinkron seperti sebelumnya. Hanya dua
   fungsi di berkas ini yang tahu-menahu soal jaringan — `muat()` dan
   `kirimPerubahan()`. Itulah sebabnya perpindahan ini tidak menyentuh
   satu pun dari 97 pembacaan `Store.db.*` di erp.js.

   Cara menulisnya optimistis: perubahan langsung berlaku di memori
   dan tergambar seketika, lalu didorong ke server sesaat kemudian.
   Yang dikirim hanya koleksi yang benar-benar berubah — dibandingkan
   dengan bayangan salinan terakhir yang diketahui server — masing-
   masing beserta versinya. Bila versi di server sudah bergerak,
   tulisan ditolak (409) dan koleksi itu dimuat ulang, bukan ditimpa.

   KONSEP KUNCI — pemisahan DRAFT vs LIVE:

     db.cms       -> versi TAYANG. Hanya ini yang dibaca website publik.
     db.cmsDraft  -> ruang kerja PJ Website / PJ Media. Bebas diubah.
     db.pengajuan -> antrean draft yang menunggu persetujuan Ketua.
     db.versi     -> arsip snapshot setiap kali publish (untuk rollback).

   Tidak ada satu pun jalur yang menulis langsung ke db.cms selain
   approve() dan rollback(), dan keduanya menuntut izin 'cms.approve'
   / 'cms.rollback'. Inilah pengaman utama sistem.
   ============================================================ */

/* Semua permintaan relatif, sehingga situs tetap bekerja apa adanya
   entah di akar domain atau di subfolder. */
const API = 'api/';

/* ---------- util ---------- */
const clone = (o) => JSON.parse(JSON.stringify(o));
const uid = (p = 'x') => p + Math.random().toString(36).slice(2, 9);
const nowISO = () => new Date().toISOString();

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
    aturKas         : clone(s.aturKas),
    tutupBuku       : clone(s.tutupBuku),
    anggaran        : clone(s.anggaran),
    dataDiri        : clone(s.dataDiri),
    pendaftaran     : clone(s.pendaftaran),
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
    templatSurat: clone(s.templatSurat),
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

/* Data yang tersimpan di server tidak mengenal koleksi yang baru
   ditambahkan kemudian. Tanpa penambalan ini, ERP akan menemukan
   `undefined` dan gagal menggambar halaman — sementara memaksa
   pengisian ulang akan membuang seluruh kerja pengguna.

   Yang ditambal di sini ikut terkirim ke server pada penyimpanan
   berikutnya: muat() membandingkan bentuk sebelum dan sesudah, lalu
   menjadwalkan pengiriman bila ada yang berubah. */
function lengkapiDB(tersimpan) {
  if (!tersimpan) return dbAwal();
  const awal = dbAwal();
  Object.keys(awal).forEach((k) => {
    if (tersimpan[k] === undefined) tersimpan[k] = awal[k];
  });
  return migrasiBentuk(tersimpan);
}

/* Bagian yang HANYA memetakan bentuk lama, tanpa menambah koleksi yang
   hilang. Halaman publik memanggil yang ini: ia cuma menerima cms,
   users, artikel, dan seo, jadi menambal sisanya dari seed hanya akan
   menggendong data yang tak pernah dipakainya.

   Pemisahan ini penting justru karena situsnya sudah tayang. Data yang
   tersimpan masih berbentuk lama, dan migrasinya baru tersimpan ketika
   ada pengurus yang masuk. Tanpa pemanggilan di sini, pengunjung akan
   melihat menu dan kategori versi lama sampai kebetulan ada yang
   membuka ERP — dan tidak akan ada yang menyadarinya. */
function migrasiBentuk(tersimpan) {

  /* Arsip surat dahulu hanya mengenal `jenis: masuk|keluar`. Sekarang ia
     terbagi lima kategori. Petakan bentuk lamanya alih-alih membuangnya —
     nomor surat yang sudah terarsip tidak boleh hilang. */
  /* Kategori "Surat Keluar" dilebur: surat yang diterbitkan organisasi
     cukup dibedakan Internal dan Eksternal. Isi kategori lamanya hanya
     data contoh, jadi dibuang — atas keputusan pengurus, bukan asumsi.
     Surat tanpa kategori dari bentuk data paling lama dianggap surat
     masuk atau eksternal, mengikuti jenisnya. */
  if (Array.isArray(tersimpan.surat)) {
    tersimpan.surat.forEach((x) => {
      if (x.kategori === undefined) x.kategori = x.jenis === 'masuk' ? 'masuk' : 'eksternal';
    });
    tersimpan.surat = tersimpan.surat.filter((x) => x.kategori !== 'keluar');
  }

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
  });

  /* Domain baru ditambahkan belakangan; DB lama belum mengenalnya. */
  if (tersimpan.seo && !tersimpan.seo.domain) tersimpan.seo.domain = 'alijazqurancenter.com';

  tanggaliProgram(tersimpan);
  lengkapiEvaluasi(tersimpan);
  hubungkanOrang(tersimpan);
  bubuhiIdAnggota(tersimpan);
  petakanRoleLama(tersimpan);
  petakanFontLama(tersimpan);
  rombakHero(tersimpan);
  susunBeranda(tersimpan);
  susunTentang(tersimpan);
  rapikanKepala(tersimpan);
  perbaikiSvgRusak(tersimpan);

  /* Dulu di sini ada penyelarasan akun contoh: menambahkan kembali
     pengurus dari seed.js yang belum ada di DB. Itu masuk akal selagi
     tiap peramban memegang salinannya sendiri dan bisa tertinggal versi.
     Dengan satu database bersama ia justru berbahaya — anggota yang
     sengaja dihapus Sekretaris akan hidup lagi pada pemuatan berikutnya.
     Daftar akun kini urusan `api/pasang.php`, sekali di awal saja. */

  return tersimpan;
}

/* Hero dirombak: kaligrafi Arab diganti sidebar kategori artikel, dan
   menu "Artikel" di header pindah ke sidebar itu. Data yang sudah
   tersimpan masih memakai bentuk lama, jadi dipetakan di sini.

   Kategori ikut berganti nama. Yang dipetakan hanya nama bawaan yang
   persis — kategori buatan pengurus sendiri tidak disentuh sama sekali. */
const KATEGORI_LAMA = {
  'Tafsir al-Quran'   : 'Seputar Tafsir',
  "'Ulum al-Quran"    : 'Ulumul Quran',
  'Ulum al-Quran'     : 'Ulumul Quran',
  'Metodologi Tafsir' : 'Seputar Tafsir',
  'Kajian Tematik'    : 'Wawasan Keislaman',
  'Lainnya'           : 'Berita Acara',
};

function rombakHero(tersimpan) {
  [tersimpan.cms, tersimpan.cmsDraft].forEach((sisi) => {
    if (!sisi) return;

    (sisi.halaman?.beranda?.sections || []).forEach((sec) => {
      if (sec.tipe !== 'hero' || !sec.data) return;
      /* Medan-medan dari rancangan hero terdahulu. Dibuang, bukan
         dibiarkan: editor CMS menyusun formulirnya dari bentuk data,
         jadi medan yang tak lagi dipakai akan tetap tampil dan disunting
         orang tanpa pernah berpengaruh pada apa pun. */
      ['arab', 'durasiAnimasi', 'katJudul', 'skrip', 'gambar'].forEach((k) => delete sec.data[k]);
      /* Medan yang baru ada pada rancangan sekarang — kolom cari,
         tombol kedua, lencana — diambil dari seed bila belum ada.
         Yang sudah diisi pengurus tidak disentuh. */
      const contoh = (window.SEED?.halaman?.beranda?.sections || []).find((x) => x.tipe === 'hero');
      if (contoh) Object.keys(contoh.data).forEach((k) => {
        if (sec.data[k] === undefined) sec.data[k] = clone(contoh.data[k]);
      });
      if (/^Hero — (Kaligrafi|Sambutan)/.test(sec.nama || '')) sec.nama = 'Hero — Sambutan Utama';
    });

    (sisi.halaman?.artikel?.sections || []).forEach((sec) => {
      if (sec.tipe !== 'daftar-artikel' || !Array.isArray(sec.data?.kategori)) return;
      const baru = [];
      sec.data.kategori.forEach((k) => {
        const nama = KATEGORI_LAMA[k] || k;
        if (!baru.includes(nama)) baru.push(nama);      // 'Metodologi' & 'Tafsir' melebur
      });
      sec.data.kategori = baru;
    });

    /* Menghapus menu dijaga penanda sekali-jalan. Tanpa itu, Sekretaris
       yang sengaja menambahkan kembali tautan Artikel akan mendapatinya
       lenyap lagi pada pemuatan berikutnya — dan tidak akan pernah tahu
       kenapa. */
    if (sisi.situs && !sisi.situs.menuArtikelDipindah) {
      sisi.situs.menuArtikelDipindah = 1;
      if (Array.isArray(sisi.situs.menu)) {
        sisi.situs.menu = sisi.situs.menu.filter((m) => m.href !== 'artikel.html');
      }
    }
  });

  (tersimpan.artikel || []).forEach((a) => {
    if (KATEGORI_LAMA[a.kategori]) a.kategori = KATEGORI_LAMA[a.kategori];
  });
}

/* Font dulu disimpan sebagai tumpukan CSS mentah dan disunting lewat
   kolom teks. Kini ia kunci dari daftar di font.js, sehingga yang
   dipilih pasti ikut terunduh. Yang tersimpan dipetakan berdasarkan
   nama keluarganya — "'Plus Jakarta Sans', 'Segoe UI', …" dikenali
   sebagai jakarta — bukan dibuang begitu saja. */
function petakanFontLama(tersimpan) {
  [tersimpan.cms, tersimpan.cmsDraft].forEach((sisi) => {
    const t = sisi?.theme;
    if (!t) return;
    if (t.fontUtama === undefined) t.fontUtama = FONT.kenali('utama', t.fontJudul);
    /* Pilihan tulisan tangan lama — Caveat dan sejenisnya — tidak ada
       lagi padanannya. Semuanya jatuh ke serif bawaan, bukan dibiarkan
       menunjuk keluarga yang sudah tak dikenal daftar. */
    if (t.fontMerek === undefined) t.fontMerek = 'playfair';
    delete t.fontAksen;
    if (t.fontArab === undefined) t.fontArab = 'amiri';
    /* Dibuang, bukan dibiarkan: halaman Tema menyusun formulirnya dari
       bentuk data, jadi medan lama akan tetap tampil dan disunting
       orang tanpa pernah berpengaruh pada apa pun. */
    delete t.fontJudul;
    delete t.fontSkrip;
  });
}

/* ------------------------------------------------------------
   SUSUNAN BERANDA
   ------------------------------------------------------------
   Beranda sudah beberapa kali disusun ulang, dan tiap kali dijaga
   penanda benar-salah tersendiri. Cara itu tidak bertahan: penandanya
   menumpuk, dan yang sudah melewati perombakan kedua tak pernah
   kebagian yang ketiga.

   Karena itu satu nomor versi menggantikan semuanya. Database yang
   nomornya tertinggal disusun ulang menurut urutan di bawah — dengan
   isi yang sudah ada dipertahankan apa adanya. Yang berpindah hanya
   tempatnya, bukan tulisannya.
   ------------------------------------------------------------ */
const BERANDA_VERSI = 5;

const URUT_BERANDA = [
  'hero', 'pemisah-hero',
  'tentang-singkat',      // Apa itu Kajian Al-I'jaz
  'visi-misi',
  'panel-kajian',
  'syarah',               // Syarah Kajian Al-I'jaz
  'panel-artikel',
  'sistem-metode',        // Sistem & Metode Kajian
  'panel-video', 'panel-buku', 'panel-agenda', 'panel-kontak',
  'organisasi',           // Susunan Organisasi — penutup halaman
];

/* Sempat dipindahkan ke halaman Tentang pada perombakan sebelumnya;
   kini ditarik kembali, berikut suntingan yang menyertainya. */
const PERNAH_DI_TENTANG = ['tentang-singkat', 'syarah', 'sistem-metode', 'organisasi', 'visi-misi'];

/* Gambar contoh yang tersimpan sebagai data-URI SVG bisa memuat `&`
   telanjang di dalam teksnya — cacat pembuatnya dulu. XML menganggap
   itu awal rujukan entitas, berkasnya jadi tak sah, dan peramban hanya
   menampilkan ikon gambar rusak tanpa satu pun pesan.

   Yang diperbaiki di sini bukan sekadar gambar bawaan: perbaikannya
   menyunting isi SVG-nya, sehingga berlaku juga pada gambar yang sudah
   diganti pengurus selama bentuknya SVG. Sudah aman diulang — `&amp;`
   tidak akan berlipat menjadi `&amp;amp;`. */
const AWALAN_SVG = 'data:image/svg+xml';

function perbaikiSvgRusak(tersimpan) {
  const bersihkan = (v) => {
    if (typeof v !== 'string' || !v.startsWith(AWALAN_SVG)) return v;
    const koma = v.indexOf(',');
    if (koma < 0) return v;
    let isi;
    try { isi = decodeURIComponent(v.slice(koma + 1)); } catch (_) { return v; }
    const rapi = isi.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/gi, '&amp;');
    if (rapi === isi) return v;
    return v.slice(0, koma + 1) + encodeURIComponent(rapi);
  };

  const telusur = (o) => {
    if (Array.isArray(o)) { o.forEach((x, i) => { if (typeof x === 'object' && x) telusur(x); else o[i] = bersihkan(x); }); return; }
    if (!o || typeof o !== 'object') return;
    Object.keys(o).forEach((k) => {
      const v = o[k];
      if (typeof v === 'object' && v) telusur(v);
      else o[k] = bersihkan(v);
    });
  };

  [tersimpan.cms, tersimpan.cmsDraft].forEach((sisi) => { if (sisi) telusur(sisi); });
  ['artikel', 'media', 'desain', 'video', 'users'].forEach((k) => {
    if (Array.isArray(tersimpan[k])) telusur(tersimpan[k]);
  });
}

/* Nomor urut dibuang di seluruh halaman, bukan hanya beranda.

   Judulnya pun dirapikan. Dulu kata depan judul berdiri di baris skrip
   terpisah — "Apa itu" di atas "Kajian Al-I'jaz" — dan keduanya dibaca
   sebagai satu kalimat. Dengan kepala bagian yang baru, baris skrip
   menjadi label kecil, sehingga empat bagian berbeda semuanya berjudul
   "Kajian Al-I'jaz". Judulnya disatukan supaya masing-masing kembali
   menyebut dirinya sendiri. */
const JUDUL_SATU = {
  'tentang-singkat': "Apa itu Kajian Al-I'jaz?",
  'syarah'         : "Syarah Kajian Al-I'jaz",
  'sistem-metode'  : 'Sistem & Metode Kajian',
  'organisasi'     : 'Susunan Organisasi',
  'visi-misi'      : 'Visi & Misi',
  'keluarga-besar' : "Keluarga Besar Al-I'jaz",
  'form-kontak'    : 'Sampaikan Pesan Anda',
  'faq'            : 'Pertanyaan yang Sering Diajukan',
};

function rapikanKepala(tersimpan) {
  [tersimpan.cms, tersimpan.cmsDraft].forEach((sisi) => {
    Object.values(sisi?.halaman || {}).forEach((hal) => {
      (hal.sections || []).forEach((sec) => {
        if (!sec.data) return;
        delete sec.data.nomor;
        if (!JUDUL_SATU[sec.id]) return;
        /* Hanya judul bawaan yang disatukan. Yang sudah ditulis ulang
           pengurus dibiarkan — merekalah yang lebih tahu maksudnya. */
        if (/^Kajian Al-I'jaz\??$/.test(sec.data.judul || '') || sec.data.skrip !== undefined) {
          sec.data.judul = JUDUL_SATU[sec.id];
        }
        delete sec.data.skrip;
      });
    });
  });
}

/* Halaman Tentang: kalimatnya diperbarui dan galeri kegiatan
   ditambahkan. Dijaga penanda sekali-jalan — galeri yang sengaja
   dihapus pengurus tidak boleh muncul kembali, dan kalimat yang sudah
   ditulis ulang tidak boleh tertimpa. */
const KALIMAT_TENTANG_LAMA =
  "Berkenalan dengan para pendiri dan anggota Kajian Al-I'jaz yang berkomitmen dalam mendalami tafsir al-Quran dan 'ulum al-Quran.";

function susunTentang(tersimpan) {
  const contoh = (window.SEED?.halaman?.tentang?.sections || [])
    .find((x) => x.tipe === 'galeri');

  [tersimpan.cms, tersimpan.cmsDraft].forEach((sisi) => {
    if (!sisi?.situs || sisi.situs.tentangVersi >= 1) return;
    const sec = sisi.halaman?.tentang?.sections;
    if (!Array.isArray(sec)) return;
    sisi.situs.tentangVersi = 1;

    const hero = sec.find((x) => x.tipe === 'hero-halaman');
    if (hero?.data && hero.data.subjudul === KALIMAT_TENTANG_LAMA) {
      hero.data.subjudul = 'Berkenalan dengan para pendiri, alumni, dan anggota kajian dari masa ke masa.';
    }
    if (contoh && !sec.some((x) => x.tipe === 'galeri')) sec.push(clone(contoh));
  });
}

function susunBeranda(tersimpan) {
  const seedSec = window.SEED?.halaman?.beranda?.sections || [];
  if (!seedSec.length) return;

  [tersimpan.cms, tersimpan.cmsDraft].forEach((sisi) => {
    if (!sisi?.situs) return;
    if ((sisi.situs.berandaVersi || 0) >= BERANDA_VERSI) return;
    const beranda = sisi.halaman?.beranda;
    if (!beranda || !Array.isArray(beranda.sections)) return;
    sisi.situs.berandaVersi = BERANDA_VERSI;

    /* Penanda dari perombakan terdahulu tak berguna lagi — dan bila
       dibiarkan, ia tetap tampil sebagai medan yang dapat disunting
       di halaman Tema. */
    delete sisi.situs.berandaDirombak;
    delete sisi.situs.pemisahDitambah;

    const punya = new Map();
    beranda.sections.forEach((sec) => punya.set(sec.id, sec));

    const tentang = sisi.halaman?.tentang;
    if (tentang && Array.isArray(tentang.sections)) {
      tentang.sections = tentang.sections.filter((sec) => {
        if (!PERNAH_DI_TENTANG.includes(sec.id)) return true;
        if (!punya.has(sec.id)) punya.set(sec.id, sec);
        return false;
      });
    }

    /* Tema tiap bagian ditetapkan ulang supaya hijau dan krem benar-benar
       berselang. Sebelum ini keempat bagian bercerita tak punya tema sama
       sekali — semuanya jatuh ke krem, dan tiga panel krem berturut-turut
       membuat halaman terlihat kehabisan warna di tengah. */
    const TEMA_BERANDA = {
      'tentang-singkat': 'krem', 'visi-misi': 'hijau',
      'panel-kajian': 'krem', 'syarah': 'hijau',
      'panel-artikel': 'krem', 'sistem-metode': 'hijau',
      'panel-video': 'krem', 'panel-buku': 'hijau',
      'panel-agenda': 'krem', 'panel-kontak': 'hijau',
      'organisasi': 'krem',
    };

    const hasil = [];
    URUT_BERANDA.forEach((id) => {
      const ada = punya.get(id);
      if (ada) { hasil.push(ada); punya.delete(id); return; }
      const contoh = seedSec.find((x) => x.id === id);
      if (contoh) hasil.push(clone(contoh));
    });
    /* Section buatan pengurus yang tak dikenal urutan di atas tetap
       ikut, di belakang — lenyap tanpa jejak jauh lebih buruk
       daripada urutan yang meleset. */
    punya.forEach((sec) => hasil.push(sec));
    hasil.forEach((sec) => {
      if (TEMA_BERANDA[sec.id] && sec.data) sec.data.tema = TEMA_BERANDA[sec.id];
      /* Nomor urut sudah tidak digambar; dibiarkan, ia akan tetap tampil
         sebagai medan yang dapat disunting di editor CMS. */
      if (sec.data) delete sec.data.nomor;
    });
    beranda.sections = hasil;
  });
}

/* Program kerja dahulu mencatat waktunya sebagai teks bebas — "Mei
   2025". Teks tak dapat diurutkan dan tak dapat dibandingkan dengan hari
   ini, jadi tak ada cara mengetahui program mana yang terlambat.

   Kini tiap program bertanggal mulai dan selesai. Teks lama yang berupa
   bulan dan tahun dibentangkan menjadi sebulan penuh; yang tak terbaca
   dibiarkan kosong untuk diisi pengurus, bukan ditebak. Teks aslinya
   sendiri tidak dibuang — ia tetap di `waktu`. */
const BULAN_TEKS = {
  jan: 1, januari: 1, feb: 2, februari: 2, mar: 3, maret: 3, apr: 4, april: 4,
  mei: 5, may: 5, jun: 6, juni: 6, jul: 7, juli: 7, agu: 8, agt: 8, agustus: 8, aug: 8,
  sep: 9, sept: 9, september: 9, okt: 10, oktober: 10, oct: 10,
  nov: 11, november: 11, nopember: 11, des: 12, desember: 12, dec: 12,
};
function rentangDariTeks(teks) {
  const m = String(teks || '').trim().toLowerCase().match(/^([a-z]+)\.?\s+(\d{4})$/);
  const bulan = m && BULAN_TEKS[m[1]];
  if (!bulan) return null;
  const tahun = Number(m[2]);
  const dua = (n) => String(n).padStart(2, '0');
  const akhir = new Date(tahun, bulan, 0).getDate();      // hari ke-0 bulan berikutnya
  return { mulai: `${tahun}-${dua(bulan)}-01`, selesai: `${tahun}-${dua(bulan)}-${dua(akhir)}` };
}
function tanggaliProgram(tersimpan) {
  (tersimpan.kaleidoskop || []).forEach((k) => {
    if (k.tglMulai !== undefined) return;
    const r = rentangDariTeks(k.waktu);
    k.tglMulai = r ? r.mulai : '';
    k.tglSelesai = r ? r.selesai : '';
    k.pjId = k.pjId || '';
    k.divisi = k.divisi || '';
    k.catatan = k.catatan || '';
  });
}

/* Data Pengurus dan Koordinator dahulu menyimpan nama sebagai teks
   lepas, tak terkait Data Anggota — orang yang sama diketik sampai tiga
   kali dan bisa berbeda ejaan. Kini tiap baris boleh menunjuk seorang
   anggota lewat `userId`, dan namanya mengikuti Data Anggota.

   Tautan awal dipasang hanya bila namanya cocok dengan TEPAT SATU
   anggota (gelar "Ust." dan huruf besar-kecil diabaikan). Yang tak
   cocok, atau cocok dengan lebih dari satu, dibiarkan tak terhubung
   untuk dipilih pengurus sendiri — menebak orang lebih buruk daripada
   tidak menautkan. */
const namaBaku = (n) => String(n || '').trim().toLowerCase()
  .replace(/^(ustadzah|ustadz|usth|ust)\.?\s+/, '').replace(/\s+/g, ' ');
function hubungkanOrang(tersimpan) {
  const peta = new Map();
  (tersimpan.users || []).forEach((u) => {
    const k = namaBaku(u.nama);
    if (k) peta.set(k, peta.has(k) ? null : u.id);          // null = nama kembar
  });
  /* Tanda tangan dan sertifikat menyusul dengan cara yang sama. Pada
     sertifikat namanya ada di `penerima`, dan yang tak cocok memang
     wajar — "Seluruh Peserta" bukan seorang anggota. */
  [['pengurus', 'nama'], ['koordinator', 'nama'], ['tandaTangan', 'nama'], ['sertifikat', 'penerima']]
    .forEach(([koleksi, kunci]) => {
      (tersimpan[koleksi] || []).forEach((x) => {
        if (x.userId !== undefined) return;
        x.userId = peta.get(namaBaku(x[kunci])) || '';
      });
    });
}

/* --- nomor induk anggota ---
   Tiap anggota bernomor tetap berpola AI-ANGKATAN-URUT — "AI-10-007",
   anggota ketujuh Angkatan X. Nomor inilah isi QR pada kartu anggota:
   dipindai saat presensi kajian dan saat Bendahara menerima iuran.

   Nomor diberikan sekali dan tak pernah berubah, sekalipun angkatan
   atau statusnya kelak disunting — kartu yang sudah dicetak harus
   tetap sah. Karena itu ia dihitung dari nomor tertinggi yang pernah
   ada pada angkatannya, bukan dari jumlah anggota saat ini. */
const ROMAWI_ANGKA = { I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8, IX:9, X:10,
  XI:11, XII:12, XIII:13, XIV:14, XV:15, XVI:16, XVII:17, XVIII:18, XIX:19, XX:20 };
function kodeAngkatan(angkatan) {
  if (/pendiri/i.test(angkatan || '')) return '00';
  const m = String(angkatan || '').trim().match(/([IVX]+|\d+)$/i);
  const n = m && (ROMAWI_ANGKA[m[1].toUpperCase()] || Number(m[1]));
  return n ? String(n).padStart(2, '0') : '99';       // 99: angkatan tak terbaca
}
function niaBerikut(users, angkatan) {
  const awalan = `AI-${kodeAngkatan(angkatan)}-`;
  const tertinggi = (users || []).reduce((maks, u) => {
    const nia = String(u.nia || '').toUpperCase();
    return nia.startsWith(awalan) ? Math.max(maks, Number(nia.slice(awalan.length)) || 0) : maks;
  }, 0);
  return awalan + String(tertinggi + 1).padStart(3, '0');
}
function nomoriAnggota(tersimpan) {
  (tersimpan.users || []).forEach((u) => { if (!u.nia) u.nia = niaBerikut(tersimpan.users, u.angkatan); });
}

/* Transaksi dahulu menunjuk kategorinya lewat NAMA. Mengganti nama
   kategori membuat transaksi lamanya terlepas — tetap tercatat, tetapi
   tak lagi terhitung di kategori mana pun. Kini tiap transaksi juga
   memegang `kategoriId`; namanya tetap disimpan agar laporan lama dan
   unduhan CSV tidak berubah bentuk.

   Tautan awal dicari dari nama dan jenisnya. Yang tak ketemu dibiarkan
   kosong dan ditandai di ERP — tidak ditebak. */
function tautkanKategori(tersimpan) {
  const kat = tersimpan.kategoriKeuangan || [];
  (tersimpan.keuangan || []).forEach((t) => {
    if (t.kategoriId !== undefined) return;
    const k = kat.find((x) => x.nama === t.kategori && x.jenis === t.jenis) || kat.find((x) => x.nama === t.kategori);
    t.kategoriId = k ? k.id : '';
  });
}

/* --- nomor bukti kas ---
   Tiap transaksi bernomor: BKM (kas masuk), BKK (kas keluar), BTR
   (transfer), lalu kode periode dan nomor urut — "BKK-2627-0014".
   Periodenya masa kepengurusan yang ditetapkan Bendahara; transaksi di
   luar masa itu, atau sebelum masa itu ditetapkan, memakai tahunnya. */
const AWALAN_BUKTI = { masuk: 'BKM', keluar: 'BKK', transfer: 'BTR' };
function kodePeriode(tanggal, atur) {
  const p = atur?.periode;
  const t = String(tanggal || '');
  if (p?.mulai && p?.selesai && t >= p.mulai && t <= p.selesai) {
    const a = p.mulai.slice(2, 4), b = p.selesai.slice(2, 4);
    return a === b ? p.mulai.slice(0, 4) : a + b;
  }
  return t.slice(0, 4) || String(new Date().getFullYear());
}
function nomorBukti(daftar, jenis, tanggal, atur) {
  const awalan = `${AWALAN_BUKTI[jenis] || 'BKM'}-${kodePeriode(tanggal, atur)}-`;
  const tertinggi = (daftar || []).reduce((maks, t) => {
    const n = String(t.nomor || '');
    return n.startsWith(awalan) ? Math.max(maks, Number(n.slice(awalan.length)) || 0) : maks;
  }, 0);
  return awalan + String(tertinggi + 1).padStart(4, '0');
}
/** Transaksi lama dinomori menurut urutan tanggalnya. */
function nomoriTransaksi(tersimpan) {
  const semua = tersimpan.keuangan || [];
  semua.map((t, i) => ({ t, i })).filter((x) => !x.t.nomor)
    .sort((a, b) => String(a.t.tanggal).localeCompare(String(b.t.tanggal)) || b.i - a.i)
    .forEach(({ t }) => { t.nomor = nomorBukti(semua, t.jenis, t.tanggal, tersimpan.aturKas); });
}

/* Evaluasi dahulu berhenti sebagai catatan. Kini ia berstatus dan
   berpenanggung jawab; catatan lama dianggap masih terbuka, sebab tak
   ada yang pernah mencatat bahwa ia sudah ditindaklanjuti. */
function lengkapiEvaluasi(tersimpan) {
  (tersimpan.evaluasi || []).forEach((e) => {
    if (e.status !== undefined) return;
    e.status = 'terbuka';
    e.programId = e.programId || '';
    e.pjId = e.pjId || '';
    e.tenggat = e.tenggat || '';
  });
}

/* Anggota yang terlanjur tersimpan tanpa id — lihat catatan di
   simpanAnggota(). Tanpa id mereka tak dapat masuk, tak dapat disetel
   ulang sandinya, dan sandinya berganti sendiri tiap penyimpanan.

   Id dibubuhkan di sini supaya akunnya hidup kembali. Server melihat id
   yang belum dikenalnya, lalu menerbitkan sandi baru sekali dan
   mengembalikannya — persis yang dibutuhkan orang yang selama ini
   terkunci. */
function bubuhiIdAnggota(tersimpan) {
  (tersimpan.users || []).forEach((u) => { if (!u.id) u.id = uid('u'); });
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

/* ============================================================
   LAPISAN JARINGAN
   ============================================================ */
let db = {};                 // isi di memori — dibaca seluruh aplikasi
let versiKoleksi = {};       // versi tiap koleksi menurut server
let bayangan = {};           // JSON terakhir yang diketahui server
let penggunaSesi = null;     // hasil pemeriksaan sesi di server
let wajibGantiSandi = false;
let antre = null;            // penunda pengiriman
let sedangKirim = false;
let perluKirimLagi = false;

const pendengar = new Set();
const pendengarStatus = new Set();

function beritahu() { pendengar.forEach((fn) => { try { fn(db); } catch (_) {} }); }
function status(keadaan, pesan) {
  pendengarStatus.forEach((fn) => { try { fn(keadaan, pesan); } catch (_) {} });
}

async function panggil(jalur, opsi = {}) {
  const r = await fetch(API + jalur, {
    credentials: 'same-origin',
    headers: opsi.body ? { 'Content-Type': 'application/json' } : {},
    ...opsi,
  });
  let d = {};
  let utuh = true;
  try { d = await r.json(); } catch (_) { utuh = false; }

  /* Jawaban 200 yang tak dapat dibaca BUKAN keberhasilan. Sempat
     terjadi: satu peringatan PHP mendahului JSON, parse gagal, dan
     karena kegagalannya didiamkan peramban mengira simpanan sudah
     tersimpan — padahal versi koleksi tak maju dan kata sandi yang
     diterbitkan server hilang tanpa jejak. */
  if (r.ok && !utuh) {
    const e = new Error('Jawaban server tidak dapat dibaca. Coba lagi; bila berulang, periksa log server.');
    e.kode = 502;
    throw e;
  }

  if (!r.ok) {
    const e = new Error(d.galat || `Server menjawab ${r.status}.`);
    e.kode = r.status;
    e.rinci = d;
    throw e;
  }
  return d;
}

/** Potret tiap koleksi, dasar pembanding untuk mencari yang berubah. */
function ambilBayangan(sumber) {
  const b = {};
  Object.keys(sumber).forEach((k) => { b[k] = JSON.stringify(sumber[k]); });
  return b;
}

/* api/simpan.php menolak SELURUH kiriman bila satu saja koleksinya tak
   berwenang ditulis. Itu benar — penyimpanan setengah jadi lebih buruk
   daripada yang gagal seluruhnya — tetapi berarti satu koleksi yang
   terbawa tanpa sengaja ikut menjatuhkan simpanan orang itu.

   Dan koleksi memang bisa terbawa tanpa sengaja: migrasi bentuk berjalan
   untuk siapa pun yang masuk, sehingga Sekretaris yang menyimpan surat
   bisa ikut membawa `cms` hasil perombakan beranda — koleksi yang jelas
   bukan wewenangnya. Karena itu yang tak berwenang disaring di sini,
   dan akan tersimpan sendiri ketika yang berhak membukanya.

   Ini sopan santun, bukan penjagaan: yang menolak tetap server. */
function koleksiKotor() {
  const kotor = {};
  const u = userAktif();
  Object.keys(db).forEach((k) => {
    if (!RBAC.bolehTulisKoleksi(u, k)) return;
    const kini = JSON.stringify(db[k]);
    if (kini !== bayangan[k]) kotor[k] = kini;
  });
  return kotor;
}

/* ---------- memuat ---------- */
async function muat() {
  const d = await panggil('muat.php');
  db = d.isi || {};
  versiKoleksi = d.versi || {};
  penggunaSesi = d.pengguna || null;
  wajibGantiSandi = !!d.sandiAwal;

  /* Migrasi bentuk selalu dijalankan — data yang tersimpan di server pun
     bisa lebih tua daripada kode yang membacanya. Yang membedakan hanya
     apakah hasilnya ikut disimpan: pengunjung tidak berwenang menulis,
     jadi baginya perbaikan itu berlaku di layar saja.

     Bayangan diambil SEBELUM menambal, sebab ia mewakili apa yang ada di
     server. Bila diambil sesudahnya, hasil migrasi tidak akan pernah
     terhitung sebagai perubahan — dan tak satu pun penambalan lama
     tersimpan, diam-diam, selamanya. */
  bayangan = ambilBayangan(db);
  if (penggunaSesi) {
    lengkapiDB(db);
    /* Nomor induk hanya dibubuhkan oleh yang berwenang mengelola anggota.
       Bagi yang lain, menambahkannya berarti mengubah baris orang lain di
       `users` — yang pasti ditolak server, dan gagalnya akan tampak
       sebagai galat simpan yang bukan salah siapa pun. */
    if (RBAC.canAny(userAktif(), ['anggota.manage', 'user.manage'])) nomoriAnggota(db);
    /* Begitu pula buku kas: tautan kategori dan nomor bukti dibubuhkan
       hanya oleh pencatatnya. Ketua kini boleh menulis `keuangan` untuk
       menyetujui pengeluaran, dan server menolak perubahan lain darinya. */
    if (RBAC.can(userAktif(), 'keuangan.manage')) { tautkanKategori(db); nomoriTransaksi(db); }
    /* Peserta kajian lama dibekukan oleh penjadwalnya saja, dengan alasan yang sama. */
    if (RBAC.can(userAktif(), 'kajian.manage')) bekukanPesertaLama(db);
    /* Penugasan contoh dibuang bagi SEMUA yang masuk: yang berwenang
       menyimpannya (PJ Artikel), yang lain cukup tidak melihatnya —
       koleksi yang tak boleh ditulisnya memang tak pernah terkirim. */
    bersihkanPenugasanContoh(db);
    migrasiBuku(db);
    jadwalkanKirim();                 // hanya terkirim bila memang ada bedanya
  } else {
    migrasiBentuk(db);
    bayangan = ambilBayangan(db);     // pengunjung tak pernah menulis
  }
  beritahu();
  return db;
}

/** Promise yang selesai ketika data siap dipakai. Ditunggu erp.js & site.js. */
const siap = muat().catch((e) => {
  if (e.rinci && e.rinci.perluPasang) { belumTerpasang = true; db = {}; return; }
  console.error('Gagal memuat data:', e);
  status('galat', e.message);
  db = {};
});

/* ---------- menyimpan ---------- */
/**
 * Dipanggil setiap kali data berubah. Sengaja tetap sinkron supaya
 * ~40 fungsi pengubah di bawah tidak perlu diubah satu per satu:
 * perubahan berlaku seketika di memori, pengirimannya menyusul.
 */
function simpan() {
  beritahu();
  jadwalkanKirim();
}

function jadwalkanKirim() {
  if (antre) clearTimeout(antre);
  antre = setTimeout(kirimPerubahan, 250);
}

async function kirimPerubahan() {
  antre = null;
  if (sedangKirim) { perluKirimLagi = true; return; }

  const kotor = koleksiKotor();
  const nama = Object.keys(kotor);
  if (!nama.length) return;

  sedangKirim = true;
  status('mengirim');
  const muatan = {};
  nama.forEach((k) => { muatan[k] = { isi: db[k], versi: versiKoleksi[k] ?? null }; });

  try {
    const d = await panggil('simpan.php', { method: 'POST', body: JSON.stringify({ koleksi: muatan }) });
    Object.entries(d.versi || {}).forEach(([k, v]) => { versiKoleksi[k] = v; });
    nama.forEach((k) => { bayangan[k] = kotor[k]; });
    status('tersimpan');
    if (d.sandiBaru) status('sandiBaru', d.sandiBaru);
  } catch (e) {
    if (e.kode === 409) {
      /* Orang lain menulis koleksi yang sama lebih dulu. Muat ulang
         seluruhnya lalu beri tahu — jangan menimpa pekerjaannya. */
      status('bentrok', e.rinci?.koleksi || '');
      await muat().catch(() => {});
    } else if (e.kode === 401) {
      penggunaSesi = null;
      status('sesiHabis');
    } else if (e.kode === 403) {
      /* Wewenang tidak akan berubah dengan menunggu. Mencoba lagi tiap
         empat detik hanya menghasilkan permintaan gagal tanpa henti,
         dan menyembunyikan sebabnya di balik banjir pesan yang sama. */
      status('ditolak', e.message);
    } else {
      status('galat', e.message);
      setTimeout(jadwalkanKirim, 4000);        // jaringan; coba lagi
    }
  } finally {
    sedangKirim = false;
    if (perluKirimLagi) { perluKirimLagi = false; jadwalkanKirim(); }
  }
}

/* Penundaan 250 ms itu murah bagi server, tetapi ada satu saat ia
   berbahaya: bila tab ditutup atau ditinggalkan tepat di dalam jendela
   itu, perubahan terakhir tak pernah terkirim — dan pengguna sudah
   melihatnya tergambar di layar, jadi ia yakin tersimpan.

   `visibilitychange` dipakai, bukan `beforeunload`: pada peramban
   ponsel, tab yang ditinggalkan sering langsung dibekukan tanpa pernah
   memicu beforeunload. `keepalive` menjaga permintaannya tetap berjalan
   meski halamannya sudah pergi. */
function paksaKirim() {
  if (!antre || sedangKirim) return;
  clearTimeout(antre); antre = null;

  const kotor = koleksiKotor();
  const nama = Object.keys(kotor);
  if (!nama.length) return;

  const muatan = {};
  nama.forEach((k) => { muatan[k] = { isi: db[k], versi: versiKoleksi[k] ?? null }; });
  try {
    fetch(API + 'simpan.php', {
      method: 'POST', credentials: 'same-origin', keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ koleksi: muatan }),
    }).catch(() => {});
    /* Bayangannya sengaja TIDAK ikut dimajukan: kalau permintaan ini
       gagal diam-diam, koleksinya masih terhitung kotor dan akan
       terkirim ulang saat halaman dibuka lagi. */
  } catch (_) {}
}
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => { if (document.hidden) paksaKirim(); });
  window.addEventListener('pagehide', paksaKirim);
}

function berlangganan(fn) { pendengar.add(fn); return () => pendengar.delete(fn); }
function berlanggananStatus(fn) { pendengarStatus.add(fn); return () => pendengarStatus.delete(fn); }

/* ---------- mengendus perubahan orang lain ----------
   Dulu ini memakai peristiwa `storage` yang hanya menjangkau antar-tab
   pada satu peramban. Sekarang versinya dijajaki berkala, sehingga
   perubahan terlihat antar PENGGUNA — dan hanya selagi tab terlihat,
   supaya tab yang menganggur tidak terus menyapa server. */
let jajak = null;
function mulaiJajak() {
  if (jajak || typeof document === 'undefined') return;
  jajak = setInterval(async () => {
    if (document.hidden || !penggunaSesi || sedangKirim || antre) return;
    try {
      const d = await panggil('versi.php');
      const berubah = Object.entries(d.versi || {})
        .some(([k, v]) => (versiKoleksi[k] ?? 0) !== v);
      if (berubah && !Object.keys(koleksiKotor()).length) await muat();
    } catch (_) { /* jaringan sedang tidak bersahabat; coba lagi nanti */ }
  }, 20000);
}
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', mulaiJajak);

/* ============================================================
   SESI / AUTENTIKASI
   ------------------------------------------------------------
   Kata sandi tidak pernah lagi dibandingkan di peramban. Yang di sini
   hanya bertanya dan menyimpan jawabannya; keputusannya di server,
   pada api/masuk.php, dan penandanya sebuah cookie sesi HttpOnly yang
   tidak dapat dibaca JavaScript.
   ============================================================ */
async function login(email, password) {
  await panggil('masuk.php', { method: 'POST', body: JSON.stringify({ email, password }) });
  await muat();                       // sekarang berhak melihat seluruh data
  const u = userAktif();
  if (u) { catat(u, 'login', 'sesi', `${u.nama} masuk ke ERP`); simpan(); }
  return u;
}

async function logout() {
  const u = userAktif();
  if (u) { catat(u, 'logout', 'sesi', `${u.nama} keluar dari ERP`); await kirimPerubahan(); }
  try { await panggil('keluar.php', { method: 'POST' }); } catch (_) {}
  penggunaSesi = null;
  wajibGantiSandi = false;
  await muat().catch(() => {});
}

/** Diambil dari `db` supaya suntingan profil langsung terlihat. */
function userAktif() {
  if (!penggunaSesi) return null;
  return (db.users || []).find((u) => u.id === penggunaSesi.id) || penggunaSesi;
}

/** Benarkah pengguna ini masih memakai kata sandi bawaan? */
function perluGantiSandi() { return wajibGantiSandi; }

/**
 * Setel ulang kata sandi anggota lain. Dikembalikan sekali dalam bentuk
 * polos supaya dapat disampaikan; sesudah itu tak terbaca lagi.
 *
 * Versi koleksi `users` ikut dimajukan di sini, sebab server menulisnya
 * langsung. Tanpa itu, penyimpanan berikutnya dari peramban ini akan
 * berdiri di atas versi usang dan ditolak 409.
 */
async function setelSandi(idAnggota) {
  const d = await panggil('setel-sandi.php', {
    method: 'POST', body: JSON.stringify({ id: idAnggota }),
  });
  if (d.versi) Object.assign(versiKoleksi, d.versi);
  await muat();
  const u = userAktif();
  if (u) { catat(u, 'sandi.setel', idAnggota, `${u.nama} menyetel ulang kata sandi ${d.nama}`); simpan(); }
  return d;
}

async function gantiSandi(lama, baru) {
  const d = await panggil('sandi.php', { method: 'POST', body: JSON.stringify({ lama, baru }) });
  if (d.versi) Object.assign(versiKoleksi, d.versi);
  wajibGantiSandi = false;
  const u = userAktif();
  if (u) { catat(u, 'sandi.ganti', u.id, `${u.nama} mengganti kata sandi`); simpan(); }
  return true;
}

/* ---------- pemasangan pertama ----------
   Data awalnya dikirim dari seed.js, bukan disalin ke PHP: dengan begitu
   tidak ada dua salinan data contoh yang bisa menyimpang diam-diam.
   Server menolak bila database sudah berisi. */
let belumTerpasang = false;
function perluPasang() { return belumTerpasang; }

async function pasang() {
  const awal = dbAwal();
  const d = await panggil('pasang.php', { method: 'POST', body: JSON.stringify({ isi: awal }) });
  belumTerpasang = false;
  await muat();
  return d.sandiAwal || [];           // dikembalikan sekali, untuk dibagikan
}

async function kosongkanSemua(penegasan) {
  await panggil('kosongkan.php', { method: 'POST', body: JSON.stringify({ penegasan }) });
  penggunaSesi = null;
  belumTerpasang = true;
  db = {}; bayangan = {}; versiKoleksi = {};
  beritahu();
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
/** Alamat artikel dari judulnya: huruf kecil, tanpa tanda, unik. Judul
    yang seluruhnya non-Latin jatuh ke id-nya. */
function slugArtikel(judul, id) {
  const dasar = String(judul || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/['’`]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || `artikel-${id}`;
  let slug = dasar;
  for (let n = 2; db.artikel.some((x) => x.id !== id && x.slug === slug); n += 1) slug = `${dasar}-${n}`;
  return slug;
}

function simpanArtikel(user, data) {
  RBAC.assertCan(user, 'artikel.write');
  if (!String(data.judul ?? 'x').trim()) throw new Error('Judul artikel wajib diisi.');
  /* Status, riwayat, dan tanggal terbit tidak diubah lewat penyuntingan. */
  const { status: _s, riwayat: _r, terbitPertama: _t, slug: _g, ...isi } = data;
  let simpul;
  if (isi.id) {
    const a = db.artikel.find((x) => x.id === isi.id);
    if (!a) throw new Error('Artikel tidak ditemukan.');
    const pemilik = a.penulisId === user.id;
    if (!pemilik && !RBAC.can(user, 'artikel.review'))
      throw new Error('Anda hanya dapat menyunting artikel tulisan sendiri.');
    if (a.status === 'terbit' && !RBAC.can(user, 'artikel.publish'))
      throw new Error('Artikel sudah terbit. Minta PJ Artikel untuk menariknya kembali ke draft.');
    if (a.status === 'review' && !RBAC.can(user, 'artikel.review'))
      throw new Error('Naskah sedang ditinjau. Tarik kembali ke draf untuk mengubahnya.');
    Object.assign(a, isi);
    /* Alamat artikel yang pernah terbit tidak ikut berganti bersama
       judulnya — tautan yang sudah dibagikan harus tetap hidup. */
    if (!a.terbitPertama && isi.judul !== undefined) a.slug = slugArtikel(a.judul, a.id);
    simpul = a;
    catat(user, 'artikel.ubah', a.id, `Menyunting artikel "${a.judul}"`);
  } else {
    const id = uid('a');
    const baru = {
      id, status: 'draft', penulisId: user.id, dilihat: 0,
      tanggal: hariIni(), reviewNote: '', reviewerId: '',
      cover: window.__ph('ARTIKEL BARU', '#1B5E20', '#0E2E1C', 'مقال'),
      tag: [], isi: [], riwayat: [], ...isi, slug: slugArtikel(isi.judul, id),
    };
    db.artikel.unshift(baru);
    simpul = baru;
    catat(user, 'artikel.buat', baru.id, `Membuat artikel "${baru.judul}"`);
  }
  simpan();
  return simpul;
}

/* --- alur naskah ---
   draf → ditinjau → terbit, dengan dua jalan pulang: dikembalikan untuk
   revisi, atau ditarik. Hanya perpindahan di bawah ini yang sah; yang
   sama ditegakkan susunArtikel() di server, yang juga menulis riwayatnya. */
const ALUR_ARTIKEL = {
  draft : ['review'],
  revisi: ['review'],
  review: ['revisi', 'terbit', 'draft'],
  terbit: ['draft'],
};
const NAMA_STATUS_ARTIKEL = { draft: 'draf', review: 'ditinjau', revisi: 'perlu revisi', terbit: 'terbit' };

/** Bolehkah pengguna ini memindahkan naskah `a` ke `status`? Melempar
    galat berbahasa manusia bila tidak. */
function periksaPindahArtikel(user, a, status, catatan) {
  if (!(ALUR_ARTIKEL[a.status] || []).includes(status))
    throw new Error(`Naskah yang ${NAMA_STATUS_ARTIKEL[a.status] || a.status} tidak dapat langsung menjadi ${NAMA_STATUS_ARTIKEL[status] || status}.`);
  const pemilik = a.penulisId === user.id;
  if (status === 'review') {
    if (!pemilik && !RBAC.can(user, 'artikel.review'))
      throw new Error('Hanya penulis yang dapat mengirim artikelnya untuk ditinjau.');
    if (!(a.isi || []).length) throw new Error('Isi artikel masih kosong.');
    if (!String(a.ringkas || '').trim()) throw new Error('Ringkasan artikel belum diisi.');
    if (!String(a.kategori || '').trim()) throw new Error('Kategori artikel belum dipilih.');
  } else if (status === 'terbit') {
    RBAC.assertCan(user, 'artikel.publish');
    /* Tak seorang pun menerbitkan tulisannya sendiri — kecuali Ketua Umum,
       yang di atasnya memang tak ada peninjau lagi. */
    if (pemilik && !RBAC.can(user, 'user.manage'))
      throw new Error('Tulisan Anda sendiri diterbitkan oleh Ketua Umum.');
  } else if (status === 'revisi') {
    RBAC.assertCan(user, 'artikel.review');
    if (!String(catatan || '').trim()) throw new Error('Catatan revisi wajib diisi.');
  } else if (status === 'draft') {
    if (a.status === 'terbit') {
      RBAC.assertCan(user, 'artikel.publish');
      if (!String(catatan || '').trim()) throw new Error('Alasan menarik artikel wajib diisi.');
    } else if (!pemilik) RBAC.assertCan(user, 'artikel.review');
  }
}
/** Perpindahan yang terbuka bagi pengguna ini — untuk menyusun tombol. */
const pindahArtikel = (user, a) => (ALUR_ARTIKEL[a.status] || []).filter((st) => {
  try { periksaPindahArtikel(user, a, st, 'x'); return true; } catch (_) { return false; }
});

function ubahStatusArtikel(user, id, status, catatan) {
  const a = db.artikel.find((x) => x.id === id);
  if (!a) throw new Error('Artikel tidak ditemukan.');
  periksaPindahArtikel(user, a, status, catatan);
  const dari = a.status;
  const teks = String(catatan || '').trim();

  a.status = status;
  /* Catatan peninjau yang tampil ke penulis: berlaku selama naskahnya
     perlu revisi, dan tetap terbaca sampai naskah itu terbit. */
  if (status === 'revisi') a.reviewNote = teks;
  if (status === 'terbit') a.reviewNote = '';
  if (['terbit', 'revisi'].includes(status)) a.reviewerId = user.id;
  if (status === 'terbit' && !a.terbitPertama) {
    /* Tanggal artikel adalah tanggal terbit PERTAMA-nya: menarik lalu
       menerbitkan ulang tidak membuatnya tampak baru. */
    a.tanggal = hariIni();
    a.terbitPertama = new Date().toISOString();
  }
  /* Cermin riwayat untuk layar ini; yang tersimpan ditulis server. */
  a.riwayat = [...(a.riwayat || []), { dari, ke: status, oleh: user.id, pada: new Date().toISOString(), catatan: teks }];
  /* Alasan menarik dititipkan ke server lewat `_catatan`; pada perpindahan
     lain titipan lama dibuang supaya tidak terbawa. */
  if (dari === 'terbit') a._catatan = teks; else delete a._catatan;

  catat(user, 'artikel.status', id, `Artikel "${a.judul}": ${NAMA_STATUS_ARTIKEL[dari]} → ${NAMA_STATUS_ARTIKEL[status]}${teks ? ` — ${teks}` : ''}`);
  simpan();
}

function hapusArtikel(user, id) {
  const a = db.artikel.find((x) => x.id === id);
  if (!a) return;
  if (a.penulisId !== user.id) RBAC.assertCan(user, 'artikel.review');
  if (a.status === 'terbit') throw new Error(`"${a.judul}" sudah terbit — tarik dulu ke draf, baru hapus.`);
  if (a.status === 'review' && !RBAC.can(user, 'artikel.review'))
    throw new Error('Naskah sedang ditinjau. Tarik kembali ke draf untuk menghapusnya.');
  db.artikel = db.artikel.filter((x) => x.id !== id);
  catat(user, 'artikel.hapus', id, `Menghapus artikel "${a.judul}"`);
  simpan();
}

/* ============================================================
   KAJIAN / ANGGOTA / KEUANGAN / PESAN
   ============================================================ */
/* --- keadaan kajian ---
   Yang disimpan hanya tiga: terjadwal, ditunda, dibatalkan. "Selesai",
   "siap", dan sejenisnya diturunkan dari tanggal dan kelengkapannya di
   lapisan tampilan — nilai lama 'selesai' karena itu dibaca terjadwal. */
const keadaanKajian = (k) => (k?.status === 'ditunda' || k?.status === 'dibatalkan' ? k.status : 'terjadwal');
const kajianJalan = (k) => keadaanKajian(k) === 'terjadwal';
/** Sudah memuat catatan yang tak boleh hilang: presensi atau notulen. */
const kajianBerisi = (k) => (k?.presensi || []).length > 0 || !!String(k?.notulensi || '').trim();

/** Peserta kajian: anggota aktif yang masih berjenjang. Alumni dan
    pendiri tetap anggota, tetapi tidak dituntut hadir. */
const berkajian = (u) => u.status === 'aktif' && !!u.angkatan && !['Alumni', '-', ''].includes(u.level || '');
/** Angkatan yang masih berkajian: punya setidaknya satu peserta. */
const angkatanPeserta = () => [...new Set(db.users.filter(berkajian).map((u) => u.angkatan))];
/** Peserta sebuah angkatan saat ini. */
const pesertaAngkatan = (angkatan) => db.users.filter((u) => berkajian(u) && u.angkatan === angkatan);

/* --- peserta & kehadiran: satu rumus untuk seluruh halaman ---
   Peserta sebuah kajian DIBEKUKAN begitu presensi pertamanya dicatat.
   Sebelum itu ia mengikuti keanggotaan angkatan yang berlaku; sesudahnya
   tidak — supaya anggota yang kelak nonaktif atau pindah angkatan tak
   mengubah angka kehadiran kajian yang sudah lewat. */
const idPesertaKajian = (k) => (Array.isArray(k?.peserta) ? k.peserta
  : [...new Set([...pesertaAngkatan(k?.angkatan).map((u) => u.id), ...(k?.presensi || []).map((p) => p.userId)])]);
const pesertaKajian = (k) => idPesertaKajian(k).map((id) => getUser(id)).filter(Boolean);
function bekukanPeserta(k) {
  if (Array.isArray(k.peserta)) return false;
  k.peserta = idPesertaKajian(k);
  return true;
}

/** Rekap kehadiran satu kajian. Persen = (hadir + terlambat) / peserta. */
function rekapKajian(k) {
  const id = new Set(idPesertaKajian(k));
  const p = (k.presensi || []).filter((x) => id.has(x.userId));
  const jml = (st) => p.filter((x) => x.status === st).length;
  const hadir = jml('hadir'), terlambat = jml('terlambat'), tidakHadir = jml('tidak-hadir');
  const total = id.size;
  return { hadir, terlambat, tidakHadir, izin: jml('izin') + jml('sakit'), total, datang: hadir + terlambat,
    belum: Math.max(0, total - p.length),
    persen: total ? Math.round(((hadir + terlambat) / total) * 100) : 0 };
}

/** Kehadiran seorang anggota pada sederet kajian. Yang dihitung hanya
    kajian yang ia memang pesertanya dan presensinya sudah dicatat. */
function kehadiranAnggota(userId, daftar) {
  const wajib = daftar.filter((k) => (k.presensi || []).length && idPesertaKajian(k).includes(userId));
  const st = (k) => k.presensi.find((p) => p.userId === userId)?.status;
  const jml = (x) => wajib.filter((k) => st(k) === x).length;
  const hadir = jml('hadir'), terlambat = jml('terlambat'), tidakHadir = jml('tidak-hadir');
  return { wajib: wajib.length, hadir, terlambat, tidakHadir, izin: jml('izin') + jml('sakit'), datang: hadir + terlambat,
    persen: wajib.length ? Math.round(((hadir + terlambat) / wajib.length) * 100) : 0 };
}

/** Migrasi: kajian lama yang sudah berpresensi dibekukan pesertanya. */
function bekukanPesertaLama(tersimpan) {
  (tersimpan.kajian || []).forEach((k) => { if ((k.presensi || []).length) bekukanPeserta(k); });
}

const PERAN_KAJIAN = { pemakalahId: 'Pemakalah', moderatorId: 'Moderator', notulenId: 'Notulen' };
const tglKajian = (t) => new Date(`${t}T00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

/** Kajian lain yang masih berjalan pada angkatan dan tanggal yang sama. */
function bentrokKajian(k) {
  return db.kajian.find((x) => x.id !== k.id && kajianJalan(x)
    && x.angkatan === k.angkatan && x.tanggal === k.tanggal);
}

/** Aturan sebuah kajian. `lama` kajian sebelum diubah (null bila baru):
    yang sudah tersimpan tidak digugat ulang, hanya yang berubah — supaya
    kajian lama yang pemakalahnya dari angkatan lain tetap dapat dicentang
    PPT-nya tanpa dipaksa mengganti orangnya. */
function periksaKajian(k, lama) {
  const berubah = (kunci) => !lama || lama[kunci] !== k[kunci];
  if (!String(k.judul || '').trim()) throw new Error('Judul kajian wajib diisi.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(k.tanggal || '')) throw new Error('Tanggal kajian wajib diisi.');
  if (!/^\d{2}:\d{2}$/.test(k.jam || '')) throw new Error('Jam mulai wajib diisi.');
  if (!k.angkatan) throw new Error('Angkatan wajib dipilih.');
  if (berubah('angkatan') && !pesertaAngkatan(k.angkatan).length)
    throw new Error(`${k.angkatan} tidak punya anggota aktif.`);

  if (lama && berubah('tanggal') && (lama.presensi || []).length)
    throw new Error('Kajian ini sudah berpresensi — tanggalnya tidak dapat diubah.');
  if (lama && berubah('angkatan') && (lama.presensi || []).length)
    throw new Error('Kajian ini sudah berpresensi — angkatannya tidak dapat diubah.');

  Object.keys(PERAN_KAJIAN).forEach((kunci) => {
    if (!k[kunci] || !(berubah(kunci) || berubah('angkatan'))) return;
    const u = db.users.find((x) => x.id === k[kunci]);
    if (!u) throw new Error(`${PERAN_KAJIAN[kunci]} tidak ditemukan.`);
    if (u.status !== 'aktif') throw new Error(`${u.nama} tidak berstatus aktif.`);
    if (u.angkatan !== k.angkatan)
      throw new Error(`${PERAN_KAJIAN[kunci]} harus dari ${k.angkatan} — ${u.nama} tercatat di ${u.angkatan || 'angkatan lain'}.`);
  });
  if (Object.keys(PERAN_KAJIAN).some(berubah)) {
    const terisi = Object.keys(PERAN_KAJIAN).filter((kunci) => k[kunci]);
    terisi.forEach((a, i) => terisi.slice(i + 1).forEach((b) => {
      if (k[a] === k[b]) throw new Error(`${namaUser(k[a])} tidak dapat menjadi ${PERAN_KAJIAN[a]} sekaligus ${PERAN_KAJIAN[b]}.`);
    }));
  }

  if (kajianJalan(k) && (berubah('tanggal') || berubah('angkatan'))) {
    const lain = bentrokKajian(k);
    if (lain) throw new Error(`${k.angkatan} sudah punya kajian pada ${tglKajian(k.tanggal)}: "${lain.judul}".`);
  }
}

function simpanKajian(user, data) {
  RBAC.assertCan(user, 'kajian.manage');
  /* Keadaan hanya berubah lewat tunda, batalkan, dan pulihkan — yang
     masing-masing menuntut alasan. */
  const { status: _tanpaStatus, ...isi } = data;
  if (isi.id) {
    const k = db.kajian.find((x) => x.id === isi.id);
    if (!k) throw new Error('Kajian tidak ditemukan.');
    periksaKajian({ ...k, ...isi }, k);
    Object.assign(k, isi);
    catat(user, 'kajian.ubah', k.id, `Mengubah jadwal "${k.judul}"`);
  } else {
    const baru = { id: uid('k'), status: 'terjadwal', presensi: [], notulensi: '',
      notulenId: '', pemakalahId: '', moderatorId: '', ppt: false, revisi: false, ...isi };
    periksaKajian(baru, null);
    db.kajian.push(baru);
    catat(user, 'kajian.buat', baru.id, `Menjadwalkan kajian "${baru.judul}"`);
  }
  simpan();
}

/* --- giliran tugas ---
   Berapa kali tiap peserta sudah (dan akan) memegang tiap tugas pada
   sederet kajian. Dasar saran di formulir jadwal dan tabel Giliran Tugas. */
function bebanTugas(angkatan, daftar) {
  const kini = hariIni();
  return pesertaAngkatan(angkatan).map((u) => {
    const b = { u, pemakalahId: 0, moderatorId: 0, notulenId: 0, total: 0, berikut: null, terakhir: '' };
    daftar.filter(kajianJalan).forEach((k) => Object.keys(PERAN_KAJIAN).forEach((kunci) => {
      if (k[kunci] !== u.id) return;
      b[kunci] += 1; b.total += 1;
      if (k.tanggal >= kini) { if (!b.berikut || k.tanggal < b.berikut.k.tanggal) b.berikut = { k, peran: PERAN_KAJIAN[kunci] }; }
      else if (k.tanggal > b.terakhir) b.terakhir = k.tanggal;
    }));
    return b;
  });
}

/** Petugas sebuah kajian yang tak dapat bertugas: sudah izin/sakit atau
    mengajukannya, tidak lagi aktif, atau sudah bukan anggota angkatan itu. */
function petugasBerhalangan(k) {
  return Object.keys(PERAN_KAJIAN).filter((kunci) => k[kunci]).map((kunci) => {
    const u = getUser(k[kunci]);
    const p = (k.presensi || []).find((x) => x.userId === k[kunci]);
    const sebab = !u ? 'akunnya sudah tidak ada'
      : !berkajian(u) ? 'tidak lagi aktif berkajian'
      : u.angkatan !== k.angkatan ? `kini di ${u.angkatan}`
      : p && (p.status === 'izin' || p.status === 'sakit') ? p.status
      : (k.izin || []).some((z) => z.userId === u.id && z.status === 'menunggu') ? 'mengajukan izin' : '';
    return sebab ? { kunci, peran: PERAN_KAJIAN[kunci], user: u, sebab } : null;
  }).filter(Boolean);
}

/* --- materi & makalah ---
   Yang disimpan tautannya, bukan berkasnya. `ppt` dan `revisi` (boolean)
   tetap dipelihara karena kesiapan kajian membacanya. */
const STATUS_REVISI = ['belum', 'diperiksa', 'perlu-revisi', 'final'];
const statusRevisi = (k) => (STATUS_REVISI.includes(k?.revisiStatus) ? k.revisiStatus : k?.revisi ? 'final' : 'belum');
/** Tenggat makalah: yang ditetapkan, atau tiga hari sebelum kajiannya. */
function tenggatMakalah(k) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(k?.tenggatMakalah || '')) return k.tenggatMakalah;
  const t = new Date(`${k.tanggal}T00:00`); t.setDate(t.getDate() - 3);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}
const tautanSah = (t) => !t || (t.length <= 500 && /^https?:\/\/[^\s<>"']+$/i.test(t));

function simpanMateri(user, id, data) {
  RBAC.assertCan(user, 'kajian.materi');
  const k = ambilKajian(id);
  const bersih = {};
  ['tautanMakalah', 'tautanPpt'].forEach((kunci) => {
    if (data[kunci] === undefined) return;
    const t = String(data[kunci] || '').trim();
    if (!tautanSah(t)) throw new Error('Tautan harus alamat lengkap yang diawali http:// atau https://');
    bersih[kunci] = t;
  });
  if (data.tenggatMakalah !== undefined) {
    if (data.tenggatMakalah && data.tenggatMakalah > k.tanggal) throw new Error('Tenggat makalah tidak boleh sesudah tanggal kajian.');
    bersih.tenggatMakalah = data.tenggatMakalah || '';
  }
  if (data.revisiStatus !== undefined) {
    if (!STATUS_REVISI.includes(data.revisiStatus)) throw new Error('Status revisi tidak dikenal.');
    if (data.revisiStatus === 'perlu-revisi' && !String(data.revisiCatatan || '').trim())
      throw new Error('Tuliskan apa yang perlu direvisi.');
    if (data.revisiStatus !== statusRevisi(k) || (data.revisiCatatan ?? '') !== (k.revisiCatatan || '')) {
      bersih.revisiStatus = data.revisiStatus;
      bersih.revisiCatatan = String(data.revisiCatatan || '').trim();
      bersih.revisiOleh = user.id;
      bersih.revisiPada = new Date().toISOString();
    }
    bersih.revisi = data.revisiStatus === 'final';
  }
  if (data.materi !== undefined) bersih.materi = data.materi;
  if (data.ppt !== undefined || bersih.tautanPpt !== undefined)
    bersih.ppt = !!(data.ppt || (bersih.tautanPpt ?? k.tautanPpt));
  Object.assign(k, bersih);
  if (bersih.revisiStatus === 'final') drafDariMakalah(user, k);
  catat(user, 'kajian.materi', id, `Memperbarui materi "${k.judul}"${bersih.revisiStatus ? ` — revisi: ${bersih.revisiStatus}` : ''}`);
  simpan();
}

/** Makalah yang dinyatakan final menjadi DRAF artikel atas nama
    pemakalahnya — sekali saja per kajian. Ia tetap draf: pemakalah yang
    menyalin isinya dan mengirimnya, lalu PJ Artikel meninjau seperti
    naskah lain. Penanda disimpan di kajian (`artikelId`), sebab koordinator
    tidak menerima draf orang lain untuk diperiksa keberadaannya. */
function drafDariMakalah(user, k) {
  if (k.artikelId || !k.pemakalahId || !getUser(k.pemakalahId)) return null;
  if (!RBAC.canAny(user, ['artikel.assign', 'artikel.review'])) return null;
  const id = uid('a');
  const baru = {
    id, status: 'draft', penulisId: k.pemakalahId, dilihat: 0, tanggal: hariIni(),
    reviewNote: '', reviewerId: '', tag: [], isi: [], riwayat: [], kategori: '',
    cover: window.__ph('ARTIKEL BARU', '#1B5E20', '#0E2E1C', 'مقال'),
    judul: k.judul, ringkas: '', slug: slugArtikel(k.judul, id),
    kajianId: k.id, tautanMakalah: k.tautanMakalah || '',
  };
  db.artikel.unshift(baru);
  k.artikelId = id;
  catat(user, 'artikel.buat', id, `Makalah final "${k.judul}" dijadikan draf artikel ${namaUser(k.pemakalahId)}`);
  return baru;
}

/** Pemakalah menyerahkan tautan makalah dan PPT-nya sendiri. */
async function kirimMakalah(idKajian, { tautanMakalah, tautanPpt }) {
  [tautanMakalah, tautanPpt].forEach((t) => {
    if (!tautanSah(String(t || '').trim())) throw new Error('Tautan harus alamat lengkap yang diawali http:// atau https://');
  });
  await aksiPetugas('materi', { idKajian, tautanMakalah, tautanPpt });
}

const ambilKajian = (id) => {
  const k = db.kajian.find((x) => x.id === id);
  if (!k) throw new Error('Kajian tidak ditemukan.');
  return k;
};
const jejakKajian = (user, k, jenis, rinci) => {
  k.riwayat = k.riwayat || [];
  k.riwayat.push({ jenis, ...rinci, oleh: user.id, pada: new Date().toISOString() });
};

/** Tunda kajian. Dengan tanggal baru ia langsung terjadwal ulang; tanpa
    tanggal ia berstatus ditunda sampai dijadwalkan lagi. Kajian yang
    sudah berpresensi telah terlaksana, jadi tak dapat ditunda. */
function tundaKajian(user, id, { alasan, tanggal, jam } = {}) {
  RBAC.assertCan(user, 'kajian.manage');
  const k = ambilKajian(id);
  if ((k.presensi || []).length) throw new Error('Kajian ini sudah berpresensi — tidak dapat ditunda.');
  alasan = String(alasan || '').trim();
  if (!alasan) throw new Error('Alasan penundaan wajib diisi.');
  const dari = k.tanggal;
  if (tanggal) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) throw new Error('Tanggal baru tidak sah.');
    if (tanggal < hariIni()) throw new Error('Tanggal baru tidak boleh sudah lewat.');
    if (tanggal === dari && kajianJalan(k)) throw new Error('Tanggal baru sama dengan tanggal semula.');
    const calon = { ...k, tanggal, jam: jam || k.jam, status: 'terjadwal' };
    const lain = bentrokKajian(calon);
    if (lain) throw new Error(`${k.angkatan} sudah punya kajian pada ${tglKajian(tanggal)}: "${lain.judul}".`);
    Object.assign(k, { tanggal, jam: calon.jam, status: 'terjadwal' });
    jejakKajian(user, k, 'tunda', { dari, ke: tanggal, alasan });
    catat(user, 'kajian.tunda', id, `Menunda "${k.judul}" dari ${tglKajian(dari)} ke ${tglKajian(tanggal)} — ${alasan}`);
  } else {
    if (keadaanKajian(k) === 'ditunda') throw new Error('Kajian ini sudah ditunda. Isi tanggal baru untuk menjadwalkannya ulang.');
    k.status = 'ditunda';
    jejakKajian(user, k, 'tunda', { dari, ke: '', alasan });
    catat(user, 'kajian.tunda', id, `Menunda "${k.judul}" (${tglKajian(dari)}) tanpa tanggal pengganti — ${alasan}`);
  }
  simpan();
}

/** Batalkan kajian. Barisnya tetap ada beserta alasannya; ia hanya tak
    lagi dihitung dalam kehadiran, rekap, dan antrean. */
function batalkanKajian(user, id, alasan) {
  RBAC.assertCan(user, 'kajian.manage');
  const k = ambilKajian(id);
  if (keadaanKajian(k) === 'dibatalkan') throw new Error('Kajian ini sudah dibatalkan.');
  alasan = String(alasan || '').trim();
  if (!alasan) throw new Error('Alasan pembatalan wajib diisi.');
  k.statusSebelumBatal = keadaanKajian(k);
  k.status = 'dibatalkan';
  jejakKajian(user, k, 'batal', { alasan });
  catat(user, 'kajian.batal', id, `Membatalkan "${k.judul}" (${tglKajian(k.tanggal)}) — ${alasan}`);
  simpan();
}

function pulihkanKajian(user, id) {
  RBAC.assertCan(user, 'kajian.manage');
  const k = ambilKajian(id);
  if (keadaanKajian(k) !== 'dibatalkan') throw new Error('Hanya kajian yang dibatalkan yang dapat dipulihkan.');
  const kembali = k.statusSebelumBatal === 'ditunda' ? 'ditunda' : 'terjadwal';
  if (kembali === 'terjadwal') {
    const lain = bentrokKajian({ ...k, status: 'terjadwal' });
    if (lain) throw new Error(`${k.angkatan} sudah punya kajian pada ${tglKajian(k.tanggal)}: "${lain.judul}".`);
  }
  k.status = kembali;
  delete k.statusSebelumBatal;
  jejakKajian(user, k, 'pulih', {});
  catat(user, 'kajian.pulih', id, `Memulihkan "${k.judul}"`);
  simpan();
}

const STATUS_PRESENSI = ['hadir', 'terlambat', 'izin', 'sakit', 'tidak-hadir'];
/** Izin + sakit yang boleh dipakai seorang anggota dalam satu jenjang.
    Angka yang berlaku ditegakkan api/presensi.php; ini cerminnya untuk layar. */
const JATAH_IZIN = 2;

/** Isi QR pada kartu anggota: nomor induknya. Sengaja bukan nama atau
    surel — kartu dicetak dan dibawa-bawa, jadi yang tercecer tak boleh
    membocorkan apa pun. Anggota yang belum bernomor memakai kode lama. */
const kodeQr = (userId) => getUser(userId)?.nia || 'AIJZ-' + userId;

/** Anggota pemilik sebuah kode hasil pindai atau ketikan. Menerima nomor
    induk maupun kode lama "AIJZ-…", agar kartu yang sudah beredar tetap
    terbaca. */
function anggotaDariKode(kode) {
  const k = String(kode || '').trim().toUpperCase();
  if (!k) return null;
  return db.users.find((u) => String(u.nia || '').toUpperCase() === k)
    || db.users.find((u) => `AIJZ-${u.id}`.toUpperCase() === k || String(u.id).toUpperCase() === k)
    || null;
}

/** Tanggal hari ini menurut jam setempat — bukan UTC. Presensi diputuskan
    di pintu kajian, dan menjelang tengah malam keduanya berbeda hari. */
function hariIni() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* --- presensi: seluruh perubahannya lewat api/presensi.php ---
   Tiap catatan adalah satu perubahan kecil pada satu kajian, bukan kiriman
   seluruh koleksi — sehingga beberapa ponsel dapat memindai bersamaan tanpa
   saling menolak. Server mengembalikan baris kajiannya yang terbaru (sudah
   memuat catatan pemindai lain); baris itu menggantikan yang di memori. */
const aksiPresensi = (aksi, data) => aksiKajian('presensi.php', aksi, data);
/** Tulisan petugas (pemakalah, notulen) atas kajiannya sendiri. */
const aksiPetugas = (aksi, data) => aksiKajian('petugas-kajian.php', aksi, data);

async function aksiKajian(jalur, aksi, data) {
  /* Suntingan jadwal yang belum terkirim didahulukan, supaya baris yang
     kembali dari server tidak menimpanya. */
  if (koleksiKotor().kajian !== undefined) await kirimPerubahan();
  const d = await panggil(jalur, { method: 'POST',
    body: JSON.stringify({ aksi, versi: versiKoleksi.kajian ?? 0, ...data }) });
  /* Isi baris diganti DI TEMPAT: layar yang sedang memegang objek kajian
     ini langsung melihat keadaan terbarunya. */
  const timpa = (k, baru) => { Object.keys(k).forEach((kunci) => delete k[kunci]); Object.assign(k, baru); };
  if (Array.isArray(d.semua)) {
    /* Peramban ini tertinggal dari ponsel lain: server mengirim seluruh
       koleksi, dan semuanya disegarkan sekaligus. */
    const lama = new Map(db.kajian.map((k) => [k.id, k]));
    db.kajian = d.semua.map((baru) => {
      const k = lama.get(baru.id);
      if (!k) return baru;
      timpa(k, baru);
      return k;
    });
  } else {
    const k = db.kajian.find((x) => x.id === d.kajian?.id);
    if (k) timpa(k, d.kajian);
  }
  if (d.versi?.kajian) versiKoleksi.kajian = d.versi.kajian;
  bayangan.kajian = JSON.stringify(db.kajian);
  beritahu();
  return d;
}

const jamKini = () => new Date().toTimeString().slice(0, 5);

/** Catat kehadiran satu orang. `opsi.alasan` wajib untuk izin dan sakit;
    `opsi.alasanUbah` wajib bila presensinya sudah ditutup. Status 'kosong'
    menghapus catatannya. */
async function setPresensi(user, idKajian, userId, status, opsi = {}) {
  RBAC.assertCan(user, 'kajian.attendance');
  if (status !== 'kosong' && !STATUS_PRESENSI.includes(status)) throw new Error('Status presensi tidak dikenal.');
  const d = await aksiPresensi('catat', { idKajian, userId, status, timpa: true,
    jam: opsi.jam !== undefined ? opsi.jam : jamKini(), alasan: opsi.alasan || '', alasanUbah: opsi.alasanUbah || '' });
  return d.entri || null;
}

/** Batas terlambat sebuah kajian, dalam menit sesudah jam mulainya.
    Ditentukan koordinator saat menjadwalkan; bawaannya 10 menit. */
const toleransiKajian = (k) => {
  const n = Number(k?.toleransi);
  return Number.isFinite(n) && n >= 0 && k.toleransi !== '' && k.toleransi != null ? n : 10;
};

/** Catat presensi dari kode hasil pindai. Hadir atau terlambat ditentukan
    jam sesungguhnya terhadap jam mulai dan batas terlambat kajiannya —
    bukan ditebak petugas.

    Yang terlambat TETAP boleh masuk; ia hanya tercatat terlambat. Yang
    sudah tercatat hadir tidak ditimpa bila kartunya terpindai lagi, agar
    jam datangnya yang pertama tidak bergeser. */
async function presensiDariKode(user, idKajian, kode) {
  RBAC.assertCan(user, 'kajian.attendance');
  const k = db.kajian.find((x) => x.id === idKajian);
  if (!k) throw new Error('Kajian tidak ditemukan.');
  const u = anggotaDariKode(kode);
  if (!u) throw new Error(`Kode "${kode}" tidak dikenali sebagai anggota.`);
  if (k.angkatan && u.angkatan !== k.angkatan)
    throw new Error(`${u.nama} bukan peserta ${k.angkatan}.`);
  if (u.status !== 'aktif') throw new Error(`${u.nama} tidak berstatus aktif.`);
  if (k.presensiTutup) throw new Error('Presensi kajian ini sudah ditutup.');

  const tanggal = hariIni();
  if (tanggal < k.tanggal)
    throw new Error(`Kajian ini dijadwalkan ${tglKajian(k.tanggal)}. Presensi dibuka pada harinya.`);

  const sekarang = jamKini();
  const menit = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  /* Dipindai sesudah harinya lewat selalu terlambat, pukul berapa pun. */
  const telat = tanggal > k.tanggal || menit(sekarang) > menit(k.jam || '00:00') + toleransiKajian(k);
  const status = telat ? 'terlambat' : 'hadir';
  /* Tanpa `timpa`: server tidak menggeser catatan hadir yang sudah ada,
     dari ponsel mana pun catatan itu berasal. */
  const d = await aksiPresensi('catat', { idKajian, userId: u.id, status, jam: sekarang });
  return d.sudah ? { user: u, status: d.entri.status, jam: d.entri.jam, sudah: true }
    : { user: u, status, jam: sekarang, sudah: false };
}

/** Tutup presensi: setiap peserta yang belum tercatat ditulis tidak
    hadir, dan presensinya TERKUNCI. Sesudah itu hanya koordinator yang
    dapat mengubahnya, dengan alasan yang tercatat. */
async function tutupPresensi(user, idKajian) {
  RBAC.assertCan(user, 'kajian.attendance');
  return (await aksiPresensi('tutup', { idKajian })).absen || 0;
}
async function bukaPresensi(user, idKajian, alasan) {
  RBAC.assertCan(user, 'kajian.manage');
  await aksiPresensi('buka', { idKajian, alasan });
}

/* --- izin & sakit --- */
/** Kajian sejenjang dengan `k`: angkatan dan jenjang yang sama, masih berjalan. */
const sejenjang = (k) => db.kajian.filter((x) => kajianJalan(x) && x.angkatan === k.angkatan && x.level === k.level);
/** Jatah izin + sakit seorang anggota pada jenjang kajian `k`. Pengajuan
    yang masih menunggu ikut terhitung. */
function jatahIzin(userId, k) {
  const terpakai = sejenjang(k).filter((x) =>
    (x.presensi || []).some((p) => p.userId === userId && (p.status === 'izin' || p.status === 'sakit'))
    || (x.izin || []).some((z) => z.userId === userId && z.status === 'menunggu')).length;
  return { batas: JATAH_IZIN, terpakai, sisa: Math.max(0, JATAH_IZIN - terpakai) };
}
/** Pengajuan izin yang masih menunggu, beserta kajiannya. */
const izinMenunggu = (daftar = db.kajian) => daftar.flatMap((k) =>
  (k.izin || []).filter((z) => z.status === 'menunggu').map((z) => ({ k, z })));

async function ajukanIzin(idKajian, jenis, alasan) {
  await aksiPresensi('ajukan', { idKajian, jenis, alasan });
}
async function tarikIzin(idKajian, idIzin) {
  await aksiPresensi('tarik', { idKajian, idIzin });
}
async function putuskanIzin(user, idKajian, idIzin, setuju, catatan) {
  RBAC.assertCan(user, 'kajian.attendance');
  await aksiPresensi('putuskan', { idKajian, idIzin, setuju, catatan: catatan || '' });
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

/** Ubah jenjang atau kelompok banyak anggota sekaligus — satu simpan,
    satu catatan. Dipakai pembagian kelompok dan kenaikan jenjang. */
function simpanAnggotaMassal(user, daftar, keterangan) {
  RBAC.assertCan(user, 'anggota.kelompok');
  let n = 0;
  daftar.forEach((x) => {
    const u = db.users.find((y) => y.id === x.id);
    if (!u) return;
    ['level', 'kelompok'].forEach((k) => {
      if (x[k] !== undefined && (u[k] || '') !== x[k]) { u[k] = x[k]; n += 1; }
    });
  });
  if (!n) return 0;
  catat(user, 'anggota.kelompok', 'massal', keterangan || `Memperbarui jenjang/kelompok ${daftar.length} anggota`);
  simpan();
  return n;
}

/* --- notulen terstruktur ---
   Empat bagian tetap, dan tiga keadaan: draf → diajukan → sah. Teks
   polosnya (`notulensi`) tetap dipelihara, sebab halaman lain membacanya
   untuk tahu notulen sudah ditulis atau belum. Urutan dan judul bagian
   harus sama dengan BAGIAN_NOTULEN di api/petugas-kajian.php. */
const BAGIAN_NOTULEN = [['ringkasan', 'Ringkasan Pembahasan'], ['diskusi', 'Poin Diskusi'],
  ['kesimpulan', 'Kesimpulan'], ['tindakLanjut', 'Tindak Lanjut']];
const susunNotulensi = (n) => BAGIAN_NOTULEN.filter(([k]) => String(n?.[k] || '').trim())
  .map(([k, l]) => `${l}\n${String(n[k]).trim()}`).join('\n\n');
/** kosong | draf | diajukan | sah. Notulen lama (teks polos saja) dianggap sah. */
const statusNotulen = (k) => (k?.notulen?.status || (String(k?.notulensi || '').trim() ? 'sah' : 'kosong'));
/** Isi notulen sebagai empat bagian; notulen lama masuk ke ringkasan. */
const isiNotulen = (k) => (k?.notulen ? { ...k.notulen }
  : { ringkasan: k?.notulensi || '', diskusi: '', kesimpulan: '', tindakLanjut: '' });

/** Pengurus notulen menulis, mengesahkan, mengembalikan, atau membuka
    kembali. `aksi`: simpan | sahkan | kembalikan | buka. */
function simpanNotulen(user, idKajian, isi, aksi = 'simpan', catatan = '') {
  RBAC.assertCan(user, 'kajian.notulensi');
  const k = ambilKajian(idKajian);
  const kini = statusNotulen(k);
  const n = { ...isiNotulen(k) };
  if (aksi === 'buka') {
    if (kini !== 'sah') throw new Error('Hanya notulen yang sudah sah yang dapat dibuka kembali.');
    n.status = 'draf';
  } else {
    if (kini === 'sah') throw new Error('Notulen ini sudah disahkan. Buka kembali lebih dulu untuk mengubahnya.');
    BAGIAN_NOTULEN.forEach(([kunci]) => { if (isi?.[kunci] !== undefined) n[kunci] = String(isi[kunci] || '').trim(); });
    if (aksi === 'sahkan') {
      if (!n.ringkasan) throw new Error('Ringkasan pembahasan wajib diisi sebelum disahkan.');
      Object.assign(n, { status: 'sah', disahkanOleh: user.id, disahkanPada: new Date().toISOString(), catatan: '' });
    } else if (aksi === 'kembalikan') {
      if (!String(catatan).trim()) throw new Error('Tuliskan apa yang perlu diperbaiki.');
      Object.assign(n, { status: 'draf', catatan: String(catatan).trim() });
    } else {
      n.status = kini === 'diajukan' ? 'diajukan' : 'draf';
    }
  }
  if (!n.penulis) n.penulis = user.id;
  n.diubah = new Date().toISOString();
  k.notulen = n;
  k.notulensi = susunNotulensi(n);
  catat(user, 'kajian.notulensi', idKajian, `Notulen "${k.judul}": ${aksi}`);
  simpan();
}
/* Nama lama: teks polos masuk sebagai ringkasan. */
function setNotulensi(user, idKajian, teks) { simpanNotulen(user, idKajian, { ringkasan: teks }); }

/** Petugas notulen menulis notulennya sendiri; `ajukan` menyerahkannya
    untuk disahkan. */
async function kirimNotulen(idKajian, isi, ajukan) {
  await aksiPetugas('notulen', { idKajian, ...isi, ajukan: !!ajukan });
}

function hapusKajian(user, id) {
  RBAC.assertCan(user, 'kajian.manage');
  /* Presensi dan notulen adalah catatan yang sudah terjadi. Kajian yang
     memuatnya dibatalkan beserta alasannya, bukan dihapus. */
  const k = db.kajian.find((x) => x.id === id);
  if (k && kajianBerisi(k))
    throw new Error(`"${k.judul}" sudah memuat presensi atau notulen — batalkan, jangan dihapus.`);
  db.kajian = db.kajian.filter((x) => x.id !== id);
  catat(user, 'kajian.hapus', id, 'Menghapus jadwal kajian');
  simpan();
}

function simpanAnggota(user, data) {
  RBAC.assertCan(user, 'anggota.manage');
  /* Mengganti role butuh izin lebih tinggi. Anggota baru lahir sebagai
     'anggota', jadi menambah orang tanpa menyentuh rolenya tidak
     menuntut izin itu — dulu pembandingnya `undefined`, sehingga
     Sekretaris tak pernah bisa menambah anggota sama sekali. */
  const roleLama = data.id ? db.users.find((u) => u.id === data.id)?.role : 'anggota';
  if (data.role && data.role !== roleLama) RBAC.assertCan(user, 'user.manage');
  let hasil;
  if (data.id) {
    const u = db.users.find((x) => x.id === data.id);
    Object.assign(u, data);
    hasil = u;
    catat(user, 'anggota.ubah', u.id, `Memperbarui data ${u.nama}`);
  } else {
    /* Tanpa kata sandi: server membuatkannya sendiri, sekali, dan
       mengembalikannya untuk disampaikan kepada yang bersangkutan.
       Sandi bawaan yang sama untuk semua orang — dulu '123456' —
       sama saja dengan tidak punya kata sandi. */
    /* `data` memuat `id: undefined` — formulir mengirimkannya apa adanya
       untuk anggota baru. Disebar SESUDAH id bawaan, nilai undefined itu
       menimpa id yang baru dibuat, dan anggotanya lahir tanpa id.

       Akibatnya berantai dan senyap: masuk.php menyimpan userId null
       sehingga orangnya tak pernah bisa masuk dengan sandi apa pun, dan
       jagaRahasiaPengguna kehilangan jejaknya sehingga sandinya diacak
       ulang tiap kali data disimpan. Karena itu id dibuang dari data
       lebih dulu, bukan sekadar ditaruh belakangan. */
    const { id: _tanpaId, ...bersih } = data;
    const baru = {
      id: uid('u'), status: 'aktif', role: 'anggota',
      kategori: 'anggota', foto: window.__avatar(data.nama || 'Anggota', '#5B7C5F'),
      bergabung: hariIni(), ...bersih,
    };
    baru.nia = niaBerikut(db.users, baru.angkatan);
    db.users.push(baru);
    hasil = baru;
    catat(user, 'anggota.tambah', baru.id, `Menambah anggota ${baru.nama} (${baru.nia})`);
  }
  simpan();
  return hasil;
}

/** Hapus anggota beserta akun masuknya. Dua penjagaan, keduanya
    diperiksa ulang di api/inti.php: akun sendiri tak dapat dihapus —
    supaya tak ada yang mengunci dirinya di luar, dan Ketua Umum
    terakhir tak pernah hilang — dan akun pemegang wewenang tertinggi
    hanya dapat dihapus oleh sesamanya. */
function hapusAnggota(user, ids) {
  RBAC.assertCan(user, 'anggota.manage');
  const buang = new Set(ids);
  const sasaran = db.users.filter((u) => buang.has(u.id));
  if (!sasaran.length) return;
  if (buang.has(user.id)) throw new Error('Anda tidak dapat menghapus akun sendiri.');
  if (!RBAC.can(user, 'user.manage') && sasaran.some((u) => RBAC.can(u, 'user.manage')))
    throw new Error('Akun pemegang wewenang tertinggi hanya dapat dihapus oleh Ketua Umum.');
  db.users = db.users.filter((u) => !buang.has(u.id));
  /* Data dirinya ikut dibuang: paspor dan alamat orang yang sudah bukan
     anggota tak punya alasan untuk tetap disimpan. */
  db.dataDiri = (db.dataDiri || []).filter((x) => !buang.has(x.userId));
  sasaran.forEach((u) => catat(user, 'anggota.hapus', u.id, `Menghapus anggota ${u.nama}`));
  simpan();
}

/* --- data diri & pendaftaran ---
   Data diri disimpan terpisah dari `users`, satu baris per anggota.
   Server hanya mengirimkannya kepada pengelola keanggotaan; bagi yang
   lain koleksi ini berisi barisnya sendiri saja, atau kosong. */
/* Pas foto termasuk data diri: ia dipakai pada kartu anggota, bukan di
   website. Foto yang tampil di halaman Tentang tetap `users.foto`. */
const KOLOM_DIRI = ['paspor', 'alamat', 'telepon', 'tempatLahir', 'tglLahir', 'foto'];
const dataDiri = (userId) => (db.dataDiri || []).find((x) => x.userId === userId) || {};

function simpanDataDiri(user, userId, data) {
  if (!RBAC.canAny(user, ['anggota.manage', 'user.manage'])) RBAC.assertCan(user, 'anggota.manage');
  if (!getUser(userId)) throw new Error('Anggota tidak ditemukan.');
  db.dataDiri = db.dataDiri || [];
  let baris = db.dataDiri.find((x) => x.userId === userId);
  if (!baris) { baris = { userId }; db.dataDiri.push(baris); }
  KOLOM_DIRI.forEach((k) => {
    if (data[k] === undefined) return;
    baris[k] = k === 'paspor' ? String(data[k]).toUpperCase().replace(/[^A-Z0-9]/g, '') : String(data[k]).trim();
  });
  simpan();
}

/** Terima sebuah permohonan: jadikan anggota, pindahkan data dirinya,
    dan sisakan di antrean hanya catatan bahwa ia pernah mendaftar.
    Nomor paspor dan alamat tak boleh hidup di dua tempat. */
function terimaPendaftaran(user, id, { angkatan, level }) {
  RBAC.assertCan(user, 'anggota.manage');
  const p = (db.pendaftaran || []).find((x) => x.id === id);
  if (!p) throw new Error('Permohonan tidak ditemukan.');
  if (p.status !== 'menunggu') throw new Error('Permohonan ini sudah diproses.');
  if (!String(angkatan || '').trim()) throw new Error('Tentukan angkatannya lebih dulu.');
  if (db.users.some((u) => String(u.email || '').toLowerCase() === String(p.email).toLowerCase()))
    throw new Error(`Surel ${p.email} sudah dipakai anggota lain. Periksa apakah orangnya sudah terdaftar.`);

  const baru = simpanAnggota(user, {
    nama: p.nama, email: p.email, angkatan: String(angkatan).trim(), level: level || 'Tatsqif',
    pendidikan: p.pendidikan || '',
  });
  simpanDataDiri(user, baru.id, p);
  KOLOM_DIRI.concat(['catatan', 'sidik', 'pendidikan']).forEach((k) => { delete p[k]; });
  Object.assign(p, { status: 'diterima', userId: baru.id, diproses: nowISO(), oleh: user.id });
  catat(user, 'pendaftaran.terima', p.id, `Menerima pendaftaran ${p.nama} sebagai ${baru.nia}`);
  simpan();
  return baru;
}

function tolakPendaftaran(user, id, alasan) {
  RBAC.assertCan(user, 'anggota.manage');
  const p = (db.pendaftaran || []).find((x) => x.id === id);
  if (!p) throw new Error('Permohonan tidak ditemukan.');
  if (p.status !== 'menunggu') throw new Error('Permohonan ini sudah diproses.');
  /* Yang ditolak tak menjadi anggota, jadi data pribadinya dibuang saat itu juga. */
  KOLOM_DIRI.concat(['catatan', 'sidik', 'pendidikan', 'foto']).forEach((k) => { delete p[k]; });
  Object.assign(p, { status: 'ditolak', alasan: String(alasan || '').trim(), diproses: nowISO(), oleh: user.id });
  catat(user, 'pendaftaran.tolak', p.id, `Menolak pendaftaran ${p.nama}`);
  simpan();
}

function hapusPendaftaran(user, id) {
  RBAC.assertCan(user, 'anggota.manage');
  db.pendaftaran = (db.pendaftaran || []).filter((x) => x.id !== id);
  catat(user, 'pendaftaran.hapus', id, 'Menghapus catatan pendaftaran');
  simpan();
}

/** Anggota memasang pas foto kartunya sendiri. Lewat endpoint tersendiri,
    sebab `dataDiri` tak boleh ditulisnya — lihat api/foto-kartu.php.
    Salinan di peramban disesuaikan supaya kartunya langsung berubah. */
async function unggahFotoKartu(berkas) {
  const data = await kecilkanGambar(berkas, 480, 0.82);
  if (String(data).startsWith('data:image/svg')) throw new Error('Pas foto harus JPG, PNG, atau WebP.');
  const d = await panggil('foto-kartu.php', { method: 'POST', body: JSON.stringify({ data }) });
  const aku = userAktif();
  db.dataDiri = db.dataDiri || [];
  /* Bayangan hanya ikut digeser bila koleksinya sedang bersih; kalau ada
     perubahan lain yang belum terkirim, ia dibiarkan menyusul sendiri. */
  const bersih = JSON.stringify(db.dataDiri) === bayangan.dataDiri;
  let baris = db.dataDiri.find((x) => x.userId === aku.id);
  if (!baris) { baris = { userId: aku.id }; db.dataDiri.push(baris); }
  baris.foto = d.url;
  versiKoleksi.dataDiri = d.versi;
  if (bersih) bayangan.dataDiri = JSON.stringify(db.dataDiri);
  beritahu();
  return d.url;
}

/** Kirim permohonan dari halaman publik. Pas foto dikecilkan di sini. */
async function kirimPendaftaran(data, berkasFoto) {
  const foto = berkasFoto ? await kecilkanGambar(berkasFoto, 480, 0.82) : '';
  await panggil('daftar.php', { method: 'POST', body: JSON.stringify({ ...data, foto }) });
}

/** Pengguna menyunting akunnya sendiri. Sengaja terpisah dari
    simpanAnggota(): di sini tidak ada izin 'anggota.manage' yang
    dituntut, tetapi juga tidak ada jalan mengubah role, status,
    atau akun orang lain — dan api/inti.php memeriksa ulang hal itu,
    sebab yang dikirim peramban adalah seluruh koleksi `users`.

    Kata sandi TIDAK di sini. Ia satu-satunya kolom yang tak pernah
    turun ke peramban, jadi ia juga tidak boleh naik lewat jalur ini;
    tempatnya di gantiSandi(), yang bicara langsung ke api/sandi.php. */
function simpanProfil(user, data) {
  const u = db.users.find((x) => x.id === user?.id);
  if (!u) throw new Error('Sesi tidak dikenali. Masuk ulang untuk melanjutkan.');
  const email = String(data.email || '').trim().toLowerCase();
  if (!data.nama?.trim() || !email) throw new Error('Nama dan email wajib diisi.');
  if (db.users.some((x) => x.id !== u.id && x.email.toLowerCase() === email))
    throw new Error('Email itu sudah dipakai akun lain.');

  u.nama = data.nama.trim();
  u.email = data.email.trim();
  if (data.foto) u.foto = data.foto;
  catat(u, 'akun.ubah', u.id, `${u.nama} memperbarui data akunnya`);
  simpan();
  return u;
}

/* --- status transaksi ---
   sah      dihitung dalam saldo dan laporan (transaksi lama tanpa status
            dianggap sah)
   menunggu pengeluaran yang belum disetujui Ketua Umum — belum dihitung
   ditolak  pengeluaran yang ditolak — tidak dihitung
   batal    dibatalkan dengan alasan — tetap tampak, tidak dihitung */
const kasSahkah = (t) => !t.status || t.status === 'sah';
const kasSah = () => db.keuangan.filter(kasSahkah);

/** Pengeluaran ini perlu disetujui Ketua? Batas nol berarti semua
    nominal perlu. Aturan yang sama ditegakkan server di jagaKas(). */
function perluSetuju(t) {
  if (t.jenis !== 'keluar') return false;
  const a = db.aturKas || {};
  const rp = Number(t.rp || 0), egp = Number(t.egp || 0);
  return (rp > 0 && rp >= Number(a.batasSetujuRp || 0)) || (egp > 0 && egp >= Number(a.batasSetujuEgp || 0));
}

const KOLOM_RIWAYAT = ['rp', 'egp', 'akunId', 'tanggal', 'kategori', 'sumber', 'ket', 'akunTujuanId', 'rpTujuan', 'egpTujuan'];
function catatRiwayat(user, t, baru) {
  const ubah = {};
  KOLOM_RIWAYAT.forEach((k) => {
    if (baru[k] === undefined) return;
    const a = t[k] ?? '', b = baru[k] ?? '';
    if (String(a) !== String(b)) ubah[k] = [a, b];
  });
  if (Object.keys(ubah).length) t.riwayat = (t.riwayat || []).concat({ ts: nowISO(), oleh: user.id, ubah });
  return ubah;
}
/* --- tutup buku ---
   Menutup buku sebuah bulan mengunci seluruh transaksinya: tak ada yang
   boleh masuk, berubah nilai, atau dibatalkan di sana. Saldo akhirnya
   dibekukan beserta hasil hitung uang yang benar-benar ada, sehingga
   selisih buku dan fisik tercatat pada saat ditutup — bukan dicari-cari
   kemudian. Membukanya kembali hak Ketua Umum. */
const penutupan = (bulan) => (db.tutupBuku || []).find((x) => x.bulan === bulan && !x.dibuka);
const bulanTertutup = (bulan) => !!penutupan(bulan);
function tolakBilaTertutup(...tanggal) {
  tanggal.filter(Boolean).forEach((t) => {
    const b = String(t).slice(0, 7);
    if (bulanTertutup(b)) throw new Error(`Buku bulan ${b} sudah ditutup. Minta Ketua Umum membukanya kembali bila perlu diubah.`);
  });
}
function tolakBilaTerkunci(t) {
  if (t.status === 'batal') throw new Error('Transaksi yang sudah dibatalkan tidak dapat diubah.');
  tolakBilaTertutup(t.tanggal);
}

function simpanTransaksi(user, data) {
  RBAC.assertCan(user, 'keuangan.manage');
  const rapi = { ...data, rp: Number(data.rp || 0), egp: Number(data.egp || 0) };
  if (!rapi.rp && !rapi.egp) throw new Error('Isi nominal rupiah atau pound, minimal salah satu.');
  if (rapi.rp < 0 || rapi.egp < 0) throw new Error('Nominal tidak boleh negatif.');

  /* Kategori ditautkan lewat id; namanya ikut disimpan. */
  const lama = rapi.id ? db.keuangan.find((x) => x.id === rapi.id) : null;
  const jenis = rapi.jenis || lama?.jenis;
  if (rapi.kategori !== undefined) {
    const k = db.kategoriKeuangan.find((x) => x.nama === rapi.kategori && x.jenis === jenis)
      || db.kategoriKeuangan.find((x) => x.nama === rapi.kategori);
    rapi.kategoriId = k ? k.id : '';
    if (!lama && k?.nonaktif) throw new Error(`Kategori "${k.nama}" sudah dinonaktifkan. Pilih kategori lain.`);
  }
  tolakBilaTertutup(rapi.tanggal || lama?.tanggal);
  const akun = db.akunKas.find((a) => a.id === (rapi.akunId || lama?.akunId || 'ak1'));
  if (!akun) throw new Error('Akun tujuan tidak ditemukan. Pilih akun yang tersedia.');
  if (!lama && akun.nonaktif) throw new Error(`Akun "${akun.nama}" sudah dinonaktifkan. Pilih akun lain.`);

  if (rapi.id) {
    if (!lama) throw new Error('Transaksi tidak ditemukan.');
    tolakBilaTerkunci(lama);
    const naik = rapi.rp > Number(lama.rp || 0) || rapi.egp > Number(lama.egp || 0);
    const ubah = catatRiwayat(user, lama, rapi);
    Object.assign(lama, rapi);
    /* Pengeluaran yang nominalnya dinaikkan, atau yang tadinya ditolak
       lalu diperbaiki, kembali menunggu persetujuan. */
    if (lama.jenis === 'keluar' && perluSetuju(lama) && (lama.status === 'ditolak' || (kasSahkah(lama) && naik))) {
      lama.status = 'menunggu';
      delete lama.persetujuan;
    }
    catat(user, 'keuangan.ubah', lama.id, `Mengubah ${lama.nomor || 'transaksi'} "${lama.sumber || lama.kategori}"${
      Object.keys(ubah).length ? ` (${Object.keys(ubah).join(', ')})` : ''}`);
    simpan();
    return lama;
  }
  const baru = { id: uid('f'), oleh: user.id, akunId: 'ak1', arus: null, dibuat: nowISO(), ...rapi };
  baru.nomor = nomorBukti(db.keuangan, baru.jenis, baru.tanggal, db.aturKas);
  baru.status = perluSetuju(baru) ? 'menunggu' : 'sah';
  db.keuangan.unshift(baru);
  catat(user, 'keuangan.catat', baru.id,
    `${baru.jenis === 'masuk' ? 'Kas masuk' : 'Kas keluar'} ${baru.nomor} ${nominalGabung(baru)} — ${baru.kategori}${
      baru.status === 'menunggu' ? ' (menunggu persetujuan)' : ''}`);
  simpan();
  return baru;
}

/* Transfer memindahkan uang antar akun, atau menukar mata uangnya.
   Ia bukan pemasukan dan bukan pengeluaran: organisasi tak bertambah
   kaya atau miskin karenanya. Dulu harus dicatat sebagai pengeluaran
   plus pemasukan palsu, dan total keduanya ikut menggelembung.

   `rp`/`egp` adalah yang keluar dari akun asal; `rpTujuan`/`egpTujuan`
   yang tiba di akun tujuan. Pada pemindahan biasa keduanya sama; pada
   penukaran, yang satu rupiah dan yang lain pound. */
function simpanTransfer(user, data) {
  RBAC.assertCan(user, 'keuangan.manage');
  const angka = (v) => Math.max(0, Number(v || 0));
  const d = { ...data, jenis: 'transfer', kategori: 'Transfer', arus: null,
    rp: angka(data.rp), egp: angka(data.egp), rpTujuan: angka(data.rpTujuan), egpTujuan: angka(data.egpTujuan) };
  const asal = db.akunKas.find((a) => a.id === d.akunId), tujuan = db.akunKas.find((a) => a.id === d.akunTujuanId);
  if (!asal || !tujuan) throw new Error('Pilih akun asal dan akun tujuannya.');
  if (!d.rp && !d.egp) throw new Error('Isi nominal yang dipindahkan.');
  if (!d.rpTujuan && !d.egpTujuan) throw new Error('Isi nominal yang diterima akun tujuan.');
  const tukar = d.rp !== d.rpTujuan || d.egp !== d.egpTujuan;
  if (asal.id === tujuan.id && !tukar) throw new Error('Akun asal dan tujuan sama. Pilih akun lain, atau catat sebagai penukaran mata uang.');
  if (!d.tanggal) throw new Error('Tanggal wajib diisi.');
  tolakBilaTertutup(d.tanggal);
  d.sumber = tukar ? `Tukar ${asal.nama}${asal.id === tujuan.id ? '' : ` → ${tujuan.nama}`}` : `${asal.nama} → ${tujuan.nama}`;

  if (d.id) {
    const t = db.keuangan.find((x) => x.id === d.id && x.jenis === 'transfer');
    if (!t) throw new Error('Transfer tidak ditemukan.');
    tolakBilaTerkunci(t);
    catatRiwayat(user, t, d);
    Object.assign(t, d);
    catat(user, 'keuangan.ubah', t.id, `Mengubah transfer ${t.nomor}`);
    simpan();
    return t;
  }
  if (asal.nonaktif || tujuan.nonaktif) throw new Error('Akun yang dinonaktifkan tidak dapat dipakai untuk transfer baru.');
  const baru = { id: uid('f'), oleh: user.id, dibuat: nowISO(), status: 'sah', ...d };
  baru.nomor = nomorBukti(db.keuangan, 'transfer', baru.tanggal, db.aturKas);
  db.keuangan.unshift(baru);
  catat(user, 'keuangan.transfer', baru.id, `Transfer ${baru.nomor}: ${baru.sumber} ${nominalGabung(baru)}`);
  simpan();
  return baru;
}

/** Batalkan dengan alasan. Transaksinya tetap di buku — dicoret, tak
    dihitung — supaya uang yang pernah tercatat tak bisa lenyap begitu saja. */
function batalkanTransaksi(user, id, alasan) {
  RBAC.assertCan(user, 'keuangan.manage');
  const t = db.keuangan.find((x) => x.id === id);
  if (!t) throw new Error('Transaksi tidak ditemukan.');
  if (t.status === 'batal') throw new Error('Transaksi ini sudah dibatalkan.');
  tolakBilaTertutup(t.tanggal);
  const sebab = String(alasan || '').trim();
  if (sebab.length < 4) throw new Error('Tulis alasan pembatalannya.');
  t.statusSebelumBatal = t.status || 'sah';
  t.status = 'batal';
  t.batal = { alasan: sebab, oleh: user.id, ts: nowISO() };
  catat(user, 'keuangan.batal', t.id, `Membatalkan ${t.nomor || 'transaksi'} ${nominalGabung(t)} — ${sebab}`);
  simpan();
}

/** Keputusan Ketua Umum atas pengeluaran yang menunggu. */
function putuskanKas(user, id, setuju, alasan) {
  RBAC.assertCan(user, 'keuangan.approve');
  const t = db.keuangan.find((x) => x.id === id);
  if (!t) throw new Error('Transaksi tidak ditemukan.');
  if (t.status !== 'menunggu') throw new Error('Pengeluaran ini tidak sedang menunggu keputusan.');
  tolakBilaTertutup(t.tanggal);
  const sebab = String(alasan || '').trim();
  if (!setuju && sebab.length < 4) throw new Error('Tulis alasan penolakannya.');
  t.status = setuju ? 'sah' : 'ditolak';
  t.persetujuan = { oleh: user.id, ts: nowISO(), setuju: !!setuju, alasan: sebab };
  catat(user, setuju ? 'keuangan.setuju' : 'keuangan.tolak', t.id,
    `${setuju ? 'Menyetujui' : 'Menolak'} ${t.nomor} ${nominalGabung(t)}${sebab ? ` — ${sebab}` : ''}`);
  simpan();
}
function aturBatasSetuju(user, { rp, egp }) {
  RBAC.assertCan(user, 'keuangan.approve');
  const bersih = (n) => Math.max(0, Math.round(Number(n) || 0));
  db.aturKas = { ...(db.aturKas || {}), batasSetujuRp: bersih(rp), batasSetujuEgp: bersih(egp) };
  catat(user, 'keuangan.batas', 'aturKas', `Menetapkan batas persetujuan pengeluaran Rp ${db.aturKas.batasSetujuRp.toLocaleString('id-ID')} / EGP ${db.aturKas.batasSetujuEgp.toLocaleString('id-ID')}`);
  simpan();
}
function aturPeriode(user, { mulai, selesai }) {
  RBAC.assertCan(user, 'keuangan.akun');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(mulai || '') || !/^\d{4}-\d{2}-\d{2}$/.test(selesai || '')) throw new Error('Isi tanggal mulai dan selesai masa kepengurusan.');
  if (selesai <= mulai) throw new Error('Tanggal selesai harus sesudah tanggal mulai.');
  db.aturKas = { ...(db.aturKas || {}), periode: { mulai, selesai } };
  catat(user, 'keuangan.periode', 'aturKas', `Menetapkan periode kepengurusan ${mulai} s.d. ${selesai}`);
  simpan();
}

/* --- iuran anggota ---
   Iuran dicatat sebagai transaksi kas biasa yang bertaut ke anggotanya
   (`userId`) dan ke bulan yang dibayarnya (`bulanIuran`, "2026-10").
   Dengan begitu buku kas tetap satu, sementara siapa sudah membayar
   bulan apa dapat dihitung — bukan dicatat terpisah lalu berselisih. */
function aturIuran(user, { rp, egp }) {
  RBAC.assertCan(user, 'keuangan.akun');
  const bersih = (n) => Math.max(0, Math.round(Number(n) || 0));
  db.aturKas = { ...(db.aturKas || {}), iuranRp: bersih(rp), iuranEgp: bersih(egp) };
  catat(user, 'keuangan.iuran', 'aturKas',
    `Menetapkan iuran bulanan Rp ${db.aturKas.iuranRp.toLocaleString('id-ID')} / EGP ${db.aturKas.iuranEgp.toLocaleString('id-ID')}`);
  simpan();
}

/** Iuran seorang anggota untuk satu bulan: jumlah yang sudah dibayar
    dan statusnya terhadap nominal yang ditetapkan.

    Lunas bila rupiahnya ATAU poundnya mencapai nominal — anggota
    membayar dengan salah satu mata uang, bukan keduanya. Bila nominal
    belum ditetapkan, pembayaran berapa pun dianggap lunas. */
function iuranAnggota(userId, bulan) {
  const bayar = kasSah().filter((t) => t.jenis === 'masuk' && t.userId === userId && t.bulanIuran === bulan);
  const rp = bayar.reduce((j, t) => j + Number(t.rp || 0), 0);
  const egp = bayar.reduce((j, t) => j + Number(t.egp || 0), 0);
  const a = db.aturKas || {};
  const perluRp = Number(a.iuranRp || 0), perluEgp = Number(a.iuranEgp || 0);
  let status = 'belum';
  if (rp || egp) {
    const lunas = (!perluRp && !perluEgp) || (perluRp && rp >= perluRp) || (perluEgp && egp >= perluEgp);
    status = lunas ? 'lunas' : 'kurang';
  }
  return { rp, egp, status, kali: bayar.length };
}

/** Catat penerimaan iuran dari seorang anggota. */
/** Bulan-bulan dari `dari` sampai `sampai` ("2026-07" … "2026-10"). */
function deretBulan(dari, sampai) {
  const hasil = [];
  let [y, m] = String(dari).split('-').map(Number);
  const [ya, ma] = String(sampai).split('-').map(Number);
  while (y < ya || (y === ya && m <= ma)) {
    hasil.push(`${y}-${String(m).padStart(2, '0')}`);
    if (++m > 12) { m = 1; y++; }
    if (hasil.length > 240) break;
  }
  return hasil;
}
/** Rentang periode kepengurusan yang berlaku — atau tahun kalender ini
    bila belum ditetapkan. */
function periodeAktif() {
  const p = db.aturKas?.periode;
  const kini = hariIni();
  if (p?.mulai && p?.selesai && kini >= p.mulai && kini <= p.selesai) return { mulai: p.mulai, selesai: p.selesai, ditetapkan: true };
  return { mulai: `${kini.slice(0, 4)}-01-01`, selesai: `${kini.slice(0, 4)}-12-31`, ditetapkan: false };
}

/** Tunggakan seorang anggota: bulan-bulan wajib iuran yang belum lunas,
    dihitung sejak awal periode — atau sejak ia bergabung, bila lebih
    belakangan — sampai bulan ini. Tanpa nominal iuran yang ditetapkan
    tak ada yang bisa disebut menunggak. */
function tunggakanIuran(userId) {
  const u = getUser(userId);
  const a = db.aturKas || {};
  if (!u || (!Number(a.iuranRp) && !Number(a.iuranEgp))) return { bulan: [], rp: 0, egp: 0 };
  const kini = hariIni().slice(0, 7);
  const awal = [periodeAktif().mulai.slice(0, 7), String(u.bergabung || '').slice(0, 7)].filter(Boolean).sort().pop();
  const belum = deretBulan(awal, kini).filter((b) => iuranAnggota(u.id, b).status !== 'lunas');
  /* Yang ditagih: sisa terhadap nominal, dalam mata uang yang ditetapkan. */
  const sisa = belum.reduce((s, b) => {
    const i = iuranAnggota(u.id, b);
    return { rp: s.rp + Math.max(0, Number(a.iuranRp || 0) - i.rp), egp: s.egp + Math.max(0, Number(a.iuranEgp || 0) - i.egp) };
  }, { rp: 0, egp: 0 });
  return { bulan: belum, ...sisa };
}

/* --- anggaran ---
   Anggaran ditetapkan per kategori pengeluaran untuk satu periode
   kepengurusan. Realisasinya tidak disimpan: ia dihitung dari buku kas,
   sehingga tak pernah berselisih dengannya. */
const kasPeriode = () => { const p = periodeAktif(); return kasSah().filter((t) => t.tanggal >= p.mulai && t.tanggal <= p.selesai); };
const kodePeriodeKini = () => kodePeriode(hariIni(), db.aturKas);
const anggaranKategori = (kategoriId) => (db.anggaran || []).find((x) => x.kategoriId === kategoriId && x.kode === kodePeriodeKini()) || null;

function simpanAnggaran(user, { kategoriId, rp, egp }) {
  RBAC.assertCan(user, 'keuangan.akun');
  const k = db.kategoriKeuangan.find((x) => x.id === kategoriId);
  if (!k || k.jenis !== 'keluar') throw new Error('Anggaran hanya untuk kategori pengeluaran.');
  const bersih = (n) => Math.max(0, Math.round(Number(n) || 0));
  db.anggaran = db.anggaran || [];
  const kode = kodePeriodeKini();
  let baris = db.anggaran.find((x) => x.kategoriId === kategoriId && x.kode === kode);
  if (!baris) { baris = { id: uid('ag'), kategoriId, kode }; db.anggaran.push(baris); }
  baris.rp = bersih(rp); baris.egp = bersih(egp);
  catat(user, 'anggaran.atur', kategoriId, `Menetapkan anggaran "${k.nama}" periode ${kode}: Rp ${baris.rp.toLocaleString('id-ID')} / EGP ${baris.egp.toLocaleString('id-ID')}`);
  simpan();
}

/** Catat penerimaan iuran. `jumlahBulan` lebih dari satu mencatat
    beberapa bulan berturut-turut — tiap bulan satu transaksi bernomor
    sendiri, supaya tiap bulan dapat dibatalkan atau dilacak terpisah. */
function terimaIuran(user, { userId, bulan, rp, egp, akunId, tanggal, ket, jumlahBulan = 1 }) {
  const u = getUser(userId);
  if (!u) throw new Error('Anggota tidak ditemukan.');
  if (!/^\d{4}-\d{2}$/.test(bulan || '')) throw new Error('Bulan iuran belum dipilih.');
  const n = Math.min(24, Math.max(1, Math.round(Number(jumlahBulan) || 1)));
  let [y, m] = bulan.split('-').map(Number);
  const hasil = [];
  for (let i = 0; i < n; i++) {
    const b = `${y}-${String(m).padStart(2, '0')}`;
    hasil.push(simpanTransaksi(user, {
      jenis: 'masuk', arus: 'internal', kategori: 'Iuran Anggota',
      sumber: u.nama, userId: u.id, bulanIuran: b,
      rp, egp, akunId: akunId || 'ak1', tanggal: tanggal || hariIni(), ket: ket || `Iuran ${b}`,
    }));
    if (++m > 12) { m = 1; y++; }
  }
  return hasil;
}

const nominalGabung = (t) => [
  t.rp ? 'Rp ' + Number(t.rp).toLocaleString('id-ID') : '',
  t.egp ? 'EGP ' + Number(t.egp).toLocaleString('id-ID') : '',
].filter(Boolean).join(' + ') || 'Rp 0';

/* --- akun & kategori: tak boleh hilang selagi masih dipakai ---
   Menghapus akun yang punya transaksi membuat saldonya lenyap dari
   Saldo Keseluruhan tanpa satu peringatan pun; menghapus kategori
   meninggalkan transaksi tanpa golongan. Keduanya kini ditolak —
   yang tak dipakai lagi cukup dinonaktifkan. */
const transaksiAkun = (id) => db.keuangan.filter((t) => t.akunId === id || t.akunTujuanId === id);
const transaksiKategori = (k) => db.keuangan.filter((t) => t.kategoriId === k.id || (!t.kategoriId && t.kategori === k.nama));

function simpanAkunKas(user, data) {
  RBAC.assertCan(user, 'keuangan.akun');
  const d = { ...data, saldoAwalRp: Number(data.saldoAwalRp || 0), saldoAwalEgp: Number(data.saldoAwalEgp || 0),
    nonaktif: data.nonaktif === true || data.nonaktif === 'ya' };
  const alasan = String(d.alasanSaldo || '').trim();
  delete d.alasanSaldo;
  if (!String(d.nama || '').trim()) throw new Error('Nama akun wajib diisi.');
  if (d.id) {
    const a = db.akunKas.find((x) => x.id === d.id);
    if (!a) throw new Error('Akun tidak ditemukan.');
    const berubah = Number(a.saldoAwalRp || 0) !== d.saldoAwalRp || Number(a.saldoAwalEgp || 0) !== d.saldoAwalEgp;
    /* Saldo awal menggeser seluruh saldo sesudahnya. Selagi akun masih
       kosong ia bebas diatur; sesudah ada transaksi, perubahannya harus
       beralasan dan meninggalkan jejak. */
    if (berubah && transaksiAkun(a.id).length) {
      if (!alasan) throw new Error('Akun ini sudah bertransaksi. Isi alasan untuk mengubah saldo awalnya.');
      a.riwayatSaldo = (a.riwayatSaldo || []).concat({ ts: nowISO(), oleh: user.id, alasan,
        dariRp: Number(a.saldoAwalRp || 0), keRp: d.saldoAwalRp, dariEgp: Number(a.saldoAwalEgp || 0), keEgp: d.saldoAwalEgp });
      catat(user, 'keuangan.saldoAwal', a.id, `Mengubah saldo awal "${a.nama}" — ${alasan}`);
    }
    if (d.nonaktif && !a.nonaktif) {
      const s = saldoAkun(a.id);
      if (s.rp || s.egp) throw new Error('Akun masih bersaldo. Pindahkan atau keluarkan dulu uangnya sebelum dinonaktifkan.');
    }
    Object.assign(a, d);
    catat(user, 'akunKas.ubah', a.id, `Mengubah akun kas "${a.nama}"`);
  } else {
    const baru = { id: uid('ak'), ...d };
    db.akunKas.push(baru);
    catat(user, 'akunKas.tambah', baru.id, `Menambah akun kas "${baru.nama}"`);
  }
  simpan();
}
function hapusAkunKas(user, id) {
  RBAC.assertCan(user, 'keuangan.akun');
  const a = db.akunKas.find((x) => x.id === id);
  if (!a) return;
  const n = transaksiAkun(id).length;
  if (n) throw new Error(`Akun "${a.nama}" dipakai ${n} transaksi dan tidak dapat dihapus. Nonaktifkan saja bila tak dipakai lagi.`);
  db.akunKas = db.akunKas.filter((x) => x.id !== id);
  catat(user, 'akunKas.hapus', id, `Menghapus akun kas "${a.nama}"`);
  simpan();
}

function simpanKategoriKas(user, data) {
  RBAC.assertCan(user, 'keuangan.akun');
  const nama = String(data.nama || '').trim();
  if (!nama) throw new Error('Nama kategori wajib diisi.');
  const d = { ...data, nama, nonaktif: data.nonaktif === true || data.nonaktif === 'ya' };
  if (db.kategoriKeuangan.some((x) => x.id !== d.id && x.nama.toLowerCase() === nama.toLowerCase() && x.jenis === d.jenis))
    throw new Error(`Kategori "${nama}" sudah ada.`);
  if (d.id) {
    const k = db.kategoriKeuangan.find((x) => x.id === d.id);
    if (!k) throw new Error('Kategori tidak ditemukan.');
    const terpakai = transaksiKategori(k);
    if (d.jenis !== k.jenis && terpakai.length)
      throw new Error('Jenis kategori yang sudah dipakai transaksi tidak dapat diubah.');
    /* Transaksinya ikut berganti nama dan ikut ditautkan — inilah yang
       dulu tak terjadi. */
    terpakai.forEach((t) => { t.kategori = nama; t.kategoriId = k.id; });
    Object.assign(k, d);
    catat(user, 'kategoriKeuangan.ubah', k.id, `Mengubah kategori "${nama}"${terpakai.length ? ` beserta ${terpakai.length} transaksinya` : ''}`);
  } else {
    const baru = { id: uid('kt'), ...d };
    db.kategoriKeuangan.push(baru);
    catat(user, 'kategoriKeuangan.tambah', baru.id, `Menambah kategori "${nama}"`);
  }
  simpan();
}
function hapusKategoriKas(user, id) {
  RBAC.assertCan(user, 'keuangan.akun');
  const k = db.kategoriKeuangan.find((x) => x.id === id);
  if (!k) return;
  const n = transaksiKategori(k).length;
  if (n) throw new Error(`Kategori "${k.nama}" dipakai ${n} transaksi dan tidak dapat dihapus. Nonaktifkan saja bila tak dipakai lagi.`);
  db.kategoriKeuangan = db.kategoriKeuangan.filter((x) => x.id !== id);
  catat(user, 'kategoriKeuangan.hapus', id, `Menghapus kategori "${k.nama}"`);
  simpan();
}

/** Saldo sebuah akun, dua mata uang sekaligus — tidak pernah dijumlahkan. */
function saldoAkun(idAkun, sampai = '') {
  const a = db.akunKas.find((x) => x.id === idAkun);
  if (!a) return { rp: 0, egp: 0 };
  let rp = a.saldoAwalRp || 0, egp = a.saldoAwalEgp || 0;
  /* Hanya transaksi sah. Transfer mengurangi akun asalnya sebesar yang
     keluar dan menambah akun tujuannya sebesar yang tiba. */
  kasSah().forEach((t) => {
    if (sampai && t.tanggal > sampai) return;       // saldo per akhir suatu tanggal
    if (t.jenis === 'transfer') {
      if (t.akunId === idAkun) { rp -= Number(t.rp || 0); egp -= Number(t.egp || 0); }
      if (t.akunTujuanId === idAkun) { rp += Number(t.rpTujuan || 0); egp += Number(t.egpTujuan || 0); }
      return;
    }
    if (t.akunId !== idAkun) return;
    const tanda = t.jenis === 'masuk' ? 1 : -1;
    rp += tanda * Number(t.rp || 0);
    egp += tanda * Number(t.egp || 0);
  });
  return { rp, egp };
}

const tanggalAkhirBulan = (bulan) => `${bulan}-${String(new Date(Number(bulan.slice(0, 4)), Number(bulan.slice(5, 7)), 0).getDate()).padStart(2, '0')}`;

/** Tutup buku sebuah bulan. `fisik` hasil hitung uang yang benar-benar
    ada, per akun: { ak1: { rp, egp } }. Selisihnya terhadap buku wajib
    dijelaskan — itulah gunanya rekonsiliasi. */
function tutupBuku(user, bulan, fisik, catatan) {
  RBAC.assertCan(user, 'keuangan.manage');
  if (!/^\d{4}-\d{2}$/.test(bulan || '')) throw new Error('Bulan tidak sah.');
  if (bulan >= hariIni().slice(0, 7)) throw new Error('Bulan yang masih berjalan belum dapat ditutup.');
  if (bulanTertutup(bulan)) throw new Error(`Buku ${bulan} sudah ditutup.`);
  const tunggu = db.keuangan.filter((t) => t.status === 'menunggu' && String(t.tanggal).startsWith(bulan));
  if (tunggu.length) throw new Error(`Masih ada ${tunggu.length} pengeluaran bulan itu yang menunggu persetujuan Ketua.`);

  const sampai = tanggalAkhirBulan(bulan);
  const saldo = {}, hitung = {};
  let selisih = false;
  db.akunKas.forEach((a) => {
    const b = saldoAkun(a.id, sampai);
    const f = { rp: Number(fisik?.[a.id]?.rp ?? b.rp), egp: Number(fisik?.[a.id]?.egp ?? b.egp) };
    saldo[a.id] = b; hitung[a.id] = f;
    if (f.rp !== b.rp || f.egp !== b.egp) selisih = true;
  });
  const ket = String(catatan || '').trim();
  if (selisih && ket.length < 4) throw new Error('Uang yang dihitung berbeda dengan buku. Jelaskan selisihnya pada catatan.');
  db.tutupBuku = (db.tutupBuku || []).concat({ id: uid('tb'), bulan, ditutup: nowISO(), oleh: user.id, saldo, fisik: hitung, selisih, catatan: ket });
  catat(user, 'keuangan.tutup', bulan, `Menutup buku ${bulan}${selisih ? ' dengan selisih — ' + ket : ''}`);
  simpan();
}
function bukaBuku(user, bulan, alasan) {
  RBAC.assertCan(user, 'keuangan.approve');
  const x = penutupan(bulan);
  if (!x) throw new Error('Buku bulan itu tidak sedang ditutup.');
  const sebab = String(alasan || '').trim();
  if (sebab.length < 4) throw new Error('Tulis alasan membuka kembali buku ini.');
  x.dibuka = { oleh: user.id, ts: nowISO(), alasan: sebab };
  catat(user, 'keuangan.buka', bulan, `Membuka kembali buku ${bulan} — ${sebab}`);
  simpan();
}

/** Dicatat hari ini? Hanya itu yang boleh dihapus permanen — untuk salah
    ketik yang langsung ketahuan. Selebihnya dibatalkan dengan alasan. */
function dicatatHariIni(t) {
  if (!t.dibuat) return false;
  const d = new Date(t.dibuat);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` === hariIni();
}
function hapusTransaksi(user, id) {
  RBAC.assertCan(user, 'keuangan.manage');
  const t = db.keuangan.find((x) => x.id === id);
  if (!t) return;
  if (!dicatatHariIni(t)) throw new Error('Transaksi ini tidak dicatat hari ini, jadi tidak dihapus. Batalkan dengan alasan.');
  tolakBilaTertutup(t.tanggal);
  db.keuangan = db.keuangan.filter((x) => x.id !== id);
  catat(user, 'keuangan.hapus', id, `Menghapus ${t.nomor || 'transaksi'} ${nominalGabung(t)} yang dicatat hari ini`);
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
  templatSurat: { izin: 'sekretariat.manage', tunggal: 'templat surat', judul: (x) => x.nama    },
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

/* Tautan penugasan → naskah disimpan DI NASKAH (`penugasanId`), bukan di
   penugasan: naskah milik penulisnya, sedangkan `penugasan` hanya boleh
   ditulis PJ Artikel. Dengan begitu anggota dapat menautkan tulisannya
   sendiri, dan progres tidak perlu diketik siapa pun. */
const naskahTugas = (p) => db.artikel.find((a) => a.penugasanId === p.id) || null;

/** Tanggal (setempat) sebuah naskah pertama kali dikirim untuk ditinjau.
    Naskah lama tanpa riwayat memakai tanggalnya sendiri bila sudah dikirim. */
function dikirimPada(a) {
  const r = (a.riwayat || []).find((x) => x.ke === 'review' || x.ke === 'terbit');
  if (r) {
    const d = new Date(r.pada);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  return ['review', 'terbit'].includes(a.status) ? String(a.tanggal || '').slice(0, 10) : '';
}

/** Progres sebuah penugasan, diturunkan dari naskahnya:
    belum (belum ada naskah) · proses (draf / perlu revisi) · siap (sudah
    dikirim). `tepat`: dikirim sebelum atau pada tenggat. `telat`: tenggat
    lewat dan belum dikirim. */
function progresTugas(p) {
  const a = naskahTugas(p);
  const dikirim = a ? dikirimPada(a) : '';
  const status = !a ? 'belum' : dikirim && a.status !== 'draft' && a.status !== 'revisi' ? 'siap'
    : dikirim ? 'proses' : 'proses';
  return { naskah: a, status, dikirim, tepat: !!dikirim && (!p.deadline || dikirim <= p.deadline),
    telat: status !== 'siap' && !!p.deadline && p.deadline < hariIni() };
}

/** Yang wajib menulis: anggota aktif yang masih berkajian. Alumni dan
    pendiri boleh menulis, tetapi tidak ditagih target. */
const wajibMenulis = () => db.users.filter(berkajian).sort((a, b) => a.nama.localeCompare(b.nama));

/** Capaian satu bulan. Target dihitung dari NASKAH YANG DIKIRIM pada bulan
    itu — bukan dari berapa judul yang dibagikan. */
function capaianBulan(bulan) {
  const target = db.redaksi.targetBulanan || 1;
  const dikirimBulan = db.artikel.filter((a) => dikirimPada(a).slice(0, 7) === bulan);
  const baris = wajibMenulis().map((u) => {
    const kirim = dikirimBulan.filter((a) => a.penulisId === u.id);
    const tugas = db.penugasan.filter((p) => p.userId === u.id && p.bulan === bulan);
    return { u, kirim, tugas, terbit: kirim.filter((a) => a.status === 'terbit').length,
      memenuhi: kirim.length >= target, kurang: Math.max(0, target - kirim.length) };
  });
  const terhitung = baris.reduce((j, b) => j + Math.min(target, b.kirim.length), 0);
  return { bulan, target, baris, naskah: dikirimBulan.length,
    terbit: dikirimBulan.filter((a) => a.status === 'terbit').length,
    memenuhi: baris.filter((b) => b.memenuhi).length,
    persen: baris.length ? Math.round((terhitung / (baris.length * target)) * 100) : 0 };
}

function simpanPenugasan(user, data) {
  RBAC.assertCan(user, 'redaksi.manage');
  const lama = data.id ? db.penugasan.find((x) => x.id === data.id) : null;
  if (data.id && !lama) throw new Error('Penugasan tidak ditemukan.');
  const p = { ...(lama || {}), ...data };
  if (!String(p.judul || '').trim()) throw new Error('Judul artikel wajib diisi.');
  if (!/^\d{4}-\d{2}$/.test(p.bulan || '')) throw new Error('Bulan penugasan wajib dipilih.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.deadline || '')) throw new Error('Tenggat wajib diisi.');
  if (p.deadline < `${p.bulan}-01`) throw new Error('Tenggat tidak boleh sebelum bulan penugasannya.');
  const u = getUser(p.userId);
  if (!u) throw new Error('Anggota penulis wajib dipilih.');
  if ((!lama || lama.userId !== p.userId) && !berkajian(u))
    throw new Error(`${u.nama} bukan anggota aktif yang masih berkajian.`);
  if (lama && lama.userId !== p.userId && naskahTugas(lama))
    throw new Error('Penugasan ini sudah bernaskah — penulisnya tidak dapat diganti.');
  if (db.penugasan.some((x) => x.id !== p.id && x.userId === p.userId && x.bulan === p.bulan
    && x.judul.trim().toLowerCase() === p.judul.trim().toLowerCase()))
    throw new Error(`${u.nama} sudah ditugasi judul itu pada bulan yang sama.`);
  const bersih = { userId: p.userId, bulan: p.bulan, judul: p.judul.trim(), deadline: p.deadline, catatan: String(p.catatan || '').trim() };
  let hasil;
  if (lama) { Object.assign(lama, bersih); hasil = lama; catat(user, 'penugasan.ubah', lama.id, `Mengubah penugasan "${lama.judul}" (${u.nama})`); }
  else {
    hasil = { id: uid('tg'), ...bersih, dibuat: new Date().toISOString() };
    if (data.asal) hasil.asal = data.asal;
    db.penugasan.push(hasil);
    catat(user, 'penugasan.tambah', hasil.id, `Menugaskan "${hasil.judul}" kepada ${u.nama}`);
  }
  simpan();
  return hasil;
}

/** Anggota mulai menulis penugasannya: draf baru yang tertaut ke sana. */
function tulisDariTugas(user, idPenugasan) {
  const p = db.penugasan.find((x) => x.id === idPenugasan);
  if (!p) throw new Error('Penugasan tidak ditemukan.');
  if (p.userId !== user.id) throw new Error('Penugasan ini bukan milik Anda.');
  const ada = naskahTugas(p);
  if (ada) return ada;
  return simpanArtikel(user, { judul: p.judul, penugasanId: p.id, kategori: '', ringkas: '', isi: [], tag: [] });
}

/** Anggota mengusulkan judulnya sendiri untuk sebuah bulan. Usulan hidup
    di naskah drafnya; ia baru menjadi penugasan setelah disetujui. */
function usulkanJudul(user, { judul, bulan, catatan }) {
  RBAC.assertCan(user, 'artikel.write');
  if (!String(judul || '').trim()) throw new Error('Judul usulan wajib diisi.');
  if (!/^\d{4}-\d{2}$/.test(bulan || '')) throw new Error('Bulan wajib dipilih.');
  if (db.artikel.some((a) => a.penulisId === user.id && a.usul?.status === 'menunggu' && a.usul.bulan === bulan
    && a.judul.trim().toLowerCase() === judul.trim().toLowerCase()))
    throw new Error('Judul itu sudah Anda usulkan untuk bulan yang sama.');
  return simpanArtikel(user, { judul: judul.trim(), kategori: '', ringkas: '', isi: [], tag: [],
    usul: { bulan, catatan: String(catatan || '').trim(), status: 'menunggu', pada: new Date().toISOString() } });
}
const usulMenunggu = () => db.artikel.filter((a) => a.usul?.status === 'menunggu');

/** PJ Artikel memutuskan usulan judul. Disetujui → menjadi penugasan yang
    langsung tertaut ke naskahnya. */
function putuskanUsul(user, idArtikel, setuju, { deadline, alasan } = {}) {
  RBAC.assertCan(user, 'redaksi.manage');
  const a = db.artikel.find((x) => x.id === idArtikel);
  if (!a || a.usul?.status !== 'menunggu') throw new Error('Usulan tidak ditemukan atau sudah diputuskan.');
  if (setuju) {
    const p = simpanPenugasan(user, { userId: a.penulisId, bulan: a.usul.bulan, judul: a.judul, deadline, catatan: a.usul.catatan, asal: 'usulan' });
    a.penugasanId = p.id;
    a.usul = { ...a.usul, status: 'disetujui', oleh: user.id };
  } else {
    if (!String(alasan || '').trim()) throw new Error('Alasan penolakan wajib diisi.');
    a.usul = { ...a.usul, status: 'ditolak', alasan: String(alasan).trim(), oleh: user.id };
  }
  catat(user, 'penugasan.usul', a.id, `${setuju ? 'Menyetujui' : 'Menolak'} usulan judul "${a.judul}" (${namaUser(a.penulisId)})`);
  simpan();
}

/** Migrasi sekali: penugasan contoh bawaan (April–Juni 2025) dibuang.
    Tak satu pun tertaut ke naskah, dan "progres"-nya hanya ketikan. */
function bersihkanPenugasanContoh(tersimpan) {
  if (!tersimpan.redaksi || tersimpan.redaksi.penugasanBersih) return;
  tersimpan.penugasan = (tersimpan.penugasan || []).filter((p) =>
    !(/^tg\d+$/.test(p.id) && p.bulan <= '2025-06' && !p.artikelId));
  tersimpan.redaksi.penugasanBersih = 1;
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
let bukuTerpilih = '';
/** Proyek yang sedang DIBUKA di layar. Membuka sebuah proyek tidak
    mengubah statusnya — beberapa proyek boleh berjalan bersamaan, dan
    proyek lama dapat ditengok tanpa mengarsipkan yang lain. */
function bukuAktif() {
  return db.buku.find((b) => b.id === bukuTerpilih)
    || db.buku.find((b) => b.status === 'berjalan') || db.buku[0] || null;
}

/* --- siklus proyek ---
   rencana → berjalan → terbit, atau dihentikan (beralasan). Beberapa
   proyek boleh berjalan bersamaan. */
const STATUS_BUKU = ['rencana', 'berjalan', 'terbit', 'dihentikan'];
const bukuJalan = (b) => b.status === 'rencana' || b.status === 'berjalan';

/** Tahap proyek, DITURUNKAN dari isinya — dulu dipilih tangan dan kerap
    tertinggal dari kenyataan. */
function tahapBuku(b) {
  const n = b.naskah || [];
  if (b.status === 'terbit') return 'selesai';
  if (!n.length) return 'perencanaan';
  if (!b.pjUtamaId || !(b.editorIds || []).length || n.some((x) => !x.userId)) return 'pembagian';
  if (n.some((x) => x.progressTulis !== 'siap')) return 'penulisan';
  if (n.some((x) => x.progressEdit !== 'siap')) return 'editing';
  if (n.some((x) => !x.buktiLayout) || !(b.desain || []).some((d) => d.bukti)) return 'layout';
  return 'produksi';
}
/* Tahap tetap disimpan — website publik membacanya — tetapi selalu
   disegarkan dari isinya tiap kali proyek berubah. */
const segarkanTahap = (b) => { if (b) b.tahap = tahapBuku(b); return b; };

/** Proyek yang sudah memuat pekerjaan atau uang: tak boleh dihapus. */
function bukuBerisi(b) {
  return (b.naskah || []).length > 0 || (b.dokumen || []).length > 0 || (b.produksi || []).length > 0
    || (b.penjualan || []).length > 0 || (db.keuangan || []).some((t) => t.bukuId === b.id);
}

/** Ubah status proyek. `ke`: berjalan | terbit | dihentikan. */
function ubahStatusBuku(user, id, ke, { alasan, tanggal } = {}) {
  RBAC.assertCan(user, 'buku.manage');
  const b = cariBuku(id);
  if (!STATUS_BUKU.includes(ke) || ke === 'rencana') throw new Error('Status proyek tidak dikenal.');
  if (b.status === ke) throw new Error(`Proyek ini sudah ${ke}.`);
  const teks = String(alasan || '').trim();
  if (ke === 'dihentikan' && !teks) throw new Error('Alasan menghentikan proyek wajib diisi.');
  if (ke === 'berjalan' && ['terbit', 'dihentikan'].includes(b.status) && !teks)
    throw new Error('Alasan membuka kembali proyek wajib diisi.');
  if (ke === 'terbit') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal || '')) throw new Error('Tanggal terbit wajib diisi.');
    if (!(b.naskah || []).length) throw new Error('Proyek ini belum punya naskah.');
    const belum = b.naskah.filter((n) => n.progressEdit !== 'siap').length;
    if (belum) throw new Error(`${belum} sub judul belum selesai disunting.`);
    b.terbitPada = tanggal;
  }
  b.riwayatStatus = [...(b.riwayatStatus || []), { dari: b.status, ke, alasan: teks, oleh: user.id, pada: new Date().toISOString() }];
  b.status = ke;
  segarkanTahap(b);
  catat(user, 'buku.status', b.id, `Proyek "${b.judul}" → ${ke}${teks ? ` — ${teks}` : ''}`);
  simpan();
}

/** Migrasi bentuk proyek buku: status lama (aktif / arsip) dipetakan ke
    siklus baru, proyek contoh kedua dibuang, tahap disegarkan. Berlaku di
    memori bagi semua; tersimpan saat PJ Buku yang masuk. */
function migrasiBuku(tersimpan) {
  tersimpan.buku = (tersimpan.buku || []).filter((b) =>
    !(b.id === 'bk2' && b.judul === 'Kaidah-Kaidah Tafsir Nusantara'));
  tersimpan.buku.forEach((b) => {
    if (b.status === 'aktif') b.status = 'berjalan';
    else if (b.status === 'arsip') b.status = b.tahap === 'selesai' ? 'terbit' : 'dihentikan';
    if (!STATUS_BUKU.includes(b.status)) b.status = 'rencana';
    (b.timeline || []).forEach((t) => { if (t.selesai === undefined) t.selesai = false; });
  });
}
function bukaBukuProyek(id) {
  if (db.buku.some((b) => b.id === id)) bukuTerpilih = id;
  return bukuAktif();
}

function cariBuku(id) {
  const b = db.buku.find((x) => x.id === id);
  if (!b) throw new Error('Proyek buku tidak ditemukan.');
  return b;
}

function simpanBuku(user, data) {
  RBAC.assertCan(user, 'buku.manage');
  /* Status dan tahap tidak diubah lewat penyuntingan. */
  const { status: _s, tahap: _t, ...isi } = data;
  data = isi;
  if (!String(data.judul ?? 'x').trim()) throw new Error('Judul buku wajib diisi.');
  if (data.kumpulPerdana && data.targetTerbit && data.targetTerbit < data.kumpulPerdana)
    throw new Error('Target terbit tidak boleh sebelum kumpul perdana.');
  if (data.id) {
    const b = cariBuku(data.id);
    Object.assign(b, data);
    segarkanTahap(b);
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

function hapusBuku(user, id) {
  RBAC.assertCan(user, 'buku.manage');
  const b = cariBuku(id);
  /* Proyek yang sudah memuat naskah, dokumen, atau transaksi Buku Kas
     dihentikan beserta alasannya, bukan dihapus. */
  if (bukuBerisi(b)) throw new Error(`"${b.judul}" sudah memuat pekerjaan atau transaksi — hentikan, jangan dihapus.`);
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
  segarkanTahap(b);
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
  segarkanTahap(b);
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

/** Dipanggil halaman publik pada tiap pemuatan. Dicatat di server, jadi
    yang terhitung kini pengunjung sungguhan — bukan sekadar berapa kali
    satu peramban membuka halamannya sendiri. */
const KUNJUNG_SESI = '(sesi)';
const KUNJUNG_BARU = '(baru)';

function catatKunjungan(halaman) {
  if (!halaman) return;
  const penanda = [halaman];

  /* Tayangan halaman dihitung tiap pemuatan; kunjungan sekali per sesi
     peramban; pengunjung baru sekali seumur peramban. Ketiganya memang
     hal yang berbeda, dan hanya dengan membedakannya angka "halaman per
     kunjungan" dan "pengunjung baru" punya arti.

     Penandanya masih disimpan di peramban — memang di situlah tempatnya:
     yang perlu diingat adalah "peramban ini sudah pernah datang", dan
     hanya peramban itu sendiri yang tahu. */
  try {
    if (!sessionStorage.getItem('alijaz_sesi_kunjung')) {
      sessionStorage.setItem('alijaz_sesi_kunjung', '1');
      penanda.push(KUNJUNG_SESI);
      if (!localStorage.getItem('alijaz_pernah')) {
        localStorage.setItem('alijaz_pernah', '1');
        penanda.push(KUNJUNG_BARU);
      }
    }
  } catch (_) {}

  /* Ketiganya dikirim sekaligus: sebagai tiga permintaan terpisah mereka
     akan saling menimpa di koleksi yang sama dan hitungannya hilang.

     Kegagalannya sengaja didiamkan — statistik yang meleset satu angka
     jauh lebih baik daripada halaman publik yang menampilkan galat. */
  panggil('kunjung.php', { method: 'POST', body: JSON.stringify({ halaman: penanda }) })
    .catch(() => {});
}

/** Satu hitungan baca untuk sebuah artikel, dari pengunjung publik. */
function catatBaca(id) {
  return panggil('lihat.php', { method: 'POST', body: JSON.stringify({ id }) })
    .catch(() => {});
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

/** Dipanggil dari halaman publik (tanpa login). Pesannya disusun server
    — pengunjung tidak menulis koleksi, ia hanya menitipkan satu pesan. */
async function kirimPesan(data) {
  await panggil('pesan.php', { method: 'POST', body: JSON.stringify(data) });
}

function tandaiDibaca(user, id) {
  RBAC.assertCan(user, 'pesan.read');
  const p = db.pesan.find((x) => x.id === id);
  if (p) { p.dibaca = true; simpan(); }
}

async function berlanggananNewsletter(email) {
  const d = await panggil('langgan.php', { method: 'POST', body: JSON.stringify({ email }) });
  return d.baru;                      // false bila alamatnya sudah terdaftar
}

/* ---------- unggahan gambar ----------
   Gambar dikecilkan lebih dulu lewat canvas, lalu dikirim ke server dan
   disimpan sebagai BERKAS — yang tersimpan di database hanya URL-nya.
   Sebelumnya data-URI-nya ikut masuk ke dalam JSON dan menyita 44% dari
   seluruh data; sebagai berkas, JSON tetap ramping dan gambarnya dapat
   disinggahkan peramban.

   Format keluaran mengikuti format masukan, bukan selalu JPEG:
   - SVG   diteruskan apa adanya. Ia sudah ringan dan bebas skala;
           melewatkannya ke canvas justru merusaknya jadi raster.
   - PNG / WebP / GIF menjadi PNG, agar latar transparan tetap utuh.
           Logo tanpa transparansi akan tampil sebagai kotak putih
           di atas header hijau.
   - Selebihnya menjadi JPEG, yang jauh lebih hemat untuk foto.        */
function kecilkanGambar(file, lebarMaks, mutu) {
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
        /* Dikecilkan menurut LEBAR dan TINGGI sekaligus. Dengan lebar
           saja, potret 1000x8000 lolos tanpa disentuh — lebarnya sudah
           di bawah batas — lalu tersimpan sebagai berkas raksasa yang
           di bingkainya hanya tampak sesobek. Batas tingginya longgar
           (1,6x lebar) supaya potret tegak yang wajar tidak ikut
           terpangkas. */
        const tinggiMaks = lebarMaks * 1.6;
        const skala = Math.min(1, lebarMaks / img.width, tinggiMaks / img.height);
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

async function unggahGambar(file, lebarMaks = 1400, mutu = 0.82) {
  const dataUri = await kecilkanGambar(file, lebarMaks, mutu);
  const d = await panggil('unggah.php', { method: 'POST', body: JSON.stringify({ data: dataUri }) });
  return d.url;
}

/* ---------- pembantu baca ---------- */
const getUser = (id) => db.users.find((u) => u.id === id);
const namaUser = (id) => getUser(id)?.nama || '—';

window.Store = {
  get db() { return db; },
  get cms() { return db.cms; },           // versi TAYANG — dibaca website publik
  get draft() { return db.cmsDraft; },    // ruang kerja — dibaca ERP

  berlangganan, berlanggananStatus, simpan, kirimPerubahan, clone, uid,
  siap, login, logout, userAktif,
  perluGantiSandi, gantiSandi, setelSandi,
  perluPasang, pasang, kosongkanSemua,
  ubahDraft, toggleSection, geserSection, resetDraft,
  ringkasPerubahan, adaPerubahan, ajukan, setujui, tolak, rollback,
  simpanArtikel, ubahStatusArtikel, hapusArtikel,
  simpanKajian, setPresensi, presensiDariKode, setNotulensi, hapusKajian,
  BAGIAN_NOTULEN, statusNotulen, isiNotulen, simpanNotulen, kirimNotulen,
  STATUS_REVISI, statusRevisi, tenggatMakalah, simpanMateri, kirimMakalah,
  bebanTugas, petugasBerhalangan, PERAN_KAJIAN,
  bukaPresensi, jatahIzin, izinMenunggu, ajukanIzin, tarikIzin, putuskanIzin, JATAH_IZIN,
  pesertaKajian, rekapKajian, kehadiranAnggota, simpanAnggotaMassal, berkajian,
  tundaKajian, batalkanKajian, pulihkanKajian, keadaanKajian, kajianJalan, kajianBerisi, angkatanPeserta, pesertaAngkatan,
  simpanAnggotaKajian, kodeQr, STATUS_PRESENSI, anggotaDariKode, tutupPresensi, toleransiKajian, hariIni,
  bulanTertutup, penutupan, tutupBuku, bukaBuku, akhirBulan: tanggalAkhirBulan,
  kasSah, kasSahkah, perluSetuju, simpanTransfer, batalkanTransaksi, putuskanKas, aturBatasSetuju, aturPeriode, dicatatHariIni, kodePeriode,
  simpanAkunKas, hapusAkunKas, simpanKategoriKas, hapusKategoriKas, transaksiKategori,
  simpanAnggota, hapusAnggota, dataDiri, simpanDataDiri, terimaPendaftaran, tolakPendaftaran, hapusPendaftaran, kirimPendaftaran, unggahFotoKartu, simpanTransaksi, kasPeriode, kodePeriodeKini, anggaranKategori, simpanAnggaran,
  aturIuran, iuranAnggota, terimaIuran, tunggakanIuran, periodeAktif, deretBulan, hapusTransaksi, saldoAkun, nominalGabung,
  simpanKoleksi, hapusKoleksi, centangKegiatan,
  setTargetArtikel, simpanPanduan, simpanProfil,
  bukuAktif, bukaBukuProyek, simpanBuku, hapusBuku, ubahStatusBuku, tahapBuku, bukuBerisi, bukuJalan, STATUS_BUKU,
  simpanBagianBuku, hapusBagianBuku, centangProduksi,
  pindahArtikel, ALUR_ARTIKEL, naskahTugas, dikirimPada, progresTugas, wajibMenulis, capaianBulan,
  simpanPenugasan, tulisDariTugas, usulkanJudul, usulMenunggu, putuskanUsul,
  catatKunjungan, catatBaca, centangTugas, simpanSeo,
  KUNJUNG_SESI, KUNJUNG_BARU,
  kirimPesan, tandaiDibaca, berlanggananNewsletter,
  unggahGambar, catat,
  getUser, namaUser,
};
