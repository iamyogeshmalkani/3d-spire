import { INSTAGRAM_LINK, QUOTE_LINK } from '../config.js'

export default function Quote() {
  return (
    <footer className="container section section-xl quote-wrap">
      <div className="quote">
        <div className="eyebrow">Get a quote</div>
        <h2 className="h2 quote-title">Send your reference image.</h2>
        <p className="muted quote-text">
          Tap the button to open WhatsApp, then attach your reference image to the message. Price
          depends on the model’s complexity, and you’ll get a quote within [X] hours.
        </p>
        <div className="btn-row btn-row-center">
          <a href={QUOTE_LINK} className="btn btn-primary">Get a quote on WhatsApp</a>
          <a href={INSTAGRAM_LINK} className="btn btn-outline">@3d_spire</a>
        </div>
      </div>
      <div className="copyright">© 3D Spire</div>
    </footer>
  )
}
