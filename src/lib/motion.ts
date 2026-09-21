import { useEffect, useRef, useState, type RefObject } from 'react'
import { gsap, ScrollTrigger } from './gsap'

const KEY = 'motion-off'
/** OS-level "reduce motion" (e.g. Windows: Animation effects off). */
export const osReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
/** Visitor explicitly switched motion off with the footer toggle. */
export const reducedMotion = () => {
  try { return localStorage.getItem(KEY) === '1' } catch { return false }
}
/** Heavy motion (smooth-scroll hijack, cursor parallax, constant spinning) is skipped for OS reduced-motion too. */
export const heavyMotionOff = () => osReducedMotion() || reducedMotion()
/** Applies the change with a quick reload (animations are wired at load) but stays on the same spot. */
export function setMotionOff(off: boolean) {
  try {
    localStorage.setItem(KEY, off ? '1' : '0')
    sessionStorage.setItem('restore-y', String(Math.round(window.scrollY)))
  } catch { /* ignore */ }
  window.location.reload()
}
/** True right after a motion toggle: skip the intro loader and restore the scroll position. */
export const restoreY = (() => {
  try {
    const v = sessionStorage.getItem('restore-y')
    sessionStorage.removeItem('restore-y')
    return v === null ? null : Number(v)
  } catch { return null }
})()

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** Lights up every [data-step] child in DOM order when the block scrolls into view. */
export function useLitSequence(ref: RefObject<HTMLElement>, gap = 0.26) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'))
    if (reducedMotion()) {
      steps.forEach((s) => s.classList.add('lit'))
      root.classList.add('live')
      return
    }
    const calls: gsap.core.Tween[] = []
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        steps.forEach((s, i) => calls.push(gsap.delayedCall(0.1 + i * gap, () => s.classList.add('lit'))))
        calls.push(gsap.delayedCall(0.1 + steps.length * gap, () => root.classList.add('live')))
      },
    })
    return () => {
      st.kill()
      calls.forEach((c) => c.kill())
    }
  }, [ref, gap])
}

/** Returns true once the element is on screen (used to pause WebGL when it is not). */
export function useInView(ref: RefObject<Element>, rootMargin = '100px') {
  const [inView, setInView] = useState(true)
  const first = useRef(true)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([e]) => {
        first.current = false
        setInView(e.isIntersecting)
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}
