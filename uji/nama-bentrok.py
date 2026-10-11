#!/usr/bin/env python3
"""Adakah nama tingkat-atas yang dideklarasikan dua kali di antara skrip ERP?

Skrip-skrip itu dimuat sebagai <script> biasa, jadi `const` dan `let`
tingkat-atasnya berbagi satu lingkup. Nama yang sama di dua berkas
menggugurkan berkas kedua SELURUHNYA dengan "Identifier ... has already
been declared" — dan `node --check` per berkas tidak melihatnya.

Jalankan:  python3 uji/nama-bentrok.py
"""
import re, sys, pathlib

AKAR = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'js'
BERKAS = ['rbac.js', 'font.js', 'qr.js', 'seed.js', 'store.js', 'erp.js']

nama = {}
for b in BERKAS:
    isi = (AKAR / b).read_text(encoding='utf-8')
    for n in re.findall(r'^(?:const|let|class)\s+([A-Za-z_$][\w$]*)', isi, re.M):
        nama.setdefault(n, []).append((b, 'const'))
    for n in re.findall(r'^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)', isi, re.M):
        nama.setdefault(n, []).append((b, 'function'))

bentrok = {n: v for n, v in nama.items() if len(v) > 1 and any(j == 'const' for _, j in v)}
if bentrok:
    for n, v in sorted(bentrok.items()):
        print(f'BENTROK  {n}: ' + ', '.join(f'{b} ({j})' for b, j in v))
    sys.exit(1)
print(f'LULUS — {len(nama)} nama tingkat-atas, tak ada yang bentrok antar-berkas')
