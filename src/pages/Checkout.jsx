import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SectionHead from '../components/SectionHead.jsx';
import { dateForOffset, eventById, formatINR, venueById } from '../data/events.js';
import { clearPending, getPending, makeBookingId, saveBooking } from '../lib/booking.js';

export default function Checkout() {
  const navigate = useNavigate();
  const pending = getPending();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [method, setMethod] = useState('upi');
  const [paying, setPaying] = useState(false);

  if (!pending || !pending.seats || pending.seats.length === 0) {
    return (
      <div className="wrap"><div className="empty">
        <h3 className="serif">Your selection expired.</h3>
        <p>Seat selections are held briefly. Please pick your seats again.</p>
        <Link to="/browse" className="btn btn-ghost" style={{ marginTop: 16 }}>Browse events</Link>
      </div></div>
    );
  }

  const event = eventById(pending.eventId);
  const venue = venueById(event.venueId);
  const { label } = dateForOffset(pending.day);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pay = (e) => {
    e.preventDefault();
    setPaying(true);
    // Demo checkout: no real payment is processed.
    setTimeout(() => {
      const booking = saveBooking({
        id: makeBookingId(),
        eventId: event.id,
        title: event.title,
        category: event.category,
        venue: venue.name,
        city: event.city,
        day: pending.day,
        date: label,
        time: pending.time,
        seats: pending.seats,
        subtotal: pending.subtotal,
        fees: pending.fees,
        total: pending.total,
        name: form.name,
        email: form.email,
        phone: form.phone,
        method,
        createdAt: new Date().toISOString(),
        demo: true,
      });
      clearPending();
      navigate(`/confirmation/${booking.id}`);
    }, 1400);
  };

  return (
    <div className="wrap">
      <div className="page-head" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Checkout</p>
        <h1 className="display" style={{ fontSize: 'clamp(30px, 4vw, 48px)' }}>Almost There</h1>
      </div>

      <section className="section-tight">
        <div className="detail-grid">
          <form onSubmit={pay}>
            <SectionHead eyebrow="Step 1" title="Your Details" />
            <div className="field">
              <label htmlFor="co-name">Full name</label>
              <input id="co-name" name="name" value={form.name} onChange={onChange} required placeholder="Aarav Sharma" />
            </div>
            <div className="field">
              <label htmlFor="co-email">Email</label>
              <input id="co-email" name="email" type="email" value={form.email} onChange={onChange} required placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="co-phone">Phone</label>
              <input id="co-phone" name="phone" value={form.phone} onChange={onChange} required placeholder="+91 98765 43210" />
            </div>

            <SectionHead eyebrow="Step 2" title="Payment" />
            <div className="pay-methods">
              <div className={'pay-method' + (method === 'upi' ? ' sel' : '')} onClick={() => setMethod('upi')}>
                UPI<span className="sub">GPay, PhonePe, Paytm &amp; more</span>
              </div>
              <div className={'pay-method' + (method === 'card' ? ' sel' : '')} onClick={() => setMethod('card')}>
                Card<span className="sub">Credit / debit cards</span>
              </div>
            </div>
            <div className="note-box" style={{ marginBottom: 20 }}>
              Demo checkout — no real payment is processed and no money moves.
              Production payments arrive with the backend phase.
            </div>
            <button className="btn btn-block" type="submit" disabled={paying}>
              {paying ? 'Processing…' : `Pay ${formatINR(pending.total)}`}
            </button>
          </form>

          <aside className="summary-card">
            <h3 className="serif">{event.title}</h3>
            <p className="small muted" style={{ marginTop: 4 }}>
              {label} · {pending.time}<br />{venue.name}, {event.city}
            </p>
            <div className="seat-tags">
              {pending.seats.map((s) => (
                <span className="seat-tag" key={s.id}>
                  {s.sectionName.split(' ')[0]} {s.row}{s.num}
                </span>
              ))}
            </div>
            <div className="sum-row"><span>Tickets × {pending.seats.length}</span><span>{formatINR(pending.subtotal)}</span></div>
            <div className="sum-row"><span>Convenience fee</span><span>{formatINR(pending.fees)}</span></div>
            <div className="sum-row total"><span>Total</span><span>{formatINR(pending.total)}</span></div>
          </aside>
        </div>
      </section>
    </div>
  );
}
