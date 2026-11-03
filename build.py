#!/usr/bin/env python3
"""Create GitHub Pages entry points from the shared page shell, without dependencies."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
DIST = ROOT / 'dist'
TEMPLATE = (DIST / 'index.html').read_text(encoding='utf-8')
PAGES = {
    'catalog/index.html': 'Каталог',
    'cart/index.html': 'Корзина',
    'about/index.html': 'О мастере',
    'reviews/index.html': 'Отзывы',
    'contacts/index.html': 'Контакты',
    'how-to-order/index.html': 'Как заказать',
    'product/index.html': 'Изделия',
    'product/klyuchnitsa-listya/index.html': 'Ключница «Листья»',
    'product/house/index.html': 'Копилка «Домик»',
    'product/tree/index.html': 'Панель «Дерево жизни»',
    'product/savings/index.html': 'Копилки',
    'product/cannon/index.html': 'Мини-бары',
    'product/pen/index.html': 'Блокноты',
    '404.html': 'Страница не найдена',
}
for filename, title in PAGES.items():
    depth = len(Path(filename).parts) - 1
    base = '../' * depth if depth else './'
    html = re.sub(r'<base href="[^"]*">', f'<base href="{base}">', TEMPLATE, count=1)
    html = re.sub(r'<title>.*?</title>', f'<title>{title} — vamknam.by</title>', html, count=1)
    if filename == '404.html':
        html = html.replace('<base href="./">', '<base href="./"><script>document.querySelector("base").href=location.hostname.endsWith("github.io")?"/vamknam/":"/";</script>')
    target = DIST / filename
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html, encoding='utf-8')
print(f'Prepared {len(PAGES) + 1} static pages in {DIST}')
