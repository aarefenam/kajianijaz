# Kajian Al-I'jaz — Website CMS + ERP Organisasi

Prototipe berjalan penuh: website publik multipage yang seluruh isinya dikendalikan
dari ERP, plus panel operasional organisasi dengan pembagian wewenang antar jabatan.

Berjalan tanpa server, tanpa `npm install`, dan tanpa koneksi internet.
Cukup buka `index.html` di peramban.

## Cara mencoba

```
Website publik  →  index.html
Panel ERP       →  erp.html
Cetak biru      →  docs/system-flow.html
```

### Akun demo (kata sandi semua: `123456`)

| Peran                  | Email                  | Yang bisa dilakukan                                  |
|------------------------|------------------------|------------------------------------------------------|
| Ketua Umum             | `ketua@alijaz.id`      | Menyetujui & menayangkan, rollback, atur jabatan     |
| Sekretaris Umum        | `sekretaris@alijaz.id` | Anggota, notulensi, surat, kotak masuk               |
| Bendahara              | `bendahara@alijaz.id`  | Kas masuk/keluar, iuran, laporan                     |
| PJ Website             | `web@alijaz.id`        | Foto, warna, font, teks, urutan section              |
| PJ Media               | `media@alijaz.id`      | Aset gambar & teks publikasi                         |
| PJ Karya Tulis Ilmiah  | `kti@alijaz.id`        | Tinjau, minta revisi, terbitkan artikel              |
| PJ Koordinator Kajian  | `kajian@alijaz.id`     | Jadwal, pemakalah, absensi, notulensi                |
| Anggota                | `rizky@alijaz.id`      | Menulis artikel & mengirimnya untuk ditinjau         |

### Alur yang paling layak dicoba lebih dulu

1. Masuk ERP sebagai **PJ Website** → Editor Halaman → ubah judul hero atau warna aksen.
2. Buka `index.html` — **belum berubah**. Perubahan masih di draft.
3. Kembali ke ERP → **Ajukan untuk Ditinjau**.
4. Keluar, masuk sebagai **Ketua Umum** → Persetujuan → lihat rincian → **Setujui**.
5. Muat ulang `index.html` — **barulah berubah**.

Bila kedua tab terbuka bersamaan, halaman publik memperbarui dirinya sendiri.

Perhatikan juga: PJ Website tidak akan menemukan menu Keuangan, dan Bendahara tidak
akan menemukan Editor Halaman. Pembatasan itu ditegakkan di lapisan data, bukan
sekadar disembunyikan dari tampilan.

## Susunan berkas

```
index.html · tentang.html · artikel.html · kontak.html   Halaman publik
erp.html                                                  Panel ERP

assets/js/rbac.js     Peran, izin, matriks wewenang
assets/js/seed.js     Seluruh isi website sebagai data + akun demo
assets/js/store.js    Penyimpanan, pemisahan draft/tayang, versi, audit
assets/js/site.js     Perender halaman publik
assets/js/erp.js      Router ERP, editor CMS generik, modul operasional

assets/css/site.css   Tampilan publik (warna dibaca dari variabel CMS)
assets/css/erp.css    Tampilan panel ERP

docs/system-flow.html Cetak biru sistem: alur kerja, wewenang, model data
```

## Gagasan rancangan yang perlu diketahui

**Pemisahan draft dan tayang.** `db.cms` adalah versi yang dibaca website publik.
`db.cmsDraft` adalah ruang kerja pengurus. Hanya `setujui()` dan `rollback()` yang
boleh menulis ke `db.cms`, dan keduanya menuntut izin yang hanya dimiliki Ketua Umum.

**Aturan dua kunci.** PJ Website memegang seluruh izin *mengubah* tampilan, tetapi
tidak memegang izin *menayangkan*. Tidak ada satu orang pun yang dapat mengubah wajah
publik organisasi seorang diri.

**Editor CMS bersifat generik.** Form penyuntingan dibangun dari bentuk data section:
teks panjang menjadi area teks, warna menjadi pemilih warna, gambar menjadi pengunggah,
daftar menjadi baris yang bisa ditambah dan dihapus. Menambah jenis section baru cukup
dengan menambah satu entri di `seed.js` dan satu fungsi render di `site.js` — form
penyuntingnya terbentuk sendiri.

**Isi halaman adalah data, bukan HTML.** Berkas HTML hanya cangkang; seluruh section
dirender dari `Store.cms`. Inilah yang membuat website benar-benar dapat dikendalikan
dari ERP.

## Mengulang dari awal

Data tersimpan di `localStorage` peramban. Untuk mengembalikan ke kondisi awal, jalankan
di konsol peramban:

```js
Store.resetPabrik(); location.reload();
```

## Catatan untuk tahap produksi

Prototipe menyimpan data di peramban masing-masing pengguna — memadai untuk menyepakati
alur kerja, belum untuk dipakai bersama. Yang perlu diganti hanya lapisan penyimpanan;
seluruh aturan wewenang, alur persetujuan, dan antarmuka dapat dipertahankan.
Rinciannya ada di `docs/system-flow.html`.
