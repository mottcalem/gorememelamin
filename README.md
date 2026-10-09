# Göreme Melamin

Türkçe B2B ürün kataloğu ve teklif prototipi. React 19, TypeScript, Vite, Tailwind CSS, Lucide ve Radix Dialog kullanır.

## Çalıştırma

```sh
npm install
npm run dev
npm run build
```

Ana sayfa, ürün kataloğu, kategori/ürün detayları, teklif listesi ve formu, kurumsal, kalite, sektörel çözümler, kataloglar ve iletişim sayfaları bağlıdır. Filtre, sıralama, sayfa ve görünüm URL parametrelerinde saklanır. Teklif listesi `goreme-quote` localStorage anahtarında tutulur.

## İçerik ve entegrasyon

24 ürünün verisi `src/data/catalog.ts` içinde merkezidir. İlk 12 ürünün adları ve SKU bilgileri mevcut markanın sunum kaseleri listesinden alınmıştır. DEMO kodlu diğer ürünler örnektir. **Tüm teknik özellikler demo veridir** ve arayüzde işaretlidir. Fotoğraflar markanın mevcut sitesinden alınmıştır; demo ürünlerin fotoğrafları temsilidir.

`src/QuotePage.tsx` içindeki `quoteService.submit` gerçek API entegrasyonunun giriş noktasıdır. Şu anda hiçbir form verisi gönderilmez; demo başarı durumu gösterilir. Katalog bağlantıları resmî katalog sayfasına gider. Hukuki sayfalar prototip bilgilendirme metinleridir.

SEO meta title, description, canonical ve fiyat içermeyen Product JSON-LD istemci tarafında oluşturulur. Üretim yayını için SSR/prerender, doğrulanmış teknik veriler ve gerçek teklif API'si eklenmelidir. Hosting SPA rotalarını index.html'e yönlendirmelidir.

## Test

```sh
npm run dev
npm test
```

Playwright testleri arama, varyasyon birleştirme, localStorage kalıcılığı, demo talep, URL filtreleri ve mobil gezinmeyi doğrular. Yapılandırmada macOS Google Chrome yolu tanımlıdır; başka ortamda `launchOptions.executablePath` kaldırılıp `npx playwright install chromium` çalıştırılabilir.

Kaynak: https://gorememelamin.com.tr/ ve sunum kaseleri kategorisi.
