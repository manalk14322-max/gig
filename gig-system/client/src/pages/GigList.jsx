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

const browseGroups = [
  {
    title: 'For global clients',
    items: ['Verified Pakistani talent', 'Admin-approved gigs', 'Clear packages', 'Lower platform fees'],
  },
  {
    title: 'For Pakistani graduates',
    items: ['BS degree review', 'University details', 'Portfolio check', 'Gig approval'],
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

const trustStats = [
  { label: 'Seller type', value: 'Pakistani graduates' },
  { label: 'Gig status', value: 'Admin reviewed' },
  { label: 'Platform fee', value: 'Lower commission' },
];

const verificationSteps = [
  {
    title: 'Apply with education details',
    description: 'Students share university, degree, department, graduation year, and portfolio links.',
  },
  {
    title: 'UniHire reviews the profile',
    description: 'The admin team checks identity signals, academic details, and seller readiness before approval.',
  },
  {
    title: 'Gig goes live after approval',
    description: 'Only trusted sellers can publish services, so clients see a cleaner and safer marketplace.',
  },
];

const platformAdvantages = [
  {
    title: 'Lower commission for sellers',
    description: 'The platform is designed so Pakistani freelancers keep more of what they earn.',
  },
  {
    title: 'Pakistani talent, global clients',
    description: 'Freelancers are local and verified, while clients can hire from anywhere in the world.',
  },
  {
    title: 'Quality before quantity',
    description: 'Every seller profile and gig is reviewed before being visible to buyers.',
  },
];

const proofPoints = [
  { value: 'BS+', label: 'minimum education review' },
  { value: 'PK', label: 'Pakistani seller network' },
  { value: '24h', label: 'admin response target' },
  { value: 'Fair', label: 'lower commission model' },
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
    title: 'Verified Pakistani graduates',
    description: 'Build trust with degree details, university badges, department tags, and public portfolios.',
    image: heroTeam,
  },
  {
    title: 'Built for global clients',
    description: 'Clear packages, professional profiles, and delivery terms make hiring easier from any country.',
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
  'Verified Pakistani student sellers, quick delivery, and transparent packages are always available.',
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
      className="group card-premium overflow-hidden rounded-[24px] shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-52 overflow-hidden bg-soft">
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

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
              {gig.quickTask ? 'Quick task' : `Delivery ${gig.deliveryDays} days`}
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-snug text-ink group-hover:text-primary">{gig.title}</h3>
          </div>
          <span className="price-pill whitespace-nowrap">{money(gig.basePrice)}</span>
        </div>

        <p className="text-sm leading-6 text-muted line-clamp-2">{gig.description}</p>

        <div className="flex items-center justify-between rounded-2xl bg-bg-light px-3 py-3">
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
          <div className="text-right">
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

  return (
    <div className="space-y-6 pb-0 md:space-y-10">
      <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] flex flex-wrap items-center gap-2 rounded-none border-y border-border-color bg-white px-6 py-1 text-xs font-semibold text-ink">
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
            <div className="grid min-h-[620px] gap-0 lg:grid-cols-[1.05fr,1fr]">
              <div className="flex items-center px-6 py-14 sm:px-10 lg:px-16">
                <div className="max-w-2xl space-y-6">
                  <div className="inline-flex items-center rounded-full bg-soft px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                    Pakistan-only verified sellers
                  </div>
                  <p className="text-sm font-semibold text-muted">
                    {user ? `Welcome back, ${heroName}` : 'Welcome to UniHire'}
                  </p>
                  <h1 className="font-display text-[2.8rem] font-semibold leading-[1.02] tracking-tight text-ink md:text-6xl">
                    {t('heroTitle')}
                  </h1>
                  <p className="max-w-xl text-base leading-7 text-muted md:text-lg">
                    {t('heroSubtitle')}
                  </p>
                  <div className="flex max-w-xl flex-col gap-3 rounded-[22px] border border-border-color bg-bg-light p-3 shadow-soft sm:flex-row">
                    <input
                      className="min-h-12 flex-1 rounded-[16px] border border-transparent bg-white px-4 text-sm text-ink outline-none focus:border-primary"
                      placeholder="Search web design, logo, video editing..."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <button className="rounded-[16px] bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                      Search talent
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link to="/profile" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                      Apply as a verified seller
                    </Link>
                    <a href="#marketplace" className="rounded-full border border-border-color bg-white px-6 py-3 text-sm font-semibold text-ink shadow-soft">
                      Browse services
                    </a>
                  </div>
                  <div className="grid gap-3 pt-2 sm:grid-cols-3">
                    {trustStats.map((stat) => (
                      <div key={stat.label} className="rounded-[18px] border border-border-color bg-white p-4 shadow-soft">
                        <p className="text-lg font-semibold text-ink">{stat.value}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative min-h-[460px] bg-bg-light">
                <img
                  src={heroTeam}
                  alt="Verified Pakistani graduate talent"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-white/10 to-white/75" />
                <div className="absolute bottom-6 left-6 right-6 rounded-[24px] border border-white/60 bg-white/90 p-5 shadow-lift backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Why clients trust it</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {['BS/degree check', 'Admin-approved gigs', 'Lower commission'].map((item) => (
                      <div key={item} className="rounded-[16px] bg-soft px-3 py-3 text-sm font-semibold text-primary">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Verified services</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Admin-reviewed gigs from Pakistani graduates</h2>
          </div>
          <button className="btn-ghost text-sm" onClick={() => setFilterOpen(true)} type="button">
            Campus filters
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(curatedGigs.length ? curatedGigs.slice(0, 2) : featured.slice(0, 2)).map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      </section>

      <section id="marketplace" className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Marketplace</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Popular graduate-powered services</h2>
          </div>
          <button className="btn-ghost text-sm" onClick={() => setFilterOpen(true)} type="button">
            Campus filters
          </button>
        </div>

        {searchReady && !results.length ? (
          <div className="rounded-[24px] border border-border-color bg-card-bg p-6 shadow-soft">
            <p className="font-semibold text-ink">No gigs matched your filters.</p>
            <p className="mt-2 text-sm text-muted">{emptyStateCopy[0]}</p>
            <p className="mt-1 text-sm text-muted">{emptyStateCopy[1]}</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(curatedGigs.length ? curatedGigs : featured).map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Explore</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Built differently from open marketplaces</h2>
          </div>
          <button className="btn-ghost text-sm">All categories</button>
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


      <section className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] overflow-hidden rounded-[28px] border border-border-color bg-card-bg shadow-soft">
        <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <div className="flex h-full flex-col justify-center gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Become a UniHire seller</p>
            <h2 className="font-display text-3xl font-semibold text-ink">Turn your Pakistani degree into global freelance work</h2>
            <p className="text-sm leading-6 text-muted">
              Apply with your BS or university details, complete profile verification, and publish gigs after admin approval.
            </p>
            <div className="flex flex-wrap gap-3">
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
          <div className="rounded-[24px] bg-bg-light p-4">
            <img
              src={heroMagazineLight}
              alt="Student creator"
              className="h-full w-full rounded-[20px] object-cover"
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
            <h2 className="font-display text-3xl font-semibold leading-tight">
              A safer way to hire emerging Pakistani talent
            </h2>
            <p className="text-sm text-white/70 md:text-base">
              UniHire is not an open sign-up board. Sellers are reviewed, gig quality is checked, and clients get a clearer path to trusted graduate freelancers.
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
          <div className="relative min-h-[280px] overflow-hidden rounded-[22px] bg-white/5">
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
          <h2 className="font-display text-3xl font-semibold">Show the world what verified Pakistani talent can build</h2>
          <p className="text-sm text-white/70">
            Apply as a student seller, complete verification, and start earning from global clients with lower platform fees.
          </p>
          <Link to="/create" className="inline-flex rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white">
            Get started
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Pakistan categories</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">High-demand services from verified Pakistani talent</h2>
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

      <footer className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] bg-[#0B0F1D] px-6 py-10 text-white shadow-lift md:px-10 -mb-24 md:-mb-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr,0.8fr,0.8fr,0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">UniHire</p>
            <p className="mt-3 text-lg font-semibold">Pakistan's verified graduate freelance marketplace</p>
            <p className="mt-2 text-sm text-white/70">
              Global clients hire trusted Pakistani students and graduates through reviewed profiles, approved gigs, and fairer fees.
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
