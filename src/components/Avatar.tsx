import type { Appearance, Gender } from '../types/game';

// SVG-based pixel avatar. Меняет цвета по полу/внешности и состоянию HP.
interface Props {
  gender: Gender;
  appearance: Appearance;
  hpRatio: number;          // 0..1
  resting?: boolean;
  size?: number;
  animate?: boolean;
}

const SKIN: Record<number, string> = { 1: '#f6caa0', 2: '#d99e7a', 3: '#a76a48', 4: '#6b4631' };
const HAIR: Record<number, string> = { 1: '#3a2a1f', 2: '#ffd35a', 3: '#ff5c8a', 4: '#7ad7ff' };
const OUTFIT_M: Record<number, string> = { 1: '#3d8bff', 2: '#3dff9a', 3: '#b04dff', 4: '#ff4d6d' };
const OUTFIT_F: Record<number, string> = { 1: '#ff3ed1', 2: '#ffcc33', 3: '#7ad7ff', 4: '#3dff9a' };

function px(x: number, y: number, color: string, size = 1) {
  return <rect x={x} y={y} width={size} height={size} fill={color} shapeRendering="crispEdges" />;
}

export default function Avatar({ gender, appearance, hpRatio, resting, size = 96, animate = true }: Props) {
  const skin = SKIN[appearance.skin] ?? SKIN[1];
  const hair = HAIR[appearance.hair] ?? HAIR[1];
  const outfit = (gender === 'female' ? OUTFIT_F : OUTFIT_M)[appearance.outfit] ?? '#3d8bff';
  const damaged = hpRatio < 0.5;
  const dead = hpRatio <= 0 || resting;
  const eyeColor = dead ? '#7a82a8' : '#0b0d1a';

  return (
    <svg
      viewBox="0 0 16 16"
      width={size} height={size}
      className={animate ? 'animate-floaty' : ''}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* shadow */}
      <ellipse cx="8" cy="14.5" rx="4" ry="0.6" fill="rgba(0,0,0,0.5)" />
      {/* head */}
      {Array.from({ length: 5 }).map((_, x) =>
        Array.from({ length: 4 }).map((_, y) => px(5 + x, 2 + y, skin, 1))
      ).flat()}
      {/* hair top */}
      {Array.from({ length: 6 }).map((_, x) => px(5 + x, 1, hair, 1))}
      {gender === 'female' && Array.from({ length: 4 }).map((_, y) => px(4, 2 + y, hair, 1))}
      {gender === 'female' && Array.from({ length: 4 }).map((_, y) => px(11, 2 + y, hair, 1))}
      {/* eyes */}
      {px(6, 4, eyeColor)}
      {px(9, 4, eyeColor)}
      {/* mouth */}
      <rect x="7" y="6" width="2" height="1" fill={damaged ? '#ff4d6d' : '#0b0d1a'} />
      {/* bruise when damaged */}
      {damaged && <rect x="8" y="3" width="1" height="1" fill="#7a4dff" opacity="0.7" />}
      {/* body / outfit */}
      {Array.from({ length: 5 }).map((_, x) =>
        Array.from({ length: 4 }).map((_, y) => px(5 + x, 7 + y, outfit, 1))
      ).flat()}
      {/* belt */}
      <rect x="5" y="9" width="6" height="1" fill="#0b0d1a" />
      {/* legs */}
      <rect x="5" y="11" width="2" height="3" fill="#15182b" />
      <rect x="9" y="11" width="2" height="3" fill="#15182b" />
      {/* feet */}
      <rect x="5" y="14" width="2" height="1" fill="#0b0d1a" />
      <rect x="9" y="14" width="2" height="1" fill="#0b0d1a" />
      {/* arms */}
      <rect x="4" y="7" width="1" height="3" fill={skin} />
      <rect x="11" y="7" width="1" height="3" fill={skin} />
      {/* sleeping z if resting */}
      {resting && (
        <text x="11" y="3" fontSize="3" fill="#00d9ff" fontFamily="VT323">z</text>
      )}
    </svg>
  );
}
