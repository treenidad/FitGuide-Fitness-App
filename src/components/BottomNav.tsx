import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, ClipboardList, TrendingUp, Brain } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/exercises', icon: Dumbbell, label: 'Exercises' },
  { path: '/workout-builder', icon: ClipboardList, label: 'Builder' },
  { path: '/ai-coach', icon: Brain, label: 'AI Coach' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-gray-900 border-t border-gray-800 flex items-stretch">
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
        return (
          <Link
            key={path}
            to={path}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${
              active ? 'text-orange-400' : 'text-gray-500'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
            {path === '/ai-coach' && active && (
              <span className="absolute top-1.5 bg-orange-500 w-1.5 h-1.5 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
