import { describe, expect, it, vi } from 'vitest';
import { answerApod, apodDay, apodDays, latestApod, toApodItem } from '../../../netlify/edge-functions/apod/core';
import { apodPost, recordedPost, recordedPosts } from './apodPost';

const TODAY = '2026-09-11';
const ASSETS = 'https://assets.science.nasa.gov';
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const site = (answer: () => Response) => vi.fn(async (_input: string, _init?: RequestInit) => answer());
const pelican = apodPost({ date: '2026-09-07', title: 'The Pelican Nebula', explanation: 'Slowly transformed.', url: `${ASSETS}/pelican.jpg` });

describe("reading a day from APOD's official site", () => {
  it('reads a picture with its title, explanation, credit and largest version', () => {
    const day = toApodItem(recordedPost('2026-09-11'));
    const picture = `${ASSETS}/dynamicimage/assets/science/cds/apod/apod/2026/september/M83_Final2_1x.jpg?w=3828&h=3798&fit=clip&crop=faces%2Cfocalpoint`;

    expect(day).toMatchObject({
      date: '2026-09-11',
      title: 'M83: The Southern Pinwheel',
      media_type: 'image',
      url: picture,
      hdurl: picture,
      copyright: 'Aldo Zanetti',
    });
    expect(day?.explanation).toMatch(/^Beautiful and bright spiral galaxy M83 lies some twelve million light-years away/);
    // The teaser for the next day is not part of the explanation; NASA's own note is.
    expect(day?.explanation).toMatch(/APOD’s main NASA site is moving: From apod\.nasa\.gov to science\.nasa\.gov\/apod$/);
    expect(day?.explanation).not.toMatch(/Tomorrow|Explanation:|<|&#/);
  });

  it('reads the title as APOD wrote it, not the simplified copy in the post', () => {
    // The post is titled "APOD: 1995 June 20 – Pleiades Star Cluster".
    expect(toApodItem(recordedPost('1995-06-20'))).toMatchObject({
      title: 'The Pleiades Star Cluster',
      media_type: 'image',
      url: `${ASSETS}/content/dam/science/cds/apod/apod/1995/june/pleiades2.gif?w=365&h=261&fit=clip&crop=faces%2Cfocalpoint`,
      copyright: 'Mount Wilson Observatory',
    });
  });

  it('reads video files and embedded players as videos', () => {
    expect(toApodItem(recordedPost('2026-09-09'))).toMatchObject({
      title: 'Witness XZ Andromedae Wink',
      media_type: 'video',
      url: `${ASSETS}/content/dam/science/cds/apod/apod/2026/september/xz_and.mp4`,
      copyright: 'Ogetay Kayali (MTU, Starfront Observatories)',
    });
    expect(toApodItem(recordedPost('2012-03-05'))).toMatchObject({
      title: 'Flying Over the Earth at Night',
      media_type: 'video',
      url: 'https://www.youtube.com/embed/FG0fTKAqZ5g?feature=oembed',
    });
  });

  it('keeps interactive days, which have neither media nor explanation', () => {
    expect(toApodItem(recordedPost('2012-03-12'))).toEqual({
      date: '2012-03-12',
      title: 'The Scale of the Universe Interactive',
      explanation: '',
      media_type: 'other',
    });
  });

  it("takes the day's own picture when an annotated one comes with it, and drops the label repeated in the credit", () => {
    expect(toApodItem(recordedPost('2022-06-01'))).toMatchObject({
      title: 'Tau Herculid Meteors over Kitt Peak Telescopes',
      url: `${ASSETS}/content/dam/science/cds/apod/apod/2022/june/TauHerMeteors_Lyu_1080.jpg?w=1080&h=721&fit=clip&crop=faces%2Cfocalpoint`,
      // "Image Credit & Copyright: Jianwei Lyu ( Steward Obs., U. Arizona )" on the page.
      copyright: 'Jianwei Lyu (Steward Obs., U. Arizona)',
    });
  });

  it('reads explanations that come without their label', () => {
    expect(toApodItem(recordedPost('2026-09-15'))?.explanation).toMatch(/^There was something behind the clouds\./);
  });

  it('leaves no markup in any recorded day', () => {
    for (const post of recordedPosts) {
      const day = toApodItem(post);
      expect(`${day?.title} ${day?.explanation} ${day?.copyright ?? ''}`, post.date).not.toMatch(/<[a-z/]|&#?\w+;/i);
    }
  });
});

describe('asking the official site', () => {
  it('asks for one day from the night before, because older days are published at midnight', async () => {
    const fetch = site(() => json([pelican]));
    const day = await apodDay('2026-09-07', { fetch, today: TODAY });

    expect(day).toMatchObject({ ok: true, data: { date: '2026-09-07', title: 'The Pelican Nebula', explanation: 'Slowly transformed.' } });
    const url = new URL(fetch.mock.calls[0][0]);
    expect(`${url.origin}${url.pathname}`).toBe('https://science.nasa.gov/wp-json/wp/v2/image-article');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      categories: '22766',
      _fields: 'date,title,content',
      after: '2026-09-06T23:59:59',
      before: '2026-09-07T23:59:59',
      per_page: '100',
      orderby: 'date',
      order: 'asc',
    });
  });

  it('answers a range with its days only, and the latest day on its own', async () => {
    const posts = ['2026-09-05', '2026-09-06', '2026-09-07'].map((date) => apodPost({ date, title: date, explanation: 'Text.' }));
    const days = await apodDays('2026-09-06', '2026-09-07', { fetch: site(() => json(posts)), today: TODAY });
    expect(days.ok && days.data.map((d) => d.date)).toEqual(['2026-09-06', '2026-09-07']);

    const fetch = site(() => json([pelican]));
    expect(await latestApod({ fetch, today: TODAY })).toMatchObject({ ok: true, data: { date: '2026-09-07' } });
    expect(Object.fromEntries(new URL(fetch.mock.calls[0][0]).searchParams)).toMatchObject({ per_page: '1', order: 'desc' });
  });

  it('refuses dates outside the archive and ranges too long, without asking', async () => {
    const fetch = site(() => json([pelican]));
    const deps = { fetch, today: TODAY };

    expect(await apodDay('1990-01-01', deps)).toEqual({ ok: false, error: 'bad-request' });
    expect(await apodDay('2026-02-30', deps)).toEqual({ ok: false, error: 'bad-request' });
    expect(await apodDay('2026-09-12', deps)).toEqual({ ok: false, error: 'bad-request' });
    expect(await apodDays('2026-09-07', '2026-09-06', deps)).toEqual({ ok: false, error: 'bad-request' });
    expect(await apodDays('2026-01-01', '2026-09-01', deps)).toEqual({ ok: false, error: 'bad-request' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('names each failure', async () => {
    const day = (answer: () => Response) => apodDay('2026-09-07', { fetch: site(answer), today: TODAY });
    const logo = 'https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo@2x.png';

    // APOD published nothing that day.
    expect(await day(() => json([]))).toEqual({ ok: false, error: 'not-found' });
    expect(await day(() => json({ code: 'rest_too_many' }, 429))).toEqual({ ok: false, error: 'rate-limit' });
    expect(await day(() => json({ code: 'internal_server_error' }, 500))).toEqual({ ok: false, error: 'upstream' });
    expect(await day(() => new Response('<html>Maintenance</html>'))).toEqual({ ok: false, error: 'upstream' });
    expect(await day(() => json([{ date: '2026-09-07T00:05:00' }]))).toEqual({ ok: false, error: 'upstream' });
    // A post the app's contract rejects: the site's logo in the place of the picture.
    expect(await day(() => json([apodPost({ date: '2026-09-07', title: 'NASA Science', explanation: 'Text.', url: logo })]))).toEqual({
      ok: false,
      error: 'upstream',
    });
    expect(
      await day(() => {
        throw new TypeError('offline');
      })
    ).toEqual({ ok: false, error: 'upstream' });
  });
});

describe('/api/apod', () => {
  const answer = (query: string, posts: unknown, status = 200) =>
    answerApod(new URLSearchParams(query), { fetch: site(() => json(posts, status)), today: TODAY });
  const today = apodPost({ date: TODAY, title: 'Today', explanation: 'Text.' });

  it('answers a past day for good, and what reaches today for a while', async () => {
    expect(await answer('date=2026-09-07', [pelican])).toMatchObject({ status: 200, body: { date: '2026-09-07' }, open: false });
    expect(await answer('start_date=2026-09-01&end_date=2026-09-07', [pelican])).toMatchObject({ status: 200, body: [{ date: '2026-09-07' }], open: false });

    expect(await answer('date=2026-09-11', [today])).toMatchObject({ status: 200, open: true });
    // No end_date: the range runs to today.
    expect(await answer('start_date=2026-09-07', [pelican, today])).toMatchObject({ status: 200, body: [{}, {}], open: true });
    // No date at all: the latest day.
    expect(await answer('', [today])).toMatchObject({ status: 200, body: { date: TODAY }, open: true });
  });

  it('answers each failure with its status', async () => {
    expect(await answer('date=nonsense', [])).toEqual({ status: 400, body: { error: 'bad-request' }, open: true });
    expect(await answer('date=1995-06-17', [])).toEqual({ status: 404, body: { error: 'not-found' }, open: true });
    expect(await answer('date=2026-09-07', {}, 429)).toEqual({ status: 429, body: { error: 'rate-limit' }, open: true });
    expect(await answer('date=2026-09-07', {}, 503)).toEqual({ status: 502, body: { error: 'upstream' }, open: true });
  });
});
