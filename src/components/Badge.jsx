export default function Badge({ children, tone }) {
  const cls =
    'badge' +
    (tone === 'solid' ? ' badge-solid' : '') +
    (tone === 'hot' ? ' badge-hot' : '') +
    (tone === 'ink' ? ' badge-ink' : '') +
    (tone === 'muted' ? ' badge-muted' : '');
  return <span className={cls}>{children}</span>;
}
