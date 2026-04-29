import type { Difficulty, ItemEffects, Profile, Rarity } from '../types/game';

export const DIFF_XP: Record<Difficulty, number> = { easy: 10, normal: 25, hard: 50 };
export const DIFF_GOLD: Record<Difficulty, number> = { easy: 5, normal: 10, hard: 15 };
export const DIFF_DAMAGE: Record<Difficulty, number> = { easy: 2, normal: 4, hard: 7 };

export function xpForLevel(level: number): number {
  return 80 * level + 20 * level * level;
}

export function totalXpToReach(level: number): number {
  let sum = 0;
  for (let i = 1; i < level; i++) sum += xpForLevel(i);
  return sum;
}

export function levelFromXp(xp: number): { level: number; intoLevel: number; needed: number } {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level += 1;
  }
  return { level, intoLevel: remaining, needed: xpForLevel(level) };
}

export function aggregateEffects(equipped: ItemEffects[]): ItemEffects {
  const out: ItemEffects = {
    xp_mult: 1,
    damage_mult: 1,
    extra_skips_per_week: 0,
    rare_drop_bonus: 0,
    category_bonus: {},
    str: 0, int: 0, agi: 0, luc: 0, vit: 0, focus: 0
  };
  for (const e of equipped) {
    if (e.xp_mult)             out.xp_mult = (out.xp_mult ?? 1) * e.xp_mult;
    if (e.damage_mult)         out.damage_mult = (out.damage_mult ?? 1) * e.damage_mult;
    if (e.extra_skips_per_week)out.extra_skips_per_week = (out.extra_skips_per_week ?? 0) + e.extra_skips_per_week;
    if (e.rare_drop_bonus)     out.rare_drop_bonus = (out.rare_drop_bonus ?? 0) + e.rare_drop_bonus;
    if (e.str) out.str = (out.str ?? 0) + e.str;
    if (e.int) out.int = (out.int ?? 0) + e.int;
    if (e.agi) out.agi = (out.agi ?? 0) + e.agi;
    if (e.luc) out.luc = (out.luc ?? 0) + e.luc;
    if (e.vit) out.vit = (out.vit ?? 0) + e.vit;
    if (e.focus) out.focus = (out.focus ?? 0) + e.focus;
    if (e.category_bonus) {
      for (const [k, v] of Object.entries(e.category_bonus)) {
        out.category_bonus![k] = (out.category_bonus![k] ?? 1) * v;
      }
    }
  }
  return out;
}

export function rewardWithMultipliers(
  baseXp: number, baseGold: number,
  diffMult: number, eff: ItemEffects, categoryKey?: string
): { xp: number; gold: number } {
  const catMult = categoryKey && eff.category_bonus?.[categoryKey] ? eff.category_bonus[categoryKey] : 1;
  const xpMult = (eff.xp_mult ?? 1) * catMult * diffMult;
  return {
    xp: Math.round(baseXp * xpMult),
    gold: Math.round(baseGold * (1 + (catMult - 1) * 0.5))
  };
}

export function damageAfterReduction(base: number, eff: ItemEffects): number {
  return Math.max(0, Math.round(base * (eff.damage_mult ?? 1)));
}

export function isResting(profile: Profile, now = new Date()): boolean {
  if (!profile.rest_until) return false;
  return new Date(profile.rest_until).getTime() > now.getTime();
}

export function restMinutesLeft(profile: Profile, now = new Date()): number {
  if (!profile.rest_until) return 0;
  const ms = new Date(profile.rest_until).getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 60000));
}

// ---------- Date helpers ----------
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function weekStartKey(date = new Date()): string {
  const d = new Date(date);
  const dow = (d.getDay() + 6) % 7;       // Mon=0
  d.setDate(d.getDate() - dow);
  d.setHours(0, 0, 0, 0);
  return todayKey(d);
}

export function isHabitDueToday(freq: string, date = new Date()): boolean {
  const dow = date.getDay(); // Sun=0
  switch (freq) {
    case 'daily':    return true;
    case 'weekdays': return dow >= 1 && dow <= 5;
    case 'weekends': return dow === 0 || dow === 6;
    case '3xweek':   return [1, 3, 5].includes(dow);
    case 'weekly':   return dow === 1;
    default:         return true;
  }
}

// ---------- Drop roll ----------
const RARITY_WEIGHTS: Record<Rarity, number> = { common: 70, rare: 22, epic: 7, legendary: 1 };

export function rollRarity(eff: ItemEffects, rng: () => number = Math.random): Rarity {
  const bonus = eff.rare_drop_bonus ?? 0;
  const w: Record<Rarity, number> = {
    common:    Math.max(0, RARITY_WEIGHTS.common - bonus * 100),
    rare:      RARITY_WEIGHTS.rare + bonus * 60,
    epic:      RARITY_WEIGHTS.epic + bonus * 30,
    legendary: RARITY_WEIGHTS.legendary + bonus * 10
  };
  const total = w.common + w.rare + w.epic + w.legendary;
  let r = rng() * total;
  for (const k of ['common','rare','epic','legendary'] as Rarity[]) {
    r -= w[k]; if (r <= 0) return k;
  }
  return 'common';
}

export function shouldDrop(eff: ItemEffects, rng: () => number = Math.random): boolean {
  const base = 0.18;
  return rng() < base + (eff.rare_drop_bonus ?? 0) * 0.5;
}

// Seeded RNG for reproducible daily rolls
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i); h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
