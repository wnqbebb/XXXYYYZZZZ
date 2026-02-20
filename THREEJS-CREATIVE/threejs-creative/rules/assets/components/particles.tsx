'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color } from 'three'

interface ParticlesProps {
  count?: number
  color?: string
  size?: number
  spread?: number
}

export function Particles({ 
  count = 1000, 
  color = '#ffffff',
  size = 0.05,
  spread = 10
}: ParticlesProps) {
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      ] as [number, number, number],
      speed: Math.random() * 0.02 + 0.01,
      offset: Math.random() * Math.PI * 2
    }))
  }, [count, spread])
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.elapsedTime
    
    particles.forEach((particle, i) => {
      dummy.position.set(
        particle.position[0],
        particle.position[1] + Math.sin(time * particle.speed + particle.offset) * 0.5,
        particle.position[2]
      )
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </instancedMesh>
  )
}
