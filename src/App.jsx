import { lazy } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import TrustStrip from './components/TrustStrip.jsx'
import LazySection from './components/LazySection.jsx'

// Everything below the fold is code-split and only loaded when scrolled near.
const Collection = lazy(() => import('./components/Collection.jsx'))
const Custom = lazy(() => import('./components/Custom.jsx'))
const Process = lazy(() => import('./components/Process.jsx'))
const Faq = lazy(() => import('./components/Faq.jsx'))
const Quote = lazy(() => import('./components/Quote.jsx'))

export default function App() {
  return (
    <div className="page">
      <Nav />
      <Hero />
      <TrustStrip />
      <LazySection id="collection" minHeight={900}><Collection /></LazySection>
      <LazySection id="custom" minHeight={600}><Custom /></LazySection>
      <LazySection id="process" minHeight={500}><Process /></LazySection>
      <LazySection minHeight={400}><Faq /></LazySection>
      <LazySection id="contact" minHeight={500}><Quote /></LazySection>
    </div>
  )
}
