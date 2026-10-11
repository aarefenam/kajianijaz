# Kajian Al-I'jaz — Website CMS + ERP Organisasi

Website publik multipage yang seluruh isinya dikendalikan dari ERP, plus panel
operasional organisasi dengan pembagian wewenang antar jabatan. Berjalan di atas
PHP + basis data (MySQL di server, SQLite untuk mencoba setempat), tanpa
`npm install` dan tanpa proses build.

## Cara mencoba

Yang hidup: <https://alijazqurancenter.com>

| Halaman | Alamat |
|---|---|
| Beranda | `/` |
| Tentang Kajian | `/tentang` |
| Artikel | `/artikel` |
| Kontak | `/kontak` |
| Pendaftaran Anggota | `/daftar` |
| Panel ERP | `/erp` |

**Alamatnya tanpa `.html`.** Berkasnya tetap `tentang.html` dan seterusnya;
`.htaccess` (bagian 7) melayani `/tentang` dari berkas itu dan mengalihkan
alamat lama `/tentang.html` secara tetap (301) ke yang baru, sehingga tautan
yang sudah dibagikan tidak mati. Tautan ber-`.html` yang masih tersimpan di CMS
dirapikan saat ditampilkan (`taut()` di `site.js`).

Di komputer sendiri — `php -S` tidak membaca `.htaccess`, jadi pakai perutenya:

```
php -S 127.0.0.1:8137 uji/router.php
```

lalu buka `http://127.0.0.1:8137/` dan `http://127.0.0.1:8137/erp`. Rinciannya
di `DEPLOY.md` bagian 6.

### Akun bawaan

Kata sandi awal tiap akun dibuat acak saat pemasangan, ditampilkan sekali, dan
wajib diganti saat pertama masuk — tidak ada sandi bersama.

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

Sidebarnya disusun mengikuti perjalanan naskah, tiap kelompok dapat dilipat:
**Tinjau** (Naskah Masuk, Menunggu Revisi), **Naskah** (Semua Naskah, Terbit,
Tulisan Saya), **Target** (Penugasan, Capaian Anggota, Rekap Bulanan), dan
**Pengaturan**. Dasbor dibuka dengan antrean *Perlu Ditindak*.

**Target dihitung dari naskah yang dikirim, bukan dari judul yang dibagikan.**
`Store.capaianBulan()` menghitung, untuk tiap anggota aktif yang masih
berkajian, berapa naskah yang ia kirim untuk ditinjau pada bulan itu, lalu
membandingkannya dengan target. Dulu yang dihitung adalah jumlah penugasan per
penulis — membagikan dua judul per orang langsung menghasilkan capaian 100%
tanpa satu naskah pun ditulis.

**Progres penugasan diturunkan, tidak diketik.** Tautannya disimpan di naskah
(`penugasanId`), bukan di penugasan — naskah milik penulisnya, sedangkan
`penugasan` hanya boleh ditulis PJ Artikel — sehingga anggota dapat menautkan
tulisannya sendiri. `Store.progresTugas()` membacanya: belum ada naskah,
sedang ditulis, atau sudah dikirim; tepat waktu atau lewat tenggat. Anggota
melihat penugasannya (judul, arahan, tenggat) di halaman tulisannya dan mulai
menulis dari sana. Penugasan contoh bawaan — 222 baris "siap" tanpa naskah —
dibuang sekali oleh `bersihkanPenugasanContoh()`.

**Anggota boleh mengusulkan judul.** Usulan hidup di draf naskahnya (`usul`);
disetujui PJ Artikel, ia menjadi penugasan bertenggat yang langsung tertaut;
ditolak, wajib beralasan.

**Makalah kajian yang final menjadi draf artikel pemakalahnya**
(`drafDariMakalah()`), sekali per kajian, lengkap dengan tautan makalahnya. Ia
tetap draf: pemakalah yang menyalin isinya dan mengirimnya, lalu ditinjau
seperti naskah lain. Untuk itu `artikel` juga dapat ditulis pemegang
`artikel.assign` — dan hanya sebatas membuat draf atas nama penulisnya; sisanya
ditolak `susunArtikel()`. **Panduan Penulis** dapat dibaca setiap penulis dari
kartu *Penugasan Saya*.

**Capaian Anggota, Rekap Bulanan, dan Laporan Penulisan** semuanya dari rumus
yang sama; laporan bulanan dapat dicetak sebagai lembar A4 berkop, juga oleh
Ketua dari tab *Penulisan* di Pantau Divisi.

**Kategori Artikel** menyunting CMS halaman Artikel, bukan koleksi tersendiri.
Perubahannya masuk ke draft dan baru tayang setelah disetujui Ketua — filter di
halaman publik tidak bisa berubah diam-diam. Mengganti nama kategori sekaligus
memindahkan naskah yang memakainya, supaya tidak ada tulisan yang menggantung
pada kategori yang sudah tidak ada.

**Export Excel** menghasilkan `.csv` ber-BOM UTF-8 — terbuka langsung di Excel
dengan dobel-klik, tanpa pustaka apa pun, tetap jalan luring.

**Siapa boleh berbuat apa pada sebuah naskah ditegakkan server.**
`artikel` boleh ditulis setiap anggota, tetapi izin koleksi saja berarti siapa
pun dapat menerbitkan tulisannya ke website publik, mengubah tulisan orang,
atau menghapus semuanya dengan satu kiriman ke `api/simpan.php`.
`susunArtikel()` di `api/inti.php` membandingkan tiap baris:

- penulis biasa hanya menyentuh naskahnya sendiri, selagi draf atau perlu
  revisi; ia mengirimnya untuk ditinjau atau menariknya kembali, tak lebih;
- menerbitkan dan menarik hanya oleh pemegang `artikel.publish` — dan
  **tulisannya sendiri diterbitkan Ketua Umum**, bukan dirinya;
- artikel terbit tidak dapat dihapus siapa pun; ditarik dulu ke draf.

Naskah yang belum terbit hanya dikirim kepada penulisnya dan pengurus artikel
(`artikelUntuk()`); karena kiriman penulis biasa lalu tidak utuh, koleksinya
disusun ulang dari yang tersimpan dan baris orang lain dipertahankan apa adanya.

**Alur naskah terkunci**: draf → ditinjau → terbit, dengan dua jalan pulang —
dikembalikan untuk revisi (wajib bercatatan) atau ditarik dari website (wajib
beralasan). Perpindahan lain ditolak `periksaPindahArtikel()`; tombol di layar
disusun dari `Store.pindahArtikel()`, jadi yang tampil selalu yang memang
boleh. Naskah yang sedang ditinjau tidak dapat disunting penulisnya sampai ia
menariknya kembali.

**Riwayat tinjauan ditulis server** (`riwayat`): siapa memindahkan dari status
apa ke status apa, kapan, dengan catatan apa. Peramban tidak dapat
memalsukannya. **Tanggal artikel adalah tanggal terbit pertamanya**
(`terbitPertama`) — menarik lalu menerbitkan ulang tidak membuatnya tampak
baru — dan **alamatnya (`slug`) membeku sejak terbit pertama**, unik, dengan
judul non-Latin jatuh ke id-nya.

**Hitungan baca milik server dan tidak memajukan versi.** `api/lihat.php`
dulu menaikkan versi koleksi tiap kali artikel dibuka pengunjung, sehingga
penulis yang sedang menyunting ditolak sebagai "diubah orang lain". Kini ia
menulis tanpa memajukan versi, dan `dilihat` kiriman peramban diabaikan.

### Ruang kerja PJ Buku

Dasbornya menampung **seluruh tahap satu proyek buku dalam satu layar**, bernomor
01 sampai 05: perencanaan dan timeline, pembagian tugas enam peran, progress
penulisan, editing–layouting–desain, lalu produksi, distribusi, dan kasaran modal.
Seperti dasbor peran lain ia baca-saja; setiap penyuntingan dilakukan di halaman
tahapnya masing-masing.

Sidebarnya mengikuti perjalanan sebuah buku: **Proyek**, **Naskah**, **Terbit**,
**Keuangan & Arsip**. Seluruh halamannya mengerjakan **proyek yang dipilih di
kanan atas** — membuka sebuah proyek tidak mengubah statusnya, sehingga
beberapa proyek dapat berjalan bersamaan dan proyek lama dapat ditengok tanpa
mengarsipkan yang lain. Dasbor dibuka dengan antrean dari seluruh proyek yang
berjalan.

**Siklus proyek**: rencana → berjalan → terbit, atau dihentikan dengan alasan;
membuka kembali pun beralasan, dan semuanya tercatat di `riwayatStatus`. Buku
baru dapat dinyatakan terbit setelah seluruh sub judulnya selesai disunting.
**Tahap proyek diturunkan dari isinya** (`Store.tahapBuku()`), bukan dipilih
tangan. **Proyek yang sudah memuat naskah, dokumen, kegiatan produksi, atau
dirujuk transaksi Buku Kas tidak dapat dihapus** — ditegakkan juga `jagaBuku()`
di server. Timeline bertanda selesai, dan tahapan yang lewat tanggalnya masuk
antrean. Website publik menampilkan buku yang terbit dan yang sedang digarap.

Tulang punggungnya adalah `naskah`: satu baris per sub judul. Halaman
**Penulisan**, **Editing**, dan **Layout** adalah tiga cara memandang daftar yang
sama. **Progresnya tidak lagi diketik**: penulis menyerahkan tautan naskahnya,
anggota tim editor menyerahkan tautan suntingannya — keduanya dari halaman
*Buku Saya*, lewat `api/petugas-buku.php` yang mencocokkan petugas dengan sesi —
dan **PJ Buku yang menerima atau mengembalikan** (wajib bercatatan). Yang sudah
diterima terkunci bagi petugasnya sampai PJ Buku membukanya kembali. Tiap sub
judul punya tenggat tulis, sunting, dan tata letak; yang terlewat masuk antrean.
Tim editor bekerja bersama: siapa pun anggotanya boleh menyerahkan suntingan,
dan namanya tercatat.

**Kasaran modal, dokumen, dan penjualan hanya dikirim kepada PJ Buku,
Bendahara, dan Ketua** (`bukuUntuk()`); penulis dan editor tetap menerima
naskah, tim, dan timeline proyeknya.

**Stok diturunkan dari empat daftar**: produksi (kegiatan cetak beserta jumlah
eksemplarnya, masuk stok saat ditandai selesai), distribusi (titipan per
wilayah), penjualan (satu baris per pembeli), dan setoran. `Store.stokBuku()`
menghitung dicetak, dititipkan, terjual, dan sisa — keseluruhan dan per
wilayah — dan aturannya saling mengunci: titipan tak boleh melebihi cetakan,
penjualan tak boleh melebihi sisa wilayahnya, dan cetakan tak dapat dibatalkan
bila sudah dititipkan. Harga 0 berarti dibagikan cuma-cuma.

**Uang penjualan sampai ke Bendahara lewat setoran.** PJ Buku memilih
penjualan yang uangnya diserahkan lalu *mengajukan setoran*; Bendahara
*menerima*-nya dari halaman Pemasukan Internal, yang mencatat satu pemasukan di
Buku Kas dan menautkannya (`setoranId`). Status "diterima" karena itu
diturunkan dari Buku Kas, bukan ditulis PJ Buku — pusat keuangan tetap satu.
Penjualan yang sudah masuk setoran terkunci; setoran yang belum diterima dapat
ditarik.

**Anggaran & Realisasi** memuat kasaran modal (*rencana*), pengeluaran yang
benar-benar tercatat di Buku Kas, harga jual per eksemplar, uang penjualan
(tercatat, diterima, diajukan, belum disetor), dan titik impas — tiap mata uang
dihitung sendiri-sendiri, tanpa kurs yang dikira-kira.

**Laporan Proyek Buku** (`lembarLaporanBuku()`) siap cetak sebagai lembar A4
berkop: ringkasan, naskah, timeline dan produksi, distribusi dan penjualan,
serta keuangan. Ketua membacanya dari tab *Buku* di Pantau Divisi.

### Ruang kerja PJ Media & Website

**SEO dipasang server, bukan JavaScript.** Isi website dirender di peramban,
sehingga mesin pencari dan pratinjau tautan (WhatsApp, Telegram) dulu hanya
melihat judul statis tiap berkas — dan halaman SEO di ERP tidak dibaca apa pun.
Kini halaman publik disajikan `halaman.php`: berkas `.html`-nya dibaca apa
adanya, lalu `<title>`, deskripsi, kata kunci, robots, alamat kanonik, dan tag
Open Graph di `<head>`-nya diganti dengan yang diatur di ERP. Artikel yang
dibuka langsung (`/artikel?buka=ID`) memakai judul, ringkasan, dan sampulnya
sendiri; naskah yang belum terbit tidak pernah bocor ke sana. Berkas yang sama
membuat `/robots.txt` dan `/sitemap.xml` (halaman + seluruh artikel terbit).
Bila basis data tak terjangkau, halaman tetap tersaji dengan `<head>` aslinya.

**Agenda dan video langsung tampil, tanpa persetujuan Ketua** — isinya rutin —
tetapi aturannya dijaga: tautan video wajib http(s), yang sedang tampil harus
dijadikan draf sebelum dihapus, dan status *Dijadwalkan* membuatnya tampil
sendiri pada tanggal *Mulai Tampil* (`tayangKah()` di peramban dan server).

**Dua pintu publik dijaga.** Formulir kontak (`api/pesan.php`) punya jebakan
bot dan batas lima pesan per jam per alamat. Hitungan pengunjung
(`api/kunjung.php`) dibatasi 120 penanda per jam per alamat dan ditulis dalam
transaksi pengunci — dulu dua kunjungan bersamaan saling menimpa. Alamat
pengirim hanya disimpan sebagai sidik.

**Kartu Struktur Organisasi dapat berfoto.** Tiap jabatan punya medan `foto`
yang diunggah dari Editor Halaman; tanpa foto, kartunya memakai ikon jabatan.
Editor mengenali medan gambar dari isinya, sehingga foto yang masih kosong
dulu tampil sebagai kotak teks — `KUNCI_GAMBAR` membuat medan bernama `foto`
selalu berupa kotak unggah, lengkap dengan tombol hapus. Seperti perubahan CMS
lain, foto masuk draft dan tayang setelah disetujui.

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

**Keadaan kajian yang disimpan hanya tiga**: terjadwal, ditunda, dibatalkan.
"Selesai" diturunkan dari tanggalnya. Menunda dan membatalkan selalu menuntut
alasan, yang tersimpan di `riwayat` kajiannya; menunda dengan tanggal baru
langsung menjadwalkan ulang, tanpa tanggal ia berstatus Ditunda. Kajian yang
ditunda atau dibatalkan tidak dihitung dalam kehadiran, rekap, maupun antrean,
dan yang dibatalkan tidak dikirim ke website publik.

**Kajian yang sudah memuat presensi atau notulen tidak dapat dihapus** — hanya
dibatalkan. Aturan ini ditegakkan `Store.hapusKajian()` dan, di server,
`jagaKajian()`, yang juga memastikan hanya penjadwal (`kajian.manage`) yang
dapat menambah atau membuang baris kajian; pemegang izin presensi dan notulen
hanya mengubah isinya.

**Formulir jadwal memeriksa** (`periksaKajian()`): pemakalah, moderator, dan
notulen harus anggota aktif angkatan kajian itu dan tiga orang yang berbeda —
ketiganya boleh dikosongkan dulu; satu angkatan tak boleh punya dua kajian pada
tanggal yang sama; tanggal dan angkatan kajian yang sudah berpresensi terkunci.
Yang diperiksa hanya yang berubah, sehingga kajian lama tetap dapat disunting.

**Peserta sebuah kajian dibekukan** begitu presensi pertamanya dicatat
(`k.peserta`). Sebelum itu ia mengikuti keanggotaan angkatan; sesudahnya
tidak, sehingga anggota yang kelak nonaktif atau pindah angkatan tak mengubah
angka kajian yang sudah lewat. Peserta adalah anggota aktif yang masih
berjenjang — alumni dan pendiri tidak dituntut hadir. Seluruh halaman memakai
**satu rumus**: `Store.rekapKajian()` untuk satu kajian dan
`Store.kehadiranAnggota()` untuk satu orang; dulu ada tiga rumus dengan
pembagi yang berbeda-beda.

**Kelompok tidak lagi dipatok di kode.** Daftarnya adalah kelompok yang dipakai
anggota angkatan itu, dan kelompok baru cukup diketik. *Bagi Kelompok* membagi
peserta ke N kelompok (mengisi yang belum berkelompok, acak ulang, atau urut
nama) dengan pratinjau sebelum disimpan; *Ubah Jenjang* menaikkan seluruh
peserta angkatan sekaligus.

**Presensi punya lima keadaan** — hadir, terlambat, izin, sakit, tidak hadir —
dan **seluruh perubahannya lewat `api/presensi.php`**, bukan lewat penyimpanan
koleksi biasa. Tiap catatan adalah satu perubahan kecil pada satu kajian yang
ditulis dalam transaksi pengunci, sehingga beberapa ponsel dapat memindai di
pintu yang sama tanpa saling menolak; dulu seluruh koleksi `kajian` terkirim
tiap pindaian, dan pindaian ponsel kedua hilang oleh 409. Server mengembalikan
baris kajian terbaru (dan seluruh koleksi bila peramban tertinggal), sementara
`jagaKajian()` menolak perubahan presensi yang datang lewat `simpan.php`.

Karena jalurnya satu, aturannya ditegakkan di sana:

- **Jatah izin + sakit: 2 kali per anggota per jenjang** (`JATAH_IZIN`).
  Pengajuan yang masih menunggu ikut terhitung; yang ditolak tidak.
- **Anggota mengajukan izin sendiri** dari *Kajian Saya*; koordinator
  menyetujui atau menolak (penolakan wajib beralasan) dari halaman Presensi.
  Koordinator juga dapat mencatat izin langsung, dengan alasan.
- **Tutup Presensi mengunci.** Yang belum tercatat menjadi tidak hadir;
  sesudah itu hanya penjadwal kajian yang dapat mengubah, wajib beralasan, dan
  tiap perubahan tercatat di `ubahPresensi`. Membuka kembali pun beralasan.
- **Alasan izin bersifat pribadi**: `kajianUntuk()` hanya mengirimkannya kepada
  pengurus presensi dan pemiliknya sendiri.

Hadir atau terlambat tetap diputuskan peramban petugas dari jam setempat —
server tidak tahu zona waktu tempat kajiannya berlangsung.

**Giliran tugas dihitung, bukan diingat.** `Store.bebanTugas()` menghitung
berapa kali tiap peserta memegang tiap tugas; formulir jadwal mengurutkan
pilihan petugas dari yang paling jarang, dan kartu *Giliran Tugas* di bawah
jadwal menampilkan siapa yang belum pernah bertugas. Petugas kajian mendatang
yang izin, sakit, nonaktif, atau pindah angkatan ditandai di tabel dan masuk
antrean *Petugas Berhalangan* (`Store.petugasBerhalangan()`).

**Materi & Makalah menyimpan tautan, bukan berkas** — ruang hosting terbatas.
Tiap kajian punya tautan makalah, tautan PPT, tenggat makalah (bawaan tiga
hari sebelum kajian), dan status revisi bertahap: belum diserahkan → menunggu
diperiksa → perlu revisi (wajib bercatatan) → final. Pemakalah menyerahkan
tautannya sendiri dari *Kajian Saya* lewat `api/petugas-kajian.php`, yang
mencocokkan pemakalah kajian dengan sesi dan hanya menyentuh kolom makalahnya;
makalah yang sudah final terkunci baginya. Makalah lewat tenggat dan makalah
yang menunggu diperiksa masuk antrean dasbor. Kolom boolean `ppt` dan `revisi`
tetap dipelihara, sebab kesiapan kajian membacanya.

**Notulen terstruktur dan bertahap.** Empat bagian tetap — ringkasan
pembahasan, poin diskusi, kesimpulan, tindak lanjut — dan tiga keadaan: draf →
diajukan → sah. Petugas notulen menulis dan mengajukannya sendiri dari *Kajian
Saya* (`api/petugas-kajian.php`); pengurus notulen mengesahkan, atau
mengembalikannya dengan catatan. Notulen yang sah terkunci sampai dibuka
kembali, dan dapat dicetak sebagai lembar A4 berkop dengan data kajian dan
kehadirannya. Teks polos `notulensi` tetap dipelihara dari keempat bagian itu,
dan notulen lama yang hanya berupa teks dibaca sebagai sah.

**Rekap & Statistik berperiode dan siap cetak.** Rentang tanggal menyaring
angka, grafik, dan tabelnya; *Cetak Laporan* (`lembarLaporanKajian()`) menyusun
lembar A4 berkop: ringkasan, tabel pertemuan, kehadiran tiap peserta, giliran
tugas, serta kajian yang ditunda atau dibatalkan beserta alasannya. Lembar yang
sama dapat dicetak Ketua dan Sekretaris dari Pantau Divisi untuk satu angkatan,
dan pengajuan izin juga tampil di sana bagi pemegang izin presensi.

**Kajian Saya** tersedia bagi setiap anggota yang masih berkajian, apa pun
perannya: kajian mendatang angkatannya, tugas yang ia pegang, sisa jatah izin,
dan riwayat kehadirannya.

**Jejak audit digabung, bukan dikunci versi.** Setiap penyimpanan menyertakan
`audit`; selama ia ikut dikunci versi, dua pengurus yang bekerja bersamaan
selalu saling menolak, apa pun yang mereka kerjakan. `gabungAudit()` di server
kini menambahkan baris baru ke yang tersimpan.

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

## Siapa menerima data apa

Wewenang menulis dijaga per koleksi dan per baris. **Wewenang membaca dijaga
`IZIN_BACA`** di `api/rbac.php`, dan ditegakkan `saringBaca()` saat `api/muat.php`
menjawab pengguna yang sudah masuk. Dulu seluruh koleksi dikirim kepada siapa
pun yang masuk dan hanya layarnya yang menyembunyikan: anggota biasa menerima
Buku Kas, arsip surat, pesan pengunjung beserta surelnya, dan gambar tanda
tangan pengurus di perambannya.

- Anggota biasa menerima jadwal kajian, artikel terbit, daftar nama anggota,
  buku, penugasan, dan data miliknya sendiri — iurannya, naskahnya, data dirinya.
- Buku Kas, akun, anggaran: pengurus keuangan dan Ketua. PJ Buku menerima
  transaksi yang tertaut ke proyek buku saja.
- Surat, templat, tanda tangan, sertifikat: Sekretaris dan Ketua.
- Pesan form kontak: pemegang `pesan.read`. Jejak audit: pemegang `audit.view`.
- **Surel adalah identitas masuk**: hanya pengelola anggota yang melihat surel
  orang lain. Kolomnya dikosongkan saat dikirim dan dikembalikan
  `pulihkanSurel()` saat `users` dikirim balik, sehingga menyimpan profil
  sendiri tidak menghapus surel siapa pun.
- Koleksi yang tak boleh dibaca dikirim kosong dengan bentuk yang sama, bukan
  dibuang — kalau dibuang, peramban mengisinya dari data contoh.
- Siapa pun yang boleh menulis sebuah koleksi otomatis boleh membacanya utuh.

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
