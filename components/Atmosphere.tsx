"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
function Field({ color }: { color: string }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(420 * 3);
    let seed = 71;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < a.length; i++) a[i] = (random() - 0.5) * 16;
    return a;
  }, []);
  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += Math.min(delta, 0.04) * 0.014;
      points.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.03) * 0.035;
    }
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.018}
        transparent
        opacity={0.38}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
export default function Atmosphere({ color }: { color: string }) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 70 }}
      aria-hidden="true"
    >
      <Field color={color} />
    </Canvas>
  );
}
