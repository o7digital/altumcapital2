import source from '../source-pages.json';
export function original(slug: string) {
  const page = source.pages.find(page => page.slug === slug);
  if (!page) throw new Error(`Missing original page: ${slug}`);
  return page;
}
export function copy(slug: string, prefix: string) {
  const value = original(slug).paragraphs.find(text => text.startsWith(prefix));
  if (!value) throw new Error(`Missing source text: ${slug} / ${prefix}`);
  return value;
}
export function photograph(filename: string) {
  const asset = source.assets.find(asset => asset.local.endsWith(`/${filename}`));
  if (!asset) throw new Error(`Missing original photograph: ${filename}`);
  return asset;
}
export const about = {
  intro: copy('about', 'Conoce más'),
  objective: copy('about', 'Ser el administrador'),
  activity: copy('about', 'Ofrecemos soluciones'),
  principles: [copy('about', 'Créditos flexibles'),copy('about', 'Procesos claros'),copy('about', 'Ofrecemos recurrencias'),copy('about', 'Generamos valor')],
  metrics: [
    { value:'10', prefix:'+', label:'Años de experiencia' },
    { value:'6', prefix:'+', label:'Fondos' },
    { value:'40', prefix:'+', label:'Colaboradores' },
    { value:'15,300', prefix:'+', label:'MXN millones en deuda colocada' },
    { value:'450', prefix:'+', label:'Créditos otorgados' },
    { value:'50', prefix:'+', label:'Clientes activos' },
    { value:'110', prefix:'+', label:'USD millones en deuda colocada' },
  ],
};
