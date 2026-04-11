import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGigs, searchGigs } from '../api.js';

const topCategories = [
  'Graphics & Design',
  'Programming & Tech',
  'Digital Marketing',
  'Video & Animation',
  'Writing & Translation',
  'Music & Audio',
  'Business',
  'AI Services',
];

const categoryTiles = [
  { name: 'Logo Design', code: 'LD' },
  { name: 'Web Development', code: 'WD' },
  { name: 'Social Media', code: 'SM' },
  { name: 'Video Editing', code: 'VE' },
  { name: 'SEO', code: 'SEO' },
  { name: 'Mobile Apps', code: 'APP' },
  { name: 'Branding', code: 'BR' },
  { name: 'Voice Over', code: 'VO' },
];

const megaMenu = [
  {
    title: 'Graphics & Design',
    items: ['Logo Design', 'Brand Style Guides', 'Illustration', 'Social Media Design'],
  },
  {
    title: 'Programming & Tech',
    items: ['Web Development', 'E-commerce', 'WordPress', 'Mobile Apps'],
  },
  {
    title: 'Digital Marketing',
    items: ['SEO', 'Social Media', 'Content Marketing', 'Email Marketing'],
  },
  {
    title: 'Video & Animation',
    items: ['Video Editing', 'Explainer Videos', 'Animated Ads', 'Shorts'],
  },
];

const highlightStats = [
  { label: 'Verified sellers', value: '1,250+' },
  { label: 'Avg response time', value: '1 hour' },
  { label: 'Projects delivered', value: '24k+' },
];

export default function GigList() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [quickOnly, setQuickOnly] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 70000]);
  const [filterOpen, setFilterOpen] = useState(false);
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
    <div className="space-y-12">
      {/* Category bar */}
      <div className="hide-scrollbar flex w-full items-center gap-3 overflow-x-auto rounded-full bg-white/70 px-4 py-3 text-sm font-semibold text-ink shadow-soft lg:justify-between lg:px-6">
        {topCategories.map((item) => (
          <button key={item} className="whitespace-nowrap text-muted hover:text-primary transition">
            {item}
          </button>
        ))}
      </div>

      {/* Hero */}
      <section className="rounded-3xl bg-white p-6 md:p-10 shadow-soft card-gold">
        <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-soft px-4 py-1 text-xs font-semibold text-primary">
              Premium freelance marketplace
            </p>
            <h1 className="font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
              Hire top freelancers in seconds.
            </h1>
            <p className="text-base text-muted">
              Build faster with vetted talent, smart matching, and premium service options designed for busy teams.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex w-full items-center gap-3 rounded-full border border-[#E5E7EB] bg-white px-5 py-3 shadow-soft sm:w-[440px]">
                <span className="text-muted">Search</span>
                <input
                  className="w-full border-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
                  placeholder="Try: logo design, Shopify, AI video"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <button className="btn-gradient">Search</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Website Design', 'Logo', 'AI Video', 'SEO', 'Translation'].map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-soft p-5 md:p-6">
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
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {highlightStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-4">
              <p className="text-sm text-muted">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Explore services</h2>
          <button className="btn-ghost text-sm">View all</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryTiles.map((item) => (
            <div key={item.name} className="card card-hover p-5">
              <div className="text-sm font-semibold text-primary">{item.code}</div>
              <p className="mt-4 font-semibold text-ink">{item.name}</p>
              <p className="text-sm text-muted">Top talent, fast delivery.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category mega menu */}
      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Browse categories</h2>
          <button className="btn-ghost text-sm">All categories</button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {megaMenu.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="font-semibold text-ink">{group.title}</p>
              <ul className="space-y-2 text-sm text-muted">
                {group.items.map((item) => (
                  <li key={item} className="hover:text-primary transition">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Best match */}
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

      {/* Filters + results */}
      <section className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <div className="flex items-center justify-between lg:hidden">
          <p className="font-semibold text-ink">Filters</p>
          <button className="btn-ghost text-sm" onClick={() => setFilterOpen(true)} type="button">
            Open filters
          </button>
        </div>
        <aside className="card p-6 space-y-5 lg:sticky lg:top-24 h-fit">
          <div>
            <p className="text-sm font-semibold text-muted">Category</p>
            <select
              className="mt-3 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All categories</option>
              {topCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
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
              <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl bg-white sm:h-48">
                {gig.images?.[0] ? (
                  <img src={gig.images[0]} alt={gig.title} className="h-full w-full object-cover image-zoom" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    Gig preview
                  </div>
                )}
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-soft">
                  {gig.category}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{gig.quickTask ? 'Quick Task' : `Delivery ${gig.deliveryDays} days`}</span>
                <span>Rating {gig.ratingAverage.toFixed(1)}/5</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-ink group-hover:text-primary">{gig.title}</h3>
              <p className="mt-2 text-sm text-muted line-clamp-2">{gig.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-7 w-7 rounded-full bg-soft text-primary grid place-items-center text-xs font-semibold">
                    {gig.freelancer?.name ? gig.freelancer.name.split(' ').map((p) => p[0]).join('') : 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">{gig.freelancer?.name || 'Verified seller'}</p>
                    <p className="text-[11px] text-muted">Top Rated</p>
                  </div>
                </div>
                <span className="price-pill hidden sm:inline-flex">PKR {gig.basePrice.toLocaleString('en-PK')}</span>
              </div>
              <div className="mt-3 flex items-center justify-between sm:hidden">
                <span className="price-pill">PKR {gig.basePrice.toLocaleString('en-PK')}</span>
                <span className="text-xs text-muted">⭐ {gig.ratingAverage.toFixed(1)}</span>
              </div>
              <button className="mt-4 w-full rounded-full border border-primary/20 bg-soft px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">
                Quick Hire
              </button>
            </Link>
          ))}
        </div>
      </section>

      {filterOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-ink">Filters</p>
              <button onClick={() => setFilterOpen(false)} type="button">
                ×
              </button>
            </div>
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-semibold text-muted">Category</p>
                <select
                  className="mt-3 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="">All categories</option>
                  {topCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
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
              <button className="btn-primary w-full" onClick={() => setFilterOpen(false)} type="button">
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
