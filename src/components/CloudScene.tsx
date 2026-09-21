import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { heroEdges, heroNodes } from '../scenes/graph'
import { heavyMotionOff, useInView, useMediaQuery, webglAvailable } from '../lib/motion'

const InfrastructureScene = lazy(() => import('../scenes/InfrastructureScene'))

/** 2D fallback used when WebGL is unavailable or fails: same graph, SVG + CSS animation. */
export function FallbackViz() {
  const map = Object.fromEntries(heroNodes.map((n) => [n.id, n]))
  const X = (x: number) => 500 + x * 62
  const Y = (y: number) => 260 - y * 70
  return (
    <svg className="fallback-viz" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {heroEdges.map(([a, b], i) => {
        const A = map[a].pos, B = map[b].pos
        const d = `M${X(A[0])} ${Y(A[1])} Q${(X(A[0]) + X(B[0])) / 2} ${(Y(A[1]) + Y(B[1])) / 2 - 30} ${X(B[0])} ${Y(B[1])}`
        return (
          <g key={i}>
            <path d={d} className="fb-line" />
            <circle r="3.5" className="fb-packet">
              <animateMotion dur={`${5 + (i % 3)}s`} repeatCount="indefinite" path={d} begin={`${i * 0.4}s`} />
            </circle>
          </g>
        )
      })}
      {heroNodes.map((n) => (
        <g key={n.id} transform={`translate(${X(n.pos[0])} ${Y(n.pos[1])})`}>
          <rect x="-7" y="-7" width="14" height="14" className="fb-node" transform="rotate(45)" />
          <text y="30" textAnchor="middle" className="fb-label">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <FallbackViz /> : this.props.children }
}

export default function CloudScene() {
  const wrap = useRef<HTMLDivElement>(null)
  const inView = useInView(wrap)
  const [hold, setHold] = useState(false) // pause while the 3D explorer overlay is open
  useEffect(() => {
    const on = (e: Event) => setHold((e as CustomEvent<boolean>).detail)
    window.addEventListener('explorer', on)
    return () => window.removeEventListener('explorer', on)
  }, [])
  const compact = useMediaQuery('(max-width: 820px)')
  const gl = typeof window !== 'undefined' && webglAvailable()

  return (
    <div ref={wrap} className="cloud-scene">
      {hold ? null : gl ? (
        <Boundary>
          <Suspense fallback={null}>
            <InfrastructureScene compact={compact} still={heavyMotionOff()} paused={!inView} />
          </Suspense>
        </Boundary>
      ) : (
        <FallbackViz />
      )}
    </div>
  )
}
