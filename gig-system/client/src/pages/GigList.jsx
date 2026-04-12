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

const heroTags = ['Website Design', 'Logo', 'AI Video', 'SEO', 'Translation'];

const recommendationCards = [
  {
    title: 'Complete your student profile',
    description: 'Unlock gig publishing after adding campus details and verification.',
    cta: 'Open profile',
    to: '/create',
    accent: 'bg-[#F7F3EA]',
  },
  {
    title: 'Browse verified student talent',
    description: 'Compare reviews, universities, packages, and fast delivery options.',
    cta: 'Explore now',
    to: '/',
    accent: 'bg-card-bg',
  },
];

const browseGroups = [
  {
    title: 'For Clients',
    items: ['Verified student sellers', 'Website Development', 'Logo Design', 'AI Video'],
  },
  {
    title: 'For Students',
    items: ['Profile first', 'Gig Creation', 'Portfolio', 'Quick Task Mode'],
  },
  {
    title: 'Business Solutions',
    items: ['Branding', 'Social Media', 'Product Videos', 'Ecommerce'],
  },
  {
    title: 'Campus',
    items: ['About', 'Support', 'Payments', 'Terms'],
  },
];

const trustStats = [
  { label: 'Verified students', value: '1,250+' },
  { label: 'Avg response', value: '1 hour' },
  { label: 'Projects delivered', value: '24k+' },
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
    title: 'Verified student talent, everywhere',
    description: 'Build trust with campus badges, department tags, and public portfolios.',
    image: heroTeam,
  },
  {
    title: 'Grow across major Pakistani cities',
    description: 'Localized discovery by university, city, and delivery speed.',
    image: heroMagazineLight,
  },
  {
    title: 'Secure local payouts, globally ready',
    description: 'Withdraw with Easypaisa, JazzCash, Raast, or bank transfer.',
    image: heroWelcome,
  },
];

const supportCards = [
  {
    title: 'Tools that streamline student work',
    description: 'AI-assisted briefs, smart pricing hints, and quick delivery tags.',
    tone: 'bg-[#121826] text-white',
  },
  {
    title: 'Payouts you can trust',
    description: 'Escrow-style release, milestone protection, and instant local transfer.',
    tone: 'bg-[#E1F5EF] text-ink',
  },
  {
    title: 'Real partners on the road ahead',
    description: 'Campus mentors and admin verification keep the marketplace safe.',
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
  'Verified student sellers, quick delivery, and local payment options are always available.',
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
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#F4EBDD] via-white to-[#EDE4D6] text-sm font-semibold text-muted">
            Premium gig preview
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-[#EEF2F7]/95 px-3 py-1 text-xs font-semibold text-primary shadow-soft">
              {gig.category}
            </span>
            <span className="rounded-full bg-[#EEF2F7]/95 px-3 py-1 text-xs font-semibold text-ink shadow-soft">
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

        <div className="flex items-center justify-between rounded-2xl bg-[#EEF2F7] px-3 py-3">
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
                  <span className="rounded-full bg-[#EEF2F7] px-2 py-0.5 text-[10px] font-semibold text-ink">
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

        <div className="w-full rounded-full border border-primary/15 bg-gradient-to-r from-[#F4E9D0] to-white px-4 py-3 text-center text-sm font-semibold text-primary transition group-hover:border-primary/30 group-hover:bg-primary group-hover:text-white">
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
  const [bestMatch, setBestMatch] = useState(null);
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
      setBestMatch(data.bestMatch || null);
      setSearchReady(true);
    });
  }, [query, category, quickOnly, priceRange]);

  const liveCatalog = searchReady ? results : featured;
  const curatedGigs = (liveCatalog.length ? liveCatalog : featured).slice(0, 6);
  const heroSpotlight = bestMatch || curatedGigs[0] || featured[0];
  const heroName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6 pb-0 md:space-y-10">
      <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] flex flex-wrap items-center gap-2 rounded-none border-y border-border-color bg-white px-6 py-1 text-xs font-semibold text-ink">
        <button
          type="button"
          onClick={() => setCategory('')}
          className="whitespace-nowrap rounded-full bg-[#F5F7FB] px-4 py-1.5 text-muted hover:text-primary border border-[#E2E8F0]"
        >
          Trending 🔥
        </button>
        {topCategories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 transition ${
              category === item
                ? 'bg-primary text-white shadow-soft'
                : 'bg-[#F5F7FB] text-muted hover:bg-white hover:text-primary border border-[#E2E8F0]'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] overflow-hidden bg-[#EEF2F7]">
        <div className="px-0 py-0">
          <div className="overflow-hidden rounded-[28px] border border-border-color bg-white shadow-lift">
            <div className="grid min-h-[560px] gap-0 lg:grid-cols-[1.05fr,1fr]">
              <div className="flex items-center px-6 py-14 sm:px-10 lg:px-16">
                <div className="space-y-5">
              <div className="inline-flex items-center rounded-full bg-soft px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                Trusted freelance marketplace
              </div>
              <p className="text-sm font-semibold text-muted">{user ? `Welcome back, ${heroName}` : 'Welcome to UniHire'}</p>
              <h1 className="font-display text-[2.8rem] font-semibold leading-[1.02] tracking-tight text-ink md:text-5xl">
                {t('heroTitle')}
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted md:text-lg">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                  Get started
                </button>
                <div className="flex flex-wrap items-center gap-3">
                  {paymentLogos.map((logo) => (
                    <div key={logo.name} className="rounded-full border border-border-color bg-white px-3 py-2 shadow-soft">
                      <img src={logo.url} alt={logo.name} className="h-5 w-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
              </div>
              <div className="relative min-h-[420px] bg-[#F2F5FA]">
                <img
                  src={heroTeam}
                  alt="Verified student teams"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-white/10 via-white/40 to-white/80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Recommended</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Based on your campus needs</h2>
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

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Popular gigs</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Most popular campus services</h2>
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Browse</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Categories and campus info</h2>
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
            <h2 className="font-display text-3xl font-semibold text-ink">Grow a global business from your campus</h2>
            <p className="text-sm leading-6 text-muted">
              Build trust with verified student badges, polished gig packaging, and a payout stack designed for
              Pakistan.
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
          <div className="rounded-[24px] bg-[#EDEFF4] p-4">
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
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">A smarter way to work</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Grow, earn, and scale across Pakistan</h2>
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
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Campus first</p>
            <h2 className="font-display text-3xl font-semibold leading-tight">
              Make it real with verified student freelancers
            </h2>
            <p className="text-sm text-white/70 md:text-base">
              A premium marketplace built for Pakistan’s campuses — fast matching, secure payouts, and verified
              profiles that build trust quickly.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {supportCards.map((card) => (
                <div key={card.title} className="rounded-[18px] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="mt-2 text-xs text-white/70">{card.description}</p>
                </div>
              ))}
            </div>
            <button className="inline-flex rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white/90 hover:bg-white/10">
              Explore marketplace
            </button>
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
          <h2 className="font-display text-3xl font-semibold">Let’s show the world what you’ve got to offer</h2>
          <p className="text-sm text-white/70">
            Publish your gig, verify your profile, and start earning with trusted local payments.
          </p>
          <Link to="/create" className="inline-flex rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white">
            Get started
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Pakistan categories</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Explore what’s hot in Pakistan</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pakCategoryTiles.map((tile) => (
            <div key={tile.label} className="card card-hover card-premium flex items-center gap-3 p-4">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EEF2F7] text-xs font-semibold text-ink">
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
            <p className="mt-3 text-lg font-semibold">Pakistan’s verified student marketplace</p>
            <p className="mt-2 text-sm text-white/70">
              Build trust with campus verification, premium gig packaging, and secure local payouts.
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
              <li>Mon–Fri: 9am – 8pm</li>
              <li>Saturday: 10am – 6pm</li>
              <li>Sunday: 12pm – 4pm</li>
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
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden">
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
                  className="mt-3 w-full rounded-xl border border-border-color bg-[#EEF2F7] px-4 py-3 text-sm focus:border-primary focus:outline-none"
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
                  quickOnly ? 'border-primary bg-primary text-white' : 'border-border-color bg-[#EEF2F7] text-ink'
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
