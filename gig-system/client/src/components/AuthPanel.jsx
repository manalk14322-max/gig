import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPanel() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [status, setStatus] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setStatus('');
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
      setStatus('Success');
    } catch (error) {
      setStatus(error?.response?.data?.error || 'Auth failed');
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Account</h3>
        <div className="flex gap-2">
          <button className={`rounded-full px-4 py-1 text-sm ${mode === 'login' ? 'bg-primary text-white' : 'bg-base'}`} onClick={() => setMode('login')} type="button">
            Login
          </button>
          <button className={`rounded-full px-4 py-1 text-sm ${mode === 'signup' ? 'bg-primary text-white' : 'bg-base'}`} onClick={() => setMode('signup')} type="button">
            Sign up
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="mt-4 space-y-3">
        {mode === 'signup' && (
          <input
            className="w-full rounded-2xl border border-black/10 px-4 py-2"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        )}
        <input
          className="w-full rounded-2xl border border-black/10 px-4 py-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className="w-full rounded-2xl border border-black/10 px-4 py-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        {mode === 'signup' && (
          <select className="w-full rounded-2xl border border-black/10 px-4 py-2" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        )}
        <button className="btn-primary w-full">Continue</button>
      </form>
      {status && <p className="mt-3 text-sm text-primary">{status}</p>}
    </div>
  );
}
