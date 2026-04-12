export default function Messages() {
  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Messages</h1>
            <p className="text-sm text-muted">Inbox, offers, and project conversations.</p>
          </div>
          <button className="btn-primary text-sm">New message</button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[340px,1fr]">
        <div className="card p-4 space-y-3">
          {['Manal Khan', 'Sana Zahra', 'Ayaan Malik', 'Saad R.'].map((item) => (
            <button key={item} className="w-full rounded-2xl border border-border-color bg-card-bg px-4 py-3 text-left">
              <p className="font-semibold text-ink">{item}</p>
              <p className="text-xs text-muted">Let’s align on the brief and milestones.</p>
            </button>
          ))}
        </div>

        <div className="card flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-2 border-b border-border-color pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-ink">Manal Khan</p>
              <p className="text-xs text-muted">Online</p>
            </div>
            <span className="tag">Project chat</span>
          </div>

          <div className="flex-1 space-y-3 text-sm">
            <div className="rounded-2xl bg-soft px-4 py-3 text-muted">
              Thanks for sharing the brief. I’ll send the first draft today.
            </div>
            <div className="ml-auto w-fit rounded-2xl bg-primary px-4 py-3 text-white">
              Perfect, looking forward to it.
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              className="flex-1 rounded-full border border-border-color bg-[#EEF2F7] px-4 py-3 text-sm"
              placeholder="Type a message"
            />
            <button className="btn-primary text-sm">Send</button>
          </div>
        </div>
      </section>
    </div>
  );
}
