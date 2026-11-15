import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { asset, fx } from '../fx'

/**
 * The android from the source artwork, rebuilt as real geometry:
 * a dense plane displaced by a depth map estimated from the image,
 * textured with the image itself, plus a particle twin that assembles
 * into the surface on load and tears apart again on scroll.
 */

const PLANE_H = 4.2
const PLANE_W = (PLANE_H * 16) / 9
const DEPTH = 1.5

const meshVert = /* glsl */ `
  uniform sampler2D uDepth;
  uniform float uStrength;
  varying vec2 vUv;
  varying float vD;
  void main() {
    vUv = uv;
    float d = texture2D(uDepth, uv).r;
    vD = d;
    vec3 p = position;
    p.z += (d - 0.45) * uStrength;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const meshFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vD;
  void main() {
    vec4 c = texture2D(uMap, vUv);
    float lum = dot(c.rgb, vec3(0.3, 0.6, 0.1));
    // cut the subject out of its black backdrop using depth, keep stray glow
    float mask = max(smoothstep(0.1, 0.2, vD), smoothstep(0.08, 0.5, lum));
    // the gold circuitry carries a slow travelling charge
    float gold = smoothstep(0.18, 0.55, c.r - c.b) * smoothstep(0.35, 0.8, c.r);
    float wave = 0.5 + 0.5 * sin(uTime * 1.3 - vD * 16.0 + vUv.y * 5.0);
    c.rgb += c.rgb * gold * wave * 0.9;
    gl_FragColor = vec4(c.rgb, mask * uOpacity);
    #include <colorspace_fragment>
  }
`

const ptsVert = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uDepth;
  uniform float uAssemble;
  uniform float uTime;
  uniform float uStrength;
  uniform float uSize;
  uniform vec2 uPlane;
  attribute vec2 aUv;
  attribute vec3 aRand;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = texture2D(uDepth, aUv).r;
    vec3 c = texture2D(uMap, aUv).rgb;
    vec3 target = vec3((aUv - 0.5) * uPlane, (d - 0.45) * uStrength);
    float t = clamp(uAssemble * 1.7 - aRand.x * 0.7, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 dir = normalize(aRand - 0.5);
    vec3 scatter = target + dir * (2.0 + aRand.y * 5.0) + vec3(0.0, 0.0, 3.0 * aRand.z);
    scatter.xy += vec2(sin(uTime * 0.4 + aRand.x * 20.0), cos(uTime * 0.3 + aRand.y * 20.0)) * 0.3;
    vec3 p = mix(scatter, target, t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float keep = step(0.16, d);
    float lum = dot(c, vec3(0.3, 0.6, 0.1));
    gl_PointSize = uSize * (0.5 + aRand.z) * keep / -mv.z;
    vColor = c * (0.6 + lum);
    vAlpha = keep * (1.0 - smoothstep(0.82, 1.0, uAssemble)) * smoothstep(0.0, 0.1, uAssemble) * (0.3 + 0.7 * t);
  }
`

const ptsFrag = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, r) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }
`

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function Android() {
  const [map, depth] = useTexture([asset('models/android.webp'), asset('models/android-depth.webp')])
  const group = useRef<THREE.Group>(null!)
  const intro = useRef({ v: fx.reduced ? 1 : 0 })
  const { viewport, gl } = useThree()

  useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    depth.colorSpace = THREE.NoColorSpace
    depth.minFilter = depth.magFilter = THREE.LinearFilter
    depth.generateMipmaps = false
  }, [map, depth])

  const meshMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: meshVert,
        fragmentShader: meshFrag,
        transparent: true,
        uniforms: {
          uMap: { value: map },
          uDepth: { value: depth },
          uStrength: { value: DEPTH },
          uTime: { value: 0 },
          uOpacity: { value: 0 },
        },
      }),
    [map, depth],
  )

  const ptsMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ptsVert,
        fragmentShader: ptsFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uMap: { value: map },
          uDepth: { value: depth },
          uStrength: { value: DEPTH },
          uAssemble: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: 26 * gl.getPixelRatio() },
          uPlane: { value: new THREE.Vector2(PLANE_W, PLANE_H) },
        },
      }),
    [map, depth, gl],
  )

  const ptsGeo = useMemo(() => {
    const cols = 300
    const rows = 168
    const n = cols * rows
    const uv = new Float32Array(n * 2)
    const rand = new Float32Array(n * 3)
    for (let y = 0, i = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++, i++) {
        uv[i * 2] = (x + Math.random()) / cols
        uv[i * 2 + 1] = (y + Math.random()) / rows
        rand[i * 3] = Math.random()
        rand[i * 3 + 1] = Math.random()
        rand[i * 3 + 2] = Math.random()
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    g.setAttribute('aUv', new THREE.BufferAttribute(uv, 2))
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 3))
    return g
  }, [])

  useEffect(() => {
    window.dispatchEvent(new Event('stage-ready'))
    const tw = gsap.to(intro.current, { v: 1, duration: 3.4, delay: 0.5, ease: 'power2.inOut' })
    return () => {
      tw.kill()
    }
  }, [])

  useFrame((state, dt) => {
    const g = group.current
    const active = fx.hero < 0.995
    g.visible = active
    if (!active) return

    const t = state.clock.elapsedTime
    const assemble = intro.current.v * (1 - smooth(0.42, 0.92, fx.hero))
    meshMat.uniforms.uTime.value = t
    meshMat.uniforms.uOpacity.value = smooth(0.72, 1, assemble)
    ptsMat.uniforms.uTime.value = t
    ptsMat.uniforms.uAssemble.value = assemble

    // cover the viewport like object-fit: cover, then keep the face in frame on narrow screens
    const portrait = viewport.width < viewport.height * 1.15
    const cover = Math.max(viewport.width / PLANE_W, viewport.height / PLANE_H) * 1.06
    const scale = cover * (1 + fx.hero * 0.45)
    g.scale.setScalar(scale)
    const tx = portrait ? -0.1 * PLANE_W * scale : 0
    const k = 1 - Math.exp(-dt * 3.5)
    g.position.x += (tx - fx.mx * 0.08 - g.position.x) * k
    g.position.y += (fx.hero * -0.5 + fx.my * 0.05 - g.position.y) * k
    const ry = fx.mx * 0.16 + (-0.1 + fx.hero * 0.42) + Math.sin(t * 0.35) * 0.02
    const rx = -fx.my * 0.1 + Math.cos(t * 0.3) * 0.012
    g.rotation.y += (ry - g.rotation.y) * k
    g.rotation.x += (rx - g.rotation.x) * k
  })

  return (
    <group ref={group}>
      <mesh material={meshMat} frustumCulled={false}>
        <planeGeometry args={[PLANE_W, PLANE_H, 384, 216]} />
      </mesh>
      <points geometry={ptsGeo} material={ptsMat} frustumCulled={false} />
    </group>
  )
}
