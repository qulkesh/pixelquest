import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '../lib/i18n';

export interface Toast {
  id: string;
  text: string;
  tone?: 'good' | 'bad' | 'gold' | 'info';
}

interface UiState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toasts: Toast[];
  pushToast: (t: Omit<Toast, 'id'>) => void;
  popToast: (id: string) => void;
  levelUpFlash: boolean;
  flashLevelUp: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      lang: 'ru',
      setLang: (l) => set({ lang: l }),
      toasts: [],
      pushToast: (t) => {
        const id = Math.random().toString(36).slice(2);
        set({ toasts: [...get().toasts, { id, ...t }] });
        setTimeout(() => set({ toasts: get().toasts.filter(x => x.id !== id) }), 2400);
      },
      popToast: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),
      levelUpFlash: false,
      flashLevelUp: () => {
        set({ levelUpFlash: true });
        setTimeout(() => set({ levelUpFlash: false }), 1200);
      }
    }),
    { name: 'pq-ui', partialize: s => ({ lang: s.lang }) }
  )
);
