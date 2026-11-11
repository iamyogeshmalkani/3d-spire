import { useEffect } from 'react'
import { useInView } from '../hooks.js'

let viewerLoad
// Loads the <model-viewer> web component (and three.js) as a separate chunk, only once.
const loadViewer = () => (viewerLoad ??= import('@google/model-viewer'))

// Lazy 3D viewer: the library and the .glb are only fetched when the viewer is near the
// viewport (or immediately when `eager` is set for above-the-fold use).
export default function ModelViewer({ src, alt, eager = false, className = '', children }) {
  const [ref, inView] = useInView('300px')
  const active = eager || inView

  useEffect(() => {
    if (active) loadViewer()
  }, [active])

  return (
    <div ref={ref} className={`viewer ${className}`}>
      {active && (
        <model-viewer
          src={src}
          alt={alt}
          loading="lazy"
          reveal="auto"
          camera-controls=""
          auto-rotate=""
          auto-rotate-delay="1500"
          rotation-per-second="18deg"
          touch-action="pan-y"
          shadow-intensity="1.1"
          exposure="1.05"
          environment-image="neutral"
          interaction-prompt="auto"
        />
      )}
      {children}
    </div>
  )
}
