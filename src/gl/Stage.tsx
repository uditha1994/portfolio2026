import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import Android from './Android'
import Globe from './Globe'

/** One fixed WebGL stage behind the page. It only renders while a 3D scene is on screen. */
export default function Stage({ active }: { active: boolean }) {
  return (
    <Canvas
      className="stage"
      aria-hidden="true"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ fov: 35, position: [0, 0, 6], near: 0.1, far: 60 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#0A0908']} />
      <Suspense fallback={null}>
        <Android />
      </Suspense>
      <Globe />
      <Sparkles count={90} scale={[11, 6, 5]} size={2.2} speed={0.25} opacity={0.55} color="#FFA51F" />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.74} luminanceSmoothing={0.2} radius={0.7} />
        <Noise opacity={0.045} />
        <Vignette offset={0.25} darkness={0.72} />
      </EffectComposer>
    </Canvas>
  )
}
