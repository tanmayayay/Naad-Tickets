import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import SectionHead from '../components/SectionHead.jsx';
import Badge from '../components/Badge.jsx';
import SeatMap, { pickBest } from '../components/SeatMap.jsx';
import {
  dateForOffset, DEMAND_LABEL, eventById, formatINR,
  priceFor, seatsFor, showKey, venueById,
} from '../data/events.js';
import { setPending } from '../lib/booking.js';

const MAX_SEATS = 10;
const FEE_PER_TICKET = 35;

export default function SeatSelect() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const event = eventById(id);

  const day = Number(params.get('day') || 0);
  const time = params.get('time') || '';
  const show = event?.shows.find((s) => s.day === day && s.time === time) || event?.shows[0];

  const [selected, setSelected] = useState([]); // array of seat objects

  const venue = event ? venueById(event.venueId) : null;
  const sections = useMemo(() => {
    if (!event || !show) return [];
    return seatsFor(showKey(event.id, show.day, show.time), venue, show.demand);
  }, [event, show, venue]);

  if (!event || !show) {
    return (
      <div className="wrap"><div className="empty">
        <h3 className="serif">Show not found.</h3>
        <Link to={`/event/${id}`} className="btn btn-ghost" style={{ marginTop: 16 }}>Back to event</Link>
      </div></div>
    );
  }

  const selIds = new Set(selected.map((s) => s.id));
  const toggle = (seat) => {
    setSelected((prev) => {
      if (prev.some((s) => s.id === seat.id)) return prev.filter((s) => s.id !== seat.id);
      if (prev.length >= MAX_SEATS) return prev;
      return [...prev, seat];
    });
  };

  const bestAvailable = () => {
    const need = Math.min(4, MAX_SEATS - selected.length);
    if (need <= 0) return;
    const picks = pickBest(sections, need).filter((p) => !selIds.has(p.id));
    setSelected((prev) => [...prev, ...picks].slice(0, MAX_SEATS));
  };

  const subtotal = selected.reduce((a, s) => a + priceFor(s.price, show.demand), 0);
  const fees = selected.length * FEE_PER_TICKET;
  const total = subtotal + fees;
  const { label } = dateForOffset(show.day);

  const goCheckout = () => {
    setPending({
      eventId: event.id,
      day: show.day,
      time: show.time,
      demand: show.demand,
      seats: selected.map((s) => ({
        id: s.id, row: s.row, num: s.num,
        sectionId: s.sectionId, sectionName: s.sectionName,
        price: priceFor(s.price, show.demand),
      })),
      subtotal, fees, total,
    });
    navigate('/checkout');
  };

  return (
    <div className="wrap">
      <div className="page-head" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">{event.title}</p>
        <h1 className="display" style={{ fontSize: 'clamp(30px, 4vw, 48px)' }}>Select Your Seats</h1>
        <p className="muted">
          {label} · {show.time} · {venue.name} &nbsp;
          <Badge tone={show.demand === 'high' ? 'hot' : 'muted'}>{DEMAND_LABEL[show.demand]}</Badge>
        </p>
      </div>

      <section className="section-tight">
        <div className="seat-layout">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <span className="small muted">Tap seats to select · max {MAX_SEATS} per booking</span>
              <button className="btn btn-ghost" style={{ padding: '10px 18px' }} onClick={bestAvailable}>
                Best available
              </button>
            </div>
            <SeatMap
              sections={sections}
              demand={show.demand}
              selected={selIds}
              onToggle={toggle}
              kind={venue.kind}
            />
          </div>

          <aside className="summary-card">
            <h3 className="serif">Booking Summary</h3>
            <p className="small muted" style={{ marginTop: 4 }}>
              {label} · {show.time}
            </p>
            {selected.length === 0 ? (
              <p className="small faint">No seats selected yet.</p>
            ) : (
              <div className="seat-tags">
                {selected.map((s) => (
                  <span className="seat-tag" key={s.id}>
                    {s.sectionName.split(' ')[0]} {s.row}{s.num}
                  </span>
                ))}
              </div>
            )}
            <div className="sum-row"><span>Tickets × {selected.length}</span><span>{formatINR(subtotal)}</span></div>
            <div className="sum-row"><span>Convenience fee</span><span>{formatINR(fees)}</span></div>
            <div className="sum-row total"><span>Total</span><span>{formatINR(total)}</span></div>
            <div style={{ marginTop: 18 }}>
              <button className="btn btn-block" disabled={selected.length === 0} onClick={goCheckout}>
                Continue · {formatINR(total)}
              </button>
            </div>
            <p className="small faint" style={{ marginTop: 12, marginBottom: 0 }}>
              Demand-based pricing applied. Prices lock for 10 minutes once you continue.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
