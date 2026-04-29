import type { Achievement, BossProgress, InventoryRow, Profile, Streak, Task } from '../types/game';

export interface AchState {
  profile: Profile | null;
  tasks: Task[];
  inventory: InventoryRow[];
  streak: Streak;
  boss: BossProgress | null;
}

export interface AchDef {
  key: string;
  title_ru: string;
  title_en: string;
  desc_ru: string;
  desc_en: string;
  condition: (s: AchState) => boolean;
}

export const ACH_CATALOG: AchDef[] = [
  {
    key: 'first_blood',
    title_ru: 'Первый шаг', title_en: 'First step',
    desc_ru: 'Получи первый XP', desc_en: 'Earn your first XP',
    condition: (s) => !!s.profile && (s.profile.xp + (s.profile.level - 1)) > 0
  },
  {
    key: 'lvl5',
    title_ru: 'Уровень 5', title_en: 'Reach level 5',
    desc_ru: 'Достигни уровня 5', desc_en: 'Reach level 5',
    condition: (s) => (s.profile?.level ?? 0) >= 5
  },
  {
    key: 'lvl10',
    title_ru: 'Уровень 10', title_en: 'Reach level 10',
    desc_ru: 'Достигни уровня 10', desc_en: 'Reach level 10',
    condition: (s) => (s.profile?.level ?? 0) >= 10
  },
  {
    key: 'gold_500',
    title_ru: '500 золотых', title_en: '500 gold',
    desc_ru: 'Накопи 500 золотых одновременно', desc_en: 'Save 500 gold at once',
    condition: (s) => (s.profile?.gold ?? 0) >= 500
  },
  {
    key: 'gold_2000',
    title_ru: '2000 золотых', title_en: '2000 gold',
    desc_ru: 'Накопи 2000 золотых', desc_en: 'Save 2000 gold',
    condition: (s) => (s.profile?.gold ?? 0) >= 2000
  },
  {
    key: 'streak_7',
    title_ru: 'Серия 7 дней', title_en: '7-day streak',
    desc_ru: 'Серия 7 дней подряд', desc_en: 'Maintain a 7-day streak',
    condition: (s) => s.streak.current >= 7 || s.streak.best >= 7
  },
  {
    key: 'streak_30',
    title_ru: 'Серия 30 дней', title_en: '30-day streak',
    desc_ru: 'Серия 30 дней подряд', desc_en: '30-day streak',
    condition: (s) => s.streak.current >= 30 || s.streak.best >= 30
  },
  {
    key: 'tasks_10',
    title_ru: '10 закрытых задач', title_en: '10 tasks done',
    desc_ru: 'Заверши 10 задач', desc_en: 'Complete 10 tasks',
    condition: (s) => s.tasks.filter(t => t.status === 'completed').length >= 10
  },
  {
    key: 'tasks_50',
    title_ru: '50 закрытых задач', title_en: '50 tasks done',
    desc_ru: 'Заверши 50 задач', desc_en: 'Complete 50 tasks',
    condition: (s) => s.tasks.filter(t => t.status === 'completed').length >= 50
  },
  {
    key: 'inv_10',
    title_ru: '10 разных предметов', title_en: '10 unique items',
    desc_ru: 'Собери 10 разных предметов', desc_en: 'Collect 10 unique items',
    condition: (s) => new Set(s.inventory.map(r => r.item_id)).size >= 10
  },
  {
    key: 'boss_killed',
    title_ru: 'Босс повержен', title_en: 'Boss defeated',
    desc_ru: 'Победи недельного босса', desc_en: 'Defeat the weekly boss',
    condition: (s) => s.boss?.status === 'won'
  }
];

// Возвращает массив ключей, которые сейчас выполнены, но ещё не отмечены как открытые.
export function findNewlyUnlocked(state: AchState, alreadyUnlocked: Achievement[]): string[] {
  const unlockedKeys = new Set(alreadyUnlocked.map(a => a.key));
  const out: string[] = [];
  for (const def of ACH_CATALOG) {
    if (unlockedKeys.has(def.key)) continue;
    if (def.condition(state)) out.push(def.key);
  }
  return out;
}
