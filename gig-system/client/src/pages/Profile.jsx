import { useEffect, useState } from 'react';
import { fetchProfile, updateProfile } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, ready } = useAuth();
  const [form, setForm] = useState({
    name: '',
    title: '',
    location: '',
    avatarUrl: '',
    description: '',
    skills: '',
    portfolio: '',
    role: 'buyer',
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!ready) return;
    fetchProfile()
      .then((data) => {
        setForm({
          name: data.name || '',
          title: data.title || '',
          location: data.location || '',
          avatarUrl: data.avatarUrl || '',
          description: data.description || '',
          skills: (data.skills || []).join(', '),
          portfolio: (data.portfolio || []).join(', '),
          role: data.role || 'buyer',
        });
      })
      .catch(() => {});
  }, [ready]);

  if (!user) {
    return <p className="text-muted">Please login to edit your profile.</p>;
  }

  const submit = async (event) => {
    event.preventDefault();
    setStatus('');
    const payload = {
      name: form.name,
      title: form.title,
      location: form.location,
      avatarUrl: form.avatarUrl,
      description: form.description,
      skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
      portfolio: form.portfolio.split(',').map((item) => item.trim()).filter(Boolean),
      role: form.role,
    };
    const updated = await updateProfile(payload);
    setStatus(`Profile updated for ${updated.name}.`);
  };

  return (
    <div className="space-y-8">
      <section className="card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Profile settings</h1>
            <p className="text-muted">Update your buyer or seller identity here.</p>
          </div>
          {form.role === 'seller' && user?.id ? (
            <a className="btn-secondary" href={`/seller/${user.id}`}>
              View public seller profile
            </a>
          ) : (
            <a className="btn-secondary" href="/buyer">
              View buyer profile
            </a>
          )}
        </div>
      </section>

      <form onSubmit={submit} className="card p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <select
            className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <input
            className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
            placeholder="Title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
          <input
            className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
            placeholder="Location"
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
          />
        </div>
        <input
          className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3"
          placeholder="Avatar URL"
          value={form.avatarUrl}
          onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })}
        />
        <textarea
          className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3"
          rows="4"
          placeholder="Short bio / description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
        <input
          className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={(event) => setForm({ ...form, skills: event.target.value })}
        />
        <textarea
          className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3"
          rows="3"
          placeholder="Portfolio URLs (comma separated)"
          value={form.portfolio}
          onChange={(event) => setForm({ ...form, portfolio: event.target.value })}
        />
        <button className="btn-gradient w-full">Save changes</button>
        {status && <p className="text-sm text-primary">{status}</p>}
      </form>
    </div>
  );
}
