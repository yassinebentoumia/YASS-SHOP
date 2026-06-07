import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle2, Clock, XCircle, Headphones, TrendingUp, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fmt } from '../utils/currency';

export default function StaffPanel() {
  const { user, rooms, orders, messages } = useApp();

  if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
    return <div className="pt-32 text-center text-red-400">Access denied. Staff only.</div>;
  }

  const activeRooms = rooms.filter((r) => r.status !== 'closed');
  const closedRooms = rooms.filter((r) => r.status === 'closed');

  // Stats
  const resolvedToday = closedRooms.filter((r) => r.closedAt && Date.now() - r.closedAt < 24 * 3600 * 1000).length;
  const totalMessages = messages.filter((m) => m.senderRole === 'staff' || m.senderRole === 'admin').length;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Headphones className="w-6 h-6 text-blue-400" />
          <div className="inline-block text-xs font-bold tracking-widest text-blue-400">STAFF DASHBOARD</div>
        </div>
        <h1 className="text-4xl font-black">Welcome, <span className="gradient-text">{user.name}</span></h1>
        <p className="text-white/60 mt-1">Monitor active rooms, verify transactions and support customers.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { n: activeRooms.length, l: 'Active Rooms', i: MessageSquare, c: 'text-red-400' },
          { n: resolvedToday, l: 'Closed Today', i: CheckCircle2, c: 'text-green-400' },
          { n: orders.length, l: 'Total Orders', i: Package, c: 'text-blue-400' },
          { n: totalMessages, l: 'Staff Replies', i: TrendingUp, c: 'text-amber-400' },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-5"
          >
            <s.i className={`w-6 h-6 mb-3 ${s.c}`} />
            <div className="text-3xl font-black">{s.n}</div>
            <div className="text-xs text-white/60 mt-1">{s.l}</div>
          </motion.div>
        ))}
      </div>

      {/* Active Rooms */}
      <div className="mb-10">
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Active Rooms
        </h2>
        {activeRooms.length === 0 ? (
          <div className="card p-12 text-center text-white/50">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-white/20" />
            No active rooms. All caught up!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {activeRooms.map((r) => {
              const elapsed = Date.now() - r.openedAt;
              const remaining = Math.max(0, 20 * 60 * 1000 - elapsed);
              const mins = Math.floor(remaining / 60000);
              const lastMsg = messages.filter((m) => m.roomId === r.id).slice(-1)[0];
              const unread = messages.filter((m) => m.roomId === r.id && !m.read && m.senderRole === 'user').length;
              return (
                <Link key={r.id} to={`/room/${r.id}`} className="card p-5 hover:border-blue-500/40">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold truncate">{r.userName}</span>
                        {unread > 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full gradient-red">{unread}</span>
                        )}
                      </div>
                      <div className="text-xs text-white/50 truncate">{r.productTitle}</div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                      r.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      r.status === 'verified' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {r.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-white/60">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{mins}min left</span>
                      <span>•</span>
                      <span className="font-bold text-red-400">{fmt(r.amount)}</span>
                    </div>
                    <div className="text-white/40 capitalize">{r.paymentMethod}</div>
                  </div>
                  {lastMsg && (
                    <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50 truncate">
                      "{lastMsg.message}"
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Closed */}
      <div>
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-white/40" /> Recent Closed
        </h2>
        <div className="card overflow-hidden">
          {closedRooms.length === 0 ? (
            <div className="p-8 text-center text-white/50 text-sm">No closed rooms yet</div>
          ) : (
            <div className="divide-y divide-white/5">
              {closedRooms.slice(0, 10).map((r) => (
                <Link key={r.id} to={`/room/${r.id}`} className="flex items-center gap-4 p-4 hover:bg-white/5 transition">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-sm">
                    {r.userName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{r.userName} — {r.productTitle}</div>
                    <div className="text-xs text-white/50">{fmt(r.amount)} • {r.paymentMethod}</div>
                  </div>
                  <div className="text-xs text-white/40">{r.closedAt ? new Date(r.closedAt).toLocaleDateString() : ''}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
