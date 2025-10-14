import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

// 星球组件
const Planet = ({ planetStatus, ...props }) => {
  const meshRef = useRef()
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(time + delta)
    
    if (meshRef.current) {
      // 根据健康状态调整旋转速度
      const rotationSpeed = planetStatus.health === 'excellent' ? 0.15 :
                           planetStatus.health === 'good' ? 0.12 :
                           planetStatus.health === 'fair' ? 0.1 :
                           planetStatus.health === 'poor' ? 0.08 : 0.05
      meshRef.current.rotation.y += delta * rotationSpeed
    }
  })

  const colors = {
    excellent: '#4ade80',
    good: '#22c55e',
    fair: '#84cc16',
    poor: '#eab308',
    critical: '#f97316'
  }
  const targetColor = colors[planetStatus.health] || '#4ade80'

  const { color } = useSpring({
    color: targetColor,
    config: { duration: 1500 }
  })

  return (
    <group {...props}>
      <animated.mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <animated.meshToonMaterial color={color} />
      </animated.mesh>
    </group>
  )
}

// 生态系统组件
const Ecosystem = ({ planetStatus, ...props }) => {
  const groupRef = useRef()
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(time + delta)
    
    if (groupRef.current) {
      // 根据星球状态调整旋转速度
      const rotationSpeed = planetStatus.health === 'excellent' ? 0.01 :
                           planetStatus.health === 'good' ? 0.008 :
                           planetStatus.health === 'fair' ? 0.005 :
                           planetStatus.health === 'poor' ? 0.003 : 0.001
      groupRef.current.rotation.y += delta * rotationSpeed
    }
  })

  return (
    <group ref={groupRef} {...props}>
      {/* 动物 - 添加浮动动画 */}
      {planetStatus.animals.map((animal, index) => {
        const angle = (index / planetStatus.animals.length) * Math.PI * 2
        const radius = 1.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const floatY = 0.2 + Math.sin(time * 2 + index) * 0.05
        
        const spring = useSpring({
          from: { scale: 0, opacity: 0 },
          to: { scale: 1, opacity: 1 },
          delay: 500 + index * 200,
        })
        return (
          <animated.group
            key={`animal-${index}`}
            position={[x, floatY, z]}
            scale={spring.scale}
            opacity={spring.opacity}
          >
            <Text
              fontSize={0.2}
              color="#64748b"
              anchorX="center"
              anchorY="middle"
            >
              {animal}
            </Text>
          </animated.group>
        )
      })}
      
      {/* 植物 - 添加生长动画 */}
      {planetStatus.plants.map((plant, index) => {
        const angle = (index / planetStatus.plants.length) * Math.PI * 2
        const radius = 1.4
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        const spring = useSpring({
          from: { scale: 0, opacity: 0 },
          to: { scale: 1, opacity: 1 },
          delay: 1000 + index * 150,
        })
        return (
          <animated.group
            key={`plant-${index}`}
            position={[x, -0.3, z]}
            scale={spring.scale}
            opacity={spring.opacity}
          >
            <Text
              fontSize={0.15}
              color="#64748b"
              anchorX="center"
              anchorY="middle"
            >
              {plant}
            </Text>
          </animated.group>
        )
      })}
    </group>
  )
}

// 主星球可视化组件
const PlanetVisualization = ({ planetStatus }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{
        background: 'var(--color-background)',
        width: '100%',
        height: '100%'
      }}
    >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        
        {/* 主星球 */}
        <Planet planetStatus={planetStatus} position={[0, 0, 0]} />
        
        {/* 生态系统 */}
        <Ecosystem planetStatus={planetStatus} />
        
        {/* 轨道控制器 */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
  )
}

export default PlanetVisualization