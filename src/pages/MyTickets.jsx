import { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHead from '../components/SectionHead.jsx';
import { TicketCard } from './Confirmation.jsx';
import { cancelBooking, getBookings } from '../lib/booking.js';

export default function MyTickets() {
  const [bookings, setBookings] = useState(getBookings());

  const cancel = (id) => {
    if (window.confirm('Cancel this booking? This is a demo — no refund flow exists yet.')) {
      cancelBooking(id);
      setBookings(getBookings());
    }
  };

  return (
    <div className="wrap">
      <div className="page-head">
        <p className="eyebrow">Account</p>
        <h1 className="display" style={{ fontSize: 'clamp(34px, 4.4vw, 54px)' }}>My Tickets</h1>
        <p className="lede">Your bookings live in this browser. Show the QR at the gate for entry.</p>
      </div>

      <section className="section-tight">
        {bookings.length === 0 ? (
          <div className="empty">
            <h3 className="serif">No tickets yet.</h3>
            <p>When you book, your QR tickets will appear here.</p>
            <Link to="/browse" className="btn" style={{ marginTop: 16 }}>Find an event</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 24 }}>
            {bookings.map((b) => (
              <div key={b.id}>
                <TicketCard booking={b} compact />
                <div style={{ marginTop: 12 }}>
                  <button className="btn btn-ghost" style={{ padding: '10px 18px' }} onClick={() => cancel(b.id)}>
                    Cancel booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {bookings.length > 0 && (
          <div style={{ marginTop: 36 }}>
            <SectionHead eyebrow="Note" title="" />
            <p className="small muted">
              Demo build — bookings are stored only in this browser. Signed-in
              accounts, real payments and transferable tickets arrive with
              the backend phase.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
