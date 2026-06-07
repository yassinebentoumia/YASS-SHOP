import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';
import { fmt } from '../utils/currency';
import ProductPhoto from './ProductPhoto';

export default function ProductCard({ p, i = 0 }: { p: Product; i?: number }) {
  const { addToCart, user } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: i * 0.05 }}
      className="card group overflow-hidden"
    >
      <Link to={`/products/${p.id}`} className="block">
        <div className="relative">
          <ProductPhoto imageKey={p.image} title={p.title} className="h-48" />
          <div className="absolute top-3 left-3 flex gap-1 pointer-events-none">
            {p.featured && (
              <span className="px-2 py-1 text-[10px] font-bold rounded-md gradient-red text-white shadow-lg shadow-red-900/50">FEATURED</span>
            )}
            {p.trending && (
              <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-amber-500 text-black">TRENDING</span>
            )}
            {p.bestSeller && !p.featured && !p.trending && (
              <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-purple-500 text-white">BEST</span>
            )}
          </div>
          {p.originalPrice && p.originalPrice > p.price && (
            <div className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded-md gradient-red text-white shadow-lg shadow-red-900/50">
              -{Math.round((1 - p.price / p.originalPrice) * 100)}%
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">{p.category}</span>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{p.rating}</span>
              <span className="text-white/40">({p.reviews})</span>
            </div>
          </div>
          <h3 className="font-bold text-base leading-tight mb-1 group-hover:text-red-400 transition-colors line-clamp-1">
            {p.title}
          </h3>
          <p className="text-xs text-white/50 line-clamp-2 mb-4">{p.description}</p>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black gradient-text">{fmt(p.price)}</span>
                {p.originalPrice && p.originalPrice > p.price && (
                  <span className="text-xs text-white/40 line-through">{fmt(p.originalPrice)}</span>
                )}
              </div>
              <div className="text-[10px] text-white/40 mt-1">{p.stock} in stock</div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!user) {
                  window.location.href = '/auth';
                  return;
                }
                addToCart(p.id);
              }}
              className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center text-white shadow-lg shadow-red-900/50 hover:scale-110 transition"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
