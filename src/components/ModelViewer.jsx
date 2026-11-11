import { useCallback, useEffect } from 'react'
import { useInView } from '../hooks.js'
import { ENVIRONMENT_URL, MODEL_LOOK } from '../config.js'

let viewerLoad
// Loads the <model-viewer> web component (and three.js) as a separate chunk, only once.
const loadViewer = () => (viewerLoad ??= import('@google/model-viewer'))

// Lazy 3D viewer: the library and the .glb are only fetched when the viewer is near the
// viewport (or immediately when `eager` is set for above-the-fold use).
// Re-skin the model once it has loaded (the .glb ships with one plain light-grey material).
function applyLook(viewer) {
  const apply = () => {
    for (const material of viewer.model?.materials ?? []) {
      const pbr = material.pbrMetallicRoughness
      pbr.setBaseColorFactor(MODEL_LOOK.baseColor)
      pbr.setRoughnessFactor(MODEL_LOOK.roughness)
      pbr.setMetallicFactor(MODEL_LOOK.metalness)
    }
  }
  if (viewer.loaded) apply()
  else viewer.addEventListener('load', apply, { once: true })
}

export default function ModelViewer({ src, alt, eager = false, className = '', children }) {
  const [ref, inView] = useInView('300px')
  const active = eager || inView

  useEffect(() => {
    if (active) loadViewer()
  }, [active])

  const viewerRef = useCallback((el) => {
    if (el) applyLook(el)
  }, [])

  return (
    <div ref={ref} className={`viewer ${className}`}>
      {active && (
        <model-viewer
          ref={viewerRef}
          src={src}
          alt={alt}
          loading="lazy"
          reveal="auto"
          camera-controls=""
          auto-rotate=""
          auto-rotate-delay="1500"
          rotation-per-second="18deg"
          touch-action="pan-y"
          shadow-intensity="1.2"
          shadow-softness="0.8"
          exposure="1.1"
          tone-mapping="aces"
          environment-image={ENVIRONMENT_URL}
          interaction-prompt="auto"
        />
      )}
      {children}
    </div>
  )
}
