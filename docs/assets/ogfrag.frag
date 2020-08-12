#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

varying vec4 vertColor;
varying vec4 backVertColor;

uniform float fogNear;
uniform float fogFar;
uniform vec3 fogColor;

void main() {
  gl_FragColor = gl_FrontFacing ? vertColor : backVertColor;

  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = smoothstep(fogNear, fogFar, depth);
  gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
}
