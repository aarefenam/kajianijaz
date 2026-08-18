/* ============================================================
   QR.JS — Pembangkit QR Code
   ------------------------------------------------------------
   Ditulis sendiri, sebab proyek ini berjalan luring tanpa pustaka
   luar. Cakupannya sengaja dibatasi pada yang benar-benar dipakai:
   mode byte, tingkat koreksi galat L, versi 1–4. Dalam rentang itu
   tiap versi hanya punya satu blok data, sehingga tidak perlu
   penjalinan blok — bagian tersulit pada QR ukuran besar.

   Keluarannya QR sungguhan: dipindai aplikasi kamera bawaan ponsel,
   ia terbaca. Yang tidak bisa dilakukan prototipe ini adalah
   MEMBACA QR lewat kamera, sebab itu menuntut pustaka pemindai.
   ============================================================ */
(function () {
  /* Versi 1–4 pada tingkat koreksi L: [ukuran, kapasitas byte,
     jumlah codeword data, jumlah codeword koreksi]. */
  const VERSI = {
    1: { n: 21, kapasitas: 17, data: 19, ec: 7,  align: []       },
    2: { n: 25, kapasitas: 32, data: 34, ec: 10, align: [6, 18]  },
    3: { n: 29, kapasitas: 53, data: 55, ec: 15, align: [6, 22]  },
    4: { n: 33, kapasitas: 78, data: 80, ec: 20, align: [6, 26]  },
  };

  /* Informasi format (15 bit) untuk tingkat L, mask 0–7. Nilainya
     tetap, jadi ditabelkan alih-alih dihitung ulang tiap kali. */
  const FORMAT_L = [
    '111011111000100', '111001011110011', '111110110101010', '111100010011101',
    '110011000101111', '110001100011000', '110110001000001', '110100101110110',
  ];

  /* ---------- aritmetika GF(256) untuk Reed–Solomon ---------- */
  const EXP = new Uint8Array(512);
  const LOG = new Uint8Array(256);
  (function siapkanTabel() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;           // polinomial primitif QR
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();

  const kali = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

  /** Polinomial pembangkit berderajat `derajat`. */
  function polinomial(derajat) {
    let g = [1];
    for (let i = 0; i < derajat; i++) {
      const baru = new Array(g.length + 1).fill(0);
      for (let j = 0; j < g.length; j++) {
        baru[j] ^= kali(g[j], EXP[i]);
        baru[j + 1] ^= g[j];
      }
      g = baru;
    }
    return g;
  }

  function koreksiGalat(data, jumlahEc) {
    /* `polinomial` menyusun koefisien dari derajat terkecil, sedangkan
       pembagian LFSR di bawah menuntut koefisien terbesar lebih dulu.
       Tanpa pembalikan ini, byte koreksinya salah — dan QR-nya tetap
       tampak wajar, hanya saja pemindai menolaknya. */
    const g = polinomial(jumlahEc).reverse();
    const sisa = new Array(jumlahEc).fill(0);
    data.forEach((byte) => {
      const faktor = byte ^ sisa[0];
      sisa.shift();
      sisa.push(0);
      for (let i = 0; i < jumlahEc; i++) sisa[i] ^= kali(g[i + 1], faktor);
    });
    return sisa;
  }

  /* ---------- penyusunan bit data ---------- */
  function susunData(teks, versi) {
    const v = VERSI[versi];
    const byte = [];
    for (const ch of unescape(encodeURIComponent(teks))) byte.push(ch.charCodeAt(0));

    let bit = '0100';                                   // mode byte
    bit += byte.length.toString(2).padStart(8, '0');    // panjang (versi 1–9)
    byte.forEach((b) => { bit += b.toString(2).padStart(8, '0'); });

    const kapasitasBit = v.data * 8;
    bit += '0'.repeat(Math.min(4, kapasitasBit - bit.length));   // terminator
    bit += '0'.repeat((8 - (bit.length % 8)) % 8);               // rapatkan ke byte

    const kata = [];
    for (let i = 0; i < bit.length; i += 8) kata.push(parseInt(bit.slice(i, i + 8), 2));
    /* Isi sisanya dengan dua byte pengganjal yang bergantian. */
    const ganjal = [0xec, 0x11];
    let g = 0;
    while (kata.length < v.data) kata.push(ganjal[g++ % 2]);

    return kata.concat(koreksiGalat(kata, v.ec));
  }

  /* ---------- penempatan modul ----------
     `dipesan` menandai modul milik pola fungsi dan informasi format.
     Tanpa penanda ini, mask akan ikut membalik pola pencari dan pola
     waktu — dan QR-nya berhenti terbaca sama sekali. */
  function kerangka(versi) {
    const n = VERSI[versi].n;
    const m = Array.from({ length: n }, () => new Array(n).fill(0));
    const dipesan = Array.from({ length: n }, () => new Array(n).fill(false));
    const pasang = (r, c, v) => {
      if (r < 0 || r >= n || c < 0 || c >= n) return;
      m[r][c] = v; dipesan[r][c] = true;
    };

    /* pola pencari di tiga sudut, beserta pemisahnya */
    [[0, 0], [0, n - 7], [n - 7, 0]].forEach(([br, bc]) => {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const di = r >= 0 && r <= 6 && c >= 0 && c <= 6;
          const gelap = di && ((r === 0 || r === 6 || c === 0 || c === 6) ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          pasang(br + r, bc + c, gelap ? 1 : 0);
        }
      }
    });

    /* pola penyelaras (versi >= 2) */
    const a = VERSI[versi].align;
    a.forEach((r) => a.forEach((c) => {
      if (dipesan[r][c]) return;                       // bentrok dengan pola pencari
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          pasang(r + dr, c + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1 ? 1 : 0);
        }
      }
    }));

    /* pola waktu */
    for (let i = 8; i < n - 8; i++) {
      const v = i % 2 === 0 ? 1 : 0;
      if (!dipesan[6][i]) pasang(6, i, v);
      if (!dipesan[i][6]) pasang(i, 6, v);
    }

    /* sisakan tempat bagi informasi format (diisi belakangan) */
    for (let i = 0; i < 15; i++) {
      if (i < 6) dipesan[i][8] = true;
      else if (i < 8) dipesan[i + 1][8] = true;
      else dipesan[n - 15 + i][8] = true;
      if (i < 8) dipesan[8][n - i - 1] = true;
      else if (i < 9) dipesan[8][15 - i] = true;
      else dipesan[8][14 - i] = true;
    }
    dipesan[n - 8][8] = true;                          // modul gelap tetap
    m[n - 8][8] = 1;

    return { m, dipesan };
  }

  /** Isi modul data secara zigzag dari kanan bawah ke atas. */
  function isiData(m, dipesan, kata) {
    const n = m.length;
    let bit = '';
    kata.forEach((k) => { bit += k.toString(2).padStart(8, '0'); });
    let i = 0, naik = true;

    for (let kolom = n - 1; kolom > 0; kolom -= 2) {
      if (kolom === 6) kolom--;                        // lewati pola waktu tegak
      for (let langkah = 0; langkah < n; langkah++) {
        const baris = naik ? n - 1 - langkah : langkah;
        for (const c of [kolom, kolom - 1]) {
          if (dipesan[baris][c]) continue;
          m[baris][c] = i < bit.length ? Number(bit[i]) : 0;
          i++;
        }
      }
      naik = !naik;
    }
  }

  const rumusMask = [
    (r, c) => (r + c) % 2 === 0,
    (r) => r % 2 === 0,
    (r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
  ];

  /** Nilai denda menurut empat aturan baku; makin kecil makin baik. */
  function denda(m) {
    const n = m.length;
    let d = 0;

    const deret = (ambil) => {
      for (let a = 0; a < n; a++) {
        let hitung = 1;
        for (let b = 1; b < n; b++) {
          if (ambil(a, b) === ambil(a, b - 1)) hitung++;
          else { if (hitung >= 5) d += 3 + (hitung - 5); hitung = 1; }
        }
        if (hitung >= 5) d += 3 + (hitung - 5);
      }
    };
    deret((r, c) => m[r][c]);
    deret((c, r) => m[r][c]);

    for (let r = 0; r < n - 1; r++) {
      for (let c = 0; c < n - 1; c++) {
        const v = m[r][c];
        if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) d += 3;
      }
    }

    const pola = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
    for (let a = 0; a < n; a++) {
      for (let b = 0; b <= n - 11; b++) {
        if (pola.every((p, i) => m[a][b + i] === p)) d += 40;
        if (pola.every((p, i) => m[b + i][a] === p)) d += 40;
      }
    }

    let gelap = 0;
    m.forEach((baris) => baris.forEach((v) => { if (v) gelap++; }));
    d += Math.floor(Math.abs((gelap * 100) / (n * n) - 50) / 5) * 10;
    return d;
  }

  /* Penempatan bit format mengikuti tata letak baku: satu salinan
     mengelilingi pola pencari kiri-atas, satu lagi terbelah di dua
     sudut lain — supaya tetap terbaca walau satu sudut rusak. */
  function terapkanFormat(m, mask) {
    const n = m.length;
    const f = FORMAT_L[mask];
    for (let i = 0; i < 15; i++) {
      const b = Number(f[14 - i]);                     // bit ke-i, dari yang terkecil
      if (i < 6) m[i][8] = b;
      else if (i < 8) m[i + 1][8] = b;
      else m[n - 15 + i][8] = b;

      if (i < 8) m[8][n - i - 1] = b;
      else if (i < 9) m[8][15 - i] = b;
      else m[8][14 - i] = b;
    }
    m[n - 8][8] = 1;                                   // modul gelap tetap
  }

  /** Bangun matriks QR akhir: 1 = gelap, 0 = terang. */
  function matriks(teks) {
    const panjang = unescape(encodeURIComponent(teks)).length;
    const versi = Object.keys(VERSI).map(Number).find((v) => panjang <= VERSI[v].kapasitas);
    if (!versi) throw new Error('Teks terlalu panjang untuk QR versi 1-4.');

    const kata = susunData(teks, versi);
    let terbaik = null, dendaTerbaik = Infinity;

    for (let mask = 0; mask < 8; mask++) {
      const { m, dipesan } = kerangka(versi);
      isiData(m, dipesan, kata);
      for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m.length; c++) {
          if (!dipesan[r][c] && rumusMask[mask](r, c)) m[r][c] ^= 1;
        }
      }
      terapkanFormat(m, mask);
      const d = denda(m);
      if (d < dendaTerbaik) { dendaTerbaik = d; terbaik = m; }
    }
    return terbaik;
  }

  /** QR sebagai data-URI SVG, siap dipasang pada <img> maupun diunduh. */
  function svgDataUri(teks, { tepi = 4, gelap = '#0E2E1C', terang = '#ffffff' } = {}) {
    const m = matriks(teks);
    const n = m.length;
    const total = n + tepi * 2;
    let d = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (m[r][c]) d += `M${c + tepi} ${r + tepi}h1v1h-1z`;
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">`
      + `<rect width="${total}" height="${total}" fill="${terang}"/>`
      + `<path d="${d}" fill="${gelap}"/></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  window.QR = { matriks, svgDataUri };
})();
