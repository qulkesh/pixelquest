interface Props {
  value: number;
  max: number;
  label?: string;
  tone?: 'cyan' | 'magenta' | 'good' | 'bad' | 'gold';
  height?: number;
  showNumbers?: boolean;
}

const toneClass: Record<NonNullable<Props['tone']>, string> = {
  cyan: 'bg-cyan', magenta: 'bg-magenta', good: 'bg-good', bad: 'bg-bad', gold: 'bg-gold'
};

export default function ProgressBar({ value, max, label, tone = 'cyan', height = 12, showNumbers = true }: Props) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className="w-full">
      {(label || showNumbers) && (
        <div className="flex justify-between mb-1 stat-label">
          <span>{label}</span>
          {showNumbers && <span className="font-pixel text-[9px] text-ink">{Math.round(value)}/{max}</span>}
        </div>
      )}
      <div className="relative w-full bg-bg/70 border-2 border-frame" style={{ height }}>
        <div
          className={`${toneClass[tone]} h-full transition-all`}
          style={{ width: `${pct}%`, boxShadow: '0 0 10px currentColor' }}
        />
        {/* pixel ticks */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 11px, rgba(11,13,26,0.6) 11px 12px)' }}
        />
      </div>
    </div>
  );
}
