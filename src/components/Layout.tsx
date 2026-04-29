import { Outlet } from 'react-router-dom';
import StatsHeader from './StatsHeader';
import Sidebar from './Sidebar';
import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export default function Layout() {
  const rollDaily = useGameStore(s => s.rollDailyIfNeeded);
  useEffect(() => {
    rollDaily();
    const t = setInterval(rollDaily, 60_000);
    return () => clearInterval(t);
  }, [rollDaily]);

  return (
    <div className="relative min-h-screen z-0 max-w-7xl mx-auto p-3 md:p-6">
      <StatsHeader />
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
        <aside><Sidebar /></aside>
        <main className="space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
