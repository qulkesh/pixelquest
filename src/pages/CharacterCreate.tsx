import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useGameStore } from '../store/useGameStore';
import Avatar from '../components/Avatar';
import PixelButton from '../components/ui/PixelButton';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { useT } from '../hooks/useT';
import type { Appearance, Gender } from '../types/game';

export default function CharacterCreate() {
  const t = useT();
  const user = useAuthStore(s => s.user);
  const profile = useGameStore(s => s.profile);
  const bootstrap = useGameStore(s => s.bootstrapForUser);
  const finish = useGameStore(s => s.finishOnboarding);
  const navigate = useNavigate();

  const [gender, setGender] = useState<Gender>('male');
  const [look, setLook] = useState<Appearance>({ skin: 1, hair: 1, outfit: 1 });
  const [name, setName] = useState('Hero');

  useEffect(() => {
    if (user && !profile) bootstrap(user.id);
  }, [user, profile, bootstrap]);

  if (!user) return <Navigate to="/login" replace />;

  function cycle(field: keyof Appearance, max = 8) {
    setLook(prev => {
      const cur = (prev[field] as number) ?? 1;
      const next = (cur % max) + 1;
      return { ...prev, [field]: next };
    });
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="pixel-frame w-[640px] max-w-full p-6 relative">
        <div className="absolute -top-3 left-4 px-2 bg-bg font-pixel text-[10px] uppercase text-cyan neon-text">
          {t('character.title')}
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="font-pixel text-base text-cyan neon-text">{t('character.title')}</div>
          <LanguageSwitcher />
        </div>

        <div className="grid grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="pixel-frame-soft p-6">
              <Avatar gender={gender} appearance={look} hpRatio={1} size={160} />
            </div>
            <input
              className="pixel-input text-center"
              value={name} onChange={e => setName(e.target.value)}
              placeholder={t('character.enterName')}
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="stat-label mb-2">{t('character.chooseGender')}</div>
              <div className="flex gap-2">
                {(['male','female'] as Gender[]).map(g => (
                  <PixelButton key={g} variant={gender === g ? 'primary' : 'default'} onClick={() => setGender(g)}>
                    {t(`character.${g}`)}
                  </PixelButton>
                ))}
              </div>
            </div>

            <div>
              <div className="stat-label mb-2">{t('character.chooseLook')}</div>
              <div className="grid grid-cols-3 gap-2">
                <PixelButton onClick={() => cycle('skin')}>{t('character.skin')}: {look.skin}</PixelButton>
                <PixelButton onClick={() => cycle('hair')}>{t('character.hair')}: {look.hair}</PixelButton>
                <PixelButton onClick={() => cycle('outfit')}>{t('character.outfit')}: {look.outfit}</PixelButton>
              </div>
            </div>

            <PixelButton
              variant="primary"
              className="w-full mt-4"
              onClick={() => { finish({ nickname: name || 'Hero', gender, appearance: look }); navigate('/'); }}
            >
              {t('character.start')}
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
