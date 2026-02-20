'use client'

import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  PerformanceMonitor 
} from '@react-three/drei'
import { useState, Suspense, ReactNode } from 'react'

interface BaseSceneProps {
  children: ReactNode
  cameraPosition?: [number, number, number]
  cameraFov?: number
  showContactShadows?: boolean
  environment?: 'city' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment'
  enableZoom?: boolean
  dpr?: [number, number]
}

export function BaseScene({
  children,
  cameraPosition = [0, 0, 5],
  cameraFov = 45,
  showContactShadows = true,
  environment = 'city',
  enableZoom = true,
  dpr = [1, 2]
}: BaseSceneProps) {
  const [performanceDpr, setPerformanceDpr] = useState(dpr[1])
  
  return (
    <Canvas
      shadows
      dpr={[dpr[0], performanceDpr]}
      camera={{ position: cameraPosition, fov: cameraFov }}
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true
      }}
    >
      <PerformanceMonitor
        onDecline={() => setPerformanceDpr(1)}
        onIncline={() => setPerformanceDpr(dpr[1])}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      
      {/* Environment */}
      <Environment preset={environment} />
      
      {/* Contact shadows */}
      {showContactShadows && (
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.4}
          scale={20}
          blur={2.5}
          far={4}
        />
      )}
      
      {/* Scene content */}
      <Suspense fallback={null}>
        {children}
      </Suspense>
      
      {/* Controls */}
      <OrbitControls 
        enableZoom={enableZoom}
        enablePan={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}
