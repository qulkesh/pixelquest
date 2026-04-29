import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseEnabled } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  ready: boolean;
  init: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nickname: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      ready: false,

      init: async () => {
        if (isSupabaseEnabled && supabase) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            set({ user: { id: data.session.user.id, email: data.session.user.email ?? '' } });
          }
          supabase.auth.onAuthStateChange((_e, session) => {
            set({
              user: session?.user
                ? { id: session.user.id, email: session.user.email ?? '' }
                : null
            });
          });
        }
        set({ ready: true });
      },

      signIn: async (email, password) => {
        set({ loading: true });
        try {
          if (isSupabaseEnabled && supabase) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            set({ user: { id: data.user!.id, email: data.user!.email ?? '' } });
          } else {
            // mock: any credentials, derive id from email
            const id = `mock-${btoa(email).replace(/=+$/,'')}`;
            set({ user: { id, email } });
          }
        } finally { set({ loading: false }); }
      },

      signUp: async (email, password, _nickname) => {
        set({ loading: true });
        try {
          if (isSupabaseEnabled && supabase) {
            const { data, error } = await supabase.auth.signUp({
              email, password,
              options: { data: { nickname: _nickname, language: 'ru' } }
            });
            if (error) throw error;
            if (data.user) set({ user: { id: data.user.id, email: data.user.email ?? '' } });
          } else {
            const id = `mock-${btoa(email).replace(/=+$/,'')}`;
            set({ user: { id, email } });
          }
        } finally { set({ loading: false }); }
      },

      signOut: async () => {
        if (isSupabaseEnabled && supabase) {
          await supabase.auth.signOut();
        }
        set({ user: null });
      }
    }),
    { name: 'pq-auth-mock', partialize: s => ({ user: isSupabaseEnabled ? null : s.user }) }
  )
);
