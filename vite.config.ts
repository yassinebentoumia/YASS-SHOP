import type { User, Product, Order, PaymentRoom, ChatMessage, Transaction, Notification } from '../types';

const KEYS = {
  users: 'ys_users',
  products: 'ys_products',
  orders: 'ys_orders',
  rooms: 'ys_rooms',
  messages: 'ys_messages',
  transactions: 'ys_transactions',
  notifications: 'ys_notifications',
  session: 'ys_session',
  cart: 'ys_cart',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUsers: () => read<User[]>(KEYS.users, []),
  setUsers: (u: User[]) => write(KEYS.users, u),
  getProducts: () => read<Product[]>(KEYS.products, []),
  setProducts: (p: Product[]) => write(KEYS.products, p),
  getOrders: () => read<Order[]>(KEYS.orders, []),
  setOrders: (o: Order[]) => write(KEYS.orders, o),
  getRooms: () => read<PaymentRoom[]>(KEYS.rooms, []),
  setRooms: (r: PaymentRoom[]) => write(KEYS.rooms, r),
  getMessages: () => read<ChatMessage[]>(KEYS.messages, []),
  setMessages: (m: ChatMessage[]) => write(KEYS.messages, m),
  getTransactions: () => read<Transaction[]>(KEYS.transactions, []),
  setTransactions: (t: Transaction[]) => write(KEYS.transactions, t),
  getNotifications: () => read<Notification[]>(KEYS.notifications, []),
  setNotifications: (n: Notification[]) => write(KEYS.notifications, n),
  getSession: () => read<string | null>(KEYS.session, null),
  setSession: (id: string | null) => write(KEYS.session, id),
  getCart: () => read<string[]>(KEYS.cart, []),
  setCart: (c: string[]) => write(KEYS.cart, c),
};

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
