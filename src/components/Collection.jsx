import { Suspense, lazy, useEffect, useId, useState } from 'react'
import { CATALOGUE_LINK, COLLECTION } from '../config.js'

const ModelViewer = lazy(() => import('./ModelViewer.jsx'))

function TryModal({ model, onClose }) {
  const titleId = useId()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="try3d" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="try3d-backdrop" aria-label="Close 3D viewer" onClick={onClose} />
      <div className="try3d-panel">
        <header className="try3d-head">
          <div>
            <p className="eyebrow">Interactive preview</p>
            <h3 id={titleId} className="try3d-title">{model.name}</h3>
          </div>
          <button type="button" className="btn btn-outline try3d-close" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="try3d-stage">
          <Suspense fallback={<p className="render-meta"><span className="render-status">Loading sculpt…</span></p>}>
            <ModelViewer
              eager
              className="viewer-try3d"
              src={model.src}
              alt={`${model.name}. Drag to rotate.`}
              controls
              autoRotate
              autoRotateDelay={600}
              interactionPrompt="auto"
            />
          </Suspense>
          <p className="hint">Drag to rotate</p>
        </div>
      </div>
    </div>
  )
}

export default function Collection() {
  const [active, setActive] = useState(null)

  return (
    <section className="container section collection" aria-labelledby="collection-title">
      <div className="section-head" data-reveal>
        <p className="eyebrow">Ready-made files</p>
        <h2 id="collection-title" className="h2 h2-lg">Ready to print. Made to be admired.</h2>
      </div>
      <div className="cards">
        {COLLECTION.map((model, i) => (
          <article
            key={model.id}
            className="card card-model"
            data-reveal="clip"
            style={i ? { '--d': `${(i * 0.1).toFixed(2)}s` } : undefined}
          >
            <img
              className="card-gif"
              src={model.preview}
              alt={`${model.name} rotating preview`}
              width="420"
              height="520"
              loading="lazy"
              decoding="async"
            />
            <div className="card-caption">
              <span>Model {String(i + 1).padStart(2, '0')} · {model.name}</span>
              <button
                type="button"
                className="btn btn-primary card-cta"
                onClick={() => setActive(model)}
              >
                Try 3D
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="collection-foot" data-reveal>
        <p className="muted note">Price depends on the model’s complexity. Tap Try 3D to inspect a sculpt yourself.</p>
        <a href={CATALOGUE_LINK} className="link link-arrow">Ask for the full catalogue →</a>
      </div>
      {active && <TryModal model={active} onClose={() => setActive(null)} />}
    </section>
  )
}
