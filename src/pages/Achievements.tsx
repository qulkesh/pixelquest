import PixelCard from '../components/ui/PixelCard';
import { useGameStore } from '../store/useGameStore';
import { useT } from '../hooks/useT';
import { useUiStore } from '../store/useUiStore';

const CATALOG: { key: string; title_ru: string; title_en: string; condition: (s: any) => boolean }[] = [
  { key: 'first_blood',  title_ru: 'Первый шаг',         title_en: 'First step',
    condition: (s) => s.profile && s.profile.xp + (s.profile.level - 1) > 0 },
  { key: 'lvl5',         title_ru: 'Уровень 5',          title_en: 'Reach level 5',
    condition: (s) => s.profile?.level >= 5 },
  { key: 'lvl10',        title_ru: 'Уровень 10',         title_en: 'Reach level 10',
    condition: (s) => s.profile?.level >= 10 },
  { key: 'gold_500',     title_ru: '500 золотых',        title_en: '500 gold',
    condition: (s) => (s.profile?.gold ?? 0) >= 500 },
  { key: 'streak_7',     title_ru: 'Серия 7 дней',       title_en: '7-day streak',
    condition: (s) => s.streak.current >= 7 || s.streak.best >= 7 },
  { key: 'tasks_10',     title_ru: '10 закрытых задач',  title_en: '10 tasks done',
    condition: (s) => s.tasks.filter((t: any) => t.status === 'completed').length >= 10 },
  { key: 'inv_10',       title_ru: '10 разных предметов',title_en: '10 unique items',
    condition: (s) => new Set(s.inventory.map((r: any) => r.item_id)).size >= 10 },
  { key: 'boss_killed',  title_ru: 'Босс повержен',      title_en: 'Boss defeated',
    condition: (s) => s.boss?.status === 'won' }
];

export default function Achievements() {
  const t = useT();
  const lang = useUiStore(s => s.lang);
  // подписка на изменения, чтобы прогресс ачивок обновлялся
  const _profile = useGameStore(s => s.profile);
  const _streak  = useGameStore(s => s.streak);
  const _tasks   = useGameStore(s => s.tasks);
  const _inv     = useGameStore(s => s.inventory);
  const _boss    = useGameStore(s => s.boss);
  const state = useGameStore.getState();

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-lg text-cyan neon-text">{t('achievements.title')}</h1>
      <div className="grid md:grid-cols-3 gap-3">
        {CATALOG.map(a => {
          const unlocked = a.condition(state);
          return (
            <PixelCard key={a.key} accent={unlocked ? 'gold' : 'cyan'}>
              <div className="font-pixel text-sm flex items-center gap-2">
                <span className={unlocked ? 'text-gold neon-text' : 'text-muted'}>★</span>
                <span className={unlocked ? '' : 'text-muted'}>
                  {lang === 'en' ? a.title_en : a.title_ru}
                </span>
              </div>
              {!unlocked && <div className="mt-2 text-muted text-sm">{t('achievements.locked')}</div>}
            </PixelCard>
          );
        })}
      </div>
    </div>
  );
}
