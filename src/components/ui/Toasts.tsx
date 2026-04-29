import { useUiStore } from '../../store/useUiStore';

const toneCls: Record<string, string> = {
  good: 'border-good text-good',
  bad: 'border-bad text-bad',
  gold: 'border-gold text-gold',
  info: 'border-cyan text-cyan'
};

export default function Toasts() {
  const toasts = useUiStore(s => s.toasts);
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pixel-frame-soft px-3 py-2 font-pixel text-[10px] uppercase tracking-widest neon-text ${toneCls[t.tone ?? 'info']}`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
