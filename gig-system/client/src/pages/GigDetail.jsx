import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createOrder, createReview, createStripeCheckout, fetchGig, initEasypaisa, startChat } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function money(value) {
  return `PKR ${Number(value || 0).toLocaleString('en-PK')}`;
}

function initials(name = 'Seller') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function studentLabel(freelancer = {}) {
  if (freelancer.verifiedStudent) return 'Verified student';
  if (freelancer.verificationStatus === 'pending') return 'Verification pending';
  return 'Local student seller';
}

export default function GigDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ reviewer: '', rating: 5, comment: '' });

  useEffect(() => {
    fetchGig(id).then((data) => {
      setGig(data.gig);
      setReviews(data.reviews || []);
    });
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    const review = await createReview(id, form);
    setReviews((prev) => [review, ...prev]);
    setForm({ reviewer: '', rating: 5, comment: '' });
  };

  const placeOrder = async () => {
    if (!user) return alert('Please login to place an order.');
    const order = await createOrder({ gigId: id });
    await initEasypaisa({ orderId: order._id });
    alert('Order placed. Easypaisa payment initialized (stub).');
  };

  const payWithStripe = async () => {
    if (!user) return alert('Please login to pay.');
    const order = await createOrder({ gigId: id });
    const session = await createStripeCheckout({ orderId: order._id });
    if (session.url) {
      window.location.href = session.url;
    }
  };

  const openChat = async () => {
    if (!user) return alert('Please login to start a chat.');
    await startChat({ gigId: id });
    alert('Chat started. Visit dashboard to continue.');
  };

  if (!gig) {
    return <p className="text-muted">Loading gig...</p>;
  }

  return (
    <div className="space-y-8 pb-24 md:pb-10">
      <div className="flex items-center justify-between gap-4">
        <Link className="text-sm font-semibold text-primary hover:text-secondary" to="/">
          {'<-'} Back to marketplace
        </Link>
        <div className="hidden items-center gap-2 text-xs text-muted md:flex">
          <span>Home</span>
          <span>/</span>
          <span>{gig.category}</span>
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-border-color bg-card-bg shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[1.5fr,0.75fr]">
          <div className="p-5 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">{gig.category}</span>
              {gig.quickTask && (
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                  Quick Task
                </span>
              )}
              {gig.featured && (
                <span className="rounded-full bg-[#F7F3EA] px-3 py-1 text-xs font-semibold text-primary">
                  Featured
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-[2.2rem] font-semibold leading-tight text-ink md:text-5xl">{gig.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted md:text-lg">{gig.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="rounded-full bg-[#F3F7FA] px-3 py-2">Rating {gig.ratingAverage.toFixed(1)}</span>
              <span className="rounded-full bg-[#F3F7FA] px-3 py-2">{gig.ratingCount} reviews</span>
              <span className="rounded-full bg-[#F3F7FA] px-3 py-2">
                Delivery {gig.quickTask ? `${gig.quickDeliveryHours}h` : `${gig.deliveryDays}d`}
              </span>
              <span className="rounded-full bg-[#F3F7FA] px-3 py-2">{gig.quickTask ? 'Instant option available' : 'Standard delivery'}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {gig.tags?.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-border-color bg-[#F3F7FA] p-5 md:p-6 lg:border-l lg:border-t-0">
            <div className="overflow-hidden rounded-[24px] border border-border-color bg-card-bg shadow-soft">
              <div className="relative h-[22rem] bg-black">
                {gig.images?.[0] ? (
                  <img src={gig.images[0]} alt={gig.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-[#102033] via-[#0F766E] to-[#102033] text-white/80">
                    Premium gig preview
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 rounded-[22px] bg-[#F3F7FA]/95 p-4 shadow-soft">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Student seller</p>
                      <p className="mt-1 text-lg font-semibold text-ink">{gig.freelancer?.name}</p>
                      <p className="text-sm text-muted">{gig.freelancer?.title}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {gig.freelancer?.verifiedStudent && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                            Verified badge
                          </span>
                        )}
                        <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold text-secondary">
                          {studentLabel(gig.freelancer)}
                        </span>
                        {gig.freelancer?.university && (
                          <span className="rounded-full bg-[#F3F7FA] px-3 py-1 text-[11px] font-semibold text-ink">
                            {gig.freelancer.university}
                          </span>
                        )}
                        {gig.freelancer?.department && (
                          <span className="rounded-full bg-[#F3F7FA] px-3 py-1 text-[11px] font-semibold text-ink">
                            {gig.freelancer.department}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-sm font-bold text-white">
                      {initials(gig.freelancer?.name)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl bg-[#F3F7FA] px-3 py-3">
                    <p className="text-muted">Price</p>
                    <p className="mt-1 font-semibold text-ink">{money(gig.basePrice)}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F3F7FA] px-3 py-3">
                    <p className="text-muted">Rating</p>
                    <p className="mt-1 font-semibold text-ink">{gig.ratingAverage.toFixed(1)}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F3F7FA] px-3 py-3">
                    <p className="text-muted">Speed</p>
                    <p className="mt-1 font-semibold text-ink">{gig.quickTask ? `${gig.quickDeliveryHours}h` : `${gig.deliveryDays}d`}</p>
                  </div>
                </div>

                <button className="btn-gradient w-full" onClick={payWithStripe} type="button">
                  Pay with Stripe
                </button>
                <button className="btn-primary w-full" onClick={placeOrder} type="button">
                  Order with Easypaisa
                </button>
                <button className="btn-ghost w-full" onClick={openChat} type="button">
                  Start chat
                </button>
                <p className="text-xs leading-5 text-muted">Secure checkout. Release payment after approval and delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ink">Gig preview</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
                Video intro optional
              </span>
            </div>
            {gig.videoUrl ? (
              <div className="mt-5 overflow-hidden rounded-[24px] bg-black shadow-lift">
                <video controls className="aspect-[16/9] w-full object-cover">
                  <source src={gig.videoUrl} />
                </video>
              </div>
            ) : (
                <div className="mt-5 overflow-hidden rounded-[24px] border border-dashed border-border-color bg-[#F3F7FA] p-8 text-center text-sm text-muted">
                This gig has no video yet. Add a short intro later for a richer preview.
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ink">Packages & add-ons</h2>
              <span className="text-xs text-muted">Custom builder</span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {gig.services?.map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-[22px] border border-border-color bg-[#F3F7FA] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-secondary">{item.durationHours} hours</p>
                    </div>
                    <span className="price-pill">{money(item.price)}</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-muted">
                    {item.included.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {gig.faqs?.length > 0 && (
            <div className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-ink">FAQs</h2>
                <span className="text-xs text-muted">Student answers</span>
              </div>
              <div className="mt-5 space-y-4">
                {gig.faqs.map((item, index) => (
                  <div key={`faq-${index}`} className="rounded-[22px] border border-border-color bg-[#F3F7FA] p-4">
                    <p className="font-semibold text-ink">{item.question}</p>
                    <p className="mt-2 text-sm text-muted">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gig.requirements?.length > 0 && (
            <div className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-ink">Requirements</h2>
                <span className="text-xs text-muted">What buyers should share</span>
              </div>
              <div className="mt-5 space-y-4">
                {gig.requirements.map((item, index) => (
                  <div key={`req-${index}`} className="rounded-[22px] border border-border-color bg-[#F3F7FA] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-ink">{item.question}</p>
                      <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold text-secondary">
                        {item.type}
                      </span>
                    </div>
                    {item.options?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.options.map((opt) => (
                          <span key={opt} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">
                            {opt}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 text-xs text-muted">
                      {item.mandatory ? 'Required for order start.' : 'Optional request.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <section className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ink">Reviews</h2>
              <span className="text-sm text-muted">{gig.ratingCount} total</span>
            </div>
            <form onSubmit={submitReview} className="mt-5 grid gap-3 md:grid-cols-[1fr,140px]">
              <input
                className="rounded-full border border-[#E5E7EB] px-4 py-3"
                placeholder="Your name"
                value={form.reviewer}
                onChange={(event) => setForm({ ...form, reviewer: event.target.value })}
                required
              />
              <select
                className="rounded-full border border-[#E5E7EB] px-4 py-3"
                value={form.rating}
                onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((score) => (
                  <option key={score} value={score}>
                    {score} stars
                  </option>
                ))}
              </select>
              <textarea
                className="md:col-span-2 rounded-[22px] border border-[#E5E7EB] px-4 py-3"
                rows="4"
                placeholder="Share your experience"
                value={form.comment}
                onChange={(event) => setForm({ ...form, comment: event.target.value })}
                required
              />
              <button className="btn-primary md:col-span-2">Submit review</button>
            </form>

            <div className="mt-6 grid gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="rounded-[22px] border border-border-color bg-[#F3F7FA] p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-ink">{review.reviewer}</p>
                    <span className="text-sm font-semibold text-primary">{review.rating} stars</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p>
                </div>
              ))}
              {!reviews.length && <p className="text-sm text-muted">No reviews yet.</p>}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="rounded-[28px] border border-border-color bg-card-bg p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Student summary</p>
            <h3 className="mt-3 text-2xl font-semibold text-ink">{gig.freelancer?.name}</h3>
            <p className="mt-1 text-sm text-muted">{gig.freelancer?.title}</p>
            <p className="mt-1 text-sm text-muted">{gig.freelancer?.location}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {gig.freelancer?.verifiedStudent && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Verified badge
                </span>
              )}
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                {studentLabel(gig.freelancer)}
              </span>
              {gig.freelancer?.department && (
                <span className="rounded-full bg-[#F3F7FA] px-3 py-1 text-xs font-semibold text-ink">
                  {gig.freelancer.department}
                </span>
              )}
            </div>
            {gig.freelancerId && (
              <Link className="mt-4 inline-flex text-sm font-semibold text-primary hover:text-secondary" to={`/seller/${gig.freelancerId}`}>
                View public profile
              </Link>
            )}
            <div className="mt-5 grid gap-3">
                {['Top campus creator', 'Fast replies', 'Trusted by local buyers'].map((item) => (
                <div key={item} className="rounded-2xl bg-[#F3F7FA] px-4 py-3 text-sm text-muted">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-color bg-card-bg p-4 shadow-lift lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div>
            <p className="text-xs text-muted">Starting from</p>
            <p className="text-lg font-semibold text-ink">{money(gig.basePrice)}</p>
          </div>
          <button className="btn-gradient ml-auto" onClick={payWithStripe} type="button">
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
