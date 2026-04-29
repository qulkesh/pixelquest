import { Link } from 'react-router-dom';
import PixelCard from '../components/ui/PixelCard';
import PixelButton from '../components/ui/PixelButton';
import ProgressBar from '../components/ui/ProgressBar';
import Avatar from '../components/Avatar';
import StatsPanel from '../components/StatsPanel';
import { useGameStore } from '../store/useGameStore';
import { useT } from '../hooks/useT';
import { useUiStore } from '../store/useUiStore';
import { restMinutesLeft, isResting, xpForLevel } from '../lib/gameLogic';
import { findItemById } from '../lib/seedData';
import type { Item } from '../types/game';

export default function Dashboard() {
  const t = useT();
  const lang = useUiStore(s => s.lang);
  const profile = useGameStore(s => s.profile);
  const habits = useGameStore(s => s.habits);
  const dailyPick = useGameStore(s => s.dailyPick);
  const tasks = useGameStore(s => s.tasks);
  const quests = useGameStore(s => s.quests);
  const streak = useGameStore(s => s.streak);
  const boss = useGameStore(s => s.boss);
  const completeDaily = useGameStore(s => s.completeDaily);
  const skipDaily = useGameStore(s => s.skipDaily);
  const failDaily = useGameStore(s => s.failDaily);

  const inventory = useGameStore(s => s.inventory);

  if (!profile || !dailyPick) return null;

  const resting = isResting(profile);
  const minutes = resting ? restMinutesLeft(profile) : 0;
  const skipsLeft = Math.max(0, 1 - profile.skips_used_today);

  // собрать экипировку для отрисовки на персонаже
  const equippedMap: Partial<Record<'weapon'|'armor'|'helmet'|'boots'|'amulet', Item>> = {};
  for (const row of inventory) {
    if (!row.equipped) continue;
    const it = findItemById(row.item_id); if (!it) continue;
    if (['weapon','armor','helmet','boots','amulet'].includes(it.slot)) {
      (equippedMap as any)[it.slot] = it;
    }
  }

  const todays = dailyPick.habit_ids
    .map(id => habits.find(h => h.id === id))
    .filter(Boolean) as typeof habits;

  const activeTasks = tasks.filter(t => t.status === 'active').slice(0, 5);
  const activeQuests = quests.filter(q => q.status === 'active');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Hero panel */}
      <PixelCard title={t('dashboard.welcome', { name: profile.nickname })} accent="cyan" className="md:col-span-1">
        <div className="flex flex-col items-center text-center gap-3">
          <div className={resting ? 'opacity-70' : ''}>
            <div className="md:hidden">
              <Avatar gender={profile.gender} appearance={profile.appearance}
                hpRatio={profile.hp / profile.hp_max} resting={resting} size={110}
                equipped={equippedMap} />
            </div>
            <div className="hidden md:block">
              <Avatar gender={profile.gender} appearance={profile.appearance}
                hpRatio={profile.hp / profile.hp_max} resting={resting} size={140}
                equipped={equippedMap} />
            </div>
          </div>
          {resting && <div className="text-bad font-pixel text-[10px]">{t('dashboard.resting', { min: minutes })}</div>}
          <div className="w-full">
            <ProgressBar value={profile.hp} max={profile.hp_max} label={t('stats.hp')}
              tone={profile.hp / profile.hp_max < 0.4 ? 'bad' : 'good'} />
          </div>
          <div className="w-full">
            <ProgressBar value={profile.xp} max={xpForLevel(profile.level)} label={t('stats.xp')} tone="cyan" />
          </div>
          <div className="grid grid-cols-3 gap-2 w-full">
            <Mini label={t('stats.gold')} value={profile.gold} tone="text-gold" />
            <Mini label={t('stats.energy')} value={profile.energy} tone="text-good" />
            <Mini label={t('stats.focus')} value={profile.focus} tone="text-cyan" />
          </div>
          <div className="w-full mt-2 pt-3 border-t-2 border-frame">
            <div className="stat-label mb-2">{lang === 'en' ? 'STATS' : 'ХАРАКТЕРИСТИКИ'}</div>
            <StatsPanel lang={lang} />
          </div>
        </div>
      </PixelCard>

      {/* Daily quests */}
      <PixelCard title={t('dashboard.newDayTitle')} accent="magenta" className="md:col-span-2">
        <div className="flex justify-between items-center mb-3">
          <div className="text-muted">{t('dashboard.newDaySub')}</div>
          <div className="font-pixel text-[10px] text-magenta">
            {t('dashboard.skipsLeft', { n: skipsLeft })}
          </div>
        </div>
        {todays.length === 0 && <div className="text-muted">{t('habits.noneToday')}</div>}
        <div className="space-y-3">
          {todays.map(h => {
            const status = dailyPick.statuses[h.id] ?? 'pending';
            const cat = useGameStore.getState().categories.find(c => c.id === h.category_id);
            return (
              <div key={h.id} className="pixel-frame-soft p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-pixel text-sm" style={{ color: cat?.color }}>{cat?.icon ?? '?'}</span>
                  <div className="min-w-0">
                    <div className="font-pixel text-sm truncate">
                      {lang === 'en' && h.title_en ? h.title_en : (lang === 'ru' && h.title_ru ? h.title_ru : h.title)}
                    </div>
                    <div className="text-muted text-sm">
                      {t('habits.rewardSet', { xp: h.xp_reward, gold: h.gold_reward })} · {t('frequency.' + h.frequency)} · {t('difficulty.' + h.difficulty)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {status === 'pending' ? (
                    <>
                      <PixelButton variant="good" onClick={() => completeDaily(h.id)}>{t('dashboard.complete')}</PixelButton>
                      <PixelButton onClick={() => skipDaily(h.id)} disabled={skipsLeft === 0}>{t('dashboard.skip')}</PixelButton>
                      <PixelButton variant="bad" onClick={() => failDaily(h.id)}>{t('dashboard.fail')}</PixelButton>
                    </>
                  ) : (
                    <span className="font-pixel text-[10px] uppercase text-muted">{status}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </PixelCard>

      {/* Streak */}
      <PixelCard title={t('stats.streak')} accent="gold">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-pixel text-3xl text-gold neon-text">{streak.current}</div>
            <div className="text-muted">{t('dashboard.bestStreak', { n: streak.best })}</div>
          </div>
          <div className="text-right text-muted text-sm leading-snug">
            3d → 🟢<br />7d → 🔵<br />14d → 🟣<br />30d → 🟡
          </div>
        </div>
      </PixelCard>

      {/* Active tasks */}
      <PixelCard title={t('dashboard.todos')} accent="cyan" className="md:col-span-1">
        {activeTasks.length === 0 && <div className="text-muted">{t('todos.none')}</div>}
        <ul className="space-y-2">
          {activeTasks.map(t => (
            <li key={t.id} className="pixel-frame-soft p-2 flex items-center justify-between">
              <span className="truncate">{t.title}</span>
              <span className="font-pixel text-[10px] text-muted">+{t.xp_reward}xp</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 text-right">
          <Link to="/todos" className="font-pixel text-[10px] text-cyan hover:underline">→ {t('nav.todos')}</Link>
        </div>
      </PixelCard>

      {/* Boss */}
      <PixelCard title={t('dashboard.bossWeek')} accent="bad">
        {boss && (
          <>
            <div className="font-pixel text-sm mb-2 text-bad neon-text">{t('boss.name')}</div>
            <ProgressBar value={boss.hp_left} max={boss.hp_max} label="HP" tone="bad" />
            <div className="mt-3 text-right">
              <Link to="/boss" className="font-pixel text-[10px] text-bad hover:underline">→ {t('nav.boss')}</Link>
            </div>
          </>
        )}
      </PixelCard>

      {/* Active quests */}
      <PixelCard title={t('dashboard.questsActive')} accent="epic">
        {activeQuests.length === 0 && <div className="text-muted">—</div>}
        <ul className="space-y-2">
          {activeQuests.slice(0, 3).map(q => (
            <li key={q.id}>
              <div className="flex justify-between">
                <span className="truncate">{q.title}</span>
                <span className="font-pixel text-[10px] text-muted">{q.progress}/{q.target_count}</span>
              </div>
              <ProgressBar value={q.progress} max={q.target_count} tone="magenta" height={6} showNumbers={false} />
            </li>
          ))}
        </ul>
      </PixelCard>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="pixel-frame-soft p-2 text-center">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${tone} neon-text`}>{value}</div>
    </div>
  );
}
