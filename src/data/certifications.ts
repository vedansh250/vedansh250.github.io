export type Certification = {
  id: string
  name: string
  tag: string
  icon: 'cloud' | 'devops' | 'python' | 'data'
  // Optional verification / credential link. Only rendered when set – never add a placeholder.
  url?: string
}

export const certifications: Certification[] = [
  { id: 'dop', name: 'Cloud DevOps Engineering Course with AI (CDEC) ', tag: 'AWS · Professional', icon: 'devops', url: '' },// Add your CDEC certification here
  { id: 'saa', name: 'AWS Certified Solutions Architect Associate', tag: 'AWS · Associate', icon: 'cloud',url: './certs/SAA.pdf' },
  { id: 'py', name: 'Python Programming Certified', tag: 'Python', icon: 'python', url: './certs/Python.pdf' },
  { id: 'da', name: 'Professional Data Analytics Certification', tag: 'Data Analytics', icon: 'data', url: './certs/DAC.pdf' },
]
