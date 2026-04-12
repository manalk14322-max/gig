export default function Orders() {
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Orders</h1>
            <p className="text-sm text-muted">Track deliveries, milestones, and payment status.</p>
          </div>
          <button className="btn-primary text-sm">Create order</button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {['Active', 'In review', 'Completed'].map((item) => (
          <div key={item} className="card card-hover p-5">
            <p className="text-sm text-muted">{item} orders</p>
            <p className="mt-2 text-2xl font-semibold text-ink">0</p>
          </div>
        ))}
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-ink">Latest orders</p>
          <button className="btn-ghost text-sm">View all</button>
        </div>
        <div className="mt-4 grid gap-3">
          {['Logo design package', 'Shopify store setup', 'AI video explainer'].map((item) => (
            <div key={item} className="rounded-2xl border border-border-color bg-card-bg px-4 py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-ink">{item}</p>
                <span className="text-xs text-muted">In progress</span>
              </div>
              <p className="mt-1 text-sm text-muted">Delivery in 3 days • PKR 28,000</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                <span className="rounded-full bg-soft px-3 py-1">Placed</span>
                <span className="h-px flex-1 bg-border-color" />
                <span className="rounded-full bg-soft px-3 py-1">In progress</span>
                <span className="h-px flex-1 bg-border-color" />
                <span className="rounded-full bg-soft px-3 py-1">Delivered</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
