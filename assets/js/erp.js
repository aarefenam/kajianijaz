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
  rumah:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9.7V20h13V9.7"/><path d="M9.8 20v-6h4.4v6"/></svg>',
  agenda:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/></svg>',
  piala:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5.5H4.5v1A3.5 3.5 0 0 0 7.6 10M17 5.5h2.5v1a3.5 3.5 0 0 1-3.1 3.5"/><path d="M12 14v3M9 20h6M10 17h4"/></svg>',
  obrolan:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 12.5c0 4-3.8 7.2-8.5 7.2a10 10 0 0 1-2.6-.34L4.5 21l1.2-3.5A6.9 6.9 0 0 1 3.5 12.5c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2z"/><path d="M9 11.5h6M9 14.5h3.5"/></svg>',
  bagan:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="12" width="3.3" height="5"/><rect x="12.3" y="8.5" width="3.3" height="8.5"/><rect x="17.6" y="5.5" width="3.3" height="11.5"/></svg>',
  gerigi:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.1"/><path d="M19.4 14.5a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-1 1.47V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1.05-1.47 1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.47-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.47-1.05 1.6 1.6 0 0 0-.32-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.6 1.6 0 0 0 1.77.32H9a1.6 1.6 0 0 0 1-1.47V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.6 1.6 0 0 0-.32 1.77V9a1.6 1.6 0 0 0 1.47 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.47 1z"/></svg>',
  unduh:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7.5 11 4.5 4.5 4.5-4.5"/><path d="M4.5 20.5h15"/></svg>',
  kanan:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  amplopTurun:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7.5"/><path d="m3 11.5 9 5.5 9-5.5"/><path d="M12 3v7"/><path d="m9 7.5 3 3 3-3"/></svg>',
  sk:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5"/><path d="M14 3v5h5V8"/><circle cx="17.5" cy="15" r="3.2"/><path d="m15.6 17.6-.6 3.9 2.5-1.4 2.5 1.4-.6-3.9"/><path d="M8.5 9h2M8.5 12.5h4"/></svg>',
  baki:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13.5h4.2l1.4 2.6h6.8l1.4-2.6H21"/><path d="M5.4 5.2 3 13.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.5l-2.4-8.3A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.9 1.2z"/></svg>',
  pena:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 4.5 19 11 9.5 20.5H3v-6.5z"/><path d="M15.5 7.5 5 18M3 21.5h18"/></svg>',
  wisuda:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2.5 8.5 9.5-4.5 9.5 4.5-9.5 4.5z"/><path d="M6.5 10.5v5c0 1.9 2.5 3.2 5.5 3.2s5.5-1.3 5.5-3.2v-5"/><path d="M21.5 8.5v6"/></svg>',
  tautan:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13.5a4 4 0 0 0 5.7.3l3-3a4 4 0 0 0-5.7-5.7L11.3 6.8"/><path d="M14 10.5a4 4 0 0 0-5.7-.3l-3 3a4 4 0 0 0 5.7 5.7l1.7-1.7"/></svg>',
  panahLuar:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M8 16 16 8M9 8h7v7"/></svg>',
  sasaran:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/><path d="M12 3.5V1M12 23v-2.5M3.5 12H1M23 12h-2.5"/></svg>',
  dokCek:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="m8.5 14 2.4 2.4 4.6-4.8"/></svg>',
  tag:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12.6V5a2 2 0 0 1 2-2h7.6a2 2 0 0 1 1.4.6l6.4 6.4a2 2 0 0 1 0 2.8l-7.6 7.6a2 2 0 0 1-2.8 0L3.6 14a2 2 0 0 1-.6-1.4z"/><circle cx="8.2" cy="8.2" r="1.6"/></svg>',
  ukur:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 18a9.6 9.6 0 1 1 16.8 0"/><path d="m12 14 4.2-4.6"/><circle cx="12" cy="15.4" r="1.6"/></svg>',
  buku:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5A2 2 0 0 1 6 3h13v14.5H6a2 2 0 0 0-2 2z"/><path d="M4 19.5A2 2 0 0 0 6 21.5h13v-4"/><path d="M8 7.5h7M8 11h5"/></svg>',
  orangGerigi:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="7.5" r="3.8"/><path d="M3 20c0-3.9 3.2-6 7-6h.6"/><circle cx="17.5" cy="17.5" r="2.6"/><path d="M17.5 13.6v1.3M17.5 20.1v1.3M21.4 17.5h-1.3M14.9 17.5h-1.3M20.3 14.7l-.9.9M15.6 19.4l-.9.9M20.3 20.3l-.9-.9M15.6 15.6l-.9-.9"/></svg>',
  klip:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2.2"/><path d="M9 4.2A1.8 1.8 0 0 1 10.8 2.5h2.4A1.8 1.8 0 0 1 15 4.2v1.1H9z"/><path d="M9 11h6M9 15h4"/></svg>',
  penaKotak:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><path d="M17.5 3.5a2 2 0 0 1 2.9 2.8L13 13.8l-3.4.9.9-3.4z"/></svg>',
  kotakProduksi:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.6 12 4l9 4.6v6.8L12 20l-9-4.6z"/><path d="m3 8.6 9 4.6 9-4.6M12 13.2V20"/><path d="m7.5 6.3 9 4.6"/></svg>',
  map:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5A2 2 0 0 1 5 5.5h3.7a2 2 0 0 1 1.5.7l1.1 1.3H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  alurKerja:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 12a8.5 8.5 0 0 1-14.6 5.9L3.5 20"/><path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9L20.5 4"/><path d="M20.5 4v4h-4M3.5 20v-4h4"/></svg>',
  simpul:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.4"/><circle cx="5.5" cy="18" r="2.4"/><circle cx="18.5" cy="18" r="2.4"/><path d="M10.6 7.1 6.9 15.6M13.4 7.1l3.7 8.5M8 18h8"/></svg>',
  galeri:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="14" height="12" rx="2.2"/><path d="M7 3.5h12A2 2 0 0 1 21 5.5v11"/><circle cx="7.8" cy="10.2" r="1.4"/><path d="m3.6 16.4 3.9-3.4 3 2.6 2.4-2 4.1 3.4"/></svg>',
  videoIk:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="14" height="14" rx="2.5"/><path d="m16.5 10.5 5-2.8v8.6l-5-2.8z"/><path d="m8 9.6 3.6 2.4L8 14.4z"/></svg>',
  analitik:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.8"/><path d="m15.4 15.4 5.1 5.1"/><path d="M8 12.2v-2M10.5 12.2V8M13 12.2v-3"/></svg>',
  naik:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 15 7-7 7 7"/></svg>',
  turun:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 9 7 7 7-7"/></svg>',
  petir:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 2 4 13.5h6.5L10 22l9.5-11.5H13z"/></svg>',
  unggahAwan:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.8 18.5A4.3 4.3 0 0 1 7 10a5.6 5.6 0 0 1 10.7 1.4 3.8 3.8 0 0 1-.7 7.1"/><path d="M12 21v-8M9 15.5 12 12.5l3 3"/></svg>',
  basisData:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5.6" rx="7.5" ry="3.1"/><path d="M4.5 5.6v12.8c0 1.7 3.4 3.1 7.5 3.1s7.5-1.4 7.5-3.1V5.6"/><path d="M4.5 12c0 1.7 3.4 3.1 7.5 3.1s7.5-1.4 7.5-3.1"/></svg>',
  palet:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 1 9-9c0 2-1.6 3-3.2 3H16a2 2 0 0 0-1.5 3.3A2 2 0 0 1 12 21z"/><circle cx="7.8" cy="12" r="1.1" fill="currentColor"/><circle cx="10" cy="8" r="1.1" fill="currentColor"/><circle cx="14.5" cy="8" r="1.1" fill="currentColor"/></svg>',
  qr:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><path d="M14 14h3v3h-3zM20 14h1M14 20h3M20 17v4"/></svg>',
  lonceng:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8.6a6 6 0 1 0-12 0c0 6-2.4 7.4-2.4 7.4h16.8S18 14.6 18 8.6z"/><path d="M13.7 20a2 2 0 0 1-3.4 0"/></svg>',
  daftarCek:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6h11M10 12h11M10 18h11"/><path d="m3 6 1.6 1.6L7.4 4.8M3 15.6 4.6 17.2 7.4 14.4"/></svg>',
  papan:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v4M8 21h8M7.5 12.5l3-3 2.5 2.5 3.5-4"/></svg>',
  unduhKotak:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 7.5v7M8.8 11.3 12 14.5l3.2-3.2"/><path d="M8 17.5h8"/></svg>',
  masukKas:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5v11"/><path d="m7.8 10.3 4.2 4.2 4.2-4.2"/><path d="M4 17.5v1.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5"/></svg>',
  keluarKas:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5v-11"/><path d="m7.8 13.7 4.2-4.2 4.2 4.2"/><path d="M4 6.5V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.5"/></svg>',
  hadiah:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M2.5 9h19M12 9v12"/><path d="M12 9S10.5 3.5 8 3.5A2.2 2.2 0 0 0 8 9zM12 9s1.5-5.5 4-5.5A2.2 2.2 0 0 1 16 9z"/></svg>',
  timbang:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M7 20h10M5.5 6.5 12 5l6.5 1.5"/><path d="M2.5 14 5.5 7l3 7a3 3 0 0 1-6 0zM15.5 14l3-7 3 7a3 3 0 0 1-6 0z"/></svg>',
  dompet:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8V6.5a2 2 0 0 0-2-2H5.5A1.5 1.5 0 0 0 4 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5"/><path d="M21 9.5h-4.5a2.5 2.5 0 0 0 0 5H21z"/></svg>',
  panahKanan:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg>',
};

/* ---------------- util ---------------- */
const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const rp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
const tgl = (s) => s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const tglJam = (s) => new Date(s).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const tglPanjang = (d = new Date()) => d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const nowTanggal = () => new Date().toISOString().slice(0, 10);
const tglRingkas = (d = new Date()) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const namaHari = (d = new Date()) => d.toLocaleDateString('id-ID', { weekday: 'long' });
const namaBulan = (b) => new Date(b + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

/** Nomor WA disamarkan empat digit terakhir di tabel. Nomor utuh tetap
    tersimpan dan tampil di form sunting — daftar pengurus kerap dibuka
    sambil dipresentasikan, jadi jangan telanjangkan kontak pribadi. */
const samarWa = (s) => {
  const t = String(s ?? '').trim();
  const m = t.match(/^(.*?)\s*(\d{4})$/);
  return m ? m[1] + '****' : t;
};

/* Siluet masjid penutup sidebar Ketua. Digambar sebagai SVG sebaris
   agar ikut berubah warna mengikuti teks sidebar dan tetap tajam. */
const siluetMasjid = () => `<svg class="sb-masjid" viewBox="0 0 240 86" fill="currentColor" aria-hidden="true">
  <!-- menara tepi -->
  <path d="M8 86V58h8v28zM7 58q0-6 5-9 5 3 5 9z"/>
  <path d="M224 86V58h8v28zM223 58q0-6 5-9 5 3 5 9z"/>
  <!-- menara utama -->
  <path d="M29 86V44h10v42zM28 44q0-8 6-12 6 4 6 12z"/><circle cx="34" cy="27" r="2"/>
  <path d="M201 86V44h10v42zM200 44q0-8 6-12 6 4 6 12z"/><circle cx="206" cy="27" r="2"/>
  <!-- kubah samping -->
  <path d="M57 62h38v24H57zM59 62c0-10 9-12 17-22 8 10 17 12 17 22z"/>
  <path d="M145 62h38v24h-38zM147 62c0-10 9-12 17-22 8 10 17 12 17 22z"/>
  <!-- kubah utama -->
  <path d="M92 56h56v30H92zM94 56c0-15 14-18 26-34 12 16 26 19 26 34z"/>
  <path d="M118.8 20h2.4v-8h-2.4z"/><circle cx="120" cy="17" r="2.6"/>
  <!-- lantai -->
  <path d="M0 80h240v6H0z"/>
</svg>`;

function toast(pesan, galat = false) {
  let box = document.querySelector('.toast-erp-tempat');
  if (!box) { box = el('<div class="toast-erp-tempat"></div>'); document.body.appendChild(box); }
  const t = el(`<div class="toast-erp${galat ? ' galat' : ''}">${galat ? I.peringatan : I.cekBulat}<span>${esc(pesan)}</span></div>`);
  box.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(26px)'; setTimeout(() => t.remove(), 260); }, 4200);
}

/* ---------------- identitas visual ----------------
   ERP sengaja memakai versi TAYANG (Store.cms), bukan draft. Kalau ia
   memakai draft, PJ Website bisa mengubah tampilan panel yang dipakai
   seluruh pengurus tanpa melewati persetujuan — persis celah yang
   hendak ditutup aturan dua kunci. Hasil kerjanya tetap terlihat
   sebagai pratinjau di halaman Tema & Identitas.                      */
const lambang = (px) =>
  `<img src="${Store.cms.situs.logo}" alt="Lambang ${esc(Store.cms.situs.nama)}" style="width:${px}px;height:${px}px;object-fit:contain">`;

/* ERP memakai font dari tema TAYANG, sama seperti lambangnya. Dengan
   begitu "ganti font seluruh situs" benar-benar berarti seluruhnya —
   halaman publik dan panel pengurus sekaligus. */
function terapkanFontErp() {
  const t = Store.cms.theme || {};
  const r = document.documentElement.style;
  const utama = FONT.tumpuk('utama', t.fontUtama);
  r.setProperty('--e-font', utama);
  r.setProperty('--e-font-aksen', FONT.tumpuk('aksen', t.fontAksen) || utama);
  r.setProperty('--e-font-arab', FONT.tumpuk('arab', t.fontArab));
  FONT.muat({ utama: t.fontUtama, aksen: t.fontAksen, arab: t.fontArab });
}

function terapkanFaviconErp() {
  const url = Store.cms.situs.faviconErp;
  if (!url) return;
  document.querySelectorAll('link[rel~="icon"]').forEach((l) => l.remove());
  const l = document.createElement('link');
  l.rel = 'icon';
  l.href = url;
  document.head.appendChild(l);
}

/** Bungkus aksi agar setiap penolakan RBAC tampil rapi, bukan crash. */
function aman(fn) {
  try { fn(); return true; }
  catch (e) { toast(e.message, true); return false; }
}

/** Sama, untuk aksi yang menunggu server — masuk, ganti sandi, unggah.
    Tombolnya dimatikan selama menunggu supaya tak terkirim dua kali. */
async function amanTunggu(tombol, fn) {
  const labelAsli = tombol?.textContent;
  if (tombol) { tombol.disabled = true; tombol.textContent = 'Mohon tunggu…'; }
  try { return await fn(); }
  catch (e) { toast(e.message, true); return null; }
  finally { if (tombol) { tombol.disabled = false; tombol.textContent = labelAsli; } }
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

/* Ketua Umum memakai ruang kerja tersendiri: sidebar datar berisi
   lima daftar kepengurusan. Modul lama tidak dihapus, hanya dilipat
   ke halaman Pengaturan — termasuk Persetujuan, sehingga alur dua
   kunci "PJ Website mengajukan, Ketua menayangkan" tetap utuh. */
const ruangKetua = () => RBAC.can(U, 'organisasi.manage');
const ruangSekretaris = () => RBAC.can(U, 'sekretariat.manage');
const ruangRedaksi = () => RBAC.can(U, 'redaksi.manage');
const ruangBuku = () => RBAC.can(U, 'buku.manage');
const ruangMediaWeb = () => RBAC.can(U, 'mediaweb.manage');
const ruangKoordinator = () => RBAC.can(U, 'koordinator.manage');
const ruangBendahara = () => RBAC.can(U, 'bendahara.manage');
/** Peran yang punya ruang kerja sendiri — modul lama dilipat ke Pengaturan. */
const ruangKhusus = () => ruangKetua() || ruangSekretaris() || ruangRedaksi()
  || ruangBuku() || ruangMediaWeb() || ruangKoordinator() || ruangBendahara();

/* ============================================================
   MENU — tiap entri dijaga izin. Menu tidak muncul kalau tak berhak.
   Entri ber-`lipat` disembunyikan dari sidebar Ketua karena sudah
   tersedia sebagai tab di dalam Pengaturan.
   ============================================================ */
const MENU = [
  { grup: 'Ringkasan', lipat: true },
  { grup: 'Dashboard', izin: ['redaksi.manage'] },
  { grup: 'Ringkasan', izin: ['buku.manage', 'bendahara.manage'] },
  { grup: 'Menu Utama', izin: ['mediaweb.manage', 'koordinator.manage'] },
  { id: 'dasbor',    label: () => ruangKetua() ? 'Dashboard Ketua Umum' : ruangBuku() ? 'Dashboard' : 'Dasbor',
    ikon: () => ruangKetua() ? I.rumah : I.dasbor, izin: null },

  /* --- ruang kerja Ketua Umum --- */
  { id: 'pengurus',    label: 'Data Pengurus',                ikon: I.grup,    izin: ['organisasi.manage'] },
  { id: 'koordinator', label: 'Koordinator Kajian',           ikon: I.orang,   izin: ['organisasi.manage'] },
  { id: 'kaleidoskop', label: 'Kaleidoskop Kegiatan & Program',ikon: I.agenda, izin: ['organisasi.manage'] },
  { id: 'pencapaian',  label: 'Pencapaian / Achievement',     ikon: I.piala,   izin: ['organisasi.manage'] },
  { id: 'evaluasi',    label: 'Evaluasi & Masukan',           ikon: I.obrolan, izin: ['organisasi.manage'] },
  { id: 'laporan',     label: 'Laporan & Ringkasan',          ikon: I.bagan,   izin: ['organisasi.report'] },

  /* --- ruang kerja Sekretaris --- */
  { grup: 'Pengelolaan Surat', izin: ['sekretariat.manage'] },
  { id: 'surat-internal',  label: 'Surat Internal',  ikon: I.amplopTurun, izin: ['sekretariat.manage'] },
  { id: 'surat-eksternal', label: 'Surat Eksternal', ikon: I.surat,       izin: ['sekretariat.manage'] },
  { id: 'surat-keputusan', label: 'Surat Keputusan', ikon: I.sk,          izin: ['sekretariat.manage'],
    anak: [
      { id: 'sk-mulai',          label: 'SK Mulai Kajian'   },
      { id: 'sk-tawaquf',        label: 'SK Tawaquf Kajian' },
      { id: 'sk-anggota-aktif',  label: 'SK Anggota Aktif'  },
      { id: 'sk-anggota-keluar', label: 'SK Anggota Keluar' },
      { id: 'sk-alumni',         label: 'SK Alumni'         },
    ] },
  { id: 'surat-masuk',  label: 'Surat Masuk',  ikon: I.baki,   izin: ['sekretariat.manage'] },
  { id: 'surat-keluar', label: 'Surat Keluar', ikon: I.kirim,  izin: ['sekretariat.manage'] },

  { grup: 'Dokumen & Arsip', izin: ['sertifikat.manage', 'ttd.manage'] },
  { id: 'sertifikat', label: 'Sertifikat',            ikon: I.dok,  izin: ['sertifikat.manage'] },
  { id: 'ttd',        label: 'Kumpulan Tanda Tangan', ikon: I.pena, izin: ['ttd.manage'] },

  { grup: 'Data & Keanggotaan', izin: ['sekretariat.manage'] },
  { id: 'anggota-angkatan', label: 'Data Anggota Perangkatan', ikon: I.grup,   izin: ['sekretariat.manage'] },
  { id: 'alumni',           label: 'Data Alumni',              ikon: I.wisuda, izin: ['sekretariat.manage'] },

  { grup: 'Arsip Penulisan', izin: ['arsip.view'] },
  { id: 'arsip', label: 'Link Arsip Kepenulisan', ikon: I.tautan, izin: ['arsip.view'] },

  /* --- ruang kerja PJ Artikel --- */
  { grup: 'Manajemen Artikel', izin: ['redaksi.manage'] },
  { id: 'daftar-artikel',  label: 'Daftar Artikel',      ikon: I.dok,    izin: ['redaksi.manage'] },
  { id: 'artikel-masuk',   label: 'Artikel Masuk',       ikon: I.dokCek, izin: ['redaksi.manage'],
    lonceng: () => Store.db.artikel.filter((a) => a.status === 'review').length },
  { id: 'artikel-terbit',  label: 'Artikel Dipublikasi', ikon: I.agenda, izin: ['redaksi.manage'] },
  { id: 'kategori-artikel',label: 'Kategori Artikel',    ikon: I.tag,    izin: ['cms.kategori.edit'] },

  { grup: 'Monitoring & Target', izin: ['redaksi.manage'] },
  { id: 'target-artikel', label: 'Target Artikel',   ikon: I.sasaran, izin: ['redaksi.manage'] },
  { id: 'performa',       label: 'Performa Anggota', ikon: I.ukur,    izin: ['redaksi.manage'] },
  { id: 'rekap',          label: 'Rekap Bulanan',    ikon: I.bagan,   izin: ['redaksi.manage'] },

  /* --- ruang kerja PJ Buku --- */
  { id: 'buku-perencanaan', label: 'Perencanaan',           ikon: I.klip,          izin: ['buku.manage'] },
  { id: 'buku-tugas',       label: 'Pembagian Tugas',       ikon: I.grup,          izin: ['buku.manage'] },
  { id: 'buku-penulisan',   label: 'Penulisan',             ikon: I.penaKotak,     izin: ['buku.manage'] },
  { id: 'buku-editing',     label: 'Editing',               ikon: I.dokCek,        izin: ['buku.manage'] },
  { id: 'buku-layout',      label: 'Layouting & Desain',    ikon: I.layout,        izin: ['buku.manage'] },
  { id: 'buku-produksi',    label: 'Produksi & Distribusi', ikon: I.kotakProduksi, izin: ['buku.manage'] },
  { id: 'buku-keuangan',    label: 'Keuangan Buku',         ikon: I.uang,          izin: ['buku.anggaran'] },
  { id: 'buku-arsip',       label: 'Dokumen & Arsip',       ikon: I.map,           izin: ['buku.arsip'] },

  /* --- ruang kerja PJ Media & Website --- */
  { id: 'konten-web',   label: 'Konten Website',     ikon: I.layout,   izin: ['mediaweb.manage'] },
  { id: 'artikel-web',  label: 'Artikel & Publikasi',ikon: I.dok,      izin: ['artikel.view'] },
  { id: 'agenda-event', label: 'Agenda & Event',     ikon: I.agenda,   izin: ['mediaweb.manage'] },
  { id: 'sosmed',       label: 'Media Sosial',       ikon: I.simpul,   izin: ['mediaweb.manage'] },
  { id: 'galeri',       label: 'Galeri Media',       ikon: I.galeri,   izin: ['mediaweb.manage'] },
  { id: 'desain-web',   label: 'Desain & Kreatif',   ikon: I.pena,     izin: ['mediaweb.manage'] },
  { id: 'video',        label: 'Video & Podcast',    ikon: I.videoIk,  izin: ['mediaweb.manage'] },
  { id: 'pengunjung',   label: 'Pengunjung Website', ikon: I.grup,     izin: ['analitik.view'] },
  { id: 'komentar',     label: 'Komentar & Pesan',   ikon: I.obrolan,  izin: ['pesan.read'], tersembunyiBila: () => !ruangMediaWeb(),
    lonceng: () => Store.db.pesan.filter((p) => !p.dibaca).length },
  { id: 'seo',          label: 'SEO & Analytics',    ikon: I.analitik, izin: ['seo.manage'] },
  { id: 'atur-web',     label: 'Pengaturan Website', ikon: I.gerigi,   izin: ['mediaweb.manage'] },
  { id: 'akun-web',     label: 'Manajemen User',     ikon: I.orang,    izin: ['user.view'] },
  { id: 'kalender',     label: 'Kalender Konten',    ikon: I.kalender, izin: ['mediaweb.manage'], tersembunyi: true },

  /* --- ruang kerja PJ Koordinator Kajian --- */
  { id: 'jadwal-kajian', label: 'Jadwal Kajian',   ikon: I.kalender,  izin: ['koordinator.manage'] },
  { id: 'anggota-kajian',label: 'Data Anggota',    ikon: I.grup,      izin: ['anggota.kelompok'] },
  { id: 'presensi',      label: 'Presensi Kajian', ikon: I.daftarCek, izin: ['kajian.attendance'], tersembunyiBila: () => !ruangKoordinator() },
  { id: 'tugas-kajian',  label: 'Pembagian Tugas', ikon: I.orang,     izin: ['koordinator.manage'] },
  { id: 'materi',        label: 'Materi & PPT',    ikon: I.papan,     izin: ['kajian.materi'] },
  { id: 'notulen',       label: 'Revisi & Notulen',ikon: I.dok,       izin: ['kajian.notulensi'], tersembunyiBila: () => !ruangKoordinator() },
  { id: 'rekap-kajian',  label: 'Rekap Kajian',    ikon: I.bagan,     izin: ['koordinator.manage'] },
  { id: 'statistik',     label: 'Statistik',       ikon: I.ukur,      izin: ['koordinator.manage'] },
  { id: 'notifikasi',    label: 'Notifikasi',      ikon: I.lonceng,   izin: ['koordinator.manage'],
    lonceng: () => notifikasiKajian().filter((n) => n.penting).length },
  { id: 'atur-kajian',   label: 'Pengaturan',      ikon: I.gerigi,    izin: ['koordinator.manage'] },
  { id: 'kartu-qr',      label: 'Kartu QR Anggota',ikon: I.qr,        izin: ['koordinator.manage'], tersembunyi: true },

  /* --- ruang kerja Bendahara --- */
  { grup: 'Keuangan', izin: ['bendahara.manage'] },
  { id: 'masuk-internal',  label: 'Pemasukan Internal',  ikon: I.masukKas,   izin: ['bendahara.manage'] },
  { id: 'masuk-eksternal', label: 'Pemasukan Eksternal', ikon: I.hadiah,     izin: ['bendahara.manage'] },
  { id: 'pengeluaran',     label: 'Pengeluaran',         ikon: I.keluarKas,  izin: ['bendahara.manage'] },
  { id: 'saldo',           label: 'Saldo Keseluruhan',   ikon: I.timbang,    izin: ['bendahara.manage'] },
  { id: 'laporan-kas',     label: 'Laporan Keuangan',    ikon: I.dok,        izin: ['keuangan.report'], tersembunyiBila: () => !ruangBendahara() },
  { grup: 'Pengaturan', izin: ['bendahara.manage'] },
  { id: 'kategori-akun',   label: 'Kategori & Akun',     ikon: I.dompet,     izin: ['keuangan.akun'] },

  { grup: 'Pengaturan', izin: ['redaksi.manage'] },
  { id: 'akun',    label: 'Pengaturan Akun', ikon: I.orangGerigi, izin: ['redaksi.manage'] },
  { id: 'panduan', label: 'Panduan Penulis', ikon: I.buku,        izin: ['redaksi.manage'] },

  { grup: 'Sistem', izin: ['sekretariat.manage'] },
  { id: 'pengaturan',  label: 'Pengaturan',                   ikon: I.gerigi,  izin: ['organisasi.manage', 'sekretariat.manage'],
    lonceng: () => Store.db.pengajuan.filter((p) => p.status === 'menunggu').length },

  { grup: 'Website (CMS)', izin: ['cms.page.edit', 'cms.theme.edit', 'cms.approve', 'cms.media.upload'], lipat: true },
  { id: 'cms',       label: 'Editor Halaman',    ikon: I.layout,   izin: ['cms.page.edit'], lipat: true },
  { id: 'tema',      label: 'Tema & Identitas',  ikon: I.kuas,     izin: ['cms.theme.edit'], lipat: true },
  { id: 'pengajuan', label: 'Persetujuan',       ikon: I.cek,      izin: ['cms.approve', 'cms.submit'], lipat: true, lonceng: () => Store.db.pengajuan.filter((p) => p.status === 'menunggu').length },
  { id: 'versi',     label: 'Riwayat Versi',     ikon: I.riwayat,  izin: ['cms.rollback'], lipat: true },

  { grup: 'Program Kerja', izin: ['artikel.write', 'artikel.review', 'kajian.manage'], lipat: true },
  { id: 'artikel',   label: 'Karya Tulis Ilmiah',ikon: I.dok,      izin: ['artikel.write', 'artikel.review'], lipat: true, pensiun: ['pj_kti'], lonceng: () => RBAC.can(U, 'artikel.review') ? Store.db.artikel.filter((a) => a.status === 'review').length : 0 },
  { id: 'kajian',    label: 'Jadwal Kajian',     ikon: I.kalender, izin: ['kajian.manage', 'kajian.attendance', 'kajian.notulensi'], lipat: true },

  { grup: 'Sekretariat', izin: ['anggota.manage', 'pesan.read', 'surat.manage'], lipat: true },
  { id: 'anggota',   label: 'Data Anggota',      ikon: I.grup,     izin: ['anggota.manage'], lipat: true, pensiun: ['sekretaris'] },
  { id: 'pesan',     label: 'Kotak Masuk',       ikon: I.surat,    izin: ['pesan.read'], lipat: true, lonceng: () => Store.db.pesan.filter((p) => !p.dibaca).length },
  { id: 'surat',     label: 'Arsip Surat',       ikon: I.arsip,    izin: ['surat.manage'], lipat: true, pensiun: ['sekretaris'] },

  { grup: 'Keuangan', izin: ['keuangan.manage', 'keuangan.report'], lipat: true },
  { id: 'keuangan',  label: 'Kas & Iuran',       ikon: I.uang,     izin: ['keuangan.manage', 'keuangan.report'], lipat: true, pensiun: ['bendahara'] },

  { grup: 'Sistem', izin: ['user.manage', 'audit.view'], lipat: true },
  { id: 'akses',     label: 'Hak Akses',         ikon: I.perisai,  izin: ['user.manage'], lipat: true },
  { id: 'log',       label: 'Log Aktivitas',     ikon: I.log,      izin: ['audit.view'], lipat: true },
];

const nilai = (v) => (typeof v === 'function' ? v() : v);
const kunciRoleU = () => RBAC.kunciRole(U?.role);
const bolehMenu = (m) => {
  if (m.pensiun?.includes(U?.role)) return false;   // digantikan modul yang lebih rinci
  if (m.lipat && ruangKhusus()) return false;       // sudah jadi tab di Pengaturan
  return !m.izin || RBAC.canAny(U, m.izin);
};

/** Modul yang dilipat ke Pengaturan — dipakai menyusun daftar tabnya. */
const menuTerlipat = () => MENU.filter((m) =>
  m.lipat && m.id && HAL[m.id] && !m.pensiun?.includes(U?.role) && (!m.izin || RBAC.canAny(U, m.izin)));

/* ============================================================
   LAYAR LOGIN
   ============================================================ */
function layarLogin() {
  const n = el(`<div class="layar-login">
    <div class="login-kiri">
      <div class="login-merek">
        <span class="lambang">${lambang(32)}</span>
        <span><span class="nama">Al-I'jaz</span><br><span class="tag">ERP — Sistem Informasi Organisasi</span></span>
      </div>
      <h1>Satu sistem untuk website<br>dan operasional kajian.</h1>
      <p>Kelola konten website, karya tulis ilmiah, jadwal kajian, keanggotaan, dan keuangan dalam satu tempat — dengan pembagian wewenang yang jelas.</p>
      <div class="demo-akun">
        <div class="demo-judul">Wewenang per jabatan</div>
        ${Object.keys(RBAC.ROLES).map((r) => `<div class="demo-baris" style="cursor:default">
          <span class="demo-titik" style="background:${RBAC.roleColor(r)}"></span>
          <span><span class="demo-nama">${esc(RBAC.roleLabel(r))}</span></span>
          <span class="demo-mail">${RBAC.ROLES[r].permissions.length} wewenang</span>
        </div>`).join('')}
      </div>
    </div>
    <div class="login-kanan"><div class="kotak-login">
      <h2>Masuk ke ERP</h2>
      <p class="sub">Gunakan akun yang diberikan Sekretaris.</p>
      <form id="formLogin">
        <div class="grup"><label>Alamat Email</label><input name="email" type="email" required placeholder="nama@alijaz.id" autocomplete="username"></div>
        <div class="grup"><label>Kata Sandi</label><input name="password" type="password" required autocomplete="current-password"></div>
        <button class="btn btn-lime" style="width:100%;padding:13px" type="submit">Masuk</button>
      </form>
      <p style="font-size:12.4px;color:var(--e-abu);margin-top:20px;text-align:center">
        Lupa kata sandi? Hubungi Sekretaris untuk penyetelan ulang.<br>
        <a href="index.html" style="color:var(--e-hijau);font-weight:700">← Kembali ke website</a>
      </p>
    </div></div>
  </div>`);

  n.querySelector('#formLogin').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const u = await amanTunggu(e.target.querySelector('button[type=submit]'),
      () => Store.login(f.get('email'), f.get('password')));
    if (!u) return;
    U = u;
    rute = 'dasbor';
    gambar();
    toast(`Selamat datang, ${U.nama.split(' ').slice(-1)[0]}.`);
  };
  return n;
}

/* ============================================================
   LAYAR PEMASANGAN
   ------------------------------------------------------------
   Muncul sekali saja: ketika database masih kosong. Data awalnya
   dikirim dari seed.js, dan server menolak bila sudah berisi —
   sehingga tombol ini tidak dapat menimpa data yang sudah dipakai.
   ============================================================ */
function layarPasang() {
  const n = el(`<div class="layar-login">
    <div class="login-kanan" style="grid-column:1/-1"><div class="kotak-login" style="max-width:560px">
      <h2>Pasang data awal</h2>
      <p class="sub">Database sudah tersambung, tetapi masih kosong. Sekali klik, seluruh
        struktur website, daftar pengurus, dan data contoh akan diisikan.</p>
      <div id="hasilPasang"></div>
      <button class="btn btn-lime" style="width:100%;padding:13px" id="btnPasang">Pasang sekarang</button>
      <p style="font-size:12.4px;color:var(--e-abu);margin-top:18px;line-height:1.7">
        Tiap pengurus akan menerima <b>kata sandi awal sekali pakai</b>. Sandinya
        ditampilkan satu kali di layar ini — salin dan bagikan sebelum menutup halaman,
        sebab tersimpan dalam bentuk teracak dan tidak dapat dilihat lagi.
      </p>
    </div></div>
  </div>`);

  n.querySelector('#btnPasang').onclick = async (e) => {
    const daftar = await amanTunggu(e.target, () => Store.pasang());
    if (!daftar) return;
    tampilkanSandiAwal(n.querySelector('#hasilPasang'), daftar, n.querySelector('#btnPasang'));
  };
  return n;
}

/** Kata sandi awal ditampilkan sekali — dengan jalan menyalin & mengunduh,
    sebab menyalin dua belas baris satu per satu adalah undangan bagi salah
    ketik, dan salah ketik di sini berarti akun yang tak dapat dibuka. */
function tampilkanSandiAwal(wadah, daftar, tombol) {
  const teks = daftar.map((x) => `${x.nama}\t${x.email}\t${x.sandi}`).join('\n');
  wadah.innerHTML = `
    <div class="kartu-sandi">
      <div class="ks-judul">Kata sandi awal — ditampilkan sekali</div>
      <table class="tbl-sandi">
        <thead><tr><th>Nama</th><th>Email</th><th>Sandi awal</th></tr></thead>
        <tbody>${daftar.map((x) => `<tr>
          <td>${esc(x.nama)}</td><td>${esc(x.email)}</td><td><code>${esc(x.sandi)}</code></td>
        </tr>`).join('')}</tbody>
      </table>
      <div class="ks-aksi">
        <button class="btn btn-garis" data-salin>Salin semua</button>
        <button class="btn btn-garis" data-unduh>Unduh .csv</button>
      </div>
    </div>`;
  wadah.querySelector('[data-salin]').onclick = () => {
    navigator.clipboard.writeText(teks).then(() => toast('Disalin ke papan klip.'),
      () => toast('Peramban menolak menyalin. Salin manual dari tabel.', true));
  };
  wadah.querySelector('[data-unduh]').onclick = () => {
    const csv = 'Nama,Email,Role,Sandi Awal\n' +
      daftar.map((x) => [x.nama, x.email, x.role, x.sandi].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'sandi-awal-alijaz.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  tombol.textContent = 'Lanjut ke halaman masuk';
  tombol.onclick = () => gambar();
}

/* ============================================================
   GANTI SANDI WAJIB
   ------------------------------------------------------------
   Selama kata sandinya masih yang dibagikan Sekretaris, tak ada satu
   pun halaman ERP yang terbuka. Bukan sekadar anjuran: sandi awal
   sempat berpindah tangan lewat pesan, dan yang sempat terbaca orang
   lain tidak boleh terus menjadi kunci.
   ============================================================ */
function layarGantiSandi() {
  const n = el(`<div class="layar-login">
    <div class="login-kanan" style="grid-column:1/-1"><div class="kotak-login">
      <h2>Ganti kata sandi</h2>
      <p class="sub">Anda masih memakai kata sandi awal. Tentukan sandi Anda sendiri
        sebelum melanjutkan.</p>
      <form id="formSandi">
        <div class="grup"><label>Kata Sandi Baru</label>
          <input name="baru" type="password" required minlength="8" autocomplete="new-password"></div>
        <div class="grup"><label>Ulangi Kata Sandi Baru</label>
          <input name="ulang" type="password" required minlength="8" autocomplete="new-password"></div>
        <button class="btn btn-lime" style="width:100%;padding:13px" type="submit">Simpan &amp; lanjutkan</button>
      </form>
      <p style="font-size:12.4px;color:var(--e-abu);margin-top:18px;text-align:center">
        Minimal 8 karakter.
      </p>
    </div></div>
  </div>`);

  n.querySelector('#formSandi').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    if (f.get('baru') !== f.get('ulang')) return toast('Kedua kata sandi belum sama.', true);
    const ok = await amanTunggu(e.target.querySelector('button[type=submit]'),
      () => Store.gantiSandi('', f.get('baru')));
    if (!ok) return;
    gambar();
    toast('Kata sandi diperbarui.');
  };
  return n;
}

/* ============================================================
   KERANGKA APLIKASI
   ============================================================ */
/* Induk menu yang submenunya sedang terbuka. Induk yang salah satu
   anaknya menjadi rute aktif selalu ikut terbuka, agar pengguna tidak
   pernah melihat halaman tanpa tahu ia berada di cabang mana. */
const menuTerbuka = new Set();

function kerangka() {
  const ketua = ruangKetua();
  const khusus = ruangKhusus();

  /* Judul grup memakai gabungan izin anak-anaknya, sehingga grup yang
     seluruh menunya tersembunyi ikut hilang dengan sendirinya. */
  const menuHtml = MENU.filter(bolehMenu).filter((m) =>
    !m.tersembunyi && !m.tersembunyiBila?.()).map((m) => {
    if (m.grup) return `<div class="sb-grup">${esc(m.grup)}</div>`;
    const n = m.lonceng?.() || 0;
    const anak = m.anak || [];
    const terbuka = anak.length > 0 && (menuTerbuka.has(m.id) || anak.some((a) => a.id === rute));
    const induk = `<button class="sb-item ${rute === m.id ? 'aktif' : ''}${terbuka ? ' terbuka' : ''}" data-rute="${m.id}">
      ${nilai(m.ikon)}<span>${esc(nilai(m.label))}</span>
      ${n ? `<span class="sb-lonceng">${n}</span>` : ''}
      ${anak.length ? `<span class="lipat" data-lipat>${I.bawah}</span>` : ''}
    </button>`;
    if (!terbuka) return induk;
    return induk + `<div class="sb-anak">${anak.map((a) =>
      `<button class="${rute === a.id ? 'aktif' : ''}" data-rute="${a.id}">${esc(a.label)}</button>`).join('')}</div>`;
  }).join('');

  const kartuUser = `<div class="sb-user">
    <img src="${U.foto}" alt="">
    <div style="min-width:0">
      <div class="nm">${esc(ketua ? RBAC.roleLabel(U.role) : U.nama)}</div>
      <div class="rl" style="color:${RBAC.roleColor(U.role)}">${esc(ketua ? `Kajian ${Store.cms.situs.nama}` : RBAC.roleLabel(U.role))}</div>
    </div>
  </div>`;

  /* Kartu bawah versi Ketua: identitas, ayat pengingat amanah, lalu
     siluet masjid yang menutup sidebar. */
  const bawah = ketua
    ? `<div class="sb-kartu">
         ${kartuUser}
         <div class="sb-kutipan">
           " Dan katakanlah, &ldquo;Bekerjalah kamu, maka Allah, Rasul-Nya dan orang-orang mukmin akan melihat pekerjaanmu.&rdquo;
           <span class="sumber">(QS. At-Taubah: 105)</span>
         </div>
         ${siluetMasjid()}
       </div>
       <button class="sb-keluar" id="btnKeluar">${I.keluar} Keluar</button>`
    : `${kartuUser}<button class="sb-keluar" id="btnKeluar">${I.keluar} Keluar</button>`;

  const aksiTopbar = ketua
    ? `<div class="topbar-aksi kolom">
         <span class="k-tanggal">${I.kalender} ${esc(tglPanjang())}</span>
         <span class="k-arab">وَمَا تَوْفِيقِي إِلَّا بِاللّهِ</span>
       </div>`
    : ruangSekretaris()
      ? `<div class="topbar-aksi"><span class="k-tanggal">${I.kalender} ${esc(tglPanjang())}</span></div>`
      : ruangKoordinator()
        ? `<div class="topbar-aksi">
             <span class="k-tanggal">${I.kalender} ${esc(tglRingkas())}</span>
             <span class="bungkus-bulan"><select class="pilih-bulan" data-angkatan>${
               angkatanTersedia().map((a) => `<option ${a === angkatanAktif() ? 'selected' : ''}>${esc(a)}</option>`).join('')}</select></span>
             <span class="bungkus-bulan"><select class="pilih-bulan" data-level>${
               levelTersedia().map((l) => `<option ${l === levelAktif() ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></span>
             <button class="btn btn-lime btn-kecil" data-buat-kajian>${I.tambah} Buat Jadwal Kajian</button>
           </div>`
      : ruangMediaWeb()
        ? `<div class="topbar-aksi">
             <span class="k-tanggal">${I.kalender} ${esc(tglRingkas())}</span>
             <a class="btn btn-garis btn-kecil" href="index.html" target="_blank">${I.mata} Lihat Website</a>
           </div>`
      : ruangRedaksi()
        ? `<div class="topbar-aksi"><span class="k-tanggal dua">${I.kalender}
             <span><b>${esc(tglRingkas())}</b><br><span class="hari">${esc(namaHari())}</span></span></span></div>`
      : `<div class="topbar-aksi">
           <a class="btn btn-garis btn-kecil" href="index.html" target="_blank">${I.mata} Lihat Website</a>
         </div>`;

  const kelasRuang = (khusus ? ' ruang' : '') + (ketua ? ' ketua' : '');
  const tagMerek = ketua || ruangRedaksi() ? Store.cms.situs.tagline
    : ruangSekretaris() ? RBAC.roleLabel(U.role) : 'ERP ORGANISASI';

  const n = el(`<div class="tata${kelasRuang}">
    <aside class="sidebar${kelasRuang}" id="sidebar">
      <div class="sb-merek">
        <span class="lambang">${lambang(26)}</span>
        <span><span class="nama">${esc(Store.cms.situs.nama)}</span><br>
        <span class="tag">${esc(tagMerek)}</span></span>
      </div>
      <nav class="sb-nav">${menuHtml}${ruangKoordinator() ? `
        <div class="sb-konteks">
          <div class="jd">Angkatan &amp; Level Aktif</div>
          <div class="br">${I.simpul}<span>${esc(angkatanAktif())}</span></div>
          <div class="br">${I.grup}<span>${esc(levelAktif())}</span></div>
        </div>` : ''}</nav>
      <div class="sb-bawah">${bawah}</div>
    </aside>
    <main class="konten">
      <div class="topbar">
        <button class="tombol-sidebar" id="btnSidebar">${I.log}</button>
        <div><h1 id="judulHal"></h1><div class="sub" id="subHal"></div></div>
        ${aksiTopbar}
      </div>
      <div class="halaman" id="isiHal"></div>
    </main>
  </div>`);

  n.querySelector('[data-angkatan]')?.addEventListener('change', (e) => { angkatanPilihan = e.target.value; gambar(); });
  n.querySelector('[data-level]')?.addEventListener('change', (e) => { levelPilihan = e.target.value; gambar(); });
  n.querySelector('[data-buat-kajian]')?.addEventListener('click', () => formKajian(null));

  const tutupSidebar = () => n.querySelector('#sidebar').classList.remove('buka');
  const kunjungi = (id) => { rute = id; location.hash = id; gambar(); tutupSidebar(); };

  n.querySelectorAll('.sb-item').forEach((b) => {
    b.onclick = (e) => {
      const m = MENU.find((x) => x.id === b.dataset.rute);
      /* Panah lipat hanya membuka/menutup cabang; badan tombolnya tetap
         menuju halaman induk — jadi cabang bisa diintip tanpa berpindah. */
      if (e.target.closest('[data-lipat]')) {
        menuTerbuka.has(m.id) ? menuTerbuka.delete(m.id) : menuTerbuka.add(m.id);
        gambar(); return;
      }
      if (m?.anak) menuTerbuka.add(m.id);
      kunjungi(b.dataset.rute);
    };
  });
  n.querySelectorAll('.sb-anak button').forEach((b) => { b.onclick = () => kunjungi(b.dataset.rute); });
  n.querySelector('#btnKeluar').onclick = () => konfirmasi('Keluar dari ERP', 'Anda yakin ingin mengakhiri sesi?',
    async () => { await Store.logout(); U = null; rute = 'dasbor'; gambar(); }, 'Keluar');
  n.querySelector('#btnSidebar').onclick = () => n.querySelector('#sidebar').classList.toggle('buka');
  return n;
}

/* ============================================================
   HALAMAN — DASBOR
   ============================================================ */
const HAL = {};

/* Empat wajah dasbor: ruang kerja Ketua Umum, Sekretaris, dan PJ
   Artikel, ditambah dasbor ringkas bagi peran yang belum punya
   ruang sendiri. Kerangkanya satu; hanya isinya yang berganti. */
HAL.dasbor = () => (ruangKetua() ? dasborKetua()
  : ruangSekretaris() ? dasborSekretaris()
    : ruangRedaksi() ? dasborRedaksi()
      : ruangBuku() ? dasborBuku()
        : ruangMediaWeb() ? dasborMediaWeb()
          : ruangKoordinator() ? dasborKoordinator()
            : ruangBendahara() ? dasborBendahara() : dasborUmum());
HAL.dasbor.judul = () => ruangKetua()
  ? ['Ketua Umum Dashboard', 'Bismillah, semoga setiap langkah kita menjadi bagian dari amal jariyah. ✨']
  : ruangSekretaris()
    ? ['Dasbor Sekretaris', `Kelola surat, dokumen, dan data organisasi kajian ${Store.cms.situs.nama}`]
    : ruangRedaksi()
      ? ['Dasbor PJ Artikel', `Kelola target dan progress penulisan artikel anggota Kajian ${Store.cms.situs.nama}`]
      : ruangBuku()
        ? ['Dashboard PJ Buku', 'Kelola proses penulisan buku dari perencanaan hingga distribusi.']
        : ruangMediaWeb()
          ? ['Dasbor PJ Media & Website', `Kelola konten, media, dan performa website Kajian ${Store.cms.situs.nama} secara terpusat.`]
          : ruangKoordinator()
            ? ['Dasbor PJ Koordinator Kajian', `Kelola jadwal, anggota, presensi, pembagian tugas, materi, dan evaluasi kajian ${Store.cms.situs.nama} secara terpusat.`]
            : ruangBendahara()
              ? ['Dasbor Bendahara', `Kelola keuangan Kajian ${Store.cms.situs.nama} dengan amanah dan transparan.`]
              : ['Dasbor', `${RBAC.roleLabel(U.role)} — ${RBAC.ROLES[kunciRoleU()].ringkas}`];

const dasborUmum = () => {
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
    const saldo = d.keuangan.reduce((s, t) => s + (t.jenis === 'masuk' ? 1 : -1) * Number(t.rp || 0), 0);
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
};

/* ============================================================
   EDITOR CMS — generik berdasarkan bentuk data
   ============================================================ */
const LABEL = {
  skrip: 'Teks Skrip (tulisan tangan)', judul: 'Judul', subjudul: 'Sub Judul',
  cariPetunjuk: 'Teks Bayangan Kolom Cari',
  tombol2Teks: 'Label Tombol Kedua', tombol2Link: 'Tautan Tombol Kedua',
  lencana: 'Teks Lencana Melingkar',
  sumber: 'Sumber Isi', tema: 'Tema Panel', jumlah: 'Jumlah Ditampilkan',
  tombolTeks: 'Label Tombol', tombolLink: 'Tautan Tombol', gambar: 'Gambar', nomor: 'Nomor Section',
  paragraf: 'Paragraf', intro: 'Paragraf Pembuka', visi: 'Isi Visi', misi: 'Poin Misi', butir: 'Butir',
  teks: 'Isi Teks', poin: 'Poin', level: 'Daftar Level', label: 'Label', penutup: 'Kalimat Penutup',
  subJudul: 'Sub Judul', subJudul2: 'Sub Judul Kedua', kutipan: 'Isi Kutipan', sumber: 'Sumber Kutipan',
  nlJudul: 'Judul Newsletter', nlTeks: 'Teks Newsletter', kategori: 'Daftar Kategori',
  perHalaman: 'Artikel per Halaman', posisiGambar: 'Posisi Gambar',
  nama: 'Nama', jabatan: 'Daftar Jabatan', t: 'Pertanyaan', j: 'Jawaban', subjek: 'Pilihan Subjek',
  tampilkanFilter: 'Tampilkan Filter', tema: 'Tema Warna', ikon: 'Ikon',
  logo: 'Lambang Organisasi', favicon: 'Ikon Tab — Website', faviconErp: 'Ikon Tab — ERP',
  masjid: 'Gambar Masjid Hero', gambar: 'Foto Latar',
};

/* Keterangan tambahan untuk medan tertentu. */
const BANTU = {
  logo      : 'Tampil di header & footer website, serta sidebar dan layar masuk ERP. Gunakan SVG atau PNG berlatar transparan — logo berlatar putih akan tampak sebagai kotak di atas header hijau.',
  favicon   : 'Ikon kecil di tab peramban untuk website publik. Bentuk persegi, minimal 64×64.',
  faviconErp: 'Ikon tab untuk ERP. Sengaja dibedakan dari ikon website agar tab admin mudah dikenali.',
  masjid    : 'Sosok yang berdiri di tengah hero, di depan judul raksasa — kepalanya sengaja menutupi sebagian baris bawah judul. Paling pas berupa POTRET tegak berlatar transparan (PNG atau WebP) dengan objek rata bawah. Gambar yang melebar akan dikecilkan sendiri agar tidak menutupi kolom pencarian. Gunakan PNG atau SVG berlatar transparan dengan objek rata bawah — bagian bawahnya sengaja terpotong gelombang. Kosongkan bila tidak ingin menampilkannya.',
};

/* Batas lebar unggahan per jenis medan. Logo dan ikon tidak perlu besar;
   membatasinya menjaga penyimpanan tetap lapang. */
const LEBAR_MAKS = { logo: 512, favicon: 180, faviconErp: 180, masjid: 900 };
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
    const lebarMaks = LEBAR_MAKS[kunci] || 1400;
    const kecil = lebarMaks <= 512;   // logo & ikon: pratinjau di atas kotak-kotak
    const p = el(`<div class="pratinjau-gambar">
      <img src="${nilai}" alt="" class="${kecil ? 'pratinjau-alfa' : ''}"
           style="${kecil ? 'width:92px;height:92px;object-fit:contain;padding:8px' : ''}">
      <div style="flex:1;min-width:0">
        <p style="margin:0 0 10px;font-size:12.4px;color:var(--e-abu)">
          ${esc(BANTU[kunci] || `Format JPG, PNG, WebP, atau SVG. Gambar dikecilkan otomatis ke lebar maks ${lebarMaks}px agar hemat penyimpanan.`)}
        </p>
        <label class="btn btn-garis btn-kecil" style="display:inline-flex;cursor:${bisaGambar ? 'pointer' : 'not-allowed'};margin:0;opacity:${bisaGambar ? 1 : .5}">
          ${I.gambar} Ganti Gambar<input type="file" accept="image/*" hidden ${bisaGambar ? '' : 'disabled'}>
        </label>
      </div>
    </div>`);
    const inp = p.querySelector('input[type=file]');
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      try {
        RBAC.assertCan(U, 'cms.media.upload');
        const dataUri = await Store.unggahGambar(f, lebarMaks);
        simpan(dataUri, 'cms.media.upload');
        p.querySelector('img').src = dataUri;
        toast(kunci === 'logo' || kunci.startsWith('favicon')
          ? 'Tersimpan di draft. Baru berlaku setelah Ketua menyetujui.'
          : 'Gambar diperbarui pada draft.');
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
    <div class="panel-kepala"><h3>Palet Warna & Ukuran</h3><span class="ket">berlaku ke seluruh halaman</span></div>
    <div class="panel-isi" id="mt"></div></div>`);
  /* Font punya kartunya sendiri di bawah — bila ikut di sini ia akan
     tampil sebagai kolom teks, dan mengetik nama font di kolom teks
     tidak pernah menjadikan font itu terpasang. */
  const MEDAN_FONT = ['fontUtama', 'fontAksen', 'fontArab'];
  Object.entries(t).forEach(([k, v]) => {
    if (MEDAN_FONT.includes(k)) return;
    kiri.querySelector('#mt').appendChild(medan(k, v, `theme.${k}`, bisa, bisa));
  });

  const s = Store.draft.situs;
  const kanan = el(`<div class="panel" style="margin:0">
    <div class="panel-kepala"><h3>Identitas & Kontak</h3><span class="ket">header, footer, halaman kontak</span></div>
    <div class="panel-isi" id="ms"></div></div>`);
  Object.entries(s).forEach(([k, v]) =>
    kanan.querySelector('#ms').appendChild(medan(k, v, `situs.${k}`, RBAC.can(U, 'cms.page.edit'), RBAC.can(U, 'cms.media.upload'))));

  box.appendChild(kartuFont(t, bisa));

  /* Pratinjau identitas — lambang di atas latar hijau yang sebenarnya,
     bukan di atas kotak putih yang menyesatkan. */
  box.appendChild(el(`<div class="panel"><div class="panel-kepala"><h3>Pratinjau Identitas</h3>
    <span class="ket">tampilan draft — begini nanti setelah disetujui</span></div>
    <div class="panel-isi" style="display:flex;gap:26px;flex-wrap:wrap;align-items:flex-end">
      <div>
        <div style="font-size:11.6px;color:var(--e-abu);margin-bottom:8px">Header website &amp; sidebar ERP</div>
        <div class="pratinjau-merek">
          <span class="kotak"><img src="${s.logo}" alt=""></span>
          <span><span class="nm">${esc(s.nama)}</span><br><span class="tg">${esc(s.tagline)}</span></span>
        </div>
      </div>
      <div>
        <div style="font-size:11.6px;color:var(--e-abu);margin-bottom:8px">Ikon tab peramban</div>
        <div style="display:flex;gap:6px">
          <div class="pratinjau-tab"><img src="${s.favicon}" alt=""><span>${esc(s.nama)}</span></div>
          <div class="pratinjau-tab"><img src="${s.faviconErp}" alt=""><span>ERP — ${esc(s.nama)}</span></div>
        </div>
      </div>
    </div></div>`));

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
   PEMILIH FONT
   ------------------------------------------------------------
   Tiga baris: font utama, font aksen tulisan tangan, dan font Arab.
   Masing-masing dipilih dari daftar — bukan diketik — sebab yang
   diketik belum tentu ada, dan font yang tidak ada gagal tanpa satu
   pun pesan: halaman hanya diam-diam memakai font cadangan.

   Contoh hurufnya digambar memakai font yang bersangkutan, jadi
   pilihannya terlihat sebelum disimpan. Karena tiap contoh menuntut
   fontnya terunduh, seluruh keluarga di daftar dimuat sekali saat
   halaman ini dibuka — hanya di sini, bukan di halaman lain.
   ============================================================ */
function kartuFont(t, bisa) {
  /* Contoh huruf hanya berguna bila digambar memakai font yang
     bersangkutan, jadi seluruh keluarga di daftar diunduh di sini —
     dan hanya di sini. */
  FONT.muatSemua();

  const baris = (jenis, kunci, judul, ket, contoh, gaya) => {
    const d = FONT.kel(jenis);
    const kini = d[kunci] ? kunci : Object.keys(d)[0];
    return `<div class="fnt-baris">
      <div class="fnt-kiri">
        <label for="fnt-${jenis}">${esc(judul)}</label>
        <div class="bantu">${esc(ket)}</div>
        <select id="fnt-${jenis}" data-jenis="${jenis}" ${bisa ? '' : 'disabled'}>
          ${Object.entries(d).map(([k, f]) =>
            `<option value="${k}" ${k === kini ? 'selected' : ''}>${esc(f.label)} — ${esc(f.ket)}</option>`).join('')}
        </select>
      </div>
      <div class="fnt-contoh" data-contoh="${jenis}"
           style="font-family:${d[kini].tumpuk || FONT.tumpuk('utama', t.fontUtama)};${gaya}">${contoh}</div>
    </div>`;
  };

  const kartu = el(`<div class="panel"><div class="panel-kepala">
    <h3>Font Website</h3><span class="ket">berlaku ke seluruh halaman publik &amp; ERP</span></div>
    <div class="panel-isi">
      <div class="notis notis-info" style="margin-bottom:18px">${I.info}<div>
        <b>Dipilih, bukan diketik</b>
        Tiap pilihan di sini membawa berkas fontnya sekaligus, jadi yang dipilih pasti terpasang.
        Contoh hurufnya di sebelah kanan sudah memakai font yang bersangkutan.
      </div></div>
      ${baris('utama', t.fontUtama, 'Font Utama',
        'Dipakai seluruh tulisan: judul, paragraf, tombol, dan tabel di ERP.',
        "Menggali al-Quran dengan Ilmu<br><span style='font-size:13.5px;opacity:.72'>Menghidupkan hati dengan tafsir — 1234567890</span>",
        'font-size:19px;font-weight:700;line-height:1.45')}
      ${baris('aksen', t.fontAksen, 'Font Aksen',
        'Tulisan tangan pada sambutan hero dan judul kecil di atas tiap bagian.',
        'Selamat Datang di', 'font-size:30px;line-height:1.2')}
      ${baris('arab', t.fontArab, 'Font Arab',
        'Untuk teks berhuruf Arab: kutipan di halaman publik dan tampilan di panel ERP.',
        '&#1576;&#1616;&#1587;&#1618;&#1605;&#1616; &#1575;&#1604;&#1604;&#1617;&#1607;&#1616; &#1575;&#1604;&#1585;&#1617;&#1614;&#1581;&#1618;&#1605;&#1614;&#1606;&#1616;',
        'font-size:26px;direction:rtl;line-height:1.7')}
    </div></div>`);

  kartu.querySelectorAll('select[data-jenis]').forEach((sel) => {
    sel.onchange = () => {
      const jenis = sel.dataset.jenis;
      const f = FONT.kel(jenis)[sel.value];
      /* Contohnya berganti seketika, sebelum disimpan — supaya pilihan
         dapat dibandingkan tanpa harus menyimpan lalu membatalkan. */
      const c = kartu.querySelector(`[data-contoh="${jenis}"]`);
      if (c) c.style.fontFamily = f.tumpuk || FONT.tumpuk('utama', Store.draft.theme.fontUtama);
      const kunci = { utama: 'fontUtama', aksen: 'fontAksen', arab: 'fontArab' }[jenis];
      aman(() => {
        Store.ubahDraft(U, `theme.${kunci}`, sel.value, 'cms.theme.edit');
        toast('Tersimpan di draft. Ajukan agar ditinjau Ketua.');
      });
    };
  });
  return kartu;
}

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

/* Satu perender untuk tiga halaman PJ Artikel: Daftar Artikel (semua),
   Artikel Masuk (menunggu tinjauan), dan Artikel Dipublikasi. `kunci`
   mengunci saringan statusnya sehingga pemilih status ikut menghilang. */
function halamanArtikel(kunci) {
  const bisaTinjau = RBAC.can(U, 'artikel.review');
  const box = el('<div></div>');

  box.appendChild(el(`<div class="notis notis-info">${I.info}<div>
    <b>Alur karya tulis</b>
    Anggota menulis <b>Draft</b> → kirim untuk <b>Tinjauan</b> → PJ Artikel menyetujui (<b>Terbit</b>) atau mengembalikan (<b>Perlu Revisi</b>). Hanya artikel berstatus Terbit yang muncul di halaman Artikel.
  </div></div>`));

  const kepala = el(`<div class="panel-kepala" style="background:#fff;border:1px solid var(--e-garis);border-radius:var(--e-radius);margin-bottom:18px">
    <h3>${kunci ? JUDUL_ART[kunci] : bisaTinjau ? 'Seluruh Artikel' : 'Artikel Tulisan Anda'}</h3>
    <div class="kanan">
      ${kunci ? `<span class="lencana ${STATUS_ART[kunci].c}">${STATUS_ART[kunci].l}</span>`
        : `<select id="fStatus" style="width:190px"><option value="">Semua Status</option>
        ${Object.entries(STATUS_ART).map(([k, v]) => `<option value="${k}">${v.l}</option>`).join('')}</select>`}
      ${RBAC.can(U, 'artikel.write') ? `<button class="btn btn-lime btn-kecil" id="btnBaru">${I.tambah} Tulis Artikel</button>` : ''}
    </div></div>`);
  box.appendChild(kepala);

  const wadah = el('<div></div>');
  box.appendChild(wadah);

  function gambarDaftar() {
    const f = kunci || kepala.querySelector('#fStatus')?.value || '';
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
          Store.ubahStatusArtikel(U, a.id, 'review', ''); toast('Artikel dikirim ke PJ Artikel.'); gambarDaftar();
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

  kepala.querySelector('#fStatus')?.addEventListener('change', gambarDaftar);
  kepala.querySelector('#btnBaru')?.addEventListener('click', () => formArtikel(null));
  gambarDaftar();
  return box;
}

const JUDUL_ART = { review: 'Artikel Masuk', terbit: 'Artikel Dipublikasi', draft: 'Draft Artikel', revisi: 'Perlu Revisi' };

HAL.artikel = () => halamanArtikel(null);
HAL['daftar-artikel'] = () => halamanArtikel(null);
HAL['daftar-artikel'].judul = () => ['Daftar Artikel', 'Seluruh naskah anggota beserta statusnya.'];
HAL['artikel-masuk'] = () => halamanArtikel('review');
HAL['artikel-masuk'].judul = () => ['Artikel Masuk', 'Naskah yang menunggu tinjauan Anda.'];
HAL['artikel-terbit'] = () => halamanArtikel('terbit');
HAL['artikel-terbit'].judul = () => ['Artikel Dipublikasi', 'Naskah yang sudah tayang di halaman Artikel publik.'];
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
    const hadir = (k.presensi || []).filter((x) => x.status !== 'tidak-hadir').length;
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
    <div class="grid-form-3">
      <div class="grup"><label>Pemakalah</label><select id="pm">${opt(k?.pemakalahId)}</select></div>
      <div class="grup"><label>Moderator</label><select id="md">${opt(k?.moderatorId)}</select></div>
      <div class="grup"><label>Notulen</label><select id="nt"><option value="">—</option>${opt(k?.notulenId)}</select></div>
    </div>
    <div class="grid-form">
      <div class="grup"><label>Angkatan</label><input id="ak" value="${esc(k?.angkatan || (typeof angkatanAktif === 'function' ? angkatanAktif() : 'Angkatan X'))}"></div>
      <div class="grup"><label>Kelengkapan Berkas</label>
        <div style="display:flex;gap:18px;padding-top:8px">
          <label style="display:flex;align-items:center;gap:8px;font-weight:600;cursor:pointer;margin:0">
            <input type="checkbox" id="pp" ${k?.ppt ? 'checked' : ''} style="width:auto;accent-color:var(--e-hijau)"> PPT sudah ada</label>
          <label style="display:flex;align-items:center;gap:8px;font-weight:600;cursor:pointer;margin:0">
            <input type="checkbox" id="rv" ${k?.revisi ? 'checked' : ''} style="width:auto;accent-color:var(--e-hijau)"> Revisi sudah dicek</label>
        </div></div>
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
        notulenId: g('nt'), angkatan: g('ak').trim(),
        ppt: isi.querySelector('#pp').checked, revisi: isi.querySelector('#rv').checked,
      });
      tutupModal(); toast('Jadwal kajian tersimpan.'); gambar();
    });
  };
}

/* Absensi kini bertiga keadaan, jadi satu kotak centang tidak lagi cukup:
   tiap anggota punya tombol tiga pilihan. Dipakai modul Jadwal Kajian
   lama maupun ruang kerja PJ Koordinator Kajian. */
function dialogAbsensi(k) {
  const peserta = Store.db.users.filter((u) => u.status === 'aktif'
    && (!k.angkatan || u.angkatan === k.angkatan));
  const cari = (id) => (k.presensi || []).find((p) => p.userId === id);

  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.4px;color:var(--e-abu)">
      Tandai kehadiran peserta pada kajian <b>${esc(k.judul)}</b>${k.angkatan ? ` · ${esc(k.angkatan)}` : ''}.</p>
    <div class="daftar-presensi"></div>
    <p style="margin:16px 0 0;font-size:13px"><b data-hit></b></p>
  </div>`);
  const wadah = isi.querySelector('.daftar-presensi');

  const hitung = () => {
    const h = peserta.filter((u) => cari(u.id)?.status === 'hadir').length;
    const t = peserta.filter((u) => cari(u.id)?.status === 'terlambat').length;
    const x = peserta.filter((u) => cari(u.id)?.status === 'tidak-hadir').length;
    isi.querySelector('[data-hit]').textContent =
      `${h} hadir · ${t} terlambat · ${x} tidak hadir · ${peserta.length - h - t - x} belum absen`;
  };

  peserta.forEach((u) => {
    const baris = el(`<div class="presensi-baris">
      <img src="${u.foto}" alt=""><span class="nm">${esc(u.nama)}</span>
      <span class="jm" data-jam></span>
      <span class="pilih">${Store.STATUS_PRESENSI.map((st) =>
        `<button data-st="${st}">${st === 'hadir' ? 'Hadir' : st === 'terlambat' ? 'Terlambat' : 'Tidak Hadir'}</button>`).join('')}</span>
    </div>`);
    const segarkan = () => {
      const p = cari(u.id);
      baris.querySelectorAll('[data-st]').forEach((b) =>
        b.classList.toggle('aktif', p?.status === b.dataset.st));
      baris.querySelector('[data-jam]').textContent = p?.jam || '';
      hitung();
    };
    baris.querySelectorAll('[data-st]').forEach((b) => {
      b.onclick = () => aman(() => { Store.setPresensi(U, k.id, u.id, b.dataset.st); segarkan(); });
    });
    segarkan();
    wadah.appendChild(baris);
  });

  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-lime" data-s>Selesai</button></div>`);
  modal({ judul: 'Presensi Kehadiran', isi, kaki, lebar: true });
  kaki.querySelector('[data-s]').onclick = () => { tutupModal(); gambar(); };
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
      <td><span class="lencana ${s.kategori === 'masuk' ? 'l-biru' : s.kategori === 'keputusan' ? 'l-kuning' : 'l-hijau'}">${esc(s.kategori)}</span></td>
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
  const masuk = d.filter((t) => t.jenis === 'masuk').reduce((s, t) => s + Number(t.rp || 0), 0);
  const keluar = d.filter((t) => t.jenis === 'keluar').reduce((s, t) => s + Number(t.rp || 0), 0);
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
      <td style="text-align:right;color:#4A7A1E;font-weight:700">${t.jenis === 'masuk' ? Store.nominalGabung(t) : '—'}</td>
      <td style="text-align:right;color:#B23E37;font-weight:700">${t.jenis === 'keluar' ? Store.nominalGabung(t) : '—'}</td>
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
      <div class="grup"><label>Nominal (Rp)</label><input type="number" id="n" value="${t?.rp || ''}" min="0" placeholder="0"></div>
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
      Store.simpanTransaksi(U, { id: t?.id, jenis: g('j'), tanggal: g('tg'), kategori: g('k').trim(),
        sumber: g('k').trim(), rp: Number(g('n')), egp: t?.egp || 0, ket: g('ket') });
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
   RUANG KERJA KETUA UMUM
   ------------------------------------------------------------
   Lima daftar kepengurusan berbentuk sama: array objek ber-id.
   Karena itu tabel, kartu dasbor, dan form isinya dibangun satu
   kali di sini lalu disetel lewat spesifikasi di bawah. Menambah
   kolom cukup menyunting MODUL — tidak ada tabel yang ditulis
   ulang, dan dasbor tidak bisa lagi meleset dari halaman penuhnya.
   ============================================================ */
const STATUS_KEG = {
  selesai: { l: 'Selesai', c: 'l-hijau'  },
  proses : { l: 'Proses',  c: 'l-kuning' },
  rencana: { l: 'Rencana', c: 'l-biru'   },
};

const MODUL = {
  pengurus: {
    ruang: 'ketua', izin: 'organisasi.manage',
    urut: 1, judul: 'Data Pengurus', satuan: 'Pengurus', ikon: I.grup, hitung: true,
    sub: 'Struktur kepengurusan beserta kontak setiap jabatan.',
    pratinjau: { awal: 3, akhir: 1 },
    cari: (x) => `${x.nama} ${x.jabatan}`, tajuk: (x) => x.nama,
    kolom: [
      { l: 'Nama',    isi: (x) => esc(x.nama) },
      { l: 'Jabatan', isi: (x) => esc(x.jabatan) },
      { l: 'No. WA',  kelas: 'wa', isi: (x) => esc(samarWa(x.wa)) },
    ],
    form: [
      { k: 'nama',    l: 'Nama Lengkap', wajib: true, ph: 'Nama pengurus' },
      { k: 'jabatan', l: 'Jabatan',      wajib: true, ph: 'Sekretaris Umum' },
      { k: 'wa',      l: 'Nomor WhatsApp', ph: '+20 100 000 0000',
        bantu: 'Empat digit terakhir disamarkan di tabel. Nomor utuh hanya terlihat di form ini.' },
    ],
  },

  koordinator: {
    ruang: 'ketua', izin: 'organisasi.manage',
    urut: 2, judul: 'Data Koordinator Kajian', satuan: 'Koordinator', ikon: I.orang, hitung: true,
    sub: 'Penanggung jawab kajian pada setiap angkatan.',
    pratinjau: { awal: 3, akhir: 1 },
    cari: (x) => `${x.nama} ${x.angkatan}`, tajuk: (x) => x.nama,
    kolom: [
      { l: 'Nama',       isi: (x) => esc(x.nama) },
      { l: 'Koordinator',isi: (x) => esc(x.angkatan) },
      { l: 'No. WA',     kelas: 'wa', isi: (x) => esc(samarWa(x.wa)) },
    ],
    form: [
      { k: 'nama',     l: 'Nama Lengkap', wajib: true, ph: 'Nama koordinator' },
      { k: 'angkatan', l: 'Koordinator Angkatan', wajib: true, ph: 'Angkatan XI' },
      { k: 'wa',       l: 'Nomor WhatsApp', ph: '+20 100 000 0000' },
    ],
  },

  kaleidoskop: {
    ruang: 'ketua', izin: 'organisasi.manage',
    urut: 3, judul: 'Kaleidoskop Kegiatan & Program', satuan: 'Kegiatan', ikon: I.agenda,
    sub: 'Rekam jejak program kerja sepanjang periode.',
    pratinjau: { awal: 5, akhir: 0 }, aksiDiKartu: false,
    cari: (x) => `${x.kegiatan} ${x.waktu} ${x.status}`, tajuk: (x) => x.kegiatan,
    kolom: [
      { l: 'Kegiatan / Program', isi: (x) => esc(x.kegiatan) },
      { l: 'Waktu',   kelas: 'utuh', isi: (x) => esc(x.waktu) },
      { l: 'Status',  isi: (x) => `<span class="lencana ${STATUS_KEG[x.status]?.c || 'l-abu'}">${esc(STATUS_KEG[x.status]?.l || x.status)}</span>` },
      { l: 'Selesai', tengah: true, isi: () => '', pasang: selCentang },
    ],
    form: [
      { k: 'kegiatan', l: 'Nama Kegiatan / Program', wajib: true, ph: 'Seminar Ulumul Quran' },
      { k: 'waktu',    l: 'Waktu Pelaksanaan', wajib: true, ph: 'Mei 2025',
        bantu: 'Ditulis bebas, misalnya "Mei 2025" atau "Sem. Ganjil 2025".' },
      { k: 'status',   l: 'Status', jenis: 'pilih', bawaan: 'rencana',
        pilihan: Object.entries(STATUS_KEG).map(([v, s]) => ({ v, l: s.l })) },
    ],
    /* Kotak centang selalu mengikuti status, supaya lencana dan centang
       di tabel tidak pernah saling berlawanan. */
    rapikan: (d) => ({ ...d, selesai: d.status === 'selesai' }),
  },

  pencapaian: {
    ruang: 'ketua', izin: 'organisasi.manage',
    urut: 4, judul: 'Pencapaian / Achievement', satuan: 'Pencapaian', ikon: I.piala,
    sub: 'Capaian organisasi beserta bukti dokumentasinya.',
    pratinjau: { awal: 3, akhir: 1 },
    cari: (x) => x.pencapaian, tajuk: (x) => x.pencapaian,
    kolom: [
      { l: 'Pencapaian', isi: (x) => esc(x.pencapaian) },
      { l: 'Tanggal',    kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
      { l: 'Lampiran',   isi: () => '', pasang: selGambar('lampiran', 'pencapaian') },
    ],
    form: [
      { k: 'pencapaian', l: 'Nama Pencapaian', wajib: true, ph: 'Terbit Buku Keempat' },
      { k: 'tanggal',    l: 'Tanggal', jenis: 'tanggal', wajib: true },
      { k: 'lampiran',   l: 'Lampiran / Dokumentasi', jenis: 'gambar',
        bantu: 'Sampul buku, foto kegiatan, atau piagam. Dikecilkan otomatis ke lebar 1000px.' },
    ],
  },

  evaluasi: {
    ruang: 'ketua', izin: 'organisasi.manage',
    urut: 5, judul: 'Evaluasi & Masukan', satuan: 'Evaluasi', ikon: I.obrolan, lebar: true,
    sub: 'Temuan lapangan dan tindak lanjut yang disepakati.',
    pratinjau: { awal: 3, akhir: 1 },
    cari: (x) => `${x.evaluasi} ${x.masukan}`, tajuk: (x) => x.evaluasi,
    kolom: [
      { l: 'Evaluasi',         isi: (x) => esc(x.evaluasi) },
      { l: 'Masukan / Solusi', isi: (x) => esc(x.masukan) },
      { l: 'Tanggal',          kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
    ],
    form: [
      { k: 'evaluasi', l: 'Poin Evaluasi', wajib: true, jenis: 'area', ph: 'Anggota sering telat hadir kajian' },
      { k: 'masukan',  l: 'Masukan / Solusi', wajib: true, jenis: 'area', ph: 'Langkah perbaikan yang disepakati' },
      { k: 'tanggal',  l: 'Tanggal', jenis: 'tanggal', wajib: true },
    ],
  },
};

/* ============================================================
   RUANG KERJA SEKRETARIS — persuratan, dokumen, keanggotaan
   ------------------------------------------------------------
   Lima modul surat hidup di satu koleksi `db.surat` yang sama dan
   hanya berbeda irisan kategorinya, jadi seluruhnya dibangun dari
   satu cetakan `modulSurat()`. Penomoran dan arsipnya tetap satu
   kesatuan; menambah kategori cukup satu baris.
   ============================================================ */
const STATUS_SURAT = {
  draft          : { l: 'Draft',           c: 'l-abu'    },
  terkirim       : { l: 'Terkirim',        c: 'l-hijau'  },
  diarsipkan     : { l: 'Diarsipkan',      c: 'l-biru'   },
  diterima       : { l: 'Diterima',        c: 'l-kuning' },
  ditindaklanjuti: { l: 'Ditindaklanjuti', c: 'l-hijau'  },
  berlaku        : { l: 'Berlaku',         c: 'l-hijau'  },
  dicabut        : { l: 'Dicabut',         c: 'l-merah'  },
};

const JENIS_SK = {
  'mulai'         : 'SK Mulai Kajian',
  'tawaquf'       : 'SK Tawaquf Kajian',
  'anggota-aktif' : 'SK Anggota Aktif',
  'anggota-keluar': 'SK Anggota Keluar',
  'alumni'        : 'SK Alumni',
};

const lencanaStatus = (v) =>
  `<span class="lencana ${STATUS_SURAT[v]?.c || 'l-abu'}">${esc(STATUS_SURAT[v]?.l || v)}</span>`;

/** Cetakan satu modul surat. `saring` menentukan irisan `db.surat`-nya. */
function modulSurat({ judul, satuan, ket, ikon, warna, labelPihak, status, saring, bawaanBaru, kolomSk }) {
  return {
    ruang: 'sekretaris', izin: 'sekretariat.manage', koleksi: 'surat',
    judul, satuan, sub: ket, ket, ikon, warna,
    sumber: () => Store.db.surat.filter(saring),
    bawaanBaru,
    cari: (x) => `${x.nomor} ${x.perihal} ${x.tujuan}`,
    tajuk: (x) => x.perihal,
    pratinjau: { awal: 3, akhir: 1 },
    kolom: [
      { l: 'Nomor',   kelas: 'utuh', isi: (x) => `<b>${esc(x.nomor)}</b>` },
      { l: 'Perihal', isi: (x) => esc(x.perihal) },
      ...(kolomSk ? [{ l: 'Jenis SK', isi: (x) => esc(JENIS_SK[x.jenisSk] || '—') }] : []),
      { l: labelPihak, isi: (x) => esc(x.tujuan) },
      { l: 'Tanggal', kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
      { l: 'Status',  isi: (x) => lencanaStatus(x.status) },
    ],
    form: [
      { k: 'nomor',   l: 'Nomor Surat', wajib: true, ph: '001/AI/VI/2025' },
      { k: 'perihal', l: 'Perihal', wajib: true, jenis: 'area', ph: 'Undangan Rapat Koordinasi Pengurus' },
      ...(kolomSk ? [{ k: 'jenisSk', l: 'Jenis Surat Keputusan', jenis: 'pilih', bawaan: 'mulai',
        pilihan: Object.entries(JENIS_SK).map(([v, l]) => ({ v, l })) }] : []),
      { k: 'tujuan',  l: labelPihak, wajib: true, ph: 'Seluruh Pengurus' },
      { k: 'tanggal', l: 'Tanggal', jenis: 'tanggal', wajib: true },
      { k: 'status',  l: 'Status', jenis: 'pilih', bawaan: status[0],
        pilihan: status.map((v) => ({ v, l: STATUS_SURAT[v].l })) },
    ],
  };
}

const kat = (k) => (x) => x.kategori === k;

Object.assign(MODUL, {
  'surat-internal': modulSurat({
    judul: 'Surat Internal', satuan: 'Surat Internal', ikon: I.amplopTurun,
    ket: 'Kelola surat internal antar divisi dan kepengurusan kajian',
    warna: ['rgba(140,198,63,.16)', '#4A7A1E'], labelPihak: 'Tujuan',
    status: ['terkirim', 'draft', 'diarsipkan'],
    saring: kat('internal'), bawaanBaru: { kategori: 'internal' },
  }),
  'surat-eksternal': modulSurat({
    judul: 'Surat Eksternal', satuan: 'Surat Eksternal', ikon: I.surat,
    ket: 'Kelola surat yang ditujukan kepada pihak eksternal',
    warna: ['rgba(62,127,184,.14)', '#2C6091'], labelPihak: 'Tujuan',
    status: ['terkirim', 'draft', 'diarsipkan'],
    saring: kat('eksternal'), bawaanBaru: { kategori: 'eksternal' },
  }),
  'surat-keputusan': modulSurat({
    judul: 'Surat Keputusan', satuan: 'Surat Keputusan', ikon: I.sk,
    ket: "Kelola berbagai SK resmi kajian Al-I'jaz",
    warna: ['rgba(124,92,214,.14)', '#5F45AE'], labelPihak: 'Ditujukan Kepada',
    status: ['berlaku', 'draft', 'dicabut'], kolomSk: true,
    saring: kat('keputusan'), bawaanBaru: { kategori: 'keputusan' },
  }),
  'surat-masuk': modulSurat({
    judul: 'Surat Masuk', satuan: 'Surat Masuk', ikon: I.baki,
    ket: 'Arsip surat masuk dari berbagai pihak',
    warna: ['rgba(240,149,30,.15)', '#B87310'], labelPihak: 'Asal Surat',
    status: ['diterima', 'ditindaklanjuti', 'diarsipkan'],
    saring: kat('masuk'), bawaanBaru: { kategori: 'masuk' },
  }),
  'surat-keluar': modulSurat({
    judul: 'Surat Keluar', satuan: 'Surat Keluar', ikon: I.kirim,
    ket: 'Arsip surat keluar yang telah dikirimkan',
    warna: ['rgba(217,83,111,.13)', '#B23E5F'], labelPihak: 'Tujuan',
    status: ['terkirim', 'draft', 'diarsipkan'],
    saring: kat('keluar'), bawaanBaru: { kategori: 'keluar' },
  }),

  sertifikat: {
    ruang: 'sekretaris', izin: 'sertifikat.manage',
    judul: 'Sertifikat', satuan: 'Sertifikat', ikon: I.dok,
    ket: 'Kelola sertifikat anggota, pemateri, dan kegiatan',
    sub: 'Sertifikat anggota, pemateri, dan kegiatan kajian.',
    warna: ['rgba(47,169,140,.14)', '#1F7A64'],
    cari: (x) => `${x.nomor} ${x.judul} ${x.penerima} ${x.jenis}`,
    tajuk: (x) => x.judul, pratinjau: { awal: 3, akhir: 1 },
    kolom: [
      { l: 'Nomor',    kelas: 'utuh', isi: (x) => `<b>${esc(x.nomor)}</b>` },
      { l: 'Judul Sertifikat', isi: (x) => esc(x.judul) },
      { l: 'Jenis',    isi: (x) => `<span class="lencana ${
        x.jenis === 'pemateri' ? 'l-biru' : x.jenis === 'kegiatan' ? 'l-kuning' : 'l-hijau'}">${esc(x.jenis)}</span>` },
      { l: 'Penerima', isi: (x) => esc(x.penerima) },
      { l: 'Tanggal',  kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
    ],
    form: [
      { k: 'nomor',    l: 'Nomor Sertifikat', wajib: true, ph: '001/SRT-A/AI/VI/2025' },
      { k: 'judul',    l: 'Judul Sertifikat', wajib: true, jenis: 'area', ph: 'Sertifikat Pemateri — Balaghah dalam al-Quran' },
      { k: 'jenis',    l: 'Jenis', jenis: 'pilih', bawaan: 'anggota',
        pilihan: [{ v: 'anggota', l: 'Anggota' }, { v: 'pemateri', l: 'Pemateri' }, { v: 'kegiatan', l: 'Kegiatan' }] },
      { k: 'penerima', l: 'Penerima', wajib: true, ph: 'Nama penerima atau "Seluruh Peserta"' },
      { k: 'tanggal',  l: 'Tanggal Terbit', jenis: 'tanggal', wajib: true },
    ],
  },

  ttd: {
    ruang: 'sekretaris', izin: 'ttd.manage', koleksi: 'tandaTangan',
    judul: 'Kumpulan Tanda Tangan', satuan: 'Tanda Tangan', ikon: I.pena,
    ket: 'Kumpulan tanda tangan setiap divisi kepengurusan',
    sub: 'Tanda tangan pemegang jabatan untuk membubuhi surat dan sertifikat.',
    warna: ['rgba(62,127,184,.14)', '#2C6091'],
    cari: (x) => `${x.divisi} ${x.jabatan} ${x.nama}`,
    tajuk: (x) => x.nama, pratinjau: { awal: 3, akhir: 1 },
    kolom: [
      { l: 'Divisi',  isi: (x) => `<b>${esc(x.divisi)}</b>` },
      { l: 'Jabatan', isi: (x) => esc(x.jabatan) },
      { l: 'Nama',    isi: (x) => esc(x.nama) },
      { l: 'Tanda Tangan', isi: () => '', pasang: selGambar('gambar', 'nama', (x) => `${x.jabatan} · ${x.divisi}`, 'utuh') },
    ],
    form: [
      { k: 'divisi',  l: 'Divisi / Unit', wajib: true, ph: 'Divisi Media' },
      { k: 'jabatan', l: 'Jabatan', wajib: true, ph: 'Kepala Divisi' },
      { k: 'nama',    l: 'Nama Pemilik', wajib: true, ph: 'Nama lengkap' },
      { k: 'gambar',  l: 'Berkas Tanda Tangan', jenis: 'gambar',
        bantu: 'Pindai tanda tangan berlatar transparan (PNG) agar rapi saat dibubuhkan pada surat.' },
    ],
  },
});

/* Lima jenis SK adalah irisan yang lebih halus dari kategori 'keputusan'.
   Dibangkitkan dari peta JENIS_SK supaya menambah jenis SK baru cukup
   satu baris di sana — submenu sidebar, halaman, dan formnya ikut ada. */
Object.entries(JENIS_SK).forEach(([jenis, label]) => {
  MODUL['sk-' + jenis] = modulSurat({
    judul: label, satuan: label, ikon: I.sk,
    ket: `Arsip ${label.toLowerCase()} beserta nomor dan tanggal berlakunya`,
    warna: ['rgba(124,92,214,.14)', '#5F45AE'], labelPihak: 'Ditujukan Kepada',
    status: ['berlaku', 'draft', 'dicabut'],
    saring: (x) => x.kategori === 'keputusan' && x.jenisSk === jenis,
    bawaanBaru: { kategori: 'keputusan', jenisSk: jenis },
  });
});

/* --- navigasi: dasbor adalah etalase, bukan tempat kerja ---
   Kartu dasbor hanya memperlihatkan potongan daftar — beberapa baris
   awal, tanda "…", lalu baris terakhir. Mengubah data dari tampilan
   yang menyembunyikan mayoritas barisnya berarti bekerja tanpa konteks.
   Karena itu tidak ada satu pun tulis-data yang terjadi di dasbor:
   setiap aksi membuka halaman modulnya lebih dulu, baru melanjutkan
   maksud aksi itu di sana. */
function bukaModul(nama, lanjut) {
  rute = nama;
  location.hash = nama;
  gambar();          // sinkron — halaman sudah tergambar saat `lanjut` jalan
  lanjut?.();
}

/* Dipakai dua jalur (kartu dasbor & halaman penuh), jadi dialognya
   hidup di satu tempat saja agar keduanya tak pernah menyimpang. */
function hapusOrg(nama, x) {
  const m = MODUL[nama];
  konfirmasi(
    `Hapus data ${m.satuan.toLowerCase()}`,
    `"${m.tajuk(x).slice(0, 70)}" akan dihapus dari daftar.`,
    () => aman(() => {
      if (m.hapus) m.hapus(x); else Store.hapusKoleksi(U, m.koleksi || nama, x.id);
      toast('Data dihapus.'); gambar();
    }));
}

/* --- sel interaktif --- */
function selCentang(td, x, { nama, pratinjau }) {
  const bisa = RBAC.can(U, 'organisasi.manage');
  const b = el(`<button class="cek-kotak ${x.selesai ? 'on' : ''}" ${bisa ? '' : 'disabled'}
    title="${x.selesai ? 'Batalkan tanda selesai' : 'Tandai selesai'}">${I.cek}</button>`);
  const centang = () => aman(() => { Store.centangKegiatan(U, x.id, !x.selesai); gambar(); });
  b.onclick = () => (pratinjau ? bukaModul(nama, centang) : centang());
  td.appendChild(b);
}

/** Kolom gambar: pratinjau kecil yang dapat diperbesar. Dipakai lampiran
    pencapaian maupun berkas tanda tangan, jadi kuncinya disebut pemanggil.
    Sengaja deklarasi fungsi, bukan `const` — ia dipanggil saat MODUL di
    atas disusun, yang terjadi lebih dulu daripada baris ini. */
function selGambar(kunci, kunciJudul, ket, kelas = '') {
  return (td, x) => {
    const src = x[kunci];
    if (!src) { td.appendChild(el('<span style="color:var(--e-abu)">—</span>')); return; }
    const judul = x[kunciJudul];
    const img = el(`<img class="lampiran-mini ${kelas}" src="${src}" alt="${esc(judul)}">`);
    img.onclick = () => modal({
      judul, lebar: true,
      isi: `<img src="${src}" alt="" style="width:100%;border-radius:12px;background:#fff">
            <p style="margin:14px 0 0;font-size:13px;color:var(--e-abu)">${esc(ket ? ket(x) : tgl(x.tanggal))}</p>`,
    });
    td.appendChild(img);
  };
}

/* --- tabel --- */
/* `pratinjau` menandai "tabel ini digambar di kartu dasbor" — sekaligus
   dipakai untuk memangkas baris DAN untuk memutuskan bahwa setiap aksi
   harus dialihkan ke halaman modulnya lebih dulu. */
/** Isi sebuah modul: koleksi utuh, atau irisan dari koleksi bersama —
    lima modul surat, misalnya, hidup di satu `db.surat` yang sama. */
const dataModul = (nama) => {
  const m = MODUL[nama];
  return m.sumber ? m.sumber() : Store.db[m.koleksi || nama];
};

function tabelOrg(nama, { pratinjau = false, aksi = true, saring = '' } = {}) {
  const m = MODUL[nama];
  const bisa = RBAC.can(U, m.izin);
  const jalankan = (fn) => (pratinjau ? bukaModul(nama, fn) : fn());
  const q = saring.trim().toLowerCase();
  const semua = dataModul(nama).filter((x) => !q || m.cari(x).toLowerCase().includes(q));

  if (!semua.length) {
    return el(`<div class="kosong-erp">${I.kotak}
      <p>${q ? 'Tidak ada data yang cocok' : `Belum ada data ${esc(m.satuan.toLowerCase())}`}</p>
      <small>${q ? 'Coba kata kunci lain.' : 'Mulai dengan menekan "Tambah Data".'}</small></div>`);
  }

  /* Kartu dasbor memangkas isinya: beberapa baris pertama, penanda "…",
     lalu baris terakhir — sehingga besar daftar tetap terasa tanpa
     menenggelamkan halaman. Nomornya tetap nomor asli. */
  const baris = [];
  const { awal, akhir } = m.pratinjau;
  if (pratinjau && semua.length > awal + akhir + 1) {
    semua.slice(0, awal).forEach((x, i) => baris.push({ x, no: i + 1 }));
    baris.push({ putus: true });
    if (akhir) semua.slice(-akhir).forEach((x, i) => baris.push({ x, no: semua.length - akhir + i + 1 }));
  } else {
    semua.forEach((x, i) => baris.push({ x, no: i + 1 }));
  }

  const lebarPutus = 1 + m.kolom.length + (aksi ? 1 : 0);
  const bungkus = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr>
      <th class="kol-no">No.</th>
      ${m.kolom.map((c) => `<th class="${c.kelas || ''}${c.tengah ? ' kol-tengah' : ''}">${esc(c.l)}</th>`).join('')}
      ${aksi ? '<th class="kol-aksi">Aksi</th>' : ''}
    </tr></thead><tbody></tbody></table></div>`);
  const tb = bungkus.querySelector('tbody');

  baris.forEach((b) => {
    if (b.putus) {
      const tr = el(`<tr class="putus"><td colspan="${lebarPutus}" title="Lihat seluruh data" style="cursor:pointer">…</td></tr>`);
      tr.querySelector('td').onclick = () => bukaModul(nama);
      tb.appendChild(tr);
      return;
    }
    const tr = el(`<tr>
      <td class="kol-no">${b.no}</td>
      ${m.kolom.map((c) => `<td class="${c.kelas || ''}${c.tengah ? ' kol-tengah' : ''}">${c.isi(b.x)}</td>`).join('')}
      ${aksi ? `<td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Sunting" ${bisa ? '' : 'disabled'}>${I.sunting}</button>
        <button class="ikon-aksi hapus" title="Hapus" ${bisa ? '' : 'disabled'}>${I.hapus}</button>
      </div></td>` : ''}
    </tr>`);

    m.kolom.forEach((c, i) => c.pasang?.(tr.children[i + 1], b.x, { nama, pratinjau }));
    tr.querySelector('.sunting')?.addEventListener('click', () => jalankan(() => formOrg(nama, b.x)));
    tr.querySelector('.hapus')?.addEventListener('click', () => jalankan(() => hapusOrg(nama, b.x)));
    tb.appendChild(tr);
  });
  return bungkus;
}

/* --- kartu dasbor --- */
function kartuOrg(nama) {
  const m = MODUL[nama];
  const jml = dataModul(nama).length;
  const kartu = el(`<div class="kartu${m.lebar ? ' lebar' : ''}">
    <div class="kartu-kepala">
      <button class="kartu-tautan" data-buka title="Buka ${esc(m.judul)}">
        <span class="urut">${m.urut}.</span>
        <h3>${esc(m.judul)}</h3>
        ${m.hitung ? `<span class="hitung">(${jml} Data)</span>` : ''}
        <span class="panah">${I.kanan}</span>
      </button>
      <div class="kanan">
        <button class="btn btn-kecil" data-tambah>${I.tambah} Tambah Data</button>
      </div>
    </div>
  </div>`);
  kartu.querySelector('[data-buka]').onclick = () => bukaModul(nama);
  kartu.querySelector('[data-tambah]').onclick = () => bukaModul(nama, () => formOrg(nama, null));
  kartu.appendChild(tabelOrg(nama, { pratinjau: true, aksi: m.aksiDiKartu !== false }));
  return kartu;
}

function dasborKetua() {
  const box = el('<div class="k-grid"></div>');
  Object.keys(MODUL).filter((n) => MODUL[n].ruang === 'ketua')
    .forEach((nama) => box.appendChild(kartuOrg(nama)));
  return box;
}

/* --- halaman penuh tiap modul --- */
function halamanOrg(nama) {
  const m = MODUL[nama];
  const bisa = RBAC.can(U, m.izin);
  const kartu = el(`<div class="kartu">
    <div class="kartu-kepala">
      <h3>${esc(m.judul)}</h3>
      <span class="hitung">(${dataModul(nama).length} Data)</span>
      <div class="kanan">
        <input class="cari-org" placeholder="Cari ${esc(m.satuan.toLowerCase())}…" data-cari>
        ${bisa ? `<button class="btn btn-kecil" data-tambah>${I.tambah} Tambah Data</button>` : ''}
      </div>
    </div>
    <div data-wadah></div>
  </div>`);

  const wadah = kartu.querySelector('[data-wadah]');
  const cari = kartu.querySelector('[data-cari]');
  const isiUlang = () => wadah.replaceChildren(tabelOrg(nama, { saring: cari.value }));
  cari.oninput = isiUlang;
  kartu.querySelector('[data-tambah]')?.addEventListener('click', () => formOrg(nama, null));
  isiUlang();
  return kartu;
}

Object.keys(MODUL).forEach((nama) => {
  HAL[nama] = () => halamanOrg(nama);
  HAL[nama].judul = () => [MODUL[nama].judul, MODUL[nama].sub];
});

/* --- form tambah / sunting --- */
function formOrg(nama, item) {
  const m = MODUL[nama];
  if (!RBAC.can(U, m.izin))
    return toast(`Role ${RBAC.roleLabel(U.role)} tidak berwenang mengubah data ini.`, true);

  const isi = el('<div></div>');
  let lampiran = item?.lampiran || '';

  m.form.forEach((f) => {
    const nilaiAwal = item?.[f.k] ?? nilai(f.bawaan) ?? (f.jenis === 'tanggal' ? nowTanggal() : '');
    const g = el(`<div class="grup"><label>${esc(f.l)}${f.wajib ? ' <span style="color:var(--e-merah)">*</span>' : ''}</label></div>`);

    if (f.jenis === 'gambar') {
      const pv = lampiran || window.__ph('LAMPIRAN', '#1B5E20', '#0E2E1C', 'وثيقة');
      const kotak = el(`<div class="pratinjau-gambar">
        <img data-pv src="${pv}" alt="">
        <div style="flex:1;min-width:0">
          <p style="margin:0 0 10px;font-size:12.4px;color:var(--e-abu)">${esc(f.bantu || '')}</p>
          <label class="btn btn-garis btn-kecil" style="display:inline-flex;cursor:pointer;margin:0">
            ${I.gambar} Pilih Gambar<input type="file" accept="image/*" hidden></label>
        </div></div>`);
      const inp = kotak.querySelector('input[type=file]');
      inp.onchange = async () => {
        const berkas = inp.files[0]; if (!berkas) return;
        try { lampiran = await Store.unggahGambar(berkas, 1000); kotak.querySelector('[data-pv]').src = lampiran; }
        catch (e) { toast(e.message, true); }
        inp.value = '';
      };
      g.appendChild(kotak);
    } else if (f.jenis === 'pilih') {
      g.appendChild(el(`<select data-k="${f.k}">${nilai(f.pilihan).map((o) =>
        `<option value="${esc(o.v)}" ${nilaiAwal === o.v ? 'selected' : ''}>${esc(o.l)}</option>`).join('')}</select>`));
    } else if (f.jenis === 'area') {
      g.appendChild(el(`<textarea data-k="${f.k}" style="min-height:82px" placeholder="${esc(f.ph || '')}">${esc(nilaiAwal)}</textarea>`));
    } else {
      const tipe = f.jenis === 'tanggal' ? 'date' : f.jenis === 'angka' ? 'number' : 'text';
      g.appendChild(el(`<input data-k="${f.k}" type="${tipe}" ${f.jenis === 'angka' ? 'min="0" step="any"' : ''}
        value="${esc(nilaiAwal)}" placeholder="${esc(f.ph || '')}">`));
    }
    if (f.bantu && f.jenis !== 'gambar') g.appendChild(el(`<div class="bantu">${esc(f.bantu)}</div>`));
    isi.appendChild(g);
  });

  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button>
    <button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: `${item ? 'Sunting' : 'Tambah'} ${m.satuan}`, isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const data = { id: item?.id, ...(item ? {} : nilai(m.bawaanBaru) || {}) };
    let kurang = '';
    m.form.forEach((f) => {
      const mentah = f.jenis === 'gambar' ? lampiran : isi.querySelector(`[data-k="${f.k}"]`).value.trim();
      if (f.wajib && !mentah) kurang = kurang || f.l;
      data[f.k] = f.jenis === 'angka' ? Number(mentah || 0) : mentah;
    });
    if (kurang) return toast(`${kurang} wajib diisi.`, true);
    aman(() => {
      const rapi = m.rapikan ? m.rapikan(data) : data;
      if (m.simpan) m.simpan(rapi); else Store.simpanKoleksi(U, m.koleksi || nama, rapi);
      tutupModal(); toast('Data tersimpan.'); gambar();
    });
  };
}

/* ============================================================
   DASBOR SEKRETARIS — ubin pintasan
   ------------------------------------------------------------
   Jumlah dokumen dicetak di kaki tiap ubin sebagai isyarat beban
   kerja. Seperti dasbor Ketua, tidak ada data yang ditulis di
   sini: menekan ubin membuka halaman modulnya.
   ============================================================ */
const KARTU_SEK = [
  { modul: 'surat-internal'  },
  { modul: 'surat-eksternal' },
  { modul: 'surat-keputusan', satuan: 'Kategori', hitung: () => Object.keys(JENIS_SK).length, anak: true },
  { modul: 'surat-masuk'  },
  { modul: 'surat-keluar' },
  { modul: 'sertifikat'   },
  { modul: 'ttd', satuan: 'Divisi' },
  { modul: 'anggota-angkatan', judul: 'Data Anggota & Alumni', ikon: I.grup,
    ket: 'Kelola data anggota perangkatan dan data alumni',
    warna: ['rgba(240,149,30,.15)', '#B87310'], satuan: 'Data',
    hitung: () => Store.db.users.length },
  { modul: 'arsip', lebar: true, judul: 'Link Arsip Kepenulisan', ikon: I.tautan,
    ket: 'Akses kumpulan arsip keilmuan, karya tulis, dan dokumentasi kajian',
    warna: ['rgba(140,198,63,.16)', '#4A7A1E'], satuan: 'Arsip Tersedia',
    hitung: () => Store.db.artikel.length, tautan: 'Buka Arsip' },
];

/** Ubin yang cabangnya sedang dibentangkan di dasbor. */
const pintasTerbuka = new Set();

function kartuPintas(k, urut) {
  const m = MODUL[k.modul] || {};
  const judul = k.judul || m.judul;
  const ket = k.ket || m.ket;
  const [w, wc] = k.warna || m.warna;
  const jml = k.hitung ? k.hitung() : dataModul(k.modul).length;
  const satuan = k.satuan || 'Dokumen';
  const terbuka = k.anak && pintasTerbuka.has(k.modul);

  const kartu = el(`<div class="pintas${k.lebar ? ' lebar' : ''}" style="--w:${w};--wc:${wc}" role="button" tabindex="0">
    ${k.anak ? `<button class="pintas-lipat${terbuka ? ' terbuka' : ''}" data-lipat title="Lihat jenis SK">${I.bawah}</button>` : ''}
    <span class="pintas-ik">${k.ikon || m.ikon}</span>
    <div class="isi">
      <h3>${urut}. ${esc(judul)}</h3>
      <p>${esc(ket)}</p>
      ${k.lebar ? `<div class="pintas-kaki">
        <span class="pintas-hitung">${jml}</span>
        <span class="pintas-satuan">${esc(satuan)}</span>
      </div>` : ''}
    </div>
    ${k.lebar
      ? `<span class="tautan">${esc(k.tautan)} ${I.panahLuar}</span>`
      : `<div class="pintas-kaki">
           <span class="pintas-hitung">${jml}</span>
           <span class="pintas-satuan">${esc(satuan)}</span>
           <span class="pintas-panah">${I.panahKanan}</span>
         </div>`}
  </div>`);

  /* Kartu melebar tidak memakai pembungkus .isi pada rancangannya, tetapi
     susunan datanya sama — jadi cukup satu cetakan untuk keduanya. */
  if (!k.lebar) {
    const isi = kartu.querySelector('.isi');
    isi.replaceWith(...isi.childNodes);
  }

  kartu.onclick = (e) => { if (!e.target.closest('[data-lipat]')) bukaModul(k.modul); };
  kartu.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bukaModul(k.modul); } };

  const lipat = kartu.querySelector('[data-lipat]');
  if (lipat) {
    lipat.onclick = () => {
      pintasTerbuka.has(k.modul) ? pintasTerbuka.delete(k.modul) : pintasTerbuka.add(k.modul);
      gambar();
    };
    if (terbuka) {
      const daftar = el(`<div class="pintas-anak">${Object.entries(JENIS_SK).map(([j, l]) =>
        `<button data-sk="sk-${j}">${I.kanan}<span>${esc(l)}</span>
          <span class="jml">${Store.db.surat.filter((x) => x.jenisSk === j).length}</span></button>`).join('')}</div>`);
      daftar.querySelectorAll('[data-sk]').forEach((b) => {
        b.onclick = (e) => { e.stopPropagation(); bukaModul(b.dataset.sk); };
      });
      kartu.appendChild(daftar);
    }
  }
  return kartu;
}

/* Rehal bermushaf terbuka, tinta, dan pena — hiasan panel ayat. */
const hiasRehal = () => `<svg class="hias" viewBox="0 0 200 150" fill="none" aria-hidden="true">
  <path d="M58 132 122 62M132 132 68 62" stroke="#C9A96A" stroke-width="8" stroke-linecap="round"/>
  <path d="M64 104h62" stroke="#B08F5E" stroke-width="6" stroke-linecap="round"/>
  <path d="M95 92 47 66q-5-3-7 3l-1 5q-1 5 4 7l52 21z" fill="#FAF6ED" stroke="#C9A96A" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M95 92 143 66q5-3 7 3l1 5q1 5-4 7l-52 21z" fill="#F2E9D7" stroke="#C9A96A" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M55 74l30 16M51 80l34 18M143 74l-30 16M147 80l-34 18"
        stroke="#C9A96A" stroke-width="1.8" stroke-linecap="round" opacity=".55"/>
  <path d="M160 134h28v-15q0-7-7-7h-14q-7 0-7 7z" fill="#C9A96A"/>
  <path d="M164 112h20v-6h-20z" fill="#A8895C"/>
  <path d="M174 106q3-24 14-44 5 20-4 38-4 8-10 6z" fill="#EFE4D2" stroke="#B08F5E" stroke-width="2" stroke-linejoin="round"/>
  <path d="M176 104q6-20 12-34" stroke="#B08F5E" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
  <path d="M34 140h132" stroke="#E3D9C6" stroke-width="5" stroke-linecap="round"/>
</svg>`;

function dasborSekretaris() {
  const box = el('<div></div>');
  const grid = el('<div class="pintas-grid"></div>');
  KARTU_SEK.forEach((k, i) => {
    const kartu = kartuPintas(k, i + 1);
    if (k.lebar) kartu.classList.add('lebar');
    grid.appendChild(kartu);
  });
  box.appendChild(grid);

  box.appendChild(el(`<div class="panel-ayat">
    <span class="tanda">&ldquo;</span>
    <blockquote>
      Dan (ingatlah) ketika Allah mengangkat orang-orang yang beriman di antaramu dan
      orang-orang yang diberi ilmu beberapa derajat. Dan Allah Maha Mengetahui apa yang kamu kerjakan.
      <span class="sumber">— QS. Al-Mujadilah: 11</span>
    </blockquote>
    ${hiasRehal()}
  </div>`));
  return box;
}

/* ============================================================
   DATA ANGGOTA PERANGKATAN & ALUMNI
   ------------------------------------------------------------
   Keduanya tampilan atas `db.users`, bukan daftar tersendiri —
   satu sumber kebenaran dengan absensi kajian dan halaman publik.
   ============================================================ */
const NILAI_ROMAWI = { I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8, IX:9, X:10, XI:11, XII:12 };
const urutAngkatan = (a) => {
  if (a === 'Pendiri') return 0;
  return NILAI_ROMAWI[String(a).replace(/^Angkatan\s+/i, '')] ?? 99;
};

function tabelAnggota(daftar, kolomAngkatan) {
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama</th>
      ${kolomAngkatan ? '<th>Angkatan</th>' : ''}
      <th>Jenjang</th><th>Status</th><th class="kol-aksi">Aksi</th></tr></thead>
    <tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  daftar.forEach((u, i) => {
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td><div style="display:flex;align-items:center;gap:10px">
        <img src="${u.foto}" alt="" style="width:32px;height:32px;border-radius:50%;flex:none">
        <div><b>${esc(u.nama)}</b><br><span style="color:var(--e-abu);font-size:11.6px">${esc(u.email)}</span></div>
      </div></td>
      ${kolomAngkatan ? `<td class="utuh">${esc(u.angkatan)}</td>` : ''}
      <td class="utuh">${esc(u.level)}</td>
      <td><span class="lencana ${u.status === 'aktif' ? 'l-hijau' : u.status === 'alumni' ? 'l-biru' : 'l-abu'}">${esc(u.status)}</span></td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Sunting">${I.sunting}</button></div></td>
    </tr>`);
    tr.querySelector('.sunting').onclick = () => formAnggota(u);
    tb.appendChild(tr);
  });
  return t;
}

HAL['anggota-angkatan'] = () => {
  const box = el('<div></div>');
  const kepala = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Data Anggota Perangkatan</h3>
    <span class="hitung">(${Store.db.users.length} Data)</span>
    <div class="kanan">
      <input class="cari-org" placeholder="Cari anggota…" data-cari>
      <button class="btn btn-kecil" data-tambah>${I.tambah} Tambah Anggota</button>
    </div></div></div>`);
  kepala.querySelector('[data-tambah]').onclick = () => formAnggota(null);
  box.appendChild(kepala);

  const wadah = el('<div></div>');
  box.appendChild(wadah);

  const isiUlang = () => {
    const q = kepala.querySelector('[data-cari]').value.trim().toLowerCase();
    const cocok = Store.db.users.filter((u) =>
      !q || `${u.nama} ${u.email} ${u.angkatan} ${u.level}`.toLowerCase().includes(q));

    const grup = {};
    cocok.forEach((u) => { (grup[u.angkatan] ||= []).push(u); });
    const urutan = Object.keys(grup).sort((a, b) => urutAngkatan(a) - urutAngkatan(b));

    wadah.innerHTML = '';
    if (!urutan.length) {
      wadah.appendChild(el(`<div class="kartu"><div class="kosong-erp">${I.kotak}
        <p>Tidak ada anggota yang cocok</p><small>Coba kata kunci lain.</small></div></div>`));
      return;
    }
    urutan.forEach((ang) => {
      const kartu = el(`<div class="kartu" style="margin-bottom:18px"><div class="kartu-kepala">
        <h3>${esc(ang)}</h3><span class="hitung">(${grup[ang].length} orang)</span>
        <div class="kanan"><span class="lencana l-hijau">${grup[ang].filter((u) => u.status === 'aktif').length} aktif</span></div>
      </div></div>`);
      kartu.appendChild(tabelAnggota(grup[ang], false));
      wadah.appendChild(kartu);
    });
  };
  kepala.querySelector('[data-cari]').oninput = isiUlang;
  isiUlang();
  return box;
};
HAL['anggota-angkatan'].judul = () => ['Data Anggota Perangkatan', 'Keanggotaan kajian dikelompokkan menurut angkatan.'];

HAL.alumni = () => {
  const alumni = Store.db.users.filter((u) => u.status === 'alumni')
    .sort((a, b) => urutAngkatan(a.angkatan) - urutAngkatan(b.angkatan));
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Data Alumni</h3><span class="hitung">(${alumni.length} Data)</span>
    <div class="kanan"><span class="lencana l-biru">${new Set(alumni.map((u) => u.angkatan)).size} angkatan</span></div>
  </div></div>`);
  if (!alumni.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada alumni tercatat</p>
      <small>Anggota berstatus "alumni" akan muncul di sini.</small></div>`));
    return kartu;
  }
  kartu.appendChild(tabelAnggota(alumni, true));
  return kartu;
};
HAL.alumni.judul = () => ['Data Alumni', 'Anggota yang telah menuntaskan jenjang kajian.'];

/* ============================================================
   LINK ARSIP KEPENULISAN — jendela ke Karya Tulis Ilmiah
   ------------------------------------------------------------
   Baca saja. Penyuntingan tetap milik PJ Artikel,
   sehingga tidak ada dua pintu yang mengubah naskah yang sama.
   ============================================================ */
HAL.arsip = () => {
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Arsip ini bersumber dari modul Karya Tulis Ilmiah</b>
    Sekretaris dapat menelusuri dan membuka seluruh naskah untuk keperluan arsip.
    Penyuntingan dan penerbitannya tetap menjadi wewenang PJ Artikel.
  </div></div></div>`);

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Link Arsip Kepenulisan</h3>
    <span class="hitung">(${Store.db.artikel.length} Arsip Tersedia)</span>
    <div class="kanan"><input class="cari-org" placeholder="Cari judul atau penulis…" data-cari></div>
  </div><div data-wadah></div></div>`);
  const wadah = kartu.querySelector('[data-wadah]');
  const cari = kartu.querySelector('[data-cari]');

  const isiUlang = () => {
    const q = cari.value.trim().toLowerCase();
    const data = Store.db.artikel.filter((a) =>
      !q || `${a.judul} ${Store.namaUser(a.penulisId)} ${a.kategori}`.toLowerCase().includes(q));

    if (!data.length) {
      wadah.replaceChildren(el(`<div class="kosong-erp">${I.kotak}<p>Tidak ada arsip yang cocok</p></div>`));
      return;
    }
    const t = el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>Judul Naskah</th><th>Penulis</th>
        <th>Kategori</th><th>Tanggal</th><th>Status</th><th class="kol-aksi">Buka</th></tr></thead>
      <tbody></tbody></table></div>`);
    const tb = t.querySelector('tbody');
    data.forEach((a, i) => {
      const st = STATUS_ART[a.status];
      const tr = el(`<tr>
        <td class="kol-no">${i + 1}</td>
        <td><div style="display:flex;align-items:center;gap:10px">
          <img src="${a.cover}" alt="" style="width:40px;height:30px;border-radius:6px;object-fit:cover;flex:none">
          <span>${esc(a.judul)}</span></div></td>
        <td>${esc(Store.namaUser(a.penulisId))}</td>
        <td class="utuh">${esc(a.kategori)}</td>
        <td class="utuh">${tgl(a.tanggal)}</td>
        <td><span class="lencana ${st.c}">${st.l}</span></td>
        <td class="kol-aksi"><div class="sel-aksi">
          <button class="ikon-aksi" title="Buka naskah">${I.mata}</button></div></td>
      </tr>`);
      tr.querySelector('button').onclick = () => modal({
        judul: a.judul, lebar: true,
        isi: `<img src="${a.cover}" alt="" style="width:100%;border-radius:12px;margin-bottom:16px">
          <p style="font-size:12.6px;color:var(--e-abu);margin:0 0 14px">
            ${esc(Store.namaUser(a.penulisId))} · ${esc(a.kategori)} · ${tgl(a.tanggal)}</p>
          <p style="font-size:13.6px;font-weight:700;margin:0 0 12px">${esc(a.ringkas)}</p>
          ${(a.isi || []).map((par) => `<p style="font-size:13.4px;line-height:1.8">${esc(par)}</p>`).join('')}`,
      });
      tb.appendChild(tr);
    });
    wadah.replaceChildren(t);
  };
  cari.oninput = isiUlang;
  isiUlang();
  box.appendChild(kartu);
  return box;
};
HAL.arsip.judul = () => ['Link Arsip Kepenulisan', 'Kumpulan arsip keilmuan, karya tulis, dan dokumentasi kajian.'];

/* ============================================================
   RUANG KERJA PJ ARTIKEL — target, penugasan, dan pemantauan
   ------------------------------------------------------------
   Penugasan hidup terpisah dari naskah: PJ menetapkan judul di
   awal bulan, anggota menuliskannya kemudian. Begitu naskahnya
   masuk, Store menyambungkan keduanya dan menaikkan progress
   sendiri — jadi tabel ini tak pernah mengaku sebuah artikel
   sudah siap padahal naskahnya belum ada.
   ============================================================ */
const PROGRES = {
  belum : { l: 'Belum',     c: 'l-merah'  },
  proses: { l: 'On Proses', c: 'l-kuning' },
  siap  : { l: 'Siap',      c: 'l-hijau'  },
};

let bulanRedaksi = null;

const bulanTersedia = () => [...new Set(Store.db.penugasan.map((p) => p.bulan))].sort().reverse();

/** Bulan yang sedang dilihat. Bawaannya bulan terisi paling akhir, bukan
    bulan hari ini — supaya dasbor tetap bercerita walau prototipe dibuka
    jauh setelah data contohnya dibuat. */
function bulanAktif() {
  const ada = bulanTersedia();
  if (!bulanRedaksi || !ada.includes(bulanRedaksi)) bulanRedaksi = ada[0] || nowTanggal().slice(0, 7);
  return bulanRedaksi;
}

const tugasBulan = (b = bulanAktif()) => Store.db.penugasan.filter((p) => p.bulan === b);

/** Capaian target: rata-rata penugasan per penulis dibanding target. */
function capaianTarget(b = bulanAktif()) {
  const target = Store.db.redaksi.targetBulanan || 1;
  const tugas = tugasBulan(b);
  const penulis = new Set(tugas.map((t) => t.userId)).size;
  const rata = penulis ? tugas.length / penulis : 0;
  return { target, penulis, rata, persen: Math.min(100, Math.round((rata / target) * 100)) };
}

/** Unduh CSV. BOM UTF-8 di depan supaya Excel membaca huruf beraksen
    dengan benar alih-alih menampilkannya sebagai simbol acak. */
function unduhCsv(namaBerkas, baris) {
  const isi = '﻿' + baris
    .map((r) => r.map((sel) => `"${String(sel ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([isi], { type: 'text/csv;charset=utf-8' }));
  a.download = namaBerkas;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast(`${namaBerkas} diunduh.`);
}

const potongJudul = (s, n = 46) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

/** Sel nama anggota: foto bundar + nama, dipakai beberapa tabel redaksi. */
function selAnggota(u) {
  return `<div style="display:flex;align-items:center;gap:10px">
    <img src="${u?.foto || ''}" alt="" style="width:30px;height:30px;border-radius:50%;flex:none">
    <span>${esc(u?.nama || '—')}</span></div>`;
}

/* Buku catatan, pena, dan kopi — hiasan panel target. */
const hiasCatatan = () => `<svg class="hias" viewBox="0 0 220 150" fill="none" aria-hidden="true">
  <rect x="26" y="42" width="122" height="86" rx="9" fill="#E4E9DE" transform="rotate(-4 26 42)"/>
  <rect x="30" y="36" width="122" height="86" rx="9" fill="#F7F4EA" stroke="#CBD3C4" stroke-width="2"/>
  <path d="M44 58h84M44 72h84M44 86h62" stroke="#C3CDBB" stroke-width="2.6" stroke-linecap="round"/>
  <rect x="30" y="36" width="13" height="86" rx="6" fill="#2F5D3A" opacity=".85"/>
  <path d="M64 122q42 10 84-4" stroke="#CBD3C4" stroke-width="2" stroke-linecap="round"/>
  <path d="M70 116 148 66l9 13-78 50-13 4z" fill="#1F3D28"/>
  <path d="m148 66 9 13 8-5a4 4 0 0 0 1-6l-3-5a4 4 0 0 0-6-1z" fill="#8CC63F"/>
  <path d="m66 121 4-9 9 6z" fill="#F7F4EA"/>
  <rect x="166" y="70" width="40" height="52" rx="7" fill="#F7F4EA" stroke="#CBD3C4" stroke-width="2"/>
  <rect x="166" y="70" width="40" height="15" rx="7" fill="#2F5D3A"/>
  <path d="M206 88h7a7 7 0 0 1 0 14h-7" stroke="#CBD3C4" stroke-width="2.4" fill="none"/>
  <path d="M174 98h24" stroke="#CBD3C4" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;

function dasborRedaksi() {
  const box = el('<div></div>');
  const b = bulanAktif();
  const c = capaianTarget(b);
  const rataTampil = Number.isInteger(c.rata) ? c.rata : c.rata.toFixed(1);

  /* --- panel target bulanan --- */
  box.appendChild(el(`<div class="rd-target">
    <div class="rd-kiri">
      <div class="rd-kepala">
        <span class="rd-ik">${I.sasaran}</span>
        <div><h3>Target Bulanan</h3>
          <p>Setiap anggota wajib membuat minimal ${c.target} artikel setiap bulannya.</p></div>
      </div>
      <div class="rd-kotak">
        <div class="rd-angka">${rataTampil} / ${c.target} <span>Artikel</span></div>
        <div class="rd-ket">Target per anggota per bulan · ${esc(namaBulan(b))}</div>
        <div class="bar-maju"><span style="width:${c.persen}%"></span></div>
        <div class="rd-capai ${c.persen >= 100 ? 'penuh' : ''}">${I.cekBulat} ${c.persen}% Tercapai</div>
      </div>
    </div>
    <div class="rd-kanan">
      ${hiasCatatan()}
      <blockquote>
        <span class="tanda">&ldquo;</span>
        Menulis adalah salah satu cara terbaik untuk memahami, merenungkan,
        dan menyampaikan ilmu yang bermanfaat.
        <span class="sumber">— Kajian ${esc(Store.cms.situs.nama)}</span>
      </blockquote>
    </div>
  </div>`));

  /* --- perincian progress --- */
  const kartu = el(`<div class="kartu" style="margin-top:20px">
    <div class="kartu-kepala" style="align-items:flex-start">
      <div>
        <h3>Perincian Progress Artikel Anggota</h3>
        <p style="margin:4px 0 0;font-size:12.7px;color:var(--e-abu)">
          Pantau progress penulisan artikel setiap anggota secara real-time.</p>
      </div>
      <div class="kanan">
        <span class="bungkus-bulan">${I.kalender}
          <select class="pilih-bulan" data-bulan>${bulanTersedia().map((x) =>
            `<option value="${x}" ${x === b ? 'selected' : ''}>${esc(namaBulan(x))}</option>`).join('')}</select>
        </span>
        <button class="btn btn-kecil" data-export>${I.unduh} Export Excel</button>
      </div>
    </div>
    <div data-wadah></div>
  </div>`);

  kartu.querySelector('[data-bulan]').onchange = (e) => { bulanRedaksi = e.target.value; gambar(); };
  kartu.querySelector('[data-export]').onclick = () => {
    const baris = [['No.', 'Nama Anggota', 'Judul Artikel', 'Progress', 'Deadline']];
    tugasBulan(b).forEach((t, i) => baris.push([
      i + 1, Store.namaUser(t.userId), t.judul, PROGRES[t.progress]?.l || t.progress, tgl(t.deadline),
    ]));
    unduhCsv(`progress-artikel-${b}.csv`, baris);
  };

  const daftar = [...tugasBulan(b)].sort((x, y) =>
    Store.namaUser(x.userId).localeCompare(Store.namaUser(y.userId)));
  const wadah = kartu.querySelector('[data-wadah]');

  if (!daftar.length) {
    wadah.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada penugasan pada ${esc(namaBulan(b))}</p>
      <small>Tetapkan penugasan dari halaman Target Artikel.</small></div>`));
  } else {
    const t = el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>Nama Anggota</th><th>Judul Artikel</th>
        <th>Progress</th><th>Deadline</th><th class="kol-aksi">Aksi</th></tr></thead>
      <tbody></tbody></table></div>`);
    const tb = t.querySelector('tbody');
    daftar.forEach((tg, i) => {
      const tr = el(`<tr>
        <td class="kol-no">${i + 1}</td>
        <td>${selAnggota(Store.getUser(tg.userId))}</td>
        <td>${esc(tg.judul)}</td>
        <td><span class="lencana ${PROGRES[tg.progress]?.c || 'l-abu'}">${esc(PROGRES[tg.progress]?.l || tg.progress)}</span></td>
        <td class="utuh">${tgl(tg.deadline)}</td>
        <td class="kol-aksi"><div class="sel-aksi">
          <button class="ikon-aksi sunting" title="Sunting penugasan">${I.sunting}</button></div></td>
      </tr>`);
      /* Dasbor tetap etalase: menyunting membuka halaman Target Artikel. */
      tr.querySelector('.sunting').onclick = () => bukaModul('target-artikel', () => formOrg('target-artikel', tg));
      tb.appendChild(tr);
    });
    wadah.appendChild(t);
  }
  box.appendChild(kartu);
  return box;
}

/* --- Target Artikel: setelan target + daftar penugasan bulan terpilih --- */
MODUL['target-artikel'] = {
  ruang: 'redaksi', izin: 'redaksi.manage', koleksi: 'penugasan',
  judul: 'Penugasan Artikel', satuan: 'Penugasan',
  sub: 'Tetapkan target bulanan dan bagikan judul kepada setiap anggota.',
  sumber: () => tugasBulan(),
  bawaanBaru: () => ({ artikelId: '' }),
  cari: (x) => `${Store.namaUser(x.userId)} ${x.judul}`,
  tajuk: (x) => x.judul,
  pratinjau: { awal: 3, akhir: 1 },
  kolom: [
    { l: 'Nama Anggota', isi: (x) => selAnggota(Store.getUser(x.userId)) },
    { l: 'Judul Artikel', isi: (x) => esc(x.judul) },
    { l: 'Progress', isi: (x) => `<span class="lencana ${PROGRES[x.progress]?.c || 'l-abu'}">${esc(PROGRES[x.progress]?.l || x.progress)}</span>` },
    { l: 'Deadline', kelas: 'utuh', isi: (x) => tgl(x.deadline) },
  ],
  form: [
    { k: 'userId', l: 'Anggota Penulis', jenis: 'pilih',
      pilihan: () => Store.db.users.filter((u) => u.status === 'aktif')
        .map((u) => ({ v: u.id, l: u.nama })) },
    { k: 'judul', l: 'Judul Artikel', wajib: true, jenis: 'area', ph: 'Muhammad Abduh dan Pembaruan Tafsir' },
    { k: 'bulan', l: 'Bulan Penugasan', jenis: 'pilih', bawaan: () => bulanAktif(),
      pilihan: () => bulanPilihan().map((v) => ({ v, l: namaBulan(v) })) },
    { k: 'deadline', l: 'Tenggat', jenis: 'tanggal', wajib: true, bawaan: () => akhirBulan(bulanAktif()) },
    { k: 'progress', l: 'Progress', jenis: 'pilih', bawaan: 'belum',
      pilihan: Object.entries(PROGRES).map(([v, x]) => ({ v, l: x.l })),
      bantu: 'Progress ikut menyesuaikan sendiri begitu anggota mengirim naskahnya lewat ERP.' },
    { k: 'catatan', l: 'Catatan untuk Penulis', jenis: 'area', ph: 'Arahan tema, rujukan yang disarankan, atau batasan pembahasan.' },
  ],
};

const akhirBulan = (b) => {
  const [th, bl] = b.split('-').map(Number);
  return `${b}-${String(new Date(th, bl, 0).getDate()).padStart(2, '0')}`;
};

/** Bulan yang boleh dipilih: yang sudah ada isinya, ditambah bulan ini
    dan bulan depan supaya penugasan baru bisa dijadwalkan ke depan. */
function bulanPilihan() {
  const d = new Date();
  const depan = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  const tambahan = [d.toISOString().slice(0, 7), depan.toISOString().slice(0, 7)];
  return [...new Set([...bulanTersedia(), ...tambahan])].sort().reverse();
}

HAL['target-artikel'] = () => {
  const box = el('<div></div>');
  const c = capaianTarget();

  const setelan = el(`<div class="kartu" style="margin-bottom:20px">
    <div class="kartu-kepala"><h3>Target Bulanan</h3>
      <span class="hitung">berlaku untuk seluruh anggota</span></div>
    <div class="panel-isi" style="display:flex;gap:22px;flex-wrap:wrap;align-items:flex-end">
      <div class="grup" style="margin:0;width:220px">
        <label>Minimal artikel per anggota</label>
        <input type="number" min="1" max="20" id="tg" value="${c.target}">
        <div class="bantu">Dipakai menghitung capaian di dasbor dan rekap.</div>
      </div>
      <button class="btn btn-lime btn-kecil" id="simpanTg">${I.cek} Simpan Target</button>
      <div style="margin-left:auto;text-align:right">
        <div style="font-size:12.4px;color:var(--e-abu)">Capaian ${esc(namaBulan(bulanAktif()))}</div>
        <div style="font-size:22px;font-weight:800;color:${c.persen >= 100 ? '#4A7A1E' : '#B87310'}">${c.persen}%</div>
      </div>
    </div></div>`);
  setelan.querySelector('#simpanTg').onclick = () => aman(() => {
    const n = Store.setTargetArtikel(U, setelan.querySelector('#tg').value);
    toast(`Target diubah menjadi ${n} artikel per anggota per bulan.`); gambar();
  });
  box.appendChild(setelan);

  const pilih = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Penugasan ${esc(namaBulan(bulanAktif()))}</h3>
    <span class="hitung">(${tugasBulan().length} Penugasan · ${c.penulis} penulis)</span>
    <div class="kanan">
      <span class="bungkus-bulan">${I.kalender}
        <select class="pilih-bulan" data-bulan>${bulanTersedia().map((x) =>
          `<option value="${x}" ${x === bulanAktif() ? 'selected' : ''}>${esc(namaBulan(x))}</option>`).join('')}</select>
      </span>
    </div></div></div>`);
  pilih.querySelector('[data-bulan]').onchange = (e) => { bulanRedaksi = e.target.value; gambar(); };
  box.appendChild(pilih);

  box.appendChild(halamanOrg('target-artikel'));
  return box;
};
HAL['target-artikel'].judul = () => ['Target Artikel', 'Tetapkan target bulanan dan bagikan judul kepada setiap anggota.'];

/* --- Performa Anggota --- */
HAL.performa = () => {
  const semua = Store.db.penugasan;
  const target = Store.db.redaksi.targetBulanan || 1;
  const perOrang = {};
  semua.forEach((t) => {
    const o = (perOrang[t.userId] ||= { total: 0, siap: 0, proses: 0, belum: 0 });
    o.total += 1; o[t.progress] = (o[t.progress] || 0) + 1;
  });
  const daftar = Object.entries(perOrang)
    .map(([id, o]) => ({ id, ...o, persen: Math.round((o.siap / o.total) * 100) }))
    .sort((a, b) => b.persen - a.persen || b.siap - a.siap);

  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Dihitung dari seluruh bulan yang tercatat</b>
    Persentase adalah bagian penugasan yang naskahnya sudah siap — bukan sekadar
    yang ditandai manual, sebab progress ikut menyesuaikan ketika naskah benar-benar masuk.
  </div></div></div>`);

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Performa Anggota</h3><span class="hitung">(${daftar.length} penulis · target ${target}/bulan)</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-export>${I.unduh} Export Excel</button></div>
  </div></div>`);
  kartu.querySelector('[data-export]').onclick = () => {
    const baris = [['No.', 'Nama Anggota', 'Total Penugasan', 'Siap', 'On Proses', 'Belum', 'Persentase Siap']];
    daftar.forEach((d, i) => baris.push([i + 1, Store.namaUser(d.id), d.total, d.siap, d.proses || 0, d.belum || 0, d.persen + '%']));
    unduhCsv('performa-anggota.csv', baris);
  };

  if (!daftar.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada penugasan tercatat</p></div>`));
    box.appendChild(kartu); return box;
  }

  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama Anggota</th><th>Penugasan</th>
      <th>Siap</th><th style="min-width:170px">Capaian</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  daftar.forEach((d, i) => tb.appendChild(el(`<tr>
    <td class="kol-no">${i + 1}</td>
    <td>${selAnggota(Store.getUser(d.id))}</td>
    <td class="utuh">${d.total}</td>
    <td class="utuh"><b style="color:#4A7A1E">${d.siap}</b></td>
    <td><div style="display:flex;align-items:center;gap:10px">
      <div class="bar-maju" style="flex:1"><span style="width:${d.persen}%"></span></div>
      <b style="font-size:12.4px;min-width:38px;text-align:right">${d.persen}%</b>
    </div></td>
  </tr>`)));
  kartu.appendChild(t);
  box.appendChild(kartu);
  return box;
};
HAL.performa.judul = () => ['Performa Anggota', 'Capaian penulisan setiap anggota sepanjang periode.'];

/* --- Rekap Bulanan --- */
HAL.rekap = () => {
  const target = Store.db.redaksi.targetBulanan || 1;
  const baris = bulanTersedia().map((b) => {
    const t = tugasBulan(b);
    const penulis = new Set(t.map((x) => x.userId)).size;
    const siap = t.filter((x) => x.progress === 'siap').length;
    return { b, total: t.length, penulis, siap,
      proses: t.filter((x) => x.progress === 'proses').length,
      belum: t.filter((x) => x.progress === 'belum').length,
      persen: t.length ? Math.round((siap / t.length) * 100) : 0,
      kuota: penulis ? Math.min(100, Math.round((t.length / penulis / target) * 100)) : 0 };
  });

  const box = el('<div></div>');
  const total = baris.reduce((s, r) => s + r.total, 0);
  const siapTotal = baris.reduce((s, r) => s + r.siap, 0);

  box.appendChild(el(`<div class="grid-stat">
    ${[{ ik: I.dok, n: total, l: 'Total penugasan', w: 'rgba(62,127,184,.14)', wc: '#2C6091' },
       { ik: I.cekBulat, n: siapTotal, l: 'Naskah siap', w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' },
       { ik: I.sasaran, n: target, l: 'Target per anggota/bulan', w: 'rgba(47,169,140,.14)', wc: '#1F7A64' },
       { ik: I.bagan, n: baris.length, l: 'Bulan tercatat', w: 'rgba(240,149,30,.14)', wc: '#B87310' }]
      .map((s) => `<div class="stat" style="--w:${s.w};--wc:${s.wc}">
        <div class="stat-ik">${s.ik}</div><div class="stat-nilai">${s.n}</div>
        <div class="stat-label">${esc(s.l)}</div></div>`).join('')}
  </div>`));

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Rekap Bulanan</h3><span class="hitung">(${baris.length} bulan)</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-export>${I.unduh} Export Excel</button></div>
  </div></div>`);
  kartu.querySelector('[data-export]').onclick = () => {
    const csv = [['Bulan', 'Penulis', 'Penugasan', 'Siap', 'On Proses', 'Belum', '% Siap', '% Kuota Terpenuhi']];
    baris.forEach((r) => csv.push([namaBulan(r.b), r.penulis, r.total, r.siap, r.proses, r.belum, r.persen + '%', r.kuota + '%']));
    unduhCsv('rekap-bulanan-artikel.csv', csv);
  };

  if (!baris.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada bulan tercatat</p></div>`));
    box.appendChild(kartu); return box;
  }

  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Bulan</th><th>Penulis</th><th>Penugasan</th>
      <th>Siap</th><th>On Proses</th><th>Belum</th><th style="min-width:160px">Naskah Siap</th></tr></thead>
    <tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  baris.forEach((r, i) => {
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td class="utuh"><b>${esc(namaBulan(r.b))}</b></td>
      <td class="utuh">${r.penulis}</td><td class="utuh">${r.total}</td>
      <td class="utuh"><b style="color:#4A7A1E">${r.siap}</b></td>
      <td class="utuh">${r.proses}</td><td class="utuh">${r.belum}</td>
      <td><div style="display:flex;align-items:center;gap:10px">
        <div class="bar-maju" style="flex:1"><span style="width:${r.persen}%"></span></div>
        <b style="font-size:12.4px;min-width:38px;text-align:right">${r.persen}%</b></div></td>
    </tr>`);
    tr.style.cursor = 'pointer';
    tr.onclick = () => { bulanRedaksi = r.b; rute = 'target-artikel'; location.hash = rute; gambar(); };
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  box.appendChild(kartu);
  return box;
};
HAL.rekap.judul = () => ['Rekap Bulanan', 'Ringkasan penugasan dan capaian penulisan tiap bulan.'];

/* ============================================================
   KATEGORI ARTIKEL — menyunting CMS, jadi tetap lewat persetujuan
   ============================================================ */
const seksiArtikel = () => Store.draft.halaman.artikel.sections.findIndex((s) => s.tipe === 'daftar-artikel');

HAL['kategori-artikel'] = () => {
  const idx = seksiArtikel();
  const path = `halaman.artikel.sections.${idx}.data.kategori`;
  const kategori = Store.draft.halaman.artikel.sections[idx].data.kategori;
  const bisa = RBAC.can(U, 'cms.kategori.edit');

  const box = el(`<div><div class="notis notis-kuning">${I.perisai}<div>
    <b>Kategori tampil di dua tempat sekaligus</b>
    Daftar ini menjadi filter di halaman Artikel <i>dan</i> sidebar pada hero beranda —
    menambah satu kategori di sini langsung menambahkannya di keduanya. Karena ia bagian
    dari halaman publik, perubahannya masuk ke draft dan baru tayang setelah disetujui
    Ketua Umum, sama seperti perubahan website lainnya.
  </div></div></div>`);
  box.appendChild(el('<div id="barDraft"></div>'));
  box.querySelector('#barDraft').appendChild(barDraft());

  const simpanKat = (arr) => aman(() => {
    Store.ubahDraft(U, path, arr, 'cms.kategori.edit');
    toast('Tersimpan di draft. Ajukan agar ditinjau Ketua.');
    gambar();
  });

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Kategori Artikel</h3><span class="hitung">(${kategori.length} Kategori)</span>
    <div class="kanan">${bisa ? `<button class="btn btn-kecil" data-tambah>${I.tambah} Tambah Kategori</button>` : ''}</div>
  </div></div>`);

  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama Kategori</th><th>Artikel Terbit</th>
      <th>Total Naskah</th><th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  kategori.forEach((k, i) => {
    const semua = Store.db.artikel.filter((a) => a.kategori === k);
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td><b>${esc(k)}</b></td>
      <td class="utuh">${semua.filter((a) => a.status === 'terbit').length}</td>
      <td class="utuh">${semua.length}</td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Ubah nama" ${bisa ? '' : 'disabled'}>${I.sunting}</button>
        <button class="ikon-aksi hapus" title="Hapus" ${bisa ? '' : 'disabled'}>${I.hapus}</button>
      </div></td></tr>`);

    tr.querySelector('.sunting').onclick = () => {
      const isi = el(`<div class="grup"><label>Nama Kategori</label>
        <input id="nk" value="${esc(k)}">
        <div class="bantu">${semua.length} naskah memakai kategori ini dan ikut berganti nama.</div></div>`);
      const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
        <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
      modal({ judul: 'Ubah Nama Kategori', isi, kaki });
      kaki.querySelector('[data-b]').onclick = tutupModal;
      kaki.querySelector('[data-s]').onclick = () => {
        const baru = isi.querySelector('#nk').value.trim();
        if (!baru) return toast('Nama kategori wajib diisi.', true);
        if (baru !== k && kategori.includes(baru)) return toast('Kategori itu sudah ada.', true);
        const arr = [...kategori]; arr[i] = baru;
        /* Naskah ikut dipindahkan, jika tidak ia akan menggantung pada
           kategori yang sudah tidak ada dan hilang dari filter publik. */
        semua.forEach((a) => aman(() => Store.simpanArtikel(U, { ...a, kategori: baru })));
        tutupModal(); simpanKat(arr);
      };
    };

    tr.querySelector('.hapus').onclick = () => {
      if (semua.length) return toast(`Masih ada ${semua.length} naskah berkategori ini. Pindahkan dulu.`, true);
      konfirmasi('Hapus kategori', `"${k}" akan dihapus dari filter halaman Artikel.`,
        () => simpanKat(kategori.filter((_, x) => x !== i)));
    };
    tb.appendChild(tr);
  });
  kartu.appendChild(t);

  kartu.querySelector('[data-tambah]')?.addEventListener('click', () => {
    const isi = el(`<div class="grup"><label>Nama Kategori</label>
      <input id="nk" placeholder="Kajian Tematik"></div>`);
    const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
      <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Tambah</button></div>`);
    modal({ judul: 'Tambah Kategori', isi, kaki });
    kaki.querySelector('[data-b]').onclick = tutupModal;
    kaki.querySelector('[data-s]').onclick = () => {
      const baru = isi.querySelector('#nk').value.trim();
      if (!baru) return toast('Nama kategori wajib diisi.', true);
      if (kategori.includes(baru)) return toast('Kategori itu sudah ada.', true);
      tutupModal(); simpanKat([...kategori, baru]);
    };
  });

  box.appendChild(kartu);
  return box;
};
HAL['kategori-artikel'].judul = () => ['Kategori Artikel', 'Filter kategori pada halaman Artikel publik.'];

/* ============================================================
   PENGATURAN AKUN & PANDUAN PENULIS
   ============================================================ */
HAL.akun = () => {
  const box = el('<div></div>');
  let foto = U.foto;

  const kartu = el(`<div class="kartu"><div class="kartu-kepala"><h3>Pengaturan Akun</h3>
    <span class="hitung">${esc(RBAC.roleLabel(U.role))}</span></div>
    <div class="panel-isi">
      <div class="pratinjau-gambar" style="margin-bottom:18px">
        <img data-pv src="${U.foto}" style="width:82px;height:82px;border-radius:50%;object-fit:cover">
        <div style="flex:1;min-width:0">
          <p style="margin:0 0 10px;font-size:12.4px;color:var(--e-abu)">
            Foto profil tampil di sidebar ERP dan pada daftar anggota.</p>
          <label class="btn btn-garis btn-kecil" style="display:inline-flex;cursor:pointer;margin:0">
            ${I.gambar} Ganti Foto<input type="file" accept="image/*" hidden data-file></label>
        </div>
      </div>
      <div class="grid-form">
        <div class="grup"><label>Nama Lengkap</label><input id="an" value="${esc(U.nama)}"></div>
        <div class="grup"><label>Email</label><input id="ae" type="email" value="${esc(U.email)}"></div>
      </div>
      <button class="btn btn-lime" id="simpanAkun">${I.cek} Simpan Perubahan</button>
    </div></div>`);

  /* Kata sandi terpisah dari formulir profil, sebab jalurnya memang lain:
     ia satu-satunya hal di halaman ini yang tidak pernah singgah di data
     yang dikirim peramban. Yang lama ditanyakan supaya sesi yang tertinggal
     terbuka di komputer bersama tidak dapat dipakai mengunci pemiliknya. */
  const kartuSandi = el(`<div class="kartu" style="margin-top:16px">
    <div class="kartu-kepala"><h3>Kata Sandi</h3></div>
    <div class="panel-isi">
      <div class="grup" style="max-width:340px"><label>Kata Sandi Saat Ini</label>
        <input id="sl" type="password" autocomplete="current-password"></div>
      <div class="grid-form">
        <div class="grup"><label>Kata Sandi Baru</label><input id="ap" type="password" autocomplete="new-password">
          <div class="bantu">Minimal 8 karakter.</div></div>
        <div class="grup"><label>Ulangi Kata Sandi Baru</label><input id="ap2" type="password" autocomplete="new-password"></div>
      </div>
      <button class="btn btn-garis" id="simpanSandi">${I.cek} Ganti Kata Sandi</button>
    </div></div>`);

  const inp = kartu.querySelector('[data-file]');
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    try { foto = await Store.unggahGambar(f, 400); kartu.querySelector('[data-pv]').src = foto; }
    catch (e) { toast(e.message, true); }
    inp.value = '';
  };

  kartu.querySelector('#simpanAkun').onclick = () => {
    const g = (id) => kartu.querySelector('#' + id).value;
    const nama = g('an').trim(), email = g('ae').trim();
    if (!nama || !email) return toast('Nama dan email wajib diisi.', true);
    aman(() => {
      Store.simpanProfil(U, { nama, email, foto });
      toast('Perubahan akun tersimpan.'); gambar();
    });
  };

  kartuSandi.querySelector('#simpanSandi').onclick = async (e) => {
    const g = (id) => kartuSandi.querySelector('#' + id).value;
    const lama = g('sl'), p1 = g('ap'), p2 = g('ap2');
    if (!lama) return toast('Isi kata sandi Anda saat ini.', true);
    if (p1 !== p2) return toast('Kedua kata sandi tidak sama.', true);
    if (p1.length < 8) return toast('Kata sandi minimal 8 karakter.', true);
    const ok = await amanTunggu(e.target, () => Store.gantiSandi(lama, p1));
    if (!ok) return;
    toast('Kata sandi diperbarui.');
    gambar();
  };

  box.appendChild(kartu);
  box.appendChild(kartuSandi);
  return box;
};
HAL.akun.judul = () => ['Pengaturan Akun', 'Identitas, foto, dan kata sandi Anda sendiri.'];

HAL.panduan = () => {
  const panduan = Store.db.redaksi.panduan || [];
  const bisa = RBAC.can(U, 'redaksi.manage');
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Dibaca anggota saat menulis</b>
    Panduan ini menjadi rujukan bersama agar naskah yang masuk seragam bentuknya
    dan tinjauan tidak berulang membahas hal yang sama.
  </div></div></div>`);

  const simpanSemua = (arr) => aman(() => { Store.simpanPanduan(U, arr); toast('Panduan diperbarui.'); gambar(); });

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Panduan Penulis</h3><span class="hitung">(${panduan.length} Bagian)</span>
    <div class="kanan">${bisa ? `<button class="btn btn-kecil" data-tambah>${I.tambah} Tambah Bagian</button>` : ''}</div>
  </div><div class="panel-isi" data-isi></div></div>`);
  const isiEl = kartu.querySelector('[data-isi]');

  if (!panduan.length) {
    isiEl.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada panduan</p>
      <small>Tambahkan bagian pertama agar anggota punya rujukan.</small></div>`));
  }

  const formBagian = (bagian, i) => {
    const isi = el(`<div>
      <div class="grup"><label>Judul Bagian</label><input id="pj" value="${esc(bagian?.judul || '')}" placeholder="Sistematika Naskah"></div>
      <div class="grup"><label>Isi Panduan</label>
        <textarea id="pi" style="min-height:200px" placeholder="Satu baris kosong memisahkan poin.">${esc((bagian?.isi || []).join('\n\n'))}</textarea>
        <div class="bantu">Satu baris kosong = satu poin baru.</div></div>
    </div>`);
    const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
      <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
    modal({ judul: bagian ? 'Ubah Bagian Panduan' : 'Tambah Bagian Panduan', isi, kaki, lebar: true });
    kaki.querySelector('[data-b]').onclick = tutupModal;
    kaki.querySelector('[data-s]').onclick = () => {
      const judul = isi.querySelector('#pj').value.trim();
      if (!judul) return toast('Judul bagian wajib diisi.', true);
      const poin = isi.querySelector('#pi').value.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
      const arr = [...panduan];
      if (bagian) arr[i] = { judul, isi: poin }; else arr.push({ judul, isi: poin });
      tutupModal(); simpanSemua(arr);
    };
  };

  panduan.forEach((bagian, i) => {
    const n = el(`<div class="panduan-bagian">
      <div class="panduan-kepala">
        <span class="no">${i + 1}</span>
        <h4>${esc(bagian.judul)}</h4>
        <div class="sel-aksi" style="margin-left:auto">
          <button class="ikon-aksi sunting" title="Ubah" ${bisa ? '' : 'disabled'}>${I.sunting}</button>
          <button class="ikon-aksi hapus" title="Hapus" ${bisa ? '' : 'disabled'}>${I.hapus}</button>
        </div>
      </div>
      <ul>${(bagian.isi || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    </div>`);
    n.querySelector('.sunting').onclick = () => formBagian(bagian, i);
    n.querySelector('.hapus').onclick = () => konfirmasi('Hapus bagian panduan',
      `"${bagian.judul}" akan dihapus dari panduan penulis.`,
      () => simpanSemua(panduan.filter((_, x) => x !== i)));
    isiEl.appendChild(n);
  });

  kartu.querySelector('[data-tambah]')?.addEventListener('click', () => formBagian(null));
  box.appendChild(kartu);
  return box;
};
HAL.panduan.judul = () => ['Panduan Penulis', 'Rujukan bersama bentuk dan tenggat naskah.'];

/* ============================================================
   RUANG KERJA PJ BUKU — satu proyek, tujuh tahap
   ------------------------------------------------------------
   `naskah` adalah tulang punggungnya: satu baris per sub judul,
   memuat penulis, progress tulis, progress edit, dan bukti
   layout sekaligus. Halaman Penulisan, Editing, dan Layouting
   hanyalah tiga cara memandang daftar yang sama — karena itu
   nama penulis dan sub judulnya mustahil berbeda antar tahap.
   ============================================================ */
const PROG_BUKU = {
  belum : { l: 'Blm',  c: 'l-merah'  },
  proses: { l: 'On',   c: 'l-kuning' },
  siap  : { l: 'Siap', c: 'l-hijau'  },
};

const TAHAP_BUKU = {
  perencanaan: 'Perencanaan', pembagian: 'Pembagian Tugas', penulisan: 'Penulisan',
  editing: 'Editing', layout: 'Layouting & Desain', produksi: 'Produksi & Distribusi',
  selesai: 'Selesai',
};

const bk = () => Store.bukuAktif();
const lencanaProg = (v) => `<span class="lencana ${PROG_BUKU[v]?.c || 'l-abu'}">${esc(PROG_BUKU[v]?.l || v)}</span>`;
const rupiah = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
const pound = (n) => 'EGP ' + Number(n || 0).toLocaleString('id-ID');
const namaBanyak = (ids) => (ids || []).map((id) => Store.namaUser(id)).join(', ') || '—';

/** Kartu bernomor ala rancangan: lencana "01" lalu judul tahapnya. */
function seksiBuku(no, judul, isi, sejajar = false) {
  const n = el(`<div class="bk-seksi${sejajar ? ' sejajar' : ''}">
    <div class="bk-kepala"><span class="bk-no">${no}</span>${judul ? `<h3>${esc(judul)}</h3>` : ''}</div>
    <div class="bk-isi"></div>
  </div>`);
  const wadah = n.querySelector('.bk-isi');
  (Array.isArray(isi) ? isi : [isi]).forEach((x) => wadah.appendChild(x));
  return n;
}

/** Sub-kartu di dalam sebuah tahap: "A. Perencanaan Buku", "2. Penulis", … */
function subKartu(ikon, judul, ket, isi) {
  const n = el(`<div class="bk-sub">
    <div class="bk-sub-kepala">${ikon}<h4>${esc(judul)}</h4>${ket ? `<span class="ket">${esc(ket)}</span>` : ''}</div>
    <div class="bk-sub-isi"></div>
  </div>`);
  const wadah = n.querySelector('.bk-sub-isi');
  (Array.isArray(isi) ? isi : [isi]).forEach((x) => wadah.appendChild(typeof x === 'string' ? el(x) : x));
  return n;
}

/** Tabel ringkas baca-saja. Dasbor tidak menulis apa pun; kolom Aksi
    sengaja bertanda "—" seperti pada rancangan, dan seluruh penyuntingan
    terjadi di halaman tahapnya masing-masing. */
function tabelBuku(kepala, baris) {
  return el(`<div class="tabel-bungkus"><table class="t-org t-rapat">
    <thead><tr>${kepala.map((h) => `<th${h.startsWith('~') ? ' class="kol-tengah"' : ''}>${esc(h.replace(/^~/, ''))}</th>`).join('')}</tr></thead>
    <tbody>${baris.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`);
}

const cekBaca = (on) => `<span class="cek-baca ${on ? 'on' : ''}">${on ? I.cek : ''}</span>`;

function dasborBuku() {
  const b = bk();
  if (!b) {
    const kosong = el(`<div class="kartu"><div class="kosong-erp">${I.kotak}
      <p>Belum ada proyek buku</p><small>Mulai dari halaman Perencanaan.</small></div></div>`);
    return kosong;
  }

  const box = el('<div></div>');
  const penulisUnik = new Set(b.naskah.map((n) => n.userId)).size;

  /* --- empat kartu ringkasan --- */
  box.appendChild(el(`<div class="bk-stat-grid">
    ${[
      { ik: I.buku,      w: 'rgba(140,198,63,.16)', wc: '#4A7A1E', l: 'Proyek Buku Aktif', n: Store.db.buku.length, s: 'Total proyek' },
      { ik: I.alurKerja, w: 'rgba(240,149,30,.15)', wc: '#B87310', l: 'Tahap Berjalan', n: TAHAP_BUKU[b.tahap] || b.tahap, s: 'Tahap saat ini', kecil: true },
      { ik: I.kalender,  w: 'rgba(62,127,184,.14)', wc: '#2C6091', l: 'Total Penulis', n: penulisUnik, s: 'Orang' },
      { ik: I.simpul,    w: 'rgba(124,92,214,.14)', wc: '#5F45AE', l: 'Target Terbit', n: tgl(b.targetTerbit), s: 'Estimasi selesai', kecil: true },
    ].map((s) => `<div class="bk-stat" style="--w:${s.w};--wc:${s.wc}">
      <span class="bk-stat-ik">${s.ik}</span>
      <div><div class="bk-stat-l">${esc(s.l)}</div>
        <div class="bk-stat-n"${s.kecil ? ' style="font-size:19px"' : ''}>${esc(String(s.n))}</div>
        <div class="bk-stat-s">${esc(s.s)}</div></div>
    </div>`).join('')}
  </div>`));

  /* --- 01 Perencanaan --- */
  const rencana = tabelBuku(['No.', 'Komponen', 'Keterangan'], [
    ['1', 'Kumpul Perdana', tgl(b.kumpulPerdana)],
    ['2', 'Judul Besar', `<b>${esc(b.judul)}</b>`],
    ['3', 'Jumlah Sub Judul', `${b.naskah.length} sub judul
      <ol class="bk-sublist">${b.naskah.map((n) => `<li>${esc(n.subJudul)}</li>`).join('')}</ol>`],
  ]);
  const linimasa = tabelBuku(['No.', 'Tahapan', 'Tanggal'],
    b.timeline.map((t, i) => [String(i + 1), esc(t.tahapan), tgl(t.tanggal)]));
  box.appendChild(seksiBuku('01', 'Tahap Perencanaan', el('<div class="bk-kolom-2"></div>')));
  const k01 = box.querySelector('.bk-kolom-2');
  k01.append(subKartu(I.buku, 'A. Perencanaan Buku', '', rencana),
             subKartu(I.dok, 'B. Timeline Proyek', '', linimasa));

  /* --- 02 Pembagian Tugas --- */
  const tugas = el('<div class="bk-tugas"></div>');
  tugas.appendChild(subKartu(I.orang, '1. PJ Utama', '',
    el(`<div class="bk-orang"><b>${esc(Store.namaUser(b.pjUtamaId))}</b><span>Penanggung Jawab Utama</span></div>`)));
  tugas.appendChild(subKartu(I.grup, `2. Penulis`, `(${b.naskah.length} Orang)`,
    tabelBuku(['No.', 'Nama', 'Sub Judul'],
      b.naskah.map((n, i) => [String(i + 1), esc(Store.namaUser(n.userId)), esc(n.subJudul)]))));

  const kanan = el('<div class="bk-tugas-kanan"></div>');
  kanan.appendChild(subKartu(I.orang, `3. Editor`, `(${b.editorIds.length} Orang)`,
    tabelBuku(['No.', 'Nama'], b.editorIds.map((id, i) => [String(i + 1), esc(Store.namaUser(id))]))));
  kanan.appendChild(subKartu(I.orang, `4. Layouter`, `(${b.layouterIds.length} Orang)`,
    tabelBuku(['No.', 'Nama'], b.layouterIds.map((id, i) => [String(i + 1), esc(Store.namaUser(id))]))));
  kanan.appendChild(subKartu(I.dok, `5. Desainer`, `(${b.desainerIds.length} Orang)`,
    tabelBuku(['No.', 'Nama'], b.desainerIds.map((id, i) => [String(i + 1), esc(Store.namaUser(id))]))));
  tugas.appendChild(kanan);
  tugas.appendChild(subKartu(I.grup, '6. Produksi & Distribusi', `Penanggung Jawab: ${Store.namaUser(b.pjProduksiId)}`,
    tabelBuku(['No.', 'Kegiatan', '~Selesai'],
      b.produksi.map((p, i) => [String(i + 1), esc(p.kegiatan), cekBaca(p.selesai)]))));
  box.appendChild(seksiBuku('02', 'Tahap Pembagian Tugas', tugas));

  /* --- 03 Penulisan --- */
  box.appendChild(seksiBuku('03', 'Tahap Penulisan',
    tabelBuku(['No.', 'Nama', 'Sub Judul', 'Progress', 'Deadline', 'Aksi'],
      b.naskah.map((n, i) => [String(i + 1), esc(Store.namaUser(n.userId)), esc(n.subJudul),
        lencanaProg(n.progressTulis), tgl(n.deadline), '<span style="color:var(--e-abu)">—</span>']))));

  /* --- 04 Editing / Layouting / Desain --- */
  const tiga = el('<div class="bk-kolom-3"></div>');
  tiga.appendChild(subKartu(I.dokCek, 'A. Editing', '',
    tabelBuku(['No.', 'Nama', 'Sub Judul', 'Progress'],
      b.naskah.map((n, i) => [String(i + 1), esc(Store.namaUser(n.userId)), esc(n.subJudul), lencanaProg(n.progressEdit)]))));
  tiga.appendChild(subKartu(I.layout, 'B. Layouting', '',
    tabelBuku(['No.', 'Sub Judul', 'Bukti (Upload)'],
      b.naskah.filter((n) => n.buktiLayout).map((n, i) =>
        [String(i + 1), esc(n.subJudul), `<img class="lampiran-mini" src="${n.buktiLayout}" alt="">`]))));
  tiga.appendChild(subKartu(I.orang, 'C. Desain', '',
    tabelBuku(['No.', 'Keterangan', 'Bukti (Upload)'],
      b.desain.map((d, i) => [String(i + 1), esc(d.keterangan),
        d.bukti ? `<img class="lampiran-mini" src="${d.bukti}" alt="">` : '—']))));
  box.appendChild(seksiBuku('04', '', tiga, true));

  /* --- 05 Produksi & Distribusi + kasaran modal --- */
  const lima = el('<div class="bk-produksi"></div>');
  lima.appendChild(subKartu(I.kotakProduksi, 'Kegiatan Produksi', '',
    tabelBuku(['No.', 'Kegiatan', '~Status'],
      b.produksi.map((p, i) => [String(i + 1), esc(p.kegiatan), cekBaca(p.selesai)]))));
  lima.appendChild(subKartu(I.simpul, 'Distribusi', '',
    tabelBuku(['No.', 'Wilayah', 'Penanggung Jawab'],
      b.distribusi.map((d, i) => [String(i + 1), esc(d.wilayah), esc(Store.namaUser(d.pjId))]))));

  const totRp = b.modal.reduce((s, m) => s + Number(m.rp || 0), 0);
  const totEgp = b.modal.reduce((s, m) => s + Number(m.egp || 0), 0);
  lima.appendChild(el(`<div class="bk-modal">
    <div class="bk-modal-kepala">Kasaran Modal</div>
    <div class="tabel-bungkus"><table class="t-org t-rapat">
      <thead><tr><th class="kol-no">No.</th><th>Uraian</th><th>Rp</th><th>EGP</th></tr></thead>
      <tbody>${b.modal.map((m, i) => `<tr><td class="kol-no">${i + 1}</td><td>${esc(m.uraian)}</td>
        <td class="utuh">${rupiah(m.rp)}</td><td class="utuh">${pound(m.egp)}</td></tr>`).join('')}
        <tr class="bk-total"><td></td><td>TOTAL</td>
          <td class="utuh">${rupiah(totRp)}</td><td class="utuh">${pound(totEgp)}</td></tr></tbody>
    </table></div></div>`));
  box.appendChild(seksiBuku('05', 'Tahap Produksi & Distribusi', lima));

  box.appendChild(el(`<div class="notis notis-info" style="margin:20px 0 0">${I.info}<div>
    Pastikan setiap tahap diselesaikan sesuai timeline untuk kelancaran proses penerbitan buku.
  </div></div>`));
  return box;
}

/* ------------------------------------------------------------
   Modul tahap: seluruhnya larik di dalam proyek aktif, jadi
   simpan/hapusnya dialihkan ke Store.simpanBagianBuku.
   ------------------------------------------------------------ */
const modulBuku = (bagian, spec) => ({
  ruang: 'buku', izin: spec.izin || 'buku.manage',
  sumber: () => bk()?.[bagian] || [],
  simpan: (d) => Store.simpanBagianBuku(U, bagian, d),
  hapus: (x) => Store.hapusBagianBuku(U, bagian, x.id),
  pratinjau: { awal: 3, akhir: 1 },
  ...spec,
});

const pilihAnggota = () => Store.db.users.filter((u) => u.status === 'aktif')
  .map((u) => ({ v: u.id, l: u.nama }));

Object.assign(MODUL, {
  'buku-penulisan': modulBuku('naskah', {
    judul: 'Tahap Penulisan', satuan: 'Naskah',
    sub: 'Penulis, sub judul, dan progress penulisannya.',
    cari: (x) => `${Store.namaUser(x.userId)} ${x.subJudul}`,
    tajuk: (x) => x.subJudul,
    kolom: [
      { l: 'Nama', isi: (x) => selAnggota(Store.getUser(x.userId)) },
      { l: 'Sub Judul', isi: (x) => esc(x.subJudul) },
      { l: 'Progress', isi: (x) => lencanaProg(x.progressTulis) },
      { l: 'Deadline', kelas: 'utuh', isi: (x) => tgl(x.deadline) },
    ],
    form: [
      { k: 'userId', l: 'Penulis', jenis: 'pilih', pilihan: pilihAnggota },
      { k: 'subJudul', l: 'Sub Judul', wajib: true, ph: 'Tafsir Al-Manar' },
      { k: 'progressTulis', l: 'Progress Penulisan', jenis: 'pilih', bawaan: 'belum',
        pilihan: [{ v: 'belum', l: 'Belum' }, { v: 'proses', l: 'On Proses' }, { v: 'siap', l: 'Siap' }] },
      { k: 'deadline', l: 'Tenggat', jenis: 'tanggal', wajib: true },
    ],
    bawaanBaru: () => ({ progressEdit: 'belum', buktiLayout: '' }),
  }),

  'buku-editing': modulBuku('naskah', {
    judul: 'Tahap Editing', satuan: 'Naskah',
    sub: 'Progress penyuntingan tiap sub judul oleh tim editor.',
    cari: (x) => `${Store.namaUser(x.userId)} ${x.subJudul}`,
    tajuk: (x) => x.subJudul,
    kolom: [
      { l: 'Nama', isi: (x) => selAnggota(Store.getUser(x.userId)) },
      { l: 'Sub Judul', isi: (x) => esc(x.subJudul) },
      { l: 'Progress Tulis', isi: (x) => lencanaProg(x.progressTulis) },
      { l: 'Progress Edit', isi: (x) => lencanaProg(x.progressEdit) },
    ],
    form: [
      { k: 'subJudul', l: 'Sub Judul', wajib: true },
      { k: 'progressEdit', l: 'Progress Editing', jenis: 'pilih', bawaan: 'belum',
        pilihan: [{ v: 'belum', l: 'Belum' }, { v: 'proses', l: 'On Proses' }, { v: 'siap', l: 'Siap' }],
        bantu: 'Naskah baru bisa dilayout setelah editingnya siap.' },
    ],
  }),

  'buku-keuangan': modulBuku('modal', {
    izin: 'buku.anggaran',
    judul: 'Kasaran Modal', satuan: 'Pos Modal',
    sub: 'Rencana biaya penerbitan — terpisah dari Buku Kas Bendahara.',
    cari: (x) => x.uraian, tajuk: (x) => x.uraian,
    kolom: [
      { l: 'Uraian', isi: (x) => `<b>${esc(x.uraian)}</b>` },
      { l: 'Rp', kelas: 'utuh', isi: (x) => rupiah(x.rp) },
      { l: 'EGP', kelas: 'utuh', isi: (x) => pound(x.egp) },
    ],
    form: [
      { k: 'uraian', l: 'Uraian Biaya', wajib: true, ph: 'Cetak (100 eksemplar)' },
      { k: 'rp', l: 'Nominal (Rp)', jenis: 'angka', ph: '0' },
      { k: 'egp', l: 'Nominal (EGP)', jenis: 'angka', ph: '0' },
    ],
  }),

  'buku-arsip': modulBuku('dokumen', {
    izin: 'buku.arsip',
    judul: 'Dokumen & Arsip', satuan: 'Dokumen',
    sub: 'Proposal, surat, penawaran, dan notulensi proyek buku.',
    cari: (x) => `${x.nama} ${x.jenis}`, tajuk: (x) => x.nama,
    kolom: [
      { l: 'Nama Dokumen', isi: (x) => `<b>${esc(x.nama)}</b>` },
      { l: 'Jenis', isi: (x) => `<span class="lencana l-abu">${esc(x.jenis)}</span>` },
      { l: 'Tanggal', kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
      { l: 'Berkas', isi: () => '', pasang: selGambar('berkas', 'nama') },
    ],
    form: [
      { k: 'nama', l: 'Nama Dokumen', wajib: true, ph: 'Proposal Penerbitan Buku' },
      { k: 'jenis', l: 'Jenis', jenis: 'pilih', bawaan: 'Proposal',
        pilihan: ['Proposal', 'Surat', 'Penawaran', 'Notulensi', 'Laporan', 'Lainnya'].map((v) => ({ v, l: v })) },
      { k: 'tanggal', l: 'Tanggal', jenis: 'tanggal', wajib: true },
      { k: 'berkas', l: 'Pindaian Dokumen', jenis: 'gambar',
        bantu: 'Unggah pindaian atau tangkapan layar dokumennya.' },
    ],
  }),
});

/* --- Perencanaan: daftar proyek + rencana + timeline --- */
HAL['buku-perencanaan'] = () => {
  const box = el('<div></div>');
  const aktif = bk();

  const daftar = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Proyek Buku</h3><span class="hitung">(${Store.db.buku.length} Proyek)</span>
    <div class="kanan"><button class="btn btn-kecil" data-baru>${I.tambah} Proyek Baru</button></div>
  </div></div>`);
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Judul Buku</th><th>Tahap</th><th>Target Terbit</th>
      <th>Sub Judul</th><th>Status</th><th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  Store.db.buku.forEach((b, i) => {
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td><b>${esc(b.judul)}</b><br><span style="color:var(--e-abu);font-size:11.8px">${esc(b.ringkas || '')}</span></td>
      <td class="utuh">${esc(TAHAP_BUKU[b.tahap] || b.tahap)}</td>
      <td class="utuh">${tgl(b.targetTerbit)}</td>
      <td class="utuh">${(b.naskah || []).length}</td>
      <td><span class="lencana ${b.status === 'aktif' ? 'l-hijau' : 'l-abu'}">${esc(b.status)}</span></td>
      <td class="kol-aksi"><div class="sel-aksi">
        ${b.status === 'aktif' ? '' : `<button class="ikon-aksi" data-aktif title="Jadikan proyek aktif">${I.cek}</button>`}
        <button class="ikon-aksi sunting" title="Sunting">${I.sunting}</button>
        <button class="ikon-aksi hapus" title="Hapus">${I.hapus}</button>
      </div></td></tr>`);
    tr.querySelector('[data-aktif]')?.addEventListener('click', () => aman(() => {
      Store.aktifkanBuku(U, b.id); toast(`"${b.judul}" kini proyek aktif.`); gambar();
    }));
    tr.querySelector('.sunting').onclick = () => formBuku(b);
    tr.querySelector('.hapus').onclick = () => konfirmasi('Hapus proyek buku',
      `"${b.judul}" beserta seluruh tahapnya akan dihapus.`,
      () => aman(() => { Store.hapusBuku(U, b.id); toast('Proyek dihapus.'); gambar(); }));
    tb.appendChild(tr);
  });
  daftar.appendChild(t);
  daftar.querySelector('[data-baru]').onclick = () => formBuku(null);
  box.appendChild(daftar);

  if (!aktif) return box;

  const dua = el('<div class="bk-kolom-2"></div>');
  dua.appendChild(subKartu(I.buku, 'A. Perencanaan Buku', esc(aktif.judul),
    tabelBuku(['No.', 'Komponen', 'Keterangan'], [
      ['1', 'Kumpul Perdana', tgl(aktif.kumpulPerdana)],
      ['2', 'Judul Besar', `<b>${esc(aktif.judul)}</b>`],
      ['3', 'Jumlah Sub Judul', `${aktif.naskah.length} sub judul
        <ol class="bk-sublist">${aktif.naskah.map((n) => `<li>${esc(n.subJudul)}</li>`).join('')}</ol>`],
    ])));

  const kartuTl = el(`<div class="bk-sub"><div class="bk-sub-kepala">${I.dok}
    <h4>B. Timeline Proyek</h4>
    <button class="btn btn-kecil" data-tl style="margin-left:auto">${I.tambah} Tahapan</button></div>
    <div class="bk-sub-isi" data-isi></div></div>`);
  const tlBody = el(`<div class="tabel-bungkus"><table class="t-org t-rapat">
    <thead><tr><th class="kol-no">No.</th><th>Tahapan</th><th>Tanggal</th><th class="kol-aksi">Aksi</th></tr></thead>
    <tbody></tbody></table></div>`);
  const tlTb = tlBody.querySelector('tbody');
  aktif.timeline.forEach((x, i) => {
    const tr = el(`<tr><td class="kol-no">${i + 1}</td><td>${esc(x.tahapan)}</td>
      <td class="utuh">${tgl(x.tanggal)}</td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting">${I.sunting}</button>
        <button class="ikon-aksi hapus">${I.hapus}</button></div></td></tr>`);
    tr.querySelector('.sunting').onclick = () => formTimeline(x);
    tr.querySelector('.hapus').onclick = () => konfirmasi('Hapus tahapan',
      `"${x.tahapan}" akan dihapus dari timeline.`,
      () => aman(() => { Store.hapusBagianBuku(U, 'timeline', x.id); toast('Tahapan dihapus.'); gambar(); }));
    tlTb.appendChild(tr);
  });
  kartuTl.querySelector('[data-isi]').appendChild(tlBody);
  kartuTl.querySelector('[data-tl]').onclick = () => formTimeline(null);
  dua.appendChild(kartuTl);
  box.appendChild(dua);
  return box;
};
HAL['buku-perencanaan'].judul = () => ['Perencanaan', 'Proyek buku, rencana pokok, dan timeline penerbitan.'];

function formBuku(b) {
  const isi = el(`<div>
    <div class="grup"><label>Judul Besar Buku <span style="color:var(--e-merah)">*</span></label>
      <input id="bj" value="${esc(b?.judul || '')}" placeholder="Peta Intelektual Mufassir"></div>
    <div class="grup"><label>Ringkasan</label>
      <textarea id="br" style="min-height:70px" placeholder="Dua kalimat tentang isi dan cakupan buku.">${esc(b?.ringkas || '')}</textarea></div>
    <div class="grid-form-3">
      <div class="grup"><label>Kumpul Perdana</label><input type="date" id="bk" value="${b?.kumpulPerdana || nowTanggal()}"></div>
      <div class="grup"><label>Target Terbit</label><input type="date" id="bt" value="${b?.targetTerbit || nowTanggal()}"></div>
      <div class="grup"><label>Tahap Berjalan</label><select id="bh">
        ${Object.entries(TAHAP_BUKU).map(([v, l]) => `<option value="${v}" ${b?.tahap === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
    </div>
    <div class="grid-form">
      <div class="grup"><label>PJ Utama</label><select id="bp">
        ${pilihAnggota().map((o) => `<option value="${o.v}" ${b?.pjUtamaId === o.v ? 'selected' : ''}>${esc(o.l)}</option>`).join('')}</select></div>
      <div class="grup"><label>PJ Produksi & Distribusi</label><select id="bd">
        ${pilihAnggota().map((o) => `<option value="${o.v}" ${b?.pjProduksiId === o.v ? 'selected' : ''}>${esc(o.l)}</option>`).join('')}</select></div>
    </div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: b ? 'Sunting Proyek Buku' : 'Proyek Buku Baru', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const g = (id) => isi.querySelector('#' + id).value;
    if (!g('bj').trim()) return toast('Judul buku wajib diisi.', true);
    aman(() => {
      Store.simpanBuku(U, { id: b?.id, judul: g('bj').trim(), ringkas: g('br').trim(),
        kumpulPerdana: g('bk'), targetTerbit: g('bt'), tahap: g('bh'),
        pjUtamaId: g('bp'), pjProduksiId: g('bd') });
      tutupModal(); toast('Proyek buku tersimpan.'); gambar();
    });
  };
}

function formTimeline(x) {
  const isi = el(`<div>
    <div class="grup"><label>Nama Tahapan <span style="color:var(--e-merah)">*</span></label>
      <input id="tn" value="${esc(x?.tahapan || '')}" placeholder="Pengumpulan Tulisan"></div>
    <div class="grup"><label>Tanggal</label><input type="date" id="tt" value="${x?.tanggal || nowTanggal()}"></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: x ? 'Sunting Tahapan' : 'Tambah Tahapan', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const nama = isi.querySelector('#tn').value.trim();
    if (!nama) return toast('Nama tahapan wajib diisi.', true);
    aman(() => {
      Store.simpanBagianBuku(U, 'timeline', { id: x?.id, tahapan: nama, tanggal: isi.querySelector('#tt').value });
      tutupModal(); toast('Tahapan tersimpan.'); gambar();
    });
  };
}

/* --- Pembagian Tugas --- */
HAL['buku-tugas'] = () => {
  const b = bk();
  if (!b) return el(`<div class="kartu"><div class="kosong-erp">${I.kotak}<p>Belum ada proyek buku</p></div></div>`);

  const box = el('<div></div>');
  const peran = [
    { k: 'editorIds',    l: 'Editor'   },
    { k: 'layouterIds',  l: 'Layouter' },
    { k: 'desainerIds',  l: 'Desainer' },
  ];

  const kartu = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Penanggung Jawab</h3><span class="hitung">${esc(b.judul)}</span></div>
    <div class="panel-isi" data-isi></div></div>`);
  const isiEl = kartu.querySelector('[data-isi]');
  isiEl.appendChild(el(`<div class="grid-form" style="margin-bottom:16px">
    <div><div class="bk-label">PJ Utama</div><div class="bk-nilai">${esc(Store.namaUser(b.pjUtamaId))}</div></div>
    <div><div class="bk-label">PJ Produksi &amp; Distribusi</div><div class="bk-nilai">${esc(Store.namaUser(b.pjProduksiId))}</div></div>
  </div>`));

  peran.forEach((p) => {
    const baris = el(`<div class="bk-peran">
      <div><div class="bk-label">${esc(p.l)} <span style="color:var(--e-abu)">(${b[p.k].length} orang)</span></div>
        <div class="bk-nilai">${esc(namaBanyak(b[p.k]))}</div></div>
      <button class="btn btn-garis btn-kecil">${I.sunting} Atur</button></div>`);
    baris.querySelector('button').onclick = () => dialogPeranBuku(b, p.k, p.l);
    isiEl.appendChild(baris);
  });
  isiEl.appendChild(el(`<p style="margin:14px 0 0;font-size:12.4px;color:var(--e-abu)">
    PJ Utama dan PJ Produksi diubah dari halaman <b>Perencanaan</b>, bersama data pokok proyek lainnya.</p>`));
  box.appendChild(kartu);

  box.appendChild(halamanOrg('buku-penulisan'));
  return box;
};
HAL['buku-tugas'].judul = () => ['Pembagian Tugas', 'Penanggung jawab tiap peran dan pembagian sub judul.'];

function dialogPeranBuku(b, kunci, label) {
  const aktif = Store.db.users.filter((u) => u.status === 'aktif');
  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.2px;color:var(--e-abu)">Centang anggota yang bertugas sebagai <b>${esc(label)}</b>.</p>
    <div class="grid-absen">${aktif.map((u) => `<label class="absen-item ${b[kunci].includes(u.id) ? 'hadir' : ''}">
      <input type="checkbox" value="${u.id}" ${b[kunci].includes(u.id) ? 'checked' : ''}>
      <img src="${u.foto}"><span>${esc(u.nama)}</span></label>`).join('')}</div>
  </div>`);
  isi.querySelectorAll('.absen-item input').forEach((c) => c.onchange = () =>
    c.closest('.absen-item').classList.toggle('hadir', c.checked));
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: `Atur ${label}`, isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => aman(() => {
    Store.simpanBuku(U, { id: b.id, [kunci]: [...isi.querySelectorAll('input:checked')].map((c) => c.value) });
    tutupModal(); toast(`${label} diperbarui.`); gambar();
  });
}

/* --- Layouting & Desain --- */
HAL['buku-layout'] = () => {
  const b = bk();
  if (!b) return el(`<div class="kartu"><div class="kosong-erp">${I.kotak}<p>Belum ada proyek buku</p></div></div>`);
  const box = el('<div></div>');

  const kartu = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Bukti Layouting</h3><span class="hitung">(${b.naskah.filter((n) => n.buktiLayout).length} dari ${b.naskah.length} sub judul)</span></div></div>`);
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Sub Judul</th><th>Editing</th><th>Bukti (Upload)</th>
      <th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  b.naskah.forEach((n, i) => {
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td>${esc(n.subJudul)}</td>
      <td>${lencanaProg(n.progressEdit)}</td>
      <td data-bukti></td>
      <td class="kol-aksi"><div class="sel-aksi">
        <label class="ikon-aksi sunting" title="Unggah bukti layout" style="cursor:pointer">
          ${I.gambar}<input type="file" accept="image/*" hidden></label>
        ${n.buktiLayout ? `<button class="ikon-aksi hapus" title="Hapus bukti">${I.hapus}</button>` : ''}
      </div></td></tr>`);
    selGambar('buktiLayout', 'subJudul', (x) => `Bukti layout · ${x.subJudul}`)(tr.querySelector('[data-bukti]'), n);
    const inp = tr.querySelector('input[type=file]');
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      try {
        const gbr = await Store.unggahGambar(f, 1000);
        Store.simpanBagianBuku(U, 'naskah', { id: n.id, buktiLayout: gbr });
        toast('Bukti layout tersimpan.'); gambar();
      } catch (e) { toast(e.message, true); }
    };
    tr.querySelector('.hapus')?.addEventListener('click', () => konfirmasi('Hapus bukti layout',
      `Bukti layout "${n.subJudul}" akan dihapus.`,
      () => aman(() => { Store.simpanBagianBuku(U, 'naskah', { id: n.id, buktiLayout: '' }); toast('Bukti dihapus.'); gambar(); })));
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  box.appendChild(kartu);

  /* Desain sampul & isi contoh */
  const kd = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Desain</h3><span class="hitung">(${b.desain.length} Berkas)</span>
    <div class="kanan"><button class="btn btn-kecil" data-tambah>${I.tambah} Tambah Desain</button></div>
  </div></div>`);
  const td = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Keterangan</th><th>Bukti (Upload)</th>
      <th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tdb = td.querySelector('tbody');
  b.desain.forEach((d, i) => {
    const tr = el(`<tr><td class="kol-no">${i + 1}</td><td><b>${esc(d.keterangan)}</b></td>
      <td data-bukti></td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting">${I.sunting}</button>
        <button class="ikon-aksi hapus">${I.hapus}</button></div></td></tr>`);
    selGambar('bukti', 'keterangan', () => 'Berkas desain')(tr.querySelector('[data-bukti]'), d);
    tr.querySelector('.sunting').onclick = () => formDesain(d);
    tr.querySelector('.hapus').onclick = () => konfirmasi('Hapus desain',
      `"${d.keterangan}" akan dihapus.`,
      () => aman(() => { Store.hapusBagianBuku(U, 'desain', d.id); toast('Desain dihapus.'); gambar(); }));
    tdb.appendChild(tr);
  });
  kd.appendChild(td);
  kd.querySelector('[data-tambah]').onclick = () => formDesain(null);
  box.appendChild(kd);
  return box;
};
HAL['buku-layout'].judul = () => ['Layouting & Desain', 'Bukti layout tiap sub judul dan berkas desain sampul.'];

function formDesain(d) {
  let bukti = d?.bukti || '';
  const isi = el(`<div>
    <div class="grup"><label>Keterangan <span style="color:var(--e-merah)">*</span></label>
      <input id="dk" value="${esc(d?.keterangan || '')}" placeholder="Cover Depan"></div>
    <div class="grup"><label>Berkas Desain</label>
      <div class="pratinjau-gambar">
        <img data-pv src="${bukti || window.__ph('DESAIN', '#1B5E20', '#0E2E1C', 'تصميم')}">
        <div style="flex:1"><p style="margin:0 0 10px;font-size:12.4px;color:var(--e-abu)">
          Unggah hasil desain agar tim produksi bisa memeriksanya sebelum cetak.</p>
        <label class="btn btn-garis btn-kecil" style="display:inline-flex;cursor:pointer;margin:0">
          ${I.gambar} Pilih Gambar<input type="file" accept="image/*" hidden></label></div>
      </div></div>
  </div>`);
  const inp = isi.querySelector('input[type=file]');
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    try { bukti = await Store.unggahGambar(f, 1200); isi.querySelector('[data-pv]').src = bukti; }
    catch (e) { toast(e.message, true); }
  };
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: d ? 'Sunting Desain' : 'Tambah Desain', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const ket = isi.querySelector('#dk').value.trim();
    if (!ket) return toast('Keterangan wajib diisi.', true);
    aman(() => {
      Store.simpanBagianBuku(U, 'desain', { id: d?.id, keterangan: ket, bukti });
      tutupModal(); toast('Desain tersimpan.'); gambar();
    });
  };
}

/* --- Produksi & Distribusi --- */
HAL['buku-produksi'] = () => {
  const b = bk();
  if (!b) return el(`<div class="kartu"><div class="kosong-erp">${I.kotak}<p>Belum ada proyek buku</p></div></div>`);
  const box = el('<div></div>');
  const rampung = b.produksi.filter((p) => p.selesai).length;

  const kp = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Kegiatan Produksi</h3><span class="hitung">(${rampung} dari ${b.produksi.length} selesai)</span>
    <div class="kanan"><button class="btn btn-kecil" data-tambah>${I.tambah} Tambah Kegiatan</button></div>
  </div></div>`);
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Kegiatan</th><th class="kol-tengah">Status</th>
      <th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  b.produksi.forEach((p, i) => {
    const tr = el(`<tr><td class="kol-no">${i + 1}</td><td>${esc(p.kegiatan)}</td>
      <td class="kol-tengah"><button class="cek-kotak ${p.selesai ? 'on' : ''}"
        title="${p.selesai ? 'Batalkan tanda selesai' : 'Tandai selesai'}">${I.cek}</button></td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting">${I.sunting}</button>
        <button class="ikon-aksi hapus">${I.hapus}</button></div></td></tr>`);
    tr.querySelector('.cek-kotak').onclick = () => aman(() => {
      Store.centangProduksi(U, p.id, !p.selesai); gambar();
    });
    tr.querySelector('.sunting').onclick = () => formProduksi(p);
    tr.querySelector('.hapus').onclick = () => konfirmasi('Hapus kegiatan',
      `"${p.kegiatan}" akan dihapus.`,
      () => aman(() => { Store.hapusBagianBuku(U, 'produksi', p.id); toast('Kegiatan dihapus.'); gambar(); }));
    tb.appendChild(tr);
  });
  kp.appendChild(t);
  kp.querySelector('[data-tambah]').onclick = () => formProduksi(null);
  box.appendChild(kp);

  const kd = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Distribusi</h3><span class="hitung">(${b.distribusi.length} Wilayah)</span>
    <div class="kanan"><button class="btn btn-kecil" data-tambah>${I.tambah} Tambah Wilayah</button></div>
  </div></div>`);
  const td = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Wilayah</th><th>Penanggung Jawab</th>
      <th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tdb = td.querySelector('tbody');
  b.distribusi.forEach((d, i) => {
    const tr = el(`<tr><td class="kol-no">${i + 1}</td><td><b>${esc(d.wilayah)}</b></td>
      <td>${selAnggota(Store.getUser(d.pjId))}</td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting">${I.sunting}</button>
        <button class="ikon-aksi hapus">${I.hapus}</button></div></td></tr>`);
    tr.querySelector('.sunting').onclick = () => formDistribusi(d);
    tr.querySelector('.hapus').onclick = () => konfirmasi('Hapus wilayah distribusi',
      `"${d.wilayah}" akan dihapus.`,
      () => aman(() => { Store.hapusBagianBuku(U, 'distribusi', d.id); toast('Wilayah dihapus.'); gambar(); }));
    tdb.appendChild(tr);
  });
  kd.appendChild(td);
  kd.querySelector('[data-tambah]').onclick = () => formDistribusi(null);
  box.appendChild(kd);
  return box;
};
HAL['buku-produksi'].judul = () => ['Produksi & Distribusi', 'Kegiatan cetak dan pembagian wilayah distribusi.'];

function formProduksi(p) {
  const isi = el(`<div class="grup"><label>Nama Kegiatan <span style="color:var(--e-merah)">*</span></label>
    <input id="pk" value="${esc(p?.kegiatan || '')}" placeholder="Cetak Sampel"></div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: p ? 'Sunting Kegiatan' : 'Tambah Kegiatan Produksi', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const nama = isi.querySelector('#pk').value.trim();
    if (!nama) return toast('Nama kegiatan wajib diisi.', true);
    aman(() => {
      Store.simpanBagianBuku(U, 'produksi', { id: p?.id, kegiatan: nama, selesai: p?.selesai || false });
      tutupModal(); toast('Kegiatan tersimpan.'); gambar();
    });
  };
}

function formDistribusi(d) {
  const isi = el(`<div>
    <div class="grup"><label>Wilayah <span style="color:var(--e-merah)">*</span></label>
      <input id="dw" value="${esc(d?.wilayah || '')}" placeholder="Darrosah"></div>
    <div class="grup"><label>Penanggung Jawab</label><select id="dp">
      ${pilihAnggota().map((o) => `<option value="${o.v}" ${d?.pjId === o.v ? 'selected' : ''}>${esc(o.l)}</option>`).join('')}</select></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: d ? 'Sunting Wilayah' : 'Tambah Wilayah Distribusi', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const w = isi.querySelector('#dw').value.trim();
    if (!w) return toast('Wilayah wajib diisi.', true);
    aman(() => {
      Store.simpanBagianBuku(U, 'distribusi', { id: d?.id, wilayah: w, pjId: isi.querySelector('#dp').value });
      tutupModal(); toast('Wilayah tersimpan.'); gambar();
    });
  };
}

/* --- Keuangan Buku: kasaran modal + totalnya --- */
HAL['buku-keuangan'] = () => {
  const b = bk();
  if (!b) return el(`<div class="kartu"><div class="kosong-erp">${I.kotak}<p>Belum ada proyek buku</p></div></div>`);
  const totRp = b.modal.reduce((s, m) => s + Number(m.rp || 0), 0);
  const totEgp = b.modal.reduce((s, m) => s + Number(m.egp || 0), 0);

  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Ini rencana biaya, bukan pembukuan kas</b>
    Kasaran modal memperkirakan kebutuhan dana penerbitan. Uang yang benar-benar keluar
    tetap dicatat Bendahara pada Buku Kas, sehingga rencana yang belum tentu terpakai
    tidak mengotori pembukuan.
  </div></div></div>`);

  box.appendChild(el(`<div class="saldo-kartu" style="margin-bottom:20px">
    <div class="saldo-label">Kasaran Modal — ${esc(b.judul)}</div>
    <div class="saldo-nilai">${rupiah(totRp)}</div>
    <div class="saldo-rinci">
      <div><span>Setara</span><b>${pound(totEgp)}</b></div>
      <div><span>Jumlah Pos</span><b>${b.modal.length}</b></div>
      <div><span>Target Terbit</span><b>${tgl(b.targetTerbit)}</b></div>
    </div></div>`));

  box.appendChild(halamanOrg('buku-keuangan'));
  return box;
};
HAL['buku-keuangan'].judul = () => ['Keuangan Buku', 'Kasaran modal penerbitan — terpisah dari Buku Kas Bendahara.'];

['buku-penulisan', 'buku-editing', 'buku-arsip'].forEach((nama) => {
  HAL[nama] = () => (bk() ? halamanOrg(nama)
    : el(`<div class="kartu"><div class="kosong-erp">${I.kotak}<p>Belum ada proyek buku</p>
        <small>Mulai dari halaman Perencanaan.</small></div></div>`));
  HAL[nama].judul = () => [MODUL[nama].judul, MODUL[nama].sub];
});

/* ============================================================
   RUANG KERJA PJ MEDIA & WEBSITE
   ------------------------------------------------------------
   Kalender Konten tidak punya koleksinya sendiri: ia gabungan
   berurut-tanggal dari artikel, agenda, media sosial, dan video.
   Statistiknya pun bukan angka karangan — halaman publik mencatat
   tiap kunjungan ke `db.kunjungan`, dan panel di sini hanya
   membacanya. Lingkupnya sebatas peramban ini, sebab prototipe
   tidak punya server, dan angka-angkanya tidak berpura-pura lain.
   ============================================================ */
const STATUS_MW = {
  draft      : { l: 'Draft',       c: 'l-abu'    },
  editing    : { l: 'Editing',     c: 'l-ungu'   },
  dijadwalkan: { l: 'Dijadwalkan', c: 'l-kuning' },
  siap       : { l: 'Siap Publish',c: 'l-biru'   },
  terbit     : { l: 'Terbit',      c: 'l-hijau'  },
  proses     : { l: 'Proses',      c: 'l-kuning' },
  selesai    : { l: 'Selesai',     c: 'l-hijau'  },
};
const lencanaMW = (v) => `<span class="lencana ${STATUS_MW[v]?.c || 'l-abu'}">${esc(STATUS_MW[v]?.l || v)}</span>`;
const pilihanStatusMW = (daftar) => daftar.map((v) => ({ v, l: STATUS_MW[v].l }));

const PRIORITAS = {
  tinggi: { l: 'Tinggi', c: 'l-merah'  },
  sedang: { l: 'Sedang', c: 'l-kuning' },
  rendah: { l: 'Rendah', c: 'l-hijau'  },
};

/* ---------------- statistik kunjungan ----------------
   Jendela waktu berjangkar pada tanggal terakhir yang benar-benar
   tercatat, bukan selalu hari ini. Kalau prototipe dibuka setelah lama
   menganggur, panel ini tetap memperlihatkan periode yang berisi alih-alih
   deretan nol — dan saat website dibuka lagi, jangkarnya kembali ke hari
   ini dengan sendirinya. */
function jangkarKunjungan() {
  const kini = nowTanggal();
  let akhir = '';
  Store.db.kunjungan.forEach((k) => { if (k.tgl > akhir && k.tgl <= kini) akhir = k.tgl; });
  return akhir || kini;
}
const hariLalu = (n) => {
  const dasar = new Date(jangkarKunjungan() + 'T12:00:00');
  return new Date(dasar.getTime() - n * 86400000).toISOString().slice(0, 10);
};

/** Rekap kunjungan pada rentang hari tertentu. `halaman` khusus '(sesi)'
    dan '(baru)' dipisahkan: ketiganya mengukur hal yang berbeda. */
function rekapKunjungan(dariHari, sampaiHari = 0) {
  const dari = hariLalu(dariHari), sampai = hariLalu(sampaiHari);
  let tayang = 0, sesi = 0, baru = 0;
  Store.db.kunjungan.forEach((k) => {
    if (k.tgl < dari || k.tgl > sampai) return;
    if (k.halaman === Store.KUNJUNG_SESI) sesi += k.n;
    else if (k.halaman === Store.KUNJUNG_BARU) baru += k.n;
    else tayang += k.n;
  });
  return { tayang, sesi, baru, perKunjungan: sesi ? tayang / sesi : 0,
    persenBaru: sesi ? Math.round((baru / sesi) * 100) : 0 };
}

/** Deret harian untuk grafik: satu titik per hari, tayangan halaman. */
function deretKunjungan(hari = 30) {
  const peta = {};
  Store.db.kunjungan.forEach((k) => {
    if (k.halaman === Store.KUNJUNG_SESI || k.halaman === Store.KUNJUNG_BARU) return;
    peta[k.tgl] = (peta[k.tgl] || 0) + k.n;
  });
  const titik = [];
  for (let d = hari - 1; d >= 0; d--) {
    const t = hariLalu(d);
    titik.push({ tgl: t, n: peta[t] || 0 });
  }
  return titik;
}

/* Tanpa periode pembanding, selisih persen tidak punya arti — mengarang
   "naik 100%" dari nol justru membohongi pembacanya. Kembalikan null, dan
   biarkan tampilannya berkata apa adanya. */
const selisihPersen = (kini, lalu) => (lalu ? Math.round(((kini - lalu) / lalu) * 100) : null);
const arahTren = (p, pendek = false) => (p === null
  ? `<span class="tren netral">— ${pendek ? 'tanpa pembanding' : 'belum ada pembanding'}</span>`
  : `<span class="tren ${p < 0 ? 'turun' : ''}">${p < 0 ? I.turun : I.naik} ${Math.abs(p)}%${pendek ? '' : ' dari bulan lalu'}</span>`);

/** Grafik garis sederhana. Digambar sebagai SVG sebaris — tanpa pustaka,
    tetap tajam di segala ukuran, dan ikut berubah warna mengikuti tema. */
function grafikGaris(titik, tinggi = 150) {
  if (titik.length < 2) return el(`<div class="kosong-erp" style="padding:30px">${I.kotak}<p>Belum cukup data</p></div>`);
  const L = 44, K = 8, A = 10, B = 22;      // sisi kiri, kanan, atas, bawah
  const W = 640, H = tinggi;
  const maks = Math.max(...titik.map((t) => t.n), 1);
  const skalaY = Math.ceil(maks / 500) * 500 || 500;
  const x = (i) => L + (i * (W - L - K)) / (titik.length - 1);
  const y = (n) => A + (1 - n / skalaY) * (H - A - B);
  const garis = titik.map((t, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(t.n).toFixed(1)}`).join(' ');
  const area = `${garis} L${x(titik.length - 1).toFixed(1)} ${H - B} L${L} ${H - B} Z`;
  const tanda = [0, Math.floor(titik.length / 4), Math.floor(titik.length / 2),
    Math.floor((titik.length * 3) / 4), titik.length - 1];

  return el(`<div class="grafik"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img"
      aria-label="Tayangan halaman ${titik.length} hari terakhir">
    <defs><linearGradient id="isiGrafik" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4A7A1E" stop-opacity=".22"/>
      <stop offset="1" stop-color="#4A7A1E" stop-opacity="0"/></linearGradient></defs>
    ${[0, 0.5, 1].map((f) => `<line x1="${L}" x2="${W - K}" y1="${y(skalaY * f)}" y2="${y(skalaY * f)}"
        stroke="#E3E8E4" stroke-width="1"/>
      <text x="${L - 8}" y="${y(skalaY * f) + 4}" text-anchor="end" font-size="11" fill="#6B7A70">${
        skalaY * f >= 1000 ? (skalaY * f) / 1000 + 'K' : skalaY * f}</text>`).join('')}
    <path d="${area}" fill="url(#isiGrafik)"/>
    <path d="${garis}" fill="none" stroke="#4A7A1E" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${tanda.map((i) => `<text x="${x(i)}" y="${H - 5}" text-anchor="${i === 0 ? 'start' : i === titik.length - 1 ? 'end' : 'middle'}"
        font-size="11" fill="#6B7A70">${esc(tglPendek(titik[i].tgl))}</text>`).join('')}
  </svg></div>`);
}

const tglPendek = (s) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

/* ---------------- kalender konten ---------------- */
/** Gabungan berurut-tanggal dari empat sumber. Tidak ada koleksi
    "kalender" tersendiri — satu hal dicatat di satu tempat saja. */
function kalenderKonten() {
  const baris = [];
  Store.db.artikel.forEach((a) => baris.push({
    tgl: a.tanggal, jenis: 'Artikel', judul: a.judul,
    ket: `Kategori: ${a.kategori}`, status: a.status === 'terbit' ? 'terbit' : a.status === 'review' ? 'siap' : 'draft',
    rute: 'artikel-web',
  }));
  Store.db.sosmed.forEach((x) => baris.push({
    tgl: x.tanggal, jenis: 'Posting ' + x.platform.slice(0, 2).toUpperCase(), judul: x.judul,
    ket: `Platform: ${x.platform}`, status: x.status, rute: 'sosmed',
  }));
  Store.db.event.forEach((x) => baris.push({
    tgl: x.tanggal, jenis: 'Event', judul: x.judul,
    ket: `Lokasi: ${x.lokasi}`, status: x.status, rute: 'agenda-event',
  }));
  Store.db.video.forEach((x) => baris.push({
    tgl: x.tanggal, jenis: 'Video', judul: x.judul,
    ket: `Platform: ${x.platform}`, status: x.status, rute: 'video',
  }));
  return baris.sort((a, b) => a.tgl.localeCompare(b.tgl));
}

function barisKalender(k) {
  const d = new Date(k.tgl);
  const n = el(`<button class="kal-baris">
    <span class="kal-tgl"><b>${d.getDate()}</b><span>${d.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()}</span></span>
    <span class="kal-isi"><span class="jd">${esc(k.jenis)}: ${esc(k.judul)}</span>
      <span class="kt">${esc(k.ket)}</span></span>
    ${lencanaMW(k.status)}
  </button>`);
  n.onclick = () => bukaModul(k.rute);
  return n;
}

/* ---------------- dasbor ---------------- */
function dasborMediaWeb() {
  const box = el('<div></div>');
  const d = Store.db;
  const kini = rekapKunjungan(30), lalu = rekapKunjungan(60, 30);
  const bulanIni = nowTanggal().slice(0, 7);
  const bulanLalu = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
  const hitungBulan = (arr, uji) => arr.filter(uji).length;

  const artikelTerbit = d.artikel.filter((a) => a.status === 'terbit');
  const eventTerbit = d.event.filter((e) => e.status === 'terbit');
  const interaksi = d.sosmed.reduce((s, x) => s + Number(x.interaksi || 0), 0);

  box.appendChild(el(`<div class="mw-stat-grid">
    ${[
      { ik: I.dok, w: 'rgba(140,198,63,.16)', wc: '#4A7A1E', l: 'Artikel Terpublikasi', n: artikelTerbit.length,
        p: selisihPersen(hitungBulan(artikelTerbit, (a) => a.tanggal.startsWith(bulanIni)),
                         hitungBulan(artikelTerbit, (a) => a.tanggal.startsWith(bulanLalu))) },
      { ik: I.agenda, w: 'rgba(62,127,184,.14)', wc: '#2C6091', l: 'Event Terpublikasi', n: eventTerbit.length,
        p: selisihPersen(hitungBulan(eventTerbit, (e) => e.tanggal.startsWith(bulanIni)),
                         hitungBulan(eventTerbit, (e) => e.tanggal.startsWith(bulanLalu))) },
      { ik: I.grup, w: 'rgba(124,92,214,.14)', wc: '#5F45AE', l: 'Pengunjung Website', n: kini.sesi.toLocaleString('id-ID'),
        p: selisihPersen(kini.sesi, lalu.sesi) },
      /* Interaksi sosial tidak punya delta yang bisa dihitung: angkanya
         disalin PJ dari statistik platform, bukan diukur sistem ini. */
      { ik: I.obrolan, w: 'rgba(240,149,30,.15)', wc: '#B87310', l: 'Interaksi Sosial',
        n: interaksi.toLocaleString('id-ID'), catatan: 'dicatat dari platform' },
    ].map((s) => `<div class="mw-stat">
      <span class="mw-stat-ik" style="--w:${s.w};--wc:${s.wc}">${s.ik}</span>
      <div><div class="mw-stat-l">${esc(s.l)}</div>
        <div class="mw-stat-n">${esc(String(s.n))}</div>
        ${s.catatan ? `<div class="mw-stat-s">${esc(s.catatan)}</div>` : arahTren(s.p)}</div>
    </div>`).join('')}
  </div>`));

  /* --- baris 1: kalender · statistik · aktivitas --- */
  const baris1 = el('<div class="mw-baris"></div>');

  const kal = panelMW('Kalender Konten', I.kalender, 'Lihat Kalender', () => bukaModul('kalender'));
  const isiKal = kalenderKonten().filter((k) => k.status !== 'terbit' || k.tgl >= hariLalu(14)).slice(0, 5);
  if (!isiKal.length) kal.isi.appendChild(el(`<div class="kosong-erp" style="padding:26px">${I.kotak}<p>Belum ada konten terjadwal</p></div>`));
  isiKal.forEach((k) => kal.isi.appendChild(barisKalender(k)));
  baris1.appendChild(kal.el);

  const stat = panelMW('Statistik Website', I.bagan, '30 Hari Terakhir', null);
  stat.isi.appendChild(grafikGaris(deretKunjungan(30)));
  stat.isi.appendChild(el(`<div class="mw-mini">
    ${[
      { n: kini.sesi.toLocaleString('id-ID'), l: 'Total Pengunjung', p: selisihPersen(kini.sesi, lalu.sesi) },
      { n: kini.tayang.toLocaleString('id-ID'), l: 'Tayangan Halaman', p: selisihPersen(kini.tayang, lalu.tayang) },
      { n: kini.perKunjungan.toFixed(2), l: 'Halaman / Kunjungan', p: selisihPersen(kini.perKunjungan, lalu.perKunjungan) },
      { n: kini.persenBaru + '%', l: 'Pengunjung Baru', p: selisihPersen(kini.persenBaru, lalu.persenBaru) },
    ].map((x) => `<div class="mw-mini-sel"><div class="n">${esc(x.n)}</div>
      <div class="l">${esc(x.l)}</div>${arahTren(x.p, true)}</div>`).join('')}
  </div>`));
  baris1.appendChild(stat.el);

  const akt = panelMW('Aktivitas Terbaru', I.riwayat, null, null);
  const log = d.audit.slice(0, 5);
  if (!log.length) akt.isi.appendChild(el(`<div class="kosong-erp" style="padding:26px">${I.kotak}<p>Belum ada aktivitas</p></div>`));
  log.forEach((l) => akt.isi.appendChild(el(`<div class="mw-akt">
    <span class="ik">${I.log}</span>
    <div><div class="tk">${esc(l.detail)}</div><div class="mt">oleh ${esc(l.userNama)}</div></div>
    <span class="wk">${lampau(l.ts)}</span>
  </div>`)));
  const semua = el(`<button class="mw-tautan">Lihat Semua Aktivitas ${I.panahKanan}</button>`);
  semua.onclick = () => bukaModul('pengunjung');
  akt.isi.appendChild(semua);
  baris1.appendChild(akt.el);
  box.appendChild(baris1);

  /* --- baris 2: tugas · media · pintasan --- */
  const baris2 = el('<div class="mw-baris"></div>');

  const tug = panelMW('Tugas Saya', I.cekBulat, 'Lihat Semua', () => bukaModul('atur-web'));
  const tugasSaya = d.tugas.filter((t) => t.userId === U.id || !t.userId);
  const daftarTugas = (tugasSaya.length ? tugasSaya : d.tugas).slice(0, 5);
  if (!daftarTugas.length) tug.isi.appendChild(el(`<div class="kosong-erp" style="padding:26px">${I.kotak}<p>Tidak ada tugas</p></div>`));
  daftarTugas.forEach((t) => {
    const n = el(`<div class="mw-tugas">
      <button class="cek-bulat ${t.selesai ? 'on' : ''}" title="${t.selesai ? 'Batalkan' : 'Tandai selesai'}">${t.selesai ? I.cek : ''}</button>
      <span class="jd ${t.selesai ? 'rampung' : ''}">${esc(t.judul)}</span>
      <span class="lencana ${PRIORITAS[t.prioritas]?.c || 'l-abu'}">${esc(PRIORITAS[t.prioritas]?.l || t.prioritas)}</span>
      <span class="tg">${tglPendek(t.tenggat)}</span>
    </div>`);
    n.querySelector('.cek-bulat').onclick = () => aman(() => { Store.centangTugas(U, t.id, !t.selesai); gambar(); });
    tug.isi.appendChild(n);
  });
  baris2.appendChild(tug.el);

  const med = panelMW('Media Terbaru', I.galeri, 'Lihat Semua', () => bukaModul('galeri'));
  const kisi = el('<div class="mw-galeri"></div>');
  [...d.media].sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, 6).forEach((m) => {
    const n = el(`<button class="mw-media">
      <img src="${m.berkas}" alt="${esc(m.nama)}">
      <span class="nm">${esc(m.nama)}</span><span class="tg">${tgl(m.tanggal)}</span>
    </button>`);
    n.onclick = () => bukaModul('galeri');
    kisi.appendChild(n);
  });
  med.isi.appendChild(kisi);
  baris2.appendChild(med.el);

  const cepat = panelMW('Quick Links', I.tautan, null, null);
  const kisiCepat = el('<div class="mw-cepat"></div>');
  [
    { ik: I.dok,        l: 'Tambah Artikel', r: 'artikel-web'  },
    { ik: I.agenda,     l: 'Buat Event',     r: 'agenda-event' },
    { ik: I.unggahAwan, l: 'Upload Media',   r: 'galeri'       },
    { ik: I.jam,        l: 'Jadwalkan Post', r: 'sosmed'       },
    { ik: I.log,        l: 'Kelola Menu',    r: 'atur-web'     },
    { ik: I.analitik,   l: 'Pengaturan SEO', r: 'seo'          },
  ].forEach((x) => {
    const n = el(`<button class="mw-cepat-btn">${x.ik}<span>${esc(x.l)}</span></button>`);
    n.onclick = () => bukaModul(x.r);
    kisiCepat.appendChild(n);
  });
  cepat.isi.appendChild(kisiCepat);
  baris2.appendChild(cepat.el);
  box.appendChild(baris2);

  /* --- pusat kendali cepat --- */
  const pusat = el(`<div class="mw-pusat">
    <div class="mw-pusat-kepala">${I.petir}<h3>Pusat Kendali Cepat</h3></div>
    <div class="mw-pusat-kisi"></div></div>`);
  [
    { ik: I.dok,       l: 'Buat Artikel Baru', r: 'artikel-web' },
    { ik: I.rumah,     l: 'Kelola Homepage',   r: 'konten-web'  },
    { ik: I.bagan,     l: 'Cek Analytics',     r: 'pengunjung'  },
    { ik: I.layout,    l: 'Kelola Sidebar',    r: 'konten-web'  },
    { ik: I.basisData, l: 'Backup Website',    r: 'atur-web'    },
    { ik: I.palet,     l: 'Pengaturan Tema',   r: 'atur-web'    },
  ].forEach((x) => {
    const n = el(`<button class="mw-pusat-btn">${x.ik}<span>${esc(x.l)}</span></button>`);
    n.onclick = () => bukaModul(x.r);
    pusat.querySelector('.mw-pusat-kisi').appendChild(n);
  });
  box.appendChild(pusat);
  return box;
}

/** Panel dasbor bertajuk, dengan tombol kanan atas opsional. */
function panelMW(judul, ikon, aksi, onAksi) {
  const n = el(`<div class="mw-panel">
    <div class="mw-panel-kepala">${ikon}<h3>${esc(judul)}</h3>
      ${aksi ? `<button class="mw-aksi"${onAksi ? '' : ' disabled'}>${esc(aksi)}</button>` : ''}</div>
    <div class="mw-panel-isi"></div></div>`);
  if (onAksi) n.querySelector('.mw-aksi').onclick = onAksi;
  return { el: n, isi: n.querySelector('.mw-panel-isi') };
}

const lampau = (ts) => {
  const menit = Math.max(1, Math.round((Date.now() - new Date(ts)) / 60000));
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.round(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  return `${Math.round(jam / 24)} hari lalu`;
};

/* ---------------- modul yang memakai mesin generik ---------------- */
const modulMW = (nama, spec) => ({ ruang: 'mediaweb', izin: 'mediaweb.manage', koleksi: nama,
  pratinjau: { awal: 3, akhir: 1 }, ...spec });

Object.assign(MODUL, {
  'agenda-event': modulMW('event', {
    judul: 'Agenda & Event', satuan: 'Agenda',
    sub: 'Acara yang diumumkan di website — terpisah dari jadwal kajian internal.',
    cari: (x) => `${x.judul} ${x.lokasi}`, tajuk: (x) => x.judul,
    kolom: [
      { l: 'Nama Event', isi: (x) => `<b>${esc(x.judul)}</b><br><span style="color:var(--e-abu);font-size:11.8px">${esc(x.ket || '')}</span>` },
      { l: 'Tanggal', kelas: 'utuh', isi: (x) => `${tgl(x.tanggal)}<br><span style="color:var(--e-abu);font-size:11.8px">${esc(x.jam || '')}</span>` },
      { l: 'Lokasi', isi: (x) => esc(x.lokasi) },
      { l: 'Status', isi: (x) => lencanaMW(x.status) },
    ],
    form: [
      { k: 'judul', l: 'Nama Event', wajib: true, ph: 'Seminar Ulumul Quran' },
      { k: 'tanggal', l: 'Tanggal', jenis: 'tanggal', wajib: true },
      { k: 'jam', l: 'Waktu', ph: '19:30' },
      { k: 'lokasi', l: 'Lokasi', wajib: true, ph: 'Aula IKPM Kairo' },
      { k: 'status', l: 'Status', jenis: 'pilih', bawaan: 'draft', pilihan: pilihanStatusMW(['draft', 'dijadwalkan', 'terbit']) },
      { k: 'ket', l: 'Keterangan', jenis: 'area', ph: 'Ringkasan acara untuk diumumkan di website.' },
    ],
  }),

  sosmed: modulMW('sosmed', {
    judul: 'Media Sosial', satuan: 'Posting',
    sub: 'Rencana dan arsip unggahan di kanal media sosial.',
    cari: (x) => `${x.judul} ${x.platform}`, tajuk: (x) => x.judul,
    kolom: [
      { l: 'Judul Posting', isi: (x) => `<b>${esc(x.judul)}</b>` },
      { l: 'Platform', isi: (x) => `<span class="lencana l-abu">${esc(x.platform)}</span>` },
      { l: 'Tanggal', kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
      { l: 'Interaksi', kelas: 'utuh', isi: (x) => Number(x.interaksi || 0).toLocaleString('id-ID') },
      { l: 'Status', isi: (x) => lencanaMW(x.status) },
      { l: 'Materi', isi: () => '', pasang: selGambar('gambar', 'judul') },
    ],
    form: [
      { k: 'judul', l: 'Judul Posting', wajib: true, ph: 'Quote Ulama Tafsir' },
      { k: 'platform', l: 'Platform', jenis: 'pilih', bawaan: 'Instagram',
        pilihan: ['Instagram', 'Facebook', 'Twitter', 'TikTok', 'Telegram'].map((v) => ({ v, l: v })) },
      { k: 'tanggal', l: 'Tanggal Tayang', jenis: 'tanggal', wajib: true },
      { k: 'status', l: 'Status', jenis: 'pilih', bawaan: 'draft', pilihan: pilihanStatusMW(['draft', 'dijadwalkan', 'terbit']) },
      { k: 'interaksi', l: 'Jumlah Interaksi', jenis: 'angka', ph: '0',
        bantu: 'Disalin dari statistik platformnya — prototipe ini tidak tersambung ke API media sosial.' },
      { k: 'isi', l: 'Naskah Unggahan', jenis: 'area', ph: 'Teks yang akan diunggah.' },
      { k: 'gambar', l: 'Materi Visual', jenis: 'gambar' },
    ],
  }),

  galeri: modulMW('media', {
    judul: 'Galeri Media', satuan: 'Berkas',
    sub: 'Foto dan grafis yang dipakai website maupun publikasi.',
    cari: (x) => `${x.nama} ${x.jenis}`, tajuk: (x) => x.nama,
    kolom: [
      { l: 'Nama Berkas', isi: (x) => `<b>${esc(x.nama)}</b>` },
      { l: 'Jenis', isi: (x) => `<span class="lencana l-abu">${esc(x.jenis)}</span>` },
      { l: 'Tanggal', kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
      { l: 'Pratinjau', isi: () => '', pasang: selGambar('berkas', 'nama') },
    ],
    form: [
      { k: 'nama', l: 'Nama Berkas', wajib: true, ph: 'Dokumentasi Kajian Sabtu' },
      { k: 'jenis', l: 'Jenis', jenis: 'pilih', bawaan: 'Foto',
        pilihan: ['Foto', 'Grafis', 'Ilustrasi', 'Logo'].map((v) => ({ v, l: v })) },
      { k: 'tanggal', l: 'Tanggal', jenis: 'tanggal', wajib: true },
      { k: 'berkas', l: 'Berkas', jenis: 'gambar', bantu: 'Dikecilkan otomatis agar penyimpanan tetap lapang.' },
    ],
  }),

  'desain-web': modulMW('desain', {
    judul: 'Desain & Kreatif', satuan: 'Desain',
    sub: 'Sampul, banner, template, dan aset cetak.',
    cari: (x) => `${x.nama} ${x.jenis}`, tajuk: (x) => x.nama,
    kolom: [
      { l: 'Nama Desain', isi: (x) => `<b>${esc(x.nama)}</b>` },
      { l: 'Jenis', isi: (x) => `<span class="lencana l-abu">${esc(x.jenis)}</span>` },
      { l: 'Tanggal', kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
      { l: 'Status', isi: (x) => lencanaMW(x.status) },
      { l: 'Berkas', isi: () => '', pasang: selGambar('berkas', 'nama') },
    ],
    form: [
      { k: 'nama', l: 'Nama Desain', wajib: true, ph: 'Banner Seminar Juli' },
      { k: 'jenis', l: 'Jenis', jenis: 'pilih', bawaan: 'Banner',
        pilihan: ['Banner', 'Cover', 'Template', 'Cetak', 'Lainnya'].map((v) => ({ v, l: v })) },
      { k: 'tanggal', l: 'Tanggal', jenis: 'tanggal', wajib: true },
      { k: 'status', l: 'Status', jenis: 'pilih', bawaan: 'proses', pilihan: pilihanStatusMW(['proses', 'selesai']) },
      { k: 'berkas', l: 'Berkas Desain', jenis: 'gambar' },
    ],
  }),

  video: modulMW('video', {
    judul: 'Video & Podcast', satuan: 'Video',
    sub: 'Rekaman kajian, cuplikan, dan siniar.',
    cari: (x) => `${x.judul} ${x.platform}`, tajuk: (x) => x.judul,
    kolom: [
      { l: 'Judul', isi: (x) => `<b>${esc(x.judul)}</b>` },
      { l: 'Platform', isi: (x) => `<span class="lencana l-abu">${esc(x.platform)}</span>` },
      { l: 'Durasi', kelas: 'utuh', isi: (x) => esc(x.durasi || '—') },
      { l: 'Tanggal', kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
      { l: 'Status', isi: (x) => lencanaMW(x.status) },
      { l: 'Sampul', isi: () => '', pasang: selGambar('thumb', 'judul') },
    ],
    form: [
      { k: 'judul', l: 'Judul', wajib: true, ph: 'Highlight Kajian Sabtu' },
      { k: 'platform', l: 'Platform', jenis: 'pilih', bawaan: 'YouTube',
        pilihan: ['YouTube', 'Instagram', 'Spotify', 'TikTok'].map((v) => ({ v, l: v })) },
      { k: 'tanggal', l: 'Tanggal Tayang', jenis: 'tanggal', wajib: true },
      { k: 'durasi', l: 'Durasi', ph: '08:24' },
      { k: 'status', l: 'Status', jenis: 'pilih', bawaan: 'editing', pilihan: pilihanStatusMW(['draft', 'editing', 'dijadwalkan', 'terbit']) },
      { k: 'tautan', l: 'Tautan', ph: 'https://youtube.com/…' },
      { k: 'thumb', l: 'Sampul', jenis: 'gambar' },
    ],
  }),
});

/* ---------------- halaman ----------------
   Modul di atas didaftarkan setelah gelung pendaftaran HAL berjalan,
   jadi rutenya harus dipasang sendiri di sini. */
['agenda-event', 'sosmed', 'galeri', 'desain-web', 'video'].forEach((nama) => {
  HAL[nama] = () => halamanOrg(nama);
  HAL[nama].judul = () => [MODUL[nama].judul, MODUL[nama].sub];
});

HAL['konten-web'] = () => HAL.cms();
HAL['konten-web'].judul = () => ['Konten Website', 'Ubah teks, gambar, dan urutan section. Perubahan masuk ke draft.'];

HAL['atur-web'] = () => HAL.tema();
HAL['atur-web'].judul = () => ['Pengaturan Website', 'Warna, font, logo, dan data kontak organisasi.'];

HAL.komentar = () => HAL.pesan();
HAL.komentar.judul = () => ['Komentar & Pesan', 'Pesan yang dikirim melalui form kontak website.'];

HAL.kalender = () => {
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Gabungan dari empat sumber</b>
    Kalender ini menyatukan artikel, agenda, media sosial, dan video menurut tanggalnya.
    Menyuntingnya dilakukan di modul masing-masing — tekan barisnya untuk ke sana.
  </div></div></div>`);
  const semua = kalenderKonten();
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Kalender Konten</h3><span class="hitung">(${semua.length} Konten)</span></div>
    <div class="mw-panel-isi" data-isi></div></div>`);
  const isi = kartu.querySelector('[data-isi]');
  if (!semua.length) isi.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada konten</p></div>`));
  semua.forEach((k) => isi.appendChild(barisKalender(k)));
  box.appendChild(kartu);
  return box;
};
HAL.kalender.judul = () => ['Kalender Konten', 'Artikel, agenda, media sosial, dan video dalam satu urutan tanggal.'];

/* Artikel & Publikasi — jendela baca-saja ke naskah milik PJ Artikel */
HAL['artikel-web'] = () => {
  const box = el(`<div><div class="notis notis-kuning">${I.perisai}<div>
    <b>Naskah dikelola PJ Artikel</b>
    Di sini Anda melihat seluruh naskah beserta status tayangnya, tetapi penyuntingan dan
    penerbitannya tetap wewenang PJ Artikel — supaya tidak ada dua pintu yang mengubah tulisan yang sama.
  </div></div></div>`);

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Artikel & Publikasi</h3>
    <span class="hitung">(${Store.db.artikel.filter((a) => a.status === 'terbit').length} tayang dari ${Store.db.artikel.length} naskah)</span>
    <div class="kanan"><input class="cari-org" placeholder="Cari judul atau penulis…" data-cari></div>
  </div><div data-wadah></div></div>`);
  const wadah = kartu.querySelector('[data-wadah]');
  const cari = kartu.querySelector('[data-cari]');

  const isiUlang = () => {
    const q = cari.value.trim().toLowerCase();
    const data = Store.db.artikel.filter((a) =>
      !q || `${a.judul} ${Store.namaUser(a.penulisId)} ${a.kategori}`.toLowerCase().includes(q));
    if (!data.length) { wadah.replaceChildren(el(`<div class="kosong-erp">${I.kotak}<p>Tidak ada naskah yang cocok</p></div>`)); return; }
    const t = el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>Judul</th><th>Penulis</th><th>Kategori</th>
        <th>Tanggal</th><th>Status</th><th class="kol-tengah">Dibaca</th></tr></thead><tbody></tbody></table></div>`);
    const tb = t.querySelector('tbody');
    data.forEach((a, i) => {
      const st = STATUS_ART[a.status];
      const tr = el(`<tr>
        <td class="kol-no">${i + 1}</td>
        <td><div style="display:flex;align-items:center;gap:10px">
          <img src="${a.cover}" alt="" style="width:40px;height:30px;border-radius:6px;object-fit:cover;flex:none">
          <span>${esc(a.judul)}</span></div></td>
        <td>${esc(Store.namaUser(a.penulisId))}</td>
        <td class="utuh">${esc(a.kategori)}</td>
        <td class="utuh">${tgl(a.tanggal)}</td>
        <td><span class="lencana ${st.c}">${st.l}</span></td>
        <td class="kol-tengah utuh">${Number(a.dilihat || 0).toLocaleString('id-ID')}x</td>
      </tr>`);
      tb.appendChild(tr);
    });
    wadah.replaceChildren(t);
  };
  cari.oninput = isiUlang;
  isiUlang();
  box.appendChild(kartu);
  return box;
};
HAL['artikel-web'].judul = () => ['Artikel & Publikasi', 'Naskah yang tayang di website beserta jumlah pembacanya.'];

/* Manajemen User — daftar baca-saja */
HAL['akun-web'] = () => {
  const peran = {};
  Store.db.users.forEach((u) => { const k = RBAC.kunciRole(u.role); (peran[k] ||= []).push(u); });
  const box = el(`<div><div class="notis notis-kuning">${I.perisai}<div>
    <b>Akun dan peran dikelola Ketua Umum</b>
    Daftar ini baca saja. Menambah akun atau mengubah peran menuntut izin <code>user.manage</code>,
    yang sengaja hanya dipegang Ketua — satu pintu untuk urusan wewenang.
  </div></div></div>`);

  box.appendChild(el(`<div class="grid-stat">
    ${[{ ik: I.grup, n: Store.db.users.length, l: 'Total akun', w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' },
       { ik: I.perisai, n: Object.keys(peran).length, l: 'Peran terpakai', w: 'rgba(124,92,214,.14)', wc: '#5F45AE' },
       { ik: I.cekBulat, n: Store.db.users.filter((u) => u.status === 'aktif').length, l: 'Akun aktif', w: 'rgba(62,127,184,.14)', wc: '#2C6091' }]
      .map((s) => `<div class="stat" style="--w:${s.w};--wc:${s.wc}">
        <div class="stat-ik">${s.ik}</div><div class="stat-nilai">${s.n}</div>
        <div class="stat-label">${esc(s.l)}</div></div>`).join('')}
  </div>`));

  Object.keys(RBAC.ROLES).filter((k) => peran[k]?.length).forEach((k) => {
    const kartu = el(`<div class="kartu" style="margin-bottom:18px"><div class="kartu-kepala">
      <h3>${esc(RBAC.roleLabel(k))}</h3><span class="hitung">(${peran[k].length} akun)</span>
      <div class="kanan"><span class="lencana l-abu">${RBAC.ROLES[k].permissions.length} izin</span></div>
    </div></div>`);
    kartu.appendChild(el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>Nama</th><th>Email</th><th>Angkatan</th><th>Status</th></tr></thead>
      <tbody>${peran[k].map((u, i) => `<tr><td class="kol-no">${i + 1}</td>
        <td><div style="display:flex;align-items:center;gap:10px">
          <img src="${u.foto}" alt="" style="width:30px;height:30px;border-radius:50%;flex:none">
          <b>${esc(u.nama)}</b></div></td>
        <td class="utuh">${esc(u.email)}</td><td class="utuh">${esc(u.angkatan)}</td>
        <td><span class="lencana ${u.status === 'aktif' ? 'l-hijau' : u.status === 'alumni' ? 'l-biru' : 'l-abu'}">${esc(u.status)}</span></td>
      </tr>`).join('')}</tbody></table></div>`));
    box.appendChild(kartu);
  });
  return box;
};
HAL['akun-web'].judul = () => ['Manajemen User', 'Daftar akun dan perannya — baca saja.'];

/* Pengunjung Website — statistik terperinci */
HAL.pengunjung = () => {
  const box = el('<div></div>');
  const kini = rekapKunjungan(30), lalu = rekapKunjungan(60, 30);

  box.appendChild(el(`<div class="notis notis-info">${I.info}<div>
    <b>Dihitung sendiri oleh website, bukan angka karangan</b>
    Tiap halaman publik yang dibuka mencatat kunjungannya. Karena prototipe ini berjalan tanpa
    server, catatannya tersimpan di peramban — jadi angka di sini mengukur pemakaian prototipe,
    bukan pengunjung sedunia. Bukalah <b>index.html</b> beberapa kali, lalu perhatikan angkanya naik.
  </div></div>`));

  box.appendChild(el(`<div class="grid-stat">
    ${[{ ik: I.grup, n: kini.sesi.toLocaleString('id-ID'), l: 'Kunjungan 30 hari', w: 'rgba(124,92,214,.14)', wc: '#5F45AE', p: selisihPersen(kini.sesi, lalu.sesi) },
       { ik: I.layout, n: kini.tayang.toLocaleString('id-ID'), l: 'Tayangan halaman', w: 'rgba(62,127,184,.14)', wc: '#2C6091', p: selisihPersen(kini.tayang, lalu.tayang) },
       { ik: I.bagan, n: kini.perKunjungan.toFixed(2), l: 'Halaman per kunjungan', w: 'rgba(140,198,63,.16)', wc: '#4A7A1E', p: selisihPersen(kini.perKunjungan, lalu.perKunjungan) },
       { ik: I.cekBulat, n: kini.persenBaru + '%', l: 'Pengunjung baru', w: 'rgba(240,149,30,.15)', wc: '#B87310', p: selisihPersen(kini.persenBaru, lalu.persenBaru) }]
      .map((s) => `<div class="stat" style="--w:${s.w};--wc:${s.wc}">
        <div class="stat-ik">${s.ik}</div><div class="stat-nilai">${esc(String(s.n))}</div>
        <div class="stat-label">${esc(s.l)}</div>
        <div style="margin-top:6px">${arahTren(s.p)}</div></div>`).join('')}
  </div>`));

  const kartu = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Tayangan 30 Hari Terakhir</h3>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-export>${I.unduh} Export Excel</button></div>
  </div><div class="panel-isi" data-g></div></div>`);
  kartu.querySelector('[data-g]').appendChild(grafikGaris(deretKunjungan(30), 210));
  kartu.querySelector('[data-export]').onclick = () => {
    const baris = [['Tanggal', 'Tayangan Halaman']];
    deretKunjungan(30).forEach((t) => baris.push([t.tgl, t.n]));
    unduhCsv('kunjungan-website.csv', baris);
  };
  box.appendChild(kartu);

  /* halaman terpopuler */
  const perHal = {};
  Store.db.kunjungan.forEach((k) => {
    if (k.halaman === Store.KUNJUNG_SESI || k.halaman === Store.KUNJUNG_BARU) return;
    if (k.tgl < hariLalu(30)) return;
    perHal[k.halaman] = (perHal[k.halaman] || 0) + k.n;
  });
  const urut = Object.entries(perHal).sort((a, b) => b[1] - a[1]);
  const totalHal = urut.reduce((s, [, n]) => s + n, 0) || 1;

  const kh = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Halaman Terpopuler</h3><span class="hitung">30 hari terakhir</span></div></div>`);
  kh.appendChild(el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Halaman</th><th>Tayangan</th><th style="min-width:180px">Porsi</th></tr></thead>
    <tbody>${urut.map(([h, n], i) => `<tr><td class="kol-no">${i + 1}</td>
      <td><b>${esc(h)}</b></td><td class="utuh">${n.toLocaleString('id-ID')}</td>
      <td><div style="display:flex;align-items:center;gap:10px">
        <div class="bar-maju" style="flex:1"><span style="width:${Math.round((n / totalHal) * 100)}%"></span></div>
        <b style="font-size:12.4px;min-width:38px;text-align:right">${Math.round((n / totalHal) * 100)}%</b></div></td>
    </tr>`).join('') || `<tr><td colspan="4" style="color:var(--e-abu)">Belum ada kunjungan tercatat.</td></tr>`}</tbody>
  </table></div>`));
  box.appendChild(kh);

  /* artikel terpopuler — dihitung dari pembacaan sungguhan */
  const art = [...Store.db.artikel].filter((a) => a.status === 'terbit')
    .sort((a, b) => (b.dilihat || 0) - (a.dilihat || 0)).slice(0, 8);
  const ka = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Artikel Paling Dibaca</h3><span class="hitung">dihitung saat pembaca membukanya</span></div></div>`);
  ka.appendChild(el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Judul</th><th>Penulis</th><th class="kol-tengah">Dibaca</th></tr></thead>
    <tbody>${art.map((a, i) => `<tr><td class="kol-no">${i + 1}</td><td>${esc(a.judul)}</td>
      <td>${esc(Store.namaUser(a.penulisId))}</td>
      <td class="kol-tengah utuh"><b>${Number(a.dilihat || 0).toLocaleString('id-ID')}x</b></td></tr>`).join('')
      || `<tr><td colspan="4" style="color:var(--e-abu)">Belum ada artikel terbit.</td></tr>`}</tbody>
  </table></div>`));
  box.appendChild(ka);
  return box;
};
HAL.pengunjung.judul = () => ['Pengunjung Website', 'Kunjungan, tayangan halaman, dan artikel paling dibaca.'];

/* SEO & Analytics */
HAL.seo = () => {
  const s = Store.db.seo;
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Metadata yang dibaca mesin pencari</b>
    Judul dan deskripsi di bawah inilah yang muncul pada hasil pencarian dan saat tautan
    dibagikan ke media sosial. Ringkas, jelas, dan memuat kata yang benar-benar dicari orang.
  </div></div></div>`);

  let ogGambar = s.ogGambar;
  const kartu = el(`<div class="kartu"><div class="kartu-kepala"><h3>Metadata Halaman</h3>
    <span class="hitung">berlaku untuk seluruh website</span></div>
    <div class="panel-isi">
      <div class="grup"><label>Judul Beranda (title tag)</label>
        <input id="sj" value="${esc(s.judulBeranda)}" maxlength="70">
        <div class="bantu">Sebaiknya di bawah 60 karakter agar tidak terpotong di hasil pencarian.</div></div>
      <div class="grup"><label>Deskripsi (meta description)</label>
        <textarea id="sd" style="min-height:88px" maxlength="200">${esc(s.deskripsi)}</textarea>
        <div class="bantu">Idealnya 120–160 karakter.</div></div>
      <div class="grid-form">
        <div class="grup"><label>Kata Kunci</label>
          <input id="sk" value="${esc((s.kataKunci || []).join(', '))}" placeholder="kajian tafsir, ulum al-quran">
          <div class="bantu">Pisahkan dengan koma.</div></div>
        <div class="grup"><label>Alamat Domain</label>
          <input id="sm" value="${esc(s.domain || '')}" placeholder="alijazqurancenter.com">
          <div class="bantu">Dipakai pada pratinjau hasil pencarian dan tautan berbagi.</div></div>
      </div>
      <div class="grid-form">
        <div class="grup"><label>Instruksi Robot Pencari</label>
          <select id="sr">${['index, follow', 'index, nofollow', 'noindex, follow', 'noindex, nofollow']
            .map((v) => `<option ${s.robots === v ? 'selected' : ''}>${v}</option>`).join('')}</select>
          <div class="bantu">"noindex" menyembunyikan website dari hasil pencarian.</div></div>
      </div>
      <div class="grup"><label>Gambar Bagikan (OG image)</label>
        <div class="pratinjau-gambar">
          <img data-pv src="${ogGambar}">
          <div style="flex:1"><p style="margin:0 0 10px;font-size:12.4px;color:var(--e-abu)">
            Muncul saat tautan website dibagikan ke WhatsApp atau media sosial. Rasio 1.91:1.</p>
          <label class="btn btn-garis btn-kecil" style="display:inline-flex;cursor:pointer;margin:0">
            ${I.gambar} Ganti Gambar<input type="file" accept="image/*" hidden></label></div>
        </div></div>
      <button class="btn btn-lime" id="simpanSeo">${I.cek} Simpan Pengaturan SEO</button>
    </div></div>`);

  const inp = kartu.querySelector('input[type=file]');
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    try { ogGambar = await Store.unggahGambar(f, 1200); kartu.querySelector('[data-pv]').src = ogGambar; }
    catch (e) { toast(e.message, true); }
  };
  kartu.querySelector('#simpanSeo').onclick = () => {
    const g = (id) => kartu.querySelector('#' + id).value;
    if (!g('sj').trim()) return toast('Judul beranda wajib diisi.', true);
    aman(() => {
      Store.simpanSeo(U, { judulBeranda: g('sj').trim(), deskripsi: g('sd').trim(), domain: g('sm').trim(),
        kataKunci: g('sk').split(',').map((x) => x.trim()).filter(Boolean),
        robots: g('sr'), ogGambar });
      toast('Pengaturan SEO tersimpan.'); gambar();
    });
  };
  box.appendChild(kartu);

  /* pratinjau hasil pencarian */
  box.appendChild(el(`<div class="kartu" style="margin-top:20px"><div class="kartu-kepala">
    <h3>Pratinjau Hasil Pencarian</h3><span class="hitung">perkiraan tampilan di Google</span></div>
    <div class="panel-isi"><div class="seo-pratinjau">
      <div class="tautan">${esc(s.domain || Store.cms.situs.nama)}</div>
      <div class="judul">${esc(s.judulBeranda)}</div>
      <div class="ket">${esc(s.deskripsi)}</div>
    </div></div></div>`));
  return box;
};
HAL.seo.judul = () => ['SEO & Analytics', 'Metadata halaman dan cara website tampil di mesin pencari.'];

/* ============================================================
   RUANG KERJA PJ KOORDINATOR KAJIAN
   ------------------------------------------------------------
   Seluruh halaman terikat pada Angkatan & Level yang dipilih di
   topbar. Status kesiapan tiap kajian tidak disimpan melainkan
   dihitung dari kelengkapan datanya — sehingga mustahil sebuah
   kajian tertulis "Siap" padahal notulen dan PPT-nya belum ada.
   ============================================================ */
let angkatanPilihan = null, levelPilihan = null;

const angkatanTersedia = () => [...new Set(Store.db.kajian.map((k) => k.angkatan).filter(Boolean))]
  .sort((a, b) => urutAngkatan(a) - urutAngkatan(b));
const levelTersedia = () => [...new Set(Store.db.kajian.map((k) => k.level).filter(Boolean))].sort();

function angkatanAktif() {
  const ada = angkatanTersedia();
  if (!angkatanPilihan || !ada.includes(angkatanPilihan)) angkatanPilihan = ada[0] || 'Angkatan X';
  return angkatanPilihan;
}
function levelAktif() {
  const ada = levelTersedia();
  if (!levelPilihan || !ada.includes(levelPilihan)) levelPilihan = ada[0] || 'Level 3';
  return levelPilihan;
}

const kajianAktif = () => Store.db.kajian
  .filter((k) => k.angkatan === angkatanAktif() && k.level === levelAktif())
  .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

const anggotaAngkatan = () => Store.db.users
  .filter((u) => u.angkatan === angkatanAktif() && u.status === 'aktif');

/* --- kelengkapan & kesiapan --- */
const CEKLIS = [
  { k: 'pemakalahId', l: 'Pemakalah' }, { k: 'moderatorId', l: 'Moderator' },
  { k: 'notulenId', l: 'Notulen' }, { k: 'judul', l: 'Judul' },
  { k: 'tempat', l: 'Tempat' }, { k: 'ppt', l: 'PPT' }, { k: 'revisi', l: 'Revisi' },
];
const lengkapKah = (k, kunci) => (typeof k[kunci] === 'boolean' ? k[kunci] : !!String(k[kunci] || '').trim());
const kesiapan = (k) => Math.round((CEKLIS.filter((c) => lengkapKah(k, c.k)).length / CEKLIS.length) * 100);

const STATUS_KAJIAN = {
  selesai : { l: 'Selesai',       c: 'l-hijau'  },
  siap    : { l: 'Siap',          c: 'l-hijau'  },
  persiapan:{ l: 'Persiapan',     c: 'l-kuning' },
  belum   : { l: 'Belum Lengkap', c: 'l-merah'  },
  mendatang:{ l: 'Mendatang',     c: 'l-biru'   },
};

/** Status diturunkan, bukan disimpan — itulah sebabnya ia tak bisa
    berbohong tentang kelengkapan data kajiannya. */
function statusKajian(k) {
  if (k.tanggal < nowTanggal()) return 'selesai';
  const selisih = Math.round((new Date(k.tanggal) - new Date(nowTanggal())) / 86400000);
  if (selisih > 7) return 'mendatang';
  const p = kesiapan(k);
  return p === 100 ? 'siap' : p >= 60 ? 'persiapan' : 'belum';
}
const lencanaKajian = (k) => {
  const s = statusKajian(k);
  return `<span class="lencana ${STATUS_KAJIAN[s].c}">${STATUS_KAJIAN[s].l}</span>`;
};

/* --- presensi --- */
const PRESENSI = {
  hadir        : { l: 'Hadir',       c: 'l-hijau'  },
  terlambat    : { l: 'Terlambat',   c: 'l-kuning' },
  'tidak-hadir': { l: 'Tidak Hadir', c: 'l-merah'  },
};
const rekapPresensi = (k) => {
  const p = k.presensi || [];
  const total = anggotaAngkatan().length;
  const h = p.filter((x) => x.status === 'hadir').length;
  const t = p.filter((x) => x.status === 'terlambat').length;
  const x = p.filter((x) => x.status === 'tidak-hadir').length;
  return { hadir: h, terlambat: t, tidakHadir: x, belum: Math.max(0, total - h - t - x), total,
    persen: total ? Math.round(((h + t) / total) * 100) : 0 };
};

const kajianHariIni = () => kajianAktif().find((k) => k.tanggal === nowTanggal())
  || kajianAktif().find((k) => k.tanggal >= nowTanggal())
  || kajianAktif()[kajianAktif().length - 1];

/* --- notifikasi diturunkan, bukan koleksi tersendiri --- */
function notifikasiKajian() {
  const n = [];
  Store.db.kajian.filter((k) => k.tanggal >= nowTanggal()).forEach((k) => {
    const kurang = CEKLIS.filter((c) => !lengkapKah(k, c.k)).map((c) => c.l);
    const selisih = Math.round((new Date(k.tanggal) - new Date(nowTanggal())) / 86400000);
    if (kurang.length && selisih <= 7) n.push({
      penting: selisih <= 3, ikon: I.peringatan,
      judul: `${k.judul} belum lengkap`,
      ket: `Kurang: ${kurang.join(', ')} · ${selisih === 0 ? 'hari ini' : selisih + ' hari lagi'}`,
      rute: 'jadwal-kajian',
    });
  });
  Store.db.kajian.filter((k) => k.tanggal < nowTanggal() && !(k.presensi || []).length).forEach((k) => n.push({
    penting: true, ikon: I.daftarCek, judul: `Presensi "${k.judul}" belum diisi`,
    ket: `Kajian berlangsung ${tgl(k.tanggal)}`, rute: 'presensi',
  }));
  Store.db.kajian.filter((k) => k.tanggal < nowTanggal() && !k.notulensi).forEach((k) => n.push({
    penting: false, ikon: I.dok, judul: `Notulen "${k.judul}" belum ditulis`,
    ket: `Kajian berlangsung ${tgl(k.tanggal)}`, rute: 'notulen',
  }));
  return n;
}

/* ---------------- dasbor ---------------- */
function dasborKoordinator() {
  const box = el('<div></div>');
  const semua = kajianAktif();
  const anggota = anggotaAngkatan();
  const bulanIni = nowTanggal().slice(0, 7);
  const selesai = semua.filter((k) => statusKajian(k) === 'selesai');
  const mendatang = semua.filter((k) => k.tanggal >= nowTanggal());
  const berpresensi = selesai.filter((k) => (k.presensi || []).length);
  const rata = berpresensi.length
    ? Math.round(berpresensi.reduce((a, k) => a + rekapPresensi(k).persen, 0) / berpresensi.length) : 0;
  const belumLengkap = mendatang.filter((k) => kesiapan(k) < 100).length;

  box.appendChild(el(`<div class="kj-stat-grid">
    ${[
      { ik: I.kalender,  w:'rgba(140,198,63,.16)', wc:'#4A7A1E', l:'Kajian Bulan Ini', n: semua.filter((k) => k.tanggal.startsWith(bulanIni)).length },
      { ik: I.grup,      w:'rgba(62,127,184,.14)', wc:'#2C6091', l:'Anggota Aktif', n: anggota.length },
      { ik: I.buku,      w:'rgba(124,92,214,.14)', wc:'#5F45AE', l:'Kajian Selesai', n: selesai.length },
      { ik: I.jam,       w:'rgba(240,149,30,.15)', wc:'#B87310', l:'Kajian Mendatang', n: mendatang.length },
      { ik: I.bagan,     w:'rgba(47,169,140,.14)', wc:'#1F7A64', l:'Rata-rata Kehadiran', n: rata + '%' },
      { ik: I.peringatan,w:'rgba(229,83,75,.13)',  wc:'#B23E37', l:'Materi Belum Lengkap', n: belumLengkap },
    ].map((s) => `<div class="kj-stat">
      <span class="kj-stat-ik" style="--w:${s.w};--wc:${s.wc}">${s.ik}</span>
      <div><div class="kj-stat-l">${esc(s.l)}</div><div class="kj-stat-n">${esc(String(s.n))}</div></div>
    </div>`).join('')}
  </div>`));

  /* --- jadwal terdekat + presensi hari ini --- */
  const baris1 = el('<div class="kj-baris kj-2"></div>');
  const jad = panelMW('Jadwal Kajian Terdekat', I.kalender, 'Lihat Semua', () => bukaModul('jadwal-kajian'));
  const dekat = mendatang.slice(0, 5);
  if (!dekat.length) jad.isi.appendChild(el(`<div class="kosong-erp" style="padding:26px">${I.kotak}<p>Tidak ada kajian mendatang</p></div>`));
  else {
    jad.isi.appendChild(el(`<div class="tabel-bungkus"><table class="t-org t-rapat">
      <thead><tr><th>Tanggal</th><th>Angkatan</th><th>Level</th><th>Pemakalah</th><th>Judul Kajian</th>
        <th>Moderator</th><th>Notulen</th><th class="kol-tengah">Revisi</th><th class="kol-tengah">PPT</th>
        <th>Tempat</th><th>Status</th></tr></thead>
      <tbody>${dekat.map((k) => `<tr>
        <td class="utuh">${tgl(k.tanggal)}</td>
        <td class="utuh">${esc(k.angkatan.replace('Angkatan ', ''))}</td>
        <td class="utuh">${esc(k.level.replace('Level ', ''))}</td>
        <td>${esc(namaPendek(k.pemakalahId))}</td>
        <td>${esc(k.judul)}</td>
        <td>${esc(namaPendek(k.moderatorId))}</td>
        <td>${esc(namaPendek(k.notulenId))}</td>
        <td class="kol-tengah">${tandaLengkap(k.revisi)}</td>
        <td class="kol-tengah">${tandaLengkap(k.ppt)}</td>
        <td class="utuh">${esc(k.tempat || '—')}</td>
        <td>${lencanaKajian(k)}</td></tr>`).join('')}</tbody></table></div>`));
    jad.isi.appendChild(el(`<div class="kj-legenda">
      ${['siap', 'persiapan', 'belum', 'mendatang'].map((s) =>
        `<span class="${STATUS_KAJIAN[s].c}">${STATUS_KAJIAN[s].l}</span>`).join('')}
    </div>`));
  }
  baris1.appendChild(jad.el);

  const kHari = kajianHariIni();
  const pres = panelMW('Presensi Kajian Hari Ini', I.daftarCek, 'Lihat Semua', () => bukaModul('presensi'));
  if (!kHari) pres.isi.appendChild(el(`<div class="kosong-erp" style="padding:26px">${I.kotak}<p>Belum ada kajian</p></div>`));
  else {
    const r = rekapPresensi(kHari);
    pres.isi.appendChild(el(`<div class="kj-pres-kepala">
      <span>Kajian: <b>${esc(kHari.judul)}</b></span>
      <span class="pisah">${I.simpul} ${esc(kHari.angkatan)}</span>
      <span class="pisah">${I.grup} ${esc(kHari.level)}</span>
      <span class="k-tanggal" style="margin-left:auto">${I.kalender} ${tgl(kHari.tanggal)}</span>
    </div>`));
    pres.isi.appendChild(el(`<div class="kj-pres-kotak">
      ${[{ l:'Hadir', n:r.hadir, c:'hijau', ik:I.orang }, { l:'Terlambat', n:r.terlambat, c:'kuning', ik:I.jam },
         { l:'Tidak Hadir', n:r.tidakHadir, c:'merah', ik:I.peringatan }, { l:'Belum Absen', n:r.belum, c:'abu', ik:I.info }]
        .map((x) => `<div class="kj-pres-sel ${x.c}"><span class="ik">${x.ik}</span>
          <div><div class="l">${x.l}</div><div class="n">${x.n}</div></div></div>`).join('')}
    </div>`));

    const qrPanel = el(`<div class="kj-qr">
      <div class="kj-qr-gambar"><img src="${Store.db.kunjungan ? QR.svgDataUri('AIJZ-' + kHari.id) : ''}" alt="QR kajian"></div>
      <div><h4>Scan QR Code untuk Absen</h4>
        <p>Pindai QR anggota dengan kamera ponsel, lalu tempelkan hasilnya di sini.</p>
        <button class="btn btn-lime btn-kecil" data-scan>${I.qr} Mulai Scan</button></div>
    </div>`);
    qrPanel.querySelector('[data-scan]').onclick = () => dialogScan(kHari);
    pres.isi.appendChild(qrPanel);

    const terakhir = [...(kHari.presensi || [])].reverse().slice(0, 4);
    const kartuT = el(`<div class="kj-terakhir"><div class="jd">Presensi Terakhir</div></div>`);
    if (!terakhir.length) kartuT.appendChild(el('<div class="kosong" style="padding:14px;font-size:12.4px;color:var(--e-abu)">Belum ada yang absen.</div>'));
    terakhir.forEach((x, i) => kartuT.appendChild(el(`<div class="br">
      <span class="no">${i + 1}</span><span class="nm">${esc(namaPendek(x.userId))}</span>
      <span class="jm">${esc(x.jam || '-')}</span>
      <span class="lencana ${PRESENSI[x.status].c}">${PRESENSI[x.status].l}</span></div>`)));
    const lihat = el(`<button class="mw-tautan">Lihat Daftar Lengkap</button>`);
    lihat.onclick = () => dialogAbsensi(kHari);
    kartuT.appendChild(lihat);
    pres.isi.appendChild(kartuT);
  }
  baris1.appendChild(pres.el);
  box.appendChild(baris1);

  /* --- empat panel bawah --- */
  const baris2 = el('<div class="kj-baris kj-4"></div>');

  const angg = panelMW('Anggota & QR Code', I.qr, 'Lihat Semua', () => bukaModul('anggota-kajian'));
  const contoh = anggota[0];
  if (contoh) {
    const kartuQr = el(`<div class="kj-kartu-qr">
      <div class="nm">${esc(contoh.nama)}</div>
      <div class="mt">${esc(contoh.angkatan)}<br>${esc(contoh.level)}</div>
      <img src="${QR.svgDataUri(Store.kodeQr(contoh.id))}" alt="QR ${esc(contoh.nama)}">
      <button class="btn btn-garis btn-kecil" data-unduh>${I.unduh} Unduh QR</button>
    </div>`);
    kartuQr.querySelector('[data-unduh]').onclick = () => unduhQr(contoh);
    angg.isi.appendChild(el('<div class="kj-anggota"></div>')).appendChild(kartuQr);
    const ringkas = el(`<div class="kj-ringkas">
      ${[['Total Anggota', anggota.length], ['Anggota Aktif', anggota.length],
         ['Tidak Aktif', Store.db.users.filter((u) => u.angkatan === angkatanAktif() && u.status !== 'aktif').length],
         ['Total Kelompok', new Set(anggota.map((u) => u.kelompok).filter(Boolean)).size]]
        .map(([l, n]) => `<div class="br"><span>${l}</span><b>${n}</b></div>`).join('')}
    </div>`);
    const kelola = el(`<button class="btn btn-garis btn-kecil" style="width:100%">${I.grup} Kelola Anggota</button>`);
    kelola.onclick = () => bukaModul('anggota-kajian');
    ringkas.appendChild(kelola);
    angg.isi.querySelector('.kj-anggota').appendChild(ringkas);
  }
  baris2.appendChild(angg.el);

  const kDekat = mendatang[0];
  const tug = panelMW('Pembagian Tugas', I.orang, 'Lihat Semua', () => bukaModul('tugas-kajian'));
  if (!kDekat) tug.isi.appendChild(el(`<div class="kosong-erp" style="padding:26px">${I.kotak}<p>Tidak ada kajian mendatang</p></div>`));
  else {
    tug.isi.appendChild(el(`<div class="kj-sub">Kajian: <b>${esc(kDekat.judul)}</b><span>${tgl(kDekat.tanggal)}</span></div>`));
    const isiT = [
      ['Pemakalah', namaPendek(kDekat.pemakalahId), !!kDekat.pemakalahId],
      ['Moderator', namaPendek(kDekat.moderatorId), !!kDekat.moderatorId],
      ['Notulen', namaPendek(kDekat.notulenId), !!kDekat.notulenId],
      ['PPT', kDekat.ppt ? 'File sudah diunggah' : 'Belum diunggah', !!kDekat.ppt],
      ['Revisi', kDekat.revisi ? 'Sudah dicek' : 'Belum dicek', !!kDekat.revisi],
      ['Tempat', kDekat.tempat || '—', !!kDekat.tempat],
    ];
    tug.isi.appendChild(el(`<div class="kj-tugas">${isiT.map(([l, v, ok]) =>
      `<div class="br"><span class="l">${l}</span><span class="v">${esc(v)}</span>
        <span class="lencana ${ok ? 'l-hijau' : 'l-merah'}">${ok ? 'Lengkap' : 'Kosong'}</span></div>`).join('')}</div>`));
    const p = kesiapan(kDekat);
    tug.isi.appendChild(el(`<div class="kj-kesiapan">
      <div class="l">Status Kesiapan</div>
      <div style="display:flex;align-items:center;gap:10px">
        <div class="bar-maju" style="flex:1"><span style="width:${p}%"></span></div>
        <b>${p}%</b><span class="lencana ${p === 100 ? 'l-hijau' : 'l-kuning'}">${p === 100 ? 'Siap Dilaksanakan' : 'Perlu Dilengkapi'}</span>
      </div></div>`));
  }
  baris2.appendChild(tug.el);

  const kBerikut = mendatang[1] || mendatang[0];
  const siap = panelMW('Kesiapan Kajian', I.cekBulat, null, null);
  if (!kBerikut) siap.isi.appendChild(el(`<div class="kosong-erp" style="padding:26px">${I.kotak}<p>Tidak ada kajian mendatang</p></div>`));
  else {
    const p = kesiapan(kBerikut);
    siap.isi.appendChild(el(`<div class="kj-sub">Kajian: <b>${esc(kBerikut.judul)}</b>
      <span>${tgl(kBerikut.tanggal)} · ${esc(kBerikut.angkatan)} · ${esc(kBerikut.level)}</span></div>`));
    siap.isi.appendChild(el(`<div class="kj-donat-baris">
      ${donat(p)}
      <div class="kj-ceklis">${CEKLIS.map((c) => `<div class="br">
        <span class="ttl">${c.l}</span>${tandaLengkap(lengkapKah(kBerikut, c.k))}</div>`).join('')}</div>
    </div>`));
    const lengkapi = el(`<button class="btn btn-garis btn-kecil" style="width:calc(100% - 36px);margin:0 18px 14px">${I.sunting} Lengkapi Data Kajian</button>`);
    lengkapi.onclick = () => bukaModul('jadwal-kajian', () => formKajian(kBerikut));
    siap.isi.appendChild(lengkapi);
  }
  baris2.appendChild(siap.el);

  const akhir = panelMW('Kajian Terakhir', I.buku, 'Lihat Semua', () => bukaModul('rekap-kajian'));
  const tiga = [...selesai].reverse().slice(0, 3);
  if (!tiga.length) akhir.isi.appendChild(el(`<div class="kosong-erp" style="padding:26px">${I.kotak}<p>Belum ada kajian selesai</p></div>`));
  tiga.forEach((k) => {
    const r = rekapPresensi(k);
    akhir.isi.appendChild(el(`<div class="kj-akhir">
      <img src="${window.__ph('KAJIAN', '#1E4D2B', '#0E2E1C', 'درس')}" alt="">
      <div class="isi"><div class="jd">${esc(k.judul)}</div>
        <div class="mt">${tgl(k.tanggal)} · ${esc(k.angkatan)} · ${esc(k.level)}</div>
        <div class="mt">${I.grup} ${r.hadir + r.terlambat}/${r.total} &nbsp; ${I.jam} ${r.persen}%</div></div>
      <span class="lencana l-hijau">Selesai</span></div>`));
  });
  baris2.appendChild(akhir.el);
  box.appendChild(baris2);

  /* --- aksi cepat --- */
  const cepat = el(`<div class="mw-pusat" style="margin-top:18px">
    <div class="mw-pusat-kepala">${I.petir}<h3>Quick Actions</h3></div>
    <div class="mw-pusat-kisi"></div></div>`);
  [
    { ik: I.kalender,  l: 'Buat Jadwal Kajian', fn: () => formKajian(null) },
    { ik: I.grup,      l: 'Tambah Anggota',     fn: () => bukaModul('anggota-kajian') },
    { ik: I.daftarCek, l: 'Presensi Manual',    fn: () => (kHari ? dialogAbsensi(kHari) : bukaModul('presensi')) },
    { ik: I.qr,        l: 'Generate QR Code',   fn: () => bukaModul('kartu-qr') },
    { ik: I.papan,     l: 'Upload PPT',         fn: () => bukaModul('materi') },
    { ik: I.dok,       l: 'Laporan Presensi',   fn: () => bukaModul('presensi') },
    { ik: I.unduh,     l: 'Export Rekap',       fn: () => bukaModul('rekap-kajian') },
  ].forEach((x) => {
    const n = el(`<button class="mw-pusat-btn">${x.ik}<span>${esc(x.l)}</span></button>`);
    n.onclick = x.fn;
    cepat.querySelector('.mw-pusat-kisi').appendChild(n);
  });
  box.appendChild(cepat);
  return box;
}

const namaPendek = (id) => {
  const n = Store.namaUser(id);
  if (n === '—') return '—';
  return n.replace(/^Ust\.\s*/, '').split(' ').slice(0, 2).join(' ');
};
const tandaLengkap = (ok) => `<span class="tanda-cek ${ok ? 'ya' : 'tidak'}">${ok ? I.cek : I.tutup}</span>`;

/** Cincin kemajuan sebagai SVG — tanpa pustaka grafik. */
function donat(persen) {
  const r = 46, keliling = 2 * Math.PI * r;
  return `<svg class="kj-donat" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="#EEF2EE" stroke-width="11"/>
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="#4A7A1E" stroke-width="11" stroke-linecap="round"
      stroke-dasharray="${keliling}" stroke-dashoffset="${keliling * (1 - persen / 100)}"
      transform="rotate(-90 60 60)"/>
    <text x="60" y="56" text-anchor="middle" font-size="23" font-weight="800" fill="#1D2A21">${persen}%</text>
    <text x="60" y="74" text-anchor="middle" font-size="11" fill="#6B7A70">Persiapan</text>
  </svg>`;
}

function unduhQr(u) {
  const a = document.createElement('a');
  a.href = QR.svgDataUri(Store.kodeQr(u.id));
  a.download = `qr-${u.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
  document.body.appendChild(a); a.click(); a.remove();
  toast(`QR ${u.nama} diunduh.`);
}

/** Kotak tempel hasil pindai. Prototipe ini tidak bisa membaca QR lewat
    kamera — itu menuntut pustaka pemindai — tetapi QR-nya sungguhan, jadi
    aplikasi kamera ponsel dapat membacanya dan hasilnya ditempel di sini. */
function dialogScan(k) {
  const isi = el(`<div>
    <div class="notis notis-info" style="margin-bottom:16px">${I.info}<div>
      <b>Pindai dengan kamera ponsel, tempelkan hasilnya di sini</b>
      QR tiap anggota berisi kode seperti <code>AIJZ-u16</code>. Aplikasi kamera bawaan
      ponsel dapat membacanya; prototipe ini yang belum bisa memindai sendiri.
    </div></div>
    <div class="grup"><label>Kode Hasil Pindai</label>
      <input id="kode" placeholder="AIJZ-u16" autocomplete="off">
      <div class="bantu">Terlambat ditentukan dari jam sesungguhnya terhadap jam mulai kajian (${esc(k.jam)}).</div></div>
    <div class="daftar-presensi" data-log style="max-height:180px"></div>
  </div>`);
  const log = isi.querySelector('[data-log]');
  const masuk = isi.querySelector('#kode');

  const proses = () => {
    const kode = masuk.value.trim();
    if (!kode) return;
    try {
      const h = Store.presensiDariKode(U, k.id, kode);
      log.prepend(el(`<div class="presensi-baris">
        <img src="${h.user.foto}" alt=""><span class="nm">${esc(h.user.nama)}</span>
        <span class="jm">${esc(h.jam)}</span>
        <span class="lencana ${PRESENSI[h.status].c}">${PRESENSI[h.status].l}</span></div>`));
      toast(`${h.user.nama} tercatat ${PRESENSI[h.status].l.toLowerCase()}.`);
    } catch (e) { toast(e.message, true); }
    masuk.value = '';
    masuk.focus();
  };
  masuk.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); proses(); } };

  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Selesai</button>
    <button class="btn btn-lime" data-s>${I.cek} Catat</button></div>`);
  modal({ judul: 'Presensi Hasil Pindai', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = () => { tutupModal(); gambar(); };
  kaki.querySelector('[data-s]').onclick = proses;
  setTimeout(() => masuk.focus(), 60);
}

/* ---------------- halaman ---------------- */
HAL['jadwal-kajian'] = () => {
  const semua = kajianAktif();
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Jadwal Kajian</h3><span class="hitung">(${semua.length} Kajian · ${esc(angkatanAktif())} · ${esc(levelAktif())})</span>
    <div class="kanan"><button class="btn btn-kecil" data-tambah>${I.tambah} Buat Jadwal Kajian</button></div>
  </div></div>`);
  kartu.querySelector('[data-tambah]').onclick = () => formKajian(null);

  if (!semua.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada kajian</p>
      <small>Buat jadwal pertama untuk angkatan ini.</small></div>`));
    return kartu;
  }
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Pemakalah</th>
      <th>Moderator</th><th>Notulen</th><th class="kol-tengah">PPT</th><th class="kol-tengah">Revisi</th>
      <th>Tempat</th><th>Status</th><th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  semua.forEach((k, i) => {
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td class="utuh">${tgl(k.tanggal)}<br><span style="color:var(--e-abu);font-size:11.6px">${esc(k.jam)}</span></td>
      <td><b>${esc(k.judul)}</b></td>
      <td>${esc(namaPendek(k.pemakalahId))}</td>
      <td>${esc(namaPendek(k.moderatorId))}</td>
      <td>${esc(namaPendek(k.notulenId))}</td>
      <td class="kol-tengah">${tandaLengkap(k.ppt)}</td>
      <td class="kol-tengah">${tandaLengkap(k.revisi)}</td>
      <td class="utuh">${esc(k.tempat || '—')}</td>
      <td>${lencanaKajian(k)}</td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Sunting">${I.sunting}</button>
        <button class="ikon-aksi hapus" title="Hapus">${I.hapus}</button></div></td></tr>`);
    tr.querySelector('.sunting').onclick = () => formKajian(k);
    tr.querySelector('.hapus').onclick = () => konfirmasi('Hapus jadwal kajian',
      `"${k.judul}" beserta presensinya akan dihapus.`,
      () => aman(() => { Store.hapusKajian(U, k.id); toast('Jadwal dihapus.'); gambar(); }));
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  return kartu;
};
HAL['jadwal-kajian'].judul = () => ['Jadwal Kajian', 'Jadwal, pemakalah, dan kelengkapan tiap pertemuan.'];

HAL['anggota-kajian'] = () => {
  const anggota = Store.db.users.filter((u) => u.angkatan === angkatanAktif());
  const box = el(`<div><div class="notis notis-kuning">${I.perisai}<div>
    <b>Terbatas pada ${esc(angkatanAktif())}</b>
    Anda dapat mengubah jenjang, kelompok, dan keaktifan anggota angkatan ini.
    Menambah akun baru serta mengubah surel dan peran tetap wewenang Sekretaris dan Ketua.
  </div></div></div>`);

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Data Anggota</h3><span class="hitung">(${anggota.length} orang · ${new Set(anggota.map((u) => u.kelompok).filter(Boolean)).size} kelompok)</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-qr>${I.qr} Kartu QR</button></div>
  </div></div>`);
  kartu.querySelector('[data-qr]').onclick = () => bukaModul('kartu-qr');

  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama</th><th>Jenjang</th><th>Kelompok</th>
      <th>Kehadiran</th><th>Status</th><th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  const selesai = kajianAktif().filter((k) => (k.presensi || []).length);
  anggota.forEach((u, i) => {
    const ikut = selesai.filter((k) => k.presensi.some((p) => p.userId === u.id
      && p.status !== 'tidak-hadir')).length;
    const persen = selesai.length ? Math.round((ikut / selesai.length) * 100) : 0;
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td><div style="display:flex;align-items:center;gap:10px">
        <img src="${u.foto}" alt="" style="width:30px;height:30px;border-radius:50%;flex:none">
        <div><b>${esc(u.nama)}</b><br><span style="color:var(--e-abu);font-size:11.6px">${esc(Store.kodeQr(u.id))}</span></div>
      </div></td>
      <td class="utuh">${esc(u.level)}</td>
      <td class="utuh">${esc(u.kelompok || '—')}</td>
      <td><div style="display:flex;align-items:center;gap:9px">
        <div class="bar-maju" style="flex:1;min-width:70px"><span style="width:${persen}%"></span></div>
        <b style="font-size:12.2px">${persen}%</b></div></td>
      <td><span class="lencana ${u.status === 'aktif' ? 'l-hijau' : 'l-abu'}">${esc(u.status)}</span></td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Sunting">${I.sunting}</button></div></td></tr>`);
    tr.querySelector('.sunting').onclick = () => formAnggotaKajian(u);
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  box.appendChild(kartu);
  return box;
};
HAL['anggota-kajian'].judul = () => ['Data Anggota', 'Jenjang, kelompok, dan kehadiran anggota angkatan aktif.'];

function formAnggotaKajian(u) {
  const isi = el(`<div>
    <p style="margin:0 0 16px;font-size:13px;color:var(--e-abu)">
      <b>${esc(u.nama)}</b> · ${esc(u.email)} · ${esc(u.angkatan)}</p>
    <div class="grid-form-3">
      <div class="grup"><label>Jenjang</label><select id="lv">
        ${['Tatsqif', 'Level 1', 'Level 2', 'Level 3', 'Alumni', '-'].map((x) => `<option ${u.level === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="grup"><label>Kelompok</label><select id="kl">
        <option value="">—</option>
        ${['Kelompok 1', 'Kelompok 2', 'Kelompok 3', 'Kelompok 4'].map((x) => `<option ${u.kelompok === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="grup"><label>Status</label><select id="st">
        ${['aktif', 'nonaktif', 'alumni'].map((x) => `<option ${u.status === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    </div>
    <div class="bantu">Surel dan peran hanya dapat diubah Sekretaris dan Ketua.</div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: 'Ubah Data Anggota', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => aman(() => {
    Store.simpanAnggotaKajian(U, { id: u.id, level: isi.querySelector('#lv').value,
      kelompok: isi.querySelector('#kl').value, status: isi.querySelector('#st').value });
    tutupModal(); toast('Data anggota tersimpan.'); gambar();
  });
}

HAL['kartu-qr'] = () => {
  const anggota = anggotaAngkatan();
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>QR ini sungguhan dan dapat dipindai</b>
    Tiap kartu memuat kode anggota seperti <code>AIJZ-u16</code>, dibangkitkan tanpa pustaka luar.
    Cetak dan bagikan; petugas presensi memindainya dengan kamera ponsel lalu menempelkan hasilnya
    di halaman Presensi. QR sengaja hanya membawa id — bukan nama atau surel — supaya kartu yang
    tercecer tidak membocorkan apa pun.
  </div></div></div>`);
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Kartu QR Anggota</h3><span class="hitung">(${anggota.length} kartu · ${esc(angkatanAktif())})</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-cetak>${I.unduh} Cetak Semua</button></div>
  </div><div class="panel-isi"><div class="kj-kartu-kisi"></div></div></div>`);
  kartu.querySelector('[data-cetak]').onclick = () => window.print();
  const kisi = kartu.querySelector('.kj-kartu-kisi');
  anggota.forEach((u) => {
    const n = el(`<div class="kj-kartu-qr">
      <div class="nm">${esc(u.nama)}</div>
      <div class="mt">${esc(u.angkatan)} · ${esc(u.level)}<br>${esc(u.kelompok || '—')}</div>
      <img src="${QR.svgDataUri(Store.kodeQr(u.id))}" alt="QR ${esc(u.nama)}">
      <div class="kode">${esc(Store.kodeQr(u.id))}</div>
      <button class="btn btn-garis btn-kecil" data-unduh>${I.unduh} Unduh</button>
    </div>`);
    n.querySelector('[data-unduh]').onclick = () => unduhQr(u);
    kisi.appendChild(n);
  });
  box.appendChild(kartu);
  return box;
};
HAL['kartu-qr'].judul = () => ['Kartu QR Anggota', 'Kartu presensi yang dapat dicetak dan dipindai.'];

HAL.presensi = () => {
  const semua = kajianAktif();
  const box = el('<div></div>');
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Presensi Kajian</h3><span class="hitung">(${semua.length} pertemuan · ${esc(angkatanAktif())})</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-export>${I.unduh} Laporan Presensi</button></div>
  </div></div>`);
  kartu.querySelector('[data-export]').onclick = () => {
    const baris = [['Tanggal', 'Judul Kajian', 'Hadir', 'Terlambat', 'Tidak Hadir', 'Belum Absen', 'Persentase']];
    semua.forEach((k) => { const r = rekapPresensi(k);
      baris.push([k.tanggal, k.judul, r.hadir, r.terlambat, r.tidakHadir, r.belum, r.persen + '%']); });
    unduhCsv(`presensi-${angkatanAktif().replace(/\s/g, '-').toLowerCase()}.csv`, baris);
  };

  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Hadir</th>
      <th>Terlambat</th><th>Tidak Hadir</th><th>Belum Absen</th><th style="min-width:150px">Kehadiran</th>
      <th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  semua.forEach((k, i) => {
    const r = rekapPresensi(k);
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td class="utuh">${tgl(k.tanggal)}</td>
      <td>${esc(k.judul)}</td>
      <td class="utuh"><b style="color:#4A7A1E">${r.hadir}</b></td>
      <td class="utuh">${r.terlambat}</td><td class="utuh">${r.tidakHadir}</td><td class="utuh">${r.belum}</td>
      <td><div style="display:flex;align-items:center;gap:9px">
        <div class="bar-maju" style="flex:1"><span style="width:${r.persen}%"></span></div>
        <b style="font-size:12.2px">${r.persen}%</b></div></td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Isi presensi">${I.daftarCek}</button>
        <button class="ikon-aksi" data-scan title="Presensi hasil pindai">${I.qr}</button></div></td></tr>`);
    tr.querySelector('.sunting').onclick = () => dialogAbsensi(k);
    tr.querySelector('[data-scan]').onclick = () => dialogScan(k);
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  box.appendChild(kartu);
  return box;
};
HAL.presensi.judul = () => ['Presensi Kajian', 'Kehadiran tiap pertemuan beserta rekapnya.'];

HAL['tugas-kajian'] = () => {
  const semua = kajianAktif().filter((k) => k.tanggal >= nowTanggal());
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Pembagian Tugas</h3><span class="hitung">(${semua.length} kajian mendatang)</span></div></div>`);
  if (!semua.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Tidak ada kajian mendatang</p></div>`));
    return kartu;
  }
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Pemakalah</th>
      <th>Moderator</th><th>Notulen</th><th>Tempat</th><th style="min-width:140px">Kesiapan</th>
      <th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  semua.forEach((k, i) => {
    const p = kesiapan(k);
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td><td class="utuh">${tgl(k.tanggal)}</td>
      <td><b>${esc(k.judul)}</b></td>
      <td>${esc(namaPendek(k.pemakalahId))}</td><td>${esc(namaPendek(k.moderatorId))}</td>
      <td>${esc(namaPendek(k.notulenId))}</td><td class="utuh">${esc(k.tempat || '—')}</td>
      <td><div style="display:flex;align-items:center;gap:9px">
        <div class="bar-maju" style="flex:1"><span style="width:${p}%"></span></div>
        <b style="font-size:12.2px">${p}%</b></div></td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Atur tugas">${I.sunting}</button></div></td></tr>`);
    tr.querySelector('.sunting').onclick = () => formKajian(k);
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  return kartu;
};
HAL['tugas-kajian'].judul = () => ['Pembagian Tugas', 'Pemakalah, moderator, dan notulen tiap kajian mendatang.'];

HAL.materi = () => {
  const semua = kajianAktif();
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Materi & PPT</h3>
    <span class="hitung">(${semua.filter((k) => k.ppt).length} dari ${semua.length} kajian sudah berkas)</span></div></div>`);
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Materi / Rujukan</th>
      <th class="kol-tengah">PPT</th><th class="kol-tengah">Revisi</th><th class="kol-aksi">Aksi</th></tr></thead>
    <tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  semua.forEach((k, i) => {
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td><td class="utuh">${tgl(k.tanggal)}</td>
      <td><b>${esc(k.judul)}</b></td>
      <td>${esc(k.materi || '—')}</td>
      <td class="kol-tengah"><button class="cek-kotak ${k.ppt ? 'on' : ''}" data-ppt title="Tandai PPT">${I.cek}</button></td>
      <td class="kol-tengah"><button class="cek-kotak ${k.revisi ? 'on' : ''}" data-rev title="Tandai revisi">${I.cek}</button></td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Ubah materi">${I.sunting}</button></div></td></tr>`);
    tr.querySelector('[data-ppt]').onclick = () => aman(() => {
      Store.simpanKajian(U, { id: k.id, ppt: !k.ppt }); toast(k.ppt ? 'PPT ditandai belum ada.' : 'PPT ditandai sudah ada.'); gambar();
    });
    tr.querySelector('[data-rev]').onclick = () => aman(() => {
      Store.simpanKajian(U, { id: k.id, revisi: !k.revisi }); gambar();
    });
    tr.querySelector('.sunting').onclick = () => formKajian(k);
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  return kartu;
};
HAL.materi.judul = () => ['Materi & PPT', 'Rujukan bahan dan kelengkapan berkas tiap kajian.'];

HAL.notulen = () => {
  const semua = [...kajianAktif()].reverse();
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Revisi & Notulen</h3>
    <span class="hitung">(${semua.filter((k) => k.notulensi).length} dari ${semua.length} sudah bernotulen)</span></div></div>`);
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Notulen</th>
      <th>Ringkasan</th><th class="kol-tengah">Revisi</th><th class="kol-aksi">Aksi</th></tr></thead>
    <tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  semua.forEach((k, i) => {
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td><td class="utuh">${tgl(k.tanggal)}</td>
      <td><b>${esc(k.judul)}</b></td>
      <td>${esc(namaPendek(k.notulenId))}</td>
      <td>${k.notulensi ? esc(k.notulensi.slice(0, 90)) + (k.notulensi.length > 90 ? '…' : '')
        : '<span style="color:var(--e-abu)">belum ditulis</span>'}</td>
      <td class="kol-tengah">${tandaLengkap(k.revisi)}</td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Tulis notulen">${I.dok}</button></div></td></tr>`);
    tr.querySelector('.sunting').onclick = () => dialogNotulensi(k);
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  return kartu;
};
HAL.notulen.judul = () => ['Revisi & Notulen', 'Catatan hasil kajian dan status revisinya.'];

HAL['rekap-kajian'] = () => {
  const semua = kajianAktif();
  const selesai = semua.filter((k) => statusKajian(k) === 'selesai');
  const box = el('<div></div>');
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Rekap Kajian</h3><span class="hitung">(${selesai.length} pertemuan selesai)</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-export>${I.unduh} Export Rekap</button></div>
  </div></div>`);
  kartu.querySelector('[data-export]').onclick = () => {
    const baris = [['Tanggal', 'Judul', 'Pemakalah', 'Moderator', 'Notulen', 'Tempat', 'Hadir', 'Total', 'Persentase', 'Notulen Ditulis']];
    selesai.forEach((k) => { const r = rekapPresensi(k);
      baris.push([k.tanggal, k.judul, Store.namaUser(k.pemakalahId), Store.namaUser(k.moderatorId),
        Store.namaUser(k.notulenId), k.tempat, r.hadir + r.terlambat, r.total, r.persen + '%', k.notulensi ? 'ya' : 'belum']); });
    unduhCsv(`rekap-kajian-${angkatanAktif().replace(/\s/g, '-').toLowerCase()}.csv`, baris);
  };
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Pemakalah</th>
      <th>Tempat</th><th>Kehadiran</th><th class="kol-tengah">Notulen</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  selesai.forEach((k, i) => {
    const r = rekapPresensi(k);
    tb.appendChild(el(`<tr><td class="kol-no">${i + 1}</td><td class="utuh">${tgl(k.tanggal)}</td>
      <td><b>${esc(k.judul)}</b></td><td>${esc(namaPendek(k.pemakalahId))}</td>
      <td class="utuh">${esc(k.tempat || '—')}</td>
      <td class="utuh">${r.hadir + r.terlambat}/${r.total} · ${r.persen}%</td>
      <td class="kol-tengah">${tandaLengkap(!!k.notulensi)}</td></tr>`));
  });
  kartu.appendChild(t);
  box.appendChild(kartu);
  return box;
};
HAL['rekap-kajian'].judul = () => ['Rekap Kajian', 'Ringkasan pertemuan yang sudah terlaksana.'];

HAL.statistik = () => {
  const semua = kajianAktif();
  const selesai = semua.filter((k) => (k.presensi || []).length);
  const anggota = anggotaAngkatan();
  const box = el('<div></div>');

  const rata = selesai.length ? Math.round(selesai.reduce((a, k) => a + rekapPresensi(k).persen, 0) / selesai.length) : 0;
  box.appendChild(el(`<div class="grid-stat">
    ${[{ ik: I.kalender, n: semua.length, l: 'Total pertemuan', w:'rgba(140,198,63,.16)', wc:'#4A7A1E' },
       { ik: I.grup, n: anggota.length, l: 'Anggota aktif', w:'rgba(62,127,184,.14)', wc:'#2C6091' },
       { ik: I.bagan, n: rata + '%', l: 'Rata-rata kehadiran', w:'rgba(47,169,140,.14)', wc:'#1F7A64' },
       { ik: I.dok, n: semua.filter((k) => k.notulensi).length, l: 'Notulen tertulis', w:'rgba(240,149,30,.15)', wc:'#B87310' }]
      .map((s) => `<div class="stat" style="--w:${s.w};--wc:${s.wc}">
        <div class="stat-ik">${s.ik}</div><div class="stat-nilai">${esc(String(s.n))}</div>
        <div class="stat-label">${esc(s.l)}</div></div>`).join('')}
  </div>`));

  const kp = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Kehadiran per Pertemuan</h3><span class="hitung">${esc(angkatanAktif())} · ${esc(levelAktif())}</span></div>
    <div class="panel-isi" data-g></div></div>`);
  kp.querySelector('[data-g]').appendChild(
    grafikGaris(selesai.map((k) => ({ tgl: k.tanggal, n: rekapPresensi(k).persen })), 200));
  box.appendChild(kp);

  /* peringkat kehadiran anggota */
  const peringkat = anggota.map((u) => {
    const ikut = selesai.filter((k) => k.presensi.some((p) => p.userId === u.id && p.status !== 'tidak-hadir')).length;
    const telat = selesai.filter((k) => k.presensi.some((p) => p.userId === u.id && p.status === 'terlambat')).length;
    return { u, ikut, telat, persen: selesai.length ? Math.round((ikut / selesai.length) * 100) : 0 };
  }).sort((a, b) => b.persen - a.persen || a.telat - b.telat);

  const kr = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Kehadiran Anggota</h3><span class="hitung">${selesai.length} pertemuan tercatat</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-export>${I.unduh} Export Excel</button></div>
  </div></div>`);
  kr.querySelector('[data-export]').onclick = () => {
    const baris = [['No.', 'Nama', 'Kelompok', 'Hadir', 'Terlambat', 'Dari', 'Persentase']];
    peringkat.forEach((p, i) => baris.push([i + 1, p.u.nama, p.u.kelompok || '', p.ikut, p.telat, selesai.length, p.persen + '%']));
    unduhCsv('kehadiran-anggota.csv', baris);
  };
  kr.appendChild(el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama</th><th>Kelompok</th><th>Hadir</th><th>Terlambat</th>
      <th style="min-width:160px">Kehadiran</th></tr></thead>
    <tbody>${peringkat.map((p, i) => `<tr><td class="kol-no">${i + 1}</td>
      <td><div style="display:flex;align-items:center;gap:10px">
        <img src="${p.u.foto}" alt="" style="width:28px;height:28px;border-radius:50%;flex:none">
        <b>${esc(p.u.nama)}</b></div></td>
      <td class="utuh">${esc(p.u.kelompok || '—')}</td>
      <td class="utuh">${p.ikut}/${selesai.length}</td><td class="utuh">${p.telat}</td>
      <td><div style="display:flex;align-items:center;gap:9px">
        <div class="bar-maju" style="flex:1"><span style="width:${p.persen}%"></span></div>
        <b style="font-size:12.2px;min-width:36px;text-align:right">${p.persen}%</b></div></td></tr>`).join('')}</tbody>
  </table></div>`));
  box.appendChild(kr);
  return box;
};
HAL.statistik.judul = () => ['Statistik', 'Kehadiran per pertemuan dan peringkat keaktifan anggota.'];

HAL.notifikasi = () => {
  const daftar = notifikasiKajian();
  const box = el('<div></div>');
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Notifikasi</h3><span class="hitung">(${daftar.length} perlu perhatian · ${daftar.filter((n) => n.penting).length} mendesak)</span></div>
    <div class="mw-panel-isi" data-isi></div></div>`);
  const isi = kartu.querySelector('[data-isi]');
  if (!daftar.length) isi.appendChild(el(`<div class="kosong-erp">${I.cekBulat}<p>Semuanya rapi</p>
    <small>Tidak ada kajian yang datanya kurang atau presensinya tertinggal.</small></div>`));
  daftar.forEach((n) => {
    const b = el(`<button class="kj-notif ${n.penting ? 'penting' : ''}">
      <span class="ik">${n.ikon}</span>
      <span class="isi"><span class="jd">${esc(n.judul)}</span><span class="kt">${esc(n.ket)}</span></span>
      ${I.panahKanan}</button>`);
    b.onclick = () => bukaModul(n.rute);
    isi.appendChild(b);
  });
  box.appendChild(kartu);
  return box;
};
HAL.notifikasi.judul = () => ['Notifikasi', 'Kajian yang datanya belum lengkap atau presensinya tertinggal.'];

HAL['atur-kajian'] = () => {
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Angkatan & Level aktif</b>
    Pilihan di kanan atas menentukan lingkup seluruh halaman di ruang kerja ini —
    jadwal, anggota, presensi, hingga statistik.
  </div></div></div>`);
  const kartu = el(`<div class="kartu"><div class="kartu-kepala"><h3>Pengaturan Koordinator</h3></div>
    <div class="panel-isi">
      <div class="grid-form">
        <div class="grup"><label>Angkatan Aktif</label>
          <select id="ak">${angkatanTersedia().map((a) => `<option ${a === angkatanAktif() ? 'selected' : ''}>${esc(a)}</option>`).join('')}</select></div>
        <div class="grup"><label>Level Aktif</label>
          <select id="lv">${levelTersedia().map((l) => `<option ${l === levelAktif() ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
      </div>
      <button class="btn btn-lime" id="terap">${I.cek} Terapkan</button>
    </div></div>`);
  kartu.querySelector('#terap').onclick = () => {
    angkatanPilihan = kartu.querySelector('#ak').value;
    levelPilihan = kartu.querySelector('#lv').value;
    toast(`Lingkup diubah ke ${angkatanPilihan} · ${levelPilihan}.`);
    gambar();
  };
  box.appendChild(kartu);

  box.appendChild(el(`<div class="kartu" style="margin-top:20px"><div class="kartu-kepala">
    <h3>Ringkasan Angkatan</h3></div>
    <div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th>Angkatan</th><th>Level</th><th>Kajian</th><th>Anggota</th><th>Rata-rata Kehadiran</th></tr></thead>
      <tbody>${angkatanTersedia().flatMap((a) => levelTersedia().map((l) => {
        const ks = Store.db.kajian.filter((k) => k.angkatan === a && k.level === l);
        if (!ks.length) return '';
        const ang = Store.db.users.filter((u) => u.angkatan === a && u.status === 'aktif').length;
        const sel = ks.filter((k) => (k.presensi || []).length);
        const rata = sel.length ? Math.round(sel.reduce((s, k) => {
          const p = k.presensi.filter((x) => x.status !== 'tidak-hadir').length;
          return s + (ang ? (p / ang) * 100 : 0);
        }, 0) / sel.length) : 0;
        return `<tr><td><b>${esc(a)}</b></td><td class="utuh">${esc(l)}</td>
          <td class="utuh">${ks.length}</td><td class="utuh">${ang}</td><td class="utuh">${rata}%</td></tr>`;
      })).join('')}</tbody></table></div></div>`));
  return box;
};
HAL['atur-kajian'].judul = () => ['Pengaturan', 'Lingkup angkatan dan level ruang kerja ini.'];

/* ============================================================
   RUANG KERJA BENDAHARA
   ------------------------------------------------------------
   Rupiah dan pound Mesir dua kantong terpisah — bukan hasil
   konversi. Keduanya tidak pernah dijumlahkan; saldo, total, dan
   laporan selalu menyebut keduanya berdampingan. Satu transaksi
   boleh membawa keduanya, atau hanya salah satu.
   ============================================================ */
const rpFmt = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
const egpFmt = (n) => 'EGP ' + Number(n || 0).toLocaleString('id-ID');

const jumlahKas = (daftar, kunci) => daftar.reduce((s, t) => s + Number(t[kunci] || 0), 0);
const kasBulan = (b) => Store.db.keuangan.filter((t) => t.tanggal.startsWith(b));
const arusKas = (arus) => Store.db.keuangan.filter((t) => t.arus === arus)
  .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
const kasKeluar = () => Store.db.keuangan.filter((t) => t.jenis === 'keluar')
  .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

/** Saldo seluruh akun, dua mata uang berdampingan. */
function saldoTotal() {
  return Store.db.akunKas.reduce((s, a) => {
    const x = Store.saldoAkun(a.id);
    return { rp: s.rp + x.rp, egp: s.egp + x.egp };
  }, { rp: 0, egp: 0 });
}

const namaAkun = (id) => Store.db.akunKas.find((a) => a.id === id)?.nama || '—';
const kategoriUntuk = (jenis) => Store.db.kategoriKeuangan.filter((k) => k.jenis === jenis)
  .map((k) => ({ v: k.nama, l: k.nama }));
const pilihanAkun = () => Store.db.akunKas.map((a) => ({ v: a.id, l: a.nama }));

/* ---------------- dasbor ---------------- */
function dasborBendahara() {
  const box = el('<div></div>');
  const bulanIni = nowTanggal().slice(0, 7);
  const ini = kasBulan(bulanIni);
  const saldo = saldoTotal();
  const masukRp = jumlahKas(ini.filter((t) => t.jenis === 'masuk'), 'rp');
  const keluarRp = jumlahKas(ini.filter((t) => t.jenis === 'keluar'), 'rp');

  box.appendChild(el(`<div class="bd-stat-grid">
    ${[
      { ik: I.masukKas,  w:'rgba(140,198,63,.16)', wc:'#4A7A1E', l:'Saldo Keseluruhan (Rp)',  n: rpFmt(saldo.rp),   s:'Total saldo rupiah' },
      { ik: I.masukKas,  w:'rgba(240,149,30,.15)', wc:'#B87310', l:'Saldo Keseluruhan (EGP)', n: egpFmt(saldo.egp), s:'Total saldo pound' },
      { ik: I.naik,      w:'rgba(140,198,63,.16)', wc:'#4A7A1E', l:'Total Pemasukan',  n: rpFmt(masukRp),  s:'Bulan ini' },
      { ik: I.turun,     w:'rgba(217,83,111,.14)', wc:'#B23E5F', l:'Total Pengeluaran',n: rpFmt(keluarRp), s:'Bulan ini' },
    ].map((x) => `<div class="bd-stat">
      <span class="bd-stat-ik" style="--w:${x.w};--wc:${x.wc}">${x.ik}</span>
      <div><div class="bd-stat-l">${esc(x.l)}</div><div class="bd-stat-n">${esc(x.n)}</div>
        <div class="bd-stat-s">${esc(x.s)}</div></div></div>`).join('')}
  </div>`));

  /* --- dua tabel pemasukan --- */
  const baris1 = el('<div class="bd-baris"></div>');
  baris1.appendChild(panelKas('Pemasukan Internal', I.grup, 'Tambah Pemasukan',
    () => bukaModul('masuk-internal', () => formOrg('masuk-internal', null)),
    ini.filter((t) => t.arus === 'internal'), 'Sumber', 'hijau', 'masuk-internal'));
  baris1.appendChild(panelKas('Pemasukan Eksternal', I.hadiah, 'Tambah Pemasukan',
    () => bukaModul('masuk-eksternal', () => formOrg('masuk-eksternal', null)),
    ini.filter((t) => t.arus === 'eksternal'), 'Sumber', 'hijau', 'masuk-eksternal'));
  box.appendChild(baris1);

  /* --- pengeluaran + laporan --- */
  const baris2 = el('<div class="bd-baris"></div>');
  baris2.appendChild(panelKas('Pengeluaran', I.keluarKas, 'Tambah Pengeluaran',
    () => bukaModul('pengeluaran', () => formOrg('pengeluaran', null)),
    ini.filter((t) => t.jenis === 'keluar'), 'Jenis Pengeluaran', 'merah', 'pengeluaran'));

  const lap = panelMW('Laporan Keuangan', I.dok, 'Lihat Semua Laporan', () => bukaModul('laporan-kas'));
  LAPORAN_KAS.forEach((r) => {
    const n = el(`<div class="bd-laporan">
      <span class="ik" style="--w:${r.w};--wc:${r.wc}">${r.ik}</span>
      <div class="isi"><div class="jd">${esc(r.judul)}</div><div class="kt">${esc(r.ket)}</div></div>
      <span class="pd">${esc(r.periode())}</span>
      <button class="btn btn-garis btn-kecil">${r.kustom ? `Buat Laporan ${I.panahKanan}` : `${I.unduh} Unduh`}</button>
    </div>`);
    n.querySelector('button').onclick = () => (r.kustom ? dialogLaporanKustom() : unduhLaporan(r.rentang()));
    lap.isi.appendChild(n);
  });
  baris2.appendChild(lap.el);
  box.appendChild(baris2);
  return box;
}

/** Panel tabel kas dengan baris total berwarna di kakinya. */
function panelKas(judul, ikon, aksi, onAksi, data, labelSumber, warna, rute) {
  const p = panelMW(judul, ikon, null, null);
  const tombol = el(`<button class="btn btn-kecil" style="margin-left:auto">${I.tambah} ${esc(aksi)}</button>`);
  tombol.onclick = onAksi;
  p.el.querySelector('.mw-panel-kepala').appendChild(tombol);

  if (!data.length) {
    p.isi.appendChild(el(`<div class="kosong-erp" style="padding:26px">${I.kotak}<p>Belum ada catatan bulan ini</p></div>`));
    return p.el;
  }
  const t = el(`<div class="tabel-bungkus"><table class="t-org t-rapat">
    <thead><tr><th class="kol-no">No.</th><th>${esc(labelSumber)}</th><th>Rp</th><th>EGP</th>
      <th>Keterangan</th><th>Tanggal</th><th class="kol-aksi"></th></tr></thead>
    <tbody>${data.slice(0, 5).map((x, i) => `<tr>
      <td class="kol-no">${i + 1}</td>
      <td>${esc(x.sumber || x.kategori)}</td>
      <td class="utuh">${rpFmt(x.rp)}</td>
      <td class="utuh">${egpFmt(x.egp)}</td>
      <td>${esc(x.ket || '—')}</td>
      <td class="utuh">${tgl(x.tanggal)}</td>
      <td class="kol-aksi"><button class="ikon-aksi sunting" data-id="${x.id}" title="Sunting">${I.sunting}</button></td>
    </tr>`).join('')}
    <tr class="bd-total ${warna}"><td></td><td>Total</td>
      <td class="utuh">${rpFmt(jumlahKas(data, 'rp'))}</td>
      <td class="utuh">${egpFmt(jumlahKas(data, 'egp'))}</td>
      <td colspan="3"></td></tr></tbody></table></div>`);
  /* Dasbor tetap etalase: menyunting membuka halaman modulnya. */
  t.querySelectorAll('.sunting').forEach((b) => {
    b.onclick = () => bukaModul(rute, () => {
      const item = Store.db.keuangan.find((x) => x.id === b.dataset.id);
      if (item) formOrg(rute, item);
    });
  });
  p.isi.appendChild(t);
  return p.el;
}

/* ---------------- modul transaksi ---------------- */
const modulKas = (nama, spec) => ({
  ruang: 'bendahara', izin: 'keuangan.manage', koleksi: 'keuangan',
  /* Lewat Store.simpanTransaksi, bukan penyimpan generik: di sanalah
     nominal diperiksa agar satu transaksi tidak tercatat nol-nol. */
  simpan: (d) => Store.simpanTransaksi(U, d),
  hapus: (x) => Store.hapusTransaksi(U, x.id),
  pratinjau: { awal: 3, akhir: 1 },
  cari: (x) => `${x.sumber} ${x.kategori} ${x.ket}`,
  tajuk: (x) => x.sumber || x.kategori,
  ...spec,
});

const kolomNominal = [
  { l: 'Rp', kelas: 'utuh', isi: (x) => rpFmt(x.rp) },
  { l: 'EGP', kelas: 'utuh', isi: (x) => egpFmt(x.egp) },
  { l: 'Akun', isi: (x) => `<span class="lencana l-abu">${esc(namaAkun(x.akunId))}</span>` },
  { l: 'Keterangan', isi: (x) => esc(x.ket || '—') },
  { l: 'Tanggal', kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
];
const medanNominal = [
  { k: 'rp', l: 'Nominal Rupiah (Rp)', jenis: 'angka', ph: '0' },
  { k: 'egp', l: 'Nominal Pound (EGP)', jenis: 'angka', ph: '0',
    bantu: 'Rupiah dan pound dicatat terpisah — isi salah satu atau keduanya, sesuai uang yang benar-benar diterima.' },
  { k: 'akunId', l: 'Disimpan di', jenis: 'pilih', pilihan: pilihanAkun },
  { k: 'tanggal', l: 'Tanggal', jenis: 'tanggal', wajib: true },
  { k: 'ket', l: 'Keterangan', ph: 'Iuran anggota' },
];

Object.assign(MODUL, {
  'masuk-internal': modulKas('masuk-internal', {
    judul: 'Pemasukan Internal', satuan: 'Pemasukan',
    sub: 'Iuran dan sumbangan dari dalam organisasi.',
    sumber: () => arusKas('internal'),
    bawaanBaru: () => ({ jenis: 'masuk', arus: 'internal' }),
    kolom: [{ l: 'Sumber', isi: (x) => `<b>${esc(x.sumber)}</b>` }, ...kolomNominal],
    form: [
      { k: 'sumber', l: 'Sumber', wajib: true, ph: 'Angkatan X' },
      { k: 'kategori', l: 'Kategori', jenis: 'pilih', bawaan: 'Iuran Anggota', pilihan: () => kategoriUntuk('masuk') },
      ...medanNominal,
    ],
  }),
  'masuk-eksternal': modulKas('masuk-eksternal', {
    judul: 'Pemasukan Eksternal', satuan: 'Pemasukan',
    sub: 'Infaq, donasi, dan pemasukan dari luar organisasi.',
    sumber: () => arusKas('eksternal'),
    bawaanBaru: () => ({ jenis: 'masuk', arus: 'eksternal' }),
    kolom: [{ l: 'Sumber', isi: (x) => `<b>${esc(x.sumber)}</b>` }, ...kolomNominal],
    form: [
      { k: 'sumber', l: 'Nama Donatur / Sumber', wajib: true, ph: 'Bu Amel' },
      { k: 'kategori', l: 'Kategori', jenis: 'pilih', bawaan: 'Infaq/Donasi', pilihan: () => kategoriUntuk('masuk') },
      ...medanNominal,
    ],
  }),
  pengeluaran: modulKas('pengeluaran', {
    judul: 'Pengeluaran', satuan: 'Pengeluaran',
    sub: 'Seluruh uang keluar beserta akun sumbernya.',
    sumber: kasKeluar,
    bawaanBaru: () => ({ jenis: 'keluar', arus: null }),
    kolom: [{ l: 'Jenis Pengeluaran', isi: (x) => `<b>${esc(x.sumber || x.kategori)}</b>` }, ...kolomNominal],
    form: [
      { k: 'sumber', l: 'Jenis Pengeluaran', wajib: true, ph: 'Sewa Sekretariat' },
      { k: 'kategori', l: 'Kategori', jenis: 'pilih', bawaan: 'Sewa Sekretariat', pilihan: () => kategoriUntuk('keluar') },
      ...medanNominal,
    ],
  }),
  'akun-kas': {
    ruang: 'bendahara', izin: 'keuangan.akun', koleksi: 'akunKas',
    judul: 'Akun & Tempat Uang', satuan: 'Akun',
    sub: 'Tempat uang organisasi disimpan.',
    cari: (x) => `${x.nama} ${x.jenis}`, tajuk: (x) => x.nama,
    pratinjau: { awal: 3, akhir: 1 },
    kolom: [
      { l: 'Nama Akun', isi: (x) => `<b>${esc(x.nama)}</b><br><span style="color:var(--e-abu);font-size:11.6px">${esc(x.ket || '')}</span>` },
      { l: 'Jenis', isi: (x) => `<span class="lencana l-abu">${esc(x.jenis)}</span>` },
      { l: 'Saldo Rp', kelas: 'utuh', isi: (x) => `<b>${rpFmt(Store.saldoAkun(x.id).rp)}</b>` },
      { l: 'Saldo EGP', kelas: 'utuh', isi: (x) => `<b>${egpFmt(Store.saldoAkun(x.id).egp)}</b>` },
    ],
    form: [
      { k: 'nama', l: 'Nama Akun', wajib: true, ph: 'Kas Tunai Sekretariat' },
      { k: 'jenis', l: 'Jenis', jenis: 'pilih', bawaan: 'tunai',
        pilihan: [{ v: 'tunai', l: 'Kas tunai' }, { v: 'bank', l: 'Rekening bank' }, { v: 'lainnya', l: 'Lainnya' }] },
      { k: 'saldoAwalRp', l: 'Saldo Awal (Rp)', jenis: 'angka', ph: '0' },
      { k: 'saldoAwalEgp', l: 'Saldo Awal (EGP)', jenis: 'angka', ph: '0',
        bantu: 'Satu akun memegang kedua mata uang, sehingga satu setoran berisi rupiah dan pound tak perlu dipecah.' },
      { k: 'ket', l: 'Keterangan', ph: 'Uang tunai yang dipegang di sekretariat.' },
    ],
  },
  'kategori-kas': {
    ruang: 'bendahara', izin: 'keuangan.akun', koleksi: 'kategoriKeuangan',
    judul: 'Kategori Transaksi', satuan: 'Kategori',
    sub: 'Penggolongan pemasukan dan pengeluaran.',
    cari: (x) => x.nama, tajuk: (x) => x.nama,
    pratinjau: { awal: 3, akhir: 1 },
    kolom: [
      { l: 'Nama Kategori', isi: (x) => `<b>${esc(x.nama)}</b>` },
      { l: 'Jenis', isi: (x) => `<span class="lencana ${x.jenis === 'masuk' ? 'l-hijau' : 'l-merah'}">${x.jenis === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}</span>` },
      { l: 'Dipakai', kelas: 'utuh', isi: (x) => Store.db.keuangan.filter((t) => t.kategori === x.nama).length + ' transaksi' },
    ],
    form: [
      { k: 'nama', l: 'Nama Kategori', wajib: true, ph: 'Konsumsi Kajian' },
      { k: 'jenis', l: 'Jenis', jenis: 'pilih', bawaan: 'keluar',
        pilihan: [{ v: 'masuk', l: 'Pemasukan' }, { v: 'keluar', l: 'Pengeluaran' }] },
    ],
  },
});

['masuk-internal', 'masuk-eksternal', 'pengeluaran'].forEach((nama) => {
  HAL[nama] = () => halamanOrg(nama);
  HAL[nama].judul = () => [MODUL[nama].judul, MODUL[nama].sub];
});

/* ---------------- saldo keseluruhan ---------------- */
HAL.saldo = () => {
  const box = el('<div></div>');
  const s = saldoTotal();
  const semua = Store.db.keuangan;

  box.appendChild(el(`<div class="bd-saldo-besar">
    <div class="sisi"><div class="l">Saldo Rupiah</div><div class="n">${rpFmt(s.rp)}</div>
      <div class="rinci"><span>Masuk ${rpFmt(jumlahKas(semua.filter((t) => t.jenis === 'masuk'), 'rp'))}</span>
        <span>Keluar ${rpFmt(jumlahKas(semua.filter((t) => t.jenis === 'keluar'), 'rp'))}</span></div></div>
    <div class="sisi egp"><div class="l">Saldo Pound Mesir</div><div class="n">${egpFmt(s.egp)}</div>
      <div class="rinci"><span>Masuk ${egpFmt(jumlahKas(semua.filter((t) => t.jenis === 'masuk'), 'egp'))}</span>
        <span>Keluar ${egpFmt(jumlahKas(semua.filter((t) => t.jenis === 'keluar'), 'egp'))}</span></div></div>
  </div>`));

  box.appendChild(el(`<div class="notis notis-info">${I.info}<div>
    <b>Dua saldo, bukan satu</b>
    Rupiah dan pound tidak pernah dijumlahkan. Keduanya benar-benar dipegang terpisah,
    dan menjumlahkannya hanya akan menghasilkan angka yang tidak berarti apa pun.
  </div></div>`));

  const kartu = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Saldo per Akun</h3><span class="hitung">(${Store.db.akunKas.length} tempat penyimpanan)</span></div></div>`);
  kartu.appendChild(el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama Akun</th><th>Jenis</th><th>Saldo Awal</th>
      <th>Saldo Rp</th><th>Saldo EGP</th></tr></thead>
    <tbody>${Store.db.akunKas.map((a, i) => { const x = Store.saldoAkun(a.id);
      return `<tr><td class="kol-no">${i + 1}</td>
        <td><b>${esc(a.nama)}</b><br><span style="color:var(--e-abu);font-size:11.6px">${esc(a.ket || '')}</span></td>
        <td><span class="lencana l-abu">${esc(a.jenis)}</span></td>
        <td class="utuh">${rpFmt(a.saldoAwalRp)}${a.saldoAwalEgp ? ' · ' + egpFmt(a.saldoAwalEgp) : ''}</td>
        <td class="utuh"><b style="color:${x.rp < 0 ? '#B23E37' : '#4A7A1E'}">${rpFmt(x.rp)}</b></td>
        <td class="utuh"><b style="color:${x.egp < 0 ? '#B23E37' : '#B87310'}">${egpFmt(x.egp)}</b></td></tr>`;
    }).join('')}
    <tr class="bd-total hijau"><td></td><td>Total</td><td colspan="2"></td>
      <td class="utuh">${rpFmt(s.rp)}</td><td class="utuh">${egpFmt(s.egp)}</td></tr></tbody>
  </table></div>`));
  box.appendChild(kartu);

  /* arus kas per bulan */
  const bulanAda = [...new Set(semua.map((t) => t.tanggal.slice(0, 7)))].sort().reverse();
  const kb = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Arus Kas per Bulan</h3><span class="hitung">${bulanAda.length} bulan tercatat</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-export>${I.unduh} Export Excel</button></div>
  </div></div>`);
  kb.querySelector('[data-export]').onclick = () => {
    const b = [['Bulan', 'Masuk Rp', 'Keluar Rp', 'Selisih Rp', 'Masuk EGP', 'Keluar EGP', 'Selisih EGP']];
    bulanAda.forEach((bl) => { const d = kasBulan(bl);
      const mr = jumlahKas(d.filter((t) => t.jenis === 'masuk'), 'rp'), kr = jumlahKas(d.filter((t) => t.jenis === 'keluar'), 'rp');
      const me = jumlahKas(d.filter((t) => t.jenis === 'masuk'), 'egp'), ke = jumlahKas(d.filter((t) => t.jenis === 'keluar'), 'egp');
      b.push([namaBulan(bl), mr, kr, mr - kr, me, ke, me - ke]); });
    unduhCsv('arus-kas-bulanan.csv', b);
  };
  kb.appendChild(el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Bulan</th><th>Masuk (Rp)</th><th>Keluar (Rp)</th><th>Selisih (Rp)</th>
      <th>Masuk (EGP)</th><th>Keluar (EGP)</th></tr></thead>
    <tbody>${bulanAda.map((bl, i) => { const d = kasBulan(bl);
      const mr = jumlahKas(d.filter((t) => t.jenis === 'masuk'), 'rp'), kr = jumlahKas(d.filter((t) => t.jenis === 'keluar'), 'rp');
      return `<tr><td class="kol-no">${i + 1}</td><td class="utuh"><b>${esc(namaBulan(bl))}</b></td>
        <td class="utuh" style="color:#4A7A1E">${rpFmt(mr)}</td>
        <td class="utuh" style="color:#B23E37">${rpFmt(kr)}</td>
        <td class="utuh"><b>${rpFmt(mr - kr)}</b></td>
        <td class="utuh">${egpFmt(jumlahKas(d.filter((t) => t.jenis === 'masuk'), 'egp'))}</td>
        <td class="utuh">${egpFmt(jumlahKas(d.filter((t) => t.jenis === 'keluar'), 'egp'))}</td></tr>`;
    }).join('')}</tbody></table></div>`));
  box.appendChild(kb);
  return box;
};
HAL.saldo.judul = () => ['Saldo Keseluruhan', 'Saldo tiap tempat penyimpanan dan arus kas bulanan.'];

/* ---------------- laporan ---------------- */
const awalBulan = (mundur = 0) => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - mundur, 1).toISOString().slice(0, 10);
};
const LAPORAN_KAS = [
  { judul: 'Laporan Bulanan', ket: 'Rekap pemasukan dan pengeluaran bulanan.', ik: I.dok,
    w: 'rgba(140,198,63,.16)', wc: '#4A7A1E',
    periode: () => namaBulan(nowTanggal().slice(0, 7)),
    rentang: () => ({ dari: awalBulan(0), sampai: nowTanggal(), nama: 'bulanan' }) },
  { judul: 'Laporan Triwulan', ket: 'Rekap keuangan per tiga bulan.', ik: I.bagan,
    w: 'rgba(62,127,184,.14)', wc: '#2C6091',
    periode: () => 'Q' + (Math.floor(new Date().getMonth() / 3) + 1) + ' ' + new Date().getFullYear(),
    rentang: () => ({ dari: awalBulan(2), sampai: nowTanggal(), nama: 'triwulan' }) },
  { judul: 'Laporan Tahunan', ket: 'Rekap keuangan tahunan.', ik: I.piala,
    w: 'rgba(124,92,214,.14)', wc: '#5F45AE',
    periode: () => 'Tahun ' + new Date().getFullYear(),
    rentang: () => ({ dari: new Date().getFullYear() + '-01-01', sampai: nowTanggal(), nama: 'tahunan' }) },
  { judul: 'Laporan Kustom', ket: 'Buat laporan sesuai kebutuhan.', ik: I.sunting,
    w: 'rgba(240,149,30,.15)', wc: '#B87310', kustom: true, periode: () => '' },
];

function barisLaporan({ dari, sampai }) {
  return Store.db.keuangan.filter((t) => t.tanggal >= dari && t.tanggal <= sampai)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
}

function unduhLaporan({ dari, sampai, nama }) {
  const data = barisLaporan({ dari, sampai });
  if (!data.length) return toast('Tidak ada transaksi pada periode itu.', true);
  const b = [['Laporan Keuangan Kajian ' + Store.cms.situs.nama],
    [`Periode ${tgl(dari)} s.d. ${tgl(sampai)}`], [],
    ['Tanggal', 'Jenis', 'Arus', 'Sumber', 'Kategori', 'Akun', 'Rp', 'EGP', 'Keterangan']];
  data.forEach((t) => b.push([t.tanggal, t.jenis, t.arus || '-', t.sumber || '', t.kategori,
    namaAkun(t.akunId), t.rp, t.egp, t.ket || '']));
  const mr = jumlahKas(data.filter((t) => t.jenis === 'masuk'), 'rp');
  const kr = jumlahKas(data.filter((t) => t.jenis === 'keluar'), 'rp');
  const me = jumlahKas(data.filter((t) => t.jenis === 'masuk'), 'egp');
  const ke = jumlahKas(data.filter((t) => t.jenis === 'keluar'), 'egp');
  b.push([], ['', '', '', '', '', 'Total Pemasukan', mr, me],
    ['', '', '', '', '', 'Total Pengeluaran', kr, ke],
    ['', '', '', '', '', 'Selisih', mr - kr, me - ke]);
  unduhCsv(`laporan-keuangan-${nama}-${dari}.csv`, b);
}

function dialogLaporanKustom() {
  const isi = el(`<div>
    <p style="margin:0 0 16px;font-size:13.2px;color:var(--e-abu)">
      Pilih rentang tanggal; laporannya memuat seluruh transaksi beserta total kedua mata uang.</p>
    <div class="grid-form">
      <div class="grup"><label>Dari Tanggal</label><input type="date" id="d1" value="${awalBulan(2)}"></div>
      <div class="grup"><label>Sampai Tanggal</label><input type="date" id="d2" value="${nowTanggal()}"></div>
    </div>
    <div data-pratinjau></div>
  </div>`);
  const pratinjau = () => {
    const dari = isi.querySelector('#d1').value, sampai = isi.querySelector('#d2').value;
    const d = barisLaporan({ dari, sampai });
    isi.querySelector('[data-pratinjau]').replaceChildren(el(`<div class="notis ${d.length ? 'notis-hijau' : 'notis-kuning'}" style="margin:0">
      ${d.length ? I.cekBulat : I.peringatan}<div><b>${d.length} transaksi pada rentang ini</b>
      Masuk ${rpFmt(jumlahKas(d.filter((t) => t.jenis === 'masuk'), 'rp'))} ·
      Keluar ${rpFmt(jumlahKas(d.filter((t) => t.jenis === 'keluar'), 'rp'))}</div></div>`));
  };
  isi.querySelector('#d1').onchange = pratinjau;
  isi.querySelector('#d2').onchange = pratinjau;
  pratinjau();

  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>${I.unduh} Unduh Laporan</button></div>`);
  modal({ judul: 'Buat Laporan Kustom', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const dari = isi.querySelector('#d1').value, sampai = isi.querySelector('#d2').value;
    if (dari > sampai) return toast('Tanggal awal melewati tanggal akhir.', true);
    unduhLaporan({ dari, sampai, nama: 'kustom' });
    tutupModal();
  };
}

HAL['laporan-kas'] = () => {
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Laporan diunduh sebagai berkas CSV</b>
    Terbuka langsung di Excel dengan dobel-klik. Tiap laporan memuat rincian transaksi
    beserta total pemasukan, pengeluaran, dan selisihnya — dalam rupiah dan pound berdampingan.
  </div></div></div>`);
  const kartu = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Laporan Keuangan</h3><span class="hitung">(${Store.db.keuangan.length} transaksi tercatat)</span></div>
    <div class="mw-panel-isi" data-isi></div></div>`);
  const isi = kartu.querySelector('[data-isi]');
  LAPORAN_KAS.forEach((r) => {
    const n = el(`<div class="bd-laporan">
      <span class="ik" style="--w:${r.w};--wc:${r.wc}">${r.ik}</span>
      <div class="isi"><div class="jd">${esc(r.judul)}</div><div class="kt">${esc(r.ket)}</div></div>
      <span class="pd">${esc(r.periode())}</span>
      <button class="btn btn-garis btn-kecil">${r.kustom ? `Buat Laporan ${I.panahKanan}` : `${I.unduh} Unduh`}</button>
    </div>`);
    n.querySelector('button').onclick = () => (r.kustom ? dialogLaporanKustom() : unduhLaporan(r.rentang()));
    isi.appendChild(n);
  });
  box.appendChild(kartu);

  /* buku besar */
  const semua = [...Store.db.keuangan].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const bb = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Buku Besar</h3><span class="hitung">seluruh transaksi</span>
    <div class="kanan"><input class="cari-org" placeholder="Cari sumber atau kategori…" data-cari></div>
  </div><div data-wadah></div></div>`);
  const wadah = bb.querySelector('[data-wadah]');
  const cari = bb.querySelector('[data-cari]');
  const isiUlang = () => {
    const q = cari.value.trim().toLowerCase();
    const data = semua.filter((t) => !q || `${t.sumber} ${t.kategori} ${t.ket}`.toLowerCase().includes(q));
    if (!data.length) { wadah.replaceChildren(el(`<div class="kosong-erp">${I.kotak}<p>Tidak ada transaksi yang cocok</p></div>`)); return; }
    wadah.replaceChildren(el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Sumber / Jenis</th><th>Kategori</th>
        <th>Akun</th><th>Masuk</th><th>Keluar</th></tr></thead>
      <tbody>${data.map((t, i) => `<tr>
        <td class="kol-no">${i + 1}</td><td class="utuh">${tgl(t.tanggal)}</td>
        <td><b>${esc(t.sumber || t.kategori)}</b>${t.arus ? `<br><span class="lencana l-abu">${t.arus}</span>` : ''}</td>
        <td class="utuh">${esc(t.kategori)}</td>
        <td class="utuh"><span class="lencana l-abu">${esc(namaAkun(t.akunId))}</span></td>
        <td class="utuh" style="color:#4A7A1E">${t.jenis === 'masuk' ? Store.nominalGabung(t) : '—'}</td>
        <td class="utuh" style="color:#B23E37">${t.jenis === 'keluar' ? Store.nominalGabung(t) : '—'}</td>
      </tr>`).join('')}</tbody></table></div>`));
  };
  cari.oninput = isiUlang;
  isiUlang();
  box.appendChild(bb);
  return box;
};
HAL['laporan-kas'].judul = () => ['Laporan Keuangan', 'Unduh rekap berkala dan telusuri buku besar.'];

HAL['kategori-akun'] = () => {
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Akun adalah tempat uang disimpan, bukan akun pengguna</b>
    Satu akun memegang rupiah dan pound sekaligus, sehingga satu setoran berisi keduanya
    tidak perlu dipecah menjadi dua catatan. Saldonya dapat dicocokkan dengan uang yang nyata.
  </div></div></div>`);
  box.appendChild(halamanOrg('akun-kas'));
  box.appendChild(el('<div style="height:20px"></div>'));
  box.appendChild(halamanOrg('kategori-kas'));
  return box;
};
HAL['kategori-akun'].judul = () => ['Kategori & Akun', 'Penggolongan transaksi dan tempat penyimpanan uang.'];

/* ============================================================
   LAPORAN & RINGKASAN
   ============================================================ */
HAL.laporan = () => {
  const d = Store.db;
  const keg = d.kaleidoskop;
  const hitung = (s) => keg.filter((k) => k.status === s).length;
  const rampung = hitung('selesai');
  const persen = keg.length ? Math.round((rampung / keg.length) * 100) : 0;

  const box = el('<div></div>');

  box.appendChild(el(`<div class="grid-stat">
    ${[
      { ik: I.grup,    n: d.pengurus.length,    l: 'Pengurus aktif',            w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' },
      { ik: I.orang,   n: d.koordinator.length, l: 'Koordinator angkatan',      w: 'rgba(62,127,184,.14)', wc: '#2C6091' },
      { ik: I.agenda,  n: `${rampung}/${keg.length}`, l: 'Program kerja terlaksana', w: 'rgba(240,149,30,.14)', wc: '#B87310' },
      { ik: I.piala,   n: d.pencapaian.length,  l: 'Pencapaian tercatat',       w: 'rgba(199,122,43,.14)', wc: '#96591C' },
      { ik: I.obrolan, n: d.evaluasi.length,    l: 'Catatan evaluasi',          w: 'rgba(47,169,140,.14)', wc: '#1F7A64' },
    ].map((s) => `<div class="stat" style="--w:${s.w};--wc:${s.wc}">
      <div class="stat-ik">${s.ik}</div>
      <div class="stat-nilai">${s.n}</div>
      <div class="stat-label">${esc(s.l)}</div></div>`).join('')}
  </div>`));

  box.appendChild(el(`<div class="panel">
    <div class="panel-kepala"><h3>Kemajuan Program Kerja</h3>
      <span class="ket">${persen}% dari ${keg.length} kegiatan sudah terlaksana</span>
      <div class="kanan"><button class="btn btn-garis btn-kecil" data-cetak>${I.unduh} Cetak Laporan</button></div>
    </div>
    <div class="panel-isi">
      <div class="bar-maju" style="margin-bottom:16px"><span style="width:${persen}%"></span></div>
      <div style="display:flex;gap:26px;flex-wrap:wrap">
        ${Object.entries(STATUS_KEG).map(([k, s]) => `<div>
          <div style="font-size:22px;font-weight:800;line-height:1.2">${hitung(k)}</div>
          <span class="lencana ${s.c}">${s.l}</span></div>`).join('')}
      </div>
    </div></div>`));
  box.querySelector('[data-cetak]').onclick = () => window.print();

  const sisa = keg.filter((k) => k.status !== 'selesai');
  if (sisa.length) {
    box.appendChild(el(`<div class="panel">
      <div class="panel-kepala"><h3>Program Belum Rampung</h3>
        <span class="ket">${sisa.length} kegiatan menuntut perhatian</span></div>
      <div class="tabel-bungkus"><table>
        <thead><tr><th>Kegiatan / Program</th><th>Waktu</th><th>Status</th></tr></thead>
        <tbody>${sisa.map((k) => `<tr><td>${esc(k.kegiatan)}</td><td>${esc(k.waktu)}</td>
          <td><span class="lencana ${STATUS_KEG[k.status]?.c || 'l-abu'}">${esc(STATUS_KEG[k.status]?.l || k.status)}</span></td>
        </tr>`).join('')}</tbody></table></div></div>`));
  }

  box.appendChild(el(`<div class="panel">
    <div class="panel-kepala"><h3>Evaluasi & Tindak Lanjut</h3>
      <span class="ket">${d.evaluasi.length} catatan terkumpul</span></div>
    <div class="tabel-bungkus"><table>
      <thead><tr><th>Evaluasi</th><th>Masukan / Solusi</th><th>Tanggal</th></tr></thead>
      <tbody>${d.evaluasi.map((e) => `<tr><td>${esc(e.evaluasi)}</td><td>${esc(e.masukan)}</td><td>${tgl(e.tanggal)}</td></tr>`).join('')
        || `<tr><td colspan="3" style="color:var(--e-abu)">Belum ada catatan evaluasi.</td></tr>`}</tbody>
    </table></div></div>`));

  return box;
};
HAL.laporan.judul = () => ['Laporan & Ringkasan', 'Rekapitulasi kepengurusan, program kerja, dan evaluasi.'];

/* ============================================================
   PENGATURAN — rumah bagi modul yang dilipat dari sidebar Ketua
   ------------------------------------------------------------
   Daftar tabnya diturunkan dari MENU itu sendiri, jadi modul yang
   kelak ditambahkan dengan tanda `lipat` otomatis muncul di sini
   tanpa perlu didaftarkan dua kali.
   ============================================================ */
let tabPengaturan = 'pengajuan';

HAL.pengaturan = () => {
  const tabs = menuTerlipat();
  if (!tabs.some((t) => t.id === tabPengaturan)) tabPengaturan = tabs[0]?.id;

  const box = el('<div></div>');
  if (!tabs.length) {
    box.appendChild(el(`<div class="panel"><div class="kosong-erp">${I.kotak}<p>Tidak ada pengaturan tersedia</p></div></div>`));
    return box;
  }

  box.appendChild(el(`<div class="notis notis-info">${I.perisai}<div>
    <b>Modul lanjutan organisasi</b>
    Persetujuan website, arsip, keuangan, dan sistem dikumpulkan di sini agar dasbor tetap ringkas.
    Alur dua kunci tetap berlaku: perubahan PJ Website baru tayang setelah Anda menyetujuinya pada tab Persetujuan.
  </div></div>`));

  const bar = el(`<div class="tab-bar">${tabs.map((t) => {
    const n = t.lonceng?.() || 0;
    return `<button data-tab="${t.id}" class="${t.id === tabPengaturan ? 'aktif' : ''}">
      ${nilai(t.ikon)}<span>${esc(nilai(t.label))}</span>${n ? `<span class="tab-lonceng">${n}</span>` : ''}</button>`;
  }).join('')}
    <a class="btn btn-garis btn-kecil" style="margin-left:auto" href="index.html" target="_blank">${I.mata} Lihat Website</a>
  </div>`);
  bar.querySelectorAll('[data-tab]').forEach((b) => {
    b.onclick = () => { tabPengaturan = b.dataset.tab; gambar(); };
  });
  box.appendChild(bar);
  box.appendChild(HAL[tabPengaturan]());
  return box;
};
HAL.pengaturan.judul = () => {
  const t = MENU.find((m) => m.id === tabPengaturan);
  return ['Pengaturan', t ? `${nilai(t.label)} — ${HAL[t.id].judul()[1]}` : 'Modul lanjutan organisasi.'];
};

/* ============================================================
   RENDER UTAMA
   ============================================================ */
function gambar() {
  const app = document.getElementById('erp');
  app.innerHTML = '';

  /* Sebelum data ada, tak ada logo maupun tema yang dapat dibaca. */
  if (Store.perluPasang()) { app.appendChild(layarPasang()); return; }
  if (!Store.cms) { app.appendChild(layarGagal()); return; }

  terapkanFontErp();
  terapkanFaviconErp();

  if (!U) { app.appendChild(layarLogin()); return; }
  if (Store.perluGantiSandi()) { app.appendChild(layarGantiSandi()); return; }

  const entri = MENU.find((m) => m.id === rute);
  if (entri && !bolehMenu(entri)) rute = 'dasbor';   // penjaga rute
  if (!HAL[rute]) rute = 'dasbor';

  app.appendChild(kerangka());
  const [j, s] = HAL[rute].judul();
  app.querySelector('#judulHal').textContent = j;
  app.querySelector('#subHal').textContent = s;
  app.querySelector('#isiHal').appendChild(HAL[rute]());
}

/* ---------------- layar gagal ---------------- */
function layarGagal() {
  return el(`<div class="layar-login">
    <div class="login-kanan" style="grid-column:1/-1"><div class="kotak-login">
      <h2>Tidak dapat memuat data</h2>
      <p class="sub">Sambungan ke server sedang bermasalah, atau <code>api/config.php</code>
        belum terpasang. Coba muat ulang halaman sebentar lagi.</p>
      <button class="btn btn-lime" style="width:100%;padding:13px"
        onclick="location.reload()">Muat ulang</button>
    </div></div>
  </div>`);
}

/* ---------------- mulai ----------------
   Data datang dari server, jadi tak ada yang dapat digambar sebelum ia
   tiba. Menggambar lebih dulu hanya akan memampangkan panel kosong yang
   sekejap kemudian berganti. */
(async () => {
  await Store.siap;
  U = Store.userAktif();
  if (location.hash) rute = location.hash.slice(1);
  window.addEventListener('hashchange', () => { const r = location.hash.slice(1); if (r && r !== rute) { rute = r; gambar(); } });
  gambar();
})();

/* ---------------- kabar dari lapisan penyimpanan ----------------
   Penyimpanan kini berlangsung di latar. Diamnya penyimpanan yang gagal
   adalah hal terburuk yang bisa terjadi pada sistem seperti ini —
   pengguna mengira pekerjaannya tersimpan padahal tidak. */
Store.berlanggananStatus((keadaan, muatan) => {
  if (keadaan === 'bentrok') {
    toast('Data ini baru saja diubah pengurus lain. Layar disegarkan — periksa kembali sebelum menyimpan ulang.', true);
    gambar();
  } else if (keadaan === 'sesiHabis') {
    U = null;
    toast('Sesi Anda berakhir. Silakan masuk kembali.', true);
    gambar();
  } else if (keadaan === 'galat') {
    toast(`Perubahan belum tersimpan: ${muatan} Mencoba lagi…`, true);
  } else if (keadaan === 'ditolak') {
    /* Bukan gangguan sesaat: server menolak wewenangnya. Ditampilkan
       sebagai modal, bukan toast, sebab perubahannya benar-benar hilang
       dan itu terlalu penting untuk lewat begitu saja dalam empat detik. */
    modal({
      judul: 'Perubahan tidak tersimpan',
      isi: `<p style="margin:0 0 12px;font-size:14px;color:#44534A">${esc(muatan)}</p>
            <p style="margin:0;font-size:13px;color:var(--e-abu)">Muat ulang halaman untuk
            kembali ke keadaan terakhir yang tersimpan di server.</p>`,
    });
  } else if (keadaan === 'sandiBaru') {
    /* Anggota baru memperoleh kata sandi dari server, sekali saja. */
    Object.values(muatan).forEach((sandi) => {
      modal({
        judul: 'Kata sandi awal anggota baru',
        isi: `<p style="margin:0 0 14px;font-size:14px;color:#44534A">Sampaikan kata sandi ini kepada
              yang bersangkutan. Ia akan diminta menggantinya saat pertama masuk, dan sandi ini
              <b>tidak dapat dilihat lagi</b> setelah jendela ini ditutup.</p>
              <div class="kartu-sandi"><code style="font-size:19px;letter-spacing:1px">${esc(sandi)}</code></div>`,
      });
    });
  }
});

/* Segarkan lonceng bila ada perubahan dari pengurus lain. */
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
