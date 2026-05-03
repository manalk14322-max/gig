import { useEffect, useState } from 'react';
import { fetchAdminDatabase } from '../api.js';

const statLabels = {
  users: 'Users',
  gigs: 'Gigs',
  orders: 'Orders',
  reviews: 'Reviews',
  chats: 'Chats',
  pendingGigs: 'Pending gigs',
  pendingSellers: 'Pending sellers',
};

function money(value) {
  return `PKR ${Number(value || 0).toLocaleString('en-PK')}`;
}

export default function AdminDatabase() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminDatabase()
      .then(setData)
      .catch((err) => setError(err?.response?.data?.error || 'Could not load database summary.'));
  }, []);

  if (error) {
    return (
      <section className="card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Admin database</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Login as admin to view database</h1>
        <p className="mt-3 text-sm text-muted">{error}</p>
      </section>
    );
  }

  if (!data) {
    return <div className="card p-6 text-sm text-muted">Loading database summary...</div>;
  }

  const counts = data.counts || {};
  const latest = data.latest || {};

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Admin database</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Live backend data summary</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Check users, gigs, orders, and pending approvals from the connected Vercel API.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(statLabels).map(([key, label]) => (
            <div key={key} className="rounded-2xl border border-border-color bg-[#F3F7FA] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{counts[key] ?? 0}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-xl font-semibold text-ink">Latest gigs</h2>
          <div className="mt-4 space-y-3">
            {(latest.gigs || []).map((gig) => (
              <div key={gig._id} className="rounded-2xl border border-border-color bg-[#F3F7FA] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-ink">{gig.title}</p>
                    <p className="text-sm text-muted">{gig.category} - {money(gig.basePrice)}</p>
                  </div>
                  <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold capitalize text-primary">
                    {gig.approvalStatus || 'approved'}
                  </span>
                </div>
              </div>
            ))}
            {!latest.gigs?.length && <p className="text-sm text-muted">No gigs found.</p>}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-xl font-semibold text-ink">Latest orders</h2>
          <div className="mt-4 space-y-3">
            {(latest.orders || []).map((order) => (
              <div key={order._id} className="rounded-2xl border border-border-color bg-[#F3F7FA] p-4">
                <p className="font-semibold text-ink">{order.title || `Order ${order._id}`}</p>
                <p className="text-sm text-muted">{money(order.amount)} - {order.status}</p>
                <p className="text-xs text-muted">{order.paymentStatus}</p>
              </div>
            ))}
            {!latest.orders?.length && <p className="text-sm text-muted">No orders found.</p>}
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-xl font-semibold text-ink">Latest users</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(latest.users || []).map((user) => (
            <div key={user.id} className="rounded-2xl border border-border-color bg-[#F3F7FA] p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-ink">{user.name}</p>
                  <p className="text-sm text-muted">{user.email}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-ink">
                  {user.role}
                </span>
              </div>
            </div>
          ))}
          {!latest.users?.length && <p className="text-sm text-muted">No users found.</p>}
        </div>
      </section>
    </div>
  );
}
