'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { Text } from '@react-three/drei'
import { Mesh } from 'three'

interface Button3DProps {
  children: string
  onClick?: () => void
  position?: [number, number, number]
  color?: string
  hoverColor?: string
}

export function Button3D({ 
  children, 
  onClick, 
  position = [0, 0, 0],
  color = '#4ecdc4',
  hoverColor = '#ff6b6b'
}: Button3DProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  const { scale, bgColor } = useSpring({
    scale: hovered ? 1.1 : 1,
    bgColor: hovered ? hoverColor : color,
    config: { tension: 300, friction: 20 }
  })
  
  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <roundedBoxGeometry args={[3, 1, 0.5]} radius={0.1} />
      <animated.meshStandardMaterial 
        color={bgColor}
        roughness={0.3}
        metalness={0.1}
      />
      
      <Text
        position={[0, 0, 0.3]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {children}
      </Text>
    </animated.mesh>
  )
}
