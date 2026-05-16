'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Icosahedron, Torus } from '@react-three/drei'
import * as THREE from 'three'

function FloatingShape({
  position,
  color,
  speed = 1,
  distort = 0.3,
  type = 'icosahedron',
}: {
  position: [number, number, number]
  color: string
  speed?: number
  distort?: number
  type?: 'icosahedron' | 'torus'
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed
  })

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        {type === 'icosahedron' ? (
          <icosahedronGeometry args={[1, 1]} />
        ) : (
          <torusGeometry args={[1, 0.3, 16, 32]} />
        )}
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.6}
          wireframe={false}
        />
      </mesh>
    </Float>
  )
}

function ParticleField({ count = 200, color }: { count?: number; color: string }) {
  const points = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!points.current) return
    points.current.rotation.y = state.clock.elapsedTime * 0.02
    points.current.rotation.x = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function MouseParallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += (mouse.x * 0.3 - groupRef.current.rotation.y) * 0.05
    groupRef.current.rotation.x += (-mouse.y * 0.2 - groupRef.current.rotation.x) * 0.05
  })

  return <group ref={groupRef}>{children}</group>
}

interface Hero3DProps {
  accentColor?: string
}

export function Hero3D({ accentColor = '#00ff88' }: Hero3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color={accentColor} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />

      <MouseParallax>
        <FloatingShape position={[-4, 2, -2]} color={accentColor} speed={0.8} distort={0.4} />
        <FloatingShape position={[4, -1, -3]} color={accentColor} speed={1.2} distort={0.3} type="torus" />
        <FloatingShape position={[2, 3, -4]} color={accentColor} speed={0.6} distort={0.5} />
        <FloatingShape position={[-3, -2, -2]} color={accentColor} speed={1.0} distort={0.2} type="torus" />
        <FloatingShape position={[0, -3, -5]} color={accentColor} speed={0.7} distort={0.35} />
        <ParticleField count={300} color={accentColor} />
      </MouseParallax>
    </Canvas>
  )
}
