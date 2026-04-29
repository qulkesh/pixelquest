import type { Item, Rarity } from '../types/game';

interface Props {
  item: Item;
  size?: number;
  withFrame?: boolean;
}

const RARITY_BG: Record<Rarity, string> = {
  common: '#1d2140', rare: '#1f2e58', epic: '#3a1f58', legendary: '#5e3f1c'
};
const RARITY_GLOW: Record<Rarity, string> = {
  common: 'rgba(154,163,196,0.0)',
  rare: 'rgba(61,139,255,0.45)',
  epic: 'rgba(176,77,255,0.55)',
  legendary: 'rgba(255,174,0,0.65)'
};

interface Pal { main: string; shadow: string; accent: string }
function pal(rarity: Rarity): Pal {
  switch (rarity) {
    case 'rare':      return { main: '#3d8bff', shadow: '#1f4ea8', accent: '#a3c8ff' };
    case 'epic':      return { main: '#b04dff', shadow: '#5e1f9c', accent: '#e0b3ff' };
    case 'legendary': return { main: '#ffae00', shadow: '#a86b00', accent: '#fff0c2' };
    default:          return { main: '#9aa3c4', shadow: '#5a6486', accent: '#dde2f5' };
  }
}

function R(x: number, y: number, c: string, w = 1, h = 1, key?: string) {
  return <rect key={key ?? `${x}-${y}-${c}`} x={x} y={y} width={w} height={h} fill={c} shapeRendering="crispEdges" />;
}

// ===== Sprite definitions per slot/key. ViewBox 16x16 =====

function Sword(p: Pal, key: string) {
  // tall blade with cross guard
  const colorByKey: Record<string, Pal> = {
    sword_iron:   { main: '#c4cad8', shadow: '#7d8398', accent: '#ffffff' },
    sword_silver: { main: '#dce6ff', shadow: '#5e7099', accent: '#ffffff' },
    sword_dragon: { main: '#ffae3a', shadow: '#9c4a00', accent: '#fff0c2' }
  };
  const c = colorByKey[key] ?? p;
  return (
    <g>
      {R(7, 1, c.accent, 1, 9, 'b-hl')}
      {R(8, 1, c.main, 2, 9, 'b')}
      {R(10, 2, c.shadow, 1, 8, 'b-sh')}
      {R(8, 10, c.main, 2, 1, 'tip-1')}
      {R(7, 10, c.shadow, 1, 1, 'tip-2')}
      {R(5, 11, '#ffd76a', 6, 1, 'guard')}
      {R(8, 12, '#3a2517', 2, 3, 'hilt')}
      {R(7, 14, '#ffd76a', 4, 1, 'pommel')}
    </g>
  );
}

function Armor(p: Pal, key: string) {
  const isSteel = key === 'armor_steel';
  const c = isSteel ? { main: '#c4cad8', shadow: '#5e6486', accent: '#ffffff' } :
                       { main: '#7a4d2c', shadow: '#3d2616', accent: '#a36b3f' };
  return (
    <g>
      {R(3, 4, c.main, 10, 9, 'body')}
      {R(3, 4, c.accent, 10, 1, 'top-hl')}
      {R(11, 5, c.shadow, 2, 8, 'shadow')}
      {R(3, 4, c.shadow, 1, 9, 'edge-l')}
      {R(7, 6, c.shadow, 2, 1, 'neck')}
      {R(2, 5, c.main, 1, 4, 'pauldron-l')}
      {R(13, 5, c.main, 1, 4, 'pauldron-r')}
      {R(3, 12, '#1c1024', 10, 1, 'bottom')}
    </g>
  );
}

function Helmet(p: Pal) {
  return (
    <g>
      {R(3, 5, p.main, 10, 6, 'crown')}
      {R(3, 5, p.accent, 10, 1, 'hl')}
      {R(11, 6, p.shadow, 2, 5, 'shadow')}
      {R(7, 7, p.shadow, 2, 3, 'visor')}
      {R(3, 11, '#1c1024', 10, 1, 'rim')}
      {R(2, 6, p.main, 1, 4, 'side-l')}
      {R(13, 6, p.main, 1, 4, 'side-r')}
    </g>
  );
}

function Boots(p: Pal) {
  return (
    <g>
      {R(3, 8, p.main, 4, 5, 'boot-l')}
      {R(9, 8, p.main, 4, 5, 'boot-r')}
      {R(3, 12, '#1c1024', 4, 1, 'sole-l')}
      {R(9, 12, '#1c1024', 4, 1, 'sole-r')}
      {R(3, 8, p.accent, 4, 1, 'top-l-hl')}
      {R(9, 8, p.accent, 4, 1, 'top-r-hl')}
      {R(2, 9, p.shadow, 1, 3, 'edge-l')}
      {R(8, 9, p.shadow, 1, 3, 'mid')}
    </g>
  );
}

function Amulet(p: Pal) {
  return (
    <g>
      {/* chain */}
      {R(5, 3, '#ffd76a', 1, 1)}
      {R(6, 4, '#ffd76a', 1, 1)}
      {R(7, 5, '#ffd76a', 2, 1)}
      {R(9, 4, '#ffd76a', 1, 1)}
      {R(10, 3, '#ffd76a', 1, 1)}
      {/* gem */}
      {R(6, 6, p.shadow, 4, 5, 'gem-back')}
      {R(7, 7, p.main, 2, 3, 'gem')}
      {R(7, 7, p.accent, 1, 1, 'gem-hl')}
      {R(7, 11, p.shadow, 2, 1, 'gem-bottom')}
    </g>
  );
}

function Book(p: Pal) {
  return (
    <g>
      {R(2, 3, '#3d2616', 12, 10, 'cover')}
      {R(3, 4, p.main, 10, 8, 'page-bg')}
      {R(3, 4, p.accent, 10, 1, 'top-hl')}
      {R(8, 4, '#3d2616', 1, 8, 'spine')}
      {R(4, 6, '#0b0d1a', 3, 1)}
      {R(4, 8, '#0b0d1a', 3, 1)}
      {R(10, 6, '#0b0d1a', 3, 1)}
      {R(10, 8, '#0b0d1a', 3, 1)}
    </g>
  );
}

function Gadget(p: Pal) {
  // pomodoro timer / clock
  return (
    <g>
      {R(4, 3, p.main, 8, 9, 'body')}
      {R(4, 3, p.accent, 8, 1, 'hl')}
      {R(4, 11, p.shadow, 8, 1, 'sh')}
      {R(7, 1, p.main, 2, 2, 'top-knob')}
      {R(5, 5, '#0b0d1a', 6, 5, 'screen')}
      {R(7, 7, '#3dff9a', 1, 2, 'hand')}
      {R(8, 6, '#3dff9a', 1, 1, 'tick')}
    </g>
  );
}

function Tool(p: Pal) {
  // journal / notebook
  return (
    <g>
      {R(3, 2, p.main, 10, 12, 'book')}
      {R(3, 2, p.accent, 10, 1, 'top')}
      {R(3, 13, p.shadow, 10, 1, 'bottom')}
      {R(4, 4, '#fff', 8, 1)}
      {R(4, 6, '#fff', 8, 1)}
      {R(4, 8, '#fff', 8, 1)}
      {R(4, 10, '#fff', 5, 1)}
      {R(2, 3, '#7a4d2c', 1, 10, 'spine')}
    </g>
  );
}

function Potion(_p: Pal, key: string) {
  const liquid = key === 'potion_big' ? '#3dff9a' : '#ff4d6d';
  return (
    <g>
      {R(7, 1, '#cdd2e4', 2, 2, 'cap')}
      {R(7, 3, '#9aa3c4', 2, 1, 'neck')}
      {R(5, 4, '#cdd2e4', 6, 1, 'shoulder')}
      {R(4, 5, '#cdd2e4', 8, 9, 'glass')}
      {R(5, 6, liquid, 6, 7, 'liquid')}
      {R(5, 6, '#ffffff66', 1, 6, 'glass-hl')}
      {R(4, 13, '#9aa3c4', 8, 1, 'glass-b')}
    </g>
  );
}

function Chest(_p: Pal, key: string) {
  const tone = key === 'chest_epic' ? { wood: '#7a4dff', metal: '#ffae00' }
            : key === 'chest_rare' ? { wood: '#3d8bff', metal: '#ffd76a' }
            : { wood: '#7a4d2c', metal: '#ffd76a' };
  return (
    <g>
      {R(2, 5, tone.wood, 12, 9, 'box')}
      {R(2, 4, tone.wood, 12, 2, 'lid')}
      {R(2, 5, tone.metal, 12, 1, 'rim-top')}
      {R(2, 13, tone.metal, 12, 1, 'rim-bot')}
      {R(7, 8, tone.metal, 2, 4, 'lock')}
      {R(7, 9, '#0b0d1a', 2, 1, 'keyhole')}
      {R(2, 4, '#0b0d1a', 1, 10, 'edge-l')}
      {R(13, 4, '#0b0d1a', 1, 10, 'edge-r')}
    </g>
  );
}

function Booster(p: Pal) {
  return (
    <g>
      {R(7, 2, p.accent, 2, 12, 'star-v')}
      {R(2, 7, p.accent, 12, 2, 'star-h')}
      {R(7, 6, p.main, 2, 4, 'star-c')}
      {R(6, 7, p.main, 4, 2, 'star-c2')}
      {R(7, 7, '#fff', 2, 2, 'sparkle')}
    </g>
  );
}

function Cosmetic(p: Pal) {
  return (
    <g>
      {[3,4,5,6,7,8,9,10,11,12].map((x) => R(x, 8, p.accent, 1, 1, `r-${x}`))}
      {[3,4,5,6,7,8,9,10,11,12].map((y) => R(8, y, p.accent, 1, 1, `c-${y}`))}
      {R(6, 6, p.main, 4, 4, 'core')}
      {R(7, 7, '#fff', 2, 2, 'core-hl')}
    </g>
  );
}

function Background(p: Pal, key: string) {
  if (key === 'background_night') {
    return (
      <g>
        {R(0, 0, '#0b0d1a', 16, 16, 'bg')}
        {R(2, 2, '#fff', 1, 1)}{R(5, 4, '#fff', 1, 1)}{R(11, 3, '#fff', 1, 1)}
        {R(13, 7, '#fff', 1, 1)}{R(3, 11, '#fff', 1, 1)}{R(9, 12, '#fff', 1, 1)}
        {R(11, 9, '#cdd2e4', 3, 3, 'moon')}
        {R(11, 9, '#fff', 1, 1, 'moon-hl')}
      </g>
    );
  }
  // dawn
  return (
    <g>
      {R(0, 0, '#ffae00', 16, 8, 'sky')}
      {R(0, 8, '#ff5c8a', 16, 4, 'mid')}
      {R(0, 12, '#3a2a1f', 16, 4, 'ground')}
      {R(6, 5, '#fff0c2', 4, 4, 'sun')}
      {R(7, 6, '#fff', 2, 2, 'sun-hl')}
    </g>
  );
}

// Rarity sparkle for legendary items
function LegendarySparkle() {
  return (
    <g opacity={0.9}>
      <rect x="1"  y="1"  width="1" height="1" fill="#fff0c2" />
      <rect x="14" y="2"  width="1" height="1" fill="#fff0c2" />
      <rect x="2"  y="13" width="1" height="1" fill="#fff0c2" />
      <rect x="13" y="14" width="1" height="1" fill="#fff0c2" />
    </g>
  );
}

export default function ItemSprite({ item, size = 56, withFrame = true }: Props) {
  const p = pal(item.rarity);
  let sprite: JSX.Element;
  switch (item.slot) {
    case 'weapon':     sprite = Sword(p, item.key); break;
    case 'armor':      sprite = Armor(p, item.key); break;
    case 'helmet':     sprite = Helmet(p); break;
    case 'boots':      sprite = Boots(p); break;
    case 'amulet':     sprite = Amulet(p); break;
    case 'book':       sprite = Book(p); break;
    case 'gadget':     sprite = Gadget(p); break;
    case 'tool':       sprite = Tool(p); break;
    case 'potion':     sprite = Potion(p, item.key); break;
    case 'chest':      sprite = Chest(p, item.key); break;
    case 'booster':    sprite = Booster(p); break;
    case 'cosmetic':   sprite = Cosmetic(p); break;
    case 'background': sprite = Background(p, item.key); break;
    default:           sprite = <text x="2" y="11" fontSize="10" fill={p.main} fontFamily="VT323">{item.icon}</text>;
  }

  return (
    <div
      className="relative inline-block"
      style={{
        width: size, height: size,
        background: withFrame ? RARITY_BG[item.rarity] : 'transparent',
        boxShadow: withFrame ? `inset 0 0 0 2px #0b0d1a, 0 0 12px ${RARITY_GLOW[item.rarity]}` : undefined,
        border: withFrame ? `2px solid ${p.shadow}` : 'none'
      }}
    >
      <svg viewBox="0 0 16 16" width={size} height={size} style={{ imageRendering: 'pixelated' }}>
        {sprite}
        {item.rarity === 'legendary' && <LegendarySparkle />}
      </svg>
    </div>
  );
}
