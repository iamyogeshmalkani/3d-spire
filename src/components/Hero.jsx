import { MODEL_URL, QUOTE_LINK } from '../config.js'
import ModelViewer from './ModelViewer.jsx'

const TITLE = ['Any idea.', 'Any reference.', 'Sculpted in 3D.']

// Hero stage: interactive sculpt with a visible render-progress state while the GLB boots.
export default function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
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
            controls
            autoRotate
            interactionPrompt="auto"
            autoRotateDelay={800}
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
