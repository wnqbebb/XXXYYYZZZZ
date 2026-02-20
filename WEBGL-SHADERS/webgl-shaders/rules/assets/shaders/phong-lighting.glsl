// Phong lighting fragment shader
// Implements ambient + diffuse + specular lighting

precision mediump float;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;
uniform vec3 uDiffuseColor;
uniform vec3 uSpecularColor;
uniform float uShininess;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Normalize vectors
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uLightPosition - vPosition);
  vec3 viewDir = normalize(-vPosition);
  vec3 reflectDir = reflect(-lightDir, normal);
  
  // Ambient
  vec3 ambient = uAmbientColor * uDiffuseColor;
  
  // Diffuse
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = uLightColor * (diff * uDiffuseColor);
  
  // Specular
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
  vec3 specular = uLightColor * (spec * uSpecularColor);
  
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0);
}
