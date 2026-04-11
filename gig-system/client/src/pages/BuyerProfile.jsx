export default function BuyerProfile() {
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Buyer profile</h1>
            <p className="text-sm text-muted">Showcase your projects and hiring preferences.</p>
          </div>
          <button className="btn-primary text-sm">Edit profile</button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {['Projects posted', 'Active orders', 'Total spend'].map((item) => (
          <div key={item} className="card card-hover p-5">
            <p className="text-sm text-muted">{item}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">0</p>
          </div>
        ))}
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-semibold">Recent activity</h2>
        <div className="mt-4 grid gap-3">
          {['New brief drafted', 'Saved 3 gigs', 'Completed order review'].map((item) => (
            <div key={item} className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3">
              <p className="font-semibold text-ink">{item}</p>
              <p className="text-sm text-muted mt-1">Keep your hiring workflow organized and fast.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
