import { describe, expect, it, vi } from 'vitest';
import { statusFor, translateExplanation } from '../../../netlify/edge-functions/translate/core';

const TODAY = '2026-09-11';
const day = {
  date: '2026-09-07',
  title: 'The Pelican Nebula in Gas, Dust, and Stars',
  explanation: 'The Pelican Nebula is slowly being transformed.',
  media_type: 'image',
  url: 'https://apod.nasa.gov/apod/image/2609/Pelican_Killion_960.jpg',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const translated = (text: string) => json({ translations: [{ detected_source_language: 'EN', text }] });

/** NASA answers `nasa`; anything else (DeepL) answers `deepl`. */
function fakeFetch(nasa: () => Response, deepl: () => Response = () => json({}, 500)) {
  return vi.fn(async (input: string, _init?: RequestInit) => (input.startsWith('https://api.nasa.gov/') ? nasa() : deepl()));
}

describe('translating an explanation', () => {
  it('translates the explanation, not the title, from NASA\'s own text', async () => {
    const fetch = fakeFetch(() => json(day), () => translated('La nebulosa del Pelícano se transforma lentamente.'));
    const result = await translateExplanation('2026-09-07', 'es', { fetch, deeplKey: 'secret:fx', nasaKey: 'nasa', today: TODAY });

    expect(result).toEqual({
      ok: true,
      translation: { date: '2026-09-07', lang: 'es', text: 'La nebulosa del Pelícano se transforma lentamente.' },
    });
    expect(fetch.mock.calls[0][0]).toBe('https://api.nasa.gov/planetary/apod?date=2026-09-07&api_key=nasa');
    const [url, init] = fetch.mock.calls[1];
    expect(url).toBe('https://api-free.deepl.com/v2/translate');
    expect((init?.headers as Record<string, string>).Authorization).toBe('DeepL-Auth-Key secret:fx');
    expect(JSON.parse(String(init?.body))).toEqual({ text: [day.explanation], source_lang: 'EN', target_lang: 'ES' });
  });

  it('asks for Brazilian Portuguese, on the paid host for a paid key', async () => {
    const fetch = fakeFetch(() => json(day), () => translated('A Nebulosa do Pelicano está se transformando.'));
    const result = await translateExplanation('2026-09-07', 'pt-BR', { fetch, deeplKey: 'secret', today: TODAY });

    expect(result.ok && result.translation.lang).toBe('pt-BR');
    const [url, init] = fetch.mock.calls[1];
    expect(url).toBe('https://api.deepl.com/v2/translate');
    expect(JSON.parse(String(init?.body)).target_lang).toBe('PT-BR');
  });

  it('refuses other languages and dates outside the archive without asking anyone', async () => {
    const fetch = fakeFetch(() => json(day));
    const deps = { fetch, deeplKey: 'secret:fx', today: TODAY };

    for (const [date, lang] of [
      ['2026-09-07', 'en'],
      ['2026-09-07', 'fr'],
      ['2026-09-07', null],
      ['1990-01-01', 'es'],
      ['2026-02-30', 'es'],
      ['2026-09-12', 'es'],
      ['not-a-date', 'es'],
      [null, 'es'],
    ]) {
      expect(await translateExplanation(date, lang, deps)).toEqual({ ok: false, error: 'bad-request' });
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it('spends no requests when DeepL is not configured', async () => {
    const fetch = fakeFetch(() => json(day));
    expect(await translateExplanation('2026-09-07', 'es', { fetch, deeplKey: '  ', today: TODAY })).toEqual({
      ok: false,
      error: 'not-configured',
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('names each failure, so the app can fall back to the original', async () => {
    const run = (nasa: () => Response, deepl?: () => Response) =>
      translateExplanation('2026-09-07', 'es', { fetch: fakeFetch(nasa, deepl), deeplKey: 'secret:fx', today: TODAY });

    expect(await run(() => json({ code: 404 }, 404))).toEqual({ ok: false, error: 'not-found' });
    expect(await run(() => json({ ...day, explanation: '' }))).toEqual({ ok: false, error: 'not-found' });
    expect(await run(() => json({ ...day, date: '2026-09-06' }))).toEqual({ ok: false, error: 'upstream' });
    expect(await run(() => json(day), () => json({ message: 'Quota exceeded' }, 456))).toEqual({ ok: false, error: 'quota' });
    expect(await run(() => json(day), () => json({ message: 'Wrong key' }, 403))).toEqual({ ok: false, error: 'not-configured' });
    expect(await run(() => json(day), () => json({ translations: [] }))).toEqual({ ok: false, error: 'upstream' });
    expect(
      await run(() => {
        throw new TypeError('offline');
      })
    ).toEqual({ ok: false, error: 'upstream' });

    expect([statusFor('bad-request'), statusFor('not-found'), statusFor('quota'), statusFor('upstream')]).toEqual([400, 404, 503, 502]);
  });
});
