import recorded from './fixtures/apod-posts.json';

/** Seven days as science.nasa.gov answered them on 2026-10-09, with only the fields the app asks for. */
export const recordedPosts = recorded;
export const recordedPost = (date: string) => recorded.find((post) => post.date.startsWith(date))!;

interface MadeUpDay {
  date: string;
  title: string;
  explanation: string;
  url?: string;
  credit?: string;
}

/** A day made up for a test, in the official site's own markup. */
export const apodPost = ({ date, title, explanation, url, credit }: MadeUpDay) => ({
  date: `${date}T00:05:00`,
  title: { rendered: `APOD: 2026 September 7 &#8211; ${title}` },
  content: {
    rendered: [
      '<div class="hds-media-detail-hero wp-block-nasa-blocks-media-detail-hero"><div class="media-detail-hero__media margin-bottom-6">',
      url ? `<figure class="hds-media-inner"><a href="${url}"><img decoding="async" width="960" height="640" src="${url}" alt="" /></a></figure>` : '',
      `</div> <h1 class="display-48 margin-top-0 margin-bottom-3">${title}</h1> <div class="grid-row media-detail-hero__content-row">`,
      `<p class="p-md margin-0 media-detail-hero__description"> <strong>Explanation: </strong>${explanation} </p>`,
      '<table class="media-detail-hero__meta-table width-full"><tbody>',
      credit ? `<tr class="media-detail-hero__meta-row"><th scope="row" class="label">Credit &amp; Copyright</th><td class="p-sm"> ${credit} </td></tr>` : '',
      '</tbody></table></div></div>',
    ].join(''),
  },
});
