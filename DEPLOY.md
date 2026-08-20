# Menyambungkan Hosting Hostinger ke GitHub & VS Code

Catatan lapangan untuk `alijazqurancenter.com` di server `147.93.80.88`.

Domainnya dibeli di **Spaceship**, servernya di **Hostinger** — jadi ada dua
tempat yang harus disetel, dan urutannya penting. Lihat bagian 0.

Hasil pemeriksaan port pada server tersebut:

| Port | Status | Keterangan |
|------|--------|------------|
| 65002 | terbuka (OpenSSH 9.9) | Port SSH Hostinger — **bukan** 22 |
| 21 | terbuka | FTP/FTPS |
| 22 | tersaring | Wajar, Hostinger memindahkannya ke 65002 |

Paket ini hosting terkelola, jadi Anda masuk sebagai `u191793547`,
**bukan root**, dan terkunci di direktori rumah sendiri. Itu normal dan
cukup untuk semua yang ada di dokumen ini.

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

### b. Arahkan nameserver di Spaceship

Di Spaceship: **Domains → alijazqurancenter.com → Nameservers → Custom DNS**

```
ns1.dns-parking.com
ns2.dns-parking.com
```

Perambatannya biasanya 15 menit sampai beberapa jam. Periksa dengan:

```bash
dig +short NS alijazqurancenter.com
dig +short A  alijazqurancenter.com      # semestinya 147.93.80.88
```

Selama masih menunjuk nameserver Spaceship, apa pun yang diunggah tidak
akan terlihat dari domain itu — bukan karena berkasnya salah.

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
  HostName 147.93.80.88
  User u191793547
  Port 65002
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
pwd            # /home/u191793547
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
| Sunting berkas remote | Ekstensi **SFTP** (Natizyskunk) — port 65002 |
| Kirim perubahan | GitHub Actions (bagian 3) atau `./kirim.sh` |
| Lihat log | `ssh alijaz 'tail -f ~/logs/error_log'` |

Bila ingin Remote-SSH sungguhan, itu tersedia pada produk **VPS**
Hostinger — di sana Anda memang dapat root.

---

## 3. Menyambungkan ke GitHub

Ada dua jalur. Pilih salah satu, jangan keduanya sekaligus.

### Pilihan A — GitHub Actions (disarankan)

Berkas alurnya sudah tersedia di `.github/workflows/deploy.yml`.
Setiap dorongan ke `main` akan memeriksa sintaks JavaScript lalu
mengunggah isi repo ke `public_html/alijazqurancenter.com` lewat FTPS.

Tambahkan tiga secret di
**GitHub → Settings → Secrets and variables → Actions**:

| Nama | Isi |
|---|---|
| `FTP_SERVER` | `147.93.80.88` |
| `FTP_USERNAME` | `u191793547` |
| `FTP_PASSWORD` | kata sandi FTP dari hPanel → File → Akun FTP |

Kata sandi hanya hidup di GitHub Secrets — tidak pernah masuk ke kode,
tidak tampil di log, dan tidak perlu dikirimkan ke siapa pun.

Kelebihannya: riwayat pengiriman tercatat, bisa diulang, dan bisa
disisipi pemeriksaan sebelum berkas menyentuh server.

### Pilihan B — fitur Git bawaan hPanel

**hPanel → Tingkat lanjut → GIT**

1. Repository: `https://github.com/aarefenam/kajianijaz.git`
2. Branch: `main`
3. Directory: `public_html/alijazqurancenter.com` — harus **kosong** saat pertama kali dikloning
4. Setelah tercipta, salin **Webhook URL** yang diberikan
5. Di GitHub: **Settings → Webhooks → Add webhook**, tempel URL tersebut,
   content type `application/json`, event: `push`

Lebih sederhana, tetapi tidak ada tahap pemeriksaan dan galatnya lebih
sulit dilacak ketika gagal.

### Pengiriman manual dari terminal

Untuk sekadar mengirim cepat tanpa menunggu Actions, gunakan
`./kirim.sh` yang ada di repo ini.

---

## 4. Melihat hasilnya selagi domain masih kedaluwarsa

Server memakai *name-based virtual hosting*, jadi membuka
`http://147.93.80.88` hanya menghasilkan **403** — server tidak tahu
website mana yang diminta. Selama domain belum aktif, arahkan namanya
secara lokal di komputer Anda sendiri:

```bash
sudo sh -c 'echo "147.93.80.88 alijazquranstudies.com www.alijazquranstudies.com" >> /etc/hosts'
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
