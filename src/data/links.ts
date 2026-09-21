// Single source of truth for outbound links.
// Empty string = "not set yet" and the matching button/row is hidden automatically.
// The GitHub username comes from the portfolio URL (vedansh250.github.io).
export const links = {
  github: 'https://github.com/vedansh250',
  linkedin: 'https://www.linkedin.com/in/vedansh-paunikar-/', // e.g. 'https://www.linkedin.com/in/your-handle'
  email: 'vedanshpaunikar25@gmail.com', // e.g. 'you@example.com'
  resume: 'VEDANSH PAUNIKAR.pdf', // e.g. './resume.pdf' after placing the file in /public
}

export const has = (v: string) => v.trim().length > 0
export const mailto = () => (has(links.email) ? `mailto:${links.email}` : '')
