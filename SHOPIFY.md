# Shopify entegrasyon planı

Önizleme statik bir sayfadır. Aşağıdaki adımlar canlı temanın **kopyası** üzerinde, müşteri onayı ve Shopify yönetici erişimiyle yapılmalıdır.
Canlı tema, sipariş akışı ve ödeme ayarları değiştirilmez.

## 1. Veri kaynağı
`app.js` içindeki `CATALOG`, mağazanın herkese açık `/products.json` çıktısının kopyasıdır. Bu kopya 10.11.2026 tarihlidir ve şunları içerir:
- 3 ürün
- Gerçek ürün ve varyant ID'leri
- Fiyatlar
- Görseller

Temada bu dizinin yerine Liquid kullanılır:

```liquid
{%- comment -%} sections/featured-collection.liquid {%- endcomment -%}
{%- for product in section.settings.collection.products limit: section.settings.products_to_show -%}
  {% render 'card-product', product: product %}
{%- endfor -%}
```

```liquid
{%- comment -%} snippets/card-product.liquid — önizlemedeki card() fonksiyonunun karşılığı {%- endcomment -%}
<article class="product-card">
  <a class="card-media" href="{{ product.url }}">
    {{ product.featured_media | image_url: width: 900 | image_tag: widths: '360,540,720,900', sizes: '(max-width:640px) 50vw, 33vw', loading: 'lazy' }}
    {%- if product.media[1] -%}
      {{ product.media[1] | image_url: width: 900 | image_tag: class: 'alt', widths: '360,540,720,900', loading: 'lazy' }}
    {%- endif -%}
  </a>
  <h3 class="card-title"><a href="{{ product.url }}">{{ product.title }}</a></h3>
  <p class="card-price">{{ product.price | money }}</p>
  {%- if product.available -%}
    <button class="card-btn" data-quick-add="{{ product.handle }}">{{ product.options.first }} seç</button>
  {%- else -%}
    <button class="card-btn" disabled>Tükendi</button>
  {%- endif -%}
</article>
```

## 2. Varyant ve stok
- Hızlı seçim paneli varyantları `{{ product | json }}` ya da `/products/{handle}.js` üzerinden okur.
- Stokta olmayan varyantlar `variant.available == false` kontrolüyle pasif gösterilir.
- Önizlemedeki `available` değerleri kopyalandığı ana aittir. Canlı stok her zaman Shopify'dan okunmalıdır.

## 3. Sepet ve ödeme
- Önizleme sepeti yalnızca tarayıcıdadır.
- "Ödemeye geç" butonu, Shopify sepet bağlantısıyla (`/cart/{variant_id}:{adet}`) canlı mağazanın **gerçek** sepetini ve ödemesini açar. Bu yolla sipariş verilirse sipariş gerçektir.
- Temada sepet işlemleri Shopify Ajax Cart API ile yapılır:
  - `POST /cart/add.js` — `{ items: [{ id: variantId, quantity }] }`
  - `POST /cart/change.js` — adet değiştirme
  - `GET /cart.js` — çekmeceyi yenileme
- Ödeme her zaman Shopify Checkout'tur; özel ödeme kodu yazılmaz.

## 4. Arama
- Önizleme yalnızca `CATALOG` içinde arar. Şu an mağazadaki ürünlerin tamamı bu 3 üründen oluşuyor.
- Temada Shopify Predictive Search kullanılır: `GET /search/suggest.json?q=…&resources[type]=product`. Sonuç sayfası `/search?q=…` adresidir.

## 5. Menü
- Mağazada tek koleksiyon var: "Ana sayfa" (`frontpage`). Kategori uydurulmadı.
- Menü Shopify → Online Mağaza → Navigasyon üzerinden yönetilir. Tema `linklists.main-menu` değerini okur.
- Kadın/Erkek gibi koleksiyonlar mağazada oluşturulursa menüye otomatik eklenebilir.

## 6. Hesap ve bülten
- Hesap ikonu: `{{ routes.account_url }}`. Önizlemede canlı mağazanın hesap sayfasını açar.
- Bülten: `{% form 'customer' %}` ile `contact[tags]=newsletter`. Kayıtlar Shopify müşteri listesine düşer.

## 7. Uygulama sırası
1. Online Mağaza → Temalar → canlı temayı **Çoğalt**.
2. Kopyada renk ve font ayarlarını yap:
   - Beyaz zemin, siyah metin, altın #C3A462
   - Inter fontu
   - Köşeli butonlar
3. CSS'i `assets/avora-revizyon.css` olarak ekle. Bölüm sınıflarını eşle.
4. `card-product` snippet'ini güncelle. Hızlı seçim çekmecesini ekle.
5. Önizleme bağlantısıyla müşteri onayı al, ardından yayınla.
