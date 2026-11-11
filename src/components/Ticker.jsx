const ITEMS = [
  'From an image reference',
  'From a written idea',
  'Characters & figures',
  'Fine surface detail',
  'Print-ready STL',
  'Delivered in [X] days',
]

// Continuous marquee. Copies after the first are hidden from assistive tech, and under
// reduced motion only the first copy shows, wrapped as a static row.
export default function Ticker() {
  const list = (hidden) => (
    <ul className="ticker-list" aria-hidden={hidden || undefined}>
      {ITEMS.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
  return (
    <div className="ticker" role="region" aria-label="What we offer">
      <div className="ticker-track">
        {list(false)}
        {list(true)}
        {list(true)}
      </div>
    </div>
  )
}
