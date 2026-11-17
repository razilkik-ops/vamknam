import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import ejs from 'ejs';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = [
  ['index.html', 'Изделия из дерева с душой', '/'],
  ['catalog/index.html', 'Каталог', '/catalog'],
  ['cart/index.html', 'Корзина', '/cart'],
  ['about/index.html', 'О мастере', '/about'],
  ['reviews/index.html', 'Отзывы', '/reviews'],
  ['contacts/index.html', 'Контакты', '/contacts'],
  ['how-to-order/index.html', 'Как заказать', '/how-to-order'],
  ['product/index.html', 'Изделия', '/product'],
  ['product/klyuchnitsa-listya/index.html', 'Ключница «Листья»', '/product/klyuchnitsa-listya'],
  ['product/house/index.html', 'Копилка «Домик»', '/product/house'],
  ['product/tree/index.html', 'Панель «Дерево жизни»', '/product/tree'],
  ['product/savings/index.html', 'Копилки', '/product/savings'],
  ['product/cannon/index.html', 'Мини-бары', '/product/cannon'],
  ['product/pen/index.html', 'Блокноты', '/product/pen'],
  ['404.html', 'Страница не найдена', '/404']
];
const navigation = [
  {label:'Каталог',href:'catalog/',path:'/catalog'},
  {label:'Как заказать',href:'how-to-order/',path:'/how-to-order'},
  {label:'О мастере',href:'about/',path:'/about'},
  {label:'Отзывы',href:'reviews/',path:'/reviews'},
  {label:'Контакты',href:'contacts/',path:'/contacts'}
];
for (const [filename,title,currentPath] of pages) {
  const depth = filename.split('/').length - 1;
  const pageClass = currentPath === '/' ? 'home-page' : currentPath === '/catalog' ? 'catalog-page' : currentPath === '/how-to-order' ? 'order-page' : currentPath.startsWith('/product') ? 'detail-page' : 'inner-page';
  const html = await ejs.renderFile(path.join(root,'views/layout.ejs'), {
    title,currentPath,pageClass,navigation,
    base: depth ? '../'.repeat(depth) : './',
    is404: filename === '404.html',assetVersion:'20261117-2'
  }, {rmWhitespace:true});
  const target = path.join(root,'dist',filename);
  await mkdir(path.dirname(target),{recursive:true});
  await writeFile(target,html+'\n');
}
console.log(`Built ${pages.length} static pages with shared EJS header and cart.`);
