import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fmt } from '../utils/currency';
import ProductPhoto from '../components/ProductPhoto';

export default function Cart() {
  const { cart, products, removeFromCart, clearCart, user } = useApp();
  const navigate = useNavigate();
  const items = cart.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  const total = items.reduce((s, p) => s + (p?.price || 0), 0);

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 max-w-2xl mx-auto px-4 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto text-white/20 mb-4" />
        <h1 className="text-3xl font-black mb-3">Your cart is empty</h1>
        <p className="text-white/60 mb-6">Browse our catalog and find something you love.</p>
        <Link to="/products" className="btn-primary">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Continue shopping
      </button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black mb-8">Your <span className="gradient-text">Cart</span></h1>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {items.map((p) => {
            if (!p) return null;
            return (
              <div key={p.id} className="card p-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <ProductPhoto imageKey={p.image} title={p.title} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${p.id}`} className="font-bold hover:text-red-400 line-clamp-1">{p.title}</Link>
                  <div className="text-xs text-white/50">{p.category} • Fast Delivery</div>
                  <div className="text-lg font-black gradient-text mt-1">{fmt(p.price)}</div>
                </div>
                <button onClick={() => removeFromCart(p.id)} className="p-2.5 rounded-lg hover:bg-red-500/20 text-red-400 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          <button onClick={clearCart} className="text-xs text-white/40 hover:text-red-400 mt-2">Clear cart</button>
        </div>

        <aside className="card p-6 h-fit sticky top-24">
          <h3 className="font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between"><span className="text-white/60">Items</span><span>{items.length}</span></div>
            <div className="flex justify-between"><span className="text-white/60">Subtotal</span><span>{fmt(total)}</span></div>
            <div className="flex justify-between"><span className="text-white/60">Delivery</span><span className="text-green-400">Fast</span></div>
          </div>
          <div className="border-t border-white/10 pt-4 mb-4 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-black gradient-text">{fmt(total)}</span>
          </div>
          <button
            onClick={() => {
              if (!user) {
                toast.error('Please sign in first');
                navigate('/auth');
                return;
              }
              navigate('/checkout');
            }}
            className="btn-primary w-full"
          >
            Proceed to Checkout
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
