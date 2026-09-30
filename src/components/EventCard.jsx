import { Link } from 'react-router-dom';
import { ART, DEMAND_LABEL, dateForOffset, formatINR, priceFor, venueById } from '../data/events.js';

const CAT_LABEL = { movies: 'Movies', music: 'Music', comedy: 'Comedy', sports: 'Sports', theatre: 'Theatre' };

export function bestShow(event) {
  const hot = event.shows.find((s) => s.demand === 'high') || event.shows[0];
  return hot;
}

export function fromPrice(event) {
  const venue = venueById(event.venueId);
  const cheapest = Math.min(...venue.sections.map((s) => s.price));
  const hot = bestShow(event);
  return priceFor(cheapest, hot.demand);
}

export default function EventCard({ event }) {
  const venue = venueById(event.venueId);
  const hot = bestShow(event);
  const { label } = dateForOffset(hot.day);
  return (
    <Link to={`/event/${event.id}`} className="ev-card">
      <div className="ev-art" style={{ background: ART[event.art % ART.length] }}>
        <span className="ev-cat">{CAT_LABEL[event.category]}</span>
        {hot.demand === 'high' && <span className="ev-demand">{DEMAND_LABEL.high}</span>}
        <h3>{event.title}</h3>
      </div>
      <div className="ev-body">
        <div className="ev-venue">{venue.name} · {event.city}</div>
        <div className="ev-meta">{label} · {hot.time}</div>
        <div className="ev-price">
          <span className="from">from </span>{formatINR(fromPrice(event))}
        </div>
      </div>
    </Link>
  );
}
