import { Suspense, lazy, useEffect, useState } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Ticker from './components/Ticker.jsx'
import LazySection from './components/LazySection.jsx'
import { finePointer, initAnchors, initMagnetic, initReveals, reducedMotion } from './motion.js'

// Everything below the fold is code-split and only loaded when scrolled near.
const Collection = lazy(() => import('./components/Collection.jsx'))
const Custom = lazy(() => import('./components/Custom.jsx'))
const Process = lazy(() => import('./components/Process.jsx'))
const Faq = lazy(() => import('./components/Faq.jsx'))
const Quote = lazy(() => import('./components/Quote.jsx'))
// The custom cursor only ever loads for mouse/trackpad users who allow motion.
const Cursor = lazy(() => import('./components/Cursor.jsx'))

export default function App() {
  const [cursor, setCursor] = useState(false)

  useEffect(() => {
    const root = document.getElementById('root')
    const stops = [initReveals(root), initAnchors(), initMagnetic(root)]
    if (finePointer() && !reducedMotion()) setCursor(true)
    return () => stops.forEach((stop) => stop())
  }, [])

  return (
    <div className="page">
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Ticker />
        <LazySection id="custom" minHeight="var(--custom-min, 760px)"><Custom /></LazySection>
        <LazySection id="process" minHeight={560}><Process /></LazySection>
        <LazySection id="collection" minHeight={960}><Collection /></LazySection>
        <LazySection minHeight={520}><Faq /></LazySection>
      </main>
      <LazySection id="contact" minHeight={620}><Quote /></LazySection>
      {cursor && (
        <Suspense fallback={null}>
          <Cursor />
        </Suspense>
      )}
    </div>
  )
}
