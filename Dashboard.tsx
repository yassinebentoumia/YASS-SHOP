import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Headphones, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-block text-xs font-bold tracking-widest text-red-400 mb-2">ABOUT US</div>
        <h1 className="text-4xl md:text-5xl font-black mb-6">Why YASS<span className="gradient-text">SHOP</span>?</h1>
        <p className="text-lg text-white/70 mb-10 leading-relaxed max-w-3xl">
          Founded by <span className="text-red-400 font-bold">Yassine Bentoumia</span>, YASS-SHOP is Tunisia's premium digital marketplace.
          We sell subscriptions, gift cards, gaming top-ups and software licenses — all verified and delivered by real human staff.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5 mb-16">
        {[
          { icon: Zap, t: 'Fast Delivery', d: 'Not instant — fast. Every order is manually verified by staff for your security. Typical delivery: 5-20 minutes.' },
          { icon: Headphones, t: 'Real Human Staff', d: 'You chat with real agents, not bots. They verify your payment, send your code via email, and only they can close the room.' },
          { icon: ShieldCheck, t: 'Secure Payments', d: 'D17, Flouci, Ooredoo, Bank Transfer, Bitcoin, Ethereum, USDT (TRC20/BEP20), Litecoin. All encrypted.' },
          { icon: CheckCircle2, t: 'Wallet Balance', d: 'Top-up your wallet once and pay for future orders with one click. No more entering payment details every time.' },
        ].map((f, i) => (
          <motion.div
            key={f.t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card p-6"
          >
            <f.icon className="w-8 h-8 text-red-400 mb-3" />
            <h3 className="font-bold text-lg mb-2">{f.t}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{f.d}</p>
          </motion.div>
        ))}
      </div>

      <div className="card p-8 md:p-12">
        <h2 className="text-3xl font-black mb-6">Our Process</h2>
        <div className="space-y-4">
          {[
            { n: '1', t: 'Browse & Add', d: 'Pick from our catalog of digital products.' },
            { n: '2', t: 'Choose Payment', d: 'Pay with your wallet balance, D17, Flouci, or crypto.' },
            { n: '3', t: 'Staff Chat Room', d: 'A private 20-minute chat opens with a verified staff member.' },
            { n: '4', t: 'Verify Payment', d: 'Send your payment screenshot. Staff verifies it manually.' },
            { n: '5', t: 'Code via Email', d: 'Staff sends your product code to your registered email.' },
            { n: '6', t: 'Room Closed', d: 'Only staff can close the room after delivery is confirmed.' },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center font-black shrink-0">{s.n}</div>
              <div>
                <h4 className="font-bold">{s.t}</h4>
                <p className="text-sm text-white/60">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
