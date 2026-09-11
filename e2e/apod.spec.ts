import { expect, test } from '@playwright/test';
import { serveNasa, today } from './nasa';

test.describe('today', () => {
  test('shows the picture of the day whole, with its title and credit', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: today.title })).toBeVisible();
    const picture = page.getByRole('img', { name: today.title });
    await expect(picture).toBeVisible();
    await expect(picture).toHaveCSS('object-fit', 'contain');
    await expect(page.getByText(today.copyright)).toBeVisible();
    await expect(page.getByRole('link', { name: /Página oficial/ })).toHaveAttribute(
      'href',
      'https://apod.nasa.gov/apod/ap260911.html'
    );
  });

  test('switches the interface language and remembers it', async ({ page, isMobile }) => {
    await serveNasa(page);
    await page.goto('/');

    // Phones get a native select; wider screens show every language as a button.
    if (isMobile) await page.getByRole('combobox', { name: 'Idioma' }).selectOption('pt-BR');
    else await page.getByRole('button', { name: 'Português (Brasil)' }).click();
    await expect(page.getByRole('link', { name: 'Arquivo' }).first()).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

    await page.reload();
    await expect(page.getByRole('link', { name: 'Sobre' }).first()).toBeVisible();
    // NASA's own words are never translated.
    await expect(page.getByRole('heading', { level: 1, name: today.title })).toBeVisible();
  });

  test('explains a rate limit instead of showing a substitute picture', async ({ page }) => {
    await serveNasa(page, { rateLimited: true });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'La NASA pidió una pausa' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
    await expect(page.getByRole('img')).toHaveCount(0);
  });
});

test.describe('travelling through days', () => {
  test('previous day updates the address and asks NASA for that day', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/apod/2026-09-11');
    await expect(page.getByRole('heading', { level: 1, name: today.title })).toBeVisible();

    await page.getByRole('button', { name: 'Día anterior' }).first().click();
    await expect(page).toHaveURL(/\/apod\/2026-09-10$/);
    // The recording has no 10 September, so NASA's 404 must surface as such.
    await expect(page.getByRole('heading', { name: 'No hay imagen para esta fecha' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Día siguiente' }).first()).toBeEnabled();
  });

  test('the ruler is a keyboard-operable slider that keeps focus', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Arrow keys are a desktop affordance');
    await serveNasa(page);
    await page.goto('/apod/2026-09-11');

    const ruler = page.getByRole('slider', { name: /Días de septiembre de 2026/ });
    await ruler.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(/\/apod\/2026-09-10$/);
    await expect(ruler).toBeFocused();
  });

  test('rejects dates outside the archive', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/apod/1990-01-01');
    await expect(page.getByRole('heading', { name: 'Esa fecha no está en el archivo' })).toBeVisible();
  });

  test('keeps links shared before the redesign working', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/apod?date=2026-09-11');
    await expect(page).toHaveURL(/\/apod\/2026-09-11$/);
    await expect(page.getByRole('heading', { level: 1, name: today.title })).toBeVisible();
  });
});

test.describe('archive', () => {
  test('lists the month as linked days and opens one', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/archive');

    await expect(page).toHaveURL(/\/archive\/2026-09$/);
    await expect(page.getByRole('heading', { level: 1, name: /septiembre de 2026/i })).toBeVisible();
    const link = page.getByRole('link', { name: /M83: The Southern Pinwheel/ });
    await link.click();
    await expect(page).toHaveURL(/\/apod\/2026-09-11$/);
    await expect(page.getByRole('heading', { level: 1, name: today.title })).toBeVisible();
  });

  test('old gallery links land on the archive', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/gallery');
    await expect(page).toHaveURL(/\/archive\/2026-09$/);
  });
});

test('the orrery offers plain links to every section', async ({ page }) => {
  await serveNasa(page);
  await page.goto('/');
  const section = page.getByRole('region', { name: 'Navega por el sistema' });
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole('link', { name: /Archivo/ })).toHaveAttribute('href', '/archive');
  await expect(section.locator('canvas')).toBeAttached();
});
