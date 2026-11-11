const FAQS = [
  [
    'How is the price decided?',
    'It depends on the model’s complexity: detail level, number of parts, size and finish. Send your reference and we’ll quote on WhatsApp.',
  ],
  ['Which file formats do you provide?', 'STL for printing, plus [OBJ / FBX / PNG renders] on request.'],
  [
    'Can I sell prints made from your files?',
    '[Describe your licence: personal use only, or commercial use with terms.]',
  ],
  [
    'How long does a custom model take?',
    '[X–Y] working days, depending on detail. Book early for busy seasons.',
  ],
]

export default function Faq() {
  return (
    <section className="faq section section-xl">
      <h2 className="h2 h2-sm">Questions, answered.</h2>
      {FAQS.map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p className="muted">{a}</p>
        </details>
      ))}
    </section>
  )
}
