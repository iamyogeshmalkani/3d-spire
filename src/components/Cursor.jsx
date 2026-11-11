import { useEffect, useRef } from 'react'

// Small custom cursor for fine pointers: a lime dot that snaps to the pointer and a ring
// that eases after it. The ring grows over links/buttons and becomes a "Drag" badge over
// the 3D viewers. Mounted only when (pointer: fine) and motion is allowed.
export default function Cursor() {
  const root = useRef(null)
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const html = document.documentElement
    html.classList.add('has-cursor')
    const el = root.current
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0
    let state = ''

    const loop = () => {
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      ring.current.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(loop) : 0
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      el.classList.add('is-visible')
      const t = e.target.closest?.('model-viewer, .viewer, a, button, summary, [data-cursor]')
      const next = !t ? '' : t.dataset?.cursor || (t.matches('model-viewer, .viewer') ? 'drag' : 'link')
      if (next !== state) {
        el.classList.remove('is-link', 'is-drag')
        if (next) el.classList.add(`is-${next}`)
        state = next
      }
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const hide = () => el.classList.remove('is-visible')
    const onOut = (e) => {
      if (!e.relatedTarget) hide()
    }
    const onDown = (e) => {
      if (e.pointerType === 'touch') hide()
      else el.classList.add('is-down')
    }
    const onUp = () => el.classList.remove('is-down')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseout', onOut)
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('blur', hide)
    return () => {
      html.classList.remove('has-cursor')
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseout', onOut)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('blur', hide)
    }
  }, [])

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring"><span>Drag</span></div>
    </div>
  )
}
