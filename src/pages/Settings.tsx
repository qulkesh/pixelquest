import PixelCard from '../components/ui/PixelCard';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { useT } from '../hooks/useT';
import { useGameStore } from '../store/useGameStore';
import Avatar from '../components/Avatar';
import PixelButton from '../components/ui/PixelButton';
import { useState } from 'react';

export default function Settings() {
  const t = useT();
  const profile = useGameStore(s => s.profile);
  const finish = useGameStore(s => s.finishOnboarding);
  const [name, setName] = useState(profile?.nickname ?? '');

  if (!profile) return null;

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-lg text-cyan neon-text">{t('settings.title')}</h1>
      <PixelCard title={t('settings.language')} accent="cyan">
        <div className="flex justify-between items-center">
          <span>{t('settings.language')}</span>
          <LanguageSwitcher />
        </div>
      </PixelCard>
      <PixelCard accent="magenta">
        <div className="flex items-center gap-6">
          <Avatar gender={profile.gender} appearance={profile.appearance} hpRatio={profile.hp / profile.hp_max} size={120} animate={false} />
          <div className="flex-1 space-y-3">
            <input className="pixel-input" value={name} onChange={e => setName(e.target.value)} />
            <PixelButton variant="primary" onClick={() => finish({ nickname: name, gender: profile.gender, appearance: profile.appearance })}>
              {t('common.save')}
            </PixelButton>
          </div>
        </div>
      </PixelCard>
    </div>
  );
}
