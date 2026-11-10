/*
 * AVORA Giyim — revizyon önizlemesi
 *
 * CATALOG, canlı mağazanın herkese açık /products.json çıktısından (10.11.2026) alınmış bir kopyadır:
 * ürün kimlikleri, varyant kimlikleri, fiyatlar ve görseller gerçektir. Shopify temasında bu dizi
 * yerine Liquid ile {{ collection.products }} / {{ product | json }} kullanılacaktır (bkz. SHOPIFY.md).
 * Stok durumu yalnızca bu kopya anındaki "available" değeridir; canlı stok kontrolü Shopify'dadır.
 */
const STORE = 'https://www.avora.net.tr';
const CDN = 'https://cdn.shopify.com/s/files/1/1024/1500/8043/files/';
const CATALOG = [
  {key:'urban', handle:'avora-urban-storm-ruzgarlik-yagmurluk-gri',
   title:'AVORA Urban Storm – Rüzgarlık Yağmurluk – Gri',
   description:'Rüzgara karşı koruyan, su geçirmez yapısıyla gün boyu kuru ve şık kalmanı sağlar.',
   option:'Beden',
   variants:[[68016855974187,'S'],[68016856006955,'M'],[68016856039723,'L'],[68016856072491,'XL'],[68016857809195,'XXL']],
   price:1490, images:[['9DC928D9-EC91-44E5-A1D9-9C06AC4FD158.png?v=1793967040',1024,1536]]},
  {key:'mont', handle:'erkek-sisme-mont-sportif-siklik-ve-sicak-konfortarzini-yansit-soguk-havalarda-konforundan-odun-verme',
   title:'Erkek Şişme Mont – Sportif Şıklık ve Sıcak Konfor',
   description:'Yüksek yakalı tasarım, fermuarlı ön kapama ve kullanışlı yan cepler. Dolgulu yapısıyla soğuk havalarda rahat kullanım.',
   option:'Renk',
   variants:[[68012379373867,'Lacivert'],[68012379406635,'Bej'],[68012379439403,'Beyaz'],[68012379472171,'Kırmızı'],[68012379504939,'Kahverengi'],[68012379537707,'Siyah'],[68012379570475,'Mavi']],
   price:1690, images:[['3627da6f-2af6-40f3-9bd2-f54e4e82d5cb.jpg?v=1793908376',1086,1448],['2f3e6e53-b639-462f-9de5-0bbebae90607.jpg?v=1793908376',1086,1448]]},
  {key:'sweat', handle:'kadin-oversize-bisiklet-yaka-uzun-kollu-basic-sweatshirt-75751-m',
   title:'Kadın Oversize Bisiklet Yaka Uzun Kollu Basic Sweatshirt 75751',
   description:'Kalın şardonlu kumaşı ve oversize kalıbıyla rahat; göğüste minimal logo baskısı.',
   option:'Beden',
   variants:[[68016913973547,'S'],[68016914006315,'M'],[68016914039083,'L'],[68016914071851,'XL'],[68016914104619,'XXL']],
   price:790, images:[['21838FF8-403A-40DC-AA44-B21A4613AE38.png?v=1793968431',1024,1536],['7F710FE8-1653-450B-B2D7-65A5F5B5F103.png?v=1793968432',1024,1536]]}
];

const byKey = k => CATALOG.find(p => p.key === k);
const money = n => n.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' TL';
const img = (file, w) => `${CDN}${file}&width=${w}`;
const srcset = file => [360, 540, 720, 900].map(w => `${img(file, w)} ${w}w`).join(', ');
const productUrl = p => `${STORE}/products/${p.handle}`;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

/* Ürün kartı — Shopify card-product snippet'inin karşılığı */
const variantSummary = p => p.option === 'Renk' ? `${p.variants.length} renk` : p.variants.map(v => v[1]).join(' · ');
function card(p, i) {
  const [main, second] = p.images;
  return `<article class="product-card reveal" style="--d:${i * 80}ms">
    <div class="card-media">
      <a href="${productUrl(p)}" data-open-product="${p.key}" tabindex="-1" aria-hidden="true">
        <img src="${img(main[0], 540)}" srcset="${srcset(main[0])}" sizes="(max-width:640px) 50vw, 33vw" alt="" width="${main[1]}" height="${main[2]}" loading="lazy" decoding="async">
        ${second ? `<img class="alt" src="${img(second[0], 540)}" srcset="${srcset(second[0])}" sizes="(max-width:640px) 50vw, 33vw" alt="" width="${second[1]}" height="${second[2]}" loading="lazy" decoding="async">` : ''}
      </a>
      <span class="card-no">${String(i + 1).padStart(2, '0')}</span>
      <button class="card-plus" data-open-product="${p.key}" aria-label="${p.title} — hızlı incele"><span aria-hidden="true">+</span></button>
    </div>
    <div class="card-info">
      <h3 class="card-title"><a href="${productUrl(p)}" data-open-product="${p.key}">${p.title}</a></h3>
      <p class="card-price">${money(p.price)}</p>
    </div>
    <p class="card-variants">${variantSummary(p)}</p>
    <button class="card-btn" data-open-product="${p.key}" aria-label="${p.title} — ${p.option.toLocaleLowerCase('tr')} seç">${p.option} seç</button>
  </article>`;
}
$('#productGrid').innerHTML = CATALOG.map(card).join('');
$('#productCount').textContent = CATALOG.length;

/* Koleksiyon: şişme mont görselleri (mağazadaki gerçek ürün görselleri) */
const MONT_GALLERY = ['047ec026-f8ab-493c-bf3e-9dfaac0029f9', '45b5972e-e069-464d-8aca-fdb31e021cb7', '46c7f03e-5e63-4ed5-bb90-95635bdc3c65', '679c4867-d496-407b-ae51-df60e6291007', '5535627b-e3cd-40b4-94bf-d6434a5ab331', 'cd6bbe8c-ee0d-463a-a6e4-7a8c8d369078'];
$('#colorStrip').innerHTML = MONT_GALLERY.map((f, i) => `<button class="strip-item zoom" data-open-product="mont" aria-label="Erkek Şişme Mont — görsel ${i + 1}, renk seç"><img src="${img(f + '.jpg?v=1793908378', 420)}" alt="" width="1086" height="1448" loading="lazy" decoding="async"></button>`).join('');

/* Menüdeki ürün listesi (mağazada tek koleksiyon olduğu için kategori uydurulmaz) */
$('#navCount').textContent = CATALOG.length;
$('#navProducts').innerHTML = CATALOG.map(p => `<button class="nav-product" data-open-product="${p.key}"><img src="${img(p.images[0][0], 120)}" alt="" width="40" height="53" loading="lazy">${p.title}</button>`).join('');

/* Bölümler ekrana girerken tek seferlik görünme */
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries, ob) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ob.unobserve(e.target); }
  }), {threshold: .12, rootMargin: '0px 0px -40px 0px'});
  $$('.reveal, .zoom, .reveal-title').forEach(el => io.observe(el));
} else {
  $$('.reveal, .zoom, .reveal-title').forEach(el => el.classList.add('visible'));
}

/* Hero sahnesi: kaydırma ilerlemesi tek bir CSS değişkenine (--p) yazılır; yalnızca transform/opacity değişir */
const scene = $('#scene');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let sceneTick = false;
function updateScene() {
  sceneTick = false;
  const r = scene.getBoundingClientRect();
  const span = Math.max(1, r.height - innerHeight * (innerWidth >= 900 ? 1 : .35));
  const p = Math.min(1, Math.max(0, -r.top / span));
  scene.style.setProperty('--p', p.toFixed(3));
}
if (!reduce) {
  addEventListener('scroll', () => { if (!sceneTick) { sceneTick = true; requestAnimationFrame(updateScene); } }, {passive: true});
  addEventListener('resize', updateScene, {passive: true});
  updateScene();
}
/* Giriş animasyonu: rAF arka plan sekmelerinde çalışmayabilir, bu yüzden zamanlayıcıyla garanti edilir */
setTimeout(() => document.documentElement.classList.add('is-ready'), 30);

/* Çekmeceler */
let activeDrawer = null, lastTrigger = null, toastTimer;
function closeDrawers(restoreFocus = true) {
  if (!activeDrawer) return;
  activeDrawer.classList.remove('open');
  activeDrawer.inert = true;
  $$(`[aria-controls="${activeDrawer.id}"]`).forEach(b => b.setAttribute('aria-expanded', 'false'));
  activeDrawer = null;
  $('#overlay').hidden = true;
  document.body.classList.remove('locked');
  if (restoreFocus) lastTrigger?.focus({preventScroll: true});
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

/* Hızlı seçim — gerçek varyantlarla */
let current = null, currentVariant = null;
function openDetails(key, trigger) {
  current = byKey(key); if (!current) return;
  currentVariant = null;
  const [main] = current.images;
  $('#productDetails').innerHTML = `
    <img class="detail-pic" src="${img(main[0], 720)}" srcset="${srcset(main[0])}" sizes="420px" alt="${current.title}" width="${main[1]}" height="${main[2]}">
    <div class="detail-content">
      <h3>${current.title}</h3>
      <p class="detail-price">${money(current.price)}</p>
      <p class="detail-desc">${current.description}</p>
      <fieldset class="sizes"><legend>${current.option}</legend>
        ${current.variants.map(([id, name]) => `<button type="button" class="size-btn" data-variant="${id}" aria-pressed="false">${name}</button>`).join('')}
      </fieldset>
      <button class="btn btn-dark full" id="addToCart">Sepete ekle</button>
      <p class="size-warn" id="sizeWarn" hidden>Lütfen ${current.option.toLocaleLowerCase('tr')} seçin.</p>
      <a class="text-link" href="${productUrl(current)}" target="_blank" rel="noopener">Ürün sayfasını canlı mağazada aç <span aria-hidden="true">↗</span></a>
    </div>`;
  openDrawer('detailDrawer', trigger);
}

/* Önizleme sepeti — bellekte; ödeme Shopify sepet bağlantısıyla canlı mağazada açılır */
let cart = [];
function addCart() {
  if (!current) return;
  if (!currentVariant) { $('#sizeWarn').hidden = false; return; }
  const ex = cart.find(x => x.variant === currentVariant);
  ex ? ex.qty++ : cart.push({key: current.key, variant: currentVariant, qty: 1});
  updateCart();
  openDrawer('cartDrawer');
}
function updateCart() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  $('#cartCount').hidden = !count; $('#cartCount').textContent = count;
  $('#cartOpen').setAttribute('aria-label', count ? `Sepet, ${count} ürün` : 'Sepet');
  $('#cartItems').innerHTML = count ? cart.map((i, k) => {
    const p = byKey(i.key), v = p.variants.find(x => x[0] === i.variant);
    return `<div class="cart-item">
      <img src="${img(p.images[0][0], 180)}" alt="" width="${p.images[0][1]}" height="${p.images[0][2]}">
      <div>
        <h4>${p.title}</h4>
        <p>${p.option}: ${v[1]}</p>
        <div class="qty-controls"><button data-qty="${k},-1" aria-label="Adedi azalt">−</button><span aria-live="polite">${i.qty}</span><button data-qty="${k},1" aria-label="Adedi artır">+</button></div>
      </div>
      <b>${money(p.price * i.qty)}</b>
    </div>`; }).join('')
    : `<div class="empty-message"><p>Sepetiniz boş</p><button class="btn btn-outline" data-close>Alışverişe devam et</button></div>`;
  $('#cartTotal').textContent = money(cart.reduce((s, i) => s + byKey(i.key).price * i.qty, 0));
  const checkout = $('#checkoutBtn');
  checkout.href = count ? `${STORE}/cart/${cart.map(i => `${i.variant}:${i.qty}`).join(',')}` : '#';
  checkout.toggleAttribute('aria-disabled', !count);
  checkout.classList.toggle('disabled', !count);
}
updateCart();

/* Arama — mağazadaki tüm ürünler (şu an 3) içinde */
function searchProducts(text) {
  const q = text.toLocaleLowerCase('tr').trim();
  const list = q ? CATALOG.filter(p => (p.title + ' ' + p.variants.map(v => v[1]).join(' ')).toLocaleLowerCase('tr').includes(q)) : CATALOG;
  $('#searchResults').innerHTML = list.length
    ? `<p class="results-label">Ürünler</p>` + list.map(p => `<button class="search-item" data-open-product="${p.key}"><img src="${img(p.images[0][0], 160)}" alt="" width="${p.images[0][1]}" height="${p.images[0][2]}"><span>${p.title}<small>${money(p.price)}</small></span></button>`).join('')
    : '<div class="empty-message"><p>Eşleşen ürün bulunamadı.</p></div>';
}

$('#menuOpen').addEventListener('click', e => openDrawer('menuDrawer', e.currentTarget));
$('#searchOpen').addEventListener('click', e => { searchProducts(''); openDrawer('searchDrawer', e.currentTarget); });
$('#cartOpen').addEventListener('click', e => openDrawer('cartDrawer', e.currentTarget));
$('#overlay').addEventListener('click', () => closeDrawers());
$('#searchInput').addEventListener('input', e => searchProducts(e.target.value));
$('#checkoutBtn').addEventListener('click', e => { if (!cart.length) { e.preventDefault(); showToast('Sepetiniz boş.'); } });
$('#dismissDemo').addEventListener('click', () => $('.demo-ribbon').remove());
$('#newsletterForm').addEventListener('submit', e => { e.preventDefault(); $('#newsletterMessage').textContent = 'Önizleme: adres kaydedilmedi. Canlı sitede Shopify müşteri listesine eklenecek.'; });

document.addEventListener('click', e => {
  const t = e.target;
  if (t.closest('[data-close]')) { closeDrawers(); return; }
  const open = t.closest('[data-open-product]');
  if (open) { e.preventDefault(); openDetails(open.dataset.openProduct, open); return; }
  const vb = t.closest('[data-variant]');
  if (vb) {
    currentVariant = +vb.dataset.variant; $('#sizeWarn').hidden = true;
    $$('[data-variant]').forEach(b => { const on = b === vb; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', on); });
    return;
  }
  if (t.closest('#addToCart')) { addCart(); return; }
  const q = t.closest('[data-qty]');
  if (q) { const [k, d] = q.dataset.qty.split(',').map(Number); cart[k].qty += d; if (cart[k].qty < 1) cart.splice(k, 1); updateCart(); return; }
  if (t.closest('.drawer-nav a')) closeDrawers(false);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawers(); });

/* Header gölgesi — tek pasif dinleyici */
const header = $('#top');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => { header.classList.toggle('scrolled', scrollY > 10); ticking = false; });
}, {passive: true});
