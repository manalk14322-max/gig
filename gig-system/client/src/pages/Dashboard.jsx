import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { fetchChats, fetchOrders, fetchSellerPublic } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [chats, setChats] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    fetchOrders().then(setOrders);
    fetchChats().then(setChats);
    if (user?.id) {
      fetchSellerPublic(user.id).then((data) => setGigs(data.gigs || []));
    }
  }, [user?.id]);

  useEffect(() => {
    const socket = io('/', { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('message', ({ conversationId, message: incoming }) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === conversationId ? { ...chat, messages: [...chat.messages, incoming] } : chat,
        ),
      );
      if (activeChat && activeChat._id === conversationId) {
        setActiveChat((prev) => ({ ...prev, messages: [...prev.messages, incoming] }));
      }
    });
    return () => socket.disconnect();
  }, [activeChat]);

  const openChat = (chat) => {
    setActiveChat(chat);
    socketRef.current?.emit('join', { conversationId: chat._id });
  };

  const submitMessage = async (event) => {
    event.preventDefault();
    if (!activeChat) return;
    socketRef.current?.emit('message', {
      conversationId: activeChat._id,
      text: message,
      senderId: user.id,
    });
    setMessage('');
  };

  if (!user) {
    return <p className="text-muted">Please login to access your dashboard.</p>;
  }

  const activeOrders = orders.filter((order) => !['Completed', 'Cancelled'].includes(order.status)).length;
  const earnings = orders
    .filter((order) => order.paymentStatus === 'Protected' || order.paymentStatus === 'Paid')
    .reduce((sum, order) => sum + Number(order.amount || 0), 0);
  const pendingGigs = gigs.filter((gig) => (gig.approvalStatus || 'approved') === 'pending').length;
  const pendingTasks = [
    user.verificationStatus !== 'verified' && 'Complete CNIC/student verification',
    pendingGigs > 0 && `${pendingGigs} gig waiting for admin approval`,
    !gigs.length && 'Create your first gig',
    orders.some((order) => order.status === 'Placed') && 'Review newly placed orders',
  ].filter(Boolean);

  return (
    <div className="space-y-8">
      <section className="card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Welcome back, {user.name}</h1>
            <p className="text-muted">Manage gigs, orders, earnings, verification, and messages in one workspace.</p>
          </div>
          <button className="btn-ghost text-sm" onClick={logout} type="button">
            Sign out
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active orders', value: activeOrders },
          { label: 'Gig approval', value: pendingGigs ? `${pendingGigs} pending` : 'Clear' },
          { label: 'Total earnings', value: `PKR ${earnings.toLocaleString('en-PK')}` },
          { label: 'Verification', value: user.verificationStatus || 'pending' },
        ].map((item) => (
          <div key={item.label} className="card card-hover p-5">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold capitalize text-ink">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr,1.2fr]">
        <div className="card p-6">
          <h2 className="text-xl font-semibold">Pending tasks</h2>
          <div className="mt-4 space-y-3">
            {pendingTasks.map((task) => (
              <div key={task} className="rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-3 text-sm text-muted">
                {task}
              </div>
            ))}
            {!pendingTasks.length && <p className="rounded-2xl bg-soft px-4 py-3 text-sm font-semibold text-primary">All clear for now.</p>}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">My gigs</h2>
            <span className="text-sm text-muted">{gigs.length} total</span>
          </div>
          <div className="mt-4 grid gap-3">
            {gigs.slice(0, 4).map((gig) => (
              <div key={gig._id} className="rounded-2xl border border-border-color bg-card-bg p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-ink">{gig.title}</p>
                    <p className="text-sm text-muted">PKR {Number(gig.basePrice || 0).toLocaleString('en-PK')} - {gig.deliveryDays} days</p>
                  </div>
                  <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold capitalize text-primary">
                    {gig.approvalStatus || 'approved'}
                  </span>
                </div>
              </div>
            ))}
            {!gigs.length && <p className="text-sm text-muted">No gigs yet.</p>}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="card p-6">
          <h2 className="text-xl font-semibold">Orders</h2>
          <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl border border-border-color bg-card-bg p-4">
                <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                <p className="text-sm text-muted">Amount: PKR {order.amount.toLocaleString('en-PK')}</p>
                <p className="text-sm text-muted">Status: {order.status}</p>
                <p className="text-sm text-muted">Payment: {order.paymentStatus}</p>
              </div>
            ))}
            {!orders.length && <p className="text-sm text-muted">No orders yet.</p>}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold">Chats</h2>
          <div className="mt-4 grid gap-3">
            {chats.map((chat) => (
              <button
                key={chat._id}
                className="rounded-2xl border border-border-color bg-card-bg p-3 text-left"
                onClick={() => openChat(chat)}
                type="button"
              >
                <p className="font-semibold">Gig #{chat.gigId.slice(-6)}</p>
                <p className="text-xs text-muted">{chat.messages.length} messages</p>
              </button>
            ))}
            {!chats.length && <p className="text-sm text-muted">No chats yet.</p>}
          </div>
          {activeChat && (
            <form onSubmit={submitMessage} className="mt-4 space-y-2">
              <div className="h-32 overflow-auto rounded-2xl border border-border-color bg-[#F3F7FA] p-3">
                {activeChat.messages.map((msg) => (
                  <p key={msg._id} className="text-sm">
                    <strong>{msg.senderId === user.id ? 'You' : 'Them'}:</strong> {msg.text}
                  </p>
                ))}
              </div>
              <input
                className="w-full rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-2"
                placeholder="Type a message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <button className="btn-primary w-full">Send</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
