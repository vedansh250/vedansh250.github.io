import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BLUE, BLUE_SOFT, edgeCurve } from './graph'

const C_BLUE = new THREE.Color(BLUE)
const C_SOFT = new THREE.Color(BLUE_SOFT)

type Props = {
  points: Record<string, [number, number, number]>
  edges: [string, string][]
  active?: string | null // highlights edges touching this node id
  activeRef?: { current: string | null } // same, but read every frame (no re-render needed)
  reveal?: () => number // 0…1 – lines draw in with this value
  speed?: number
  packetsPerEdge?: number
}

/** Curved connection lines + instanced data packets travelling along them. */
export default function NetworkLines({
  points, edges, active = null, activeRef, reveal = () => 1, speed = 0.06, packetsPerEdge = 2,
}: Props) {
  const curves = useMemo(
    () =>
      edges.map(([a, b]) =>
        edgeCurve(new THREE.Vector3(...points[a]), new THREE.Vector3(...points[b])),
      ),
    [points, edges],
  )

  const lines = useMemo(
    () =>
      curves.map((c) => {
        const geo = new THREE.BufferGeometry().setFromPoints(c.getPoints(40))
        const mat = new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.35 })
        return new THREE.Line(geo, mat)
      }),
    [curves],
  )

  const count = curves.length * packetsPerEdge
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const r = reveal()
    const act = activeRef ? activeRef.current : active
    lines.forEach((l, i) => {
      const [a, b] = edges[i]
      const hot = act && (a === act || b === act)
      const m = l.material as THREE.LineBasicMaterial
      const target = (hot ? 0.95 : act ? 0.12 : 0.38) * Math.min(1, r * 1.4)
      m.opacity += (target - m.opacity) * 0.12
      m.color.copy(hot ? C_SOFT : C_BLUE)
      l.geometry.setDrawRange(0, Math.max(2, Math.floor(41 * Math.min(1, r * 1.3))))
    })
    let n = 0
    curves.forEach((c, ci) => {
      for (let k = 0; k < packetsPerEdge; k++) {
        const u = (t * speed * (1 + (ci % 3) * 0.18) + k / packetsPerEdge + ci * 0.13) % 1
        c.getPoint(u, tmp)
        dummy.position.copy(tmp)
        const s = r > 0.9 ? 1 : 0
        dummy.scale.setScalar(s)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(n++, dummy.matrix)
      }
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {lines.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshBasicMaterial color="#b9d0ff" toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
