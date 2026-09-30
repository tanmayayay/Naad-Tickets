import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CATEGORIES, CITIES } from '../data/events.js';
import { getCity, setCity } from '../lib/booking.js';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState('');
  const [city, setCityState] = useState(getCity());
  const navigate = useNavigate();

  const onCity = (e) => {
    setCity(e.target.value);
    setCityState(e.target.value);
  };

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/browse?q=${encodeURIComponent(q.trim())}`);
    setMobileOpen(false);
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="wordmark" onClick={() => setMobileOpen(false)}>
          NAAD <span className="w-accent">Tickets</span>
        </Link>

        <select className="city-select" value={city} onChange={onCity} aria-label="City">
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <form className="search-box" onSubmit={onSearch}>
          <span className="s-icon">⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search concerts, movies, comedy…"
          />
        </form>

        <button className="burger" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
          {mobileOpen ? 'Close' : 'Menu'}
        </button>

        <nav className={'nav' + (mobileOpen ? ' mobile-open' : '')}>
          {CATEGORIES.map((c) => (
            <NavLink
              key={c.id}
              to={`/browse/${c.id}`}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              onClick={() => setMobileOpen(false)}
            >
              {c.label}
            </NavLink>
          ))}
          <NavLink
            to="/my-tickets"
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            onClick={() => setMobileOpen(false)}
          >
            My Tickets
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
