import { useLayoutEffect, useRef, useState } from 'react'
import { chains, edges, skills } from '../data/skills'

const groups = ['Cloud', 'DevOps', 'Observability', 'Systems'] as const
type Seg = { x1: number; y1: number; x2: number; y2: number; k: string }

export default function TechStack() {
  const [hover, setHover] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [segs, setSegs] = useState<Seg[]>([])
  const box = useRef<HTMLDivElement>(null)
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const active = hover ?? pinned
  const linked = new Set<string>()
  if (active) edges.forEach(([a, b]) => { if (a === active) linked.add(b); if (b === active) linked.add(a) })
  const current = skills.find((s) => s.id === active)

  useLayoutEffect(() => {
    if (!active || !box.current) return setSegs([])
    const base = box.current.getBoundingClientRect()
    const c = (id: string) => {
      const r = refs.current[id]?.getBoundingClientRect()
      return r ? { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 } : null
    }
    const from = c(active)
    if (!from) return setSegs([])
    setSegs([...linked].flatMap((id) => {
      const t = c(id)
      return t ? [{ x1: from.x, y1: from.y, x2: t.x, y2: t.y, k: id }] : []
    }))
  }, [active])

  return (
    <section id="skills" className="section stack" aria-labelledby="stack-title">
      <div className="wrap">
        <h2 id="stack-title" className="h2" data-reveal>THE STACK BEHIND THE SYSTEMS.</h2>
        <p className="lead" data-reveal>A practical stack spanning cloud infrastructure, automation, container orchestration, and observability.</p>
        <h3 id="about-title" className="h4" data-reveal>
            Hover to explore how the stack connects.        
        </h3>
        <div ref={box} className="eco" data-reveal onMouseLeave={() => setHover(null)}>
          <svg className="eco-lines" aria-hidden="true">
            {segs.map((s) => <line key={s.k} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />)}
          </svg>
          {groups.map((g) => (
            <div key={g} className="eco-col">
              <h3 className="h4">{g}</h3>
              <ul>
                {skills.filter((s) => s.group === g).map((s) => {
                  const state = !active ? '' : s.id === active ? ' is-active' : linked.has(s.id) ? ' is-linked' : ' is-dim'
                  return (
                    <li key={s.id}>
                      <button
                        ref={(el) => { refs.current[s.id] = el }}
                        className={`node${state}`}
                        aria-pressed={pinned === s.id}
                        onMouseEnter={() => setHover(s.id)}
                        onFocus={() => setHover(s.id)}
                        onBlur={() => setHover(null)}
                        onClick={() => setPinned((p) => (p === s.id ? null : s.id))}
                      >{s.name}</button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="eco-desc" aria-live="polite">
          {current ? <><strong>{current.name}</strong> {current.desc}</> : <span className="muted">Select a technology.</span>}
        </p>

        <ul className="chains" data-reveal>
          {chains.map((c) => (
            <li key={c.join()}>
              {c.map((s, i) => (
                <span key={s}>{s}{i < c.length - 1 && <em aria-hidden="true">→</em>}</span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
