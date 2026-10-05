// All particle motion runs on the GPU. The CPU only updates a few uniforms per frame.

// Hero text particles: letter pixels -> scattered in 3D toward the camera -> back to the letters.
export const MAIN_VERT = /* glsl */ `
uniform float uProgress;
uniform float uTime;
uniform float uPx;
uniform float uCamZ;
uniform float uBase;
attribute vec3 aScatter;
attribute vec4 aRand;   // x: delay, y: size factor, z: phase, w: speed
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;

float easeOut(float t) { float u = 1.0 - t; return 1.0 - u * u * u; }
float easeInOut(float t) { return t * t * (3.0 - 2.0 * t); }

void main() {
  float d = aRand.x * 0.5;
  float o = easeOut(clamp((uProgress * 2.0 - d) / (1.0 - d), 0.0, 1.0));
  float r = easeInOut(clamp(((uProgress - 0.5) * 2.0 - d) / (1.0 - d), 0.0, 1.0));

  // outward: letter position -> scatter, return: scatter -> exact letter position
  vec3 p = mix(mix(position, aScatter, o), position, r);

  // turbulence fades to zero at both ends so the text reconstructs exactly
  float mid = sin(uProgress * 3.14159265);
  float ph = aRand.z * 6.2831853;
  p += vec3(
    sin(uTime * aRand.w + ph),
    cos(uTime * aRand.w * 0.8 + ph * 1.3),
    sin(uTime * aRand.w * 0.6 + ph * 0.7)
  ) * 22.0 * mid * aRand.y;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = uBase * mix(0.75, 1.5, aRand.y);
  gl_PointSize = min(size * uPx * uCamZ / -mv.z, 18.0 * uPx);

  vColor = mix(aColor, vec3(0.84, 1.0, 0.44), mid * 0.35);
  vAlpha = 0.9 - 0.3 * o * aRand.y;
}
`;

// Ambient dust: slow 3D drift + gentle repulsion from the cursor.
export const AMBIENT_VERT = /* glsl */ `
uniform float uTime;
uniform float uPx;
uniform float uCamZ;
uniform float uFade;
uniform vec2 uMouse;
attribute vec4 aRand;   // x: phase, y: speed, z: size, w: tone
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 p = position;
  float t = uTime * aRand.y * 0.15 + aRand.x * 6.2831853;
  p += vec3(sin(t) * 40.0, cos(t * 1.3) * 55.0, sin(t * 0.7) * 80.0);

  vec2 dm = p.xy - uMouse;
  p.xy += normalize(dm + 0.0001) * smoothstep(160.0, 0.0, length(dm)) * 45.0;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min((1.2 + aRand.z * 2.4) * uPx * uCamZ / -mv.z, 10.0 * uPx);

  vColor = mix(vec3(0.95), vec3(0.84, 1.0, 0.44), step(0.7, aRand.w));
  vAlpha = uFade * (0.15 + aRand.z * 0.35);
}
`;

export const FRAG = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.08, d);
  gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
}
`;
