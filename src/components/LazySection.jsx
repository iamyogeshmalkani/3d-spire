import { Suspense, useEffect } from 'react'
import { useHasScrolled, useInView } from '../hooks.js'
import { onMountAll, refreshScroll } from '../motion.js'

// Renders a section only when it is about to scroll into view. The wrapper keeps the
// section's anchor id and a minimum height so in-page links and the scrollbar behave.
// Nothing below the fold is fetched until the first scroll; clicking any in-page link
// mounts every lazy section at once, so the page height is settled before the smooth
// scroll lands.
export default function LazySection({ id, minHeight = 480, children }) {
  const armed = useHasScrolled()
  const [ref, inView, setInView] = useInView('600px', armed)

  useEffect(() => onMountAll(() => setInView(true)), [setInView])
  useEffect(() => {
    if (inView) refreshScroll()
  }, [inView])

  return (
    <div id={id} ref={ref} className="lazy" style={inView ? undefined : { minHeight }}>
      {inView && <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense>}
    </div>
  )
}
