import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { reducedMotion } from '../lib/motion'

export default function Loader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let revealed = false
    const reveal = () => { if (!revealed) { revealed = true; onReveal() } }
    if (reducedMotion()) {
      reveal(); onDone()
      return
    }
    const safety = window.setTimeout(() => { reveal(); onDone() }, 6000)
    const ctx = gsap.context(() => {
      // ~2.8s total so the intro is clearly readable on every device.
      gsap.timeline({ onComplete: onDone })
        .from('.loader-brand', { opacity: 0, letterSpacing: '0.7em', duration: 0.8, ease: 'power2.out' })
        .from('.loader-words span', { opacity: 0, y: 12, duration: 0.45, stagger: 0.32, ease: 'power2.out' }, '-=0.15')
        .to({}, { duration: 0.5 })
        .add(reveal)
        .to(root.current, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, '<')
    }, root)
    return () => { window.clearTimeout(safety); ctx.revert() }
  }, [onReveal, onDone])

  return (
    <div ref={root} className="loader" role="status" aria-label="Loading">
      <div className="loader-brand">VEDANSH</div>
      <div className="loader-words" aria-hidden="true">
        <span>CLOUD</span><span>DEVOPS</span><span>SRE</span>
      </div>
    </div>
  )
}
