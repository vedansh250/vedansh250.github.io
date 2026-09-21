import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import CloudNodes from './CloudNodes'
import NetworkLines from './NetworkLines'
import Particles from './Particles'
import { BG, heroEdges, heroNodes, type NodeDef } from './graph'
import { sceneState } from '../lib/sceneState'

type Quality = 'high' | 'mid' | 'low'

function Rig({ compact, still }: { compact: boolean; still: boolean }) {
  const world = useRef<THREE.Group>(null!)
  const { camera, size } = useThree()
  const aspect = size.width / size.height
  const wide = aspect > 1.25

  // Mobile/tablet: pack the graph tighter and shift it above the headline.
  const nodes: NodeDef[] = useMemo(
    () =>
      heroNodes.map((n) => ({
        ...n,
        pos: compact
          ? [n.pos[0] * 0.4 - 0.2, n.pos[1] * 1.1 + 3.3, n.pos[2]]
          : [n.pos[0], n.pos[1], n.pos[2]],
      })),
    [compact],
  )
  const points = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n.pos])) as Record<string, [number, number, number]>,
    [nodes],
  )
  const [active, setActive] = useState<string | null>(null)

  useFrame(() => {
    const p = sceneState.progress
    const baseZ = compact ? 16.5 : 9.6
    const targetZ = baseZ + p * 7
    const px = still ? 0 : sceneState.px
    const py = still ? 0 : sceneState.py
    camera.position.x += ((px * 0.7) - camera.position.x) * 0.04
    camera.position.y += ((py * 0.4 + 0.3 - p * 0.8) - camera.position.y) * 0.04
    camera.position.z += (targetZ - camera.position.z) * 0.06
    camera.lookAt(0, 0, 0)

    const g = world.current
    const s = wide ? 0.64 : compact ? 1 : 0.9
    g.scale.setScalar(s)
    g.position.x += ((wide ? 2.9 : 0) - g.position.x) * 0.08
    g.position.y += ((wide ? 0.5 : 0) - g.position.y) * 0.08
    g.rotation.y += ((-0.25 + p * 0.7 + px * 0.06) - g.rotation.y) * 0.05
    g.rotation.x += ((p * 0.25 - py * 0.03) - g.rotation.x) * 0.05
  })

  return (
    <group ref={world}>
      <gridHelper args={[44, 44, '#16294a', '#0c1729']} position={[0, -3.3, 0]} />
      <NetworkLines points={points} edges={heroEdges} active={active} reveal={() => sceneState.reveal} speed={still ? 0 : 0.055} packetsPerEdge={compact ? 1 : 2} />
      <CloudNodes nodes={nodes} reveal={() => sceneState.reveal} active={active} onHover={setActive} labels still={still} />
    </group>
  )
}

export default function InfrastructureScene({ compact, still, paused }: { compact: boolean; still: boolean; paused: boolean }) {
  const [quality, setQuality] = useState<Quality>(compact ? 'mid' : 'high')
  const count = compact ? 90 : quality === 'high' ? 280 : quality === 'mid' ? 160 : 80
  const maxDpr = compact ? 1.25 : quality === 'high' ? 1.75 : quality === 'mid' ? 1.4 : 1

  return (
    <Canvas
      frameloop={paused ? 'never' : 'always'}
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0.3, compact ? 16.5 : 9.6], fov: 45, near: 0.1, far: 60 }}
      gl={{ antialias: !compact, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor(new THREE.Color(BG), 0)}
      aria-hidden="true"
    >
      <fog attach="fog" args={[BG, compact ? 16 : 10, compact ? 34 : 26]} />
      <PerformanceMonitor
        onDecline={() => setQuality((q) => (q === 'high' ? 'mid' : 'low'))}
        onIncline={() => setQuality((q) => (q === 'low' ? 'mid' : q))}
      />
      <Rig compact={compact} still={still} />
      <Particles count={count} still={still} />
    </Canvas>
  )
}
