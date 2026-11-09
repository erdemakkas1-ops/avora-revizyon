/*
 * AVORA Giyim — revizyon önizlemesi
 * Ürün listesi canlı mağazadaki 3 ürünün elle kopyalanmış özetidir (ad, fiyat, bağlantı).
 * Shopify'da bu veriler Liquid (collection.products / product) üzerinden gelecek.
 * Bedenler ÖRNEKTİR; gerçek varyantlar Shopify'dan okunmalıdır.
 */
const STORE = 'https://www.avora.net.tr';
const products = [
  {id:'urban', handle:'avora-urban-storm-ruzgarlik-yagmurluk-gri', name:'AVORA Urban Storm – Rüzgarlık Yağmurluk – Gri', price:1490, img:'assets/urban.webp', w:485, h:733,
   description:'Gri renkte rüzgarlık ve yağmurluk.'},
  {id:'mont', handle:'erkek-sisme-mont-sportif-siklik-ve-sicak-konfortarzini-yansit-soguk-havalarda-konforundan-odun-verme', name:'Erkek Şişme Mont – Sportif Şıklık ve Sıcak Konfor', price:1690, img:'assets/mont.webp', w:486, h:652,
   description:'Tarzını yansıt, soğuk havalarda konforundan ödün verme.'},
  {id:'sweat', handle:'kadin-oversize-bisiklet-yaka-uzun-kollu-basic-sweatshirt-75751-m', name:'Kadın Oversize Bisiklet Yaka Uzun Kollu Basic Sweatshirt 75751', price:790, img:'assets/sweat.webp', w:484, h:732,
   description:'Bordo renkte, oversize kesim bisiklet yaka sweatshirt.'}
];
const SAMPLE_SIZES = ['S','M','L','XL'];

const byId = id => products.find(p => p.id === id);
const money = n => n.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' TL';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

/* Ürün kartı — Shopify card-product snippet'inin karşılığı */
function card(p, i) {
  return `<article class="product-card reveal" style="--d:${i * 70}ms">
    <div class="card-media">
      <a href="${STORE}/products/${p.handle}" data-open-product="${p.id}" aria-label="${p.name}">
        <img src="${p.img}" alt="${p.name}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async">
      </a>
      <button class="quick-add" data-open-product="${p.id}" aria-label="${p.name} — beden seç">Seç</button>
    </div>
    <h3 class="card-title"><a href="${STORE}/products/${p.handle}" data-open-product="${p.id}">${p.name}</a></h3>
    <p class="card-price">${money(p.price)}</p>
  </article>`;
}
$('#productGrid').innerHTML = products.map(card).join('');

/* Bölümler ekrana girerken tek seferlik, hafif görünme */
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries, ob) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ob.unobserve(e.target); }
  }), {threshold: .12, rootMargin: '0px 0px -40px 0px'});
  $$('.reveal').forEach(el => io.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('visible'));
}

/* Çekmeceler */
let activeDrawer = null, lastTrigger = null, toastTimer;
function closeDrawers() {
  if (!activeDrawer) return;
  activeDrawer.classList.remove('open');
  activeDrawer.inert = true;
  $$(`[aria-controls="${activeDrawer.id}"]`).forEach(b => b.setAttribute('aria-expanded', 'false'));
  activeDrawer = null;
  $('#overlay').hidden = true;
  document.body.classList.remove('locked');
  lastTrigger?.focus({preventScroll: true});
}
function openDrawer(id, trigger) {
  const keepTrigger = activeDrawer ? lastTrigger : null;
  if (activeDrawer) { activeDrawer.classList.remove('open'); activeDrawer.inert = true; }
  lastTrigger = trigger || keepTrigger || document.activeElement;
  activeDrawer = $('#' + id);
  activeDrawer.inert = false;
  activeDrawer.classList.add('open');
  $$(`[aria-controls="${id}"]`).forEach(b => b.setAttribute('aria-expanded', 'true'));
  $('#overlay').hidden = false;
  document.body.classList.add('locked');
  setTimeout(() => (activeDrawer.querySelector('input') || activeDrawer.querySelector('[data-close]'))?.focus({preventScroll: true}), 60);
}
function showToast(m) { const el = $('#toast'); el.textContent = m; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2800); }

/* Hızlı seçim (Shopify'daki "Seç" / quick add) */
let current = null, currentSize = null;
function openDetails(id, trigger) {
  current = byId(id); if (!current) return;
  currentSize = null;
  $('#productDetails').innerHTML = `
    <img class="detail-pic" src="${current.img}" alt="${current.name}" width="${current.w}" height="${current.h}">
    <div class="detail-content">
      <h3>${current.name}</h3>
      <p class="detail-price">${money(current.price)}</p>
      <p class="detail-desc">${current.description}</p>
      <fieldset class="sizes"><legend>Beden <span>(örnek)</span></legend>
        ${SAMPLE_SIZES.map(s => `<button type="button" class="size-btn" data-size="${s}" aria-pressed="false">${s}</button>`).join('')}
      </fieldset>
      <button class="btn btn-dark full" id="addToCart">Sepete ekle</button>
      <p class="size-warn" id="sizeWarn" hidden>Lütfen bir beden seçin.</p>
      <a class="text-link" href="${STORE}/products/${current.handle}" target="_blank" rel="noopener">Ürün sayfasını canlı mağazada aç <span aria-hidden="true">↗</span></a>
    </div>`;
  openDrawer('detailDrawer', trigger);
}

/* Önizleme sepeti — yalnızca bellekte */
let cart = [];
function addCart() {
  if (!current) return;
  if (!currentSize) { $('#sizeWarn').hidden = false; return; }
  const ex = cart.find(x => x.id === current.id && x.size === currentSize);
  ex ? ex.qty++ : cart.push({id: current.id, size: currentSize, qty: 1});
  updateCart();
  openDrawer('cartDrawer');
}
function updateCart() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  $('#cartCount').hidden = !count; $('#cartCount').textContent = count;
  $('#cartOpen').setAttribute('aria-label', count ? `Sepet, ${count} ürün` : 'Sepet');
  $('#cartItems').innerHTML = count ? cart.map((i, k) => { const p = byId(i.id); return `
    <div class="cart-item">
      <img src="${p.img}" alt="" width="${p.w}" height="${p.h}">
      <div>
        <h4>${p.name}</h4>
        <p>Beden: ${i.size}</p>
        <div class="qty-controls"><button data-qty="${k},-1" aria-label="Adedi azalt">−</button><span aria-live="polite">${i.qty}</span><button data-qty="${k},1" aria-label="Adedi artır">+</button></div>
      </div>
      <b>${money(p.price * i.qty)}</b>
    </div>`; }).join('')
    : `<div class="empty-message"><p>Sepetiniz boş</p><button class="btn btn-outline" data-close>Alışverişe devam et</button></div>`;
  $('#cartTotal').textContent = money(cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0));
}
updateCart();

/* Arama — önizlemede yalnızca bu 3 ürün içinde arar */
function searchProducts(text) {
  const q = text.toLocaleLowerCase('tr').trim();
  const list = q ? products.filter(p => p.name.toLocaleLowerCase('tr').includes(q)) : products;
  $('#searchResults').innerHTML = list.length
    ? `<p class="results-label">Ürünler</p>` + list.map(p => `<button class="search-item" data-open-product="${p.id}"><img src="${p.img}" alt="" width="${p.w}" height="${p.h}"><span>${p.name}<small>${money(p.price)}</small></span></button>`).join('')
    : '<div class="empty-message"><p>Eşleşen ürün bulunamadı.</p></div>';
}

$('#menuOpen').addEventListener('click', e => openDrawer('menuDrawer', e.currentTarget));
$('#searchOpen').addEventListener('click', e => { searchProducts(''); openDrawer('searchDrawer', e.currentTarget); });
$('#cartOpen').addEventListener('click', e => openDrawer('cartDrawer', e.currentTarget));
$('#accountOpen').addEventListener('click', () => showToast('Hesap sayfası mevcut Shopify müşteri hesabıyla çalışır; önizlemede kapalıdır.'));
$('#overlay').addEventListener('click', closeDrawers);
$('#searchInput').addEventListener('input', e => searchProducts(e.target.value));
$('#checkoutBtn').addEventListener('click', () => showToast('Önizleme: ödeme adımı canlı Shopify mağazasında yapılır.'));
$('#dismissDemo').addEventListener('click', () => $('.demo-ribbon').remove());
$('#newsletterForm').addEventListener('submit', e => { e.preventDefault(); $('#newsletterMessage').textContent = 'Önizleme: adres kaydedilmedi. Canlı sitede Shopify müşteri listesine eklenecek.'; });

document.addEventListener('click', e => {
  const t = e.target;
  if (t.closest('[data-close]')) { closeDrawers(); return; }
  const open = t.closest('[data-open-product]');
  if (open) { e.preventDefault(); openDetails(open.dataset.openProduct, open); return; }
  const sz = t.closest('[data-size]');
  if (sz) {
    currentSize = sz.dataset.size; $('#sizeWarn').hidden = true;
    $$('[data-size]').forEach(b => { const on = b.dataset.size === currentSize; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', on); });
    return;
  }
  if (t.closest('#addToCart')) { addCart(); return; }
  const q = t.closest('[data-qty]');
  if (q) { const [k, d] = q.dataset.qty.split(',').map(Number); cart[k].qty += d; if (cart[k].qty < 1) cart.splice(k, 1); updateCart(); return; }
  if (t.closest('.drawer-nav a')) closeDrawers();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawers(); });

/* Header gölgesi — tek bir pasif dinleyici, layout okumadan */
const header = $('#top');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => { header.classList.toggle('scrolled', scrollY > 10); ticking = false; });
}, {passive: true});
