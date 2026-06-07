import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/seed';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const { products } = useApp();
  const [params, setParams] = useSearchParams();
  const initialCat = params.get('cat') || 'all';
  const [cat, setCat] = useState(initialCat);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');

  useEffect(() => {
    const c = params.get('cat');
    if (c) setCat(c);
  }, [params]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== 'all') list = list.filter((p) => p.category === cat);
    if (search) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'featured') list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [products, cat, search, sort]);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="inline-block text-xs font-bold tracking-widest text-red-400 mb-2">CATALOG</div>
        <h1 className="text-4xl sm:text-5xl font-black mb-3">All <span className="gradient-text">Products</span></h1>
        <p className="text-white/60">Premium digital products, subscriptions & gift cards.</p>
      </motion.div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="card p-5 h-fit sticky top-24">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-white/60">Categories</h3>
          <div className="space-y-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCat(c.id);
                  if (c.id === 'all') setParams({});
                  else setParams({ cat: c.id });
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition ${
                  cat === c.id ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'hover:bg-white/5 text-white/70 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{c.icon}</span>
                  <span className="font-medium">{c.name}</span>
                </span>
                <span className="text-xs text-white/40">
                  {c.id === 'all' ? products.length : products.filter((p) => p.category === c.id).length}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input pl-11"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <SlidersHorizontal className="w-4 h-4 text-white/40" />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent text-sm outline-none cursor-pointer">
                <option value="featured" className="bg-black">Featured</option>
                <option value="price-asc" className="bg-black">Price: Low → High</option>
                <option value="price-desc" className="bg-black">Price: High → Low</option>
                <option value="rating" className="bg-black">Top Rated</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="card p-12 text-center text-white/50">No products found</div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
