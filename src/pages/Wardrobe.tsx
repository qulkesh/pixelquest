import { useState } from 'react';
import PixelCard from '../components/ui/PixelCard';
import PixelButton from '../components/ui/PixelButton';
import Avatar from '../components/Avatar';
import { useGameStore } from '../store/useGameStore';
import { useT } from '../hooks/useT';
import {
  EYE_PALETTE, HAIR_PALETTE, HAIR_STYLES, OUTFIT_PALETTE, SKIN_PALETTE,
  pairAt, colorAt
} from '../lib/palettes';
import type { Appearance, Gender, Item } from '../types/game';
import { findItemById } from '../lib/seedData';

export default function Wardrobe() {
  const t = useT();
  const profile = useGameStore(s => s.profile);
  const inventory = useGameStore(s => s.inventory);
  const finish = useGameStore(s => s.finishOnboarding);

  if (!profile) return null;

  const [name, setName] = useState(profile.nickname);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [look, setLook] = useState<Appearance>({
    skin: profile.appearance.skin ?? 1,
    hair: profile.appearance.hair ?? 1,
    outfit: profile.appearance.outfit ?? 1,
    hair_style: profile.appearance.hair_style ?? 1,
    eyes: profile.appearance.eyes ?? 1
  });

  const equippedMap: Partial<Record<'weapon'|'armor'|'helmet'|'boots'|'amulet', Item>> = {};
  for (const row of inventory) {
    if (!row.equipped) continue;
    const it = findItemById(row.item_id); if (!it) continue;
    if (['weapon','armor','helmet','boots','amulet'].includes(it.slot)) {
      (equippedMap as any)[it.slot] = it;
    }
  }

  const set = <K extends keyof Appearance>(k: K, v: Appearance[K]) =>
    setLook(prev => ({ ...prev, [k]: v }));

  const save = () => {
    finish({ nickname: name || profile.nickname, gender, appearance: look });
  };

  return (
    <div className="space-y-4">
      <h1 className="font-pixel text-lg text-cyan neon-text">{t('wardrobe.title')}</h1>

      <div className="grid md:grid-cols-[260px_1fr] gap-4">
        {/* Preview */}
        <PixelCard accent="cyan">
          <div className="flex flex-col items-center gap-3">
            <div className="pixel-frame-soft p-4">
              <Avatar gender={gender} appearance={look} hpRatio={1} size={180} equipped={equippedMap} />
            </div>
            <input
              className="pixel-input text-center"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('character.enterName')}
            />
            <div className="flex gap-2">
              {(['male','female','other'] as Gender[]).map(g => (
                <PixelButton key={g} variant={gender === g ? 'primary' : 'default'} onClick={() => setGender(g)}>
                  {t(`character.${g}`)}
                </PixelButton>
              ))}
            </div>
            <PixelButton variant="primary" className="w-full" onClick={save}>{t('common.save')}</PixelButton>
          </div>
        </PixelCard>

        {/* Editors */}
        <div className="space-y-4">
          <PixelCard title={t('wardrobe.skin')} accent="magenta">
            <Swatches
              count={SKIN_PALETTE.length}
              selected={look.skin}
              onPick={(i) => set('skin', i)}
              colorOf={(i) => pairAt(SKIN_PALETTE, i)[0]}
            />
          </PixelCard>

          <PixelCard title={t('wardrobe.hairStyle')} accent="cyan">
            <div className="grid grid-cols-6 gap-2">
              {HAIR_STYLES.map((s, i) => {
                const idx = i + 1;
                const active = (look.hair_style ?? 1) === idx;
                return (
                  <button
                    key={s}
                    onClick={() => set('hair_style', idx)}
                    className={`pixel-frame-soft p-1 text-center ${active ? 'border-cyan' : ''}`}
                  >
                    <div className="font-pixel text-[9px] uppercase tracking-wide" style={{ color: active ? '#00d9ff' : '#7a82a8' }}>
                      {s}
                    </div>
                    <div className="mt-1">
                      <Avatar gender={gender} appearance={{ ...look, hair_style: idx }} hpRatio={1} size={56} animate={false} />
                    </div>
                  </button>
                );
              })}
            </div>
          </PixelCard>

          <PixelCard title={t('wardrobe.hairColor')} accent="gold">
            <Swatches
              count={HAIR_PALETTE.length}
              selected={look.hair}
              onPick={(i) => set('hair', i)}
              colorOf={(i) => pairAt(HAIR_PALETTE, i)[0]}
            />
          </PixelCard>

          <PixelCard title={t('wardrobe.eyes')} accent="cyan">
            <Swatches
              count={EYE_PALETTE.length}
              selected={look.eyes ?? 1}
              onPick={(i) => set('eyes', i)}
              colorOf={(i) => colorAt(EYE_PALETTE, i)}
            />
          </PixelCard>

          <PixelCard title={t('wardrobe.outfit')} accent="magenta">
            <Swatches
              count={OUTFIT_PALETTE.length}
              selected={look.outfit}
              onPick={(i) => set('outfit', i)}
              colorOf={(i) => pairAt(OUTFIT_PALETTE, i)[0]}
            />
          </PixelCard>
        </div>
      </div>
    </div>
  );
}

function Swatches({
  count, selected, onPick, colorOf
}: { count: number; selected: number; onPick: (i: number) => void; colorOf: (i: number) => string }) {
  return (
    <div className="grid grid-cols-8 gap-2">
      {Array.from({ length: count }).map((_, i) => {
        const idx = i + 1;
        const active = selected === idx;
        return (
          <button
            key={idx}
            onClick={() => onPick(idx)}
            className={`relative w-10 h-10 border-2 ${active ? 'border-cyan' : 'border-frame'} hover:border-magenta transition`}
            style={{ background: colorOf(idx), boxShadow: active ? '0 0 10px rgba(0,217,255,0.6)' : undefined, imageRendering: 'pixelated' }}
            title={`#${idx}`}
          >
            {active && <span className="absolute top-0 right-0 font-pixel text-[8px] text-cyan bg-bg/80 px-0.5">✓</span>}
          </button>
        );
      })}
    </div>
  );
}
