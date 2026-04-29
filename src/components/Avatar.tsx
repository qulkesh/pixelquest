import type { Appearance, Gender, Item } from '../types/game';
import { EYE_PALETTE, HAIR_PALETTE, OUTFIT_PALETTE, SKIN_PALETTE, colorAt, hairStyleByIdx, pairAt } from '../lib/palettes';

// Detailed pixel hero. ViewBox 40x60 (выше детализация и слоты экипировки).
interface Props {
  gender: Gender;
  appearance: Appearance;
  hpRatio: number;
  resting?: boolean;
  size?: number;
  animate?: boolean;
  equipped?: Partial<Record<'weapon'|'armor'|'helmet'|'boots'|'amulet', Item>>;
}

const PANTS = ['#3a4a6b', '#26334a', '#5a6a8a'] as const; // light, dark, hl
const SHOES = ['#3a2517', '#1c1024'] as const;

interface SlotPalette { main: string; shadow: string; accent: string; trim: string }

function paletteForRarity(rarity: string): SlotPalette {
  switch (rarity) {
    case 'rare':      return { main: '#3d8bff', shadow: '#1f4ea8', accent: '#cce0ff', trim: '#ffd76a' };
    case 'epic':      return { main: '#b04dff', shadow: '#5e1f9c', accent: '#e0b3ff', trim: '#ffd76a' };
    case 'legendary': return { main: '#ffae00', shadow: '#a86b00', accent: '#fff0c2', trim: '#fff' };
    default:          return { main: '#9aa3c4', shadow: '#5a6486', accent: '#dde2f5', trim: '#cdd2e4' };
  }
}

function P(x: number, y: number, color: string, w = 1, h = 1, key?: string) {
  return <rect key={key ?? `${x}-${y}-${color}-${w}-${h}`} x={x} y={y} width={w} height={h} fill={color} shapeRendering="crispEdges" />;
}

export default function Avatar({ gender, appearance, hpRatio, resting, size = 160, animate = true, equipped = {} }: Props) {
  const [skinL, skinD] = pairAt(SKIN_PALETTE, appearance.skin);
  const [hairL, hairD] = pairAt(HAIR_PALETTE, appearance.hair);
  const [shirtL, shirtD] = pairAt(OUTFIT_PALETTE, appearance.outfit);
  const eyeColor = colorAt(EYE_PALETTE, appearance.eyes ?? 1);
  const hairStyle = hairStyleByIdx(appearance.hair_style ?? 1);

  const damaged = hpRatio < 0.5;
  const dead = hpRatio <= 0 || resting;

  const armorPal = equipped.armor ? paletteForRarity(equipped.armor.rarity) : null;
  const helmetPal = equipped.helmet ? paletteForRarity(equipped.helmet.rarity) : null;
  const bootsPal = equipped.boots ? paletteForRarity(equipped.boots.rarity) : null;
  const amuletPal = equipped.amulet ? paletteForRarity(equipped.amulet.rarity) : null;

  const W = 40, H = 60;
  const cx = 20;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={size}
      height={size * (H / W)}
      className={animate ? 'animate-floaty' : ''}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* shadow */}
      <ellipse cx={cx} cy={H - 1.5} rx="9" ry="1" fill="rgba(0,0,0,0.55)" />

      {/* ============ HEAD (rows 6..22) ============ */}
      {/* Skin block */}
      {P(13, 8, skinL, 14, 14, 'head')}
      {/* shading on right */}
      {P(24, 9, skinD, 3, 13, 'face-shade')}
      {/* chin shadow */}
      {P(13, 21, skinD, 14, 1, 'chin')}

      {/* ears */}
      {P(12, 13, skinL, 1, 4, 'ear-l')}
      {P(27, 13, skinL, 1, 4, 'ear-r')}
      {P(27, 14, skinD, 1, 3, 'ear-r-shade')}

      {/* neck */}
      {P(17, 22, skinL, 6, 3, 'neck')}
      {P(17, 24, skinD, 6, 1, 'neck-shade')}

      {/* eyebrows */}
      {!dead && P(15, 12, hairD, 4, 1, 'brow-l')}
      {!dead && P(21, 12, hairD, 4, 1, 'brow-r')}

      {/* eyes (whites + iris + pupil) */}
      {!dead && P(15, 14, '#ffffff', 4, 3, 'eye-l-w')}
      {!dead && P(21, 14, '#ffffff', 4, 3, 'eye-r-w')}
      {!dead && P(16, 14, eyeColor, 2, 2, 'eye-l-iris')}
      {!dead && P(22, 14, eyeColor, 2, 2, 'eye-r-iris')}
      {!dead && P(17, 15, '#0b0d1a', 1, 1, 'pupil-l')}
      {!dead && P(23, 15, '#0b0d1a', 1, 1, 'pupil-r')}
      {!dead && P(16, 14, '#ffffff', 1, 1, 'eye-l-shine')}
      {!dead && P(22, 14, '#ffffff', 1, 1, 'eye-r-shine')}
      {dead && P(15, 15, '#7a82a8', 4, 1, 'eye-l-closed')}
      {dead && P(21, 15, '#7a82a8', 4, 1, 'eye-r-closed')}

      {/* nose hint */}
      {P(19, 17, skinD, 2, 1, 'nose')}

      {/* mouth */}
      {P(17, 19, damaged ? '#c12648' : '#9c5040', 6, 1, 'mouth')}
      {!damaged && P(18, 19, '#ffffff66', 4, 1, 'mouth-hl')}

      {/* damage bruise */}
      {damaged && P(15, 11, '#7a4dff', 3, 1, 'bruise')}

      {/* ============ HAIR (depends on style) ============ */}
      {/* base hair shadow row */}
      {hairStyle !== 'mohawk' && P(13, 6, hairD, 14, 1, 'hair-shade')}

      {hairStyle === 'short' && (
        <>
          {P(13, 7, hairL, 14, 4, 'hair-top')}
          {P(13, 6, hairL, 14, 1, 'hair-top-edge')}
          {P(13, 10, hairL, 4, 2, 'bang-l')}
          {P(23, 10, hairL, 4, 2, 'bang-r')}
        </>
      )}
      {hairStyle === 'spiky' && (
        <>
          {P(13, 7, hairL, 14, 4, 'hair-base')}
          {P(14, 4, hairL, 2, 3, 'spike-1')}
          {P(18, 3, hairL, 2, 4, 'spike-2')}
          {P(22, 4, hairL, 2, 3, 'spike-3')}
          {P(26, 5, hairL, 2, 2, 'spike-4')}
        </>
      )}
      {hairStyle === 'long' && (
        <>
          {P(13, 7, hairL, 14, 4, 'hair-top')}
          {P(12, 8, hairL, 1, 14, 'long-l')}
          {P(27, 8, hairL, 1, 14, 'long-r')}
          {P(13, 22, hairD, 14, 1, 'long-tip')}
          {P(13, 10, hairL, 5, 2, 'bangs-l')}
          {P(22, 10, hairL, 5, 2, 'bangs-r')}
        </>
      )}
      {hairStyle === 'bowl' && (
        <>
          {P(12, 7, hairL, 16, 5, 'bowl')}
          {P(13, 12, hairL, 14, 1, 'bowl-rim')}
          {P(12, 7, hairD, 16, 1, 'bowl-shade')}
        </>
      )}
      {hairStyle === 'mohawk' && (
        <>
          {/* shaved sides — show skin */}
          {P(18, 4, hairL, 4, 6, 'mohawk-base')}
          {P(19, 2, hairL, 2, 2, 'mohawk-tip')}
          {P(18, 4, hairD, 1, 6, 'mohawk-shade')}
        </>
      )}
      {hairStyle === 'curly' && (
        <>
          {P(13, 7, hairL, 14, 4, 'curly-base')}
          {/* puffs */}
          {P(13, 5, hairL, 3, 3, 'puff-1')}
          {P(17, 4, hairL, 3, 3, 'puff-2')}
          {P(21, 5, hairL, 3, 3, 'puff-3')}
          {P(24, 6, hairL, 3, 3, 'puff-4')}
          {P(13, 10, hairL, 3, 2, 'bang-l')}
          {P(24, 10, hairL, 3, 2, 'bang-r')}
        </>
      )}

      {/* ============ TORSO (rows 25..38) ============ */}
      {/* base shirt body */}
      {(() => {
        const main = armorPal?.main ?? shirtL;
        const shadow = armorPal?.shadow ?? shirtD;
        const accent = armorPal?.accent ?? '#ffffff44';
        return (
          <g key="torso">
            {P(13, 25, main, 14, 14, 'torso')}
            {P(24, 25, shadow, 3, 14, 'torso-r-shade')}
            {/* shoulders */}
            {P(11, 25, main, 2, 5, 'shoulder-l')}
            {P(27, 25, main, 2, 5, 'shoulder-r')}
            {P(27, 28, shadow, 2, 2, 'shoulder-r-shade')}
            {/* sleeves */}
            {P(11, 30, main, 2, 4, 'sleeve-l')}
            {P(27, 30, main, 2, 4, 'sleeve-r')}
            {P(27, 30, shadow, 2, 4, 'sleeve-r-shade')}
            {P(11, 33, shadow, 2, 1, 'sleeve-l-cuff')}
            {P(27, 33, shadow, 2, 1, 'sleeve-r-cuff')}
            {/* collar v-neck */}
            {P(18, 25, shadow, 4, 1, 'collar-1')}
            {P(19, 26, shadow, 2, 2, 'collar-2')}
            {/* belt */}
            {P(13, 37, '#1c1024', 14, 1, 'belt')}
            {P(19, 37, '#ffd76a', 2, 1, 'belt-buckle')}

            {/* ARMOR-specific overlays */}
            {armorPal && (
              <g key="armor-deco">
                {/* chest plate */}
                {P(15, 27, accent, 10, 1, 'plate-top')}
                {P(15, 27, armorPal.shadow, 1, 9, 'plate-edge-l')}
                {P(24, 27, armorPal.shadow, 1, 9, 'plate-edge-r')}
                {/* rivets */}
                {P(16, 28, armorPal.trim, 1, 1, 'r-1')}
                {P(23, 28, armorPal.trim, 1, 1, 'r-2')}
                {P(16, 35, armorPal.trim, 1, 1, 'r-3')}
                {P(23, 35, armorPal.trim, 1, 1, 'r-4')}
                {/* center emblem */}
                {P(19, 30, armorPal.trim, 2, 4, 'emblem-bg')}
                {P(19, 31, armorPal.accent, 2, 2, 'emblem-core')}
                {/* pauldrons (shoulder pads) */}
                {P(10, 25, armorPal.main, 2, 4, 'paul-l')}
                {P(28, 25, armorPal.main, 2, 4, 'paul-r')}
                {P(10, 25, armorPal.accent, 2, 1, 'paul-l-hl')}
                {P(28, 25, armorPal.accent, 2, 1, 'paul-r-hl')}
                {P(10, 28, armorPal.shadow, 2, 1, 'paul-l-sh')}
                {P(28, 28, armorPal.shadow, 2, 1, 'paul-r-sh')}
              </g>
            )}
          </g>
        );
      })()}

      {/* AMULET on chest */}
      {amuletPal && (
        <g key="amulet">
          {P(18, 27, '#ffd76a', 4, 1, 'chain-1')}
          {P(19, 28, amuletPal.main, 2, 3, 'gem')}
          {P(19, 28, amuletPal.accent, 1, 1, 'gem-hl')}
          {P(19, 30, amuletPal.shadow, 2, 1, 'gem-bottom')}
        </g>
      )}

      {/* ============ ARMS / HANDS ============ */}
      {P(11, 33, skinL, 2, 4, 'forearm-l')}
      {P(27, 33, skinL, 2, 4, 'forearm-r')}
      {P(27, 35, skinD, 2, 2, 'forearm-r-shade')}
      {/* hands */}
      {P(11, 36, skinD, 2, 2, 'hand-l')}
      {P(27, 36, skinD, 2, 2, 'hand-r')}

      {/* ============ LEGS / PANTS (rows 38..52) ============ */}
      {P(15, 38, PANTS[0], 4, 13, 'leg-l')}
      {P(21, 38, PANTS[0], 4, 13, 'leg-r')}
      {P(19, 38, '#1c1024', 2, 13, 'leg-divider')}
      {P(15, 38, PANTS[2], 1, 12, 'leg-l-hl')}
      {P(23, 38, PANTS[1], 2, 12, 'leg-r-shade')}

      {/* ============ SHOES / BOOTS ============ */}
      {(() => {
        const main = bootsPal?.main ?? SHOES[0];
        const shadow = bootsPal?.shadow ?? SHOES[1];
        const trim = bootsPal?.trim ?? '#ffd76a';
        return (
          <g key="shoes">
            {/* boot shaft (above ankle) — обязательно видимый, если ботинки экипированы */}
            {bootsPal && P(15, 47, main, 4, 4, 'shaft-l')}
            {bootsPal && P(21, 47, main, 4, 4, 'shaft-r')}
            {bootsPal && P(15, 47, bootsPal.accent, 4, 1, 'shaft-l-hl')}
            {bootsPal && P(21, 47, bootsPal.accent, 4, 1, 'shaft-r-hl')}
            {bootsPal && P(15, 50, trim, 4, 1, 'cuff-l')}
            {bootsPal && P(21, 50, trim, 4, 1, 'cuff-r')}
            {/* foot */}
            {P(14, 51, main, 6, 4, 'foot-l')}
            {P(20, 51, main, 6, 4, 'foot-r')}
            {P(14, 54, shadow, 6, 1, 'sole-l')}
            {P(20, 54, shadow, 6, 1, 'sole-r')}
            {bootsPal && P(14, 51, bootsPal.accent, 6, 1, 'foot-l-hl')}
            {bootsPal && P(20, 51, bootsPal.accent, 6, 1, 'foot-r-hl')}
          </g>
        );
      })()}

      {/* ============ HELMET overlay ============ */}
      {helmetPal && (
        <g key="helmet">
          {/* crown */}
          {P(13, 5, helmetPal.main, 14, 7, 'crown')}
          {P(13, 5, helmetPal.accent, 14, 1, 'crown-hl')}
          {P(24, 6, helmetPal.shadow, 3, 6, 'crown-shade')}
          {/* visor (eye slit) */}
          {P(15, 13, helmetPal.shadow, 10, 2, 'visor')}
          {/* side guards */}
          {P(12, 7, helmetPal.main, 1, 7, 'side-l')}
          {P(27, 7, helmetPal.main, 1, 7, 'side-r')}
          {P(27, 8, helmetPal.shadow, 1, 6, 'side-r-shade')}
          {/* top crest / horns / spikes by rarity */}
          {equipped.helmet?.rarity === 'rare' && P(19, 2, helmetPal.trim, 2, 4, 'crest')}
          {equipped.helmet?.rarity === 'epic' && (
            <g key="ep-horns">
              {P(13, 1, helmetPal.trim, 2, 5, 'horn-l')}
              {P(25, 1, helmetPal.trim, 2, 5, 'horn-r')}
              {P(19, 2, helmetPal.accent, 2, 4, 'crest')}
            </g>
          )}
          {equipped.helmet?.rarity === 'legendary' && (
            <g key="leg-wings">
              {P(11, 4, helmetPal.trim, 2, 6, 'wing-l')}
              {P(27, 4, helmetPal.trim, 2, 6, 'wing-r')}
              {P(13, 3, helmetPal.accent, 14, 1, 'crown-glow')}
              <rect x="11" y="3" width="18" height="9" fill={helmetPal.accent} opacity="0.18" />
            </g>
          )}
          {/* visor highlight */}
          {P(16, 13, helmetPal.accent, 2, 1, 'visor-hl')}
        </g>
      )}

      {/* ============ WEAPON (in right hand) ============ */}
      {equipped.weapon && (() => {
        const pal = paletteForRarity(equipped.weapon.rarity);
        return (
          <g key="weapon">
            {/* hilt / handle */}
            {P(28, 30, '#3a2517', 2, 4, 'hilt')}
            {/* pommel */}
            {P(27, 33, pal.trim, 4, 1, 'pommel')}
            {/* guard */}
            {P(26, 29, pal.trim, 6, 1, 'guard')}
            {/* blade */}
            {P(28, 18, pal.accent, 1, 11, 'blade-hl')}
            {P(29, 18, pal.main, 2, 11, 'blade')}
            {P(31, 19, pal.shadow, 1, 10, 'blade-shade')}
            {/* tip */}
            {P(29, 16, pal.main, 2, 2, 'tip-1')}
            {P(30, 14, pal.main, 1, 2, 'tip-2')}
            {/* glow */}
            {equipped.weapon.rarity === 'epic' && (
              <rect x="27" y="14" width="5" height="20" fill={pal.accent} opacity="0.25" />
            )}
            {equipped.weapon.rarity === 'legendary' && (
              <>
                <rect x="26" y="13" width="6" height="22" fill={pal.accent} opacity="0.3" />
                {P(28, 16, '#fff', 1, 1, 'sparkle-1')}
                {P(31, 22, '#fff', 1, 1, 'sparkle-2')}
              </>
            )}
          </g>
        );
      })()}

      {/* sleeping z */}
      {resting && (
        <text x="28" y="9" fontSize="6" fill="#00d9ff" fontFamily="VT323">z</text>
      )}
    </svg>
  );
}
