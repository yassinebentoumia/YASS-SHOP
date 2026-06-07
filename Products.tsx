import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Bitcoin, Wallet, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import { fmt } from '../utils/currency';
import ProductPhoto from '../components/ProductPhoto';

const paymentMethods = [
  { id: 'balance', name: 'Wallet Balance', desc: 'Pay instantly with your balance', icon: Wallet, color: 'from-green-500 to-emerald-700' },
  { id: 'd17', name: 'D17', desc: 'Tunisia postal', icon: CreditCard, color: 'from-yellow-500 to-orange-600' },
  { id: 'flouci', name: 'Flouci', desc: 'Mobile payment', icon: CreditCard, color: 'from-purple-500 to-pink-600' },
  { id: 'ooredoo', name: 'Ooredoo Cards', desc: 'Mobile carrier', icon: CreditCard, color: 'from-red-500 to-red-700' },
  { id: 'bank', name: 'Bank Transfer', desc: 'Manual transfer', icon: CreditCard, color: 'from-blue-500 to-indigo-700' },
  { id: 'btc', name: 'Bitcoin', desc: 'BTC network', icon: Bitcoin, color: 'from-orange-500 to-amber-600' },
  { id: 'eth', name: 'Ethereum', desc: 'ERC-20', icon: Bitcoin, color: 'from-indigo-500 to-purple-700' },
  { id: 'usdt', name: 'USDT TRC20', desc: 'Tron network', icon: Bitcoin, color: 'from-emerald-500 to-green-700' },
];

export default function Checkout() {
  const { cart, products, user, addOrder, openRoom, sendMessage, clearCart, updateUser, addTransaction, notify } = useApp();
  const navigate = useNavigate();
  const [method, setMethod] = useState('');

  const items = cart.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  const total = items.reduce((s, p) => s + (p?.price || 0), 0);

  if (!user) {
    return (
      <div className="pt-32 text-center">
        <p className="text-white/60 mb-4">Please sign in to checkout</p>
        <button onClick={() => navigate('/auth')} className="btn-primary">Sign In</button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 text-center">
        <p className="text-white/60 mb-4">Your cart is empty</p>
        <button onClick={() => navigate('/products')} className="btn-primary">Browse Products</button>
      </div>
    );
  }

  const proceed = async () => {
    if (!method) return toast.error('Please select a payment method');

    // Wallet balance payment - also goes through staff verification room
    if (method === 'balance') {
      if (user.balance < total) {
        return toast.error(`Insufficient balance. You need ${fmt(total - user.balance)} more.`);
      }
      
      // Deduct balance immediately
      const newBalance = user.balance - total;
      await updateUser({ ...user, balance: newBalance });
      await addTransaction({ userId: user.id, type: 'purchase', amount: -total, description: `Purchase via balance: ${items.length} item(s)` });

      // Open payment room for staff to verify and send code
      const productTitles = items.map((p) => p?.title).join(', ');
      const orderId = await addOrder({
        userId: user.id,
        productId: items[0]!.id,
        productTitle: productTitles,
        productImage: items[0]!.image,
        amount: total,
        paymentMethod: 'balance',
        status: 'pending',
      });

      const room = await openRoom({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        orderId: orderId.id,
        productTitle: productTitles,
        productImage: items[0]!.image,
        amount: total,
        paymentMethod: 'balance',
        status: 'open',
        type: 'purchase',
      });

      await sendMessage({
        roomId: room.id,
        senderId: user.id,
        senderName: user.name,
        senderRole: 'user',
        message: `Hello, I paid ${fmt(total)} via my wallet balance. Waiting for my code to be sent to email.`,
      });

      // Notify staff
      notify({ role: 'staff', title: 'New Balance Purchase', message: `${user.name} paid ${fmt(total)} with wallet balance. Send the code.`, type: 'order', link: `/room/${room.id}` });
      // Notify admin too
      notify({ role: 'admin', title: 'Balance Purchase', message: `${user.name} paid ${fmt(total)} with balance.`, type: 'order', link: `/room/${room.id}` });
      // Notify customer
      notify({ userId: user.id, title: 'Payment Confirmed', message: `Your payment of ${fmt(total)} was processed. Staff will send your code to ${user.email} shortly.`, type: 'payment' });

      clearCart();
      toast.success('Payment sent! A staff member will deliver your code.');
      navigate(`/room/${room.id}`);
      return;
    }

    // Staff-verified payment - open a payment room
    const productTitles = items.map((p) => p?.title).join(', ');
    const orderId = await addOrder({
      userId: user.id,
      productId: items[0]!.id,
      productTitle: productTitles,
      productImage: items[0]!.image,
      amount: total,
      paymentMethod: method,
      status: 'pending',
    });

    const room = await openRoom({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      orderId: orderId.id,
      productTitle: productTitles,
      productImage: items[0]!.image,
      amount: total,
      paymentMethod: method,
      status: 'open',
      type: 'purchase',
    });

    await sendMessage({
      roomId: room.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'user',
      message: `Hello, I'd like to complete my purchase of: ${productTitles}. Total: ${fmt(total)}`,
    });

    notify({ role: 'staff', title: 'New Payment Room', message: `${user.name} opened a room for ${fmt(total)}`, type: 'order', link: `/staff` });

    clearCart();
    toast.success('Payment room opened. A staff member will be with you shortly.');
    navigate(`/room/${room.id}`);
  };

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black mb-2">Checkout</h1>
        <p className="text-white/60 mb-8">Choose your payment method. Our staff will verify and deliver.</p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div>
          <div className="grid sm:grid-cols-2 gap-3">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                disabled={m.id === 'balance' && user.balance < total}
                className={`card p-5 text-left transition ${method === m.id ? 'border-red-500/50 neon-soft' : ''} ${m.id === 'balance' && user.balance < total ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                  <m.icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-bold mt-2">{m.name}</div>
                <div className="text-xs text-white/50">{m.desc}</div>
                {m.id === 'balance' && (
                  <div className="mt-2 text-xs text-green-400 font-semibold">Available: {fmt(user.balance)}</div>
                )}
              </button>
            ))}
          </div>

          {method && method !== 'balance' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 card p-5 border-blue-500/30">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div className="text-sm text-white/80">
                  <div className="font-bold text-white mb-1">How it works</div>
                  A private 20-minute chat room will open with our verified staff. You'll send your payment proof, the staff verifies it, and your code is sent to <span className="text-red-400 font-semibold">{user.email}</span>. Only staff can close the room.
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <aside className="card p-6 h-fit sticky top-24">
          <h3 className="font-bold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {items.map((p) => {
              if (!p) return null;
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <ProductPhoto imageKey={p.image} title={p.title} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold line-clamp-1">{p.title}</div>
                    <div className="text-xs text-white/50">{p.category}</div>
                  </div>
                  <div className="font-bold text-sm">{fmt(p.price)}</div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between items-center mb-4">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-black gradient-text">{fmt(total)}</span>
          </div>
          <button onClick={proceed} disabled={!method} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {method === 'balance' ? 'Pay with Balance' : 'Open Payment Room'}
          </button>
          {user && (
            <div className="mt-4 text-xs text-center text-white/50">
              Your balance: <span className="text-green-400 font-semibold">{fmt(user.balance)}</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}