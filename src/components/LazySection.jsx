import { Suspense } from 'react'
import { useInView } from '../hooks.js'

// Renders a section only when it is about to scroll into view. The wrapper keeps the
// section's anchor id and a minimum height so in-page links and the scrollbar behave.
export default function LazySection({ id, minHeight = 480, children }) {
  const [ref, inView] = useInView('600px')
  return (
    <div id={id} ref={ref} style={inView ? undefined : { minHeight }}>
      {inView && <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense>}
    </div>
  )
}
