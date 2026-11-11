import logo from '../assets/logo.png'
import { QUOTE_LINK } from '../config.js'

export default function Nav() {
  return (
    <nav className="container nav">
      <a href="#top" aria-label="3D Spire home" className="nav-logo">
        <img src={logo} alt="3D Spire – Imagination yours, creativity ours" width="188" height="56" />
      </a>
      <div className="nav-links">
        <a href="#collection">Collection</a>
        <a href="#custom">Custom</a>
        <a href="#process">Process</a>
        <a href={QUOTE_LINK} className="btn btn-sm btn-primary">Get a quote</a>
      </div>
    </nav>
  )
}
