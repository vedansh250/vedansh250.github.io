import { lazy, Suspense, useRef, useState } from 'react'
import { pipeline } from '../data/pipeline'
import { useLitSequence } from '../lib/motion'

const ExploreInfra = lazy(() => import('./ExploreInfra'))

export default function Architecture() {
  const [active, setActive] = useState(pipeline[4].id)
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useLitSequence(box, 0.34)
  const cur = pipeline.find((p) => p.id === active)!

  return (
    <section id="architecture" className="section architecture" aria-labelledby="arch-title">
      <div className="wrap">
        <h2 id="arch-title" className="h1" data-reveal>From code to production</h2>
        <p className="lead" data-reveal>
          Explore how code moves from development to production. Hover, focus, or tap a stage to see each step.
        </p>

        <div ref={box} className="pipe" data-reveal>
          {pipeline.map((p, i) => (
            <div className="pipe-item" key={p.id}>
              <button
                data-step
                className={`pipe-node${active === p.id ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(p.id)}
                onFocus={() => setActive(p.id)}
                onClick={() => setActive(p.id)}
                aria-pressed={active === p.id}
              >
                <span className="pipe-dot" aria-hidden="true" />
                {p.name}
              </button>
              {i < pipeline.length - 1 && <span data-step className="conn" aria-hidden="true"><b /></span>}
            </div>
          ))}
        </div>

        <div className="pipe-desc" aria-live="polite">
          <strong>{cur.name}</strong>
          <p>{cur.desc}</p>
        </div>

        <div className="explore-cta" data-reveal>
          <button className="btn btn-ghost" onClick={() => setOpen(true)}>EXPLORE INFRASTRUCTURE</button>
          <span className="muted">Orbit a 3D view of a VPC with subnets, EC2, RDS, ALB, EKS, pods and monitoring.</span>
        </div>
      </div>
      {open && (
        <Suspense fallback={null}>
          <ExploreInfra onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </section>
  )
}
