import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import source from '../src/data/source-pages.json' with { type: 'json' };

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim().toLocaleLowerCase('es');
const viewports = [
  { width: 1440, height: 960 }, { width: 1920, height: 1080 },
  { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 740 },
];

for (const original of source.pages) {
  test(`original text and photographs: /${original.slug}`, async ({ page }) => {
    const response = await page.goto(`/${original.slug}${original.slug ? '/' : ''}`);
    expect(response?.status()).toBe(200);
    const text = normalize(await page.locator('main').innerText());
    const missing = original.paragraphs.filter(paragraph => !text.includes(normalize(paragraph)));
    expect(missing, `Text from ${original.source} must be reproduced without rewriting`).toEqual([]);
    const images = await page.locator('main img[data-source-src]').evaluateAll(elements => [...new Set(elements.map(el => el.getAttribute('data-source-src')))]);
    expect(images.sort()).toEqual([...original.expectedImages].sort());
    for (const section of original.sections) {
      for (const background of section.background) {
        await expect(page.locator(`[data-source-section="${section.id}"]`)).toHaveAttribute('data-source-background', section.background.map(item => item.source).join('|'));
        expect(await page.locator(`[data-source-section="${section.id}"]`).evaluate(el => getComputedStyle(el).backgroundImage)).toContain(background.local);
      }
    }
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  });
}

for (const viewport of viewports) {
  test(`source photos and layout at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    for (const img of await page.locator('main img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({path:testInfo.outputPath(`home-${viewport.width}.png`)});
    await page.screenshot({path:testInfo.outputPath(`page-${viewport.width}.png`),fullPage:true});
  });
}

test('every original image file matches the source bytes', async ({ request }) => {
  test.setTimeout(60000);
  for (const asset of source.assets) {
    const response = await request.get(asset.local);
    expect(response.status(),asset.local).toBe(200);
    const digest = createHash('sha256').update(await response.body()).digest('hex');
    expect(digest,asset.source).toBe(asset.sha256);
  }
});

test('original logo, menu, footer and native mobile navigation', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await expect(page.locator('.original-brand')).toHaveAttribute('src', /logo-altum-blanco\.png$/);
  const toggle = page.getByRole('button',{name:'Abrir menú'});
  await expect(toggle).toBeEnabled();
  await toggle.click();
  const nav=page.getByRole('navigation',{name:'Navegación móvil'});
  await expect(nav.getByRole('link')).toHaveCount(source.navigation.length);
  await expect(nav.getByRole('link').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(nav).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await nav.getByRole('link').first().click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(nav).toBeHidden();
  await expect(page.locator('.original-brand')).toHaveAttribute('src', /altum-logo\.png$/);
  expect(normalize(await page.locator('footer').innerText())).toBe(normalize(source.footer.text));
});

test('source text and photographs remain available without JavaScript', async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4321');
  await expect(page.locator('h1')).toContainText('Soluciones de Financiamiento');
  await expect(page.getByRole('navigation',{name:'Navegación sin JavaScript'})).toBeVisible();
  expect(await page.locator('main img').count()).toBe(source.pages[0].expectedImages.length);
  await context.close();
});

test('all migrated pages, internal links and mobile widths work', async ({ page }) => {
  test.setTimeout(60000);
  const links=new Set<string>();
  await page.setViewportSize({width:320,height:740});
  for(const original of source.pages){
    await page.goto(`/${original.slug}${original.slug?'/':''}`);
    await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),original.source).toBe(true);
    for(const href of await page.locator('a[href^="/"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')!.split('#')[0]))) links.add(href);
  }
  for(const href of links){
    const response=await page.request.get(href);
    expect(response.status(),href).toBe(200);
  }
});
