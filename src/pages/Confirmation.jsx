import { Link, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { formatINR } from '../data/events.js';
import { getBooking } from '../lib/booking.js';

export function TicketCard({ booking, compact }) {
  const qrValue = JSON.stringify({
    id: booking.id,
    event: booking.title,
    date: booking.date,
    time: booking.time,
    seats: booking.seats.map((s) => `${s.sectionName.split(' ')[0]} ${s.row}${s.num}`),
  });

  return (
    <div className="ticket">
      <div className="ticket-main">
        <div className="t-id">{booking.id}</div>
        <h3 className="serif">{booking.title}</h3>
        <p className="small muted" style={{ margin: '4px 0 0' }}>
          {booking.venue}, {booking.city}
        </p>
        <div className="ticket-rows">
          <div className="info-row"><span className="k">Date</span><span>{booking.date}</span></div>
          <div className="info-row"><span className="k">Time</span><span>{booking.time}</span></div>
          <div className="info-row">
            <span className="k">Seats</span>
            <span>{booking.seats.map((s) => `${s.sectionName.split(' ')[0]} ${s.row}${s.num}`).join(', ')}</span>
          </div>
          <div className="info-row"><span className="k">Booked by</span><span>{booking.name}</span></div>
          {!compact && (
            <div className="info-row"><span className="k">Total paid</span><span>{formatINR(booking.total)} (demo)</span></div>
          )}
        </div>
      </div>
      <div className="ticket-stub">
        <QRCodeSVG value={qrValue} size={compact ? 120 : 150} />
        <span className="small faint" style={{ textAlign: 'center' }}>Scan at entry</span>
      </div>
    </div>
  );
}

export default function Confirmation() {
  const { id } = useParams();
  const booking = getBooking(id);

  if (!booking) {
    return (
      <div className="wrap"><div className="empty">
        <h3 className="serif">Booking not found.</h3>
        <p>It may have been made in a different browser.</p>
        <Link to="/browse" className="btn btn-ghost" style={{ marginTop: 16 }}>Browse events</Link>
      </div></div>
    );
  }

  return (
    <div className="wrap">
      <div className="confirm-hero">
        <div className="confirm-check">✓</div>
        <p className="eyebrow">Booking confirmed</p>
        <h1 className="display" style={{ fontSize: 'clamp(32px, 4.4vw, 54px)' }}>
          You&rsquo;re going!
        </h1>
        <p className="lede" style={{ margin: '0 auto', textAlign: 'center' }}>
          Your digital ticket is ready below. Show the QR at the gate —
          no printout needed.
        </p>
      </div>

      <section className="section-tight">
        <TicketCard booking={booking} />
        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          <Link to="/my-tickets" className="btn">My tickets</Link>
          <Link to="/browse" className="btn btn-ghost">Book more</Link>
        </div>
      </section>
    </div>
  );
}
