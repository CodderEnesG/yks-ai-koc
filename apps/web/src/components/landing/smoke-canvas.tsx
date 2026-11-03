'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { type RefObject, useEffect, useRef, useState } from 'react';
import { BufferAttribute, BufferGeometry, type ShaderMaterial, Vector2, Vector3 } from 'three';

// Lambanın ağzından çıkan WebGL duman (T40). Marka düz ve gradyansız: her parçacık keskin kenarlı, opak krem bir
// daire; üst üste binince kılavuzdaki gibi tek renkli bir duman silüeti oluşur. Duman 10° sağa yatık yükselir
// (kılavuz), fare ve kaydırma hızıyla "rüzgâr" alır; yoğunluğu kaydırdıkça artar (lamba yanar).
// Tuval yalnız ekrandayken çizer; ekran dışında döngü durur.

export interface SmokeControl {
  /** 0-1: aktif parçacık oranı. */
  intensity: number;
  /** -1…1: yatay sürüklenme. */
  wind: number;
}

const COUNT = 240;
// Ağız ucu, tuvalin kırpma koordinatlarında. Tuval lamba kutusunu solda %20, sağda %40, üstte %60 aşar (duman
// sağa yatık yükselir, kenarda kesilmesin); lamp-paths SPOUT'tan: x = (0.2 + 0.749) / 1.6, y = 1 - 2 × 1.0237 / 1.6.
const ORIGIN = new Vector2(0.186, -0.28);
const CREAM = new Vector3(246 / 255, 238 / 255, 224 / 255);

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uWind;
  uniform float uAspect;
  uniform float uPx;
  uniform vec2 uOrigin;
  attribute vec4 aSeed;

  void main() {
    float speed = 0.075 + aSeed.y * 0.015;
    float life = fract(aSeed.x + uTime * speed);
    float on = step(aSeed.z, uIntensity);
    float h = life * 1.2 * (0.75 + 0.35 * aSeed.w);
    float sway = sin(life * 4.2 - uTime * 0.8) * (0.01 + 0.1 * life) + (aSeed.w - 0.5) * 0.05 * life;
    float lean = h * 0.11;
    float wind = uWind * life * life * 0.5;
    vec2 p = vec2(uOrigin.x + (lean + sway + wind) / uAspect, uOrigin.y + h);
    gl_Position = vec4(p, 0.0, 1.0);
    float grow = smoothstep(0.0, 0.12, life) * (0.45 + 0.9 * life) * (1.0 - smoothstep(0.72, 1.0, life));
    float px = uPx * grow * (0.75 + 0.5 * aSeed.w) * on;
    // Doğarken çok küçük kalan parçacıklar toz gibi görünür; çizilmez.
    gl_PointSize = px < 4.0 ? 0.0 : px;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.47, 0.5, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

function makeGeometry() {
  const geometry = new BufferGeometry();
  const seeds = new Float32Array(COUNT * 4);
  for (let i = 0; i < COUNT; i++) {
    // Faz eşit aralıklı (+ küçük sapma): duman kesintisiz bir sütun olur, baloncuk kümelenmez.
    seeds[i * 4] = i / COUNT + Math.random() * 0.004;
    seeds[i * 4 + 1] = Math.random();
    seeds[i * 4 + 2] = Math.random();
    seeds[i * 4 + 3] = Math.random();
  }
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(COUNT * 3), 3));
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 4));
  return geometry;
}

function Particles({ control }: { control: RefObject<SmokeControl> }) {
  'use no memo';
  const material = useRef<ShaderMaterial>(null);
  const [geometry] = useState(makeGeometry);
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uIntensity: { value: 0.35 },
    uWind: { value: 0 },
    uAspect: { value: 1 },
    uPx: { value: 30 },
    uOrigin: { value: ORIGIN },
    uColor: { value: CREAM },
  }));
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    const target = control.current;
    const step = Math.min(delta, 0.05);
    u.uTime.value += step;
    u.uIntensity.value += (target.intensity - u.uIntensity.value) * Math.min(1, step * 3);
    u.uWind.value += (target.wind - u.uWind.value) * Math.min(1, step * 2);
    u.uAspect.value = size.width / Math.max(1, size.height);
    u.uPx.value = size.width * 0.06 * dpr;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function SmokeCanvas({
  control,
  onReady,
}: {
  control: RefObject<SmokeControl>;
  onReady: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none absolute -top-[60%] -left-[20%] h-[160%] w-[160%]">
      <Canvas
        flat
        linear
        dpr={[1, 1.5]}
        frameloop={visible ? 'always' : 'never'}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        onCreated={onReady}>
        <Particles control={control} />
      </Canvas>
    </div>
  );
}
