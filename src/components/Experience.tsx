import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { reducedMotion } from '../lib/motion'
import { experience as x } from '../data/experience'

export default function Experience() {
  const root = useRef<HTMLElement>(null)
  const from = useRef<HTMLSpanElement>(null)
  const to = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      // Big metric: 45 counts up, the arrow draws, then the value drops to < 5.
      ScrollTrigger.create({
        trigger: '.metric', start: 'top 75%', once: true,
        onEnter: () => {
          const a = { v: 0 }, b = { v: x.metric.from }
          if (from.current) from.current.textContent = '0'
          if (to.current) to.current.textContent = String(x.metric.from)
          gsap.timeline()
            .to(a, { v: x.metric.from, duration: 1.1, ease: 'power2.out', onUpdate: () => { if (from.current) from.current.textContent = String(Math.round(a.v)) } })
            .fromTo('.metric-arrow i', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, '-=0.2')
            .to(b, { v: x.metric.to, duration: 1.3, ease: 'power3.inOut', onUpdate: () => { if (to.current) to.current.textContent = String(Math.round(b.v)) },
              onComplete: () => { if (to.current) to.current.textContent = `< ${x.metric.to}` } }, '-=0.1')
        },
      })
      gsap.fromTo('.exp-rail i', { scaleY: 0 }, { scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.exp-body', start: 'top 70%', end: 'bottom 60%', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={root} className="section experience" aria-labelledby="exp-title">
      <div className="wrap">
        <h2 id="exp-title" className="h2" data-reveal>Experience</h2>

        <div className="metric" data-reveal>
          <div className="metric-row" role="img" aria-label={`${x.metric.label}: from ${x.metric.from} minutes to under ${x.metric.to} minutes`}>
            <div><span ref={from} className="metric-num">{x.metric.from}</span><span className="metric-unit">MIN</span></div>
            <div className="metric-arrow" aria-hidden="true"><i /></div>
            <div><span ref={to} className="metric-num metric-num-accent">&lt; {x.metric.to}</span><span className="metric-unit">MIN</span></div>
          </div>
          <p className="metric-label">{x.metric.label}</p>
          <p className="muted metric-desc">{x.metric.description}</p>
        </div>

        <div className="exp-body">
          <div className="exp-rail" aria-hidden="true"><i /></div>
          <div className="exp-main">
            <h3 className="h3" data-reveal>{x.role}</h3>
            <dl className="facts" data-reveal>
              <div><dt>Company</dt><dd>{x.company}</dd></div>
              <div><dt>Location</dt><dd>{x.location}</dd></div>
              <div><dt>Duration</dt><dd>{x.duration}</dd></div>
              <div><dt>Division</dt><dd>{x.division}</dd></div>
            </dl>
            <div className="exp-cols">
              <div data-reveal>
                <h4 className="h4">Responsibilities</h4>
                <ul className="resp">{x.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
              <div data-reveal>
                <h4 className="h4">Technologies</h4>
                <ul className="tags">{x.technologies.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
