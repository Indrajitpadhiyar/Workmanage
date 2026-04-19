import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, Settings, LogOut, Briefcase, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/lib/context/SidebarContext';

interface SidebarProps {
  role: 'admin' | 'member';
}

export function Sidebar({ role }: SidebarProps) {
  const { isOpen, close } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Tasks', href: '/admin/tasks', icon: CheckSquare },
    { name: 'Team Members', href: '/admin/members', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const memberLinks = [
    { name: 'Dashboard', href: '/member', icon: LayoutDashboard },
    { name: 'My Tasks', href: '/member/tasks', icon: CheckSquare },
    { name: 'Portfolio', href: '/member/portfolio', icon: Briefcase },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const links = role === 'admin' ? adminLinks : memberLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={close}
        ></div>
      )}

      <div className={cn(
        "w-72 h-screen bg-[#003631] text-white flex flex-col fixed left-0 top-0 overflow-y-auto z-50 transition-transform duration-500 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white/10 border border-white/20 p-1">
              <img src="/logo.png" alt="IDR TaskFlow Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black tracking-tight">IDR TaskFlow</span>
          </div>
          <button
            onClick={close}
            className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-8 py-6 flex items-center gap-4 border-y border-white/5 mb-8 bg-black/5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 overflow-hidden border border-white/10 flex items-center justify-center font-black text-[#FFEDA8] shadow-inner">
            {userData?.avatar ? (
              <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              userData?.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black truncate">{userData?.name || 'User'}</h4>
            <p className="text-[10px] font-bold text-[#FFEDA8]/60 uppercase tracking-widest">{role}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin' && link.href !== '/member' && link.href !== '/profile');

            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => close?.()}
                className={cn(
                  "flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300",
                  isActive
                    ? "bg-[#FFEDA8] text-[#003631] font-black shadow-[0_10px_20px_-5px_rgba(255,237,168,0.3)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={20} />
                <span className="text-sm uppercase tracking-widest font-black leading-none">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto space-y-2">
          <Link
            to="/profile"
            onClick={() => close?.()}
            className="flex items-center space-x-4 text-white/50 hover:text-white hover:bg-white/5 w-full px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 text-red-400/80 hover:text-red-300 hover:bg-red-500/5 w-full px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

