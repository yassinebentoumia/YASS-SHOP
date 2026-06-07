@import "tailwindcss";

:root {
  --bg: #07070a;
  --bg-2: #0d0d12;
  --panel: #111118;
  --panel-2: #17171f;
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.14);
  --red: #ef2b3e;
  --red-2: #c41e31;
  --text: #f4f4f6;
  --text-dim: #9aa0a8;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  min-height: 100vh;
  background: #050507;
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

body {
  background:
    radial-gradient(circle at 20% 0%, rgba(239, 43, 62, 0.12), transparent 45%),
    radial-gradient(circle at 80% 80%, rgba(239, 43, 62, 0.08), transparent 50%),
    linear-gradient(180deg, #050507 0%, #08080c 100%);
  background-attachment: fixed;
}

::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: #07070a; }
::-webkit-scrollbar-thumb { background: #2a1117; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: var(--red-2); }

::selection { background: var(--red); color: #fff; }

@layer utilities {
  .glass {
    background: rgba(18, 18, 26, 0.55);
    backdrop-filter: blur(16px) saturate(140%);
    -webkit-backdrop-filter: blur(16px) saturate(140%);
    border: 1px solid var(--border);
  }
  .glass-strong {
    background: rgba(20, 20, 30, 0.75);
    backdrop-filter: blur(22px) saturate(160%);
    border: 1px solid var(--border-strong);
  }
  .neon {
    box-shadow:
      0 0 0 1px rgba(239, 43, 62, 0.4),
      0 0 24px rgba(239, 43, 62, 0.25),
      0 0 60px rgba(239, 43, 62, 0.12);
  }
  .neon-soft {
    box-shadow: 0 0 30px rgba(239, 43, 62, 0.15);
  }
  .gradient-text {
    background: linear-gradient(135deg, #fff 0%, #ef2b3e 50%, #fff 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shimmer 4s linear infinite;
  }
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all duration-300;
    background: linear-gradient(135deg, #ef2b3e 0%, #9b1222 100%);
    box-shadow: 0 8px 24px -6px rgba(239, 43, 62, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 32px -6px rgba(239, 43, 62, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  .btn-ghost {
    @apply inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border);
    color: var(--text);
  }
  .btn-ghost:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--border-strong);
  }
  .card {
    @apply rounded-2xl;
    background: linear-gradient(180deg, rgba(24, 24, 34, 0.85) 0%, rgba(14, 14, 20, 0.85) 100%);
    backdrop-filter: blur(14px);
    border: 1px solid var(--border);
    transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .card:hover {
    border-color: rgba(239, 43, 62, 0.35);
    transform: translateY(-4px);
    box-shadow: 0 20px 50px -20px rgba(239, 43, 62, 0.3);
  }
  .input {
    @apply w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition;
  }
  .label {
    @apply text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block;
  }
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(239, 43, 62, 0.6); }
  70% { box-shadow: 0 0 0 20px rgba(239, 43, 62, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 43, 62, 0); }
}

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-pulse-ring { animation: pulse-ring 2s infinite; }

.bg-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.gradient-red {
  background: linear-gradient(135deg, #ef2b3e 0%, #7a0e1c 100%);
}

.mask-fade-b {
  mask-image: linear-gradient(180deg, #000 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(180deg, #000 60%, transparent 100%);
}

/* chat bubbles */
.bubble-user {
  background: linear-gradient(135deg, #ef2b3e, #9b1222);
  color: white;
}
.bubble-staff {
  background: rgba(30, 30, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f4f4f6;
}

/* hide scrollbar utility */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }
