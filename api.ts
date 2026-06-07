import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Clock, Image as ImageIcon, CheckCircle2, XCircle, Shield, Headphones, ArrowLeft, AlertTriangle, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import { fmt } from '../utils/currency';
import ProductPhoto from '../components/ProductPhoto';
import { api } from '../utils/api';
import type { ChatMessage } from '../types';

const ROOM_DURATION = 20 * 60 * 1000; // 20 min

export default function PaymentRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, user, users, sendMessage, updateRoom, updateOrder, updateUser, orders, addTransaction, notify } = useApp();
  const room = rooms.find((r) => r.id === id);
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(Date.now());

  // Timer for countdown
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  // Fetch messages for this room directly from API
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  
  useEffect(() => {
    if (!id) return;
    const iv = setInterval(() => {
      api.getMessages(id).then(setRoomMessages);
    }, 2000);
    api.getMessages(id).then(setRoomMessages);
    return () => clearInterval(iv);
  }, [id]);

  const order = orders.find((o) => o.id === room?.orderId);

  // Access control
  const isOwner = room?.userId === user?.id;
  const isStaff = user?.role === 'staff' || user?.role === 'admin';

  if (!user) {
    return <div className="pt-32 text-center text-red-400">Please sign in</div>;
  }

  if (!room) {
    return (
      <div className="pt-32 text-center max-w-xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Room not found</h1>
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  if (!isOwner && !isStaff) {
    return <div className="pt-32 text-center text-red-400">Access denied</div>;
  }

  const elapsed = now - room.openedAt;
  const remaining = Math.max(0, ROOM_DURATION - elapsed);
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const progress = Math.min(100, (elapsed / ROOM_DURATION) * 100);
  const isClosed = room.status === 'closed';
  const timeUp = remaining === 0 && !isClosed;

  const send = async () => {
    if (!text.trim() || isClosed) return;
    await sendMessage({
      roomId: room.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      message: text.trim(),
    });
    setText('');
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isClosed) return;
    const reader = new FileReader();
    reader.onload = () => {
      sendMessage({
        roomId: room.id,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        message: '📎 Payment screenshot',
        attachment: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Staff actions
  const verifyPayment = async () => {
    if (room.type !== 'topup' && !order) return;
    await updateRoom({ ...room, status: 'verified' });
    if (order) await updateOrder({ ...order, status: 'processing' });
    await sendMessage({
      roomId: room.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'staff',
      message: room.type === 'topup'
        ? `✅ Payment verified. We are crediting your wallet with ${fmt(room.amount)} now.`
        : '✅ Payment verified. We are preparing your code now. It will be sent to your email shortly.',
    });
    notify({
      userId: room.userId,
      title: 'Payment Verified',
      message: room.type === 'topup' ? 'Your top-up payment has been verified.' : 'Your payment has been verified. Code on the way!',
      type: 'payment',
    });
    toast.success('Payment verified');
  };

  const deliverCode = async () => {
    if (!order) return;
    const code = order.deliveredCode || ('CODE-' + Math.random().toString(36).slice(2, 10).toUpperCase());
    await updateRoom({ ...room, status: 'delivered', deliveredCode: code });
    await updateOrder({ ...order, status: 'completed', deliveredCode: code });
    await sendMessage({
      roomId: room.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'staff',
      message: `🎉 Your code has been sent to ${room.userEmail}. Please check your inbox (and spam folder).`,
    });
    notify({ userId: room.userId, title: 'Code Delivered', message: 'Your code was sent to your email.', type: 'payment' });
    toast.success('Code delivered via email');
  };

  const closeRoom = async () => {
    if (!isStaff) {
      toast.error('Only staff can close this room');
      return;
    }
    await updateRoom({ ...room, status: 'closed', closedAt: Date.now() });
    await sendMessage({
      roomId: room.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'staff',
      message: '🔒 This room has been closed by staff. Thank you for shopping with YASS-SHOP!',
    });
    toast.success('Room closed');
  };

  const cancelRoom = async () => {
    if (!isStaff) return toast.error('Only staff can cancel');
    await updateRoom({ ...room, status: 'closed', closedAt: Date.now() });
    if (order) await updateOrder({ ...order, status: 'closed' });
    await sendMessage({
      roomId: room.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'staff',
      message: '❌ Transaction cancelled by staff.',
    });
    toast.success('Room cancelled');
  };

  const deliverTopup = async () => {
    if (room.type !== 'topup') return;
    const targetUser = users.find((u) => u.id === room.userId);
    if (!targetUser) return toast.error('Customer not found');

    const newBalance = targetUser.balance + room.amount;
    await updateUser({ ...targetUser, balance: newBalance });
    await addTransaction({
      userId: room.userId,
      type: 'topup',
      amount: room.amount,
      description: `Balance top-up via ${room.paymentMethod.toUpperCase()}`,
      roomId: room.id,
    });
    await updateRoom({ ...room, status: 'delivered' });
    await sendMessage({
      roomId: room.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'staff',
      message: `✅ ${fmt(room.amount)} has been added to your wallet. Your new balance: ${fmt(newBalance)}`,
    });
    notify({ userId: room.userId, title: 'Balance Topped Up', message: `${fmt(room.amount)} added to your wallet.`, type: 'payment' });
    toast.success('Balance credited to customer');
  };

  return (
    <div className="pt-24 pb-10 max-w-6xl mx-auto px-4 sm:px-6 min-h-screen">
      <button onClick={() => navigate(isStaff ? '/staff' : '/dashboard')} className="flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="glass-strong rounded-2xl p-5 mb-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
              <ProductPhoto imageKey={room.productImage} title={room.productTitle} className="w-full h-full" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-black text-lg truncate">Payment Room</h1>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  isClosed ? 'bg-white/10 text-white/60' :
                  room.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                  room.status === 'verified' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400 animate-pulse'
                }`}>
                  {isClosed ? 'CLOSED' : room.status.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-white/60 truncate">{room.productTitle}</div>
              <div className="text-xs text-white/40 mt-0.5">
                {room.type === 'topup' ? '💰 Balance Top-up' : '🛒 Purchase'} • {room.paymentMethod.toUpperCase()} • {fmt(room.amount)}
              </div>
            </div>
          </div>

          {!isClosed && (
            <div className={`px-4 py-2 rounded-xl ${remaining < 5 * 60000 ? 'bg-red-500/20 text-red-400' : 'bg-black/30'} border border-white/10 flex items-center gap-2`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">{mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {!isClosed && (
          <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${remaining < 5 * 60000 ? 'gradient-red' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Layout */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        {/* Chat */}
        <div className="card flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          <div className="p-4 border-b border-white/10 flex items-center gap-2">
            <Headphones className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold">Live Chat</span>
            <span className="text-xs text-white/40">• Real staff, not AI</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {roomMessages.map((m) => {
              const mine = m.senderId === user.id;
              const isStaffMsg = m.senderRole === 'staff' || m.senderRole === 'admin';
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${mine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className="flex items-center gap-2 text-[10px] text-white/40 px-1">
                      {isStaffMsg && <Shield className="w-3 h-3 text-blue-400" />}
                      <span>{m.senderName}</span>
                      <span>•</span>
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 ${mine ? 'bubble-user rounded-br-sm' : 'bubble-staff rounded-bl-sm'}`}>
                      {m.attachment && (
                        <img src={m.attachment} alt="attachment" className="max-w-[240px] rounded-lg mb-2 border border-white/20" />
                      )}
                      <div className="text-sm whitespace-pre-wrap break-words">{m.message}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* Input */}
          {!isClosed ? (
            <div className="p-4 border-t border-white/10 flex items-end gap-2">
              <label className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition shrink-0">
                <ImageIcon className="w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="input resize-none py-3"
              />
              <button onClick={send} className="p-3 rounded-xl gradient-red hover:scale-105 transition shrink-0">
                <Send className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="p-4 border-t border-white/10 text-center text-sm text-white/50">
              This room is closed.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Info */}
          <div className="card p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">Customer</div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full gradient-red flex items-center justify-center font-bold">
                {room.userName.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{room.userName}</div>
                <div className="text-xs text-white/50 truncate flex items-center gap-1"><Mail className="w-3 h-3" />{room.userEmail}</div>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-white/50">Order ID</span><span className="font-mono">{order?.id.slice(0, 8).toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Method</span><span>{room.paymentMethod.toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Amount</span><span className="font-bold text-red-400">{fmt(room.amount)}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Opened</span><span>{new Date(room.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
            </div>
          </div>

          {/* Staff Actions */}
          {isStaff && !isClosed && (
            <div className="card p-5 border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Staff Controls</span>
              </div>
              {room.paymentMethod === 'balance' && (
                <div className="mb-3 p-2 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-400">
                  ✓ Customer paid with wallet balance. Send the code via email.
                </div>
              )}
              <div className="space-y-2">
                {room.status === 'open' && room.paymentMethod !== 'balance' && (
                  <button onClick={verifyPayment} className="w-full btn-primary !py-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Verify Payment
                  </button>
                )}
                {room.status === 'open' && room.paymentMethod === 'balance' && (
                  <button onClick={deliverCode} className="w-full btn-primary !py-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Send Code via Email
                  </button>
                )}
                {room.status === 'verified' && (
                  <>
                    <button
                      onClick={room.type === 'topup' ? deliverTopup : deliverCode}
                      className="w-full btn-primary !py-2.5 text-sm"
                    >
                      {room.type === 'topup' ? '💰 Credit Balance' : '📧 Send Code via Email'}
                    </button>
                  </>
                )}
                {room.status === 'delivered' && (
                  <button onClick={closeRoom} className="w-full btn-ghost !py-2.5 text-sm border-green-500/30 text-green-400">
                    <CheckCircle2 className="w-4 h-4" /> Close Room
                  </button>
                )}
                <button onClick={cancelRoom} className="w-full btn-ghost !py-2.5 text-sm border-red-500/30 text-red-400">
                  <XCircle className="w-4 h-4" /> Cancel Transaction
                </button>
              </div>
              <div className="mt-3 p-2 rounded-lg bg-black/30 text-[10px] text-white/50 leading-relaxed">
                <AlertTriangle className="w-3 h-3 inline text-amber-400 mr-1" />
                Only staff can close this room. Verify the payment screenshot before sending the code.
              </div>
            </div>
          )}

          {/* Customer Info */}
          {isOwner && !isStaff && (
            <div className="card p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">What to do</div>
              <ol className="space-y-2 text-sm text-white/70">
                <li className="flex gap-2"><span className="text-red-400 font-bold">1.</span> Send your payment screenshot using the 📎 button.</li>
                <li className="flex gap-2"><span className="text-red-400 font-bold">2.</span> Wait for staff to verify your payment.</li>
                <li className="flex gap-2"><span className="text-red-400 font-bold">3.</span> Staff sends your code via email.</li>
                <li className="flex gap-2"><span className="text-red-400 font-bold">4.</span> Staff closes the room after delivery.</li>
              </ol>
            </div>
          )}

          {timeUp && !isClosed && (
            <div className="card p-5 border-red-500/40">
              <div className="text-xs text-red-400 font-bold mb-2">⏰ Time expired</div>
              <div className="text-xs text-white/60">Only staff can extend or close this room.</div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}