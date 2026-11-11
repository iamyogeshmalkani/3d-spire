import { useRef } from 'react'
import { reducedMotion } from '../motion.js'

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

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

// Native <details> (keyboard + screen-reader friendly) with the open/close height
// animated through the Web Animations API. Under reduced motion the browser toggles it.
function Item({ q, a, index }) {
  const ref = useRef(null)
  const anim = useRef(null)

  const onClick = (e) => {
    if (reducedMotion()) return
    e.preventDefault()
    const details = ref.current
    const body = details.querySelector('.faq-body')
    const current = anim.current ? body.getBoundingClientRect().height : null
    anim.current?.cancel()

    if (details.open && !details.classList.contains('is-closing')) {
      const from = current ?? body.offsetHeight
      details.classList.add('is-closing')
      anim.current = body.animate(
        [{ height: `${from}px`, opacity: 1 }, { height: '0px', opacity: 0 }],
        { duration: 320, easing: EASE },
      )
      anim.current.onfinish = () => {
        details.open = false
        details.classList.remove('is-closing')
        anim.current = null
      }
    } else {
      details.classList.remove('is-closing')
      details.open = true
      const to = body.scrollHeight
      anim.current = body.animate(
        [{ height: `${current ?? 0}px`, opacity: current ? 1 : 0 }, { height: `${to}px`, opacity: 1 }],
        { duration: 440, easing: EASE },
      )
      anim.current.onfinish = () => (anim.current = null)
    }
  }

  return (
    <details ref={ref} data-reveal style={{ '--d': `${index * 0.07}s` }}>
      <summary onClick={onClick}>
        <span>{q}</span>
        <span className="faq-icon" aria-hidden="true" />
      </summary>
      <div className="faq-body">
        <p className="muted">{a}</p>
      </div>
    </details>
  )
}

export default function Faq() {
  return (
    <section className="faq section section-xl" aria-labelledby="faq-title">
      <h2 id="faq-title" className="h2 h2-sm" data-reveal>Questions, answered.</h2>
      {FAQS.map(([q, a], i) => (
        <Item key={q} q={q} a={a} index={i} />
      ))}
    </section>
  )
}
