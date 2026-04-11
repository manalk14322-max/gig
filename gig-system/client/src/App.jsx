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

const navLink = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-semibold transition ${
    isActive ? 'bg-secondary text-white shadow-soft' : 'text-ink hover:text-primary'
  }`;

export default function App() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-base">
      {/* Global navigation */}
      <header className="sticky top-0 z-50 border-b border-black/5 lux-blur text-ink">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-white font-bold">U</span>
            <div className="hidden sm:block">
              <p className="text-lg font-bold text-ink">UniHire</p>
              <p className="text-xs text-muted">Premium freelance marketplace</p>
            </div>
          </div>
          <button
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] text-sm font-semibold lg:hidden"
            onClick={() => setMobileOpen(true)}
            type="button"
          >
            ☰
          </button>
          <div className="hidden flex-1 md:flex">
            <div className="flex w-full max-w-[420px] items-center gap-3 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 shadow-soft">
              <span className="text-muted">Search</span>
              <input
                className="w-full border-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
                placeholder="Search for services, skills, or freelancers"
              />
            </div>
          </div>
          <nav className="hidden flex-1 items-center gap-2 overflow-x-auto px-2 lg:flex">
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
            <NavLink
              to="/wallet"
              className="hidden xl:inline-flex px-4 py-2 rounded-full text-sm font-semibold text-white/80 hover:text-white transition"
            >
              Wallet
            </NavLink>
            <NavLink
              to="/settings"
              className="hidden xl:inline-flex px-4 py-2 rounded-full text-sm font-semibold text-white/80 hover:text-white transition"
            >
              Settings
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <NavLink to="/dashboard" className="btn-primary text-sm">
                {user.name}
              </NavLink>
            ) : (
              <>
                <NavLink to="/profile" className="btn-ghost text-sm">
                  Login
                </NavLink>
                <NavLink to="/create" className="btn-gradient text-sm">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40">
            <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Menu</p>
                <button className="text-xl" onClick={() => setMobileOpen(false)} type="button">
                  ×
                </button>
              </div>
              <div className="mt-6 flex flex-col gap-3 text-sm font-semibold text-ink">
                <NavLink to="/" onClick={() => setMobileOpen(false)}>
                  Marketplace
                </NavLink>
                <NavLink to="/favorites" onClick={() => setMobileOpen(false)}>
                  Saved
                </NavLink>
                <NavLink to="/create" onClick={() => setMobileOpen(false)}>
                  Create Gig
                </NavLink>
                <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </NavLink>
                <NavLink to="/orders" onClick={() => setMobileOpen(false)}>
                  Orders
                </NavLink>
                <NavLink to="/messages" onClick={() => setMobileOpen(false)}>
                  Messages
                </NavLink>
                <NavLink to="/profile" onClick={() => setMobileOpen(false)}>
                  Profile
                </NavLink>
                <NavLink to="/wallet" onClick={() => setMobileOpen(false)}>
                  Wallet
                </NavLink>
                <NavLink to="/settings" onClick={() => setMobileOpen(false)}>
                  Settings
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* App pages */}
      <main className="mx-auto max-w-6xl px-6 py-10">
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
        </Routes>
      </main>

      <nav className="fixed bottom-4 left-1/2 z-40 flex w-[92%] max-w-md -translate-x-1/2 items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-lift md:hidden">
        <NavLink to="/" className="text-xs font-semibold text-muted">
          Home
        </NavLink>
        <NavLink to="/favorites" className="text-xs font-semibold text-muted">
          Explore
        </NavLink>
        <NavLink to="/orders" className="text-xs font-semibold text-muted">
          Orders
        </NavLink>
        <NavLink to="/messages" className="text-xs font-semibold text-muted">
          Messages
        </NavLink>
        <NavLink to="/profile" className="text-xs font-semibold text-muted">
          Profile
        </NavLink>
      </nav>
    </div>
  );
}
