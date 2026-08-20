# Menyambungkan Hosting Hostinger ke GitHub & VS Code

Catatan lapangan untuk `alijazqurancenter.com`.

> **Repo ini publik.** Alamat IP server, nama pengguna hosting, dan port
> SSH sengaja **tidak** ditulis di sini. Ketiganya dapat dilihat kapan
> saja di **hPanel → Tingkat lanjut → Akses SSH**. Menuliskannya di repo
> publik sama saja mengumumkan separuh kredensial: yang tersisa bagi
> penyerang hanya menebak kata sandi, dan Hostinger masih menerima
> autentikasi kata sandi di SSH.
>
> Di seluruh dokumen ini dipakai penanda:
> `SERVER_IP`, `USER_HOSTING`, dan `PORT_SSH`.

Beberapa hal yang berlaku pada paket hosting terkelola:

| Hal | Keterangan |
|---|---|
| Port SSH | Bukan 22 — Hostinger memindahkannya. Lihat hPanel. |
| Port 21 | Terbuka untuk FTP/FTPS |
| Hak akses | Masuk sebagai pengguna biasa, **bukan** root, terkunci di direktori rumah sendiri |

Itu normal dan cukup untuk semua yang ada di dokumen ini.

---

## 0. Domain Spaceship → server Hostinger

Domain dan hosting berada di dua perusahaan berbeda. Yang menyambungkan
keduanya adalah **nameserver**: Spaceship memegang pendaftaran namanya,
Hostinger yang melayani berkasnya.

### a. Daftarkan domainnya di hPanel lebih dulu

**hPanel → Situs Web → Tambah Situs Web / Domain** → masukkan
`alijazqurancenter.com`.

Hostinger akan membuatkan akar dokumennya sendiri di:

```
public_html/alijazqurancenter.com/
```

Biarkan hPanel yang membuat folder itu. Membuatnya manual lebih dulu
membuat hPanel menolak, atau menciptakan folder kedua yang tidak dipakai.

### b. DNS lewat Cloudflare

Domain ini memakai **Cloudflare** sebagai DNS-nya, bukan nameserver
Hostinger. Susunannya:

```
Spaceship  →  nameserver Cloudflare  →  A record  →  server Hostinger
(pendaftar)    (pengelola DNS)                        (penyaji berkas)
```

Di Spaceship, nameserver sudah diarahkan ke Cloudflare. Di Cloudflare,
yang menentukan adalah satu **A record**:

| Tipe | Nama | Isi | Proxy |
|---|---|---|---|
| A | `@` | `SERVER_IP` (lihat hPanel) | lihat catatan di bawah |
| CNAME | `www` | `alijazqurancenter.com` | ikut yang di atas |

Periksa hasilnya:

```bash
dig +short NS alijazqurancenter.com     # harus nameserver Cloudflare
dig +short A  alijazqurancenter.com     # harus IP Hostinger
```

#### Awan abu-abu atau awan oranye?

Cloudflare punya dua mode, dan pilihannya berdampak nyata:

| Mode | Artinya | Akibatnya di sini |
|---|---|---|
| **DNS only** (awan abu-abu) | Cloudflare hanya menerjemahkan nama; lalu lintas langsung ke Hostinger | Paling sederhana. SSL sepenuhnya diurus Hostinger. |
| **Proxied** (awan oranye) | Lalu lintas melewati Cloudflare | Dapat singgahan dan perisai, tetapi **mode SSL wajib "Full (strict)"** |

Bila memakai awan oranye dengan mode SSL **Flexible**, Cloudflare
menyambung ke Hostinger lewat HTTP polos sementara Hostinger memaksa
HTTPS — hasilnya pengalihan berputar tanpa henti. Setel di
**Cloudflare → SSL/TLS → Overview → Full (strict)**, dan pastikan
sertifikat Hostinger sudah terbit lebih dulu.

Satu lagi yang mudah terlupa: dengan awan oranye, Cloudflare
menyinggahkan berkas. Setelah menerapkan pembaruan, bersihkan
singgahannya lewat **Caching → Configuration → Purge Everything**,
atau perubahan tidak akan terlihat meski berkas di server sudah baru.

### c. Baru pindahkan berkasnya

Setelah folder domainnya ada, pindahkan isi lama:

```bash
ssh alijaz
cd ~/public_html

# Cadangkan dulu — murah, dan menyelamatkan bila keliru
tar -czf ~/cadangan-public_html-$(date +%F).tar.gz .

# Pindahkan semua isi ke folder domain, kecuali folder domain itu sendiri
mkdir -p alijazqurancenter.com
find . -maxdepth 1 -mindepth 1 ! -name 'alijazqurancenter.com' -exec mv {} alijazqurancenter.com/ \;

ls -la alijazqurancenter.com          # periksa hasilnya
```

> **Perhatikan.** `public_html` adalah akar dokumen domain **utama**
> akun ini. Memindahkan seluruh isinya ke subfolder membuat domain utama
> berhenti menyajikan situs — sampai domain utamanya diganti menjadi
> `alijazqurancenter.com` di hPanel, atau isinya dikembalikan. Kalau
> `alijazqurancenter.com` memang dimaksudkan sebagai domain utama, berkasnya justru
> harus tetap di `public_html` langsung, tanpa subfolder.

### d. Aktifkan HTTPS

**hPanel → Keamanan → SSL** → terbitkan sertifikat gratis untuk domain itu.
Sertifikat baru bisa diterbitkan setelah DNS-nya benar-benar menunjuk ke sini.

---

## 1. Akses dari terminal VS Code

### a. Buat kunci SSH (sekali saja)

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_hostinger -C "hostinger-alijaz"
```

Tekan Enter untuk melewati passphrase, atau isi bila ingin lebih aman.

### b. Daftarkan kunci publiknya di hPanel

```bash
cat ~/.ssh/id_ed25519_hostinger.pub
```

Salin seluruh barisnya, lalu di hPanel:
**Tingkat lanjut → Akses SSH → SSH Keys → Import SSH Key**

Pada halaman yang sama, pastikan **Akses SSH** dalam keadaan aktif.

### c. Beri nama pendek agar tidak perlu mengetik panjang

Tambahkan ke `~/.ssh/config`:

```
Host alijaz
  HostName `SERVER_IP`
  User `USER_HOSTING`
  Port `PORT_SSH`
  IdentityFile ~/.ssh/id_ed25519_hostinger
  ServerAliveInterval 30
  ServerAliveCountMax 4
```

### d. Masuk

Dari terminal VS Code:

```bash
ssh alijaz
```

Sesampainya di sana:

```bash
pwd            # /home/`USER_HOSTING`
ls public_html/alijazqurancenter.com # isi website yang sekarang
df -h .        # sisa kuota disk
```

### Membersihkan isi lama

Periksa dulu isinya sebelum menghapus:

```bash
ls -la ~/public_html
du -sh ~/public_html
```

Bila memang sudah tidak terpakai:

```bash
# Simpan cadangan lebih dulu — murah, dan menyelamatkan bila keliru
tar -czf ~/cadangan-public_html-$(date +%F).tar.gz -C ~ public_html

# Baru kosongkan, termasuk berkas tersembunyi
find ~/public_html -mindepth 1 -delete
```

Basis data lama dihapus lewat **hPanel → Database → MySQL**, bukan lewat SSH.

---

## 2. Kenapa Remote-SSH VS Code kemungkinan besar gagal di sini

Ekstensi **Remote - SSH** perlu memasang VS Code Server di sisi remote:
ia mengunduh paket Node.js sekitar 150 MB dan menjalankan proses yang
terus hidup di latar belakang. Hosting terkelola membatasi jumlah proses
dan menutup proses lama yang menetap, sehingga sambungan kerap putus
atau gagal sejak awal. Ini bukan salah konfigurasi Anda — memang
begitu batasan paketnya.

Yang bekerja andal:

| Kebutuhan | Cara |
|---|---|
| Terminal di server | `ssh alijaz` langsung di terminal VS Code |
| Sunting berkas remote | Ekstensi **SFTP** (Natizyskunk) — port `PORT_SSH` |
| Kirim perubahan | GitHub Actions (bagian 3) atau `./kirim.sh` |
| Lihat log | `ssh alijaz 'tail -f ~/logs/error_log'` |

Bila ingin Remote-SSH sungguhan, itu tersedia pada produk **VPS**
Hostinger — di sana Anda memang dapat root.

---

## 3. Menyambungkan ke GitHub

Ada dua jalur. Pilih salah satu, jangan keduanya sekaligus.

### Pilihan A — GitHub Actions (mendorong lewat FTPS) — cadangan

Berkas alurnya tersedia di `.github/workflows/deploy.yml`, tetapi sengaja
**tidak berjalan otomatis** — hanya bisa dijalankan manual dari tab
Actions. Alasannya: jalur yang dipakai sehari-hari adalah kebalikannya
(hPanel menarik dari GitHub), dan menjalankan keduanya sekaligus membuat
dua sumber kebenaran berebut menulis ke folder yang sama.

Bila dijalankan, ia memeriksa sintaks JavaScript lalu
mengunggah isi repo ke `public_html/alijazqurancenter.com` lewat FTPS.

Tambahkan tiga secret di
**GitHub → Settings → Secrets and variables → Actions**:

| Nama | Isi |
|---|---|
| `FTP_SERVER` | ``SERVER_IP`` |
| `FTP_USERNAME` | ``USER_HOSTING`` |
| `FTP_PASSWORD` | kata sandi FTP dari hPanel → File → Akun FTP |

Kata sandi hanya hidup di GitHub Secrets — tidak pernah masuk ke kode,
tidak tampil di log, dan tidak perlu dikirimkan ke siapa pun.

Kelebihannya: riwayat pengiriman tercatat, bisa diulang, dan bisa
disisipi pemeriksaan sebelum berkas menyentuh server.

### Pilihan B — fitur Git bawaan hPanel (tarik dari GitHub)

Inilah jalur yang dipakai sekarang: server yang **menarik** dari GitHub,
bukan GitHub yang mendorong ke server.

**hPanel → Tingkat lanjut → GIT**

1. Repository: `https://github.com/aarefenam/kajianijaz.git`
2. Branch: `main`
3. Directory: `public_html/alijazqurancenter.com` — harus **kosong** saat
   pertama kali dikloning
4. Setelah tercipta, salin **Webhook URL** yang diberikan
5. Di GitHub: **Settings → Webhooks → Add webhook**, tempel URL tersebut,
   content type `application/json`, event: `push`

Sejak itu, tiap dorongan ke `main` membuat hPanel menarik versi terbaru
sendiri.

> **Kenapa `.htaccess` di repo ini penting.** Menarik repo Git ke akar web
> berarti seluruh isinya mendarat di tempat yang dapat diakses publik —
> termasuk folder `.git`. Tanpa penjagaan, siapa pun dapat mengunduh
> `/.git/` dan merekonstruksi seluruh riwayat proyek. Berkas `.htaccess`
> di akar repo menutup `.git`, `.github`, serta berkas `.md`, `.sh`,
> `.yml`, dan `.json`. Jangan menghapusnya.
>
> Sesudah kloning pertama, buktikan penjagaannya bekerja:
>
> ```bash
> curl -s -o /dev/null -w "%{http_code}\n" https://alijazqurancenter.com/.git/config
> ```
>
> Jawaban yang benar **404** atau **403**. Bila yang keluar **200**,
> `.htaccess` tidak terbaca — periksa apakah ia ikut terkloning.

### Pengiriman manual dari terminal

Untuk sekadar mengirim cepat tanpa menunggu Actions, gunakan
`./kirim.sh` yang ada di repo ini.

---

## 4. Melihat hasilnya selagi domain masih kedaluwarsa

Server memakai *name-based virtual hosting*, jadi membuka
`http://`SERVER_IP`` hanya menghasilkan **403** — server tidak tahu
website mana yang diminta. Selama domain belum aktif, arahkan namanya
secara lokal di komputer Anda sendiri:

```bash
sudo sh -c 'echo "`SERVER_IP` alijazquranstudies.com www.alijazquranstudies.com" >> /etc/hosts'
```

Setelah itu `http://alijazquranstudies.com` di peramban Anda akan menuju
server Hostinger, sementara pengunjung lain belum. Hapus lagi barisnya
setelah domain benar-benar aktif:

```bash
sudo sed -i '' '/alijazquranstudies.com/d' /etc/hosts
```

Catatan: HTTPS akan memunculkan peringatan sertifikat sampai domainnya
resmi mengarah ke server dan SSL diterbitkan.

---

## 5. Yang tetap harus dibereskan lebih dulu

Hasil pemeriksaan DNS:

```
Registrar   : GoDaddy
Nameserver  : ns1.dns-expired.com / ns2.dns-expired.com
A record    : 2.57.91.92          ← IP parkir, bukan server Anda
Status      : clientRenewProhibited, clientDeleteProhibited
```

Domainnya kedaluwarsa dan sedang diparkir GoDaddy. Selama ini belum
dibereskan, semua langkah di atas hanya berlaku untuk Anda sendiri lewat
berkas `hosts`; pengunjung belum bisa mengaksesnya.

Urutannya:

1. Perpanjang domain di GoDaddy — periksa apakah sudah masuk masa
   *redemption*, sebab biayanya berbeda dan ada tenggatnya
2. Ubah nameserver ke `ns1.dns-parking.com` dan `ns2.dns-parking.com`
3. Tunggu propagasi (biasanya 1–24 jam), pantau dengan
   `dig +short NS alijazquranstudies.com`
4. Terbitkan SSL lewat **hPanel → Keamanan → SSL**
