import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Wallet, Shield, Headphones } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NotificationsBell from './NotificationsBell';
import { fmt } from '../utils/currency';

export default function Navbar() {
  const { user, logout, cart } = useApp();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-red flex items-center justify-center font-black text-white text-lg shadow-lg shadow-red-900/50 group-hover:scale-110 transition-transform">
              Y
            </div>
            <div className="leading-none">
              <div className="font-black text-lg tracking-tight">YASS<span className="text-red-500">SHOP</span></div>
              <div className="text-[10px] text-white/50 tracking-widest">PREMIUM DIGITAL</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'text-red-400' : 'text-white/70 hover:text-white hover:bg-white/5'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-white/5 transition">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-red text-[10px] font-bold flex items-center justify-center neon-soft">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <NotificationsBell />
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className="w-8 h-8 rounded-full gradient-red flex items-center justify-center text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left leading-tight">
                      <div className="text-sm font-semibold">{user.name}</div>
                      <div className="text-[10px] text-white/50 capitalize flex items-center gap-1">
                        {user.role === 'admin' && <Shield className="w-3 h-3 text-red-400" />}
                        {user.role === 'staff' && <Headphones className="w-3 h-3 text-blue-400" />}
                        {user.role}
                      </div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-64 glass-strong rounded-2xl p-2 overflow-hidden"
                      >
                        <div className="px-3 py-2 border-b border-white/10 mb-1">
                          <div className="text-sm font-semibold">{user.name}</div>
                          <div className="text-xs text-white/50">{user.email}</div>
                          <div className="mt-2 text-xs text-green-400 font-semibold">
                            Balance: {fmt(user.balance)}
                          </div>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link
                          to="/wallet"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                        >
                          <Wallet className="w-4 h-4" /> Wallet
                        </Link>
                        {user.role === 'staff' && (
                          <Link
                            to="/staff"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-blue-400"
                          >
                            <Headphones className="w-4 h-4" /> Staff Panel
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-red-400"
                          >
                            <Shield className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-red-400"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link to="/auth" className="btn-primary text-sm !py-2.5 !px-4">
                <User className="w-4 h-4" /> Sign In
              </Link>
            )}

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-white/5 transition"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden glass-strong border-t border-white/10 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-2">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/products', label: 'Products' },
                  { to: '/about', label: 'About' },
                  { to: '/contact', label: 'Contact' },
                ].map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-white/5 text-sm"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
