// Domain types for PixelQuest

export type Difficulty = 'easy' | 'normal' | 'hard';
export type Frequency = 'daily' | 'weekdays' | 'weekends' | '3xweek' | 'weekly';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ItemSlot =
  | 'weapon' | 'armor' | 'helmet' | 'boots' | 'amulet'
  | 'book'   | 'gadget' | 'tool'
  | 'potion' | 'chest'  | 'cosmetic' | 'background' | 'booster';

export type Gender = 'male' | 'female' | 'other';

export interface Appearance {
  skin: number;        // 1..8 — оттенок кожи
  hair: number;        // 1..8 — цвет волос
  outfit: number;      // 1..8 — цвет одежды по умолчанию
  hair_style?: number; // 1..6 — причёска (опц., default 1)
  eyes?: number;       // 1..6 — цвет глаз (опц., default 1)
}

export interface Profile {
  id: string;
  nickname: string;
  gender: Gender;
  appearance: Appearance;
  level: number;
  xp: number;
  hp: number;
  hp_max: number;
  gold: number;
  energy: number;
  discipline: number;
  focus: number;
  language: 'ru' | 'en';
  rest_until?: string | null;
  skips_used_today: number;
  last_login?: string | null;
  day_seed?: string | null;
}

export interface Category {
  id: string;
  user_id?: string | null;
  key: string;
  name_ru: string;
  name_en: string;
  color: string;
  icon: string;
  is_default: boolean;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  // локализованные названия для системных привычек (опц., у пользовательских отсутствуют)
  title_ru?: string;
  title_en?: string;
  description?: string;
  category_id?: string | null;
  difficulty: Difficulty;
  frequency: Frequency;
  xp_reward: number;
  gold_reward: number;
  is_active: boolean;
  is_system: boolean;
}

export type DailyStatus = 'pending' | 'done' | 'skipped' | 'failed';

export interface DailyPick {
  date: string;            // YYYY-MM-DD
  habit_ids: string[];
  statuses: Record<string, DailyStatus>;
  skipped_count: number;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  deadline?: string | null;
  difficulty: Difficulty;
  category_id?: string | null;
  status: 'active' | 'completed' | 'failed';
  type: 'todo' | 'goal';
  xp_reward: number;
  gold_reward: number;
  penalty_hp: number;
  created_at: string;
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: 'habits_done' | 'tasks_done' | 'streak' | 'custom';
  target_count: number;
  progress: number;
  reward_xp: number;
  reward_gold: number;
  reward_item?: string | null;
  expires_at?: string | null;
  status: 'active' | 'completed' | 'failed';
}

export interface Achievement {
  id: string;
  key: string;
  unlocked_at: string;
}

export interface Item {
  id: string;
  key: string;
  name_ru: string;
  name_en: string;
  slot: ItemSlot;
  rarity: Rarity;
  price_gold: number;
  effects: ItemEffects;
  icon: string;
}

export interface ItemEffects {
  xp_mult?: number;
  damage_mult?: number;
  extra_skips_per_week?: number;
  rare_drop_bonus?: number;
  category_bonus?: Record<string, number>;
  heal?: number;
  loot?: Rarity;
  duration_h?: number;
  focus?: number;
  // ---- Combat / RPG stats (бонусы от экипировки) ----
  str?: number;       // сила: +урон, бонус к спорту/работе
  int?: number;       // интеллект: +xp от учёбы/чтения
  agi?: number;       // ловкость: +шанс не получить штраф, +скип
  luc?: number;       // удача: +шанс редкого дропа
  vit?: number;       // живучесть: +HP_max
}

export interface InventoryRow {
  id: string;
  item_id: string;
  quantity: number;
  equipped: boolean;
}

export interface Streak {
  current: number;
  best: number;
  last_date?: string | null;
}

export interface BossProgress {
  id: string;
  week_start: string;
  boss_key: string;
  hp_max: number;
  hp_left: number;
  requirements: { habits: number; tasks: number };
  progress: { habits_done: number; tasks_done: number };
  status: 'active' | 'won' | 'lost';
}
