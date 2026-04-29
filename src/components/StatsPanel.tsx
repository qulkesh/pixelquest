import { useGameStore } from '../store/useGameStore';

const ROWS: { key: 'str'|'int'|'agi'|'luc'|'vit'|'focus'; color: string; ru: string; en: string; short_ru: string; short_en: string }[] = [
  { key: 'str',   color: '#ff4d6d', ru: 'Сила',       en: 'Strength', short_ru: 'СИЛ', short_en: 'STR' },
  { key: 'int',   color: '#3d8bff', ru: 'Интеллект',  en: 'Intellect', short_ru: 'ИНТ', short_en: 'INT' },
  { key: 'agi',   color: '#3dff9a', ru: 'Ловкость',   en: 'Agility', short_ru: 'ЛОВ', short_en: 'AGI' },
  { key: 'luc',   color: '#ffae00', ru: 'Удача',      en: 'Luck', short_ru: 'УД',  short_en: 'LCK' },
  { key: 'vit',   color: '#ff8a3d', ru: 'Живучесть',  en: 'Vitality', short_ru: 'ЖИВ', short_en: 'VIT' },
  { key: 'focus', color: '#00d9ff', ru: 'Фокус',      en: 'Focus', short_ru: 'ФОК', short_en: 'FOC' }
];

export default function StatsPanel({ lang = 'ru' }: { lang?: 'ru' | 'en' }) {
  const profile = useGameStore(s => s.profile);
  const effects = useGameStore(s => s.effects)();

  if (!profile) return null;

  const baseFromLevel = (profile.level - 1) * 1;

  return (
    <div className="grid grid-cols-3 gap-2">
      {ROWS.map(r => {
        const fromGear = (effects[r.key] ?? 0);
        const total = baseFromLevel + fromGear + (r.key === 'focus' ? profile.focus : 0);
        const short = lang === 'en' ? r.short_en : r.short_ru;
        return (
          <div key={r.key} className="pixel-frame-soft p-2 flex flex-col items-center gap-0.5">
            <div className="font-pixel text-[9px] tracking-wide" style={{ color: r.color }}>{short}</div>
            <div className="font-pixel text-base neon-text leading-none" style={{ color: r.color }}>{total}</div>
            {fromGear > 0 && (
              <div className="font-pixel text-[8px] text-good leading-none">+{fromGear}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
