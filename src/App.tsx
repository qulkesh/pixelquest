import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useGameStore } from './store/useGameStore';
import Login from './pages/Login';
import CharacterCreate from './pages/CharacterCreate';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Todos from './pages/Todos';
import Quests from './pages/Quests';
import Achievements from './pages/Achievements';
import Inventory from './pages/Inventory';
import Shop from './pages/Shop';
import Boss from './pages/Boss';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import Toasts from './components/ui/Toasts';
import LevelUpFlash from './components/ui/LevelUpFlash';
import { useEffect } from 'react';

function Protected({ children }: { children: JSX.Element }) {
  const user = useAuthStore(s => s.user);
  const ready = useAuthStore(s => s.ready);
  const profile = useGameStore(s => s.profile);
  const bootstrap = useGameStore(s => s.bootstrapForUser);

  useEffect(() => {
    if (user && (!profile || profile.id !== user.id)) bootstrap(user.id, user.email);
  }, [user?.id]);

  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<CharacterCreate />} />
        <Route element={<Protected><Layout /></Protected>}>
          <Route index element={<Dashboard />} />
          <Route path="habits" element={<Habits />} />
          <Route path="todos" element={<Todos />} />
          <Route path="quests" element={<Quests />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="shop" element={<Shop />} />
          <Route path="boss" element={<Boss />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toasts />
      <LevelUpFlash />
    </BrowserRouter>
  );
}
