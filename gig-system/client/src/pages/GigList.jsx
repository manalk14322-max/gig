import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGigs, searchGigs } from '../api.js';

const categories = [
  { name: 'Web Development', icon: 'WD' },
  { name: 'Graphic Design', icon: 'GD' },
  { name: 'Digital Marketing', icon: 'DM' },
  { name: 'Video Editing', icon: 'VE' },
  { name: 'Writing & Translation', icon: 'WT' },
  { name: 'AI Services', icon: 'AI' },
  { name: 'Business', icon: 'BZ' },
  { name: 'Finance', icon: 'FN' },
];

const featuredFreelancers = [
  {
    id: 'ff1',
    name: 'Manal Khan',
    title: 'Brand identity & web expert',
    rating: 4.9,
    skills: ['Branding', 'UX', 'React'],
  },
  {
    id: 'ff2',
    name: 'Ayaan Malik',
    title: 'Performance marketing strategist',
    rating: 4.8,
    skills: ['Meta Ads', 'Google', 'SEO'],
  },
  {
    id: 'ff3',
    name: 'Sana Zahra',
    title: 'Short-form video producer',
    rating: 4.9,
    skills: ['Reels', 'TikTok', 'Editing'],
  },
];

export default function GigList() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [quickOnly, setQuickOnly] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 70000]);
  const [featured, setFeatured] = useState([]);
  const [results, setResults] = useState([]);
  const [bestMatch, setBestMatch] = useState(null);

  useEffect(() => {
    fetchGigs({ featured: true }).then(setFeatured);
  }, []);

  useEffect(() => {
    searchGigs({
      q: query,
      category: category || undefined,
      quick: quickOnly ? 'true' : undefined,
      minPrice: priceRange[0] || undefined,
      maxPrice: priceRange[1] || undefined,
    }).then((data) => {
      setResults(data.results || []);
      setBestMatch(data.bestMatch || null);
    });
  }, [query, category, quickOnly, priceRange]);

  const activeResults = useMemo(() => results.slice(0, 12), [results]);

  return (
    <div className="space-y-14">
      <section className="grid gap-10 rounded-3xl bg-white p-10 shadow-soft md:grid-cols-[1.3fr,1fr]">
        <div className="space-y-5">
          <p className="inline-flex items-center rounded-full bg-soft px-4 py-1 text-xs font-semibold text-primary">
            Premium freelance marketplace
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Hire Top Freelancers in Seconds
          </h1>
          <p className="text-base text-muted">
            A curated network of professionals with intelligent matching, verified delivery, and fast collaboration.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex w-full items-center gap-3 rounded-full border border-[#E5E7EB] bg-white px-5 py-3 shadow-soft sm:w-[420px]">
              <span className="text-muted">Search</span>
              <input
                className="w-full border-none bg-transparent text-sm focus:outline-none"
                placeholder="Search gigs, skills, or freelancers"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button className="btn-gradient">Search</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Web Design', 'Logo', 'AI Video', 'SEO', 'Translation'].map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-soft via-white to-white p-6">
          <p className="text-sm font-semibold text-muted">Featured gigs</p>
          <div className="mt-5 space-y-4">
            {featured.slice(0, 3).map((gig) => (
              <Link key={gig._id} to={`/gig/${gig._id}`} className="block rounded-2xl bg-white p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{gig.title}</p>
                  <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">Featured</span>
                </div>
                <p className="text-sm text-muted">{gig.freelancer?.name}</p>
              </Link>
            ))}
            {!featured.length && <p className="text-sm text-muted">No featured gigs yet.</p>}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Explore Categories</h2>
          <button className="btn-ghost text-sm">View all</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => (
            <div key={item.name} className="card card-hover p-5">
              <div className="text-sm font-semibold text-primary">{item.icon}</div>
              <p className="mt-4 font-semibold text-ink">{item.name}</p>
              <p className="text-sm text-muted">Top talent verified weekly.</p>
            </div>
          ))}
        </div>
      </section>

      {bestMatch && (
        <section className="card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">Best Match</p>
              <h2 className="font-display text-2xl font-semibold">{bestMatch.title}</h2>
              <p className="text-sm text-muted">{bestMatch.freelancer?.title}</p>
            </div>
            <Link className="btn-primary text-sm" to={`/gig/${bestMatch._id}`}>
              View gig
            </Link>
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <aside className="card p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-muted">Category</p>
            <select
              className="mt-3 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted">Price range</p>
            <input
              className="mt-4 w-full"
              type="range"
              min="0"
              max="70000"
              value={priceRange[1]}
              onChange={(event) => setPriceRange([0, Number(event.target.value)])}
            />
            <p className="mt-2 text-sm text-muted">Up to PKR {priceRange[1].toLocaleString('en-PK')}</p>
          </div>
          <button
            className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
              quickOnly ? 'border-primary bg-primary text-white' : 'border-[#E5E7EB] bg-white text-ink'
            }`}
            onClick={() => setQuickOnly((prev) => !prev)}
            type="button"
          >
            Quick Task Mode
          </button>
        </aside>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {activeResults.map((gig) => (
            <Link key={gig._id} to={`/gig/${gig._id}`} className="card card-hover group p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">
                  {gig.category}
                </span>
                <span className="text-xs text-muted">{gig.quickTask ? 'Quick Task' : `${gig.deliveryDays} days`}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink group-hover:text-primary">{gig.title}</h3>
              <p className="mt-2 text-sm text-muted line-clamp-2">{gig.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-ink">PKR {gig.basePrice.toLocaleString('en-PK')}</span>
                <span className="text-muted">{gig.ratingAverage.toFixed(1)} stars</span>
              </div>
              <button className="mt-4 w-full rounded-full border border-primary/20 bg-soft px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">
                Quick Hire
              </button>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Top Rated Freelancers</h2>
          <button className="btn-ghost text-sm">Browse talent</button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredFreelancers.map((freelancer) => (
            <div key={freelancer.id} className="card card-hover p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-soft text-primary grid place-items-center font-semibold">
                    {freelancer.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{freelancer.name}</p>
                    <p className="text-sm text-muted">{freelancer.title}</p>
                  </div>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Top Rated
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {freelancer.skills.map((skill) => (
                  <span key={skill} className="tag">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">Rating {freelancer.rating} average</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
