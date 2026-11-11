import { useRef } from 'react'
import ModelViewer, { orbitBy } from './ModelViewer.jsx'
import { MODEL_URL, QUOTE_LINK } from '../config.js'
import { useScrollProgress } from '../hooks.js'

const TITLE = ['Any idea.', 'Any reference.', 'Sculpted in 3D.']

// The hero is a stage: the sculpt stands free of any box on a lime spotlight, in front of
// an oversized ghost wordmark. Layers move at different speeds on scroll (via --p) and the
// camera turns around the figure as you scroll past it.
export default function Hero() {
  const viewer = useRef(null)
  const lastP = useRef(0)
  const ref = useScrollProgress('exit', (p) => {
    orbitBy(viewer.current, (p - lastP.current) * 150)
    lastP.current = p
  })

  return (
    <section id="top" ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero-ghost" aria-hidden="true">SPIRE</div>
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow eyebrow-lg hero-eyebrow">3D character &amp; figure design studio</p>
          <h1 id="hero-title" className="hero-title">
            {TITLE.map((line, i) => (
              <span className="line" key={line}>
                <span className="line-inner" style={{ '--i': i }}>{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-lead">
            Send an image reference, a sketch, or simply describe what you have in mind. We sculpt it
            into a finished 3D character or figure, ready to print or present.
          </p>
          <div className="btn-row hero-actions">
            <a href={QUOTE_LINK} className="btn btn-primary">Get a quote</a>
            <a href="#process" className="btn btn-outline">See how it works</a>
          </div>
        </div>

        <div className="hero-stage">
          <div className="stage-glow" aria-hidden="true" />
          <ModelViewer
            eager
            className="viewer-hero"
            src={MODEL_URL}
            alt="Interactive 3D sculpt by 3D Spire. Drag to rotate."
            onViewer={(el) => (viewer.current = el)}
          />
          <p className="hint">Drag to rotate</p>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span className="scroll-cue-line" />
          <span className="scroll-cue-label">Scroll</span>
        </div>
      </div>
    </section>
  )
}
