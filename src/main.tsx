import {t,catalogText,initializeLanguage,language,languagePrefix,localizedPath,languages} from './i18n';
import React,{useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route,useLocation,Link} from 'react-router-dom';
import {QuoteProvider} from './quote';
import {Header,Footer,QuoteDrawer} from './components/Layout';
import {Home} from './Home';
import {Catalog} from './Catalog';
import {ProductDetail} from './Product';
import {QuotePage} from './QuotePage';
import {Corporate,Sectors,Catalogs,Contact,Policy} from './Pages';
import {productsBySlug,categories} from './data/catalog';
import './styles.css';
function PageMetadata(){const l=useLocation();
  const p=l.pathname.startsWith('/urun/') ? productsBySlug.get(l.pathname.slice(6)) : undefined;
  const scrollKey=p?'product:'+(p.familyId??p.id):l.pathname;
  useEffect(()=>{window.scrollTo(0,0)},[scrollKey]);
  useEffect(()=>{const c=categories.find(c=>l.pathname==='/kategori/'+c.id);const titles:Record<string,string>={'/urunler':'Tüm Ürünler','/teklif-listem':'Teklif Listem','/teklif-talebi':'Teklif Talebi','/hakkimizda':'Hakkımızda','/uretim-ve-kalite':'Üretim ve Kalite','/sektorel-cozumler':'Sektörel Çözümler','/kataloglar':'Dijital Kataloglar','/iletisim':'İletişim','/kvkk':'KVKK','/gizlilik-politikasi':'Gizlilik Politikası','/cerez-politikasi':'Çerez Politikası'};document.title=t(p?.name||c?.name||titles[l.pathname]||'Profesyonel Sunum Çözümleri')+' | Göreme Melamin';let meta=document.querySelector('meta[name="description"]');if(!meta){meta=document.createElement('meta');meta.setAttribute('name','description');document.head.appendChild(meta)}meta.setAttribute('content',catalogText(p?.description||'1972’den beri oteller, restoranlar ve profesyonel mutfaklar için Göreme Melamin sunum ve servis ekipmanları. Koleksiyonu keşfedin, teklif talep edin.'));let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.setAttribute('rel','canonical');document.head.appendChild(canonical)}canonical.setAttribute('href',window.location.origin+localizedPath(l.pathname));
  document.querySelectorAll('link[data-locale-alternate]').forEach(link=>link.remove());
  for (const target of Object.keys(languages) as (keyof typeof languages)[]) {
    const alternate=document.createElement('link');
    alternate.rel='alternate';
    alternate.hreflang=target;
    alternate.href=window.location.origin+localizedPath(l.pathname,target);
    alternate.dataset.localeAlternate='';
    document.head.appendChild(alternate);
  }
  document.getElementById('product-schema')?.remove();if(p){const script=document.createElement('script');script.id='product-schema';script.type='application/ld+json';script.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Product',name:t(p.name),sku:p.sku,description:catalogText(p.description),inLanguage:language,image:p.images,brand:{'@type':'Brand',name:'Göreme Melamin'}});document.head.appendChild(script)}},[l.pathname]);return null}
function App(){return <BrowserRouter basename={languagePrefix || "/"}><QuoteProvider><PageMetadata/><a className="skip-link" href="#main-content">{t("İçeriğe Geç")}</a><Header/><div id="main-content"><Routes><Route path="/" element={<Home/>}/><Route path="/urunler" element={<Catalog/>}/><Route path="/kategori/:slug" element={<Catalog/>}/><Route path="/urun/:slug" element={<ProductDetail/>}/><Route path="/teklif-listem" element={<QuotePage/>}/><Route path="/teklif-talebi" element={<QuotePage formOnly/>}/><Route path="/hakkimizda" element={<Corporate/>}/><Route path="/uretim-ve-kalite" element={<Corporate/>}/><Route path="/sektorel-cozumler" element={<Sectors/>}/><Route path="/kataloglar" element={<Catalogs/>}/><Route path="/iletisim" element={<Contact/>}/>{['kvkk','gizlilik-politikasi','cerez-politikasi'].map(s=><Route key={s} path={'/'+s} element={<Policy/>}/>)}<Route path="*" element={<main className="container page empty"><h1>{t("Sayfa bulunamadı")}</h1><Link className="button" to="/">{t("Ana Sayfaya Dön")}</Link></main>}/></Routes></div><Footer/><QuoteDrawer/></QuoteProvider></BrowserRouter>}
async function start() {
  await initializeLanguage();
  createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
}
void start();
