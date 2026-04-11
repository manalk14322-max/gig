import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createOrder, createReview, fetchGig, initEasypaisa, startChat, createStripeCheckout } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link className="text-sm font-semibold text-primary" to="/">
          &lt;- Back to marketplace
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>Home</span>
          <span>/</span>
          <span>{gig.category}</span>
        </div>
      </div>

      {/* Gig detail + seller sidebar */}
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="card card-gold p-6">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs uppercase tracking-widest text-primary">{gig.category}</p>
              {gig.quickTask && (
                <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">
                  Quick Task
                </span>
              )}
              {gig.featured && (
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                  Featured
                </span>
              )}
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold">{gig.title}</h1>
            <p className="mt-3 text-muted">{gig.description}</p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted">
              <span>⭐ {gig.ratingAverage.toFixed(1)}</span>
              <span>({gig.ratingCount} reviews)</span>
              <span>Delivery {gig.quickTask ? `${gig.quickDeliveryHours}h` : `${gig.deliveryDays}d`}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {gig.tags?.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Video preview */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Gig preview</h2>
            <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black">
              <video controls className="h-full w-full object-cover">
                <source src={gig.videoUrl} />
              </video>
            </div>
          </div>

          {/* Dynamic services list */}
          <div className="card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Packages & add-ons</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {gig.services?.map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-2xl border border-[#E5E7EB] bg-base p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item.title}</p>
                    <span className="text-sm text-muted">PKR {item.price.toLocaleString('en-PK')}</span>
                  </div>
                    <p className="mt-1 text-xs text-muted">{item.durationHours} hours</p>
                    <ul className="mt-3 space-y-1 text-sm text-muted">
                      {item.included.map((feature) => (
                      <li key={feature}>- {feature}</li>
                      ))}
                    </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          {/* Seller card */}
          <div className="card p-6">
            <p className="text-sm font-semibold text-muted">Seller</p>
            <h3 className="text-xl font-semibold">{gig.freelancer?.name}</h3>
            <p className="text-sm text-muted">{gig.freelancer?.title}</p>
            <p className="mt-2 text-sm text-muted">{gig.freelancer?.location}</p>
            {gig.freelancerId && (
              <a className="mt-3 inline-block text-sm font-semibold text-primary" href={`/seller/${gig.freelancerId}`}>
                View profile
              </a>
            )}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-semibold">Rating</span>
              <span>{gig.ratingAverage.toFixed(1)} stars</span>
            </div>
          </div>

          {/* Pricing CTA */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted">Starting price</p>
              <span className="text-lg font-bold text-primary">PKR {gig.basePrice.toLocaleString('en-PK')}</span>
            </div>
            <p className="text-sm text-muted">Delivery in {gig.quickTask ? `${gig.quickDeliveryHours} hours` : `${gig.deliveryDays} days`}</p>
            <button className="btn-gradient w-full" onClick={payWithStripe} type="button">
              Pay with Stripe
            </button>
            <button className="btn-primary w-full" onClick={placeOrder} type="button">
              Order with Easypaisa
            </button>
            <button className="btn-ghost w-full" onClick={openChat} type="button">
              Start chat
            </button>
            <p className="text-xs text-muted">Secure checkout. Release payment after approval.</p>
          </div>
        </aside>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E7EB] bg-white p-4 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div>
            <p className="text-xs text-muted">Starting from</p>
            <p className="text-lg font-semibold text-ink">PKR {gig.basePrice.toLocaleString('en-PK')}</p>
          </div>
          <button className="btn-gradient ml-auto" onClick={payWithStripe} type="button">
            Pay with Stripe
          </button>
        </div>
      </div>

      {/* Ratings and reviews */}
      <section className="card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <span className="text-sm text-muted">{gig.ratingCount} total</span>
        </div>
        <form onSubmit={submitReview} className="grid gap-3 md:grid-cols-[1fr,140px]">
          <input
            className="rounded-full border border-[#E5E7EB] px-4 py-2"
            placeholder="Your name"
            value={form.reviewer}
            onChange={(event) => setForm({ ...form, reviewer: event.target.value })}
            required
          />
          <select
            className="rounded-full border border-[#E5E7EB] px-4 py-2"
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
            className="md:col-span-2 rounded-2xl border border-[#E5E7EB] px-4 py-3"
            rows="3"
            placeholder="Share your experience"
            value={form.comment}
            onChange={(event) => setForm({ ...form, comment: event.target.value })}
            required
          />
          <button className="btn-primary md:col-span-2">Submit review</button>
        </form>

        <div className="grid gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border border-[#E5E7EB] bg-base p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{review.reviewer}</p>
                <span className="text-sm text-primary">{review.rating} stars</span>
              </div>
              <p className="mt-2 text-sm text-muted">{review.comment}</p>
            </div>
          ))}
          {!reviews.length && <p className="text-sm text-muted">No reviews yet.</p>}
        </div>
      </section>
    </div>
  );
}
