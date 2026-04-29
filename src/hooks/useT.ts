import { useUiStore } from '../store/useUiStore';
import { tx } from '../lib/i18n';

export function useT() {
  const lang = useUiStore(s => s.lang);
  return (path: string, vars?: Record<string, string | number>) => tx(lang, path, vars);
}
