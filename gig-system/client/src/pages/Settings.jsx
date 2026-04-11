export default function Settings() {
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted">Control security, notifications, and account preferences.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {['Account security', 'Notification preferences', 'Privacy controls', 'Language & region'].map((item) => (
          <div key={item} className="card card-hover p-5">
            <p className="font-semibold text-ink">{item}</p>
            <p className="text-sm text-muted mt-2">Configure how you want to use the platform.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
