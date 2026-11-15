import { test, expect } from '@playwright/test';

const viewports = [
  { width: 1440, height: 960 }, { width: 1920, height: 1080 },
  { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 740 },
];

for (const viewport of viewports) {
  test(`layout and photos at ${viewport.width} × ${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveText('El valor dever más allá.');
    const amount = page.locator('.credit-amount > span').first();
    expect(await amount.evaluate((el) => el.getBoundingClientRect().height <= parseFloat(getComputedStyle(el).fontSize) * 1.2)).toBe(true);
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
      await expect(image).toHaveCSS('opacity', '1');
    }
    const overflow = await page.evaluate(() => ({
      page: document.documentElement.scrollWidth > innerWidth,
      headings: [...document.querySelectorAll('h1,h2,h3')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.left < -1 || r.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 1;
      }).map((el) => el.textContent),
    }));
    expect(overflow).toEqual({ page: false, headings: [] });
    expect(errors).toEqual([]);
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: testInfo.outputPath(`hero-${viewport.width}.png`) });
    // Reveal each section before the full-page capture.
    for (const section of await page.locator('main section').all()) await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath(`page-${viewport.width}.png`), fullPage: true });
  });
}

test('currency stays coherent with mouse and keyboard', async ({ page }) => {
  await page.goto('/');
  const mxn = page.getByRole('tab', { name: /Capital en pesos/ });
  const usd = page.getByRole('tab', { name: /Capital en dólares/ });
  await usd.click();
  const panel = page.getByRole('tabpanel');
  await expect(usd).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toHaveAttribute('aria-labelledby', 'tab-USD');
  await expect(panel).toContainText('5—20');
  await expect(panel).toContainText('millones de dólares');
  await expect(panel).toContainText('México y Latinoamérica');
  await expect(panel).toContainText('ingresos referenciados en dólares');
  await usd.press('ArrowLeft');
  await expect(mxn).toBeFocused();
  await expect(panel).toContainText('75—250');
  await expect(panel).toContainText('millones de pesos');
  await mxn.press('End');
  await expect(usd).toBeFocused();
  await usd.press('Home');
  await expect(mxn).toBeFocused();
  await mxn.press('ArrowRight');
  await expect(usd).toBeFocused();
});

test('mobile navigation handles focus, Escape, selection and resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Abrir menú' });
  await expect(toggle).toBeEnabled();
  await toggle.click();
  const menu = page.getByRole('navigation', { name: 'Navegación móvil' });
  await expect(menu.getByRole('link').first()).toBeFocused();
  await menu.getByRole('link').last().focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('.site-header .brand')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(menu.getByRole('link').last()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await menu.getByRole('link', { name: /La firma/ }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#firma$/);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await page.goto('/');
  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 960 });
  await expect(menu).toBeHidden();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('contact intentions, validation, native modal and mailto without a server submission', async ({ page }) => {
  await page.goto('/');
  const requests: string[] = [];
  page.on('request', (request) => {
    if (['POST', 'PUT', 'PATCH'].includes(request.method())) requests.push(request.url());
  });
  const investor = page.locator('[data-inquiry="inversion"]');
  await investor.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel('Me interesa')).toHaveValue('inversion');
  await expect(dialog).toContainText('No almacena datos ni envía formularios.');
  await dialog.getByRole('button', { name: 'Preparar correo' }).click();
  expect(await page.locator('#inquiry-form').evaluate((form: HTMLFormElement) => form.checkValidity())).toBe(false);
  await dialog.getByLabel('Nombre', { exact: true }).fill('Persona de prueba');
  await dialog.getByLabel('Empresa', { exact: true }).fill('Empresa de prueba');
  await dialog.getByLabel('Correo electrónico').fill('test@example.com');
  await dialog.getByLabel('Tu proyecto').fill('Consulta de prueba.');
  await dialog.getByRole('button', { name: 'Preparar correo' }).click();
  await expect(dialog.getByRole('status')).toHaveText('Se abrirá tu aplicación de correo. No se ha enviado información desde este sitio.');
  expect(requests).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(investor).toBeFocused();
  await page.locator('.contact-invitation').click();
  await expect(dialog.getByLabel('Me interesa')).toHaveValue('financiamiento');
  await expect(dialog.getByRole('status')).toBeEmpty();
  await dialog.getByRole('button', { name: 'Cerrar formulario' }).click();
  await expect(dialog).toBeHidden();
});

test('essential content, photos, both currencies and contact survive without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4321');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.hero-media img')).toHaveCSS('opacity', '1');
  await expect(page.getByRole('navigation', { name: 'Navegación sin JavaScript' })).toBeVisible();
  await expect(page.locator('.credit-explorer')).toContainText('millones de pesos');
  const fallback = page.locator('.no-js-credit');
  await expect(fallback).toBeVisible();
  await expect(fallback).toContainText('millones de dólares');
  await expect(fallback).toContainText('México y Latinoamérica');
  await expect(page.locator('.contact-invitation')).toHaveAttribute('href', 'mailto:contacto@altumcapital.com.mx');
  await page.getByRole('navigation', { name: 'Navegación sin JavaScript' }).getByRole('link', { name: 'La firma' }).click();
  await expect(page).toHaveURL(/#firma$/);
  await context.close();
});

test('reduced motion, anchor targets and preview indexing restrictions', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-media img')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  const invalid = await page.locator('a[href^="#"]').evaluateAll((links) => links.filter((link) =>
    !document.getElementById(link.getAttribute('href')!.slice(1))).map((link) => link.getAttribute('href')));
  expect(invalid).toEqual([]);
  const robots = await page.request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');
});
