import React, { useState, useEffect } from 'react';
import { Search, Bell, CheckCircle2, Menu, ArrowLeft } from 'lucide-react';
import { useSidebar } from '@/lib/context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '@/lib/api-config';


interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function Header({ title, showBack }: HeaderProps) {
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/notifications/mark-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) setUser(JSON.parse(updatedUser));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userProfileUpdated', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userProfileUpdated', handleStorageChange);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const prevUnreadCountRef = React.useRef(0);

  useEffect(() => {
    if (unreadCount > prevUnreadCountRef.current) {
        if (typeof window !== 'undefined') {
            const audio = new window.Audio('/notification.mp3');
            audio.play().catch(err => console.log('Audio playback prevented:', err));
        }
    }
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {showBack ? (
            <button 
                onClick={() => navigate(-1)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all flex items-center justify-center"
            >
                <ArrowLeft size={24} />
            </button>
        ) : (
            <button 
                onClick={toggle}
                className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
            >
                <Menu size={24} />
            </button>
        )}
        <h1 className="text-xl sm:text-2xl font-black text-[#003631] tracking-tight truncate max-w-[150px] sm:max-w-none">
            {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="relative hidden xl:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#FFEDA8] w-[200px]"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-2 sm:p-2.5 rounded-xl transition-all ${
                        showNotifications ? 'bg-gray-100 text-[#003631]' : 'text-gray-500 hover:text-[#003631] hover:bg-gray-50'
                    }`}
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {showNotifications && (
                    <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-sm font-black text-[#003631]">Notifications</h3>
                            <button onClick={markAllAsRead} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Clear All</button>
                        </div>
                        <div className="max-h-[350px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center italic text-xs text-gray-400">All caught up!</div>
                            ) : (
                                notifications.map(n => (
                                    <div key={n._id} className={`p-4 border-b border-gray-50 flex gap-3 ${!n.isRead ? 'bg-emerald-50/20' : ''}`}>
                                        <div className="w-8 h-8 rounded-lg bg-[#FFEDA8] flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={16} className="text-[#003631]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-[#003631] truncate">{n.title}</p>
                                            <p className="text-[10px] text-gray-500 leading-tight line-clamp-2">{n.message}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 sm:pl-6 sm:border-l border-gray-100">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-[#003631] leading-none mb-1">{user?.name || '...'}</p>
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{user?.designation || user?.role}</p>
                </div>
                <div className="w-10 h-10 rounded-xl border-2 border-[#FFEDA8] bg-gray-50 overflow-hidden flex items-center justify-center font-black text-[#003631] shadow-inner text-sm">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        user?.name?.charAt(0) || '?'
                    )}
                </div>
            </div>
        </div>
      </div>
    </header>
  );
}

