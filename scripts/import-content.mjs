// Import content only: no WordPress scripts, forms, trackers or styling.
import { firefox } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';

const origin = 'https://altumcapital.vercel.app';
const cache = 'artifacts/content-source';
await mkdir(cache, { recursive: true });
await mkdir('public/images/content', { recursive: true });
const assetMap = new Map();
async function source(slug) {
  const path = `${cache}/${slug || 'index'}.html`;
  try { return await readFile(path, 'utf8'); } catch { /* Fetch uncached pages. */ }
  const response = await fetch(`${origin}/${slug ? `${slug}/index.html` : ''}`);
  if (!response.ok) throw new Error(`Source ${slug}: HTTP ${response.status}`);
  const html = await response.text();
  await writeFile(path, html);
  return html;
}
async function asset(src, pageUrl) {
  const url = new URL(src, pageUrl).href;
  if (assetMap.has(url)) return assetMap.get(url);
  const local = `/images/content/${basename(new URL(url).pathname)}`;
  const response = await fetch(url);
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Image ${url}: ${response.status}`);
  await writeFile(`public${local}`, new Uint8Array(await response.arrayBuffer()));
  assetMap.set(url, local);
  return local;
}

const browser = await firefox.launch();
try {
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.route('**/*', (route) => route.abort());
  await page.setContent(await source('blog'), { waitUntil: 'domcontentloaded' });
  const entries = await page.evaluate(() => [...document.querySelectorAll('main .raven-post')].map((el) => ({
    href: el.querySelector('h3 a,h2 a,.raven-post-title a')?.getAttribute('href'),
    title: el.querySelector('h3,h2,.raven-post-title')?.textContent?.trim(),
    image: el.querySelector('img')?.getAttribute('src'),
    excerpt: el.querySelector('.raven-post-excerpt')?.textContent?.trim().replace(/(?:VER MÁS|LEER MÁS)\s*$/, '').trim(),
  })).filter((entry) => entry.href));
  if (entries.length !== 9) throw new Error(`Expected nine source articles, found ${entries.length}`);

  const posts = [];
  const documents = [];
  const routes = new Set(entries.map((entry) => new URL(entry.href, origin).pathname.replace(/\/index\.html$/, '').replace(/^\//, '')));
  for (const slug of ['legal', 'aviso-de-privacidad', ...routes]) {
    await page.setContent(await source(slug), { waitUntil: 'domcontentloaded' });
    const document = await page.evaluate(({ slug, origin }) => {
      const main = document.querySelector('main');
      if (!main) throw new Error(`Missing main on ${slug}`);
      const title = main.querySelector('h1')?.textContent?.trim() || main.querySelector('h2')?.textContent?.trim() || '';
      const isDocument = slug === 'legal' || slug === 'aviso-de-privacidad';
      const body = isDocument ? main : main.querySelector('.elementor-widget-raven-post-content');
      if (!body) throw new Error(`Missing article body: ${slug}`);
      const text = main.textContent.replace(/\s+/g, ' ');
      const date = text.match(/Fecha\s+([a-záéíóúñ]+\s+\d{1,2},\s+\d{4})/i)?.[1] || '';
      const author = text.match(/Autor\s+(.+?)\s+Fecha/)?.[1]?.trim() || '';
      const allowed = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'STRONG', 'B', 'EM', 'I', 'UL', 'OL', 'LI', 'BR', 'BLOCKQUOTE', 'A', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TD', 'TH', 'DL', 'DT', 'DD', 'HR', 'IMG']);
      const skip = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'FORM', 'INPUT', 'BUTTON', 'SVG', 'NAV', 'HEADER', 'FOOTER', 'IFRAME']);
      const images = [...body.querySelectorAll('img[src]')].map((img) => new URL(img.getAttribute('src'), `${origin}/${slug}/index.html`).href);
      const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const clean = (node) => {
        if (node.nodeType === Node.TEXT_NODE) return escape(node.textContent);
        if (!(node instanceof Element) || skip.has(node.tagName)) return '';
        if (node.matches('h1') || node.textContent.trim().toLowerCase() === title.toLowerCase()) return '';
        let tag = node.tagName;
        if (tag === 'H1') tag = 'H2';
        if (['H4', 'H5', 'H6'].includes(tag)) tag = 'H3';
        const children = [...node.childNodes].map(clean).join('');
        if (!allowed.has(tag)) return children;
        if (tag === 'BR' || tag === 'HR') return `<${tag.toLowerCase()}>`;
        if (tag === 'IMG') {
          const src = new URL(node.getAttribute('src'), `${origin}/${slug}/index.html`).href;
          const name = src.split('/').pop();
          const descriptions = { 'contacto_horarios_atencion.png': 'Información de contacto y horarios de atención', 'Buro.jpg': 'Buró de Entidades Financieras', 'image002.png': 'Información de Altum CP ante CONDUSEF', 'Lynx_condusef.png': 'Información de Lynx CP ante CONDUSEF', 'ckd_condusef.png': 'Información de CKD RF Estructurada ante CONDUSEF', 'Sophomon_condusef.png': 'Información de Sophomon ante CONDUSEF', 'Acuse_Condusef_Altum.png': 'Acuse CONDUSEF de Altum CP', 'Acuse_Condusef_CKD.png': 'Acuse CONDUSEF de CKD RF Estructurada', 'Acuse_Condusef_Lynx.png': 'Acuse CONDUSEF de Lynx CP', 'sophomon_UNE.png': 'Información de la Unidad Especializada de Sophomon' };
          const alt = node.getAttribute('alt') || descriptions[name] || 'Documento informativo de Altum Capital';
          return `<img src="${escape(src)}" alt="${escape(alt)}" loading="lazy" decoding="async">`;
        }
        let attrs = '';
        if (tag === 'A') {
          const href = node.getAttribute('href');
          if (!href || !/^(?:https?:|mailto:|tel:|\/|\.\.?\/|#)/i.test(href)) return children;
          const url = new URL(href, `${origin}/${slug}/index.html`);
          let target = url.href;
          if ([new URL(origin).hostname, 'altumcapital.mx', 'www.altumcapital.mx'].includes(url.hostname)) {
            target = url.pathname.replace(/index\.html$/, '') + url.search + url.hash.replace('#jupiterx-main', '#main');
          }
          attrs = ` href="${escape(target)}"`;
          if (url.protocol === 'https:' && !target.startsWith('/')) attrs += ' target="_blank" rel="noopener noreferrer"';
        }
        return children.trim() ? `<${tag.toLowerCase()}${attrs}>${children}</${tag.toLowerCase()}>` : '';
      };
      return { slug, title, date, author, images, html: [...body.childNodes].map(clean).join('').replace(/\s+/g, ' ').trim(), source: `${origin}/${slug}/index.html` };
    }, { slug, origin });
    if (!document.html || document.html.length < 200) throw new Error(`Empty content: ${slug}`);
    for (const url of document.images) {
      const local = await asset(url, origin);
      document.html = document.html.split(url).join(local).split(new URL(url).pathname).join(local);
    }
    if (slug === 'legal' || slug === 'aviso-de-privacidad') documents.push(document);
    else {
      const entry = entries.find((entry) => entry.href.includes(`/${slug}/`));
      posts.push({ ...document, title: entry.title || document.title,
        excerpt: entry.excerpt || '', image: entry.image ? await asset(entry.image, `${origin}/blog/index.html`) : '' });
    }
  }
  const teamImage = await asset('/wp-content/uploads/2023/06/group-of-coworkers-working-on-project-together-in-2023-06-13-23-00-36-utc-1536x1025.jpg', origin);
  const apolloImage = await asset('/wp-content/uploads/2021/12/logo-apollo.jpg', origin);
  const retrieved = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City' }).format(new Date());
  await writeFile('src/data/imported.json', JSON.stringify({ origin, retrieved, posts, documents, teamImage, apolloImage, assets: Object.fromEntries(assetMap) }, null, 2) + '\n');
  console.log(`Imported ${posts.length} articles, ${documents.length} legal documents and ${assetMap.size} images.`);
} finally {
  await browser.close();
}
