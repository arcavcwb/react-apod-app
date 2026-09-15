// A shared link must open for whoever receives it. On the deployed site (production or a deploy
// preview) that is the page's own address; running locally it is the public site, because nobody
// else can open localhost and messaging apps do not even turn it into a link.
const PUBLIC_URL = ((import.meta.env.VITE_PUBLIC_URL as string | undefined) || 'https://apodgallery.netlify.app').replace(/\/+$/, '');
const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/;

export function shareUrl(path: string): string {
  const origin = LOCAL_HOST.test(window.location.hostname) ? PUBLIC_URL : window.location.origin;
  return `${origin}${path}`;
}
