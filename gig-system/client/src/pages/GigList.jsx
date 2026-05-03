import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGigs, searchGigs } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';
import paymentEasypaisa from '../assets/brand/payment-easypaisa.svg';
import paymentJazzcash from '../assets/brand/payment-jazzcash.svg';
import paymentRaast from '../assets/brand/payment-raast.svg';
import paymentBank from '../assets/brand/payment-bank.svg';
import heroTeam from '../assets/brand/photos/team-laptop.jpg';
import heroMagazineLight from '../assets/brand/photos/campus-magazine-light.jpg';
import heroMagazineDark from '../assets/brand/photos/campus-magazine-dark.jpg';
import heroWelcome from '../assets/brand/photos/welcome-student.jpg';

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

const quickSearches = ['Logo design', 'Website', 'Urdu content', 'Video editing'];

const cityOptions = ['Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Online'];

const buyerPath = [
  {
    title: 'Choose a service',
    description: 'Pick a category or send a short request in simple words.',
  },
  {
    title: 'Compare trusted sellers',
    description: 'See reviewed gigs, clear prices, and Pakistani seller profiles.',
  },
  {
    title: 'Start safely',
    description: 'Chat first, confirm scope, then place the order when ready.',
  },
];

const browseGroups = [
  {
    title: 'For Pakistani buyers',
    items: ['Verified local talent', 'Admin-approved gigs', 'Clear packages', 'Lower platform fees'],
  },
  {
    title: 'For Pakistani students',
    items: ['FSc+ review', 'College details', 'Portfolio check', 'Gig approval'],
  },
  {
    title: 'Popular services',
    items: ['Web development', 'UI/UX design', 'Branding', 'Digital marketing'],
  },
  {
    title: 'Trust system',
    items: ['Human verification', 'Secure orders', 'Local payouts', 'Client protection'],
  },
];

const verificationSteps = [
  {
    title: 'Apply with education details',
    description: 'Students share FSc, college, university, skills, and portfolio details.',
  },
  {
    title: 'UniHire reviews the profile',
    description: 'The admin team checks Pakistani identity, education level, and seller readiness before approval.',
  },
  {
    title: 'Gig goes live after approval',
    description: 'Only trusted local sellers can publish services, so Pakistani buyers see a safer marketplace.',
  },
];

const platformAdvantages = [
  {
    title: 'Lower commission for sellers',
    description: 'The platform is designed so Pakistani students keep more of what they earn.',
  },
  {
    title: 'Pakistani talent, Pakistani buyers',
    description: 'Both sellers and buyers are local, so hiring feels familiar, safer, and easier to support.',
  },
  {
    title: 'Quality before quantity',
    description: 'Every seller profile and gig is reviewed before being visible to buyers.',
  },
];

const proofPoints = [
  { value: 'FSc+', label: 'minimum education review' },
  { value: 'PK', label: 'Pakistani buyer and seller network' },
  { value: '24h', label: 'admin response target' },
  { value: 'Fair', label: 'lower commission model' },
];

const startCards = [
  {
    audience: 'For clients',
    title: 'Hire with more confidence',
    description: 'Browse admin-reviewed gigs from verified Pakistani students and compare clear packages before ordering.',
    action: 'Browse verified gigs',
    href: '#marketplace',
  },
  {
    audience: 'For students',
    title: 'Apply once, then publish gigs',
    description: 'Share your FSc, college, university, and portfolio details. After review, your services can go live for Pakistani buyers.',
    action: 'Start seller profile',
    href: '/profile',
  },
];

const paymentLogos = [
  {
    name: 'Easypaisa',
    url: paymentEasypaisa,
  },
  {
    name: 'JazzCash',
    url: paymentJazzcash,
  },
  {
    name: 'Raast',
    url: paymentRaast,
  },
  {
    name: 'Bank transfer',
    url: paymentBank,
  },
];

const growthCards = [
  {
    title: 'Verified Pakistani students',
    description: 'Build trust with FSc, college, university, skills, and public portfolios.',
    image: heroTeam,
  },
  {
    title: 'Built for Pakistani buyers',
    description: 'Clear packages, professional profiles, and local context make hiring easier across Pakistan.',
    image: heroMagazineLight,
  },
  {
    title: 'Fairer earnings for students',
    description: 'A lower-commission model helps freelancers turn education into real work opportunities.',
    image: heroWelcome,
  },
];

const supportCards = [
  {
    title: 'Verified before visible',
    description: 'Student profiles and gigs are reviewed before clients can order.',
    tone: 'bg-[#121826] text-white',
  },
  {
    title: 'Lower fee promise',
    description: 'A lean commission model keeps the marketplace affordable for new freelancers.',
    tone: 'bg-[#E1F5EF] text-ink',
  },
  {
    title: 'Client confidence',
    description: 'Education checks, portfolios, reviews, and order protection reduce hiring risk.',
    tone: 'bg-[#1C2B3A] text-white',
  },
];

const pakCategoryTiles = [
  { label: 'Urdu Translation', icon: 'UR' },
  { label: 'Shopify Stores', icon: 'SH' },
  { label: 'YouTube Thumbnails', icon: 'YT' },
  { label: 'TikTok Reels', icon: 'TT' },
  { label: 'Assignment Support', icon: 'AS' },
  { label: 'UI/UX Design', icon: 'UX' },
  { label: 'SEO Pakistan', icon: 'SEO' },
  { label: 'WordPress Fixes', icon: 'WP' },
];

const emptyStateCopy = [
  'Try a broader category or clear the filters to see more gigs.',
  'Verified Pakistani student sellers, quick delivery, and transparent packages are available for Pakistani buyers.',
];

function money(value) {
  return `PKR ${Number(value || 0).toLocaleString('en-PK')}`;
}

function initials(name = 'UniHire') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function GigCard({ gig }) {
  return (
    <Link
      to={`/gig/${gig._id}`}
      className="group card-premium overflow-hidden rounded-[20px] shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:rounded-[24px]"
    >
      <div className="relative h-44 overflow-hidden bg-soft sm:h-52">
        {gig.images?.[0] ? (
          <img
            src={gig.images[0]}
            alt={gig.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-soft via-white to-[#EFF6FF] text-sm font-semibold text-muted">
            Premium gig preview
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-soft">
              {gig.category}
            </span>
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-soft">
              {gig.ratingAverage.toFixed(1)} rating
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
              {gig.quickTask ? 'Quick task' : `Delivery ${gig.deliveryDays} days`}
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-snug text-ink group-hover:text-primary">{gig.title}</h3>
          </div>
          <span className="price-pill whitespace-nowrap">{money(gig.basePrice)}</span>
        </div>

        <p className="text-sm leading-6 text-muted line-clamp-2">{gig.description}</p>

        <div className="flex flex-col gap-3 rounded-2xl bg-bg-light px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-xs font-bold text-white">
              {gig.freelancer?.name ? initials(gig.freelancer.name) : 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{gig.freelancer?.name || 'Verified student seller'}</p>
              <p className="text-xs text-muted">{gig.freelancer?.title || 'Top campus creator'}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {gig.freelancer?.verifiedStudent && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Verified badge
                  </span>
                )}
                <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                  {gig.freelancer?.verifiedStudent ? 'Verified student' : 'Student seller'}
                </span>
                {gig.freelancer?.university && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-ink">
                    {gig.freelancer.university}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm font-semibold text-primary">4.9</p>
            <p className="text-xs text-muted">Local support</p>
          </div>
        </div>

        <div className="w-full rounded-full border border-primary/15 bg-gradient-to-r from-soft to-white px-4 py-3 text-center text-sm font-semibold text-primary transition group-hover:border-primary/30 group-hover:bg-primary group-hover:text-white">
          Quick Hire
        </div>
      </div>
    </Link>
  );
}

export default function GigList() {
  const { user } = useAuth();
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [quickOnly, setQuickOnly] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 70000]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [results, setResults] = useState([]);
  const [searchReady, setSearchReady] = useState(false);
  const [briefCategory, setBriefCategory] = useState('Programming & Tech');
  const [briefBudget, setBriefBudget] = useState('15000');
  const [briefCity, setBriefCity] = useState('Online');
  const [briefSent, setBriefSent] = useState(false);

  useEffect(() => {
    fetchGigs({ featured: true }).then(setFeatured);
  }, []);

  useEffect(() => {
    setSearchReady(false);
    searchGigs({
      q: query,
      category: category || undefined,
      quick: quickOnly ? 'true' : undefined,
      minPrice: priceRange[0] || undefined,
      maxPrice: priceRange[1] || undefined,
    }).then((data) => {
      setResults(data.results || []);
      setSearchReady(true);
    });
  }, [query, category, quickOnly, priceRange]);

  const liveCatalog = searchReady ? results : featured;
  const curatedGigs = (liveCatalog.length ? liveCatalog : featured).slice(0, 6);
  const heroName = user?.name?.split(' ')[0] || 'there';

  const submitQuickBrief = (event) => {
    event.preventDefault();
    setCategory(briefCategory);
    setPriceRange([0, Number(briefBudget)]);
    setQuery('');
    setBriefSent(true);
    document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6 pb-0 md:space-y-10">
      <div className="hide-scrollbar relative left-1/2 right-1/2 hidden w-screen -ml-[50vw] -mr-[50vw] items-center gap-2 overflow-x-auto border-y border-border-color bg-white px-4 py-2 text-xs font-semibold text-ink sm:flex sm:px-6">
        <button
          type="button"
          onClick={() => setCategory('')}
          className="whitespace-nowrap rounded-full bg-bg-light px-4 py-1.5 text-muted hover:text-primary border border-border-color"
        >
          Trending now
        </button>
        {topCategories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 transition ${
              category === item
                ? 'bg-primary text-white shadow-soft'
                : 'bg-bg-light text-muted hover:bg-white hover:text-primary border border-border-color'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] overflow-hidden bg-bg-light">
        <div className="px-0 py-0">
          <div className="overflow-hidden border border-border-color bg-white shadow-lift">
            <div className="grid gap-0 lg:min-h-[560px] lg:grid-cols-[0.98fr,1.02fr]">
              <div className="flex items-center px-4 py-8 sm:px-10 sm:py-12 lg:px-16">
                <div className="mx-auto max-w-2xl space-y-4 text-center sm:space-y-5 sm:text-left">
                  <div className="inline-flex items-center rounded-full bg-soft px-4 py-1.5 text-xs font-semibold text-primary">
                    Pakistan-only users
                  </div>
                  <p className="text-sm font-semibold text-muted">
                    {user ? `Welcome back, ${heroName}` : 'Welcome to UniHire'}
                  </p>
                  <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tight text-ink sm:text-5xl md:text-6xl">
                    {t('heroTitle')}
                  </h1>
                  <p className="mx-auto max-w-xl text-sm leading-6 text-muted sm:mx-0 sm:text-base sm:leading-7 md:text-lg">
                    {t('heroSubtitle')}
                  </p>
                  <div className="flex max-w-xl flex-col gap-3 rounded-[20px] border border-border-color bg-bg-light p-3 shadow-soft sm:flex-row sm:rounded-[22px]">
                    <input
                      className="min-h-12 flex-1 rounded-[16px] border border-transparent bg-white px-4 text-sm text-ink outline-none focus:border-primary"
                      placeholder="What do you need built?"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <button className="rounded-[16px] bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift sm:w-auto">
                      Search
                    </button>
                  </div>
                  <div className="hide-scrollbar -mx-1 flex max-w-xl items-center gap-2 overflow-x-auto px-1 text-xs font-semibold sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                    {quickSearches.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setQuery(item)}
                        className="whitespace-nowrap rounded-full border border-border-color bg-white px-3 py-1.5 text-ink transition hover:border-primary hover:text-primary"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
                    <Link to="/profile" className="rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                      Apply as seller
                    </Link>
                    <a href="#marketplace" className="rounded-full border border-border-color bg-white px-6 py-3 text-center text-sm font-semibold text-ink shadow-soft">
                      Browse gigs
                    </a>
                  </div>
                  <div className="hidden flex-wrap gap-2 pt-2 text-xs font-semibold text-muted sm:flex">
                    <span className="rounded-full bg-white px-4 py-2 shadow-soft">FSc+ students</span>
                    <span className="rounded-full bg-white px-4 py-2 shadow-soft">Admin checked</span>
                    <span className="rounded-full bg-white px-4 py-2 shadow-soft">Fair fees</span>
                  </div>
                </div>
              </div>
              <div className="bg-bg-light px-4 pb-6 sm:px-0 sm:pb-0 lg:relative lg:min-h-[460px]">
                <div className="relative overflow-hidden rounded-[24px] border border-border-color bg-white shadow-soft sm:rounded-none sm:border-0 sm:shadow-none lg:absolute lg:inset-0">
                  <img
                    src={heroTeam}
                    alt="Verified Pakistani student talent"
                    className="h-56 w-full object-cover object-[50%_68%] sm:h-[380px] sm:object-[50%_52%] lg:h-full lg:object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 sm:bg-gradient-to-l sm:from-black/20 sm:via-white/10 sm:to-white/75" />
                </div>
                <div className="relative z-10 mt-3 rounded-[20px] border border-border-color bg-white p-4 shadow-soft sm:absolute sm:bottom-6 sm:left-6 sm:right-6 sm:mx-0 sm:mt-0 sm:rounded-[24px] sm:border-white/70 sm:bg-white/95 sm:p-5 sm:shadow-lift sm:backdrop-blur">
                  <p className="text-sm font-semibold text-ink">Trust-first marketplace</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['FSc+ review', 'Approved gigs', 'Lower fees'].map((item) => (
                      <span key={item} className="rounded-full bg-soft px-3 py-2 text-xs font-semibold text-primary">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-border-color bg-white p-4 shadow-soft md:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {proofPoints.map((item) => (
            <div key={item.label} className="rounded-[20px] bg-bg-light px-5 py-4">
              <p className="text-2xl font-semibold text-primary">{item.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Verified services</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Admin-reviewed gigs from Pakistani students</h2>
          </div>
          <button className="btn-ghost w-full text-sm sm:w-auto" onClick={() => setFilterOpen(true)} type="button">
            Campus filters
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(curatedGigs.length ? curatedGigs.slice(0, 2) : featured.slice(0, 2)).map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      </section>

      <section id="marketplace" className="scroll-mt-36 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Marketplace</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Popular student-powered services</h2>
          </div>
          <button className="btn-ghost w-full text-sm sm:w-auto" onClick={() => setFilterOpen(true)} type="button">
            Campus filters
          </button>
        </div>

        {searchReady && !results.length ? (
          <div className="rounded-[24px] border border-border-color bg-card-bg p-6 shadow-soft">
            <p className="font-semibold text-ink">No gigs matched your filters.</p>
            <p className="mt-2 text-sm text-muted">{emptyStateCopy[0]}</p>
            <p className="mt-1 text-sm text-muted">{emptyStateCopy[1]}</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('');
                setQuickOnly(false);
                setPriceRange([0, 70000]);
              }}
              className="mt-5 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(curatedGigs.length ? curatedGigs : featured).map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 rounded-[28px] border border-border-color bg-white p-4 shadow-soft md:grid-cols-[0.9fr,1.1fr] md:p-6">
        <div className="rounded-[24px] bg-bg-light p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Quick start</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Find the right Pakistani seller faster</h2>
          <div className="mt-5 space-y-3">
            {buyerPath.map((item, index) => (
              <div key={item.title} className="flex gap-3 rounded-[18px] bg-white p-4 shadow-soft">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submitQuickBrief} className="rounded-[24px] border border-border-color bg-card-bg p-5 shadow-soft">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Buyer request</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Tell us what you need</h2>
            </div>
            {briefSent && (
              <span className="rounded-full bg-soft px-3 py-2 text-xs font-semibold text-primary">
                Matching gigs updated
              </span>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-muted">
              Service type
              <select
                value={briefCategory}
                onChange={(event) => setBriefCategory(event.target.value)}
                className="w-full rounded-2xl border border-border-color bg-bg-light px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              >
                {topCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-muted">
              Max budget
              <select
                value={briefBudget}
                onChange={(event) => setBriefBudget(event.target.value)}
                className="w-full rounded-2xl border border-border-color bg-bg-light px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              >
                <option value="10000">Under PKR 10,000</option>
                <option value="15000">Under PKR 15,000</option>
                <option value="30000">Under PKR 30,000</option>
                <option value="70000">Flexible budget</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-muted sm:col-span-2">
              Buyer city
              <select
                value={briefCity}
                onChange={(event) => setBriefCity(event.target.value)}
                className="w-full rounded-2xl border border-border-color bg-bg-light px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              >
                {cityOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" className="btn-gradient text-sm">
              Show matching gigs
            </button>
            <p className="text-xs leading-5 text-muted">
              This demo keeps your request on this page. Full saved requests can be connected with backend later.
            </p>
          </div>
        </form>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Explore</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Built differently from open marketplaces</h2>
          </div>
          <button className="btn-ghost w-full text-sm sm:w-auto">All categories</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {browseGroups.map((group) => (
            <details key={group.title} className="group rounded-[22px] border border-border-color bg-card-bg p-5 shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink">
                {group.title}
                <span className="text-muted transition group-open:rotate-45">+</span>
              </summary>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>


      <section className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] overflow-hidden border-y border-border-color bg-card-bg shadow-soft sm:rounded-[28px] sm:border">
        <div className="grid gap-6 px-4 py-6 sm:px-6 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <div className="flex h-full flex-col justify-center gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Become a UniHire seller</p>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Turn your Pakistani education into local freelance work</h2>
            <p className="text-sm leading-6 text-muted">
              Apply with your FSc, college, or university details, complete verification, and publish gigs after admin approval.
            </p>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Link to="/profile" className="btn-gradient text-sm">
                Create your profile
              </Link>
              <Link to="/create" className="btn-ghost text-sm">
                Build your first gig
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-3">
              {paymentLogos.map((logo) => (
                <img key={logo.name} src={logo.url} alt={logo.name} className="h-8 object-contain opacity-90" />
              ))}
            </div>
          </div>
          <div className="rounded-[20px] bg-bg-light p-3 sm:rounded-[24px] sm:p-4">
            <img
              src={heroMagazineLight}
              alt="Student creator"
              className="h-64 w-full rounded-[18px] object-cover sm:h-full sm:rounded-[20px]"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Verification flow</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">How trusted students get approved</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {verificationSteps.map((stepItem, index) => (
            <div key={stepItem.title} className="card-premium rounded-[22px] p-6 shadow-soft">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-sm font-bold text-white">
                0{index + 1}
              </div>
              <p className="mt-5 text-lg font-semibold text-ink">{stepItem.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{stepItem.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Why it works</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">A marketplace designed for Pakistan's student economy</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {growthCards.map((card) => (
            <div key={card.title} className="card-premium overflow-hidden rounded-[22px] shadow-soft">
              <div className="h-44 overflow-hidden">
                <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <p className="text-lg font-semibold text-ink">{card.title}</p>
                <p className="mt-2 text-sm text-muted">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-border-color shadow-lift">
        <div
          className="grid gap-8 bg-[#0B0F1D] px-6 py-10 text-white md:grid-cols-[1.05fr,0.95fr] md:px-10"
          style={{
            backgroundImage:
              `linear-gradient(120deg, rgba(8,12,24,0.95), rgba(8,12,24,0.78)), url(${heroMagazineDark})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Trust first</p>
            <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
              A safer way for Pakistanis to hire emerging student talent
            </h2>
            <p className="text-sm text-white/70 md:text-base">
              UniHire is not an open sign-up board. Sellers are reviewed, gig quality is checked, and Pakistani buyers get a clearer path to trusted student freelancers.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {supportCards.map((card) => (
                <div key={card.title} className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="mt-2 text-xs text-white/70">{card.description}</p>
                </div>
              ))}
            </div>
            <a href="#marketplace" className="inline-flex rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white/90 hover:bg-white/10">
              Explore marketplace
            </a>
          </div>
          <div className="relative min-h-[220px] overflow-hidden rounded-[22px] bg-white/5 sm:min-h-[280px]">
            <img src={heroTeam} alt="Campus teams" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
        </div>
      </section>

      <section
        className="overflow-hidden rounded-[28px] border border-border-color bg-[#0B0F1D] p-6 text-white shadow-lift md:p-8"
        style={{
          backgroundImage:
            `linear-gradient(120deg, rgba(11,15,29,0.9), rgba(11,15,29,0.7)), url(${heroMagazineDark})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-2xl space-y-4">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Show Pakistan what verified student talent can build</h2>
          <p className="text-sm text-white/70">
            Apply as a student seller, complete verification, and start earning from Pakistani buyers with lower platform fees.
          </p>
          <Link to="/create" className="inline-flex rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white">
            Get started
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Pakistan categories</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">High-demand services from verified Pakistani students</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pakCategoryTiles.map((tile) => (
            <div key={tile.label} className="card card-hover card-premium flex items-center gap-3 p-4">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-soft text-xs font-semibold text-primary">
                {tile.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{tile.label}</p>
                <p className="text-xs text-muted">Verified sellers available</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {startCards.map((card) => {
          const content = (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">{card.audience}</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{card.description}</p>
              <span className="mt-5 inline-flex rounded-full bg-soft px-4 py-2 text-sm font-semibold text-primary">
                {card.action}
              </span>
            </>
          );

          return card.href.startsWith('#') ? (
            <a key={card.title} href={card.href} className="rounded-[24px] border border-border-color bg-card-bg p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              {content}
            </a>
          ) : (
            <Link key={card.title} to={card.href} className="rounded-[24px] border border-border-color bg-card-bg p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              {content}
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {platformAdvantages.map((item) => (
          <div key={item.title} className="rounded-[24px] border border-border-color bg-card-bg p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">UniHire difference</p>
            <h2 className="mt-3 text-xl font-semibold text-ink">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
          </div>
        ))}
      </section>

      <footer className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] bg-[#0B0F1D] px-4 py-10 text-white shadow-lift sm:px-6 md:px-10 -mb-24 md:-mb-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr,0.8fr,0.8fr,0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">UniHire</p>
            <p className="mt-3 text-lg font-semibold">Pakistan's verified student freelance marketplace</p>
            <p className="mt-2 text-sm text-white/70">
              Pakistani buyers hire trusted local students through reviewed profiles, approved gigs, and fairer fees.
            </p>
            <div className="mt-5 space-y-2 text-sm text-white/70">
              <p>Phone: 03185756022</p>
              <p>Email: manalk14322@gmail.com</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/80">
              <span className="rounded-full border border-white/15 px-3 py-1">Instagram</span>
              <span className="rounded-full border border-white/15 px-3 py-1">LinkedIn</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Facebook</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Open hours</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>Mon-Fri: 9am - 8pm</li>
              <li>Saturday: 10am - 6pm</li>
              <li>Sunday: 12pm - 4pm</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Address</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>UniHire HQ</li>
              <li>University Road</li>
              <li>Islamabad, Pakistan</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Follow us</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>LinkedIn</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/60">
          <p>Copyright 2026 UniHire. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>

      {filterOpen && (
        <div className="fixed inset-0 z-40 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-80 bg-card-bg p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-ink">Campus filters</p>
              <button onClick={() => setFilterOpen(false)} type="button" className="text-xl leading-none text-muted">
                x
              </button>
            </div>
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-semibold text-muted">Category</p>
                <select
                  className="mt-3 w-full rounded-xl border border-border-color bg-bg-light px-4 py-3 text-sm focus:border-primary focus:outline-none"
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
                  quickOnly ? 'border-primary bg-primary text-white' : 'border-border-color bg-bg-light text-ink'
                }`}
                onClick={() => setQuickOnly((prev) => !prev)}
                type="button"
              >
                Quick Task Mode
              </button>
              <button className="btn-primary w-full" onClick={() => setFilterOpen(false)} type="button">
                Apply campus filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
