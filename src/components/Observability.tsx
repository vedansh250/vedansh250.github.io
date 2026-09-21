import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { reducedMotion } from '../lib/motion'

// Deterministic pseudo-data so the shapes are stable between renders.
const series = (seed: number, n = 40) =>
  Array.from({ length: n }, (_, i) => 50 + Math.sin(i * 0.5 + seed) * 16 + Math.sin(i * 1.3 + seed * 2) * 8)
const path = (v: number[], w = 300, h = 100) =>
  v.map((y, i) => `${i ? 'L' : 'M'}${(i / (v.length - 1)) * w} ${h - (y / 100) * h}`).join(' ')

const logs = [
  'INFO  request handled  status=200',
  'INFO  health check passed',
  'WARN  latency above threshold',
  'INFO  autoscaling evaluated',
  'INFO  request handled  status=200',
  'ERROR upstream timeout retried',
]

function Flow({ items }: { items: string[] }) {
  return (
    <div className="obs-flow" aria-label={items.join(' to ')}>
      {items.map((s, i) => (<span key={s}>{s}{i < items.length - 1 && <em aria-hidden="true">→</em>}</span>))}
    </div>
  )
}

export default function Observability() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reducedMotion() || !root.current) return
    const ctx = gsap.context(() => {
      root.current!.querySelectorAll<SVGPathElement>('.spark').forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(p, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.out',
          scrollTrigger: { trigger: p, start: 'top 85%', once: true } })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="observability" ref={root} className="section observe" aria-labelledby="obs-title">
      <div className="wrap">
        <h2 id="obs-title" className="h1" data-reveal>Observe everything</h2>
        <p className="lead" data-reveal>
          Production needs visibility. Metrics, logs, and alerts come together in one conceptual observability dashboard. The charts are illustrative, not live data.
        </p>

        <div className="obs-grid">
          <div className="panel" data-reveal>
            <Flow items={['Prometheus', 'Metrics', 'Grafana']} />
            <div className="charts">
              <figure>
                <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true"><path className="spark" d={path(series(1))} /><path className="spark faint" d={path(series(3))} /></svg>
                <figcaption>Request rate</figcaption>
              </figure>
              <figure>
                <div className="bars" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ height: `${35 + ((i * 37) % 55)}%`, animationDelay: `${i * 0.13}s` }} />)}</div>
                <figcaption>CPU by pod</figcaption>
              </figure>
              <figure>
                <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true"><path className="spark" d={path(series(5).map((v) => v * 0.8))} /></svg>
                <figcaption>Memory</figcaption>
              </figure>
            </div>
          </div>

          <div className="panel" data-reveal>
            <Flow items={['AWS CloudWatch', 'Logs', 'Alerts']} />
            <div className="logs" aria-hidden="true">
              {logs.map((l, i) => (
                <div key={i} className={l.startsWith('WARN') ? 'warn' : l.startsWith('ERROR') ? 'err' : ''} style={{ animationDelay: `${i * 0.9}s` }}>{l}</div>
              ))}
            </div>
            <div className="alert-row">
              <span className="alert-chip"><i aria-hidden="true" />Alarm: OK</span>
              <span className="muted">Illustrative state</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
