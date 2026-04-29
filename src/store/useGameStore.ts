import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Achievement, Appearance, BossProgress, Category, DailyPick, Gender,
  Habit, InventoryRow, Item, ItemEffects, Profile, Quest, Streak, Task
} from '../types/game';
import {
  DIFF_DAMAGE, DIFF_GOLD, DIFF_XP,
  aggregateEffects, damageAfterReduction, levelFromXp, rewardWithMultipliers,
  rollRarity, shouldDrop, todayKey, weekStartKey, xpForLevel
} from '../lib/gameLogic';
import { rollDailyHabits } from '../lib/dailyRoll';
import { findItemById, makeSeedQuests, makeSystemHabits, seedCategories, seedItems } from '../lib/seedData';
import { useUiStore } from './useUiStore';
import { useAuthStore } from './useAuthStore';

// -----------------------------------------------
// State shape
// -----------------------------------------------
interface GameState {
  bootstrapped: boolean;
  profile: Profile | null;
  categories: Category[];
  habits: Habit[];
  dailyPick: DailyPick | null;
  tasks: Task[];
  quests: Quest[];
  achievements: Achievement[];
  inventory: InventoryRow[];
  items: Item[];
  streak: Streak;
  boss: BossProgress | null;

  // ---- bootstrap / profile ----
  bootstrapForUser: (userId: string, email?: string) => void;
  finishOnboarding: (input: { nickname: string; gender: Gender; appearance: Appearance }) => void;
  rollDailyIfNeeded: () => void;

  // ---- habit actions ----
  completeDaily: (habitId: string) => void;
  skipDaily: (habitId: string) => void;
  failDaily: (habitId: string) => void;
  addHabit: (h: Omit<Habit, 'id' | 'user_id' | 'is_system' | 'is_active'>) => void;
  updateHabit: (id: string, patch: Partial<Habit>) => void;
  removeHabit: (id: string) => void;

  // ---- task actions ----
  addTask: (t: Omit<Task, 'id' | 'user_id' | 'status' | 'created_at' | 'penalty_hp'>) => void;
  completeTask: (id: string) => void;
  failTask: (id: string) => void;
  restoreTask: (id: string) => void;
  removeTask: (id: string) => void;

  // ---- inventory / shop ----
  buyItem: (itemKey: string) => boolean;
  equipItem: (rowId: string) => void;
  unequipItem: (rowId: string) => void;
  usePotion: (rowId: string) => void;
  openChest: (rowId: string) => void;

  // ---- categories ----
  addCategory: (c: Omit<Category, 'id' | 'is_default' | 'user_id'>) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, patch: Partial<Category>) => void;

  // ---- quests ----
  claimQuest: (id: string) => void;

  // ---- helpers (selectors) ----
  effects: () => ItemEffects;
}

// -----------------------------------------------
// Helpers
// -----------------------------------------------
function rid(prefix: string) { return `${prefix}-${Math.random().toString(36).slice(2, 10)}`; }

function emptyDailyPick(date: string, habitIds: string[]): DailyPick {
  const statuses: Record<string, 'pending'> = {};
  habitIds.forEach(id => { statuses[id] = 'pending'; });
  return { date, habit_ids: habitIds, statuses, skipped_count: 0 };
}

function pushToast(text: string, tone: 'good' | 'bad' | 'gold' | 'info' = 'info') {
  useUiStore.getState().pushToast({ text, tone });
}

function makeFreshProfile(id: string): Profile {
  return {
    id, nickname: 'Hero', gender: 'male',
    appearance: { skin: 1, hair: 1, outfit: 1 },
    level: 1, xp: 0,
    hp: 50, hp_max: 50, gold: 0,
    energy: 100, discipline: 0, focus: 0,
    language: 'ru',
    rest_until: null, skips_used_today: 0,
    last_login: null, day_seed: null
  };
}

function startWeekBoss(): BossProgress {
  return {
    id: rid('boss'),
    week_start: weekStartKey(),
    boss_key: 'chaos_of_laziness',
    hp_max: 100, hp_left: 100,
    requirements: { habits: 14, tasks: 7 },
    status: 'active'
  };
}

// -----------------------------------------------
// Store
// -----------------------------------------------
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      bootstrapped: false,
      profile: null,
      categories: seedCategories,
      habits: [],
      dailyPick: null,
      tasks: [],
      quests: [],
      achievements: [],
      inventory: [],
      items: seedItems,
      streak: { current: 0, best: 0, last_date: null },
      boss: null,

      bootstrapForUser: (userId) => {
        const s = get();
        if (s.profile && s.profile.id === userId) {
          // already bootstrapped for this user — just refresh daily/boss
          get().rollDailyIfNeeded();
          return;
        }
        const profile = makeFreshProfile(userId);
        const habits = makeSystemHabits(userId);
        const quests = makeSeedQuests(userId);
        set({
          bootstrapped: true,
          profile,
          habits,
          quests,
          tasks: [],
          achievements: [],
          inventory: [
            { id: rid('inv'), item_id: 'i-potion_small', quantity: 2, equipped: false }
          ],
          dailyPick: null,
          boss: startWeekBoss(),
          streak: { current: 0, best: 0, last_date: null }
        });
        get().rollDailyIfNeeded();
      },

      finishOnboarding: ({ nickname, gender, appearance }) => {
        const p = get().profile; if (!p) return;
        set({ profile: { ...p, nickname, gender, appearance } });
      },

      rollDailyIfNeeded: () => {
        const { profile, dailyPick, habits, boss } = get();
        if (!profile) return;
        const t = todayKey();
        // reset weekly boss if a new week
        if (!boss || boss.week_start !== weekStartKey()) {
          set({ boss: startWeekBoss() });
        }
        if (dailyPick && dailyPick.date === t) return;
        const habitIds = rollDailyHabits(profile.id, habits);
        set({
          dailyPick: emptyDailyPick(t, habitIds),
          profile: { ...profile, skips_used_today: 0, last_login: t }
        });
      },

      // ============================================================
      // Daily habit actions
      // ============================================================
      completeDaily: (habitId) => {
        const { profile, dailyPick, habits, quests, streak, boss } = get();
        if (!profile || !dailyPick) return;
        if (dailyPick.statuses[habitId] && dailyPick.statuses[habitId] !== 'pending') return;
        const habit = habits.find(h => h.id === habitId); if (!habit) return;
        const eff = get().effects();
        const cat = get().categories.find(c => c.id === habit.category_id)?.key;
        const diffMult = 1;
        const { xp, gold } = rewardWithMultipliers(habit.xp_reward, habit.gold_reward, diffMult, eff, cat);
        const nextStatuses = { ...dailyPick.statuses, [habitId]: 'done' as const };

        // streak: первый "done" в день закрывает день
        const dayHasOtherDone = Object.values(dailyPick.statuses).some(s => s === 'done');
        const nextStreak: Streak = !dayHasOtherDone
          ? bumpStreak(streak, dailyPick.date)
          : streak;

        set({
          dailyPick: { ...dailyPick, statuses: nextStatuses },
          streak: nextStreak
        });

        applyXpGold(xp, gold);
        pushToast(`+${xp} XP`, 'info');
        if (gold) pushToast(`+${gold} G`, 'gold');

        // damage to boss
        if (boss && boss.status === 'active') {
          const dmg = 2 + Math.floor(Math.random() * 4);
          const hp_left = Math.max(0, boss.hp_left - dmg);
          set({ boss: { ...boss, hp_left, status: hp_left === 0 ? 'won' : boss.status } });
          if (hp_left === 0) onBossDefeated();
        }

        // quest progress
        progressQuests('habits_done', 1);

        // chance to drop
        if (!isResting(get().profile)) tryDrop(eff);
      },

      skipDaily: (habitId) => {
        const { profile, dailyPick } = get(); if (!profile || !dailyPick) return;
        if (dailyPick.statuses[habitId] !== 'pending') return;
        const eff = get().effects();
        const allowed = 1 + Math.floor((eff.extra_skips_per_week ?? 0) / 7);
        if (profile.skips_used_today >= allowed) {
          pushToast('Skip ограничен. Получишь штраф.', 'bad');
          get().failDaily(habitId);
          return;
        }
        set({
          dailyPick: { ...dailyPick, statuses: { ...dailyPick.statuses, [habitId]: 'skipped' }, skipped_count: dailyPick.skipped_count + 1 },
          profile: { ...profile, skips_used_today: profile.skips_used_today + 1 }
        });
      },

      failDaily: (habitId) => {
        const { profile, dailyPick, habits, boss } = get();
        if (!profile || !dailyPick) return;
        if (dailyPick.statuses[habitId] !== 'pending') return;
        const habit = habits.find(h => h.id === habitId); if (!habit) return;
        const eff = get().effects();
        const dmg = damageAfterReduction(DIFF_DAMAGE[habit.difficulty], eff);
        applyDamage(dmg);
        pushToast(`-${dmg} HP`, 'bad');
        set({
          dailyPick: { ...dailyPick, statuses: { ...dailyPick.statuses, [habitId]: 'failed' } }
        });
        // boss heals slightly when player fails habits
        if (boss && boss.status === 'active') {
          const heal = 3;
          const hp_left = Math.min(boss.hp_max, boss.hp_left + heal);
          set({ boss: { ...boss, hp_left } });
        }
      },

      // ============================================================
      // Habit CRUD
      // ============================================================
      addHabit: (h) => {
        const userId = get().profile?.id ?? '';
        set({ habits: [...get().habits, { ...h, id: rid('h'), user_id: userId, is_system: false, is_active: true }] });
      },
      updateHabit: (id, patch) => set({
        habits: get().habits.map(h => h.id === id ? { ...h, ...patch } : h)
      }),
      removeHabit: (id) => set({
        habits: get().habits.filter(h => h.id !== id)
      }),

      // ============================================================
      // Task CRUD
      // ============================================================
      addTask: (t) => {
        const userId = get().profile?.id ?? '';
        const penalty_hp = DIFF_DAMAGE[t.difficulty];
        set({
          tasks: [{
            ...t, id: rid('t'), user_id: userId, status: 'active',
            created_at: new Date().toISOString(), penalty_hp
          }, ...get().tasks]
        });
      },

      completeTask: (id) => {
        const task = get().tasks.find(t => t.id === id); if (!task || task.status !== 'active') return;
        const eff = get().effects();
        const cat = get().categories.find(c => c.id === task.category_id)?.key;
        const { xp, gold } = rewardWithMultipliers(task.xp_reward, task.gold_reward, 1, eff, cat);
        set({ tasks: get().tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t) });
        applyXpGold(xp, gold);
        pushToast(`+${xp} XP`, 'info');
        if (gold) pushToast(`+${gold} G`, 'gold');

        // boss damage
        const boss = get().boss;
        if (boss && boss.status === 'active') {
          const dmg = 4 + Math.floor(Math.random() * 4);
          const hp_left = Math.max(0, boss.hp_left - dmg);
          set({ boss: { ...boss, hp_left, status: hp_left === 0 ? 'won' : boss.status } });
          if (hp_left === 0) onBossDefeated();
        }
        progressQuests('tasks_done', 1);
        if (!isResting(get().profile)) tryDrop(eff);
      },

      failTask: (id) => {
        const task = get().tasks.find(t => t.id === id); if (!task || task.status !== 'active') return;
        const eff = get().effects();
        const dmg = damageAfterReduction(task.penalty_hp, eff);
        applyDamage(dmg);
        pushToast(`-${dmg} HP`, 'bad');
        set({ tasks: get().tasks.map(t => t.id === id ? { ...t, status: 'failed' } : t) });
      },

      restoreTask: (id) => set({
        tasks: get().tasks.map(t => t.id === id ? { ...t, status: 'active' } : t)
      }),

      removeTask: (id) => set({ tasks: get().tasks.filter(t => t.id !== id) }),

      // ============================================================
      // Shop / inventory
      // ============================================================
      buyItem: (itemKey) => {
        const item = get().items.find(i => i.key === itemKey); if (!item) return false;
        const profile = get().profile; if (!profile) return false;
        if (profile.gold < item.price_gold) {
          pushToast('Не хватает золота', 'bad');
          return false;
        }
        addToInventory(item.id);
        set({ profile: { ...profile, gold: profile.gold - item.price_gold } });
        pushToast('Куплено!', 'good');
        return true;
      },

      equipItem: (rowId) => {
        const row = get().inventory.find(r => r.id === rowId); if (!row) return;
        const item = findItemById(row.item_id); if (!item) return;
        // unequip same slot
        const inv = get().inventory.map(r => {
          const ri = findItemById(r.item_id);
          if (ri && ri.slot === item.slot && r.id !== rowId) return { ...r, equipped: false };
          if (r.id === rowId) return { ...r, equipped: true };
          return r;
        });
        set({ inventory: inv });
      },

      unequipItem: (rowId) => set({
        inventory: get().inventory.map(r => r.id === rowId ? { ...r, equipped: false } : r)
      }),

      usePotion: (rowId) => {
        const row = get().inventory.find(r => r.id === rowId); if (!row) return;
        const item = findItemById(row.item_id); if (!item || item.slot !== 'potion') return;
        const profile = get().profile; if (!profile) return;
        const heal = item.effects.heal ?? 30;
        const hp = Math.min(profile.hp_max, profile.hp + heal);
        const rest_until = profile.rest_until && hp > 0 ? null : profile.rest_until;
        set({ profile: { ...profile, hp, rest_until } });
        decrementInventory(rowId);
        pushToast(`+${heal} HP`, 'good');
      },

      openChest: (rowId) => {
        const row = get().inventory.find(r => r.id === rowId); if (!row) return;
        const item = findItemById(row.item_id); if (!item || item.slot !== 'chest') return;
        const eff = get().effects();
        const desiredRarity = item.effects.loot ?? 'common';
        const candidates = get().items.filter(i =>
          ['weapon','armor','helmet','boots','amulet','book','gadget','tool','potion'].includes(i.slot) &&
          rarityWeight(i.rarity, desiredRarity) > 0
        );
        if (candidates.length === 0) return;
        const totalW = candidates.reduce((s, c) => s + rarityWeight(c.rarity, desiredRarity), 0);
        let r = Math.random() * totalW;
        let chosen = candidates[0];
        for (const c of candidates) { r -= rarityWeight(c.rarity, desiredRarity); if (r <= 0) { chosen = c; break; } }
        addToInventory(chosen.id);
        decrementInventory(rowId);
        const lang = useUiStore.getState().lang;
        pushToast(`Из сундука: ${lang === 'ru' ? chosen.name_ru : chosen.name_en}`, 'good');
        // small extra rare drop chance
        if (Math.random() < 0.1 + (eff.rare_drop_bonus ?? 0)) tryDrop(eff);
      },

      // ============================================================
      // Categories
      // ============================================================
      addCategory: (c) => set({
        categories: [...get().categories, { ...c, id: rid('cat'), is_default: false, user_id: get().profile?.id ?? null }]
      }),
      removeCategory: (id) => set({
        categories: get().categories.filter(c => c.id !== id || c.is_default)
      }),
      updateCategory: (id, patch) => set({
        categories: get().categories.map(c => c.id === id ? { ...c, ...patch } : c)
      }),

      // ============================================================
      // Quests
      // ============================================================
      claimQuest: (id) => {
        const q = get().quests.find(x => x.id === id); if (!q || q.progress < q.target_count || q.status === 'completed') return;
        applyXpGold(q.reward_xp, q.reward_gold);
        if (q.reward_item) {
          const item = get().items.find(i => i.key === q.reward_item);
          if (item) addToInventory(item.id);
        }
        set({ quests: get().quests.map(x => x.id === id ? { ...x, status: 'completed' } : x) });
        pushToast('Награда получена!', 'good');
      },

      // ============================================================
      // Selectors
      // ============================================================
      effects: () => {
        const equipped = get().inventory.filter(r => r.equipped)
          .map(r => findItemById(r.item_id)?.effects ?? {});
        return aggregateEffects(equipped);
      }
    }),
    {
      name: 'pq-game',
      // отдельный сейв на каждого пользователя — переключаемся при логине
      partialize: (s) => s
    }
  )
);

// =====================================================================
// Internal helpers — operate on the store via getState
// =====================================================================
function applyXpGold(xpDelta: number, goldDelta: number) {
  const s = useGameStore.getState();
  const p = s.profile; if (!p) return;
  if (isResting(p)) {
    // во время отдыха игрок может отмечать задачи, но xp/gold идут в "копилку" реальной лояльности
    // здесь — просто зачисляем половину, чтобы не блокировать прогресс
    xpDelta = Math.round(xpDelta / 2);
    goldDelta = Math.round(goldDelta / 2);
  }
  let xp = p.xp + xpDelta;
  let level = p.level;
  let hp_max = p.hp_max;
  // level up loop
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    hp_max += 5;
    useUiStore.getState().pushToast(`LVL UP! ${level}`, 'good');
    useUiStore.getState().flashLevelUp();
    // give a chest
    const chestKey = level % 5 === 0 ? 'i-chest_rare' : 'i-chest_common';
    addToInventory(chestKey);
  }
  // visual healing on first activity of the day (clear "bruises")
  let hp = p.hp;
  if (xpDelta > 0 && hp < hp_max && hp > 0) {
    hp = Math.min(hp_max, hp + 1);
  }
  useGameStore.setState({
    profile: { ...p, xp, level, hp_max, hp, gold: Math.max(0, p.gold + goldDelta) }
  });
}

function applyDamage(amount: number) {
  const s = useGameStore.getState();
  const p = s.profile; if (!p) return;
  if (isResting(p)) return; // нет дополнительных штрафов во время отдыха
  let hp = Math.max(0, p.hp - amount);
  let rest_until = p.rest_until;
  if (hp === 0) {
    rest_until = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    hp = Math.floor(p.hp_max / 4); // герой просыпается с 25% HP, пока остальное восстанавливается
    useUiStore.getState().pushToast('Герой ушёл на отдых на 1 час', 'info');
  }
  useGameStore.setState({ profile: { ...p, hp, rest_until } });
}

function isResting(p: Profile | null): boolean {
  if (!p?.rest_until) return false;
  return new Date(p.rest_until).getTime() > Date.now();
}

function bumpStreak(streak: Streak, dateKey: string): Streak {
  const yest = new Date(dateKey); yest.setDate(yest.getDate() - 1);
  const yKey = todayKey(yest);
  const next = streak.last_date === yKey ? streak.current + 1 : 1;
  const out: Streak = {
    current: next,
    best: Math.max(next, streak.best),
    last_date: dateKey
  };
  // Вознаграждения за мильстоуны
  if ([3, 7, 14, 30].includes(next)) {
    const map: Record<number, string> = { 3: 'i-chest_common', 7: 'i-chest_rare', 14: 'i-chest_epic', 30: 'i-sword_dragon' };
    const itemId = map[next];
    addToInventory(itemId);
    useUiStore.getState().pushToast(`Streak ${next}: получен предмет!`, 'good');
  }
  return out;
}

function progressQuests(type: 'habits_done' | 'tasks_done', delta: number) {
  const s = useGameStore.getState();
  useGameStore.setState({
    quests: s.quests.map(q => q.type === type && q.status === 'active'
      ? { ...q, progress: Math.min(q.target_count, q.progress + delta) }
      : q
    )
  });
}

function tryDrop(eff: ItemEffects) {
  if (!shouldDrop(eff)) return;
  const rarity = rollRarity(eff);
  const candidates = useGameStore.getState().items.filter(i =>
    ['weapon','armor','helmet','boots','amulet','book','gadget','tool','potion'].includes(i.slot) &&
    i.rarity === rarity
  );
  if (candidates.length === 0) return;
  const drop = candidates[Math.floor(Math.random() * candidates.length)];
  addToInventory(drop.id);
  const lang = useUiStore.getState().lang;
  useUiStore.getState().pushToast(`Дроп: ${lang === 'ru' ? drop.name_ru : drop.name_en}`, 'good');
}

function addToInventory(itemId: string) {
  const s = useGameStore.getState();
  const stackable = ['potion', 'chest', 'booster'];
  const item = findItemById(itemId);
  const slot = item?.slot;
  if (slot && stackable.includes(slot)) {
    const existing = s.inventory.find(r => r.item_id === itemId);
    if (existing) {
      useGameStore.setState({
        inventory: s.inventory.map(r => r.id === existing.id ? { ...r, quantity: r.quantity + 1 } : r)
      });
      return;
    }
  }
  useGameStore.setState({
    inventory: [...s.inventory, { id: rid('inv'), item_id: itemId, quantity: 1, equipped: false }]
  });
}

function decrementInventory(rowId: string) {
  const s = useGameStore.getState();
  const next = s.inventory
    .map(r => r.id === rowId ? { ...r, quantity: r.quantity - 1 } : r)
    .filter(r => r.quantity > 0);
  useGameStore.setState({ inventory: next });
}

function rarityWeight(have: string, target: string): number {
  // closer to target rarity = higher weight
  const order = ['common', 'rare', 'epic', 'legendary'];
  const a = order.indexOf(have); const b = order.indexOf(target);
  if (a < 0 || b < 0) return 0;
  if (a === b) return 70;
  if (a + 1 === b || a - 1 === b) return 20;
  return 5;
}

function onBossDefeated() {
  useUiStore.getState().pushToast('Босс повержен! 🎉', 'good');
  // big reward: chest + gold
  addToInventory('i-chest_epic');
  applyXpGold(300, 200);
}

// On user switch, the auth store fires -> re-bootstrap
useAuthStore.subscribe?.((state) => {
  const u = (state as any).user;
  if (u) useGameStore.getState().bootstrapForUser(u.id, u.email);
});
