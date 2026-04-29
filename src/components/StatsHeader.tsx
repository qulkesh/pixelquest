import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import ProgressBar from './ui/ProgressBar';
import LanguageSwitcher from './ui/LanguageSwitcher';
import { xpForLevel } from '../lib/gameLogic';
import { useT } from '../hooks/useT';
import { useAuthStore } from '../store/useAuthStore';

export default function StatsHeader() {
  const profile = useGameStore(s => s.profile);
  const streak = useGameStore(s => s.streak);
  const t = useT();
  const signOut = useAuthStore(s => s.signOut);

  if (!profile) return null;
  const xpNeeded = xpForLevel(profile.level);

  return (
    <div className="pixel-frame mb-4 md:mb-6 p-3 md:px-4 md:py-3 space-y-2 md:space-y-0">
      {/* Mobile: верхняя строка — имя + золото + язык + выход */}
      <div className="flex items-center justify-between gap-2 md:hidden">
        <div className="flex items-center gap-2 min-w-0">
          <div className="font-pixel text-[10px] text-cyan neon-text">{t('common.appName')}</div>
          <div className="text-muted text-sm truncate">/ {profile.nickname}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-pixel text-[10px] text-magenta">{streak.current}d</span>
          <span className="font-pixel text-xs text-gold neon-text">{profile.gold}G</span>
          <LanguageSwitcher />
          <button className="text-[10px] text-muted hover:text-ink" onClick={() => signOut()}>↩</button>
        </div>
      </div>

      {/* Mobile: уровень + HP */}
      <div className="grid grid-cols-2 gap-2 md:hidden">
        <div className="pixel-frame-soft p-2">
          <div className="stat-label">{t('stats.level')}</div>
          <div className="font-pixel text-base text-gold neon-text leading-none">{profile.level}</div>
          <div className="mt-1"><ProgressBar value={profile.xp} max={xpNeeded} tone="cyan" height={6} showNumbers={false} /></div>
        </div>
        <div className="pixel-frame-soft p-2">
          <div className="stat-label">{t('stats.hp')}</div>
          <ProgressBar value={profile.hp} max={profile.hp_max} tone={profile.hp / profile.hp_max < 0.4 ? 'bad' : 'good'} height={8} />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
        <div className="col-span-3 flex items-center gap-3">
          <div className="font-pixel text-xs text-cyan neon-text">{t('common.appName')}</div>
          <div className="text-muted text-sm truncate">/ {profile.nickname}</div>
        </div>

        <div className="col-span-2">
          <div className="stat-label">{t('stats.level')}</div>
          <div className="stat-value text-gold neon-text">{profile.level}</div>
          <div className="mt-1"><ProgressBar value={profile.xp} max={xpNeeded} tone="cyan" height={8} showNumbers={false} /></div>
        </div>

        <div className="col-span-3">
          <ProgressBar value={profile.hp} max={profile.hp_max} label={t('stats.hp')}
            tone={profile.hp / profile.hp_max < 0.4 ? 'bad' : 'good'} />
        </div>
        <div className="col-span-2">
          <ProgressBar value={profile.xp} max={xpNeeded} label={t('stats.xp')} tone="cyan" />
        </div>

        <div className="col-span-1 text-right">
          <div className="stat-label">{t('stats.gold')}</div>
          <div className="stat-value text-gold neon-text">{profile.gold}</div>
        </div>

        <div className="col-span-1 flex flex-col items-end gap-2">
          <div className="font-pixel text-[10px] text-magenta">{streak.current}d</div>
          <LanguageSwitcher />
          <Link to="/settings" className="text-[10px] text-muted hover:text-ink">⚙</Link>
          <button className="text-[10px] text-muted hover:text-ink" onClick={() => signOut()}>↩</button>
        </div>
      </div>
    </div>
  );
}
