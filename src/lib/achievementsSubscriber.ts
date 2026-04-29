import { useGameStore } from '../store/useGameStore';
import { findNewlyUnlocked } from './achievements';

// На каждый чих в игре проверяем условия достижений и записываем
// все новые в store.achievements. Раз записанное — не сбрасывается.
export function startAchievementSubscriber(): () => void {
  return useGameStore.subscribe((state) => {
    const newKeys = findNewlyUnlocked(
      {
        profile: state.profile,
        tasks: state.tasks,
        inventory: state.inventory,
        streak: state.streak,
        boss: state.boss
      },
      state.achievements
    );
    if (newKeys.length === 0) return;
    // открываем за один setState, чтобы не зацикливать подписку
    for (const key of newKeys) {
      useGameStore.getState().unlockAchievement(key);
    }
  });
}
