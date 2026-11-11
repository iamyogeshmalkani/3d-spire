import { useEffect, useRef, useState } from 'react'
import { trackScroll } from './motion.js'

// Becomes true (and stays true) once the element gets within `rootMargin` of the viewport.
// Observation only starts once `enabled` is true.
export function useInView(rootMargin = '400px', enabled = true) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView || !enabled) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView, rootMargin, enabled])

  return [ref, inView, setInView]
}

// True once the user has scrolled at all. Lets the hero's own assets (three.js + the .glb)
// load first; below-the-fold chunks are only considered after the first scroll.
let scrolled = false
export function useHasScrolled() {
  const [has, setHas] = useState(scrolled)
  useEffect(() => {
    if (scrolled || window.scrollY > 0) {
      scrolled = true
      setHas(true)
      return
    }
    const on = () => {
      scrolled = true
      setHas(true)
      window.removeEventListener('scroll', on)
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return has
}

// Writes scroll progress (0..1) to `--p` on the element and calls `onProgress(p)`.
// Does nothing under prefers-reduced-motion. `mode`: 'view' | 'exit' | 'pin'.
export function useScrollProgress(mode = 'view', onProgress) {
  const ref = useRef(null)
  const cbRef = useRef(onProgress)
  cbRef.current = onProgress
  useEffect(() => trackScroll(ref.current, mode, (p, el) => cbRef.current?.(p, el)), [mode])
  return ref
}

// Live value of a media query.
export function useMedia(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const m = window.matchMedia(query)
    const update = () => setMatches(m.matches)
    update()
    m.addEventListener('change', update)
    return () => m.removeEventListener('change', update)
  }, [query])
  return matches
}
