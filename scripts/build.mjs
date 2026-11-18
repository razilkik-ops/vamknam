import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
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
pages.push(['catalog/bloknoty/index.html', 'Изделия из дерева', '/catalog/bloknoty']);
pages.push(['catalog/dekor/index.html', 'Изделия из дерева', '/catalog/dekor']);
pages.push(['catalog/kopilki/index.html', 'Изделия из дерева', '/catalog/kopilki']);
pages.push(['catalog/mini-bary/index.html', 'Изделия из дерева', '/catalog/mini-bary']);
pages.push(['catalog/klyuchnitsy/index.html', 'Изделия из дерева', '/catalog/klyuchnitsy']);
pages.push(['product/bloknot/index.html', 'Изделия из дерева', '/product/bloknot']);
pages.push(['product/kopilka-svinka/index.html', 'Изделия из дерева', '/product/kopilka-svinka']);
pages.push(['product/key-minimal/index.html', 'Изделия из дерева', '/product/key-minimal']);
pages.push(['product/panel-derevo/index.html', 'Изделия из дерева', '/product/panel-derevo']);
pages.push(['product/mini-bar-shkaf/index.html', 'Изделия из дерева', '/product/mini-bar-shkaf']);
pages.push(['product/key-mountains/index.html', 'Изделия из дерева', '/product/key-mountains']);
pages.push(['product/key-leaves/index.html', 'Изделия из дерева', '/product/key-leaves']);
pages.push(['product/key-deer/index.html', 'Изделия из дерева', '/product/key-deer']);
pages.push(['product/kopilka-domik/index.html', 'Изделия из дерева', '/product/kopilka-domik']);
pages.push(['product/key-house/index.html', 'Изделия из дерева', '/product/key-house']);
pages.push(['product/key-city/index.html', 'Изделия из дерева', '/product/key-city']);
pages.push(['product/key-tree/index.html', 'Изделия из дерева', '/product/key-tree']);
pages.push(['product/key-ornament/index.html', 'Изделия из дерева', '/product/key-ornament']);
pages.push(['product/key-heart/index.html', 'Изделия из дерева', '/product/key-heart']);
pages.push(['product/key-owl/index.html', 'Изделия из дерева', '/product/key-owl']);
pages.push(['kak-zakazat/index.html', 'Изделия из дерева', '/kak-zakazat']);
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
    is404: filename === '404.html',assetVersion:'20261118-reference'
  }, {rmWhitespace:true});
  const target = path.join(root,'dist',filename);
  await mkdir(path.dirname(target),{recursive:true});
  await writeFile(target,html+'\n');
}
console.log(`Built ${pages.length} static pages with shared EJS header and cart.`);

await writeFile(path.join(root,'dist/app.js'),await readFile(path.join(root,'src/reference-redesign/app.js'),'utf8'));
await writeFile(path.join(root,'dist/style.css'),(await readFile(path.join(root,'src/reference-redesign/site-shell.css'),'utf8'))+'\n'+(await readFile(path.join(root,'src/reference-redesign/reference.css'),'utf8')));
console.log('Applied reference redesign with the retained shared header and cart drawer.');
