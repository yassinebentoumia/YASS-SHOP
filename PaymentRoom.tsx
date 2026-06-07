import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, Shield, CheckCircle2, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

// Email verification storage
const VERIFICATION_KEY = 'ys_verifications';

interface PendingVerification {
  email: string;
  code: string;
  expiresAt: number;
  userData: { name: string; email: string; password: string; phone?: string };
}

function getVerifications(): Record<string, PendingVerification> {
  try {
    return JSON.parse(localStorage.getItem(VERIFICATION_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveVerifications(v: Record<string, PendingVerification>) {
  localStorage.setItem(VERIFICATION_KEY, JSON.stringify(v));
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default function Auth() {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login');
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const iv = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(iv);
  }, [countdown]);

  const startVerification = () => {
    if (!form.name) return toast.error('Name required');
    if (!form.email) return toast.error('Email required');
    if (!isValidEmail(form.email)) return toast.error('Please enter a valid email address');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');

    const code = generateCode();
    const verifications = getVerifications();
    
    // Store pending verification (10 minutes expiry)
    verifications[form.email.toLowerCase()] = {
      email: form.email.toLowerCase(),
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
      userData: { name: form.name, email: form.email.toLowerCase(), password: form.password, phone: form.phone },
    };
    saveVerifications(verifications);

    // Show "email sent" message (code is stored for demo purposes)
    toast.success('Verification code sent to your email!', { duration: 5000 });
    
    setPendingEmail(form.email);
    setMode('verify');
    setCountdown(60); // 60 seconds before can resend
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) return toast.error('Enter 6-digit code');
    
    const verifications = getVerifications();
    const pending = verifications[pendingEmail.toLowerCase()];
    
    if (!pending) return toast.error('Verification expired. Please register again.');
    if (Date.now() > pending.expiresAt) {
      delete verifications[pendingEmail.toLowerCase()];
      saveVerifications(verifications);
      return toast.error('Code expired. Please register again.');
    }
    if (pending.code !== verificationCode) return toast.error('Invalid code. Please try again.');
    
    // Code is valid - complete registration
    const r = await register(pending.userData);
    if (r.ok) {
      // Clear verification
      delete verifications[pendingEmail.toLowerCase()];
      saveVerifications(verifications);
      
      toast.success('Email verified! Account created.');
      navigate('/');
    } else {
      toast.error(r.error || 'Registration failed');
    }
  };

  const resendCode = () => {
    if (countdown > 0) return;
    
    const verifications = getVerifications();
    const pending = verifications[pendingEmail.toLowerCase()];
    
    if (!pending) return toast.error('Session expired. Please start over.');
    
    const newCode = generateCode();
    pending.code = newCode;
    pending.expiresAt = Date.now() + 10 * 60 * 1000;
    saveVerifications(verifications);
    
    toast.success(`New code: ${newCode}`, { duration: 8000 });
    setCountdown(60);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      const r = await login(form.email, form.password);
      if (r.ok) {
        toast.success('Welcome back!');
        navigate('/');
      } else toast.error(r.error || 'Login failed');
    } else if (mode === 'register') {
      startVerification();
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-md mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl gradient-red flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-red-900/50 mb-4">
            {mode === 'verify' ? <Mail className="w-7 h-7" /> : 'Y'}
          </div>
          <h1 className="text-2xl font-black">
            {mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create account' : 'Verify Email'}
          </h1>
          <p className="text-sm text-white/60 mt-1">
            {mode === 'login' ? 'Sign in to your YASS-SHOP account' : 
             mode === 'register' ? 'Join thousands of happy customers' :
             `Enter the 6-digit code sent to ${pendingEmail}`}
          </p>
        </div>

        {mode !== 'verify' && (
          <div className="flex gap-2 p-1 bg-black/30 rounded-xl mb-6">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === m ? 'gradient-red text-white' : 'text-white/60'}`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
        )}

        {mode === 'verify' ? (
          // Verification form
          <div className="space-y-4">
            <div>
              <label className="label">Verification Code</label>
              <div className="relative">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input pl-11 text-center tracking-[0.5em] font-bold text-lg"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>
              <p className="text-xs text-white/40 mt-2">
                Check your email inbox (and spam folder) for the code.
              </p>
            </div>

            <button onClick={verifyCode} className="btn-primary w-full">
              <CheckCircle2 className="w-4 h-4" /> Verify & Create Account
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                onClick={resendCode}
                disabled={countdown > 0}
                className="flex items-center gap-1 text-white/60 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${countdown > 0 ? 'animate-spin' : ''}`} />
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
              </button>
              {/* Demo: Shows code for testing - remove in production */}
              <button
                onClick={() => {
                  const v = getVerifications()[pendingEmail.toLowerCase()];
                  if (v) setVerificationCode(v.code);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Demo: Show Code
              </button>
            </div>

            <button
              onClick={() => setMode('register')}
              className="w-full text-xs text-white/40 hover:text-white/60"
            >
              ← Back to registration
            </button>
          </div>
        ) : (
          // Login/Register form
          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input pl-11" placeholder="Enter your full name" />
                </div>
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  required 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  className="input pl-11" 
                  placeholder={mode === 'login' ? 'Enter your email address' : 'Use a real email address'} 
                />
              </div>
            </div>
            {mode === 'register' && (
              <div>
                <label className="label">Phone (optional)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input pl-11" placeholder="Optional phone number" />
                </div>
              </div>
            )}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  required 
                  type={showPw ? 'text' : 'password'} 
                  value={form.password} 
                  onChange={(e) => setForm({ ...form, password: e.target.value })} 
                  className="input pl-11 pr-11" 
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password'} 
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="text-xs text-white/40 mt-1">At least 6 characters</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full">
              {mode === 'login' ? 'Sign In' : 'Continue with Email Verification'}
            </button>
          </form>
        )}

        <div className="mt-6 p-3 rounded-xl bg-black/30 border border-white/5 text-[11px] text-white/50">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-white/70"><Shield className="w-3 h-3 text-red-400" /> Demo credentials</div>
          <div>User: demo@yass-shop.com / demo123</div>
          <div>Staff: staff@yass-shop.com / staff123</div>
          <div>Admin: admin@yass-shop.com / admin123</div>
        </div>
      </motion.div>
    </div>
  );
}
