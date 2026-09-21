import { useEffect, useLayoutEffect, useRef } from 'react'
import { ExternalLink, Github, Eye } from 'lucide-react'
import { projects, type Project } from '../data/projects'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { reducedMotion, useLitSequence } from '../lib/motion'

function Flow({ flow, label }: { flow: Project['flow']; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useLitSequence(ref, 0.28)
  return (
    <div ref={ref} className="flow" role="group" aria-label={label}>
      {flow.map((stage, i) => (
        <div className="flow-stage" key={i}>
          <div className={`flow-nodes${stage.length > 1 ? ' multi' : ''}`}>
            {stage.map((n) => (
              <div key={n.label} data-step className="fnode" style={stage.length > 1 ? { flexBasis: `calc(${100 / (stage.length === 4 ? 2 : stage.length)}% - 0.4rem)` } : undefined}>
                {n.label}{n.sub && <small>{n.sub}</small>}
              </div>
            ))}
          </div>
          {i < flow.length - 1 && <span data-step className="conn" aria-hidden="true"><b /></span>}
        </div>
      ))}
    </div>
  )
}

export default function Projects() {
  const root = useRef<HTMLElement>(null)

  // Sticky offset per card. A card taller than the screen pins by its *bottom* edge, so it can be read fully
  // before the next card slides over it – this is what makes the stack work on short laptops and phones too.
  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.pcard', root.current)
    const place = () => {
      const top = window.innerWidth <= 960 ? 64 : 84
      cards.forEach((c, i) => {
        const fit = window.innerHeight - c.offsetHeight - 14
        c.style.setProperty('--top', `${Math.min(top + i * 12, fit)}px`)
      })
      ScrollTrigger.refresh()
    }
    place()
    const ro = new ResizeObserver(place)
    cards.forEach((c) => ro.observe(c))
    window.addEventListener('resize', place)
    return () => { ro.disconnect(); window.removeEventListener('resize', place) }
  }, [])

  // The next card slides up over the current one, which steps back and dims.
  useEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.pcard')
      cards.slice(0, -1).forEach((card, i) => {
        const st = { trigger: cards[i + 1], start: 'top 92%', end: 'top 22%', scrub: true }
        gsap.to(card, { scale: 0.93, ease: 'none', scrollTrigger: st })
        gsap.to(card.querySelector('.pcard-shade'), { opacity: 0.62, ease: 'none', scrollTrigger: st })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={root} className="section projects" aria-labelledby="projects-title">
      <div className="wrap">
        <h2 id="projects-title" className="h2" data-reveal>Projects</h2>
        <p className="lead" data-reveal>Four builds. From Kubernetes microservices to Terraform-managed infrastructure — designed, automated, and shipped for production.</p>

        <div className="pstack">
          {projects.map((p, i) => (
            <article key={p.id} className="pcard" style={{ ['--i' as string]: i }} aria-labelledby={`p-${p.id}`}>
              <div className="pcard-arch">
                <span className="pcard-count" aria-hidden="true">{i + 1} / {projects.length}</span>
                <Flow flow={p.flow} label={`${p.title} architecture`} />
              </div>

              <div className="pcard-info">
                <h3 id={`p-${p.id}`} className="h3">{p.title}</h3>
                <div>
                  <h4 className="h4">Technologies</h4>
                  <ul className="tags">{p.tech.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
                <div>
                  <h4 className="h4">Overview</h4>
                  <ul className="points">{p.points.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
                {(p.view || p.github || p.live) && (
                  <div className="project-links">
                    {p.view && <a className="btn btn-ghost" href={p.view} target="_blank" rel="noopener noreferrer"><Eye size={16} />VIEW PROJECT</a>}
                    {p.github && <a className="btn btn-ghost" href={p.github} target="_blank" rel="noopener noreferrer"><Github size={16} />GITHUB</a>}
                    {p.live && <a className="btn btn-ghost" href={p.live} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} />LIVE DEMO</a>}
                  </div>
                )}
              </div>
              <div className="pcard-shade" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
