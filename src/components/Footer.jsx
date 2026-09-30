import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/events.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <p className="f-brand">NAAD <span className="w-accent">Tickets</span></p>
            <p>
              Live-show ticketing, engineered for the on-sale rush —
              fraud-resistant, reserved seating, dynamic pricing, digital
              entry. An independent venture under NAAD Infinity.
            </p>
          </div>
          <div>
            <h4>Discover</h4>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.id}><Link to={`/browse/${c.id}`}>{c.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Account</h4>
            <ul>
              <li><Link to="/my-tickets">My Tickets</Link></li>
              <li><Link to="/browse">All events</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <a href="https://tanmayayay.github.io/NAAD-Infinity/#/" target="_blank" rel="noreferrer">
                  NAAD Infinity
                </a>
              </li>
              <li>
                <a href="https://tanmayayay.github.io/strings-web/#/" target="_blank" rel="noreferrer">
                  Strings
                </a>
              </li>
              <li>
                <a href="https://tanmayayay.github.io/SoundKart/#/" target="_blank" rel="noreferrer">
                  SoundKart
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 NAAD Tickets · An independent venture under NAAD Infinity</span>
          <span>Demo build — bookings are stored in this browser only</span>
        </div>
      </div>
    </footer>
  );
}
