import ModelViewer from './ModelViewer.jsx'
import { CATALOGUE_LINK, MODEL_URL } from '../config.js'

export default function Collection() {
  return (
    <section className="container section">
      <div className="eyebrow">The collection</div>
      <h2 className="h2 h2-lg">Ready to print. Made to be admired.</h2>
      <div className="cards">
        <ModelViewer className="card-model" src={MODEL_URL} alt="Shiva drinking poison. Drag to rotate.">
          <div className="card-caption">Model 01 · Shiva drinking poison</div>
        </ModelViewer>
        <div className="card placeholder">Model 02 · [Name]</div>
        <div className="card placeholder">Model 03 · [Name]</div>
      </div>
      <p className="muted note">Price depends on the model’s complexity.</p>
      <div className="note-link">
        <a href={CATALOGUE_LINK} className="link">Ask for the full catalogue →</a>
      </div>
    </section>
  )
}
