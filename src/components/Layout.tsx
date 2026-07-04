import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
