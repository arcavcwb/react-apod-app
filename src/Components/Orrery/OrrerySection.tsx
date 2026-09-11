import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18n';
import { MessageKey } from '../../i18n/messages';
import { STATIONS, StationId } from './orrery.config';

// Three.js ships in its own chunk, fetched only when this section nears the viewport.
const Orrery = lazy(() => import('./Orrery'));

const LABELS: Record<StationId, { label: MessageKey; desc: MessageKey }> = {
  today: { label: 'nav.today', desc: 'orrery.todayDesc' },
  archive: { label: 'nav.archive', desc: 'orrery.archiveDesc' },
  about: { label: 'nav.about', desc: 'orrery.aboutDesc' },
};

export const OrrerySection: React.FC = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState<StationId | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="orrery-title" className="border-t border-line">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-24">
        <div className="lg:col-span-4 lg:pl-8">
          <h2 id="orrery-title" className="font-serif text-4xl font-normal leading-tight text-star">
            {t('orrery.title')}
          </h2>
          <p className="mt-4 max-w-md text-base text-muted">{t('orrery.body')}</p>
          <ul className="mt-10 border-t border-line">
            {STATIONS.map(({ id, path }) => (
              <li key={id} className="border-b border-line">
                <Link
                  to={path}
                  onMouseEnter={() => setActive(id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(id)}
                  onBlur={() => setActive(null)}
                  className="group flex min-h-12 flex-col py-4"
                >
                  <span className={`font-serif text-2xl transition-colors ${active === id ? 'text-red' : 'text-star'}`}>
                    {t(LABELS[id].label)}
                  </span>
                  <span className="mt-1 text-sm text-muted">{t(LABELS[id].desc)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[22rem] sm:h-[28rem] lg:col-span-8 lg:h-[36rem]">
          {near && (
            <Suspense
              fallback={
                <p role="status" className="notation absolute inset-0 m-auto h-fit w-fit text-faint">
                  {t('orrery.loading')}
                </p>
              }
            >
              <Orrery activeId={active} onHover={setActive} />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  );
};
