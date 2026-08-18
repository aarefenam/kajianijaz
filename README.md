# Kajian Al-I'jaz — Website CMS + ERP Organisasi

Prototipe berjalan penuh: website publik multipage yang seluruh isinya dikendalikan
dari ERP, plus panel operasional organisasi dengan pembagian wewenang antar jabatan.

Berjalan tanpa server, tanpa `npm install`, dan tanpa koneksi internet.
Cukup buka `index.html` di peramban.

## Cara mencoba

Secara daring lewat GitHub Pages:

| Halaman | Tautan |
|---|---|
| Beranda | https://aarefenam.github.io/kajianijaz/ |
| Tentang Kajian | https://aarefenam.github.io/kajianijaz/tentang.html |
| Artikel | https://aarefenam.github.io/kajianijaz/artikel.html |
| Kontak | https://aarefenam.github.io/kajianijaz/kontak.html |
| Panel ERP | https://aarefenam.github.io/kajianijaz/erp.html |
| Cetak biru sistem | https://aarefenam.github.io/kajianijaz/docs/system-flow.html |

Atau langsung dari berkas lokal — buka saja di peramban, tanpa server:

```
Website publik  →  index.html
Panel ERP       →  erp.html
Cetak biru      →  docs/system-flow.html
```

### Akun demo (kata sandi semua: `123456`)

| Peran                  | Email                  | Yang bisa dilakukan                                  |
|------------------------|------------------------|------------------------------------------------------|
| Ketua Umum             | `ketua@alijaz.id`      | Kepengurusan, program kerja, persetujuan & rollback  |
| Sekretaris Umum        | `sekretaris@alijaz.id` | Persuratan, sertifikat, keanggotaan, arsip           |
| Bendahara              | `bendahara@alijaz.id`  | Pemasukan, pengeluaran, saldo Rp & EGP, laporan       |
| PJ Media & Website     | `web@alijaz.id`        | Konten, media, agenda, SEO, performa website          |
| PJ Artikel             | `kti@alijaz.id`        | Target & penugasan artikel, tinjau, terbitkan        |
| PJ Buku                | `buku@alijaz.id`       | Proyek buku: rencana, tugas, produksi, distribusi    |
| PJ Koordinator Kajian  | `kajian@alijaz.id`     | Jadwal, presensi QR, tugas, materi, rekap kajian     |
| Anggota                | `rizky@alijaz.id`      | Menulis artikel & mengirimnya untuk ditinjau         |

### Alur yang paling layak dicoba lebih dulu

1. Masuk ERP sebagai **PJ Media & Website** → Konten Website → ubah judul hero atau warna aksen.
2. Buka `index.html` — **belum berubah**. Perubahan masih di draft.
3. Kembali ke ERP → **Ajukan untuk Ditinjau**.
4. Keluar, masuk sebagai **Ketua Umum** → Pengaturan → tab **Persetujuan** → **Setujui**.
5. Muat ulang `index.html` — **barulah berubah**.

Bila kedua tab terbuka bersamaan, halaman publik memperbarui dirinya sendiri.

### Ruang kerja Ketua Umum

Ketua Umum masuk ke panel yang berbeda dari peran lain: sebuah dasbor berisi lima
daftar kepengurusan — **Data Pengurus**, **Koordinator Kajian**, **Kaleidoskop
Kegiatan & Program**, **Pencapaian**, dan **Evaluasi & Masukan** — masing-masing
punya halamannya sendiri di sidebar, lengkap dengan pencarian.

Dasbor sendiri **hanya etalase pintasan**; tidak ada data yang ditulis dari sana.
Kartunya memangkas isi (beberapa baris awal, tanda `…`, lalu baris terakhir), dan
setiap aksi — Tambah Data, sunting, hapus, maupun centang Selesai — membuka dulu
halaman modulnya, baru melanjutkan maksud aksi itu di daftar penuh. Judul kartu
dan tanda `…` juga merupakan pintasan ke halaman yang sama.

Modul lanjutan — Persetujuan website, Riwayat Versi, Editor Halaman, Kas, Hak
Akses, Log, dan lainnya — tidak hilang, melainkan dikumpulkan sebagai tab di
halaman **Pengaturan**, agar dasbor tetap ringkas tanpa memutus aturan dua kunci.

### Ruang kerja Sekretaris

Sekretaris memakai dasbor berupa **ubin pintasan**: sembilan modul persuratan,
dokumen, dan keanggotaan, masing-masing memampangkan jumlah dokumennya sebagai
isyarat beban kerja. Menekan ubin membuka halaman modulnya — sama seperti dasbor
Ketua, tidak ada data yang ditulis dari dasbor.

Persuratan terbagi lima kategori — **Internal**, **Eksternal**, **Keputusan**,
**Masuk**, dan **Keluar** — yang semuanya hidup di satu koleksi `db.surat` agar
penomoran dan arsipnya tetap satu kesatuan. Surat Keputusan punya cabang lagi
berupa lima jenis SK, yang bisa dibentangkan dari sidebar maupun dari ubinnya.

**Data Anggota Perangkatan** dan **Data Alumni** bukan daftar baru, melainkan
tampilan atas `db.users` yang sudah ada — dikelompokkan per angkatan dan disaring
menurut status. Menambah anggota di sini langsung terlihat pada absensi kajian dan
halaman publik. Begitu pula **Link Arsip Kepenulisan**, yang menjendelai naskah
anggota secara baca-saja: penyuntingan tetap wewenang PJ Artikel, sehingga tidak
ada dua pintu yang mengubah tulisan yang sama.

### Ruang kerja PJ Artikel

Dasbornya memantau **target dan progress penulisan**. Panel atas menunjukkan
capaian bulan berjalan terhadap target — rata-rata penugasan per penulis dibanding
target yang ditetapkan — lalu di bawahnya tabel progress tiap anggota, dengan
pemilih bulan dan tombol export.

Penugasan disimpan terpisah dari naskah (`db.penugasan`): PJ menetapkan judul di
awal bulan, anggota menuliskannya kemudian. Begitu naskahnya benar-benar masuk,
Store menyambungkan keduanya lewat `artikelId` dan menaikkan progress sendiri —
`proses` saat masih draft, `siap` begitu dikirim untuk ditinjau, dan kembali
`belum` bila naskahnya dihapus. Karena itu tabel progress tidak pernah mengaku
sebuah artikel sudah siap padahal naskahnya tidak ada.

**Kategori Artikel** menyunting CMS halaman Artikel, bukan koleksi tersendiri.
Perubahannya masuk ke draft dan baru tayang setelah disetujui Ketua — filter di
halaman publik tidak bisa berubah diam-diam. Mengganti nama kategori sekaligus
memindahkan naskah yang memakainya, supaya tidak ada tulisan yang menggantung
pada kategori yang sudah tidak ada.

**Export Excel** menghasilkan `.csv` ber-BOM UTF-8 — terbuka langsung di Excel
dengan dobel-klik, tanpa pustaka apa pun, tetap jalan luring.

### Ruang kerja PJ Buku

Dasbornya menampung **seluruh tahap satu proyek buku dalam satu layar**, bernomor
01 sampai 05: perencanaan dan timeline, pembagian tugas enam peran, progress
penulisan, editing–layouting–desain, lalu produksi, distribusi, dan kasaran modal.
Seperti dasbor peran lain ia baca-saja; setiap penyuntingan dilakukan di halaman
tahapnya masing-masing.

Sistem mengenal **banyak proyek dengan satu yang aktif**. Menandai proyek lain
sebagai aktif otomatis mengarsipkan yang lama, sehingga dasbor tak pernah bercabang
dan buku terdahulu tetap utuh beserta timeline, pembagian tugas, dan modalnya.

Tulang punggungnya adalah `naskah`: satu baris per sub judul yang memuat penulis,
progress tulis, progress edit, dan bukti layout sekaligus. Halaman **Penulisan**,
**Editing**, dan **Layouting** hanyalah tiga cara memandang daftar yang sama — nama
penulis dan sub judulnya mustahil berbeda antar tahap.

**Keuangan Buku** memuat kasaran modal, yaitu *rencana* biaya penerbitan. Uang yang
benar-benar keluar tetap dicatat Bendahara di Buku Kas; keduanya sengaja tidak
dicampur agar rencana yang belum tentu terpakai tidak mengotori pembukuan.

### Ruang kerja PJ Media & Website

Dua peran lama — PJ Website dan PJ Media — kini satu. Kunci peran lamanya tetap
dikenali lewat `ROLE_LAMA` di `rbac.js`, sehingga akun, isi CMS, dan catatan audit
yang menyebut kunci lama tidak kehilangan artinya.

Dasbornya memantau **konten dan performa** sekaligus: empat kartu ringkasan,
kalender konten, statistik website, aktivitas terbaru, tugas, media terbaru,
pintasan, dan pusat kendali cepat.

**Kalender Konten tidak punya koleksinya sendiri.** Ia gabungan berurut-tanggal
dari artikel, agenda, media sosial, dan video — satu hal dicatat di satu tempat
saja, lalu dilihat dari beberapa sudut.

**Statistiknya bukan angka karangan.** Tiap halaman publik yang dibuka memanggil
`Store.catatKunjungan()`, yang membedakan tiga hal: tayangan halaman (tiap
pemuatan), kunjungan (sekali per sesi peramban), dan pengunjung baru (sekali
seumur peramban). Karena prototipe berjalan tanpa server, catatannya tersimpan di
peramban — jadi angkanya mengukur pemakaian prototipe, bukan pengunjung sedunia,
dan halamannya menyatakan batas itu terang-terangan. Bukalah `index.html` beberapa
kali, lalu perhatikan angkanya naik. Bila periode pembandingnya kosong, kartu
menulis "belum ada pembanding" alih-alih mengarang kenaikan dari nol.

**Artikel & Publikasi** dan **Manajemen User** adalah jendela baca-saja: naskah
tetap milik PJ Artikel, akun dan peran tetap milik Ketua. Melihat boleh, mengubah
tidak — ditegakkan di lapisan data, bukan sekadar disembunyikan tombolnya.

### Ruang kerja PJ Koordinator Kajian

Seluruh halamannya terikat pada **Angkatan & Level** yang dipilih di kanan atas —
jadwal, anggota, presensi, materi, hingga statistik. Pilihan itu juga terpampang
di sidebar supaya lingkup yang sedang dilihat tidak pernah samar.

**Status kesiapan tidak disimpan, melainkan dihitung** dari kelengkapan tujuh
butir: pemakalah, moderator, notulen, judul, tempat, PPT, dan revisi. Karena itu
mustahil sebuah kajian tertulis "Siap" padahal notulennya belum ada. Begitu pula
**Notifikasi**, yang diturunkan dari kajian yang datanya kurang, presensinya
tertinggal, atau notulennya belum ditulis — bukan koleksi tersendiri yang bisa
basi.

**Presensi punya tiga keadaan** — hadir, terlambat, tidak hadir — beserta jam
datangnya. Bentuk lama yang hanya berupa daftar nama dipetakan menjadi "hadir",
bukan dibuang.

**QR-nya sungguhan.** `assets/js/qr.js` adalah pembangkit QR yang ditulis sendiri
(mode byte, koreksi galat L, versi 1–4, lengkap dengan Reed–Solomon dan pemilihan
mask) — tanpa pustaka luar, tetap jalan luring. Kartu anggota dapat dicetak dan
dipindai aplikasi kamera bawaan ponsel. Yang tidak bisa dilakukan prototipe ini
adalah *membaca* QR lewat kamera, sebab itu menuntut pustaka pemindai; karena itu
tombol "Mulai Scan" membuka kotak tempat kode hasil pindai ditempel — persis alur
nyatanya. Terlambat ditentukan dari jam sesungguhnya terhadap jam mulai kajian,
dan kode dari angkatan lain ditolak.

QR sengaja hanya membawa id anggota, bukan nama atau surel: kartu ini dicetak dan
dibagikan, jadi yang tercecer tidak boleh membocorkan apa pun.

**Data Anggota** di sini terbatas pada angkatan aktif, dan hanya kolom yang memang
urusannya — jenjang, kelompok, keaktifan. Menambah akun serta mengubah surel dan
peran tetap milik Sekretaris dan Ketua.

### Ruang kerja Bendahara

Rupiah dan pound Mesir adalah **dua kantong terpisah**, bukan hasil konversi satu
sama lain: organisasi benar-benar memegang keduanya. Karena itu tiap transaksi
punya `rp` dan `egp` sendiri — salah satunya boleh nol — dan saldonya tidak pernah
dijumlahkan. Menjumlahkan dua mata uang hanya menghasilkan angka yang tak berarti,
jadi saldo, total, dan laporan selalu menyebut keduanya berdampingan.

Pemasukan terbagi **internal** (iuran per angkatan) dan **eksternal** (infaq dan
donasi), masing-masing punya halamannya sendiri tetapi hidup di satu koleksi
`db.keuangan` yang sama — sehingga buku besar dan laporannya tetap satu kesatuan.

**Akun** di menu Kategori & Akun berarti *tempat uang disimpan* — kas tunai,
rekening bank — bukan akun pengguna. Satu akun memegang kedua mata uang sekaligus,
sehingga satu setoran berisi rupiah dan pound tak perlu dipecah jadi dua catatan,
dan saldo tiap tempat dapat dicocokkan dengan uang yang nyata.

Kasaran modal milik PJ Buku tetap terpisah dari sini: yang di sana adalah *rencana*
biaya penerbitan, yang di sini uang yang benar-benar bergerak.

Perhatikan juga: PJ Media & Website tidak akan menemukan menu Keuangan, dan Bendahara tidak
akan menemukan Editor Halaman. Pembatasan itu ditegakkan di lapisan data, bukan
sekadar disembunyikan dari tampilan.

## Susunan berkas

```
index.html · tentang.html · artikel.html · kontak.html   Halaman publik
erp.html                                                  Panel ERP

assets/js/rbac.js     Peran, izin, matriks wewenang
assets/js/qr.js       Pembangkit QR Code (tanpa pustaka luar)
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

**Identitas visual juga data.** Lambang organisasi dan ikon tab peramban — untuk website
maupun untuk ERP — disimpan di `situs.logo`, `situs.favicon`, dan `situs.faviconErp`,
lalu diganti lewat **Tema & Identitas** di ERP. Tidak ada logo yang ditanam di kode.
ERP memakai versi tayang, sehingga tampilannya pun baru berubah setelah Ketua menyetujui.

Unggahan mempertahankan format: SVG diteruskan apa adanya, PNG/WebP tetap PNG agar latar
transparan utuh, selebihnya jadi JPEG. Logo berlatar putih akan tampak sebagai kotak di
atas header hijau — karena itu pratinjaunya diberi latar kotak-kotak, supaya ketahuan
sebelum diajukan.

**Satu kerangka, banyak wajah.** Ketujuh ruang kerja — Ketua Umum, Sekretaris,
Bendahara, PJ Artikel, PJ Buku, PJ Media & Website, dan PJ Koordinator Kajian —
memakai kerangka ERP yang sama persis; hanya isinya yang berganti. Seluruh
daftarnya pun berbentuk seragam, sehingga tabel, kartu dasbor, dan form isiannya
dibangun satu kali dari spesifikasi `MODUL` di `erp.js`. Menambah kolom cukup
menyunting satu entri; tidak ada tabel yang ditulis dua kali, dan dasbor tak bisa
meleset dari halaman penuhnya.

Sebuah modul boleh menjadi irisan dari koleksi bersama, bukan koleksi utuh: kelima
modul surat memakai `sumber` untuk menyaring `db.surat` yang sama, dan `bawaanBaru`
untuk memastikan surat yang ditambahkan dari modul mana pun membawa kategori yang
benar. Lima jenis SK bahkan dibangkitkan dari peta `JENIS_SK` — menambah jenis SK
baru cukup satu baris di sana, dan submenu, halaman, serta formnya ikut ada.

**Akun bukan jabatan.** `db.users` mencatat siapa yang boleh masuk ERP; `db.pengurus`
mencatat siapa memegang jabatan apa. Keduanya sengaja dipisah: seorang pengurus belum
tentu punya akun, dan pemilik akun belum tentu pengurus.

**Penambalan skema.** DB yang sudah tersimpan di peramban tidak mengenal koleksi yang
baru ditambahkan. `lengkapiDB()` mengisi koleksi yang hilang dari seed saat memuat,
sehingga pembaruan tidak menuntut reset yang membuang kerja pengguna.

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
