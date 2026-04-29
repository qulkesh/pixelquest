export const ru = {
  common: {
    appName: 'PixelQuest',
    tagline: 'Прокачай жизнь — играя',
    yes: 'Да', no: 'Нет', cancel: 'Отмена', save: 'Сохранить',
    add: 'Добавить', edit: 'Изменить', delete: 'Удалить',
    confirm: 'Подтвердить', back: 'Назад', next: 'Далее',
    loading: 'Загрузка…', empty: 'Пока пусто',
    today: 'Сегодня', week: 'Неделя'
  },
  auth: {
    login: 'Вход', register: 'Регистрация', logout: 'Выход',
    email: 'Email', password: 'Пароль',
    nickname: 'Никнейм', signIn: 'Войти', signUp: 'Создать героя',
    haveAccount: 'Уже есть аккаунт?', noAccount: 'Нет аккаунта?',
    mockNote: 'Supabase не подключён — играешь в локальном режиме.'
  },
  nav: {
    dashboard: 'Главная', habits: 'Привычки', todos: 'Задачи',
    quests: 'Квесты', achievements: 'Достижения',
    inventory: 'Инвентарь', shop: 'Магазин', boss: 'Босс недели',
    wardrobe: 'Гардероб',
    settings: 'Настройки'
  },
  wardrobe: {
    title: 'Гардероб',
    skin: 'Кожа',
    hairStyle: 'Причёска',
    hairColor: 'Цвет волос',
    eyes: 'Глаза',
    outfit: 'Цвет одежды'
  },
  stats: {
    level: 'УРОВЕНЬ', xp: 'Опыт', hp: 'Здоровье',
    gold: 'Золото', energy: 'Энергия',
    discipline: 'Дисциплина', focus: 'Фокус', streak: 'Серия'
  },
  difficulty: { easy: 'Лёгкая', normal: 'Средняя', hard: 'Сложная' },
  frequency: {
    daily: 'Каждый день', weekdays: 'Будни', weekends: 'Выходные',
    '3xweek': '3 раза в неделю', weekly: 'Раз в неделю'
  },
  rarity: { common: 'Обычный', rare: 'Редкий', epic: 'Эпический', legendary: 'Легендарный' },
  slot: {
    weapon: 'Оружие', armor: 'Броня', helmet: 'Шлем',
    boots: 'Сапоги', amulet: 'Амулет', book: 'Книга',
    gadget: 'Гаджет', tool: 'Инструмент',
    potion: 'Зелье', chest: 'Сундук', cosmetic: 'Косметика',
    background: 'Фон', booster: 'Бустер'
  },
  character: {
    title: 'Создание героя',
    chooseGender: 'Выбери пол',
    male: 'Мужчина', female: 'Женщина', other: 'Другое',
    chooseLook: 'Выбери внешность',
    skin: 'Кожа', hair: 'Причёска', outfit: 'Одежда',
    enterName: 'Имя героя',
    start: 'В путь!'
  },
  dashboard: {
    welcome: 'С возвращением, {name}!',
    newDayTitle: 'Новый день начался',
    newDaySub: 'Сегодняшние 3 квеста',
    complete: 'Готово', skip: 'Пропустить', fail: 'Провал',
    skipsLeft: 'Скипов осталось: {n}',
    questsActive: 'Активные квесты',
    bossWeek: 'Босс недели',
    inventory: 'Инвентарь', shop: 'Магазин',
    todos: 'Задачи дня',
    streak: 'Серия: {n} дн.',
    bestStreak: 'Лучшая: {n}',
    resting: 'Герой отдыхает. Возвращайся через {min} мин.',
    levelUp: 'Уровень повышен!',
    rewardChest: 'Получен сундук',
    drop: 'Выпал предмет:'
  },
  habits: {
    title: 'Привычки',
    addNew: 'Добавить привычку',
    titleField: 'Название', descField: 'Описание',
    catField: 'Категория', diffField: 'Сложность', freqField: 'Частота',
    saved: 'Сохранено',
    yourHabits: 'Твои привычки',
    systemHabits: 'Системные привычки',
    noneToday: 'На сегодня нет привычек по расписанию',
    skipUsed: 'Скип уже использован сегодня',
    rewardSet: 'Награды: {xp} XP, {gold} G'
  },
  todos: {
    title: 'Задачи',
    addNew: 'Новая задача',
    none: 'Нет задач — добавь первую',
    deadline: 'Дедлайн',
    complete: 'Выполнить', failNow: 'Провалить', restore: 'Вернуть',
    overdue: 'Просрочено'
  },
  quests: {
    title: 'Квесты',
    progress: '{cur}/{tot}',
    rewards: 'Награды',
    finished: 'Выполнено!',
    claim: 'Забрать награду'
  },
  achievements: {
    title: 'Достижения',
    locked: 'Закрыто'
  },
  inventory: {
    title: 'Инвентарь',
    equip: 'Надеть', unequip: 'Снять', use: 'Использовать',
    equipped: 'надето',
    quantity: 'x{n}',
    empty: 'Сумка пуста'
  },
  shop: {
    title: 'Магазин',
    buy: 'Купить', notEnough: 'Не хватает золота',
    bought: 'Куплено!'
  },
  boss: {
    title: 'Босс недели',
    name: 'Хаос Лени',
    intro: 'Победи его до конца недели и получи большую награду.',
    needHabits: 'Привычек: {cur}/{tot}',
    needTasks: 'Задач: {cur}/{tot}',
    won: 'Босс повержен! 🎉',
    lost: 'Неделя проиграна. В следующий раз!'
  },
  settings: {
    title: 'Настройки', language: 'Язык'
  },
  toasts: {
    xpGained: '+{xp} XP',
    goldGained: '+{gold} G',
    hpLost: '-{hp} HP',
    hpHealed: '+{hp} HP',
    droppedItem: 'Выпал {name}',
    levelUp: 'LVL UP! Теперь {lvl}'
  }
};

export type Dictionary = typeof ru;
