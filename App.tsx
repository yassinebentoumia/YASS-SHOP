import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(join(__dirname, '../dist')));

// Data file paths
const DATA_DIR = join(__dirname, 'data');
const FILES = {
  users: join(DATA_DIR, 'users.json'),
  products: join(DATA_DIR, 'products.json'),
  orders: join(DATA_DIR, 'orders.json'),
  rooms: join(DATA_DIR, 'rooms.json'),
  messages: join(DATA_DIR, 'messages.json'),
  transactions: join(DATA_DIR, 'transactions.json'),
  notifications: join(DATA_DIR, 'notifications.json'),
};

// Initialize data files
function initData() {
  if (!existsSync(DATA_DIR)) {
    import('fs').then(fs => fs.mkdirSync(DATA_DIR, { recursive: true }));
  }
  Object.values(FILES).forEach(file => {
    if (!existsSync(file)) {
      writeFileSync(file, '[]');
    }
  });
}

// Read/write helpers
function readData(key) {
  try {
    return JSON.parse(readFileSync(FILES[key], 'utf8'));
  } catch {
    return [];
  }
}

function writeData(key, data) {
  writeFileSync(FILES[key], JSON.stringify(data, null, 2));
}

// Initialize on startup
initData();

// Seed initial data if empty
const seedProducts = [
  { id: 'p1', title: 'Netflix Premium 1 Month', description: '4K Ultra HD, 4 screens, unlimited streaming.', category: 'Streaming', price: 35, originalPrice: 50, image: 'netflix', stock: 50, rating: 4.9, reviews: 1284, featured: true, bestSeller: true, trending: true, delivery: 'Fast Delivery', code: 'NFLX-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
  { id: 'p2', title: 'Spotify Premium 3 Months', description: 'Ad-free music, offline downloads.', category: 'Streaming', price: 45, originalPrice: 60, image: 'spotify', stock: 40, rating: 4.8, reviews: 892, featured: true, bestSeller: true, delivery: 'Fast Delivery', code: 'SPTF-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
  { id: 'p3', title: 'Steam Wallet $25', description: 'Digital gift card for Steam.', category: 'Gaming', price: 92, originalPrice: 100, image: 'steam', stock: 30, rating: 4.9, reviews: 654, bestSeller: true, delivery: 'Fast Delivery', code: 'STM-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
  { id: 'p4', title: 'Google Play $25', description: 'Google Play gift card.', category: 'Gift Cards', price: 95, originalPrice: 105, image: 'google', stock: 25, rating: 4.7, reviews: 412, delivery: 'Fast Delivery', code: 'GPL-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
  { id: 'p5', title: 'PlayStation Plus 12 Months', description: 'PS Plus Essential full year.', category: 'Gaming', price: 220, originalPrice: 260, image: 'playstation', stock: 15, rating: 4.9, reviews: 328, featured: true, trending: true, delivery: 'Fast Delivery', code: 'PSN-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
  { id: 'p6', title: 'Xbox Game Pass Ultimate 3M', description: 'Hundreds of games.', category: 'Gaming', price: 180, originalPrice: 210, image: 'xbox', stock: 20, rating: 4.8, reviews: 276, delivery: 'Fast Delivery', code: 'XBX-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
  { id: 'p7', title: 'Deezer Premium 6 Months', description: 'Lossless HiFi audio.', category: 'Streaming', price: 75, originalPrice: 90, image: 'deezer', stock: 35, rating: 4.6, reviews: 189, delivery: 'Fast Delivery', code: 'DZR-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
  { id: 'p8', title: 'PUBG UC 660', description: '660 Unknown Cash.', category: 'Top-Ups', price: 38, originalPrice: 45, image: 'pubg', stock: 100, rating: 4.8, reviews: 987, bestSeller: true, delivery: 'Fast Delivery', code: 'PUBG-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
  { id: 'p9', title: 'Free Fire 530 Diamonds', description: '530 Diamonds.', category: 'Top-Ups', price: 32, originalPrice: 40, image: 'freefire', stock: 100, rating: 4.7, reviews: 543, delivery: 'Fast Delivery', code: 'FF-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
  { id: 'p10', title: 'Windows 11 Pro License', description: 'Genuine Windows 11 Pro.', category: 'Software', price: 85, originalPrice: 120, image: 'windows', stock: 40, rating: 4.9, reviews: 231, featured: true, delivery: 'Fast Delivery', code: 'WIN-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
  { id: 'p11', title: 'Microsoft Office 365', description: 'Office 365 Business.', category: 'Software', price: 110, originalPrice: 140, image: 'office', stock: 25, rating: 4.8, reviews: 198, delivery: 'Fast Delivery', code: 'OFC-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
  { id: 'p12', title: 'iTunes Gift Card $50', description: 'Apple iTunes card.', category: 'Gift Cards', price: 175, originalPrice: 195, image: 'apple', stock: 20, rating: 4.8, reviews: 412, delivery: 'Fast Delivery', code: 'APL-' + Math.random().toString(36).slice(2, 8).toUpperCase() },
];

const seedUsers = [
  { id: 'admin1', email: 'admin@yass-shop.com', password: 'admin123', name: 'Yassine Bentoumia', role: 'admin', balance: 0, createdAt: Date.now() },
  { id: 'staff1', email: 'staff@yass-shop.com', password: 'staff123', name: 'Staff Agent', role: 'staff', balance: 0, createdAt: Date.now() },
];

function seedIfEmpty() {
  const products = readData('products');
  if (products.length === 0) {
    writeData('products', seedProducts);
  }
  const users = readData('users');
  if (users.length === 0) {
    writeData('users', seedUsers);
  }
}

seedIfEmpty();

// API Routes

// Products
app.get('/api/products', (req, res) => {
  res.json(readData('products'));
});

app.post('/api/products', (req, res) => {
  const products = readData('products');
  const product = { ...req.body, id: uuidv4() };
  products.unshift(product);
  writeData('products', products);
  res.json(product);
});

app.put('/api/products/:id', (req, res) => {
  const products = readData('products');
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx >= 0) {
    products[idx] = { ...products[idx], ...req.body };
    writeData('products', products);
    res.json(products[idx]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const products = readData('products').filter(p => p.id !== req.params.id);
  writeData('products', products);
  res.json({ success: true });
});

// Users
app.get('/api/users', (req, res) => {
  const users = readData('users').map(u => ({ ...u, password: undefined }));
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const users = readData('users');
  const existing = users.find(u => u.email.toLowerCase() === req.body.email.toLowerCase());
  if (existing) return res.status(400).json({ error: 'Email already exists' });
  
  const user = { ...req.body, id: uuidv4(), role: 'user', balance: 0, createdAt: Date.now() };
  users.push(user);
  writeData('users', users);
  const { password, ...userWithoutPw } = user;
  res.json(userWithoutPw);
});

app.put('/api/users/:id', (req, res) => {
  const users = readData('users');
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...req.body };
    writeData('users', users);
    const { password, ...userWithoutPw } = users[idx];
    res.json(userWithoutPw);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Auth
app.post('/api/auth/login', (req, res) => {
  const users = readData('users');
  const user = users.find(u => u.email.toLowerCase() === req.body.email.toLowerCase() && u.password === req.body.password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const { password, ...userWithoutPw } = user;
  res.json(userWithoutPw);
});

// Orders
app.get('/api/orders', (req, res) => {
  const orders = readData('orders');
  if (req.query.userId) {
    res.json(orders.filter(o => o.userId === req.query.userId));
  } else {
    res.json(orders);
  }
});

app.post('/api/orders', (req, res) => {
  const orders = readData('orders');
  const order = { ...req.body, id: uuidv4(), createdAt: Date.now() };
  orders.unshift(order);
  writeData('orders', orders);
  res.json(order);
});

app.put('/api/orders/:id', (req, res) => {
  const orders = readData('orders');
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], ...req.body };
    writeData('orders', orders);
    res.json(orders[idx]);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Rooms
app.get('/api/rooms', (req, res) => {
  const rooms = readData('rooms');
  if (req.query.userId) {
    res.json(rooms.filter(r => r.userId === req.query.userId));
  } else {
    res.json(rooms);
  }
});

app.post('/api/rooms', (req, res) => {
  const rooms = readData('rooms');
  const room = { ...req.body, id: uuidv4(), openedAt: Date.now() };
  rooms.unshift(room);
  writeData('rooms', rooms);
  res.json(room);
});

app.put('/api/rooms/:id', (req, res) => {
  const rooms = readData('rooms');
  const idx = rooms.findIndex(r => r.id === req.params.id);
  if (idx >= 0) {
    rooms[idx] = { ...rooms[idx], ...req.body };
    writeData('rooms', rooms);
    res.json(rooms[idx]);
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

// Messages
app.get('/api/messages', (req, res) => {
  const messages = readData('messages');
  if (req.query.roomId) {
    res.json(messages.filter(m => m.roomId === req.query.roomId).sort((a, b) => a.timestamp - b.timestamp));
  } else {
    res.json(messages);
  }
});

app.post('/api/messages', (req, res) => {
  const messages = readData('messages');
  const message = { ...req.body, id: uuidv4(), timestamp: Date.now(), read: false };
  messages.push(message);
  writeData('messages', messages);
  res.json(message);
});

// Transactions
app.get('/api/transactions', (req, res) => {
  const transactions = readData('transactions');
  if (req.query.userId) {
    res.json(transactions.filter(t => t.userId === req.query.userId));
  } else {
    res.json(transactions);
  }
});

app.post('/api/transactions', (req, res) => {
  const transactions = readData('transactions');
  const transaction = { ...req.body, id: uuidv4(), createdAt: Date.now() };
  transactions.unshift(transaction);
  writeData('transactions', transactions);
  res.json(transaction);
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const notifications = readData('notifications');
  if (req.query.userId) {
    res.json(notifications.filter(n => n.userId === req.query.userId || (!n.userId && n.role === req.query.role)));
  } else {
    res.json(notifications);
  }
});

app.post('/api/notifications', (req, res) => {
  const notifications = readData('notifications');
  const notification = { ...req.body, id: uuidv4(), createdAt: Date.now(), read: false };
  notifications.unshift(notification);
  writeData('notifications', notifications);
  res.json(notification);
});

app.put('/api/notifications/read', (req, res) => {
  const notifications = readData('notifications');
  const userId = req.body.userId;
  const updated = notifications.map(n => {
    if (userId && n.userId === userId) return { ...n, read: true };
    if (!userId && !n.userId) return { ...n, read: true };
    return n;
  });
  writeData('notifications', updated);
  res.json({ success: true });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 YASS-SHOP server running on port ${PORT}`);
});