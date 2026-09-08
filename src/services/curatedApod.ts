import { ApodItem } from '../contracts/apod.contract';

/**
 * Catálogo curado de alta resolución con observaciones astronómicas icónicas de la NASA.
 * Actúa como capa de resiliencia y respaldo cuando la API oficial de NASA
 * sufre saturación por cuota de uso (HTTP 429), latencia extrema o fallos de red.
 *
 * Utiliza versiones calibradas (~medium.jpg) para la visualización fluida
 * y enlaces sin compresión (~orig.jpg) para el visor Ultra HD / 4K.
 */
export const CURATED_APOD_CATALOG: ApodItem[] = [
  {
    date: '2022-07-12',
    title: "Webb's First Deep Field (SMACS 0723)",
    explanation:
      "NASA's James Webb Space Telescope has produced the deepest and sharpest infrared image of the distant universe to date. Known as Webb's First Deep Field, this image of galaxy cluster SMACS 0723 is overflowing with detail. Thousands of galaxies — including the faintest objects ever observed in the infrared — have appeared in Webb's view for the first time.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/PIA25340/PIA25340~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA25340/PIA25340~orig.jpg',
    copyright: 'NASA, ESA, CSA, STScI',
    service_version: 'v1',
  },
  {
    date: '2022-10-19',
    title: 'Pillars of Creation by Webb',
    explanation:
      "NASA's James Webb Space Telescope's near-infrared view of the Pillars of Creation reveals a lush, highly detailed landscape — where new stars are forming within dense clouds of gas and dust. The three-dimensional pillars look like majestic rock formations, but are far more permeable. These columns are made up of cool interstellar gas and dust.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/PIA25439/PIA25439~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA25439/PIA25439~orig.jpg',
    copyright: 'NASA, ESA, CSA, STScI',
    service_version: 'v1',
  },
  {
    date: '2022-07-13',
    title: 'Cosmic Cliffs in the Carina Nebula',
    explanation:
      "This landscape of 'mountains' and 'valleys' speckled with glittering stars is actually the edge of a nearby, young, star-forming region called NGC 3324 in the Carina Nebula. Captured in infrared light by NASA's new James Webb Space Telescope, this image reveals for the first time previously invisible areas of star birth.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/PIA25344/PIA25344~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA25344/PIA25344~orig.jpg',
    copyright: 'NASA, ESA, CSA, STScI',
    service_version: 'v1',
  },
  {
    date: '2022-08-29',
    title: 'Phantom Galaxy M74 by Webb',
    explanation:
      "Webb's gaze into M74, also known as the Phantom Galaxy, reveals delicate filaments of gas and dust in the grandiose spiral arms which wind outwards from the center of this image. A lack of gas in the nuclear region also provides an unobscured view of the nuclear star cluster at the galaxy's heart.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/PIA25442/PIA25442~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA25442/PIA25442~orig.jpg',
    copyright: 'ESA/Webb, NASA & CSA, J. Lee and the PHANGS-JWST Team',
    service_version: 'v1',
  },
  {
    date: '2022-08-22',
    title: 'Jupiter in Infrared from Webb',
    explanation:
      "Two moons, difficult rings, and auroras appear in this infrared portrait of Jupiter captured by the James Webb Space Telescope. The Great Red Spot shines brightly in these views, as do numerous clouds that reflect significant sunlight.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/PIA25424/PIA25424~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA25424/PIA25424~orig.jpg',
    copyright: 'NASA, ESA, CSA, Jupiter ERS Team; Ricardo Hueso, Judy Schmidt',
    service_version: 'v1',
  },
  {
    date: '2022-07-14',
    title: "Stephan's Quintet in Infrared",
    explanation:
      "An enormous mosaic of Stephan's Quintet is the largest image to date from the James Webb Space Telescope, covering about one-fifth of the Moon's diameter. It contains more than 150 million pixels and is constructed from almost 1,000 separate image files.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/PIA25342/PIA25342~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA25342/PIA25342~orig.jpg',
    copyright: 'NASA, ESA, CSA, STScI',
    service_version: 'v1',
  },
  {
    date: '2022-09-06',
    title: 'Tarantula Nebula by Webb',
    explanation:
      "At only 161,000 light-years away in the Large Magellanic Cloud galaxy, the Tarantula Nebula is the largest and brightest star-forming region in the Local Group. It is home to the hottest, most massive stars known.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/PIA25438/PIA25438~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA25438/PIA25438~orig.jpg',
    copyright: 'NASA, ESA, CSA, STScI, Webb ERO Production Team',
    service_version: 'v1',
  },
  {
    date: '2023-08-21',
    title: 'The Ring Nebula (M57) by Webb',
    explanation:
      "The Ring Nebula is one of the most notable planetary nebulae in our skies. It lies in the constellation Lyra, roughly 2,000 light-years from Earth. This striking view from the NIRCam instrument reveals the complex structure of the doughnut-shaped ring of glowing gas.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/PIA25992/PIA25992~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA25992/PIA25992~orig.jpg',
    copyright: 'ESA/Webb, NASA, CSA, M. Barlow, N. Cox, R. Wesson',
    service_version: 'v1',
  },
  {
    date: '2016-04-21',
    title: 'The Bubble Nebula (NGC 7635)',
    explanation:
      "For its 26th birthday, the Hubble Space Telescope photographed a stunning view of an enormous bubble being blown into space by a super-hot, massive star. The star is 45 times more massive than our sun, driving powerful stellar winds.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/PIA20645/PIA20645~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA20645/PIA20645~orig.jpg',
    copyright: 'NASA, ESA, and the Hubble Heritage Team (STScI/AURA)',
    service_version: 'v1',
  },
  {
    date: '2015-01-05',
    title: 'Andromeda Galaxy (M31) - Sharpest View',
    explanation:
      "The sharpest and largest image ever taken of the Andromeda Galaxy, captured by NASA's Hubble Space Telescope, shows over 100 million stars and thousands of star clusters across a section of the galaxy stretching over 40,000 light-years.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/PIA15416/PIA15416~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA15416/PIA15416~orig.jpg',
    copyright: 'NASA, ESA, J. Dalcanton, B. F. Williams, PHAT Team',
    service_version: 'v1',
  },
  {
    date: '2006-01-11',
    title: 'Orion Nebula Mosaic',
    explanation:
      "This dramatic panoramic image of the Orion Nebula was captured by the Hubble Space Telescope's Advanced Camera for Surveys. It is one of the most detailed astronomical images ever produced, showing more than 3,000 stars of various sizes.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/PIA04224/PIA04224~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA04224/PIA04224~orig.jpg',
    copyright: 'NASA, ESA, M. Robberto (Space Telescope Science Institute/ESA)',
    service_version: 'v1',
  },
  {
    date: '2021-12-25',
    title: 'Launch of the James Webb Space Telescope',
    explanation:
      "An Ariane 5 rocket carrying NASA's James Webb Space Telescope lifts off from Europe's Spaceport, South America, embarking on a mission to explore the deepest origins of our cosmos.",
    media_type: 'image',
    url: 'https://images-assets.nasa.gov/image/NHQ202112250009/NHQ202112250009~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/NHQ202112250009/NHQ202112250009~orig.jpg',
    copyright: 'NASA/Bill Ingalls',
    service_version: 'v1',
  },
];

/**
 * Obtiene un APOD del catálogo curado por fecha o el primero como hoy
 */
export function getCuratedApod(date?: string): ApodItem {
  if (!date) return CURATED_APOD_CATALOG[0];
  const found = CURATED_APOD_CATALOG.find((item) => item.date === date);
  return found || CURATED_APOD_CATALOG[Math.abs(hashCode(date)) % CURATED_APOD_CATALOG.length];
}

/**
 * Obtiene una selección aleatoria del catálogo curado
 */
export function getCuratedGallery(count: number = 12): ApodItem[] {
  const shuffled = [...CURATED_APOD_CATALOG].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, CURATED_APOD_CATALOG.length));
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
