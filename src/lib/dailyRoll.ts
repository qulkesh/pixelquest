import type { Habit } from '../types/game';
import { hashString, isHabitDueToday, mulberry32, todayKey } from './gameLogic';

export function rollDailyHabits(userId: string, habits: Habit[], date = new Date(), count = 3): string[] {
  const key = `${userId}:${todayKey(date)}`;
  const rng = mulberry32(hashString(key));
  const due = habits.filter(h => h.is_active && isHabitDueToday(h.frequency, date));
  if (due.length === 0) return [];
  const arr = [...due];
  // Fisher-Yates with seeded rng
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count).map(h => h.id);
}
