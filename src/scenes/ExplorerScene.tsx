import { memo, useCallback, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import CloudNodes from './CloudNodes'
import NetworkLines from './NetworkLines'
import Particles from './Particles'
import { BG, type NodeDef } from './graph'

const nodes: NodeDef[] = [
  { id: 'alb', label: 'ALB', pos: [-3.2, -0.6, 2.4], kind: 'octa', size: 0.42 },
  { id: 'ec2', label: 'EC2', pos: [-0.8, -0.6, -1.2], kind: 'box', size: 0.42 },
  { id: 'eks', label: 'EKS', pos: [1.6, -0.6, 0.4], kind: 'dodeca', size: 0.55 },
  { id: 'rds', label: 'RDS', pos: [1.2, -0.6, -2.6], kind: 'ico', size: 0.42 },
  { id: 'pods', label: 'PODS', pos: [2.6, 1.0, 0.6], kind: 'box', size: 0.22 },
  { id: 'monitor', label: 'MONITORING', pos: [0.2, 2.6, 0.2], kind: 'torus', size: 0.45 },
]
const points = Object.fromEntries(nodes.map((n) => [n.id, n.pos])) as Record<string, [number, number, number]>
const edges: [string, string][] = [
  ['alb', 'ec2'], ['alb', 'eks'], ['ec2', 'rds'], ['eks', 'rds'], ['eks', 'pods'],
  ['monitor', 'ec2'], ['monitor', 'eks'], ['monitor', 'rds'],
]

// Geometries are created once (not on every hover re-render) to keep the GPU calm.
const G_VPC = new THREE.BoxGeometry(9, 4.4, 8)
const G_PUB = new THREE.BoxGeometry(2.4, 1.6, 2.4)
const G_PRIV = new THREE.BoxGeometry(5.6, 1.6, 5.6)

const Zone = memo(function Zone({ id, pos, geo, color, onHover }: {
  id: string; pos: [number, number, number]; geo: THREE.BoxGeometry; color: string
  onHover: (id: string | null) => void
}) {
  return (
    <group position={pos}
      onPointerOver={(e) => { e.stopPropagation(); onHover(id) }}
      onPointerOut={() => onHover(null)}>
      <mesh geometry={geo}><meshBasicMaterial color={color} transparent opacity={0.025} depthWrite={false} /></mesh>
      <lineSegments><edgesGeometry args={[geo]} /><lineBasicMaterial color={color} transparent opacity={0.55} /></lineSegments>
    </group>
  )
})

const reveal = () => 1

/** All hover state lives INSIDE the Canvas. Keeping it in the Canvas's parent made <Canvas> re-render on
 *  every hover, which rebuilt the camera and orbit controls and stressed the GPU (black screen / lost context). */
function Scene({ onHover, lite }: { onHover: (id: string | null) => void; lite: boolean }) {
  const [active, setActive] = useState<string | null>(null)
  const dragging = useRef(false)
  const set = useCallback((id: string | null) => {
    if (dragging.current) return // no hover changes while orbiting
    setActive(id); onHover(id)
  }, [onHover])

  return (
    <>
      <fog attach="fog" args={[BG, 12, 30]} />
      <group position={[0, 0.2, 0]}>
        <Zone id="vpc" pos={[0, 0.1, -0.2]} geo={G_VPC} color="#5f8fff" onHover={set} />
        <Zone id="public" pos={[-3.2, -0.6, 2.4]} geo={G_PUB} color="#8fb4ff" onHover={set} />
        <Zone id="private" pos={[0.8, -0.6, -0.9]} geo={G_PRIV} color="#3d7bff" onHover={set} />
        <NetworkLines points={points} edges={edges} active={active} speed={0.07} packetsPerEdge={2} />
        <CloudNodes nodes={nodes} reveal={reveal} active={active} onHover={set} labels />
        <gridHelper args={[30, 30, '#16294a', '#0c1729']} position={[0, -1.8, 0]} />
      </group>
      <Particles count={lite ? 40 : 110} spread={[16, 8, 12]} />
      <OrbitControls
        onStart={() => { dragging.current = true }}
        onEnd={() => { dragging.current = false }}
        enableDamping enablePan={false} minDistance={7} maxDistance={20}
        autoRotate autoRotateSpeed={0.35} maxPolarAngle={Math.PI * 0.49}
      />
    </>
  )
}

// Constant props: a new object on every render would make R3F rebuild the camera / renderer config.
const CAMERA = { position: [7, 4.5, 8.5] as [number, number, number], fov: 42 }
const DPR_D: [number, number] = [1, 1.5]
const DPR_C: [number, number] = [1, 1]
const GL_D = { antialias: true, powerPreference: 'default' as const }
const GL_C = { antialias: false, powerPreference: 'default' as const }

function ExplorerScene({ onHover, lite, onLost, onRestored }: {
  onHover: (id: string | null) => void; lite: boolean; onLost: () => void; onRestored: () => void
}) {
  return (
    <Canvas
      dpr={lite ? DPR_C : DPR_D}
      camera={CAMERA}
      gl={lite ? GL_C : GL_D}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(BG), 1)
        gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onLost() })
        gl.domElement.addEventListener('webglcontextrestored', () => onRestored())
      }}
      aria-hidden="true"
    >
      <Scene onHover={onHover} lite={lite} />
    </Canvas>
  )
}

export default memo(ExplorerScene)
