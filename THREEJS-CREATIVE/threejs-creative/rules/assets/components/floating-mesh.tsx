'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface FloatingMeshProps {
  children: React.ReactNode
  floatSpeed?: number
  floatAmplitude?: number
  rotateSpeed?: number
}

export function FloatingMesh({ 
  children, 
  floatSpeed = 1,
  floatAmplitude = 0.3,
  rotateSpeed = 0.5
}: FloatingMeshProps) {
  const groupRef = useRef<Mesh>(null)
  const initialY = useRef(0)
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    
    // Floating motion
    groupRef.current.position.y = 
      initialY.current + Math.sin(time * floatSpeed) * floatAmplitude
    
    // Gentle rotation
    groupRef.current.rotation.y = time * rotateSpeed * 0.1
    groupRef.current.rotation.x = Math.sin(time * floatSpeed * 0.5) * 0.05
  })
  
  return (
    <group ref={groupRef}>
      {children}
    </group>
  )
}
