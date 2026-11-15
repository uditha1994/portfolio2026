import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { asset, fx } from '../fx'

/**
 * The globe from the second artwork, built procedurally: a midnight sphere with
 * a blue limb, continents drawn as thousands of amber lights sampled from real
 * coastline data, orbit rings, and signal arcs leaving Colombo.
 */

const R = 1.5
const COLOMBO: [number, number] = [79.86, 6.93]
const CITIES: [number, number][] = [
  [103.82, 1.35],
  [55.27, 25.2],
  [-0.12, 51.5],
  [139.69, 35.68],
  [151.2, -33.87],
  [-122.42, 37.77],
  [28.04, -26.2],
]

const AMBER = new THREE.Color('#FFA51F')

function ll(lon: number, lat: number, r = R) {
  const phi = ((90 - lat) * Math.PI) / 180
  const th = ((lon + 180) * Math.PI) / 180
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th))
}

const coreVert = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const coreFrag = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.6);
    vec3 deep = vec3(0.012, 0.02, 0.06);
    vec3 limb = vec3(0.1, 0.24, 1.0);
    vec3 c = mix(deep, limb, f) + limb * pow(f, 3.0) * 1.4;
    gl_FragColor = vec4(c, uOpacity);
    #include <colorspace_fragment>
  }
`
const haloFrag = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(max(dot(vN, -vV), 0.0), 3.5);
    gl_FragColor = vec4(vec3(0.12, 0.3, 1.0) * f * 1.3, f * uOpacity);
    #include <colorspace_fragment>
  }
`

const landVert = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uReveal;
  attribute float aSeed;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 2.2) + aSeed * 60.0);
    float big = step(0.93, aSeed);
    gl_PointSize = uSize * (0.7 + big * 1.8) / -mv.z;
    // lights switch on in a sweep from south to north
    float on = smoothstep(0.0, 0.25, uReveal * 1.25 - (position.y / ${R.toFixed(1)} * 0.5 + 0.5) * 0.9 - aSeed * 0.1);
    vA = tw * on * (0.75 + big * 0.6);
  }
`
const landFrag = /* glsl */ `
  uniform vec3 uColor;
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, r) * vA;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor * (1.0 + a), a);
    #include <colorspace_fragment>
  }
`

function ring(radius: number, dots: number) {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= 256; i++) {
    const a = (i / 256) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
  }
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.35 }),
  )
  const dp = new Float32Array(dots * 3)
  for (let i = 0; i < dots; i++) {
    const a = (i / dots) * Math.PI * 2 + Math.random() * 0.2
    dp.set([Math.cos(a) * radius, 0, Math.sin(a) * radius], i * 3)
  }
  const dg = new THREE.BufferGeometry()
  dg.setAttribute('position', new THREE.BufferAttribute(dp, 3))
  const pts2 = new THREE.Points(
    dg,
    new THREE.PointsMaterial({
      color: new THREE.Color('#FFC466').multiplyScalar(1.6),
      size: 0.035,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  const g = new THREE.Group()
  g.add(line, pts2)
  return g
}

function arc(from: THREE.Vector3, to: THREE.Vector3) {
  const a = from.clone().normalize()
  const b = to.clone().normalize()
  const ang = a.angleTo(b)
  const N = 96
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const p = new THREE.Vector3()
      .addScaledVector(a, Math.sin((1 - t) * ang) / Math.sin(ang))
      .addScaledVector(b, Math.sin(t * ang) / Math.sin(ang))
    p.multiplyScalar(R * (1.01 + Math.sin(Math.PI * t) * 0.22 * (ang / Math.PI + 0.25)))
    pts.push(p)
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts)
  geo.setDrawRange(0, 0)
  return new THREE.Line(
    geo,
    new THREE.LineBasicMaterial({ color: new THREE.Color('#FFB84D').multiplyScalar(1.5), transparent: true, opacity: 0.9 }),
  )
}

export default function Globe() {
  const group = useRef<THREE.Group>(null!)
  const spin = useRef<THREE.Group>(null!)
  const beacon = useRef<THREE.Mesh>(null!)
  const pulse = useRef<THREE.Mesh>(null!)
  const { viewport, gl } = useThree()
  const [land, setLand] = useState<THREE.BufferGeometry | null>(null)

  useEffect(() => {
    let dead = false
    fetch(asset('models/land.bin'))
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        if (dead) return
        const src = new Float32Array(buf)
        const n = src.length / 2
        const pos = new Float32Array(n * 3)
        const seed = new Float32Array(n)
        for (let i = 0; i < n; i++) {
          ll(src[i * 2], src[i * 2 + 1], R * 1.004).toArray(pos, i * 3)
          seed[i] = Math.random()
        }
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
        setLand(g)
      })
    return () => {
      dead = true
    }
  }, [])

  const mats = useMemo(() => {
    const core = new THREE.ShaderMaterial({
      vertexShader: coreVert,
      fragmentShader: coreFrag,
      transparent: true,
      uniforms: { uOpacity: { value: 1 } },
    })
    const halo = new THREE.ShaderMaterial({
      vertexShader: coreVert,
      fragmentShader: haloFrag,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uOpacity: { value: 1 } },
    })
    const landM = new THREE.ShaderMaterial({
      vertexShader: landVert,
      fragmentShader: landFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uReveal: { value: 0 },
        uSize: { value: 0.085 * gl.domElement.height },
        uColor: { value: AMBER.clone() },
      },
    })
    return { core, halo, landM }
  }, [gl])

  const extras = useMemo(() => {
    // graticule
    const seg: number[] = []
    const push = (a: THREE.Vector3, b: THREE.Vector3) => seg.push(a.x, a.y, a.z, b.x, b.y, b.z)
    for (let lon = -180; lon < 180; lon += 30)
      for (let lat = -88; lat < 88; lat += 4) push(ll(lon, lat, R * 1.002), ll(lon, lat + 4, R * 1.002))
    for (let lat = -60; lat <= 60; lat += 30)
      for (let lon = -180; lon < 180; lon += 4) push(ll(lon, lat, R * 1.002), ll(lon + 4, lat, R * 1.002))
    const gg = new THREE.BufferGeometry()
    gg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3))
    const grat = new THREE.LineSegments(gg, new THREE.LineBasicMaterial({ color: AMBER, transparent: true, opacity: 0.1 }))

    const rings = [ring(R * 1.42, 22), ring(R * 1.62, 30), ring(R * 1.86, 16)]
    rings[0].rotation.set(0.35, 0, 0.18)
    rings[1].rotation.set(-0.22, 0, -0.32)
    rings[2].rotation.set(0.12, 0, 0.5)

    const home = ll(...COLOMBO)
    const arcs = CITIES.map((c) => arc(home, ll(...c)))
    return { grat, rings, arcs, home }
  }, [])

  // rotation that brings Colombo to face the camera
  const faceY = (-(90 + COLOMBO[0]) * Math.PI) / 180

  useFrame((state, dt) => {
    const g = group.current
    const p = fx.globe
    g.visible = p > 0.001
    if (!g.visible) return
    const t = state.clock.elapsedTime
    const e = 1 - Math.pow(1 - Math.min(1, p / 0.8), 3)

    const portrait = viewport.width < viewport.height * 1.15
    const fit = Math.min(1, viewport.width / (portrait ? 4.4 : 7.2))
    g.scale.setScalar((0.55 + 0.45 * e) * fit)
    g.position.set(portrait ? 0 : viewport.width * 0.2, (portrait ? 0.75 : 0) - (1 - e) * 3.2, 0)
    const k = 1 - Math.exp(-dt * 3)
    g.rotation.x += (0.2 - fx.my * 0.12 - g.rotation.x) * k
    g.rotation.z = -0.12
    spin.current.rotation.y = faceY + (1 - e) * 2.6 + fx.mx * 0.25 + Math.sin(t * 0.15) * 0.06

    mats.landM.uniforms.uTime.value = t
    mats.landM.uniforms.uReveal.value = Math.min(1, p / 0.7)
    mats.landM.uniforms.uSize.value = 0.03 * gl.domElement.height

    extras.rings.forEach((r, i) => {
      r.rotation.y = t * (0.12 + i * 0.05) * (i % 2 ? -1 : 1)
    })
    const draw = Math.max(0, (p - 0.55) / 0.45)
    extras.arcs.forEach((a, i) => {
      const local = Math.min(1, Math.max(0, draw * 1.6 - i * 0.08))
      a.geometry.setDrawRange(0, Math.floor(97 * local))
    })
    const s = 1 + (t % 2) * 2.2
    pulse.current.scale.setScalar(s)
    ;(pulse.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - (t % 2) / 2) * 0.9
    beacon.current.scale.setScalar(1 + Math.sin(t * 4) * 0.15)
  })

  const homeQ = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), extras.home.clone().normalize()),
    [extras],
  )

  return (
    <group ref={group} visible={false}>
      <mesh material={mats.halo} scale={1.22}>
        <sphereGeometry args={[R, 64, 64]} />
      </mesh>
      {extras.rings.map((r, i) => (
        <primitive key={i} object={r} />
      ))}
      <group ref={spin}>
        <mesh material={mats.core}>
          <sphereGeometry args={[R, 96, 96]} />
        </mesh>
        <primitive object={extras.grat} />
        {land && <points geometry={land} material={mats.landM} />}
        {extras.arcs.map((a, i) => (
          <primitive key={i} object={a} />
        ))}
        <group position={extras.home.clone().multiplyScalar(1.006)} quaternion={homeQ}>
          <mesh ref={beacon}>
            <circleGeometry args={[0.022, 24]} />
            <meshBasicMaterial color={[4, 2.4, 0.6]} toneMapped={false} />
          </mesh>
          <mesh ref={pulse}>
            <ringGeometry args={[0.03, 0.036, 48]} />
            <meshBasicMaterial color={[3, 1.8, 0.4]} transparent toneMapped={false} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
