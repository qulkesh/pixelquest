// Палитры для редактора внешности и компонента Avatar.
// Возвращают пары [light, dark] для шейдинга.

export const SKIN_PALETTE: [string, string][] = [
  ['#ffe2c2', '#e6b88e'],
  ['#f6caa0', '#d99e7a'],
  ['#e0a87a', '#a76a48'],
  ['#c98e60', '#7d4d2e'],
  ['#a76a48', '#6b4631'],
  ['#7d4d2e', '#4a2a16'],
  ['#5e3a1f', '#2e1c0c'],
  ['#3a2516', '#1a0e07']
];

export const HAIR_PALETTE: [string, string][] = [
  ['#3a2a1f', '#241710'],   // brown
  ['#1c1024', '#0b0613'],   // black
  ['#ffd35a', '#c98e1a'],   // blonde
  ['#ff9c3a', '#c4540e'],   // ginger
  ['#ff5c8a', '#c4365e'],   // pink
  ['#7ad7ff', '#3a86c4'],   // cyan
  ['#b04dff', '#7820c4'],   // purple
  ['#dde2f5', '#9aa3c4']    // platinum
];

export const OUTFIT_PALETTE: [string, string][] = [
  ['#3d8bff', '#235dbf'],   // blue
  ['#3dff9a', '#1faf5e'],   // green
  ['#b04dff', '#7820c4'],   // purple
  ['#ff4d6d', '#c12648'],   // red
  ['#ff3ed1', '#b41a92'],   // pink
  ['#ffcc33', '#c98e0e'],   // yellow
  ['#1c1024', '#0b0613'],   // black
  ['#dde2f5', '#9aa3c4']    // white
];

export const EYE_PALETTE: string[] = [
  '#3a2a1f',  // brown
  '#0b0d1a',  // black
  '#3d8bff',  // blue
  '#3dff9a',  // green
  '#7a82a8',  // gray
  '#b04dff'   // purple
];

export const HAIR_STYLES = [
  'short',    // 1 — короткая
  'spiky',    // 2 — ёжик
  'long',     // 3 — длинные с боков
  'bowl',     // 4 — каре/боб
  'mohawk',   // 5 — ирокез
  'curly'     // 6 — кудряшки
] as const;

export type HairStyle = typeof HAIR_STYLES[number];

export function hairStyleByIdx(idx: number): HairStyle {
  return HAIR_STYLES[(idx - 1) % HAIR_STYLES.length] ?? 'short';
}

export function pairAt<T>(arr: [T, T][], idx: number): [T, T] {
  return arr[(Math.max(1, idx) - 1) % arr.length] ?? arr[0];
}
export function colorAt(arr: string[], idx: number): string {
  return arr[(Math.max(1, idx) - 1) % arr.length] ?? arr[0];
}
