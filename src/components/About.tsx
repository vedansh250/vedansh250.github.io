import { useRef, useState } from 'react'
import { useLitSequence } from '../lib/motion'

const concepts = [
  { id: 'cloud', label: 'CLOUD', x: 110, y: 70, desc: 'AWS compute, networking, databases and access control.' },
  { id: 'infra', label: 'INFRASTRUCTURE', x: 300, y: 180, desc: 'Defined as code with Terraform, so environments can be reviewed and recreated.' },
  { id: 'auto', label: 'AUTOMATION', x: 490, y: 70, desc: 'Scripts and workflows that replace repeated manual steps.' },
  { id: 'cicd', label: 'CI/CD', x: 490, y: 290, desc: 'Jenkins and GitHub Actions pipelines from commit to deployment.' },
  { id: 'containers', label: 'CONTAINERS', x: 300, y: 340, desc: 'Docker images deployed and orchestrated with Kubernetes.' },
  { id: 'mon', label: 'MONITORING', x: 110, y: 290, desc: 'Prometheus, Grafana and CloudWatch for metrics, logs and alerts.' },
]
const lines: [string, string][] = [
  ['cloud', 'infra'], ['infra', 'auto'], ['auto', 'cicd'], ['cicd', 'containers'],
  ['containers', 'mon'], ['mon', 'cloud'], ['infra', 'containers'], ['infra', 'cicd'], ['infra', 'mon'],
]

export default function About() {
  const [active, setActive] = useState<string>('cloud')
  const box = useRef<HTMLDivElement>(null)
  useLitSequence(box, 0.12)
  const by = Object.fromEntries(concepts.map((c) => [c.id, c]))
  const on = by[active]

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <div>
          <h2 id="about-title" className="h2" data-reveal>
            ABOUT ME
          </h2>
          <h3 id="about-title" className="h4" data-reveal>
            BUILDING THE SYSTEMS BEHIND THE SOFTWARE.        
          </h3>
          <p className="lead" data-reveal>
            Aspiring DevOps and Cloud Engineer with internship experience in cloud infrastructure automation, CI/CD 
            pipeline implementation, containerization, and Kubernetes orchestration. Hands-on experience with AWS 
            services including EC2, S3, VPC, IAM, RDS, EKS, and CloudWatch, along with Terraform, Docker, Kubernetes, 
            Jenkins, GitHub Actions, Linux, Python, Prometheus, and Grafana. Experienced in building scalable, secure, 
            and automated cloud-native solutions and passionate about infrastructure automation, DevOps best 
            practices, and continuous learning in modern cloud technologies.           
          </p>
        </div>
        <div ref={box} className="profile" data-reveal>
          <svg viewBox="0 0 600 420" role="group" aria-label="Technical profile diagram">
            {lines.map(([a, b], i) => {
              const hot = a === active || b === active
              return (
                <line key={i} x1={by[a].x} y1={by[a].y} x2={by[b].x} y2={by[b].y}
                  className={`p-line${hot ? ' is-hot' : ''}`} />
              )
            })}
            {concepts.map((c) => (
              <g key={c.id} data-step className={`p-node${active === c.id ? ' is-active' : ''}`}
                transform={`translate(${c.x} ${c.y})`} tabIndex={0} role="button" aria-pressed={active === c.id}
                aria-label={`${c.label}: ${c.desc}`}
                onMouseEnter={() => setActive(c.id)} onFocus={() => setActive(c.id)} onClick={() => setActive(c.id)}>
                <circle r="6" />
                <circle r="16" className="ring" />
                <text y={c.y > 200 ? 34 : -24} textAnchor="middle">{c.label}</text>
              </g>
            ))}
          </svg>
          <p className="profile-desc" aria-live="polite"><strong>{on.label}</strong> {on.desc}</p>
        </div>
      </div>
    </section>
  )
}
