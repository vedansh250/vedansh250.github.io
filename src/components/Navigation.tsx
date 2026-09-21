import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { scrollToId } from '../lib/scroll'

const items = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'contact', label: 'CONTACT' },
]

// sections without their own nav entry highlight the closest one
const alias: Record<string, string> = { terminal: 'about', architecture: 'skills', observability: 'projects', resume: 'contact' }

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('home')
  const btn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(alias[e.target.id] ?? e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ;[...items.map((i) => i.id), ...Object.keys(alias)].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [open])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    window.setTimeout(() => scrollToId(id), open ? 200 : 0)
  }

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#home" className="brand" onClick={go('home')} aria-label="Vedansh250 — back to top">VEDANSH</a>
        <nav aria-label="Primary" className="nav-links">
          {items.map((i) => (
            <a key={i.id} href={`#${i.id}`} onClick={go(i.id)} aria-current={current === i.id ? 'true' : undefined}>
              {i.label}
            </a>
          ))}
        </nav>
        <span className="status" aria-label="Open to work"><i aria-hidden="true" />OPEN TO WORK</span>
        <button
          ref={btn}
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {items.map((i) => (
            <a key={i.id} href={`#${i.id}`} onClick={go(i.id)} tabIndex={open ? 0 : -1}>{i.label}</a>
          ))}
        </nav>
        <span className="status"><i aria-hidden="true" />OPEN TO WORK</span>
      </div>
    </header>
  )
}
