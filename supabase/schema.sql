-- =============================================================
-- PixelQuest schema: tables + RLS + seeds
-- Run this in Supabase SQL editor on a fresh project.
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  nickname        text not null default 'Hero',
  gender          text not null default 'male' check (gender in ('male','female','other')),
  appearance      jsonb not null default '{"skin":1,"hair":1,"outfit":1}'::jsonb,
  level           int  not null default 1,
  xp              int  not null default 0,
  hp              int  not null default 50,
  hp_max          int  not null default 50,
  gold            int  not null default 0,
  energy          int  not null default 100,
  discipline      int  not null default 0,
  focus           int  not null default 0,
  language        text not null default 'ru',
  last_login      date,
  rest_until      timestamptz,
  skips_used_today int not null default 0,
  day_seed        text,
  created_at      timestamptz not null default now()
);

-- ---------- categories ----------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,
  key         text not null,
  name_ru     text not null,
  name_en     text not null,
  color       text not null default '#00d9ff',
  icon        text not null default '*',
  is_default  boolean not null default false
);

-- ---------- habits ----------
create table if not exists public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  difficulty  text not null default 'normal' check (difficulty in ('easy','normal','hard')),
  frequency   text not null default 'daily'  check (frequency in ('daily','weekdays','weekends','3xweek','weekly')),
  xp_reward   int not null default 25,
  gold_reward int not null default 10,
  is_active   boolean not null default true,
  is_system   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------- habit logs ----------
create table if not exists public.habit_logs (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.profiles(id) on delete cascade,
  habit_id  uuid not null references public.habits(id) on delete cascade,
  date      date not null,
  status    text not null check (status in ('done','skipped','failed')),
  unique (user_id, habit_id, date)
);

-- ---------- daily picks ----------
create table if not exists public.daily_picks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  date          date not null,
  habit_ids     jsonb not null default '[]'::jsonb,
  statuses      jsonb not null default '{}'::jsonb,
  skipped_count int not null default 0,
  unique (user_id, date)
);

-- ---------- tasks (todo + goals) ----------
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text,
  deadline    timestamptz,
  difficulty  text not null default 'normal' check (difficulty in ('easy','normal','hard')),
  category_id uuid references public.categories(id) on delete set null,
  status      text not null default 'active' check (status in ('active','completed','failed')),
  type        text not null default 'todo'   check (type in ('todo','goal')),
  xp_reward   int not null default 25,
  gold_reward int not null default 10,
  penalty_hp  int not null default 4,
  created_at  timestamptz not null default now()
);

-- ---------- quests ----------
create table if not exists public.quests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  description   text,
  type          text not null check (type in ('habits_done','tasks_done','streak','custom')),
  target_count  int not null,
  progress      int not null default 0,
  reward_xp     int not null default 50,
  reward_gold   int not null default 25,
  reward_item   text,
  expires_at    timestamptz,
  status        text not null default 'active' check (status in ('active','completed','failed'))
);

-- ---------- achievements ----------
create table if not exists public.achievements (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  key         text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, key)
);

-- ---------- items dictionary (read-only for users) ----------
create table if not exists public.items (
  id        uuid primary key default gen_random_uuid(),
  key       text unique not null,
  name_ru   text not null,
  name_en   text not null,
  slot      text not null check (slot in (
              'weapon','armor','helmet','boots','amulet','book','gadget','tool',
              'potion','chest','cosmetic','background','booster')),
  rarity    text not null default 'common' check (rarity in ('common','rare','epic','legendary')),
  price_gold int not null default 0,
  effects    jsonb not null default '{}'::jsonb,
  icon       text not null default '?'
);

-- ---------- inventory ----------
create table if not exists public.inventory (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.profiles(id) on delete cascade,
  item_id   uuid not null references public.items(id),
  quantity  int  not null default 1,
  equipped  boolean not null default false
);

-- ---------- streaks ----------
create table if not exists public.streaks (
  user_id    uuid primary key references public.profiles(id) on delete cascade,
  current    int not null default 0,
  best       int not null default 0,
  last_date  date
);

-- ---------- weekly boss ----------
create table if not exists public.boss_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  week_start   date not null,
  boss_key     text not null default 'chaos_of_laziness',
  hp_max       int not null default 100,
  hp_left      int not null default 100,
  requirements jsonb not null default '{}'::jsonb,
  status       text not null default 'active' check (status in ('active','won','lost')),
  unique (user_id, week_start)
);

-- =============================================================
-- RLS
-- =============================================================
alter table public.profiles      enable row level security;
alter table public.categories    enable row level security;
alter table public.habits        enable row level security;
alter table public.habit_logs    enable row level security;
alter table public.daily_picks   enable row level security;
alter table public.tasks         enable row level security;
alter table public.quests        enable row level security;
alter table public.achievements  enable row level security;
alter table public.inventory     enable row level security;
alter table public.streaks       enable row level security;
alter table public.boss_progress enable row level security;
alter table public.items         enable row level security;

-- "owner-only" helper macro (inlined per-table for clarity)
create policy "profiles owner"      on public.profiles      using (id = auth.uid())       with check (id = auth.uid());
create policy "categories owner"    on public.categories    using (user_id = auth.uid() or is_default) with check (user_id = auth.uid());
create policy "habits owner"        on public.habits        using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "habit_logs owner"    on public.habit_logs    using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "daily_picks owner"   on public.daily_picks   using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tasks owner"         on public.tasks         using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "quests owner"        on public.quests        using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "achievements owner"  on public.achievements  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "inventory owner"     on public.inventory     using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "streaks owner"       on public.streaks       using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "boss owner"          on public.boss_progress using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "items read all"      on public.items         for select using (true);

-- =============================================================
-- Profile auto-create trigger
-- =============================================================
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nickname, language)
  values (new.id, coalesce(new.raw_user_meta_data->>'nickname','Hero'),
          coalesce(new.raw_user_meta_data->>'language','ru'));
  insert into public.streaks (user_id) values (new.id);
  return new;
end$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- Seeds: default categories (is_default=true, user_id null)
-- =============================================================
insert into public.categories (key, name_ru, name_en, color, icon, is_default) values
  ('health',    'Здоровье',   'Health',     '#3dff9a','+',true),
  ('sport',     'Спорт',      'Sport',      '#ff3ed1','^',true),
  ('study',     'Учёба',      'Study',      '#3d8bff','#',true),
  ('work',      'Работа',     'Work',       '#ffcc33','=',true),
  ('finance',   'Финансы',    'Finance',    '#ffae00','$',true),
  ('discipline','Дисциплина', 'Discipline', '#00d9ff','*',true),
  ('sleep',     'Сон',        'Sleep',      '#7a82a8','~',true),
  ('creative',  'Творчество', 'Creative',   '#b04dff','&',true),
  ('reading',   'Чтение',     'Reading',    '#ff4d6d','%',true),
  ('languages', 'Языки',      'Languages',  '#3dff9a','@',true)
on conflict do nothing;

-- =============================================================
-- Seeds: items dictionary
-- =============================================================
insert into public.items (key, name_ru, name_en, slot, rarity, price_gold, effects, icon) values
  ('potion_small',     'Малое зелье',          'Small potion',     'potion',  'common',  20,  '{"heal":30}', 'P'),
  ('potion_big',       'Большое зелье',        'Big potion',       'potion',  'rare',    60,  '{"heal":80}', 'P'),
  ('chest_common',     'Обычный сундук',       'Common chest',     'chest',   'common',  100, '{"loot":"common"}', 'C'),
  ('chest_rare',       'Редкий сундук',        'Rare chest',       'chest',   'rare',    280, '{"loot":"rare"}',   'C'),
  ('chest_epic',       'Эпический сундук',     'Epic chest',       'chest',   'epic',    700, '{"loot":"epic"}',   'C'),
  ('sword_iron',       'Железный меч',         'Iron sword',       'weapon',  'common',  150, '{"xp_mult":1.05}',  'S'),
  ('sword_silver',     'Серебряный меч',       'Silver sword',     'weapon',  'rare',    400, '{"xp_mult":1.10}',  'S'),
  ('sword_dragon',     'Меч дракона',          'Dragon sword',     'weapon',  'epic',    1200,'{"xp_mult":1.20}',  'S'),
  ('armor_leather',    'Кожаная броня',        'Leather armor',    'armor',   'common',  150, '{"damage_mult":0.90}','A'),
  ('armor_steel',      'Стальная броня',       'Steel armor',      'armor',   'rare',    420, '{"damage_mult":0.80}','A'),
  ('helmet_focus',     'Шлем фокуса',          'Focus helmet',     'helmet',  'rare',    320, '{"focus":5}',       'H'),
  ('boots_swift',      'Сапоги скорости',      'Swift boots',      'boots',   'common',  120, '{"extra_skips_per_week":1}','B'),
  ('amulet_luck',      'Амулет удачи',         'Lucky amulet',     'amulet',  'epic',    900, '{"rare_drop_bonus":0.05}','M'),
  ('book_wisdom',      'Книга мудрости',       'Book of wisdom',   'book',    'rare',    280, '{"category_bonus":{"study":1.15,"reading":1.15}}','K'),
  ('gadget_timer',     'Помодоро-таймер',      'Pomodoro timer',   'gadget',  'common',  90,  '{"category_bonus":{"work":1.10}}','T'),
  ('tool_journal',     'Дневник дисциплины',   'Discipline journal','tool',   'rare',    260, '{"category_bonus":{"discipline":1.20}}','J'),
  ('booster_xp_1d',    'XP-бустер 24ч',        'XP booster 24h',   'booster', 'rare',    250, '{"xp_mult":1.25,"duration_h":24}','+'),
  ('cosmetic_neon',    'Неоновая аура',        'Neon aura',        'cosmetic','epic',    500, '{}','o'),
  ('background_dawn',  'Фон: рассвет',         'Background: dawn', 'background','common',150, '{}','#'),
  ('background_night', 'Фон: ночной город',    'Background: night','background','rare',  300, '{}','#')
on conflict (key) do nothing;
