import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 260, spread = [16, 8, 8] as [number, number, number], still = false }) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * spread[0]
      a[i * 3 + 1] = (Math.random() - 0.5) * spread[1]
      a[i * 3 + 2] = (Math.random() - 0.5) * spread[2] - 1
    }
    return a
  }, [count, spread[0], spread[1], spread[2]]) // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, dt) => {
    if (still) return
    ref.current.rotation.y += dt * 0.008
    ref.current.position.y = Math.sin(performance.now() * 0.00007) * 0.15
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#6f9bff" size={0.028} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  )
}
