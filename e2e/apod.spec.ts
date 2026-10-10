import { expect, test, type Locator } from '@playwright/test';
import { TODAY, serveNasa, today } from './nasa';

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

test.describe('translation', () => {
  test('translates the explanation but not the title, with the original a tap away', async ({ page }) => {
    await serveNasa(page);
    await page.route(/\/api\/translate\?/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ date: '2026-09-11', lang: 'es', text: 'Una galaxia espiral, en español para la prueba.' }),
      })
    );
    await page.goto('/apod/2026-09-11');

    await expect(page.getByRole('heading', { level: 1, name: today.title })).toBeVisible();
    await expect(page.getByText('Una galaxia espiral, en español para la prueba.').first()).toBeAttached();
    await expect(page.getByText('Traducción automática del texto de la NASA.').first()).toBeAttached();

    await page.getByRole('button', { name: 'Ver original' }).first().click();
    await expect(page.getByText(today.explanation.slice(0, 60)).first()).toBeAttached();
    await expect(page.getByRole('button', { name: 'Ver traducción' }).first()).toBeAttached();
  });

  test('shows NASA\'s original when no translation is available', async ({ page }) => {
    await serveNasa(page);
    await page.route(/\/api\/translate\?/, (route) =>
      route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'not-configured' }) })
    );
    await page.goto('/apod/2026-09-11');

    await expect(page.getByText(today.explanation.slice(0, 60)).first()).toBeAttached();
    await expect(page.getByText('Texto original de la NASA, en inglés.').first()).toBeAttached();
    await expect(page.getByRole('button', { name: 'Ver original' })).toHaveCount(0);
  });
});

test.describe('the picture full screen', () => {
  test('opens from a day, keeps the arrow keys to itself and gives focus back on Escape', async ({ page }) => {
    await serveNasa(page);
    await page.goto(`/apod/${TODAY}`);

    const open = page.getByRole('button', { name: 'Ver la imagen a pantalla completa' });
    await open.click();
    const viewer = page.getByRole('dialog', { name: today.title });
    await expect(viewer.getByRole('img', { name: today.title })).toBeVisible();
    await expect(viewer.getByText(today.copyright)).toBeVisible();

    // The day's arrow keys wait while the picture is open.
    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(new RegExp(`/apod/${TODAY}$`));

    await page.keyboard.press('Escape');
    await expect(viewer).toHaveCount(0);
    await expect(open).toBeFocused();
  });

  test('opens from today and closes with a click on the picture', async ({ page }) => {
    await serveNasa(page);
    await page.goto('/');

    await page.getByRole('button', { name: 'Ver la imagen a pantalla completa' }).click();
    const viewer = page.getByRole('dialog', { name: today.title });
    await viewer.getByRole('img', { name: today.title }).click();
    await expect(viewer).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1, name: today.title })).toBeVisible();
  });

  test('grows from its place into the viewer: the photograph moves and the page fades as one', async ({ page }) => {
    await serveNasa(page);
    await page.goto(`/apod/${TODAY}`);

    await page.getByRole('button', { name: 'Ver la imagen a pantalla completa' }).click();
    const running = await page.waitForFunction(() => {
      const parts = document.getAnimations().map((a) => (a.effect as KeyframeEffect).pseudoElement ?? '');
      return parts.some((part) => part.startsWith('::view-transition')) ? parts : null;
    });
    const parts = (await running.jsonValue()) ?? [];
    // Old and new under one name is a move; the day's words have no part of their own in it.
    expect(parts).toContain('::view-transition-old(photo)');
    expect(parts).toContain('::view-transition-new(photo)');
    expect(parts.filter((part) => /day-title|day-text/.test(part))).toEqual([]);
  });
});

// The desktop layout on a low screen: what a 1366x768 or a 1280x720 laptop leaves to the page.
test.describe('laptop screens', () => {
  const bottom = async (part: Locator) => {
    const box = await part.boundingBox();
    return box ? box.y + box.height : Infinity;
  };

  for (const size of [
    { width: 1366, height: 650 },
    { width: 1280, height: 600 },
  ]) {
    const screen = `${size.width}x${size.height}`;

    test(`a day with a long title fits ${screen}, with nothing over the footer`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'the desktop layout');
      await page.setViewportSize(size);
      await serveNasa(page);
      // Three lines of title, the most the page shows.
      const title = 'The Complete Sharpless Catalog: 313 Nebulas';
      await page.route(/\/api\/apod\?date=/, (route) =>
        route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ...today, title }) })
      );
      await page.goto(`/apod/${TODAY}`);

      await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
      const strip = page.getByRole('region', { name: /septiembre de 2026/i });
      await expect(strip.getByRole('link').first()).toBeVisible();
      const more = page.getByRole('button', { name: 'Leer todo' });
      await expect(more).toBeVisible();

      const footer = (await page.getByRole('contentinfo').boundingBox())!;
      expect(footer.y + footer.height).toBeLessThanOrEqual(size.height);
      for (const part of [strip, more, page.getByRole('link', { name: /Página oficial/ }), page.getByRole('link', { name: /Alta resolución/ })]) {
        expect(await bottom(part)).toBeLessThanOrEqual(footer.y);
      }
    });

    test(`the gallery shows pictures, not strips, on ${screen}`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'the desktop layout');
      await page.setViewportSize(size);
      await serveNasa(page);
      await page.goto(`/gallery/${TODAY.slice(0, 7)}`);

      const picture = page.getByRole('link', { name: new RegExp(today.title) }).locator('img');
      await expect(picture).toBeVisible();
      const box = (await picture.boundingBox())!;
      expect(box.height).toBeGreaterThan(box.width * 0.6);
    });

    test(`about keeps every block whole on ${screen}`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'the desktop layout');
      await page.setViewportSize(size);
      await page.goto('/about');

      const pages = page.getByRole('region', { name: 'Acerca de' });
      await expect(pages).toBeVisible();
      const frame = (await pages.boundingBox())!;
      for (const block of await pages.locator('section').all()) {
        expect(await bottom(block)).toBeLessThanOrEqual(frame.y + frame.height);
      }
    });
  }
});
