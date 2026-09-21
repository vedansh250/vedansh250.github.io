import * as THREE from 'three'

export type NodeDef = {
  id: string
  label: string
  pos: [number, number, number]
  kind: 'octa' | 'dodeca' | 'box' | 'tetra' | 'torus' | 'ico'
  size?: number
}

// Coherent flow: git → CI/CD → containers → Kubernetes → cloud → monitoring, with Terraform feeding the cloud.
export const heroNodes: NodeDef[] = [
  { id: 'git', label: 'GIT', pos: [-6.2, -0.4, -0.2], kind: 'tetra', size: 0.34 },
  { id: 'cicd', label: 'CI/CD', pos: [-4.4, 1.0, -0.6], kind: 'torus', size: 0.5 },
  { id: 'docker', label: 'DOCKER', pos: [-2.4, -0.5, 0.6], kind: 'box', size: 0.58 },
  { id: 'k8s', label: 'KUBERNETES', pos: [-0.3, 1.0, -0.3], kind: 'dodeca', size: 0.66 },
  { id: 'terraform', label: 'TERRAFORM', pos: [0.5, -1.9, 0.7], kind: 'tetra', size: 0.54 },
  { id: 'aws', label: 'AWS', pos: [2.3, 0.1, 0.2], kind: 'octa', size: 0.78 },
  { id: 'monitoring', label: 'MONITORING', pos: [4.5, 1.2, -0.6], kind: 'ico', size: 0.55 },
]

export const heroEdges: [string, string][] = [
  ['git', 'cicd'], ['cicd', 'docker'], ['docker', 'k8s'], ['k8s', 'aws'],
  ['terraform', 'aws'], ['terraform', 'k8s'], ['aws', 'monitoring'], ['k8s', 'monitoring'],
]

export function makeGeometry(kind: NodeDef['kind'], s: number) {
  switch (kind) {
    case 'octa': return new THREE.OctahedronGeometry(s)
    case 'dodeca': return new THREE.DodecahedronGeometry(s)
    case 'box': return new THREE.BoxGeometry(s * 1.4, s * 1.4, s * 1.4)
    case 'tetra': return new THREE.TetrahedronGeometry(s)
    case 'torus': return new THREE.TorusGeometry(s * 0.8, s * 0.22, 8, 20)
    case 'ico': return new THREE.IcosahedronGeometry(s, 1)
  }
}

export function edgeCurve(a: THREE.Vector3, b: THREE.Vector3) {
  const mid = a.clone().add(b).multiplyScalar(0.5)
  mid.y += a.distanceTo(b) * 0.12
  mid.z += 0.4
  return new THREE.QuadraticBezierCurve3(a, mid, b)
}

export const BLUE = '#3d7bff'
export const BLUE_SOFT = '#7aa5ff'
export const BG = '#05070b'
