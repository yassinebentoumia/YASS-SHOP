import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Package, Headphones, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductPhoto from '../components/ProductPhoto';
import toast from 'react-hot-toast';
import { fmt } from '../utils/currency';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, user } = useApp();
  const p = products.find((x) => x.id === id);

  if (!p) {
    return (
      <div className="pt-32 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Product not found</h1>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </div>
    );
  }

  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
            <ProductPhoto imageKey={p.image} title={p.title} className="h-full" />
          </div>
          <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
            {p.featured && <span className="px-3 py-1.5 text-xs font-bold rounded-md gradient-red">FEATURED</span>}
            {p.trending && <span className="px-3 py-1.5 text-xs font-bold rounded-md bg-amber-500 text-black">TRENDING</span>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="text-xs font-bold tracking-widest text-red-400 uppercase mb-3">{p.category}</div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">{p.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(p.rating) ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
              ))}
              <span className="text-sm font-semibold ml-1">{p.rating}</span>
              <span className="text-sm text-white/50">({p.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <CheckCircle2 className="w-4 h-4" /> In stock ({p.stock})
            </div>
          </div>
          <p className="text-white/70 leading-relaxed mb-8">{p.description}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-5xl font-black gradient-text">{fmt(p.price)}</span>
            {p.originalPrice && p.originalPrice > p.price && (
              <span className="text-xl text-white/40 line-through">{fmt(p.originalPrice)}</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { i: Zap, t: 'Fast Delivery' },
              { i: ShieldCheck, t: 'Verified Staff' },
              { i: Headphones, t: 'Live Support' },
            ].map((f) => (
              <div key={f.t} className="glass rounded-xl p-3 text-center">
                <f.i className="w-5 h-5 mx-auto mb-1 text-red-400" />
                <div className="text-[10px] font-semibold uppercase tracking-wider">{f.t}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (!user) {
                  toast.error('Please sign in first');
                  navigate('/auth');
                  return;
                }
                addToCart(p.id);
                toast.success('Added to cart');
              }}
              className="btn-primary flex-1 min-w-[160px]"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button
              onClick={() => {
                if (!user) {
                  toast.error('Please sign in first');
                  navigate('/auth');
                  return;
                }
                addToCart(p.id);
                navigate('/cart');
              }}
              className="btn-ghost flex-1 min-w-[160px]"
            >
              <Package className="w-5 h-5" /> Buy Now
            </button>
          </div>

          <div className="mt-8 p-5 glass rounded-2xl">
            <div className="text-xs font-bold uppercase tracking-wider mb-3 text-white/60">Delivery Process</div>
            <ol className="space-y-2 text-sm text-white/70">
              <li className="flex gap-2"><span className="text-red-400 font-bold">1.</span> Add to cart & checkout.</li>
              <li className="flex gap-2"><span className="text-red-400 font-bold">2.</span> Choose a payment method (D17, Flouci, Crypto, Balance).</li>
              <li className="flex gap-2"><span className="text-red-400 font-bold">3.</span> A 20-min private chat room opens with our staff.</li>
              <li className="flex gap-2"><span className="text-red-400 font-bold">4.</span> Staff sends your code via email (even for balance payments).</li>
            </ol>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-black mb-6">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((r, i) => <ProductCard key={r.id} p={r} i={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
