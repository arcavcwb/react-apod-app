import React from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useI18n } from '../i18n/I18n';
import { MessageKey } from '../i18n/messages';

const LINKS: { label: MessageKey; href: string }[] = [
  { label: 'about.linkApod', href: 'https://apod.nasa.gov/apod/astropix.html' },
  { label: 'about.linkApi', href: 'https://api.nasa.gov/' },
  { label: 'about.linkCode', href: 'https://github.com/arcavcwb/react-apod-app' },
];

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="grid gap-4 border-t border-line py-10 lg:grid-cols-12 lg:gap-10">
    <h2 className="notation text-muted lg:col-span-3 lg:pl-8">{title}</h2>
    <div className="max-w-[66ch] font-serif text-lg leading-[1.7] text-copy lg:col-span-7">{children}</div>
  </section>
);

export const About: React.FC = () => {
  const { t } = useI18n();
  useDocumentTitle(t('about.title'));

  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-16 pt-10 sm:px-6 lg:px-10">
      <h1 className="pb-10 font-serif text-[clamp(2.5rem,1.6rem+3vw,5rem)] font-normal leading-none tracking-[-0.02em] text-star lg:pl-8">
        {t('about.title')}
      </h1>
      <Block title={t('about.apodTitle')}>
        <p>{t('about.apodBody')}</p>
      </Block>
      <Block title={t('about.projectTitle')}>
        <p>{t('about.projectBody')}</p>
      </Block>
      <Block title={t('about.creditsTitle')}>
        <p>{t('about.creditsBody')}</p>
      </Block>
      <Block title={t('about.techTitle')}>
        <ul className="space-y-3">
          {(['about.tech1', 'about.tech2', 'about.tech3', 'about.tech4'] as const).map((key) => (
            <li key={key} className="flex gap-4">
              <span aria-hidden="true" className="mt-[0.85em] h-px w-4 shrink-0 bg-line-strong" />
              {t(key)}
            </li>
          ))}
        </ul>
      </Block>
      <Block title={t('about.links')}>
        <ul className="font-sans">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-12 items-center gap-2 text-base">
                {t(label)}
                <BiLinkExternal aria-hidden="true" className="h-4 w-4 text-muted" />
              </a>
            </li>
          ))}
        </ul>
      </Block>
    </div>
  );
};
