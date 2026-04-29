import type { Category, Habit, Item, Quest } from '../types/game';

// ---------- Default categories (used in mock mode and as references) ----------
export const seedCategories: Category[] = [
  { id: 'cat-health',     key:'health',     name_ru:'Здоровье',    name_en:'Health',     color:'#3dff9a', icon:'+', is_default:true },
  { id: 'cat-sport',      key:'sport',      name_ru:'Спорт',       name_en:'Sport',      color:'#ff3ed1', icon:'^', is_default:true },
  { id: 'cat-study',      key:'study',      name_ru:'Учёба',       name_en:'Study',      color:'#3d8bff', icon:'#', is_default:true },
  { id: 'cat-work',       key:'work',       name_ru:'Работа',      name_en:'Work',       color:'#ffcc33', icon:'=', is_default:true },
  { id: 'cat-finance',    key:'finance',    name_ru:'Финансы',     name_en:'Finance',    color:'#ffae00', icon:'$', is_default:true },
  { id: 'cat-discipline', key:'discipline', name_ru:'Дисциплина',  name_en:'Discipline', color:'#00d9ff', icon:'*', is_default:true },
  { id: 'cat-sleep',      key:'sleep',      name_ru:'Сон',         name_en:'Sleep',      color:'#7a82a8', icon:'~', is_default:true },
  { id: 'cat-creative',   key:'creative',   name_ru:'Творчество',  name_en:'Creative',   color:'#b04dff', icon:'&', is_default:true },
  { id: 'cat-reading',    key:'reading',    name_ru:'Чтение',      name_en:'Reading',    color:'#ff4d6d', icon:'%', is_default:true },
  { id: 'cat-languages',  key:'languages',  name_ru:'Языки',       name_en:'Languages',  color:'#3dff9a', icon:'@', is_default:true }
];

export function makeSystemHabits(userId: string): Habit[] {
  const mk = (
    keyId: string,
    title_ru: string, title_en: string,
    cat: string, diff: 'easy' | 'normal' | 'hard',
    freq: 'daily' | 'weekdays' | 'weekends' | '3xweek' | 'weekly'
  ): Habit => ({
    id: `sys-${keyId}`,
    user_id: userId,
    title: title_ru,
    title_ru, title_en,
    category_id: cat,
    difficulty: diff,
    frequency: freq,
    xp_reward: { easy: 10, normal: 25, hard: 50 }[diff],
    gold_reward: { easy: 5, normal: 10, hard: 15 }[diff],
    is_active: true, is_system: true
  });

  return [
    mk('water-2l',     'Выпить 2 литра воды',     'Drink 2L of water',   'cat-health',     'easy',   'daily'),
    mk('morning-ex',   'Сделать зарядку',         'Morning exercise',    'cat-sport',      'easy',   'daily'),
    mk('workout-45',   'Тренировка 45 мин',       'Workout 45 min',      'cat-sport',      'hard',   '3xweek'),
    mk('read-20',      'Прочитать 20 страниц',    'Read 20 pages',       'cat-reading',    'normal', 'daily'),
    mk('lang-15',      'Изучать язык 15 мин',     'Study a language 15 min','cat-languages','easy',  'daily'),
    mk('deep-work-90', 'Глубокая работа 90 мин',  'Deep work 90 min',    'cat-work',       'hard',   'weekdays'),
    mk('sleep-2330',   'Лечь спать до 23:30',     'Sleep before 23:30',  'cat-sleep',      'normal', 'daily'),
    mk('expenses-3',   'Записать 3 расхода',      'Log 3 expenses',      'cat-finance',    'easy',   'daily'),
    mk('meditate-5',   '5 минут медитации',       '5 min meditation',    'cat-discipline', 'easy',   'daily'),
    mk('creative-30',  'Творчество 30 мин',       'Creative work 30 min','cat-creative',   'normal', '3xweek'),
    mk('walk-30',      'Прогулка 30 мин',         'Walk 30 min',         'cat-health',     'easy',   'daily'),
    mk('plan-tomorrow','План на завтра',          'Plan tomorrow',       'cat-discipline', 'easy',   'daily')
  ];
}

export function makeSeedQuests(userId: string): Quest[] {
  return [
    {
      id: 'quest-streak-7',
      user_id: userId,
      title: '7 дней без пропуска привычек',
      description: 'Серия 7 дней подряд',
      type: 'streak',
      target_count: 7, progress: 0,
      reward_xp: 200, reward_gold: 120, reward_item: 'chest_rare',
      status: 'active'
    },
    {
      id: 'quest-tasks-10',
      user_id: userId,
      title: 'Закрыть 10 задач',
      description: '10 завершённых to-do задач',
      type: 'tasks_done',
      target_count: 10, progress: 0,
      reward_xp: 150, reward_gold: 90, reward_item: 'chest_common',
      status: 'active'
    },
    {
      id: 'quest-habits-20',
      user_id: userId,
      title: 'Выполнить 20 привычек',
      description: '20 успешных отметок привычек',
      type: 'habits_done',
      target_count: 20, progress: 0,
      reward_xp: 250, reward_gold: 150, reward_item: 'sword_iron',
      status: 'active'
    }
  ];
}

// ---------- Mirror of items dictionary for mock-mode shop ----------
export const seedItems: Item[] = [
  { id:'i-potion_small',     key:'potion_small',     name_ru:'Малое зелье',         name_en:'Small potion',     slot:'potion',     rarity:'common',    price_gold:20,   effects:{ heal:30 }, icon:'P' },
  { id:'i-potion_big',       key:'potion_big',       name_ru:'Большое зелье',       name_en:'Big potion',       slot:'potion',     rarity:'rare',      price_gold:60,   effects:{ heal:80 }, icon:'P' },
  { id:'i-chest_common',     key:'chest_common',     name_ru:'Обычный сундук',      name_en:'Common chest',     slot:'chest',      rarity:'common',    price_gold:100,  effects:{ loot:'common' }, icon:'C' },
  { id:'i-chest_rare',       key:'chest_rare',       name_ru:'Редкий сундук',       name_en:'Rare chest',       slot:'chest',      rarity:'rare',      price_gold:280,  effects:{ loot:'rare' }, icon:'C' },
  { id:'i-chest_epic',       key:'chest_epic',       name_ru:'Эпический сундук',    name_en:'Epic chest',       slot:'chest',      rarity:'epic',      price_gold:700,  effects:{ loot:'epic' }, icon:'C' },
  { id:'i-sword_iron',       key:'sword_iron',       name_ru:'Железный меч',        name_en:'Iron sword',       slot:'weapon',     rarity:'common',    price_gold:150,  effects:{ xp_mult:1.05, str:3 }, icon:'S' },
  { id:'i-sword_silver',     key:'sword_silver',     name_ru:'Серебряный меч',      name_en:'Silver sword',     slot:'weapon',     rarity:'rare',      price_gold:400,  effects:{ xp_mult:1.10, str:6, agi:2 }, icon:'S' },
  { id:'i-sword_dragon',     key:'sword_dragon',     name_ru:'Меч дракона',         name_en:'Dragon sword',     slot:'weapon',     rarity:'epic',      price_gold:1200, effects:{ xp_mult:1.20, str:12, luc:3 }, icon:'S' },
  { id:'i-armor_leather',    key:'armor_leather',    name_ru:'Кожаная броня',       name_en:'Leather armor',    slot:'armor',      rarity:'common',    price_gold:150,  effects:{ damage_mult:0.90, vit:5, agi:1 }, icon:'A' },
  { id:'i-armor_steel',      key:'armor_steel',      name_ru:'Стальная броня',      name_en:'Steel armor',      slot:'armor',      rarity:'rare',      price_gold:420,  effects:{ damage_mult:0.80, vit:10, str:2 }, icon:'A' },
  { id:'i-helmet_focus',     key:'helmet_focus',     name_ru:'Шлем фокуса',         name_en:'Focus helmet',     slot:'helmet',     rarity:'rare',      price_gold:320,  effects:{ focus:5, int:6 }, icon:'H' },
  { id:'i-boots_swift',      key:'boots_swift',      name_ru:'Сапоги скорости',     name_en:'Swift boots',      slot:'boots',      rarity:'common',    price_gold:120,  effects:{ extra_skips_per_week:1, agi:5 }, icon:'B' },
  { id:'i-amulet_luck',      key:'amulet_luck',      name_ru:'Амулет удачи',        name_en:'Lucky amulet',     slot:'amulet',     rarity:'epic',      price_gold:900,  effects:{ rare_drop_bonus:0.05, luc:10, int:3 }, icon:'M' },
  { id:'i-book_wisdom',      key:'book_wisdom',      name_ru:'Книга мудрости',      name_en:'Book of wisdom',   slot:'book',       rarity:'rare',      price_gold:280,  effects:{ category_bonus:{ study:1.15, reading:1.15 }, int:8 }, icon:'K' },
  { id:'i-gadget_timer',     key:'gadget_timer',     name_ru:'Помодоро-таймер',     name_en:'Pomodoro timer',   slot:'gadget',     rarity:'common',    price_gold:90,   effects:{ category_bonus:{ work:1.10 }, focus:3, int:2 }, icon:'T' },
  { id:'i-tool_journal',     key:'tool_journal',     name_ru:'Дневник дисциплины',  name_en:'Discipline journal',slot:'tool',      rarity:'rare',      price_gold:260,  effects:{ category_bonus:{ discipline:1.20 }, focus:6, int:3 }, icon:'J' },
  { id:'i-booster_xp_1d',    key:'booster_xp_1d',    name_ru:'XP-бустер 24ч',       name_en:'XP booster 24h',   slot:'booster',    rarity:'rare',      price_gold:250,  effects:{ xp_mult:1.25, duration_h:24 }, icon:'+' },
  { id:'i-cosmetic_neon',    key:'cosmetic_neon',    name_ru:'Неоновая аура',       name_en:'Neon aura',        slot:'cosmetic',   rarity:'epic',      price_gold:500,  effects:{}, icon:'o' },
  { id:'i-background_dawn',  key:'background_dawn',  name_ru:'Фон: рассвет',        name_en:'Background: dawn', slot:'background', rarity:'common',    price_gold:150,  effects:{}, icon:'#' },
  { id:'i-background_night', key:'background_night', name_ru:'Фон: ночной город',   name_en:'Background: night',slot:'background', rarity:'rare',      price_gold:300,  effects:{}, icon:'#' }
];

export function findItemById(id: string) {
  return seedItems.find(i => i.id === id);
}
export function findItemByKey(key: string) {
  return seedItems.find(i => i.key === key);
}
