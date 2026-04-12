import { useEffect, useState } from 'react';
import { approveVerification, fetchVerificationQueue, rejectVerification } from '../api.js';

export default function AdminVerification() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const [notes, setNotes] = useState({});

  const pendingCount = items.length;

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await fetchVerificationQueue();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleAction = async (id, status) => {
    if (status === 'verified') {
      await approveVerification(id, notes[id] ? { note: notes[id] } : undefined);
    } else {
      await rejectVerification(id, notes[id] ? { note: notes[id] } : undefined);
    }
    loadQueue();
  };

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Admin</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Verification review queue</h1>
        <p className="mt-2 text-sm text-muted">Approve or reject student verification submissions.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Pending reviews', value: pendingCount },
            { label: 'Decision SLA', value: '24h' },
            { label: 'Queue status', value: pendingCount ? 'Active' : 'Clear' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border-color bg-[#EEF2F7] px-4 py-3 text-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="card p-6 text-sm text-muted">Loading verification requests...</div>
      ) : items.length === 0 ? (
        <div className="card p-6 text-sm text-muted">No pending verification requests right now.</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="card card-hover p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-ink">{item.name}</p>
                  <p className="text-sm text-muted">{item.email}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                    {item.university || 'University not set'}
                  </p>
                  {item.department && <p className="text-sm text-muted">{item.department}</p>}
                </div>
                <span className="rounded-full bg-[#EEF2F7] px-3 py-1 text-xs font-semibold text-primary">
                  {item.verificationStatus}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border-color bg-[#EEF2F7] p-3">
                  <p className="text-xs font-semibold text-muted">Student ID</p>
                  {item.verificationDocs?.idImage ? (
                    <img
                      src={item.verificationDocs.idImage}
                      alt="Student ID"
                      className="mt-2 h-40 w-full rounded-xl object-cover transition hover:scale-[1.02] cursor-zoom-in"
                      onClick={() => {
                        setZoomed(false);
                        setPreview({ src: item.verificationDocs.idImage, label: 'Student ID' });
                      }}
                    />
                  ) : (
                    <div className="mt-2 flex h-40 items-center justify-center rounded-xl bg-white text-xs text-muted">
                      No ID uploaded
                    </div>
                  )}
                </div>
                <div className="rounded-2xl border border-border-color bg-[#EEF2F7] p-3">
                  <p className="text-xs font-semibold text-muted">Selfie</p>
                  {item.verificationDocs?.selfieImage ? (
                    <img
                      src={item.verificationDocs.selfieImage}
                      alt="Selfie"
                      className="mt-2 h-40 w-full rounded-xl object-cover transition hover:scale-[1.02] cursor-zoom-in"
                      onClick={() => {
                        setZoomed(false);
                        setPreview({ src: item.verificationDocs.selfieImage, label: 'Selfie' });
                      }}
                    />
                  ) : (
                    <div className="mt-2 flex h-40 items-center justify-center rounded-xl bg-white text-xs text-muted">
                      No selfie uploaded
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Decision note</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-border-color bg-[#EEF2F7] px-4 py-2 text-sm"
                  placeholder="Add a quick reason for the decision..."
                  value={notes[item.id] || ''}
                  onChange={(event) => setNotes((prev) => ({ ...prev, [item.id]: event.target.value }))}
                />
              </div>

              {item.verificationHistory?.length ? (
                <div className="mt-4 rounded-2xl border border-border-color bg-[#EEF2F7] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Decision log</p>
                  <div className="mt-3 space-y-2 text-sm text-muted">
                    {item.verificationHistory.slice(-3).reverse().map((entry, index) => (
                      <div key={`${entry.decidedAt}-${index}`} className="rounded-xl bg-white px-3 py-2 shadow-soft">
                        <p className="font-semibold text-ink capitalize">{entry.status}</p>
                        <p className="text-xs text-muted">{entry.note || 'Decision recorded.'}</p>
                        <p className="text-[11px] text-muted">
                          {entry.decidedAt ? new Date(entry.decidedAt).toLocaleDateString() : 'Recently'} •{' '}
                          {entry.decidedBy || 'UniHire admin'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <button className="btn-primary" onClick={() => handleAction(item.id, 'verified')} type="button">
                  Approve
                </button>
                <button className="btn-ghost" onClick={() => handleAction(item.id, 'rejected')} type="button">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-w-2xl w-full rounded-[28px] bg-card-bg p-6 shadow-lift">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{preview.label}</p>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-border-color px-3 py-1 text-xs font-semibold text-ink"
                  onClick={() => setZoomed((prev) => !prev)}
                  type="button"
                >
                  {zoomed ? 'Fit' : 'Zoom'}
                </button>
                <button className="text-lg text-muted" onClick={() => setPreview(null)} type="button">
                  x
                </button>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border-color bg-[#EEF2F7]">
              <img
                src={preview.src}
                alt={preview.label}
                className={`w-full object-contain transition ${zoomed ? 'scale-125' : 'scale-100'}`}
              />
            </div>
            <p className="mt-3 text-xs text-muted">Tip: right click to save for manual review.</p>
          </div>
        </div>
      )}
    </div>
  );
}
