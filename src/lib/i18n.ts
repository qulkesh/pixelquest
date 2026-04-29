import { ru } from '../locales/ru';
import { en } from '../locales/en';
import type { Dictionary } from '../locales/ru';

export type Lang = 'ru' | 'en';
const dicts: Record<Lang, Dictionary> = { ru, en };

export function getDict(lang: Lang): Dictionary {
  return dicts[lang] ?? ru;
}

// dot-path lookup: t('dashboard.welcome', { name: 'Hero' })
export function tx(lang: Lang, path: string, vars?: Record<string, string | number>): string {
  const dict = getDict(lang) as unknown as Record<string, unknown>;
  const parts = path.split('.');
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else { return path; }
  }
  let str = typeof cur === 'string' ? cur : path;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
}
