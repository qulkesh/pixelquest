import { Outlet } from 'react-router-dom';
import StatsHeader from './StatsHeader';
import Sidebar from './Sidebar';
import { useEffect, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { findItemById } from '../lib/seedData';

export default function Layout() {
  const rollDaily = useGameStore(s => s.rollDailyIfNeeded);
  const inventory = useGameStore(s => s.inventory);

  useEffect(() => {
    rollDaily();
    const t = setInterval(rollDaily, 60_000);
    return () => clearInterval(t);
  }, [rollDaily]);

  // Активный фон — экипированный предмет slot=background
  const bgStyle = useMemo(() => {
    const eq = inventory.find(r => r.equipped && findItemById(r.item_id)?.slot === 'background');
    if (!eq) return undefined;
    const it = findItemById(eq.item_id); if (!it) return undefined;
    return BACKGROUND_STYLES[it.key];
  }, [inventory]);

  // Активная косметика — аура у героя — на сайт навешиваем мягкое свечение
  const auraOn = inventory.some(r => {
    if (!r.equipped) return false;
    const it = findItemById(r.item_id);
    return it?.slot === 'cosmetic' && it.key === 'cosmetic_neon';
  });

  return (
    <>
      {bgStyle && (
        <div
          aria-hidden
          style={{
            position: 'fixed', inset: 0, zIndex: -1,
            backgroundImage: bgStyle, backgroundSize: 'cover', backgroundPosition: 'center'
          }}
        />
      )}
      {bgStyle && (
        <div aria-hidden style={{
          position: 'fixed', inset: 0, zIndex: -1,
          background: 'linear-gradient(180deg, rgba(11,13,26,0.55) 0%, rgba(11,13,26,0.85) 100%)'
        }} />
      )}

      <div className={`relative min-h-screen z-0 max-w-7xl mx-auto p-3 md:p-6 ${auraOn ? 'pq-aura' : ''}`}>
        <StatsHeader />
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
          <aside><Sidebar /></aside>
          <main className="space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

const BACKGROUND_STYLES: Record<string, string> = {
  background_dawn:
    'linear-gradient(180deg, #ffae00 0%, #ff5c8a 45%, #b04dff 70%, #3a2a1f 100%)',
  background_night:
    'radial-gradient(ellipse at 75% 25%, rgba(255,255,255,0.18) 0%, transparent 35%), ' +
    'linear-gradient(180deg, #0b0d1a 0%, #1d2140 60%, #3d1a4a 100%)'
};
