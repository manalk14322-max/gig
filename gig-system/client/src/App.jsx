import { Routes, Route, NavLink } from 'react-router-dom';
import GigCreate from './pages/GigCreate.jsx';
import GigList from './pages/GigList.jsx';
import GigDetail from './pages/GigDetail.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import Profile from './pages/Profile.jsx';
import SellerProfile from './pages/SellerProfile.jsx';

const navLink = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm font-semibold transition ${
    isActive ? 'bg-primary text-white shadow-soft' : 'text-ink hover:text-primary'
  }`;

export default function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-base">
      {/* Global navigation */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-white font-bold">G</span>
            <div className="hidden sm:block">
              <p className="text-lg font-bold">Gig System</p>
              <p className="text-xs text-muted">Premium freelance marketplace</p>
            </div>
          </div>
          <div className="hidden flex-1 md:flex">
            <div className="flex w-full items-center gap-3 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 shadow-soft">
              <span className="text-muted">Search</span>
              <input
                className="w-full border-none bg-transparent text-sm focus:outline-none"
                placeholder="Search for services, skills, or freelancers"
              />
            </div>
          </div>
          <nav className="hidden items-center gap-2 lg:flex">
            <NavLink to="/" className={navLink} end>
              Marketplace
            </NavLink>
            <NavLink to="/create" className={navLink}>
              Create Gig
            </NavLink>
            <NavLink to="/dashboard" className={navLink}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" className={navLink}>
              Profile
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
        </Routes>
      </main>

      <nav className="fixed bottom-4 left-1/2 z-40 flex w-[92%] max-w-md -translate-x-1/2 items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-lift md:hidden">
        <NavLink to="/" className="text-xs font-semibold text-muted">
          Home
        </NavLink>
        <NavLink to="/" className="text-xs font-semibold text-muted">
          Explore
        </NavLink>
        <NavLink to="/dashboard" className="text-xs font-semibold text-muted">
          Orders
        </NavLink>
        <NavLink to="/dashboard" className="text-xs font-semibold text-muted">
          Messages
        </NavLink>
        <NavLink to="/profile" className="text-xs font-semibold text-muted">
          Profile
        </NavLink>
      </nav>
    </div>
  );
}
