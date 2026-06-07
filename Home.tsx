import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Package, Users, Headphones, Plus, TrendingUp, DollarSign, ShoppingCart, Trash2, Edit3, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { productIconMap } from '../data/seed';
import toast from 'react-hot-toast';
import { fmt, fmtCompact } from '../utils/currency';
import ProductPhoto from '../components/ProductPhoto';

export default function AdminPanel() {
  const { user, products, users, orders, addProduct, updateProduct, deleteProduct } = useApp();
  const [tab, setTab] = useState<'overview' | 'products' | 'orders' | 'users' | 'staff'>('overview');

  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newP, setNewP] = useState({
    title: '',
    description: '',
    category: 'Streaming',
    price: 0,
    originalPrice: 0,
    image: 'netflix',
    stock: 10,
    rating: 4.8,
    reviews: 0,
    delivery: 'Fast Delivery',
    featured: false,
    bestSeller: false,
    trending: false,
    code: '',
  });

  if (!user || user.role !== 'admin') {
    return <div className="pt-32 text-center text-red-400">Access denied. Admin only.</div>;
  }

  const totalRevenue = orders.filter((o) => o.status === 'completed').reduce((s, o) => s + o.amount, 0);

  const saveNew = () => {
    if (!newP.title || !newP.price) return toast.error('Title and price required');
    addProduct({
      ...newP,
      code: newP.code || ('GEN-' + Math.random().toString(36).slice(2, 10).toUpperCase()),
    });
    toast.success('Product added');
    setShowNew(false);
    setNewP({ title: '', description: '', category: 'Streaming', price: 0, originalPrice: 0, image: 'netflix', stock: 10, rating: 4.8, reviews: 0, delivery: 'Fast Delivery', featured: false, bestSeller: false, trending: false, code: '' });
  };

  const iconOptions = Object.keys(productIconMap);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-red-400" />
          <div className="inline-block text-xs font-bold tracking-widest text-red-400">ADMIN PANEL</div>
        </div>
        <h1 className="text-4xl font-black">Control Center</h1>
        <p className="text-white/60 mt-1">Manage your entire marketplace from here.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'overview', l: 'Overview', i: TrendingUp },
          { id: 'products', l: 'Products', i: Package },
          { id: 'orders', l: 'Orders', i: ShoppingCart },
          { id: 'users', l: 'Users', i: Users },
          { id: 'staff', l: 'Staff', i: Headphones },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              tab === t.id ? 'gradient-red text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <t.i className="w-4 h-4" /> {t.l}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { n: fmtCompact(totalRevenue), l: 'Total Revenue', i: DollarSign, c: 'text-green-400' },
              { n: orders.length, l: 'Total Orders', i: ShoppingCart, c: 'text-blue-400' },
              { n: products.length, l: 'Products', i: Package, c: 'text-amber-400' },
              { n: users.length, l: 'Users', i: Users, c: 'text-purple-400' },
            ].map((s) => (
              <div key={s.l} className="card p-5">
                <s.i className={`w-6 h-6 mb-3 ${s.c}`} />
                <div className="text-3xl font-black">{s.n}</div>
                <div className="text-xs text-white/60 mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Package className="w-4 h-4" /> Recent Products</h3>
              <div className="space-y-2">
                {products.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 text-sm">
                    <div className="text-2xl">{productIconMap[p.image]?.emoji}</div>
                    <div className="flex-1 truncate">{p.title}</div>
                    <div className="font-bold text-red-400">{fmt(p.price)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Recent Orders</h3>
              <div className="space-y-2">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{o.productTitle}</span>
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      o.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      o.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>{o.status}</span>
                    <span className="font-bold ml-2">{fmt(o.amount)}</span>
                  </div>
                ))}
                {orders.length === 0 && <div className="text-sm text-white/40">No orders yet</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      {tab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black">Products ({products.length})</h2>
            <button onClick={() => setShowNew(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add Product</button>
          </div>

          {showNew && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6 border-red-500/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Add New Product</h3>
                <button onClick={() => setShowNew(false)} className="p-1 hover:bg-white/10 rounded"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Title *</label>
                  <input value={newP.title} onChange={(e) => setNewP({ ...newP, title: e.target.value })} className="input" placeholder="Netflix Premium 1 Month" />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select value={newP.category} onChange={(e) => setNewP({ ...newP, category: e.target.value })} className="input">
                    {['Streaming', 'Gaming', 'Top-Ups', 'Gift Cards', 'Software'].map((c) => <option key={c} className="bg-black">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Price *</label>
                  <input type="number" value={newP.price} onChange={(e) => setNewP({ ...newP, price: Number(e.target.value) })} className="input" />
                </div>
                <div>
                  <label className="label">Original Price</label>
                  <input type="number" value={newP.originalPrice} onChange={(e) => setNewP({ ...newP, originalPrice: Number(e.target.value) })} className="input" />
                </div>
                <div>
                  <label className="label">Icon Style</label>
                  <select value={newP.image} onChange={(e) => setNewP({ ...newP, image: e.target.value })} className="input">
                    {iconOptions.map((k) => <option key={k} className="bg-black">{k} {productIconMap[k].emoji}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Custom Icon Emoji (optional)</label>
                  <input value={newP.image} onChange={(e) => setNewP({ ...newP, image: e.target.value })} className="input" placeholder="netflix or 🎬" />
                </div>
                <div>
                  <label className="label">Stock</label>
                  <input type="number" value={newP.stock} onChange={(e) => setNewP({ ...newP, stock: Number(e.target.value) })} className="input" />
                </div>
                <div>
                  <label className="label">Product Code</label>
                  <input value={newP.code} onChange={(e) => setNewP({ ...newP, code: e.target.value })} className="input" placeholder="ABC-12345" />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Description</label>
                  <textarea value={newP.description} onChange={(e) => setNewP({ ...newP, description: e.target.value })} className="input" rows={3} />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Upload Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setNewP({ ...newP, image: reader.result as string });
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-sm text-white/60"
                  />
                  <p className="text-[11px] text-white/40 mt-1">Or use a predefined icon above</p>
                </div>
                <div className="md:col-span-2 flex gap-2 flex-wrap">
                  {['featured', 'bestSeller', 'trending'].map((f) => (
                    <label key={f} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={(newP as any)[f]} onChange={(e) => setNewP({ ...newP, [f]: e.target.checked })} />
                      {f}
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={saveNew} className="btn-primary mt-4"><Save className="w-4 h-4" /> Save Product</button>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const isEditing = editing === p.id;
              return (
                <div key={p.id} className="card p-4">
                  <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                    <ProductPhoto imageKey={p.image} title={p.title} className="w-full h-full" />
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input value={p.title} onChange={(e) => updateProduct({ ...p, title: e.target.value })} className="input text-sm" />
                      <input type="number" value={p.price} onChange={(e) => updateProduct({ ...p, price: Number(e.target.value) })} className="input text-sm" />
                      <input type="number" value={p.stock} onChange={(e) => updateProduct({ ...p, stock: Number(e.target.value) })} className="input text-sm" placeholder="Stock" />
                      <button onClick={() => { setEditing(null); toast.success('Updated'); }} className="btn-primary w-full !py-2 text-sm"><Save className="w-4 h-4" /> Save</button>
                    </div>
                  ) : (
                    <>
                      <div className="font-bold text-sm line-clamp-1">{p.title}</div>
                      <div className="text-xs text-white/50 mb-2">{p.category}</div>
                      <div className="flex items-center justify-between">
                        <span className="font-black gradient-text">{fmt(p.price)}</span>
                        <div className="flex gap-1">
                          <button onClick={() => setEditing(p.id)} className="p-2 rounded-lg hover:bg-white/10"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => { if (confirm('Delete?')) deleteProduct(p.id); }} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ORDERS */}
      {tab === 'orders' && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h3 className="font-bold">All Orders ({orders.length})</h3>
          </div>
          <div className="divide-y divide-white/5">
            {orders.length === 0 && <div className="p-8 text-center text-white/40">No orders yet</div>}
            {orders.map((o) => (
              <div key={o.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{o.productTitle}</div>
                  <div className="text-xs text-white/50">{new Date(o.createdAt).toLocaleString()} • {o.paymentMethod}</div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                  o.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  o.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                  o.status === 'closed' ? 'bg-white/10 text-white/50' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{o.status}</span>
                <span className="font-bold">{fmt(o.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS */}
      {tab === 'users' && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h3 className="font-bold">All Users ({users.length})</h3>
          </div>
          <div className="divide-y divide-white/5">
            {users.map((u) => (
              <div key={u.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full gradient-red flex items-center justify-center font-bold">{u.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{u.name}</div>
                  <div className="text-xs text-white/50 truncate">{u.email}</div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold capitalize ${
                  u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                  u.role === 'staff' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-white/10 text-white/70'
                }`}>{u.role}</span>
                <span className="text-sm text-green-400 font-bold">{fmt(u.balance)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STAFF */}
      {tab === 'staff' && (
        <div>
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="font-bold">Staff Members ({users.filter((u) => u.role === 'staff').length})</h3>
            </div>
            <div className="divide-y divide-white/5">
              {users.filter((u) => u.role === 'staff').map((u) => (
                <div key={u.id} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">{u.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{u.name}</div>
                    <div className="text-xs text-white/50 truncate">{u.email}</div>
                  </div>
                  <span className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online</span>
                </div>
              ))}
              {users.filter((u) => u.role === 'staff').length === 0 && <div className="p-8 text-center text-white/40">No staff yet</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
