import {test,expect} from '@playwright/test';

test.beforeEach(async ({context}) => {
  await context.route(/^https?:\/\/(?!127\.0\.0\.1:5173\/)/, route => route.abort());
});

test('ürün arama, varyantlar ve teklif listesi kalıcılığı',async({page})=>{await page.goto('/');await expect(page.getByRole('heading',{level:1})).toContainText('Profesyonel');await page.getByRole('button',{name:'Ürün ara',exact:true}).click();await page.getByPlaceholder('Ürün adı, SKU, kategori veya seri ara…').fill('696-W');await page.getByRole('link',{name:/Termostar Honey Bowl No 1/}).click();await page.getByRole('button',{name:'Teklif Listesine Ekle',exact:true}).first().click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Ürünleri İncelemeye Devam Et'}).click();await page.getByRole('button',{name:'Teklif Listesine Ekle',exact:true}).first().click();await page.getByRole('button',{name:'Ürünleri İncelemeye Devam Et'}).click();await page.getByRole('link',{name:'Siyah',exact:true}).click();await page.getByRole('button',{name:'Teklif Listesine Ekle',exact:true}).first().click();await page.getByRole('link',{name:'Teklif Listesine Git',exact:true}).click();await expect(page.locator('.quote-row')).toHaveCount(2);await expect(page.locator('.quote-row input').first()).toHaveValue('2');await page.reload();await expect(page.locator('.quote-row')).toHaveCount(2);const submit=page.getByRole('button',{name:'Fiyat Teklifi Al'});
  await submit.click();
  await expect(page.getByRole('status')).toHaveCount(0);
  await page.getByLabel('Firma Adı').fill('Örnek Firma');
  await page.getByLabel('Yetkili Adı Soyadı').fill('Deneme Kullanıcısı');
  await page.getByLabel('E-posta',{exact:false}).fill('test@example.com');
  await page.getByLabel('Telefon').fill('05550000000');
  await submit.click();
  await expect(page.getByRole('status')).toContainText('E-postanız gönderildi.');
  await expect(page.getByRole('status')).toContainText('Teklif talebinizi değerlendirip size dönüş yapacağız.');
  await expect(page).toHaveURL(/teklif-listem$/);});

test('filtre URL, liste görünümü ve boş sonuç',async({page})=>{await page.goto('/urunler');await expect(page.locator('.product-card')).toHaveCount(12);await page.getByLabel('Termostar',{exact:true}).click();await expect(page.getByLabel('Termostar',{exact:true})).toBeChecked();await expect(page).toHaveURL(/seri=Termostar/);await page.reload();await expect(page.getByLabel('Termostar',{exact:true})).toBeChecked();await page.getByRole('button',{name:'Liste görünümü'}).click();await expect(page.locator('.product-grid')).toHaveClass(/list-view/);await page.goto('/kategori/acik-bufe-sunum-ekipmanlari?alt-kategori=Sunum+Kaseleri');
await expect(page.getByText('140 ürün bulundu')).toBeVisible();
await page.goto('/urunler?q=zzzzzz');
await expect(page.getByText('Bu filtrelerle ürün bulunamadı.')).toBeVisible();});

test('mobil taşma, menü ve filtre çekmecesi',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.getByRole('button',{name:'Menüyü aç'}).click();await page.getByRole('dialog').locator('summary').first().click();await page.getByRole('link',{name:'Tüm Ürünler',exact:true}).first().click();await page.getByRole('button',{name:'Filtrele',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Kapat',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();});
test('hover menüler ve aramadan sonuçlara geçiş',async({page})=>{await page.goto('/');await expect(page.locator('header .brand img')).toHaveAttribute('src','/images/Goreme_LOGOs.png');await page.getByRole('button',{name:'Ürünler',exact:true}).hover();await expect(page.locator('.mega-menu')).toBeVisible();await page.locator('.mega-menu').hover();await expect(page.locator('.mega-menu')).toBeVisible();await page.getByRole('button',{name:'Kurumsal',exact:true}).hover();await expect(page.locator('.corporate-dropdown')).toBeVisible();await page.getByRole('link',{name:'Üretim ve Kalite',exact:true}).first().click();await expect(page).toHaveURL(/uretim-ve-kalite/);await page.getByRole('button',{name:'Ürün ara',exact:true}).click();await page.getByPlaceholder('Ürün adı, SKU, kategori veya seri ara…').fill('bowl honey');await expect(page.locator('.search-results a')).toHaveCount(8);await page.locator('.search-results a').first().click();await expect(page.getByRole('dialog')).not.toBeVisible();await page.getByRole('button',{name:'Ürün ara',exact:true}).click();await page.locator('.search-results a').first().click();await expect(page.getByRole('dialog')).not.toBeVisible();await page.getByRole('button',{name:'Ürün ara',exact:true}).click();await page.getByPlaceholder('Ürün adı, SKU, kategori veya seri ara…').fill('sunum kasesi');await page.getByRole('button',{name:'Arama sonuçlarını göster'}).click();await expect(page).toHaveURL(/q=sunum/);await expect(page.locator('.product-card')).toHaveCount(12);});
test('kaynak görseli, teknik ölçüler ve varyant görselleri',async({page})=>{
  await page.goto('/urun/termostar-honey-bowl-no-1');
  await expect(page.locator('.detail-image img')).toHaveAttribute('src', /^https:\/\/gorememelamin\.com\.tr\/wp-content\//);
  await expect(page.getByText('ø18*h. 8cm',{exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Beyaz',exact:true}).click();
  await expect(page.locator('.detail-image img')).toHaveAttribute('src', /696-W\.png$/);
  await expect(page.getByText('SKU: 696-W',{exact:true})).toBeVisible();
});

test('677 ürün ailesi ayrı kartlarda ve doğru SKU ile teklif listesinde', async ({page}) => {
  await page.goto('/urunler?q=Termostar+Açık+Büfe+Sunum+25+R');
  await expect(page.locator('.product-card')).toHaveCount(4);
  for (const sku of ['677-W','677-B','677-R','677']) {
    await expect(page.locator('.product-card').getByText('SKU: '+sku,{exact:true})).toBeVisible();
  }
  const red = page.locator('.product-card').filter({has:page.getByText('SKU: 677-R',{exact:true})});
  await expect(red.locator('img')).toHaveAttribute('src', /677-R\.png$/);
  await red.getByRole('heading').click();
  await expect(page.locator('.detail-copy').getByText('SKU: 677-R',{exact:true})).toBeVisible();
  await expect(page.locator('.variant-label').getByText('Renk',{exact:true})).toBeVisible();
  const swatches = page.locator('.swatch-options');
  await expect(swatches.locator('.product-swatch')).toHaveCount(3);
  await expect(swatches.getByRole('link',{name:'Kırmızı'})).toHaveAttribute('aria-current','page');
  await expect(swatches.getByRole('link',{name:'Kırmızı'}).locator('.product-swatch')).toHaveCSS('background-color','rgb(207, 39, 45)');
  await expect(page.locator('.detail-image img')).toHaveAttribute('src', /677-R\.png$/);
  await page.getByRole('button',{name:'Teklif Listesine Ekle',exact:true}).first().click();
  await expect(page.getByRole('dialog')).toContainText('SKU: 677-R');
  await page.getByRole('link',{name:'Teklif Listesine Git'}).click();
  await expect(page.locator('.quote-row')).toContainText('SKU: 677-R');
  await expect(page.locator('.quote-row img')).toHaveAttribute('src', /677-R\.png$/);
});

test('mobilde renk değişimi kaydırma konumunu ve teklif adedini korur', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/urun/termostar-acik-bufe-sunum-31r-varyant-686-w-13898');
  await page.locator('#quantity').fill('3');

  const swatches=page.locator('.swatch-options');
  const black=swatches.getByRole('link',{name:'Siyah',exact:true});
  await black.evaluate(element=>element.scrollIntoView({block:'center',behavior:'instant'}));
  const scrollY=await page.evaluate(()=>window.scrollY);
  expect(scrollY).toBeGreaterThan(0);

  await black.click();
  await expect(page).toHaveURL(/686-b-13899$/);
  await expect(black).toHaveAttribute('aria-current','page');
  await expect(page.locator('.detail-copy .sku')).toHaveText('SKU: 686-B');
  await expect(page.locator('.detail-image img')).toHaveAttribute('src', /686-B\.png$/);
  await expect(page.locator('#quantity')).toHaveValue('3');
  expect(await page.evaluate(()=>window.scrollY)).toBeCloseTo(scrollY,0);

  await swatches.getByRole('link',{name:'Kırmızı',exact:true}).click();
  await expect(page).toHaveURL(/686-r-13900$/);
  await expect(page.locator('.detail-copy .sku')).toHaveText('SKU: 686-R');
  expect(await page.evaluate(()=>window.scrollY)).toBeCloseTo(scrollY,0);

  await page.locator('.mobile-product-add').getByRole('button').click();
  await expect(page.getByRole('dialog')).toContainText('SKU: 686-R · Kırmızı · 3 adet eklendi');
});
