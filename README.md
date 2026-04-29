# PixelQuest

RPG-дашборд для жизни. Привычки, задачи, квесты, инвентарь, магазин, недельный босс — всё в стиле уютной пиксельной RPG.

## Стек

React 18 + TypeScript + Vite + Tailwind CSS + Zustand + React Router + Supabase.

## Запуск

```bash
npm install
cp .env.example .env.local        # опционально, см. ниже
npm run dev
```

Откройте http://localhost:5173.

> Без переменных окружения проект запускается в **mock-режиме**: всё хранится в localStorage. Можно сразу играть, регистрация принимает любой email + пароль ≥ 4 символа.

## Подключение Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. В **SQL editor** выполните содержимое `supabase/schema.sql` (создаёт таблицы, RLS-политики, сидит словарь предметов и категорий).
3. Зайдите в **Project settings → API** и скопируйте `Project URL` и `anon public key`.
4. Создайте `.env.local`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

5. Перезапустите `npm run dev`. Приложение само поймёт, что Supabase доступен, и переключится на реальный backend.

В **Authentication → Providers** включите **Email** (можно отключить confirm email на время разработки: Auth → Settings → "Confirm email" off).

## Деплой на Netlify

Вариант А — через UI:

1. Залейте репозиторий на GitHub/GitLab.
2. На Netlify: **Add new site → Import from Git**.
3. Build command: `npm run build`, publish directory: `dist` (всё уже задано в `netlify.toml`).
4. В **Site settings → Environment variables** добавьте `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`.
5. Deploy.

Вариант B — через CLI:

```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

`netlify.toml` уже содержит SPA-редирект, чтобы React Router работал на прямых ссылках.

## Структура проекта

```
src/
  components/        UI и layout
    ui/              PixelButton, PixelCard, ProgressBar, Modal, Toast, ...
  hooks/             useDailyReset
  lib/               supabase, i18n, gameLogic, dropTable, dailyRoll, seedData
  locales/           ru.ts, en.ts
  pages/             Login, CharacterCreate, Dashboard, Habits, Todos,
                     Quests, Achievements, Inventory, Shop, Boss
  store/             useAuthStore, useGameStore, useTasksStore, useUiStore
  types/             game.ts
supabase/
  schema.sql         таблицы + RLS + сидинг
```

## Game design — кратко

- XP за `easy/normal/hard` = 10/25/50, gold = 5/10/15.
- Уровень: `xpForLevel(n) = 80n + 20n²`. Level up → +5 HP_max и сундук.
- Урон за провал: 2/4/7 HP. 1 skip в день без штрафа (+бонусы экипировки).
- HP=0 → герой отдыхает 1 час: задачи можно отмечать, штрафы и дроп заморожены.
- 3 ежедневные привычки — рандом из системных + пользовательских (по частоте).
- Streak за день, в котором выполнена хотя бы одна daily-привычка. Награды: 3/7/14/30.
- Weekly boss `Chaos of Laziness`, 100 HP. Выполнение задач бьёт босса, провал лечит.
- Дроп после `done` task: 18% базовый + бонусы экипировки.
- Зелье восстанавливает 30 HP и убирает «синяки».

## Расширение

- Новые предметы: добавить запись в `supabase/schema.sql` (таблица `items`) или в `src/lib/seedData.ts` (mock).
- Новые квесты: `src/lib/seedData.ts → seedQuests`.
- Новые анимации/рамки: `tailwind.config.js`, классы `pixel-frame`, `pixel-btn` в `src/index.css`.
- Локализация: `src/locales/ru.ts` и `src/locales/en.ts` (плоские ключи).

## Лицензия

MIT.
