import PixelCard from '../components/ui/PixelCard';
import { useGameStore } from '../store/useGameStore';
import { useT } from '../hooks/useT';
import { useUiStore } from '../store/useUiStore';
import { ACH_CATALOG } from '../lib/achievements';

export default function Achievements() {
  const t = useT();
  const lang = useUiStore(s => s.lang);
  const achievements = useGameStore(s => s.achievements);
  const unlockedSet = new Set(achievements.map(a => a.key));

  const total = ACH_CATALOG.length;
  const done = achievements.filter(a => ACH_CATALOG.find(c => c.key === a.key)).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <h1 className="font-pixel text-lg text-cyan neon-text">{t('achievements.title')}</h1>
        <div className="font-pixel text-[10px] text-muted">{done} / {total}</div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {ACH_CATALOG.map(a => {
          const unlocked = unlockedSet.has(a.key);
          const unlockedAt = achievements.find(x => x.key === a.key)?.unlocked_at;
          const title = lang === 'en' ? a.title_en : a.title_ru;
          const desc = lang === 'en' ? a.desc_en : a.desc_ru;
          return (
            <PixelCard key={a.key} accent={unlocked ? 'gold' : 'cyan'}>
              <div className="font-pixel text-sm flex items-center gap-2">
                <span className={unlocked ? 'text-gold neon-text' : 'text-muted'}>★</span>
                <span className={unlocked ? '' : 'text-muted'}>{title}</span>
              </div>
              <div className={`mt-1 text-sm ${unlocked ? 'text-ink' : 'text-muted'}`}>{desc}</div>
              {unlocked && unlockedAt && (
                <div className="mt-2 font-pixel text-[9px] text-good">
                  {new Date(unlockedAt).toLocaleDateString()}
                </div>
              )}
              {!unlocked && (
                <div className="mt-2 font-pixel text-[9px] text-muted">{t('achievements.locked')}</div>
              )}
            </PixelCard>
          );
        })}
      </div>
    </div>
  );
}
