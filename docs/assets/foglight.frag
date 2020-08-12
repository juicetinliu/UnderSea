precision highp float;

uniform vec4 uMaterialColor;
uniform vec4 uTint;
uniform sampler2D uSampler;
uniform bool isTexture;
uniform bool uEmissive;

uniform float fogNear;
uniform float fogFar;
uniform vec3 fogColor;

varying highp vec2 vVertTexCoord;
varying vec3 vDiffuseColor;
varying vec3 vSpecularColor;

void main(void) {
  if(uEmissive && !isTexture) {
    gl_FragColor = uMaterialColor;
  }
  else {
    gl_FragColor = isTexture ? texture2D(uSampler, vVertTexCoord) * (uTint / vec4(255, 255, 255, 255)) : uMaterialColor;
    gl_FragColor.rgb = gl_FragColor.rgb * vDiffuseColor + vSpecularColor;
  }
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = smoothstep(fogNear, fogFar, depth);
  gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
}