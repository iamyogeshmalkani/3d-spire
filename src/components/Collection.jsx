import ModelViewer from './ModelViewer.jsx'
import Wireframe from './Wireframe.jsx'
import { CATALOGUE_LINK, MODEL_URL } from '../config.js'

export default function Collection() {
  return (
    <section className="container section collection" aria-labelledby="collection-title">
      <div className="section-head" data-reveal>
        <p className="eyebrow">Ready-made files</p>
        <h2 id="collection-title" className="h2 h2-lg">Ready to print. Made to be admired.</h2>
      </div>
      <div className="cards">
        <article className="card card-model" data-reveal="clip">
          <ModelViewer className="card-viewer" src={MODEL_URL} alt="Shiva drinking poison. Drag to rotate." />
          <div className="card-caption">Model 01 · Shiva drinking poison</div>
        </article>
        <article className="card card-soon" data-reveal="clip" style={{ '--d': '0.12s' }}>
          <Wireframe seed={0} />
          <span className="card-tag">Coming soon</span>
          <div className="card-caption">Model 02 · [Name]</div>
        </article>
        <article className="card card-soon" data-reveal="clip" style={{ '--d': '0.24s' }}>
          <Wireframe seed={1} />
          <span className="card-tag">Coming soon</span>
          <div className="card-caption">Model 03 · [Name]</div>
        </article>
      </div>
      <div className="collection-foot" data-reveal>
        <p className="muted note">Price depends on the model’s complexity.</p>
        <a href={CATALOGUE_LINK} className="link link-arrow">Ask for the full catalogue →</a>
      </div>
    </section>
  )
}
