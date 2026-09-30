import { priceFor, formatINR } from '../data/events.js';

const SEAT = 15;
const GAP = 6;
const STEP = SEAT + GAP;

/* Auto-pick: N best adjacent-ish seats, centre of the best section's middle row. */
export function pickBest(sections, n) {
  const picked = [];
  for (const sec of sections) {
    if (picked.length >= n) break;
    const midRow = sec.rows[Math.floor(sec.rows.length / 2)] || sec.rows[0];
    if (!midRow) continue;
    const avail = midRow.seats.filter((s) => !s.sold);
    const start = Math.max(0, Math.floor((avail.length - n) / 2));
    for (const s of avail.slice(start, start + (n - picked.length))) {
      picked.push({ ...s, sectionId: sec.id, sectionName: sec.name });
      if (picked.length >= n) break;
    }
  }
  return picked;
}

function SectionBlock({ sec, demand, selected, onToggle }) {
  const width = sec.perRow * STEP + 30;
  const height = sec.rows.length * STEP + 6;
  const lo = priceFor(sec.price, demand);

  return (
    <div className="seat-section">
      <h4>{sec.name}</h4>
      <div className="sec-price">{formatINR(lo)} onwards · demand pricing applies</div>
      <svg
        className="seat-svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-label={sec.name}
      >
        {sec.rows.map((row, ri) => (
          <g key={row.label}>
            <text x={4} y={ri * STEP + SEAT - 2} className="seat-row-label">
              {row.label}
            </text>
            {row.seats.map((s, si) => {
              const isSel = selected.has(s.id);
              const cls = 'seat ' + (s.sold ? 'sold' : isSel ? 'sel' : 'avail');
              return (
                <g
                  key={s.id}
                  className={cls}
                  transform={`translate(${30 + si * STEP}, ${ri * STEP})`}
                  onClick={() => !s.sold && onToggle({ ...s, sectionId: sec.id, sectionName: sec.name })}
                >
                  <title>{`${sec.name} · Row ${s.row}, Seat ${s.num} · ${formatINR(priceFor(s.price, demand))}`}</title>
                  <rect width={SEAT} height={SEAT} rx={4} />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function SeatMap({ sections, demand, selected, onToggle, kind }) {
  return (
    <div>
      <div className="seat-stage">
        <div className="bar" />
        {kind === 'cinema' ? 'Screen this way' : 'Stage'}
      </div>

      {sections.map((sec) => (
        <SectionBlock
          key={sec.id}
          sec={sec}
          demand={demand}
          selected={selected}
          onToggle={onToggle}
        />
      ))}

      <div className="seat-legend">
        <span><span className="sw sw-avail" />Available</span>
        <span><span className="sw sw-sel" />Selected</span>
        <span><span className="sw sw-sold" />Sold</span>
      </div>
    </div>
  );
}
