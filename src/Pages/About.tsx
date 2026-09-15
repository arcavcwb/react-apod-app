import React from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { Pager, PagerPanel } from '../Components/Pager/Pager';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useMediaQuery } from '../Hooks/useMediaQuery';
import { useI18n } from '../i18n/I18n';
import { MessageKey } from '../i18n/messages';

const LINKS: { label: MessageKey; href: string }[] = [
  { label: 'about.linkApod', href: 'https://apod.nasa.gov/apod/astropix.html' },
  { label: 'about.linkApi', href: 'https://api.nasa.gov/' },
  { label: 'about.linkCode', href: 'https://github.com/arcavcwb/react-apod-app' },
];

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h2 className="font-semibold text-fg">{title}</h2>
    <div className="mt-4 max-w-[60ch] leading-[1.75] text-fg">{children}</div>
  </section>
);

/** Desktop, on one screen: three blocks abreast, the rest a turn away. Phones read down. */
export const About: React.FC = () => {
  const { t } = useI18n();
  useDocumentTitle(t('about.title'));
  const wide = useMediaQuery('(min-width: 1024px)');

  const blocks: { title: string; body: React.ReactNode }[] = [
    { title: t('about.apodTitle'), body: <p>{t('about.apodBody')}</p> },
    { title: t('about.projectTitle'), body: <p>{t('about.projectBody')}</p> },
    { title: t('about.creditsTitle'), body: <p>{t('about.creditsBody')}</p> },
    {
      title: t('about.techTitle'),
      body: (
        <ul className="space-y-3">
          {(['about.tech1', 'about.tech2', 'about.tech3', 'about.tech4'] as const).map((key) => (
            <li key={key} className="flex gap-4">
              <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-muted" />
              {t(key)}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: t('about.links'),
      body: (
        <ul>
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-12 items-center gap-2">
                {t(label)}
                <BiLinkExternal aria-hidden="true" className="h-4 w-4 text-muted" />
              </a>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[90rem] flex-1 flex-col px-4 pt-6 sm:px-6 lg:px-10 lg:pt-10 xl:px-14">
      <h1 className="shrink-0 text-display font-light text-fg">{t('about.title')}</h1>
      {wide ? (
        <Pager label={t('about.title')} className="mt-12 min-h-0 flex-1" trackClassName="-mx-10 xl:-mx-14">
          {blocks.map(({ title, body }) => (
            <PagerPanel key={title} className="px-10 py-2 lg:w-1/3 xl:px-14">
              <Block title={title}>{body}</Block>
            </PagerPanel>
          ))}
        </Pager>
      ) : (
        <div className="mt-10 space-y-12">
          {blocks.map(({ title, body }) => (
            <Block key={title} title={title}>
              {body}
            </Block>
          ))}
        </div>
      )}
    </div>
  );
};
