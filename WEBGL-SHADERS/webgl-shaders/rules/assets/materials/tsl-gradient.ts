import { MeshBasicNodeMaterial } from 'three/webgpu'
import { color, mix, positionLocal, sin, time } from 'three/tsl'

export function createGradientMaterial() {
  const material = new MeshBasicNodeMaterial()
  
  // Create animated gradient based on position
  const gradient = mix(
    color(0x6366f1), // Indigo
    color(0xec4899), // Pink
    sin(positionLocal.y.mul(2).add(time)).mul(0.5).add(0.5)
  )
  
  material.colorNode = gradient
  
  return material
}
