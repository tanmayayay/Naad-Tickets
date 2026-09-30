import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import SectionHead from '../components/SectionHead.jsx';
import EventCard from '../components/EventCard.jsx';
import { CATEGORIES, CITIES, EVENTS } from '../data/events.js';
import { getCity, setCity } from '../lib/booking.js';

export default function Browse() {
  const { category } = useParams();
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim().toLowerCase();
  const [city, setCityState] = useState(getCity());

  const onCity = (e) => {
    setCity(e.target.value);
    setCityState(e.target.value);
  };

  const list = useMemo(() => {
    return EVENTS.filter((e) => {
      if (category && e.category !== category) return false;
      if (e.city !== city) return false;
      if (q && !(e.title + ' ' + e.tagline).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, city, q]);

  const catLabel = category
    ? (CATEGORIES.find((c) => c.id === category) || {}).label
    : 'All events';

  return (
    <div className="wrap">
      <div className="page-head">
        <p className="eyebrow">Browse</p>
        <h1 className="display" style={{ fontSize: 'clamp(34px, 4.4vw, 54px)' }}>
          {q ? `Results for \u201c${params.get('q').trim()}\u201d` : catLabel}
        </h1>
        <div className="filter-bar">
          <Link to="/browse" className={'filter-chip' + (!category ? ' sel' : '')} style={{ textDecoration: 'none' }}>
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/browse/${c.id}`}
              className={'filter-chip' + (category === c.id ? ' sel' : '')}
              style={{ textDecoration: 'none' }}
            >
              {c.label}
            </Link>
          ))}
          <select className="city-select" value={city} onChange={onCity} aria-label="City" style={{ marginLeft: 'auto' }}>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="section-tight" style={{ paddingTop: 8 }}>
        {list.length === 0 ? (
          <div className="empty">
            <h3 className="serif">Nothing on sale here yet.</h3>
            <p>Try another city or category — new events drop every week.</p>
            <Link to="/browse" className="btn btn-ghost" style={{ marginTop: 16 }}>Clear filters</Link>
          </div>
        ) : (
          <>
            <SectionHead eyebrow={`${list.length} event${list.length === 1 ? '' : 's'} in ${city}`} title="" />
            <div className="ev-grid">
              {list.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
