import PixelCard from '../components/ui/PixelCard';
import ProgressBar from '../components/ui/ProgressBar';
import { useGameStore } from '../store/useGameStore';
import { useT } from '../hooks/useT';

export default function Boss() {
  const t = useT();
  const boss = useGameStore(s => s.boss);
  if (!boss) return null;
  const progress = boss.progress ?? { habits_done: 0, tasks_done: 0 };

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-lg text-bad neon-text">{t('boss.title')}</h1>
      <PixelCard accent="bad">
        <div className="grid md:grid-cols-[200px_1fr] gap-6 items-center">
          <div className="flex justify-center">
            <svg viewBox="0 0 16 16" width={180} height={180} style={{ imageRendering: 'pixelated' }} className="animate-floaty">
              <polygon points="3,4 4,2 5,4 6,2 7,4 8,2 9,4 10,2 11,4 12,2 13,4 13,5 3,5" fill="#7a4dff" />
              <rect x="3" y="5" width="10" height="6" fill="#3d1a4a" />
              <rect x="5" y="7" width="2" height="2" fill="#ff4d6d" />
              <rect x="9" y="7" width="2" height="2" fill="#ff4d6d" />
              <rect x="5" y="10" width="1" height="1" fill="#fff" />
              <rect x="7" y="10" width="1" height="1" fill="#fff" />
              <rect x="9" y="10" width="1" height="1" fill="#fff" />
              <rect x="2" y="6" width="1" height="4" fill="#3d1a4a" />
              <rect x="13" y="6" width="1" height="4" fill="#3d1a4a" />
              <rect x="1" y="9" width="1" height="2" fill="#3d1a4a" />
              <rect x="14" y="9" width="1" height="2" fill="#3d1a4a" />
            </svg>
          </div>
          <div>
            <div className="font-pixel text-base mb-1 text-bad neon-text">{t('boss.name')}</div>
            <p className="text-muted mb-4">{t('boss.intro')}</p>

            <ProgressBar value={boss.hp_left} max={boss.hp_max} label="HP" tone="bad" />

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between font-pixel text-[10px] mb-1">
                  <span className="text-cyan">{t('boss.needHabits', { cur: progress.habits_done, tot: boss.requirements.habits })}</span>
                </div>
                <ProgressBar value={progress.habits_done} max={boss.requirements.habits} tone="cyan" height={6} showNumbers={false} />
              </div>
              <div>
                <div className="flex justify-between font-pixel text-[10px] mb-1">
                  <span className="text-magenta">{t('boss.needTasks', { cur: progress.tasks_done, tot: boss.requirements.tasks })}</span>
                </div>
                <ProgressBar value={progress.tasks_done} max={boss.requirements.tasks} tone="magenta" height={6} showNumbers={false} />
              </div>
            </div>

            {boss.status === 'won' && <div className="mt-4 font-pixel text-good neon-text">{t('boss.won')}</div>}
            {boss.status === 'lost' && <div className="mt-4 font-pixel text-bad neon-text">{t('boss.lost')}</div>}
          </div>
        </div>
      </PixelCard>
    </div>
  );
}
