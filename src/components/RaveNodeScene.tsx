import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { memo, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  FINGER_CONTROLS,
  LEFT_CONTROLS,
  RIGHT_CONTROLS,
  CONTROL_BY_KEY,
  type ControlKey,
  type DetectedHand,
  type FingerControl,
} from '../domain/raveControls'
import type { MusicPreset } from '../domain/musicPresets'
import type { VisualPreset } from '../domain/visualPresets'
import { getConnectedChord } from '../utils/harmony'

type RaveNodeSceneProps = {
  activeKeys: ControlKey[]
  hands: DetectedHand[]
  preset: MusicPreset
  visualPreset: VisualPreset
}

export const RaveNodeScene = memo(function RaveNodeScene({
  activeKeys,
  hands,
  preset,
  visualPreset,
}: RaveNodeSceneProps) {
  const activeSet = useMemo(() => new Set(activeKeys), [activeKeys])
  const leftActive = useMemo(
    () => LEFT_CONTROLS.filter((control) => activeSet.has(control.key)),
    [activeSet],
  )
  const rightActive = useMemo(
    () => RIGHT_CONTROLS.filter((control) => activeSet.has(control.key)),
    [activeSet],
  )
  const bridgeLines = useMemo(
    () =>
      leftActive.flatMap((left) =>
        rightActive.map((right) => ({
          color: right.color,
          key: `${left.key}-${right.key}`,
          left,
          right,
        })),
      ),
    [leftActive, rightActive],
  )
  const connectedChord = useMemo(
    () => getConnectedChord(activeKeys, hands, preset),
    [activeKeys, hands, preset],
  )
  const connectedLeft = connectedChord
    ? CONTROL_BY_KEY.get(connectedChord.leftKey)
    : undefined
  const connectedRight = connectedChord
    ? CONTROL_BY_KEY.get(connectedChord.rightKey)
    : undefined
  const energy = useMemo(
    () =>
      Math.min(
        1,
        activeKeys.length / 7 +
          hands.length * 0.12 +
          (connectedChord?.complexity ?? 0) * 0.035,
      ),
    [activeKeys.length, connectedChord, hands.length],
  )
  const influence = useMemo(() => getHandInfluence(hands), [hands])

  return (
    <group>
      <RaveBackdrop energy={energy} visualPreset={visualPreset} />
      <EnergyCore energy={energy} visualPreset={visualPreset} />

      <ReactiveNodes activeSet={activeSet} />

      {FINGER_CONTROLS.map((item) => (
        <Line
          color={activeSet.has(item.key) ? item.color : '#263244'}
          key={item.key}
          lineWidth={activeSet.has(item.key) ? 1.8 : 0.7}
          opacity={activeSet.has(item.key) ? 0.58 : 0.18}
          points={[
            item.side === 'Left' ? [-1.05, -0.25, -0.35] : [1.05, -0.25, -0.35],
            item.position,
          ]}
          transparent
        />
      ))}

      {bridgeLines.map((line) => (
        <InfluenceBridge
          color={line.color}
          key={line.key}
          left={line.left}
          lift={influence.lift}
          opacity={0.46 + influence.lift * 0.32}
          right={line.right}
          width={1.7 + activeKeys.length * 0.2}
        />
      ))}

      {connectedLeft && connectedRight ? (
        <>
          <InfluenceBridge
            color="#ffffff"
            left={connectedLeft}
            lift={influence.lift + (connectedChord?.complexity ?? 0) * 0.035}
            opacity={0.94}
            right={connectedRight}
            width={4.5 + (connectedChord?.complexity ?? 0) * 0.42}
          />
          <ChordBeads
            complexity={connectedChord?.complexity ?? 0}
            left={connectedLeft}
            lift={influence.lift}
            right={connectedRight}
            visualPreset={visualPreset}
          />
        </>
      ) : null}

      <DriftParticles
        activeCount={activeKeys.length}
        visualPreset={visualPreset}
      />
    </group>
  )
})

function EnergyCore({
  energy,
  visualPreset,
}: {
  energy: number
  visualPreset: VisualPreset
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const mesh = meshRef.current

    if (!mesh) {
      return
    }

    mesh.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3.5) * 0.08)
  })

  return (
    <mesh position={[0, -0.25, -0.35]} ref={meshRef}>
      <sphereGeometry args={[0.08 + energy * 0.05, 24, 24]} />
      <meshStandardMaterial
        color="#f8fbff"
        emissive={visualPreset.primary}
        emissiveIntensity={0.35 + energy * 0.7}
        metalness={0.1}
        roughness={0.28}
      />
    </mesh>
  )
}

function RaveBackdrop({
  energy,
  visualPreset,
}: {
  energy: number
  visualPreset: VisualPreset
}) {
  return (
    <group>
      <NeonFloor energy={energy} visualPreset={visualPreset} />
      <LaserFan energy={energy} visualPreset={visualPreset} />
      <PulseHalo energy={energy} visualPreset={visualPreset} />
    </group>
  )
}

function NeonFloor({
  energy,
  visualPreset,
}: {
  energy: number
  visualPreset: VisualPreset
}) {
  const groupRef = useRef<THREE.Group>(null)
  const floorLines = useMemo(() => {
    const lines: Array<{
      key: string
      points: [[number, number, number], [number, number, number]]
    }> = []

    for (let index = -8; index <= 8; index += 1) {
      lines.push({
        key: `x-${index}`,
        points: [
          [-8, -2.25, index * 0.45],
          [8, -2.25, index * 0.45],
        ],
      })
      lines.push({
        key: `z-${index}`,
        points: [
          [index * 0.75, -2.25, -3.8],
          [index * 0.75, -2.25, 3.8],
        ],
      })
    }

    return lines
  }, [])

  useFrame(({ clock }) => {
    const group = groupRef.current

    if (!group) {
      return
    }

    group.position.z = Math.sin(clock.elapsedTime * 0.65) * 0.08
  })

  return (
    <group ref={groupRef} rotation={[-0.32, 0, 0]}>
      {floorLines.map((line, index) => (
        <Line
          color={index % 2 === 0 ? visualPreset.primary : visualPreset.secondary}
          key={line.key}
          lineWidth={0.7 + energy * 0.45}
          opacity={(0.11 + energy * 0.12) * visualPreset.gridOpacity}
          points={line.points}
          transparent
        />
      ))}
    </group>
  )
}

function LaserFan({
  energy,
  visualPreset,
}: {
  energy: number
  visualPreset: VisualPreset
}) {
  const groupRef = useRef<THREE.Group>(null)
  const beams = useMemo(
    () => [
      {
        color: visualPreset.secondary,
        points: [
          [-6.8, -1.55, -1.6],
          [-1.15, 1.85, -0.6],
          [4.8, -1.1, -1.4],
        ] as Array<[number, number, number]>,
      },
      {
        color: visualPreset.primary,
        points: [
          [6.4, -1.45, -1.8],
          [1.2, 1.75, -0.55],
          [-4.9, -0.9, -1.3],
        ] as Array<[number, number, number]>,
      },
      {
        color: visualPreset.accent,
        points: [
          [-5.4, 1.15, -2.4],
          [0, -0.1, -0.9],
          [5.7, 1.3, -2.3],
        ] as Array<[number, number, number]>,
      },
    ],
    [visualPreset],
  )

  useFrame(({ clock }) => {
    const group = groupRef.current

    if (!group) {
      return
    }

    group.rotation.z = Math.sin(clock.elapsedTime * 0.45) * 0.035
  })

  return (
    <group ref={groupRef}>
      {beams.map((beam) => (
        <Line
          color={beam.color}
          key={beam.color}
          lineWidth={1.3 + energy * 1.7}
          opacity={(0.18 + energy * 0.22) * visualPreset.laserOpacity}
          points={beam.points}
          transparent
        />
      ))}
    </group>
  )
}

function PulseHalo({
  energy,
  visualPreset,
}: {
  energy: number
  visualPreset: VisualPreset
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const mesh = meshRef.current

    if (!mesh) {
      return
    }

    const pulse = 1 + Math.sin(clock.elapsedTime * 2.2) * 0.08
    mesh.scale.set(pulse, pulse, 1)
    mesh.rotation.z += 0.002
  })

  return (
    <mesh position={[0, -0.2, -1.15]} ref={meshRef}>
      <ringGeometry
        args={[
          1.8 + energy * 0.5 * visualPreset.pulseScale,
          1.84 + energy * 0.5 * visualPreset.pulseScale,
          96,
        ]}
      />
      <meshBasicMaterial
        blending={THREE.AdditiveBlending}
        color={visualPreset.primary}
        opacity={0.12 + energy * 0.1}
        transparent
      />
    </mesh>
  )
}

function InfluenceBridge({
  color,
  left,
  lift,
  opacity,
  right,
  width,
}: {
  color: string
  left: FingerControl
  lift: number
  opacity: number
  right: FingerControl
  width: number
}) {
  const points = useMemo(
    () => getArcPoints(left.position, right.position, lift),
    [left.position, lift, right.position],
  )

  return (
    <Line
      color={color}
      lineWidth={width}
      opacity={opacity}
      points={points}
      transparent
    />
  )
}

function ChordBeads({
  complexity,
  left,
  lift,
  right,
  visualPreset,
}: {
  complexity: number
  left: FingerControl
  lift: number
  right: FingerControl
  visualPreset: VisualPreset
}) {
  const beadCount = Math.min(8, Math.max(3, complexity))
  const arcPoints = useMemo(
    () => getArcPoints(left.position, right.position, lift + 0.08),
    [left.position, lift, right.position],
  )

  return (
    <group>
      {Array.from({ length: beadCount }, (_, index) => {
        const pointIndex = Math.round(((index + 1) / (beadCount + 1)) * 18)
        const point = arcPoints[Math.min(pointIndex, arcPoints.length - 1)]

        return (
          <InfluenceBead
            index={index}
            key={`${left.key}-${right.key}-bead-${index}`}
            position={point}
            visualPreset={visualPreset}
          />
        )
      })}
    </group>
  )
}

function InfluenceBead({
  index,
  position,
  visualPreset,
}: {
  index: number
  position: [number, number, number]
  visualPreset: VisualPreset
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const mesh = meshRef.current

    if (!mesh) {
      return
    }

    const pulse = 1 + Math.sin(clock.elapsedTime * 5.5 + index) * 0.18
    mesh.scale.setScalar(pulse)
    mesh.rotation.y += 0.025
  })

  return (
    <mesh position={position} ref={meshRef}>
      <sphereGeometry args={[0.075, 18, 18]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive={visualPreset.accent}
        emissiveIntensity={1.65}
        metalness={0.18}
        roughness={0.2}
      />
    </mesh>
  )
}

function ReactiveNodes({ activeSet }: { activeSet: Set<ControlKey> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])

  useEffect(() => {
    const mesh = meshRef.current

    if (!mesh) {
      return
    }

    FINGER_CONTROLS.forEach((item, index) => {
      color.set(activeSet.has(item.key) ? item.color : '#263244')
      mesh.setColorAt(index, color)
    })

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true
    }
  }, [activeSet, color])

  useFrame(({ clock }) => {
    const mesh = meshRef.current

    if (!mesh) {
      return
    }

    const time = clock.elapsedTime

    FINGER_CONTROLS.forEach((item, index) => {
      const isActive = activeSet.has(item.key)
      const base = item.position
      const pulse = isActive ? 1.42 + Math.sin(time * 8 + index) * 0.1 : 1

      dummy.position.set(
        base[0],
        base[1] + Math.sin(time * 2.1 + index * 0.6) * 0.08,
        base[2],
      )
      dummy.rotation.set(
        time * (0.22 + index * 0.01),
        time * (isActive ? 0.62 : 0.28),
        0,
      )
      dummy.scale.setScalar(pulse)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      args={[undefined, undefined, FINGER_CONTROLS.length]}
      ref={meshRef}
    >
      <icosahedronGeometry args={[0.22, 2]} />
      <meshStandardMaterial
        emissive="#182236"
        emissiveIntensity={0.85}
        metalness={0.28}
        roughness={0.24}
        vertexColors
      />
    </instancedMesh>
  )
}

function DriftParticles({
  activeCount,
  visualPreset,
}: {
  activeCount: number
  visualPreset: VisualPreset
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const particleCount = Math.round(220 * visualPreset.particleDensity)
    const values = new Float32Array(particleCount * 3)

    for (let index = 0; index < particleCount; index += 1) {
      values[index * 3] = (seededNoise(index, 1) - 0.5) * 8.4
      values[index * 3 + 1] = (seededNoise(index, 2) - 0.5) * 4.8
      values[index * 3 + 2] = (seededNoise(index, 3) - 0.5) * 5.2
    }

    return values
  }, [visualPreset.particleDensity])

  useFrame(({ clock }) => {
    const points = pointsRef.current

    if (!points) {
      return
    }

    points.rotation.y = clock.elapsedTime * (0.045 + activeCount * 0.017)
    points.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={activeCount > 0 ? visualPreset.particle : '#f8fbff'}
        opacity={0.28 + activeCount * 0.065}
        size={0.026 + activeCount * 0.002}
        transparent
      />
    </points>
  )
}

function seededNoise(index: number, channel: number) {
  const value = Math.sin(index * 18.17 + channel * 91.91) * 10000

  return value - Math.floor(value)
}

function getArcPoints(
  from: [number, number, number],
  to: [number, number, number],
  lift: number,
) {
  const points: Array<[number, number, number]> = []
  const arcHeight = 0.38 + lift * 1.15

  for (let index = 0; index <= 20; index += 1) {
    const t = index / 20
    const bend = Math.sin(t * Math.PI) * arcHeight
    points.push([
      lerp(from[0], to[0], t),
      lerp(from[1], to[1], t) + bend,
      lerp(from[2], to[2], t) + Math.sin(t * Math.PI) * 0.32,
    ])
  }

  return points
}

function getHandInfluence(hands: DetectedHand[]) {
  if (hands.length === 0) {
    return { lift: 0.12 }
  }

  const averageY =
    hands.reduce((total, hand) => total + hand.center[1], 0) / hands.length

  return { lift: Math.max(0.08, Math.min(1, 1 - averageY)) }
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress
}
