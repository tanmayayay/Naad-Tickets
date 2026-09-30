import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SectionHead from '../components/SectionHead.jsx';
import Badge from '../components/Badge.jsx';
import EventCard from '../components/EventCard.jsx';
import {
  ART, DEMAND_LABEL, EVENTS, dateForOffset, demandMultiplier,
  eventById, formatINR, getOnSaleAt, priceFor, showKey, venueById,
} from '../data/events.js';
import { isNotified, setNotified } from '../lib/booking.js';

function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = eventById(id);
  const now = useNow();

  const days = useMemo(() => {
    if (!event) return [];
    const uniq = [...new Set(event.shows.map((s) => s.day))].sort((a, b) => a - b);
    return uniq.map((d) => ({ day: d, ...dateForOffset(d) }));
  }, [event]);

  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [notified, setN] = useState(event ? isNotified(event.id) : false);

  useEffect(() => {
    if (days.length && day === null) {
      setDay(days[0].day);
      const first = event.shows.find((s) => s.day === days[0].day);
      setTime(first.time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days.length]);

  if (!event) {
    return (
      <div className="wrap"><div className="empty">
        <h3 className="serif">Event not found.</h3>
        <Link to="/browse" className="btn btn-ghost" style={{ marginTop: 16 }}>Back to browse</Link>
      </div></div>
    );
  }

  const venue = venueById(event.venueId);
  const times = event.shows.filter((s) => s.day === day);
  const sel = times.find((t) => t.time === time);
  const onSaleAt = event.onSaleSoon ? getOnSaleAt() : null;
  const locked = onSaleAt && onSaleAt.getTime() > now;

  const cheapest = Math.min(...venue.sections.map((s) => s.price));
  const mult = sel ? demandMultiplier(sel.demand) : 1;

  const related = EVENTS.filter((e) => e.id !== event.id && e.category === event.category && e.city === event.city).slice(0, 4);

  const goSeats = () => {
    navigate(`/event/${event.id}/seats?day=${day}&time=${encodeURIComponent(time)}`);
  };

  const pad = (n) => String(n).padStart(2, '0');
  const diff = locked ? onSaleAt.getTime() - now : 0;

  return (
    <div className="wrap">
      <div className="page-head" style={{ paddingBottom: 0 }}>
        <div
          className="ev-hero"
          style={{ background: `${ART[event.art % ART.length]}` }}
        >
          <div className="ev-hero-inner">
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <Badge tone="solid">{event.category}</Badge>
              {sel && sel.demand === 'high' && <Badge tone="hot">{DEMAND_LABEL.high}</Badge>}
              {event.onSaleSoon && <Badge tone="hot">On sale soon</Badge>}
            </div>
            <h1>{event.title}</h1>
            <p className="tagline">{event.tagline}</p>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <p className="lede">{event.description}</p>
          <div className="info-table">
            <div className="info-row"><span className="k">Venue</span><span>{venue.name}, {event.city}</span></div>
            <div className="info-row"><span className="k">Genre</span><span>{event.meta.genre}</span></div>
            <div className="info-row"><span className="k">Duration</span><span>{event.meta.duration}</span></div>
            <div className="info-row"><span className="k">Language</span><span>{event.meta.language}</span></div>
            <div className="info-row"><span className="k">Rating</span><span>{event.meta.rating}</span></div>
          </div>

          {locked ? (
            <div className="count-band" style={{ marginTop: 24 }}>
              <div>
                <h3>On sale {onSaleAt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} · 10:00 AM</h3>
                <p>High demand expected. Join the list and we&rsquo;ll remind you the minute booking opens.</p>
                <div style={{ marginTop: 16 }}>
                  {notified
                    ? <Badge tone="solid">You&rsquo;re on the list</Badge>
                    : <button className="btn btn-brass" onClick={() => { setNotified(event.id); setN(true); }}>Notify me</button>}
                </div>
              </div>
              <div className="count-digits">
                {[
                  [pad(Math.floor(diff / 86400000)), 'Days'],
                  [pad(Math.floor(diff / 3600000) % 24), 'Hours'],
                  [pad(Math.floor(diff / 60000) % 60), 'Mins'],
                  [pad(Math.floor(diff / 1000) % 60), 'Secs'],
                ].map(([n, l]) => (
                  <div className="count-cell" key={l}><div className="n">{n}</div><div className="l">{l}</div></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <h3 className="serif" style={{ fontSize: 22, margin: '28px 0 4px' }}>Select date &amp; time</h3>
              <div className="date-pills">
                {days.map((d) => (
                  <button
                    key={d.day}
                    className={'date-pill' + (day === d.day ? ' sel' : '')}
                    onClick={() => {
                      setDay(d.day);
                      const f = event.shows.find((s) => s.day === d.day);
                      setTime(f.time);
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="time-pills">
                {times.map((t) => (
                  <button
                    key={t.time}
                    className={'time-pill' + (time === t.time ? ' sel' : '')}
                    onClick={() => setTime(t.time)}
                  >
                    <div className="t">{t.time}</div>
                    <div className={`d ${t.demand}`}>{DEMAND_LABEL[t.demand]}</div>
                  </button>
                ))}
              </div>
              {sel && sel.demand !== 'low' && (
                <div className="note-box">
                  Demand-based pricing is active for this show — prices are{' '}
                  {Math.round((mult - 1) * 100)}% above base. Book early for the best fares.
                </div>
              )}
            </>
          )}
        </div>

        <aside className="book-panel">
          <p className="eyebrow" style={{ marginBottom: 6 }}>From</p>
          <div className="total">{formatINR(priceFor(cheapest, sel ? sel.demand : 'medium'))}</div>
          <p className="small muted" style={{ marginTop: 0 }}>
            {venue.sections.length} seating zones · {venue.name}
          </p>
          <hr className="rule-double" style={{ margin: '18px 0' }} />
          {locked ? (
            <p className="small muted">Booking opens when the countdown ends.</p>
          ) : (
            <button className="btn btn-block" onClick={goSeats} disabled={!sel}>
              Select seats
            </button>
          )}
          <p className="small faint" style={{ marginTop: 14, marginBottom: 0 }}>
            Free cancellation up to 24 hours before showtime. QR digital entry included.
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="section-tight">
          <SectionHead eyebrow="More like this" title="You May Also Like" />
          <div className="ev-grid">
            {related.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
