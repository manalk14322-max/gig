export default function Wallet() {
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h1 className="font-display text-2xl font-semibold">Wallet & Payouts</h1>
        <p className="text-sm text-muted">Manage earnings, withdrawals, and local payout methods.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        {['Available balance', 'Pending clearance', 'Total earned'].map((item) => (
          <div key={item} className="card card-hover p-5">
            <p className="text-sm text-muted">{item}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">PKR 0</p>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <p className="font-semibold text-ink">Payout methods</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {['Easypaisa', 'JazzCash', 'Bank Transfer'].map((item) => (
            <span key={item} className="tag">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
