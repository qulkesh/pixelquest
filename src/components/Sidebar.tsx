import { NavLink } from 'react-router-dom';
import { useT } from '../hooks/useT';

const items: { to: string; key: string; icon: string }[] = [
  { to: '/',             key: 'nav.dashboard',    icon: '⌂' },
  { to: '/habits',       key: 'nav.habits',       icon: '✦' },
  { to: '/todos',        key: 'nav.todos',        icon: '☑' },
  { to: '/quests',       key: 'nav.quests',       icon: '✸' },
  { to: '/achievements', key: 'nav.achievements', icon: '★' },
  { to: '/inventory',    key: 'nav.inventory',    icon: '☷' },
  { to: '/shop',         key: 'nav.shop',         icon: '$' },
  { to: '/boss',         key: 'nav.boss',         icon: '☠' }
];

export default function Sidebar() {
  const t = useT();
  return (
    <nav className="pixel-frame p-2 flex md:flex-col flex-row gap-1 sticky top-2 z-10">
      {items.map(it => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.to === '/'}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-2 border-2 border-transparent hover:border-frame transition
             ${isActive ? 'bg-cyan/10 border-cyan text-cyan' : 'text-muted hover:text-ink'}`
          }
        >
          <span className="font-pixel text-sm w-4 text-center">{it.icon}</span>
          <span className="hidden md:inline font-pixel text-[10px] uppercase tracking-widest">{t(it.key)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
