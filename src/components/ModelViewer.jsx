import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks.js'
import { ENVIRONMENT_URL, MODEL_LOOK } from '../config.js'
import { lerp } from '../motion.js'
import Wireframe from './Wireframe.jsx'

let viewerLoad
// Loads the <model-viewer> web component (and three.js) as a separate chunk, only once.
const loadViewer = () => (viewerLoad ??= import('@google/model-viewer'))

// Re-skin the model (the .glb ships with one plain light-grey material). Safe to call at
// any time: before the model has loaded it is applied on the `load` event.
export function setLook(viewer, look = MODEL_LOOK) {
  const apply = () => {
    for (const material of viewer.model?.materials ?? []) {
      const pbr = material.pbrMetallicRoughness
      pbr.setBaseColorFactor(look.baseColor)
      pbr.setRoughnessFactor(look.roughness)
      pbr.setMetallicFactor(look.metalness)
    }
  }
  if (viewer.loaded) apply()
  else viewer.addEventListener('load', apply, { once: true })
}

export const mixLook = (a, b, t) => ({
  baseColor: a.baseColor.map((v, i) => lerp(v, b.baseColor[i], t)),
  roughness: lerp(a.roughness, b.roughness, t),
  metalness: lerp(a.metalness, b.metalness, t),
})

// Turn the camera around the model by `deg`, keeping the user's current tilt and zoom.
export function orbitBy(viewer, deg) {
  if (!viewer?.loaded || !deg) return
  const o = viewer.getCameraOrbit()
  viewer.cameraOrbit = `${((o.theta * 180) / Math.PI + deg).toFixed(2)}deg ${o.phi.toFixed(4)}rad ${o.radius.toFixed(4)}m`
}

// Absolute yaw for scroll-scrubbed turns (one full rotation = thetaDeg 0 → 360).
export function orbitTo(viewer, thetaDeg) {
  if (!viewer?.loaded) return
  const o = viewer.getCameraOrbit()
  viewer.cameraOrbit = `${thetaDeg.toFixed(2)}deg ${o.phi.toFixed(4)}rad ${o.radius.toFixed(4)}m`
}

// Lazy 3D viewer: the library and the .glb are only fetched when the viewer is near the
// viewport (or immediately when `eager` is set for above-the-fold use).
export default function ModelViewer({
  src,
  alt,
  eager = false,
  className = '',
  look = MODEL_LOOK,
  autoRotate = true,
  interactionPrompt = 'auto',
  // 0 = snap camera orbit to scroll (no easing lag). Leave unset for default feel.
  interpolationDecay,
  // Wireframe silhouette kept on until the .glb paints, so the stage never looks empty.
  placeholder = true,
  onViewer,
  children,
}) {
  const [ref, inView] = useInView('300px')
  const active = eager || inView
  const [loaded, setLoaded] = useState(false)
  const onViewerRef = useRef(onViewer)
  onViewerRef.current = onViewer

  useEffect(() => {
    if (active) loadViewer()
  }, [active])

  const viewerRef = useCallback(
    (el) => {
      if (el) {
        setLook(el, look)
        const mark = () => {
          el.classList.add('is-loaded')
          setLoaded(true)
        }
        if (el.loaded) mark()
        else el.addEventListener('load', mark, { once: true })
      }
      onViewerRef.current?.(el)
    },
    // The look is applied once on mount; live changes go through setLook() via onViewer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const rotate = autoRotate ? { 'auto-rotate': '' } : {}
  const decay =
    interpolationDecay === undefined ? {} : { 'interpolation-decay': String(interpolationDecay) }

  return (
    <div ref={ref} className={`viewer ${className}${loaded ? ' is-ready' : ''}`}>
      {placeholder && (
        <div className="viewer-placeholder" aria-hidden="true">
          <Wireframe seed={eager ? 3 : 4} />
          <span className="viewer-placeholder-label">Loading sculpt…</span>
        </div>
      )}
      {active && (
        <model-viewer
          ref={viewerRef}
          src={src}
          alt={alt}
          loading="eager"
          reveal="auto"
          camera-controls=""
          disable-zoom=""
          {...rotate}
          {...decay}
          auto-rotate-delay="1500"
          rotation-per-second="18deg"
          touch-action="pan-y"
          shadow-intensity="1.2"
          shadow-softness="0.8"
          exposure="1.1"
          tone-mapping="aces"
          environment-image={ENVIRONMENT_URL}
          interaction-prompt={interactionPrompt}
        />
      )}
      {children}
    </div>
  )
}
