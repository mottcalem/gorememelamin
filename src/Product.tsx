import {useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {Plus,Minus,ArrowUpRight,Package,Info,Ruler,Weight,Users,Scale,PackageOpen} from 'lucide-react';
import {products,productsBySlug,variantsByFamily,categoryName,slugify,type Product} from './data/catalog';
import {Breadcrumb,ProductGrid,SectionTitle} from './components/ui';
import {useQuote} from './quote';
const specificationIcons:Record<string,typeof Ruler>={'Ürün ölçüsü':Ruler,'Koli içi adet':Package,'Ürün ağırlığı':Weight,'Brüt koli ağırlığı':Users,'Net ağırlık':Scale,'Hacim':PackageOpen};
const swatchColors: Record<string, string> = {
  beyaz: '#fff',
  siyah: '#202020',
  kirmizi: '#cf272d',
  kahverengi: '#75492d',
  sari: '#edc52b',
  gri: '#868990',
  gry: '#868990',
  'beyaz-mermer': 'linear-gradient(135deg,#fff 43%,#a9a9ad 48%,#f5f5f5 54%,#fff 64%,#bbb 68%,#fff 73%)',
  'gold-mermer': 'linear-gradient(135deg,#f8f0da 43%,#ad8230 48%,#f8f0da 54%,#fff 64%,#c39b53 68%,#fff 73%)',
};

function ColorSwatch({color,image}:{color:string;image?:string}) {
  const background=swatchColors[slugify(color)];
  if (!background && !image) return null;
  return <span className="product-swatch" aria-hidden="true" style={{background}}>
    {!background&&image&&<img src={image} alt="" loading="lazy"/>}
  </span>;
}

export function ProductDetail(){const {slug}=useParams();const p=productsBySlug.get(slug??'');if(!p)return <main className="container page empty"><h1>Ürün bulunamadı</h1><Link className="button" to="/urunler">Tüm Ürünlere Dön</Link></main>
  return <ProductContent key={p.familyId??p.id} product={p}/>;
}

function ProductContent({product:p}:{product:Product}) {
  const [selection,setSelection]=useState(p.selections[0]?.label??'');
  const [quantity,setQuantity]=useState(1);
  const [tab,setTab]=useState('Teknik Özellikler');
  const [image,setImage]=useState(p.images[0]);
  const [activeProductId,setActiveProductId]=useState(p.id);
  if (activeProductId!==p.id) {
    setActiveProductId(p.id);
    setSelection(p.selections[0]?.label??'');
    setImage(p.images[0]);
  }
  const option=p.selections.find(item=>item.label===selection);
  const images=p.images;
  const variants=variantsByFamily.get(p.familyId??p.id)??[];
  const hasColors=variants.some(variant=>variant.colors.length>0);
  const onlyColors=hasColors&&variants.every(variant=>variant.colors.length===1&&variant.variantLabel===variant.colors[0]);
  const colorOptions=p.options.length===1&&p.options[0].label==='Renk';
  const related=products.filter(item=>!item.familyId&&item.id!==(p.familyId??p.id));
  const hasSpecs=Object.keys(p.technicalSpecifications).length>0;
  const hasDescription=Boolean(p.description||p.care);
  const showSpecs=hasSpecs&&(tab==='Teknik Özellikler'||!hasDescription);
  const q=useQuote();
  return <main className="container page"><Breadcrumb items={[{label:'Tüm Ürünler',to:'/urunler'},{label:categoryName(p.categoryId),to:'/kategori/'+p.categoryId},{label:p.name}]}/><div className="detail-grid"><div><div className="detail-image"><img src={image} alt={p.name}/>{p.series&&<span className="eyebrow">{p.series.toUpperCase()} KOLEKSİYONU</span>}</div>{images.length>1&&<div className="thumbnails">{images.map((img,i)=><button key={img} className={img===image?'selected':''} onClick={()=>setImage(img)} aria-label={'Ürün görseli '+(i+1)}><img src={img} alt={p.name}/></button>)}</div>}</div><div className="detail-copy"><span className="eyebrow">{p.subcategoryId}</span><h1>{p.name}</h1>{(option?.sku||p.sku)&&<span className="sku">SKU: {option?.sku||p.sku}</span>}{p.variantLabel&&<p>{p.variantLabel}</p>}{p.description&&<p className="product-description">{p.description}</p>}{variants.length>0&&<><div className="variant-label">{onlyColors?'Renk':hasColors?'Renk ve Seçenekler':'Varyantlar'}</div><div className={'colors'+(hasColors?' swatch-options':'')}>{variants.map(variant=><Link key={variant.id} to={'/urun/'+variant.slug} aria-current={variant.id===p.id?'page':undefined}>{variant.colors[0]&&<ColorSwatch color={variant.colors[0]} image={variant.images[0]}/>}<span>{variant.variantLabel}</span></Link>)}</div></>}{p.selections.length>0&&<><div className="variant-label">{p.options.map(item=>item.label).join(' / ')||'Varyant'}</div><div className={'colors'+(colorOptions?' swatch-options':'')}>{p.selections.map(item=><button key={item.label} aria-pressed={selection===item.label} className={selection===item.label?'selected':''} onClick={()=>{setSelection(item.label);setImage(item.image||p.images[0])}}>{colorOptions&&<ColorSwatch color={item.label}/>}<span className="option-name">{item.label}</span></button>)}</div></>}<label className="variant-label" htmlFor="quantity">Talep Adedi</label><div className="detail-add"><div className="quantity"><button aria-label="Adedi azalt" onClick={()=>setQuantity(Math.max(1,quantity-1))}><Minus size={15}/></button><input id="quantity" type="number" min="1" max="99999" value={quantity} onChange={e=>setQuantity(Math.max(1,Math.min(99999,Number(e.target.value)||1)))}/><button aria-label="Adedi artır" onClick={()=>setQuantity(Math.min(99999,quantity+1))}><Plus size={15}/></button></div><button className="button" onClick={()=>q.add(p,selection,quantity)}>Teklif Listesine Ekle <Plus size={18}/></button></div><div className="detail-note"><Package size={19}/><span>Koli ve sipariş detayları teklif aşamasında belirlenir.</span></div><Link className="text-link" to="/iletisim">Bu ürün hakkında bilgi alın <ArrowUpRight size={17}/></Link></div></div>{hasDescription&&hasSpecs&&<div className="product-tabs">{['Ürün Açıklaması','Teknik Özellikler'].map(t=><button className={tab===t?'selected':''} key={t} onClick={()=>setTab(t)}>{t}</button>)}</div>}{showSpecs?<><div className="technical-heading"><h2>Teknik Bilgiler</h2></div><dl className="technical-grid">{Object.entries(p.technicalSpecifications).map(([k,v])=>{const Icon=specificationIcons[k]||Info;return <div className="technical-item" key={k}><Icon className="technical-icon" size={44} strokeWidth={1.8} aria-hidden="true"/><div><dt>{k==='Hacim'?'Hacim CBM m³':k}</dt><dd>{v}</dd></div></div>})}</dl></>:hasDescription&&<div className="description-block">{p.description&&<><h2>Ürün Açıklaması</h2><p className="product-description">{p.description}</p></>}{p.care&&<><h2>Kullanım ve Bakım</h2><p className="product-description">{p.care}</p></>}</div>}<section className="section"><SectionTitle title="Benzer Ürünler" link={{to:'/kategori/'+p.categoryId,label:'Kategoriyi İncele'}}/><ProductGrid items={related.filter(x=>x.categoryIds.includes(p.categoryId)).slice(0,4)}/></section>{p.series&&<section className="section"><SectionTitle title="Aynı Seriden Ürünler"/><ProductGrid items={related.filter(x=>x.series===p.series).slice(-4)}/></section>}<div className="mobile-product-add"><button className="button full" onClick={()=>q.add(p,selection,quantity)}>Teklif Listesine Ekle <Plus size={18}/></button></div></main>}
