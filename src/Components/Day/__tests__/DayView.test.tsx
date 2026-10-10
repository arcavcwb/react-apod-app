import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { I18nProvider } from '../../../i18n/I18n';
import { Locale } from '../../../i18n/messages';
import { Day } from '../../../Pages/Day';
import { fetchApodByDate } from '../../../services/nasa.service';

const picture = {
  date: '2026-09-10',
  title: 'The Heart Nebula',
  explanation: 'A cosmic heart in Cassiopeia.',
  media_type: 'image',
  url: 'https://apod.nasa.gov/apod/image/2609/heart.jpg',
  hdurl: 'https://apod.nasa.gov/apod/image/2609/heart_big.jpg',
  copyright: 'Someone Real',
};

function renderDay(path: string, locale: Locale = 'es') {
  const router = createMemoryRouter([{ path: '/apod/:date', element: <Day /> }], { initialEntries: [path] });
  return render(
    <I18nProvider initialLocale={locale}>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}

describe('Day page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-11T15:00:00Z'));
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('shows the picture whole with its title, credit and actions', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(picture))));
    renderDay('/apod/2026-09-10');

    expect(await screen.findByRole('heading', { level: 1, name: 'The Heart Nebula' })).toBeTruthy();
    expect(screen.getByAltText('The Heart Nebula').className).toContain('object-contain');
    expect(screen.getByText('Someone Real')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Alta resolución/ }).getAttribute('href')).toBe(picture.hdurl);
    expect(screen.getByRole('link', { name: /Página oficial/ }).getAttribute('href')).toBe(
      'https://science.nasa.gov/apod/?date=260910'
    );
    expect(screen.getByRole('button', { name: 'Compartir' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Día siguiente/ }).getAttribute('href')).toBe('/apod/2026-09-11');
  });

  it('explains a rate limit and offers a retry instead of a substitute picture', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 429 }))
      .mockResolvedValue(new Response(JSON.stringify(picture)));
    vi.stubGlobal('fetch', fetchMock);
    renderDay('/apod/2026-09-10');

    expect(await screen.findByRole('heading', { name: 'La NASA pidió una pausa' })).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'The Heart Nebula' })).toBeTruthy();
  });

  it("explains NASA's placeholder record instead of showing its logo as the day", async () => {
    const logo = 'https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ ...picture, title: 'NASA Science', url: logo, hdurl: logo }))));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderDay('/apod/2026-09-10');

    expect(await screen.findByRole('heading', { name: 'Respuesta inesperada' })).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.queryByText('NASA Science')).toBeNull();
  });

  it('names the tab after a day that was already cached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(picture))));
    await fetchApodByDate('2026-09-10');
    renderDay('/apod/2026-09-10', 'en');

    expect(await screen.findByRole('heading', { level: 1, name: 'The Heart Nebula' })).toBeTruthy();
    expect(document.title).toBe('The Heart Nebula · NASA APOD Explorer');
  });

  it('rejects dates outside the archive without calling NASA', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    renderDay('/apod/1990-01-01', 'pt-BR');

    expect(await screen.findByRole('heading', { name: 'Essa data não está no arquivo' })).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('speaks English when asked to', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(picture))));
    renderDay('/apod/2026-09-10', 'en');
    expect(await screen.findByRole('link', { name: /Full resolution/ })).toBeTruthy();
    expect(document.documentElement.lang).toBe('en');
  });
});
