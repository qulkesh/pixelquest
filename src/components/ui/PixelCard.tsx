import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
  accent?: 'cyan' | 'magenta' | 'gold' | 'good' | 'bad' | 'rare' | 'epic';
}

const accentMap: Record<NonNullable<Props['accent']>, string> = {
  cyan: 'border-cyan/60', magenta: 'border-magenta/60', gold: 'border-gold/60',
  good: 'border-good/60', bad: 'border-bad/60',
  rare: 'border-rare/60', epic: 'border-epic/60'
};

export default function PixelCard({ title, accent, className = '', children, ...rest }: Props) {
  const accentCls = accent ? accentMap[accent] : '';
  return (
    <div {...rest} className={`pixel-frame relative ${accentCls} ${className}`}>
      {title && (
        <div className="absolute -top-3 left-3 px-2 bg-bg font-pixel text-[10px] tracking-widest uppercase text-cyan neon-text">
          {title}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
