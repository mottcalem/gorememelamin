import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {productsById,variantsByFamily,type Product} from './data/catalog';
export interface QuoteItem {productId:string;color:string;quantity:number}
const Context=createContext<{items:QuoteItem[];add:(p:Product,color?:string,quantity?:number)=>void;update:(id:string,color:string,q:number)=>void;remove:(id:string,color:string)=>void;clear:()=>void;latest:QuoteItem|null;close:()=>void}|null>(null);
function loadQuoteItems(): QuoteItem[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem('goreme-quote') || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.flatMap((item: QuoteItem) => {
      const product = productsById.get(item?.productId);
      if (!product || !Number.isInteger(item.quantity) || item.quantity <= 0) return [];
      const variant = variantsByFamily.get(product.id)?.find(entry => entry.variantLabel === item.color);
      if (variant) return [{...item, productId: variant.id, color: ''}];
      const valid = product.selections.length ? product.selections.some(option => option.label === item.color) : item.color === '';
      return valid ? [item] : [];
    });
  } catch {
    return [];
  }
}
export function QuoteProvider({children}:{children:ReactNode}){const [items,setItems]=useState<QuoteItem[]>(loadQuoteItems);const [latest,setLatest]=useState<QuoteItem|null>(null);useEffect(()=>{try{localStorage.setItem('goreme-quote',JSON.stringify(items))}catch{}},[items]);return <Context.Provider value={{items,latest,close:()=>setLatest(null),add:(p,color=p.selections[0]?.label??'',quantity=1)=>{setItems(old=>{const found=old.find(i=>i.productId===p.id&&i.color===color);return found?old.map(i=>i===found?{...i,quantity:i.quantity+quantity}:i):[...old,{productId:p.id,color,quantity}]});setLatest({productId:p.id,color,quantity})},update:(id,color,q)=>setItems(old=>old.map(i=>i.productId===id&&i.color===color?{...i,quantity:Math.max(1,Math.min(99999,Math.trunc(q)||1))}:i)),remove:(id,color)=>setItems(old=>old.filter(i=>!(i.productId===id&&i.color===color))),clear:()=>setItems([])}}>{children}</Context.Provider>}
export function useQuote(){const c=useContext(Context);if(!c)throw new Error('QuoteProvider eksik');return c}
