# Göreme Melamin

Türkçe B2B ürün kataloğu ve teklif listesi. React 19, TypeScript, Vite, Tailwind CSS, Lucide ve Radix Dialog kullanır.

## Çalıştırma

```sh
npm install
npm run dev
```

Geliştirme sunucusu çalışırken tarayıcıda **http://127.0.0.1:5173/** adresini açın. Terminali açık tutun. `localhost`, IPv6 üzerinden aynı portta çalışan başka bir projeye bağlanabilir; bu durumda `127.0.0.1` adresini kullanın. Port doluysa sunucu başka porta geçmek yerine hata verir.

Üretim derlemesi için `npm run build` çalıştırın.

Ana sayfa, ürün kataloğu, kategori/ürün detayları, teklif listesi ve formu, kurumsal, kalite, sektörel çözümler, kataloglar ve iletişim sayfaları bağlıdır. Filtre, sıralama, sayfa ve görünüm URL parametrelerinde saklanır. Teklif listesi `goreme-quote` localStorage anahtarında tutulur.

## İçerik ve entegrasyon

Ürün verileri `src/data/products.json` dosyasında tutulur. Katalog Excel’deki yayımlanmış ürün ve varyant kayıtlarını ayrı kartlar olarak gösterir. Ürün görselleri kaynak URL’lerinden yüklenir.

Teklif listesi tarayıcıda saklanır. Teklif ve iletişim bağlantıları kullanıcının e-posta uygulamasını açar. Üretim derlemesi `dist/` klasöründedir. Sunucu, doğrudan açılan uygulama rotalarını `index.html` dosyasına yönlendirmelidir.

## Test

```sh
npm run dev
npm test
```

Playwright testleri arama, varyasyon birleştirme, localStorage kalıcılığı, e-posta akışı, URL filtreleri ve mobil gezinmeyi doğrular. Yapılandırmada macOS Google Chrome yolu tanımlıdır; başka ortamda `launchOptions.executablePath` kaldırılıp `npx playwright install chromium` çalıştırılabilir.

Kaynak: https://gorememelamin.com.tr/ ve ürün Excel dosyası.

## Hero videosu

Hero alanı `public/videos/hero-goreme.mp4` dosyasından sessiz, otomatik ve döngülü oynatılır. YouTube oynatıcısı veya kontrolleri içermez. Kaynak: [Göreme Termostar Horeca Sunum Serileri](https://youtu.be/ZQCPUiKvXB4).
