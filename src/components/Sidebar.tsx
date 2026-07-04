import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Dumbbell, ClipboardList, TrendingUp,
  Brain, User, Settings, Zap, BookOpen
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/exercises', icon: Dumbbell, label: 'Exercises' },
  { path: '/workout-builder', icon: ClipboardList, label: 'Builder' },
  { path: '/plans', icon: BookOpen, label: 'Plans' },
  { path: '/ai-coach', icon: Brain, label: 'AI Coach' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-gray-800 min-h-screen fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg glow-orange">
          <Zap size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-white tracking-wide">FitGuide</h1>
          <p className="text-xs text-gray-500">Your Fitness Coach</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
              }`}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors ${active ? 'text-orange-400' : 'text-gray-500 group-hover:text-gray-300'}`}
              />
              {label}
              {path === '/ai-coach' && (
                <span className="ml-auto text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-semibold">AI</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom CTA */}
      <div className="p-4 border-t border-gray-800">
        <Link to="/active-workout" className="block">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-center hover:opacity-90 transition-opacity">
            <Zap size={20} className="mx-auto mb-1.5 text-white" />
            <p className="text-sm font-bold text-white">Start Workout</p>
            <p className="text-xs text-orange-100 mt-0.5">Begin training now</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
