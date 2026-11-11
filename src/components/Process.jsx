const STEPS = [
  ['01', 'Send your reference', 'Message us on WhatsApp with your image, size and deadline.'],
  ['02', 'Get your quote', 'We review the complexity and reply with a price and timeline.'],
  ['03', 'Approve the sculpt', 'A clay-stage preview first, then detailing with [X] revision rounds.'],
  ['04', 'Receive your files', 'Print-ready STL files plus turntable renders.'],
]

export default function Process() {
  return (
    <section className="container section section-xl">
      <div className="eyebrow">Process</div>
      <h2 className="h2 h2-lg">From reference to finished sculpt.</h2>
      <div className="steps">
        {STEPS.map(([num, title, text]) => (
          <div className="step" key={num}>
            <div className="step-num">{num}</div>
            <div className="step-title">{title}</div>
            <p className="step-text">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
