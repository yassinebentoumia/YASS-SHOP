import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Zap, ShieldCheck, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/5 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center font-black text-white shadow-lg shadow-red-900/50">
                Y
              </div>
              <div className="font-black text-lg">YASS<span className="text-red-500">SHOP</span></div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Premium digital marketplace. Subscriptions, gift cards, top-ups & software delivered with speed and trust.
            </p>
            <div className="flex gap-3 mt-4">
              {['𝕏', 'in', 'f', 'ig'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 flex items-center justify-center text-xs font-bold transition">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 tracking-wider uppercase">Shop</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/products" className="hover:text-red-400">All Products</Link></li>
              <li><Link to="/products?cat=Streaming" className="hover:text-red-400">Streaming</Link></li>
              <li><Link to="/products?cat=Gaming" className="hover:text-red-400">Gaming</Link></li>
              <li><Link to="/products?cat=Gift Cards" className="hover:text-red-400">Gift Cards</Link></li>
              <li><Link to="/products?cat=Top-Ups" className="hover:text-red-400">Top-Ups</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 tracking-wider uppercase">Support</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/contact" className="hover:text-red-400">Contact Us</Link></li>
              <li><Link to="/dashboard" className="hover:text-red-400">My Orders</Link></li>
              <li><Link to="/about" className="hover:text-red-400">FAQ</Link></li>
              <li><a href="#" className="hover:text-red-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-red-400">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 tracking-wider uppercase">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-red-400" /> contact@yass-shop.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-red-400" /> +216 00 000 000</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-400" /> Tunis, Tunisia</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs text-white/40 mb-2">Secure payments</div>
              <div className="flex flex-wrap gap-2">
                {['D17', 'Flouci', 'BTC', 'USDT', 'ETH'].map((p) => (
                  <span key={p} className="px-2 py-1 text-[10px] rounded bg-white/5 border border-white/10 font-mono">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/40">
            © 2026 YASS-SHOP by <span className="text-red-400">Yassine Bentoumia</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-red-400" /> Fast Delivery</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-red-400" /> Secure</span>
            <span className="flex items-center gap-1"><Headphones className="w-3 h-3 text-red-400" /> 24/7 Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
