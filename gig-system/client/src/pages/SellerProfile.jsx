import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchSellerPublic } from '../api.js';

function initials(name = 'Seller') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function money(value) {
  return `PKR ${Number(value || 0).toLocaleString('en-PK')}`;
}

function studentBadgeText(seller) {
  if (seller.verifiedStudent) return 'Verified student';
  if (seller.verificationStatus === 'pending') return 'Verification pending';
  return 'Student profile';
}

function decisionBadge(status) {
  if (status === 'verified') return 'bg-emerald-100 text-emerald-700';
  if (status === 'rejected') return 'bg-rose-100 text-rose-700';
  return 'bg-amber-100 text-amber-700';
}

export default function SellerProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    fetchSellerPublic(id).then((data) => {
      setSeller(data.seller);
      setGigs(data.gigs || []);
    });
  }, [id]);

  if (!seller) {
    return <p className="text-muted">Loading seller profile...</p>;
  }

  const portfolioItems = seller.portfolio?.length ? seller.portfolio : ['Brand identity', 'Landing page', 'Marketplace UI'];
  const verificationLog = seller.verificationHistory?.length ? seller.verificationHistory.slice(-3).reverse() : [];

  return (
    <div className="space-y-8 pb-24 md:pb-10">
      <Link className="text-sm font-semibold text-primary hover:text-secondary" to="/">
        {'<-'} Back to marketplace
      </Link>

      <section className="overflow-hidden rounded-[28px] border border-border-color bg-card-bg shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[1.4fr,0.6fr]">
          <div className="relative">
            <div className="h-40 bg-gradient-to-r from-[#F4E9D0] via-white to-[#E7D8B8] md:h-52" />
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="-mt-20 flex items-end gap-4 md:-mt-24">
                  <div className="grid h-24 w-24 place-items-center rounded-[28px] border border-white bg-primary text-2xl font-bold text-white shadow-lift">
                    {initials(seller.name)}
                  </div>
                  <div className="pb-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Student profile</p>
                    <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">{seller.name}</h1>
                    <p className="mt-1 text-base text-muted">{seller.title}</p>
                    <p className="text-sm text-muted">{seller.location}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {seller.verifiedStudent && (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Verified badge
                        </span>
                      )}
                      <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                        {studentBadgeText(seller)}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${decisionBadge(seller.verificationStatus)}`}>
                        Decision: {seller.verificationStatus || 'pending'}
                      </span>
                      {seller.university && (
                        <span className="rounded-full bg-[#EEF2F7] px-3 py-1 text-xs font-semibold text-ink">
                          {seller.university}
                        </span>
                      )}
                      {seller.department && (
                        <span className="rounded-full bg-[#EEF2F7] px-3 py-1 text-xs font-semibold text-ink">
                          {seller.department}
                        </span>
                      )}
                      {seller.studentId && (
                      <span className="rounded-full bg-[#EEF2F7] px-3 py-1 text-xs font-semibold text-primary shadow-soft">
                          ID {seller.studentId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="btn-gradient self-start md:self-auto">Share profile</button>
              </div>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-muted md:text-base">
                {seller.description || 'Specialist in premium delivery, fast collaboration, and polished marketplace work.'}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Response rate', value: '98%' },
                  { label: 'On-time delivery', value: '96%' },
                  { label: 'Repeat clients', value: '52%' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[22px] border border-border-color bg-[#EEF2F7] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-ink">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-muted">Skills</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(seller.skills?.length ? seller.skills : ['Branding', 'UX', 'WordPress', 'Figma']).map((skill) => (
                    <span key={skill} className="tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="border-t border-border-color bg-[#EEF2F7] p-6 lg:border-l lg:border-t-0 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Quick summary</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{money(15000)}</p>
            <p className="mt-2 text-sm text-muted">Average delivery: 3 days</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[22px] border border-border-color bg-card-bg p-4 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Verification</p>
                <p className="mt-2 text-sm font-semibold text-ink">{studentBadgeText(seller)}</p>
                <p className="mt-1 text-sm text-muted">
                  {seller.verifiedStudent
                    ? 'This student seller has a trusted badge.'
                    : 'Campus details are visible for buyer trust.'}
                </p>
              </div>
              {(seller.university || seller.department) && (
                <div className="rounded-[22px] border border-border-color bg-[#EEF2F7] p-4 text-sm text-muted">
                  <p className="font-semibold text-ink">Campus identity</p>
                  <p className="mt-2">{seller.university || 'University not added'}</p>
                  <p className="mt-1">{seller.department || 'Department not added'}</p>
                </div>
              )}
            </div>
            {(seller.verifiedStudent || seller.university) && (
              <div className="mt-4 rounded-[22px] border border-border-color bg-card-bg p-4 shadow-soft">
                <p className="text-sm font-semibold text-ink">Student trust</p>
                <p className="mt-1 text-sm text-muted">
                  {seller.verifiedStudent
                    ? 'Verified university student profile.'
                    : 'University details added for local trust.'}
                </p>
              </div>
            )}

            <div className="mt-4 rounded-[22px] border border-border-color bg-[#EEF2F7] p-4">
              <p className="text-sm font-semibold text-ink">Verification history</p>
              {verificationLog.length ? (
                <div className="mt-3 space-y-2 text-sm text-muted">
                  {verificationLog.map((entry, index) => (
                    <div key={`${entry.decidedAt}-${index}`} className="rounded-2xl bg-white px-3 py-2 shadow-soft">
                      <p className="font-semibold text-ink capitalize">{entry.status}</p>
                      <p className="text-xs text-muted">{entry.note || 'Review update recorded.'}</p>
                      <p className="text-[11px] text-muted">
                        {entry.decidedAt ? new Date(entry.decidedAt).toLocaleDateString() : 'Recently'} •{' '}
                        {entry.decidedBy || 'UniHire admin'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted">No verification updates yet.</p>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button className="btn-gradient w-full">Contact seller</button>
              <button className="btn-ghost w-full">Request a quote</button>
            </div>

            <div className="mt-6 rounded-[22px] border border-border-color bg-card-bg p-4 shadow-soft">
              <p className="text-sm font-semibold text-ink">Why buyers choose this student seller</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>Clean communication and quick replies</li>
                <li>Campus-ready delivery and polished work</li>
                <li>Strong focus on Pakistani buyer needs</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft md:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Portfolio</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Selected work</h2>
          </div>
          <button className="btn-ghost text-sm">See all</button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {portfolioItems.map((item) => (
            <div key={item} className="overflow-hidden rounded-[22px] border border-border-color bg-[#EEF2F7] shadow-soft">
              <div className="h-40 bg-gradient-to-br from-[#DCE3EC] via-[#EEF2F7] to-[#C9D3DF]" />
              <div className="p-4">
                <p className="font-semibold text-ink">{item}</p>
                <p className="mt-1 text-sm text-muted">A polished case study sample for buyers.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Gigs</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Seller services</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {gigs.map((gig) => (
            <Link
              key={gig._id}
              to={`/gig/${gig._id}`}
            className="group overflow-hidden rounded-[24px] border border-border-color bg-card-bg shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative h-48 overflow-hidden bg-soft">
                {gig.images?.[0] ? (
                  <img
                    src={gig.images[0]}
                    alt={gig.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#1B2742] via-[#223052] to-[#0B1F3A] text-white/70">
                    Gig preview
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent p-4">
                      <span className="rounded-full bg-[#EEF2F7]/95 px-3 py-1 text-xs font-semibold text-primary shadow-soft">
                    {gig.category}
                  </span>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
                      {gig.quickTask ? 'Quick task' : `${gig.deliveryDays} days`}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-ink group-hover:text-primary">{gig.title}</h3>
                  </div>
                  <span className="price-pill">{money(gig.basePrice)}</span>
                </div>
                <p className="text-sm leading-6 text-muted line-clamp-2">{gig.description}</p>
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Rating {gig.ratingAverage.toFixed(1)}</span>
                  <span>{gig.quickTask ? '1-2 hour option' : 'Standard delivery'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-color bg-card-bg p-4 shadow-lift lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div>
            <p className="text-xs text-muted">Starting from</p>
            <p className="text-lg font-semibold text-ink">{money(15000)}</p>
          </div>
          <button className="btn-gradient ml-auto">Contact seller</button>
        </div>
      </div>
    </div>
  );
}
