import { MeshStandardNodeMaterial } from 'three/webgpu'
import { positionLocal, normalLocal, sin, time, mul, add } from 'three/tsl'

export function createDisplacementMaterial() {
  const material = new MeshStandardNodeMaterial()
  
  // Create wave displacement
  const displacement = sin(
    positionLocal.y.mul(5).add(time)
  ).mul(0.2)
  
  // Displace along normal
  material.positionNode = positionLocal.add(
    normalLocal.mul(displacement)
  )
  
  // Set material properties
  material.metalness = 0.5
  material.roughness = 0.2
  material.color.setHex(0x4ecdc4)
  
  return material
}
