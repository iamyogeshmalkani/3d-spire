import ModelViewer from './ModelViewer.jsx'
import { MODEL_URL, QUOTE_LINK } from '../config.js'

export default function Hero() {
  return (
    <header id="top" className="container hero">
      <div className="eyebrow eyebrow-lg">3D character &amp; figure design studio</div>
      <h1 className="hero-title">Sculpted in 3D. Crafted in detail.</h1>
      <p className="hero-lead">
        Museum-grade 3D character and figure designs. Ready-made STL files for printing, or a custom
        model made from your reference.
      </p>
      <div className="btn-row">
        <a href={QUOTE_LINK} className="btn btn-primary">Get a quote</a>
        <a href="#collection" className="btn btn-outline">Browse STL files</a>
      </div>
      <div className="hero-viewer">
        <ModelViewer
          eager
          className="viewer-hero"
          src={MODEL_URL}
          alt="Interactive 3D sculpt by 3D Spire. Drag to rotate."
        />
        <p className="hint">Drag to rotate · Pinch or scroll to zoom</p>
      </div>
    </header>
  )
}
