export default function Favorites() {
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h1 className="font-display text-2xl font-semibold">Saved gigs</h1>
        <p className="text-sm text-muted">Bookmark gigs and compare them later.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {['Saved for later', 'Shortlisted freelancers', 'Collections', 'Recently viewed'].map((item) => (
          <div key={item} className="card card-hover p-5">
            <p className="font-semibold text-ink">{item}</p>
            <p className="text-sm text-muted mt-2">Organize what matters most.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
