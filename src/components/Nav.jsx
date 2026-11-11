import { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo.png'
import { QUOTE_LINK } from '../config.js'

const LINKS = [
  ['#custom', 'Custom'],
  ['#process', 'Process'],
  ['#collection', 'Collection'],
]

// Fixed header: transparent over the hero, frosted once the page has scrolled, with a
// hairline reading-progress bar along the top edge. On narrow screens the section links
// live in a full-screen menu.
export default function Nav() {
  const ref = useRef(null)
  const barRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const nav = ref.current
    const bar = barRef.current
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      nav.classList.toggle('is-scrolled', y > 24)
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    document.documentElement.classList.add('menu-open')
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth > 760 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.documentElement.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const close = () => setOpen(false)

  // The menu is a sibling of the header: the header's backdrop-filter would otherwise
  // become the containing block of a fixed-position child and collapse it.
  return (
    <>
    <header ref={ref} className={`nav-wrap ${open ? 'is-open' : ''}`}>
      <div ref={barRef} className="nav-progress" aria-hidden="true" />
      <nav className="container nav" aria-label="Primary">
        <a href="#top" aria-label="3D Spire home" className="nav-logo" onClick={close}>
          <img src={logo} alt="3D Spire – Imagination yours, creativity ours" width="188" height="56" />
        </a>
        <div className="nav-links">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
          <a href={QUOTE_LINK} className="btn btn-sm btn-primary">Get a quote</a>
        </div>
        <button
          type="button"
          className="nav-menu"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-menu-icon" aria-hidden="true" />
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>
    </header>
    <div id="site-menu" className="menu" hidden={!open}>
      <div className="container menu-inner">
        {LINKS.map(([href, label], i) => (
          <a key={href} href={href} onClick={close} style={{ '--i': i }}>{label}</a>
        ))}
        <a href={QUOTE_LINK} className="btn btn-primary" onClick={close} style={{ '--i': LINKS.length }}>
          Get a quote
        </a>
      </div>
    </div>
    </>
  )
}
