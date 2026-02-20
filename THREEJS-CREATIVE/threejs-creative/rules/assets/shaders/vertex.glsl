// Basic vertex shader with wave animation
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  
  // Wave animation
  vec3 pos = position;
  float wave = sin(pos.x * 2.0 + uTime) * 0.2;
  wave += sin(pos.y * 3.0 + uTime * 0.5) * 0.1;
  pos.z += wave;
  
  vPosition = pos;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
