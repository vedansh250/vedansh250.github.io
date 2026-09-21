import { has, links } from '../data/links'
import { reducedMotion, setMotionOff } from '../lib/motion'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <p className="brand">VEDANSH</p>
          <p className="muted">Cloud Engineer · DevOps Engineer · SRE</p>
          <p className="muted">India</p>
        </div>
        <nav aria-label="Footer" className="footer-links">
          {has(links.github) && <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
          {has(links.linkedin) && <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {has(links.resume) && <a href={links.resume} download>Resume</a>}
        </nav>
        <p className="muted copy">
          © 2026 Vedansh Paunikar. All rights reserved.{' '}
          <button className={`motion-btn${reducedMotion() ? '' : ' is-on'}`} role="switch" aria-checked={!reducedMotion()} aria-label="Animations"
            onClick={() => setMotionOff(!reducedMotion())}>
            <span className="knob" aria-hidden="true" />
            {reducedMotion() ? 'MOTION OFF · TURN ON' : 'MOTION ON · TURN OFF'}
          </button>
        </p>
      </div>
    </footer>
  )
}
