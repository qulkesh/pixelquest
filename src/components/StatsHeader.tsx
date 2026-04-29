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
    <div className="pixel-frame mb-6 px-4 py-3 grid grid-cols-12 gap-4 items-center">
      <div className="col-span-3 flex items-center gap-3">
        <div className="font-pixel text-xs text-cyan neon-text">{t('common.appName')}</div>
        <div className="text-muted text-sm">/ {profile.nickname}</div>
      </div>

      <div className="col-span-2">
        <div className="stat-label">{t('stats.level')}</div>
        <div className="stat-value text-gold neon-text">{profile.level}</div>
        <div className="mt-1"><ProgressBar value={profile.xp} max={xpNeeded} tone="cyan" height={8} showNumbers={false} /></div>
      </div>

      <div className="col-span-3"><ProgressBar value={profile.hp} max={profile.hp_max} label={t('stats.hp')} tone={profile.hp / profile.hp_max < 0.4 ? 'bad' : 'good'} /></div>
      <div className="col-span-2"><ProgressBar value={profile.xp} max={xpNeeded} label={t('stats.xp')} tone="cyan" /></div>

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
  );
}
