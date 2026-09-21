import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { useMediaQuery, webglAvailable } from '../lib/motion'
import { infraInfo } from '../scenes/infraInfo'
import Explorer2D from './Explorer2D'

const ExplorerScene = lazy(() => import('../scenes/ExplorerScene'))
const HINT = 'Hover or tap a component to see what it does.'

class Boundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFail() }
  render() { return this.state.failed ? null : this.props.children }
}

/**
 * 3D view with graceful degradation:
 *   attempt 0 → full quality (lite on phones) → if the browser drops the GPU context → lite 3D → 2D diagram.
 * The visitor never lands on a black or blank screen.
 */
export default function ExploreInfra({ onClose }: { onClose: () => void }) {
  const compact = useMediaQuery('(max-width: 820px)')
  const gl = webglAvailable()
  const [attempt, setAttempt] = useState(0)
  const [want2D, setWant2D] = useState(false)
  const info = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const timer = useRef<number>()

  const show2D = want2D || !gl || attempt >= 2
  const lite = compact || attempt >= 1

  const onHover = useCallback((id: string | null) => {
    if (info.current) info.current.textContent = id ? infraInfo[id] : HINT // no React state → no re-render
  }, [])
  const fallback = useCallback(() => setAttempt((a) => a + 1), [])
  const onLost = useCallback(() => {
    if (info.current) info.current.textContent = 'Restoring the 3D view…'
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(fallback, 1500) // no recovery in time → rebuild lighter
  }, [fallback])
  const onRestored = useCallback(() => { window.clearTimeout(timer.current); onHover(null) }, [onHover])

  useEffect(() => {
    close.current?.focus()
    const prev = document.activeElement as HTMLElement | null
    document.documentElement.classList.add('menu-open')
    window.dispatchEvent(new CustomEvent('explorer', { detail: true })) // free the hero's WebGL context
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', key)
    return () => {
      window.clearTimeout(timer.current)
      window.removeEventListener('keydown', key)
      window.dispatchEvent(new CustomEvent('explorer', { detail: false }))
      document.documentElement.classList.remove('menu-open')
      prev?.focus?.()
    }
  }, [onClose])

  return (
    <div className="explorer" role="dialog" aria-modal="true" aria-label="Interactive infrastructure explorer">
      <div className="explorer-bar">
        <span>{show2D ? 'Conceptual reference architecture — 2D view' : 'Conceptual reference architecture — drag to orbit, hover a component'}</span>
        <div className="explorer-actions">
          {gl && <button className="motion-btn" onClick={() => { setWant2D((v) => !v); if (attempt >= 2) setAttempt(0) }}>{show2D ? 'SWITCH TO 3D' : 'SWITCH TO 2D'}</button>}
          <button ref={close} className="icon-btn" onClick={onClose} aria-label="Close infrastructure explorer"><X size={20} /></button>
        </div>
      </div>
      <div className="explorer-canvas">
        {show2D ? (
          <Explorer2D onSelect={onHover} />
        ) : (
          <Boundary key={attempt} onFail={fallback}>
            <Suspense fallback={<p className="explorer-msg">Loading 3D view…</p>}>
              <ExplorerScene onHover={onHover} lite={lite} onLost={onLost} onRestored={onRestored} />
            </Suspense>
          </Boundary>
        )}
      </div>
      <div ref={info} className="explorer-info" aria-live="polite">{HINT}</div>
      <ul className="sr-only">{Object.entries(infraInfo).map(([k, v]) => <li key={k}>{v}</li>)}</ul>
    </div>
  )
}
