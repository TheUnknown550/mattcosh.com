"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

// A slower, calmer cadence than a literal resting heart rate — this is a
// stylised nod to "pulse", not a medically accurate reproduction.
const PULSE_CYCLE_SECONDS = 2.2;
const PULSE_ATTACK = 0.12;
const PULSE_SCALE = 0.12;
const BASE_ROTATION = { x: 0.4, y: 0.6 };

function heartbeatPulse(t: number) {
  if (t < PULSE_ATTACK) return t / PULSE_ATTACK;
  const decay = (t - PULSE_ATTACK) / (1 - PULSE_ATTACK);
  return Math.exp(-decay * 4);
}

/**
 * Signature hero object — a flat-shaded icosahedron that slowly rotates and
 * pulses on a heartbeat-like cadence, with a subtle parallax tilt toward the
 * cursor. All motion pauses for prefers-reduced-motion.
 */
export function HeroGeometry() {
  const meshRef = useRef<Mesh>(null);
  const reduceMotionRef = useRef(false);
  const spin = useRef({ x: BASE_ROTATION.x, y: BASE_ROTATION.y });
  const tilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = query.matches;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || reduceMotionRef.current) return;

    spin.current.x += delta * 0.1;
    spin.current.y += delta * 0.15;

    // Ease the tilt toward the pointer rather than snapping to it.
    const targetTiltX = state.pointer.y * 0.3;
    const targetTiltY = state.pointer.x * 0.3;
    tilt.current.x += (targetTiltX - tilt.current.x) * 0.04;
    tilt.current.y += (targetTiltY - tilt.current.y) * 0.04;

    meshRef.current.rotation.x = spin.current.x + tilt.current.x;
    meshRef.current.rotation.y = spin.current.y + tilt.current.y;

    const t = (state.clock.elapsedTime % PULSE_CYCLE_SECONDS) / PULSE_CYCLE_SECONDS;
    meshRef.current.scale.setScalar(1 + heartbeatPulse(t) * PULSE_SCALE);
  });

  return (
    <mesh ref={meshRef} rotation={[BASE_ROTATION.x, BASE_ROTATION.y, 0]}>
      <icosahedronGeometry args={[1.6, 0]} />
      <meshStandardMaterial color="#2dd9c9" flatShading />
    </mesh>
  );
}
