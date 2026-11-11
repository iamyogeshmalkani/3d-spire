// Motion core: one rAF-throttled scroll manager that writes a 0..1 progress value to
// `--p` on registered elements (CSS does the transforms), an IntersectionObserver that
// flips `[data-reveal]` elements to `.is-in`, hash-link scrolling that survives lazy
// section mounting, and magnetic buttons. Everything is a no-op under reduced motion.

const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches
export const reducedMotion = () => mq('(prefers-reduced-motion: reduce)')
export const finePointer = () => mq('(pointer: fine)') && mq('(hover: hover)')

/* ---------- scroll progress ---------- */

const targets = new Set()
let ticking = false
let listening = false

function measure() {
  ticking = false
  const vh = window.innerHeight
  const pending = []
  // Read phase
  for (const t of targets) {
    const r = t.el.getBoundingClientRect()
    let p
    if (t.mode === 'pin') {
      // 0 when the section top reaches the viewport top, 1 when its bottom reaches the viewport bottom.
      const travel = r.height - vh
      p = travel > 0 ? -r.top / travel : (r.top <= 0 ? 1 : 0)
    } else if (t.mode === 'exit') {
      // 0 while the element top is at/above the viewport top, 1 once it has scrolled fully out.
      p = -r.top / r.height
    } else {
      // 'view': 0 as the element enters from the bottom, 1 as it leaves through the top.
      p = (vh - r.top) / (vh + r.height)
    }
    p = p < 0 ? 0 : p > 1 ? 1 : p
    if (p !== t.last) {
      t.last = p
      pending.push([t, p])
    }
  }
  // Write phase
  for (const [t, p] of pending) {
    t.el.style.setProperty('--p', p.toFixed(4))
    t.cb?.(p, t.el)
  }
}

function schedule() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(measure)
  }
}

function listen() {
  if (listening) return
  listening = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
}

// Returns an unsubscribe function. `mode`: 'view' | 'exit' | 'pin'.
export function trackScroll(el, mode = 'view', cb) {
  if (!el || reducedMotion()) return () => {}
  listen()
  const t = { el, mode, cb, last: -1 }
  targets.add(t)
  schedule()
  return () => targets.delete(t)
}

// Ask for a re-measure (e.g. after a lazy section changed the page height).
export const refreshScroll = schedule

/* ---------- reveals ---------- */

export function initReveals(root) {
  if (reducedMotion() || !('IntersectionObserver' in window)) return () => {}
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0 },
  )
  const observe = (el) => {
    if (el.dataset.observed !== undefined) return
    el.dataset.observed = ''
    io.observe(el)
  }
  const scan = (node) => {
    if (node.matches?.('[data-reveal]')) observe(node)
    node.querySelectorAll?.('[data-reveal]').forEach(observe)
  }
  scan(root)
  const mo = new MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) if (n.nodeType === 1) scan(n)
  })
  mo.observe(root, { childList: true, subtree: true })
  return () => {
    io.disconnect()
    mo.disconnect()
  }
}

/* ---------- hash links that tolerate lazy sections ---------- */

const MOUNT_ALL = 'spire:mount-all'

export function onMountAll(fn) {
  window.addEventListener(MOUNT_ALL, fn)
  return () => window.removeEventListener(MOUNT_ALL, fn)
}

function offsetOf(target) {
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0
  return target.getBoundingClientRect().top - margin
}

// Scrolls to `target`, then keeps correcting while lazily mounted sections above it
// change height, so the user is never stranded mid-page.
export function scrollToSettled(target) {
  window.dispatchEvent(new Event(MOUNT_ALL))
  // Placeholders already reserve height, so start the scroll right away; lazily mounted
  // sections may still change the page height while it runs, hence the corrections below.
  target.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' })

  let done = false
  let lastY = -1
  let still = 0
  let tries = 0
  let settledAt = 0
  const settled = () => {
    const offset = offsetOf(target)
    const y = window.scrollY
    // A target near the end of the page can't reach the top edge: done once we hit bottom.
    const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 2
    return Math.abs(offset) <= 2 || (offset > 0 && atBottom)
  }
  // 'instant' ignores the page's CSS scroll-behavior, so corrections never animate.
  const correct = () => target.scrollIntoView({ behavior: 'instant', block: 'start' })
  const USER = ['wheel', 'touchstart', 'pointerdown', 'keydown']
  const finish = () => {
    done = true
    window.removeEventListener('scrollend', onEnd)
    USER.forEach((t) => window.removeEventListener(t, finish))
  }
  const onEnd = () => {
    if (!done && !settled()) correct()
  }
  window.addEventListener('scrollend', onEnd)
  // The moment the user scrolls on their own, stop steering.
  USER.forEach((t) => window.addEventListener(t, finish, { passive: true }))
  // Polling fallback: once the position is stable, re-check, and keep watching for a
  // short while so late-mounting content above the target can't push it away.
  const tick = () => {
    if (done) return
    tries++
    const y = window.scrollY
    still = y === lastY ? still + 1 : 0
    lastY = y
    if (still >= 3) {
      if (!settled()) {
        correct()
        still = 0
        settledAt = 0
      } else {
        settledAt ||= tries
        if (tries - settledAt >= 25) return finish()
      }
    }
    if (tries < 120) setTimeout(tick, 100)
    else finish()
  }
  setTimeout(tick, 250)
}

export function initAnchors() {
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return
    const a = e.target.closest?.('a[href^="#"]')
    if (!a) return
    const id = decodeURIComponent(a.getAttribute('href').slice(1))
    const target = id && document.getElementById(id)
    if (!target) return
    e.preventDefault()
    history.pushState(null, '', `#${id}`)
    // Move focus with the scroll so keyboard and screen-reader users land in the section.
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
    scrollToSettled(target)
  }
  document.addEventListener('click', onClick)
  // Deep link on first load (e.g. /#process).
  if (location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (target) setTimeout(() => scrollToSettled(target), 50)
  }
  return () => document.removeEventListener('click', onClick)
}

/* ---------- magnetic buttons (fine pointers only) ---------- */

export function initMagnetic(root) {
  if (reducedMotion() || !finePointer()) return () => {}
  let el = null
  let raf = 0
  let mx = 0
  let my = 0
  const apply = () => {
    raf = 0
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = mx - (r.left + r.width / 2)
    const dy = my - (r.top + r.height / 2)
    el.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`
  }
  const onOver = (e) => {
    const b = e.target.closest?.('.btn')
    if (!b || b === el) return
    el = b
    el.classList.add('is-magnet')
  }
  const onMove = (e) => {
    if (!el) return
    mx = e.clientX
    my = e.clientY
    if (!raf) raf = requestAnimationFrame(apply)
  }
  const onOut = (e) => {
    if (!el || el.contains(e.relatedTarget)) return
    el.style.transform = ''
    el.classList.remove('is-magnet')
    el = null
  }
  root.addEventListener('pointerover', onOver)
  root.addEventListener('pointermove', onMove)
  root.addEventListener('pointerout', onOut)
  return () => {
    root.removeEventListener('pointerover', onOver)
    root.removeEventListener('pointermove', onMove)
    root.removeEventListener('pointerout', onOut)
  }
}

/* ---------- helpers for the 3D viewers ---------- */

export const lerp = (a, b, t) => a + (b - a) * t
export const smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}
