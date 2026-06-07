import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Product, Order, PaymentRoom, ChatMessage, Transaction, Notification } from '../types';
import { api } from '../utils/api';

interface Ctx {
  user: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  rooms: PaymentRoom[];
  messages: ChatMessage[];
  transactions: Transaction[];
  notifications: Notification[];
  cart: string[];
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: Omit<User, 'id' | 'role' | 'balance' | 'createdAt'>) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateUser: (u: User) => void;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addOrder: (o: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrder: (o: Order) => void;
  openRoom: (r: Omit<PaymentRoom, 'id' | 'openedAt'>) => Promise<PaymentRoom>;
  updateRoom: (r: PaymentRoom) => void;
  sendMessage: (m: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) => void;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  notify: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationsRead: (userId?: string) => void;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [rooms, setRooms] = useState<PaymentRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  // Load initial data
  useEffect(() => {
    api.getProducts().then(setProducts);
    api.getUsers().then(setUsers);
    
    const session = localStorage.getItem('ys_session');
    if (session) {
      api.getUsers().then(us => {
        const found = us.find((u: User) => u.id === session);
        if (found) setUser(found);
      });
    }
    
    const storedCart = localStorage.getItem('ys_cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // Poll for updates
  useEffect(() => {
    if (!user) return;
    
    const iv = setInterval(() => {
      // Users see their own data, staff see all orders/rooms
      if (user.role === 'staff' || user.role === 'admin') {
        api.getOrders().then(setOrders);
        api.getRooms().then(setRooms);
        api.getNotifications(undefined, user.role).then(setNotifications);
      } else {
        api.getOrders(user.id).then(setOrders);
        api.getRooms(user.id).then(setRooms);
        api.getNotifications(user.id).then(setNotifications);
      }
      api.getTransactions(user.id).then(setTransactions);
    }, 2000);
    
    return () => clearInterval(iv);
  }, [user]);

  // Refresh user when updated
  useEffect(() => {
    if (!user) return;
    const fresh = users.find(u => u.id === user.id);
    if (fresh) setUser(fresh);
  }, [users, user?.id]);

  const login: Ctx['login'] = async (email, password) => {
    try {
      const u = await api.login(email, password);
      if (u.error) return { ok: false, error: u.error };
      localStorage.setItem('ys_session', u.id);
      setUser(u);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Login failed' };
    }
  };

  const register: Ctx['register'] = async (data) => {
    try {
      const u = await api.register(data);
      if (u.error) return { ok: false, error: u.error };
      localStorage.setItem('ys_session', u.id);
      setUser(u);
      setUsers(prev => [...prev, u]);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('ys_session');
    setUser(null);
  };

  const updateUser: Ctx['updateUser'] = async (u) => {
    await api.updateUser(u);
    setUsers(prev => prev.map(x => x.id === u.id ? u : x));
    if (user?.id === u.id) setUser(u);
  };

  const addProduct: Ctx['addProduct'] = async (p) => {
    const prod = await api.addProduct(p);
    setProducts(prev => [prod, ...prev]);
  };

  const updateProduct: Ctx['updateProduct'] = async (p) => {
    await api.updateProduct(p);
    setProducts(prev => prev.map(x => x.id === p.id ? p : x));
  };

  const deleteProduct: Ctx['deleteProduct'] = async (id) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addOrder: Ctx['addOrder'] = async (o) => {
    const order = await api.addOrder(o);
    setOrders(prev => [order, ...prev]);
    return order;
  };

  const updateOrder: Ctx['updateOrder'] = async (o) => {
    await api.updateOrder(o);
    setOrders(prev => prev.map(x => x.id === o.id ? o : x));
  };

  const openRoom: Ctx['openRoom'] = async (r) => {
    const room = await api.openRoom(r);
    setRooms(prev => [room, ...prev]);
    return room;
  };

  const updateRoom: Ctx['updateRoom'] = async (r) => {
    await api.updateRoom(r);
    setRooms(prev => prev.map(x => x.id === r.id ? r : x));
  };

  const sendMessage: Ctx['sendMessage'] = async (m) => {
    const msg = await api.sendMessage(m);
    setMessages(prev => [...prev, msg]);
  };

  const addTransaction: Ctx['addTransaction'] = async (t) => {
    const tx = await api.addTransaction(t);
    setTransactions(prev => [tx, ...prev]);
  };

  const notify: Ctx['notify'] = async (n) => {
    const nt = await api.addNotification(n);
    setNotifications(prev => [nt, ...prev]);
  };

  const markNotificationsRead: Ctx['markNotificationsRead'] = async (userId) => {
    await api.markNotificationsRead(userId);
    setNotifications(prev => prev.map(n => {
      if (userId && n.userId === userId) return { ...n, read: true };
      if (!userId && !n.userId) return { ...n, read: true };
      return n;
    }));
  };

  const addToCart: Ctx['addToCart'] = (id) => {
    const next = Array.from(new Set([...cart, id]));
    localStorage.setItem('ys_cart', JSON.stringify(next));
    setCart(next);
  };

  const removeFromCart: Ctx['removeFromCart'] = (id) => {
    const next = cart.filter(c => c !== id);
    localStorage.setItem('ys_cart', JSON.stringify(next));
    setCart(next);
  };

  const clearCart = () => {
    localStorage.removeItem('ys_cart');
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        users,
        products,
        orders,
        rooms,
        messages,
        transactions,
        notifications,
        cart,
        login,
        register,
        logout,
        updateUser,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrder,
        openRoom,
        updateRoom,
        sendMessage,
        addTransaction,
        notify,
        markNotificationsRead,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}