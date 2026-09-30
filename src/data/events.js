/* NAAD Tickets — catalogue data + deterministic seat-map engine.
   Show dates are generated relative to "today" so the demo never goes stale.
   Seat availability is seeded per show: stable across reloads, no backend needed. */

export const CATEGORIES = [
  { id: 'movies', label: 'Movies' },
  { id: 'music', label: 'Music' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'sports', label: 'Sports' },
  { id: 'theatre', label: 'Theatre' },
];

export const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune'];

export const VENUES = [
  {
    id: 'harbor-arena',
    name: 'Harborfront Arena',
    city: 'Mumbai',
    kind: 'arena',
    sections: [
      { id: 'floor', name: 'Platinum Floor', price: 4999, rows: 6, perRow: 18 },
      { id: 'lower', name: 'Gold Lower Stands', price: 2499, rows: 8, perRow: 24 },
      { id: 'upper', name: 'Silver Upper Tier', price: 1299, rows: 8, perRow: 28 },
    ],
  },
  {
    id: 'rex-andheri',
    name: 'The Grand Rex Cinemas, Andheri',
    city: 'Mumbai',
    kind: 'cinema',
    sections: [
      { id: 'recliner', name: 'Recliner', price: 650, rows: 3, perRow: 12 },
      { id: 'prime', name: 'Prime', price: 420, rows: 6, perRow: 18 },
      { id: 'classic', name: 'Classic', price: 280, rows: 5, perRow: 20 },
    ],
  },
  {
    id: 'capital-dome',
    name: 'Capital Dome',
    city: 'Delhi',
    kind: 'arena',
    sections: [
      { id: 'floor', name: 'Platinum Floor', price: 4499, rows: 6, perRow: 18 },
      { id: 'lower', name: 'Gold Lower Stands', price: 2299, rows: 8, perRow: 24 },
      { id: 'upper', name: 'Silver Upper Tier', price: 1199, rows: 8, perRow: 28 },
    ],
  },
  {
    id: 'rex-cp',
    name: 'The Grand Rex Cinemas, Connaught Place',
    city: 'Delhi',
    kind: 'cinema',
    sections: [
      { id: 'recliner', name: 'Recliner', price: 600, rows: 3, perRow: 12 },
      { id: 'prime', name: 'Prime', price: 380, rows: 6, perRow: 18 },
      { id: 'classic', name: 'Classic', price: 250, rows: 5, perRow: 20 },
    ],
  },
  {
    id: 'garden-amphi',
    name: 'Garden City Amphitheatre',
    city: 'Bengaluru',
    kind: 'arena',
    sections: [
      { id: 'floor', name: 'Platinum Lawns', price: 3499, rows: 6, perRow: 20 },
      { id: 'lower', name: 'Gold Pavilion', price: 1899, rows: 8, perRow: 24 },
      { id: 'upper', name: 'Silver Terraces', price: 999, rows: 8, perRow: 28 },
    ],
  },
  {
    id: 'rex-whitefield',
    name: 'The Grand Rex Cinemas, Whitefield',
    city: 'Bengaluru',
    kind: 'cinema',
    sections: [
      { id: 'recliner', name: 'Recliner', price: 580, rows: 3, perRow: 12 },
      { id: 'prime', name: 'Prime', price: 360, rows: 6, perRow: 18 },
      { id: 'classic', name: 'Classic', price: 240, rows: 5, perRow: 20 },
    ],
  },
  {
    id: 'deccan-arena',
    name: 'Deccan Arena',
    city: 'Hyderabad',
    kind: 'arena',
    sections: [
      { id: 'floor', name: 'Platinum Floor', price: 3999, rows: 6, perRow: 18 },
      { id: 'lower', name: 'Gold Lower Stands', price: 1999, rows: 8, perRow: 24 },
      { id: 'upper', name: 'Silver Upper Tier', price: 1099, rows: 8, perRow: 28 },
    ],
  },
  {
    id: 'marina-open',
    name: 'Marina Open-Air Theatre',
    city: 'Chennai',
    kind: 'arena',
    sections: [
      { id: 'floor', name: 'Platinum Arena', price: 2999, rows: 6, perRow: 20 },
      { id: 'lower', name: 'Gold Stands', price: 1599, rows: 8, perRow: 24 },
      { id: 'upper', name: 'Silver Lawns', price: 799, rows: 8, perRow: 28 },
    ],
  },
  {
    id: 'riverside-lawns',
    name: 'Riverside Lawns',
    city: 'Pune',
    kind: 'arena',
    sections: [
      { id: 'floor', name: 'Platinum Lawns', price: 2799, rows: 6, perRow: 20 },
      { id: 'lower', name: 'Gold Pavilion', price: 1499, rows: 8, perRow: 24 },
      { id: 'upper', name: 'Silver Terraces', price: 749, rows: 8, perRow: 28 },
    ],
  },
];

const VENUE_MAP = Object.fromEntries(VENUES.map((v) => [v.id, v]));
export const venueById = (id) => VENUE_MAP[id];

/* Compact show builder: days = offsets from today, times = show times. */
const S = (days, times, demand = 'medium') =>
  days.flatMap((d) =>
    times.map((t) => ({
      day: d,
      time: t,
      demand: typeof demand === 'function' ? demand(d, t) : demand,
    })),
  );

const MOVIE_TIMES = ['10:30 AM', '02:00 PM', '06:30 PM', '10:15 PM'];
const movieDemand = (d, t) =>
  t === '06:30 PM' || t === '10:15 PM' ? 'high' : d >= 5 ? 'high' : 'medium';

export const EVENTS = [
  {
    id: 'monsoon-heist',
    title: 'Monsoon Heist',
    category: 'movies',
    tagline: 'One storm. One vault. No way out.',
    description:
      'A retired thief is pulled back for one last job — robbing a floating casino during the worst storm of the decade. The city\u2019s biggest action spectacle of the season.',
    venueId: 'rex-andheri',
    city: 'Mumbai',
    art: 0,
    meta: { duration: '2h 18m', language: 'Hindi', rating: 'U/A', genre: 'Action / Thriller' },
    shows: S([0, 1, 2, 3, 4, 5, 6], MOVIE_TIMES, movieDemand),
  },
  {
    id: 'last-tiffin',
    title: 'The Last Tiffin',
    category: 'movies',
    tagline: 'Some recipes are worth a lifetime.',
    description:
      'A celebrated chef returns to her childhood home to recreate her grandmother\u2019s lost recipes — and finds the family she left behind. A warm, unhurried drama.',
    venueId: 'rex-cp',
    city: 'Delhi',
    art: 1,
    meta: { duration: '2h 05m', language: 'Hindi', rating: 'U', genre: 'Drama' },
    shows: S([0, 1, 2, 3, 4, 5, 6], MOVIE_TIMES, (d, t) => (t === '06:30 PM' ? 'medium' : 'low')),
  },
  {
    id: 'galaxy-yatra',
    title: 'Galaxy Yatra',
    category: 'movies',
    tagline: 'The stars were only the beginning.',
    description:
      'India\u2019s first deep-space epic: a crew of misfit astronauts follows a mysterious signal beyond the edge of the known. Shot for the biggest screen you can find.',
    venueId: 'rex-whitefield',
    city: 'Bengaluru',
    art: 2,
    meta: { duration: '2h 31m', language: 'English / Hindi', rating: 'U/A', genre: 'Sci-Fi' },
    shows: S([0, 1, 2, 3, 4, 5, 6], MOVIE_TIMES, movieDemand),
  },
  {
    id: 'neon-streets',
    title: 'Neon Streets',
    category: 'movies',
    tagline: 'Every light hides a shadow.',
    description:
      'A late-night cab driver witnesses something she shouldn\u2019t have — and the city\u2019s underworld comes looking. Neon-noir at full throttle.',
    venueId: 'deccan-arena',
    city: 'Hyderabad',
    art: 3,
    meta: { duration: '1h 52m', language: 'English', rating: 'A', genre: 'Crime / Noir' },
    shows: S([0, 1, 2, 3, 4, 5, 6], ['11:00 AM', '03:00 PM', '07:00 PM', '10:30 PM'], (d, t) =>
      t === '07:00 PM' ? 'high' : 'medium',
    ),
  },
  {
    id: 'aarav-mehta-live',
    title: 'Aarav Mehta — Live in Concert',
    category: 'music',
    tagline: 'The voice of a generation, one night only.',
    description:
      'Aarav Mehta brings his full band, a 40-piece string section and a brand-new stage production to the Harborfront Arena. Expect the hits, the deep cuts, and one surprise no one sees coming.',
    venueId: 'harbor-arena',
    city: 'Mumbai',
    art: 4,
    meta: { duration: '3h', language: 'Hindi / English', rating: 'All ages', genre: 'Live concert' },
    shows: S([2, 3], ['07:00 PM'], 'high'),
  },
  {
    id: 'midnight-ragas',
    title: 'Midnight Ragas: Sufi Night',
    category: 'music',
    tagline: 'An evening that begins when the city sleeps.',
    description:
      'Qawwali and Sufi kalaam under the open sky — an intimate late-evening baithak with some of the country\u2019s finest voices, staged at the Garden City Amphitheatre.',
    venueId: 'garden-amphi',
    city: 'Bengaluru',
    art: 5,
    meta: { duration: '2h 30m', language: 'Urdu / Hindi', rating: 'All ages', genre: 'Sufi / Qawwali' },
    shows: S([1, 4, 6], ['08:00 PM'], 'medium'),
  },
  {
    id: 'bassline-festival',
    title: 'Bassline Festival 2026',
    category: 'music',
    tagline: 'Two days. Four stages. Zero sleep.',
    description:
      'The country\u2019s loudest electronic music weekend returns to the Capital Dome — international headliners, homegrown bass crews, and a 360-degree main stage.',
    venueId: 'capital-dome',
    city: 'Delhi',
    art: 6,
    meta: { duration: '2 days', language: 'English', rating: '16+', genre: 'EDM festival' },
    shows: S([5, 6], ['04:00 PM'], 'high'),
  },
  {
    id: 'symphony-of-lights',
    title: 'Symphony of Lights — Music Festival',
    category: 'music',
    tagline: 'Twelve artists. One shoreline. History in the making.',
    description:
      'NAAD Infinity\u2019s flagship curated property: a two-evening festival on the waterfront with twelve artists across three stages, drone light shows and a closing orchestral set. On-sale opens soon — this one will move fast.',
    venueId: 'harbor-arena',
    city: 'Mumbai',
    art: 7,
    onSaleSoon: true,
    meta: { duration: '2 evenings', language: 'Multi', rating: 'All ages', genre: 'Multi-genre festival' },
    shows: S([12, 13], ['05:00 PM'], 'high'),
  },
  {
    id: 'laugh-riot-zoya',
    title: 'Laugh Riot with Zoya Khan',
    category: 'comedy',
    tagline: 'Ninety minutes. Zero mercy.',
    description:
      'Zoya Khan\u2019s brand-new hour — weddings, landlords, startups and everything in between. Her fastest-selling tour yet.',
    venueId: 'capital-dome',
    city: 'Delhi',
    art: 8,
    meta: { duration: '1h 30m', language: 'Hindi / English', rating: '16+', genre: 'Stand-up' },
    shows: S([0, 2, 5], ['08:00 PM'], 'medium'),
  },
  {
    id: 'improv-city-laughs',
    title: 'Improv Nights: City Laughs',
    category: 'comedy',
    tagline: 'You shout it, they perform it.',
    description:
      'Mumbai\u2019s sharpest improv troupe builds an entire show from audience suggestions. No two nights are ever the same.',
    venueId: 'riverside-lawns',
    city: 'Pune',
    art: 9,
    meta: { duration: '1h 45m', language: 'English', rating: '12+', genre: 'Improv comedy' },
    shows: S([1, 3, 6], ['07:30 PM'], 'low'),
  },
  {
    id: 'legends-xi',
    title: 'Legends XI vs Stars XI',
    category: 'sports',
    tagline: 'The icons. One last dance.',
    description:
      'An exhibition T20 under lights — cricketing legends take on the current stars in a charity blockbuster at the Harborfront Arena.',
    venueId: 'harbor-arena',
    city: 'Mumbai',
    art: 10,
    meta: { duration: '4h', language: '—', rating: 'All ages', genre: 'Exhibition T20' },
    shows: S([4], ['07:00 PM'], 'high'),
  },
  {
    id: 'champions-cup-final',
    title: 'Champions Cup Final',
    category: 'sports',
    tagline: 'Ninety minutes from immortality.',
    description:
      'The season decider, live at the Garden City Amphitheatre fan park on the big screen — plus pre-match concerts and food streets. Football\u2019s biggest night, together.',
    venueId: 'garden-amphi',
    city: 'Bengaluru',
    art: 11,
    meta: { duration: '5h', language: '—', rating: 'All ages', genre: 'Football final screening' },
    shows: S([6], ['08:30 PM'], 'medium'),
  },
  {
    id: 'merchant-of-dreams',
    title: 'The Merchant of Dreams',
    category: 'theatre',
    tagline: 'A classic, reimagined for today.',
    description:
      'Shakespeare\u2019s merchant sails into modern Mumbai in this acclaimed reimagining — sharp, funny and quietly devastating.',
    venueId: 'marina-open',
    city: 'Chennai',
    art: 12,
    meta: { duration: '2h 10m', language: 'English', rating: '12+', genre: 'Play' },
    shows: S([0, 3, 5], ['07:00 PM'], 'low'),
  },
  {
    id: 'nritya-odyssey',
    title: 'Nritya: A Dance Odyssey',
    category: 'theatre',
    tagline: 'Three thousand years in ninety minutes.',
    description:
      'A breathtaking journey through India\u2019s classical dance forms — Bharatanatyam to Kathak to Odissi — performed by a 30-artist ensemble.',
    venueId: 'marina-open',
    city: 'Chennai',
    art: 13,
    meta: { duration: '1h 30m', language: '—', rating: 'All ages', genre: 'Dance production' },
    shows: S([2, 6], ['06:30 PM'], 'medium'),
  },
];

const EVENT_MAP = Object.fromEntries(EVENTS.map((e) => [e.id, e]));
export const eventById = (id) => EVENT_MAP[id];

/* ---------- dates ---------- */

export function dateForOffset(day) {
  const d = new Date();
  d.setDate(d.getDate() + day);
  const iso = d.toISOString().slice(0, 10);
  const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  return { iso, label };
}

/* Next Friday 10:00 AM local — the flagship on-sale moment. */
export function getOnSaleAt() {
  const d = new Date();
  const dow = d.getDay(); // 0 Sun … 5 Fri
  let add = (5 - dow + 7) % 7;
  d.setDate(d.getDate() + add);
  d.setHours(10, 0, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 7);
  return d;
}

export const showKey = (eventId, day, time) => `${eventId}|${day}|${time}`;

/* ---------- deterministic seat engine ---------- */

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function seatsFor(showKeyStr, venue, demand) {
  const rand = mulberry32(hashStr(showKeyStr));
  const soldProb = demand === 'high' ? 0.32 : demand === 'medium' ? 0.22 : 0.14;
  return venue.sections.map((sec) => {
    const rows = [];
    for (let r = 0; r < sec.rows; r++) {
      const seats = [];
      for (let s = 0; s < sec.perRow; s++) {
        seats.push({
          id: `${sec.id}-${ROW_LABELS[r]}${s + 1}`,
          row: ROW_LABELS[r],
          num: s + 1,
          price: sec.price,
          sold: rand() < soldProb,
        });
      }
      rows.push({ label: ROW_LABELS[r], seats });
    }
    return { ...sec, rows };
  });
}

export function countAvailable(sections) {
  let n = 0;
  sections.forEach((sec) =>
    sec.rows.forEach((row) => row.seats.forEach((s) => { if (!s.sold) n += 1; })),
  );
  return n;
}

/* ---------- pricing ---------- */

export const demandMultiplier = (d) => (d === 'high' ? 1.25 : d === 'medium' ? 1.1 : 1);

export function priceFor(base, demand) {
  const v = base * demandMultiplier(demand);
  return Math.round(v / 10) * 10 - 1; // charm pricing: 2499, 3124→3119…
}

export const formatINR = (n) => '₹' + Number(n).toLocaleString('en-IN');

export const DEMAND_LABEL = {
  high: 'Selling fast',
  medium: 'Filling up',
  low: 'Good availability',
};

/* ---------- artwork: deterministic gradients per event ---------- */

export const ART = [
  'linear-gradient(135deg,#3b1d0e,#b3541e 55%,#e8a13c)',
  'linear-gradient(135deg,#2b2118,#8a6a2f 60%,#d9b96a)',
  'linear-gradient(135deg,#0e1b2e,#1f4e79 55%,#5aa9e6)',
  'linear-gradient(135deg,#1a0e1e,#5b2a6e 55%,#b565d8)',
  'linear-gradient(135deg,#3d0d12,#a11d2e 55%,#e2605f)',
  'linear-gradient(135deg,#12261c,#2e6b4f 55%,#7fc8a9)',
  'linear-gradient(135deg,#241335,#6d3bb0 55%,#b388eb)',
  'linear-gradient(135deg,#0f2a33,#14666b 55%,#4fd1c5)',
  'linear-gradient(135deg,#331407,#b3541e 55%,#f6bd60)',
  'linear-gradient(135deg,#1c1c22,#4a4a5a 60%,#9a9ab0)',
  'linear-gradient(135deg,#0d2b16,#1f7a3d 55%,#7ed491)',
  'linear-gradient(135deg,#2e1a08,#96602a 55%,#e0aa5e)',
  'linear-gradient(135deg,#260f1e,#7a2e52 55%,#d47a9c)',
  'linear-gradient(135deg,#101d33,#274b73 55%,#6fa8dc)',
];
