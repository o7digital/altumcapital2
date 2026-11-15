import { firefox } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import previous from '../src/data/imported.json' with { type: 'json' };

const origin = 'https://altumcapital.vercel.app';
const slugs = ['', 'about', 'soluciones-de-credito', 'equipo', 'inversionistas', 'contact', 'blog', 'legal', 'aviso-de-privacidad', ...previous.posts.map(post => post.slug)];
const assets = new Map();
const pages = [];
const browser = await firefox.launch();
await mkdir('artifacts/source-audit', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  for (const slug of slugs) {
    const url = `${origin}/${slug ? `${slug}/index.html` : ''}`;
    const response = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    if (!response.ok()) throw new Error(`Source failed: ${url}`);
    // Load the photographs and let source counters settle before recording content.
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll('img[loading="lazy"]').forEach(img => img.loading = 'eager');
      await Promise.all([...document.querySelectorAll('main img')].map(img => img.decode().catch(() => {})));
      document.querySelectorAll('[data-to-value]').forEach(el => el.textContent = el.getAttribute('data-to-value'));
    });
    const extracted = await page.evaluate(({ slug, origin }) => {
      const required = new Set();
      const main = document.querySelector('main');
      const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const normalize = value => value.replace(/\s+/g, ' ').trim();
      const localAsset = value => {
        const url = new URL(value, location.href);
        if (url.origin !== origin || !url.pathname.startsWith('/wp-content/')) throw new Error(`Unexpected media: ${url.href}`);
        required.add(url.href);
        return `/source-media${url.pathname}`;
      };
      const isHidden = el => {
        for (let node = el; node && node !== main?.parentElement; node = node.parentElement) {
          const style = getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden') return true;
        }
        return false;
      };
      const safeHref = value => {
        const url = new URL(value, location.href);
        if (!['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) return '';
        if (url.origin === origin || ['altumcapital.mx', 'www.altumcapital.mx'].includes(url.hostname)) {
          if (url.pathname.startsWith('/wp-content/')) return localAsset(url.href);
          if (url.pathname.startsWith('/wp-')) return '';
          return url.pathname.replace(/index\.html$/, '') + url.search + url.hash.replace('#jupiterx-main', '#main');
        }
        return url.href;
      };
      const backgrounds = el => [...getComputedStyle(el).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(match => ({ source: new URL(match[1], location.href).href, local: localAsset(match[1]) }));
      const classes = el => {
        const list = [];
        const has = name => el.classList.contains(name);
        if (has('elementor-container')) list.push('source-columns');
        if (has('elementor-row')) list.push('source-columns');
        if (has('elementor-column')) list.push('source-column');
        if (has('elementor-widget-wrap')) list.push('source-stack');
        if (has('elementor-inner-section')) list.push('source-inner');
        if (has('elementor-widget')) list.push('source-widget');
        if (has('elementor-widget-heading') || has('elementor-widget-raven-heading')) list.push('source-heading');
        if (has('elementor-widget-text-editor')) list.push('source-text');
        if (has('elementor-widget-raven-image') || has('elementor-widget-image')) list.push('source-image');
        if (has('elementor-widget-raven-counter')) list.push('source-metric');
        if (has('raven-counter-number')) list.push('source-metric-number');
        if (has('raven-counter-number-prefix')) list.push('source-metric-prefix');
        if (has('raven-counter-title')) list.push('source-metric-label');
        if (has('raven-posts')) list.push('source-posts');
        if (has('raven-post')) list.push('source-post');
        if (has('raven-post-title')) list.push('source-post-title');
        if (has('raven-post-excerpt')) list.push('source-post-excerpt');
        if (has('raven-post-image')) list.push('source-post-image');
        if (has('raven-post-read-more')) list.push('source-more');
        if (has('raven-button') || has('elementor-button')) list.push('source-button');
        if (has('elementor-icon-list-items')) list.push('source-contact-links');
        if (has('elementor-social-icons-wrapper')) list.push('source-social-links');
        if (has('elementor-widget-raven-post-meta')) list.push('source-post-meta');
        if (has('elementor-widget-raven-post-content') || has('jupiterx-post-content')) list.push('source-article');
        if (el.tagName === 'SPAN' && el.closest('h1') && el.getAttribute('style')?.includes('32px')) list.push('source-amount');
        return list;
      };
      const skipped = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'FORM', 'INPUT', 'BUTTON', 'IFRAME', 'SVG', 'USE', 'SYMBOL', 'PATH']);
      const clean = node => {
        if (node.nodeType === Node.TEXT_NODE) return escape(node.textContent);
        if (!(node instanceof Element) || skipped.has(node.tagName) || isHidden(node)) return '';
        if (node.matches('.elementor-widget-spacer,.elementor-widget-icon,.elementor-widget-raven-post-comments')) {
          // The source comments are disabled, preserve their text without a form.
          if (!node.matches('.elementor-widget-raven-post-comments')) return '';
        }
        if (node.matches('.elementor-widget-video')) {
          const settings = JSON.parse(node.getAttribute('data-settings') || '{}');
          const url = settings.youtube_url?.replaceAll('\\/', '/');
          return url ? `<a class="source-video" href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="Reproducir video de Altum Capital"><span aria-hidden="true">▶</span></a>` : '';
        }
        const tag = node.tagName.toLowerCase();
        if (tag === 'i') return '';
        if (tag === 'br' || tag === 'hr') return `<${tag}>`;
        const cls = classes(node);
        const attrs = [];
        if (cls.length) attrs.push(`class="${cls.join(' ')}"`);
        if (node.id && ['footer-contacto', 'respond'].includes(node.id)) attrs.push(`id="${escape(node.id)}"`);
        const bg = backgrounds(node);
        if (bg.length) {
          attrs.push(`data-source-background="${escape(bg.map(item => item.source).join('|'))}"`);
          attrs.push(`style="background-image:${bg.map(item => `url('${item.local}')`).join(',')}"`);
        }
        if (tag === 'img') {
          const original = new URL(node.getAttribute('src'), location.href).href;
          return `<img src="${escape(localAsset(original))}" data-source-src="${escape(original)}" alt="${escape(node.getAttribute('alt') || '')}"${node.getAttribute('width') ? ` width="${Number(node.getAttribute('width'))}"` : ''}${node.getAttribute('height') ? ` height="${Number(node.getAttribute('height'))}"` : ''} loading="lazy" decoding="async">`;
        }
        let children = [...node.childNodes].map(clean).join('');
        if (tag === 'a') {
          const href = node.getAttribute('href');
          if (!href) return `<span${attrs.length ? ' '+attrs.join(' ') : ''}>${children}</span>`;
          const target = safeHref(href);
          if (!target) return children;
          attrs.push(`href="${escape(target)}"`);
          if (target.startsWith('https:')) attrs.push('target="_blank" rel="noopener noreferrer"');
          if (node.getAttribute('aria-label')) attrs.push(`aria-label="${escape(node.getAttribute('aria-label'))}"`);
          if (!children.trim()) attrs.push('aria-label="Contacto"');
        }
        if (!children.trim()) return '';
        const allowed = new Set(['div','section','article','p','h1','h2','h3','h4','h5','h6','span','strong','b','em','i','ul','ol','li','blockquote','a','table','thead','tbody','tr','td','th','dl','dt','dd','time','figure','figcaption','address']);
        if (!allowed.has(tag)) return children;
        return `<${tag}${attrs.length ? ' '+attrs.join(' ') : ''}>${children}</${tag}>`;
      };
      const mainSections = [...main.querySelectorAll('.elementor-top-section')].filter(el => !el.parentElement.closest('.elementor-top-section'));
      // Some WordPress pages use a plain article instead of Elementor sections.
      const roots = mainSections.length ? mainSections : [main];
      const expectedImages = [...main.querySelectorAll('img[src]')].filter(img => !isHidden(img)).map(img => new URL(img.getAttribute('src'), location.href).href);
      const paragraphs = [...main.querySelectorAll('h1,h2,h3,h4,h5,h6,p,.raven-counter-number')].filter(el => !isHidden(el)).map(el => normalize(el.innerText)).filter(Boolean);
      const sections = roots.map((root, index) => ({
        id: root.getAttribute('data-id') || `section-${index}`,
        isHero: !!root.querySelector('h1') && index === 0,
        background: backgrounds(root),
        html: [...root.childNodes].map(clean).join('').replace(/\s+/g, ' ').trim(),
      })).filter(section => section.html);
      const footerRoot = document.querySelector('footer');
      const footer = { html: [...footerRoot.childNodes].map(clean).join('').replace(/\s+/g,' ').trim(), text: normalize(footerRoot.innerText) };
      const nav = [...document.querySelectorAll('header .raven-nav-menu a[href]')].map(a => ({href:safeHref(a.getAttribute('href')),label:normalize(a.innerText)})).filter(item => item.label && item.href && item.href!=='/');
      const navigation = [...new Map(nav.map(item => [item.href,item])).values()];
      const logos = [...document.querySelectorAll('header img')].map(img => ({source:img.src,local:localAsset(img.src)}));
      return { slug, source:location.href, title:document.title, sections, expectedImages:[...new Set(expectedImages)], paragraphs:[...new Set(paragraphs)], navigation, logos, footer, assets:[...required] };
    }, { slug, origin });
    for (const source of extracted.assets) assets.set(source, { source, local: `/source-media${new URL(source).pathname}` });
    pages.push(extracted);
    console.log(`Read source /${slug}: ${extracted.sections.length} sections, ${extracted.expectedImages.length} photos/documents`);
  }
} finally { await browser.close(); }

const queue = [...assets.values()];
async function download() {
  while (queue.length) {
    const item = queue.shift();
    const response = await fetch(item.source, { signal:AbortSignal.timeout(45000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Media failed: ${item.source}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const file = `public${item.local}`;
    await mkdir(file.slice(0,file.lastIndexOf('/')), { recursive:true });
    await writeFile(file,bytes);
    item.sha256 = createHash('sha256').update(bytes).digest('hex');
    item.bytes = bytes.length;
  }
}
await Promise.all(Array.from({length:5},download));
const home = pages[0];
const result = { origin, retrieved:new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City'}).format(new Date()),navigation:home.navigation, logos:home.logos, footer:home.footer,pages:pages.map(({assets,navigation,logos,footer,...page})=>page),assets:[...assets.values()] };
await writeFile('src/data/source-pages.json',JSON.stringify(result,null,2)+'\n');
console.log(`Imported ${pages.length} pages and ${assets.size} original media files.`);
