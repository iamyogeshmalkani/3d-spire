import { INSTAGRAM_LINK, QUOTE_LINK } from '../config.js'
import { useScrollProgress } from '../hooks.js'

export default function Quote() {
  const ref = useScrollProgress('view')
  return (
    <>
      <section ref={ref} className="container section section-xl quote-wrap" aria-labelledby="quote-title">
        <div className="quote" data-reveal="clip">
          <p className="eyebrow eyebrow-center">Get a quote</p>
          <h2 id="quote-title" className="h2 quote-title">Send your reference or describe your idea.</h2>
          <p className="muted quote-text">
            Tap the button to open WhatsApp, then attach your reference image or describe your idea in
            the message. Price depends on the model’s complexity, and you’ll get a quote within [X] hours.
          </p>
          <div className="btn-row btn-row-center">
            <a href={QUOTE_LINK} className="btn btn-primary">Get a quote on WhatsApp</a>
            <a href={INSTAGRAM_LINK} className="btn btn-outline">@3d_spire</a>
          </div>
        </div>
      </section>
      <footer className="container footer">
        <span className="copyright">© 3D Spire</span>
        <a href="#top" className="footer-top">Back to top</a>
      </footer>
    </>
  )
}
