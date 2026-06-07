import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShoppingBag, CreditCard, MessageSquare, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotificationsBell() {
  const { user, notifications, markNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) return null;

  const mine = notifications
    .filter((n) => n.userId === user.id || (!n.userId && (user.role === 'staff' || user.role === 'admin')))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 20);
  const unreadCount = mine.filter((n) => !n.read).length;

  const iconFor = (type: string) => {
    if (type === 'order') return <ShoppingBag className="w-4 h-4 text-blue-400" />;
    if (type === 'payment') return <CreditCard className="w-4 h-4 text-green-400" />;
    if (type === 'message') return <MessageSquare className="w-4 h-4 text-amber-400" />;
    return <Bell className="w-4 h-4 text-white/60" />;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen(!open);
          if (!open && unreadCount > 0) {
            // mark read after a short delay so user sees the list first
            setTimeout(() => markNotificationsRead(user.role === 'user' ? user.id : undefined), 500);
          }
        }}
        className="relative p-2.5 rounded-xl hover:bg-white/5 transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full gradient-red text-[10px] font-bold flex items-center justify-center animate-pulse-ring">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[360px] max-w-[90vw] glass-strong rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">Notifications</div>
                <div className="text-[10px] text-white/50">{unreadCount} unread</div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => markNotificationsRead(user.role === 'user' ? user.id : undefined)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {mine.length === 0 ? (
                <div className="p-8 text-center text-sm text-white/40">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No notifications yet
                </div>
              ) : (
                mine.map((n) => (
                  <Link
                    key={n.id}
                    to={n.link || '#'}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition ${!n.read ? 'bg-red-500/5' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'bg-red-500/20' : 'bg-white/5'}`}>
                      {iconFor(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm ${!n.read ? 'font-bold' : 'font-medium'}`}>{n.title}</div>
                      <div className="text-xs text-white/60 line-clamp-2 mt-0.5">{n.message}</div>
                      <div className="text-[10px] text-white/40 mt-1">
                        {new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full gradient-red mt-1.5 shrink-0" />}
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
