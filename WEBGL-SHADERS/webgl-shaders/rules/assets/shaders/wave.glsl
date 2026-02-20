// Wave distortion vertex shader
// Creates a wave effect on the mesh

uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;

varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  
  vec3 newPosition = position;
  
  // Calculate wave elevation
  float elevation = sin(position.x * uFrequency + uTime) * uAmplitude;
  elevation += sin(position.y * uFrequency * 0.5 + uTime) * uAmplitude;
  
  newPosition.z += elevation;
  vElevation = elevation;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
