'use strict';
const IG='https://www.instagram.com/vamknam.by/';
const PHONE='+375 44 753-53-10';
const TG='tg://resolve?phone=375447535310';
const SITE=window.VAMKNAM_SITE||{};
const A='assets/reference/';
const params=new URLSearchParams(location.search);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=(name,cls='')=>`<img class="icon ${cls}" src="${A+name}.svg" alt="" width="24" height="24">`;
const photo=(name,alt,cls='',eager=false)=>`<img class="${cls}" src="${A+name}.webp" alt="${esc(alt)}" ${eager?'fetchpriority="high" loading="eager"':'loading="lazy"'} decoding="async" width="${name==='hero'?1400: name==='key-product-portrait'?1166:1400}" height="${name==='hero'?700:name==='key-product-portrait'?1400:933}">`;
const products=[
 {id:'leaves',name:'Ключница «Листья»',price:45,category:'Ключницы',image:'key-product',homeImage:'leaves',size:'Примерно 30×12 см',description:'Изготовлена из качественной фанеры. Резьба выполнена лазером. Можно добавить имя или надпись. Размер примерно 30×12 см. Каждое изделие делается индивидуально.'},
 {id:'house',name:'Копилка «Домик»',price:38,category:'Копилки',image:'house-bank',description:'Деревянная копилка в форме уютного домика. Аккуратная лазерная резка и натуральная фактура дерева. Можно добавить имя или памятную надпись.'},
 {id:'tree',name:'Панель «Дерево жизни»',price:55,category:'Декор',image:'life-panel',description:'Ажурная деревянная панель «Дерево жизни» для вашего дома. Детальный узор выполнен лазерной резкой. Размер и оформление согласовываются при заказе.'},
 {id:'custom',name:'Идея на заказ',price:40,from:true,category:'На заказ',image:'custom',description:'Ваш дизайн или идея. Расскажите, что хочется создать: подберём форму, размер и персональную надпись, согласуем макет и стоимость.'},
 ...[['leaves','Листья',25],['house','Домик',27],['mountains','Горы',28],['diamond','Орнамент',24],['life','Дерево жизни',29],['owl','Сова',26],['deer','Олень',27],['minimal','Минимализм',23],['heart','Сердце',24],['city','Город',28]].map(([id,name,price])=>({id:'key-'+id,name:'Ключница '+name,price,from:true,category:'Ключницы',image:id==='leaves'?'leaves':'key-'+id,catalog:true,description:'Деревянная ключница с аккуратной лазерной резкой и металлическими крючками. Дизайн, размер и возможность добавить имя или надпись обсудим перед изготовлением.'})),
 {id:'notebook',name:'Деревянный блокнот',category:'Блокноты',image:'notebook',price:null,description:'Блокнот с деревянной обложкой и гравировкой. Рисунок, надпись и стоимость согласовываются индивидуально.'},
 {id:'pig',name:'Копилка «Свинка»',category:'Копилки',image:'pig-bank',price:null,description:'Деревянная копилка с гравировкой. Можно согласовать персональное оформление. Стоимость уточняется при заказе.'},
 {id:'mini-bar',name:'Деревянный мини-бар',category:'Мини-бары',image:'mini-bar',price:null,description:'Компактный деревянный шкафчик для подарка. Размер, наполнение, оформление и цена согласовываются индивидуально. Напитки на изображении показаны для примера.'}
];
const categories=[
 ['Ключницы','leaves'],
 ['Копилки','pig-bank'],
 ['Декор','life-panel'],
 ['На заказ','custom'],
 ['Блокноты','notebook'],
 ['Мини-бары','mini-bar']
];
const catalogURL=(category='')=>category?`catalog/?category=${encodeURIComponent(category)}`:'catalog/';
const getProduct=id=>products.find(p=>p.id===id);
const productURL=p=>p.id==='leaves'?'product/klyuchnitsa-listya/':`product/?id=${encodeURIComponent(p.id)}`;
const priceHTML=p=>p.price===null?'По запросу':`${p.from?'от ':''}${p.price} ${p.catalog?'руб.':'BYN'}`;
const app=document.querySelector('#app');
const basePath=new URL(document.baseURI).pathname;
const path=('/'+location.pathname.slice(basePath.length)).replace(/\/+$/,'')||'/';
let cart=[];
try {cart=JSON.parse(localStorage.getItem('vamknam-reference-cart-v1')||'[]').filter(x=>getProduct(x.id)&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<=99).map(x=>({...x,text:String(x.text||'').slice(0,140)}));}catch{}
function saveCart(){
 try{localStorage.setItem('vamknam-reference-cart-v1',JSON.stringify(cart));}catch{}
 const count=itemCount();
 document.querySelectorAll('[data-cart-count]').forEach(el=>{el.textContent=count;if(el.classList.contains('cart-badge'))el.hidden=count===0;});
 document.querySelector('#header-cart').setAttribute('aria-label','Открыть корзину, '+itemCountText(count));
}
function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3500);}
function title(text,id=''){return `<h2 class="ornament-heading"${id?` id="${id}"`:''}><span>${icon('diamond')}</span>${text}<span>${icon('diamond')}</span></h2>`;}
function productCard(p,compact=false){return `<article class="product-card ${compact?'compact-card':''}"><a class="card-image" href="${productURL(p)}">${photo(p.homeImage||p.image,p.name)}</a><div class="card-info"><h3><a href="${productURL(p)}">${esc(p.name)}</a></h3>${p.id==='custom'?'<p class="card-subtitle">Ваш дизайн или идея</p>':''}<p class="card-price">${priceHTML(p)}</p><a class="order-button" href="${p.id==='custom'?'how-to-order/?custom=1':productURL(p)}">Хочу заказать</a></div></article>`;}
function home(){
 document.title='vamknam.by — именные сувениры с душой';
 const hits=['leaves','house','tree','custom','notebook','pig','mini-bar','key-mountains','key-owl','key-heart'].map(getProduct);
 const media=SITE.heroVideo
  ? `<video class="hero-video" id="hero-video" muted loop playsinline preload="none" poster="${esc(SITE.heroVideoPoster||A+'hero.webp')}" aria-label="Лазерное выжигание узора на фанере"><source src="${esc(SITE.heroVideo)}" type="${esc(SITE.heroVideoType||'video/mp4')}"></video>`
  : photo('hero','Ключница из дерева с веткой и листьями','',true);
 app.innerHTML=`<section class="hero${SITE.heroVideo?' hero-with-video':''}"><div class="hero-photo">${media}</div><div class="home-container hero-inner"><div class="hero-copy"><h1>Создаём то, что<br>не купишь в магазине.</h1><p class="hero-subtitle">Именные сувениры с душой.</p></div></div></section>
 <div class="home-container home-sections"><section class="hits" aria-labelledby="hits-heading">${title('Хиты сезона','hits-heading')}<div class="hits-carousel" role="region" aria-roledescription="карусель" aria-label="10 хитов сезона"><button type="button" class="carousel-arrow carousel-prev" data-hit-direction="-1" aria-label="Предыдущие изделия" disabled><img src="assets/reference/carousel-prev.svg" width="24" height="24" alt=""></button><div class="featured-track" id="hits-track" role="list" tabindex="0" aria-label="Хиты сезона — прокрутка стрелками или свайпом">${hits.map(p=>`<div class="featured-slide" role="listitem">${productCard(p,true)}</div>`).join('')}</div><button type="button" class="carousel-arrow carousel-next" data-hit-direction="1" aria-label="Следующие изделия"><img src="assets/reference/carousel-next.svg" width="24" height="24" alt=""></button></div></section>
 <section class="categories" aria-labelledby="home-catalog-heading">${title('Каталог изделий','home-catalog-heading')}<div class="category-grid">${categories.map(([name,image])=>`<a class="category-card" href="${catalogURL(name)}">${photo(image,'')}<span class="category-card-label">${esc(name)}</span></a>`).join('')}</div></section>
 <section class="how-works">${title('Как это работает')}<div class="steps">${[['choose','Выбираете изделие','Смотрите каталог и выбираете то, что нравится.'],['discuss','Обсуждаем детали и цену','Согласовываем дизайн, материалы и сроки.'],['deliver','Творю с теплом и заботой,','чтобы порадовать вас готовым результатом.']].map(([i,h,p],n)=>`<div class="step"><span class="step-icon"><img class="process-icon" src="assets/process/${i}.webp" alt="" width="88" height="88" loading="lazy"></span><span class="step-number">${n+1}</span><div><h3>${h}</h3><p>${p}</p></div>${n<2?icon('arrow','step-arrow'):''}</div>`).join('')}</div></section></div>`;
 if(SITE.heroVideo)setupHeroVideo();
 setupHomeCarousel();
}
function setupHeroVideo(){
 const video=document.querySelector('#hero-video');
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 reducedMotion.addEventListener('change',event=>{if(event.matches)video.pause();});
 if(!reducedMotion.matches)video.play().catch(()=>{});
}
function setupHomeCarousel(){
 const track=document.querySelector('#hits-track');
 if(!track)return;
 const previous=document.querySelector('.carousel-prev'),next=document.querySelector('.carousel-next');
 const update=()=>{previous.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;};
 const move=(direction,page=true)=>{const slide=track.querySelector('.featured-slide'),gap=parseFloat(getComputedStyle(track).columnGap)||0,step=slide.getBoundingClientRect().width+gap;const visible=page?Math.max(1,Math.round(track.clientWidth/step)):1;track.scrollBy({left:direction*step*visible,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});};
 document.querySelectorAll('[data-hit-direction]').forEach(button=>button.addEventListener('click',()=>move(Number(button.dataset.hitDirection))));
 track.addEventListener('scroll',update,{passive:true});
 track.addEventListener('keydown',e=>{if(e.target===track&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();move(e.key==='ArrowLeft'?-1:1,false);}});
 window.addEventListener('resize',update);
 update();
}
function breadcrumb(last,extra=''){return `<div class="breadcrumb"><a href="./">Главная</a><span>›</span>${extra}${esc(last)}</div>`;}
function catalog(){
 const requestedCategory=params.get('category');
 const category=categories.find(([name])=>name===requestedCategory)?.[0]||'';
 const heading=category||'Каталог изделий';
 const items=category?products.filter(p=>p.category===category):products;
 const navigation=[['','Все изделия'],...categories.map(([name])=>[name,name])];
 document.title=heading+' — vamknam.by';
 app.innerHTML=`<div class="catalog-container">
 ${breadcrumb(heading,category?'<a href="catalog/">Каталог</a><span>›</span>':'')}
 <h1>${esc(heading)}</h1>
 <nav class="catalog-categories" aria-label="Разделы каталога">${navigation.map(([value,label])=>`<a href="${catalogURL(value)}"${value===category?' aria-current="page"':''}>${esc(label)}</a>`).join('')}</nav>
 <div class="catalog-grid">${items.map(p=>productCard(p)).join('')}</div></div>`;
}
function productPage(id){const p=getProduct(id);if(!p)return notFound();document.title=p.name+' — vamknam.by';const leaves=id==='leaves';const mainImage=leaves?'key-product-portrait':p.image;app.innerHTML=`<section class="product-layout"><div class="product-gallery"><div class="gallery-primary"><button class="main-photo ${leaves?'portrait-photo':''}" type="button" aria-label="Увеличить фотографию">${photo(mainImage,p.name,'',true)}</button></div><div class="thumbnails"><button class="thumb active" data-photo="${mainImage}" aria-label="Основной вид">${photo(mainImage,'Основной вид изделия')}</button>${leaves?`<button class="thumb" data-photo="key-product-flat" aria-label="Вид под углом">${photo('key-product-flat','Изделие под углом')}</button>`:''}</div></div><div class="product-info">${breadcrumb(p.name,`<a href="catalog/">Каталог</a><span>/</span><a href="${catalogURL(p.category)}">${p.category}</a><span>/</span>`)}<h1>${esc(p.name)}</h1><p class="product-price">${priceHTML(p)}</p><p class="price-note">${p.price===null?'Стоимость согласовывается индивидуально':'Цена за изделие без персонализации'}</p><p class="product-description">${esc(p.description)}</p><dl class="product-specs">${[['leaf','Материал','Качественная фанера (берёза)'],['ruler','Размер',p.size||'Согласовывается при заказе'],['edit','Персонализация','Можно добавить имя или надпись'],['clock','Срок изготовления','1–2 рабочих дня']].map(([i,label,value])=>`<div>${icon(i)}<dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl><form id="product-form" data-id="${p.id}"><button class="add-to-cart" type="submit">Добавить в Корзину ${icon('cart')}</button><details class="personalization"><summary>Добавить надпись или пожелания</summary><label class="field">Ваша надпись<input name="personalization" maxlength="140" placeholder="Имя, дата или пожелание"></label><label class="field">Количество<input type="number" name="quantity" value="1" min="1" max="99" required></label></details></form></div></section><dialog id="photo-dialog"><button class="close-dialog" aria-label="Закрыть фотографию">×</button>${photo(mainImage,p.name)}<p>${esc(p.name)}</p></dialog>`;}
function orderPage(){
 app.innerHTML=`<div class="order-container order-design">
  <section class="order-intro">
   <div class="order-intro-copy"><h1 class="order-title">Как заказать</h1><div class="title-flourish">${icon('flower')}</div><p class="order-lead">Расскажем, как оформить заказ, согласовать дату,<br class="desktop-break"> забрать готовое изделие или получить его почтой.</p><div class="order-actions"><a class="button" href="${TG}">${icon('telegram')}Написать в Telegram</a><a class="button order-call" href="tel:+375447535310">${icon('phone')}${PHONE}</a></div></div>
   <img class="order-hero-art" src="assets/order/bird.webp" alt="" width="300" height="280" fetchpriority="high">
  </section>
  <div class="order-flow">
   <section class="order-step"><span class="order-number">1</span><div class="order-copy"><h2>Расскажите о вашей идее</h2><p>Напишите в Telegram или позвоните и сообщите:</p><ul class="order-checklist"><li>Желаемую дату готовности</li><li>Номер телефона</li><li>Название изделия, размер, надпись и пожелания</li><li>Способ получения: самовывоз, Белпочта или Европочта</li></ul><p class="order-hint">Для Белпочты — домашний адрес. Для Европочты — город и номер отделения.</p></div><img class="order-art" src="assets/order/checklist.webp" alt="" width="160" height="160" loading="lazy"></section>
   <section class="order-step dates-step"><span class="order-number">2</span><div class="order-copy"><h2>Согласуем дату</h2><p>Свободную дату согласуем при заказе.<br>Напишите желаемый день — уточним возможность изготовления.</p><p class="order-hint dates-note">${icon('refresh')}Актуальные даты уточняйте у мастера.</p></div><img class="order-art" src="assets/order/calendar.webp" alt="" width="160" height="160" loading="lazy"></section>
   <section class="order-step pickup-step"><span class="order-number">3</span><div class="order-copy"><h2>Самовывоз</h2><p>${icon('pin')}<span><strong>Минск:</strong> пр. Дзержинского 126, стоянка «Простор», ст. м. Малиновка — после 18:30.</span></p><p>${icon('pin')}<span><strong>Фаниполь:</strong> ул. Зелёная — после 18:00.</span></p></div><img class="order-art" src="assets/order/home.webp" alt="" width="160" height="160" loading="lazy"></section>
   <section class="order-step mail-step"><span class="order-number">4</span><div class="order-copy"><h2>Доставка почтой</h2><p>Белпочта и Европочта. Отправляем после 18:00.<br>Оплата на карту после отправки или после получения.</p></div><img class="order-art" src="assets/process/deliver.webp" alt="" width="160" height="160" loading="lazy"></section>
  </div>
  <section class="order-request" id="request"><h2>${params.has('custom')?'Ваша идея на заказ':'Подготовить заявку'}</h2><p>Составьте сообщение, скопируйте его и отправьте мастеру.</p><form id="order-form"><div class="form-grid"><label class="field">Ваше имя<input name="name" maxlength="80" autocomplete="given-name" placeholder="Введите имя" required></label><label class="field">Телефон<input name="phone" type="tel" autocomplete="tel" maxlength="30" placeholder="Введите номер телефона" required></label><label class="field">Желаемая дата<input name="date" type="date"></label><label class="field">Получение<select name="delivery"><option>Уточнить при заказе</option><option>Самовывоз — Минск</option><option>Самовывоз — Фаниполь</option><option>Белпочта</option><option>Европочта</option></select></label></div><label class="field">Изделие, надпись и пожелания<textarea name="idea" maxlength="2000" ${cart.length?'':'required'} placeholder="Название изделия, количество, размер и желаемая надпись"></textarea></label><button class="button" type="submit">Составить сообщение ${icon('arrow')}</button><div id="order-result"></div></form></section>
 </div>`;
 if(params.has('checkout')||params.has('custom'))requestAnimationFrame(()=>document.querySelector('#request').scrollIntoView());
}
function itemCount(){return cart.reduce((sum,item)=>sum+item.qty,0);}
function itemCountText(count=itemCount()){const mod=count%100;return `${count} ${mod>=11&&mod<=14?'товаров':count%10===1?'товар':count%10>=2&&count%10<=4?'товара':'товаров'}`;}
function cartTotal(){return cart.some(item=>getProduct(item.id).price===null)?'Уточняется':cart.reduce((sum,item)=>sum+getProduct(item.id).price*item.qty,0)+' BYN';}
function cartEntry(item,index){
 const p=getProduct(item.id);
 return `<article class="cart-entry"><a class="entry-photo" href="${productURL(p)}">${photo(p.image,p.name)}</a><div class="entry-body"><h3><a href="${productURL(p)}">${esc(p.name)}</a></h3><p class="entry-detail">${esc(item.text)||'Без персонализации'}</p><div class="entry-controls"><div class="quantity"><button type="button" data-cart-qty="${index}" data-delta="-1" ${item.qty===1?'disabled':''} aria-label="Уменьшить количество ${esc(p.name)}">${icon('minus')}</button><output aria-label="Количество ${esc(p.name)}">${item.qty}</output><button type="button" data-cart-qty="${index}" data-delta="1" ${item.qty===99?'disabled':''} aria-label="Увеличить количество ${esc(p.name)}">${icon('plus')}</button></div><button type="button" class="entry-remove" data-cart-remove="${index}" aria-label="Удалить ${esc(p.name)}">${icon('trash')}<span>Удалить</span></button></div></div><strong class="entry-price">${p.price===null?'По запросу':p.price*item.qty+' BYN'}</strong></article>`;
}
function emptyCartContent(drawer=false){return `<div class="cart-empty"><span class="cart-empty-icon">${icon('cart')}</span><h2>В корзине пока пусто</h2><p>Выберите изделие для дома или подарок близкому человеку.</p><a class="button" href="catalog/">Посмотреть каталог ${icon('arrow')}</a>${drawer?'<button type="button" class="drawer-continue" data-cart-close>Продолжить просмотр</button>':''}</div>`;}
function renderCartDrawer(addedId=null){
 const content=document.querySelector('#cart-drawer-content');
 if(!cart.length){content.innerHTML=emptyCartContent(true);return;}
 content.innerHTML=`<div class="drawer-scroll">${addedId?`<div class="drawer-added" role="status">${icon('check')}<span>Изделие добавлено в корзину</span></div>`:''}<p class="drawer-count">${itemCountText()}</p><div class="drawer-items">${cart.map(cartEntry).join('')}</div></div><div class="drawer-summary"><div class="drawer-total"><span>Предварительно</span><strong>${cartTotal()}</strong></div><p>Персонализация и доставка согласовываются с мастером.</p><a class="button drawer-checkout" href="how-to-order/?checkout=1">Оформить заявку ${icon('arrow')}</a><a class="button drawer-view-cart" href="cart/">Перейти в корзину</a><button type="button" class="drawer-continue" data-cart-close>Продолжить выбор</button></div>`;
}
function openCart(addedId=null){
 const drawer=document.querySelector('#cart-drawer');
 document.querySelector('#main-nav').classList.remove('open');
 document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');
 document.querySelector('#menu-toggle').setAttribute('aria-label','Открыть меню');
 renderCartDrawer(addedId);
 if(!drawer.open)drawer.showModal();
 document.body.classList.add('cart-open');
}
function closeCart(){document.querySelector('#cart-drawer').close();}
function cartPage(){
 document.title='Корзина — vamknam.by';
 app.innerHTML=`<div class="standard-container cart-page">${breadcrumb('Корзина')}<div class="cart-page-heading"><h1>Ваша корзина</h1>${cart.length?`<span>${itemCountText()}</span>`:''}</div>${cart.length?`<div class="cart-layout"><div><div class="cart-items">${cart.map(cartEntry).join('')}</div><a class="cart-continue-link" href="catalog/">← Продолжить выбор</a></div><aside class="cart-total"><span class="drawer-eyebrow">Почти ваш подарок</span><h2>Ваш заказ</h2><div class="cart-summary-line"><span>Изделия · ${itemCountText()}</span><strong>${cartTotal()}</strong></div><div class="cart-summary-note">${icon('edit')}<p>Надпись, доставку и окончательную стоимость подтвердит мастер.</p></div><a class="button" href="how-to-order/?checkout=1">Оформить заявку ${icon('arrow')}</a><p class="cart-payment-note">Оплата после согласования заказа.</p></aside></div>`:emptyCartContent()}</div>`;
}
function refreshCartViews(focusSelector){
 const drawer=document.querySelector('#cart-drawer');
 const inDrawer=drawer.open;
 saveCart();
 if(inDrawer)renderCartDrawer();
 if(path==='/cart')cartPage();
 const scope=inDrawer?drawer:app;
 const next=focusSelector?scope.querySelector(focusSelector):null;
 if(next&&!next.disabled)next.focus();else if(inDrawer)drawer.querySelector('[data-cart-close]')?.focus();
}
function contentPage(name,content){document.title=name+' — vamknam.by';app.innerHTML=`<div class="standard-container content-page">${breadcrumb(name)}<h1>${name}</h1>${content}</div>`;}
function aboutPage(){contentPage('О мастере',`<div class="about-layout"><div class="about-copy"><h2>Ольга и Геннадий</h2><p>Создаём изделия из дерева с душой и вниманием к деталям. Ключницы, копилки, блокноты и декор — для вашего дома и в подарок близким.</p><p>От аккуратной лазерной резки до вашей личной надписи: обсудим форму, размер и оформление, чтобы готовая вещь радовала именно вас.</p><ul class="information-list"><li>${icon('leaf')}Натуральная фактура дерева</li><li>${icon('edit')}Имя, дата или надпись на заказ</li><li>${icon('parcel')}Отправка Белпочтой и Европочтой</li></ul><p>Выберите изделие в каталоге или расскажите о своей идее — согласуем детали, цену и срок изготовления.</p><div class="content-actions"><a class="button" href="catalog/">Смотреть каталог ${icon('arrow')}</a><a class="text-link" href="contacts/">Связаться с нами</a></div></div>${photo('leaves','Деревянная ключница с листьями','about-photo',true)}</div>`);}
function reviewsPage(){contentPage('Отзывы',`<div class="reviews-layout"><div class="reviews-copy"><h2>Поделитесь впечатлениями</h2><p>Уже заказывали изделие в нашей мастерской? Расскажите, как подарок порадовал вас или ваших близких. Нам важно ваше мнение.</p><p>Напишите нам в Instagram. Фотографию готового изделия можно приложить к сообщению.</p><div class="content-actions"><a class="button" href="${IG}" target="_blank" rel="noopener">Написать отзыв в Instagram ${icon('arrow')}</a><a class="text-link" href="catalog/">Посмотреть изделия</a></div></div><aside class="instagram-card">${icon('chat')}<h2>@vamknam.by</h2><p>Работы и публикации мастерской — в нашем Instagram.</p><a href="${IG}" target="_blank" rel="noopener">Открыть Instagram →</a></aside></div>`);}
function contactsPage(){contentPage('Контакты',`<p class="content-lead">Обсудим изделие, вашу надпись, дату готовности и доставку.</p><div class="contact-grid"><a class="contact-card" href="tel:+375447535310"><img class="contact-illustration" src="assets/contact/phone.webp" alt="" width="72" height="72" loading="lazy"><h2>Позвонить</h2><span>${PHONE}</span></a><a class="contact-card" href="${TG}"><img class="contact-illustration" src="assets/contact/telegram.webp" alt="" width="72" height="72" loading="lazy"><h2>Telegram</h2><span>Написать мастеру</span></a><a class="contact-card" href="${IG}" target="_blank" rel="noopener"><img class="contact-illustration" src="assets/contact/instagram.webp" alt="" width="72" height="72" loading="lazy"><h2>Instagram</h2><span>@vamknam.by</span></a></div><section class="pickup-info"><h2>Самовывоз</h2><p>${icon('pin')}<span><strong>Минск:</strong> пр. Дзержинского 126, стоянка «Простор», ст. м. Малиновка — после 18:30.</span></p><p>${icon('pin')}<span><strong>Фаниполь:</strong> ул. Зелёная — после 18:00.</span></p><p class="pickup-note">Время и место встречи согласуйте с мастером заранее.</p></section><section class="delivery-info"><h2>Доставка по Беларуси</h2><p>Отправляем Белпочтой и Европочтой. Способ получения, стоимость и срок отправки согласуем при заказе.</p><a class="button" href="how-to-order/">Как заказать ${icon('arrow')}</a></section>`);}
function notFound(){app.innerHTML='<div class="standard-container"><h1>Страница не найдена</h1><p><a href="./">На главную</a></p></div>';}
function addCart(id,text='',qty=1){const same=cart.find(x=>x.id===id&&x.text===text);if(same)same.qty=Math.min(99,same.qty+qty);else cart.push({id,text,qty});saveCart();document.querySelector('#cart-announcement').textContent=getProduct(id).name+' добавлено в корзину. '+itemCountText();openCart(id);}
if(path==='/')home();else if(path==='/catalog')catalog();else if(path==='/how-to-order')orderPage();else if(path==='/about')aboutPage();else if(path==='/reviews')reviewsPage();else if(path==='/contacts')contactsPage();else if(path==='/cart')cartPage();else if(path.startsWith('/product')){const slug=path.split('/')[2];productPage(params.get('id')||(slug==='klyuchnitsa-listya'?'leaves':({savings:'house',cannon:'mini-bar',pen:'notebook'})[slug]||slug)||'leaves');}else notFound();
saveCart();
const cartDrawer=document.querySelector('#cart-drawer');
cartDrawer.addEventListener('close',()=>document.body.classList.remove('cart-open'));
cartDrawer.addEventListener('click',e=>{if(e.target===cartDrawer){const r=cartDrawer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeCart();}});
document.querySelector('#header-cart').addEventListener('click',e=>{if(!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();openCart();}});
document.querySelector('#menu-toggle').addEventListener('click',e=>{const btn=e.currentTarget;const open=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');document.querySelector('#main-nav').classList.toggle('open',open);});
document.addEventListener('click',e=>{
 const thumb=e.target.closest('[data-photo]');if(thumb){const name=thumb.dataset.photo;document.querySelector('.main-photo img').src=A+name+'.webp';document.querySelector('.main-photo').classList.toggle('portrait-photo',name==='key-product-portrait');document.querySelector('#photo-dialog img').src=A+name+'.webp';document.querySelectorAll('.thumb').forEach(el=>el.classList.toggle('active',el===thumb));}
 if(e.target.closest('.main-photo'))document.querySelector('#photo-dialog').showModal();
 if(e.target.closest('.close-dialog'))document.querySelector('#photo-dialog').close();
 const qty=e.target.closest('[data-cart-qty]');if(qty){const index=Number(qty.dataset.cartQty);const item=cart[index];if(item){item.qty=Math.max(1,Math.min(99,item.qty+Number(qty.dataset.delta)));refreshCartViews(`[data-cart-qty="${index}"][data-delta="${qty.dataset.delta}"]`);}}
 const remove=e.target.closest('[data-cart-remove]');if(remove){const index=Number(remove.dataset.cartRemove);if(cart[index]){cart.splice(index,1);refreshCartViews();}}
 if(e.target.closest('[data-cart-close]'))closeCart();
 if(e.target.closest('#copy-order'))copyOrder();
 if(e.target.closest('#main-nav a')){document.querySelector('#main-nav').classList.remove('open');document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');}
});
let orderSummary='';
document.addEventListener('submit',e=>{
 if(e.target.id==='product-form'){e.preventDefault();const d=new FormData(e.target);addCart(e.target.dataset.id,String(d.get('personalization')||'').trim(),Math.min(99,Math.max(1,Number(d.get('quantity'))||1)));}
 if(e.target.id==='order-form'){e.preventDefault();const d=new FormData(e.target);orderSummary=`Здравствуйте! Меня зовут ${d.get('name')}. Хочу оформить заказ.\nТелефон: ${d.get('phone')}\n\n${cart.map(x=>{const p=getProduct(x.id);return `${p.name} — ${x.qty} шт., ${p.price===null?'цена по запросу':p.price*x.qty+' BYN'}${x.text?'\nНадпись: '+x.text:''}`;}).join('\n')}\n${d.get('idea')?'Пожелания: '+d.get('idea')+'\n':''}${d.get('date')?'Желаемая дата: '+d.get('date')+'\n':''}Получение: ${d.get('delivery')}.\nПодтвердите, пожалуйста, стоимость и сроки изготовления.`;document.querySelector('#order-result').innerHTML=`<h3>Сообщение готово</h3><p>Заявка ещё не отправлена. Скопируйте текст и отправьте мастеру в Telegram или Instagram.</p><textarea class="summary-box" readonly aria-label="Текст заявки">${esc(orderSummary)}</textarea><div class="result-actions"><button class="button" type="button" id="copy-order">Скопировать</button><a class="button" href="${TG}">Telegram</a><a class="button" href="${IG}" target="_blank" rel="noopener">Instagram</a></div>`;document.querySelector('#order-result').scrollIntoView({behavior:'smooth',block:'center'});}
});
async function copyOrder(){try{await navigator.clipboard.writeText(orderSummary);document.querySelector('#copy-order').textContent='Скопировано';toast('Сообщение скопировано');}catch{document.querySelector('.summary-box').select();toast('Выделенный текст можно скопировать вручную');}}
const legacyPages={'#about':'about/','#reviews':'reviews/','#contacts':'contacts/'};
if(path==='/'&&legacyPages[location.hash])location.replace(new URL(legacyPages[location.hash],document.baseURI));
