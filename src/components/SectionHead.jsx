export default function SectionHead({ eyebrow, title, lede, action }) {
  return (
    <div className="sec-head">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <h2 className="section-title">{title}</h2>
        {action}
      </div>
      {lede && <p className="lede" style={{ marginTop: 8 }}>{lede}</p>}
      <hr className="rule-double" />
    </div>
  );
}
