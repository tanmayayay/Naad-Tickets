import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SectionHead from '../components/SectionHead.jsx';
import Badge from '../components/Badge.jsx';
import EventCard from '../components/EventCard.jsx';
import { ART, CATEGORIES, EVENTS, getOnSaleAt } from '../data/events.js';
import { getCity, isNotified, setNotified } from '../lib/booking.js';

const CAT_ART = [4, 0, 8, 10, 12];

function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
    live: diff <= 0,
  };
}

function OnSaleBand() {
  const ev = EVENTS.find((e) => e.onSaleSoon);
  const target = getOnSaleAt();
  const { d, h, m, s } = useCountdown(target);
  const [notified, setN] = useState(isNotified(ev.id));
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="wrap">
      <div className="count-band">
        <div>
          <Badge tone="hot">On sale soon</Badge>
          <h3 style={{ marginTop: 12 }}>{ev.title}</h3>
          <p>
            {ev.tagline} On-sale opens {target.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at 10:00 AM.
            {notified ? ' You\u2019re on the list — we\u2019ll remind you.' : ' Join the list and we\u2019ll remind you the minute it opens.'}
          </p>
          <div style={{ marginTop: 18 }}>
            {notified ? (
              <Badge tone="solid">You\u2019re on the list</Badge>
            ) : (
              <button
                className="btn btn-brass"
                onClick={() => { setNotified(ev.id); setN(true); }}
              >
                Notify me
              </button>
            )}
          </div>
        </div>
        <div className="count-digits">
          {[[pad(d), 'Days'], [pad(h), 'Hours'], [pad(m), 'Mins'], [pad(s), 'Secs']].map(([n, l]) => (
            <div className="count-cell" key={l}>
              <div className="n">{n}</div>
              <div className="l">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const city = getCity();

  const cityEvents = EVENTS.filter((e) => e.city === city && !e.onSaleSoon);
  const trending = [...cityEvents].sort((a, b) => {
    const hot = (e) => (e.shows.some((s) => s.demand === 'high') ? 0 : 1);
    return hot(a) - hot(b);
  }).slice(0, 8);
  const fallback = EVENTS.filter((e) => !e.onSaleSoon).slice(0, 8);
  const shown = (trending.length >= 4 ? trending : fallback).slice(0, 8);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/browse?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-art" />
        <div className="wrap hero-inner">
          <p className="eyebrow">An independent venture under NAAD Infinity</p>
          <h1 className="display">Book the night out.</h1>
          <p className="lede">
            Movies, concerts, comedy, sports and theatre across India —
            with <strong>reserved seating</strong>,{' '}
            <strong>demand-based pricing</strong> and{' '}
            <strong>digital entry</strong> on every ticket.
          </p>
          <form className="hero-search" onSubmit={onSearch}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search events in ${city}…`}
            />
            <button className="btn" type="submit">Search</button>
          </form>
          <div className="cat-row">
            {CATEGORIES.map((c, i) => (
              <Link key={c.id} to={`/browse/${c.id}`} className="cat-chip">
                <span className="cat-dot" style={{ background: ART[CAT_ART[i] % ART.length] }} />
                <span>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <OnSaleBand />

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow={`Trending in ${city}`}
            title="Selling Fast"
            action={<Link to="/browse" className="btn btn-ghost">View all</Link>}
          />
          <div className="ev-grid">
            {shown.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <SectionHead
            eyebrow="Why NAAD Tickets"
            title="Built for the On-Sale Rush"
          />
          <div className="ev-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              ['01', 'Fraud-resistant', 'Every ticket is issued against a verified booking — no duplicates, no fakes at the gate.'],
              ['02', 'Reserved seating', 'Pick your exact seats on a live map. What you tap is what you get.'],
              ['03', 'Dynamic pricing', 'Prices respond to real demand — early buyers always pay less.'],
              ['04', 'Digital entry', 'Your QR is your ticket. Scan and walk in.'],
            ].map(([n, t, d]) => (
              <div className="post" key={t}>
                <Badge>{n}</Badge>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="venture-strip">
        <div className="wrap">
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>The ecosystem</p>
            <h3 className="serif" style={{ margin: 0, fontSize: 24 }}>
              NAAD Tickets is an independent venture under NAAD Infinity.
            </h3>
            <p className="muted small" style={{ margin: '8px 0 0' }}>
              Its own product, its own market — plugged into the mother company&rsquo;s infrastructure.
            </p>
          </div>
          <a className="btn btn-ghost" href="https://tanmayayay.github.io/NAAD-Infinity/#/" target="_blank" rel="noreferrer">
            About NAAD Infinity
          </a>
        </div>
      </div>
    </>
  );
}
