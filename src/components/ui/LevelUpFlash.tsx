import { useUiStore } from '../../store/useUiStore';

export default function LevelUpFlash() {
  const on = useUiStore(s => s.levelUpFlash);
  if (!on) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div className="pixel-frame px-8 py-6 animate-levelup bg-gold/10 border-gold">
        <div className="font-pixel text-2xl uppercase tracking-widest text-gold neon-text">LEVEL UP!</div>
      </div>
    </div>
  );
}
