import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchTranslation, peekTranslation } from '../translation.service';

const translation = { date: '2020-01-01', lang: 'es', text: 'Una explicación traducida.' };

const respond = (status: number, body: unknown) =>
  vi.fn().mockImplementation(async () => new Response(JSON.stringify(body), { status }));

describe('translation.service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-11T15:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('asks for a day in a language, validates the answer and keeps it', async () => {
    const fetchMock = respond(200, translation);
    vi.stubGlobal('fetch', fetchMock);

    expect(await fetchTranslation('2020-01-01', 'es')).toEqual({ data: translation, error: null });
    expect(String(fetchMock.mock.calls[0][0])).toBe('/api/translate?date=2020-01-01&lang=es');
    expect(peekTranslation('2020-01-01', 'es')).toEqual(translation);

    await fetchTranslation('2020-01-01', 'es');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('shares one request between callers asking for the same translation at once', async () => {
    const fetchMock = respond(200, translation);
    vi.stubGlobal('fetch', fetchMock);

    const [first, second] = await Promise.all([fetchTranslation('2020-01-01', 'es'), fetchTranslation('2020-01-01', 'es')]);
    expect(first).toEqual(second);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('refuses an answer for another language or day, and keeps nothing', async () => {
    vi.stubGlobal('fetch', respond(200, { ...translation, lang: 'pt-BR' }));
    expect(await fetchTranslation('2020-01-01', 'es')).toEqual({ data: null, error: 'contract' });

    vi.stubGlobal('fetch', respond(200, { ...translation, date: '2020-01-02' }));
    expect(await fetchTranslation('2020-01-01', 'es')).toEqual({ data: null, error: 'contract' });
    expect(peekTranslation('2020-01-01', 'es')).toBeNull();
  });

  it('reports an unavailable translation, so the original shows', async () => {
    vi.stubGlobal('fetch', respond(503, { error: 'not-configured' }));
    expect(await fetchTranslation('2020-01-01', 'es')).toEqual({ data: null, error: 'unavailable' });

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    expect(await fetchTranslation('2020-01-01', 'es')).toEqual({ data: null, error: 'network' });
  });
});
