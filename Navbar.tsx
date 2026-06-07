import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import WalletPage from './pages/Wallet';
import PaymentRoom from './pages/PaymentRoom';
import StaffPanel from './pages/StaffPanel';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/room/:id" element={<PaymentRoom />} />
              <Route path="/staff" element={<StaffPanel />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<div className="pt-32 text-center text-white/60">Page not found</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a22',
              color: '#f4f4f6',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef2b3e', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  );
}
