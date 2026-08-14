#!/usr/bin/env python3
"""Тэмдэгтийн туслах фонт үүсгэнэ — public/fonts/TsetseglySymbols.woff2

Cormorant Garamond-д √ ≈ ✓ ✗ дөрвөн тэмдэгт байхгүй тул хөтөч системийн фонт руу
унадаг. Тэгвэл хэвлэлийн PDF нь хөрвүүлж буй компьютерээс хамаарч өөр гарна.
Тиймээс эдгээр дөрвөн тэмдэгтийг DejaVu Sans-аас тасдаж авч, төсөлтэй хамт хадгална.

DejaVu фонт нь Bitstream Vera-д суурилсан чөлөөт лицензтэй — түгээхэд асуудалгүй.

Ажиллуулах:
    pip install fonttools brotli
    python3 scripts/build-symbol-font.py
"""
from pathlib import Path

from fontTools.subset import Subsetter, Options
from fontTools.ttLib import TTFont

SOURCE = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
OUT = Path(__file__).resolve().parent.parent / "public/fonts/TsetseglySymbols.woff2"
GLYPHS = [0x221A, 0x2248, 0x2713, 0x2717]  # √ ≈ ✓ ✗

if not SOURCE.exists():
    raise SystemExit(f"DejaVu Sans олдсонгүй: {SOURCE}")

font = TTFont(SOURCE)

options = Options()
options.desubroutinize = True
options.drop_tables += ["DSIG"]

subsetter = Subsetter(options=options)
subsetter.populate(unicodes=GLYPHS)
subsetter.subset(font)

# Нэрийг өөрчилж, эх фонттой андуурахаас сэргийлнэ.
for record in font["name"].names:
    if record.nameID in (1, 4, 16):
        record.string = "Tsetsegly Symbols"
    elif record.nameID in (2, 17):
        record.string = "Regular"
    elif record.nameID == 6:
        record.string = "TsetseglySymbols"

font.flavor = "woff2"
OUT.parent.mkdir(parents=True, exist_ok=True)
font.save(OUT)

print(f"✓ {OUT.relative_to(OUT.parent.parent.parent)} ({OUT.stat().st_size} bytes) — {len(GLYPHS)} тэмдэгт")
