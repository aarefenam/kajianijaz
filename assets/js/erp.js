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
  gembok:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10.5" width="16" height="10.5" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2.5"/></svg>',
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
/* Tanggal menurut jam SETEMPAT. Dulu diambil dari toISOString(), yaitu
   UTC: selepas tengah malam di Kairo "hari ini" masih kemarin sampai
   pukul dua atau tiga pagi, dan transaksi yang dicatat saat itu
   bertanggal salah. */
const tanggalLokal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const nowTanggal = () => tanggalLokal(new Date());
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
  r.setProperty('--e-font-merek', FONT.tumpuk('merek', t.fontMerek) || utama);
  r.setProperty('--e-font-arab', FONT.tumpuk('arab', t.fontArab));
  FONT.muat({ utama: t.fontUtama, merek: t.fontMerek, arab: t.fontArab });
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

/* ---------------- pilih & hapus massal ----------------
   Setiap daftar data memakai cetakan yang sama: kotak pilih di tiap
   baris, "pilih semua", dan tombol hapus yang baru muncul saat ada yang
   dipilih. Dipasang SESUDAH daftarnya jadi, supaya tak satu pun tabel
   perlu menata ulang kolomnya sendiri.

   `boleh` menandai baris yang memang dapat dihapus pengguna ini; yang
   tidak, kotaknya mati dan tak ikut "pilih semua". `hapusSemua` dipakai
   bila penghapusan harus terjadi dalam satu langkah — kategori, misalnya,
   yang disimpan sebagai satu larik utuh di draft website. */
function aturPilih({ bilah, semua, kotak, daftar, satuan, boleh = () => true, hapus, hapusSemua, sesudah = () => gambar() }) {
  const terpilih = new Set();
  const dapat = daftar.map((x, i) => (boleh(x) ? i : -1)).filter((i) => i >= 0);
  const tombol = bilah.querySelector('[data-h]');
  const batal = bilah.querySelector('[data-b]');
  const ket = bilah.querySelector('b');

  const segarkan = () => {
    kotak.forEach((b, i) => b.classList.toggle('on', terpilih.has(i)));
    semua.classList.toggle('on', !!dapat.length && terpilih.size === dapat.length);
    bilah.classList.toggle('ada', !!terpilih.size);
    tombol.hidden = batal.hidden = !terpilih.size;
    ket.textContent = terpilih.size ? `${terpilih.size} dari ${daftar.length} dipilih` : '';
  };
  kotak.forEach((b, i) => {
    if (!dapat.includes(i)) { b.disabled = true; b.title = 'Tidak dapat dihapus'; return; }
    b.onclick = () => { terpilih.has(i) ? terpilih.delete(i) : terpilih.add(i); segarkan(); };
  });
  semua.disabled = !dapat.length;
  semua.onclick = () => {
    const penuh = terpilih.size === dapat.length;
    terpilih.clear();
    if (!penuh) dapat.forEach((i) => terpilih.add(i));
    segarkan();
  };
  batal.onclick = () => { terpilih.clear(); segarkan(); };
  tombol.onclick = () => {
    const kena = [...terpilih].sort((x, y) => x - y).map((i) => daftar[i]);
    konfirmasi(`Hapus ${kena.length} ${satuan}`,
      `${kena.length} ${satuan} yang dipilih akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`,
      () => {
        if (aman(() => (hapusSemua ? hapusSemua(kena) : kena.forEach((x) => hapus(x))))) {
          toast(`${kena.length} ${satuan} dihapus.`);
        }
        sesudah();
      }, 'Ya, hapus');
  };
  segarkan();
}

const tombolBilah = () => `<b></b>
  <button class="btn btn-merah btn-kecil" data-h hidden>${I.hapus} Hapus Terpilih</button>
  <button class="btn btn-garis btn-kecil" data-b hidden>Batal</button>`;

/* Untuk tabel. `daftar` harus sejajar dengan baris <tbody> — satu data,
   satu baris. Bila tidak (ada baris total atau penanda "…"), kotak
   pilih tidak dipasang sama sekali: lebih baik tanpa fitur daripada
   menghapus baris yang keliru. */
function pasangPilih(bungkus, daftar, opsi) {
  const tabel = bungkus.matches('table') ? bungkus : bungkus.querySelector('table');
  const baris = tabel ? [...tabel.tBodies[0].rows] : [];
  if (!daftar.length || baris.length !== daftar.length) return bungkus;

  const bilah = el(`<div class="bilah-pilih">${tombolBilah()}</div>`);
  tabel.before(bilah);

  const semua = el(`<button class="cek-kotak" title="Pilih semua">${I.cek}</button>`);
  const th = document.createElement('th');
  th.className = 'kol-pilih';
  th.rowSpan = tabel.tHead.rows.length;
  th.appendChild(semua);
  tabel.tHead.rows[0].prepend(th);

  const kotak = baris.map((tr) => {
    const b = el(`<button class="cek-kotak" title="Pilih">${I.cek}</button>`);
    const td = document.createElement('td');
    td.className = 'kol-pilih';
    td.appendChild(b);
    tr.prepend(td);
    return b;
  });
  aturPilih({ satuan: 'data', ...opsi, bilah, semua, kotak, daftar });
  return bungkus;
}

/* Untuk daftar berbentuk kartu (artikel, jadwal kajian lama): nomor dan
   kotak pilih disisipkan di awal kepala tiap kartu, dan bilahnya selalu
   tampak sebab di situlah "pilih semua" berada. */
function pasangPilihKartu(wadah, kartu, daftar, opsi) {
  if (!daftar.length || kartu.length !== daftar.length) return;
  const bilah = el(`<div class="bilah-pilih bilah-kartu">
    <button class="cek-kotak" data-semua title="Pilih semua">${I.cek}</button>
    <span>Pilih semua</span>${tombolBilah()}</div>`);
  wadah.prepend(bilah);
  const kotak = kartu.map((n, i) => {
    const b = el(`<button class="cek-kotak" title="Pilih">${I.cek}</button>`);
    n.querySelector('.panel-kepala').prepend(b, el(`<span class="no-kartu">${i + 1}</span>`));
    return b;
  });
  aturPilih({ satuan: 'data', ...opsi, bilah, semua: bilah.querySelector('[data-semua]'), kotak, daftar });
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
  { grup: 'Menu Utama', izin: ['mediaweb.manage'] },
  { id: 'dasbor',    label: () => ruangKetua() ? 'Dashboard Ketua Umum' : ruangBuku() ? 'Dashboard' : 'Dasbor',
    ikon: () => ruangKetua() ? I.rumah : I.dasbor, izin: null },
  { id: 'kartu-saya', label: 'Kartu Saya', ikon: I.qr, izin: null },
  /* Jadwal, tugas, dan izin kajian milik sendiri — hanya bagi yang masih berkajian. */
  { id: 'kajian-saya', label: 'Kajian Saya', ikon: I.kalender, izin: null, tersembunyiBila: () => !Store.berkajian(U),
    lonceng: () => tugasKajianSaya().length },

  /* --- ruang kerja Ketua Umum --- */
  { id: 'pengurus',    label: 'Data Pengurus',                ikon: I.grup,    izin: ['organisasi.manage'] },
  { id: 'koordinator', label: 'Koordinator Kajian',           ikon: I.orang,   izin: ['organisasi.manage'] },
  { id: 'kaleidoskop', label: 'Program Kerja',                ikon: I.agenda,  izin: ['organisasi.manage'] },
  { id: 'pencapaian',  label: 'Pencapaian / Achievement',     ikon: I.piala,   izin: ['organisasi.manage'] },
  { id: 'evaluasi',    label: 'Evaluasi & Tindak Lanjut',     ikon: I.obrolan, izin: ['organisasi.manage'] },
  { id: 'laporan',     label: 'Laporan & Ringkasan',          ikon: I.bagan,   izin: ['organisasi.report'] },
  { id: 'pantau-divisi', label: 'Pantau Divisi',              ikon: I.ukur,    izin: ['organisasi.manage'] },
  { id: 'persetujuan-kas', label: 'Persetujuan Pengeluaran',  ikon: I.uang,    izin: ['keuangan.approve'],
    lonceng: () => Store.db.keuangan.filter((t) => t.status === 'menunggu').length },
  /* Tab Pantau Divisi — tak pernah tampil sendiri di sidebar. */
  { id: 'pantau-kajian', label: 'Kajian',       ikon: I.kalender, izin: ['organisasi.manage'], tersembunyi: true },
  { id: 'pantau-kas',    label: 'Kas & Saldo',  ikon: I.uang,     izin: ['organisasi.manage'], tersembunyi: true },
  { id: 'pantau-surat',  label: 'Arsip Surat',  ikon: I.arsip,    izin: ['organisasi.manage'], tersembunyi: true },
  { id: 'pantau-artikel',label: 'Penulisan',    ikon: I.pena,     izin: ['organisasi.manage'], tersembunyi: true },
  /* Tabel kajian yang sama, sebagai halaman kerja Sekretaris. */
  { id: 'notulen-presensi', label: 'Notulen & Presensi', ikon: I.kalender, izin: ['kajian.notulensi', 'kajian.attendance'],
    /* PJ Kajian memegang izin yang sama, tetapi punya halaman Presensi dan
       Notulennya sendiri — tanpa ini sidebarnya memuat dua pintu serupa. */
    tersembunyiBila: () => !ruangSekretaris(),
    lonceng: () => Store.db.kajian.filter((k) => statusKajian(k) === 'selesai' && Store.statusNotulen(k) !== 'sah').length + Store.izinMenunggu(Store.db.kajian.filter(Store.kajianJalan)).length },

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
  { id: 'templat-surat', label: 'Templat Surat', ikon: I.layout, izin: ['sekretariat.manage'] },
  { id: 'susun-surat',   label: 'Susun Surat',   ikon: I.dok,    izin: ['sekretariat.manage'], tersembunyi: true },

  { grup: 'Dokumen & Arsip', izin: ['sertifikat.manage', 'ttd.manage'] },
  { id: 'sertifikat', label: 'Sertifikat',            ikon: I.dok,  izin: ['sertifikat.manage'] },
  { id: 'ttd',        label: 'Kumpulan Tanda Tangan', ikon: I.pena, izin: ['ttd.manage'] },

  { grup: 'Data & Keanggotaan', izin: ['sekretariat.manage'] },
  { id: 'anggota-angkatan', label: 'Data Anggota Perangkatan', ikon: I.grup,   izin: ['sekretariat.manage'] },
  { id: 'alumni',           label: 'Data Alumni',              ikon: I.wisuda, izin: ['sekretariat.manage'] },
  { id: 'kartu-anggota',    label: 'Kartu Anggota',            ikon: I.qr,     izin: ['anggota.manage'] },
  { id: 'pendaftaran',      label: 'Pendaftaran',              ikon: I.dokCek, izin: ['anggota.manage'],
    lonceng: () => (Store.db.pendaftaran || []).filter((p) => p.status === 'menunggu').length },

  { grup: 'Arsip Penulisan', izin: ['arsip.view'] },
  { id: 'arsip', label: 'Link Arsip Kepenulisan', ikon: I.tautan, izin: ['arsip.view'] },

  /* --- ruang kerja PJ Artikel --- */
  { grup: 'Manajemen Artikel', izin: ['redaksi.manage'] },
  { id: 'daftar-artikel',  label: 'Daftar Artikel',      ikon: I.dok,    izin: ['redaksi.manage'] },
  { id: 'artikel-masuk',   label: 'Artikel Masuk',       ikon: I.dokCek, izin: ['redaksi.manage'],
    lonceng: () => Store.db.artikel.filter((a) => a.status === 'review' && a.penulisId !== U?.id).length },
  { id: 'artikel-terbit',  label: 'Artikel Dipublikasi', ikon: I.agenda, izin: ['redaksi.manage'] },
  { id: 'artikel-revisi',  label: 'Menunggu Revisi',     ikon: I.putar,  izin: ['redaksi.manage'], tersembunyiBila: () => !tugas() },
  { id: 'artikel-saya',    label: 'Tulisan Saya',        ikon: I.pena,   izin: ['redaksi.manage'], tersembunyiBila: () => !tugas() },
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
  { id: 'materi',        label: 'Materi & PPT',    ikon: I.papan,     izin: ['kajian.materi'] },
  { id: 'notulen',       label: 'Revisi & Notulen',ikon: I.dok,       izin: ['kajian.notulensi'], tersembunyiBila: () => !ruangKoordinator() },
  { id: 'rekap-kajian',  label: 'Rekap Kajian',    ikon: I.bagan,     izin: ['koordinator.manage'] },
  { id: 'statistik',     label: 'Statistik',       ikon: I.ukur,      izin: ['koordinator.manage'] },
  { id: 'atur-kajian',   label: 'Pengaturan',      ikon: I.gerigi,    izin: ['koordinator.manage'] },
  { id: 'kartu-qr',      label: 'Kartu QR Anggota',ikon: I.qr,        izin: ['koordinator.manage'], tersembunyi: true },

  /* --- ruang kerja Bendahara --- */
  { grup: 'Keuangan', izin: ['bendahara.manage'] },
  { id: 'masuk-internal',  label: 'Pemasukan Internal',  ikon: I.masukKas,   izin: ['bendahara.manage'] },
  { id: 'iuran-anggota',   label: 'Iuran per Anggota',   ikon: I.grup,       izin: ['bendahara.manage'] },
  { id: 'masuk-eksternal', label: 'Pemasukan Eksternal', ikon: I.hadiah,     izin: ['bendahara.manage'] },
  { id: 'pengeluaran',     label: 'Pengeluaran',         ikon: I.keluarKas,  izin: ['bendahara.manage'],
    lonceng: () => Store.db.keuangan.filter((t) => t.status === 'ditolak').length },
  { id: 'transfer-kas',    label: 'Transfer & Tukar',    ikon: I.timbang,    izin: ['bendahara.manage'] },
  { id: 'tutup-buku',      label: 'Tutup Buku',          ikon: I.gembok,     izin: ['bendahara.manage'] },
  { id: 'anggaran',        label: 'Anggaran & Realisasi', ikon: I.sasaran,   izin: ['bendahara.manage'] },
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
  if (tugas()) return !m.id || (idTugas().has(m.id) && (!m.izin || RBAC.canAny(U, m.izin)));
  if (m.lipat && ruangKhusus()) return false;       // sudah jadi tab di Pengaturan
  return !m.izin || RBAC.canAny(U, m.izin);
};

/* ============================================================
   SIDEBAR KETUA UMUM — disusun menurut tugas, bukan menurut modul
   ------------------------------------------------------------
   Empat kelompok, masing-masing menjawab satu pertanyaan:
     Putuskan  — apa yang menunggu keputusan saya?
     Pantau    — bagaimana jalannya organisasi?
     Struktur  — siapa memegang apa?
     Sistem    — pengaturan yang jarang disentuh.

   Dulu pekerjaan harian Ketua (persetujuan, tinjauan artikel, kotak
   masuk) terselip sebagai tab di Pengaturan, sejajar dengan tema dan
   log. Kini ia berdiri di sidebar; yang tinggal sebagai tab hanyalah
   yang memang jarang dibuka.

   Tidak ada modul yang hilang: setiap id di sini tetap entri MENU yang
   sama, dengan izin yang sama. Yang berubah hanya letaknya.
   ============================================================ */
const MENU_KETUA = [
  { id: 'dasbor' },
  { id: 'kartu-saya' },
  { id: 'kajian-saya' },
  { grup: 'Putuskan' },
  { id: 'pengajuan', label: 'Persetujuan Website' },
  { id: 'persetujuan-kas' },
  { id: 'artikel',   label: 'Tinjau Artikel' },
  { id: 'pesan' },
  { grup: 'Pantau' },
  { id: 'kaleidoskop' },
  { id: 'evaluasi' },
  { id: 'pencapaian' },
  { id: 'pantau-divisi' },
  { id: 'laporan' },
  { grup: 'Struktur' },
  { id: 'pendaftaran' },
  { id: 'anggota' },
  { id: 'kartu-anggota' },
  { id: 'pengurus' },
  { id: 'koordinator' },
  { id: 'akses' },
  { grup: 'Sistem' },
  { id: 'pengaturan' },
];

/** Halaman bertab milik Ketua beserta modul yang menjadi tabnya. */
const TAB_KETUA = {
  'pantau-divisi': ['pantau-kajian', 'pantau-artikel', 'pantau-kas', 'pantau-surat'],
  pengaturan: ['cms', 'tema', 'versi', 'kategori-artikel', 'log'],
};
const tabAktif = { 'pantau-divisi': 'pantau-kajian', pengaturan: 'pengajuan' };
/** Alamat modul lama yang bagi Ketua digantikan tab Pantau Divisi. */
const ALIAS_KETUA = { kajian: 'pantau-kajian', keuangan: 'pantau-kas', surat: 'pantau-surat' };

/* ============================================================
   SIDEBAR SEKRETARIS — cetakan yang sama dengan Ketua
   ------------------------------------------------------------
     Tindak Lanjuti — apa yang menunggu saya?
     Persuratan     — surat apa yang kami terbitkan?
     Dokumen        — dokumen resmi apa yang kami pegang?
     Keanggotaan    — siapa anggota kami?
     Sistem         — yang jarang disentuh.

   Kotak masuk serta notulen dan presensi kajian dulu terselip sebagai
   tab Pengaturan. Keduanya pekerjaan harian, jadi kini di sidebar.
   ============================================================ */
const MENU_SEKRETARIS = [
  { id: 'dasbor' },
  { id: 'kartu-saya' },
  { id: 'kajian-saya' },
  { grup: 'Tindak Lanjuti' },
  { id: 'pesan' },
  { id: 'surat-masuk' },
  { id: 'notulen-presensi' },
  { grup: 'Persuratan' },
  { id: 'surat-internal' },
  { id: 'surat-eksternal' },
  { id: 'surat-keputusan' },
  { id: 'templat-surat' },
  { id: 'susun-surat' },
  { grup: 'Dokumen' },
  { id: 'sertifikat' },
  { id: 'ttd' },
  { id: 'arsip', label: 'Arsip Kepenulisan' },
  { grup: 'Keanggotaan' },
  { id: 'pendaftaran' },
  { id: 'anggota-angkatan', label: 'Data Anggota' },
  { id: 'alumni' },
  { id: 'kartu-anggota' },
  { grup: 'Sistem' },
  { id: 'pengaturan' },
];
const TAB_SEKRETARIS = { pengaturan: ['cms', 'pengajuan', 'log'] };

/* ============================================================
   SIDEBAR BENDAHARA — mengikuti jalannya uang
   ------------------------------------------------------------
     Terima     — uang apa yang masuk?
     Keluarkan  — uang apa yang keluar?
     Periksa    — apakah bukunya cocok dengan uang yang ada?
     Laporkan   — apa yang kusampaikan kepada pengurus?
     Pengaturan — yang jarang disentuh.
   ============================================================ */
const MENU_BENDAHARA = [
  { id: 'dasbor' },
  { id: 'kartu-saya' },
  { id: 'kajian-saya' },
  { grup: 'Terima' },
  { id: 'iuran-anggota' },
  { id: 'masuk-internal' },
  { id: 'masuk-eksternal' },
  { grup: 'Keluarkan' },
  { id: 'pengeluaran' },
  { id: 'transfer-kas' },
  { grup: 'Periksa' },
  { id: 'saldo', label: 'Saldo & Akun' },
  { id: 'tutup-buku' },
  { grup: 'Laporkan' },
  { id: 'laporan-kas' },
  { id: 'anggaran' },
  { grup: 'Pengaturan' },
  { id: 'kategori-akun' },
];

/* ============================================================
   SIDEBAR PJ KOORDINATOR KAJIAN — mengikuti perjalanan satu kajian
   ------------------------------------------------------------
     Kajian     — menjadwalkan, membagi tugas, mencatat hadir, menulis hasil.
     Peserta    — siapa pesertanya dan seberapa rajin mereka.
     Laporan    — apa yang kusampaikan kepada pengurus?
     Pengaturan — yang jarang disentuh.
   Pembagian Tugas melebur ke Jadwal (formulirnya memang satu), dan
   Notifikasi menjadi antrean di dasbor.
   ============================================================ */
const MENU_KAJIAN = [
  { id: 'dasbor' },
  { id: 'kartu-saya' },
  { id: 'kajian-saya' },
  { grup: 'Kajian' },
  { id: 'jadwal-kajian', label: 'Jadwal & Tugas', lonceng: () => { const p = perluKajian(); return p.berhalangan.length + p.belumLengkap.filter((x) => x.sisa <= 3).length; } },
  { id: 'presensi', lonceng: () => { const p = perluKajian(); return p.izin.length + p.tanpaPresensi.length + p.belumTutup.length; } },
  { id: 'materi', label: 'Materi & Makalah', lonceng: () => { const p = perluKajian(); return p.makalahPeriksa.length + p.makalahTelat.length; } },
  { id: 'notulen', label: 'Notulen', lonceng: () => { const p = perluKajian(); return p.notulenAjuan.length + p.tanpaNotulen.length; } },
  { grup: 'Peserta' },
  { id: 'anggota-kajian', label: 'Anggota & Kelompok' },
  { id: 'statistik', label: 'Kehadiran Anggota' },
  { grup: 'Laporan' },
  { id: 'rekap-kajian', label: 'Rekap & Statistik' },
  { grup: 'Pengaturan' },
  { id: 'atur-kajian', label: 'Lingkup Kajian' },
  { id: 'kartu-qr' },
];

/* ============================================================
   SIDEBAR PJ ARTIKEL — mengikuti perjalanan sebuah naskah
   ------------------------------------------------------------
     Tinjau     — naskah apa yang menunggu saya?
     Naskah     — seluruh tulisan, yang terbit, dan tulisan saya sendiri.
     Target     — siapa menulis apa, dan sudah sejauh mana?
     Pengaturan — yang jarang disentuh.
   ============================================================ */
const MENU_ARTIKEL = [
  { id: 'dasbor' },
  { id: 'kartu-saya' },
  { id: 'kajian-saya' },
  { grup: 'Tinjau' },
  { id: 'artikel-masuk', label: 'Naskah Masuk' },
  { id: 'artikel-revisi' },
  { grup: 'Naskah' },
  { id: 'daftar-artikel', label: 'Semua Naskah' },
  { id: 'artikel-terbit', label: 'Terbit' },
  { id: 'artikel-saya' },
  { grup: 'Target' },
  { id: 'target-artikel', label: 'Penugasan' },
  { id: 'performa', label: 'Capaian Anggota' },
  { id: 'rekap' },
  { grup: 'Pengaturan' },
  { id: 'kategori-artikel', label: 'Kategori' },
  { id: 'panduan' },
  { id: 'akun' },
];

/* Peran yang sidebarnya disusun menurut tugas. `menu` susunan
   sidebarnya, `tab` halaman bertab beserta modulnya, `alias` alamat
   modul lama yang digantikan. Peran lain memakai MENU apa adanya. */
const RUANG_TUGAS = {
  ketua     : { menu: MENU_KETUA,      tab: TAB_KETUA,      alias: ALIAS_KETUA },
  sekretaris: { menu: MENU_SEKRETARIS, tab: TAB_SEKRETARIS, alias: { anggota: 'anggota-angkatan', kajian: 'notulen-presensi' } },
  bendahara : { menu: MENU_BENDAHARA,  tab: {},             alias: { keuangan: 'laporan-kas' } },
  artikel   : { menu: MENU_ARTIKEL,    tab: {},             alias: { artikel: 'daftar-artikel' } },
  kajian    : { menu: MENU_KAJIAN,     tab: {},             alias: { 'tugas-kajian': 'jadwal-kajian', notifikasi: 'dasbor', kajian: 'jadwal-kajian' } },
};
const tugas = () => (ruangKetua() ? RUANG_TUGAS.ketua : ruangSekretaris() ? RUANG_TUGAS.sekretaris
  : ruangBendahara() ? RUANG_TUGAS.bendahara : ruangKoordinator() ? RUANG_TUGAS.kajian : ruangRedaksi() ? RUANG_TUGAS.artikel : null);

const idTugas = () => new Set([
  ...tugas().menu.map((m) => m.id).filter(Boolean),
  ...Object.values(tugas().tab).flat(),
]);
/** Halaman bertab yang menaungi sebuah modul — atau undefined. */
const indukTab = (id) => Object.keys(tugas().tab).find((k) => tugas().tab[k].includes(id));

/** Entri sidebar: entri MENU aslinya, ditimpa label bila ada. */
const menuTugas = () => tugas().menu.map((k) => {
  if (k.grup) return k;
  const asli = MENU.find((m) => m.id === k.id);
  return asli && (!asli.izin || RBAC.canAny(U, asli.izin)) ? { ...asli, ...k } : null;
}).filter(Boolean)
  /* Judul kelompok yang seluruh isinya tak tersedia ikut dibuang. */
  .filter((m, i, arr) => !m.grup || (arr[i + 1] && !arr[i + 1].grup));

/** Modul yang menjadi tab pada sebuah halaman bertab. */
const daftarTab = (kunci) => (tugas()
  ? (tugas().tab[kunci] || []).map((id) => MENU.find((m) => m.id === id))
      .filter((m) => m && HAL[m.id] && (!m.izin || RBAC.canAny(U, m.izin)))
  : menuTerlipat());

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
        Lupa kata sandi? Sekretaris atau Ketua Umum dapat menyetel ulang dari menu Anggota.<br>
        Belum menjadi anggota? <a href="daftar.html" style="font-weight:700">Isi formulir pendaftaran</a>.<br>
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

/* Kelompok sidebar yang sedang dilipat. Pilihan ini kenyamanan tiap
   orang di perambannya sendiri, jadi disimpan di sana — bukan di
   database. Penyimpanan peramban boleh gagal (mode privat, disetel
   mati); sidebar tetap bekerja, hanya tak mengingat. */
const KUNCI_GRUP = 'erp.grupTertutup';
const grupTertutup = new Set((() => {
  try { return JSON.parse(localStorage.getItem(KUNCI_GRUP) || '[]'); } catch (_) { return []; }
})());
const simpanGrup = () => {
  try { localStorage.setItem(KUNCI_GRUP, JSON.stringify([...grupTertutup])); } catch (_) { /* tak apa */ }
};
const kunciGrup = (label) => `${U?.role}:${label}`;
let ruteSidebar = null;       // rute saat sidebar terakhir digambar

function kerangka() {
  const ketua = ruangKetua();
  const khusus = ruangKhusus();

  /* Judul grup memakai gabungan izin anak-anaknya, sehingga grup yang
     seluruh menunya tersembunyi ikut hilang dengan sendirinya. */
  const daftarMenu = (tugas() ? menuTugas() : MENU.filter(bolehMenu))
    .filter((m) => !m.tersembunyi && !m.tersembunyiBila?.());

  /* Tiap judul kelompok adalah tombol lipat. Anggotanya: semua menu
     sesudahnya sampai judul kelompok berikutnya. */
  const kelompok = new Map();       // entri menu → judul kelompoknya
  let judulKini = null;
  daftarMenu.forEach((m) => { if (m.grup) judulKini = m; else if (judulKini) kelompok.set(m, judulKini); });
  const anggota = (g) => daftarMenu.filter((m) => kelompok.get(m) === g);
  const memuatRute = (m) => m.id === rute || (m.anak || []).some((a) => a.id === rute);

  /* Berpindah ke halaman di dalam kelompok yang terlipat membukanya —
     lewat pintasan dasbor atau alamat langsung, pengguna tak boleh
     mendarat di halaman yang menunya tersembunyi. Melipatnya kembali
     sesudah itu tetap hak pengguna. */
  if (rute !== ruteSidebar) {
    const g = kelompok.get(daftarMenu.find(memuatRute));
    if (g && grupTertutup.delete(kunciGrup(g.grup))) simpanGrup();
    ruteSidebar = rute;
  }

  const menuHtml = daftarMenu.map((m) => {
    if (m.grup) {
      const tutup = grupTertutup.has(kunciGrup(m.grup));
      const isi = anggota(m);
      const lonceng = tutup ? isi.reduce((j, x) => j + (x.lonceng?.() || 0), 0) : 0;
      return `<button class="sb-grup${tutup ? ' tutup' : ''}${tutup && isi.some(memuatRute) ? ' berisi-aktif' : ''}"
        data-grup="${esc(m.grup)}" aria-expanded="${!tutup}">
        <span>${esc(m.grup)}</span>
        ${lonceng ? `<span class="sb-lonceng">${lonceng}</span>` : ''}
        <span class="sb-panah">${I.bawah}</span></button>`;
    }
    const induknya = kelompok.get(m);
    if (induknya && grupTertutup.has(kunciGrup(induknya.grup))) return '';
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

  const kelasRuang = (khusus ? ' ruang' : '') + (ketua ? ' ketua' : '') + (tugas() ? ' tugas' : '');
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

  n.querySelector('[data-angkatan]')?.addEventListener('change', (e) => { aturLingkup(e.target.value); gambar(); });
  n.querySelector('[data-level]')?.addEventListener('change', (e) => { aturLingkup(undefined, e.target.value); gambar(); });
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
  n.querySelectorAll('.sb-grup').forEach((b) => {
    b.onclick = () => {
      const k = kunciGrup(b.dataset.grup);
      grupTertutup.has(k) ? grupTertutup.delete(k) : grupTertutup.add(k);
      simpanGrup(); gambar();
    };
  });
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
    const saldo = Store.kasSah().reduce((s, t) => s + (t.jenis === 'masuk' ? 1 : t.jenis === 'keluar' ? -1 : 0) * Number(t.rp || 0), 0);
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
  jenis: 'Jenis Berkas Ditampilkan',
  tombol2Teks: 'Label Tombol Kedua', tombol2Link: 'Tautan Tombol Kedua', tema: 'Tema Panel',
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
  const MEDAN_FONT = ['fontUtama', 'fontMerek', 'fontArab'];
  Object.entries(t).forEach(([k, v]) => {
    if (MEDAN_FONT.includes(k)) return;
    kiri.querySelector('#mt').appendChild(medan(k, v, `theme.${k}`, bisa, bisa));
  });

  const s = Store.draft.situs;
  const kanan = el(`<div class="panel" style="margin:0">
    <div class="panel-kepala"><h3>Identitas & Kontak</h3><span class="ket">header, footer, halaman kontak</span></div>
    <div class="panel-isi" id="ms"></div></div>`);
  /* Penanda migrasi ikut tersimpan di dalam `situs`, tetapi ia catatan
     internal — bukan isi yang perlu disunting siapa pun. Tanpa disaring,
     ia tampil di formulir ini sebagai kolom angka bernama "Beranda
     Versi", dan tak ada yang tahu apa gunanya. */
  const SITUS_INTERNAL = ['menuArtikelDipindah', 'berandaDirombak', 'pemisahDitambah', 'berandaVersi', 'tentangVersi'];
  Object.entries(s).forEach(([k, v]) => {
    if (SITUS_INTERNAL.includes(k)) return;
    kanan.querySelector('#ms').appendChild(medan(k, v, `situs.${k}`, RBAC.can(U, 'cms.page.edit'), RBAC.can(U, 'cms.media.upload')));
  });

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
      ${baris('merek', t.fontMerek, 'Font Merek',
        'Nama organisasi di header dan kaki halaman — tempat rupa hurufnya memang dimaksudkan terlihat.',
        "Kajian Al-I'jaz", 'font-size:34px;font-weight:600;line-height:1.2')}
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
      const kunci = { utama: 'fontUtama', merek: 'fontMerek', arab: 'fontArab' }[jenis];
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
function halamanArtikel(kunci, milik = false) {
  /* `milik`: hanya tulisan sendiri — peninjau pun di sana berlaku sebagai penulis. */
  const bisaTinjau = RBAC.can(U, 'artikel.review') && !milik;
  const box = el('<div></div>');

  box.appendChild(el(`<div class="notis notis-info">${I.info}<div>
    <b>Alur karya tulis</b>
    Anggota menulis <b>Draft</b> → kirim untuk <b>Tinjauan</b> → PJ Artikel menyetujui (<b>Terbit</b>) atau mengembalikan (<b>Perlu Revisi</b>). Hanya artikel berstatus Terbit yang muncul di halaman Artikel.
  </div></div>`));

  if (!bisaTinjau && !kunci) box.appendChild(kartuTugasSaya());

  const kepala = el(`<div class="panel-kepala" style="background:#fff;border:1px solid var(--e-garis);border-radius:var(--e-radius);margin-bottom:18px">
    <h3>${kunci ? JUDUL_ART[kunci] : bisaTinjau ? 'Seluruh Naskah' : 'Tulisan Anda'}</h3>
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
    const kartuArt = [];
    data.forEach((a) => {
      const st = STATUS_ART[a.status];
      const milikSaya = a.penulisId === U.id;
      const n = el(`<div class="panel">
        <div class="panel-kepala">
          <img src="${a.cover}" style="width:56px;height:42px;border-radius:8px;object-fit:cover">
          <div style="min-width:0;flex:1">
            <h3 style="margin-bottom:2px">${esc(a.judul)}</h3>
            <span class="ket">${esc(Store.namaUser(a.penulisId))} · ${esc(a.kategori || 'belum berkategori')} · ${tgl(a.tanggal)}${a.status === 'terbit' ? ` · ${a.dilihat}x dibaca` : ''}${
              a.kajianId ? ` · dari makalah kajian${a.tautanMakalah ? ` · <a href="${esc(a.tautanMakalah)}" target="_blank" rel="noopener noreferrer" style="font-weight:700">buka makalah</a>` : ''}` : ''}${
              a.penugasanId ? ' · penugasan' : ''}</span>
          </div>
          <span class="lencana ${st.c}">${st.l}</span>
          <div class="kanan" data-aksi></div>
        </div>
        ${a.reviewNote && a.status !== 'terbit' ? `<div class="panel-isi" style="padding-top:14px;padding-bottom:14px">
          <div class="notis ${a.status === 'revisi' ? 'notis-merah' : 'notis-kuning'}" style="margin:0">${I.peringatan}<div><b>Catatan peninjau${a.status === 'revisi' ? '' : ' (sudah diperbaiki penulis, menunggu ditinjau ulang)'}</b>${esc(a.reviewNote)}</div></div></div>` : ''}
        ${a.status === 'review' && milikSaya && RBAC.can(U, 'artikel.publish') && !RBAC.can(U, 'user.manage') ? `<div class="panel-isi" style="padding-top:14px;padding-bottom:14px">
          <div class="notis notis-info" style="margin:0">${I.info}<div><b>Menunggu Ketua Umum</b>Tulisan PJ Artikel sendiri ditinjau dan diterbitkan Ketua Umum.</div></div></div>` : ''}
      </div>`);
      const aks = n.querySelector('[data-aksi]');

      const btn = (label, ikon, kelas, fn) => {
        const b = el(`<button class="btn ${kelas} btn-kecil">${ikon} ${label}</button>`);
        b.onclick = fn; aks.appendChild(b);
      };

      /* Tombol disusun dari perpindahan yang memang terbuka bagi pengguna
         ini pada naskah ini — bukan dari statusnya saja. */
      const boleh = Store.pindahArtikel(U, a);
      const pindah = (ke, pesan, catatan) => {
        if (aman(() => Store.ubahStatusArtikel(U, a.id, ke, catatan))) { tutupModal(); toast(pesan); gambar(); }
      };
      const tanyaCatatan = (judul, label, ph, tombol, ke, pesan) => {
        const isi = el(`<div class="grup" style="margin:0"><label>${label} <span style="color:var(--e-merah)">*</span></label>
          <textarea id="cr" placeholder="${ph}"></textarea></div>`);
        const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
          <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-merah" data-k>${tombol}</button></div>`);
        modal({ judul, isi, kaki });
        kaki.querySelector('[data-b]').onclick = tutupModal;
        kaki.querySelector('[data-k]').onclick = () => pindah(ke, pesan, isi.querySelector('#cr').value.trim());
      };
      const bolehSunting = (milikSaya && ['draft', 'revisi'].includes(a.status))
        || (bisaTinjau && (a.status !== 'terbit' || RBAC.can(U, 'artikel.publish')));

      btn('Baca', I.mata, 'btn-garis', () => bacaNaskah(a));
      if (bolehSunting) btn('Sunting', I.sunting, 'btn-garis', () => formArtikel(a));
      if (boleh.includes('review') && milikSaya)
        btn(a.status === 'revisi' ? 'Kirim Ulang' : 'Kirim untuk Ditinjau', I.kirim, 'btn-lime',
          () => pindah('review', a.penulisId === U.id && RBAC.can(U, 'artikel.publish') && !RBAC.can(U, 'user.manage')
            ? 'Naskah dikirim. Tulisan Anda sendiri diterbitkan Ketua Umum.' : 'Naskah dikirim untuk ditinjau.'));
      if (a.status === 'review' && boleh.includes('revisi') && !milikSaya)
        btn('Minta Revisi', I.putar, 'btn-merah', () => tanyaCatatan('Minta revisi', 'Catatan revisi',
          'Contoh: Mohon lengkapi rujukan pada paragraf ketiga dan periksa transliterasi istilah Arab.',
          'Kirim Catatan Revisi', 'revisi', 'Catatan revisi dikirim ke penulis.'));
      if (boleh.includes('terbit'))
        btn('Setujui & Terbitkan', I.cek, 'btn-lime', () => konfirmasi('Terbitkan artikel',
          'Artikel akan langsung muncul di halaman Artikel website publik.',
          () => pindah('terbit', 'Artikel terbit di website.'), 'Terbitkan', false));
      if (a.status === 'review' && milikSaya && boleh.includes('draft'))
        btn('Tarik Kiriman', I.putar, 'btn-garis', () => pindah('draft', 'Naskah ditarik kembali ke draf.'));
      if (a.status === 'terbit' && boleh.includes('draft'))
        btn('Tarik dari Website', I.putar, 'btn-garis', () => tanyaCatatan('Tarik artikel dari website',
          'Alasan menarik', 'Contoh: ada kekeliruan kutipan yang perlu diperbaiki.', 'Tarik Artikel', 'draft', 'Artikel ditarik dari website.'));
      if ((milikSaya || bisaTinjau) && a.status !== 'terbit' && (a.status !== 'review' || bisaTinjau))
        btn('', I.hapus, 'btn-merah btn-ikon', () => konfirmasi('Hapus naskah', `"${a.judul}" akan dihapus permanen.`,
          () => { if (aman(() => Store.hapusArtikel(U, a.id))) { toast('Naskah dihapus.'); gambarDaftar(); } }));

      wadah.appendChild(n);
      kartuArt.push(n);
    });
    pasangPilihKartu(wadah, kartuArt, data, {
      satuan: 'naskah', sesudah: gambarDaftar,
      /* Yang terbit ditarik dulu; yang sedang ditinjau hanya dihapus peninjau. */
      boleh: (a) => a.status !== 'terbit' && (bisaTinjau || (a.penulisId === U.id && a.status !== 'review')),
      hapus: (a) => Store.hapusArtikel(U, a.id),
    });
  }

  kepala.querySelector('#fStatus')?.addEventListener('change', gambarDaftar);
  kepala.querySelector('#btnBaru')?.addEventListener('click', () => formArtikel(null));
  gambarDaftar();
  return box;
}

/** Penugasan, target, dan usulan judul milik penulis yang sedang masuk. */
function kartuTugasSaya() {
  const bulan = nowTanggal().slice(0, 7);
  const target = Store.db.redaksi.targetBulanan || 1;
  const wajib = Store.berkajian(U);
  const kirim = Store.db.artikel.filter((a) => a.penulisId === U.id && Store.dikirimPada(a).slice(0, 7) === bulan).length;
  /* Yang masih menuntut kerja, ditambah seluruh penugasan bulan ini. */
  const tugas = Store.db.penugasan.filter((p) => p.userId === U.id
    && (p.bulan === bulan || Store.progresTugas(p).status !== 'siap'))
    .sort((a, b) => a.deadline.localeCompare(b.deadline));
  const usul = Store.db.artikel.filter((a) => a.penulisId === U.id && a.usul && a.usul.status !== 'disetujui');
  const kartu = el(`<div class="kartu" style="margin-bottom:18px"><div class="kartu-kepala">
    <h3>Penugasan Saya</h3>
    <span class="hitung">${wajib ? `${esc(namaBulan(bulan))}: ${kirim} dari ${target} naskah dikirim${kirim >= target ? ' — target terpenuhi' : ''}` : 'Anda tidak ditagih target bulanan'}</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-panduan>${I.buku} Panduan Penulis</button>
      <button class="btn btn-garis btn-kecil" data-usul>${I.tag} Usulkan Judul</button></div></div></div>`);
  kartu.querySelector('[data-usul]').onclick = () => dialogUsulJudul();
  kartu.querySelector('[data-panduan]').onclick = () => bacaPanduan();
  if (!tugas.length && !usul.length) {
    kartu.appendChild(el(`<div class="kosong-erp" style="padding:22px">${I.kotak}<p>Belum ada penugasan</p>
      <small>PJ Artikel akan membagikan judul, atau usulkan judul Anda sendiri.</small></div>`));
    return kartu;
  }
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Judul</th><th>Bulan</th><th>Tenggat</th><th>Progres</th><th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  tugas.forEach((p, i) => {
    const g = Store.progresTugas(p);
    const tr = el(`<tr><td class="kol-no">${i + 1}</td>
      <td><b>${esc(p.judul)}</b>${p.catatan ? `<br><span style="color:var(--e-abu);font-size:11.8px">Arahan: ${esc(p.catatan)}</span>` : ''}</td>
      <td class="utuh">${esc(namaBulan(p.bulan))}</td><td class="utuh">${tgl(p.deadline)}</td>
      <td>${lencanaProgres(p)}</td>
      <td class="kol-aksi"><div class="sel-aksi">${g.status === 'siap' ? ''
        : `<button class="btn btn-lime btn-kecil">${g.naskah ? 'Lanjutkan Menulis' : 'Mulai Menulis'}</button>`}</div></td></tr>`);
    tr.querySelector('button')?.addEventListener('click', () => {
      let a = null;
      if (aman(() => { a = Store.tulisDariTugas(U, p.id); })) formArtikel(a);
    });
    tb.appendChild(tr);
  });
  usul.forEach((a, i) => tb.appendChild(el(`<tr><td class="kol-no">${tugas.length + i + 1}</td>
    <td><b>${esc(a.judul)}</b><br><span style="color:var(--e-abu);font-size:11.8px">Usulan Anda${a.usul.alasan ? ` — ditolak: ${esc(a.usul.alasan)}` : ''}</span></td>
    <td class="utuh">${esc(namaBulan(a.usul.bulan))}</td><td class="utuh">—</td>
    <td><span class="lencana ${a.usul.status === 'menunggu' ? 'l-kuning' : 'l-merah'}">usulan ${esc(a.usul.status)}</span></td><td></td></tr>`)));
  kartu.appendChild(t);
  return kartu;
}

/** Panduan Penulis untuk dibaca — penyuntingannya tetap di halaman PJ Artikel. */
function bacaPanduan() {
  const panduan = Store.db.redaksi?.panduan || [];
  const isi = el(`<div>${panduan.length ? panduan.map((b, i) => `<div class="panduan-bagian">
    <div class="panduan-kepala"><span class="no">${i + 1}</span><h4>${esc(b.judul)}</h4></div>
    <ul>${(b.isi || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')
    : `<div class="kosong-erp">${I.kotak}<p>Panduan belum ditulis PJ Artikel</p></div>`}</div>`);
  const kaki = el(`<div style="display:flex;justify-content:flex-end"><button class="btn btn-garis" data-b>Tutup</button></div>`);
  modal({ judul: 'Panduan Penulis', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
}

function dialogUsulJudul() {
  const isi = el(`<div>
    <div class="grup"><label>Judul yang Diusulkan</label><input data-judul placeholder="Judul lengkap artikel"></div>
    <div class="grup"><label>Untuk Bulan</label><select data-bulan>${bulanPilihan().filter((b) => b >= nowTanggal().slice(0, 7)).sort()
      .map((b) => `<option value="${b}">${esc(namaBulan(b))}</option>`).join('')}</select></div>
    <div class="grup" style="margin:0"><label>Catatan untuk PJ Artikel</label>
      <textarea data-catatan style="min-height:70px" placeholder="Garis besar pembahasan atau rujukan utama — opsional"></textarea>
      <div class="bantu">Usulan menjadi draf di daftar tulisan Anda. Bila disetujui PJ Artikel, ia menjadi penugasan bertenggat.</div></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Usulkan</button></div>`);
  modal({ judul: 'Usulkan judul artikel', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    if (aman(() => Store.usulkanJudul(U, { judul: isi.querySelector('[data-judul]').value, bulan: isi.querySelector('[data-bulan]').value,
      catatan: isi.querySelector('[data-catatan]').value }))) { tutupModal(); toast('Usulan terkirim ke PJ Artikel.'); gambar(); }
  };
}

/** Baca naskah utuh beserta riwayat tinjauannya — tanpa membuka formulir sunting. */
function bacaNaskah(a) {
  const st = STATUS_ART[a.status];
  const riwayat = a.riwayat || [];
  const isi = el(`<div>
    <p style="margin:0 0 12px;font-size:13px;color:var(--e-abu)">${esc(Store.namaUser(a.penulisId))} · ${esc(a.kategori || '—')} · ${tgl(a.tanggal)}
      &nbsp;<span class="lencana ${st.c}">${st.l}</span>${(a.tag || []).length ? ` · ${a.tag.map(esc).join(', ')}` : ''}</p>
    ${a.ringkas ? `<p style="margin:0 0 14px;font-weight:600;color:#44534A">${esc(a.ringkas)}</p>` : ''}
    <div class="naskah-isi">${(a.isi || []).map((p) => `<p>${esc(p)}</p>`).join('') || '<p style="color:var(--e-abu)">Isi masih kosong.</p>'}</div>
    <h4 style="margin:18px 0 8px;font-size:13.4px">Riwayat tinjauan</h4>
    ${riwayat.length ? `<div class="naskah-riwayat">${[...riwayat].reverse().map((r) => `<div class="br">
      <span class="lencana ${STATUS_ART[r.ke]?.c || 'l-abu'}">${esc(STATUS_ART[r.ke]?.l || r.ke)}</span>
      <div><b>${esc(Store.namaUser(r.oleh))}</b> <span style="color:var(--e-abu)">· ${tgl(String(r.pada).slice(0, 10))}</span>
        ${r.catatan ? `<div class="ct">${esc(r.catatan)}</div>` : ''}</div></div>`).join('')}</div>`
      : '<p style="margin:0;font-size:12.8px;color:var(--e-abu)">Belum ada perpindahan status tercatat.</p>'}
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end"><button class="btn btn-garis" data-b>Tutup</button></div>`);
  modal({ judul: a.judul, isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
}

const JUDUL_ART = { review: 'Naskah Masuk', terbit: 'Artikel Terbit', draft: 'Draf', revisi: 'Menunggu Revisi' };

HAL.artikel = () => halamanArtikel(null);
HAL['daftar-artikel'] = () => halamanArtikel(null);
HAL['daftar-artikel'].judul = () => ['Daftar Artikel', 'Seluruh naskah anggota beserta statusnya.'];
HAL['artikel-masuk'] = () => halamanArtikel('review');
HAL['artikel-masuk'].judul = () => ['Artikel Masuk', 'Naskah yang menunggu tinjauan Anda.'];
HAL['artikel-terbit'] = () => halamanArtikel('terbit');
HAL['artikel-revisi'] = () => halamanArtikel('revisi');
HAL['artikel-revisi'].judul = () => ['Menunggu Revisi', 'Naskah yang dikembalikan dan belum dikirim ulang penulisnya.'];
HAL['artikel-saya'] = () => halamanArtikel(null, true);
HAL['artikel-saya'].judul = () => ['Tulisan Saya', 'Naskah Anda sendiri. Tulisan PJ Artikel diterbitkan Ketua Umum.'];
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
        cover,
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

  const kartuKajian = [];
  urut.forEach((k) => {
    const { datang: hadir, total } = Store.rekapKajian(k);
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
        ${lencanaKajian(k)}
        <div class="kanan" data-aksi></div>
      </div>
      <div class="panel-isi" style="padding-top:15px;padding-bottom:15px">
        <p style="margin:0 0 8px;font-size:13.2px"><b>Materi:</b> ${esc(k.materi)}</p>
        <p style="margin:0;font-size:13.2px"><b>Kehadiran:</b> ${hadir} dari ${total} peserta
        ${k.notulensi ? `<br><b>Notulensi:</b> <span style="color:var(--e-abu)">${esc(k.notulensi.slice(0, 170))}${k.notulensi.length > 170 ? '…' : ''}</span>` : ''}</p>
      </div>
    </div>`);
    const aks = n.querySelector('[data-aksi]');
    const btn = (l, ik, kls, fn) => { const b = el(`<button class="btn ${kls} btn-kecil">${ik} ${l}</button>`); b.onclick = fn; aks.appendChild(b); };

    if (RBAC.can(U, 'kajian.attendance')) {
      btn('Pindai', I.qr, 'btn-lime', () => modePresensi(k));
      btn('Absensi', I.grup, 'btn-garis', () => dialogAbsensi(k));
    }
    if (RBAC.can(U, 'kajian.notulensi')) btn('Notulensi', I.dok, 'btn-garis', () => dialogNotulensi(k));
    if (bisaKelola) {
      btn('', I.sunting, 'btn-garis btn-ikon', () => formKajian(k));
      btn('', I.hapus, 'btn-merah btn-ikon', () => konfirmasi('Hapus jadwal', `"${k.judul}" akan dihapus.`,
        () => aman(() => { Store.hapusKajian(U, k.id); toast('Jadwal dihapus.'); gambar(); })));
    }
    box.appendChild(n);
    kartuKajian.push(n);
  });
  if (bisaKelola && kartuKajian.length) {
    const wadahKajian = el('<div></div>');
    kartuKajian[0].before(wadahKajian);
    wadahKajian.append(...kartuKajian);
    pasangPilihKartu(wadahKajian, kartuKajian, urut, { satuan: 'jadwal kajian', hapus: (k) => Store.hapusKajian(U, k.id) });
  }
  return box;
};
HAL.kajian.judul = () => ['Jadwal Kajian', 'Perencanaan kajian, penugasan pemakalah, absensi, dan notulensi.'];

function formKajian(k) {
  /* Angkatan menentukan siapa yang boleh ditugasi: pemakalah, moderator,
     dan notulen diambil dari peserta angkatan kajian itu sendiri. */
  const angkatan = [...new Set([...(k?.angkatan ? [k.angkatan] : []), ...Store.angkatanPeserta()])]
    .sort((a, b) => urutAngkatan(a) - urutAngkatan(b));
  const awal = k?.angkatan || (angkatan.includes(angkatanAktif()) ? angkatanAktif() : angkatan[0]) || '';
  const jenjang = ['Tatsqif', 'Level 1', 'Level 2', 'Level 3'];
  const isi = el(`<div>
    <div class="grup"><label>Judul / Tema Kajian</label><input id="j" value="${esc(k?.judul || '')}" placeholder="Contoh: Nuzul al-Quran & Tahapan Penurunannya"></div>
    <div class="grid-form-3">
      <div class="grup"><label>Angkatan</label><select id="ak">
        ${angkatan.map((a) => `<option ${a === awal ? 'selected' : ''}>${esc(a)}</option>`).join('')}</select></div>
      <div class="grup"><label>Jenjang</label><select id="lv">
        ${jenjang.map((x) => `<option ${(k?.level || (awal === angkatanAktif() ? levelAktif() : jenjangAngkatan(awal))) === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="grup"><label>Jenis Kajian</label><select id="jn">
        <option value="reguler" ${k?.jenis !== 'tatsqif' ? 'selected' : ''}>Kajian Reguler (Makalah)</option>
        <option value="tatsqif" ${k?.jenis === 'tatsqif' ? 'selected' : ''}>Pembekalan Intensif (Tatsqif)</option></select></div>
    </div>
    <div class="grid-form-3">
      <div class="grup"><label>Tanggal</label><input type="date" id="tg" value="${k?.tanggal || ''}"></div>
      <div class="grup"><label>Jam Mulai</label><input type="time" id="jm" value="${k?.jam || '19:30'}"></div>
      <div class="grup"><label>Tempat</label><input id="tp" value="${esc(k?.tempat || 'Sekretariat IKPM Kairo')}"></div>
    </div>
    <div class="grid-form-3">
      <div class="grup"><label>Pemakalah</label><select id="pm"></select></div>
      <div class="grup"><label>Moderator</label><select id="md"></select></div>
      <div class="grup"><label>Notulen</label><select id="nt"></select></div>
    </div>
    <div class="bantu" data-ket-petugas style="margin:-6px 0 14px"></div>
    <div class="grid-form">
      <div class="grup"><label>Batas Terlambat (menit)</label>
        <input type="number" id="tl" min="0" max="180" step="1" value="${Store.toleransiKajian(k)}">
        <div class="bantu">Sesudah jam mulai. Lewat batas ini, yang memindai tetap masuk tetapi tercatat terlambat. Isi 0 bila tak ada kelonggaran.</div></div>
      <div class="grup"><label>Tenggat Makalah</label>
        <input type="date" id="tm" value="${esc(k?.tenggatMakalah || '')}">
        <div class="bantu">Kosong = tiga hari sebelum kajian. Tautan makalah, PPT, dan status revisinya diurus di halaman Materi & Makalah.</div></div>
    </div>
    <div class="grup"><label>Materi / Rujukan</label><textarea id="mt" style="min-height:80px">${esc(k?.materi || '')}</textarea></div>
  </div>`);
  const g = (id) => isi.querySelector('#' + id).value;

  /* Daftar petugas mengikuti angkatan. Petugas lama dari angkatan lain
     tetap ditampilkan, bertanda — tidak diam-diam dibuang dari kajiannya. */
  const petugas = { pm: 'pemakalahId', md: 'moderatorId', nt: 'notulenId' };
  const isiPetugas = (pertahankan) => {
    const peserta = Store.pesertaAngkatan(g('ak')).sort((a, b) => a.nama.localeCompare(b.nama));
    /* Giliran: yang paling jarang memegang tugas itu tampil paling atas,
       beserta hitungannya — kajian yang sedang disunting tidak dihitung. */
    const beban = new Map(Store.bebanTugas(g('ak'), Store.db.kajian.filter((x) => x.angkatan === g('ak') && x.level === g('lv') && x.id !== k?.id))
      .map((b) => [b.u.id, b]));
    Object.entries(petugas).forEach(([id, kunci]) => {
      const sel = isi.querySelector('#' + id);
      const kini = pertahankan ? sel.value : (k?.[kunci] || '');
      const asing = kini && !peserta.some((u) => u.id === kini) ? Store.getUser(kini) : null;
      sel.innerHTML = `<option value="">— belum ditentukan —</option>`
        + (asing ? `<option value="${asing.id}">${esc(asing.nama)} (${esc(asing.angkatan || 'angkatan lain')})</option>` : '')
        + [...peserta].sort((a, b) => (beban.get(a.id)?.[kunci] || 0) - (beban.get(b.id)?.[kunci] || 0)
            || (beban.get(a.id)?.total || 0) - (beban.get(b.id)?.total || 0) || a.nama.localeCompare(b.nama))
          .map((u) => `<option value="${u.id}">${esc(u.nama)} · ${beban.get(u.id)?.[kunci] || 0}× (total ${beban.get(u.id)?.total || 0})</option>`).join('');
      sel.value = [...sel.options].some((o) => o.value === kini) ? kini : '';
    });
    isi.querySelector('[data-ket-petugas]').textContent = peserta.length
      ? `Pilihan petugas: ${peserta.length} anggota aktif ${g('ak')}, diurutkan dari yang paling jarang memegang tugas itu. Satu orang hanya memegang satu tugas.`
      : `${g('ak')} belum punya anggota aktif.`;
  };
  isiPetugas(false);
  isi.querySelector('#ak').onchange = () => {
    if (!k) isi.querySelector('#lv').value = jenjangAngkatan(g('ak'));
    isiPetugas(true);
  };
  isi.querySelector('#lv').onchange = () => isiPetugas(true);

  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan Jadwal</button></div>`);
  modal({ judul: k ? 'Ubah Jadwal & Tugas' : 'Jadwalkan Kajian Baru', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    if (aman(() => Store.simpanKajian(U, {
      id: k?.id, judul: g('j').trim(), jenis: g('jn'), level: g('lv'), tanggal: g('tg'),
      jam: g('jm'), tempat: g('tp').trim(), pemakalahId: g('pm'), moderatorId: g('md'), materi: g('mt'),
      notulenId: g('nt'), angkatan: g('ak'),
      toleransi: Math.max(0, Math.round(Number(g('tl')) || 0)), tenggatMakalah: g('tm'),
    }))) { tutupModal(); toast('Jadwal kajian tersimpan.'); gambar(); }
  };
}

/** Tunda atau jadwalkan ulang. Tanggal baru boleh dikosongkan bila belum
    diketahui — kajiannya lalu berstatus ditunda. */
function dialogTundaKajian(k) {
  const ditunda = Store.keadaanKajian(k) === 'ditunda';
  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.6px;color:#44534A"><b>${esc(k.judul)}</b> · ${tgl(k.tanggal)} ${esc(k.jam || '')}</p>
    <div class="grid-form">
      <div class="grup"><label>Tanggal Baru${ditunda ? '' : ' (boleh kosong)'}</label><input type="date" data-tgl min="${nowTanggal()}"></div>
      <div class="grup"><label>Jam Mulai</label><input type="time" data-jam value="${esc(k.jam || '19:30')}"></div>
    </div>
    <div class="grup" style="margin:0"><label>Alasan</label>
      <textarea data-alasan style="min-height:70px" placeholder="Contoh: pemakalah berhalangan, bertepatan dengan ujian"></textarea>
      <div class="bantu">${ditunda ? 'Kajian kembali terjadwal pada tanggal baru.'
        : 'Tanpa tanggal baru, kajian berstatus Ditunda dan tidak dihitung sampai dijadwalkan ulang.'}</div></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Tutup</button>
    <button class="btn btn-lime" data-y>${ditunda ? 'Jadwalkan Ulang' : 'Tunda Kajian'}</button></div>`);
  modal({ judul: ditunda ? 'Jadwalkan ulang kajian' : 'Tunda kajian', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-y]').onclick = () => {
    const tanggal = isi.querySelector('[data-tgl]').value;
    if (aman(() => Store.tundaKajian(U, k.id, { tanggal, jam: isi.querySelector('[data-jam]').value,
      alasan: isi.querySelector('[data-alasan]').value }))) {
      tutupModal(); toast(tanggal ? `Kajian dipindah ke ${tgl(tanggal)}.` : 'Kajian ditunda.'); gambar();
    }
  };
}

function dialogBatalKajian(k) {
  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.6px;color:#44534A"><b>${esc(k.judul)}</b> · ${tgl(k.tanggal)}</p>
    <div class="grup" style="margin:0"><label>Alasan pembatalan</label>
      <textarea data-alasan style="min-height:76px" placeholder="Contoh: tema digabung ke pertemuan berikutnya, libur bersama"></textarea>
      <div class="bantu">Kajian yang dibatalkan tetap tercatat beserta alasannya, tetapi tidak dihitung dalam kehadiran, rekap, dan antrean. Ia dapat dipulihkan.</div></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Tutup</button><button class="btn btn-merah" data-y>Batalkan Kajian</button></div>`);
  modal({ judul: 'Batalkan kajian', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-y]').onclick = () => {
    if (aman(() => Store.batalkanKajian(U, k.id, isi.querySelector('[data-alasan]').value))) {
      tutupModal(); toast('Kajian dibatalkan.'); gambar();
    }
  };
}

function dialogAbsensi(k) {
  const id = k.id;
  const kini = () => Store.db.kajian.find((x) => x.id === id) || k;
  const peserta = () => Store.pesertaKajian(kini()).sort((a, b) => a.nama.localeCompare(b.nama));
  const cari = (uid) => (kini().presensi || []).find((p) => p.userId === uid);
  const kelola = RBAC.can(U, 'kajian.manage');

  const isi = el(`<div>
    <p style="margin:0 0 12px;font-size:13.4px;color:var(--e-abu)">
      Kehadiran peserta pada kajian <b>${esc(k.judul)}</b>${k.angkatan ? ` · ${esc(k.angkatan)}` : ''} · ${tgl(k.tanggal)}.</p>
    <div data-kunci></div>
    <div class="daftar-presensi"></div>
    <p style="margin:16px 0 0;font-size:13px"><b data-hit></b></p>
  </div>`);
  const wadah = isi.querySelector('.daftar-presensi');
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end;align-items:center">
    <span data-aksi-kunci style="margin-right:auto"></span>
    <button class="btn btn-lime" data-s>Selesai</button></div>`);

  const label = { hadir: 'Hadir', terlambat: 'Terlambat', izin: 'Izin', sakit: 'Sakit', 'tidak-hadir': 'Tidak Hadir' };
  const gambarIsi = () => {
    const kj = kini();
    const terkunci = !!kj.presensiTutup;
    const bolehUbah = !terkunci || kelola;
    const r = Store.rekapKajian(kj);
    isi.querySelector('[data-hit]').textContent =
      `${r.hadir} hadir · ${r.terlambat} terlambat · ${r.izin} izin/sakit · ${r.tidakHadir} tidak hadir · ${r.belum} belum absen`;

    isi.querySelector('[data-kunci]').innerHTML = terkunci ? `<div class="notis notis-kuning" style="margin-bottom:12px">${I.gembok}<div>
      <b>Presensi ditutup ${tgl(kj.presensiTutup.slice(0, 10))}${kj.presensiTutupOleh ? ` oleh ${esc(namaPendek(kj.presensiTutupOleh))}` : ''}</b>
      ${kelola ? `Perubahan masih mungkin, tetapi wajib beralasan dan tercatat.
        <input data-alasan-ubah placeholder="Alasan perubahan — contoh: salah catat, bukti hadir menyusul" style="margin-top:8px">`
        : 'Hanya koordinator kajian yang dapat mengubahnya.'}
      ${(kj.ubahPresensi || []).length ? `<div style="margin-top:8px;font-size:12px">${kj.ubahPresensi.slice(-3).reverse().map((x) =>
        `• ${x.userId ? esc(namaPendek(x.userId)) + ': ' : ''}${esc(x.dari || 'belum absen')} → ${esc(x.ke)} — ${esc(x.alasan)} (${esc(namaPendek(x.oleh))})`).join('<br>')}</div>` : ''}
    </div></div>` : '';

    const aksi = kaki.querySelector('[data-aksi-kunci]');
    aksi.innerHTML = terkunci
      ? (kelola ? `<button class="btn btn-garis" data-buka>${I.gembok} Buka Kembali</button>` : '')
      : `<button class="btn btn-merah" data-tutup title="Yang belum tercatat menjadi tidak hadir, lalu presensi dikunci">${I.gembok} Tutup Presensi</button>`;
    /* Dua ketukan, bukan dialog konfirmasi: dialog itu akan menggantikan
       daftar presensi yang sedang dibuka. */
    aksi.querySelector('[data-tutup]')?.addEventListener('click', async (e) => {
      const b = e.currentTarget;
      if (!b.dataset.yakin) {
        b.dataset.yakin = '1';
        b.textContent = `Yakin? ${r.belum} orang menjadi tidak hadir — ketuk lagi`;
        return;
      }
      const n = await amanTunggu(null, () => Store.tutupPresensi(U, id));
      if (n !== null) toast(`Presensi ditutup. ${n} orang dicatat tidak hadir.`);
      gambarIsi();
    });
    aksi.querySelector('[data-buka]')?.addEventListener('click', async () => {
      const alasan = isi.querySelector('[data-alasan-ubah]')?.value.trim();
      if (!alasan) return toast('Isi alasan pada kotak di atas lebih dulu.', true);
      if (await amanTunggu(null, async () => { await Store.bukaPresensi(U, id, alasan); return true; })) { toast('Presensi dibuka kembali.'); gambarIsi(); }
    });

    wadah.innerHTML = '';
    peserta().forEach((u) => {
      const p = cari(u.id);
      const jatah = Store.jatahIzin(u.id, kj);
      const sudahIzin = p?.status === 'izin' || p?.status === 'sakit';
      const baris = el(`<div class="presensi-baris${p ? '' : ' belum'}">
        <img src="${u.foto}" alt=""><span class="nm">${esc(u.nama)}
          ${p?.alasan ? `<small>${esc(p.alasan)}</small>` : ''}</span>
        <span class="jm">${esc(p?.jam || '')}</span>
        <span class="pilih">${Store.STATUS_PRESENSI.map((st) => {
          const habis = (st === 'izin' || st === 'sakit') && !sudahIzin && jatah.sisa === 0;
          return `<button data-st="${st}" class="${p?.status === st ? 'aktif' : ''}" ${!bolehUbah || habis ? 'disabled' : ''}
            title="${habis ? `Jatah izin/sakit habis (${jatah.terpakai}/${jatah.batas})` : ''}">${label[st]}</button>`; }).join('')}
          ${p && bolehUbah ? `<button data-st="kosong" title="Hapus catatan — kembali ke belum absen">${I.tutup}</button>` : ''}</span>
      </div>`);
      const catat = async (st, alasan) => {
        const alasanUbah = isi.querySelector('[data-alasan-ubah]')?.value.trim() || '';
        if (terkunci && !alasanUbah) return toast('Presensi sudah ditutup — isi alasan perubahan di atas lebih dulu.', true);
        baris.classList.add('sibuk');
        await amanTunggu(null, () => Store.setPresensi(U, id, u.id, st, { alasan, alasanUbah }));
        gambarIsi();
      };
      baris.querySelectorAll('[data-st]').forEach((b) => {
        b.onclick = () => {
          const st = b.dataset.st;
          if (st !== 'izin' && st !== 'sakit') return catat(st);
          /* Izin dan sakit menuntut alasan: kotaknya dibuka di baris itu juga. */
          baris.querySelector('.alasan-izin')?.remove();
          const kotak = el(`<span class="alasan-izin"><input placeholder="Alasan ${st} (jatah tersisa ${jatah.sisa} dari ${jatah.batas})" value="${esc(sudahIzin ? p.alasan || '' : '')}">
            <button class="btn btn-lime btn-kecil">Catat ${label[st]}</button></span>`);
          baris.appendChild(kotak);
          kotak.querySelector('input').focus();
          const kirim = () => catat(st, kotak.querySelector('input').value.trim());
          kotak.querySelector('button').onclick = kirim;
          kotak.querySelector('input').onkeydown = (e) => { if (e.key === 'Enter') kirim(); };
        };
      });
      wadah.appendChild(baris);
    });
  };
  gambarIsi();
  modal({ judul: 'Presensi Kehadiran', isi, kaki, lebar: true });
  kaki.querySelector('[data-s]').onclick = () => { tutupModal(); gambar(); };
}

const NOTULEN = {
  kosong  : { l: 'Belum Ditulis',        c: 'l-abu'    },
  draf    : { l: 'Draf',                 c: 'l-kuning' },
  diajukan: { l: 'Menunggu Pengesahan',  c: 'l-biru'   },
  sah     : { l: 'Sah',                  c: 'l-hijau'  },
};
const lencanaNotulen = (k) => { const n = NOTULEN[Store.statusNotulen(k)]; return `<span class="lencana ${n.c}">${n.l}</span>`; };

/** Lembar notulen siap cetak: kop, data kajian, empat bagian, tanda tangan. */
function lembarNotulen(k) {
  const s = Store.cms.situs;
  const n = Store.isiNotulen(k);
  const r = Store.rekapKajian(k);
  const data = [['Hari, tanggal', tglSurat(k.tanggal)], ['Waktu', `${k.jam || '—'} WK`], ['Tempat', k.tempat || '—'],
    ['Angkatan / Jenjang', `${k.angkatan || '—'} / ${k.level || '—'}`], ['Pemakalah', Store.namaUser(k.pemakalahId)],
    ['Moderator', Store.namaUser(k.moderatorId)], ['Notulen', Store.namaUser(k.notulenId)],
    ['Kehadiran', (k.presensi || []).length ? `${r.datang} dari ${r.total} peserta (${r.persen}%) · ${r.terlambat} terlambat · ${r.izin} izin/sakit · ${r.tidakHadir} tidak hadir` : 'belum dicatat']];
  return el(`<div class="lk">
    <div class="lk-kop">${lambang(40)}<div><b>KAJIAN ${esc(String(s.nama).toUpperCase())}</b><span>${esc(s.naungan || s.tagline || '')}</span></div></div>
    <h2>Notulen Kajian</h2>
    <p class="lk-periode">${esc(k.judul)}</p>
    <table><tbody>${data.map(([l, v]) => `<tr><td style="width:42mm;font-weight:700">${l}</td><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
    ${Store.BAGIAN_NOTULEN.map(([kunci, label]) => `<h3>${label}</h3>
      <div style="font-size:10.5pt;line-height:1.55;white-space:pre-wrap">${n[kunci] ? esc(n[kunci]) : '<i style="color:#666">—</i>'}</div>`).join('')}
    <div class="lk-ttd">
      <div>Notulen,<div class="lk-ruang"></div><b>${esc(Store.namaUser(k.notulenId))}</b></div>
      <div>Mengesahkan,<div class="lk-ruang"></div><b>${esc(n.disahkanOleh ? Store.namaUser(n.disahkanOleh) : '………………………')}</b></div>
    </div>
    ${Store.statusNotulen(k) === 'sah' ? '' : '<p class="lk-catatan">Dokumen ini belum disahkan.</p>'}
  </div>`);
}
const cetakNotulen = (k) => cetakKhusus(lembarNotulen(k), '@page { size: A4; margin: 15mm; }', `Notulen ${k.tanggal} ${k.judul}`);

/** Notulen satu kajian. Pengurus notulen (koordinator, sekretaris, ketua)
    menulis dan mengesahkan; petugas notulen yang bukan pengurus menulis
    lalu mengajukannya. Nama lama dipertahankan — tiga halaman memanggilnya. */
function dialogNotulensi(k) {
  const pengurus = RBAC.can(U, 'kajian.notulensi');
  const petugas = k.notulenId === U.id;
  const st = Store.statusNotulen(k);
  const n = Store.isiNotulen(k);
  const terkunci = st === 'sah' || (!pengurus && !petugas);
  const isi = el(`<div>
    <p style="margin:0 0 12px;font-size:13.4px;color:var(--e-abu)"><b>${esc(k.judul)}</b> · ${tgl(k.tanggal)} · notulen ${esc(namaPendek(k.notulenId))}
      &nbsp;${lencanaNotulen(k)}${n.disahkanPada ? ` · disahkan ${esc(namaPendek(n.disahkanOleh))}, ${tgl(n.disahkanPada.slice(0, 10))}` : ''}</p>
    ${n.catatan && st !== 'sah' ? `<div class="notis notis-kuning" style="margin-bottom:12px">${I.info}<div><b>Dikembalikan untuk diperbaiki</b>${esc(n.catatan)}</div></div>` : ''}
    ${Store.BAGIAN_NOTULEN.map(([kunci, label], i) => `<div class="grup"><label>${label}${i ? '' : ' *'}</label>
      <textarea data-bag="${kunci}" style="min-height:${i ? 80 : 130}px" ${terkunci ? 'readonly' : ''} placeholder="${
        ['Apa yang dipaparkan pemakalah, secara ringkas.', 'Pertanyaan, tanggapan, dan perbedaan pendapat yang muncul.',
         'Simpulan yang disepakati.', 'Yang perlu dikerjakan sesudah kajian, dan oleh siapa.'][i]}">${esc(n[kunci] || '')}</textarea></div>`).join('')}
    ${pengurus && st === 'diajukan' ? `<div class="grup" style="margin:0"><label>Catatan bila dikembalikan</label>
      <input data-catatan placeholder="Apa yang perlu diperbaiki notulen"></div>` : ''}
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end;flex-wrap:wrap">
    <button class="btn btn-garis" data-cetak style="margin-right:auto">${I.unduh} Cetak / PDF</button>
    <button class="btn btn-garis" data-b>Tutup</button>
    ${st === 'sah' ? (pengurus ? '<button class="btn btn-garis" data-buka>Buka Kembali</button>' : '')
      : pengurus ? `${st === 'diajukan' ? '<button class="btn btn-merah" data-kembali>Kembalikan</button>' : ''}
          <button class="btn btn-garis" data-simpan>Simpan Draf</button><button class="btn btn-lime" data-sah>Sahkan</button>`
      : petugas ? '<button class="btn btn-garis" data-simpan>Simpan Draf</button><button class="btn btn-lime" data-ajukan>Ajukan untuk Disahkan</button>' : ''}
  </div>`);
  modal({ judul: 'Notulen kajian', isi, kaki, lebar: true });
  const baca = () => Object.fromEntries(Store.BAGIAN_NOTULEN.map(([kunci]) => [kunci, isi.querySelector(`[data-bag="${kunci}"]`).value]));
  const usai = (pesan) => { tutupModal(); toast(pesan); gambar(); };
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-cetak]').onclick = () => cetakNotulen(k);
  const pasang = (pilih, fn) => kaki.querySelector(pilih)?.addEventListener('click', fn);
  if (pengurus) {
    pasang('[data-simpan]', () => { if (aman(() => Store.simpanNotulen(U, k.id, baca(), 'simpan'))) usai('Draf notulen tersimpan.'); });
    pasang('[data-sah]', () => { if (aman(() => Store.simpanNotulen(U, k.id, baca(), 'sahkan'))) usai('Notulen disahkan.'); });
    pasang('[data-kembali]', () => { if (aman(() => Store.simpanNotulen(U, k.id, baca(), 'kembalikan', isi.querySelector('[data-catatan]').value))) usai('Notulen dikembalikan kepada penulisnya.'); });
    pasang('[data-buka]', () => { if (aman(() => Store.simpanNotulen(U, k.id, null, 'buka'))) usai('Notulen dibuka kembali sebagai draf.'); });
  } else if (petugas) {
    const kirim = (ajukan) => async (e) => {
      if (await amanTunggu(e.currentTarget, async () => { await Store.kirimNotulen(k.id, baca(), ajukan); return true; }))
        usai(ajukan ? 'Notulen diajukan untuk disahkan.' : 'Draf notulen tersimpan.');
    };
    pasang('[data-simpan]', kirim(false));
    pasang('[data-ajukan]', kirim(true));
  }
}

/* ============================================================
   DATA ANGGOTA
   ============================================================ */
HAL.anggota = () => {
  /* Menyetel ulang sandi orang lain dibuka bagi pemegang anggota.manage
     — Sekretaris — sebab layar masuk memang menyuruh menghubunginya.
     Servernya menolak bila sasarannya Ketua Umum dan yang menyetel
     bukan Ketua. */
  const bisaSetel = RBAC.canAny(U, ['anggota.manage', 'user.manage']);

  /* Akun sendiri tak dapat dihapus, dan akun pemegang wewenang tertinggi
     hanya oleh sesamanya — aturan yang sama ditegakkan ulang di server. */
  const bisaHapus = RBAC.can(U, 'anggota.manage');
  const bolehHapus = (u) => bisaHapus && u.id !== U.id
    && (!RBAC.can(u, 'user.manage') || RBAC.can(U, 'user.manage'));
  const terpilih = new Set();

  const box = el(`<div><div class="panel-kepala" style="background:#fff;border:1px solid var(--e-garis);border-radius:var(--e-radius);margin-bottom:18px">
    <h3>Data Keanggotaan</h3><span class="ket">${Store.db.users.length} orang terdaftar</span>
    <div class="kanan">
      <button class="btn btn-merah btn-kecil" id="bh" hidden>${I.hapus} <span></span></button>
      <button class="btn btn-lime btn-kecil" id="ba">${I.tambah} Tambah Anggota</button></div></div></div>`);
  box.querySelector('#ba').onclick = () => formAnggota(null);

  const p = el(`<div class="panel"><div class="tabel-bungkus"><table>
    <thead><tr>
      ${bisaHapus ? `<th class="kol-pilih"><button class="cek-kotak" data-semua title="Pilih semua">${I.cek}</button></th>` : ''}
      <th class="kol-no">No</th><th>Nama</th><th>Jabatan / Role</th><th>Angkatan</th><th>Jenjang</th><th>Status</th><th></th></tr></thead>
    <tbody></tbody></table></div></div>`);
  const tb = p.querySelector('tbody');
  const bh = box.querySelector('#bh');
  const semua = p.querySelector('[data-semua]');
  const dapatDipilih = Store.db.users.filter(bolehHapus);

  const segarkanPilihan = () => {
    bh.hidden = !terpilih.size;
    bh.querySelector('span').textContent = `Hapus Terpilih (${terpilih.size})`;
    semua?.classList.toggle('on', !!dapatDipilih.length && terpilih.size === dapatDipilih.length);
    tb.querySelectorAll('[data-pilih]').forEach((b) => b.classList.toggle('on', terpilih.has(b.dataset.pilih)));
  };
  if (semua) {
    semua.disabled = !dapatDipilih.length;
    semua.onclick = () => {
      const penuh = terpilih.size === dapatDipilih.length;
      terpilih.clear();
      if (!penuh) dapatDipilih.forEach((u) => terpilih.add(u.id));
      segarkanPilihan();
    };
  }
  bh.onclick = () => hapusAnggota(Store.db.users.filter((u) => terpilih.has(u.id)));

  Store.db.users.forEach((u, i) => {
    const boleh = bolehHapus(u);
    const tr = el(`<tr>
      ${bisaHapus ? `<td class="kol-pilih"><button class="cek-kotak" data-pilih="${esc(u.id)}" ${boleh ? '' : 'disabled'}
        title="${boleh ? 'Pilih' : u.id === U.id ? 'Akun Anda sendiri' : 'Hanya Ketua Umum yang dapat menghapus akun ini'}">${I.cek}</button></td>` : ''}
      <td class="kol-no">${i + 1}</td>
      <td><div style="display:flex;align-items:center;gap:11px">
        <img src="${u.foto}" style="width:36px;height:36px;border-radius:50%">
        <div><b>${esc(u.nama)}</b><br><span style="color:var(--e-abu);font-size:12px">${u.nia ? `<span class="nia">${esc(u.nia)}</span> · ` : ''}${esc(u.email)}</span></div></div></td>
      <td><span class="lencana" style="background:${RBAC.roleColor(u.role)}22;color:${RBAC.roleColor(u.role)}">${esc(RBAC.roleLabel(u.role))}</span></td>
      <td>${esc(u.angkatan)}</td><td>${esc(u.level)}</td>
      <td><span class="lencana ${u.status === 'aktif' ? 'l-hijau' : u.status === 'alumni' ? 'l-biru' : 'l-abu'}">${esc(u.status)}</span></td>
      <td class="aksi-sel"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Ubah data">${I.sunting}</button>
        ${bisaSetel ? `<button class="ikon-aksi" data-sandi title="Setel ulang kata sandi">${I.gembok}</button>` : ''}
        ${boleh ? `<button class="ikon-aksi hapus" title="Hapus anggota">${I.hapus}</button>` : ''}
      </div></td>
    </tr>`);
    tr.querySelector('.sunting').onclick = () => formAnggota(u);
    tr.querySelector('[data-sandi]')?.addEventListener('click', () => setelSandiAnggota(u));
    tr.querySelector('.ikon-aksi.hapus')?.addEventListener('click', () => hapusAnggota([u]));
    tr.querySelector('[data-pilih]')?.addEventListener('click', () => {
      terpilih.has(u.id) ? terpilih.delete(u.id) : terpilih.add(u.id);
      segarkanPilihan();
    });
    tb.appendChild(tr);
  });
  box.appendChild(p);
  return box;
};
HAL.anggota.judul = () => ['Data Anggota', 'Keanggotaan, jenjang kajian, dan penetapan jabatan.'];

/** Hapus satu atau beberapa anggota sekaligus, sesudah ditegaskan. */
function hapusAnggota(daftar) {
  if (!daftar.length) return;
  const siapa = daftar.length === 1 ? daftar[0].nama : `${daftar.length} anggota`;
  konfirmasi('Hapus anggota',
    `${siapa} akan dihapus permanen beserta akun masuknya. Tindakan ini tidak dapat dibatalkan.`,
    () => {
      if (aman(() => Store.hapusAnggota(U, daftar.map((u) => u.id)))) {
        toast(daftar.length === 1 ? `${daftar[0].nama} dihapus.` : `${daftar.length} anggota dihapus.`);
      }
      gambar();
    }, 'Ya, hapus');
}

/**
 * Setel ulang kata sandi seorang anggota, lalu tampilkan sandinya
 * sekali. Ditegaskan lebih dulu: ini membuat sandi lama TIDAK berlaku,
 * dan orang yang sedang memakainya akan terkunci sampai menerima yang
 * baru.
 */
function setelSandiAnggota(u) {
  konfirmasi('Setel ulang kata sandi',
    `Kata sandi ${u.nama} akan diganti dengan yang baru. Sandi lamanya langsung tidak berlaku, `
    + 'dan sandi baru hanya ditampilkan sekali — salin sebelum menutup jendelanya.',
    async () => {
      const d = await amanTunggu(null, () => Store.setelSandi(u.id));
      if (!d) return;
      const isi = el(`<div>
        <p style="margin:0 0 14px;font-size:14px;color:#44534A">
          Sampaikan kata sandi ini kepada <b>${esc(d.nama)}</b>. Ia akan diminta menggantinya
          saat pertama masuk, dan sandi ini <b>tidak dapat dilihat lagi</b> setelah jendela ditutup.</p>
        <div class="kartu-sandi">
          <table class="tbl-sandi"><tbody>
            <tr><td>Email</td><td><code>${esc(d.email)}</code></td></tr>
            <tr><td>Sandi baru</td><td><code style="font-size:17px">${esc(d.sandi)}</code></td></tr>
          </tbody></table>
          <div class="ks-aksi"><button class="btn btn-garis" data-salin>Salin</button></div>
        </div></div>`);
      modal({ judul: 'Kata sandi baru', isi });
      isi.querySelector('[data-salin]').onclick = () => {
        navigator.clipboard.writeText(`${d.email}\t${d.sandi}`).then(
          () => toast('Disalin ke papan klip.'),
          () => toast('Peramban menolak menyalin. Salin manual dari tabel.', true));
      };
      gambar();
    }, 'Ya, setel ulang');
}

function formAnggota(u) {
  const bisaRole = RBAC.can(U, 'user.manage');
  const bisaDiri = RBAC.canAny(U, ['anggota.manage', 'user.manage']);
  const diri = u ? Store.dataDiri(u.id) : {};
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
        <select id="r" ${bisaRole ? '' : 'disabled'}>${Object.entries(RBAC.ROLES).map(([k, v]) => `<option value="${k}" ${(u?.role || 'anggota') === k ? 'selected' : ''}>${esc(v.label)}</option>`).join('')}</select>
        <div class="bantu">${bisaRole ? 'Menentukan menu dan wewenang orang ini di ERP.' : 'Hanya Ketua Umum yang dapat mengubah role.'}</div></div>
      <div class="grup"><label>Label di Website</label>
        <select id="kt">${['pendiri', 'anggota', 'alumni'].map((x) => `<option ${(u?.kategori || 'anggota') === x ? 'selected' : ''}>${x}</option>`).join('')}</select>
        <div class="bantu">Pil yang tampil di kartu: Pendiri, Anggota Aktif, atau Alumni.</div></div>
    </div>
    <div class="grup"><label>Jabatan di Kajian</label>
      <input id="jb" value="${esc(u?.jabatan || '')}" placeholder="${esc(RBAC.roleLabel(u?.role || 'anggota'))}">
      <div class="bantu">Jabatan organisasi yang tampil di halaman Tentang. Berbeda dari role ERP di
        atas — role menentukan wewenang, ini menentukan sebutan. Dikosongkan berarti mengikuti role.</div></div>
    <div class="grup"><label>Riwayat Pendidikan</label><input id="p" value="${esc(u?.pendidikan || '')}" placeholder="S1 Tafsir & Ilmu al-Quran, Universitas Al-Azhar Kairo"></div>
    ${bisaDiri ? `<div class="fa-diri">
      <div class="fa-diri-kepala">${I.perisai}<div><b>Data Diri</b>
        <span>Hanya terlihat Sekretaris dan Ketua Umum. Tidak tampil di website maupun di kartu anggota.</span></div></div>
      <div class="fa-foto"><img data-foto src="${esc(diri.foto || u?.foto || window.__avatar('Anggota', '#5B7C5F'))}" alt="">
        <div><label class="btn btn-garis btn-kecil" style="cursor:pointer;margin:0">${I.gambar} Ganti Pas Foto<input type="file" accept="image/jpeg,image/png,image/webp" hidden data-berkas></label>
          <div class="bantu">Dipakai pada kartu anggota saja. Tidak tampil di website.</div></div></div>
      <div class="grid-form">
        <div class="grup"><label>Nomor Paspor</label><input id="dp" value="${esc(diri.paspor || '')}" autocomplete="off" placeholder="C1234567"></div>
        <div class="grup"><label>Telepon / WhatsApp</label><input id="dt" value="${esc(diri.telepon || '')}" placeholder="+20 100 000 0000"></div>
      </div>
      <div class="grid-form">
        <div class="grup"><label>Tempat Lahir</label><input id="dl" value="${esc(diri.tempatLahir || '')}"></div>
        <div class="grup"><label>Tanggal Lahir</label><input type="date" id="dg" value="${esc(diri.tglLahir || '')}"></div>
      </div>
      <div class="grup" style="margin-bottom:0"><label>Alamat</label><textarea id="da" style="min-height:66px">${esc(diri.alamat || '')}</textarea></div>
    </div>` : ''}
  </div>`);
  let fotoBaru = '';
  isi.querySelector('[data-berkas]')?.addEventListener('change', async (e) => {
    const berkas = e.target.files[0]; if (!berkas) return;
    try { fotoBaru = await Store.unggahGambar(berkas, 480); isi.querySelector('[data-foto]').src = fotoBaru; }
    catch (galat) { toast(galat.message, true); }
    e.target.value = '';
  });
  const bisaSetel = u && RBAC.canAny(U, ['anggota.manage', 'user.manage']);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    ${bisaSetel ? `<button class="btn btn-garis" data-sandi style="margin-right:auto">${I.gembok} Setel Ulang Sandi</button>` : ''}
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: u ? 'Ubah Data Anggota' : 'Tambah Anggota Baru', isi, kaki, lebar: true });
  kaki.querySelector('[data-sandi]')?.addEventListener('click', () => { tutupModal(); setelSandiAnggota(u); });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const g = (id) => isi.querySelector('#' + id).value;
    if (!g('n').trim() || !g('e').trim()) return toast('Nama dan email wajib diisi.', true);
    aman(() => {
      const tersimpan = Store.simpanAnggota(U, {
        id: u?.id, nama: g('n').trim(), email: g('e').trim(), angkatan: g('a'), level: g('l'),
        status: g('s'), role: g('r'), kategori: g('kt'), pendidikan: g('p'), jabatan: g('jb').trim(),
      });
      if (bisaDiri) Store.simpanDataDiri(U, tersimpan.id, {
        paspor: g('dp'), telepon: g('dt'), tempatLahir: g('dl'), tglLahir: g('dg'), alamat: g('da'),
        ...(fotoBaru ? { foto: fotoBaru } : {}) });
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
    <thead><tr><th class="kol-no">No</th><th>Nomor</th><th>Jenis</th><th>Perihal</th><th>Tujuan / Asal</th><th>Tanggal</th><th>Status</th></tr></thead>
    <tbody>${Store.db.surat.map((s, i) => `<tr>
      <td class="kol-no">${i + 1}</td>
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
  const d = Store.kasSah().filter((t) => t.jenis !== 'transfer');
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
    <thead><tr><th class="kol-no">No</th><th>Tanggal</th><th>Kategori</th><th>Keterangan</th><th style="text-align:right">Masuk</th><th style="text-align:right">Keluar</th>${bisa ? '<th></th>' : ''}</tr></thead>
    <tbody></tbody></table></div></div>`);
  const tb = p.querySelector('tbody');
  const urut = [...d].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  urut.forEach((t, i) => {
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
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
  if (bisa) pasangPilih(p, urut, { satuan: 'transaksi', hapus: (t) => Store.hapusTransaksi(U, t.id) });
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
      <div class="grup"><label>Tanggal</label><input type="date" id="tg" value="${t?.tanggal || nowTanggal()}"></div>
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

/* --- program kerja: waktu, keterlambatan, urutan ---
   "Terlambat" bukan status yang disimpan. Ia diturunkan dari tanggal
   selesai dan hari ini, sehingga tak pernah perlu dirawat tangan dan
   tak pernah basi: program yang lewat tenggat tampil terlambat dengan
   sendirinya, dan berhenti begitu ditandai selesai. */
const terlambatProgram = (k) => k.status !== 'selesai' && !!k.tglSelesai && k.tglSelesai < nowTanggal();
const lencanaProgram = (k) => (terlambatProgram(k)
  ? '<span class="lencana l-merah">Terlambat</span>'
  : `<span class="lencana ${STATUS_KEG[k.status]?.c || 'l-abu'}">${esc(STATUS_KEG[k.status]?.l || k.status)}</span>`);

/** Rentang waktu sebagai teks. Sebulan penuh ditulis ringkas ("Mei
    2025"); selebihnya tanggal mulai dan selesainya. Program yang belum
    bertanggal memakai teks lamanya. */
function waktuProgram(k) {
  if (!k.tglMulai) return k.waktu || '—';
  const a = k.tglMulai, b = k.tglSelesai || k.tglMulai;
  const akhirBulan = new Date(Number(b.slice(0, 4)), Number(b.slice(5, 7)), 0).getDate();
  if (a.slice(0, 7) === b.slice(0, 7) && a.slice(8) === '01' && Number(b.slice(8)) === akhirBulan)
    return new Date(`${a}T00:00`).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  return a === b ? tgl(a) : `${tgl(a)} – ${tgl(b)}`;
}
/** Menurut tanggal mulai; yang belum bertanggal di akhir. */
const urutProgram = (a, b) => (a.tglMulai || '9999').localeCompare(b.tglMulai || '9999');

/* --- pengurus & koordinator: terhubung ke Data Anggota ---
   Keduanya tetap daftar tersendiri — jabatan dan nomor WA memang milik
   daftar ini — tetapi orangnya dipilih dari Data Anggota. Selama
   terhubung, nama yang tampil adalah nama di Data Anggota saat ini;
   nama yang tersimpan di baris hanya cadangan bila tautannya putus
   (anggotanya dihapus) atau memang orang luar. */
const orangTerhubung = (x) => (x.userId ? Store.getUser(x.userId) : null);
/* `kunci` adalah kolom yang menyimpan namanya — `nama` pada pengurus,
   koordinator, dan tanda tangan; `penerima` pada sertifikat. */
const namaOrang = (x, kunci = 'nama') => orangTerhubung(x)?.nama || x[kunci] || '—';
/** Sel nama. `tandai` menyalakan peringatan bagi yang tak terhubung —
    dimatikan pada sertifikat, yang penerimanya boleh sebuah kelompok. */
const selOrang = (x, kunci = 'nama', tandai = true) => {
  const u = orangTerhubung(x);
  if (u) return selAnggota(u);
  return `${esc(x[kunci] || '—')}${tandai ? '<br><span class="sub-sel perlu">belum terhubung ke Data Anggota</span>' : ''}`;
};
const kolomPilihOrang = {
  k: 'userId', l: 'Anggota', jenis: 'pilih',
  pilihan: () => [{ v: '', l: '— bukan anggota terdaftar (isi nama di bawah) —' },
    ...[...Store.db.users].sort((a, b) => a.nama.localeCompare(b.nama))
      .map((u) => ({ v: u.id, l: `${u.nama}${u.angkatan ? ` · ${u.angkatan}` : ''}` }))],
  bantu: 'Dipilih dari Data Anggota. Bila nama di sana berubah, nama di daftar ini ikut berubah.',
};
const kolomNamaOrang = { k: 'nama', l: 'Nama Lengkap', ph: 'Nama lengkap',
  bantu: 'Diisi hanya bila orangnya tidak ada di Data Anggota.' };
/** Memilih anggota mengisi dan mengunci kolom nama; melepasnya membuka lagi. */
function kunciNamaOrang(isi, kunci = 'nama') {
  const pilih = isi.querySelector('[data-k="userId"]');
  const nama = isi.querySelector(`[data-k="${kunci}"]`);
  const selaras = () => {
    const u = Store.getUser(pilih.value);
    nama.disabled = !!u;
    if (u) nama.value = u.nama;
  };
  pilih.onchange = selaras;
  selaras();
}
function rapikanOrang(d, kunci = 'nama', pesan = 'Pilih anggota, atau isi nama lengkapnya.') {
  if (d.userId) {
    const u = Store.getUser(d.userId);
    if (!u) throw new Error('Anggota yang dipilih tidak ditemukan.');
    return { ...d, [kunci]: u.nama };
  }
  if (!d[kunci]) throw new Error(pesan);
  return d;
}

/* --- evaluasi: dari catatan menjadi tindak lanjut ---
   Sebuah temuan baru berguna bila ada yang menindaklanjutinya. Tiap
   evaluasi karena itu berstatus, berpenanggung jawab, dan boleh
   bertenggat serta terkait satu program kerja. "Lewat tenggat"
   diturunkan seperti "Terlambat" pada program — tak disimpan. */
const STATUS_EVAL = {
  terbuka   : { l: 'Terbuka',    c: 'l-biru'   },
  dikerjakan: { l: 'Dikerjakan', c: 'l-kuning' },
  tuntas    : { l: 'Tuntas',     c: 'l-hijau'  },
};
const lewatEval = (e) => e.status !== 'tuntas' && !!e.tenggat && e.tenggat < nowTanggal();
const lencanaEval = (e) => (lewatEval(e)
  ? '<span class="lencana l-merah">Lewat Tenggat</span>'
  : `<span class="lencana ${STATUS_EVAL[e.status]?.c || 'l-abu'}">${esc(STATUS_EVAL[e.status]?.l || e.status || 'Terbuka')}</span>`);
const programEval = (e) => Store.db.kaleidoskop.find((k) => k.id === e.programId);
/** Yang belum tuntas lebih dulu; di dalamnya, catatan terbaru di atas. */
const urutEval = (a, b) => (a.status === 'tuntas') - (b.status === 'tuntas')
  || (b.tanggal || '').localeCompare(a.tanggal || '');

const MODUL = {
  pengurus: {
    ruang: 'ketua', izin: 'organisasi.manage',
    urut: 1, judul: 'Data Pengurus', satuan: 'Pengurus', ikon: I.grup, hitung: true,
    sub: 'Struktur kepengurusan beserta kontak setiap jabatan.',
    pratinjau: { awal: 3, akhir: 1 },
    cari: (x) => `${namaOrang(x)} ${x.jabatan}`, tajuk: (x) => namaOrang(x),
    sesudahForm: (isi) => kunciNamaOrang(isi), rapikan: (d) => rapikanOrang(d),
    kolom: [
      { l: 'Nama',    isi: (x) => selOrang(x) },
      { l: 'Jabatan', isi: (x) => esc(x.jabatan) },
      { l: 'No. WA',  kelas: 'wa', isi: (x) => esc(samarWa(x.wa)) },
    ],
    form: [
      kolomPilihOrang, kolomNamaOrang,
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
    cari: (x) => `${namaOrang(x)} ${x.angkatan}`, tajuk: (x) => namaOrang(x),
    sesudahForm: (isi) => kunciNamaOrang(isi), rapikan: (d) => rapikanOrang(d),
    kolom: [
      { l: 'Nama',       isi: (x) => selOrang(x) },
      { l: 'Koordinator',isi: (x) => esc(x.angkatan) },
      { l: 'No. WA',     kelas: 'wa', isi: (x) => esc(samarWa(x.wa)) },
    ],
    form: [
      kolomPilihOrang, kolomNamaOrang,
      { k: 'angkatan', l: 'Koordinator Angkatan', wajib: true, ph: 'Angkatan XI' },
      { k: 'wa',       l: 'Nomor WhatsApp', ph: '+20 100 000 0000' },
    ],
  },

  kaleidoskop: {
    ruang: 'ketua', izin: 'organisasi.manage',
    urut: 3, judul: 'Program Kerja', satuan: 'Kegiatan', ikon: I.agenda,
    sub: 'Rencana, pelaksanaan, dan penanggung jawab program kerja sepanjang periode.',
    pratinjau: { awal: 5, akhir: 0 }, aksiDiKartu: false,
    susun: urutProgram,
    cari: (x) => `${x.kegiatan} ${waktuProgram(x)} ${x.status} ${x.divisi || ''} ${Store.namaUser(x.pjId)} ${x.catatan || ''}`,
    tajuk: (x) => x.kegiatan,
    kolom: [
      { l: 'Kegiatan / Program', isi: (x) => `<b>${esc(x.kegiatan)}</b>${x.divisi || x.catatan
        ? `<br><span class="sub-sel">${esc([x.divisi, x.catatan].filter(Boolean).join(' · '))}</span>` : ''}` },
      { l: 'Waktu',   kelas: 'utuh', isi: (x) => (x.tglMulai ? esc(waktuProgram(x))
        : `${esc(x.waktu || '—')}<br><span class="sub-sel perlu">tanggal belum diisi</span>`) },
      { l: 'Penanggung Jawab', penuh: true, isi: (x) => esc(x.pjId ? namaPendek(x.pjId) : '—') },
      /* Biaya yang sudah keluar, dari buku kas Bendahara. */
      { l: 'Biaya', penuh: true, kelas: 'utuh', isi: (x) => { const k = kasTaut('programId', x.id, 'keluar');
        return k.length ? esc(uangDua(jumlahKas(k, 'rp'), jumlahKas(k, 'egp'))) : '—'; } },
      { l: 'Status',  isi: lencanaProgram },
      { l: 'Selesai', tengah: true, isi: () => '', pasang: selCentang },
    ],
    form: [
      { k: 'kegiatan', l: 'Nama Kegiatan / Program', wajib: true, ph: 'Seminar Ulumul Quran' },
      { k: 'tglMulai',   l: 'Tanggal Mulai',   jenis: 'tanggal', wajib: true },
      { k: 'tglSelesai', l: 'Tanggal Selesai', jenis: 'tanggal', wajib: true,
        bantu: 'Program yang melewati tanggal ini dan belum selesai ditandai Terlambat.' },
      { k: 'pjId',     l: 'Penanggung Jawab', jenis: 'pilih',
        pilihan: () => [{ v: '', l: '— belum ditentukan —' }, ...pilihAnggota()] },
      { k: 'divisi',   l: 'Divisi / Biro', ph: 'Biro Kajian' },
      { k: 'status',   l: 'Status', jenis: 'pilih', bawaan: 'rencana',
        pilihan: Object.entries(STATUS_KEG).map(([v, s]) => ({ v, l: s.l })) },
      { k: 'catatan',  l: 'Catatan / Hasil', jenis: 'area', ph: 'Capaian, kendala, atau tindak lanjut.' },
    ],
    /* Kotak centang selalu mengikuti status, supaya lencana dan centang
       di tabel tidak pernah saling berlawanan. `waktu` — teks yang dulu
       diketik tangan — kini ditulis ulang dari tanggalnya. */
    rapikan: (d) => {
      if (d.tglSelesai < d.tglMulai) throw new Error('Tanggal selesai tidak boleh mendahului tanggal mulai.');
      return { ...d, selesai: d.status === 'selesai', waktu: waktuProgram(d) };
    },
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
    urut: 5, judul: 'Evaluasi & Tindak Lanjut', satuan: 'Evaluasi', ikon: I.obrolan, lebar: true,
    sub: 'Temuan lapangan, siapa yang menindaklanjuti, dan sampai di mana.',
    pratinjau: { awal: 3, akhir: 1 },
    susun: urutEval,
    cari: (x) => `${x.evaluasi} ${x.masukan} ${STATUS_EVAL[x.status]?.l || ''} ${Store.namaUser(x.pjId)} ${programEval(x)?.kegiatan || ''}`,
    tajuk: (x) => x.evaluasi,
    kolom: [
      { l: 'Evaluasi', isi: (x) => `${esc(x.evaluasi)}<br><span class="sub-sel">${
        esc([programEval(x)?.kegiatan, `dicatat ${tgl(x.tanggal)}`].filter(Boolean).join(' · '))}</span>` },
      { l: 'Masukan / Solusi', isi: (x) => esc(x.masukan) },
      { l: 'Penanggung Jawab', isi: (x) => esc(x.pjId ? namaPendek(x.pjId) : '—') },
      { l: 'Tenggat', kelas: 'utuh', isi: (x) => (x.tenggat ? tgl(x.tenggat) : '—') },
      { l: 'Status',  isi: lencanaEval },
    ],
    form: [
      { k: 'evaluasi', l: 'Poin Evaluasi', wajib: true, jenis: 'area', ph: 'Anggota sering telat hadir kajian' },
      { k: 'masukan',  l: 'Masukan / Solusi', wajib: true, jenis: 'area', ph: 'Langkah perbaikan yang disepakati' },
      { k: 'tanggal',  l: 'Tanggal Dicatat', jenis: 'tanggal', wajib: true },
      { k: 'programId', l: 'Program Terkait', jenis: 'pilih',
        pilihan: () => [{ v: '', l: '— tidak terkait program tertentu —' },
          ...[...Store.db.kaleidoskop].sort(urutProgram).map((k) => ({ v: k.id, l: `${k.kegiatan} (${waktuProgram(k)})` }))] },
      { k: 'pjId',     l: 'Penanggung Jawab Tindak Lanjut', jenis: 'pilih',
        pilihan: () => [{ v: '', l: '— belum ditentukan —' }, ...pilihAnggota()] },
      { k: 'tenggat',  l: 'Tenggat', jenis: 'tanggal', bawaan: '',
        bantu: 'Boleh dikosongkan. Bila diisi, evaluasi yang melewatinya dan belum tuntas ditandai Lewat Tenggat.' },
      { k: 'status',   l: 'Status Tindak Lanjut', jenis: 'pilih', bawaan: 'terbuka',
        pilihan: Object.entries(STATUS_EVAL).map(([v, x]) => ({ v, l: x.l })) },
    ],
  },
};

/* ============================================================
   RUANG KERJA SEKRETARIS — persuratan, dokumen, keanggotaan
   ------------------------------------------------------------
   Empat modul surat hidup di satu koleksi `db.surat` yang sama dan
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

/* --- penomoran ---
   Nomor surat berpola URUT/KODE/BULAN-ROMAWI/TAHUN — "013/AI/VI/2025".
   Dulu diketik tangan, sehingga bisa kembar atau terlompat tanpa ada
   yang tahu. Kini nomor berikutnya dihitung dari arsip: urutan
   tertinggi untuk kode dan tahun yang sama, ditambah satu.

   Nomor tetap boleh diubah — surat lama yang baru diarsipkan punya
   nomornya sendiri — tetapi nomor yang sudah dipakai ditolak. */
const KODE_SURAT = { internal: 'AI', eksternal: 'AI-E', keputusan: 'SK-AI', masuk: 'MSK' };
const KODE_SERTIFIKAT = { anggota: 'SRT-A/AI', pemateri: 'SRT-P/AI', kegiatan: 'SRT-K/AI' };
const ROMAWI_BULAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const nomorBaku = (n) => String(n || '').trim().toUpperCase().replace(/\s+/g, '');

function nomorBerikut(daftar, kode, tanggal) {
  const t = tanggal || nowTanggal();
  const tahun = t.slice(0, 4);
  const lolos = (teks) => teks.replace(/[.*+?^${}()|[\]\\\/-]/g, '\\$&');
  const pola = new RegExp(`^(\\d+)/${lolos(kode)}/[IVXLC]+/${tahun}$`);
  const tertinggi = daftar.reduce((maks, x) => {
    const m = nomorBaku(x.nomor).match(pola);
    return m ? Math.max(maks, Number(m[1])) : maks;
  }, 0);
  return `${String(tertinggi + 1).padStart(3, '0')}/${kode}/${ROMAWI_BULAN[Number(t.slice(5, 7)) - 1]}/${tahun}`;
}
/** Tolak nomor yang sudah dipakai baris lain di daftar yang sama. */
function tolakNomorKembar(daftar, d, sebutan) {
  const kembar = daftar.find((x) => x.id !== d.id && nomorBaku(x.nomor) === nomorBaku(d.nomor));
  if (kembar) throw new Error(`Nomor ${d.nomor} sudah dipakai ${sebutan} lain. Gunakan nomor berikutnya.`);
  return d;
}
/** Selama nomor belum disentuh tangan, ia mengikuti tanggal (dan, untuk
    sertifikat, jenis) yang dipilih. Sekali diubah pengguna, dibiarkan. */
function ikatNomor(isi, item, hitung) {
  if (item) return;                       // menyunting: nomor lama tak diutak-atik
  const nomor = isi.querySelector('[data-k="nomor"]');
  let otomatis = nomor.value;
  const segarkan = () => {
    if (nomor.value !== otomatis) return;
    otomatis = nomor.value = hitung(isi);
  };
  ['tanggal', 'jenis'].forEach((k) => isi.querySelector(`[data-k="${k}"]`)?.addEventListener('change', segarkan));
}

/** Surat masuk yang baru diterima dan tenggat tindak lanjutnya terlewat. */
const lewatSurat = (x) => x.status === 'diterima' && !!x.tenggat && x.tenggat < nowTanggal();

const lencanaStatus = (v) =>
  `<span class="lencana ${STATUS_SURAT[v]?.c || 'l-abu'}">${esc(STATUS_SURAT[v]?.l || v)}</span>`;

/** Cetakan satu modul surat. `saring` menentukan irisan `db.surat`-nya. */
function modulSurat({ judul, satuan, ket, ikon, warna, labelPihak, status, saring, bawaanBaru, kolomSk }) {
  /* Surat masuk diterima, bukan disusun: ia berlampiran pindaian dan
     bertindak lanjut. Tiga kategori lainnya diterbitkan organisasi,
     jadi dapat disusun dari blok dan diunduh sebagai PDF. */
  const masuk = bawaanBaru.kategori === 'masuk';
  return {
    ruang: 'sekretaris', izin: 'sekretariat.manage', koleksi: 'surat',
    judul, satuan, sub: ket, ket, ikon, warna,
    sumber: () => Store.db.surat.filter(saring),
    bawaanBaru,
    sesudahForm: (isi, item) => ikatNomor(isi, item, (f) =>
      nomorBerikut(Store.db.surat, KODE_SURAT[bawaanBaru.kategori], f.querySelector('[data-k="tanggal"]').value)),
    rapikan: (d) => {
      tolakNomorKembar(Store.db.surat, d, 'surat');
      /* Surat baru lahir dengan blok salinan templatnya — salinan, supaya
         mengubah templat kelak tak mengubah surat yang sudah terbit. */
      if (!masuk && !d.id) return { ...d, blok: blokTemplat(d.templatId) };
      return d;
    },
    ...(masuk ? {} : {
      aksiLain: [{ ikon: I.dok, judul: 'Susun surat & unduh PDF', klik: (x) => bukaSusun('surat', x.id) }],
      sesudahSimpan: (d, baru) => {
        if (!baru) return;
        const x = Store.db.surat.find((r) => nomorBaku(r.nomor) === nomorBaku(d.nomor));
        if (x) bukaSusun('surat', x.id);
      },
    }),
    cari: (x) => `${x.nomor} ${x.perihal} ${x.tujuan}`,
    tajuk: (x) => x.perihal,
    pratinjau: { awal: 3, akhir: 1 },
    kolom: [
      { l: 'Nomor',   kelas: 'utuh', isi: (x) => `<b>${esc(x.nomor)}</b>` },
      { l: 'Perihal', isi: (x) => esc(x.perihal) },
      ...(kolomSk ? [{ l: 'Jenis SK', isi: (x) => esc(JENIS_SK[x.jenisSk] || '—') }] : []),
      { l: labelPihak, isi: (x) => esc(x.tujuan) },
      { l: 'Tanggal', kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
      ...(masuk ? [{ l: 'Tindak Lanjut', penuh: true, isi: (x) => `${esc(x.pjId ? namaPendek(x.pjId) : '—')}${
        x.tenggat ? `<br><span class="sub-sel${lewatSurat(x) ? ' perlu' : ''}">tenggat ${tgl(x.tenggat)}</span>` : ''}` }] : []),
      { l: 'Status',  isi: (x) => (masuk && lewatSurat(x) ? '<span class="lencana l-merah">Lewat Tenggat</span>' : lencanaStatus(x.status)) },
      { l: 'Lampiran', penuh: true, isi: () => '', pasang: selGambar('lampiran', 'perihal', (x) => x.nomor) },
    ],
    form: [
      { k: 'nomor',   l: 'Nomor Surat', wajib: true, ph: '001/AI/VI/2025',
        bawaan: () => nomorBerikut(Store.db.surat, KODE_SURAT[bawaanBaru.kategori]),
        bantu: 'Terisi otomatis dari nomor terakhir di arsip. Boleh diubah; nomor yang sudah dipakai ditolak.' },
      { k: 'perihal', l: 'Perihal', wajib: true, jenis: 'area', ph: 'Undangan Rapat Koordinasi Pengurus' },
      ...(kolomSk ? [{ k: 'jenisSk', l: 'Jenis Surat Keputusan', jenis: 'pilih', bawaan: 'mulai',
        pilihan: Object.entries(JENIS_SK).map(([v, l]) => ({ v, l })) }] : []),
      { k: 'tujuan',  l: labelPihak, wajib: true, ph: 'Seluruh Pengurus' },
      { k: 'tanggal', l: 'Tanggal', jenis: 'tanggal', wajib: true },
      { k: 'status',  l: 'Status', jenis: 'pilih', bawaan: status[0],
        pilihan: status.map((v) => ({ v, l: STATUS_SURAT[v].l })) },
      ...(masuk ? [
        { k: 'pjId', l: 'Penanggung Jawab Tindak Lanjut', jenis: 'pilih',
          pilihan: () => [{ v: '', l: '— belum ditentukan —' }, ...pilihAnggota()] },
        { k: 'tenggat', l: 'Tenggat Tindak Lanjut', jenis: 'tanggal', bawaan: '',
          bantu: 'Boleh dikosongkan. Surat berstatus Diterima yang melewatinya ditandai Lewat Tenggat.' },
      ] : [
        { k: 'templatId', l: 'Templat Surat', jenis: 'pilih', hanyaBaru: true,
          pilihan: () => Store.db.templatSurat.map((t) => ({ v: t.id, l: t.nama })),
          bantu: 'Susunan blok awal surat ini. Sesudah disimpan, penyusun surat langsung terbuka.' },
      ]),
      { k: 'lampiran', l: masuk ? 'Pindaian Surat' : 'Lampiran', jenis: 'gambar',
        bantu: masuk ? 'Foto atau pindaian surat yang diterima.' : 'Foto atau pindaian surat bertanda tangan basah, bila ada.' },
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

  'templat-surat': {
    ruang: 'sekretaris', izin: 'sekretariat.manage', koleksi: 'templatSurat',
    judul: 'Templat Surat', satuan: 'Templat', ikon: I.layout,
    ket: 'Susunan blok siap pakai untuk surat baru',
    sub: 'Susunan blok — kop, isi, tanda tangan — yang disalin ke tiap surat baru.',
    warna: ['rgba(124,92,214,.14)', '#5F45AE'],
    cari: (x) => `${x.nama} ${x.ket || ''}`, tajuk: (x) => x.nama,
    pratinjau: { awal: 3, akhir: 1 },
    bawaanBaru: () => ({ blok: blokBawaan() }),
    aksiLain: [{ ikon: I.dok, judul: 'Susun blok templat', klik: (x) => bukaSusun('templat', x.id) }],
    sesudahSimpan: (d, baru) => {
      if (!baru) return;
      const x = Store.db.templatSurat.find((t) => t.nama === d.nama);
      if (x) bukaSusun('templat', x.id);
    },
    kolom: [
      { l: 'Nama Templat', isi: (x) => `<b>${esc(x.nama)}</b>${x.ket ? `<br><span class="sub-sel">${esc(x.ket)}</span>` : ''}` },
      { l: 'Susunan Blok', isi: (x) => esc((x.blok || []).map((b) => BLOK_SURAT[b.jenis]?.l || b.jenis).join(' → ')) },
    ],
    form: [
      { k: 'nama', l: 'Nama Templat', wajib: true, ph: 'Surat Undangan' },
      { k: 'ket',  l: 'Keterangan', ph: 'Dipakai untuk undangan rapat dan kegiatan' },
    ],
  },

  sertifikat: {
    ruang: 'sekretaris', izin: 'sertifikat.manage',
    judul: 'Sertifikat', satuan: 'Sertifikat', ikon: I.dok,
    ket: 'Kelola sertifikat anggota, pemateri, dan kegiatan',
    sub: 'Sertifikat anggota, pemateri, dan kegiatan kajian.',
    warna: ['rgba(47,169,140,.14)', '#1F7A64'],
    cari: (x) => `${x.nomor} ${x.judul} ${namaOrang(x, 'penerima')} ${x.jenis} ${orangTerhubung(x)?.nia || ''}`,
    tajuk: (x) => x.judul, pratinjau: { awal: 3, akhir: 1 },
    sesudahForm: (isi, item) => {
      ikatNomor(isi, item, (f) => nomorBerikut(Store.db.sertifikat,
        KODE_SERTIFIKAT[f.querySelector('[data-k="jenis"]').value], f.querySelector('[data-k="tanggal"]').value));
      kunciNamaOrang(isi, 'penerima');
    },
    rapikan: (d) => rapikanOrang(tolakNomorKembar(Store.db.sertifikat, d, 'sertifikat'), 'penerima',
      'Pilih anggota penerimanya, atau isi nama penerima.'),
    kolom: [
      { l: 'Nomor',    kelas: 'utuh', isi: (x) => `<b>${esc(x.nomor)}</b>` },
      { l: 'Judul Sertifikat', isi: (x) => esc(x.judul) },
      { l: 'Jenis',    isi: (x) => `<span class="lencana ${
        x.jenis === 'pemateri' ? 'l-biru' : x.jenis === 'kegiatan' ? 'l-kuning' : 'l-hijau'}">${esc(x.jenis)}</span>` },
      { l: 'Penerima', isi: (x) => selOrang(x, 'penerima', false) },
      { l: 'Tanggal',  kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
    ],
    form: [
      { k: 'nomor',    l: 'Nomor Sertifikat', wajib: true, ph: '001/SRT-A/AI/VI/2025',
        bawaan: () => nomorBerikut(Store.db.sertifikat, KODE_SERTIFIKAT.anggota),
        bantu: 'Terisi otomatis menurut jenis dan tanggal. Boleh diubah; nomor yang sudah dipakai ditolak.' },
      { k: 'judul',    l: 'Judul Sertifikat', wajib: true, jenis: 'area', ph: 'Sertifikat Pemateri — Balaghah dalam al-Quran' },
      { k: 'jenis',    l: 'Jenis', jenis: 'pilih', bawaan: 'anggota',
        pilihan: [{ v: 'anggota', l: 'Anggota' }, { v: 'pemateri', l: 'Pemateri' }, { v: 'kegiatan', l: 'Kegiatan' }] },
      { ...kolomPilihOrang, l: 'Penerima (Anggota)',
        pilihan: () => [{ v: '', l: '— bukan seorang anggota (isi penerima di bawah) —' }, ...kolomPilihOrang.pilihan().slice(1)],
        bantu: 'Pilih bila penerimanya seorang anggota; sertifikatnya lalu tercatat atas namanya.' },
      { k: 'penerima', l: 'Penerima', ph: 'Nama penerima atau "Seluruh Peserta"',
        bantu: 'Diisi bila penerimanya orang luar atau sebuah kelompok.' },
      { k: 'tanggal',  l: 'Tanggal Terbit', jenis: 'tanggal', wajib: true },
    ],
  },

  ttd: {
    ruang: 'sekretaris', izin: 'ttd.manage', koleksi: 'tandaTangan',
    judul: 'Kumpulan Tanda Tangan', satuan: 'Tanda Tangan', ikon: I.pena,
    ket: 'Kumpulan tanda tangan setiap divisi kepengurusan',
    sub: 'Tanda tangan pemegang jabatan untuk membubuhi surat dan sertifikat.',
    warna: ['rgba(62,127,184,.14)', '#2C6091'],
    cari: (x) => `${x.divisi} ${x.jabatan} ${namaOrang(x)}`,
    tajuk: (x) => namaOrang(x), pratinjau: { awal: 3, akhir: 1 },
    sesudahForm: (isi) => kunciNamaOrang(isi),
    rapikan: (d) => rapikanOrang(d, 'nama', 'Pilih anggota pemilik tanda tangan, atau isi namanya.'),
    kolom: [
      { l: 'Divisi',  isi: (x) => `<b>${esc(x.divisi)}</b>` },
      { l: 'Jabatan', isi: (x) => esc(x.jabatan) },
      { l: 'Nama',    isi: (x) => selOrang(x) },
      { l: 'Tanda Tangan', isi: () => '', pasang: selGambar('gambar', 'nama', (x) => `${x.jabatan} · ${x.divisi}`, 'utuh') },
    ],
    form: [
      { k: 'divisi',  l: 'Divisi / Unit', wajib: true, ph: 'Divisi Media' },
      { k: 'jabatan', l: 'Jabatan', wajib: true, ph: 'Kepala Divisi' },
      { ...kolomPilihOrang, l: 'Pemilik Tanda Tangan' },
      { ...kolomNamaOrang, l: 'Nama Pemilik' },
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
  if (m.dialogHapus) return m.dialogHapus(x);
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
  const d = m.sumber ? m.sumber() : Store.db[m.koleksi || nama];
  return m.susun ? [...d].sort(m.susun) : d;
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

  /* Kartu dasbor sempit: kolom bertanda `penuh` hanya tampil di halaman
     modulnya. */
  const kolom = pratinjau ? m.kolom.filter((c) => !c.penuh) : m.kolom;
  const lebarPutus = 1 + kolom.length + (aksi ? 1 : 0);
  const bungkus = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr>
      <th class="kol-no">No.</th>
      ${kolom.map((c) => `<th class="${c.kelas || ''}${c.tengah ? ' kol-tengah' : ''}">${esc(c.l)}</th>`).join('')}
      ${aksi ? `<th class="kol-aksi${m.aksiLain ? ' lebar' : ''}">Aksi</th>` : ''}
    </tr></thead><tbody></tbody></table></div>`);
  const tb = bungkus.querySelector('tbody');

  baris.forEach((b) => {
    if (b.putus) {
      const tr = el(`<tr class="putus"><td colspan="${lebarPutus}" title="Lihat seluruh data" style="cursor:pointer">…</td></tr>`);
      tr.querySelector('td').onclick = () => bukaModul(nama);
      tb.appendChild(tr);
      return;
    }
    const tr = el(`<tr class="${esc(m.kelasBaris?.(b.x) || '')}">
      <td class="kol-no">${b.no}</td>
      ${kolom.map((c) => `<td class="${c.kelas || ''}${c.tengah ? ' kol-tengah' : ''}">${c.isi(b.x)}</td>`).join('')}
      ${aksi ? `<td class="kol-aksi${m.aksiLain ? ' lebar' : ''}"><div class="sel-aksi">
        ${(m.aksiLain || []).map((a, i) => `<button class="ikon-aksi" data-lain="${i}" title="${esc(a.judul)}" ${bisa ? '' : 'disabled'}>${a.ikon}</button>`).join('')}
        <button class="ikon-aksi sunting" title="Sunting" ${bisa ? '' : 'disabled'}>${I.sunting}</button>
        <button class="ikon-aksi hapus" title="${esc(m.judulHapus || 'Hapus')}" ${bisa ? '' : 'disabled'}>${I.hapus}</button>
      </div></td>` : ''}
    </tr>`);

    kolom.forEach((c, i) => c.pasang?.(tr.children[i + 1], b.x, { nama, pratinjau }));
    tr.querySelectorAll('[data-lain]').forEach((t) => {
      t.onclick = () => m.aksiLain[Number(t.dataset.lain)].klik(b.x);
    });
    tr.querySelector('.sunting')?.addEventListener('click', () => jalankan(() => formOrg(nama, b.x)));
    tr.querySelector('.hapus')?.addEventListener('click', () => jalankan(() => hapusOrg(nama, b.x)));
    tb.appendChild(tr);
  });
  /* Hanya di halaman penuh: kartu dasbor menyembunyikan sebagian besar
     barisnya, dan memilih dari daftar yang terpangkas berarti menghapus
     tanpa melihat. */
  if (!pratinjau && aksi && bisa && !m.tanpaPilih) {
    pasangPilih(bungkus, semua, {
      satuan: `data ${m.satuan.toLowerCase()}`,
      hapus: (x) => (m.hapus ? m.hapus(x) : Store.hapusKoleksi(U, m.koleksi || nama, x.id)),
    });
  }
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

/* --- antrean keputusan ---
   Dasbor dibuka dengan jawaban atas "apa yang menunggu saya?", sebelum
   daftar apa pun. Tiga antrean ini sama persis dengan kelompok Putuskan
   di sidebar, dan angkanya dihitung dengan cara yang sama dengan lonceng
   di sana — keduanya tak boleh menyebut jumlah yang berbeda.

   Seperti seluruh dasbor, ia hanya pintasan: tak ada yang disetujui,
   diterbitkan, atau ditandai dari sini. */
function kartuAntrean(judul, daftar) {
  daftar = daftar.filter((a) => bolehMenu(MENU.find((m) => m.id === a.rute)));
  const total = daftar.reduce((j, a) => j + a.n, 0);
  const box = el(`<section class="antre">
    <div class="antre-kepala"><h2>${esc(judul)}</h2>
      <span class="hitung">${total ? `${total} hal perlu ditindak` : 'Tidak ada yang tertunda'}</span></div>
    <div class="antre-grid"></div>
  </section>`);
  const grid = box.querySelector('.antre-grid');
  daftar.forEach((a) => {
    const k = el(`<button class="antre-kartu${a.n ? ' ada' : ''}">
      <span class="antre-ik">${a.n ? a.ikon : I.cekBulat}</span>
      <span class="antre-isi">
        <span class="antre-judul">${esc(a.judul)}</span>
        <span class="antre-angka">${a.n ? `<b>${a.n}</b> ${esc(a.satuan)}` : esc(a.kosong)}</span>
        ${a.n && a.rinci ? `<span class="antre-rinci">${esc(a.rinci)}${a.n > 1 ? ` · dan ${a.n - 1} lainnya` : ''}</span>` : ''}
      </span>
      <span class="antre-panah">${I.kanan}</span>
    </button>`);
    k.onclick = () => { a.sebelum?.(); bukaModul(a.rute); };
    grid.appendChild(k);
  });
  return box;
}

function antreanKetua() {
  const menunggu = Store.db.pengajuan.filter((p) => p.status === 'menunggu');
  const naskah = Store.db.artikel.filter((a) => a.status === 'review');
  const pesan = Store.db.pesan.filter((p) => !p.dibaca);
  const kasTunggu = Store.db.keuangan.filter((t) => t.status === 'menunggu');
  return kartuAntrean('Menunggu Keputusan Anda', [
    { rute: 'persetujuan-kas', ikon: I.uang, judul: 'Persetujuan Pengeluaran', n: kasTunggu.length,
      satuan: 'pengeluaran menunggu', kosong: 'Tidak ada pengeluaran menunggu',
      rinci: kasTunggu[0] && `${kasTunggu[0].sumber || kasTunggu[0].kategori} — ${Store.nominalGabung(kasTunggu[0])}` },
    { rute: 'pengajuan', ikon: I.cek, judul: 'Persetujuan Website', n: menunggu.length,
      satuan: 'pengajuan menunggu', kosong: 'Tidak ada pengajuan menunggu',
      rinci: menunggu[0] && `${menunggu[0].jumlahPerubahan} perubahan dari ${menunggu[0].olehNama}` },
    { rute: 'artikel', ikon: I.dok, judul: 'Tinjau Artikel', n: naskah.length,
      satuan: 'naskah menunggu tinjauan', kosong: 'Tidak ada naskah menunggu',
      rinci: naskah[0] && `"${naskah[0].judul}"` },
    { rute: 'pesan', ikon: I.surat, judul: 'Kotak Masuk', n: pesan.length,
      satuan: 'pesan belum dibaca', kosong: 'Semua pesan sudah dibaca',
      rinci: pesan[0] && `${pesan[0].subjek} — ${pesan[0].nama}` },
  ]);
}

/* Antrean Sekretaris. Tiap kartu menghitung hal yang memang menuntut
   tindakannya: pesan yang belum dibaca, surat masuk yang baru diterima,
   surat yang masih draft, kajian yang sudah lewat tanpa notulen, dan
   akun yang belum pernah mengganti sandi awalnya. */
function antreanSekretaris() {
  const d = Store.db;
  const pesan = d.pesan.filter((p) => !p.dibaca);
  const masuk = d.surat.filter((x) => x.kategori === 'masuk' && x.status === 'diterima');
  const draft = d.surat.filter((x) => x.status === 'draft');
  const tanpaNotulen = d.kajian.filter((k) => k.tanggal < nowTanggal() && !k.notulensi)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const sandiAwal = d.users.filter((u) => Number(u.sandiAwal) === 1 && u.status === 'aktif');
  const daftar = (d.pendaftaran || []).filter((p) => p.status === 'menunggu');
  return kartuAntrean('Perlu Ditindaklanjuti', [
    { rute: 'pendaftaran', ikon: I.dokCek, judul: 'Pendaftaran Baru', n: daftar.length,
      satuan: 'permohonan menunggu tinjauan', kosong: 'Tidak ada pendaftaran menunggu',
      rinci: daftar[0] && daftar[0].nama },
    { rute: 'pesan', ikon: I.surat, judul: 'Kotak Masuk', n: pesan.length,
      satuan: 'pesan belum dibaca', kosong: 'Semua pesan sudah dibaca',
      rinci: pesan[0] && `${pesan[0].subjek} — ${pesan[0].nama}` },
    { rute: 'surat-masuk', ikon: I.baki, judul: 'Surat Masuk', n: masuk.length,
      satuan: 'surat belum ditindaklanjuti', kosong: 'Semua surat masuk sudah ditindak',
      rinci: masuk[0] && `${masuk[0].perihal} — ${masuk[0].tujuan}` },
    { rute: draft[0] ? `surat-${draft[0].kategori}` : 'surat-internal', ikon: I.sunting, judul: 'Surat Masih Draft', n: draft.length,
      satuan: 'surat belum dikirim', kosong: 'Tidak ada surat yang tertahan di draft',
      rinci: draft[0] && `${draft[0].nomor} · ${draft[0].perihal}` },
    { rute: 'notulen-presensi', sebelum: () => { saringPantau.perlu = 'notulen'; },
      ikon: I.dok, judul: 'Notulen Kajian', n: tanpaNotulen.length,
      satuan: 'kajian selesai tanpa notulen', kosong: 'Semua kajian selesai sudah bernotulen',
      rinci: tanpaNotulen[0] && `${tanpaNotulen[0].judul} (${tgl(tanpaNotulen[0].tanggal)})` },
    { rute: 'anggota-angkatan', sebelum: () => { saringAnggota = { cari: '', status: '', level: '', sandi: 'awal' }; },
      ikon: I.gembok, judul: 'Sandi Awal', n: sandiAwal.length,
      satuan: 'akun belum mengganti sandi awal', kosong: 'Semua akun aktif sudah mengganti sandinya',
      rinci: sandiAwal[0] && sandiAwal[0].nama },
  ]);
}

/* --- program kerja yang belum rampung ---
   Ringkasan satu kartu: seberapa jauh periode ini berjalan, dan apa saja
   yang masih terbuka. Yang sedang berjalan didahulukan dari yang baru
   direncanakan. */
function ringkasProgram() {
  const semua = Store.db.kaleidoskop;
  const rampung = semua.filter((k) => k.status === 'selesai').length;
  /* Yang terlambat paling atas, lalu yang sedang berjalan, lalu rencana;
     di dalam tiap kelompok, yang tenggatnya paling dekat lebih dulu. */
  const bobot = (k) => (terlambatProgram(k) ? 0 : k.status === 'proses' ? 1 : 2);
  const sisa = semua.filter((k) => k.status !== 'selesai')
    .sort((a, b) => bobot(a) - bobot(b) || (a.tglSelesai || '9999').localeCompare(b.tglSelesai || '9999'));
  const telat = sisa.filter(terlambatProgram).length;
  const persen = semua.length ? Math.round((rampung / semua.length) * 100) : 0;
  const tampil = sisa.slice(0, 4);

  const kartu = el(`<div class="kartu ringkas-program">
    <div class="kartu-kepala">
      <button class="kartu-tautan" data-buka title="Buka Program Kerja">
        <h3>Program Kerja Berjalan</h3>
        <span class="hitung">(${rampung} dari ${semua.length} selesai${telat ? ` · <b class="rp-telat">${telat} terlambat</b>` : ''})</span>
        <span class="panah">${I.kanan}</span>
      </button>
      <div class="kanan"><div class="bar-maju" title="${persen}% terlaksana"><span style="width:${persen}%"></span></div>
        <b class="rp-persen">${persen}%</b></div>
    </div>
    ${tampil.length ? `<ul class="rp-daftar">${tampil.map((k) => `<li>
        ${lencanaProgram(k)}
        <span class="rp-nama">${esc(k.kegiatan)}${k.pjId ? `<span class="rp-pj"> · ${esc(namaPendek(k.pjId))}</span>` : ''}</span>
        <span class="rp-waktu">${esc(waktuProgram(k))}</span></li>`).join('')}
      ${sisa.length > tampil.length ? `<li class="rp-lain"><button data-buka>dan ${sisa.length - tampil.length} program lainnya</button></li>` : ''}
    </ul>` : `<div class="rp-kosong">${I.cekBulat} ${semua.length ? 'Seluruh program kerja sudah terlaksana.' : 'Belum ada program kerja yang dicatat.'}</div>`}
  </div>`);
  kartu.querySelectorAll('[data-buka]').forEach((b) => { b.onclick = () => bukaModul('kaleidoskop'); });
  return kartu;
}

function dasborKetua() {
  const box = el('<div></div>');
  box.appendChild(antreanKetua());
  box.appendChild(ringkasProgram());
  const grid = el('<div class="k-grid"></div>');
  Object.keys(MODUL).filter((n) => MODUL[n].ruang === 'ketua')
    .forEach((nama) => grid.appendChild(kartuOrg(nama)));
  box.appendChild(grid);
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
        ${bisa ? (m.tombolLain || []).map((t, i) => `<button class="btn btn-garis btn-kecil" data-tombol="${i}">${t.ikon} ${esc(t.label)}</button>`).join('') : ''}
        ${bisa ? `<button class="btn btn-kecil" data-tambah>${I.tambah} Tambah Data</button>` : ''}
      </div>
    </div>
    <div data-wadah></div>
  </div>`);
  kartu.querySelectorAll('[data-tombol]').forEach((b) => { b.onclick = () => m.tombolLain[Number(b.dataset.tombol)].klik(); });

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
  /* Kolom gambar menyimpan ke kuncinya sendiri — `lampiran` pada surat,
     `gambar` pada tanda tangan. Dulu nilai awalnya selalu dibaca dari
     `item.lampiran`, sehingga menyunting tanda tangan diam-diam
     mengosongkan berkasnya. */
  const kunciGambar = m.form.find((f) => f.jenis === 'gambar')?.k;
  let lampiran = (kunciGambar && item?.[kunciGambar]) || '';
  const kolomForm = m.form.filter((f) => !(f.hanyaBaru && item));

  kolomForm.forEach((f) => {
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
  m.sesudahForm?.(isi, item);

  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button>
    <button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: `${item ? 'Sunting' : 'Tambah'} ${m.satuan}`, isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const data = { id: item?.id, ...(item ? {} : nilai(m.bawaanBaru) || {}) };
    let kurang = '';
    kolomForm.forEach((f) => {
      const mentah = f.jenis === 'gambar' ? lampiran : isi.querySelector(`[data-k="${f.k}"]`).value.trim();
      if (f.wajib && !mentah) kurang = kurang || f.l;
      data[f.k] = f.jenis === 'angka' ? Number(mentah || 0) : mentah;
    });
    if (kurang) return toast(`${kurang} wajib diisi.`, true);
    /* Peringatan tidak menutup form: isinya tetap utuh, dan menekan
       Simpan sekali lagi dengan isi yang sama berarti "ya, memang benar". */
    const sidik = JSON.stringify(data);
    const peringatan = m.peringatanSimpan?.(data);
    if (peringatan && isi.dataset.sudahDiperingatkan !== sidik) {
      isi.dataset.sudahDiperingatkan = sidik;
      return toast(peringatan, true);
    }
    aman(() => {
      const rapi = m.rapikan ? m.rapikan(data) : data;
      if (m.simpan) m.simpan(rapi); else Store.simpanKoleksi(U, m.koleksi || nama, rapi);
      tutupModal(); toast('Data tersimpan.'); gambar();
      m.sesudahSimpan?.(rapi, !item);
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
  box.appendChild(antreanSekretaris());
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
  /* Layar masuk menyuruh orang yang lupa sandi menghubungi Sekretaris,
     jadi tombolnya ada di tiap baris — bukan tersembunyi di dalam form. */
  const bisaSetel = RBAC.canAny(U, ['anggota.manage', 'user.manage']);
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama</th>
      ${kolomAngkatan ? '<th>Angkatan</th>' : ''}
      <th>Jenjang</th><th>Status</th><th class="kol-aksi${bisaSetel ? ' lebar' : ''}">Aksi</th></tr></thead>
    <tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  daftar.forEach((u, i) => {
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td><div style="display:flex;align-items:center;gap:10px">
        <img src="${u.foto}" alt="" style="width:32px;height:32px;border-radius:50%;flex:none">
        <div><b>${esc(u.nama)}</b><br><span style="color:var(--e-abu);font-size:11.6px">${u.nia ? `<span class="nia">${esc(u.nia)}</span> · ` : ''}${esc(u.email)}</span></div>
      </div></td>
      ${kolomAngkatan ? `<td class="utuh">${esc(u.angkatan)}</td>` : ''}
      <td class="utuh">${esc(u.level)}</td>
      <td><span class="lencana ${u.status === 'aktif' ? 'l-hijau' : u.status === 'alumni' ? 'l-biru' : 'l-abu'}">${esc(u.status)}</span>${
        Number(u.sandiAwal) === 1 && u.status === 'aktif' ? '<br><span class="sub-sel perlu" title="Akun ini belum pernah mengganti sandi yang diberikan">sandi awal</span>' : ''}</td>
      <td class="kol-aksi${bisaSetel ? ' lebar' : ''}"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Sunting">${I.sunting}</button>
        ${bisaSetel ? `<button class="ikon-aksi" data-sandi title="Setel ulang kata sandi">${I.gembok}</button>` : ''}</div></td>
    </tr>`);
    tr.querySelector('.sunting').onclick = () => formAnggota(u);
    tr.querySelector('[data-sandi]')?.addEventListener('click', () => setelSandiAnggota(u));
    tb.appendChild(tr);
  });
  /* Penjagaannya sama dengan Data Anggota: akun sendiri tidak, dan akun
     pemegang wewenang tertinggi hanya oleh sesamanya. */
  if (RBAC.can(U, 'anggota.manage')) {
    pasangPilih(t, daftar, {
      satuan: 'anggota',
      boleh: (u) => u.id !== U.id && (!RBAC.can(u, 'user.manage') || RBAC.can(U, 'user.manage')),
      hapusSemua: (kena) => Store.hapusAnggota(U, kena.map((u) => u.id)),
    });
  }
  return t;
}

let saringAnggota = { cari: '', status: '', level: '', sandi: '' };
HAL['anggota-angkatan'] = () => {
  const semua = Store.db.users;
  const jml = (st) => semua.filter((u) => u.status === st).length;
  const sandiAwal = semua.filter((u) => Number(u.sandiAwal) === 1 && u.status === 'aktif').length;
  const jenjang = [...new Set(semua.map((u) => u.level).filter((x) => x && x !== '-'))].sort();

  const box = el(`<div><div class="grid-stat">
    ${[
      { ik: I.grup,     n: jml('aktif'),    l: 'Anggota aktif',            w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' },
      { ik: I.wisuda,   n: jml('alumni'),   l: 'Alumni',                   w: 'rgba(62,127,184,.14)', wc: '#2C6091' },
      { ik: I.orang,    n: jml('nonaktif'), l: 'Nonaktif',                 w: 'rgba(120,130,125,.14)', wc: '#5E6B64' },
      { ik: I.gembok,   n: sandiAwal,       l: 'Belum ganti sandi awal',   w: 'rgba(229,83,75,.12)',  wc: '#B23E37' },
    ].map((x) => `<div class="stat" style="--w:${x.w};--wc:${x.wc}"><div class="stat-ik">${x.ik}</div>
      <div class="stat-nilai">${x.n}</div><div class="stat-label">${esc(x.l)}</div></div>`).join('')}
  </div></div>`);

  const kepala = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Data Anggota</h3>
    <span class="hitung" data-hitung></span>
    <div class="kanan">
      <select class="pilih-saring" data-status>
        ${[['', 'Semua status'], ['aktif', 'Aktif'], ['alumni', 'Alumni'], ['nonaktif', 'Nonaktif']]
          .map(([v, l]) => `<option value="${v}" ${v === saringAnggota.status ? 'selected' : ''}>${l}</option>`).join('')}</select>
      <select class="pilih-saring" data-level><option value="">Semua jenjang</option>
        ${jenjang.map((x) => `<option ${x === saringAnggota.level ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>
      <select class="pilih-saring" data-sandi>
        <option value="">Semua akun</option><option value="awal" ${saringAnggota.sandi === 'awal' ? 'selected' : ''}>Belum ganti sandi awal</option></select>
      <input class="cari-org" placeholder="Cari nama, surel, nomor induk…" data-cari value="${esc(saringAnggota.cari)}">
      <button class="btn btn-kecil" data-tambah>${I.tambah} Tambah Anggota</button>
    </div></div></div>`);
  kepala.querySelector('[data-tambah]').onclick = () => formAnggota(null);
  box.appendChild(kepala);

  const wadah = el('<div></div>');
  box.appendChild(wadah);

  const isiUlang = () => {
    const q = saringAnggota.cari.trim().toLowerCase();
    const cocok = semua.filter((u) =>
      (!saringAnggota.status || u.status === saringAnggota.status)
      && (!saringAnggota.level || u.level === saringAnggota.level)
      && (!saringAnggota.sandi || (Number(u.sandiAwal) === 1 && u.status === 'aktif'))
      && (!q || `${u.nama} ${u.email} ${u.angkatan} ${u.level} ${u.nia || ''}`.toLowerCase().includes(q)));
    kepala.querySelector('[data-hitung]').textContent = `(${cocok.length} dari ${semua.length} orang)`;

    const grup = {};
    cocok.forEach((u) => { (grup[u.angkatan] ||= []).push(u); });
    const urutan = Object.keys(grup).sort((a, b) => urutAngkatan(a) - urutAngkatan(b));

    wadah.innerHTML = '';
    if (!urutan.length) {
      wadah.appendChild(el(`<div class="kartu"><div class="kosong-erp">${I.kotak}
        <p>Tidak ada anggota yang cocok</p><small>Ubah saringan atau kata kunci.</small></div></div>`));
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
  [['status', 'status'], ['level', 'level'], ['sandi', 'sandi']].forEach(([attr, kunci]) => {
    kepala.querySelector(`[data-${attr}]`).onchange = (e) => { saringAnggota[kunci] = e.target.value; isiUlang(); };
  });
  kepala.querySelector('[data-cari]').oninput = (e) => { saringAnggota.cari = e.target.value; isiUlang(); };
  isiUlang();
  return box;
};
HAL['anggota-angkatan'].judul = () => ['Data Anggota', 'Seluruh anggota per angkatan — saring menurut status, jenjang, dan sandi awal.'];

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
  proses: { l: 'Ditulis',   c: 'l-kuning' },
  siap  : { l: 'Dikirim',   c: 'l-hijau'  },
};

let bulanRedaksi = null;

/** Bulan yang punya cerita: berpenugasan, bernaskah terkirim, atau bulan ini. */
const bulanTersedia = () => [...new Set([nowTanggal().slice(0, 7),
  ...Store.db.penugasan.map((p) => p.bulan),
  ...Store.db.artikel.map((a) => Store.dikirimPada(a).slice(0, 7))].filter(Boolean))].sort().reverse();

/** Bulan yang sedang dilihat — bawaannya bulan ini. */
function bulanAktif() {
  const ada = bulanTersedia();
  if (!bulanRedaksi || !ada.includes(bulanRedaksi)) bulanRedaksi = nowTanggal().slice(0, 7);
  return bulanRedaksi;
}

const tugasBulan = (b = bulanAktif()) => Store.db.penugasan.filter((p) => p.bulan === b);

/** Capaian target sebuah bulan — lihat Store.capaianBulan(). */
function capaianTarget(b = bulanAktif()) {
  const c = Store.capaianBulan(b);
  return { ...c, penulis: c.baris.length, rata: c.baris.length ? c.naskah / c.baris.length : 0 };
}
const lencanaProgres = (p) => {
  const g = Store.progresTugas(p);
  const utama = `<span class="lencana ${PROGRES[g.status].c}">${PROGRES[g.status].l}</span>`;
  return utama + (g.telat ? ' <span class="lencana l-merah">lewat tenggat</span>'
    : g.status === 'siap' && !g.tepat ? ' <span class="lencana l-kuning">terlambat dikirim</span>' : '');
};

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

/** Yang menuntut tindakan PJ Artikel — diturunkan dari naskah dan penugasan. */
function perluArtikel() {
  const art = Store.db.artikel;
  const kini = nowTanggal();
  return {
    masuk: art.filter((a) => a.status === 'review' && a.penulisId !== U?.id),
    revisi: art.filter((a) => a.status === 'revisi'),
    /* Tulisan sendiri tak dapat diterbitkan sendiri: ia menunggu Ketua. */
    milikTunggu: art.filter((a) => a.status === 'review' && a.penulisId === U?.id),
    telat: Store.db.penugasan.filter((p) => Store.progresTugas(p).telat),
    usul: Store.usulMenunggu(),
    /* Bulan ini: wajib menulis, belum mengirim cukup, dan belum ditugasi apa pun. */
    tanpaTugas: Store.capaianBulan(kini.slice(0, 7)).baris.filter((b) => !b.memenuhi && !b.tugas.length),
  };
}
function antreanArtikel() {
  const p = perluArtikel();
  return kartuAntrean('Perlu Ditindak', [
    { rute: 'artikel-masuk', ikon: I.dokCek, judul: 'Naskah Masuk', n: p.masuk.length,
      satuan: 'naskah menunggu ditinjau', kosong: 'Tidak ada naskah yang menunggu',
      rinci: p.masuk[0] && `${p.masuk[0].judul} — ${Store.namaUser(p.masuk[0].penulisId)}` },
    { rute: 'artikel-revisi', ikon: I.putar, judul: 'Menunggu Revisi', n: p.revisi.length,
      satuan: 'naskah dikembalikan, belum dikirim ulang', kosong: 'Tidak ada naskah yang dikembalikan',
      rinci: p.revisi[0] && `${p.revisi[0].judul} — ${Store.namaUser(p.revisi[0].penulisId)}` },
    { rute: 'target-artikel', ikon: I.tag, judul: 'Usulan Judul', n: p.usul.length,
      satuan: 'usulan judul menunggu keputusan', kosong: 'Tidak ada usulan judul',
      rinci: p.usul[0] && `${Store.namaUser(p.usul[0].penulisId)} — ${p.usul[0].judul}` },
    { rute: 'target-artikel', sebelum: () => { bulanRedaksi = nowTanggal().slice(0, 7); }, ikon: I.grup, judul: 'Belum Ditugasi Bulan Ini', n: p.tanpaTugas.length,
      satuan: 'anggota belum memenuhi target dan belum ditugasi', kosong: 'Semua anggota sudah ditugasi atau memenuhi target',
      rinci: p.tanpaTugas[0] && p.tanpaTugas[0].u.nama },
    { rute: 'target-artikel', ikon: I.jam, judul: 'Penugasan Lewat Tenggat', n: p.telat.length,
      satuan: 'penugasan belum dikirim naskahnya', kosong: 'Tidak ada penugasan yang terlambat',
      rinci: p.telat[0] && `${Store.namaUser(p.telat[0].userId)} — ${p.telat[0].judul}` },
    ...(p.milikTunggu.length ? [{ rute: 'artikel-saya', ikon: I.pena, judul: 'Tulisan Saya Menunggu Ketua', n: p.milikTunggu.length,
      satuan: 'tulisan Anda menunggu diterbitkan Ketua Umum', kosong: '', rinci: p.milikTunggu[0].judul }] : []),
  ]);
}

function dasborRedaksi() {
  const box = el('<div></div>');
  box.appendChild(antreanArtikel());
  const b = bulanAktif();
  const c = capaianTarget(b);
  const rataTampil = Number.isInteger(c.rata) ? c.rata : c.rata.toFixed(1);

  /* --- panel target bulanan --- */
  box.appendChild(el(`<div class="rd-target">
    <div class="rd-kiri">
      <div class="rd-kepala">
        <span class="rd-ik">${I.sasaran}</span>
        <div><h3>Target Bulanan</h3>
          <p>Setiap anggota yang masih berkajian wajib mengirim minimal ${c.target} artikel setiap bulannya.</p></div>
      </div>
      <div class="rd-kotak">
        <div class="rd-angka">${rataTampil} / ${c.target} <span>Artikel</span></div>
        <div class="rd-ket">Rata-rata naskah dikirim per anggota · ${esc(namaBulan(b))} · ${c.memenuhi} dari ${c.penulis} anggota memenuhi target</div>
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
      i + 1, Store.namaUser(t.userId), t.judul, PROGRES[Store.progresTugas(t).status].l, tgl(t.deadline),
    ]));
    unduhCsv(`progress-artikel-${b}.csv`, baris);
  };

  const daftar = [...tugasBulan(b)].sort((x, y) =>
    Store.namaUser(x.userId).localeCompare(Store.namaUser(y.userId)));
  const wadah = kartu.querySelector('[data-wadah]');

  if (!daftar.length) {
    wadah.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada penugasan pada ${esc(namaBulan(b))}</p>
      <small>Tetapkan penugasan dari halaman Penugasan.</small></div>`));
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
        <td>${lencanaProgres(tg)}</td>
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

/* Penulis yang dipilihkan lebih dulu saat formulir penugasan dibuka dari
   tombol "Tugaskan" pada baris seorang anggota. */
let calonPenulis = '';

/* --- Target Artikel: setelan target + daftar penugasan bulan terpilih --- */
MODUL['target-artikel'] = {
  ruang: 'redaksi', izin: 'redaksi.manage', koleksi: 'penugasan',
  judul: 'Penugasan Artikel', satuan: 'Penugasan',
  sub: 'Tetapkan target bulanan dan bagikan judul kepada setiap anggota.',
  sumber: () => tugasBulan(),
  simpan: (data) => Store.simpanPenugasan(U, data),
  cari: (x) => `${Store.namaUser(x.userId)} ${x.judul}`,
  tajuk: (x) => x.judul,
  pratinjau: { awal: 3, akhir: 1 },
  kolom: [
    { l: 'Nama Anggota', isi: (x) => selAnggota(Store.getUser(x.userId)) },
    { l: 'Judul Artikel', isi: (x) => esc(x.judul) },
    { l: 'Progres', isi: (x) => lencanaProgres(x) },
    { l: 'Naskah', isi: (x) => { const a = Store.naskahTugas(x); return a
      ? `<span class="lencana ${STATUS_ART[a.status].c}">${STATUS_ART[a.status].l}</span>` : '<span style="color:var(--e-abu)">belum ada</span>'; } },
    { l: 'Tenggat', kelas: 'utuh', isi: (x) => tgl(x.deadline) },
  ],
  form: [
    { k: 'userId', l: 'Anggota Penulis', jenis: 'pilih', bawaan: () => calonPenulis || undefined,
      /* Hanya yang wajib menulis: anggota aktif yang masih berkajian. */
      pilihan: () => Store.wajibMenulis().map((u) => ({ v: u.id, l: `${u.nama} · ${u.angkatan}` })) },
    { k: 'judul', l: 'Judul Artikel', wajib: true, jenis: 'area', ph: 'Muhammad Abduh dan Pembaruan Tafsir' },
    { k: 'bulan', l: 'Bulan Penugasan', jenis: 'pilih', bawaan: () => bulanAktif(),
      pilihan: () => bulanPilihan().map((v) => ({ v, l: namaBulan(v) })) },
    { k: 'deadline', l: 'Tenggat', jenis: 'tanggal', wajib: true, bawaan: () => akhirBulan(bulanAktif()) },
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
      <span class="hitung">berlaku untuk anggota aktif yang masih berkajian</span></div>
    <div class="panel-isi" style="display:flex;gap:22px;flex-wrap:wrap;align-items:flex-end">
      <div class="grup" style="margin:0;width:220px">
        <label>Minimal artikel per anggota</label>
        <input type="number" min="1" max="20" id="tg" value="${c.target}">
        <div class="bantu">Dihitung dari naskah yang dikirim untuk ditinjau pada bulan itu, oleh anggota aktif yang masih berkajian.</div>
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
    <span class="hitung">(${tugasBulan().length} penugasan · ${c.naskah} naskah dikirim · ${c.memenuhi} dari ${c.penulis} anggota memenuhi target)</span>
    <div class="kanan">
      <span class="bungkus-bulan">${I.kalender}
        <select class="pilih-bulan" data-bulan>${bulanTersedia().map((x) =>
          `<option value="${x}" ${x === bulanAktif() ? 'selected' : ''}>${esc(namaBulan(x))}</option>`).join('')}</select>
      </span>
    </div></div></div>`);
  pilih.querySelector('[data-bulan]').onchange = (e) => { bulanRedaksi = e.target.value; gambar(); };
  box.appendChild(pilih);

  box.appendChild(kartuUsulJudul());
  box.appendChild(halamanOrg('target-artikel'));
  box.appendChild(kartuBelumTarget());
  return box;
};

/** Usulan judul dari anggota yang menunggu keputusan. Kosong → tak tampil. */
function kartuUsulJudul() {
  const usul = Store.usulMenunggu();
  if (!usul.length) return el('<div></div>');
  const kartu = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Usulan Judul</h3><span class="hitung">(${usul.length} menunggu keputusan)</span></div><div class="kj-izin"></div></div>`);
  usul.forEach((a) => {
    const u = Store.getUser(a.penulisId);
    const b = el(`<div class="kj-izin-br"><img src="${u?.foto || ''}" alt="">
      <div class="isi"><b>${esc(a.judul)}</b>
        <div class="kt">${esc(u?.nama || '—')} · untuk ${esc(namaBulan(a.usul.bulan))}</div>
        ${a.usul.catatan ? `<div class="al">"${esc(a.usul.catatan)}"</div>` : ''}
        <div class="alasan-izin"><input type="date" data-tenggat value="${akhirBulan(a.usul.bulan)}" title="Tenggat" style="flex:none;width:170px">
          <input data-alasan placeholder="Alasan — wajib hanya bila ditolak"></div></div>
      <div class="aksi"><button class="btn btn-lime btn-kecil" data-ya>Setujui</button>
        <button class="btn btn-garis btn-kecil" data-tidak>Tolak</button></div></div>`);
    const putus = (setuju) => {
      if (aman(() => Store.putuskanUsul(U, a.id, setuju, { deadline: b.querySelector('[data-tenggat]').value, alasan: b.querySelector('[data-alasan]').value }))) {
        toast(setuju ? 'Usulan disetujui dan menjadi penugasan.' : 'Usulan ditolak.'); gambar();
      }
    };
    b.querySelector('[data-ya]').onclick = () => putus(true);
    b.querySelector('[data-tidak]').onclick = () => putus(false);
    kartu.querySelector('.kj-izin').appendChild(b);
  });
  return kartu;
}

/** Anggota wajib menulis yang belum memenuhi target bulan terpilih. */
function kartuBelumTarget() {
  const c = Store.capaianBulan(bulanAktif());
  const belum = c.baris.filter((b) => !b.memenuhi);
  const kartu = el(`<div class="kartu" style="margin-top:20px"><div class="kartu-kepala">
    <h3>Belum Memenuhi Target</h3><span class="hitung">(${belum.length} dari ${c.baris.length} anggota · target ${c.target} naskah dikirim · ${esc(namaBulan(c.bulan))})</span></div></div>`);
  if (!belum.length) { kartu.appendChild(el(`<div class="kosong-erp">${I.cekBulat}<p>Semua anggota sudah memenuhi target</p></div>`)); return kartu; }
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama Anggota</th><th>Angkatan</th><th>Dikirim</th><th>Penugasan</th><th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  belum.forEach((b, i) => {
    const tr = el(`<tr><td class="kol-no">${i + 1}</td><td>${selAnggota(b.u)}</td><td class="utuh">${esc(b.u.angkatan || '—')}</td>
      <td class="utuh"><b>${b.kirim.length}</b> / ${c.target}</td>
      <td>${b.tugas.length ? b.tugas.map((p) => `${esc(potongJudul(p.judul, 38))} ${lencanaProgres(p)}`).join('<br>') : '<span class="lencana l-merah">belum ditugasi</span>'}</td>
      <td class="kol-aksi"><div class="sel-aksi"><button class="btn btn-garis btn-kecil">${I.tambah} Tugaskan</button></div></td></tr>`);
    tr.querySelector('button').onclick = () => { calonPenulis = b.u.id; formOrg('target-artikel', null); setTimeout(() => { calonPenulis = ''; }, 0); };
    t.querySelector('tbody').appendChild(tr);
  });
  kartu.appendChild(t);
  return kartu;
}
HAL['target-artikel'].judul = () => ['Target Artikel', 'Tetapkan target bulanan dan bagikan judul kepada setiap anggota.'];

/* --- Capaian Anggota: dari naskah yang benar-benar dikirim --- */
/** Capaian tiap anggota wajib menulis sepanjang bulan-bulan yang tercatat. */
function capaianAnggota() {
  const bulan = bulanTersedia().filter((b) => b <= nowTanggal().slice(0, 7));
  const per = new Map();
  bulan.forEach((b) => Store.capaianBulan(b).baris.forEach((x) => {
    const o = per.get(x.u.id) || { u: x.u, dikirim: 0, terbit: 0, bulanPenuh: 0, tugas: 0, tepat: 0, telat: 0 };
    o.dikirim += x.kirim.length; o.terbit += x.terbit; o.bulanPenuh += x.memenuhi ? 1 : 0;
    x.tugas.forEach((p) => { const g = Store.progresTugas(p); o.tugas += 1; if (g.status === 'siap' && g.tepat) o.tepat += 1; if (g.telat || (g.status === 'siap' && !g.tepat)) o.telat += 1; });
    per.set(x.u.id, o);
  }));
  return { bulan, daftar: [...per.values()].map((o) => ({ ...o, persen: bulan.length ? Math.round((o.bulanPenuh / bulan.length) * 100) : 0 }))
    .sort((a, b) => b.persen - a.persen || b.dikirim - a.dikirim || a.u.nama.localeCompare(b.u.nama)) };
}

HAL.performa = () => {
  const target = Store.db.redaksi.targetBulanan || 1;
  const { bulan, daftar } = capaianAnggota();

  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Dihitung dari naskah yang dikirim, bukan dari yang ditugaskan</b>
    Sebuah bulan terpenuhi bila anggota mengirim sedikitnya ${target} naskah untuk ditinjau pada bulan itu.
    Yang dihitung: anggota aktif yang masih berkajian, pada ${bulan.length} bulan tercatat.
  </div></div></div>`);

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Capaian Anggota</h3><span class="hitung">(${daftar.length} anggota · target ${target}/bulan · ${bulan.length} bulan)</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-export>${I.unduh} Export Excel</button></div>
  </div></div>`);
  kartu.querySelector('[data-export]').onclick = () => {
    const baris = [['No.', 'Nama Anggota', 'Angkatan', 'Naskah Dikirim', 'Terbit', 'Bulan Memenuhi Target', 'Dari Bulan', 'Penugasan', 'Tepat Waktu', 'Terlambat', 'Persentase']];
    daftar.forEach((d, i) => baris.push([i + 1, d.u.nama, d.u.angkatan || '', d.dikirim, d.terbit, d.bulanPenuh, bulan.length, d.tugas, d.tepat, d.telat, d.persen + '%']));
    unduhCsv('capaian-anggota.csv', baris);
  };

  if (!daftar.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada anggota yang wajib menulis</p></div>`));
    box.appendChild(kartu); return box;
  }

  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama Anggota</th><th>Dikirim</th><th>Terbit</th>
      <th>Penugasan</th><th>Tepat Waktu</th><th>Terlambat</th><th style="min-width:190px">Bulan Memenuhi Target</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  daftar.forEach((d, i) => tb.appendChild(el(`<tr>
    <td class="kol-no">${i + 1}</td>
    <td>${selAnggota(d.u)}</td>
    <td class="utuh"><b>${d.dikirim}</b></td>
    <td class="utuh"><b style="color:#4A7A1E">${d.terbit}</b></td>
    <td class="utuh">${d.tugas}</td><td class="utuh">${d.tepat}</td>
    <td class="utuh">${d.telat ? `<b style="color:#B23E37">${d.telat}</b>` : '0'}</td>
    <td><div style="display:flex;align-items:center;gap:10px">
      <div class="bar-maju" style="flex:1"><span style="width:${d.persen}%"></span></div>
      <b style="font-size:12.4px;min-width:64px;text-align:right">${d.bulanPenuh}/${bulan.length} · ${d.persen}%</b>
    </div></td>
  </tr>`)));
  kartu.appendChild(t);
  box.appendChild(kartu);
  return box;
};
HAL.performa.judul = () => ['Capaian Anggota', 'Naskah yang dikirim, terbit, dan ketepatan waktu tiap anggota.'];

/* --- Rekap Bulanan --- */
/** Lembar laporan penulisan satu bulan, siap cetak. */
function lembarLaporanArtikel(bulan) {
  const s = Store.cms.situs;
  const c = Store.capaianBulan(bulan);
  const tugas = tugasBulan(bulan);
  const kosong = (n, teks) => `<tr><td colspan="${n}" class="lk-kosong">${teks}</td></tr>`;
  const semuaKirim = Store.db.artikel.filter((a) => Store.dikirimPada(a).slice(0, 7) === bulan)
    .sort((a, b) => Store.dikirimPada(a).localeCompare(Store.dikirimPada(b)));
  return el(`<div class="lk">
    <div class="lk-kop">${lambang(40)}<div><b>KAJIAN ${esc(String(s.nama).toUpperCase())}</b><span>${esc(s.naungan || s.tagline || '')}</span></div></div>
    <h2>Laporan Penulisan Artikel</h2>
    <p class="lk-periode">${esc(namaBulan(bulan))}</p>
    <h3>1. Ringkasan</h3>
    <table><tbody>${[['Target per anggota', `${c.target} naskah dikirim`], ['Anggota wajib menulis', c.baris.length],
      ['Memenuhi target', `${c.memenuhi} anggota (${c.baris.length ? Math.round((c.memenuhi / c.baris.length) * 100) : 0}%)`],
      ['Capaian target', `${c.persen}%`], ['Naskah dikirim', semuaKirim.length], ['Sudah terbit', semuaKirim.filter((a) => a.status === 'terbit').length],
      ['Penugasan', `${tugas.length} · ${tugas.filter((p) => Store.progresTugas(p).status === 'siap').length} dikirim · ${tugas.filter((p) => Store.progresTugas(p).telat).length} lewat tenggat`]]
      .map(([l, v]) => `<tr><td style="width:70mm">${l}</td><td><b>${esc(String(v))}</b></td></tr>`).join('')}</tbody></table>
    <h3>2. Naskah Dikirim</h3>
    <table><thead><tr><th>No.</th><th>Dikirim</th><th>Judul</th><th>Penulis</th><th>Status</th></tr></thead>
      <tbody>${semuaKirim.map((a, i) => `<tr><td>${i + 1}</td><td style="white-space:nowrap">${tgl(Store.dikirimPada(a))}</td><td>${esc(a.judul)}</td>
        <td>${esc(Store.namaUser(a.penulisId))}</td><td>${STATUS_ART[a.status].l}</td></tr>`).join('') || kosong(5, 'Tidak ada naskah dikirim pada bulan ini.')}</tbody></table>
    <h3>3. Capaian per Anggota</h3>
    <table><thead><tr><th>No.</th><th>Nama</th><th>Angkatan</th><th class="lk-angka">Dikirim</th><th class="lk-angka">Terbit</th><th class="lk-angka">Ditugasi</th><th>Keterangan</th></tr></thead>
      <tbody>${c.baris.map((b, i) => `<tr><td>${i + 1}</td><td>${esc(b.u.nama)}</td><td>${esc(b.u.angkatan || '—')}</td>
        <td class="lk-angka">${b.kirim.length}</td><td class="lk-angka">${b.terbit}</td><td class="lk-angka">${b.tugas.length}</td>
        <td>${b.memenuhi ? 'Memenuhi' : `Kurang ${b.kurang}`}</td></tr>`).join('') || kosong(7, 'Belum ada anggota yang wajib menulis.')}</tbody></table>
    <p class="lk-catatan">Target dihitung dari naskah yang dikirim untuk ditinjau pada bulan ini oleh anggota aktif yang masih berkajian. Dicetak ${esc(tglSurat(nowTanggal()))}.</p>
    <div class="lk-ttd">
      <div>PJ Artikel,<div class="lk-ruang"></div><b>${esc(Store.db.users.find((u) => RBAC.kunciRole(u.role) === 'pj_kti' && u.status === 'aktif')?.nama || '………………………')}</b></div>
      <div>Mengetahui, Ketua Umum,<div class="lk-ruang"></div><b>${esc(Store.db.users.find((u) => RBAC.kunciRole(u.role) === 'ketua' && u.status === 'aktif')?.nama || '………………………')}</b></div>
    </div>
  </div>`);
}
const cetakLaporanArtikel = (bulan) => cetakKhusus(lembarLaporanArtikel(bulan), '@page { size: A4; margin: 14mm; }', `Laporan Artikel ${bulan}`);

/** Penulisan artikel dari kursi Ketua: angka bulan ini dan rekap tiap
    bulan, hanya-baca, dengan laporan yang dapat dicetak. */
HAL['pantau-artikel'] = () => {
  const kini = Store.capaianBulan(nowTanggal().slice(0, 7));
  const art = Store.db.artikel;
  const telat = Store.db.penugasan.filter((p) => Store.progresTugas(p).telat).length;
  const box = el(`<div><div class="grid-stat">
    ${[{ ik: I.dokCek, n: art.filter((a) => a.status === 'review').length, l: 'Naskah menunggu ditinjau', w: 'rgba(240,149,30,.14)', wc: '#B87310' },
       { ik: I.sasaran, n: `${kini.persen}%`, l: `Capaian target ${namaBulan(kini.bulan)}`, w: 'rgba(47,169,140,.14)', wc: '#1F7A64' },
       { ik: I.grup, n: `${kini.memenuhi}/${kini.baris.length}`, l: 'Anggota memenuhi target', w: 'rgba(62,127,184,.14)', wc: '#2C6091' },
       { ik: I.jam, n: telat, l: 'Penugasan lewat tenggat', w: 'rgba(229,83,75,.13)', wc: '#B23E37' }]
      .map((x) => `<div class="stat" style="--w:${x.w};--wc:${x.wc}"><div class="stat-ik">${x.ik}</div>
        <div class="stat-nilai">${x.n}</div><div class="stat-label">${esc(x.l)}</div></div>`).join('')}
  </div></div>`);
  const baris = bulanTersedia().map((b) => Store.capaianBulan(b));
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Penulisan per Bulan</h3><span class="hitung">(target ${kini.target} naskah dikirim per anggota per bulan)</span></div>
    <div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>Bulan</th><th>Wajib Menulis</th><th>Memenuhi</th><th>Dikirim</th><th>Terbit</th>
        <th style="min-width:160px">Capaian Target</th><th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div></div>`);
  baris.forEach((c, i) => {
    const tr = el(`<tr><td class="kol-no">${i + 1}</td><td class="utuh"><b>${esc(namaBulan(c.bulan))}</b></td>
      <td class="utuh">${c.baris.length}</td><td class="utuh">${c.memenuhi}</td><td class="utuh">${c.naskah}</td><td class="utuh">${c.terbit}</td>
      <td><div style="display:flex;align-items:center;gap:10px"><div class="bar-maju" style="flex:1"><span style="width:${c.persen}%"></span></div>
        <b style="font-size:12.4px;min-width:38px;text-align:right">${c.persen}%</b></div></td>
      <td class="kol-aksi"><div class="sel-aksi"><button class="ikon-aksi" title="Cetak laporan bulan ini">${I.dok}</button></div></td></tr>`);
    tr.querySelector('button').onclick = () => cetakLaporanArtikel(c.bulan);
    kartu.querySelector('tbody').appendChild(tr);
  });
  box.appendChild(kartu);
  return box;
};
HAL['pantau-artikel'].judul = () => ['Penulisan', 'Capaian target dan naskah yang dikirim tiap bulan.'];

HAL.rekap = () => {
  const target = Store.db.redaksi.targetBulanan || 1;
  const baris = bulanTersedia().map((b) => ({ c: Store.capaianBulan(b), tugas: tugasBulan(b) }));
  const box = el('<div></div>');
  const jml = (f) => baris.reduce((s, r) => s + f(r), 0);

  box.appendChild(el(`<div class="grid-stat">
    ${[{ ik: I.dok, n: jml((r) => r.c.naskah), l: 'Naskah dikirim', w: 'rgba(62,127,184,.14)', wc: '#2C6091' },
       { ik: I.cekBulat, n: jml((r) => r.c.terbit), l: 'Sudah terbit', w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' },
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
    const csv = [['Bulan', 'Wajib Menulis', 'Memenuhi Target', 'Naskah Dikirim', 'Terbit', 'Penugasan', 'Lewat Tenggat', 'Capaian Target']];
    baris.forEach(({ c, tugas }) => csv.push([namaBulan(c.bulan), c.baris.length, c.memenuhi, c.naskah, c.terbit, tugas.length,
      tugas.filter((p) => Store.progresTugas(p).telat).length, c.persen + '%']));
    unduhCsv('rekap-bulanan-artikel.csv', csv);
  };

  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Bulan</th><th>Wajib Menulis</th><th>Memenuhi</th><th>Dikirim</th>
      <th>Terbit</th><th>Penugasan</th><th>Lewat Tenggat</th><th style="min-width:160px">Capaian Target</th><th class="kol-aksi">Aksi</th></tr></thead>
    <tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  baris.forEach(({ c, tugas }, i) => {
    const telat = tugas.filter((p) => Store.progresTugas(p).telat).length;
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td class="utuh"><b>${esc(namaBulan(c.bulan))}</b></td>
      <td class="utuh">${c.baris.length}</td><td class="utuh"><b style="color:#4A7A1E">${c.memenuhi}</b></td>
      <td class="utuh">${c.naskah}</td><td class="utuh">${c.terbit}</td>
      <td class="utuh">${tugas.length}</td><td class="utuh">${telat ? `<b style="color:#B23E37">${telat}</b>` : '0'}</td>
      <td><div style="display:flex;align-items:center;gap:10px">
        <div class="bar-maju" style="flex:1"><span style="width:${c.persen}%"></span></div>
        <b style="font-size:12.4px;min-width:38px;text-align:right">${c.persen}%</b></div></td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi" data-buka title="Buka penugasan bulan ini">${I.kanan}</button>
        <button class="ikon-aksi" data-cetak title="Cetak laporan bulan ini">${I.dok}</button></div></td>
    </tr>`);
    tr.querySelector('[data-buka]').onclick = () => { bulanRedaksi = c.bulan; bukaModul('target-artikel'); };
    tr.querySelector('[data-cetak]').onclick = () => cetakLaporanArtikel(c.bulan);
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  box.appendChild(kartu);
  return box;
};
HAL.rekap.judul = () => ['Rekap Bulanan', 'Naskah dikirim dan capaian target tiap bulan.'];

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
  /* Kategori yang masih dipakai naskah tak dapat dipilih — aturan yang
     sama dengan tombol hapus per barisnya. */
  if (bisa) {
    pasangPilih(t, kategori, {
      satuan: 'kategori',
      boleh: (k) => !Store.db.artikel.some((a) => a.kategori === k),
      hapusSemua: (kena) => Store.ubahDraft(U, path, kategori.filter((k) => !kena.includes(k)), 'cms.kategori.edit'),
    });
  }
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
    sub: 'Rencana biaya penerbitan; realisasinya dicatat Bendahara.',
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
  pasangPilih(t, Store.db.buku, { satuan: 'proyek buku', hapus: (b) => Store.hapusBuku(U, b.id) });
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
  pasangPilih(tlBody, aktif.timeline, { satuan: 'tahapan', hapus: (x) => Store.hapusBagianBuku(U, 'timeline', x.id) });
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
  pasangPilih(td, b.desain, { satuan: 'berkas desain', hapus: (d) => Store.hapusBagianBuku(U, 'desain', d.id) });
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
  pasangPilih(t, b.produksi, { satuan: 'kegiatan', hapus: (x) => Store.hapusBagianBuku(U, 'produksi', x.id) });
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
  pasangPilih(td, b.distribusi, { satuan: 'wilayah', hapus: (d) => Store.hapusBagianBuku(U, 'distribusi', d.id) });
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
    <b>Rencana di sini, uangnya di Bendahara</b>
    Kasaran modal memperkirakan kebutuhan dana penerbitan. Uang yang benar-benar keluar dan masuk dicatat
    Bendahara pada Buku Kas dan ditautkan ke proyek ini — pusat keuangan tetap satu. Realisasinya tampil di bawah.
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

  /* Realisasi: transaksi buku kas yang ditautkan Bendahara ke proyek ini. */
  const r = realisasiBuku(b);
  const tx = [...r.keluar, ...r.masuk].sort((x, y) => y.tanggal.localeCompare(x.tanggal));
  box.appendChild(el(`<div class="kartu" style="margin-top:20px"><div class="kartu-kepala"><h3>Realisasi dari Buku Kas</h3>
    <span class="hitung">keluar ${esc(uangDua(r.keluarRp, r.keluarEgp))} · masuk ${esc(uangDua(r.masukRp, r.masukEgp))}</span></div>
    ${tx.length ? `<div class="tabel-bungkus"><table class="t-org"><thead><tr><th class="kol-no">No.</th><th>No. Bukti</th><th>Tanggal</th><th>Uraian</th>
      <th>Masuk</th><th>Keluar</th></tr></thead><tbody>${tx.map((t, i) => `<tr><td class="kol-no">${i + 1}</td>
        <td class="utuh"><span class="nia">${esc(t.nomor || '—')}</span></td><td class="utuh">${tgl(t.tanggal)}</td>
        <td><b>${esc(t.sumber || t.kategori)}</b><br><span class="sub-sel">${esc(t.kategori || '')}</span></td>
        <td class="utuh">${t.jenis === 'masuk' ? esc(Store.nominalGabung(t)) : '—'}</td>
        <td class="utuh">${t.jenis === 'keluar' ? esc(Store.nominalGabung(t)) : '—'}</td></tr>`).join('')}</tbody></table></div>`
      : `<div class="kosong-erp" style="padding:24px">${I.kotak}<p>Belum ada transaksi untuk proyek ini</p>
        <small>Bendahara menautkannya lewat "Proyek Buku Terkait" saat mencatat transaksi.</small></div>`}</div>`));
  return box;
};
HAL['buku-keuangan'].judul = () => ['Keuangan Buku', 'Rencana biaya penerbitan dan realisasinya dari Buku Kas Bendahara.'];

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
/* Lingkup diingat per peramban: koordinator yang memegang satu angkatan
   tak perlu memilihnya ulang tiap kali halaman dimuat. */
const KUNCI_LINGKUP = 'erp.lingkupKajian';
let [angkatanPilihan, levelPilihan] = (() => {
  try { const x = JSON.parse(localStorage.getItem(KUNCI_LINGKUP) || '{}'); return [x.angkatan || null, x.level || null]; }
  catch (_) { return [null, null]; }
})();
function aturLingkup(angkatan, level) {
  if (angkatan !== undefined) angkatanPilihan = angkatan;
  if (level !== undefined) levelPilihan = level;
  try { localStorage.setItem(KUNCI_LINGKUP, JSON.stringify({ angkatan: angkatanPilihan, level: levelPilihan })); } catch (_) {}
}

/* Angkatan yang dapat dibuka: yang sudah punya kajian, ditambah yang masih
   punya peserta aktif — supaya angkatan baru dapat dijadwalkan sebelum
   kajian pertamanya ada. */
const angkatanTersedia = () => [...new Set([...Store.db.kajian.map((k) => k.angkatan), ...Store.angkatanPeserta()].filter(Boolean))]
  .sort((a, b) => urutAngkatan(a) - urutAngkatan(b));
/** Jenjang yang paling banyak dipegang peserta sebuah angkatan. */
function jenjangAngkatan(angkatan) {
  const hitung = {};
  Store.pesertaAngkatan(angkatan).forEach((u) => { if (u.level && !['Alumni', '-'].includes(u.level)) hitung[u.level] = (hitung[u.level] || 0) + 1; });
  return Object.keys(hitung).sort((a, b) => hitung[b] - hitung[a])[0] || 'Level 1';
}
/* Jenjang mengikuti angkatan yang sedang dibuka: jenjang kajiannya, atau
   jenjang pesertanya bila kajiannya belum ada. */
const levelTersedia = () => {
  const ada = [...new Set(Store.db.kajian.filter((k) => k.angkatan === angkatanAktif()).map((k) => k.level).filter(Boolean))].sort();
  return ada.length ? ada : [jenjangAngkatan(angkatanAktif())];
};

function angkatanAktif() {
  const ada = angkatanTersedia();
  if (!angkatanPilihan || !ada.includes(angkatanPilihan)) {
    /* Bawaan: angkatan yang kajiannya paling dekat dengan hari ini —
       itulah yang sedang dikerjakan. */
    const jarak = (k) => Math.abs(new Date(k.tanggal) - new Date(nowTanggal()));
    const dekat = [...Store.db.kajian].filter((k) => k.angkatan && k.tanggal).sort((a, b) => jarak(a) - jarak(b))[0];
    angkatanPilihan = dekat?.angkatan || ada[0] || 'Angkatan X';
  }
  return angkatanPilihan;
}
function levelAktif() {
  const ada = levelTersedia();
  if (!levelPilihan || !ada.includes(levelPilihan)) levelPilihan = ada[0] || 'Level 3';
  return levelPilihan;
}

/** Seluruh kajian dalam lingkup, termasuk yang ditunda dan dibatalkan. */
const kajianLingkup = () => Store.db.kajian
  .filter((k) => k.angkatan === angkatanAktif() && k.level === levelAktif())
  .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
/** Kajian yang berjalan — yang dihitung dalam presensi, rekap, dan antrean. */
const kajianAktif = () => kajianLingkup().filter(Store.kajianJalan);

const anggotaAngkatan = () => Store.pesertaAngkatan(angkatanAktif());

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
  ditunda  : { l: 'Ditunda',      c: 'l-abu'    },
  dibatalkan:{ l: 'Dibatalkan',   c: 'l-merah'  },
};

/** Status diturunkan, bukan disimpan — itulah sebabnya ia tak bisa
    berbohong tentang kelengkapan data kajiannya. */
function statusKajian(k) {
  if (!Store.kajianJalan(k)) return Store.keadaanKajian(k);
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
  izin         : { l: 'Izin',        c: 'l-biru'   },
  sakit        : { l: 'Sakit',       c: 'l-biru'   },
  'tidak-hadir': { l: 'Tidak Hadir', c: 'l-merah'  },
};
/* Satu rumus untuk seluruh halaman — lihat Store.rekapKajian(). */
const rekapPresensi = (k) => Store.rekapKajian(k);

const kajianHariIni = () => kajianAktif().find((k) => k.tanggal === nowTanggal())
  || kajianAktif().find((k) => k.tanggal >= nowTanggal())
  || kajianAktif()[kajianAktif().length - 1];

/* --- yang perlu ditindak: diturunkan, bukan koleksi tersendiri ---
   Dihitung dalam lingkup angkatan & level yang sedang dibuka, sama
   seperti seluruh halaman lain di ruang kerja ini. */
const selisihHari = (tanggal) => Math.round((new Date(tanggal) - new Date(nowTanggal())) / 86400000);
function perluKajian() {
  const semua = kajianAktif();
  const lampau = semua.filter((k) => k.tanggal < nowTanggal());
  const anggota = anggotaAngkatan();
  const tercatat = lampau.filter((k) => (k.presensi || []).length);
  return {
    belumLengkap: semua.filter((k) => k.tanggal >= nowTanggal() && selisihHari(k.tanggal) <= 7)
      .map((k) => ({ k, sisa: selisihHari(k.tanggal), kurang: CEKLIS.filter((c) => !lengkapKah(k, c.k)).map((c) => c.l) }))
      .filter((x) => x.kurang.length),
    izin: Store.izinMenunggu(semua),
    makalahTelat: semua.filter(makalahTelat),
    makalahPeriksa: semua.filter((k) => Store.statusRevisi(k) === 'diperiksa'),
    berhalangan: semua.filter((k) => k.tanggal >= nowTanggal())
      .flatMap((k) => Store.petugasBerhalangan(k).map((x) => ({ k, ...x }))),
    tanpaPresensi: lampau.filter((k) => !(k.presensi || []).length),
    belumTutup: tercatat.filter((k) => !k.presensiTutup),
    tanpaNotulen: lampau.filter((k) => ['kosong', 'draf'].includes(Store.statusNotulen(k))),
    notulenAjuan: semua.filter((k) => Store.statusNotulen(k) === 'diajukan'),
    tanpaKelompok: anggota.filter((u) => !u.kelompok),
    jarangHadir: anggota.filter((u) => {
      const h = Store.kehadiranAnggota(u.id, tercatat);
      return h.wajib >= 3 && h.persen < 75;
    }),
  };
}
function antreanKajian() {
  const p = perluKajian();
  const dekat = p.belumLengkap[0];
  return kartuAntrean('Perlu Ditindak', [
    { rute: 'presensi', ikon: I.surat, judul: 'Pengajuan Izin', n: p.izin.length,
      satuan: 'pengajuan izin/sakit menunggu keputusan', kosong: 'Tidak ada pengajuan izin',
      rinci: p.izin[0] && `${Store.namaUser(p.izin[0].z.userId)} — ${p.izin[0].z.jenis}, ${p.izin[0].k.judul}` },
    ...(p.berhalangan.length ? [{ rute: 'jadwal-kajian', ikon: I.orang, judul: 'Petugas Berhalangan', n: p.berhalangan.length,
      satuan: 'petugas kajian mendatang perlu diganti', kosong: '',
      rinci: `${p.berhalangan[0].peran} "${p.berhalangan[0].k.judul}": ${p.berhalangan[0].user?.nama || '—'} ${p.berhalangan[0].sebab}` }] : []),
    { rute: 'jadwal-kajian', ikon: I.peringatan, judul: 'Kajian Belum Lengkap', n: p.belumLengkap.length,
      satuan: 'kajian dalam 7 hari masih kurang data', kosong: 'Kajian sepekan ke depan sudah lengkap',
      rinci: dekat && `${dekat.k.judul} (${dekat.sisa === 0 ? 'hari ini' : dekat.sisa + ' hari lagi'}) — kurang ${dekat.kurang.join(', ')}` },
    { rute: 'materi', ikon: I.dokCek, judul: 'Makalah Menunggu Diperiksa', n: p.makalahPeriksa.length,
      satuan: 'makalah diserahkan, belum diperiksa', kosong: 'Tidak ada makalah yang menunggu',
      rinci: p.makalahPeriksa[0] && `${p.makalahPeriksa[0].judul} — ${Store.namaUser(p.makalahPeriksa[0].pemakalahId)}` },
    { rute: 'materi', ikon: I.jam, judul: 'Makalah Lewat Tenggat', n: p.makalahTelat.length,
      satuan: 'makalah belum diserahkan', kosong: 'Tidak ada makalah yang terlambat',
      rinci: p.makalahTelat[0] && `${p.makalahTelat[0].judul} — tenggat ${tgl(Store.tenggatMakalah(p.makalahTelat[0]))}` },
    { rute: 'presensi', ikon: I.daftarCek, judul: 'Presensi Belum Diisi', n: p.tanpaPresensi.length,
      satuan: 'kajian lampau tanpa presensi', kosong: 'Semua kajian lampau berpresensi',
      rinci: p.tanpaPresensi[0] && `${p.tanpaPresensi[0].judul} · ${tgl(p.tanpaPresensi[0].tanggal)}` },
    { rute: 'presensi', ikon: I.gembok, judul: 'Presensi Belum Ditutup', n: p.belumTutup.length,
      satuan: 'kajian lampau presensinya belum dikunci', kosong: 'Semua presensi lampau sudah ditutup',
      rinci: p.belumTutup[0] && `${p.belumTutup[0].judul} — ${rekapPresensi(p.belumTutup[0]).belum} orang belum absen` },
    { rute: 'notulen', ikon: I.dokCek, judul: 'Notulen Menunggu Pengesahan', n: p.notulenAjuan.length,
      satuan: 'notulen diajukan penulisnya', kosong: 'Tidak ada notulen yang menunggu',
      rinci: p.notulenAjuan[0] && `${p.notulenAjuan[0].judul} — ${Store.namaUser(p.notulenAjuan[0].notulenId)}` },
    { rute: 'notulen', ikon: I.dok, judul: 'Notulen Belum Selesai', n: p.tanpaNotulen.length,
      satuan: 'kajian lampau notulennya belum ditulis atau masih draf', kosong: 'Semua kajian lampau bernotulen',
      rinci: p.tanpaNotulen[0] && `${p.tanpaNotulen[0].judul} · ${tgl(p.tanpaNotulen[0].tanggal)}` },
    { rute: 'anggota-kajian', ikon: I.grup, judul: 'Anggota Tanpa Kelompok', n: p.tanpaKelompok.length,
      satuan: `anggota ${angkatanAktif()} belum berkelompok`, kosong: 'Semua anggota sudah berkelompok',
      rinci: p.tanpaKelompok[0] && p.tanpaKelompok[0].nama },
    { rute: 'statistik', ikon: I.ukur, judul: 'Kehadiran di Bawah 75%', n: p.jarangHadir.length,
      satuan: 'anggota jarang hadir', kosong: 'Tidak ada anggota yang jarang hadir',
      rinci: p.jarangHadir[0] && p.jarangHadir[0].nama },
  ]);
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

  box.appendChild(antreanKajian());
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
  const pres = panelMW(!kHari ? 'Presensi Kajian' : kHari.tanggal === nowTanggal() ? 'Presensi Kajian Hari Ini'
    : kHari.tanggal > nowTanggal() ? 'Kajian Berikutnya' : 'Kajian Terakhir', I.daftarCek, 'Lihat Semua', () => bukaModul('presensi'));
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

    /* Yang dipindai adalah kartu anggota, bukan kode kajian — karena itu
       di sini tak ada gambar QR, hanya pintu ke Mode Presensi. */
    const qrPanel = el(`<div class="kj-qr">
      <div><h4>Pindai Kartu Anggota</h4>
        <p>Buka Mode Presensi, lalu arahkan kamera ponsel ke QR pada kartu tiap anggota.</p>
        <button class="btn btn-lime btn-kecil" data-scan>${I.qr} Mode Presensi</button></div>
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

  const angg = panelMW('Anggota & Kelompok', I.grup, 'Lihat Semua', () => bukaModul('anggota-kajian'));
  if (anggota.length) {
    const ringkas = el(`<div class="kj-ringkas">
      ${[['Total Anggota', Store.db.users.filter((u) => u.angkatan === angkatanAktif()).length], ['Anggota Aktif', anggota.length],
         ['Tidak Aktif', Store.db.users.filter((u) => u.angkatan === angkatanAktif() && u.status !== 'aktif').length],
         ['Total Kelompok', new Set(anggota.map((u) => u.kelompok).filter(Boolean)).size]]
        .map(([l, n]) => `<div class="br"><span>${l}</span><b>${n}</b></div>`).join('')}
    </div>`);
    const kelola = el(`<button class="btn btn-garis btn-kecil" style="width:100%">${I.grup} Kelola Anggota</button>`);
    kelola.onclick = () => bukaModul('anggota-kajian');
    ringkas.appendChild(kelola);
    angg.isi.appendChild(ringkas);
  }
  baris2.appendChild(angg.el);

  const kDekat = mendatang[0];
  const tug = panelMW('Pembagian Tugas', I.orang, 'Lihat Semua', () => bukaModul('jadwal-kajian'));
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
    <div class="mw-pusat-kepala">${I.petir}<h3>Aksi Cepat</h3></div>
    <div class="mw-pusat-kisi"></div></div>`);
  [
    { ik: I.kalender,  l: 'Buat Jadwal Kajian', fn: () => formKajian(null) },
    { ik: I.qr,        l: 'Mode Presensi',      fn: () => (kHari ? dialogScan(kHari) : bukaModul('presensi')) },
    { ik: I.daftarCek, l: 'Presensi Manual',    fn: () => (kHari ? dialogAbsensi(kHari) : bukaModul('presensi')) },
    { ik: I.grup,      l: 'Anggota & Kelompok', fn: () => bukaModul('anggota-kajian') },
    { ik: I.kartu || I.qr, l: 'Kartu Anggota',  fn: () => bukaModul('kartu-qr') },
    { ik: I.papan,     l: 'Materi & Makalah',   fn: () => bukaModul('materi') },
    { ik: I.unduh,     l: 'Rekap & Statistik',  fn: () => bukaModul('rekap-kajian') },
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
/* ------------------------------------------------------------
   PEMINDAI KARTU — kamera ponsel membaca QR kartu anggota
   ------------------------------------------------------------
   Peramban yang punya BarcodeDetector (Chrome di Android) membacanya
   sendiri. Yang tidak — iPhone, Firefox — memakai jsQR, yang dimuat
   baru saat itu juga. Kolom ketik selalu tersedia: untuk kartu yang
   tertinggal atau lecet, dan untuk alat pemindai yang "mengetik"
   kodenya lalu menekan Enter.

   Kamera hanya menyala selama layar pindai terbuka, dan dimatikan
   begitu ditutup — lampu kamera tak boleh tetap menyala diam-diam.
   ------------------------------------------------------------ */
function muatJsQR() {
  if (window.jsQR) return Promise.resolve();
  return new Promise((jadi, gagal) => {
    const sk = document.createElement('script');
    sk.src = 'assets/js/vendor/jsQR.js';
    sk.onload = jadi;
    sk.onerror = () => gagal(new Error('Pembaca QR gagal dimuat. Periksa sambungan, atau ketik nomor induknya.'));
    document.head.appendChild(sk);
  });
}

/** Pasang pemindai ke dalam `wadah`. `saatKode(kode)` dipanggil tiap kode
    terbaca atau diketik. Mengembalikan fungsi untuk mematikan kamera. */
function pasangPemindai(wadah, saatKode) {
  const n = el(`<div class="pm">
    <div class="pm-layar"><video playsinline muted></video><div class="pm-bidik"></div>
      <div class="pm-pesan" data-pesan>Menyalakan kamera…</div></div>
    <form class="pm-ketik"><input placeholder="Atau ketik nomor induk — AI-10-007" autocomplete="off" autocapitalize="characters">
      <button class="btn btn-garis btn-kecil">Catat</button></form></div>`);
  wadah.appendChild(n);
  const video = n.querySelector('video');
  const pesan = n.querySelector('[data-pesan]');
  const ketik = n.querySelector('input');
  let hidup = true, aliran = null, terakhir = '', kapan = 0;

  n.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    const kode = ketik.value.trim();
    if (kode) saatKode(kode);
    ketik.value = '';
  };

  const terima = (kode) => {
    kode = String(kode || '').trim();
    if (!kode) return;
    /* Kartu yang masih di depan kamera terbaca berkali-kali per detik.
       Selama ia terus terlihat, jedanya diperpanjang — kartu yang sama
       baru dihitung lagi setelah tiga detik benar-benar menghilang.
       Tanpa ini, layar "HADIR" berganti "SUDAH TERCATAT" di depan mata
       orang yang kartunya masih terangkat. */
    const ulang = kode === terakhir && Date.now() - kapan < 3000;
    terakhir = kode; kapan = Date.now();
    if (!ulang) saatKode(kode);
  };

  (async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Peramban ini tidak memberi akses kamera.');
      aliran = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      if (!hidup) { aliran.getTracks().forEach((t) => t.stop()); return; }
      video.srcObject = aliran;
      /* Tidak ditunggu: di sebagian peramban janji play() baru selesai
         setelah bingkai pertama tampil, dan pembacaan tak perlu menanti itu. */
      video.muted = true;
      video.play().catch(() => {});

      let detektor = null;
      if ('BarcodeDetector' in window) {
        try {
          if ((await window.BarcodeDetector.getSupportedFormats()).includes('qr_code'))
            detektor = new window.BarcodeDetector({ formats: ['qr_code'] });
        } catch (_) { /* jatuh ke jsQR */ }
      }
      if (!detektor) await muatJsQR();
      pesan.textContent = 'Arahkan kamera ke QR pada kartu anggota';

      const kanvas = document.createElement('canvas');
      const ctx = kanvas.getContext('2d', { willReadFrequently: true });
      const putar = async () => {
        if (!hidup) return;
        if (video.readyState >= 2 && video.videoWidth) {
          try {
            if (detektor) {
              terima((await detektor.detect(video))[0]?.rawValue);
            } else {
              /* Bingkai dikecilkan: 640 piksel cukup untuk QR kartu, dan
                 membaca bingkai utuh tiap putaran memanaskan ponsel. */
              const skala = Math.min(1, 640 / video.videoWidth);
              kanvas.width = Math.round(video.videoWidth * skala);
              kanvas.height = Math.round(video.videoHeight * skala);
              ctx.drawImage(video, 0, 0, kanvas.width, kanvas.height);
              const gbr = ctx.getImageData(0, 0, kanvas.width, kanvas.height);
              terima(window.jsQR(gbr.data, gbr.width, gbr.height, { inversionAttempts: 'dontInvert' })?.data);
            }
          } catch (_) { /* bingkai yang gagal dibaca dilewati saja */ }
        }
        setTimeout(putar, 160);
      };
      putar();
    } catch (e) {
      const ditolak = e?.name === 'NotAllowedError' || e?.name === 'SecurityError';
      pesan.textContent = ditolak ? 'Izin kamera ditolak. Izinkan kamera di peramban, atau ketik nomor induknya.'
        : e?.name === 'NotFoundError' ? 'Tidak ada kamera di perangkat ini. Ketik nomor induknya.'
          : /QR gagal dimuat/.test(e?.message || '') ? e.message
            : 'Kamera tidak dapat dinyalakan di perangkat ini. Ketik nomor induknya.';
      n.classList.add('tanpa-kamera');
    }
  })();

  return () => {
    hidup = false;
    aliran?.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
  };
}

/** Layar pindai penuh. `isi(badan, tutup)` mengisi panel kanannya dan
    mengembalikan penangan kode. */
function layarPindai(judul, sub, isi) {
  const n = el(`<div class="layar-pindai">
    <div class="lp-kepala"><div><h2>${esc(judul)}</h2><span>${esc(sub)}</span></div>
      <button class="btn btn-garis btn-kecil" data-tutup>${I.tutup} Selesai</button></div>
    <div class="lp-badan"><div class="lp-kamera" data-kamera></div><div class="lp-sisi" data-sisi></div></div></div>`);
  document.body.appendChild(n);
  let matikan = () => {};
  const esc2 = (e) => { if (e.key === 'Escape' && !document.querySelector('.tirai-erp.buka')) tutup(); };
  function tutup() {
    matikan();
    document.removeEventListener('keydown', esc2);
    n.remove();
    gambar();
  }
  const saatKode = isi(n.querySelector('[data-sisi]'), tutup);
  matikan = pasangPemindai(n.querySelector('[data-kamera]'), saatKode);
  n.querySelector('[data-tutup]').onclick = tutup;
  document.addEventListener('keydown', esc2);
  return tutup;
}

/* Mode Presensi — untuk petugas di pintu kajian. Satu pindaian, satu
   orang: nama dan statusnya tampil besar, lalu layar siap untuk orang
   berikutnya tanpa perlu disentuh. */
function modePresensi(k) {
  if (k.presensiTutup) return toast('Presensi kajian ini sudah ditutup.', true);
  const batas = Store.toleransiKajian(k);
  /* Objek kajian di memori dapat berganti saat data dimuat ulang. */
  const idKajian = k.id;
  const kini = () => Store.db.kajian.find((x) => x.id === idKajian) || k;
  layarPindai(k.judul, `${tgl(k.tanggal)} · mulai ${k.jam || '—'} · batas terlambat ${batas} menit · ${k.angkatan || 'semua angkatan'}`, (sisi) => {
    sisi.innerHTML = `
      <div class="lp-hitung" data-hitung></div>
      <div class="lp-hasil" data-hasil><div class="lp-tunggu">${I.qr}<span>Menunggu pindaian pertama</span></div></div>
      <div class="lp-riwayat" data-riwayat></div>
      <button class="btn btn-merah btn-kecil" data-tutup-presensi>Tutup Presensi</button>`;
    const hitung = sisi.querySelector('[data-hitung]');
    const hasil = sisi.querySelector('[data-hasil]');
    const riwayat = sisi.querySelector('[data-riwayat]');

    const segarHitung = () => {
      const r = Store.rekapKajian(kini());
      hitung.innerHTML = [['Hadir', r.hadir, 'hijau'], ['Terlambat', r.terlambat, 'merah'],
        ['Izin/Sakit', r.izin, 'abu'], ['Belum Absen', r.belum, 'abu']]
        .map(([l, n, c]) => `<div class="lp-sel ${c}"><b>${n}</b><span>${l}</span></div>`).join('');
    };
    const tampil = (kelas, kepala, nama, ket, foto) => {
      hasil.className = `lp-hasil ${kelas}`;
      hasil.innerHTML = `${foto ? `<img src="${foto}" alt="">` : ''}<div class="lp-status">${esc(kepala)}</div>
        <div class="lp-nama">${esc(nama)}</div><div class="lp-ket">${esc(ket)}</div>`;
    };

    sisi.querySelector('[data-tutup-presensi]').onclick = () => konfirmasi('Tutup presensi',
      'Semua peserta yang belum memindai akan dicatat tidak hadir, lalu presensi dikunci. Sesudah itu hanya koordinator yang dapat mengubahnya, dengan alasan.',
      async () => {
        const n = await amanTunggu(null, () => Store.tutupPresensi(U, idKajian));
        if (n === null) return;
        toast(`Presensi ditutup. ${n} orang dicatat tidak hadir.`);
        segarHitung();
        sisi.closest('.layar-pindai')?.querySelector('[data-tutup]')?.click();
      },
      'Ya, tutup presensi');

    segarHitung();
    return async (kode) => {
      try {
        const h = await Store.presensiDariKode(U, idKajian, kode);
        const telat = h.status === 'terlambat';
        tampil(h.sudah ? 'sudah' : telat ? 'telat' : 'hadir',
          h.sudah ? 'SUDAH TERCATAT' : telat ? 'TERLAMBAT' : 'HADIR',
          h.user.nama, `${h.user.nia || ''} · pukul ${h.jam}${h.sudah ? ` · ${PRESENSI[h.status].l.toLowerCase()}` : ''}`, h.user.foto);
        if (!h.sudah) riwayat.prepend(el(`<div class="presensi-baris"><img src="${h.user.foto}" alt="">
          <span class="nm">${esc(h.user.nama)}</span><span class="jm">${esc(h.jam)}</span>
          <span class="lencana ${PRESENSI[h.status].c}">${PRESENSI[h.status].l}</span></div>`));
        navigator.vibrate?.(telat ? [90, 60, 90] : 70);
        segarHitung();
      } catch (e) {
        tampil('galat', 'DITOLAK', e.message, `Kode: ${kode}`, '');
        navigator.vibrate?.([200, 80, 200]);
      }
    };
  });
}
/* Nama lama dipertahankan: halaman Presensi dan dasbor memanggilnya. */
function dialogScan(k) { modePresensi(k); }

/* ---------------- halaman ---------------- */
const SARING_JADWAL = {
  semua    : ['Semua', () => true],
  mendatang: ['Mendatang', (k) => Store.kajianJalan(k) && k.tanggal >= nowTanggal()],
  lampau   : ['Terlaksana', (k) => statusKajian(k) === 'selesai'],
  henti    : ['Ditunda & Dibatalkan', (k) => !Store.kajianJalan(k)],
};
let saringJadwal = 'semua';

HAL['jadwal-kajian'] = () => {
  const lingkup = kajianLingkup();
  const semua = lingkup.filter(SARING_JADWAL[saringJadwal][1]);
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Jadwal & Tugas</h3><span class="hitung">(${semua.length} kajian · ${esc(angkatanAktif())} · ${esc(levelAktif())})</span>
    <div class="kanan">
      <select class="pilih-saring" data-saring>${Object.entries(SARING_JADWAL).map(([id, [l, f]]) =>
        `<option value="${id}" ${id === saringJadwal ? 'selected' : ''}>${l} (${lingkup.filter(f).length})</option>`).join('')}</select>
      <button class="btn btn-kecil" data-tambah>${I.tambah} Buat Jadwal Kajian</button></div>
  </div></div>`);
  kartu.querySelector('[data-tambah]').onclick = () => formKajian(null);
  kartu.querySelector('[data-saring]').onchange = (e) => { saringJadwal = e.target.value; gambar(); };

  if (!semua.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>${lingkup.length ? 'Tidak ada kajian pada saringan ini' : 'Belum ada kajian'}</p>
      <small>${lingkup.length ? 'Ganti saringan di kanan atas.' : 'Buat jadwal pertama untuk angkatan ini.'}</small></div>`));
    return kartu;
  }
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Pemakalah</th>
      <th>Moderator</th><th>Notulen</th><th class="kol-tengah">PPT</th><th class="kol-tengah">Revisi</th>
      <th>Tempat</th><th style="min-width:120px">Kesiapan</th><th>Status</th><th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  semua.forEach((k, i) => {
    const siap = kesiapan(k);
    const keadaan = Store.keadaanKajian(k);
    const jejak = [...(k.riwayat || [])].reverse().find((r) => r.jenis === (keadaan === 'dibatalkan' ? 'batal' : 'tunda'));
    const ket = keadaan !== 'terjadwal' && jejak ? jejak.alasan
      : jejak?.ke ? `Dipindah dari ${tgl(jejak.dari)} — ${jejak.alasan}` : '';
    const berisi = Store.kajianBerisi(k);
    const adaPresensi = (k.presensi || []).length > 0;
    const halang = keadaan === 'terjadwal' && k.tanggal >= nowTanggal() ? Store.petugasBerhalangan(k) : [];
    const selPetugas = (kunci) => {
      const h = halang.find((x) => x.kunci === kunci);
      return `${esc(namaPendek(k[kunci]))}${h ? `<br><span class="lencana l-merah" title="Perlu diganti">${esc(h.sebab)}</span>` : ''}`;
    };
    const tr = el(`<tr class="${keadaan === 'dibatalkan' ? 'baris-batal' : ''}">
      <td class="kol-no">${i + 1}</td>
      <td class="utuh">${tgl(k.tanggal)}<br><span style="color:var(--e-abu);font-size:11.6px">${esc(k.jam)}</span></td>
      <td><b>${esc(k.judul)}</b>${ket ? `<br><span style="color:var(--e-abu);font-size:11.6px">${esc(ket)}</span>` : ''}</td>
      <td>${selPetugas('pemakalahId')}</td>
      <td>${selPetugas('moderatorId')}</td>
      <td>${selPetugas('notulenId')}</td>
      <td class="kol-tengah">${tandaLengkap(k.ppt)}</td>
      <td class="kol-tengah">${tandaLengkap(k.revisi)}</td>
      <td class="utuh">${esc(k.tempat || '—')}</td>
      <td><div style="display:flex;align-items:center;gap:9px">
        <div class="bar-maju" style="flex:1"><span style="width:${siap}%"></span></div>
        <b style="font-size:12.2px">${siap}%</b></div></td>
      <td>${lencanaKajian(k)}</td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Sunting jadwal & tugas">${I.sunting}</button>
        ${keadaan === 'dibatalkan' ? `<button class="ikon-aksi" data-pulih title="Pulihkan kajian">${I.putar}</button>` : `
          ${adaPresensi ? '' : `<button class="ikon-aksi" data-tunda title="${keadaan === 'ditunda' ? 'Jadwalkan ulang' : 'Tunda / pindah tanggal'}">${I.jam}</button>`}
          <button class="ikon-aksi" data-batal title="Batalkan kajian">${I.tutup}</button>`}
        ${berisi ? '' : `<button class="ikon-aksi hapus" title="Hapus">${I.hapus}</button>`}</div></td></tr>`);
    tr.querySelector('.sunting').onclick = () => formKajian(k);
    tr.querySelector('[data-tunda]')?.addEventListener('click', () => dialogTundaKajian(k));
    tr.querySelector('[data-batal]')?.addEventListener('click', () => dialogBatalKajian(k));
    tr.querySelector('[data-pulih]')?.addEventListener('click', () => {
      if (aman(() => Store.pulihkanKajian(U, k.id))) { toast('Kajian dipulihkan.'); gambar(); }
    });
    tr.querySelector('.hapus')?.addEventListener('click', () => konfirmasi('Hapus jadwal kajian',
      `"${k.judul}" akan dihapus. Kajian ini belum memuat presensi maupun notulen.`,
      () => { if (aman(() => Store.hapusKajian(U, k.id))) { toast('Jadwal dihapus.'); gambar(); } }));
    tb.appendChild(tr);
  });
  /* Yang sudah memuat presensi atau notulen tak dapat dipilih untuk dihapus. */
  pasangPilih(t, semua, { satuan: 'jadwal kajian', boleh: (k) => !Store.kajianBerisi(k), hapus: (k) => Store.hapusKajian(U, k.id) });
  kartu.appendChild(t);
  const box = el('<div></div>');
  box.append(kartu, kartuGiliran());
  return box;
};

/** Giliran tugas peserta dalam lingkup: siapa sudah berapa kali memegang
    apa, dan siapa yang belum pernah — bahan membagi tugas dengan adil. */
function kartuGiliran() {
  const beban = Store.bebanTugas(angkatanAktif(), kajianAktif())
    .sort((a, b) => a.total - b.total || a.u.nama.localeCompare(b.u.nama));
  const belum = beban.filter((b) => !b.total).length;
  const kartu = el(`<div class="kartu" style="margin-top:20px"><div class="kartu-kepala">
    <h3>Giliran Tugas</h3><span class="hitung">(${beban.length} peserta · ${belum} belum pernah bertugas · urut dari yang paling jarang)</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-export>${I.unduh} Unduh CSV</button></div></div></div>`);
  kartu.querySelector('[data-export]').onclick = () => unduhCsv(`giliran-tugas-${angkatanAktif().replace(/\s/g, '-').toLowerCase()}.csv`,
    [['Nama', 'Kelompok', 'Pemakalah', 'Moderator', 'Notulen', 'Total', 'Tugas Berikutnya', 'Terakhir Bertugas'],
      ...beban.map((b) => [b.u.nama, b.u.kelompok || '', b.pemakalahId, b.moderatorId, b.notulenId, b.total,
        b.berikut ? `${b.berikut.peran} ${b.berikut.k.tanggal}` : '', b.terakhir])]);
  if (!beban.length) { kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>${esc(angkatanAktif())} belum punya peserta aktif</p></div>`)); return kartu; }
  const maks = Math.max(1, ...beban.map((b) => b.total));
  kartu.appendChild(el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama</th><th>Kelompok</th><th class="kol-tengah">Pemakalah</th><th class="kol-tengah">Moderator</th>
      <th class="kol-tengah">Notulen</th><th style="min-width:130px">Total</th><th>Tugas Berikutnya</th><th>Terakhir Bertugas</th></tr></thead>
    <tbody>${beban.map((b, i) => `<tr><td class="kol-no">${i + 1}</td>
      <td><b>${esc(b.u.nama)}</b></td><td class="utuh">${esc(b.u.kelompok || '—')}</td>
      <td class="kol-tengah">${b.pemakalahId || '—'}</td><td class="kol-tengah">${b.moderatorId || '—'}</td><td class="kol-tengah">${b.notulenId || '—'}</td>
      <td>${b.total ? `<div style="display:flex;align-items:center;gap:9px"><div class="bar-maju" style="flex:1"><span style="width:${Math.round((b.total / maks) * 100)}%"></span></div><b style="font-size:12.2px">${b.total}</b></div>`
        : '<span class="lencana l-kuning">belum pernah</span>'}</td>
      <td>${b.berikut ? `${esc(b.berikut.peran)} · ${tgl(b.berikut.k.tanggal)}` : '—'}</td>
      <td class="utuh">${b.terakhir ? tgl(b.terakhir) : '—'}</td></tr>`).join('')}</tbody></table></div>`));
  return kartu;
}
HAL['jadwal-kajian'].judul = () => ['Jadwal & Tugas', 'Jadwal, pembagian pemakalah–moderator–notulen, dan kesiapan tiap pertemuan.'];

/** Kelompok yang sudah dipakai sebuah angkatan, urut alami (2 sebelum 10). */
const kelompokAngkatan = (angkatan) => [...new Set(Store.db.users
  .filter((u) => u.angkatan === angkatan).map((u) => u.kelompok).filter(Boolean))]
  .sort((a, b) => a.localeCompare(b, 'id', { numeric: true }));
let saringKelompok = '';

HAL['anggota-kajian'] = () => {
  const seAngkatan = Store.db.users.filter((u) => u.angkatan === angkatanAktif())
    .sort((a, b) => a.nama.localeCompare(b.nama));
  const kelompok = kelompokAngkatan(angkatanAktif());
  if (saringKelompok && saringKelompok !== '-' && !kelompok.includes(saringKelompok)) saringKelompok = '';
  const anggota = seAngkatan.filter((u) => !saringKelompok
    || (saringKelompok === '-' ? !u.kelompok : u.kelompok === saringKelompok));
  const peserta = seAngkatan.filter(Store.berkajian);
  const box = el(`<div><div class="notis notis-kuning">${I.perisai}<div>
    <b>Terbatas pada ${esc(angkatanAktif())}</b>
    Anda dapat mengubah jenjang, kelompok, dan keaktifan anggota angkatan ini.
    Menambah akun baru serta mengubah surel dan peran tetap wewenang Sekretaris dan Ketua.
  </div></div></div>`);

  /* --- ringkasan kelompok: klik untuk menyaring --- */
  const tanpa = peserta.filter((u) => !u.kelompok).length;
  const ring = el(`<div class="kj-kelompok">
    ${[['', 'Semua', seAngkatan.length], ...kelompok.map((k) => [k, k, peserta.filter((u) => u.kelompok === k).length]),
       ...(tanpa ? [['-', 'Tanpa Kelompok', tanpa]] : [])]
      .map(([id, l, n]) => `<button class="kj-kel${id === saringKelompok ? ' aktif' : ''}${id === '-' ? ' perlu' : ''}" data-kel="${esc(id)}">
        <b>${n}</b><span>${esc(l)}</span></button>`).join('')}
  </div>`);
  ring.querySelectorAll('[data-kel]').forEach((b) => { b.onclick = () => { saringKelompok = b.dataset.kel; gambar(); }; });
  box.appendChild(ring);

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Anggota & Kelompok</h3><span class="hitung">(${anggota.length} orang · ${peserta.length} peserta kajian · ${kelompok.length} kelompok)</span>
    <div class="kanan">
      <button class="btn btn-garis btn-kecil" data-jenjang>${I.naik} Ubah Jenjang</button>
      <button class="btn btn-garis btn-kecil" data-bagi>${I.grup} Bagi Kelompok</button>
      <button class="btn btn-garis btn-kecil" data-qr>${I.qr} Kartu QR</button></div>
  </div></div>`);
  kartu.querySelector('[data-qr]').onclick = () => bukaModul('kartu-qr');
  kartu.querySelector('[data-bagi]').onclick = () => dialogBagiKelompok();
  kartu.querySelector('[data-jenjang]').onclick = () => dialogJenjangAngkatan();

  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama</th><th>Jenjang</th><th>Kelompok</th>
      <th>Kehadiran</th><th>Status</th><th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  const tercatat = kajianAktif().filter((k) => (k.presensi || []).length);
  anggota.forEach((u, i) => {
    const h = Store.kehadiranAnggota(u.id, tercatat);
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td><div style="display:flex;align-items:center;gap:10px">
        <img src="${u.foto}" alt="" style="width:30px;height:30px;border-radius:50%;flex:none">
        <div><b>${esc(u.nama)}</b><br><span style="color:var(--e-abu);font-size:11.6px">${esc(Store.kodeQr(u.id))}</span></div>
      </div></td>
      <td class="utuh">${esc(u.level)}</td>
      <td class="utuh">${u.kelompok ? esc(u.kelompok) : Store.berkajian(u) ? '<span class="lencana l-kuning">belum</span>' : '—'}</td>
      <td>${h.wajib ? `<div style="display:flex;align-items:center;gap:9px">
        <div class="bar-maju" style="flex:1;min-width:70px"><span style="width:${h.persen}%"></span></div>
        <b style="font-size:12.2px">${h.persen}%</b><span style="color:var(--e-abu);font-size:11.6px">${h.datang}/${h.wajib}</span></div>`
        : '<span style="color:var(--e-abu)">belum ada kajian</span>'}</td>
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
HAL['anggota-kajian'].judul = () => ['Anggota & Kelompok', 'Jenjang, kelompok, dan kehadiran anggota angkatan aktif.'];

function formAnggotaKajian(u) {
  const kelompok = kelompokAngkatan(u.angkatan);
  const isi = el(`<div>
    <p style="margin:0 0 16px;font-size:13px;color:var(--e-abu)">
      <b>${esc(u.nama)}</b> · ${esc(u.email)} · ${esc(u.angkatan)}</p>
    <div class="grid-form-3">
      <div class="grup"><label>Jenjang</label><select id="lv">
        ${['Tatsqif', 'Level 1', 'Level 2', 'Level 3', 'Alumni', '-'].map((x) => `<option ${u.level === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="grup"><label>Kelompok</label><input id="kl" list="daftar-kel" value="${esc(u.kelompok || '')}" placeholder="Kosong = tanpa kelompok">
        <datalist id="daftar-kel">${kelompok.map((x) => `<option value="${esc(x)}">`).join('')}</datalist></div>
      <div class="grup"><label>Status</label><select id="st">
        ${['aktif', 'nonaktif', 'alumni'].map((x) => `<option ${u.status === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    </div>
    <div class="bantu">Kelompok dapat dipilih dari yang sudah ada atau diketik baru. Surel dan peran hanya dapat diubah Sekretaris dan Ketua.</div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: 'Ubah Data Anggota', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    if (aman(() => Store.simpanAnggotaKajian(U, { id: u.id, level: isi.querySelector('#lv').value,
      kelompok: isi.querySelector('#kl').value.trim(), status: isi.querySelector('#st').value }))) {
      tutupModal(); toast('Data anggota tersimpan.'); gambar();
    }
  };
}

/** Bagi peserta angkatan aktif ke N kelompok. Hasilnya ditampilkan dulu;
    baru tersimpan sesudah disetujui. */
function dialogBagiKelompok() {
  const peserta = anggotaAngkatan().sort((a, b) => a.nama.localeCompare(b.nama));
  if (!peserta.length) return toast(`${angkatanAktif()} belum punya peserta aktif.`, true);
  const awal = Math.max(1, kelompokAngkatan(angkatanAktif()).length || Math.round(peserta.length / 5));
  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.4px;color:var(--e-abu)">${peserta.length} peserta aktif ${esc(angkatanAktif())}.</p>
    <div class="grid-form-3">
      <div class="grup"><label>Jumlah Kelompok</label><input type="number" data-n min="1" max="${peserta.length}" value="${awal}"></div>
      <div class="grup"><label>Cara Membagi</label><select data-cara>
        <option value="isi">Hanya yang belum berkelompok</option>
        <option value="acak">Acak ulang semuanya</option>
        <option value="urut">Urut nama, semuanya</option></select></div>
      <div class="grup"><label>&nbsp;</label><button class="btn btn-garis" data-ulang style="width:100%">${I.putar} Susun Ulang</button></div>
    </div>
    <div class="kj-bagi" data-hasil></div>
    <div class="bantu">Kelompok dinamai "Kelompok 1", "Kelompok 2", dan seterusnya. Belum ada yang tersimpan sampai Anda menekan Terapkan.</div>
  </div>`);
  let rencana = [];
  const susun = () => {
    const n = Math.min(peserta.length, Math.max(1, Math.round(Number(isi.querySelector('[data-n]').value) || 1)));
    const cara = isi.querySelector('[data-cara]').value;
    const nama = (i) => `Kelompok ${i + 1}`;
    const isiKel = Array.from({ length: n }, () => []);
    let antre = [...peserta];
    if (cara === 'isi') {
      /* Yang sudah di Kelompok 1..N tetap di tempatnya; sisanya mengisi
         kelompok yang paling sedikit lebih dulu. */
      antre = [];
      peserta.forEach((u) => { const i = Array.from({ length: n }, (_, j) => nama(j)).indexOf(u.kelompok); if (i >= 0) isiKel[i].push(u); else antre.push(u); });
    }
    if (cara === 'acak') antre.sort(() => Math.random() - 0.5);
    antre.forEach((u) => { isiKel.reduce((a, b) => (b.length < a.length ? b : a)).push(u); });
    rencana = isiKel.flatMap((g, i) => g.map((u) => ({ id: u.id, kelompok: nama(i) })));
    const pindah = rencana.filter((r) => (Store.getUser(r.id).kelompok || '') !== r.kelompok).length;
    isi.querySelector('[data-hasil]').innerHTML = isiKel.map((g, i) => `<div class="kj-bagi-kel">
      <div class="jd">${nama(i)} <span>${g.length} orang</span></div>
      ${g.map((u) => `<div class="br${(u.kelompok || '') !== nama(i) ? ' baru' : ''}">${esc(namaPendek(u.id))}</div>`).join('')}</div>`).join('')
      + `<div class="kj-bagi-ket">${pindah ? `${pindah} orang berpindah atau baru mendapat kelompok (ditandai).` : 'Tidak ada yang berubah.'}</div>`;
  };
  isi.querySelector('[data-n]').oninput = susun;
  isi.querySelector('[data-cara]').onchange = susun;
  isi.querySelector('[data-ulang]').onclick = susun;
  susun();
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Terapkan</button></div>`);
  modal({ judul: 'Bagi kelompok', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    let n = 0;
    if (aman(() => { n = Store.simpanAnggotaMassal(U, rencana, `Membagi kelompok ${angkatanAktif()}`); })) {
      tutupModal(); toast(n ? `${n} anggota diperbarui kelompoknya.` : 'Tidak ada yang berubah.'); gambar();
    }
  };
}

/** Naikkan (atau ubah) jenjang seluruh peserta angkatan aktif sekaligus. */
function dialogJenjangAngkatan() {
  const peserta = anggotaAngkatan();
  if (!peserta.length) return toast(`${angkatanAktif()} belum punya peserta aktif.`, true);
  const jenjang = ['Tatsqif', 'Level 1', 'Level 2', 'Level 3'];
  const kini = jenjangAngkatan(angkatanAktif());
  const berikut = jenjang[Math.min(jenjang.length - 1, jenjang.indexOf(kini) + 1)];
  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.4px;color:#44534A">${peserta.length} peserta aktif ${esc(angkatanAktif())},
      sebagian besar di <b>${esc(kini)}</b>.</p>
    <div class="grup" style="margin:0"><label>Jenjang Baru untuk Semuanya</label>
      <select data-lv>${jenjang.map((x) => `<option ${x === berikut ? 'selected' : ''}>${x}</option>`).join('')}</select>
      <div class="bantu">Hanya peserta aktif yang diubah. Kajian yang sudah terjadwal tetap pada jenjangnya semula; kajian berikutnya dijadwalkan pada jenjang baru.</div></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Ubah Jenjang</button></div>`);
  modal({ judul: 'Ubah jenjang angkatan', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const lv = isi.querySelector('[data-lv]').value;
    let n = 0;
    if (aman(() => { n = Store.simpanAnggotaMassal(U, peserta.map((u) => ({ id: u.id, level: lv })), `Mengubah jenjang ${angkatanAktif()} menjadi ${lv}`); })) {
      tutupModal(); toast(n ? `${n} anggota kini ${lv}.` : 'Semua sudah di jenjang itu.'); gambar();
    }
  };
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

/* Kartu Anggota — milik Sekretaris. Satu kartu per orang, memuat nomor
   induk dan QR-nya; kartu yang sama dipakai presensi kajian dan
   penerimaan iuran. */
let saringKartu = { angkatan: '', status: 'aktif' };
HAL['kartu-anggota'] = () => {
  const angkatan = [...new Set(Store.db.users.map((u) => u.angkatan).filter(Boolean))]
    .sort((a, b) => urutAngkatan(a) - urutAngkatan(b));
  if (!angkatan.includes(saringKartu.angkatan)) saringKartu.angkatan = '';
  const data = Store.db.users
    .filter((u) => (!saringKartu.angkatan || u.angkatan === saringKartu.angkatan)
      && (!saringKartu.status || u.status === saringKartu.status))
    .sort((a, b) => String(a.nia || '').localeCompare(String(b.nia || '')));
  const tanpa = Store.db.users.filter((u) => !u.nia).length;

  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Satu kartu untuk presensi dan iuran</b>
    QR pada kartu memuat nomor induk anggota — bukan nama atau surel, supaya kartu yang tercecer tidak
    membocorkan apa pun. Petugas presensi memindainya di pintu kajian; Bendahara memindainya saat menerima iuran.
    Nomor induk tidak berubah, jadi kartu yang sudah dicetak tetap berlaku.
  </div></div></div>`);
  const kartu = el(`<div class="kartu ka-lembar"><div class="kartu-kepala">
    <h3>Kartu Anggota</h3><span class="hitung">(${data.length} kartu${tanpa ? ` · ${tanpa} belum bernomor` : ''})</span>
    <div class="kanan">
      <select class="pilih-saring" data-angkatan><option value="">Semua Angkatan</option>
        ${angkatan.map((a) => `<option ${a === saringKartu.angkatan ? 'selected' : ''}>${esc(a)}</option>`).join('')}</select>
      <select class="pilih-saring" data-status>
        ${[['aktif', 'Anggota aktif'], ['alumni', 'Alumni'], ['', 'Semua status']].map(([v, l]) =>
          `<option value="${v}" ${v === saringKartu.status ? 'selected' : ''}>${l}</option>`).join('')}</select>
      <button class="btn btn-kecil" data-cetak>${I.unduh} Cetak Kartu</button>
    </div></div><div class="panel-isi"><div class="ka-kisi"></div></div></div>`);
  kartu.querySelector('[data-angkatan]').onchange = (e) => { saringKartu.angkatan = e.target.value; gambar(); };
  kartu.querySelector('[data-status]').onchange = (e) => { saringKartu.status = e.target.value; gambar(); };
  /* Lembar cetaknya hanya kartu: delapan per A4, tanpa judul halaman.
     Aturan kertasnya dipasang hanya selama mencetak, seperti pada surat. */
  kartu.querySelector('[data-cetak]').onclick = cetakKartu;
  const kisi = kartu.querySelector('.ka-kisi');
  if (!data.length) kisi.replaceWith(el(`<div class="kosong-erp">${I.kotak}<p>Tidak ada anggota pada saringan ini</p></div>`));
  data.forEach((u) => kisi.appendChild(kartuAnggota(u)));
  box.appendChild(kartu);
  return box;
};

function cetakKartu() {
  document.body.classList.add('cetak-kartu');
  const kertas = document.head.appendChild(Object.assign(document.createElement('style'),
    { textContent: '@page { size: A4; margin: 10mm; }' }));
  const usai = () => {
    document.body.classList.remove('cetak-kartu');
    kertas.remove();
    window.removeEventListener('afterprint', usai);
  };
  window.addEventListener('afterprint', usai);
  window.print();
}

/* Kartu Saya — tiap anggota melihat kartunya sendiri dan memasang pas
   fotonya tanpa menunggu Sekretaris. Fotonya langsung berlaku: kartu di
   halaman ini, dan kartu yang dicetak Sekretaris, berubah saat itu juga. */
/** Ringkasan iuran milik sendiri, pada halaman Kartu Saya. */
function kartuIuranSaya() {
  const a = Store.db.aturKas || {};
  if (!Number(a.iuranRp) && !Number(a.iuranEgp)) return '';
  const kini = bulanIni();
  const i = Store.iuranAnggota(U.id, kini), tg = Store.tunggakanIuran(U.id);
  return `<div class="kartu"><div class="kartu-kepala"><h3>Iuran Saya</h3>
    <span class="hitung">${esc([a.iuranRp ? rpFmt(a.iuranRp) : '', a.iuranEgp ? egpFmt(a.iuranEgp) : ''].filter(Boolean).join(' atau '))} per bulan</span></div>
    <div class="panel-isi ks-iuran">
      <div><span>${esc(namaBulan(kini))}</span>${LENCANA_IURAN[i.status]}</div>
      <div><span>Tunggakan</span>${tg.bulan.length ? `<b class="perlu">${tg.bulan.length} bulan · ${esc(uangAtau(tg.rp, tg.egp))}</b>` : '<b style="color:#4A7A1E">Tidak ada</b>'}</div>
      ${tg.bulan.length ? `<div class="ks-iuran-bulan"><span>Belum lunas</span><b>${esc(tg.bulan.map(namaBulan).join(', '))}</b></div>` : ''}
    </div></div>`;
}

/* ============================================================
   KAJIAN SAYA — jadwal, tugas, izin, dan kehadiran milik sendiri
   ============================================================ */
const PERAN_TUGAS = { pemakalahId: 'Pemakalah', moderatorId: 'Moderator', notulenId: 'Notulen' };
const kajianAngkatanku = () => Store.db.kajian.filter((k) => Store.kajianJalan(k) && k.angkatan === U?.angkatan)
  .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
const tugasku = (k) => Object.keys(PERAN_TUGAS).filter((kunci) => k[kunci] === U?.id).map((kunci) => PERAN_TUGAS[kunci]);
/** Kajian mendatang yang menugasi saya. */
const tugasKajianSaya = () => (U && Store.berkajian(U)
  ? [...kajianAngkatanku().filter((k) => k.tanggal >= nowTanggal() && tugasku(k).length), ...notulenSaya().filter((k) => k.tanggal < nowTanggal())] : []);
/** Kajian yang sudah berlangsung dan notulennya masih menjadi tanggungan saya. */
const notulenSaya = () => kajianAngkatanku().filter((k) => k.notulenId === U?.id && k.tanggal <= nowTanggal()
  && Store.statusNotulen(k) !== 'sah');

function dialogAjukanIzin(k) {
  const jatah = Store.jatahIzin(U.id, k);
  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.6px;color:#44534A"><b>${esc(k.judul)}</b> · ${tgl(k.tanggal)} ${esc(k.jam || '')}</p>
    <div class="grup"><label>Jenis</label><select data-jenis><option value="izin">Izin</option><option value="sakit">Sakit</option></select></div>
    <div class="grup" style="margin:0"><label>Alasan</label>
      <textarea data-alasan style="min-height:76px" placeholder="Tuliskan dengan jelas — koordinator kajian yang memutuskan"></textarea>
      <div class="bantu">Jatah izin + sakit: ${jatah.batas} kali per jenjang. Anda sudah memakai ${jatah.terpakai}; pengajuan ini memakai satu lagi.
        Pengajuan yang ditolak tidak mengurangi jatah.</div></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Ajukan</button></div>`);
  modal({ judul: 'Ajukan izin kajian', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = async (e) => {
    if (await amanTunggu(e.currentTarget, async () => {
      await Store.ajukanIzin(k.id, isi.querySelector('[data-jenis]').value, isi.querySelector('[data-alasan]').value); return true;
    })) { tutupModal(); toast('Pengajuan terkirim. Menunggu keputusan koordinator.'); gambar(); }
  };
}

function dialogKirimMakalah(k) {
  const st = Store.statusRevisi(k);
  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.6px;color:#44534A"><b>${esc(k.judul)}</b> · ${tgl(k.tanggal)} · tenggat makalah <b>${tgl(Store.tenggatMakalah(k))}</b></p>
    ${st === 'perlu-revisi' && k.revisiCatatan ? `<div class="notis notis-kuning" style="margin-bottom:14px">${I.info}<div><b>Catatan revisi dari koordinator</b>${esc(k.revisiCatatan)}</div></div>` : ''}
    <div class="grup"><label>Tautan Makalah</label><input data-makalah type="url" value="${esc(k.tautanMakalah || '')}" placeholder="https://drive.google.com/…"></div>
    <div class="grup" style="margin:0"><label>Tautan PPT</label><input data-ppt type="url" value="${esc(k.tautanPpt || '')}" placeholder="https://…">
      <div class="bantu">Unggah berkasnya ke Google Drive atau sejenisnya, atur agar dapat dibuka koordinator, lalu tempel tautannya di sini.
        Menyerahkan tautan makalah baru mengirimnya kembali untuk diperiksa.</div></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Serahkan</button></div>`);
  modal({ judul: 'Serahkan makalah & PPT', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = async (e) => {
    if (await amanTunggu(e.currentTarget, async () => {
      await Store.kirimMakalah(k.id, { tautanMakalah: isi.querySelector('[data-makalah]').value.trim(), tautanPpt: isi.querySelector('[data-ppt]').value.trim() }); return true;
    })) { tutupModal(); toast('Makalah diserahkan.'); gambar(); }
  };
}

HAL['kajian-saya'] = () => {
  const semua = kajianAngkatanku();
  const datang = semua.filter((k) => k.tanggal >= nowTanggal());
  const lampau = semua.filter((k) => k.tanggal < nowTanggal() && (k.presensi || []).length
    && Store.pesertaKajian(k).some((u) => u.id === U.id)).reverse();
  const h = Store.kehadiranAnggota(U.id, semua);
  const acuan = datang[0] || semua[semua.length - 1];
  const jatah = acuan ? Store.jatahIzin(U.id, acuan) : { batas: Store.JATAH_IZIN, terpakai: 0, sisa: Store.JATAH_IZIN };
  const box = el('<div></div>');

  box.appendChild(el(`<div class="grid-stat">
    ${[{ ik: I.kalender, n: datang.length, l: 'Kajian mendatang', w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' },
       { ik: I.orang, n: tugasKajianSaya().length, l: 'Tugas saya', w: 'rgba(240,149,30,.15)', wc: '#B87310' },
       { ik: I.bagan, n: h.wajib ? h.persen + '%' : '—', l: `Kehadiran (${h.datang}/${h.wajib})`, w: 'rgba(47,169,140,.14)', wc: '#1F7A64' },
       { ik: I.surat, n: `${jatah.sisa}/${jatah.batas}`, l: 'Sisa jatah izin/sakit', w: 'rgba(62,127,184,.14)', wc: '#2C6091' }]
      .map((s) => `<div class="stat" style="--w:${s.w};--wc:${s.wc}">
        <div class="stat-ik">${s.ik}</div><div class="stat-nilai">${esc(String(s.n))}</div>
        <div class="stat-label">${esc(s.l)}</div></div>`).join('')}
  </div>`));

  const k1 = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Kajian Mendatang</h3><span class="hitung">(${datang.length} kajian · ${esc(U.angkatan || '')})</span></div></div>`);
  if (!datang.length) k1.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada kajian terjadwal</p></div>`));
  else {
    const t = el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Tempat</th><th>Pemakalah</th>
        <th>Tugas Saya</th><th>Izin</th><th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
    datang.forEach((k, i) => {
      const z = [...(k.izin || [])].reverse().find((x) => x.userId === U.id);
      const p = (k.presensi || []).find((x) => x.userId === U.id);
      const tugas = tugasku(k);
      const ket = p ? `<span class="lencana ${PRESENSI[p.status].c}">${PRESENSI[p.status].l}</span>`
        : z ? `<span class="lencana ${z.status === 'menunggu' ? 'l-kuning' : 'l-merah'}">${z.jenis} · ${z.status}</span>${z.catatan ? `<br><span style="color:var(--e-abu);font-size:11.6px">${esc(z.catatan)}</span>` : ''}` : '—';
      const tr = el(`<tr><td class="kol-no">${i + 1}</td>
        <td class="utuh">${tgl(k.tanggal)}<br><span style="color:var(--e-abu);font-size:11.6px">${esc(k.jam || '')} · terlambat sesudah ${Store.toleransiKajian(k)} menit</span></td>
        <td><b>${esc(k.judul)}</b></td><td class="utuh">${esc(k.tempat || '—')}</td>
        <td>${esc(namaPendek(k.pemakalahId))}</td>
        <td>${tugas.length ? tugas.map((x) => `<span class="lencana l-kuning">${x}</span>`).join(' ') : '—'}
          ${k.pemakalahId === U.id ? `<div style="margin-top:6px;font-size:11.8px">${lencanaRevisi(k)}
            <span style="color:${makalahTelat(k) ? '#B23E37' : 'var(--e-abu)'}">tenggat ${tgl(Store.tenggatMakalah(k))}</span></div>` : ''}</td>
        <td>${ket}</td>
        <td class="kol-aksi"><div class="sel-aksi">
          ${k.pemakalahId === U.id && Store.statusRevisi(k) !== 'final' ? `<button class="btn btn-lime btn-kecil" data-makalah>${k.tautanMakalah ? 'Perbarui Makalah' : 'Serahkan Makalah'}</button>` : ''}
          ${z?.status === 'menunggu' ? `<button class="btn btn-garis btn-kecil" data-tarik>Tarik</button>`
            : p || k.presensiTutup ? '' : `<button class="btn btn-garis btn-kecil" data-izin ${jatah.sisa ? '' : 'disabled title="Jatah izin/sakit Anda habis"'}>Ajukan Izin</button>`}</div></td></tr>`);
      tr.querySelector('[data-izin]')?.addEventListener('click', () => dialogAjukanIzin(k));
      tr.querySelector('[data-makalah]')?.addEventListener('click', () => dialogKirimMakalah(k));
      tr.querySelector('[data-tarik]')?.addEventListener('click', async (e) => {
        if (await amanTunggu(e.currentTarget, async () => { await Store.tarikIzin(k.id, z.id); return true; })) { toast('Pengajuan ditarik.'); gambar(); }
      });
      t.querySelector('tbody').appendChild(tr);
    });
    k1.appendChild(t);
  }
  box.appendChild(k1);

  const utang = notulenSaya();
  if (utang.length) {
    const kn = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
      <h3>Notulen yang Harus Saya Tulis</h3><span class="hitung">(${utang.length} kajian)</span></div>
      <div class="tabel-bungkus"><table class="t-org"><thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Status</th>
        <th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div></div>`);
    utang.forEach((k, i) => {
      const cat = k.notulen?.catatan;
      const tr = el(`<tr><td class="kol-no">${i + 1}</td><td class="utuh">${tgl(k.tanggal)}</td>
        <td><b>${esc(k.judul)}</b>${cat ? `<br><span style="color:#B23E37;font-size:11.6px">Dikembalikan: ${esc(cat)}</span>` : ''}</td>
        <td>${lencanaNotulen(k)}</td>
        <td class="kol-aksi"><div class="sel-aksi"><button class="btn btn-lime btn-kecil">${Store.statusNotulen(k) === 'kosong' ? 'Tulis Notulen' : 'Lanjutkan'}</button></div></td></tr>`);
      tr.querySelector('button').onclick = () => dialogNotulensi(k);
      kn.querySelector('tbody').appendChild(tr);
    });
    box.appendChild(kn);
  }

  const k2 = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Riwayat Kehadiran Saya</h3><span class="hitung">(${lampau.length} kajian tercatat)</span></div></div>`);
  if (!lampau.length) k2.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada kehadiran tercatat</p></div>`));
  else k2.appendChild(el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Tugas Saya</th><th>Jam Datang</th><th>Kehadiran</th></tr></thead>
    <tbody>${lampau.map((k, i) => {
      const p = k.presensi.find((x) => x.userId === U.id);
      return `<tr><td class="kol-no">${i + 1}</td><td class="utuh">${tgl(k.tanggal)}</td><td><b>${esc(k.judul)}</b></td>
        <td>${tugasku(k).join(', ') || '—'}</td><td class="utuh">${esc(p?.jam || '—')}</td>
        <td>${p ? `<span class="lencana ${PRESENSI[p.status].c}">${PRESENSI[p.status].l}</span>${p.alasan ? ` <span style="color:var(--e-abu);font-size:11.6px">${esc(p.alasan)}</span>` : ''}`
          : '<span class="lencana l-abu">belum dicatat</span>'}</td></tr>`; }).join('')}</tbody></table></div>`));
  box.appendChild(k2);
  return box;
};
HAL['kajian-saya'].judul = () => ['Kajian Saya', 'Jadwal, tugas, izin, dan kehadiran Anda pada kajian angkatan.'];

HAL['kartu-saya'] = () => {
  const diri = Store.dataDiri(U.id);
  const box = el(`<div class="ks">
    <div class="kartu ka-lembar ks-kartu"><div class="kartu-kepala">
      <h3>Kartu Anggota Saya</h3><span class="hitung">${U.nia ? esc(U.nia) : 'nomor induk belum terbit'}</span>
      <div class="kanan"><button class="btn btn-garis btn-kecil" data-cetak>${I.unduh} Cetak / Simpan PDF</button></div></div>
      <div class="panel-isi"><div class="ka-kisi ks-panggung" data-panggung></div></div></div>
    <div class="kartu"><div class="kartu-kepala"><h3>Pas Foto</h3>
      <span class="hitung">${diri.foto ? 'sudah terpasang' : 'belum ada — kartu memakai foto profil'}</span></div>
      <div class="panel-isi">
        <div class="ks-foto"><img data-pv src="${esc(diri.foto || U.foto || window.__avatar(U.nama || 'Anggota', '#5B7C5F'))}" alt="">
          <div>
            <label class="btn btn-lime" style="cursor:pointer;margin:0">${I.gambar} <span data-label>${diri.foto ? 'Ganti Pas Foto' : 'Unggah Pas Foto'}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" hidden data-berkas></label>
            <ul class="ks-saran">
              <li>Wajah menghadap depan, terlihat jelas, tanpa kacamata hitam.</li>
              <li>Latar polos. Foto tegak (potret) paling pas di kartu.</li>
              <li>Foto langsung terpasang di kartu begitu selesai diunggah.</li>
            </ul>
          </div></div>
        <div class="bantu">Pas foto hanya untuk kartu anggota. Ia tidak tampil di website dan hanya terlihat oleh Anda,
          Sekretaris, dan Ketua Umum.</div>
      </div></div>
    ${kartuIuranSaya()}
    <div class="notis notis-info">${I.info}<div><b>Bawa kartu ini ke setiap kajian</b>
      QR-nya dipindai petugas saat presensi dan oleh Bendahara saat Anda membayar iuran. Cukup tunjukkan dari layar
      ponsel, atau cetak dan simpan di dompet.${U.nia ? '' : ' Nomor induk Anda terbit setelah Sekretaris membuka ERP; QR sementara ini tetap terbaca.'}</div></div>
  </div>`);
  const panggung = box.querySelector('[data-panggung]');
  const gambarKartu = () => panggung.replaceChildren(kartuAnggota(U));
  gambarKartu();
  box.querySelector('[data-cetak]').onclick = cetakKartu;

  const masukan = box.querySelector('[data-berkas]');
  const label = box.querySelector('[data-label]');
  masukan.onchange = async () => {
    const berkas = masukan.files[0]; if (!berkas) return;
    const asal = label.textContent;
    label.textContent = 'Mengunggah…';
    try {
      const url = await Store.unggahFotoKartu(berkas);
      box.querySelector('[data-pv]').src = url;
      gambarKartu();
      label.textContent = 'Ganti Pas Foto';
      toast('Pas foto terpasang di kartu Anda.');
    } catch (e) { toast(e.message, true); label.textContent = asal; }
    masukan.value = '';
  };
  return box;
};
HAL['kartu-saya'].judul = () => ['Kartu Saya', 'Kartu anggota Anda beserta pas fotonya.'];

/* Satu kartu anggota, seukuran kartu pelajar (85,6 × 54 mm). Yang
   dicetak hanya yang perlu dilihat petugas: foto, nama, nomor induk,
   angkatan, jenjang, dan QR. Paspor dan alamat TIDAK pernah di sini —
   kartu ini dibawa-bawa dan bisa tercecer. */
function kartuAnggota(u) {
  const s = Store.cms.situs;
  const kode = Store.kodeQr(u.id);
  return el(`<div class="ka-kartu">
    <div class="ka-pita">
      <span class="ka-logo">${lambang(30)}</span>
      <div class="ka-org"><b>KAJIAN ${esc(String(s.nama).toUpperCase())}</b><span>${esc(s.tagline || '')}</span></div>
      <span class="ka-jenis">KARTU<br>ANGGOTA</span>
    </div>
    <div class="ka-badan">
      <img class="ka-foto" src="${esc(Store.dataDiri(u.id).foto || u.foto || window.__avatar(u.nama || 'Anggota', '#5B7C5F'))}" alt="">
      <div class="ka-data">
        <div class="ka-nama">${esc(u.nama)}</div>
        <div class="ka-nia">${esc(kode)}</div>
        <dl>
          <div><dt>Angkatan</dt><dd>${esc(String(u.angkatan || '—').replace(/^Angkatan\s+/i, ''))}</dd></div>
          <div><dt>Jenjang</dt><dd>${esc(u.level && u.level !== '-' ? u.level : '—')}</dd></div>
          <div><dt>Status</dt><dd>${esc(u.status === 'aktif' ? 'Aktif' : u.status === 'alumni' ? 'Alumni' : 'Nonaktif')}</dd></div>
        </dl>
      </div>
      <img class="ka-qr" src="${QR.svgDataUri(kode, { tepi: 2 })}" alt="QR ${esc(kode)}">
    </div>
    <div class="ka-kaki"><span>${esc(s.naungan || '')}</span><span>${esc(Store.db.seo?.domain || '')}</span></div>
  </div>`);
}
HAL['kartu-anggota'].judul = () => ['Kartu Anggota', 'Nomor induk dan QR tiap anggota, siap dicetak.'];

/* ------------------------------------------------------------
   PENDAFTARAN — antrean permohonan dari halaman publik
   ------------------------------------------------------------
   daftar.html hanya mengajukan. Di sinilah permohonan ditinjau:
   diterima berarti menjadi anggota — bernomor induk, berakun, dan data
   dirinya dipindahkan ke Data Diri — sedangkan yang ditolak langsung
   kehilangan data pribadinya dan tersisa sebagai catatan saja.
   ------------------------------------------------------------ */
const STATUS_DAFTAR = {
  menunggu: { l: 'Menunggu', c: 'l-kuning' }, diterima: { l: 'Diterima', c: 'l-hijau' }, ditolak: { l: 'Ditolak', c: 'l-merah' },
};
let saringDaftar = 'menunggu';

function tinjauPendaftaran(p) {
  const kembar = Store.db.users.find((u) => String(u.email || '').toLowerCase() === String(p.email).toLowerCase());
  const angkatan = [...new Set(Store.db.users.map((u) => u.angkatan).filter((a) => a && a !== 'Pendiri'))]
    .sort((a, b) => urutAngkatan(a) - urutAngkatan(b));
  const baris = (l, v) => `<div><dt>${l}</dt><dd>${v ? esc(v).replace(/\n/g, '<br>') : '—'}</dd></div>`;
  const isi = el(`<div class="tp">
    ${kembar ? `<div class="notis notis-merah" style="margin-bottom:14px">${I.peringatan}<div><b>Surel ini sudah dipakai</b>
      ${esc(kembar.nama)} (${esc(kembar.nia || '—')}) sudah terdaftar dengan surel yang sama. Permohonan ini tidak dapat diterima sebelum itu diselesaikan.</div></div>` : ''}
    <div class="tp-atas">${p.foto ? `<img src="${esc(p.foto)}" alt="">` : `<div class="tp-tanpa-foto">${I.orang}<span>tanpa foto</span></div>`}
      <dl class="tp-data">
        ${baris('Nama', p.nama)}${baris('Surel', p.email)}${baris('Telepon', p.telepon)}${baris('Nomor Paspor', p.paspor)}
        ${baris('Tempat, Tanggal Lahir', [p.tempatLahir, p.tglLahir ? tgl(p.tglLahir) : ''].filter(Boolean).join(', '))}
        ${baris('Pendidikan', p.pendidikan)}${baris('Alamat', p.alamat)}${baris('Catatan', p.catatan)}
        ${baris('Dikirim', tglJam(p.ts))}
      </dl></div>
    <div class="grid-form" style="margin-top:14px">
      <div class="grup"><label>Angkatan</label><input data-angkatan list="tp-angkatan" value="${esc(p.angkatan || angkatan[angkatan.length - 1] || '')}" placeholder="Angkatan XII">
        <datalist id="tp-angkatan">${angkatan.map((a) => `<option value="${esc(a)}">`).join('')}</datalist>
        <div class="bantu">Menentukan nomor induknya. ${p.angkatan ? `Pemohon menulis: "${esc(p.angkatan)}".` : 'Pemohon tidak mengisinya.'}</div></div>
      <div class="grup"><label>Jenjang</label><select data-level>
        ${['Tatsqif', 'Level 1', 'Level 2', 'Level 3'].map((x) => `<option>${x}</option>`).join('')}</select></div>
    </div></div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-merah" data-tolak style="margin-right:auto">Tolak</button>
    <button class="btn btn-garis" data-b>Tutup</button>
    <button class="btn btn-lime" data-terima ${kembar ? 'disabled' : ''}>${I.cek} Terima sebagai Anggota</button></div>`);
  modal({ judul: 'Tinjau Pendaftaran', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-terima]').onclick = () => {
    const baru = aman(() => Store.terimaPendaftaran(U, p.id, {
      angkatan: isi.querySelector('[data-angkatan]').value, level: isi.querySelector('[data-level]').value }));
    /* Kata sandi pertamanya dibuat server dan ditampilkan sekali,
       lewat jendela yang sama dengan penambahan anggota biasa. */
    if (baru) { tutupModal(); toast('Pendaftaran diterima. Kata sandi pertamanya segera ditampilkan.'); gambar(); }
  };
  kaki.querySelector('[data-tolak]').onclick = () => {
    const f = el(`<div class="grup" style="margin:0"><label>Alasan penolakan</label>
      <textarea data-alasan style="min-height:76px" placeholder="Opsional — untuk catatan pengurus"></textarea>
      <div class="bantu">Data pribadi pemohon — paspor, alamat, foto — dihapus saat ditolak. Yang tersisa hanya nama, surel, dan alasan ini.</div></div>`);
    const k2 = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
      <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-merah" data-y>Tolak Pendaftaran</button></div>`);
    modal({ judul: `Tolak pendaftaran ${p.nama}`, isi: f, kaki: k2 });
    k2.querySelector('[data-b]').onclick = () => tinjauPendaftaran(p);
    k2.querySelector('[data-y]').onclick = () => {
      if (aman(() => Store.tolakPendaftaran(U, p.id, f.querySelector('[data-alasan]').value))) {
        tutupModal(); toast('Pendaftaran ditolak.'); gambar();
      }
    };
  };
}

HAL.pendaftaran = () => {
  const semua = [...(Store.db.pendaftaran || [])].sort((a, b) => String(b.ts || '').localeCompare(String(a.ts || '')));
  const jml = (st) => semua.filter((p) => p.status === st).length;
  const data = semua.filter((p) => !saringDaftar || p.status === saringDaftar);
  const alamat = `${location.origin}${location.pathname.replace(/[^/]*$/, '')}daftar.html`;

  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Pendaftaran masuk dari halaman publik</b>
    Calon anggota mengisi formulir di <a href="daftar.html" target="_blank">${esc(alamat)}</a>. Menerima permohonan
    menjadikannya anggota: ia mendapat nomor induk, kartu anggota, dan kata sandi pertama. Anggota juga tetap
    dapat ditambahkan langsung dari Data Anggota.
    <button class="btn btn-garis btn-kecil" data-salin style="margin-left:6px">Salin Tautan</button>
  </div></div></div>`);
  box.querySelector('[data-salin]').onclick = () => navigator.clipboard.writeText(alamat).then(
    () => toast('Tautan pendaftaran disalin.'), () => toast('Peramban menolak menyalin. Salin manual dari teksnya.', true));

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Pendaftaran</h3><span class="hitung">(${data.length} dari ${semua.length} permohonan)</span>
    <div class="kanan"><select class="pilih-saring" data-status>
      ${[['menunggu', `Menunggu (${jml('menunggu')})`], ['diterima', `Diterima (${jml('diterima')})`], ['ditolak', `Ditolak (${jml('ditolak')})`], ['', `Semua (${semua.length})`]]
        .map(([v, l]) => `<option value="${v}" ${v === saringDaftar ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
  </div></div>`);
  kartu.querySelector('[data-status]').onchange = (e) => { saringDaftar = e.target.value; gambar(); };

  if (!data.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>${saringDaftar === 'menunggu' ? 'Tidak ada pendaftaran yang menunggu' : 'Tidak ada permohonan pada saringan ini'}</p>
      <small>Bagikan tautan pendaftaran kepada calon anggota.</small></div>`));
  } else {
    const t = el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>Pemohon</th><th>Kontak</th><th>Angkatan</th><th>Dikirim</th><th>Status</th>
        <th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
    const tb = t.querySelector('tbody');
    data.forEach((p, i) => {
      const anggota = p.userId && Store.getUser(p.userId);
      const tr = el(`<tr><td class="kol-no">${i + 1}</td>
        <td><b>${esc(p.nama)}</b><br><span class="sub-sel">${esc(p.email)}</span></td>
        <td class="utuh">${esc(p.telepon || '—')}</td>
        <td class="utuh">${esc(anggota ? `${anggota.angkatan} · ${anggota.nia || ''}` : p.angkatan || '—')}</td>
        <td class="utuh">${tglJam(p.ts)}</td>
        <td><span class="lencana ${STATUS_DAFTAR[p.status]?.c || 'l-abu'}">${esc(STATUS_DAFTAR[p.status]?.l || p.status)}</span>${
          p.alasan ? `<br><span class="sub-sel">${esc(p.alasan)}</span>` : ''}</td>
        <td class="kol-aksi"><div class="sel-aksi">
          ${p.status === 'menunggu' ? `<button class="ikon-aksi sunting" data-tinjau title="Tinjau">${I.dokCek}</button>` : ''}
          <button class="ikon-aksi hapus" title="Hapus catatan">${I.hapus}</button></div></td></tr>`);
      tr.querySelector('[data-tinjau]')?.addEventListener('click', () => tinjauPendaftaran(p));
      tr.querySelector('.hapus').onclick = () => konfirmasi('Hapus catatan pendaftaran',
        `Catatan pendaftaran ${p.nama} akan dihapus.${p.status === 'menunggu' ? ' Permohonan ini belum ditinjau.' : ''}`,
        () => aman(() => { Store.hapusPendaftaran(U, p.id); toast('Catatan dihapus.'); gambar(); }));
      tb.appendChild(tr);
    });
    pasangPilih(t, data, { satuan: 'catatan pendaftaran', hapus: (p) => Store.hapusPendaftaran(U, p.id) });
    kartu.appendChild(t);
  }
  box.appendChild(kartu);
  return box;
};
HAL.pendaftaran.judul = () => ['Pendaftaran', 'Permohonan anggota baru dari halaman publik.'];

HAL.presensi = () => {
  const semua = kajianAktif();
  const box = el('<div></div>');
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Presensi Kajian</h3><span class="hitung">(${semua.length} pertemuan · ${esc(angkatanAktif())})</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-export>${I.unduh} Laporan Presensi</button></div>
  </div></div>`);
  kartu.querySelector('[data-export]').onclick = () => {
    const baris = [['Tanggal', 'Judul Kajian', 'Peserta', 'Hadir', 'Terlambat', 'Izin/Sakit', 'Tidak Hadir', 'Belum Absen', 'Persentase', 'Ditutup']];
    semua.forEach((k) => { const r = rekapPresensi(k);
      baris.push([k.tanggal, k.judul, r.total, r.hadir, r.terlambat, r.izin, r.tidakHadir, r.belum, r.persen + '%', k.presensiTutup ? 'ya' : 'belum']); });
    unduhCsv(`presensi-${angkatanAktif().replace(/\s/g, '-').toLowerCase()}.csv`, baris);
  };

  box.appendChild(kartuPengajuanIzin(semua));
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Hadir</th>
      <th>Terlambat</th><th>Izin/Sakit</th><th>Tidak Hadir</th><th>Belum Absen</th><th style="min-width:150px">Kehadiran</th>
      <th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  semua.forEach((k, i) => {
    const r = rekapPresensi(k);
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td class="utuh">${tgl(k.tanggal)}</td>
      <td>${esc(k.judul)}${k.presensiTutup ? ` <span class="lencana l-abu" title="Presensi ditutup dan terkunci">${I.gembok} ditutup</span>` : ''}</td>
      <td class="utuh"><b style="color:#4A7A1E">${r.hadir}</b></td>
      <td class="utuh">${r.terlambat}</td><td class="utuh">${r.izin}</td><td class="utuh">${r.tidakHadir}</td><td class="utuh">${r.belum}</td>
      <td><div style="display:flex;align-items:center;gap:9px">
        <div class="bar-maju" style="flex:1"><span style="width:${r.persen}%"></span></div>
        <b style="font-size:12.2px">${r.persen}%</b></div></td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Isi presensi">${I.daftarCek}</button>
        ${k.presensiTutup ? '' : `<button class="ikon-aksi" data-scan title="Mode Presensi — pindai kartu">${I.qr}</button>`}</div></td></tr>`);
    tr.querySelector('.sunting').onclick = () => dialogAbsensi(k);
    tr.querySelector('[data-scan]')?.addEventListener('click', () => dialogScan(k));
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  box.appendChild(kartu);
  return box;
};
/** Pengajuan izin/sakit yang menunggu keputusan. Kosong → tak tampil. */
function kartuPengajuanIzin(daftar) {
  const tunggu = Store.izinMenunggu(daftar);
  if (!tunggu.length) return el('<div></div>');
  const kartu = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Pengajuan Izin</h3><span class="hitung">(${tunggu.length} menunggu keputusan · jatah ${Store.JATAH_IZIN} kali per anggota per jenjang)</span></div>
    <div class="kj-izin"></div></div>`);
  const wadah = kartu.querySelector('.kj-izin');
  tunggu.forEach(({ k, z }) => {
    const u = Store.getUser(z.userId);
    const jatah = Store.jatahIzin(z.userId, k);
    /* Pengajuan ini sendiri sudah terhitung; yang ditampilkan pemakaian di luar dirinya. */
    const b = el(`<div class="kj-izin-br">
      <img src="${u?.foto || ''}" alt="">
      <div class="isi"><b>${esc(u?.nama || '—')}</b> <span class="lencana l-biru">${esc(z.jenis)}</span>
        <div class="kt">${esc(k.judul)} · ${tgl(k.tanggal)}</div>
        <div class="al">"${esc(z.alasan)}"</div>
        <div class="kt">Izin/sakit ke-${jatah.terpakai} dari ${jatah.batas} pada jenjang ini · diajukan ${tgl(z.pada.slice(0, 10))}</div></div>
      <div class="aksi"><button class="btn btn-lime btn-kecil" data-ya>Setujui</button>
        <button class="btn btn-garis btn-kecil" data-tidak>Tolak</button></div>
    </div>`);
    b.querySelector('[data-ya]').onclick = async (e) => {
      if (await amanTunggu(e.currentTarget, async () => { await Store.putuskanIzin(U, k.id, z.id, true); return true; })) { toast('Izin disetujui.'); gambar(); }
    };
    b.querySelector('[data-tidak]').onclick = () => {
      if (b.querySelector('.alasan-izin')) return;
      const kotak = el(`<div class="alasan-izin"><input placeholder="Alasan penolakan"><button class="btn btn-merah btn-kecil">Tolak</button></div>`);
      b.querySelector('.isi').appendChild(kotak);
      kotak.querySelector('input').focus();
      kotak.querySelector('button').onclick = async (e) => {
        if (await amanTunggu(e.currentTarget, async () => { await Store.putuskanIzin(U, k.id, z.id, false, kotak.querySelector('input').value); return true; })) { toast('Pengajuan ditolak.'); gambar(); }
      };
    };
    wadah.appendChild(b);
  });
  return kartu;
}

HAL.presensi.judul = () => ['Presensi Kajian', 'Kehadiran tiap pertemuan beserta rekapnya.'];

const REVISI = {
  belum         : { l: 'Belum Diserahkan', c: 'l-abu'    },
  diperiksa     : { l: 'Menunggu Diperiksa', c: 'l-kuning' },
  'perlu-revisi': { l: 'Perlu Revisi',     c: 'l-merah'  },
  final         : { l: 'Final',            c: 'l-hijau'  },
};
const lencanaRevisi = (k) => { const r = REVISI[Store.statusRevisi(k)]; return `<span class="lencana ${r.c}">${r.l}</span>`; };
const tautLuar = (url, label) => (url
  ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="taut-luar">${I.panahLuar} ${esc(label)}</a>` : '');
/** Makalah kajian mendatang yang lewat tenggat tanpa diserahkan. */
const makalahTelat = (k) => Store.kajianJalan(k) && k.tanggal >= nowTanggal() && !k.tautanMakalah
  && Store.statusRevisi(k) !== 'final' && Store.tenggatMakalah(k) < nowTanggal();

HAL.materi = () => {
  const semua = kajianAktif();
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Materi & Makalah</h3>
    <span class="hitung">(${semua.filter((k) => Store.statusRevisi(k) === 'final').length} dari ${semua.length} makalah final · ${semua.filter((k) => k.ppt).length} ber-PPT)</span></div></div>`);
  if (!semua.length) { kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada kajian</p></div>`)); return kartu; }
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Pemakalah</th><th>Tenggat</th>
      <th>Makalah</th><th>PPT</th><th>Revisi</th><th class="kol-aksi">Aksi</th></tr></thead>
    <tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  semua.forEach((k, i) => {
    const telat = makalahTelat(k);
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td><td class="utuh">${tgl(k.tanggal)}</td>
      <td><b>${esc(k.judul)}</b>${k.materi ? `<br><span style="color:var(--e-abu);font-size:11.6px">${esc(k.materi.slice(0, 90))}${k.materi.length > 90 ? '…' : ''}</span>` : ''}</td>
      <td>${esc(namaPendek(k.pemakalahId))}</td>
      <td class="utuh">${tgl(Store.tenggatMakalah(k))}${telat ? '<br><span class="lencana l-merah">lewat</span>' : ''}</td>
      <td>${tautLuar(k.tautanMakalah, 'Buka') || '<span style="color:var(--e-abu)">belum ada</span>'}</td>
      <td>${tautLuar(k.tautanPpt, 'Buka') || tandaLengkap(k.ppt)}</td>
      <td>${lencanaRevisi(k)}${k.revisiCatatan && Store.statusRevisi(k) === 'perlu-revisi' ? `<br><span style="color:var(--e-abu);font-size:11.6px">${esc(k.revisiCatatan.slice(0, 70))}</span>` : ''}</td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Materi, tautan, dan revisi">${I.sunting}</button></div></td></tr>`);
    tr.querySelector('.sunting').onclick = () => dialogMateri(k);
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  return kartu;
};

function dialogMateri(k) {
  const st = Store.statusRevisi(k);
  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.4px;color:var(--e-abu)"><b>${esc(k.judul)}</b> · ${tgl(k.tanggal)} · pemakalah ${esc(namaPendek(k.pemakalahId))}
      ${k.makalahDikirim ? ` · diserahkan ${tgl(k.makalahDikirim.slice(0, 10))}` : ''}</p>
    <div class="grup"><label>Materi / Rujukan</label><textarea data-materi style="min-height:70px">${esc(k.materi || '')}</textarea></div>
    <div class="grid-form">
      <div class="grup"><label>Tautan Makalah</label><input data-makalah type="url" value="${esc(k.tautanMakalah || '')}" placeholder="https://drive.google.com/…"></div>
      <div class="grup"><label>Tautan PPT</label><input data-ppt type="url" value="${esc(k.tautanPpt || '')}" placeholder="https://…"></div>
    </div>
    <div class="grid-form">
      <div class="grup"><label>Tenggat Makalah</label><input type="date" data-tenggat value="${esc(k.tenggatMakalah || '')}" max="${esc(k.tanggal)}">
        <div class="bantu">Kosong = ${tgl(Store.tenggatMakalah({ ...k, tenggatMakalah: '' }))} (tiga hari sebelum kajian).</div></div>
      <div class="grup"><label>Status Revisi</label><select data-status>
        ${Store.STATUS_REVISI.map((x) => `<option value="${x}" ${x === st ? 'selected' : ''}>${REVISI[x].l}</option>`).join('')}</select>
        <label style="display:flex;align-items:center;gap:8px;font-weight:600;cursor:pointer;margin:10px 0 0">
          <input type="checkbox" data-ada-ppt ${k.ppt ? 'checked' : ''} style="width:auto;accent-color:var(--e-hijau)"> PPT sudah ada (tanpa tautan)</label></div>
    </div>
    <div class="grup" style="margin:0"><label>Catatan Revisi untuk Pemakalah</label>
      <textarea data-catatan style="min-height:70px" placeholder="Wajib bila statusnya Perlu Revisi — pemakalah membacanya di Kajian Saya">${esc(k.revisiCatatan || '')}</textarea></div>
    <div class="bantu">Berkas tidak diunggah ke sini; yang disimpan tautannya. Pemakalah juga dapat menyerahkan tautannya sendiri dari Kajian Saya.
      Makalah yang dinyatakan <b>Final</b> otomatis menjadi draf artikel pemakalahnya, untuk ia kirim ke PJ Artikel.</div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: 'Materi & makalah', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const q = (x) => isi.querySelector(`[data-${x}]`);
    if (aman(() => Store.simpanMateri(U, k.id, { materi: q('materi').value, tautanMakalah: q('makalah').value, tautanPpt: q('ppt').value,
      tenggatMakalah: q('tenggat').value, revisiStatus: q('status').value, revisiCatatan: q('catatan').value, ppt: q('ada-ppt').checked }))) {
      tutupModal(); toast('Materi tersimpan.'); gambar();
    }
  };
}
HAL.materi.judul = () => ['Materi & Makalah', 'Tautan makalah dan PPT, tenggat, serta status revisi tiap kajian.'];

HAL.notulen = () => {
  /* Notulen ditulis sesudah kajiannya berlangsung: yang mendatang tak ikut tampil. */
  const semua = kajianAktif().filter((k) => k.tanggal <= nowTanggal()).reverse();
  const jml = (st) => semua.filter((k) => Store.statusNotulen(k) === st).length;
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Notulen</h3>
    <span class="hitung">(${jml('sah')} sah · ${jml('diajukan')} menunggu pengesahan · ${jml('draf')} draf · ${jml('kosong')} belum ditulis)</span></div></div>`);
  if (!semua.length) { kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada kajian yang berlangsung</p></div>`)); return kartu; }
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Notulen</th>
      <th>Status</th><th>Ringkasan</th><th class="kol-aksi">Aksi</th></tr></thead>
    <tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  semua.forEach((k, i) => {
    const ringkas = Store.isiNotulen(k).ringkasan || '';
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td><td class="utuh">${tgl(k.tanggal)}</td>
      <td><b>${esc(k.judul)}</b></td>
      <td>${k.notulenId ? esc(namaPendek(k.notulenId)) : '<span class="lencana l-merah">belum ditunjuk</span>'}</td>
      <td>${lencanaNotulen(k)}</td>
      <td>${ringkas ? esc(ringkas.slice(0, 90)) + (ringkas.length > 90 ? '…' : '')
        : '<span style="color:var(--e-abu)">—</span>'}</td>
      <td class="kol-aksi"><div class="sel-aksi">
        <button class="ikon-aksi sunting" title="Tulis / periksa notulen">${I.dok}</button>
        ${Store.statusNotulen(k) === 'kosong' ? '' : `<button class="ikon-aksi" data-cetak title="Cetak / PDF">${I.unduh}</button>`}</div></td></tr>`);
    tr.querySelector('.sunting').onclick = () => dialogNotulensi(k);
    tr.querySelector('[data-cetak]')?.addEventListener('click', () => cetakNotulen(k));
    tb.appendChild(tr);
  });
  kartu.appendChild(t);
  return kartu;
};
HAL.notulen.judul = () => ['Notulen', 'Catatan hasil tiap kajian: ditulis notulen, disahkan koordinator.'];

/* --- laporan kajian per periode --- */
let periodeRekap = { dari: '', sampai: '' };

/** Kajian sebuah angkatan (dan jenjang, bila disebut) dalam satu rentang
    tanggal — termasuk yang ditunda dan dibatalkan, supaya laporan dapat
    menyebutnya. */
const kajianRentang = ({ angkatan, level, dari, sampai }) => Store.db.kajian
  .filter((k) => k.angkatan === angkatan && (!level || k.level === level)
    && (!dari || k.tanggal >= dari) && (!sampai || k.tanggal <= sampai))
  .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

/** Lembar laporan kajian siap cetak. Seluruh angkanya dari rumus yang sama
    dengan layar — tak ada yang diketik. */
function lembarLaporanKajian({ angkatan, level, dari, sampai }) {
  const s = Store.cms.situs;
  const semua = kajianRentang({ angkatan, level, dari, sampai });
  const jalan = semua.filter(Store.kajianJalan);
  const terlaksana = jalan.filter((k) => k.tanggal <= nowTanggal() && (k.presensi || []).length);
  const rekap = terlaksana.map((k) => ({ k, r: Store.rekapKajian(k) }));
  const rata = rekap.length ? Math.round(rekap.reduce((j, x) => j + x.r.persen, 0) / rekap.length) : 0;
  const peserta = Store.pesertaAngkatan(angkatan).sort((a, b) => a.nama.localeCompare(b.nama));
  const hadir = peserta.map((u) => ({ u, h: Store.kehadiranAnggota(u.id, terlaksana) }));
  const beban = Store.bebanTugas(angkatan, jalan).sort((a, b) => a.u.nama.localeCompare(b.u.nama));
  const henti = semua.filter((k) => !Store.kajianJalan(k));
  const jml = (f) => jalan.filter(f).length;
  const kosong = (n, teks) => `<tr><td colspan="${n}" class="lk-kosong">${teks}</td></tr>`;
  const alasanHenti = (k) => [...(k.riwayat || [])].reverse().find((r) => r.jenis === 'batal' || r.jenis === 'tunda')?.alasan || '';
  const awal = dari || semua[0]?.tanggal || nowTanggal();
  const akhir = sampai || nowTanggal();
  return el(`<div class="lk">
    <div class="lk-kop">${lambang(40)}<div><b>KAJIAN ${esc(String(s.nama).toUpperCase())}</b><span>${esc(s.naungan || s.tagline || '')}</span></div></div>
    <h2>Laporan Kajian</h2>
    <p class="lk-periode">${esc(angkatan)}${level ? ` · ${esc(level)}` : ''} · ${esc(tglSurat(awal))} s.d. ${esc(tglSurat(akhir))}</p>

    <h3>1. Ringkasan</h3>
    <table><tbody>
      ${[['Kajian terjadwal', jalan.length], ['Kajian terlaksana (berpresensi)', terlaksana.length],
         ['Ditunda / dibatalkan', `${semua.filter((k) => Store.keadaanKajian(k) === 'ditunda').length} / ${semua.filter((k) => Store.keadaanKajian(k) === 'dibatalkan').length}`],
         ['Peserta aktif', peserta.length], ['Rata-rata kehadiran', terlaksana.length ? `${rata}%` : '—'],
         ['Notulen sah', `${jml((k) => Store.statusNotulen(k) === 'sah')} dari ${jml((k) => k.tanggal <= nowTanggal())} kajian yang sudah berlangsung`],
         ['Makalah final', `${jml((k) => Store.statusRevisi(k) === 'final')} dari ${jalan.length}`]]
        .map(([l, v]) => `<tr><td style="width:70mm">${l}</td><td><b>${esc(String(v))}</b></td></tr>`).join('')}
    </tbody></table>

    <h3>2. Pertemuan</h3>
    <table><thead><tr><th>No.</th><th>Tanggal</th><th>Judul</th><th>Pemakalah</th><th class="lk-angka">Hadir</th><th class="lk-angka">Telat</th>
      <th class="lk-angka">Izin</th><th class="lk-angka">Absen</th><th class="lk-angka">%</th><th>Notulen</th></tr></thead>
      <tbody>${jalan.map((k, i) => { const r = Store.rekapKajian(k); const ada = (k.presensi || []).length;
        return `<tr><td>${i + 1}</td><td style="white-space:nowrap">${tgl(k.tanggal)}</td><td>${esc(k.judul)}</td><td>${esc(namaPendek(k.pemakalahId))}</td>
          ${ada ? `<td class="lk-angka">${r.hadir}</td><td class="lk-angka">${r.terlambat}</td><td class="lk-angka">${r.izin}</td><td class="lk-angka">${r.tidakHadir + r.belum}</td><td class="lk-angka">${r.persen}%</td>`
            : `<td colspan="5" class="lk-kosong">${k.tanggal > nowTanggal() ? 'belum berlangsung' : 'presensi belum dicatat'}</td>`}
          <td>${NOTULEN[Store.statusNotulen(k)].l}</td></tr>`; }).join('') || kosong(10, 'Tidak ada kajian pada rentang ini.')}</tbody></table>
    ${henti.length ? `<p class="lk-catatan">Tidak dihitung: ${henti.map((k) => `${esc(k.judul)} (${tgl(k.tanggal)}, ${Store.keadaanKajian(k)}${alasanHenti(k) ? ` — ${esc(alasanHenti(k))}` : ''})`).join('; ')}.</p>` : ''}

    <h3>3. Kehadiran Peserta <small>— dari ${terlaksana.length} kajian terlaksana</small></h3>
    <table><thead><tr><th>No.</th><th>Nama</th><th>Kelompok</th><th class="lk-angka">Hadir</th><th class="lk-angka">Telat</th><th class="lk-angka">Izin</th>
      <th class="lk-angka">Absen</th><th class="lk-angka">Dari</th><th class="lk-angka">%</th></tr></thead>
      <tbody>${hadir.map(({ u, h }, i) => `<tr><td>${i + 1}</td><td>${esc(u.nama)}</td><td>${esc(u.kelompok || '—')}</td>
        <td class="lk-angka">${h.hadir}</td><td class="lk-angka">${h.terlambat}</td><td class="lk-angka">${h.izin}</td><td class="lk-angka">${h.tidakHadir}</td>
        <td class="lk-angka">${h.wajib}</td><td class="lk-angka">${h.wajib ? h.persen + '%' : '—'}</td></tr>`).join('') || kosong(9, 'Belum ada peserta aktif.')}</tbody></table>

    <h3>4. Giliran Tugas</h3>
    <table><thead><tr><th>No.</th><th>Nama</th><th class="lk-angka">Pemakalah</th><th class="lk-angka">Moderator</th><th class="lk-angka">Notulen</th><th class="lk-angka">Total</th></tr></thead>
      <tbody>${beban.map((b, i) => `<tr><td>${i + 1}</td><td>${esc(b.u.nama)}</td><td class="lk-angka">${b.pemakalahId || '—'}</td>
        <td class="lk-angka">${b.moderatorId || '—'}</td><td class="lk-angka">${b.notulenId || '—'}</td><td class="lk-angka">${b.total || '—'}</td></tr>`).join('') || kosong(6, 'Belum ada peserta aktif.')}</tbody></table>

    <p class="lk-catatan">Kehadiran = (hadir + terlambat) ÷ peserta yang terdaftar pada kajian itu. Izin dan sakit dibatasi ${Store.JATAH_IZIN} kali per anggota per jenjang.
      Dicetak ${esc(tglSurat(nowTanggal()))}.</p>
    <div class="lk-ttd">
      <div>PJ Koordinator Kajian,<div class="lk-ruang"></div><b>${esc(Store.db.users.find((u) => RBAC.kunciRole(u.role) === 'pj_kajian' && u.status === 'aktif')?.nama || '………………………')}</b></div>
      <div>Mengetahui, Ketua Umum,<div class="lk-ruang"></div><b>${esc(Store.db.users.find((u) => RBAC.kunciRole(u.role) === 'ketua' && u.status === 'aktif')?.nama || '………………………')}</b></div>
    </div>
  </div>`);
}
const cetakLaporanKajian = (opsi) => cetakKhusus(lembarLaporanKajian(opsi), '@page { size: A4; margin: 14mm; }',
  `Laporan Kajian ${opsi.angkatan}${opsi.level ? ' ' + opsi.level : ''}`);

HAL['rekap-kajian'] = () => {
  const { dari, sampai } = periodeRekap;
  const dalam = (k) => (!dari || k.tanggal >= dari) && (!sampai || k.tanggal <= sampai);
  const semua = kajianAktif().filter(dalam);
  const selesai = semua.filter((k) => statusKajian(k) === 'selesai');
  const box = el('<div></div>');
  ringkasKehadiran(box, semua);
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Rekap Kajian</h3><span class="hitung">(${selesai.length} pertemuan selesai)</span>
    <div class="kanan">
      <input type="date" class="pilih-saring" data-dari value="${esc(dari)}" title="Dari tanggal">
      <input type="date" class="pilih-saring" data-sampai value="${esc(sampai)}" title="Sampai tanggal">
      <button class="btn btn-garis btn-kecil" data-export>${I.unduh} CSV</button>
      <button class="btn btn-kecil" data-cetak>${I.dok} Cetak Laporan</button></div>
  </div></div>`);
  kartu.querySelector('[data-dari]').onchange = (e) => { periodeRekap.dari = e.target.value; gambar(); };
  kartu.querySelector('[data-sampai]').onchange = (e) => { periodeRekap.sampai = e.target.value; gambar(); };
  kartu.querySelector('[data-cetak]').onclick = () => cetakLaporanKajian({ angkatan: angkatanAktif(), level: levelAktif(), dari, sampai });
  kartu.querySelector('[data-export]').onclick = () => {
    const baris = [['Tanggal', 'Judul', 'Pemakalah', 'Moderator', 'Notulen', 'Tempat', 'Peserta', 'Hadir', 'Terlambat', 'Izin/Sakit', 'Tidak Hadir', 'Persentase', 'Status Notulen', 'Status Makalah']];
    selesai.forEach((k) => { const r = rekapPresensi(k);
      baris.push([k.tanggal, k.judul, Store.namaUser(k.pemakalahId), Store.namaUser(k.moderatorId),
        Store.namaUser(k.notulenId), k.tempat, r.total, r.hadir, r.terlambat, r.izin, r.tidakHadir, r.persen + '%',
        NOTULEN[Store.statusNotulen(k)].l, REVISI[Store.statusRevisi(k)].l]); });
    unduhCsv(`rekap-kajian-${angkatanAktif().replace(/\s/g, '-').toLowerCase()}.csv`, baris);
  };
  if (!selesai.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada kajian selesai${dari || sampai ? ' pada rentang ini' : ''}</p></div>`));
    box.appendChild(kartu);
    return box;
  }
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Pemakalah</th>
      <th>Hadir</th><th>Terlambat</th><th>Izin/Sakit</th><th>Tidak Hadir</th><th style="min-width:130px">Kehadiran</th>
      <th>Makalah</th><th>Notulen</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  selesai.forEach((k, i) => {
    const r = rekapPresensi(k);
    const ada = (k.presensi || []).length;
    tb.appendChild(el(`<tr><td class="kol-no">${i + 1}</td><td class="utuh">${tgl(k.tanggal)}</td>
      <td><b>${esc(k.judul)}</b><br><span style="color:var(--e-abu);font-size:11.6px">${esc(k.tempat || '—')}</span></td><td>${esc(namaPendek(k.pemakalahId))}</td>
      ${ada ? `<td class="utuh">${r.hadir}</td><td class="utuh">${r.terlambat}</td><td class="utuh">${r.izin}</td><td class="utuh">${r.tidakHadir + r.belum}</td>
        <td><div style="display:flex;align-items:center;gap:9px"><div class="bar-maju" style="flex:1"><span style="width:${r.persen}%"></span></div>
          <b style="font-size:12.2px">${r.persen}%</b></div></td>`
        : '<td colspan="5"><span class="lencana l-merah">presensi belum dicatat</span></td>'}
      <td>${lencanaRevisi(k)}</td><td>${lencanaNotulen(k)}</td></tr>`));
  });
  kartu.appendChild(t);
  box.appendChild(kartu);
  return box;
};
HAL['rekap-kajian'].judul = () => ['Rekap & Statistik', 'Kehadiran per pertemuan dan ringkasan kajian yang sudah terlaksana.'];

/** Angka ringkas dan grafik kehadiran per pertemuan — kepala halaman Rekap. */
function ringkasKehadiran(box, semua = kajianAktif()) {
  const selesai = semua.filter((k) => (k.presensi || []).length);
  const anggota = anggotaAngkatan();
  const rata = selesai.length ? Math.round(selesai.reduce((a, k) => a + rekapPresensi(k).persen, 0) / selesai.length) : 0;
  box.appendChild(el(`<div class="grid-stat">
    ${[{ ik: I.kalender, n: semua.length, l: 'Total pertemuan', w:'rgba(140,198,63,.16)', wc:'#4A7A1E' },
       { ik: I.grup, n: anggota.length, l: 'Anggota aktif', w:'rgba(62,127,184,.14)', wc:'#2C6091' },
       { ik: I.bagan, n: rata + '%', l: 'Rata-rata kehadiran', w:'rgba(47,169,140,.14)', wc:'#1F7A64' },
       { ik: I.dok, n: semua.filter((k) => Store.statusNotulen(k) === 'sah').length, l: 'Notulen sah', w:'rgba(240,149,30,.15)', wc:'#B87310' }]
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
}

HAL.statistik = () => {
  const semua = kajianAktif();
  const selesai = semua.filter((k) => (k.presensi || []).length);
  const anggota = anggotaAngkatan();
  const box = el('<div></div>');

  /* peringkat kehadiran anggota */
  const peringkat = anggota.map((u) => {
    const h = Store.kehadiranAnggota(u.id, selesai);
    return { u, ikut: h.datang, telat: h.terlambat, absen: h.tidakHadir, wajib: h.wajib, persen: h.persen };
  }).sort((a, b) => b.persen - a.persen || a.telat - b.telat || a.u.nama.localeCompare(b.u.nama));

  const kr = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Kehadiran Anggota</h3><span class="hitung">${selesai.length} pertemuan tercatat</span>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-export>${I.unduh} Export Excel</button></div>
  </div></div>`);
  kr.querySelector('[data-export]').onclick = () => {
    const baris = [['No.', 'Nama', 'Kelompok', 'Datang', 'Terlambat', 'Tidak Hadir', 'Dari', 'Persentase']];
    peringkat.forEach((p, i) => baris.push([i + 1, p.u.nama, p.u.kelompok || '', p.ikut, p.telat, p.absen, p.wajib, p.persen + '%']));
    unduhCsv('kehadiran-anggota.csv', baris);
  };
  kr.appendChild(el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Nama</th><th>Kelompok</th><th>Datang</th><th>Terlambat</th><th>Tidak Hadir</th>
      <th style="min-width:160px">Kehadiran</th></tr></thead>
    <tbody>${peringkat.map((p, i) => `<tr><td class="kol-no">${i + 1}</td>
      <td><div style="display:flex;align-items:center;gap:10px">
        <img src="${p.u.foto}" alt="" style="width:28px;height:28px;border-radius:50%;flex:none">
        <b>${esc(p.u.nama)}</b></div></td>
      <td class="utuh">${esc(p.u.kelompok || '—')}</td>
      <td class="utuh">${p.ikut}/${p.wajib}</td><td class="utuh">${p.telat}</td><td class="utuh">${p.absen}</td>
      <td><div style="display:flex;align-items:center;gap:9px">
        <div class="bar-maju" style="flex:1"><span style="width:${p.persen}%"></span></div>
        <b style="font-size:12.2px;min-width:36px;text-align:right">${p.persen}%</b></div></td></tr>`).join('')}</tbody>
  </table></div>`));
  box.appendChild(kr);
  return box;
};
HAL.statistik.judul = () => ['Kehadiran Anggota', 'Peringkat kehadiran dan keterlambatan tiap anggota angkatan aktif.'];

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
    aturLingkup(kartu.querySelector('#ak').value, kartu.querySelector('#lv').value);
    toast(`Lingkup diubah ke ${angkatanPilihan} · ${levelPilihan}.`);
    gambar();
  };
  box.appendChild(kartu);

  box.appendChild(el(`<div class="kartu" style="margin-top:20px"><div class="kartu-kepala">
    <h3>Ringkasan Angkatan</h3></div>
    <div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th>Angkatan</th><th>Level</th><th>Kajian</th><th>Peserta</th><th>Rata-rata Kehadiran</th></tr></thead>
      <tbody>${angkatanTersedia().flatMap((a) => [...new Set(Store.db.kajian.filter((k) => k.angkatan === a).map((k) => k.level))].sort().map((l) => {
        const ks = Store.db.kajian.filter((k) => k.angkatan === a && k.level === l && Store.kajianJalan(k));
        if (!ks.length) return '';
        const ang = Store.pesertaAngkatan(a).length;
        const sel = ks.filter((k) => (k.presensi || []).length);
        const rata = sel.length ? Math.round(sel.reduce((s, k) => s + Store.rekapKajian(k).persen, 0) / sel.length) : 0;
        return `<tr><td><b>${esc(a)}</b></td><td class="utuh">${esc(l)}</td>
          <td class="utuh">${ks.length}</td><td class="utuh">${ang}</td><td class="utuh">${rata}%</td></tr>`;
      })).join('')}</tbody></table></div></div>`));
  return box;
};
HAL['atur-kajian'].judul = () => ['Lingkup Kajian', 'Angkatan dan level yang sedang dibuka di ruang kerja ini.'];

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
/* Seluruh hitungan memakai transaksi SAH saja: yang menunggu, ditolak,
   atau dibatalkan tetap tampil di daftarnya tetapi tak ikut dijumlah. */
const kasBulan = (b) => Store.kasSah().filter((t) => t.tanggal.startsWith(b));
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
/* Yang nonaktif tetap ada di pilihan — transaksi lama yang disunting
   tak boleh diam-diam berpindah akun — tetapi ditaruh di akhir dan
   bertanda; transaksi BARU ke sana ditolak penyimpannya. */
const aktifDulu = (a, b) => (a.nonaktif === true) - (b.nonaktif === true);
const kategoriUntuk = (jenis) => Store.db.kategoriKeuangan.filter((k) => k.jenis === jenis).sort(aktifDulu)
  .map((k) => ({ v: k.nama, l: k.nonaktif ? `${k.nama} (nonaktif)` : k.nama }));
const pilihanAkun = () => [...Store.db.akunKas].sort(aktifDulu)
  .map((a) => ({ v: a.id, l: a.nonaktif ? `${a.nama} (nonaktif)` : a.nama }));
const lencanaNonaktif = (x) => (x.nonaktif ? ' <span class="lencana l-abu">nonaktif</span>' : '');
const pilihStatus = { k: 'nonaktif', l: 'Status', jenis: 'pilih', bawaan: 'tidak',
  pilihan: [{ v: 'tidak', l: 'Aktif' }, { v: 'ya', l: 'Nonaktif — tak dipakai untuk transaksi baru' }] };

/* ---------------- dasbor ---------------- */
/* Antrean Bendahara: yang menuntut tindakannya hari ini. Ditambah
   seiring bertambahnya alat — bukti, tutup buku, persetujuan. */
function antreanBendahara() {
  const bulan = bulanIni();
  const aktif = Store.db.users.filter((u) => u.status === 'aktif');
  const menunggak = aktif.filter((u) => Store.iuranAnggota(u.id, bulan).status !== 'lunas');
  const minus = Store.db.akunKas.map((a) => ({ a, s: Store.saldoAkun(a.id) })).filter((x) => x.s.rp < 0 || x.s.egp < 0);
  const tanpaKat = Store.db.keuangan.filter((t) => t.jenis !== 'transfer' && !t.kategoriId);
  const keluar = Store.db.keuangan.filter((t) => t.jenis === 'keluar');
  const ditolak = keluar.filter((t) => t.status === 'ditolak');
  const tunggu = keluar.filter((t) => t.status === 'menunggu');
  const belumTutup = bulanBuku().filter((b) => b < bulan && !Store.bulanTertutup(b));
  const tanpaBukti = keluar.filter((t) => (t.status === 'menunggu' || Store.kasSahkah(t)) && !t.bukti && Store.dicatatHariIni(t) === false && t.dibuat);
  return kartuAntrean('Perlu Ditindak', [
    { rute: 'pengeluaran', ikon: I.peringatan, judul: 'Ditolak Ketua', n: ditolak.length,
      satuan: 'pengeluaran perlu diperbaiki atau dibatalkan', kosong: 'Tidak ada pengeluaran yang ditolak',
      rinci: ditolak[0] && `${ditolak[0].sumber} — ${ditolak[0].persetujuan?.alasan || ''}` },
    { rute: 'pengeluaran', ikon: I.dokCek, judul: 'Menunggu Persetujuan', n: tunggu.length,
      satuan: 'pengeluaran belum diputuskan Ketua', kosong: 'Tidak ada pengeluaran yang menunggu',
      rinci: tunggu[0] && `${tunggu[0].sumber} — ${Store.nominalGabung(tunggu[0])}` },
    ...(anggaranLampau().length ? [{ rute: 'anggaran', ikon: I.sasaran, judul: 'Melampaui Anggaran', n: anggaranLampau().length,
      satuan: 'kategori melewati anggarannya', kosong: '', rinci: anggaranLampau()[0].k.nama }] : []),
    { rute: 'tutup-buku', ikon: I.gembok, judul: 'Tutup Buku', n: belumTutup.length,
      satuan: 'bulan lampau belum ditutup', kosong: 'Semua bulan lampau sudah ditutup',
      rinci: belumTutup[0] && namaBulan(belumTutup[0]) },
    { rute: 'pengeluaran', ikon: I.gambar, judul: 'Pengeluaran Tanpa Bukti', n: tanpaBukti.length,
      satuan: 'pengeluaran belum berfoto bukti', kosong: 'Semua pengeluaran berbukti',
      rinci: tanpaBukti[0] && `${tanpaBukti[0].nomor} · ${tanpaBukti[0].sumber}` },
    { rute: 'iuran-anggota', sebelum: () => { saringIuran = { bulan, angkatan: '', status: 'belum' }; },
      ikon: I.grup, judul: `Iuran ${namaBulan(bulan)}`, n: menunggak.length,
      satuan: `dari ${aktif.length} anggota belum lunas`, kosong: 'Semua anggota aktif sudah lunas',
      rinci: menunggak[0] && menunggak[0].nama },
    { rute: 'saldo', ikon: I.peringatan, judul: 'Akun Bersaldo Minus', n: minus.length,
      satuan: 'akun perlu diperiksa', kosong: 'Tidak ada akun yang minus',
      rinci: minus[0] && `${minus[0].a.nama}: ${minus[0].s.rp < 0 ? rpFmt(minus[0].s.rp) : egpFmt(minus[0].s.egp)}` },
    ...(tanpaKat.length ? [{ rute: 'laporan-kas', ikon: I.tag, judul: 'Kategori Tak Dikenal', n: tanpaKat.length,
      satuan: 'transaksi berkategori yang sudah tak terdaftar', kosong: '',
      rinci: `"${tanpaKat[0].kategori}" — sunting transaksinya, pilih kategori yang ada` }] : []),
  ]);
}

function dasborBendahara() {
  const box = el('<div></div>');
  const bulanIni = nowTanggal().slice(0, 7);
  const ini = kasBulan(bulanIni);
  const saldo = saldoTotal();
  const masuk = ini.filter((t) => t.jenis === 'masuk'), keluar = ini.filter((t) => t.jenis === 'keluar');
  /* Dua mata uang berdampingan. Dulu kartu ini hanya menghitung rupiah,
     sehingga pemasukan pound sebulan penuh tampak seperti nol. */
  const dua = (d) => [jumlahKas(d, 'rp') ? rpFmt(jumlahKas(d, 'rp')) : '', jumlahKas(d, 'egp') ? egpFmt(jumlahKas(d, 'egp')) : '']
    .filter(Boolean).join(' + ') || 'Rp 0';
  box.appendChild(antreanBendahara());

  box.appendChild(el(`<div class="bd-stat-grid">
    ${[
      { ik: I.masukKas,  w:'rgba(140,198,63,.16)', wc:'#4A7A1E', l:'Saldo Keseluruhan (Rp)',  n: rpFmt(saldo.rp),   s:'Total saldo rupiah' },
      { ik: I.masukKas,  w:'rgba(240,149,30,.15)', wc:'#B87310', l:'Saldo Keseluruhan (EGP)', n: egpFmt(saldo.egp), s:'Total saldo pound' },
      { ik: I.naik,      w:'rgba(140,198,63,.16)', wc:'#4A7A1E', l:'Total Pemasukan',  n: dua(masuk),  s: namaBulan(bulanIni) },
      { ik: I.turun,     w:'rgba(217,83,111,.14)', wc:'#B23E5F', l:'Total Pengeluaran',n: dua(keluar), s: namaBulan(bulanIni) },
    ].map((x) => `<div class="bd-stat">
      <span class="bd-stat-ik" style="--w:${x.w};--wc:${x.wc}">${x.ik}</span>
      <div><div class="bd-stat-l">${esc(x.l)}</div><div class="bd-stat-n"${String(x.n).length > 15 ? ' style="font-size:16.5px;letter-spacing:-.2px"' : ''}>${esc(x.n)}</div>
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
      <button class="btn btn-garis btn-kecil">${r.kustom ? `Pilih Rentang ${I.panahKanan}` : 'Lihat & Cetak'}</button>
    </div>`);
    /* Dasbor hanya pintasan: laporannya dibuka di halaman Laporan Keuangan. */
    n.querySelector('button').onclick = () => {
      if (r.kustom) return bukaModul('laporan-kas', dialogLaporanKustom);
      laporanTerbuka = r.rentang(); bukaModul('laporan-kas');
    };
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
  /* Buku kas tidak dihapus massal, dan tombol hapusnya membatalkan. */
  tanpaPilih: true, judulHapus: 'Batalkan transaksi',
  dialogHapus: (x) => batalkanKas(x),
  kelasBaris: (x) => (x.status === 'batal' || x.status === 'ditolak' ? 'kas-coret' : x.status === 'menunggu' ? 'kas-tunggu' : ''),
  pratinjau: { awal: 3, akhir: 1 },
  cari: (x) => `${x.nomor || ''} ${x.sumber} ${x.kategori} ${x.ket}`,
  tajuk: (x) => x.sumber || x.kategori,
  ...spec,
});

const STATUS_KAS = {
  menunggu: { l: 'Menunggu Ketua', c: 'l-kuning' }, ditolak: { l: 'Ditolak', c: 'l-merah' }, batal: { l: 'Dibatalkan', c: 'l-abu' },
};
/** Lencana status dan keterangannya — alasan batal atau alasan penolakan. */
const lencanaKas = (x) => {
  const st = STATUS_KAS[x.status];
  if (!st) return '';
  const sebab = x.status === 'batal' ? x.batal?.alasan : x.status === 'ditolak' ? x.persetujuan?.alasan : '';
  return ` <span class="lencana ${st.c}">${st.l}</span>${sebab ? `<br><span class="sub-sel">${esc(sebab)}</span>` : ''}`;
};
const kolomBukti = { l: 'No. Bukti', kelas: 'utuh', isi: (x) => `<span class="nia">${esc(x.nomor || '—')}</span>` };
const kolomFotoBukti = { l: 'Bukti', penuh: true, isi: () => '', pasang: selGambar('bukti', 'sumber', (x) => x.nomor || '') };
const medanBukti = { k: 'bukti', l: 'Foto Bukti', jenis: 'gambar',
  bantu: 'Foto kuitansi, nota, atau bukti transfer. Dikecilkan otomatis ke lebar 1000px.' };

/* Tombol hapus pada buku kas. Transaksi yang dicatat hari ini boleh
   dihapus — salah ketik yang langsung ketahuan. Selebihnya dibatalkan
   dengan alasan, dan tetap tampak di buku, dicoret. */
function batalkanKas(x) {
  if (x.status === 'batal') return toast('Transaksi ini sudah dibatalkan.', true);
  const hariIni = Store.dicatatHariIni(x);
  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.6px;color:#44534A"><b>${esc(x.nomor || '')}</b> · ${esc(x.sumber || x.kategori)} ·
      ${esc(Store.nominalGabung(x))}</p>
    <div class="grup" style="margin:0"><label>Alasan pembatalan</label>
      <textarea data-alasan style="min-height:76px" placeholder="Contoh: tercatat dua kali, salah akun, kegiatan dibatalkan"></textarea>
      <div class="bantu">Transaksi yang dibatalkan tetap terlihat di buku kas — dicoret dan tidak dihitung dalam saldo maupun laporan.</div></div>
  </div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    ${hariIni ? '<button class="btn btn-garis" data-hapus style="margin-right:auto" title="Hanya untuk transaksi yang dicatat hari ini">Hapus Permanen</button>' : ''}
    <button class="btn btn-garis" data-b>Tutup</button><button class="btn btn-merah" data-y>Batalkan Transaksi</button></div>`);
  modal({ judul: 'Batalkan transaksi', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-y]').onclick = () => {
    if (aman(() => Store.batalkanTransaksi(U, x.id, isi.querySelector('[data-alasan]').value))) {
      tutupModal(); toast('Transaksi dibatalkan.'); gambar();
    }
  };
  kaki.querySelector('[data-hapus]')?.addEventListener('click', () => {
    if (aman(() => Store.hapusTransaksi(U, x.id))) { tutupModal(); toast('Transaksi dihapus.'); gambar(); }
  });
}

const kolomNominal = [
  { l: 'Rp', kelas: 'utuh', isi: (x) => rpFmt(x.rp) },
  { l: 'EGP', kelas: 'utuh', isi: (x) => egpFmt(x.egp) },
  { l: 'Akun', isi: (x) => `<span class="lencana l-abu">${esc(namaAkun(x.akunId))}</span>` },
  { l: 'Keterangan', penuh: true, isi: (x) => esc(x.ket || '—') },
  { l: 'Tanggal', kelas: 'utuh', isi: (x) => tgl(x.tanggal) },
  kolomFotoBukti,
];
/* Sebuah transaksi boleh ditautkan ke program kerja atau proyek buku.
   Dari tautan itulah biaya tiap program dan realisasi tiap buku dihitung
   — tanpa pembukuan kedua di tempat lain. */
const medanTaut = [
  { k: 'programId', l: 'Program Kerja Terkait', jenis: 'pilih',
    pilihan: () => [{ v: '', l: '— tidak terkait program tertentu —' },
      ...[...Store.db.kaleidoskop].sort(urutProgram).map((k) => ({ v: k.id, l: `${k.kegiatan} (${waktuProgram(k)})` }))] },
  { k: 'bukuId', l: 'Proyek Buku Terkait', jenis: 'pilih',
    pilihan: () => [{ v: '', l: '— tidak terkait proyek buku —' }, ...Store.db.buku.map((b) => ({ v: b.id, l: b.judul }))] },
];
/** Jumlah transaksi sah yang ditautkan ke sesuatu, per jenis. */
const kasTaut = (kunci, id, jenis) => Store.kasSah().filter((t) => t[kunci] === id && t.jenis === jenis);

const medanNominal = [
  { k: 'rp', l: 'Nominal Rupiah (Rp)', jenis: 'angka', ph: '0' },
  { k: 'egp', l: 'Nominal Pound (EGP)', jenis: 'angka', ph: '0',
    bantu: 'Rupiah dan pound dicatat terpisah — isi salah satu atau keduanya, sesuai uang yang benar-benar diterima.' },
  { k: 'akunId', l: 'Disimpan di', jenis: 'pilih', pilihan: pilihanAkun },
  { k: 'tanggal', l: 'Tanggal', jenis: 'tanggal', wajib: true },
  { k: 'ket', l: 'Keterangan', ph: 'Iuran anggota' },
  medanBukti,
];

Object.assign(MODUL, {
  'masuk-internal': modulKas('masuk-internal', {
    judul: 'Pemasukan Internal', satuan: 'Pemasukan',
    sub: 'Iuran dan sumbangan dari dalam organisasi.',
    sumber: () => arusKas('internal'),
    bawaanBaru: () => ({ jenis: 'masuk', arus: 'internal' }),
    tombolLain: [
      { label: 'Pindai Kartu', ikon: I.qr, klik: () => pindaiIuran() },
      { label: 'Terima Iuran', ikon: I.masukKas, klik: () => dialogIuran() },
    ],
    cari: (x) => `${x.sumber} ${x.kategori} ${x.ket} ${Store.getUser(x.userId)?.nia || ''}`,
    kolom: [kolomBukti, { l: 'Sumber', isi: (x) => `<b>${esc(x.sumber)}</b>${lencanaKas(x)}${x.userId ? `<br><span class="sub-sel"><span class="nia">${
      esc(Store.getUser(x.userId)?.nia || '—')}</span>${x.bulanIuran ? ` · iuran ${esc(namaBulan(x.bulanIuran))}` : ''}</span>` : ''}` }, ...kolomNominal],
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
    kolom: [kolomBukti, { l: 'Sumber', isi: (x) => `<b>${esc(x.sumber)}</b>${lencanaKas(x)}` }, ...kolomNominal],
    form: [
      { k: 'sumber', l: 'Nama Donatur / Sumber', wajib: true, ph: 'Bu Amel' },
      { k: 'kategori', l: 'Kategori', jenis: 'pilih', bawaan: 'Infaq/Donasi', pilihan: () => kategoriUntuk('masuk') },
      ...medanNominal, ...medanTaut,
    ],
  }),
  pengeluaran: modulKas('pengeluaran', {
    judul: 'Pengeluaran', satuan: 'Pengeluaran',
    sub: 'Seluruh uang keluar beserta akun sumbernya.',
    sumber: kasKeluar,
    bawaanBaru: () => ({ jenis: 'keluar', arus: null }),
    /* Pengeluaran yang melampaui isi akunnya hampir selalu salah akun
       atau salah nominal — tetapi kadang memang benar (ditalangi dulu),
       jadi diperingatkan, bukan dilarang. */
    peringatanSimpan: (d) => {
      const a = Store.db.akunKas.find((x) => x.id === d.akunId);
      if (!a) return '';
      const lama = d.id ? Store.db.keuangan.find((x) => x.id === d.id) : null;
      const s = Store.saldoAkun(a.id);
      const kembali = lama && lama.akunId === a.id ? lama : { rp: 0, egp: 0 };
      const rp = s.rp + Number(kembali.rp || 0) - Number(d.rp || 0), egp = s.egp + Number(kembali.egp || 0) - Number(d.egp || 0);
      if (rp >= 0 && egp >= 0) return '';
      return `Saldo "${a.nama}" akan menjadi ${rp < 0 ? rpFmt(rp) : egpFmt(egp)}. Periksa akun dan nominalnya — tekan Simpan sekali lagi bila memang benar.`;
    },
    kolom: [kolomBukti, { l: 'Uraian', isi: (x) => `<b>${esc(x.sumber || x.kategori)}</b>${lencanaKas(x)}<br><span class="sub-sel">${esc([x.kategori,
      Store.db.kaleidoskop.find((k) => k.id === x.programId)?.kegiatan, Store.db.buku.find((b) => b.id === x.bukuId)?.judul].filter(Boolean).join(' · '))}</span>` }, ...kolomNominal],
    /* Pengeluaran yang perlu disetujui tidak langsung mengurangi saldo. */
    sesudahSimpan: (d) => { if (Store.perluSetuju({ ...d, jenis: 'keluar' })) toast('Tercatat dan menunggu persetujuan Ketua Umum. Saldo belum berkurang.'); },
    form: [
      { k: 'sumber', l: 'Uraian Pengeluaran', wajib: true, ph: 'Sewa sekretariat bulan Oktober',
        bantu: 'Untuk apa uang ini dikeluarkan. Golongannya dipilih pada Kategori.' },
      { k: 'kategori', l: 'Kategori', jenis: 'pilih', bawaan: 'Sewa Sekretariat', pilihan: () => kategoriUntuk('keluar') },
      ...medanNominal, ...medanTaut,
    ],
  }),
  'akun-kas': {
    ruang: 'bendahara', izin: 'keuangan.akun', koleksi: 'akunKas',
    judul: 'Akun & Tempat Uang', satuan: 'Akun',
    sub: 'Tempat uang organisasi disimpan.',
    cari: (x) => `${x.nama} ${x.jenis}`, tajuk: (x) => x.nama,
    pratinjau: { awal: 3, akhir: 1 },
    simpan: (d) => Store.simpanAkunKas(U, d),
    hapus: (x) => Store.hapusAkunKas(U, x.id),
    /* Form memakai 'ya'/'tidak'; yang tersimpan boolean. */
    sesudahForm: (isi, item) => { if (item) isi.querySelector('[data-k="nonaktif"]').value = item.nonaktif ? 'ya' : 'tidak'; },
    kolom: [
      { l: 'Nama Akun', isi: (x) => `<b>${esc(x.nama)}</b>${lencanaNonaktif(x)}<br><span style="color:var(--e-abu);font-size:11.6px">${esc(x.ket || '')}</span>` },
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
      { k: 'alasanSaldo', l: 'Alasan Mengubah Saldo Awal',
        bantu: 'Wajib hanya bila saldo awal diubah pada akun yang sudah bertransaksi. Perubahannya tercatat di log.' },
      { k: 'ket', l: 'Keterangan', ph: 'Uang tunai yang dipegang di sekretariat.' },
      pilihStatus,
    ],
  },
  'kategori-kas': {
    ruang: 'bendahara', izin: 'keuangan.akun', koleksi: 'kategoriKeuangan',
    judul: 'Kategori Transaksi', satuan: 'Kategori',
    sub: 'Penggolongan pemasukan dan pengeluaran.',
    cari: (x) => x.nama, tajuk: (x) => x.nama,
    pratinjau: { awal: 3, akhir: 1 },
    simpan: (d) => Store.simpanKategoriKas(U, d),
    hapus: (x) => Store.hapusKategoriKas(U, x.id),
    sesudahForm: (isi, item) => { if (item) isi.querySelector('[data-k="nonaktif"]').value = item.nonaktif ? 'ya' : 'tidak'; },
    kolom: [
      { l: 'Nama Kategori', isi: (x) => `<b>${esc(x.nama)}</b>${lencanaNonaktif(x)}` },
      { l: 'Jenis', isi: (x) => `<span class="lencana ${x.jenis === 'masuk' ? 'l-hijau' : 'l-merah'}">${x.jenis === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}</span>` },
      { l: 'Dipakai', kelas: 'utuh', isi: (x) => Store.transaksiKategori(x).length + ' transaksi' },
    ],
    form: [
      { k: 'nama', l: 'Nama Kategori', wajib: true, ph: 'Konsumsi Kajian' },
      { k: 'jenis', l: 'Jenis', jenis: 'pilih', bawaan: 'keluar',
        pilihan: [{ v: 'masuk', l: 'Pemasukan' }, { v: 'keluar', l: 'Pengeluaran' }],
        bantu: 'Mengganti nama kategori ikut mengganti namanya pada seluruh transaksinya.' },
      pilihStatus,
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
  const semua = Store.kasSah();

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
  /* Tanggal satu, tengah malam setempat. Lewat toISOString() ia mundur
     ke hari terakhir bulan sebelumnya di zona timur UTC. */
  return tanggalLokal(new Date(d.getFullYear(), d.getMonth() - mundur, 1));
};
/* Triwulan KALENDER yang sedang berjalan. Dulu labelnya "Q4" tetapi
   isinya tiga bulan terakhir berjalan — dua hal yang berbeda. */
const triwulanIni = () => {
  const d = new Date(), q = Math.floor(d.getMonth() / 3);
  return { dari: tanggalLokal(new Date(d.getFullYear(), q * 3, 1)), sampai: tanggalLokal(new Date(d.getFullYear(), q * 3 + 3, 0)), q: q + 1 };
};
const LAPORAN_KAS = [
  { judul: 'Laporan Bulanan', ket: 'Bulan yang sedang berjalan, sampai hari ini.', ik: I.dok,
    w: 'rgba(140,198,63,.16)', wc: '#4A7A1E',
    periode: () => namaBulan(nowTanggal().slice(0, 7)),
    rentang: () => ({ dari: awalBulan(0), sampai: nowTanggal(), nama: 'bulanan', judul: `Laporan Bulanan — ${namaBulan(nowTanggal().slice(0, 7))}` }) },
  { judul: 'Laporan Bulan Lalu', ket: 'Sebulan penuh — biasanya yang ditutup bukunya.', ik: I.gembok,
    w: 'rgba(47,169,140,.14)', wc: '#1F7A64',
    periode: () => namaBulan(awalBulan(1).slice(0, 7)),
    rentang: () => ({ dari: awalBulan(1), sampai: Store.akhirBulan(awalBulan(1).slice(0, 7)), nama: 'bulan-lalu', judul: `Laporan Bulanan — ${namaBulan(awalBulan(1).slice(0, 7))}` }) },
  { judul: 'Laporan Triwulan', ket: 'Triwulan kalender yang sedang berjalan.', ik: I.bagan,
    w: 'rgba(62,127,184,.14)', wc: '#2C6091',
    periode: () => `Triwulan ${triwulanIni().q} ${new Date().getFullYear()}`,
    rentang: () => { const t = triwulanIni(); return { dari: t.dari, sampai: t.sampai > nowTanggal() ? nowTanggal() : t.sampai, nama: 'triwulan', judul: `Laporan Triwulan ${t.q} ${new Date().getFullYear()}` }; } },
  { judul: 'Laporan Periode', ket: 'Sejak awal masa kepengurusan sampai hari ini.', ik: I.piala,
    w: 'rgba(124,92,214,.14)', wc: '#5F45AE',
    periode: () => { const p = Store.periodeAktif(); return p.ditetapkan ? `${tgl(p.mulai)} – ${tgl(p.selesai)}` : `Tahun ${p.mulai.slice(0, 4)}`; },
    rentang: () => { const p = Store.periodeAktif(); return { dari: p.mulai, sampai: p.selesai > nowTanggal() ? nowTanggal() : p.selesai, nama: 'periode', judul: 'Laporan Periode Kepengurusan' }; } },
  { judul: 'Laporan Kustom', ket: 'Rentang tanggal sesuai kebutuhan.', ik: I.sunting,
    w: 'rgba(240,149,30,.15)', wc: '#B87310', kustom: true, periode: () => '' },
];

function barisLaporan({ dari, sampai }) {
  return Store.kasSah().filter((t) => t.tanggal >= dari && t.tanggal <= sampai)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
}

function unduhLaporan({ dari, sampai, nama }) {
  const data = barisLaporan({ dari, sampai });
  if (!data.length) return toast('Tidak ada transaksi pada periode itu.', true);
  const b = [['Laporan Keuangan Kajian ' + Store.cms.situs.nama],
    [`Periode ${tgl(dari)} s.d. ${tgl(sampai)}`], [],
    ['No. Bukti', 'Tanggal', 'Jenis', 'Arus', 'Sumber', 'Kategori', 'Akun', 'Rp', 'EGP', 'Keterangan']];
  data.forEach((t) => b.push([t.nomor || '', t.tanggal, t.jenis, t.arus || '-', t.sumber || '', t.kategori,
    namaAkun(t.akunId), t.rp, t.egp, t.ket || '']));
  const mr = jumlahKas(data.filter((t) => t.jenis === 'masuk'), 'rp');
  const kr = jumlahKas(data.filter((t) => t.jenis === 'keluar'), 'rp');
  const me = jumlahKas(data.filter((t) => t.jenis === 'masuk'), 'egp');
  const ke = jumlahKas(data.filter((t) => t.jenis === 'keluar'), 'egp');
  b.push([], ['', '', '', '', '', '', 'Total Pemasukan', mr, me],
    ['', '', '', '', '', '', 'Total Pengeluaran', kr, ke],
    ['', '', '', '', '', '', 'Selisih', mr - kr, me - ke]);
  unduhCsv(`laporan-keuangan-${nama}-${dari}.csv`, b);
}

/* Cetak sebuah potongan halaman saja. Potongannya disalin ke wadah
   tersendiri di luar kerangka aplikasi, lalu kerangkanya disembunyikan
   selama mencetak — jadi tak perlu daftar panjang "apa saja yang harus
   disembunyikan" tiap kali halaman berubah. */
function cetakKhusus(simpul, kertas = '@page { size: A4; margin: 15mm; }', judulBerkas = '') {
  const wadah = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'cetak-khusus' }));
  wadah.appendChild(simpul.cloneNode(true));
  const gaya = document.head.appendChild(Object.assign(document.createElement('style'), { textContent: kertas }));
  const judulLama = document.title;
  if (judulBerkas) document.title = judulBerkas;
  document.body.classList.add('cetak-khusus');
  const usai = () => {
    document.body.classList.remove('cetak-khusus');
    wadah.remove(); gaya.remove(); document.title = judulLama;
    window.removeEventListener('afterprint', usai);
  };
  window.addEventListener('afterprint', usai);
  window.print();
}

/** Lembar laporan keuangan untuk satu rentang: saldo awal, pemasukan dan
    pengeluaran per kategori, transfer, saldo akhir — dua mata uang
    berdampingan. Tiap angkanya dari buku kas; tak ada yang diketik. */
function lembarLaporanKas({ dari, sampai, judul }) {
  const s = Store.cms.situs;
  const kemarin = (() => { const d = new Date(`${dari}T00:00`); d.setDate(d.getDate() - 1); return tanggalLokal(d); })();
  const tx = Store.kasSah().filter((t) => t.tanggal >= dari && t.tanggal <= sampai);
  const masuk = tx.filter((t) => t.jenis === 'masuk'), keluar = tx.filter((t) => t.jenis === 'keluar'), transfer = tx.filter((t) => t.jenis === 'transfer');
  const lain = Store.db.keuangan.filter((t) => t.tanggal >= dari && t.tanggal <= sampai && !Store.kasSahkah(t));
  const akun = Store.db.akunKas.map((a) => ({ a, awal: Store.saldoAkun(a.id, kemarin), akhir: Store.saldoAkun(a.id, sampai) }))
    .filter((x) => !x.a.nonaktif || x.awal.rp || x.awal.egp || x.akhir.rp || x.akhir.egp);
  const jml = (d, k) => jumlahKas(d, k);
  const perKat = (d) => [...new Set(d.map((t) => t.kategori || '(tanpa kategori)'))].sort()
    .map((k) => ({ k, d: d.filter((t) => (t.kategori || '(tanpa kategori)') === k) }));
  const tot = (kunci) => akun.reduce((j, x) => ({ rp: j.rp + x[kunci].rp, egp: j.egp + x[kunci].egp }), { rp: 0, egp: 0 });
  const awal = tot('awal'), akhir = tot('akhir');
  /* Penukaran mengubah total per mata uang: pound keluar, rupiah masuk. */
  const tukar = { rp: jml(transfer, 'rpTujuan') - jml(transfer, 'rp'), egp: jml(transfer, 'egpTujuan') - jml(transfer, 'egp') };
  const hitung = { rp: awal.rp + jml(masuk, 'rp') - jml(keluar, 'rp') + tukar.rp, egp: awal.egp + jml(masuk, 'egp') - jml(keluar, 'egp') + tukar.egp };
  const cocok = hitung.rp === akhir.rp && hitung.egp === akhir.egp;
  const sel = (n, f) => `<td class="lk-angka">${n ? f(n) : '—'}</td>`;
  const barisKat = (grup) => grup.map((g) => `<tr><td>${esc(g.k)}</td><td class="lk-angka">${g.d.length}</td>${sel(jml(g.d, 'rp'), rpFmt)}${sel(jml(g.d, 'egp'), egpFmt)}</tr>`).join('')
    || '<tr><td colspan="4" class="lk-kosong">Tidak ada transaksi.</td></tr>';
  const orang = (role) => Store.db.users.find((u) => u.role === role && u.status === 'aktif')?.nama || '';

  return el(`<div class="lk">
    <div class="lk-kop">${lambang(40)}<div><b>KAJIAN ${esc(String(s.nama).toUpperCase())}</b><span>${esc(s.naungan || s.tagline || '')}</span></div></div>
    <h2>${esc(judul || 'Laporan Keuangan')}</h2>
    <p class="lk-periode">Periode ${esc(tglSurat(dari))} s.d. ${esc(tglSurat(sampai))}</p>

    <h3>A. Saldo Awal <small>per ${esc(tglSurat(kemarin))}</small></h3>
    <table><thead><tr><th>Akun</th><th class="lk-angka">Rupiah</th><th class="lk-angka">Pound</th></tr></thead>
      <tbody>${akun.map((x) => `<tr><td>${esc(x.a.nama)}</td><td class="lk-angka">${rpFmt(x.awal.rp)}</td><td class="lk-angka">${egpFmt(x.awal.egp)}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td>Jumlah saldo awal</td><td class="lk-angka">${rpFmt(awal.rp)}</td><td class="lk-angka">${egpFmt(awal.egp)}</td></tr></tfoot></table>

    <h3>B. Pemasukan</h3>
    <table><thead><tr><th>Kategori</th><th class="lk-angka">Transaksi</th><th class="lk-angka">Rupiah</th><th class="lk-angka">Pound</th></tr></thead>
      <tbody>${barisKat(perKat(masuk))}</tbody>
      <tfoot><tr><td>Jumlah pemasukan</td><td class="lk-angka">${masuk.length}</td><td class="lk-angka">${rpFmt(jml(masuk, 'rp'))}</td><td class="lk-angka">${egpFmt(jml(masuk, 'egp'))}</td></tr></tfoot></table>

    <h3>C. Pengeluaran</h3>
    <table><thead><tr><th>Kategori</th><th class="lk-angka">Transaksi</th><th class="lk-angka">Rupiah</th><th class="lk-angka">Pound</th></tr></thead>
      <tbody>${barisKat(perKat(keluar))}</tbody>
      <tfoot><tr><td>Jumlah pengeluaran</td><td class="lk-angka">${keluar.length}</td><td class="lk-angka">${rpFmt(jml(keluar, 'rp'))}</td><td class="lk-angka">${egpFmt(jml(keluar, 'egp'))}</td></tr></tfoot></table>

    ${transfer.length ? `<h3>D. Transfer & Penukaran <small>bukan pemasukan maupun pengeluaran</small></h3>
    <table><thead><tr><th>No. Bukti</th><th>Tanggal</th><th>Dari → Ke</th><th class="lk-angka">Keluar</th><th class="lk-angka">Tiba</th></tr></thead>
      <tbody>${transfer.map((t) => `<tr><td>${esc(t.nomor || '')}</td><td>${tgl(t.tanggal)}</td><td>${esc(namaAkun(t.akunId))} → ${esc(namaAkun(t.akunTujuanId))}</td>
        <td class="lk-angka">${esc(uangDua(t.rp, t.egp))}</td><td class="lk-angka">${esc(uangDua(t.rpTujuan, t.egpTujuan))}</td></tr>`).join('')}</tbody>
      ${tukar.rp || tukar.egp ? `<tfoot><tr><td colspan="3">Pengaruh penukaran pada total</td><td class="lk-angka" colspan="2">${
        [tukar.rp ? `${tukar.rp > 0 ? '+' : '−'} ${rpFmt(Math.abs(tukar.rp))}` : '', tukar.egp ? `${tukar.egp > 0 ? '+' : '−'} ${egpFmt(Math.abs(tukar.egp))}` : ''].filter(Boolean).join(' · ')}</td></tr></tfoot>` : ''}</table>` : ''}

    <h3>${transfer.length ? 'E' : 'D'}. Saldo Akhir <small>per ${esc(tglSurat(sampai))}</small></h3>
    <table><thead><tr><th>Akun</th><th class="lk-angka">Rupiah</th><th class="lk-angka">Pound</th></tr></thead>
      <tbody>${akun.map((x) => `<tr><td>${esc(x.a.nama)}</td><td class="lk-angka">${rpFmt(x.akhir.rp)}</td><td class="lk-angka">${egpFmt(x.akhir.egp)}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td>Jumlah saldo akhir</td><td class="lk-angka">${rpFmt(akhir.rp)}</td><td class="lk-angka">${egpFmt(akhir.egp)}</td></tr></tfoot></table>

    <p class="lk-cocok ${cocok ? 'ya' : 'tidak'}">${cocok
      ? `Saldo awal + pemasukan − pengeluaran${tukar.rp || tukar.egp ? ' ± penukaran' : ''} = saldo akhir. Hitungan cocok untuk rupiah dan pound.`
      : `Hitungan TIDAK cocok: seharusnya ${rpFmt(hitung.rp)} dan ${egpFmt(hitung.egp)}. Periksa saldo awal akun yang pernah diubah.`}</p>
    ${lain.length ? `<p class="lk-catatan">Tidak termasuk: ${lain.filter((t) => t.status === 'menunggu').length} pengeluaran menunggu persetujuan,
      ${lain.filter((t) => t.status === 'ditolak').length} ditolak, ${lain.filter((t) => t.status === 'batal').length} dibatalkan.</p>` : ''}

    <div class="lk-ttd"><div>Mengetahui,<br>Ketua Umum<div class="lk-ruang"></div><b>${esc(orang('ketua'))}</b></div>
      <div>Kairo, ${esc(tglSurat(nowTanggal()))}<br>Bendahara<div class="lk-ruang"></div><b>${esc(orang('bendahara'))}</b></div></div>
  </div>`);
}

let laporanTerbuka = null;      // { dari, sampai, judul, nama }

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
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Tampilkan Laporan</button></div>`);
  modal({ judul: 'Buat Laporan Kustom', isi, kaki });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    const dari = isi.querySelector('#d1').value, sampai = isi.querySelector('#d2').value;
    if (dari > sampai) return toast('Tanggal awal melewati tanggal akhir.', true);
    laporanTerbuka = { dari, sampai, nama: 'kustom', judul: 'Laporan Keuangan' };
    tutupModal(); gambar();
  };
}

HAL['laporan-kas'] = () => {
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Laporan siap cetak, atau unduh rinciannya</b>
    "Lihat & Cetak" menyusun laporan ringkas — saldo awal, pemasukan dan pengeluaran per kategori, saldo akhir —
    yang dapat dicetak atau disimpan sebagai PDF. "CSV" mengunduh rincian tiap transaksinya untuk dibuka di Excel.
  </div></div></div>`);
  const kartu = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Laporan Keuangan</h3><span class="hitung">(${Store.kasSah().length} transaksi sah)</span></div>
    <div class="mw-panel-isi" data-isi></div></div>`);
  const isi = kartu.querySelector('[data-isi]');
  LAPORAN_KAS.forEach((r) => {
    const n = el(`<div class="bd-laporan">
      <span class="ik" style="--w:${r.w};--wc:${r.wc}">${r.ik}</span>
      <div class="isi"><div class="jd">${esc(r.judul)}</div><div class="kt">${esc(r.ket)}</div></div>
      <span class="pd">${esc(r.periode())}</span>
      ${r.kustom ? `<button class="btn btn-garis btn-kecil" data-lihat>Pilih Rentang ${I.panahKanan}</button>`
        : `<button class="btn btn-kecil" data-lihat>Lihat & Cetak</button><button class="btn btn-garis btn-kecil" data-csv>${I.unduh} CSV</button>`}
    </div>`);
    n.querySelector('[data-lihat]').onclick = () => { if (r.kustom) return dialogLaporanKustom(); laporanTerbuka = r.rentang(); gambar(); };
    n.querySelector('[data-csv]')?.addEventListener('click', () => unduhLaporan(r.rentang()));
    isi.appendChild(n);
  });
  box.appendChild(kartu);

  if (laporanTerbuka) {
    const lembar = lembarLaporanKas(laporanTerbuka);
    const lap = el(`<div class="kartu lk-kartu" style="margin-bottom:20px"><div class="kartu-kepala">
      <h3>${esc(laporanTerbuka.judul || 'Laporan Keuangan')}</h3><span class="hitung">${tgl(laporanTerbuka.dari)} – ${tgl(laporanTerbuka.sampai)}</span>
      <div class="kanan"><button class="btn btn-garis btn-kecil" data-csv>${I.unduh} CSV</button>
        <button class="btn btn-kecil" data-cetak>${I.unduh} Cetak / Simpan PDF</button>
        <button class="btn btn-garis btn-kecil" data-tutup>${I.tutup} Tutup</button></div></div>
      <div class="lk-bingkai"></div></div>`);
    lap.querySelector('.lk-bingkai').appendChild(lembar);
    lap.querySelector('[data-cetak]').onclick = () => cetakKhusus(lembar, '@page { size: A4; margin: 15mm; }',
      `${laporanTerbuka.judul || 'Laporan Keuangan'} ${laporanTerbuka.dari} sd ${laporanTerbuka.sampai}`);
    lap.querySelector('[data-csv]').onclick = () => unduhLaporan(laporanTerbuka);
    lap.querySelector('[data-tutup]').onclick = () => { laporanTerbuka = null; gambar(); };
    box.appendChild(lap);
  }

  /* buku besar */
  const semua = [...Store.kasSah()].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const bb = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Buku Besar</h3><span class="hitung">seluruh transaksi</span>
    <div class="kanan"><input class="cari-org" placeholder="Cari sumber atau kategori…" data-cari></div>
  </div><div data-wadah></div></div>`);
  const wadah = bb.querySelector('[data-wadah]');
  const cari = bb.querySelector('[data-cari]');
  const isiUlang = () => {
    const q = cari.value.trim().toLowerCase();
    const data = semua.filter((t) => !q || `${t.nomor || ''} ${t.sumber} ${t.kategori} ${t.ket}`.toLowerCase().includes(q));
    if (!data.length) { wadah.replaceChildren(el(`<div class="kosong-erp">${I.kotak}<p>Tidak ada transaksi yang cocok</p></div>`)); return; }
    wadah.replaceChildren(el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>No. Bukti</th><th>Tanggal</th><th>Sumber / Jenis</th><th>Kategori</th>
        <th>Akun</th><th>Masuk</th><th>Keluar</th></tr></thead>
      <tbody>${data.map((t, i) => `<tr>
        <td class="kol-no">${i + 1}</td><td class="utuh"><span class="nia">${esc(t.nomor || '—')}</span></td><td class="utuh">${tgl(t.tanggal)}</td>
        <td><b>${esc(t.sumber || t.kategori)}</b>${t.arus ? `<br><span class="lencana l-abu">${t.arus}</span>` : ''}</td>
        <td class="utuh">${esc(t.kategori)}</td>
        <td class="utuh"><span class="lencana l-abu">${esc(namaAkun(t.akunId))}</span>${t.jenis === 'transfer' ? `<br><span class="sub-sel">→ ${esc(namaAkun(t.akunTujuanId))}</span>` : ''}</td>
        <td class="utuh" style="color:#4A7A1E">${t.jenis === 'masuk' ? Store.nominalGabung(t) : t.jenis === 'transfer' ? `<span class="sub-sel">tiba ${esc(uangDua(t.rpTujuan, t.egpTujuan))}</span>` : '—'}</td>
        <td class="utuh" style="color:#B23E37">${t.jenis === 'keluar' ? Store.nominalGabung(t) : t.jenis === 'transfer' ? `<span class="sub-sel">pindah ${esc(uangDua(t.rp, t.egp))}</span>` : '—'}</td>
      </tr>`).join('')}</tbody></table></div>`));
  };
  cari.oninput = isiUlang;
  isiUlang();
  box.appendChild(bb);
  return box;
};
HAL['laporan-kas'].judul = () => ['Laporan Keuangan', 'Unduh rekap berkala dan telusuri buku besar.'];

/* ------------------------------------------------------------
   IURAN ANGGOTA — kas masuk yang bertaut ke orangnya
   ------------------------------------------------------------
   Kartu anggota yang dipakai presensi dipakai juga di sini: Bendahara
   memindainya, nama dan nominal iuran terisi, tinggal disimpan.
   ------------------------------------------------------------ */
const bulanIni = () => Store.hariIni().slice(0, 7);
const LENCANA_IURAN = {
  lunas : '<span class="lencana l-hijau">Lunas</span>',
  kurang: '<span class="lencana l-kuning">Kurang</span>',
  belum : '<span class="lencana l-merah">Belum</span>',
};

/** Form penerimaan iuran. Dipakai dialog (anggota dipilih) dan layar
    pindai (anggota dari kartu). `sesudah` dipanggil setelah tersimpan. */
function formIuran(wadah, { user = null, bulan = bulanIni(), sesudah }) {
  const a = Store.db.aturKas || {};
  const anggota = Store.db.users.filter((u) => u.status === 'aktif')
    .sort((x, y) => String(x.nia || '').localeCompare(String(y.nia || '')));
  const n = el(`<div class="fi">
    ${user ? `<div class="fi-orang"><img src="${user.foto}" alt=""><div><b>${esc(user.nama)}</b>
        <span><span class="nia">${esc(user.nia || '—')}</span> · ${esc(user.angkatan || '')}</span></div></div>`
      : `<div class="grup"><label>Anggota</label><select data-u><option value="">— pilih anggota —</option>
        ${anggota.map((u) => `<option value="${esc(u.id)}">${esc(u.nia || '')} · ${esc(u.nama)}</option>`).join('')}</select></div>`}
    <div class="fi-status" data-status></div>
    <div class="grid-form">
      <div class="grup"><label>Iuran Bulan</label><div style="display:flex;gap:8px">
        <input type="month" data-bulan value="${esc(bulan)}" style="flex:1">
        <select data-jumlah style="width:118px" title="Bayar beberapa bulan sekaligus">${[1, 2, 3, 4, 5, 6, 12].map((n) => `<option value="${n}">${n} bulan</option>`).join('')}</select></div>
        <div class="bantu">Lebih dari satu bulan: nominal di bawah berlaku per bulan, dicatat berurutan mulai bulan ini.</div></div>
      <div class="grup"><label>Tanggal Terima</label><input type="date" data-tanggal value="${Store.hariIni()}"></div>
    </div>
    <div class="grid-form">
      <div class="grup"><label>Rupiah (Rp)</label><input type="number" min="0" step="any" data-rp value="${a.iuranRp || ''}" placeholder="0"></div>
      <div class="grup"><label>Pound (EGP)</label><input type="number" min="0" step="any" data-egp value="${a.iuranEgp || ''}" placeholder="0"></div>
    </div>
    <div class="grid-form">
      <div class="grup"><label>Disimpan di</label><select data-akun>${pilihanAkun().map((o) => `<option value="${esc(o.v)}">${esc(o.l)}</option>`).join('')}</select></div>
      <div class="grup"><label>Keterangan</label><input data-ket placeholder="Iuran bulanan"></div>
    </div>
    <div class="bantu" style="margin-bottom:12px">${a.iuranRp || a.iuranEgp
      ? `Nominal iuran: ${[a.iuranRp ? rpFmt(a.iuranRp) : '', a.iuranEgp ? egpFmt(a.iuranEgp) : ''].filter(Boolean).join(' atau ')} per bulan. Isi mata uang yang benar-benar diterima, kosongkan yang lain.`
      : 'Nominal iuran bulanan belum ditetapkan — atur di halaman Iuran per Anggota.'}</div>
    <button class="btn btn-lime" data-simpan style="width:100%">${I.cek} Simpan Iuran</button></div>`);
  wadah.appendChild(n);
  const q = (s) => n.querySelector(s);
  const siapa = () => user || Store.getUser(q('[data-u]')?.value);

  const segarStatus = () => {
    const u = siapa(), b = q('[data-bulan]').value;
    if (!u || !b) { q('[data-status]').innerHTML = ''; return; }
    const i = Store.iuranAnggota(u.id, b);
    q('[data-status]').innerHTML = `${LENCANA_IURAN[i.status]} <span>${esc(namaBulan(b))}: ${
      i.kali ? `sudah dibayar ${[i.rp ? rpFmt(i.rp) : '', i.egp ? egpFmt(i.egp) : ''].filter(Boolean).join(' + ')} (${i.kali}×)` : 'belum ada pembayaran'}</span>`;
  };
  q('[data-u]')?.addEventListener('change', segarStatus);
  q('[data-bulan]').onchange = segarStatus;
  segarStatus();

  q('[data-simpan]').onclick = () => {
    const u = siapa();
    if (!u) return toast('Pilih anggotanya lebih dulu.', true);
    /* Membayar dua mata uang sekaligus hampir selalu salah isi: nominal
       bawaan mengisi keduanya, dan anggota membayar dengan salah satu. */
    const rp = Number(q('[data-rp]').value || 0), egp = Number(q('[data-egp]').value || 0);
    const kirim = () => {
      let hasil = null;
      if (aman(() => { hasil = Store.terimaIuran(U, { userId: u.id, bulan: q('[data-bulan]').value, rp, egp,
        akunId: q('[data-akun]').value, tanggal: q('[data-tanggal]').value, ket: q('[data-ket]').value.trim(),
        jumlahBulan: q('[data-jumlah]').value }); })) {
        toast(`Iuran ${u.nama} tercatat${hasil.length > 1 ? ` untuk ${hasil.length} bulan` : ''}.`);
        sesudah?.(u, hasil);
      }
    };
    if (rp && egp) konfirmasi('Dua mata uang sekaligus',
      `${u.nama} membayar ${rpFmt(rp)} DAN ${egpFmt(egp)}? Bila hanya salah satunya, batalkan lalu kosongkan yang tidak diterima.`,
      kirim, 'Ya, keduanya diterima', false);
    else kirim();
  };
  return n;
}

/* Kuitansi iuran — bukti untuk si pembayar. Satu kuitansi dapat memuat
   beberapa bulan bila dibayar sekaligus. Dicetak lewat pencetak
   peramban, sama seperti surat dan kartu. */
function kuitansiIuran(daftar) {
  const tx = (Array.isArray(daftar) ? daftar : [daftar]).filter(Boolean)
    .sort((x, y) => String(x.bulanIuran || '').localeCompare(String(y.bulanIuran || '')));
  if (!tx.length) return;
  const u = Store.getUser(tx[0].userId);
  const s = Store.cms.situs;
  const rp = jumlahKas(tx, 'rp'), egp = jumlahKas(tx, 'egp');
  const bulan = tx.map((t) => t.bulanIuran).filter(Boolean).sort();
  const penerima = Store.getUser(tx[0].oleh);
  const ttd = Store.db.tandaTangan.find((t) => /bendahara/i.test(`${t.jabatan} ${t.divisi}`));
  const isi = el(`<div class="kw-bungkus"><div class="kw">
    <div class="kw-kop">${lambang(34)}<div><b>KAJIAN ${esc(String(s.nama).toUpperCase())}</b><span>${esc(s.naungan || s.tagline || '')}</span></div>
      <div class="kw-judul">KUITANSI<small>${esc(tx.map((t) => t.nomor).join(', '))}</small></div></div>
    <table class="kw-isi"><tbody>
      <tr><td>Telah terima dari</td><td>:</td><td><b>${esc(u?.nama || tx[0].sumber)}</b>${u?.nia ? ` <span class="nia">(${esc(u.nia)})</span>` : ''}</td></tr>
      <tr><td>Uang sejumlah</td><td>:</td><td><b>${esc(uangDua(rp, egp))}</b></td></tr>
      <tr><td>Untuk pembayaran</td><td>:</td><td>Iuran anggota ${esc(bulan.length > 1
        ? `${namaBulan(bulan[0])} s.d. ${namaBulan(bulan[bulan.length - 1])} (${bulan.length} bulan)` : namaBulan(bulan[0] || bulanIni()))}</td></tr>
      <tr><td>Disimpan di</td><td>:</td><td>${esc(namaAkun(tx[0].akunId))}</td></tr>
    </tbody></table>
    <div class="kw-kaki"><div class="kw-catatan">Kuitansi ini sah sebagai bukti pembayaran iuran.<br>Simpan untuk arsip Anda.</div>
      <div class="kw-ttd"><div>Kairo, ${esc(tglSurat(tx[0].tanggal))}<br>Bendahara</div>
        ${ttd?.gambar ? `<img src="${esc(ttd.gambar)}" alt="">` : '<div class="kw-ruang"></div>'}
        <b>${esc(ttd ? namaOrang(ttd) : penerima?.nama || '')}</b></div></div>
  </div></div>`);
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Tutup</button><button class="btn btn-lime" data-c>${I.unduh} Cetak / Simpan PDF</button></div>`);
  modal({ judul: 'Kuitansi Iuran', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-c]').onclick = () => {
    document.body.classList.add('cetak-kuitansi');
    const kertas = document.head.appendChild(Object.assign(document.createElement('style'), { textContent: '@page { size: A5 landscape; margin: 10mm; }' }));
    const usai = () => { document.body.classList.remove('cetak-kuitansi'); kertas.remove(); window.removeEventListener('afterprint', usai); };
    window.addEventListener('afterprint', usai);
    window.print();
  };
}

function dialogIuran(user = null, bulan = bulanIni()) {
  const isi = el('<div></div>');
  /* Sesudah tersimpan, kuitansinya langsung dapat dicetak untuk si pembayar. */
  formIuran(isi, { user, bulan, sesudah: (u, hasil) => { gambar(); kuitansiIuran(hasil); } });
  modal({ judul: 'Terima Iuran Anggota', isi, lebar: true });
}

/* Layar pindai Bendahara: kartu dipindai, formnya muncul di sebelah
   kamera, dan setelah disimpan layar siap untuk kartu berikutnya. */
function pindaiIuran() {
  layarPindai('Terima Iuran', `Pindai kartu anggota · iuran ${namaBulan(bulanIni())}`, (sisi) => {
    const tunggu = (pesan, kelas = '') => {
      sisi.innerHTML = `<div class="lp-hasil ${kelas}"><div class="lp-tunggu">${I.qr}<span>${esc(pesan)}</span></div></div>`;
    };
    tunggu('Pindai kartu anggota yang membayar');
    return (kode) => {
      const u = Store.anggotaDariKode(kode);
      if (!u) { tunggu(`Kode "${kode}" tidak dikenali sebagai anggota.`, 'galat'); navigator.vibrate?.([200, 80, 200]); return; }
      navigator.vibrate?.(70);
      sisi.innerHTML = '<div class="lp-form"></div>';
      formIuran(sisi.firstElementChild, { user: u, sesudah: (x, hasil) => tunggu(`Iuran ${x.nama} tercatat (${hasil.map((t) => t.nomor).join(', ')}). Pindai kartu berikutnya.`, 'hadir') });
    };
  });
}

let saringIuran = { bulan: '', angkatan: '', status: '' };
HAL['iuran-anggota'] = () => {
  if (!saringIuran.bulan) saringIuran.bulan = bulanIni();
  const a = Store.db.aturKas || {};
  const bisaAtur = RBAC.can(U, 'keuangan.akun');
  const bisaTerima = RBAC.can(U, 'keuangan.manage');
  const bulan = saringIuran.bulan, tahun = bulan.slice(0, 4);
  const angkatan = [...new Set(Store.db.users.filter((u) => u.status === 'aktif').map((u) => u.angkatan).filter(Boolean))]
    .sort((x, y) => urutAngkatan(x) - urutAngkatan(y));
  if (!angkatan.includes(saringIuran.angkatan)) saringIuran.angkatan = '';

  const semua = Store.db.users.filter((u) => u.status === 'aktif' && (!saringIuran.angkatan || u.angkatan === saringIuran.angkatan))
    .sort((x, y) => String(x.nia || '').localeCompare(String(y.nia || '')))
    .map((u) => ({ u, i: Store.iuranAnggota(u.id, bulan), tg: Store.tunggakanIuran(u.id),
      tahun: Store.kasSah().filter((t) => t.userId === u.id && String(t.bulanIuran || '').startsWith(tahun)) }));
  const data = semua.filter((x) => !saringIuran.status || x.i.status === saringIuran.status);
  const jml = (st) => semua.filter((x) => x.i.status === st).length;

  const box = el('<div></div>');
  const atur = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Nominal Iuran Bulanan</h3><span class="hitung">${a.iuranRp || a.iuranEgp ? 'berlaku untuk seluruh anggota aktif' : 'belum ditetapkan'}</span></div>
    <div class="panel-isi"><div class="fi-atur">
      <div class="grup"><label>Rupiah (Rp)</label><input type="number" min="0" step="any" data-rp value="${a.iuranRp || ''}" placeholder="0" ${bisaAtur ? '' : 'disabled'}></div>
      <div class="grup"><label>Pound (EGP)</label><input type="number" min="0" step="any" data-egp value="${a.iuranEgp || ''}" placeholder="0" ${bisaAtur ? '' : 'disabled'}></div>
      ${bisaAtur ? '<button class="btn btn-kecil" data-simpan>Simpan Nominal</button>' : ''}
    </div><div class="bantu">Anggota dianggap lunas bila rupiah ATAU poundnya mencapai nominal ini — ia membayar dengan salah satu.
      Dikosongkan keduanya berarti pembayaran berapa pun dianggap lunas.</div></div></div>`);
  atur.querySelector('[data-simpan]')?.addEventListener('click', () => {
    if (aman(() => Store.aturIuran(U, { rp: atur.querySelector('[data-rp]').value, egp: atur.querySelector('[data-egp]').value }))) {
      toast('Nominal iuran tersimpan.'); gambar();
    }
  });
  box.appendChild(atur);

  box.appendChild(el(`<div class="grid-stat">
    ${[
      { ik: I.cekBulat,   n: jml('lunas'),  l: 'Sudah lunas',        w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' },
      { ik: I.info,       n: jml('kurang'), l: 'Bayar sebagian',     w: 'rgba(240,149,30,.14)', wc: '#B87310' },
      { ik: I.peringatan, n: jml('belum'),  l: 'Belum membayar',     w: 'rgba(229,83,75,.12)',  wc: '#B23E37' },
      { ik: I.masukKas,   n: [semua.reduce((j, x) => j + x.i.rp, 0), semua.reduce((j, x) => j + x.i.egp, 0)]
          .map((v, k) => (v ? (k ? egpFmt(v) : rpFmt(v)) : '')).filter(Boolean).join(' + ') || '—',
        l: `Terkumpul ${namaBulan(bulan)}`, w: 'rgba(62,127,184,.14)', wc: '#2C6091' },
    ].map((x) => `<div class="stat" style="--w:${x.w};--wc:${x.wc}"><div class="stat-ik">${x.ik}</div>
      <div class="stat-nilai" style="${String(x.n).length > 9 ? 'font-size:19px' : ''}">${x.n}</div><div class="stat-label">${esc(x.l)}</div></div>`).join('')}
  </div>`));

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Iuran per Anggota</h3><span class="hitung">(${data.length} dari ${semua.length} anggota aktif)</span>
    <div class="kanan">
      <input type="month" class="pilih-saring" data-bulan value="${esc(bulan)}">
      <select class="pilih-saring" data-angkatan><option value="">Semua Angkatan</option>
        ${angkatan.map((x) => `<option ${x === saringIuran.angkatan ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>
      <select class="pilih-saring" data-status>
        ${[['', 'Semua status'], ['belum', 'Belum membayar'], ['kurang', 'Bayar sebagian'], ['lunas', 'Sudah lunas']]
          .map(([v, l]) => `<option value="${v}" ${v === saringIuran.status ? 'selected' : ''}>${l}</option>`).join('')}</select>
      <button class="btn btn-garis btn-kecil" data-unduh>${I.unduh} CSV</button>
      ${bisaTerima ? `<button class="btn btn-kecil" data-pindai>${I.qr} Pindai Kartu</button>` : ''}
    </div></div></div>`);
  kartu.querySelector('[data-bulan]').onchange = (e) => { if (e.target.value) { saringIuran.bulan = e.target.value; gambar(); } };
  kartu.querySelector('[data-angkatan]').onchange = (e) => { saringIuran.angkatan = e.target.value; gambar(); };
  kartu.querySelector('[data-status]').onchange = (e) => { saringIuran.status = e.target.value; gambar(); };
  kartu.querySelector('[data-pindai]')?.addEventListener('click', pindaiIuran);
  const uang = (rp, egp) => [rp ? rpFmt(rp) : '', egp ? egpFmt(egp) : ''].filter(Boolean).join(' + ') || '—';
  kartu.querySelector('[data-unduh]').onclick = () => unduhCsv(`iuran-${bulan}.csv`,
    [['Nomor Induk', 'Nama', 'Angkatan', 'Status', 'Rp', 'EGP', `Bulan terbayar ${tahun}`],
      ...data.map((x) => [x.u.nia || '', x.u.nama, x.u.angkatan, x.i.status, x.i.rp, x.i.egp, new Set(x.tahun.map((t) => t.bulanIuran)).size])]
      .concat([[], ['Tunggakan sampai bulan ini'], ['Nomor Induk', 'Nama', 'Angkatan', 'Bulan tertunggak', 'Rp', 'EGP'],
        ...semua.filter((x) => x.tg.bulan.length).map((x) => [x.u.nia || '', x.u.nama, x.u.angkatan, x.tg.bulan.length, x.tg.rp, x.tg.egp])]));

  if (!data.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Tidak ada anggota pada saringan ini</p></div>`));
  } else {
    const t = el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>Anggota</th><th>Angkatan</th><th>Dibayar ${esc(namaBulan(bulan))}</th>
        <th>Status</th><th>Tunggakan s.d. Kini</th>${bisaTerima ? '<th class="kol-aksi lebar">Aksi</th>' : ''}</tr></thead>
      <tbody></tbody></table></div>`);
    const tb = t.querySelector('tbody');
    data.forEach((x, i) => {
      const tr = el(`<tr><td class="kol-no">${i + 1}</td>
        <td>${selAnggota(x.u)}<span class="sub-sel nia" style="margin-left:40px">${esc(x.u.nia || '—')}</span></td>
        <td class="utuh">${esc(x.u.angkatan || '—')}</td>
        <td class="utuh">${uang(x.i.rp, x.i.egp)}</td>
        <td>${LENCANA_IURAN[x.i.status]}</td>
        <td class="utuh">${x.tg.bulan.length ? `<b class="perlu">${x.tg.bulan.length} bulan</b><br><span class="sub-sel">${esc(uangAtau(x.tg.rp, x.tg.egp))}</span>` : '<span style="color:#4A7A1E">—</span>'}</td>
        ${bisaTerima ? `<td class="kol-aksi lebar"><div class="sel-aksi">
          <button class="ikon-aksi" data-terima title="Terima iuran">${I.masukKas}</button>
          ${x.i.kali ? `<button class="ikon-aksi" data-kuitansi title="Kuitansi ${esc(namaBulan(bulan))}">${I.dok}</button>` : ''}</div></td>` : ''}</tr>`);
      /* Yang menunggak ditawari bulan tertunggak terlamanya lebih dulu. */
      tr.querySelector('[data-terima]')?.addEventListener('click', () => dialogIuran(x.u, x.tg.bulan[0] || bulan));
      tr.querySelector('[data-kuitansi]')?.addEventListener('click', () => kuitansiIuran(
        Store.kasSah().filter((t) => t.userId === x.u.id && t.bulanIuran === bulan)));
      tb.appendChild(tr);
    });
    kartu.appendChild(t);
  }
  box.appendChild(kartu);

  /* Rekap per angkatan: siapa yang paling perlu diingatkan. */
  const rekap = angkatan.map((a) => {
    const g = semua.filter((x) => x.u.angkatan === a);
    return { a, n: g.length, lunas: g.filter((x) => x.i.status === 'lunas').length,
      tunggak: g.filter((x) => x.tg.bulan.length).length,
      rp: g.reduce((j, x) => j + x.tg.rp, 0), egp: g.reduce((j, x) => j + x.tg.egp, 0) };
  }).filter((r) => r.n);
  if (rekap.length && !saringIuran.angkatan) {
    box.appendChild(el(`<div class="kartu" style="margin-top:20px"><div class="kartu-kepala"><h3>Rekap per Angkatan</h3>
      <span class="hitung">tunggakan dihitung sejak awal periode sampai ${esc(namaBulan(bulanIni()))}</span></div>
      <div class="tabel-bungkus"><table class="t-org"><thead><tr><th class="kol-no">No.</th><th>Angkatan</th><th>Anggota Aktif</th>
        <th>Lunas ${esc(namaBulan(bulan))}</th><th>Menunggak</th><th>Total Tunggakan</th></tr></thead>
      <tbody>${rekap.map((r, i) => `<tr><td class="kol-no">${i + 1}</td><td><b>${esc(r.a)}</b></td><td class="utuh">${r.n}</td>
        <td class="utuh">${r.lunas} dari ${r.n}</td><td class="utuh">${r.tunggak ? `<b class="perlu">${r.tunggak} orang</b>` : '—'}</td>
        <td class="utuh">${esc(uangAtau(r.rp, r.egp))}</td></tr>`).join('')}</tbody></table></div></div>`));
  }
  return box;
};
HAL['iuran-anggota'].judul = () => ['Iuran per Anggota', 'Siapa sudah membayar, siapa belum, dan nominal iuran bulanan.'];

/* ------------------------------------------------------------
   TUTUP BUKU & REKONSILIASI
   ------------------------------------------------------------
   Tiap bulan lampau ditutup sekali: Bendahara menghitung uang yang
   benar-benar ada di tiap akun, sistem membandingkannya dengan buku,
   dan selisihnya — bila ada — dijelaskan saat itu juga. Sesudah itu
   transaksi bulan tersebut terkunci.
   ------------------------------------------------------------ */
/** Bulan yang punya transaksi, terlama lebih dulu. */
const bulanBuku = () => [...new Set(Store.db.keuangan.map((t) => String(t.tanggal).slice(0, 7)).filter(Boolean))].sort();

function dialogTutupBuku(bulan) {
  const sampai = Store.akhirBulan(bulan);
  const akun = Store.db.akunKas.filter((a) => !a.nonaktif || Store.saldoAkun(a.id, sampai).rp || Store.saldoAkun(a.id, sampai).egp);
  const isi = el(`<div>
    <p style="margin:0 0 14px;font-size:13.4px;color:#44534A">Hitung uang yang benar-benar ada di tiap akun per
      <b>${tgl(sampai)}</b>, lalu isikan di kolom "Uang yang ada". Angkanya sudah diisi menurut buku — ubah hanya yang berbeda.</p>
    <div class="tabel-bungkus"><table class="t-org t-rapat tb-rekon">
      <thead><tr><th>Akun</th><th>Menurut Buku</th><th>Uang yang Ada (Rp)</th><th>Uang yang Ada (EGP)</th><th>Selisih</th></tr></thead>
      <tbody>${akun.map((a) => { const b = Store.saldoAkun(a.id, sampai); return `<tr data-akun="${esc(a.id)}" data-rp="${b.rp}" data-egp="${b.egp}">
        <td><b>${esc(a.nama)}</b></td><td class="utuh">${rpFmt(b.rp)}<br>${egpFmt(b.egp)}</td>
        <td><input type="number" step="any" data-f-rp value="${b.rp}"></td>
        <td><input type="number" step="any" data-f-egp value="${b.egp}"></td>
        <td class="utuh" data-selisih>—</td></tr>`; }).join('')}</tbody></table></div>
    <div class="grup" style="margin:14px 0 0"><label>Catatan</label>
      <textarea data-catatan style="min-height:66px" placeholder="Wajib bila ada selisih: sebab dan tindak lanjutnya"></textarea></div>
    <div class="notis notis-kuning" style="margin:14px 0 0">${I.gembok}<div><b>Sesudah ditutup, ${esc(namaBulan(bulan))} terkunci</b>
      Transaksi bulan itu tidak dapat ditambah, diubah, atau dibatalkan. Membukanya kembali hanya dapat dilakukan Ketua Umum.</div></div>
  </div>`);
  const hitung = () => {
    isi.querySelectorAll('tbody tr').forEach((tr) => {
      const drp = Number(tr.querySelector('[data-f-rp]').value || 0) - Number(tr.dataset.rp);
      const degp = Number(tr.querySelector('[data-f-egp]').value || 0) - Number(tr.dataset.egp);
      const sel = tr.querySelector('[data-selisih]');
      sel.innerHTML = drp || degp ? [drp ? rpFmt(drp) : '', degp ? egpFmt(degp) : ''].filter(Boolean).join('<br>') : 'cocok';
      sel.style.color = drp || degp ? '#B23E37' : '#4A7A1E';
      sel.style.fontWeight = '700';
    });
  };
  isi.querySelectorAll('input').forEach((x) => { x.oninput = hitung; });
  hitung();
  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-y>${I.gembok} Tutup Buku ${esc(namaBulan(bulan))}</button></div>`);
  modal({ judul: `Tutup Buku ${namaBulan(bulan)}`, isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-y]').onclick = () => {
    const fisik = {};
    isi.querySelectorAll('tbody tr').forEach((tr) => {
      fisik[tr.dataset.akun] = { rp: Number(tr.querySelector('[data-f-rp]').value || 0), egp: Number(tr.querySelector('[data-f-egp]').value || 0) };
    });
    if (aman(() => Store.tutupBuku(U, bulan, fisik, isi.querySelector('[data-catatan]').value))) {
      tutupModal(); toast(`Buku ${namaBulan(bulan)} ditutup.`); gambar();
    }
  };
}

/** Tabel bulan-bulan buku kas beserta status tutupnya. */
function tabelTutupBuku(aksi) {
  const kini = bulanIni();
  const bulan = bulanBuku().reverse();
  if (!bulan.length) return el(`<div class="kosong-erp">${I.kotak}<p>Belum ada transaksi</p></div>`);
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Bulan</th><th>Transaksi</th><th>Pemasukan</th><th>Pengeluaran</th><th>Saldo Akhir</th>
      <th>Status</th><th class="kol-aksi lebar">Aksi</th></tr></thead><tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  bulan.forEach((b, i) => {
    const d = kasBulan(b), tutup = Store.penutupan(b);
    const lama = (Store.db.tutupBuku || []).filter((x) => x.bulan === b && x.dibuka).slice(-1)[0];
    const akhir = Store.db.akunKas.reduce((s, a) => { const x = Store.saldoAkun(a.id, Store.akhirBulan(b)); return { rp: s.rp + x.rp, egp: s.egp + x.egp }; }, { rp: 0, egp: 0 });
    const tunggu = Store.db.keuangan.filter((x) => x.status === 'menunggu' && String(x.tanggal).startsWith(b)).length;
    const tr = el(`<tr><td class="kol-no">${i + 1}</td><td class="utuh"><b>${esc(namaBulan(b))}</b></td>
      <td class="utuh">${d.length}${tunggu ? `<br><span class="sub-sel perlu">${tunggu} menunggu persetujuan</span>` : ''}</td>
      <td class="utuh">${uangDua(jumlahKas(d.filter((x) => x.jenis === 'masuk'), 'rp'), jumlahKas(d.filter((x) => x.jenis === 'masuk'), 'egp'))}</td>
      <td class="utuh">${uangDua(jumlahKas(d.filter((x) => x.jenis === 'keluar'), 'rp'), jumlahKas(d.filter((x) => x.jenis === 'keluar'), 'egp'))}</td>
      <td class="utuh">${rpFmt(akhir.rp)}<br>${egpFmt(akhir.egp)}</td>
      <td>${tutup ? `<span class="lencana l-hijau">Ditutup</span><br><span class="sub-sel">${tgl(tutup.ditutup)} · ${esc(namaPendek(tutup.oleh))}${
          tutup.selisih ? ` · <span class="perlu">ada selisih</span>` : ''}</span>${tutup.catatan ? `<br><span class="sub-sel">${esc(tutup.catatan)}</span>` : ''}`
        : b >= kini ? '<span class="lencana l-biru">Berjalan</span>'
          : `<span class="lencana l-kuning">Belum ditutup</span>${lama ? `<br><span class="sub-sel">dibuka kembali: ${esc(lama.dibuka.alasan)}</span>` : ''}`}</td>
      <td class="kol-aksi lebar" data-aksi></td></tr>`);
    aksi(tr.querySelector('[data-aksi]'), b, tutup, kini);
    tb.appendChild(tr);
  });
  return t;
}

HAL['tutup-buku'] = () => {
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Tutup buku sekali tiap bulan</b>
    Setelah bulan berganti, hitung uang yang benar-benar ada, cocokkan dengan buku, lalu tutup. Bulan yang ditutup
    terkunci — angkanya tak dapat lagi bergeser — dan saldo akhirnya menjadi pegangan laporan. Bila ternyata ada yang
    harus diperbaiki, Ketua Umum dapat membukanya kembali.
  </div></div></div>`);
  const kartu = el(`<div class="kartu"><div class="kartu-kepala"><h3>Tutup Buku</h3>
    <span class="hitung">(${(Store.db.tutupBuku || []).filter((x) => !x.dibuka).length} bulan ditutup)</span></div></div>`);
  kartu.appendChild(tabelTutupBuku((sel, b, tutup, kini) => {
    if (tutup || b >= kini) return;
    const tbl = el(`<button class="btn btn-kecil">${I.gembok} Tutup</button>`);
    tbl.onclick = () => dialogTutupBuku(b);
    sel.appendChild(tbl);
  }));
  box.appendChild(kartu);
  return box;
};
HAL['tutup-buku'].judul = () => ['Tutup Buku', 'Cocokkan uang yang ada dengan buku, lalu kunci bulannya.'];

/* ------------------------------------------------------------
   ANGGARAN & REALISASI
   ------------------------------------------------------------ */
/** Baris anggaran lawan realisasi sebuah kategori pengeluaran. */
function barisAnggaran(k) {
  const ag = Store.anggaranKategori(k.id) || { rp: 0, egp: 0 };
  const pakai = Store.kasPeriode().filter((t) => t.jenis === 'keluar' && (t.kategoriId === k.id || (!t.kategoriId && t.kategori === k.nama)));
  const rp = jumlahKas(pakai, 'rp'), egp = jumlahKas(pakai, 'egp');
  /* Persen dihitung pada mata uang yang dianggarkan; bila keduanya, yang terbesar. */
  const persen = Math.max(ag.rp ? rp / ag.rp : 0, ag.egp ? egp / ag.egp : 0);
  const lampau = !!((ag.rp && rp > ag.rp) || (ag.egp && egp > ag.egp));
  return { k, ag, rp, egp, n: pakai.length, persen, lampau, tanpa: !ag.rp && !ag.egp };
}
const anggaranLampau = () => Store.db.kategoriKeuangan.filter((k) => k.jenis === 'keluar').map(barisAnggaran).filter((b) => b.lampau);

HAL.anggaran = () => {
  const p = Store.periodeAktif();
  const bisa = RBAC.can(U, 'keuangan.akun');
  const data = Store.db.kategoriKeuangan.filter((k) => k.jenis === 'keluar' && (!k.nonaktif || Store.anggaranKategori(k.id))).map(barisAnggaran);
  const tot = data.reduce((s, b) => ({ aRp: s.aRp + b.ag.rp, aEgp: s.aEgp + b.ag.egp, rRp: s.rRp + b.rp, rEgp: s.rEgp + b.egp }), { aRp: 0, aEgp: 0, rRp: 0, rEgp: 0 });

  const box = el(`<div>${p.ditetapkan ? '' : `<div class="notis notis-kuning">${I.peringatan}<div><b>Periode kepengurusan belum ditetapkan</b>
    Anggaran ini memakai tahun kalender ${esc(p.mulai.slice(0, 4))}. Tetapkan masa kepengurusan di Kategori & Akun agar anggaran mengikutinya.</div></div>`}
    <div class="grid-stat">
    ${[
      { ik: I.sasaran, n: uangDua(tot.aRp, tot.aEgp), l: 'Total anggaran', w: 'rgba(62,127,184,.14)', wc: '#2C6091' },
      { ik: I.keluarKas, n: uangDua(tot.rRp, tot.rEgp), l: 'Sudah terpakai', w: 'rgba(240,149,30,.14)', wc: '#B87310' },
      { ik: I.peringatan, n: data.filter((b) => b.lampau).length, l: 'Kategori melampaui anggaran', w: 'rgba(229,83,75,.12)', wc: '#B23E37' },
      { ik: I.info, n: data.filter((b) => b.tanpa && b.n).length, l: 'Terpakai tanpa anggaran', w: 'rgba(120,130,125,.14)', wc: '#5E6B64' },
    ].map((x) => `<div class="stat" style="--w:${x.w};--wc:${x.wc}"><div class="stat-ik">${x.ik}</div>
      <div class="stat-nilai" style="${String(x.n).length > 9 ? 'font-size:17px' : ''}">${x.n}</div><div class="stat-label">${esc(x.l)}</div></div>`).join('')}
  </div></div>`);

  const kartu = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Anggaran per Kategori</h3><span class="hitung">periode ${tgl(p.mulai)} – ${tgl(p.selesai)}</span></div>
    <div class="tabel-bungkus"><table class="t-org"><thead><tr><th class="kol-no">No.</th><th>Kategori</th><th>Anggaran</th><th>Terpakai</th>
      <th>Sisa</th><th style="min-width:170px">Pemakaian</th>${bisa ? '<th class="kol-aksi">Aksi</th>' : ''}</tr></thead><tbody></tbody></table></div></div>`);
  const tb = kartu.querySelector('tbody');
  data.forEach((b, i) => {
    const pct = Math.round(b.persen * 100);
    const tr = el(`<tr><td class="kol-no">${i + 1}</td>
      <td><b>${esc(b.k.nama)}</b>${lencanaNonaktif(b.k)}<br><span class="sub-sel">${b.n} transaksi</span></td>
      <td class="utuh">${b.tanpa ? '<span class="sub-sel">belum dianggarkan</span>' : uangDua(b.ag.rp, b.ag.egp)}</td>
      <td class="utuh">${uangDua(b.rp, b.egp)}</td>
      <td class="utuh">${b.tanpa ? '—' : [b.ag.rp ? `<span class="${b.ag.rp - b.rp < 0 ? 'perlu' : ''}">${rpFmt(b.ag.rp - b.rp)}</span>` : '',
        b.ag.egp ? `<span class="${b.ag.egp - b.egp < 0 ? 'perlu' : ''}">${egpFmt(b.ag.egp - b.egp)}</span>` : ''].filter(Boolean).join('<br>')}</td>
      <td>${b.tanpa ? '<span class="sub-sel">—</span>' : `<div style="display:flex;align-items:center;gap:9px">
        <div class="bar-maju${b.lampau ? ' lampau' : ''}" style="flex:1"><span style="width:${Math.min(100, pct)}%"></span></div>
        <b style="font-size:12.2px" class="${b.lampau ? 'perlu' : ''}">${pct}%</b></div>`}</td>
      ${bisa ? `<td class="kol-aksi"><button class="ikon-aksi sunting" title="Tetapkan anggaran">${I.sunting}</button></td>` : ''}</tr>`);
    tr.querySelector('.sunting')?.addEventListener('click', () => {
      const f = el(`<div><p style="margin:0 0 14px;font-size:13.4px;color:#44534A">Anggaran <b>${esc(b.k.nama)}</b> untuk periode ini.
        Sudah terpakai ${esc(uangDua(b.rp, b.egp))}.</p>
        <div class="grid-form">
          <div class="grup"><label>Rupiah (Rp)</label><input type="number" min="0" step="any" data-rp value="${b.ag.rp || ''}" placeholder="0"></div>
          <div class="grup"><label>Pound (EGP)</label><input type="number" min="0" step="any" data-egp value="${b.ag.egp || ''}" placeholder="0"></div>
        </div><div class="bantu">Isi mata uang yang memang dipakai kategori ini. Mengosongkan keduanya berarti tidak dianggarkan.</div></div>`);
      const k = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
        <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
      modal({ judul: 'Tetapkan Anggaran', isi: f, kaki: k });
      k.querySelector('[data-b]').onclick = tutupModal;
      k.querySelector('[data-s]').onclick = () => {
        if (aman(() => Store.simpanAnggaran(U, { kategoriId: b.k.id, rp: f.querySelector('[data-rp]').value, egp: f.querySelector('[data-egp]').value }))) {
          tutupModal(); toast('Anggaran tersimpan.'); gambar();
        }
      };
    });
    tb.appendChild(tr);
  });
  box.appendChild(kartu);

  /* Biaya per program kerja dan per proyek buku — dari transaksi yang ditautkan. */
  const prog = [...Store.db.kaleidoskop].sort(urutProgram).map((k) => ({ k, keluar: kasTaut('programId', k.id, 'keluar'), masuk: kasTaut('programId', k.id, 'masuk') }))
    .filter((x) => x.keluar.length || x.masuk.length);
  box.appendChild(el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala"><h3>Biaya per Program Kerja</h3>
    <span class="hitung">dari transaksi yang ditautkan ke programnya</span></div>
    ${prog.length ? `<div class="tabel-bungkus"><table class="t-org"><thead><tr><th class="kol-no">No.</th><th>Program</th><th>Waktu</th><th>Pemasukan</th><th>Pengeluaran</th><th>Transaksi</th></tr></thead>
      <tbody>${prog.map((x, i) => `<tr><td class="kol-no">${i + 1}</td><td><b>${esc(x.k.kegiatan)}</b></td><td class="utuh">${esc(waktuProgram(x.k))}</td>
        <td class="utuh">${uangDua(jumlahKas(x.masuk, 'rp'), jumlahKas(x.masuk, 'egp'))}</td>
        <td class="utuh">${uangDua(jumlahKas(x.keluar, 'rp'), jumlahKas(x.keluar, 'egp'))}</td>
        <td class="utuh">${x.keluar.length + x.masuk.length}</td></tr>`).join('')}</tbody></table></div>`
      : `<div class="kosong-erp">${I.kotak}<p>Belum ada transaksi yang ditautkan ke program kerja</p>
        <small>Pilih "Program Kerja Terkait" saat mencatat pengeluaran atau pemasukan.</small></div>`}</div>`));

  box.appendChild(el(`<div class="kartu"><div class="kartu-kepala"><h3>Proyek Buku</h3>
    <span class="hitung">rencana biaya dari PJ Buku, realisasi dari buku kas</span></div>
    ${Store.db.buku.length ? `<div class="tabel-bungkus"><table class="t-org"><thead><tr><th class="kol-no">No.</th><th>Judul Buku</th><th>Rencana Biaya</th>
      <th>Sudah Keluar</th><th>Pemasukan</th><th>Sisa Rencana</th></tr></thead>
      <tbody>${Store.db.buku.map((b, i) => { const r = realisasiBuku(b); return `<tr><td class="kol-no">${i + 1}</td>
        <td><b>${esc(b.judul)}</b><br><span class="sub-sel">${esc(TAHAP_BUKU[b.tahap] || b.tahap || '')}</span></td>
        <td class="utuh">${rpFmt(r.rencanaRp)}${r.rencanaEgp ? `<br><span class="sub-sel">setara ${egpFmt(r.rencanaEgp)}</span>` : ''}</td><td class="utuh">${uangDua(r.keluarRp, r.keluarEgp)}</td>
        <td class="utuh">${uangDua(r.masukRp, r.masukEgp)}</td>
        <td class="utuh">${r.rencanaRp ? `<span class="${r.rencanaRp - r.keluarRp < 0 ? 'perlu' : ''}">${rpFmt(r.rencanaRp - r.keluarRp)}</span>${
          r.keluarEgp ? '<br><span class="sub-sel">belum termasuk yang dibayar pound</span>' : ''}` : '—'}</td></tr>`; }).join('')}</tbody></table></div>`
      : `<div class="kosong-erp">${I.kotak}<p>Belum ada proyek buku</p></div>`}</div>`));
  return box;
};
HAL.anggaran.judul = () => ['Anggaran & Realisasi', 'Rencana lawan uang yang benar-benar keluar — per kategori, program, dan buku.'];

/** Rencana biaya sebuah buku (dari PJ Buku) lawan realisasinya di buku kas. */
function realisasiBuku(b) {
  const keluar = kasTaut('bukuId', b.id, 'keluar'), masuk = kasTaut('bukuId', b.id, 'masuk');
  return {
    rencanaRp: (b.modal || []).reduce((s, m) => s + Number(m.rp || 0), 0), rencanaEgp: (b.modal || []).reduce((s, m) => s + Number(m.egp || 0), 0),
    keluarRp: jumlahKas(keluar, 'rp'), keluarEgp: jumlahKas(keluar, 'egp'), masukRp: jumlahKas(masuk, 'rp'), masukEgp: jumlahKas(masuk, 'egp'),
    keluar, masuk,
  };
}

/* ------------------------------------------------------------
   TRANSFER & TUKAR — uang berpindah, bukan bertambah atau berkurang
   ------------------------------------------------------------ */
/* Tunggakan iuran ditagih dalam SALAH SATU mata uang, jadi "atau". */
const uangAtau = (rp, egp) => [Number(rp) ? rpFmt(rp) : '', Number(egp) ? egpFmt(egp) : ''].filter(Boolean).join(' atau ') || '—';
const uangDua = (rp, egp) => [Number(rp) ? rpFmt(rp) : '', Number(egp) ? egpFmt(egp) : ''].filter(Boolean).join(' + ') || '—';

function formTransfer(t) {
  const akun = pilihanAkun();
  const opsi = (pilih) => akun.map((o) => `<option value="${esc(o.v)}" ${o.v === pilih ? 'selected' : ''}>${esc(o.l)}</option>`).join('');
  const tukar = !!t && (Number(t.rp) !== Number(t.rpTujuan) || Number(t.egp) !== Number(t.egpTujuan));
  const isi = el(`<div>
    <div class="grup"><label>Jenis</label><select data-jenis>
      <option value="pindah" ${tukar ? '' : 'selected'}>Pindah antar akun — jumlah dan mata uang tetap</option>
      <option value="tukar" ${tukar ? 'selected' : ''}>Tukar mata uang — yang keluar dan yang tiba berbeda</option></select></div>
    <div class="grid-form">
      <div class="grup"><label>Dari Akun</label><select data-asal>${opsi(t?.akunId)}</select><div class="bantu" data-saldo-asal></div></div>
      <div class="grup"><label>Ke Akun</label><select data-tujuan>${opsi(t?.akunTujuanId || akun[1]?.v)}</select></div>
    </div>
    <div class="tf-kotak"><div class="tf-judul">Yang keluar dari akun asal</div>
      <div class="grid-form">
        <div class="grup"><label>Rupiah (Rp)</label><input type="number" min="0" step="any" data-rp value="${t?.rp || ''}" placeholder="0"></div>
        <div class="grup"><label>Pound (EGP)</label><input type="number" min="0" step="any" data-egp value="${t?.egp || ''}" placeholder="0"></div>
      </div></div>
    <div class="tf-kotak" data-kotak-tujuan><div class="tf-judul">Yang tiba di akun tujuan</div>
      <div class="grid-form">
        <div class="grup"><label>Rupiah (Rp)</label><input type="number" min="0" step="any" data-rpt value="${t?.rpTujuan || ''}" placeholder="0"></div>
        <div class="grup"><label>Pound (EGP)</label><input type="number" min="0" step="any" data-egpt value="${t?.egpTujuan || ''}" placeholder="0"></div>
      </div><div class="bantu" data-kurs></div></div>
    <div class="grid-form">
      <div class="grup"><label>Tanggal</label><input type="date" data-tanggal value="${esc(t?.tanggal || nowTanggal())}"></div>
      <div class="grup"><label>Keterangan</label><input data-ket value="${esc(t?.ket || '')}" placeholder="Setor ke bank, tukar di money changer…"></div>
    </div></div>`);
  const q = (x) => isi.querySelector(x);
  const selaras = () => {
    const pindah = q('[data-jenis]').value === 'pindah';
    q('[data-kotak-tujuan]').hidden = pindah;
    if (pindah) { q('[data-rpt]').value = q('[data-rp]').value; q('[data-egpt]').value = q('[data-egp]').value; }
    const sa = Store.saldoAkun(q('[data-asal]').value);
    q('[data-saldo-asal]').textContent = `Saldo sekarang: ${rpFmt(sa.rp)} · ${egpFmt(sa.egp)}`;
    /* Kurs hanya bermakna bila satu mata uang ditukar dengan yang lain. */
    const rp = Number(q('[data-rp]').value || 0), egp = Number(q('[data-egp]').value || 0);
    const rpt = Number(q('[data-rpt]').value || 0), egpt = Number(q('[data-egpt]').value || 0);
    q('[data-kurs]').textContent = egp && rpt && !rp && !egpt ? `Kurs: 1 EGP = ${rpFmt(Math.round(rpt / egp))}`
      : rp && egpt && !egp && !rpt ? `Kurs: 1 EGP = ${rpFmt(Math.round(rp / egpt))}` : '';
  };
  isi.querySelectorAll('select, input[type=number]').forEach((x) => { x.addEventListener('input', selaras); x.addEventListener('change', selaras); });
  selaras();

  const kaki = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
    <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-lime" data-s>Simpan</button></div>`);
  modal({ judul: t ? `Sunting ${t.nomor || 'Transfer'}` : 'Transfer atau Tukar', isi, kaki, lebar: true });
  kaki.querySelector('[data-b]').onclick = tutupModal;
  kaki.querySelector('[data-s]').onclick = () => {
    selaras();
    if (aman(() => Store.simpanTransfer(U, { id: t?.id, akunId: q('[data-asal]').value, akunTujuanId: q('[data-tujuan]').value,
      rp: q('[data-rp]').value, egp: q('[data-egp]').value, rpTujuan: q('[data-rpt]').value, egpTujuan: q('[data-egpt]').value,
      tanggal: q('[data-tanggal]').value, ket: q('[data-ket]').value.trim() }))) {
      tutupModal(); toast('Transfer tercatat.'); gambar();
    }
  };
}

HAL['transfer-kas'] = () => {
  const data = Store.db.keuangan.filter((t) => t.jenis === 'transfer').sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Transfer bukan pemasukan dan bukan pengeluaran</b>
    Memindahkan uang dari kas tunai ke bank, atau menukar pound menjadi rupiah, tidak membuat organisasi bertambah
    kaya atau miskin. Karena itu ia dicatat di sini — saldo tiap akun ikut berubah, tetapi total pemasukan dan
    pengeluaran di laporan tidak.
  </div></div></div>`);
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Transfer & Tukar</h3><span class="hitung">(${data.length} Data)</span>
    <div class="kanan"><button class="btn btn-kecil" data-tambah>${I.tambah} Transfer / Tukar</button></div></div></div>`);
  kartu.querySelector('[data-tambah]').onclick = () => formTransfer(null);
  if (!data.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>Belum ada transfer</p>
      <small>Catat di sini saat menyetor kas ke bank atau menukar mata uang.</small></div>`));
  } else {
    const t = el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>No. Bukti</th><th>Tanggal</th><th>Dari</th><th>Ke</th><th>Keluar</th><th>Tiba</th>
        <th>Keterangan</th><th class="kol-aksi">Aksi</th></tr></thead><tbody></tbody></table></div>`);
    const tb = t.querySelector('tbody');
    data.forEach((x, i) => {
      const tr = el(`<tr class="${x.status === 'batal' ? 'kas-coret' : ''}"><td class="kol-no">${i + 1}</td>
        <td class="utuh"><span class="nia">${esc(x.nomor || '—')}</span></td><td class="utuh">${tgl(x.tanggal)}</td>
        <td>${esc(namaAkun(x.akunId))}</td><td>${esc(namaAkun(x.akunTujuanId))}</td>
        <td class="utuh">${uangDua(x.rp, x.egp)}</td><td class="utuh">${uangDua(x.rpTujuan, x.egpTujuan)}</td>
        <td>${esc(x.ket || '—')}${lencanaKas(x)}</td>
        <td class="kol-aksi"><div class="sel-aksi">
          <button class="ikon-aksi sunting" title="Sunting" ${x.status === 'batal' ? 'disabled' : ''}>${I.sunting}</button>
          <button class="ikon-aksi hapus" title="Batalkan transfer" ${x.status === 'batal' ? 'disabled' : ''}>${I.hapus}</button></div></td></tr>`);
      tr.querySelector('.sunting').onclick = () => formTransfer(x);
      tr.querySelector('.hapus').onclick = () => batalkanKas(x);
      tb.appendChild(tr);
    });
    kartu.appendChild(t);
  }
  box.appendChild(kartu);
  return box;
};
HAL['transfer-kas'].judul = () => ['Transfer & Tukar', 'Pemindahan antar akun dan penukaran mata uang.'];

/* ------------------------------------------------------------
   PERSETUJUAN PENGELUARAN — milik Ketua Umum
   ------------------------------------------------------------
   Bendahara mencatat; Ketua menyetujui. Pengeluaran yang menunggu
   belum mengurangi saldo. Batasnya diatur di halaman ini juga: nol
   berarti setiap pengeluaran perlu disetujui.
   ------------------------------------------------------------ */
HAL['persetujuan-kas'] = () => {
  const a = Store.db.aturKas || {};
  const semua = Store.db.keuangan.filter((t) => t.jenis === 'keluar');
  const tunggu = semua.filter((t) => t.status === 'menunggu').sort((x, y) => String(x.dibuat || x.tanggal).localeCompare(String(y.dibuat || y.tanggal)));
  const putus = semua.filter((t) => t.persetujuan).sort((x, y) => String(y.persetujuan.ts).localeCompare(String(x.persetujuan.ts))).slice(0, 15);

  const box = el(`<div><div class="notis notis-hijau">${I.perisai}<div>
    <b>Pengeluaran sah setelah Anda menyetujuinya</b>
    Yang menunggu di bawah ini belum mengurangi saldo dan belum masuk laporan. Menolak mengembalikannya kepada
    Bendahara beserta alasannya. Setiap keputusan tercatat pada log aktivitas.
  </div></div></div>`);

  const batas = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Batas Persetujuan</h3><span class="hitung">${Number(a.batasSetujuRp) || Number(a.batasSetujuEgp)
      ? 'pengeluaran di bawah batas langsung sah' : 'semua pengeluaran perlu disetujui'}</span></div>
    <div class="panel-isi"><div class="fi-atur">
      <div class="grup"><label>Mulai dari Rupiah (Rp)</label><input type="number" min="0" step="any" data-rp value="${a.batasSetujuRp || ''}" placeholder="0"></div>
      <div class="grup"><label>Mulai dari Pound (EGP)</label><input type="number" min="0" step="any" data-egp value="${a.batasSetujuEgp || ''}" placeholder="0"></div>
      <button class="btn btn-kecil" data-simpan>Simpan Batas</button>
    </div><div class="bantu">Pengeluaran senilai batas ini atau lebih menunggu persetujuan Anda. Dikosongkan berarti
      setiap pengeluaran, sekecil apa pun, perlu disetujui.</div></div></div>`);
  batas.querySelector('[data-simpan]').onclick = () => {
    if (aman(() => Store.aturBatasSetuju(U, { rp: batas.querySelector('[data-rp]').value, egp: batas.querySelector('[data-egp]').value }))) {
      toast('Batas persetujuan tersimpan.'); gambar();
    }
  };
  box.appendChild(batas);

  const kartu = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Menunggu Keputusan</h3><span class="hitung">(${tunggu.length} pengeluaran)</span></div></div>`);
  if (!tunggu.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.cekBulat}<p>Tidak ada pengeluaran yang menunggu</p></div>`));
  } else {
    const t = el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>No. Bukti</th><th>Tanggal</th><th>Uraian</th><th>Nominal</th><th>Dari Akun</th>
        <th>Dicatat</th><th>Bukti</th><th>Keputusan</th></tr></thead><tbody></tbody></table></div>`);
    const tb = t.querySelector('tbody');
    tunggu.forEach((x, i) => {
      const sisa = Store.saldoAkun(x.akunId);
      const tr = el(`<tr><td class="kol-no">${i + 1}</td>
        <td class="utuh"><span class="nia">${esc(x.nomor || '—')}</span></td><td class="utuh">${tgl(x.tanggal)}</td>
        <td><b>${esc(x.sumber || x.kategori)}</b><br><span class="sub-sel">${esc([x.kategori, x.ket].filter(Boolean).join(' · '))}</span></td>
        <td class="utuh"><b>${esc(Store.nominalGabung(x))}</b></td>
        <td>${esc(namaAkun(x.akunId))}<br><span class="sub-sel">saldo ${rpFmt(sisa.rp)} · ${egpFmt(sisa.egp)}</span></td>
        <td>${esc(namaPendek(x.oleh))}</td><td data-bukti></td>
        <td class="utuh"><button class="btn btn-lime btn-kecil" data-setuju>${I.cek} Setujui</button>
          <button class="btn btn-merah btn-kecil" data-tolak>Tolak</button></td></tr>`);
      selGambar('bukti', 'sumber', (y) => y.nomor || '')(tr.querySelector('[data-bukti]'), x);
      tr.querySelector('[data-setuju]').onclick = () => konfirmasi('Setujui pengeluaran',
        `${x.sumber || x.kategori} sebesar ${Store.nominalGabung(x)} akan sah dan mengurangi saldo ${namaAkun(x.akunId)}.`,
        () => { if (aman(() => Store.putuskanKas(U, x.id, true, ''))) toast('Pengeluaran disetujui.'); gambar(); }, 'Setujui', false);
      tr.querySelector('[data-tolak]').onclick = () => {
        const f = el(`<div class="grup" style="margin:0"><label>Alasan penolakan</label>
          <textarea data-alasan style="min-height:76px" placeholder="Disampaikan kepada Bendahara"></textarea></div>`);
        const k = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
          <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-merah" data-y>Tolak Pengeluaran</button></div>`);
        modal({ judul: `Tolak ${x.nomor || 'pengeluaran'}`, isi: f, kaki: k });
        k.querySelector('[data-b]').onclick = tutupModal;
        k.querySelector('[data-y]').onclick = () => {
          if (aman(() => Store.putuskanKas(U, x.id, false, f.querySelector('[data-alasan]').value))) { tutupModal(); toast('Pengeluaran ditolak.'); gambar(); }
        };
      };
      tb.appendChild(tr);
    });
    kartu.appendChild(t);
  }
  box.appendChild(kartu);

  /* Buku yang ditutup Bendahara. Membukanya kembali hanya dari sini. */
  const kb = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala"><h3>Buku Kas per Bulan</h3>
    <span class="hitung">membuka kembali buku yang ditutup adalah wewenang Anda</span></div></div>`);
  kb.appendChild(tabelTutupBuku((sel, b, tutup) => {
    if (!tutup) return;
    const tbl = el('<button class="btn btn-garis btn-kecil">Buka Kembali</button>');
    tbl.onclick = () => {
      const f = el(`<div class="grup" style="margin:0"><label>Alasan membuka kembali</label>
        <textarea data-alasan style="min-height:76px" placeholder="Apa yang perlu diperbaiki pada bulan ini"></textarea>
        <div class="bantu">Transaksi ${esc(namaBulan(b))} kembali dapat diubah sampai Bendahara menutupnya lagi.</div></div>`);
      const k = el(`<div style="display:flex;gap:9px;justify-content:flex-end">
        <button class="btn btn-garis" data-b>Batal</button><button class="btn btn-merah" data-y>Buka Kembali</button></div>`);
      modal({ judul: `Buka kembali buku ${namaBulan(b)}`, isi: f, kaki: k });
      k.querySelector('[data-b]').onclick = tutupModal;
      k.querySelector('[data-y]').onclick = () => {
        if (aman(() => Store.bukaBuku(U, b, f.querySelector('[data-alasan]').value))) { tutupModal(); toast(`Buku ${namaBulan(b)} dibuka kembali.`); gambar(); }
      };
    };
    sel.appendChild(tbl);
  }));
  box.appendChild(kb);

  if (putus.length) {
    const r = el(`<div class="kartu"><div class="kartu-kepala"><h3>Keputusan Terakhir</h3><span class="hitung">(${putus.length} terbaru)</span></div>
      <div class="tabel-bungkus"><table class="t-org"><thead><tr><th class="kol-no">No.</th><th>No. Bukti</th><th>Uraian</th><th>Nominal</th>
        <th>Keputusan</th><th>Waktu</th></tr></thead><tbody>${putus.map((x, i) => `<tr><td class="kol-no">${i + 1}</td>
        <td class="utuh"><span class="nia">${esc(x.nomor || '—')}</span></td><td>${esc(x.sumber || x.kategori)}</td>
        <td class="utuh">${esc(Store.nominalGabung(x))}</td>
        <td><span class="lencana ${x.persetujuan.setuju ? 'l-hijau' : 'l-merah'}">${x.persetujuan.setuju ? 'Disetujui' : 'Ditolak'}</span>${
          x.persetujuan.alasan ? `<br><span class="sub-sel">${esc(x.persetujuan.alasan)}</span>` : ''}</td>
        <td class="utuh">${tglJam(x.persetujuan.ts)}</td></tr>`).join('')}</tbody></table></div></div>`);
    box.appendChild(r);
  }
  return box;
};
HAL['persetujuan-kas'].judul = () => ['Persetujuan Pengeluaran', 'Pengeluaran yang menunggu keputusan Anda.'];

HAL['kategori-akun'] = () => {
  const box = el(`<div><div class="notis notis-info">${I.info}<div>
    <b>Akun adalah tempat uang disimpan, bukan akun pengguna</b>
    Satu akun memegang rupiah dan pound sekaligus, sehingga satu setoran berisi keduanya
    tidak perlu dipecah menjadi dua catatan. Saldonya dapat dicocokkan dengan uang yang nyata.
  </div></div></div>`);
  const p = (Store.db.aturKas || {}).periode || {};
  const periode = el(`<div class="kartu" style="margin-bottom:20px"><div class="kartu-kepala">
    <h3>Periode Kepengurusan</h3><span class="hitung">${p.mulai ? `${tgl(p.mulai)} – ${tgl(p.selesai)} · kode ${esc(Store.kodePeriode(p.mulai, Store.db.aturKas))}` : 'belum ditetapkan — memakai tahun kalender'}</span></div>
    <div class="panel-isi"><div class="fi-atur">
      <div class="grup"><label>Mulai</label><input type="date" data-mulai value="${esc(p.mulai || '')}"></div>
      <div class="grup"><label>Selesai</label><input type="date" data-selesai value="${esc(p.selesai || '')}"></div>
      <button class="btn btn-kecil" data-simpan>Simpan Periode</button>
    </div><div class="bantu">Nomor bukti, anggaran, dan laporan tahunan mengikuti masa kepengurusan ini — bukan tahun kalender.
      Nomor bukti yang sudah terbit tidak berubah.</div></div></div>`);
  periode.querySelector('[data-simpan]').onclick = () => {
    if (aman(() => Store.aturPeriode(U, { mulai: periode.querySelector('[data-mulai]').value, selesai: periode.querySelector('[data-selesai]').value }))) {
      toast('Periode kepengurusan tersimpan.'); gambar();
    }
  };
  box.appendChild(periode);
  box.appendChild(halamanOrg('akun-kas'));
  box.appendChild(el('<div style="height:20px"></div>'));
  box.appendChild(halamanOrg('kategori-kas'));
  return box;
};
HAL['kategori-akun'].judul = () => ['Kategori & Akun', 'Penggolongan transaksi dan tempat penyimpanan uang.'];

/* ============================================================
   LAPORAN & RINGKASAN
   ============================================================ */
/* Laporan Ketua merangkum SELURUH organisasi, bukan hanya program
   kerja: keanggotaan, kajian, karya tulis, keuangan, pencapaian, dan
   evaluasi. Setiap angka dihitung dari koleksi yang sama dengan ruang
   kerja PJ-nya — tak ada angka yang diketik di sini — sehingga laporan
   ini tak pernah berselisih dengan halaman asalnya.

   Halamannya sekaligus naskah cetak: tombol Cetak memanggil pencetak
   peramban, dan lembar gaya cetak menyingkirkan sidebar serta tombol. */
HAL.laporan = () => {
  const d = Store.db;
  const keg = d.kaleidoskop;
  const hitung = (st) => keg.filter((k) => k.status === st).length;
  const rampung = hitung('selesai');
  const persen = keg.length ? Math.round((rampung / keg.length) * 100) : 0;
  const bisaKas = RBAC.can(U, 'keuangan.report');

  const kajianSelesai = d.kajian.filter((k) => statusKajian(k) === 'selesai');
  const rataHadir = (daftar) => (daftar.length
    ? Math.round(daftar.reduce((j, k) => j + hadirKajian(k).persen, 0) / daftar.length) : 0);
  const anggotaAktif = d.users.filter((u) => u.status === 'aktif');
  const terbit = d.artikel.filter((a) => a.status === 'terbit');
  const saldo = bisaKas ? saldoTotal() : null;

  const box = el('<div class="laporan"></div>');
  const bagian = (judul, ket, isi) => {
    const p = el(`<div class="panel"><div class="panel-kepala"><h3>${esc(judul)}</h3>
      <span class="ket">${ket}</span></div></div>`);
    p.appendChild(typeof isi === 'string' ? el(isi) : isi);
    box.appendChild(p);
    return p;
  };
  const tabel = (kepala, baris, kosong) => `<div class="tabel-bungkus"><table>
    <thead><tr>${kepala.map((h) => `<th${h === 'No' ? ' class="kol-no"' : ''}>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${baris.length ? baris.map((r) => `<tr>${r.map((c, i) => `<td${kepala[i] === 'No' ? ' class="kol-no"' : ''}>${c}</td>`).join('')}</tr>`).join('')
      : `<tr><td colspan="${kepala.length}" style="color:var(--e-abu)">${esc(kosong)}</td></tr>`}</tbody></table></div>`;

  /* --- kepala laporan --- */
  box.appendChild(el(`<div class="panel lap-kepala"><div class="panel-kepala">
    <div><h3>Laporan Kepengurusan ${esc(Store.cms.situs.nama)}</h3>
      <span class="ket">Keadaan per ${esc(tglRingkas())} · disusun otomatis dari data ERP</span></div>
    <div class="kanan"><button class="btn btn-garis btn-kecil" data-cetak>${I.unduh} Cetak Laporan</button></div>
  </div></div>`));
  box.querySelector('[data-cetak]').onclick = () => window.print();

  /* --- ringkasan --- */
  box.appendChild(el(`<div class="grid-stat">
    ${[
      { ik: I.grup,     n: anggotaAktif.length,          l: 'Anggota aktif',             w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' },
      { ik: I.orang,    n: d.pengurus.length,            l: 'Pengurus',                  w: 'rgba(62,127,184,.14)', wc: '#2C6091' },
      { ik: I.agenda,   n: `${rampung}/${keg.length}`,   l: 'Program kerja terlaksana',  w: 'rgba(240,149,30,.14)', wc: '#B87310' },
      { ik: I.kalender, n: kajianSelesai.length,         l: 'Kajian terlaksana',         w: 'rgba(62,127,184,.14)', wc: '#2C6091' },
      { ik: I.cekBulat, n: kajianSelesai.length ? `${rataHadir(kajianSelesai)}%` : '—', l: 'Rata-rata kehadiran kajian', w: 'rgba(47,169,140,.14)', wc: '#1F7A64' },
      { ik: I.dok,      n: terbit.length,                l: 'Artikel terbit',            w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' },
      { ik: I.piala,    n: d.pencapaian.length,          l: 'Pencapaian tercatat',       w: 'rgba(199,122,43,.14)', wc: '#96591C' },
      { ik: I.obrolan,  n: d.evaluasi.filter((e) => e.status !== 'tuntas').length, l: 'Evaluasi belum tuntas', w: 'rgba(229,83,75,.12)', wc: '#B23E37' },
    ].map((x) => `<div class="stat" style="--w:${x.w};--wc:${x.wc}">
      <div class="stat-ik">${x.ik}</div>
      <div class="stat-nilai">${x.n}</div>
      <div class="stat-label">${esc(x.l)}</div></div>`).join('')}
  </div>`));

  /* --- 1. program kerja --- */
  const sisa = keg.filter((k) => k.status !== 'selesai').sort(urutProgram);
  const telat = sisa.filter(terlambatProgram).length;
  const pk = bagian('1. Program Kerja', `${persen}% dari ${keg.length} kegiatan terlaksana${telat ? ` · ${telat} melewati tenggat` : ''}`,
    `<div class="panel-isi">
      <div class="bar-maju" style="margin-bottom:16px"><span style="width:${persen}%"></span></div>
      <div style="display:flex;gap:26px;flex-wrap:wrap">
        ${Object.entries(STATUS_KEG).map(([k, x]) => `<div>
          <div style="font-size:22px;font-weight:800;line-height:1.2">${hitung(k)}</div>
          <span class="lencana ${x.c}">${x.l}</span></div>`).join('')}
        ${telat ? `<div><div style="font-size:22px;font-weight:800;line-height:1.2">${telat}</div>
          <span class="lencana l-merah">Terlambat</span></div>` : ''}
      </div></div>`);
  if (sisa.length) {
    pk.appendChild(el(`<div class="lap-sub">Program belum rampung</div>`));
    pk.appendChild(el(tabel(['No', 'Kegiatan / Program', 'Waktu', 'Penanggung Jawab', 'Status'],
      sisa.map((k, i) => [i + 1, esc(k.kegiatan), esc(waktuProgram(k)), esc(k.pjId ? namaPendek(k.pjId) : '—'), lencanaProgram(k)]), '')));
  }

  /* --- 2. kajian --- */
  const perAngkatan = angkatanTersedia().map((a) => {
    const semua = d.kajian.filter((k) => k.angkatan === a);
    const sls = semua.filter((k) => statusKajian(k) === 'selesai');
    return [esc(a), semua.length, sls.length, sls.length ? `${rataHadir(sls)}%` : '—',
      `${sls.filter((k) => k.notulensi).length}/${sls.length}`];
  });
  bagian('2. Kajian', `${d.kajian.length} kajian terjadwal · ${kajianSelesai.length} terlaksana`,
    tabel(['Angkatan', 'Terjadwal', 'Terlaksana', 'Rata-rata Kehadiran', 'Bernotulen'], perAngkatan, 'Belum ada jadwal kajian.'));

  /* --- 3. karya tulis --- */
  const kategori = [...new Set(d.artikel.map((a) => a.kategori).filter(Boolean))].sort();
  const kt = bagian('3. Karya Tulis Ilmiah', `${d.artikel.length} naskah · ${terbit.length} terbit`,
    `<div class="panel-isi"><div style="display:flex;gap:26px;flex-wrap:wrap">
      ${Object.entries(STATUS_ART).map(([k, x]) => `<div>
        <div style="font-size:22px;font-weight:800;line-height:1.2">${d.artikel.filter((a) => a.status === k).length}</div>
        <span class="lencana ${x.c}">${x.l}</span></div>`).join('')}
    </div></div>`);
  kt.appendChild(el(tabel(['Kategori', 'Terbit', 'Total Naskah', 'Dibaca'],
    kategori.map((k) => { const x = d.artikel.filter((a) => a.kategori === k);
      return [esc(k), x.filter((a) => a.status === 'terbit').length, x.length,
        `${x.reduce((j, a) => j + Number(a.dilihat || 0), 0).toLocaleString('id-ID')}×`]; }), 'Belum ada naskah.')));

  /* --- 4. keuangan --- */
  if (bisaKas) {
    const kas = Store.kasSah();
    const masuk = kas.filter((t) => t.jenis === 'masuk'), keluar = kas.filter((t) => t.jenis === 'keluar');
    const bulan = [...new Set(kas.map((t) => t.tanggal.slice(0, 7)))].sort().reverse().slice(0, 6);
    const ku = bagian('4. Keuangan', `${kas.length} transaksi · rupiah dan pound dicatat terpisah`,
      `<div class="panel-isi lap-saldo">
        <div><span>Saldo Rupiah</span><b>${rpFmt(saldo.rp)}</b>
          <small>Masuk ${rpFmt(jumlahKas(masuk, 'rp'))} · Keluar ${rpFmt(jumlahKas(keluar, 'rp'))}</small></div>
        <div><span>Saldo Pound Mesir</span><b>${egpFmt(saldo.egp)}</b>
          <small>Masuk ${egpFmt(jumlahKas(masuk, 'egp'))} · Keluar ${egpFmt(jumlahKas(keluar, 'egp'))}</small></div>
      </div>`);
    ku.appendChild(el(`<div class="lap-sub">Arus kas ${bulan.length} bulan terakhir</div>`));
    ku.appendChild(el(tabel(['Bulan', 'Masuk (Rp)', 'Keluar (Rp)', 'Selisih (Rp)', 'Masuk (EGP)', 'Keluar (EGP)'],
      bulan.map((b) => { const x = kasBulan(b);
        const mr = jumlahKas(x.filter((t) => t.jenis === 'masuk'), 'rp'), kr = jumlahKas(x.filter((t) => t.jenis === 'keluar'), 'rp');
        return [`<b>${esc(namaBulan(b))}</b>`, rpFmt(mr), rpFmt(kr), rpFmt(mr - kr),
          egpFmt(jumlahKas(x.filter((t) => t.jenis === 'masuk'), 'egp')), egpFmt(jumlahKas(x.filter((t) => t.jenis === 'keluar'), 'egp'))]
          .map((sel) => `<span class="angka">${sel}</span>`); }),
      'Belum ada transaksi.')));
  }

  /* --- 5. keanggotaan --- */
  const angk = [...new Set(d.users.map((u) => u.angkatan).filter(Boolean))].sort((x, y) => urutAngkatan(x) - urutAngkatan(y));
  const jml = (a, st) => d.users.filter((u) => u.angkatan === a && u.status === st).length;
  bagian(`${bisaKas ? 5 : 4}. Keanggotaan`, `${d.users.length} orang terdaftar · ${anggotaAktif.length} aktif`,
    tabel(['Angkatan', 'Aktif', 'Alumni', 'Nonaktif', 'Jumlah'],
      angk.map((a) => [esc(a), jml(a, 'aktif'), jml(a, 'alumni'), jml(a, 'nonaktif'), d.users.filter((u) => u.angkatan === a).length]),
      'Belum ada anggota.'));

  /* --- 6. pencapaian --- */
  bagian(`${bisaKas ? 6 : 5}. Pencapaian`, `${d.pencapaian.length} capaian tercatat`,
    tabel(['No', 'Pencapaian', 'Tanggal'],
      [...d.pencapaian].sort((x, y) => (y.tanggal || '').localeCompare(x.tanggal || ''))
        .map((x, i) => [i + 1, esc(x.pencapaian), tgl(x.tanggal)]), 'Belum ada pencapaian yang dicatat.'));

  /* --- 7. evaluasi --- */
  bagian(`${bisaKas ? 7 : 6}. Evaluasi & Tindak Lanjut`,
    `${d.evaluasi.length} catatan · ${d.evaluasi.filter((e) => e.status !== 'tuntas').length} belum tuntas${
      d.evaluasi.some(lewatEval) ? ` · ${d.evaluasi.filter(lewatEval).length} lewat tenggat` : ''}`,
    tabel(['No', 'Evaluasi', 'Masukan / Solusi', 'Penanggung Jawab', 'Tenggat', 'Status'],
      [...d.evaluasi].sort(urutEval).map((e, i) => [i + 1,
        `${esc(e.evaluasi)}${programEval(e) ? `<br><span class="sub-sel">${esc(programEval(e).kegiatan)}</span>` : ''}`,
        esc(e.masukan), esc(e.pjId ? namaPendek(e.pjId) : '—'), e.tenggat ? tgl(e.tenggat) : '—', lencanaEval(e)]),
      'Belum ada catatan evaluasi.'));

  return box;
};
HAL.laporan.judul = () => ['Laporan & Ringkasan', 'Rekapitulasi seluruh organisasi: program, kajian, karya tulis, keuangan, dan evaluasi.'];

/* ============================================================
   PENYUSUN SURAT — surat dirangkai dari blok
   ------------------------------------------------------------
   Sebuah surat adalah larik blok: kop, nomor & perihal, tanggal,
   tujuan, isi, tanda tangan. Tiap blok dapat disisipkan di mana pun,
   disunting, diurutkan, dan dibuang — dan lembar di sebelahnya
   menggambar ulang seketika.

   Bloknya disimpan PADA arsip surat itu sendiri (`surat.blok`), jadi
   setiap surat yang disusun adalah surat yang sudah bernomor dan sudah
   tercatat; tak ada surat yang hidup di luar arsip. Templat hanyalah
   susunan blok yang disalin saat surat dibuat.

   Unduhan PDF memakai pencetak peramban: lembarnya dicetak apa adanya
   pada kertas A4, dan "Simpan sebagai PDF" menghasilkan berkasnya.
   Tak ada pustaka PDF dan tak ada yang berubah di server.

   Tata letak lembar di sini masih sementara; ia akan disesuaikan
   begitu templat resmi organisasi tersedia.
   ============================================================ */
const tglSurat = (t) => (t ? new Date(`${t}T00:00`).toLocaleDateString('id-ID',
  { day: 'numeric', month: 'long', year: 'numeric' }) : '');
const barisHtml = (teks) => esc(teks).replace(/\n/g, '<br>');

/** Ganti {{nomor}}, {{perihal}}, {{tujuan}}, {{tanggal}} dengan isi
    suratnya. Pada templat belum ada surat, jadi penandanya dibiarkan. */
function isiPengganti(teks, surat) {
  return String(teks || '').replace(/\{\{\s*(nomor|perihal|tujuan|tanggal)\s*\}\}/g, (utuh, k) => {
    if (!surat) return utuh;
    return (k === 'tanggal' ? tglSurat(surat.tanggal) : surat[k]) || utuh;
  });
}

const RATA_TEKS = [{ v: 'kiri', l: 'Rata kiri' }, { v: 'rata', l: 'Rata kiri-kanan' },
  { v: 'tengah', l: 'Tengah' }, { v: 'kanan', l: 'Rata kanan' }];

/* Tiap jenis blok: namanya, isi awalnya, kolom penyuntingnya, dan cara
   menggambarnya di lembar. Menambah jenis blok cukup satu entri di sini. */
const BLOK_SURAT = {
  kop: {
    l: 'Kop Surat',
    baru: () => ({ logo: '', nama: `KAJIAN ${Store.cms.situs.nama}`.toUpperCase(),
      baris: `${Store.cms.situs.naungan || ''}\n${[Store.cms.situs.email, Store.cms.situs.telepon].filter(Boolean).join(' · ')}` }),
    bidang: [
      { k: 'logo', l: 'Logo', jenis: 'gambar', bantu: 'Dikosongkan berarti memakai logo situs.' },
      { k: 'nama', l: 'Nama Organisasi' },
      { k: 'baris', l: 'Alamat & Kontak', jenis: 'area' },
    ],
    gambar: (b) => `<div class="ls-kop"><img src="${esc(b.logo || Store.cms.situs.logo)}" alt="">
      <div><div class="ls-kop-nama">${esc(b.nama)}</div><div class="ls-kop-baris">${barisHtml(b.baris)}</div></div></div>`,
  },
  meta: {
    l: 'Nomor & Perihal',
    baru: () => ({ lampiran: '-' }),
    bidang: [{ k: 'lampiran', l: 'Lampiran', bantu: 'Nomor dan perihal diambil dari arsip surat.' }],
    gambar: (b, s) => `<table class="ls-meta"><tbody>
      <tr><td>Nomor</td><td>:</td><td>${esc(s ? s.nomor : '{{nomor}}')}</td></tr>
      <tr><td>Lampiran</td><td>:</td><td>${esc(b.lampiran || '-')}</td></tr>
      <tr><td>Perihal</td><td>:</td><td><b>${esc(s ? s.perihal : '{{perihal}}')}</b></td></tr></tbody></table>`,
  },
  tanggal: {
    l: 'Tempat & Tanggal',
    baru: () => ({ tempat: 'Kairo' }),
    bidang: [{ k: 'tempat', l: 'Tempat', bantu: 'Tanggalnya diambil dari arsip surat.' }],
    gambar: (b, s) => `<p class="ls-kanan">${esc(b.tempat)}, ${esc(s ? tglSurat(s.tanggal) : '{{tanggal}}')}</p>`,
  },
  tujuan: {
    l: 'Tujuan Surat',
    baru: () => ({ teks: 'Kepada Yth.\n{{tujuan}}\ndi Tempat' }),
    bidang: [{ k: 'teks', l: 'Tujuan', jenis: 'area' }],
    gambar: (b, s) => `<p class="ls-tujuan">${barisHtml(isiPengganti(b.teks, s))}</p>`,
  },
  teks: {
    l: 'Isi / Paragraf',
    baru: () => ({ isi: '', rata: 'rata', tebal: 'tidak' }),
    bidang: [
      { k: 'isi', l: 'Isi', jenis: 'area', tinggi: 130,
        bantu: 'Penanda {{nomor}}, {{perihal}}, {{tujuan}}, dan {{tanggal}} diganti isi suratnya.' },
      { k: 'rata', l: 'Perataan', jenis: 'pilih', pilihan: RATA_TEKS },
      { k: 'tebal', l: 'Huruf', jenis: 'pilih', pilihan: [{ v: 'tidak', l: 'Biasa' }, { v: 'ya', l: 'Tebal' }] },
    ],
    gambar: (b, s) => `<p class="ls-${esc(b.rata || 'rata')}${b.tebal === 'ya' ? ' ls-tebal' : ''}">${
      barisHtml(isiPengganti(b.isi, s)) || '<span class="ls-kosong">Isi surat…</span>'}</p>`,
  },
  ttd: {
    l: 'Tanda Tangan',
    baru: () => ({ penanda: [], rata: 'kanan' }),
    bidang: [
      { k: 'penanda', l: 'Penandatangan', jenis: 'penanda',
        bantu: 'Diambil dari Kumpulan Tanda Tangan. Paling banyak tiga, berjajar.' },
      { k: 'rata', l: 'Letak', jenis: 'pilih',
        pilihan: [{ v: 'kanan', l: 'Kanan' }, { v: 'kiri', l: 'Kiri' }, { v: 'tengah', l: 'Tengah / berjajar' }] },
    ],
    gambar: (b) => {
      const orang = (b.penanda || []).map((id) => Store.db.tandaTangan.find((t) => t.id === id)).filter(Boolean);
      if (!orang.length) return '<div class="ls-ttd ls-ttd-kanan"><div class="ls-ttd-orang"><span class="ls-kosong">Pilih penandatangan…</span></div></div>';
      return `<div class="ls-ttd ls-ttd-${esc(b.rata || 'kanan')}">${orang.map((t) => `<div class="ls-ttd-orang">
        <div>${esc(t.jabatan)}${t.divisi && t.divisi !== t.jabatan ? `<br>${esc(t.divisi)}` : ''}</div>
        ${t.gambar ? `<img src="${esc(t.gambar)}" alt="">` : '<div class="ls-ttd-ruang"></div>'}
        <div class="ls-ttd-nama">${esc(namaOrang(t))}</div></div>`).join('')}</div>`;
    },
  },
  garis: { l: 'Garis Pemisah', baru: () => ({}), bidang: [], gambar: () => '<hr class="ls-garis">' },
  spasi: {
    l: 'Jarak Kosong',
    baru: () => ({ tinggi: 'sedang' }),
    bidang: [{ k: 'tinggi', l: 'Tinggi', jenis: 'pilih',
      pilihan: [{ v: 'kecil', l: 'Kecil' }, { v: 'sedang', l: 'Sedang' }, { v: 'besar', l: 'Besar' }] }],
    gambar: (b) => `<div class="ls-spasi ls-spasi-${esc(b.tinggi || 'sedang')}"></div>`,
  },
};

const blokBaru = (jenis) => ({ id: 'b' + Math.random().toString(36).slice(2, 9), jenis, ...BLOK_SURAT[jenis].baru() });

/** Susunan awal bila tak ada templat sama sekali. */
function blokBawaan() {
  const ttd = Store.db.tandaTangan[0]?.id;
  return [
    blokBaru('kop'), blokBaru('garis'), blokBaru('tanggal'), blokBaru('meta'), blokBaru('tujuan'),
    { ...blokBaru('teks'), isi: "Assalamu'alaikum warahmatullahi wabarakatuh," },
    { ...blokBaru('teks'), isi: 'Sehubungan dengan {{perihal}}, dengan ini kami sampaikan …' },
    { ...blokBaru('teks'), isi: "Demikian surat ini kami sampaikan. Atas perhatian dan kerja samanya kami ucapkan terima kasih.\n\nWassalamu'alaikum warahmatullahi wabarakatuh." },
    { ...blokBaru('ttd'), penanda: ttd ? [ttd] : [] },
  ];
}
/** Salinan blok sebuah templat, dengan id blok yang baru. */
function blokTemplat(templatId) {
  const t = Store.db.templatSurat.find((x) => x.id === templatId) || Store.db.templatSurat[0];
  const asal = t?.blok?.length ? t.blok : blokBawaan();
  return asal.filter((b) => BLOK_SURAT[b.jenis]).map((b) => ({ ...JSON.parse(JSON.stringify(b)), id: blokBaru(b.jenis).id }));
}

function lembarSurat(blok, surat) {
  return `<div class="lembar-surat">${blok.filter((b) => BLOK_SURAT[b.jenis])
    .map((b) => `<div class="ls-blok" data-blok="${esc(b.id)}">${BLOK_SURAT[b.jenis].gambar(b, surat)}</div>`).join('')
    || '<p class="ls-kosong" style="text-align:center">Lembar kosong. Sisipkan blok dari panel kiri.</p>'}</div>`;
}

/* Yang sedang disusun. `kerja` salinan kerja bloknya: ia bertahan saat
   halaman digambar ulang, dan baru menimpa arsip ketika disimpan. */
let susun = null;       // { jenis: 'surat' | 'templat', id, kerja, kotor }

function bukaSusun(jenis, id) {
  const sumber = jenis === 'surat' ? Store.db.surat.find((x) => x.id === id) : Store.db.templatSurat.find((x) => x.id === id);
  if (!sumber) return toast('Data tidak ditemukan.', true);
  /* Surat lama belum punya blok: ia memulai dari templat pertama. */
  const awal = sumber.blok?.length ? JSON.parse(JSON.stringify(sumber.blok)) : blokTemplat();
  susun = { jenis, id, kerja: awal, kotor: !sumber.blok?.length, asal: rute };
  rute = 'susun-surat'; location.hash = rute; gambar();
}

HAL['susun-surat'] = () => {
  const sumber = susun && (susun.jenis === 'surat' ? Store.db.surat.find((x) => x.id === susun.id)
    : Store.db.templatSurat.find((x) => x.id === susun.id));
  if (!sumber) {
    susun = null;
    const kosong = el(`<div class="panel"><div class="kosong-erp">${I.kotak}<p>Belum ada surat yang dibuka</p>
      <small>Buka sebuah surat dari daftarnya, lalu tekan ikon "Susun surat".</small>
      <button class="btn btn-kecil" style="margin-top:14px">Buka Surat Internal</button></div></div>`);
    kosong.querySelector('button').onclick = () => bukaModul('surat-internal');
    return kosong;
  }
  const surat = susun.jenis === 'surat' ? sumber : null;
  const blok = susun.kerja;
  const kembali = () => bukaModul(susun.jenis === 'templat' ? 'templat-surat'
    : surat.jenisSk && HAL[`sk-${surat.jenisSk}`] && susun.asal === `sk-${surat.jenisSk}` ? susun.asal : `surat-${surat.kategori}`);

  const box = el(`<div class="ss">
    <div class="ss-bilah">
      <button class="btn btn-garis btn-kecil" data-kembali>${I.kiri || '←'} Kembali</button>
      <div class="ss-judul"><b>${esc(surat ? surat.nomor : `Templat: ${sumber.nama}`)}</b>
        <span>${esc(surat ? surat.perihal : 'Disalin ke tiap surat baru yang memilih templat ini')}</span></div>
      <span class="ss-status" data-status></span>
      <button class="btn btn-garis btn-kecil" data-simpan>Simpan</button>
      ${surat ? `<button class="btn btn-lime btn-kecil" data-pdf>${I.unduh} Unduh PDF</button>` : ''}
    </div>
    <div class="ss-tata">
      <div class="ss-kiri" data-kiri></div>
      <div class="ss-kanan"><div class="ss-bingkai" data-bingkai></div></div>
    </div></div>`);
  const kiri = box.querySelector('[data-kiri]');
  const bingkai = box.querySelector('[data-bingkai]');
  const status = box.querySelector('[data-status]');

  const tandai = (kotor) => {
    susun.kotor = kotor;
    status.textContent = kotor ? 'Belum disimpan' : 'Tersimpan';
    status.classList.toggle('kotor', kotor);
  };
  const pratinjau = () => {
    bingkai.innerHTML = lembarSurat(blok, surat);
    const lembar = bingkai.firstElementChild;
    /* Lembar selebar A4 dikecilkan agar muat di panelnya. */
    requestAnimationFrame(() => {
      const skala = Math.min(1, (bingkai.clientWidth - 2) / lembar.offsetWidth);
      if (skala > 0) lembar.style.zoom = skala;
    });
  };
  const ubah = () => { tandai(true); pratinjau(); };

  const pilihSisip = (pada) => {
    const sel = el(`<select class="ss-sisip"><option value="">＋ Sisipkan blok di sini…</option>
      ${Object.entries(BLOK_SURAT).map(([k, d]) => `<option value="${k}">${esc(d.l)}</option>`).join('')}</select>`);
    sel.onchange = () => { if (!sel.value) return; blok.splice(pada, 0, blokBaru(sel.value)); tandai(true); gambarKiri(); pratinjau(); };
    return sel;
  };

  function kolomBlok(b, f) {
    const g = el(`<div class="grup"><label>${esc(f.l)}</label></div>`);
    if (f.jenis === 'area') {
      const t = el(`<textarea style="min-height:${f.tinggi || 72}px"></textarea>`);
      t.value = b[f.k] || ''; t.oninput = () => { b[f.k] = t.value; ubah(); };
      g.appendChild(t);
    } else if (f.jenis === 'pilih') {
      const p = el(`<select>${f.pilihan.map((o) => `<option value="${esc(o.v)}">${esc(o.l)}</option>`).join('')}</select>`);
      p.value = b[f.k] ?? f.pilihan[0].v; p.onchange = () => { b[f.k] = p.value; ubah(); };
      g.appendChild(p);
    } else if (f.jenis === 'gambar') {
      const k = el(`<div class="ss-gambar"><img alt=""><label class="btn btn-garis btn-kecil" style="cursor:pointer;margin:0">
        ${I.gambar} Pilih Gambar<input type="file" accept="image/*" hidden></label>
        <button class="btn btn-garis btn-kecil" data-lepas>Pakai logo situs</button></div>`);
      const img = k.querySelector('img');
      const segar = () => { img.src = b[f.k] || Store.cms.situs.logo; k.querySelector('[data-lepas]').hidden = !b[f.k]; };
      const inp = k.querySelector('input');
      inp.onchange = async () => {
        const berkas = inp.files[0]; if (!berkas) return;
        try { b[f.k] = await Store.unggahGambar(berkas, 600); segar(); ubah(); } catch (e) { toast(e.message, true); }
        inp.value = '';
      };
      k.querySelector('[data-lepas]').onclick = () => { b[f.k] = ''; segar(); ubah(); };
      segar(); g.appendChild(k);
    } else if (f.jenis === 'penanda') {
      const daftar = el('<div class="ss-penanda"></div>');
      if (!Store.db.tandaTangan.length) daftar.appendChild(el('<span class="sub-sel">Kumpulan Tanda Tangan masih kosong.</span>'));
      Store.db.tandaTangan.forEach((t) => {
        const baris = el(`<label><input type="checkbox"> <span><b>${esc(namaOrang(t))}</b> · ${esc(t.jabatan)}</span></label>`);
        const c = baris.querySelector('input');
        c.checked = (b[f.k] || []).includes(t.id);
        c.onchange = () => {
          const kini = (b[f.k] || []).filter((id) => id !== t.id);
          if (c.checked) {
            if (kini.length >= 3) { c.checked = false; return toast('Paling banyak tiga penandatangan dalam satu blok.', true); }
            kini.push(t.id);
          }
          b[f.k] = kini; ubah();
        };
        daftar.appendChild(baris);
      });
      g.appendChild(daftar);
    } else {
      const i = el('<input type="text">');
      i.value = b[f.k] || ''; i.oninput = () => { b[f.k] = i.value; ubah(); };
      g.appendChild(i);
    }
    if (f.bantu) g.appendChild(el(`<div class="bantu">${esc(f.bantu)}</div>`));
    return g;
  }

  function gambarKiri() {
    kiri.replaceChildren(pilihSisip(0));
    blok.forEach((b, i) => {
      const d = BLOK_SURAT[b.jenis];
      if (!d) return;
      const kartu = el(`<div class="ss-blok">
        <div class="ss-blok-kepala"><span class="ss-no">${i + 1}</span><b>${esc(d.l)}</b>
          <button class="ikon-aksi" data-naik title="Naikkan" ${i === 0 ? 'disabled' : ''}>${I.atas || '↑'}</button>
          <button class="ikon-aksi" data-turun title="Turunkan" ${i === blok.length - 1 ? 'disabled' : ''}>${I.bawah}</button>
          <button class="ikon-aksi hapus" data-buang title="Buang blok">${I.hapus}</button></div>
        <div class="ss-blok-isi"></div></div>`);
      const isi = kartu.querySelector('.ss-blok-isi');
      d.bidang.forEach((f) => isi.appendChild(kolomBlok(b, f)));
      if (!d.bidang.length) isi.remove();
      const pindah = (ke) => { blok.splice(ke, 0, blok.splice(i, 1)[0]); tandai(true); gambarKiri(); pratinjau(); };
      kartu.querySelector('[data-naik]').onclick = () => pindah(i - 1);
      kartu.querySelector('[data-turun]').onclick = () => pindah(i + 1);
      kartu.querySelector('[data-buang]').onclick = () => { blok.splice(i, 1); tandai(true); gambarKiri(); pratinjau(); };
      kiri.appendChild(kartu);
      kiri.appendChild(pilihSisip(i + 1));
    });
  }

  const simpan = () => aman(() => {
    Store.simpanKoleksi(U, susun.jenis === 'surat' ? 'surat' : 'templatSurat', { id: susun.id, blok: JSON.parse(JSON.stringify(blok)) });
    tandai(false);
  });
  box.querySelector('[data-simpan]').onclick = () => { if (simpan()) toast(surat ? 'Susunan surat tersimpan di arsip.' : 'Templat tersimpan.'); };
  box.querySelector('[data-kembali]').onclick = () => (susun.kotor
    ? konfirmasi('Tinggalkan penyusun', 'Perubahan yang belum disimpan akan hilang.', kembali, 'Tinggalkan')
    : kembali());
  box.querySelector('[data-pdf]')?.addEventListener('click', () => {
    if (susun.kotor && !simpan()) return;
    /* Nama berkas PDF mengikuti judul dokumen saat dicetak. */
    const judulLama = document.title;
    document.title = `${surat.nomor.replace(/\//g, '-')} ${surat.perihal}`.slice(0, 90);
    document.body.classList.add('cetak-surat');
    /* Tepi kertas surat berbeda dari laporan, jadi aturan @page-nya
       dipasang hanya selama mencetak. */
    const kertas = document.head.appendChild(Object.assign(document.createElement('style'),
      { textContent: '@page { size: A4; margin: 18mm 20mm; }' }));
    const usai = () => {
      document.body.classList.remove('cetak-surat');
      kertas.remove();
      document.title = judulLama;
      window.removeEventListener('afterprint', usai);
    };
    window.addEventListener('afterprint', usai);
    window.print();
  });

  gambarKiri(); pratinjau(); tandai(susun.kotor);
  return box;
};
HAL['susun-surat'].judul = () => ['Susun Surat', 'Rangkai surat dari blok, lalu unduh sebagai PDF.'];

/* ============================================================
   HALAMAN BERTAB — Pengaturan dan Pantau Divisi
   ------------------------------------------------------------
   Satu cetakan untuk keduanya. Tab Ketua ditentukan TAB_KETUA; peran
   lain tetap memakai modul yang dilipat dari sidebar, seperti semula.
   ============================================================ */
/** Tab yang sedang terbuka. Bila yang tersimpan bukan milik pengguna
    ini, jatuh ke tab pertama — dipanggil judul maupun isi halaman,
    supaya keduanya tak pernah menyebut tab yang berbeda. */
function tabKini(kunci) {
  const tabs = daftarTab(kunci);
  if (!tabs.some((t) => t.id === tabAktif[kunci])) tabAktif[kunci] = tabs[0]?.id;
  return tabAktif[kunci];
}

function halamanTab(kunci, notis) {
  const tabs = daftarTab(kunci);
  const aktif = tabKini(kunci);

  const box = el('<div></div>');
  if (!tabs.length) {
    box.appendChild(el(`<div class="panel"><div class="kosong-erp">${I.kotak}<p>Tidak ada modul tersedia</p></div></div>`));
    return box;
  }

  box.appendChild(el(`<div class="notis notis-info">${I.perisai}<div>
    <b>${esc(notis[0])}</b>${esc(notis[1])}</div></div>`));

  const bar = el(`<div class="tab-bar">${tabs.map((t) => {
    const n = t.lonceng?.() || 0;
    return `<button data-tab="${t.id}" class="${t.id === aktif ? 'aktif' : ''}">
      ${nilai(t.ikon)}<span>${esc(nilai(t.label))}</span>${n ? `<span class="tab-lonceng">${n}</span>` : ''}</button>`;
  }).join('')}
    <a class="btn btn-garis btn-kecil" style="margin-left:auto" href="index.html" target="_blank">${I.mata} Lihat Website</a>
  </div>`);
  bar.querySelectorAll('[data-tab]').forEach((b) => {
    b.onclick = () => { tabAktif[kunci] = b.dataset.tab; gambar(); };
  });
  box.appendChild(bar);
  box.appendChild(HAL[aktif]());
  return box;
}
const judulTab = (kunci, nama, cadangan) => () => {
  const t = MENU.find((m) => m.id === tabKini(kunci));
  return [nama, t && HAL[t.id] ? `${nilai(t.label)} — ${HAL[t.id].judul()[1]}` : cadangan];
};

HAL.pengaturan = () => halamanTab('pengaturan', ruangKetua()
  ? ['Pengaturan sistem',
     'Tampilan website, riwayat versi, kategori artikel, dan log aktivitas. Pekerjaan harian — persetujuan, tinjauan artikel, kotak masuk — kini ada di kelompok Putuskan pada sidebar.']
  : ['Pengaturan sistem',
     'Editor halaman, persetujuan, dan log aktivitas. Pekerjaan harian — kotak masuk, surat masuk, notulen dan presensi — kini ada di kelompok Tindak Lanjuti pada sidebar. Alur dua kunci tetap berlaku: perubahan website baru tayang setelah Ketua Umum menyetujuinya.']);
HAL.pengaturan.judul = judulTab('pengaturan', 'Pengaturan', 'Modul lanjutan organisasi.');

HAL['pantau-divisi'] = () => halamanTab('pantau-divisi',
  ['Pantau lintas divisi',
   'Kajian, kas, dan arsip surat yang dikelola tiap penanggung jawab — seluruh angkatan dan seluruh kategori dalam satu tempat. Jadwal kajian tetap dapat Anda ubah dari sini; kas dan arsip surat hanya dapat dibaca.']);
HAL['pantau-divisi'].judul = judulTab('pantau-divisi', 'Pantau Divisi', 'Kajian, kas, dan arsip surat.');

/* ------------------------------------------------------------
   TAB PANTAU DIVISI
   ------------------------------------------------------------
   Ketua dulu memantau lewat modul versi lama, yang tertinggal dari
   ruang kerja tiap PJ: jadwal kajian berupa kartu tanpa angka
   kehadiran, kas tanpa saldo per akun, arsip surat tanpa pencarian.

   Ketiga tab ini membaca data yang SAMA dengan ruang kerja PJ dan
   memakai hitungan yang sama, tetapi dari sudut pemantau: lintas
   angkatan dan lintas kategori, bukan satu angkatan yang sedang
   dikerjakan.
   ------------------------------------------------------------ */
let saringPantau = { angkatan: '', perlu: '', surat: '', cariSurat: '' };

/** Kehadiran satu kajian terhadap anggota aktif angkatannya sendiri. */
function hadirKajian(k) {
  const r = Store.rekapKajian(k);
  return { hadir: r.datang, total: r.total, persen: r.persen };
}

HAL['pantau-kajian'] = () => {
  const bisaKelola = RBAC.can(U, 'kajian.manage');
  const semua = [...Store.db.kajian].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  const angkatan = angkatanTersedia();
  if (!angkatan.includes(saringPantau.angkatan)) saringPantau.angkatan = '';
  /* "Perlu" menyaring yang masih menuntut kerja: kajian yang sudah lewat
     tetapi belum bernotulen, atau belum punya satu pun catatan presensi. */
  const lewat = (k) => statusKajian(k) === 'selesai';
  const perlu = { notulen: (k) => lewat(k) && Store.statusNotulen(k) !== 'sah', presensi: (k) => lewat(k) && !(k.presensi || []).length };
  const seAngkatan = semua.filter((k) => !saringPantau.angkatan || k.angkatan === saringPantau.angkatan);
  const data = seAngkatan.filter((k) => !perlu[saringPantau.perlu] || perlu[saringPantau.perlu](k));

  const selesai = seAngkatan.filter(lewat);
  const rata = selesai.length ? Math.round(selesai.reduce((j, k) => j + hadirKajian(k).persen, 0) / selesai.length) : 0;
  const box = el(`<div><div class="grid-stat">
    ${[
      { ik: I.kalender,  n: seAngkatan.length,                l: 'Kajian terjadwal',          w: 'rgba(62,127,184,.14)', wc: '#2C6091' },
      { ik: I.cekBulat,  n: selesai.length,                   l: 'Sudah terlaksana',          w: 'rgba(140,198,63,.16)', wc: '#4A7A1E' },
      { ik: I.grup,      n: selesai.length ? `${rata}%` : '—', l: 'Rata-rata kehadiran',       w: 'rgba(240,149,30,.14)', wc: '#B87310' },
      { ik: I.dok,       n: `${selesai.filter((k) => Store.statusNotulen(k) === 'sah').length}/${selesai.length}`, l: 'Kajian selesai bernotulen sah', w: 'rgba(47,169,140,.14)', wc: '#1F7A64' },
    ].map((x) => `<div class="stat" style="--w:${x.w};--wc:${x.wc}"><div class="stat-ik">${x.ik}</div>
      <div class="stat-nilai">${x.n}</div><div class="stat-label">${esc(x.l)}</div></div>`).join('')}
  </div></div>`);

  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Jadwal & Kehadiran Kajian</h3><span class="hitung">(${data.length} Kajian)</span>
    <div class="kanan">
      <select class="pilih-saring" data-angkatan><option value="">Semua Angkatan</option>
        ${angkatan.map((a) => `<option ${a === saringPantau.angkatan ? 'selected' : ''}>${esc(a)}</option>`).join('')}</select>
      <select class="pilih-saring" data-perlu>
        ${[['', 'Semua kajian'], ['notulen', `Notulen belum sah (${seAngkatan.filter(perlu.notulen).length})`], ['presensi', `Belum ada presensi (${seAngkatan.filter(perlu.presensi).length})`]]
          .map(([v, l]) => `<option value="${v}" ${v === saringPantau.perlu ? 'selected' : ''}>${l}</option>`).join('')}</select>
      <button class="btn btn-garis btn-kecil" data-cetak title="Laporan kajian satu angkatan, siap cetak">${I.dok} Cetak Laporan</button>
      ${bisaKelola ? `<button class="btn btn-kecil" data-tambah>${I.tambah} Jadwalkan Kajian</button>` : ''}
    </div></div></div>`);
  kartu.querySelector('[data-cetak]').onclick = () => (saringPantau.angkatan
    ? cetakLaporanKajian({ angkatan: saringPantau.angkatan }) : toast('Pilih satu angkatan lebih dulu.', true));
  if (RBAC.can(U, 'kajian.attendance')) box.appendChild(kartuPengajuanIzin(seAngkatan));
  kartu.querySelector('[data-angkatan]').onchange = (e) => { saringPantau.angkatan = e.target.value; gambar(); };
  kartu.querySelector('[data-perlu]').onchange = (e) => { saringPantau.perlu = e.target.value; gambar(); };
  kartu.querySelector('[data-tambah]')?.addEventListener('click', () => formKajian(null));

  if (!data.length) {
    kartu.appendChild(el(`<div class="kosong-erp">${I.kotak}<p>${saringPantau.perlu ? 'Tidak ada kajian yang menunggu' : 'Belum ada jadwal kajian'}</p>
      ${saringPantau.perlu ? '<small>Semua kajian pada saringan ini sudah lengkap.</small>' : ''}</div>`));
    box.appendChild(kartu);
    return box;
  }
  const t = el(`<div class="tabel-bungkus"><table class="t-org">
    <thead><tr><th class="kol-no">No.</th><th>Tanggal</th><th>Judul Kajian</th><th>Angkatan</th><th>Pemakalah</th>
      <th>Kehadiran</th><th>Notulen</th><th>Status</th><th class="kol-aksi">Aksi</th></tr></thead>
    <tbody></tbody></table></div>`);
  const tb = t.querySelector('tbody');
  data.forEach((k, i) => {
    const h = hadirKajian(k);
    const sudah = statusKajian(k) === 'selesai';
    const tr = el(`<tr>
      <td class="kol-no">${i + 1}</td>
      <td class="utuh">${tgl(k.tanggal)}<br><span class="sub-sel">${esc(k.jam || '')}</span></td>
      <td><b>${esc(k.judul)}</b>${k.tempat ? `<br><span class="sub-sel">${esc(k.tempat)}</span>` : ''}</td>
      <td class="utuh">${esc(k.angkatan || '—')}<br><span class="sub-sel">${esc(k.level || '')}</span></td>
      <td>${esc(namaPendek(k.pemakalahId))}</td>
      <td class="utuh">${sudah || h.hadir ? `${h.hadir}/${h.total} · ${h.persen}%` : '—'}${k.presensiTutup ? ` <span title="Presensi ditutup">${I.gembok}</span>` : ''}</td>
      <td>${lencanaNotulen(k)}</td>
      <td>${lencanaKajian(k)}</td>
      <td class="kol-aksi"><div class="sel-aksi">
        ${RBAC.can(U, 'kajian.attendance') ? `<button class="ikon-aksi" data-pindai title="Mode Presensi — pindai kartu">${I.qr}</button>
          <button class="ikon-aksi" data-absen title="Absensi manual">${I.grup}</button>` : ''}
        ${RBAC.can(U, 'kajian.notulensi') ? `<button class="ikon-aksi" data-notulen title="Notulensi">${I.dok}</button>` : ''}
        ${bisaKelola ? `<button class="ikon-aksi sunting" title="Sunting">${I.sunting}</button>
          ${Store.kajianBerisi(k) ? '' : `<button class="ikon-aksi hapus" title="Hapus">${I.hapus}</button>`}` : ''}
      </div></td></tr>`);
    tr.querySelector('[data-pindai]')?.addEventListener('click', () => modePresensi(k));
    tr.querySelector('[data-absen]')?.addEventListener('click', () => dialogAbsensi(k));
    tr.querySelector('[data-notulen]')?.addEventListener('click', () => dialogNotulensi(k));
    tr.querySelector('.sunting')?.addEventListener('click', () => formKajian(k));
    tr.querySelector('.hapus')?.addEventListener('click', () => konfirmasi('Hapus jadwal kajian',
      `"${k.judul}" akan dihapus. Kajian ini belum memuat presensi maupun notulen.`,
      () => aman(() => { Store.hapusKajian(U, k.id); toast('Jadwal dihapus.'); gambar(); })));
    tb.appendChild(tr);
  });
  if (bisaKelola) pasangPilih(t, data, { satuan: 'jadwal kajian', hapus: (k) => Store.hapusKajian(U, k.id) });
  kartu.appendChild(t);
  box.appendChild(kartu);
  return box;
};
HAL['pantau-kajian'].judul = () => ['Kajian', 'Jadwal, kehadiran, dan notulen seluruh angkatan.'];

/* Halaman kerja Sekretaris: tabel yang sama. Tombol jadwal, sunting, dan
   hapus tak tampil baginya — itu wewenang koordinator — sehingga yang
   tersisa persis tugasnya: memindai presensi dan menulis notulen. */
HAL['notulen-presensi'] = () => HAL['pantau-kajian']();
HAL['notulen-presensi'].judul = () => ['Notulen & Presensi', 'Kehadiran dan notulen tiap kajian, seluruh angkatan.'];

/* Kas: saldo dan arus kas milik Bendahara, lalu laporan serta buku
   besarnya. Keduanya halaman baca — tak ada tombol tulis di dalamnya —
   jadi cukup disusun berurutan, bukan ditulis ulang. */
HAL['pantau-kas'] = () => {
  const box = el('<div></div>');
  box.appendChild(HAL.saldo());
  box.appendChild(el('<div style="height:20px"></div>'));
  box.appendChild(HAL['laporan-kas']());
  return box;
};
HAL['pantau-kas'].judul = () => ['Kas & Saldo', 'Saldo per akun, arus kas bulanan, laporan, dan buku besar.'];

const KATEGORI_SURAT = { internal: 'Internal', eksternal: 'Eksternal', keputusan: 'Keputusan', masuk: 'Masuk' };
const WARNA_SURAT = { masuk: 'l-biru', keputusan: 'l-kuning', internal: 'l-hijau', eksternal: 'l-abu' };

HAL['pantau-surat'] = () => {
  const semua = [...Store.db.surat].sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));
  const hitung = (k) => semua.filter((x) => x.kategori === k).length;
  const kartu = el(`<div class="kartu"><div class="kartu-kepala">
    <h3>Arsip Surat</h3><span class="hitung" data-hitung></span>
    <div class="kanan">
      <select class="pilih-saring" data-kategori><option value="">Semua Kategori (${semua.length})</option>
        ${Object.entries(KATEGORI_SURAT).map(([k, l]) => `<option value="${k}" ${k === saringPantau.surat ? 'selected' : ''}>${l} (${hitung(k)})</option>`).join('')}</select>
      <input class="cari-org" placeholder="Cari nomor, perihal, tujuan…" data-cari value="${esc(saringPantau.cariSurat)}">
    </div></div><div data-wadah></div></div>`);
  const wadah = kartu.querySelector('[data-wadah]');
  const isiUlang = () => {
    const q = saringPantau.cariSurat.trim().toLowerCase();
    const data = semua.filter((x) => (!saringPantau.surat || x.kategori === saringPantau.surat)
      && (!q || `${x.nomor} ${x.perihal} ${x.tujuan}`.toLowerCase().includes(q)));
    kartu.querySelector('[data-hitung]').textContent = `(${data.length} dari ${semua.length} dokumen)`;
    if (!data.length) {
      wadah.replaceChildren(el(`<div class="kosong-erp">${I.kotak}<p>Tidak ada surat yang cocok</p><small>Ubah kategori atau kata kunci.</small></div>`));
      return;
    }
    wadah.replaceChildren(el(`<div class="tabel-bungkus"><table class="t-org">
      <thead><tr><th class="kol-no">No.</th><th>Nomor</th><th>Kategori</th><th>Perihal</th><th>Tujuan / Asal</th>
        <th>Tanggal</th><th>Status</th></tr></thead>
      <tbody>${data.map((x, i) => `<tr>
        <td class="kol-no">${i + 1}</td><td class="utuh"><b>${esc(x.nomor)}</b></td>
        <td><span class="lencana ${WARNA_SURAT[x.kategori] || 'l-abu'}">${esc(KATEGORI_SURAT[x.kategori] || x.kategori)}</span></td>
        <td>${esc(x.perihal)}</td><td>${esc(x.tujuan || '—')}</td><td class="utuh">${tgl(x.tanggal)}</td>
        <td><span class="lencana l-abu">${esc(x.status || '—')}</span></td></tr>`).join('')}</tbody></table></div>`));
  };
  kartu.querySelector('[data-kategori]').onchange = (e) => { saringPantau.surat = e.target.value; isiUlang(); };
  kartu.querySelector('[data-cari]').oninput = (e) => { saringPantau.cariSurat = e.target.value; isiUlang(); };
  isiUlang();
  return kartu;
};
HAL['pantau-surat'].judul = () => ['Arsip Surat', 'Seluruh surat dari empat kategori, dapat dicari dan disaring.'];

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

  /* Alamat modul yang kini berupa tab tetap berlaku: ia
     dialihkan ke halaman induknya dengan tab itu terbuka. */
  if (tugas()?.alias[rute]) rute = tugas().alias[rute];
  const induk = tugas() && indukTab(rute);
  if (induk) { tabAktif[induk] = rute; rute = induk; }

  const entri = MENU.find((m) => m.id === rute);
  if (entri && !bolehMenu(entri)) rute = 'dasbor';   // penjaga rute
  if (!HAL[rute]) rute = 'dasbor';

  app.appendChild(kerangka());
  const [j, s] = HAL[rute].judul();
  /* Judul halaman mengikuti nama di sidebar, supaya yang diklik
     dan yang terbuka menyebut hal yang sama. */
  const namaTugas = tugas()?.menu.find((m) => m.id === rute)?.label;
  app.querySelector('#judulHal').textContent = namaTugas || j;
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
    /* Anggota baru memperoleh kata sandi dari server, sekali saja.
       Ditampilkan dalam SATU jendela meski beberapa sekaligus: memanggil
       modal() berulang hanya menimpa isinya sendiri, dan yang terlihat
       tinggal sandi terakhir — sisanya hilang tanpa jejak. */
    const daftar = Object.values(muatan).map((x) =>
      (typeof x === 'string' ? { sandi: x, nama: '', email: '' } : x));
    const isi = el(`<div>
      <p style="margin:0 0 14px;font-size:14px;color:#44534A">Sampaikan kata sandi ini kepada
        yang bersangkutan. Masing-masing akan diminta menggantinya saat pertama masuk, dan
        sandi ini <b>tidak dapat dilihat lagi</b> setelah jendela ini ditutup.</p>
      <div class="kartu-sandi">
        <table class="tbl-sandi">
          <thead><tr><th>Nama</th><th>Email</th><th>Sandi</th></tr></thead>
          <tbody>${daftar.map((x) => `<tr><td>${esc(x.nama || '—')}</td>
            <td>${esc(x.email || '—')}</td><td><code>${esc(x.sandi)}</code></td></tr>`).join('')}</tbody>
        </table>
        <div class="ks-aksi"><button class="btn btn-garis" data-salin>Salin semua</button></div>
      </div></div>`);
    modal({ judul: `Kata sandi baru (${daftar.length})`, isi, lebar: daftar.length > 1 });
    isi.querySelector('[data-salin]').onclick = () => {
      const teks = daftar.map((x) => `${x.nama}\t${x.email}\t${x.sandi}`).join('\n');
      navigator.clipboard.writeText(teks).then(() => toast('Disalin ke papan klip.'),
        () => toast('Peramban menolak menyalin. Salin manual dari tabel.', true));
    };
  }
});

/* Segarkan lonceng bila ada perubahan dari pengurus lain. */
Store.berlangganan(() => {
  if (!U) return;
  document.querySelectorAll('.sb-item').forEach((b) => {
    const m = (tugas() ? menuTugas() : MENU).find((x) => x.id === b.dataset.rute);
    const n = m?.lonceng?.() || 0;
    let lb = b.querySelector('.sb-lonceng');
    if (n && !lb) { b.appendChild(el(`<span class="sb-lonceng">${n}</span>`)); }
    else if (n && lb) lb.textContent = n;
    else if (!n && lb) lb.remove();
  });
});
