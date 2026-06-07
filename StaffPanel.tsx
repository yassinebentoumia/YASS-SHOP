import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="inline-block text-xs font-bold tracking-widest text-red-400 mb-2">CONTACT</div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Get in <span className="gradient-text">touch</span></h1>
        <p className="text-white/60 max-w-2xl">Have a question? Our team is here 24/7. For order-specific support, please use your payment room chat.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {[
            { icon: Mail, t: 'Email', v: 'contact@yass-shop.com' },
            { icon: Phone, t: 'Phone', v: '+216 00 000 000' },
            { icon: MapPin, t: 'Address', v: 'Tunis, Tunisia' },
            { icon: MessageSquare, t: 'Live Support', v: 'Available 24/7 via your payment room' },
          ].map((c) => (
            <div key={c.t} className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center">
                <c.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-white/50">{c.t}</div>
                <div className="font-semibold">{c.v}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={submit} className="card p-6 space-y-4">
          <div>
            <label className="label">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input" />
          </div>
          <button type="submit" className="btn-primary w-full"><Send className="w-4 h-4" /> Send Message</button>
        </motion.form>
      </div>
    </div>
  );
}
