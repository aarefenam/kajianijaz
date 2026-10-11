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

Sidebar Ketua Umum disusun menurut **tugas**, bukan menurut modul — empat
kelompok yang masing-masing menjawab satu pertanyaan:

| Kelompok | Pertanyaan | Isi |
|----------|------------|-----|
| **Putuskan** | Apa yang menunggu keputusan saya? | Persetujuan Website, Tinjau Artikel, Kotak Masuk |
| **Pantau** | Bagaimana jalannya organisasi? | Program Kerja, Evaluasi & Tindak Lanjut, Pencapaian, Pantau Divisi, Laporan |
| **Struktur** | Siapa memegang apa? | Data Anggota, Data Pengurus, Koordinator Kajian, Hak Akses |
| **Sistem** | Pengaturan yang jarang disentuh | Pengaturan |

**Pantau Divisi** dan **Pengaturan** adalah halaman bertab. Pengaturan memuat
Editor Halaman, Tema & Identitas, Riwayat Versi, Kategori Artikel, dan Log
Aktivitas. Pantau Divisi memuat tiga tab yang membaca data yang sama dengan
ruang kerja tiap PJ, tetapi dari sudut pemantau:

- **Kajian** — seluruh angkatan dalam satu tabel, dengan angka kehadiran,
  tanda notulen, dan saringan angkatan. Ketua tetap dapat menjadwalkan,
  menyunting, mengabsen, dan menghapus dari sini.
- **Kas & Saldo** — saldo rupiah dan pound, saldo per akun, arus kas bulanan,
  unduhan laporan, dan buku besar. Hanya baca.
- **Arsip Surat** — empat kategori surat dalam satu tabel yang dapat dicari dan
  disaring. Hanya baca.

Alamat lama tiap modul (`#cms`, `#kajian`, `#keuangan`, dan seterusnya) tetap
berlaku dan membuka tabnya.

**Program Kerja** adalah nama baru Kaleidoskop Kegiatan & Program; datanya tetap
di koleksi `kaleidoskop`.

Tiap program bertanggal mulai dan selesai, berpenanggung jawab, berdivisi, dan
bercatatan. Daftarnya terurut menurut tanggal mulai. **Terlambat** bukan status
yang disimpan: ia diturunkan dari tanggal selesai dan hari ini, lalu hilang
sendiri begitu program ditandai selesai. Teks waktu lama berupa bulan dan tahun
("Mei 2025") dibentangkan otomatis menjadi sebulan penuh; yang tak terbaca
dibiarkan kosong dan ditandai *tanggal belum diisi*.

**Laporan & Ringkasan** merangkum seluruh organisasi dalam satu halaman siap
cetak: program kerja, kajian per angkatan, karya tulis, keuangan, keanggotaan,
pencapaian, dan evaluasi. Tiap angkanya dihitung dari koleksi yang sama dengan
ruang kerja PJ-nya — tak ada yang diketik di halaman ini. Tombol **Cetak
Laporan** memanggil pencetak peramban; lembar gaya cetak menyingkirkan sidebar
dan tombol. Bagian keuangan hanya tampil bagi pemegang `keuangan.report`.

**Evaluasi & Tindak Lanjut** mencatat lebih dari temuan: tiap evaluasi berstatus
(Terbuka, Dikerjakan, Tuntas), berpenanggung jawab, boleh bertenggat, dan boleh
dikaitkan dengan satu program kerja. Yang belum tuntas tampil lebih dulu;
*Lewat Tenggat* diturunkan dari tenggatnya, seperti *Terlambat* pada program.

**Data Pengurus** dan **Koordinator Kajian** tetap daftar tersendiri, tetapi
orangnya dipilih dari Data Anggota. Selama terhubung, nama yang tampil mengikuti
Data Anggota; baris yang orangnya bukan anggota, atau anggotanya sudah dihapus,
memakai nama yang tersimpan dan ditandai *belum terhubung ke Data Anggota*.
Tautan awal dipasang otomatis hanya bila namanya cocok dengan tepat satu anggota.

Judul tiap kelompok di sidebar — pada semua peran — adalah tombol lipat. Saat
terlipat ia memikul jumlah lonceng anggotanya, dan berpindah ke halaman di
dalamnya membukanya kembali. Pilihan lipat disimpan di peramban tiap orang.

Dasbor dibuka dengan **Menunggu Keputusan Anda** — tiga antrean kelompok
Putuskan beserta jumlahnya, dihitung dengan cara yang sama dengan lonceng di
sidebar — lalu **Program Kerja Berjalan**: kemajuan periode dan program yang
belum rampung.

Di bawahnya lima daftar kepengurusan — Data Pengurus, Koordinator Kajian,
Program Kerja, Pencapaian, dan Evaluasi & Tindak Lanjut. Seluruh dasbor **hanya etalase
pintasan**; tidak ada data yang ditulis dari sana. Kartunya memangkas isi
(beberapa baris awal, tanda `…`, lalu baris terakhir), dan setiap aksi — Tambah
Data, sunting, hapus, maupun centang Selesai — membuka dulu halaman modulnya,
baru melanjutkan maksud aksi itu di daftar penuh.

### Ruang kerja Sekretaris

Sidebar Sekretaris memakai cetakan yang sama dengan Ketua — disusun menurut
tugas:

| Kelompok | Pertanyaan | Isi |
|----------|------------|-----|
| **Tindak Lanjuti** | Apa yang menunggu saya? | Kotak Masuk, Surat Masuk, Notulen & Presensi |
| **Persuratan** | Surat apa yang kami terbitkan? | Surat Internal, Eksternal, Keputusan, Templat Surat |
| **Dokumen** | Dokumen resmi apa yang kami pegang? | Sertifikat, Tanda Tangan, Arsip Kepenulisan |
| **Keanggotaan** | Siapa anggota kami? | Data Anggota, Data Alumni, Kartu Anggota |
| **Sistem** | Yang jarang disentuh | Pengaturan (Editor Halaman, Persetujuan, Log) |

**Notulen & Presensi** memakai tabel kajian yang sama dengan Pantau Divisi milik
Ketua — seluruh angkatan, dengan angka kehadiran dan tanda notulen — tetapi
tanpa tombol jadwal, sunting, dan hapus: yang tersisa persis tugas Sekretaris,
yakni memindai presensi dan menulis notulen. Saringan *Belum bernotulen* dan
*Belum ada presensi* menampilkan yang masih menuntut kerja.

**Data Anggota** adalah satu pintu keanggotaan: seluruh anggota per angkatan,
dapat disaring menurut status, jenjang, dan *belum ganti sandi awal*, serta
dicari dengan nama, surel, atau nomor induk. Tombol **setel ulang kata sandi**
ada di tiap baris — layar masuk memang menyuruh orang yang lupa sandi
menghubungi Sekretaris.

**Sertifikat** dan **Tanda Tangan** terhubung ke Data Anggota seperti Data
Pengurus: pemilik tanda tangan dan penerima sertifikat dipilih dari sana, dan
namanya mengikuti. Penerima sertifikat boleh tetap berupa teks — orang luar
atau "Seluruh Peserta" — tanpa dianggap keliru.

Dasbornya dibuka dengan **Perlu Ditindaklanjuti**: pesan belum dibaca, surat
masuk yang baru diterima, surat yang masih draft, kajian selesai tanpa notulen,
dan akun aktif yang belum mengganti sandi awalnya.

Di bawahnya, Sekretaris memakai dasbor berupa **ubin pintasan**: delapan modul persuratan,
dokumen, dan keanggotaan, masing-masing memampangkan jumlah dokumennya sebagai
isyarat beban kerja. Menekan ubin membuka halaman modulnya — sama seperti dasbor
Ketua, tidak ada data yang ditulis dari dasbor.

Persuratan terbagi empat kategori — **Internal**, **Eksternal**, **Keputusan**,
dan **Masuk** — yang semuanya hidup di satu koleksi `db.surat` agar
penomoran dan arsipnya tetap satu kesatuan. Surat Keputusan punya cabang lagi
berupa lima jenis SK, yang bisa dibentangkan dari sidebar maupun dari ubinnya.

Kategori *Surat Keluar* dilebur: surat yang diterbitkan organisasi cukup
dibedakan Internal dan Eksternal. Isi kategori lamanya hanya data contoh dan
dibuang saat data dimuat.

**Surat disusun dari blok.** Tiap surat Internal, Eksternal, dan Keputusan
adalah larik blok — Kop Surat, Nomor & Perihal, Tempat & Tanggal, Tujuan, Isi,
Tanda Tangan, Garis, Jarak — yang dapat disisipkan di mana pun, disunting,
diurutkan, dan dibuang di halaman **Susun Surat**, dengan lembar A4 di
sebelahnya yang menggambar ulang seketika. Bloknya disimpan pada arsip surat
itu sendiri (`surat.blok`): menambah surat langsung membuka penyusunnya, jadi
setiap surat yang disusun sudah bernomor dan sudah tercatat di arsip.

- **Templat Surat** (`templatSurat`) adalah susunan blok yang disalin ke surat
  baru. Mengubah templat tidak mengubah surat yang sudah terbit.
- Blok Tanda Tangan mengambil sampai tiga penandatangan dari Kumpulan Tanda
  Tangan. Penanda `{{nomor}}`, `{{perihal}}`, `{{tujuan}}`, dan `{{tanggal}}`
  pada isi diganti data suratnya.
- **Unduh PDF** memakai pencetak peramban ("Simpan sebagai PDF") pada kertas A4
  — tanpa pustaka PDF dan tanpa perubahan server.
- Tata letak lembarnya masih sementara, menunggu templat resmi organisasi.

**Surat Masuk** tidak disusun, melainkan ditindaklanjuti: ia berpenanggung
jawab, bertenggat, dan ditandai *Lewat Tenggat* bila masih berstatus Diterima
sesudah tenggatnya. Semua surat dapat dilampiri gambar pindaian.

**Nomor surat dan sertifikat terisi otomatis.** Polanya
`URUT/KODE/BULAN-ROMAWI/TAHUN` — `013/AI/VI/2025` — dengan kode `AI` (internal),
`AI-E` (eksternal), `SK-AI` (keputusan), `MSK` (masuk), dan `SRT-A/AI`,
`SRT-P/AI`, `SRT-K/AI` untuk sertifikat anggota, pemateri, dan kegiatan. Urutan
dihitung dari arsip — tertinggi untuk kode dan tahun yang sama, ditambah satu —
dan mengikuti tanggal yang dipilih selama nomornya belum diubah tangan. Nomor
boleh diubah; nomor yang sudah dipakai ditolak.

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

### Kartu anggota, presensi, dan pemindai

Tiap anggota bernomor induk tetap berpola `AI-ANGKATAN-URUT` — `AI-10-007`,
anggota ketujuh Angkatan X; pendiri memakai `00`. Nomor diberikan sekali saat
anggota ditambahkan dan tidak berubah, jadi kartu yang sudah dicetak tetap sah.
Sekretaris mencetaknya dari **Kartu Anggota**: QR-nya memuat nomor induk saja,
bukan nama atau surel. Kode lama `AIJZ-…` tetap terbaca.

Kartunya seukuran kartu pelajar (85,6 × 54 mm): pita organisasi, pas foto,
nama, nomor induk, angkatan, jenjang, status, dan QR. *Cetak Kartu* menyusun
delapan kartu per lembar A4 dengan garis potong.

**Pendaftaran dan data diri.** Anggota baru masuk lewat dua pintu:

- **`daftar.html`** — formulir publik. Ia hanya *mengajukan*: permohonan masuk
  ke antrean `pendaftaran`, ditinjau Sekretaris di halaman **Pendaftaran**, dan
  baru menjadi anggota — bernomor induk, berakun, berkata sandi pertama — saat
  diterima. Yang ditolak langsung kehilangan data pribadinya.
- **Data Anggota → Tambah Anggota** — langsung oleh Sekretaris, seperti semula.

Data diri — nomor paspor, alamat, telepon, tempat dan tanggal lahir, pas foto —
disimpan di koleksi `dataDiri`, terpisah dari `users` yang tampil di website.
`api/muat.php` hanya mengirimkan `dataDiri` dan `pendaftaran` kepada pemegang
`anggota.manage`; peran lain menerima baris miliknya sendiri saja, atau tidak
sama sekali. Tak satu pun data ini tercetak di kartu anggota.

**Kartu Saya** tersedia bagi semua peran: tiap anggota melihat kartunya
sendiri, mencetaknya, dan **mengunggah pas fotonya tanpa menunggu Sekretaris** —
fotonya langsung terpasang di kartu. Karena `dataDiri` tak boleh ditulisnya,
unggahan itu lewat `api/foto-kartu.php`, yang hanya menyentuh satu kolom pada
satu baris: foto milik yang sedang masuk, dengan id diambil dari sesi.

`api/daftar.php` terbuka tanpa masuk, jadi ia dibatasi: tiga permohonan per jam
per perangkat, kolom jebakan untuk robot, pas foto diperiksa sebagai gambar
sungguhan (SVG ditolak), dan jawabannya tidak membedakan surel yang sudah
terdaftar dari yang belum.

**Mode Presensi** adalah layar penuh untuk petugas di pintu kajian. Kamera
ponsel membaca QR kartu, lalu nama dan statusnya tampil besar:

- *Hadir* atau *Terlambat* ditentukan jam sesungguhnya terhadap jam mulai dan
  **batas terlambat** kajian itu — diatur koordinator saat menjadwalkan,
  bawaannya 10 menit.
- Yang terlambat tetap boleh masuk; ia hanya tercatat terlambat.
- Kartu yang terpindai lagi tidak menggeser jam datangnya yang pertama.
- **Tutup Presensi** mencatat tidak hadir semua peserta yang belum memindai.
  Yang datang sesudahnya masih dapat memindai dan berubah menjadi terlambat.

Peramban yang punya `BarcodeDetector` (Chrome di Android) membaca QR sendiri.
Yang tidak — iPhone, Firefox — memakai `assets/js/vendor/jsQR.js`, satu-satunya
pustaka luar di proyek ini, dimuat hanya saat kamera dipakai. Kolom ketik
nomor induk selalu tersedia sebagai cadangan. Kamera menuntut HTTPS dan izin
dari pengguna.

**Iuran lewat kartu yang sama.** Bendahara menekan *Pindai Kartu* di Pemasukan
Internal atau di **Iuran per Anggota**: kartu dipindai, nama dan nominal iuran
terisi, tinggal disimpan — lalu layar siap untuk kartu berikutnya. Iuran
tersimpan sebagai transaksi kas biasa yang bertaut ke anggotanya (`userId`) dan
ke bulan yang dibayarnya (`bulanIuran`), jadi buku kas tetap satu.

Nominal iuran bulanan — rupiah, pound, atau keduanya — ditetapkan Bendahara dan
disimpan di koleksi `aturKas`. Anggota lunas bila rupiah **atau** poundnya
mencapai nominal; ia membayar dengan salah satu. Halaman Iuran per Anggota
menampilkan siapa lunas, bayar sebagian, atau belum untuk bulan yang dipilih,
dapat disaring dan diunduh sebagai CSV.

### Ruang kerja Bendahara

Sidebar Bendahara mengikuti jalannya uang:

| Kelompok | Pertanyaan | Isi |
|----------|------------|-----|
| **Terima** | Uang apa yang masuk? | Iuran per Anggota, Pemasukan Internal, Pemasukan Eksternal |
| **Keluarkan** | Uang apa yang keluar? | Pengeluaran, Transfer & Tukar |
| **Periksa** | Apakah bukunya cocok? | Saldo & Akun, Tutup Buku |
| **Laporkan** | Apa yang kusampaikan? | Laporan Keuangan, Anggaran & Realisasi |
| **Pengaturan** | Yang jarang disentuh | Kategori & Akun, periode kepengurusan |

**Status transaksi.** `sah` dihitung dalam saldo dan laporan; `menunggu`,
`ditolak`, dan `batal` tetap tampak di buku tetapi tidak dihitung. Transaksi
lama tanpa status dianggap sah.

- **Nomor bukti** otomatis: `BKM` (kas masuk), `BKK` (kas keluar), `BTR`
  (transfer), kode periode, nomor urut — `BKK-2627-0014`. Periodenya masa
  kepengurusan yang ditetapkan Bendahara, bukan tahun kalender.
- **Persetujuan.** Pengeluaran sah setelah disetujui Ketua Umum di halaman
  *Persetujuan Pengeluaran*. Ketua menetapkan batasnya; nol berarti semua
  nominal perlu disetujui. Aturan ini ditegakkan `jagaKas()` di
  `api/inti.php`: Bendahara tak dapat mengesahkan pengeluarannya sendiri dan
  Ketua tak dapat mengubah isinya, sekalipun memanggil API langsung.
- **Transfer & Tukar** memindahkan uang antar akun atau menukar mata uang
  tanpa dihitung sebagai pemasukan atau pengeluaran.
- **Batalkan, bukan hapus.** Transaksi dibatalkan dengan alasan dan tetap
  tercoret di buku; hapus permanen hanya untuk yang dicatat hari itu juga.
  Perubahan nominal, akun, dan tanggal tercatat pada riwayat transaksinya.
- **Tutup Buku** per bulan, setelah mencocokkan uang yang benar-benar ada
  dengan saldo buku; selisihnya wajib dijelaskan. Bulan yang ditutup terkunci
  di peramban dan di server. Hanya Ketua yang dapat membukanya kembali.
- **Akun dan kategori** yang masih dipakai tak dapat dihapus, cukup
  dinonaktifkan. Mengganti nama kategori ikut mengganti namanya di seluruh
  transaksinya. Saldo awal akun yang sudah bertransaksi berubah hanya dengan
  alasan.
- **Anggaran** per kategori pengeluaran untuk satu periode; realisasinya
  dihitung dari buku kas. Transaksi dapat ditautkan ke **Program Kerja** dan
  **Proyek Buku** — biaya program tampil di ruang kerja Ketua, realisasi buku
  di ruang kerja PJ Buku. Pusat keuangan tetap satu.
- **Iuran:** tunggakan dihitung sejak awal periode (atau sejak anggota
  bergabung), dapat dibayar beberapa bulan sekaligus, dan berkuitansi.
- **Laporan** siap cetak — saldo awal, pemasukan dan pengeluaran per kategori,
  transfer, saldo akhir, dua mata uang — untuk bulan berjalan, bulan lalu,
  triwulan kalender, periode kepengurusan, atau rentang bebas. Rinciannya
  tetap dapat diunduh sebagai CSV.

`uji/nama-bentrok.py` memeriksa nama tingkat-atas yang dideklarasikan dua kali
di antara skrip ERP — kesalahan yang menggugurkan satu skrip seluruhnya dan
tak terlihat oleh `node --check`.

### Ruang kerja PJ Koordinator Kajian

Seluruh halamannya terikat pada **Angkatan & Level** yang dipilih di kanan atas —
jadwal, anggota, presensi, materi, hingga statistik. Pilihan itu juga terpampang
di sidebar supaya lingkup yang sedang dilihat tidak pernah samar.

Sidebarnya disusun mengikuti perjalanan satu kajian, tiap kelompok dapat
dilipat: **Kajian** (Jadwal & Tugas, Presensi, Materi & Makalah, Notulen),
**Peserta** (Anggota & Kelompok, Kehadiran Anggota), **Laporan** (Rekap &
Statistik), dan **Pengaturan** (Lingkup Kajian). Pembagian Tugas melebur ke
Jadwal — formulirnya memang satu — dan alamat lamanya tetap berlaku sebagai
alias. Lingkup angkatan & level diingat per peramban.

Dasbor dibuka dengan antrean **Perlu Ditindak** (`antreanKajian()`), yang
menggantikan halaman Notifikasi: kajian sepekan ke depan yang datanya kurang,
kajian lampau tanpa presensi, presensi yang belum ditutup, notulen yang belum
ditulis, anggota tanpa kelompok, dan anggota berkehadiran di bawah 75%.
Semuanya dihitung `perluKajian()` dalam lingkup yang sedang dibuka — dulu
notifikasi menghitung seluruh angkatan, sehingga angkanya tak cocok dengan
halaman yang dibukanya.

**Status kesiapan tidak disimpan, melainkan dihitung** dari kelengkapan tujuh
butir: pemakalah, moderator, notulen, judul, tempat, PPT, dan revisi. Karena itu
mustahil sebuah kajian tertulis "Siap" padahal notulennya belum ada. Antrean
dasbor diturunkan dengan cara yang sama — bukan koleksi tersendiri yang bisa
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

Batas itu **ditegakkan server**, bukan hanya layar. `jagaUbahPengguna()` di
`api/inti.php` membandingkan tiap baris `users` yang dikirim dengan yang
tersimpan: pemegang `anggota.kelompok` hanya boleh mengubah jenjang, kelompok,
dan keaktifan orang lain serta profilnya sendiri; pemegang `anggota.manage`
boleh menambah dan mengubah data anggota tetapi tidak peran — akun baru lahir
sebagai `anggota`; peran, serta surel dan status akun Ketua Umum, hanya dapat
diubah pemegang `user.manage`. Sebelum penjaga ini ada, izin diperiksa per
koleksi saja, sehingga Koordinator maupun Sekretaris dapat menaikkan perannya
sendiri menjadi Ketua Umum dengan satu kiriman ke `api/simpan.php`.

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
