import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap'
import { heavyMotionOff, reducedMotion, restoreY } from './lib/motion'
import { setLenis } from './lib/scroll'
import Loader from './components/Loader'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Terminal from './components/Terminal'
import Experience from './components/Experience'
import TechStack from './components/TechStack'
import Architecture from './components/Architecture'
import Projects from './components/Projects'
import Observability from './components/Observability'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Certifications from './components/Certifications'

export default function App() {
  const skipIntro = restoreY !== null
  const [ready, setReady] = useState(skipIntro)
  const [loading, setLoading] = useState(!skipIntro)
  const onReveal = useCallback(() => setReady(true), [])
  const onDone = useCallback(() => setLoading(false), [])

  // Smooth scroll (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (heavyMotionOff()) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); setLenis(null) }
  }, [])

  useEffect(() => {
    const y = restoreY
    if (y === null) return
    const t = window.setTimeout(() => { window.scrollTo(0, y)
      // everything at or above the restored position was already seen – show it right away
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) gsap.set(el, { opacity: 1, y: 0 })
      })
      ScrollTrigger.refresh() }, 250)
    return () => window.clearTimeout(t)
  }, [])

  // One shared reveal for headings / blocks marked with data-reveal.
  useEffect(() => {
    if (reducedMotion()) return
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%', once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out', overwrite: true }),
    })
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      {loading && <Loader onReveal={onReveal} onDone={onDone} />}
      <a className="skip" href="#about">Skip to content</a>
      <Navigation />
      <main>
        <Hero ready={ready} />
        <About />
        <Terminal />
        <Experience />
        <TechStack />
        <Architecture />
        <Projects />
        <Certifications />
        <Observability />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
