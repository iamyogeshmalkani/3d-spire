import { useRef, useState } from 'react'
import ModelViewer, { mixLook, orbitBy, setLook } from './ModelViewer.jsx'
import Wireframe from './Wireframe.jsx'
import { CLAY_LOOK, MODEL_LOOK, MODEL_URL } from '../config.js'
import { useMedia, useScrollProgress } from '../hooks.js'
import { smoothstep } from '../motion.js'

const STAGES = [
  ['idea', '01', 'Your idea', 'A photo, a sketch, or a few lines describing it.'],
  ['clay', '02', 'Clay preview', 'You approve a sculpt preview before we add the final detail.'],
  ['final', '03', 'Final detail', 'Fine surface detail, ready to print or present.'],
]

// Where each transition happens along the section's progress (0..1):
// [sketch -> model fade start, end, clay -> final start, end].
const KEYS = { pin: [0.2, 0.38, 0.5, 0.78], view: [0.24, 0.38, 0.44, 0.62] }

const valuesFor = (p, keys) => {
  const mv = smoothstep(keys[0], keys[1], p) // 0 = sketch only, 1 = model visible
  const t = smoothstep(keys[2], keys[3], p) // 0 = clay, 1 = finished stone
  return { mv, t, stage: mv < 0.5 ? 'idea' : t < 0.5 ? 'clay' : 'final' }
}
const PRESET = { idea: { mv: 0, t: 0 }, clay: { mv: 1, t: 0 }, final: { mv: 1, t: 1 } }

// Idea -> clay -> final. On wide screens with motion allowed the section is pinned and
// scrolling runs the progression: a wireframe "idea" gives way to the sculpt in matte
// clay, which turns on its turntable and hardens into the finished stone look. On narrow
// screens the same progression is driven by the section passing through the viewport.
// Under reduced motion the three stage buttons switch the view directly.
export default function Custom() {
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const wide = useMedia('(min-width: 900px)')
  const pinned = wide && !reduced
  const viewer = useRef(null)
  const lastP = useRef(0)
  const last = useRef(reduced ? PRESET.final : PRESET.idea)
  const manual = useRef(false)
  const [stage, setStage] = useState(reduced ? 'final' : 'idea')

  const paint = (el, { mv, t }) => {
    last.current = { mv, t }
    const v = viewer.current
    if (v?.loaded) setLook(v, mixLook(CLAY_LOOK, MODEL_LOOK, t))
    el?.style.setProperty('--mv', mv.toFixed(3))
    el?.style.setProperty('--t', t.toFixed(3))
    el?.style.setProperty('--sp', ((mv + t) / 2).toFixed(3))
  }

  const ref = useScrollProgress(pinned ? 'pin' : 'view', (p, el) => {
    if (manual.current) return
    const next = valuesFor(p, pinned ? KEYS.pin : KEYS.view)
    paint(el, next)
    orbitBy(viewer.current, (p - lastP.current) * (pinned ? 240 : 120))
    lastP.current = p
    if (el.dataset.stage !== next.stage) {
      el.dataset.stage = next.stage
      setStage(next.stage)
    }
  })

  const onViewer = (el) => {
    viewer.current = el
    if (!el) return
    // If the user scrolled past before the model finished loading, catch up.
    el.addEventListener('load', () => paint(ref.current, last.current), { once: true })
  }

  const choose = (key) => {
    if (pinned) {
      // Scroll the pinned section to the matching point of its travel; scroll drives the rest.
      const el = ref.current
      const travel = el.offsetHeight - window.innerHeight
      const top = el.getBoundingClientRect().top + window.scrollY
      const at = { idea: 0.06, clay: 0.44, final: 0.92 }[key]
      window.scrollTo({ top: top + travel * at, behavior: 'smooth' })
      return
    }
    manual.current = true
    paint(ref.current, PRESET[key])
    setStage(key)
  }

  const initial = reduced ? PRESET.final : PRESET.idea

  return (
    <section
      ref={ref}
      className={`custom ${pinned ? 'is-pinned' : ''}`}
      data-stage={stage}
      style={{ '--mv': initial.mv, '--t': initial.t, '--sp': (initial.mv + initial.t) / 2 }}
      aria-labelledby="custom-title"
    >
      <div className="custom-sticky">
        <div className="container custom-grid">
          <div className="custom-copy">
            <p className="eyebrow">Custom commissions</p>
            <h2 id="custom-title" className="h2">Your idea, sculpted in 3D.</h2>
            <p className="muted para">
              Send a photo, sketch or reference image of what you have in mind, or simply describe it.
              We turn it into a detailed 3D model, ready to print or present.
            </p>
            <ol className="stages" aria-label="From idea to finished model">
              {STAGES.map(([key, num, label, caption]) => (
                <li key={key}>
                  <button
                    type="button"
                    className={`stage stage-${key}`}
                    aria-pressed={stage === key}
                    onClick={() => choose(key)}
                  >
                    <span className="stage-num" aria-hidden="true">{num}</span>
                    <span className="stage-body">
                      <span className="stage-label">{label}</span>
                      <span className="stage-caption">{caption}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="custom-stage">
            <div className="stage-glow stage-glow-custom" aria-hidden="true" />
            <div className="custom-sketch" aria-hidden="true">
              <Wireframe seed={2} />
            </div>
            <ModelViewer
              className="viewer-custom"
              src={MODEL_URL}
              alt="The same sculpt shown as a clay preview and as the finished model. Drag to rotate."
              look={reduced ? MODEL_LOOK : CLAY_LOOK}
              autoRotate={reduced}
              interactionPrompt="none"
              onViewer={onViewer}
            />
            <div className="stage-scrub" aria-hidden="true">
              <span>Idea</span>
              <span className="scrub-track"><span className="scrub-fill" /></span>
              <span>Final</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
