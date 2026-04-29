import type { Dictionary } from './ru';

export const en: Dictionary = {
  common: {
    appName: 'PixelQuest',
    tagline: 'Level up your life',
    yes: 'Yes', no: 'No', cancel: 'Cancel', save: 'Save',
    add: 'Add', edit: 'Edit', delete: 'Delete',
    confirm: 'Confirm', back: 'Back', next: 'Next',
    loading: 'Loading…', empty: 'Nothing here yet',
    today: 'Today', week: 'Week'
  },
  auth: {
    login: 'Log in', register: 'Sign up', logout: 'Log out',
    email: 'Email', password: 'Password',
    nickname: 'Nickname', signIn: 'Sign in', signUp: 'Create hero',
    haveAccount: 'Already have an account?', noAccount: 'No account?',
    mockNote: 'Supabase not connected — running in local mode.'
  },
  nav: {
    dashboard: 'Home', habits: 'Habits', todos: 'Tasks',
    quests: 'Quests', achievements: 'Achievements',
    inventory: 'Inventory', shop: 'Shop', boss: 'Weekly boss',
    settings: 'Settings'
  },
  stats: {
    level: 'LEVEL', xp: 'XP', hp: 'HP',
    gold: 'Gold', energy: 'Energy',
    discipline: 'Discipline', focus: 'Focus', streak: 'Streak'
  },
  difficulty: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
  frequency: {
    daily: 'Every day', weekdays: 'Weekdays', weekends: 'Weekends',
    '3xweek': '3x / week', weekly: 'Once a week'
  },
  rarity: { common: 'Common', rare: 'Rare', epic: 'Epic', legendary: 'Legendary' },
  slot: {
    weapon: 'Weapon', armor: 'Armor', helmet: 'Helmet',
    boots: 'Boots', amulet: 'Amulet', book: 'Book',
    gadget: 'Gadget', tool: 'Tool',
    potion: 'Potion', chest: 'Chest', cosmetic: 'Cosmetic',
    background: 'Background', booster: 'Booster'
  },
  character: {
    title: 'Create your hero',
    chooseGender: 'Pick gender',
    male: 'Male', female: 'Female', other: 'Other',
    chooseLook: 'Pick look',
    skin: 'Skin', hair: 'Hair', outfit: 'Outfit',
    enterName: 'Hero name',
    start: 'Start adventure!'
  },
  dashboard: {
    welcome: 'Welcome back, {name}!',
    newDayTitle: 'A new day begins',
    newDaySub: 'Today’s 3 quests',
    complete: 'Done', skip: 'Skip', fail: 'Fail',
    skipsLeft: 'Skips left: {n}',
    questsActive: 'Active quests',
    bossWeek: 'Weekly boss',
    inventory: 'Inventory', shop: 'Shop',
    todos: 'Today’s tasks',
    streak: 'Streak: {n}d',
    bestStreak: 'Best: {n}',
    resting: 'Hero is resting. Come back in {min} min.',
    levelUp: 'Level up!',
    rewardChest: 'You got a chest',
    drop: 'You found:'
  },
  habits: {
    title: 'Habits',
    addNew: 'Add habit',
    titleField: 'Title', descField: 'Description',
    catField: 'Category', diffField: 'Difficulty', freqField: 'Frequency',
    saved: 'Saved',
    yourHabits: 'Your habits',
    systemHabits: 'System habits',
    noneToday: 'No habits scheduled for today',
    skipUsed: 'You already used your skip today',
    rewardSet: 'Rewards: {xp} XP, {gold} G'
  },
  todos: {
    title: 'Tasks',
    addNew: 'New task',
    none: 'No tasks yet — add the first',
    deadline: 'Deadline',
    complete: 'Complete', failNow: 'Fail', restore: 'Restore',
    overdue: 'Overdue'
  },
  quests: {
    title: 'Quests',
    progress: '{cur}/{tot}',
    rewards: 'Rewards',
    finished: 'Finished!',
    claim: 'Claim reward'
  },
  achievements: {
    title: 'Achievements',
    locked: 'Locked'
  },
  inventory: {
    title: 'Inventory',
    equip: 'Equip', unequip: 'Unequip', use: 'Use',
    equipped: 'equipped',
    quantity: 'x{n}',
    empty: 'Bag is empty'
  },
  shop: {
    title: 'Shop',
    buy: 'Buy', notEnough: 'Not enough gold',
    bought: 'Bought!'
  },
  boss: {
    title: 'Weekly boss',
    name: 'Chaos of Laziness',
    intro: 'Defeat it before the week ends and earn a big reward.',
    needHabits: 'Habits: {cur}/{tot}',
    needTasks: 'Tasks: {cur}/{tot}',
    won: 'Boss defeated! 🎉',
    lost: 'Week lost. Next time!'
  },
  settings: {
    title: 'Settings', language: 'Language'
  },
  toasts: {
    xpGained: '+{xp} XP',
    goldGained: '+{gold} G',
    hpLost: '-{hp} HP',
    hpHealed: '+{hp} HP',
    droppedItem: 'You found {name}',
    levelUp: 'LVL UP! Now {lvl}'
  }
};
