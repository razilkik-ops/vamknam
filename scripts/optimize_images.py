"""Convert each deployed raster asset to its own WebP; preserve originals."""
from pathlib import Path
import json
import shutil
from PIL import Image, ImageOps, features

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'dist' / 'assets'
ORIGINALS = ROOT / 'reference-assets' / 'web-originals'
assert features.check('webp'), 'Pillow needs WebP support'
report = []
for source in sorted(ASSETS.rglob('*')):
    if source.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
        continue
    relative = source.relative_to(ASSETS)
    original = ORIGINALS / relative
    original.parent.mkdir(parents=True, exist_ok=True)
    if not original.exists():
        shutil.copy2(source, original)
    destination = source.with_suffix('.webp')
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        image = image.convert('RGBA' if 'A' in image.getbands() else 'RGB')
        if relative == Path('logo.jpg'):
            image.thumbnail((176, 176), Image.Resampling.LANCZOS)
        quality = 86 if image.mode == 'RGBA' else 84
        image.save(destination, 'WEBP', quality=quality, method=6, exact=True)
        with Image.open(destination) as encoded:
            assert encoded.size == image.size
            if image.mode == 'RGBA':
                assert encoded.getchannel('A').tobytes() == image.getchannel('A').tobytes()
        report.append({'source':str(relative), 'webp':str(destination.relative_to(ASSETS)), 'before':source.stat().st_size, 'after':destination.stat().st_size, 'width':image.width, 'height':image.height})
    source.unlink()
if report:
    (ROOT / 'reference-assets' / 'WEBP-REPORT.json').write_text(json.dumps(report, indent=2))
before = sum(item['before'] for item in report)
after = sum(item['after'] for item in report)
print(json.dumps({'files':len(report), 'before_bytes':before, 'after_bytes':after, 'saved_percent':round((1-after/before)*100, 1) if before else 0}))
