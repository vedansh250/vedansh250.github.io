import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from '../lib/motion'

type Line = { kind: 'cmd' | 'out'; text: string }

const commands: Record<string, string[]> = {
  whoami: ['vedansh250'],
  focus: ['cloud + devops + sre'],
  'kubectl get pods': [
    'NAME                        STATUS    READY',
    'auth-service-6d9f7c        Running   1/1',
    'booking-service-5b8c4d     Running   1/1',
    'payment-service-7c6d9f     Running   1/1',
    'notification-svc-4f7b2a    Running   1/1',
  ],
  'terraform plan': ['Infrastructure changes reviewed.'],
  'docker ps': ['Containers running.'],
  'git status': ['working tree clean'],
}
const demo = Object.keys(commands)

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([])
  const [typing, setTyping] = useState('')
  const [input, setInput] = useState('')
  const [autoDone, setAutoDone] = useState(false)
  const body = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const cancelled = useRef(false)

  const run = (cmd: string) => {
    const c = cmd.trim()
    if (!c) return
    if (c === 'clear') return setLines([])
    const out = c === 'help' ? ['available: ' + demo.join(' · ') + ' · clear'] : commands[c] ?? [`command not found: ${c}`]
    setLines((l) => [...l, { kind: 'cmd', text: c }, ...out.map((t) => ({ kind: 'out' as const, text: t }))])
  }

  // Auto-play the demo once, when the terminal scrolls into view.
  useEffect(() => {
    const el = root.current
    if (!el) return
    cancelled.current = false
    const play = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
      for (const cmd of demo) {
        if (cancelled.current) return
        for (let i = 1; i <= cmd.length; i++) {
          if (cancelled.current) return
          setTyping(cmd.slice(0, i)); await wait(38)
        }
        await wait(160)
        setTyping('')
        run(cmd)
        await wait(420)
      }
      setAutoDone(true)
    }
    if (reducedMotion()) {
      setLines(demo.flatMap((c) => [{ kind: 'cmd' as const, text: c }, ...commands[c].map((t) => ({ kind: 'out' as const, text: t }))]))
      setAutoDone(true)
      return
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); play() } }, { threshold: 0.35 })
    io.observe(el)
    return () => { cancelled.current = true; io.disconnect() }
  }, [])

  useEffect(() => { if (body.current) body.current.scrollTop = body.current.scrollHeight }, [lines, typing])

  return (
    <section id="terminal" className="section terminal-section" aria-labelledby="term-title">
      <div className="wrap term-grid">
        <div>
          <h2 id="term-title" className="h3" data-reveal>Where I feel at home</h2>
          <p className="muted" data-reveal>
            A simulated terminal. The output is illustrative and is not connected to live infrastructure. Try a command below.
          </p>
          <div className="chips" data-reveal>
            {demo.map((c) => (
              <button key={c} className="chip-btn" disabled={!autoDone} onClick={() => run(c)}>{c}</button>
            ))}
          </div>
        </div>
        <div ref={root} className="term" data-reveal>
          <div className="term-head">
            <span className="dots" aria-hidden="true"><i /><i /><i /></span>
            <span>VEDANSH@CLOUD:~</span>
            <span className="term-tag">simulated</span>
          </div>
          <div ref={body} className="term-body" role="log" aria-live="off" tabIndex={0} aria-label="Terminal output">
            {lines.map((l, i) => (
              <div key={i} className={l.kind === 'cmd' ? 'l-cmd' : 'l-out'}>
                {l.kind === 'cmd' && <span className="prompt">$ </span>}{l.text}
              </div>
            ))}
            {!autoDone ? (
              <div className="l-cmd"><span className="prompt">$ </span>{typing}<span className="caret" /></div>
            ) : (
              <label className="l-cmd term-input">
                <span className="prompt">$ </span>
                <input
                  value={input} spellCheck={false} autoComplete="off" aria-label="Type a command, for example help"
                  placeholder="type help"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { run(input); setInput('') } }}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
