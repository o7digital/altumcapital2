import {test,expect} from '@playwright/test';
import {createHash} from 'node:crypto';
import source from '../src/data/source-pages.json' with {type:'json'};
import prose from '../src/data/editorial/prose.json' with {type:'json'};
import homepage from './reference/homepage.json' with {type:'json'};

const canonical=(text:string)=>text.normalize('NFKC').toLocaleLowerCase('es').replace(/(?<=\d),(?=\d)/g,'').replace(/[\s“”"‘’']/g,'');
const technicalCopy=new Set(['No hay comentarios','Comentar','Los comentarios no están habilitados en esta copia estática.']);
const widths=[1440,1920,768,390,320];

for(const original of source.pages){
 test(`retained client content: /${original.slug}`,async({page})=>{
  const response=await page.goto(`/${original.slug}${original.slug?'/':''}`);
  expect(response?.status()).toBe(200);
  const text=canonical(await page.locator('main').innerText());
  const missing=original.paragraphs.filter(p=>!technicalCopy.has(p)&&!text.includes(canonical(p)));
  expect(missing,`Institutional text from ${original.source}`).toEqual([]);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
  if(original.slug){
   await expect(page.locator('main')).toHaveAttribute('data-editorial-page',original.slug);
   await expect(page.locator('main .source-column,main .source-widget,main [data-source-section]')).toHaveCount(0);
   const images=await page.locator('main img[data-source-src]').evaluateAll(imgs=>imgs.map(img=>img.getAttribute('data-source-src')));
   expect(original.expectedImages.filter(src=>!images.includes(src))).toEqual([]);
  }
 });
}

for(const baseline of homepage){
 test(`homepage preserved pixel for pixel at ${baseline.width}px`,async({page})=>{
  await page.setViewportSize({width:baseline.width,height:baseline.height});
  await page.goto('/');
  await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));scrollTo(0,0);});
  const bytes=await page.screenshot({fullPage:true});
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(baseline.sha256);
 });
}

for(const width of widths){
 test(`all editorial routes fit at ${width}px`,async({page},info)=>{
  test.setTimeout(90000);
  await page.setViewportSize({width,height:width>1000?960:844});
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  for(const original of source.pages.filter(page=>page.slug)){
   await page.goto(`/${original.slug}/`);
   await page.evaluate(()=>document.fonts.ready);
   const problems=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,headings:[...document.querySelectorAll('main h1,main h2,main h3')].filter(el=>{const r=el.getBoundingClientRect();return r.left< -1||r.right>innerWidth+1||el.scrollWidth>el.clientWidth+1;}).map(el=>el.textContent)}));
   expect(problems,original.slug).toEqual({overflow:false,headings:[]});
   if(['about','soluciones-de-credito','equipo','inversionistas','blog','contact','legal','aviso-de-privacidad',prose[0].slug].includes(original.slug)){
    await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
    await page.screenshot({path:info.outputPath(`${original.slug}-top.png`)});
    for(const element of await page.locator('[data-editorial-reveal]').all())await element.scrollIntoViewIfNeeded();
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:info.outputPath(`${original.slug}-full.png`),fullPage:true});
   }
  }
  expect(errors).toEqual([]);
 });
}

test('all client media, document images and local links load',async({page,request})=>{
 test.setTimeout(90000);
 const links=new Set<string>();const images=new Set<string>();
 for(const original of source.pages){await page.goto(`/${original.slug}${original.slug?'/':''}`);
  for(const href of await page.locator('a[href^="/"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')!.split('#')[0])))links.add(href);
  for(const src of await page.locator('main img').evaluateAll(imgs=>imgs.map(img=>img.getAttribute('src')!)))images.add(src);
  const invalid=await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(a=>!document.getElementById(a.getAttribute('href')!.slice(1))).map(a=>a.getAttribute('href')));expect(invalid,original.slug).toEqual([]);
 }
 for(const path of new Set([...links,...images])){const response=await request.get(path);expect(response.status(),path).toBe(200);}
 for(const asset of source.assets){const response=await request.get(asset.local);expect(createHash('sha256').update(await response.body()).digest('hex'),asset.local).toBe(asset.sha256);}
});

test('shared menu, active section, keyboard and footer remain coherent',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/about/');
 const toggle=page.getByRole('button',{name:'Abrir menú'});await expect(toggle).toBeEnabled();await toggle.click();
 const nav=page.getByRole('navigation',{name:'Navegación móvil'});await expect(nav.getByRole('link')).toHaveCount(source.navigation.length);await expect(nav.getByRole('link').first()).toBeFocused();await expect(nav.locator('[aria-current="page"]')).toHaveAttribute('href','/about/');
 await page.keyboard.press('Escape');await expect(nav).toBeHidden();await expect(toggle).toBeFocused();await toggle.click();await nav.getByRole('link',{name:'EQUIPO',exact:false}).click();await expect(page).toHaveURL(/\/equipo\/$/);await expect(nav).toBeHidden();
 expect(canonical(await page.locator('footer').innerText())).toBe(canonical(source.footer.text));
 await page.goto(`/${prose[0].slug}/`);await toggle.click();await expect(nav.locator('[aria-current="page"]')).toHaveAttribute('href','/blog/');
});

test('client content is visible without JavaScript and with reduced motion',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto((process.env.PREVIEW_URL||'http://127.0.0.1:4321')+'/about/');await expect(page.locator('h1')).toContainText('Nuestra');await expect(page.locator('.ed-statement')).toBeVisible();await expect(page.locator('.ed-photo img').first()).toBeVisible();await expect(page.getByRole('navigation',{name:'Navegación sin JavaScript'})).toBeVisible();await context.close();
});
