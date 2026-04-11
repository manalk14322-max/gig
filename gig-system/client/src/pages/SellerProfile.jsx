import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSellerPublic } from '../api.js';

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

  return (
    <div className="space-y-8">
      <Link className="text-sm font-semibold text-primary" to="/">
        {'<'}- Back to marketplace
      </Link>

      <section className="card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary text-white grid place-items-center font-bold">
              {seller.name?.split(' ').map((part) => part[0]).join('')}
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold">{seller.name}</h1>
              <p className="text-sm text-muted">{seller.title}</p>
              <p className="text-sm text-muted">{seller.location}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="tag">Top Rated</span>
                <span className="tag">Verified</span>
              </div>
            </div>
          </div>
          <button className="btn-gradient">Contact seller</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {['Response rate 98%', 'On-time delivery 96%', 'Repeat clients 52%'].map((stat) => (
            <div key={stat} className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-muted">
              {stat}
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-semibold">Portfolio</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {seller.portfolio?.length ? (
            seller.portfolio.map((item) => (
              <div key={item} className="rounded-2xl border border-[#E5E7EB] bg-base p-4">
                <p className="text-sm text-muted">{item}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No portfolio items yet.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {gigs.map((gig) => (
          <Link key={gig._id} to={`/gig/${gig._id}`} className="card card-hover p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">
                {gig.category}
              </span>
              <span className="text-xs text-muted">{gig.quickTask ? 'Quick Task' : `${gig.deliveryDays} days`}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">{gig.title}</h3>
            <p className="mt-2 text-sm text-muted line-clamp-2">{gig.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-semibold text-ink">PKR {gig.basePrice.toLocaleString('en-PK')}</span>
              <span className="text-muted">{gig.ratingAverage.toFixed(1)} stars</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
