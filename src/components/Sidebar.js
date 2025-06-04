'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Home, Car, Send, Inbox, PlusCircle, LocateIcon, LogOut, LayoutDashboard,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const NavItem = ({ href, icon: Icon, label }) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition ${
        pathname === href ? 'bg-gray-200 font-medium' : ''
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );

  if (!isClient || !isLoggedIn) return null;

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-md flex flex-col justify-between">
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-blue-600">RidePool</h2>

        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem href="/rides/nearby" icon={LocateIcon} label="Nearby Rides" />
        <NavItem href="/post-ride" icon={PlusCircle} label="Post a Ride" />
        <NavItem href="/rides" icon={Car} label="All Rides" />
        <NavItem href="/rides/requests/received" icon={Inbox} label="Join Requests" />
        <NavItem href="/rides/requests/sent" icon={Send} label="Sent Requests" />
      </div>

      <div className="p-4 border-t">
        <div className="text-sm text-gray-600 mb-2">
          Hello, <span className="font-semibold">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
