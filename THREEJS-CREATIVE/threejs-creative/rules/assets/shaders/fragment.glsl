// Basic fragment shader with gradient
uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // Create gradient based on UV
  vec3 color1 = uColor;
  vec3 color2 = vec3(0.0, 0.3, 0.8);
  
  vec3 gradient = mix(color1, color2, vUv.y + sin(uTime) * 0.1);
  
  // Simple lighting
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float diff = max(dot(vNormal, lightDir), 0.0);
  
  vec3 finalColor = gradient * (0.3 + diff * 0.7);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
