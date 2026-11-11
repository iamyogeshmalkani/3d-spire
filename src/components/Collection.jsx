import ModelViewer from './ModelViewer.jsx'
import { CATALOGUE_LINK, COLLECTION } from '../config.js'

export default function Collection() {
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
            <ModelViewer
              className="card-viewer"
              src={model.src}
              alt={`${model.name}. Drag to rotate.`}
            />
            <div className="card-caption">
              Model {String(i + 1).padStart(2, '0')} · {model.name}
            </div>
          </article>
        ))}
      </div>
      <div className="collection-foot" data-reveal>
        <p className="muted note">Price depends on the model’s complexity.</p>
        <a href={CATALOGUE_LINK} className="link link-arrow">Ask for the full catalogue →</a>
      </div>
    </section>
  )
}
