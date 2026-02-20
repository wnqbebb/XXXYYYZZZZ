// Basic fragment shader
// Displays animated gradient color

precision mediump float;

uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  vec3 color = uColor * (0.5 + 0.5 * sin(uTime + vUv.x * 3.14159));
  gl_FragColor = vec4(color, 1.0);
}
