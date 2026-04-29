// Двусторонняя синхронизация profiles с Supabase.
// На вход: store-ы и supabase-клиент. На выход: pull/push функции и subscriber.
import { supabase, isSupabaseEnabled } from './supabase';
import { useGameStore } from '../store/useGameStore';
import type { Profile } from '../types/game';

// Поля, которые мы синхронизируем (всё, что есть и в store, и в таблице profiles).
const FIELDS = [
  'nickname','gender','appearance',
  'level','xp','hp','hp_max','gold',
  'energy','discipline','focus',
  'rest_until','skips_used_today','last_login','day_seed'
] as const;

function pickProfileFields(p: Profile): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of FIELDS) (out as any)[k] = (p as any)[k];
  return out;
}

// PULL: тянем строку profiles из Supabase и применяем к store.
export async function pullProfile(userId: string): Promise<void> {
  if (!isSupabaseEnabled || !supabase) return;
  const { data, error } = await supabase
    .from('profiles').select('*').eq('id', userId).single();
  if (error) {
    // если строки нет — упаст на следующем PUSH (там upsert)
    return;
  }
  const cur = useGameStore.getState().profile;
  if (!cur || cur.id !== userId) return;
  useGameStore.setState({
    profile: {
      ...cur,
      nickname: data.nickname ?? cur.nickname,
      gender: data.gender ?? cur.gender,
      appearance: data.appearance ?? cur.appearance,
      level: data.level ?? cur.level,
      xp: data.xp ?? cur.xp,
      hp: data.hp ?? cur.hp,
      hp_max: data.hp_max ?? cur.hp_max,
      gold: data.gold ?? cur.gold,
      energy: data.energy ?? cur.energy,
      discipline: data.discipline ?? cur.discipline,
      focus: data.focus ?? cur.focus,
      rest_until: data.rest_until ?? cur.rest_until,
      skips_used_today: data.skips_used_today ?? cur.skips_used_today,
      last_login: data.last_login ?? cur.last_login,
      day_seed: data.day_seed ?? cur.day_seed
    }
  });
}

// PUSH (debounced): пишем изменения профиля в Supabase, не чаще раза в 700ms.
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pendingProfile: Profile | null = null;

function flushPush() {
  if (!isSupabaseEnabled || !supabase) return;
  const p = pendingProfile; pendingProfile = null;
  if (!p) return;
  // upsert на случай, если строки ещё нет (например, для mock-id, не из Supabase Auth)
  void supabase.from('profiles').upsert(
    { id: p.id, ...pickProfileFields(p) },
    { onConflict: 'id' }
  ).then(({ error }) => {
    if (error) console.warn('[profileSync] push error', error.message);
  });
}

export function pushProfileDebounced(profile: Profile, delayMs = 700) {
  if (!isSupabaseEnabled || !supabase) return;
  pendingProfile = profile;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(flushPush, delayMs);
}

// Подписка: следит за изменениями profile в store и пушит их.
export function startProfilePushSubscription(): () => void {
  let prevSerialized = '';
  const unsub = useGameStore.subscribe((state) => {
    const p = state.profile;
    if (!p) return;
    const ser = JSON.stringify(pickProfileFields(p));
    if (ser !== prevSerialized) {
      prevSerialized = ser;
      pushProfileDebounced(p);
    }
  });
  return unsub;
}
