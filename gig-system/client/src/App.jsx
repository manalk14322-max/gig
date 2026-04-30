import { Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import GigCreate from './pages/GigCreate.jsx';
import GigList from './pages/GigList.jsx';
import GigDetail from './pages/GigDetail.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import Profile from './pages/Profile.jsx';
import SellerProfile from './pages/SellerProfile.jsx';
import Orders from './pages/Orders.jsx';
import Messages from './pages/Messages.jsx';
import Wallet from './pages/Wallet.jsx';
import Settings from './pages/Settings.jsx';
import Favorites from './pages/Favorites.jsx';
import BuyerProfile from './pages/BuyerProfile.jsx';
import AdminVerification from './pages/AdminVerification.jsx';
import OAuthCallback from './pages/OAuthCallback.jsx';
import brandLogo from './assets/brand/photos/unihire-logo.jpg';

const navLink = ({ isActive }) =>
  `inline-flex whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium transition ${
    isActive ? 'bg-soft text-primary' : 'text-muted hover:text-primary'
  }`;

export default function App() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base">
      <header className="sticky top-0 z-50 border-b border-border-color lux-blur text-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex flex-shrink-0 items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-2xl border border-border-color bg-white shadow-soft">
              <img src={brandLogo} alt="UniHire" className="h-full w-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-semibold text-ink">UniHire</p>
              <p className="text-[11px] text-muted">Verified Pakistani talent</p>
            </div>
          </div>

          <button
            className="ml-auto inline-flex h-10 items-center justify-center rounded-full border border-border-color bg-white px-4 text-sm font-semibold shadow-soft lg:hidden"
            onClick={() => setMobileOpen(true)}
            type="button"
          >
            Menu
          </button>

          <div className="hidden min-w-0 flex-1 items-center px-4 lg:flex">
            <div className="mx-auto flex w-full max-w-[520px] items-center gap-3 rounded-full border border-border-color bg-white px-4 py-2 shadow-soft">
              <span className="text-sm font-semibold text-muted">Search</span>
              <input
                className="w-full border-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
                placeholder="What service are you looking for today?"
              />
              <button className="grid h-9 min-w-[2.25rem] place-items-center rounded-full bg-primary px-3 text-xs font-bold text-white">
                Go
              </button>
            </div>
          </div>

          <div className="hidden flex-shrink-0 items-center gap-3 lg:flex">
            <div className="hidden items-center gap-2 text-muted xl:flex">
              <button className="grid h-9 w-9 place-items-center rounded-full border border-border-color bg-white text-xs font-bold">N</button>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-border-color bg-white text-xs font-bold">M</button>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-border-color bg-white text-xs font-bold">S</button>
            </div>
            {user ? (
              <div className="flex items-center gap-2">
                {user.verifiedStudent && (
                  <span className="hidden rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 xl:inline-flex">
                    Verified
                  </span>
                )}
                <NavLink to="/dashboard" className="btn-ghost text-sm">
                  {user.name}
                </NavLink>
              </div>
            ) : (
              <>
                <NavLink to="/profile" className="rounded-full border border-border-color bg-white px-4 py-2 text-sm font-semibold text-ink shadow-soft">
                  Login
                </NavLink>
                <NavLink to="/create" className="btn-gradient text-sm">
                  Apply
                </NavLink>
              </>
            )}
          </div>
        </div>

        <nav className="mx-auto hidden max-w-6xl items-center gap-1 overflow-x-auto px-4 pb-3 sm:px-6 lg:flex">
          <NavLink to="/" className={navLink} end>
            Marketplace
          </NavLink>
          <NavLink to="/favorites" className={navLink}>
            Saved
          </NavLink>
          <NavLink to="/create" className={navLink}>
            Create Gig
          </NavLink>
          <NavLink to="/dashboard" className={navLink}>
            Dashboard
          </NavLink>
          <NavLink to="/orders" className={navLink}>
            Orders
          </NavLink>
          <NavLink to="/messages" className={navLink}>
            Messages
          </NavLink>
          <NavLink to="/profile" className={navLink}>
            Profile
          </NavLink>
          <NavLink to="/wallet" className={navLink}>
            Wallet
          </NavLink>
          <NavLink to="/settings" className={navLink}>
            Settings
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin/verification" className={navLink}>
              Verification
            </NavLink>
          )}
        </nav>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
            <div className="absolute right-0 top-0 h-full w-[86vw] max-w-sm overflow-y-auto bg-card-bg p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Menu</p>
                <button className="text-xl leading-none" onClick={() => setMobileOpen(false)} type="button">
                  x
                </button>
              </div>
              <div className="mt-6 flex flex-col gap-2 text-sm font-semibold text-ink">
                <NavLink className="rounded-2xl bg-bg-light px-4 py-3" to="/" onClick={() => setMobileOpen(false)}>
                  Marketplace
                </NavLink>
                <NavLink className="rounded-2xl bg-bg-light px-4 py-3" to="/favorites" onClick={() => setMobileOpen(false)}>
                  Saved
                </NavLink>
                <NavLink className="rounded-2xl bg-bg-light px-4 py-3" to="/create" onClick={() => setMobileOpen(false)}>
                  Create Gig
                </NavLink>
                <NavLink className="rounded-2xl bg-bg-light px-4 py-3" to="/dashboard" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </NavLink>
                <NavLink className="rounded-2xl bg-bg-light px-4 py-3" to="/orders" onClick={() => setMobileOpen(false)}>
                  Orders
                </NavLink>
                <NavLink className="rounded-2xl bg-bg-light px-4 py-3" to="/messages" onClick={() => setMobileOpen(false)}>
                  Messages
                </NavLink>
                <NavLink className="rounded-2xl bg-bg-light px-4 py-3" to="/profile" onClick={() => setMobileOpen(false)}>
                  Profile
                </NavLink>
                <NavLink className="rounded-2xl bg-bg-light px-4 py-3" to="/wallet" onClick={() => setMobileOpen(false)}>
                  Wallet
                </NavLink>
                <NavLink className="rounded-2xl bg-bg-light px-4 py-3" to="/settings" onClick={() => setMobileOpen(false)}>
                  Settings
                </NavLink>
                {user?.role === 'admin' && (
                  <NavLink className="rounded-2xl bg-bg-light px-4 py-3" to="/admin/verification" onClick={() => setMobileOpen(false)}>
                    Verification
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6 md:py-10 md:pb-10">
        <Routes>
          <Route path="/" element={<GigList />} />
          <Route path="/create" element={<GigCreate />} />
          <Route path="/gig/:id" element={<GigDetail />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <AuthPanel />} />
          <Route path="/profile" element={user ? <Profile /> : <AuthPanel />} />
          <Route path="/seller/:id" element={<SellerProfile />} />
          <Route path="/buyer" element={<BuyerProfile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin/verification" element={<AdminVerification />} />
          <Route path="/oauth" element={<OAuthCallback />} />
        </Routes>
      </main>

      <nav className="fixed bottom-3 left-1/2 z-40 flex w-[94%] max-w-md -translate-x-1/2 items-center justify-between rounded-[20px] bg-card-bg/95 px-2 py-2.5 shadow-lift backdrop-blur-md md:hidden">
        <NavLink to="/" className="rounded-2xl px-2 py-2 text-xs font-semibold text-muted">
          Home
        </NavLink>
        <NavLink to="/favorites" className="rounded-2xl px-2 py-2 text-xs font-semibold text-muted">
          Explore
        </NavLink>
        <NavLink to="/orders" className="rounded-2xl px-2 py-2 text-xs font-semibold text-muted">
          Orders
        </NavLink>
        <NavLink to="/messages" className="rounded-2xl px-2 py-2 text-xs font-semibold text-muted">
          Messages
        </NavLink>
        <NavLink to="/profile" className="rounded-2xl px-2 py-2 text-xs font-semibold text-muted">
          Profile
        </NavLink>
      </nav>
    </div>
  );
}
