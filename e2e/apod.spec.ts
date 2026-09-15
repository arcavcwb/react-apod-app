import { expect, test } from '@playwright/test';
import { serveNasa, today } from './nasa';

test.describe('today', () => {
  test('shows the picture of the day whole, with its title, credit and actions', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: today.title })).toBeVisible();
    const picture = page.getByRole('img', { name: today.title });
    await expect(picture).toBeVisible();
    await expect(picture).toHaveCSS('object-fit', 'contain');
    await expect(page.getByText(today.copyright)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver detalles' })).toHaveAttribute('href', '/apod/2026-09-11');
    await expect(page.getByRole('button', { name: 'Compartir' })).toBeVisible();
  });

  test('leads from today into the gallery', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/');

    await page.getByRole('link', { name: 'Ver la galería' }).click();
    await expect(page).toHaveURL(/\/gallery\/2026-09$/);
  });

  test('switches the interface language and remembers it', async ({ page, isMobile }) => {
    await serveNasa(page);
    await page.goto('/');

    // Phones open a language menu; wider screens show every language as a button.
    if (isMobile) {
      await page.getByRole('button', { name: /^Idioma/ }).click();
      await page.getByRole('menuitemradio', { name: 'Português (Brasil)' }).click();
    } else {
      await page.getByRole('button', { name: 'Português (Brasil)' }).click();
    }
    await expect(page.getByRole('link', { name: 'Galeria', exact: true })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

    await page.reload();
    await expect(page.getByRole('link', { name: 'Sobre' })).toBeVisible();
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

test.describe('sharing', () => {
  test('copies the link and says so when there is no share sheet', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.addInitScript(() => Object.defineProperty(navigator, 'share', { value: undefined }));
    await serveNasa(page);
    await page.goto('/apod/2026-09-11');

    await page.getByRole('button', { name: 'Compartir' }).click();
    await page.getByRole('button', { name: 'Copiar enlace' }).click();
    await expect(page.getByText('Enlace copiado')).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/apod\/2026-09-11$/);
  });
});

test.describe('travelling through days', () => {
  test('the previous day updates the address and asks NASA for that day', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/apod/2026-09-11');
    await expect(page.getByRole('heading', { level: 1, name: today.title })).toBeVisible();

    await page.getByRole('link', { name: /Día anterior/ }).click();
    await expect(page).toHaveURL(/\/apod\/2026-09-10$/);
    // The recording has no 10 September, so NASA's 404 must surface as such.
    await expect(page.getByRole('heading', { name: 'No hay imagen para esta fecha' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Día siguiente/ })).toBeVisible();
  });

  test('arrow keys walk the days', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Arrow keys are a desktop affordance; phones swipe');
    await serveNasa(page);
    await page.goto('/apod/2026-09-11');
    await expect(page.getByRole('heading', { level: 1, name: today.title })).toBeVisible();

    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(/\/apod\/2026-09-10$/);
  });

  test('typing a date goes straight to it', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/apod/2026-09-11');

    await page.getByLabel('Ir a una fecha').fill('2026-09-10');
    await expect(page).toHaveURL(/\/apod\/2026-09-10$/);
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

test.describe('gallery', () => {
  test('shows the month as linked pictures and opens one', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/gallery');

    await expect(page).toHaveURL(/\/gallery\/2026-09$/);
    await expect(page.getByRole('heading', { level: 1, name: /septiembre de 2026/i })).toBeVisible();
    await page.getByRole('link', { name: /M83: The Southern Pinwheel/ }).click();
    await expect(page).toHaveURL(/\/apod\/2026-09-11$/);
    await expect(page.getByRole('heading', { level: 1, name: today.title })).toBeVisible();
  });

  test('old archive links land on the gallery', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/archive/2026-08');
    await expect(page).toHaveURL(/\/gallery\/2026-08$/);
  });
});
