import { describe, expect, it } from 'vitest';
import { MESSAGES } from '../messages';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('interface copy', () => {
  const [source, ...others] = Object.values(MESSAGES);

  it('uses the same placeholders in every language', () => {
    for (const messages of others) {
      for (const key of Object.keys(source) as (keyof typeof source)[]) {
        expect(placeholders(messages[key]), key).toEqual(placeholders(source[key]));
      }
    }
  });

  it('leaves no string empty, except the English "original language" note', () => {
    for (const [locale, messages] of Object.entries(MESSAGES)) {
      for (const [key, value] of Object.entries(messages)) {
        if (locale === 'en' && key === 'day.originalLanguage') continue;
        expect(value.trim(), `${locale} ${key}`).not.toBe('');
      }
    }
  });
});
