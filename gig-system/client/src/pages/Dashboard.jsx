import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { fetchChats, fetchOrders } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    fetchOrders().then(setOrders);
    fetchChats().then(setChats);
  }, []);

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

  return (
    <div className="space-y-8">
      <section className="card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Welcome back, {user.name}</h1>
            <p className="text-muted">Manage orders, revenue, and messages in one premium workspace.</p>
          </div>
          <button className="btn-ghost text-sm" onClick={logout} type="button">
            Sign out
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {['Active orders', 'Pending review', 'Total earnings'].map((item) => (
          <div key={item} className="card card-hover p-5">
            <p className="text-sm text-muted">{item}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">PKR 0</p>
          </div>
        ))}
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
