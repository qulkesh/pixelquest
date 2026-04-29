import PixelCard from '../components/ui/PixelCard';
import PixelButton from '../components/ui/PixelButton';
import ProgressBar from '../components/ui/ProgressBar';
import { useGameStore } from '../store/useGameStore';
import { useT } from '../hooks/useT';

export default function Quests() {
  const t = useT();
  const quests = useGameStore(s => s.quests);
  const claim = useGameStore(s => s.claimQuest);

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-lg text-cyan neon-text">{t('quests.title')}</h1>
      {quests.length === 0 && <div className="text-muted">{t('common.empty')}</div>}
      <div className="grid md:grid-cols-2 gap-4">
        {quests.map(q => {
          const ready = q.progress >= q.target_count;
          return (
            <PixelCard key={q.id} accent={q.status === 'completed' ? 'good' : 'epic'}>
              <div className="flex justify-between items-center mb-2">
                <div className="font-pixel text-sm">{q.title}</div>
                <div className="font-pixel text-[10px] text-muted">
                  {q.progress}/{q.target_count}
                </div>
              </div>
              {q.description && <div className="text-muted mb-3">{q.description}</div>}
              <ProgressBar value={q.progress} max={q.target_count} tone="magenta" height={8} showNumbers={false} />
              <div className="mt-3 flex justify-between items-center">
                <div className="text-sm text-muted">
                  {t('quests.rewards')}: <span className="text-cyan">+{q.reward_xp}xp</span>{' '}
                  <span className="text-gold">+{q.reward_gold}g</span>
                  {q.reward_item && <span className="text-magenta"> · {q.reward_item}</span>}
                </div>
                {q.status === 'active' ? (
                  <PixelButton variant="good" disabled={!ready} onClick={() => claim(q.id)}>
                    {ready ? t('quests.claim') : t('quests.progress', { cur: q.progress, tot: q.target_count })}
                  </PixelButton>
                ) : (
                  <span className="font-pixel text-[10px] text-good">{t('quests.finished')}</span>
                )}
              </div>
            </PixelCard>
          );
        })}
      </div>
    </div>
  );
}
