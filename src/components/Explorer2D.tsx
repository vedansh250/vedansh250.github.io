import { useState } from 'react'
import { infraInfo } from '../scenes/infraInfo'

type N = { id: string; label: string; x: number; y: number; w: number; h: number }
const nodes: N[] = [
  { id: 'alb', label: 'ALB', x: 95, y: 250, w: 120, h: 46 },
  { id: 'ec2', label: 'EC2', x: 330, y: 190, w: 120, h: 46 },
  { id: 'eks', label: 'EKS', x: 330, y: 320, w: 120, h: 46 },
  { id: 'pods', label: 'PODS', x: 500, y: 320, w: 90, h: 46 },
  { id: 'rds', label: 'RDS', x: 500, y: 190, w: 120, h: 46 },
  { id: 'monitor', label: 'MONITORING', x: 720, y: 255, w: 150, h: 46 },
]
const links: [string, string][] = [['alb', 'ec2'], ['alb', 'eks'], ['ec2', 'rds'], ['eks', 'pods'], ['ec2', 'monitor'], ['eks', 'monitor'], ['rds', 'monitor']]
const by = Object.fromEntries(nodes.map((n) => [n.id, n]))
const c = (n: N) => [n.x + n.w / 2, n.y + n.h / 2] as const

export default function Explorer2D({ onSelect }: { onSelect: (id: string | null) => void }) {
  const [act, setAct] = useState<string | null>(null)
  const set = (id: string | null) => { setAct(id); onSelect(id) }
  const zone = (id: string, x: number, y: number, w: number, h: number, label: string) => (
    <g onMouseEnter={() => set(id)} onMouseLeave={() => set(null)} onFocus={() => set(id)} onBlur={() => set(null)} tabIndex={0} aria-label={infraInfo[id]}>
      <rect className={`x2-zone${act === id ? ' is-active' : ''}`} x={x} y={y} width={w} height={h} rx="8" />
      <text className="x2-zlabel" x={x + 12} y={y + 20}>{label}</text>
    </g>
  )
  return (
    <svg className="explorer-2d" viewBox="0 0 940 460" role="group" aria-label="Infrastructure diagram (2D)">
      {zone('vpc', 40, 60, 640, 370, 'VPC')}
      {zone('public', 70, 130, 170, 250, 'PUBLIC SUBNET')}
      {zone('private', 280, 130, 380, 270, 'PRIVATE SUBNET')}
      {links.map(([a, b], i) => {
        const [x1, y1] = c(by[a]); const [x2, y2] = c(by[b])
        const d = `M${x1} ${y1} L${x2} ${y2}`
        const hot = act === a || act === b
        return (
          <g key={i}>
            <path d={d} className={`x2-line${hot ? ' is-hot' : ''}`} />
            <circle r="3.5" className="fb-packet"><animateMotion dur={`${3 + (i % 3)}s`} repeatCount="indefinite" path={d} /></circle>
          </g>
        )
      })}
      {nodes.map((n) => (
        <g key={n.id} tabIndex={0} role="button" aria-label={infraInfo[n.id]} className={`x2-node${act === n.id ? ' is-active' : ''}`}
          onMouseEnter={() => set(n.id)} onMouseLeave={() => set(null)} onFocus={() => set(n.id)} onBlur={() => set(null)} onClick={() => set(n.id)}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="3" />
          <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 4} textAnchor="middle">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}
