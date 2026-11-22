import {t,language,languages,localizedPath,optionText,type Language} from '../i18n';
import {useState,useEffect,useRef} from 'react';
import {Link,NavLink,useLocation,useNavigate} from 'react-router-dom';
import {ArrowRight,ArrowUpRight,Search,Menu,ChevronDown,ClipboardList,Check,Phone,Mail,MapPin,Instagram} from 'lucide-react';
import {categories,products,searchProducts,subcategories} from '../data/catalog';
import {useQuote} from '../quote';
import {Modal} from './ui';
const flagCodes: Record<Language,string> = {tr:'tr',en:'gb',da:'dk',ar:'sa'};

function LanguageFlag({code}:{code:Language}) {
  return <img className="language-flag" src={'/images/flags/'+flagCodes[code]+'.png'} alt="" width={20} height={15}/>;
}

function LanguageSelector() {
  const {pathname,search,hash}=useLocation();
  const [open,setOpen]=useState(false);
  const container=useRef<HTMLDivElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);

  useEffect(()=>{
    if (!open) return;
    function closeOutside(event:PointerEvent) {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown',closeOutside);
    return ()=>document.removeEventListener('pointerdown',closeOutside);
  },[open]);

  return <div className="language-dropdown" ref={container}
    onBlur={event=>{if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)}}
    onKeyDown={event=>{
      if (event.key==='Escape' && open) {
        event.preventDefault();
        setOpen(false);
        trigger.current?.focus();
      }
    }}>
    <button className="language-select" type="button" ref={trigger}
      aria-label={t('Dil')+' · '+languages[language]} aria-expanded={open} aria-controls="language-options"
      onClick={()=>setOpen(!open)}>
      <LanguageFlag code={language}/>
      <ChevronDown size={10} aria-hidden="true"/>
    </button>
    <ul className="language-options" id="language-options" hidden={!open}>
      {(Object.entries(languages) as [Language,string][]).filter(([code])=>code!==language).map(([code,label])=>
        <li key={code}><a href={localizedPath(pathname,code)+search+hash} lang={code} hrefLang={code}
          aria-label={label} title={label}>
          <LanguageFlag code={code}/>
        </a></li>)}
    </ul>
  </div>;
}

export function Header(){const [search,setSearch]=useState(false),[query,setQuery]=useState(''),[mega,setMega]=useState(false),[corporate,setCorporate]=useState(false),[mobile,setMobile]=useState(false);const q=useQuote(),location=useLocation(),navigate=useNavigate();useEffect(()=>{setMega(false);setCorporate(false);setMobile(false);setSearch(false)},[location]);const matches=searchProducts(query);const results=matches.slice(0,8);return <><div className="topbar"><div className="container"><span>{t("1972’den beri, sunumun her detayında.")}</span><a href="tel:+905330137550"><Phone size={12}/> +90 533 013 75 50 <span className="top-divider">|</span> <span>{t("Türkiye’de üretilir. Dünyaya sunulur.")}</span></a></div></div><header onMouseLeave={()=>{setMega(false);setCorporate(false)}}><div className="container header-inner"><Link to="/" className="brand" aria-label={t("Göreme Melamin ana sayfa")}><img src="/images/Goreme_LOGOs.png" alt="Göreme Melamin"/></Link><nav className="desktop-nav"><NavLink to="/" onMouseEnter={()=>{setMega(false);setCorporate(false)}}>{t("Ana Sayfa")}</NavLink><button className={mega?'active':''} onMouseEnter={()=>{setMega(true);setCorporate(false)}} onFocus={()=>{setMega(true);setCorporate(false)}} onClick={()=>setMega(!mega)} aria-expanded={mega}>{t("Ürünler")} <ChevronDown size={13}/></button><NavLink onMouseEnter={()=>{setMega(false);setCorporate(false)}} to="/sektorel-cozumler">{t("Sektörel Çözümler")}</NavLink><div className="nav-dropdown"><button onMouseEnter={()=>{setCorporate(true);setMega(false)}} onFocus={()=>{setCorporate(true);setMega(false)}} onClick={()=>setCorporate(!corporate)} aria-expanded={corporate}>{t("Kurumsal")} <ChevronDown size={13}/></button>{corporate&&<div className="corporate-dropdown"><Link to="/hakkimizda">{t("Hakkımızda")}</Link><Link to="/uretim-ve-kalite">{t("Üretim ve Kalite")}</Link><Link to="/sektorel-cozumler">{t("Sektörel Çözümler")}</Link></div>}</div><NavLink onMouseEnter={()=>{setMega(false);setCorporate(false)}} to="/kataloglar">{t("Kataloglar")}</NavLink><NavLink onMouseEnter={()=>{setMega(false);setCorporate(false)}} to="/iletisim">{t("İletişim")}</NavLink></nav><div className="header-actions"><LanguageSelector/><button className="icon-button" aria-label={t("Ürün ara")} onClick={()=>{setMega(false);setCorporate(false);setSearch(true)}}><Search size={20}/></button><Link className="quote-nav" to="/teklif-listem"><ClipboardList size={19}/><span>{t("Teklif Listem")}</span><b>{q.items.length}</b></Link><Link className="button small header-cta" to="/teklif-talebi">{t("Teklif Al")} <ArrowUpRight size={16}/></Link><button className="icon-button mobile-toggle" aria-label={t("Menüyü aç")} onClick={()=>setMobile(true)}><Menu/></button></div></div>{mega&&<div className="mega-menu container"><div><span className="eyebrow">{t("ÜRÜN KOLEKSİYONUMUZ")}</span><h2>{t("Her sunuma")}<br/>{t("doğru çözüm.")}</h2><Link to="/urunler" className="text-link">{t("Tüm Ürünleri Görüntüle")} <ArrowRight size={16}/></Link></div><div><div className="mega-subcategories">{subcategories.filter(item=>item.parentId===categories[0].id).map(({name:s})=><Link key={s} to={'/kategori/'+categories[0].id+'?alt-kategori='+encodeURIComponent(s)}>{t(s)}</Link>)}</div><div className="mega-grid">{categories.map(c=><Link key={c.id} to={'/kategori/'+c.id}><img src={c.image} alt=""/><span>{t(c.name)}<small>{t("Serileri ve ürünleri keşfedin")}</small></span><ArrowUpRight size={15}/></Link>)}</div></div></div>}</header><Modal open={mobile} onClose={()=>setMobile(false)} title={t("Menü")} drawer><nav className="mobile-nav"><Link to="/">{t("Ana Sayfa")}</Link><details><summary>{t("Ürünler")}</summary><Link to="/urunler">{t("Tüm Ürünler")}</Link>{categories.map(c=><details key={c.id}><summary>{t(c.name)}</summary><Link to={'/kategori/'+c.id}>{t("Ürünleri İncele")}</Link>{c.id===categories[0].id&&subcategories.filter(item=>item.parentId===categories[0].id).map(({name:s})=><Link key={s} to={'/kategori/'+c.id+'?alt-kategori='+encodeURIComponent(s)}>{t(s)}</Link>)}</details>)}</details>{[['Sektörel Çözümler','/sektorel-cozumler'],['Kurumsal','/hakkimizda'],['Üretim ve Kalite','/uretim-ve-kalite'],['Kataloglar','/kataloglar'],['İletişim','/iletisim']].map(([name,path])=><Link to={path} key={path}>{t(name)}</Link>)}</nav></Modal><Modal open={search} onClose={()=>setSearch(false)} title={t("Ne aramıştınız?")}><form onSubmit={e=>{e.preventDefault();setSearch(false);navigate('/urunler?q='+encodeURIComponent(query.trim()))}} className="search-input"><Search size={22}/><input name="q" autoFocus placeholder={t("Ürün adı, SKU, kategori veya seri ara…")} value={query} onChange={e=>setQuery(e.target.value)}/><button type="submit" className="search-submit" aria-label={t("Arama sonuçlarını göster")}><ArrowRight size={19}/></button></form><div className="suggestions">{['696','Honey Bowl','Sunum Kasesi','Servis Tepsisi'].map(s=><button key={s} onClick={()=>setQuery(t(s))}>{t(s)}</button>)}</div><p className="muted">{query?t("{count} ürün bulundu",{count:matches.length}):t("Öne çıkan ürünler")}</p><div className="search-results">{results.map(p=><Link onClick={()=>setSearch(false)} to={'/urun/'+p.slug} key={p.id}><img src={p.images[0]} alt=""/><span><strong>{t(p.name)}</strong><small>{t("SKU:")} {p.sku}{p.variantLabel&&' · '+optionText(p.variantLabel)}</small></span><ArrowUpRight size={18}/></Link>)}</div>{matches.length>0&&<Link className="button secondary full" onClick={()=>setSearch(false)} to={'/urunler?q='+encodeURIComponent(query)}>{t("Tüm Sonuçları Gör ({count})",{count:matches.length})} <ArrowRight size={16}/></Link>}{!results.length&&<div className="empty"><Search/><h3>{t("Aramanıza uygun ürün bulunamadı.")}</h3><p>{t("Farklı bir ürün adı veya SKU deneyin.")}</p><Link className="button" to="/urunler">{t("Kategorileri Keşfet")}</Link></div>}</Modal></>}
export function QuoteDrawer(){const q=useQuote();const p=products.find(p=>p.id===q.latest?.productId);return <Modal open={!!q.latest} onClose={q.close} title={t("Teklif Listenize Eklendi")} drawer><div className="success-icon"><Check/></div><p>{t("Ürününüz teklif listenizde sizi bekliyor.")}</p>{p&&<div className="drawer-product"><img src={p.images[0]} alt={t(p.name)}/><h3>{t(p.name)}</h3><p>{t("SKU:")} {p.sku}{(p.variantLabel||q.latest?.color)&&' · '+optionText(p.variantLabel||q.latest?.color||"")} · {t("{count} adet eklendi",{count:q.latest?.quantity??0})}</p></div>}<Link className="button full" to="/teklif-listem" onClick={q.close}>{t("Teklif Listesine Git")} <ArrowRight size={17}/></Link><button className="button secondary full" onClick={q.close}>{t("Ürünleri İncelemeye Devam Et")}</button><small className="muted">{t("Listeniz bu cihazda otomatik olarak saklanır.")}</small></Modal>}
export function Footer(){return <footer><div className="container footer-grid"><div><Link className="brand" to="/"><img src="/images/Goreme_LOGOs.png" alt="Göreme Melamin"/></Link><p>{t("1972’den beri profesyonel sunumun")}<br/>{t("her detayında.")}</p><a className="text-link" href="https://www.instagram.com/gorememelamin/" target="_blank" rel="noreferrer"><Instagram size={18}/>{" "+t("Instagram")+" "}<ArrowUpRight size={15}/></a></div><div><h4>{t("Ürün Kategorileri")}</h4>{categories.slice(0,5).map(c=><Link to={'/kategori/'+c.id} key={c.id}>{t(c.name)}</Link>)}<Link to="/urunler">{t("Tüm Ürünler →")}</Link></div><div><h4>{t("Kurumsal")}</h4><Link to="/hakkimizda">{t("Hakkımızda")}</Link><Link to="/uretim-ve-kalite">{t("Üretim ve Kalite")}</Link><Link to="/sektorel-cozumler">{t("Sektörel Çözümler")}</Link><Link to="/kataloglar">{t("Dijital Kataloglar")}</Link><Link to="/teklif-talebi">{t("Teklif Talebi")}</Link></div><div><h4>{t("Bizimle İletişime Geçin")}</h4><a href="tel:+905330137550"><Phone size={16}/> +90 533 013 75 50</a><a href="mailto:info@gorememelamin.com.tr"><Mail size={16}/> {t("info@gorememelamin.com.tr")}</a><p className="address"><MapPin size={18}/> Mahmut Bey Mh. 2429 Sk.<br/>İstoç 10. Ada No: 75<br/>Bağcılar / İstanbul</p></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {t("Göreme Melamin. Tüm hakları saklıdır.")}</span><div>{[['KVKK','kvkk'],['Gizlilik Politikası','gizlilik-politikasi'],['Çerez Politikası','cerez-politikasi']].map(([n,s])=><Link to={'/'+s} key={s}>{t(n)}</Link>)}</div><span>{t("Profesyoneller için tasarlandı.")}</span></div></footer>}
