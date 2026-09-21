import { Download, Github, Linkedin, Mail } from 'lucide-react'
import { has, links, mailto } from '../data/links'

export default function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title" className="display sm" data-reveal>
          Have a cloud,<br />infrastructure<br />or automation problem?
        </h2>
        <p className="lets" data-reveal>Let’s talk.</p>
        <ul className="contact-list" data-reveal>
          {has(links.email) && <li><a href={mailto()}><Mail size={18} /><span>Email</span><em>{links.email}</em></a></li>}
          {has(links.github) && <li><a href={links.github} target="_blank" rel="noopener noreferrer"><Github size={18} /><span>GitHub</span><em>github.com/vedansh250</em></a></li>}
          {has(links.linkedin) && <li><a href={links.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={18} /><span>LinkedIn</span><em>Connect</em></a></li>}
        </ul>
        <div className="row" data-reveal>
          {has(links.resume) && <a className="btn btn-primary" href={links.resume} download><Download size={16} />DOWNLOAD RESUME</a>}
        </div>
      </div>
    </section>
  )
}
