import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { isSupabaseEnabled } from '../lib/supabase';
import PixelButton from '../components/ui/PixelButton';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { useT } from '../hooks/useT';
import { useUiStore } from '../store/useUiStore';

export default function Login() {
  const t = useT();
  const navigate = useNavigate();
  const signIn = useAuthStore(s => s.signIn);
  const signUp = useAuthStore(s => s.signUp);
  const loading = useAuthStore(s => s.loading);
  const pushToast = useUiStore(s => s.pushToast);

  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (mode === 'in') await signIn(email, password);
      else await signUp(email, password, nickname || 'Hero');
      navigate(mode === 'up' ? '/onboarding' : '/');
    } catch (err: any) {
      pushToast(err.message ?? 'Ошибка', 'bad');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="pixel-frame w-[420px] max-w-full p-6 relative">
        <div className="absolute -top-3 left-4 px-2 bg-bg font-pixel text-[10px] uppercase text-cyan neon-text">
          {t('common.appName')}
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="font-pixel text-lg neon-text text-cyan">
            {mode === 'in' ? t('auth.login') : t('auth.register')}
          </div>
          <LanguageSwitcher />
        </div>
        <p className="text-muted mb-6">{t('common.tagline')}</p>

        {!isSupabaseEnabled && (
          <div className="pixel-frame-soft mb-4 p-2 text-magenta text-sm">{t('auth.mockNote')}</div>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === 'up' && (
            <input
              className="pixel-input"
              placeholder={t('auth.nickname')}
              value={nickname} onChange={e => setNickname(e.target.value)}
            />
          )}
          <input
            className="pixel-input"
            type="email"
            placeholder={t('auth.email')}
            value={email} onChange={e => setEmail(e.target.value)} required
          />
          <input
            className="pixel-input"
            type="password"
            placeholder={t('auth.password')}
            value={password} onChange={e => setPassword(e.target.value)} required minLength={4}
          />
          <PixelButton type="submit" variant="primary" className="w-full" disabled={loading}>
            {mode === 'in' ? t('auth.signIn') : t('auth.signUp')}
          </PixelButton>
        </form>

        <button
          className="mt-4 text-muted hover:text-ink text-sm font-retro"
          onClick={() => setMode(mode === 'in' ? 'up' : 'in')}
        >
          {mode === 'in' ? t('auth.noAccount') : t('auth.haveAccount')}
        </button>
      </div>
    </div>
  );
}
