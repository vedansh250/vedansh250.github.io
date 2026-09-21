import { Award, BarChart3, Cloud, ExternalLink, GitBranch, Terminal, type LucideIcon } from 'lucide-react'
import { certifications, type Certification } from '../data/certifications'

const icons: Record<Certification['icon'], LucideIcon> = {
  cloud: Cloud,
  devops: GitBranch,
  python: Terminal,
  data: BarChart3,
}

export default function Certifications() {
  return (
    <section id="certifications" className="section certs" aria-labelledby="certs-title">
      <div className="wrap">
        <p className="eyebrow" data-reveal><Award size={14} aria-hidden="true" />CERTIFICATIONS</p>
        <h2 id="certs-title" className="h2" data-reveal>Certified in cloud, DevOps and Python.</h2>

        <ul className="cert-grid">
          {certifications.map((c) => {
            const Icon = icons[c.icon]
            return (
              <li key={c.id} className="cert" data-reveal>
                <span className="cert-icon" aria-hidden="true"><Icon size={26} strokeWidth={1.5} /></span>
                <span className="cert-tag">{c.tag}</span>
                <h3 className="cert-name">{c.name}</h3>
                {c.url && (
                  <a className="cert-link" href={c.url} target="_blank" rel="noopener noreferrer">
                    VERIFY <ExternalLink size={13} aria-hidden="true" />
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
