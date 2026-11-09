# AVORA Giyim — Mevcut site revizyonu (V4)

Bu klasör, **www.avora.net.tr** Shopify mağazasının görsel ve kullanıcı deneyimi revizyonu için hazırlanmış bir **önizlemedir**.
Sıfırdan bir site değildir. Canlı mağazaya, temaya veya DNS kayıtlarına hiçbir değişiklik yapılmamıştır.

V4, müşterinin onayladığı V2 kodunun üzerine kurulmuştur. Askılık konseptli V3 sürümü, mevcut formattan fazla uzaklaştığı için kullanılmamıştır.

## Korunan yapı (canlı siteyle aynı sıra)
1. Duyuru çubuğu
2. Header: solda menü ve arama, ortada logo, sağda hesap ve sepet
3. Siyah/altın AVORA bannerı, "AVORA GİYİM FARKIYLA" başlığı, tek buton
4. **Ürünler** (featured collection) + "Seç" hızlı ekleme
5. **AVORA KOLEKSİYON** (featured product) + "Tüm koleksiyonu keşfet"
6. E-posta listesi
7. Footer

## Önizlemede çalışan / çalışmayan
| Özellik | Durum |
|---|---|
| Menü, arama, sepet ve ürün çekmeceleri | Arayüz çalışır |
| Arama | Yalnızca bu sayfadaki 3 ürün içinde arar. Shopify'da tema araması kullanılacak |
| Sepet | Yalnızca tarayıcı belleğinde tutulur. Gerçek sepet ve ödeme Shopify'dadır |
| Bedenler (S–XL) | **Örnek**. Gerçek bedenler Shopify varyantlarından gelecek |
| Hesap, ödeme, e-posta kaydı | Önizlemede kapalı; canlı sitede Shopify ile çalışır |
| "Tümünü görüntüle", "Tüm koleksiyonu keşfet", "Ürün sayfasını aç" | Canlı mağazadaki gerçek sayfalara gider |

## Shopify'a uygulama
- İşlemi canlı temanın **kopyası** (Online Mağaza → Temalar → Çoğalt) üzerinde yapın. Önizleme bağlantısıyla müşteri onayı aldıktan sonra yayınlayın.
- Bölümlerin Shopify karşılıkları:
  - Hero → image-banner
  - Ürünler → featured-collection
  - Koleksiyon → featured-product
  - E-posta listesi → newsletter
- Değişikliklerin büyük kısmı tema ayarları ve CSS düzeyindedir:
  - Renkler: beyaz, siyah, altın #C3A462
  - Font: Inter
  - Butonlar köşeli
  - Kart oranı 3:4
  - Mobilde kaydırmalı ürün sırası
- Ürün kartında ikinci görsel varsa hover geçişi tema ayarından açılabilir. Canlı mağazada şişme mont ve sweatshirt için ek görseller var.
- Hero için logonun düşük çözünürlüklü kopyası kullanıldı. Canlı sitedeki 3840 px banner görseli kullanılmalı.

## Müşteriye önerilen içerik düzeltmeleri (Shopify yöneticisinden)
- Hero butonu canlıda İngilizce ("Shop all"). Önerilen metin: "Tüm ürünleri keşfet".
- Mont başlığına açıklama metni karışmış ("…KonforTarzını yansıt…"). Başlık kısaltılmalı, cümle açıklamaya taşınmalı.
- Sweatshirt başlığının sonunda ", M" var. Beden varyant olarak tanımlanmalı.
- Fiyatlar canlıda "1,690.00TL" biçiminde görünüyor. Türkçe biçim önerilir: "1.690,00 TL".
- Ürün görsellerinde Lacoste ve ZARA logoları var. Kendi ürün fotoğraflarıyla değiştirilmesi önerilir.

## DNS durumu (9 Kasım 2026 kontrolü)
- `www.avora.net.tr` çalışıyor. Kayıt: CNAME → shops.myshopify.com, yanıt 200.
- `avora.net.tr` (kök) hâlâ **Cloudflare Error 1001** veriyor. HTTPS bağlantısında sertifika hatası var.
- Herkese açık DNS kayıtları:
  - Kök alan adında A → 23.227.38.65. Bu, Shopify'ın belgelediği değer.
  - Ad sunucuları dnsenable.com. Yani alan adı Cloudflare hesabında yönetilmiyor; kayıt firmasının DNS'i kullanılıyor.
- Muhtemel neden: kök alan adı Shopify'a bağlı değil ya da doğrulanmamış. Kayıtlar doğru olsa da Shopify isteği tanımadığı için 1001 dönüyor.

Erişim gerektiren kontrol adımları:
1. Shopify → Ayarlar → Alan adları: `avora.net.tr` listede mi, durumu "Bağlandı" mı? Değilse "Mevcut alan adını bağla" ile ekleyin ve doğrulayın.
2. Birincil alan adı www ise kök alan adının www'ye yönlendirildiğini kontrol edin.
3. Kayıt firmasının DNS panelinde kök için tek bir A kaydı olmalı (23.227.38.65). Çakışan A/AAAA ya da URL yönlendirme kaydı olmamalı.
4. MX/TXT (e-posta) kayıtlarına dokunmayın.
5. Shopify SSL sertifikasını verdikten sonra http, https, www ve kök adreslerini mobilde ve masaüstünde yeniden test edin.

## Lokal çalıştırma
Bu klasörde `python -m http.server 5173` komutunu çalıştırın, ardından http://localhost:5173 adresini açın.
