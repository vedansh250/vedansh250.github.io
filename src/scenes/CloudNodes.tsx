import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { BLUE, BLUE_SOFT, makeGeometry, type NodeDef } from './graph'

type Props = {
  nodes: NodeDef[]
  reveal: () => number
  active: string | null
  onHover: (id: string | null) => void
  labels?: boolean
  still?: boolean
}

const tmpScale = new THREE.Vector3()

function Node({ n, index, total, reveal, active, onHover, labels, still }: {
  n: NodeDef; index: number; total: number; reveal: () => number; active: string | null
  onHover: (id: string | null) => void; labels: boolean; still: boolean
}) {
  const group = useRef<THREE.Group>(null!)
  const spin = useRef<THREE.Group>(null!)
  const geo = useMemo(() => makeGeometry(n.kind, n.size ?? 0.5), [n])
  const hot = active === n.id
  const dim = active !== null && !hot

  useFrame((_, dt) => {
    const r = reveal() * (total + 2) - index
    const s = THREE.MathUtils.clamp(r, 0, 1)
    const eased = 1 - Math.pow(1 - s, 3)
    const target = eased * (hot ? 1.18 : 1)
    group.current.scale.lerp(tmpScale.set(target, target, target), 0.15)
    if (!still) {
      spin.current.rotation.y += dt * 0.18
      spin.current.rotation.x += dt * 0.07
    }
  })

  return (
    <group
      ref={group}
      position={n.pos}
      scale={0}
      onPointerOver={(e) => { e.stopPropagation(); onHover(n.id); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { onHover(null); document.body.style.cursor = '' }}
    >
      <group ref={spin}>
        <mesh geometry={geo}>
          <meshBasicMaterial color="#0a1322" transparent opacity={0.92} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[geo]} />
          <lineBasicMaterial color={hot ? BLUE_SOFT : BLUE} transparent opacity={dim ? 0.3 : 1} />
        </lineSegments>
      </group>
      <mesh>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color={hot ? '#ffffff' : BLUE_SOFT} toneMapped={false} />
      </mesh>
      {/* soft halo */}
      <mesh>
        <sphereGeometry args={[(n.size ?? 0.5) * 1.5, 16, 16]} />
        <meshBasicMaterial color={BLUE} transparent opacity={hot ? 0.07 : 0.018} depthWrite={false} />
      </mesh>
      {labels && (
        <Html position={[0, -(n.size ?? 0.5) - 0.42, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[5, 0]}>
          <span className={`node-label${hot ? ' is-hot' : ''}${dim ? ' is-dim' : ''}`}>{n.label}</span>
        </Html>
      )}
    </group>
  )
}

export default function CloudNodes(props: Props) {
  const { nodes, labels = true, still = false, ...rest } = props
  return (
    <group>
      {nodes.map((n, i) => (
        <Node key={n.id} n={n} index={i} total={nodes.length} labels={labels} still={still} {...rest} />
      ))}
    </group>
  )
}
