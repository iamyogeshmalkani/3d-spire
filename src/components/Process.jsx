import { useScrollProgress } from '../hooks.js'

const STEPS = [
  ['01', 'Share your idea', 'Message us on WhatsApp with an image reference, a sketch or a short description, plus size and deadline.'],
  ['02', 'Get your quote', 'We review the complexity and reply with a price and timeline.'],
  ['03', 'Approve the sculpt', 'A clay-stage preview first, then detailing with [X] revision rounds.'],
  ['04', 'Receive your files', 'Print-ready STL files plus turntable renders.'],
]

// The four steps hang off one line that fills as the section scrolls through the
// viewport; each step lights up as the line reaches it.
export default function Process() {
  const ref = useScrollProgress('view')
  return (
    <section className="container section section-xl process" aria-labelledby="process-title">
      <div className="section-head" data-reveal>
        <p className="eyebrow">Process</p>
        <h2 id="process-title" className="h2 h2-lg">From reference to finished sculpt.</h2>
      </div>
      <ol className="steps" ref={ref}>
        {STEPS.map(([num, title, text], i) => (
          <li className="step" key={num} style={{ '--t': i / STEPS.length }}>
            <div className="step-num" aria-hidden="true">{num}</div>
            <h3 className="step-title">{title}</h3>
            <p className="step-text">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
