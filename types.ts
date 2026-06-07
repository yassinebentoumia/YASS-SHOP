import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Headphones, TrendingUp, Star, Users, Package, Award, ChevronDown, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { products } = useApp();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const trending = products.filter((p) => p.trending || p.bestSeller).slice(0, 8);

  return (
    <div className="pt-24">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950/30 to-black" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full gradient-red blur-[120px] opacity-30 animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-red-600/30 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
          <div className="absolute inset-0 bg-grid opacity-40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Fast Delivery • Trusted by 15,000+ customers
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
              Premium<br />
              <span className="gradient-text">Digital</span><br />
              Marketplace
            </h1>
            <p className="text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
              Subscriptions, gift cards, gaming top-ups and software licenses. Powered by real human agents and lightning-fast delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary text-base">
                Browse Products <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="btn-ghost text-base">
                How It Works
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 max-w-md">
              {[
                { n: '15K+', l: 'Customers' },
                { n: '99%', l: 'Satisfaction' },
                { n: '24/7', l: 'Live Support' },
              ].map((s) => (
                <div key={s.l} className="glass rounded-xl p-4">
                  <div className="text-2xl font-black gradient-text">{s.n}</div>
                  <div className="text-xs text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-8 gradient-red rounded-full blur-3xl opacity-30" />
            <div className="relative grid grid-cols-2 gap-4">
              {featured.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p.id}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                >
                  <ProductCard p={p} i={i} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 animate-float">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-white/5 bg-black/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-white/40">
            {['D17', 'Flouci', 'Ooredoo', 'Bitcoin', 'USDT', 'Ethereum', 'Litecoin', 'Bank Transfer'].map((p) => (
              <div key={p} className="text-sm font-bold tracking-widest hover:text-white transition">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-bold tracking-widest text-red-400 mb-3">WHY CHOOSE US</div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Built for <span className="gradient-text">speed & trust</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">We don't pretend to be instant. We promise fast, verified and human-confirmed delivery every time.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Zap, t: 'Fast Delivery', d: 'Orders verified and delivered by real staff within minutes.' },
            { icon: ShieldCheck, t: 'Secure Payments', d: 'D17, Flouci, Crypto, Bank Transfer — encrypted & safe.' },
            { icon: Headphones, t: 'Real Human Staff', d: 'Chat with verified agents, not bots. Every transaction monitored.' },
            { icon: TrendingUp, t: 'Best Prices', d: 'Dynamic pricing with transparent exchange rates & margins.' },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center mb-4 neon-soft">
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.t}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-block text-xs font-bold tracking-widest text-red-400 mb-2">HOT RIGHT NOW</div>
            <h2 className="text-3xl sm:text-4xl font-black">Trending Products</h2>
          </div>
          <Link to="/products" className="btn-ghost text-sm">View All <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {trending.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 my-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass-strong rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 gradient-red rounded-full blur-3xl opacity-20" />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { n: '15,000+', l: 'Happy Customers', i: Users },
                { n: '50,000+', l: 'Orders Delivered', i: Package },
                { n: '4.9/5', l: 'Average Rating', i: Star },
                { n: '#1', l: 'In Tunisia', i: Award },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <s.i className="w-8 h-8 mx-auto mb-3 text-red-400" />
                  <div className="text-3xl md:text-4xl font-black gradient-text">{s.n}</div>
                  <div className="text-xs md:text-sm text-white/60 mt-1">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-bold tracking-widest text-red-400 mb-3">PROCESS</div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">How <span className="gradient-text">YASS-SHOP</span> works</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {[
            { n: '01', t: 'Pick a Product', d: 'Choose your subscription, card or top-up from our catalog.' },
            { n: '02', t: 'Choose Payment', d: 'D17, Flouci, Crypto or your wallet balance.' },
            { n: '03', t: 'Live Staff Room', d: 'A 20-minute private chat opens with our verified staff.' },
            { n: '04', t: 'Get Your Code', d: 'Staff verifies payment and sends your code via email.' },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative card p-6"
            >
              <div className="text-5xl font-black gradient-text opacity-30 mb-2">{s.n}</div>
              <h3 className="font-bold text-lg mb-2">{s.t}</h3>
              <p className="text-sm text-white/60">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-bold tracking-widest text-red-400 mb-3">TESTIMONIALS</div>
          <h2 className="text-4xl sm:text-5xl font-black">Loved by our <span className="gradient-text">community</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: 'Ahmed B.', t: 'Netflix account delivered in 8 minutes. Real staff, real service. Highly recommended!', r: 5 },
            { n: 'Sara M.', t: 'I top-up my PUBG UC every week here. The wallet balance feature is super convenient.', r: 5 },
            { n: 'Youssef K.', t: 'Staff is professional and patient. Payment verified and code sent to my email fast.', r: 5 },
          ].map((t, i) => (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.r }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-4">"{t.t}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full gradient-red flex items-center justify-center font-bold text-sm">
                  {t.n.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.n}</div>
                  <div className="text-xs text-white/50">Verified Customer</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-bold tracking-widest text-red-400 mb-3">FAQ</div>
          <h2 className="text-4xl sm:text-5xl font-black">Frequently <span className="gradient-text">asked</span></h2>
        </div>
        <div className="space-y-3">
          {[
            { q: 'How fast is the delivery?', a: 'Fast — not instant. Every order is manually verified by our staff for your security, usually within 5 to 20 minutes.' },
            { q: 'What payment methods do you accept?', a: 'D17, Flouci, Ooredoo cards, bank transfer, Bitcoin, Ethereum, USDT (TRC20/BEP20), Litecoin, and your YASS-SHOP wallet balance.' },
            { q: 'How does the staff chat room work?', a: 'After you choose a payment method, a private 20-minute chat room opens with a real staff member. They verify your payment and send your code via email. Only staff can close the room.' },
            { q: 'Can I top-up my wallet and pay with balance?', a: 'Yes. Add funds via any payment method, and use your balance for one-click purchases later.' },
            { q: 'Is it safe?', a: 'All transactions are verified by real staff, screenshots are reviewed, codes are sent to your registered email. We never auto-release without confirmation.' },
          ].map((f, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 group"
            >
              <summary className="flex items-center justify-between cursor-pointer font-semibold list-none">
                {f.q}
                <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-sm text-white/70 mt-3 leading-relaxed">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center glass-strong">
          <div className="absolute inset-0 gradient-red opacity-20" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 gradient-red rounded-full blur-3xl opacity-30" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to shop <span className="gradient-text">premium</span>?</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">Join thousands of happy customers getting their digital products delivered fast.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/products" className="btn-primary text-base">Start Shopping <ArrowRight className="w-5 h-5" /></Link>
              <Link to="/auth" className="btn-ghost text-base">Create Account</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
