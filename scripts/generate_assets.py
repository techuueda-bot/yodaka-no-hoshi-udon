#!/usr/bin/env python3
"""Generate the typography-led OGP image without external services."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "site/assets/img/common/ogp.png"
W, H = 1200, 630

BG = "#f7f2e6"
INK = "#262622"
NAVY = "#1f2d3d"
GOLD = "#b8863f"
LINE = "#ddd0af"


def font(size: int, serif: bool = True) -> ImageFont.FreeTypeFont:
    path = (
        "/System/Library/Fonts/ヒラギノ明朝 ProN.ttc"
        if serif
        else "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc"
    )
    return ImageFont.truetype(path, size=size, index=0)


def centered(draw: ImageDraw.ImageDraw, text: str, y: int, face, fill: str, spacing: int = 0) -> None:
    if not spacing:
        box = draw.textbbox((0, 0), text, font=face)
        draw.text(((W - (box[2] - box[0])) / 2, y), text, font=face, fill=fill)
        return
    widths = [draw.textlength(c, font=face) for c in text]
    total = sum(widths) + spacing * (len(text) - 1)
    x = (W - total) / 2
    for char, width in zip(text, widths):
        draw.text((x, y), char, font=face, fill=fill)
        x += width + spacing


def main() -> None:
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)

    draw.rectangle((45, 45, W - 45, H - 45), outline=LINE, width=2)
    draw.rectangle((66, 66, W - 66, H - 66), outline=GOLD, width=1)

    # Abstract crest and constellation: ornaments only, never food/building imagery.
    cx, cy = 600, 118
    draw.ellipse((cx - 31, cy - 31, cx + 31, cy + 31), outline=NAVY, width=2)
    draw.ellipse((cx - 18, cy - 18, cx + 18, cy + 18), outline=GOLD, width=2)
    for dx, dy in [(-210, -28), (-132, 14), (136, -18), (212, 20), (-280, 50), (282, 54)]:
        draw.ellipse((cx + dx - 3, cy + dy - 3, cx + dx + 3, cy + dy + 3), fill=GOLD)
    draw.line([(390, 90), (468, 132), (736, 100), (812, 138)], fill=LINE, width=2)

    centered(draw, "よだかの星", 182, font(104), NAVY, spacing=10)
    centered(draw, "手打ちうどん", 327, font(50), INK, spacing=14)

    draw.line((300, 424, 900, 424), fill=LINE, width=2)
    centered(draw, "架空店舗サイト ／ 制作例", 462, font(30, serif=False), INK, spacing=5)
    centered(draw, "TYPOGRAPHY  ×  LITERATURE", 534, font(18, serif=False), GOLD, spacing=3)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUTPUT, format="PNG", optimize=True)


if __name__ == "__main__":
    main()
