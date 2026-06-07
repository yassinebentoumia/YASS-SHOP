import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Wallet, MessageSquare, TrendingUp, ShoppingBag, CheckCircle2, Clock, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fmt, fmtCompact } from '../utils/currency';
import ProductPhoto from '../components/ProductPhoto';

export default function Dashboard() {
  const { user, orders, rooms, transactions } = useApp();

  if (!user) {
    return <div className="pt-32 text-center">Please sign in</div>;
  }

  const myOrders = orders.filter((o) => o.userId === user.id);
  const myRooms = rooms.filter((r) => r.userId === user.id);
  const activeRooms = myRooms.filter((r) => r.status !== 'closed');
  const myTxs = transactions.filter((t) => t.userId === user.id);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-block text-xs font-bold tracking-widest text-red-400 mb-2">DASHBOARD</div>
        <h1 className="text-4xl font-black">Hi, <span className="gradient-text">{user.name}</span> 👋</h1>
        <p className="text-white/60 mt-1">Your orders, wallet and activity at a glance.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/wallet" className="card p-5 hover:border-green-500/40">
          <Wallet className="w-6 h-6 mb-3 text-green-400" />
          <div className="text-3xl font-black gradient-text">{fmt(user.balance)}</div>
          <div className="text-xs text-white/60 mt-1">Wallet Balance</div>
        </Link>
        <div className="card p-5">
          <Package className="w-6 h-6 mb-3 text-blue-400" />
          <div className="text-3xl font-black">{myOrders.length}</div>
          <div className="text-xs text-white/60 mt-1">Total Orders</div>
        </div>
        <div className="card p-5">
          <MessageSquare className="w-6 h-6 mb-3 text-red-400" />
          <div className="text-3xl font-black">{activeRooms.length}</div>
          <div className="text-xs text-white/60 mt-1">Active Rooms</div>
        </div>
        <div className="card p-5">
          <TrendingUp className="w-6 h-6 mb-3 text-amber-400" />
          <div className="text-3xl font-black">{fmtCompact(myOrders.filter((o) => o.status === 'completed').reduce((s, o) => s + o.amount, 0))}</div>
          <div className="text-xs text-white/60 mt-1">Total Spent</div>
        </div>
      </div>

      {/* Active Rooms */}
      {activeRooms.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Active Payment Rooms
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {activeRooms.map((r) => {
              const elapsed = Date.now() - r.openedAt;
              const remaining = Math.max(0, 20 * 60 * 1000 - elapsed);
              const mins = Math.floor(remaining / 60000);
              return (
                <Link key={r.id} to={`/room/${r.id}`} className="card p-5 hover:border-red-500/40">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold">{r.productTitle}</div>
                      <div className="text-xs text-white/50">{r.paymentMethod.toUpperCase()} • {fmt(r.amount)}</div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                      r.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      r.status === 'verified' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{r.status.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono">{mins}min remaining</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Orders */}
      <div className="mb-10">
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-400" /> My Orders
        </h2>
        {myOrders.length === 0 ? (
          <div className="card p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-white/10 mb-3" />
            <div className="font-bold mb-2">No orders yet</div>
            <p className="text-sm text-white/60 mb-4">Start shopping to see your orders here.</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="divide-y divide-white/5">
              {myOrders.map((o) => {
                const room = myRooms.find((r) => r.orderId === o.id);
                return (
                  <div key={o.id} className="p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      <ProductPhoto imageKey={o.productImage} title={o.productTitle} className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm line-clamp-1">{o.productTitle}</div>
                      <div className="text-xs text-white/50">{new Date(o.createdAt).toLocaleString()} • {o.paymentMethod}</div>
                      {o.deliveredCode && (
                        <div className="text-xs text-green-400 mt-1 font-mono">Code: {o.deliveredCode}</div>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      o.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      o.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      o.status === 'closed' ? 'bg-white/10 text-white/50' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>{o.status}</span>
                    {room && (
                      <Link to={`/room/${room.id}`} className="p-2 rounded-lg hover:bg-white/10 text-white/60" title="Open room">
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Recent transactions */}
      <div>
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-400" /> Recent Activity
        </h2>
        <div className="card overflow-hidden">
          {myTxs.length === 0 ? (
            <div className="p-8 text-center text-white/40 text-sm">No activity yet</div>
          ) : (
            <div className="divide-y divide-white/5">
              {myTxs.slice(0, 10).map((t) => (
                <div key={t.id} className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'topup' ? 'bg-green-500/20 text-green-400' : t.type === 'purchase' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {t.type === 'topup' ? '+' : t.type === 'purchase' ? <ShoppingBag className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{t.description}</div>
                    <div className="text-xs text-white/50">{new Date(t.createdAt).toLocaleString()}</div>
                  </div>
                  <span className={`font-bold ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {t.amount > 0 ? '+' : '-'}{fmt(Math.abs(t.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
