import catalogRows from './products.json';

export const slugify=(s:string)=>s.toLocaleLowerCase('tr').replaceAll('ı','i').replaceAll('ğ','g').replaceAll('ü','u').replaceAll('ş','s').replaceAll('ö','o').replaceAll('ç','c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const existingCategories=['Açık Büfe Sunum Ekipmanları','Mat Sunum Panoları','Ahşap Mat Sunum Panoları','Cafe Mat Sunum Panoları','Gastronom Küvetler','Servis Tabakları','Siyah Servis Tabakları','Kahvaltılık','Hastane Servis Ürünleri','Melamin Servis Tepsileri','Aksesuarlar'].map((name,i)=>({id:slugify(name),name,image:'/images/'+['acik-bufe-sunum-ekipmanlari-kategori.jpg','mat-sunum-panolari-kategori.jpg','sunum-tepsileri-kategori.png','mat-sunum-panolari-kategori.jpg','sunum-tepsileri-kategori.png','sunum-kaseleri-kategori.jpg','mat-sunum-panolari-kategori.jpg','sunum-kaseleri-kategori.jpg','sunum-tepsileri-kategori.png','sunum-tepsileri-kategori.png','aksesuarlar-kategori.jpg'][i]}));
interface Variation {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  images: string[];
  inStock: boolean;
  regularPrice?: string;
  salePrice?: string;
}
interface CatalogRow {
  id: string;
  name: string;
  sku: string;
  categoryPaths: string[];
  description: string;
  care: string;
  images: string[];
  technicalSpecifications: Record<string, string>;
  options: {label: string; values: string[]}[];
  variations: Variation[];
  inStock: boolean;
  featured: boolean;
  regularPrice?: string;
  salePrice?: string;
}
export interface Product extends CatalogRow {
  slug: string;
  categoryId: string;
  categoryIds: string[];
  subcategoryId: string;
  subcategories: {name: string; parentId: string}[];
  series: string;
  colors: string[];
  dimensions: string[];
  selections: {label: string; sku: string; image?: string}[];
  variantLabel?: string;
  familyId?: string;
}
const rows = catalogRows as CatalogRow[];
const categoryNames = [...new Set(rows.flatMap(row => row.categoryPaths.map(path => path.split(' > ')[0])))];
export const categories = [
  ...existingCategories.filter(category => categoryNames.includes(category.name)),
  ...categoryNames.filter(name => !existingCategories.some(category => category.name === name)).map(name => ({
    name, id: slugify(name), image: rows.find(row => row.categoryPaths.includes(name))!.images[0],
  })),
];
const colorNames: Record<string, string> = {
  beyaz: 'Beyaz', siyah: 'Siyah', kirmizi: 'Kırmızı', kahverengi: 'Kahverengi',
};
const displayValue = (label: string, value: string) =>
  label === 'Renk' ? colorNames[slugify(value)] ?? value : value;
const nameCounts = new Map<string, number>();
for (const row of rows) {
  const key = slugify(row.name);
  nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1);
}
const families: Product[] = rows.map(row => {
  const categoryIds = [...new Set(row.categoryPaths.map(path => slugify(path.split(' > ')[0])))];
  const subcategories = row.categoryPaths.flatMap(path => {
    const [parent, name] = path.split(' > ');
    return name ? [{name, parentId: slugify(parent)}] : [];
  });
  const slug = slugify(row.name);
  const selections: Product["selections"] = row.variations.map(variant => ({
    label: Object.entries(variant.attributes).map(([key, value]) => displayValue(key, value)).join(' / ') || variant.sku || variant.id,
    sku: variant.sku,
    image: variant.images[0],
  }));
  const labelCounts = new Map<string, number>();
  for (const {label} of selections) labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
  selections.forEach((selection, index) => {
    if ((labelCounts.get(selection.label) ?? 0) > 1) selection.label += ' · ' + (selection.sku || row.variations[index].id);
  });
  if (!selections.length && row.options.length === 1) {
    const option = row.options[0];
    selections.push(...option.values.map(value => ({label: displayValue(option.label, value), sku: row.sku, image: undefined})));
  }
  const optionValues = (label: string) => [...new Set([
    ...row.options.filter(option => option.label === label).flatMap(option => option.values),
    ...row.variations.map(variant => variant.attributes[label]).filter(Boolean),
  ].map(value => displayValue(label, value)))];
  return {
    ...row,
    slug: slug && nameCounts.get(slug) === 1 ? slug : [slug, row.id].filter(Boolean).join('-'),
    categoryId: subcategories[0]?.parentId ?? categoryIds[0],
    categoryIds,
    subcategoryId: subcategories[0]?.name ?? '',
    subcategories,
    series: /^(termostar|thermostar)\b/i.test(row.name) ? 'Termostar' : /\b(mat|matt)\b/i.test(row.name) ? 'Mat' : '',
    colors: optionValues('Renk'),
    dimensions: [...new Set([row.technicalSpecifications['Ürün ölçüsü'], ...optionValues('Ebat')].filter(Boolean))],
    selections,
  };
});
export const products: Product[] = families.flatMap(family => {
  if (!family.variations.length) return [family];
  const variants = family.variations.map((variant, index): Product => {
    const color = variant.attributes.Renk;
    const size = variant.attributes.Ebat;
    return {
      ...family,
      id: variant.id,
      familyId: family.id,
      slug: family.slug + '-varyant-' + (variant.sku ? slugify(variant.sku) + '-' : '') + variant.id,
      sku: variant.sku,
      variantLabel: family.selections[index].label,
      images: variant.images.length ? variant.images : family.images,
      colors: color ? [displayValue('Renk', color)] : [],
      dimensions: size ? [size] : family.dimensions,
      technicalSpecifications: size ? {...family.technicalSpecifications, 'Ürün ölçüsü': size} : family.technicalSpecifications,
      inStock: variant.inStock,
      regularPrice: variant.regularPrice,
      salePrice: variant.salePrice,
      options: [],
      variations: [],
      selections: [],
    };
  });
  return [...variants, {...family, colors: [], selections: []}];
});

export const productsById = new Map(products.map(product => [product.id, product]));
export const productsBySlug = new Map(products.map(product => [product.slug, product]));
export const variantsByFamily = new Map<string, Product[]>();
for (const product of products) {
  if (!product.familyId) continue;
  const variants = variantsByFamily.get(product.familyId) ?? [];
  variants.push(product);
  variantsByFamily.set(product.familyId, variants);
}

export const subcategories = [...new Map(products.flatMap(product => product.subcategories).map(sub => [sub.parentId + '/' + sub.name, sub])).values()];
export const categoryName=(id:string)=>categories.find(c=>c.id===id)?.name||id;
export const normalize=(s:string)=>slugify(s).replaceAll('-',' ');
export function searchProducts(query:string){
 const term = query.trim();
 const exactSku = products.filter(product => product.sku && product.sku.toLowerCase() === term.toLowerCase());
 if (exactSku.some(product => product.familyId)) return exactSku;
 const normalized = normalize(term);
 const exactName = normalized ? products.filter(product => normalize(product.name) === normalized) : [];
 if (exactName.length) return exactName;
 const words=normalized.split(/\s+/).filter(Boolean).map(w=>w.replace(/kaseleri|kasesi/g,'kase').replace(/tepsileri|tepsisi/g,'tepsi').replace(/tabaklari|tabagi/g,'tabak'));
 return products.filter(p=>{const text=normalize([p.name,p.sku,...p.categoryIds.map(categoryName),...p.subcategories.map(sub=>sub.name),p.series,p.variantLabel].join(' ')).replace(/kaseleri|kasesi/g,'kase').replace(/tepsileri|tepsisi/g,'tepsi').replace(/tabaklari|tabagi/g,'tabak');return words.every(w=>text.includes(w))});
}
export const sectors=['Oteller','Restoranlar','Kafeler','Catering Firmaları','Profesyonel Mutfaklar','Hastaneler'];
export const sectorCategories=[0,5,3,9,4,8];