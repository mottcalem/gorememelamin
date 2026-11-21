import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,Trash2,ClipboardList,Send,Info} from 'lucide-react';
import {useQuote} from './quote';
import {products} from './data/catalog';
import {Breadcrumb} from './components/ui';
export function QuoteForm() {
  const {items} = useQuote();
  const [submitted,setSubmitted] = useState(false);
  if (submitted) {
    return <div className="quote-form" role="status">
      <h2>E-postanız gönderildi.</h2>
      <p>Teklif talebinizi değerlendirip size dönüş yapacağız.</p>
    </div>;
  }

  return <form className="quote-form" onSubmit={event=>{
    event.preventDefault();
    if (items.length) setSubmitted(true);
  }}>
    <h2>Teklif Talebinizi Hazırlayın</h2>
    <div className="form-grid">
      {[['Firma Adı','text','organization'],['Yetkili Adı Soyadı','text','name'],['E-posta','email','email'],['Telefon','tel','tel']].map(([label,type,autoComplete])=><label key={label}>{label} *<input name={label} type={type} autoComplete={autoComplete} required/></label>)}
      <label className="full-field">Ek Açıklama<textarea name="message" rows={4}/></label>
    </div>
    <button className="button full" type="submit" disabled={!items.length}>Fiyat Teklifi Al <Send size={17}/></button>
  </form>;
}
export function QuotePage({formOnly=false}:{formOnly?:boolean}){const q=useQuote();return <main className="container page"><Breadcrumb items={[{label:formOnly?'Teklif Talebi':'Teklif Listem'}]}/><div className="page-heading"><span className="eyebrow">BİRLİKTE DOĞRU ÇÖZÜME</span><h1>{formOnly?'Teklif Talebi':'Teklif Listem'}</h1><p>Fiyat teklifi almak istediğiniz ürünleri aşağıdan kontrol edebilirsiniz.</p></div>{!q.items.length?<div className="empty"><ClipboardList size={48}/><h2>Teklif listeniz henüz boş.</h2><p>Koleksiyonumuzu keşfedin, ihtiyacınız olan ürünleri listenize ekleyin.</p><Link className="button" to="/urunler">Ürünleri Keşfet <ArrowRight size={18}/></Link></div>:<div className="quote-layout"><div><div className="quote-list-head"><strong>{q.items.length} ürün seçimi</strong><button className="text-link" onClick={q.clear}><Trash2 size={15}/> Listeyi Temizle</button></div><div className="quote-table">{q.items.map(i=>{const p=products.find(p=>p.id===i.productId)!;return <div className="quote-row" key={i.productId+i.color}><Link to={'/urun/'+p.slug}><img src={p.images[0]} alt={p.name}/></Link><div><Link to={'/urun/'+p.slug}><h3>{p.name}</h3></Link><small>SKU: {p.sku}</small>{(p.variantLabel||i.color)&&<span>{p.variantLabel||i.color}</span>}</div><label>Adet<input type="number" min="1" max="99999" value={i.quantity} onChange={e=>q.update(i.productId,i.color,Number(e.target.value))}/></label><button className="icon-button" aria-label={p.name+' ürününü kaldır'} onClick={()=>q.remove(i.productId,i.color)}><Trash2 size={18}/></button></div>})}</div><Link className="text-link" to="/urunler">Yeni Ürün Ekle <ArrowRight size={18}/></Link><div className="quote-help"><Info size={22}/><div><h3>İhtiyacınıza göre, size özel.</h3><p>Seçtiğiniz ürünler ve adetler üzerinden teklif hazırlanır. Listenizi gönderene kadar düzenleyebilirsiniz.</p></div></div></div><QuoteForm/></div>}</main>}
