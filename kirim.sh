#!/usr/bin/env bash
# ============================================================
# Kirim manual ke hosting Hostinger dari terminal.
#
#   ./kirim.sh            kirim beneran
#   ./kirim.sh --coba     tampilkan apa yang AKAN dikirim, tanpa mengubah apa pun
#
# Perlu entri `Host alijaz` di ~/.ssh/config lebih dulu — lihat DEPLOY.md.
# ============================================================

set -euo pipefail

TUJUAN="alijaz"                 # nama Host di ~/.ssh/config
# Akar dokumen domain ini di server. Domain tambahan Hostinger tinggal
# di folder senama di dalam public_html, bukan di public_html langsung.
FOLDER="public_html/alijazqurancenter.com"
ASAL="$(cd "$(dirname "$0")" && pwd)/"

COBA=""
if [[ "${1:-}" == "--coba" ]]; then
  COBA="--dry-run"
  echo "MODE COBA — tidak ada berkas yang benar-benar dikirim."
fi

# Berkas yang tidak boleh ikut ke server publik
ABAIKAN=(
  --exclude ".git"        --exclude ".git/**"
  --exclude ".github"     --exclude ".github/**"
  --exclude "node_modules"
  --exclude "*.pdf"
  --exclude "README.md"   --exclude "DEPLOY.md"
  --exclude "kirim.sh"    --exclude ".nojekyll"
  --exclude ".DS_Store"
)

if ! ssh -o BatchMode=yes -o ConnectTimeout=8 "$TUJUAN" true 2>/dev/null; then
  echo "Gagal menyambung ke '$TUJUAN'." >&2
  echo "Periksa entri Host di ~/.ssh/config dan pastikan kunci SSH sudah" >&2
  echo "didaftarkan di hPanel → Tingkat lanjut → Akses SSH." >&2
  exit 1
fi

if ssh "$TUJUAN" 'command -v rsync >/dev/null 2>&1'; then
  echo "Mengirim dengan rsync…"
  # --delete membuang berkas di server yang sudah tidak ada di sini,
  # sehingga isi server persis mengikuti repo.
  ssh "$TUJUAN" "mkdir -p $FOLDER"
  rsync -az --delete --human-readable --itemize-changes $COBA \
    "${ABAIKAN[@]}" \
    -e "ssh" "$ASAL" "$TUJUAN:$FOLDER/"
else
  echo "rsync tidak tersedia di server, memakai tar melalui SSH…"
  if [[ -n "$COBA" ]]; then
    echo "(mode coba tidak didukung pada jalur ini — jalankan tanpa --coba)"
    exit 0
  fi
  tar -czf - -C "$ASAL" \
      --exclude=.git --exclude=.github --exclude=node_modules \
      --exclude='*.pdf' --exclude=README.md --exclude=DEPLOY.md \
      --exclude=kirim.sh --exclude=.nojekyll --exclude=.DS_Store . \
    | ssh "$TUJUAN" "mkdir -p $FOLDER && tar -xzf - -C $FOLDER"
fi

echo
echo "Selesai. Periksa hasilnya:"
echo "  ssh $TUJUAN 'ls -la $FOLDER'"
