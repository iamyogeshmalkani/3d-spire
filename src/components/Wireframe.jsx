// A revolved wireframe silhouette (lathe rings + meridians) used as the "coming soon"
// visual for collection slots. Pure SVG, drawn in code; the dashes slowly trace under
// motion so the slot reads as a model being sculpted rather than an empty box.
const PROFILE = [
  [34, 18], [48, 24], [64, 21], [78, 10], [92, 38], [110, 46], [132, 42],
  [158, 32], [184, 38], [208, 34], [232, 52], [246, 58],
]
const CX = 100
const SQUASH = 0.3

const side = (sign) =>
  PROFILE.map(([y, rx], i) => `${i ? 'L' : 'M'}${CX + sign * rx} ${y}`).join(' ')

export default function Wireframe({ seed = 0 }) {
  return (
    <svg
      className="wire"
      viewBox="0 0 200 280"
      aria-hidden="true"
      focusable="false"
      style={{ '--seed': seed }}
    >
      {PROFILE.map(([y, rx], i) => (
        <ellipse key={y} cx={CX} cy={y} rx={rx} ry={rx * SQUASH} className="wire-ring" style={{ '--i': i }} />
      ))}
      <path d={side(-1)} className="wire-line" />
      <path d={side(1)} className="wire-line" />
      <line x1={CX} y1={PROFILE[0][0] - PROFILE[0][1] * SQUASH} x2={CX} y2={PROFILE.at(-1)[0] + 20} className="wire-axis" />
      <ellipse cx={CX} cy={262} rx={70} ry={10} className="wire-base" />
    </svg>
  )
}
