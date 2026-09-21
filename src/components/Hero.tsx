import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { heavyMotionOff, reducedMotion } from '../lib/motion'
import { scrollToId } from '../lib/scroll'
import { sceneState } from '../lib/sceneState'
import { has, links } from '../data/links'
import CloudScene from './CloudScene'

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const canvasWrap = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  // Pointer → camera response (very small on purpose).
  useEffect(() => {
    if (heavyMotionOff()) return
    const move = (e: PointerEvent) => {
      sceneState.px = (e.clientX / window.innerWidth - 0.5) * 2
      sceneState.py = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  // Scroll transition: text drifts and fades, the scene pulls back and dissolves.
  useEffect(() => {
    if (reducedMotion()) { sceneState.reveal = 1; return }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6,
        onUpdate: (s) => { sceneState.progress = s.progress },
      })
      gsap.to('.hero-copy', { yPercent: -14, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '70% top', scrub: true } })
      gsap.to(canvasWrap.current, { opacity: 0, ease: 'none',
        scrollTrigger: { trigger: root.current, start: '30% top', end: 'bottom top', scrub: true } })
    }, root)
    return () => { ctx.revert(); sceneState.progress = 0 }
  }, [])

  // Intro sequence – runs once, when the loader hands over.
  useEffect(() => {
    if (!ready || started.current) return
    started.current = true
    if (reducedMotion()) { sceneState.reveal = 1; return }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to('.hero-bg', { opacity: 1, duration: 1.2 }, 0)
        .to(sceneState, { reveal: 1, duration: 2.6, ease: 'power2.inOut' }, 0.15)
        .fromTo('.hero-title .mask > span', { yPercent: 105, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, stagger: 0.12 }, 0.5)
        .to('.hero-roles, .hero-lede', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.95)
        .to('.hero-actions, .hero-meta', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.3)
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section id="home" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" />
      <div ref={canvasWrap} className="hero-canvas"><CloudScene /></div>
      <div className="hero-copy">
        <h2 id="hero-title" className="hero-title">
          <span className="mask"><span>VEDANSH</span></span>
          <span className="mask"><span>PAUNIKAR</span></span>
        </h2>
        <p className="hero-roles">Cloud Engineer<br />DevOps Engineer<br />SRE</p>
        <p className="hero-lede">
          I build, automate, and improve cloud infrastructure with AWS, containers, Kubernetes, and modern CI/CD practices.        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projects" onClick={(e) => { e.preventDefault(); scrollToId('projects') }}>VIEW MY WORK</a>
          {has(links.resume) && (
            <a className="btn btn-ghost" href={links.resume} download>DOWNLOAD RESUME</a>
          )}
        </div>
        <ul className="hero-meta" aria-label="Core technologies">
          {['AWS', 'KUBERNETES', 'TERRAFORM', 'DOCKER', 'CI/CD'].map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
    </section>
  )
}
