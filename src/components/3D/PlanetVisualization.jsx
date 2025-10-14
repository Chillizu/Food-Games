import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Text } from '@react-three/drei'
import * as THREE from 'three'

// 星球组件
const Planet = ({ planetStatus, ...props }) => {
  const meshRef = useRef()
  const [time, setTime] = useState(0)
  const [targetScale, setTargetScale] = useState(1)
  const [currentScale, setCurrentScale] = useState(1)

  useFrame((state, delta) => {
    setTime(time + delta)
    
    if (meshRef.current) {
      // 旋转星球
      meshRef.current.rotation.y += delta * 0.1
      
      // 根据星球状态调整动画
      const targetScaleValue = 1 + Math.sin(time * 2) * 0.02
      setTargetScale(targetScaleValue)
      
      // 平滑缩放动画
      const newScale = currentScale + (targetScaleValue - currentScale) * 0.05
      setCurrentScale(newScale)
      meshRef.current.scale.setScalar(newScale)
      
      // 根据健康状态调整旋转速度
      const rotationSpeed = planetStatus.health === 'excellent' ? 0.15 :
                           planetStatus.health === 'good' ? 0.12 :
                           planetStatus.health === 'fair' ? 0.1 :
                           planetStatus.health === 'poor' ? 0.08 : 0.05
      meshRef.current.rotation.y += delta * rotationSpeed
    }
  })

  // 根据星球状态生成材质
  const getPlanetMaterial = () => {
    const colors = {
      excellent: '#22c55e',
      good: '#84cc16',
      fair: '#eab308',
      poor: '#f97316',
      critical: '#dc2626'
    }

    return new THREE.MeshPhongMaterial({
      color: colors[planetStatus.health] || '#22c55e',
      emissive: colors[planetStatus.health] || '#22c55e',
      emissiveIntensity: 0.2,
      shininess: 30,
      transparent: true,
      opacity: 0.9
    })
  }

  return (
    <group {...props}>
      <Sphere ref={meshRef} args={[1, 32, 32]}>
        <meshStandardMaterial material={getPlanetMaterial()} />
      </Sphere>
      
      {/* 星球大气层效果 */}
      <Sphere args={[1.1, 32, 32]} scale={1.1}>
        <meshBasicMaterial 
          color={planetStatus.color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* 星球表面细节 */}
      <Sphere args={[1.05, 32, 32]} scale={1.05}>
        <meshStandardMaterial 
          color={planetStatus.color}
          transparent
          opacity={0.3}
          wireframe
        />
      </Sphere>
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
        const radius = 1.3
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const floatY = 0.2 + Math.sin(time * 2 + index) * 0.05
        
        return (
          <group key={`animal-${index}`} position={[x, floatY, z]}>
            <Text
              fontSize={0.2}
              color={planetStatus.health === 'excellent' ? '#22c55e' : '#333'}
              anchorX="center"
              anchorY="middle"
            >
              {animal}
            </Text>
            {/* 动物周围的能量光环 */}
            {planetStatus.health === 'excellent' && (
              <mesh position={[0, 0, 0]}>
                <Sphere args={[0.15, 16, 16]} />
                <meshBasicMaterial
                  color="#22c55e"
                  transparent
                  opacity={0.3}
                  wireframe
                />
              </mesh>
            )}
          </group>
        )
      })}
      
      {/* 植物 - 添加生长动画 */}
      {planetStatus.plants.map((plant, index) => {
        const angle = (index / planetStatus.plants.length) * Math.PI * 2
        const radius = 1.2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const growthScale = 1 + Math.sin(time * 1.5 + index) * 0.1
        
        return (
          <group key={`plant-${index}`} position={[x, -0.3, z]} scale={[growthScale, growthScale, growthScale]}>
            <Text
              fontSize={0.15}
              color={planetStatus.health === 'excellent' ? '#22c55e' : '#16a34a'}
              anchorX="center"
              anchorY="middle"
            >
              {plant}
            </Text>
            {/* 植物周围的生长光环 */}
            {planetStatus.health === 'excellent' && (
              <mesh position={[0, 0, 0]}>
                <Sphere args={[0.1, 12, 12]} />
                <meshBasicMaterial
                  color="#22c55e"
                  transparent
                  opacity={0.4}
                  wireframe
                />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

// 星空背景
const StarField = ({ planetStatus }) => {
  const pointsRef = useRef()
  const [time, setTime] = useState(0)

  useEffect(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    
    for (let i = 0; i < 1500; i++) {
      vertices.push(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      )
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    
    if (pointsRef.current) {
      pointsRef.current.geometry.dispose()
      pointsRef.current.geometry = geometry
    }
  }, [])

  useFrame((state, delta) => {
    setTime(time + delta)
    
    if (pointsRef.current) {
      // 根据星球状态调整星星闪烁
      const twinkleSpeed = planetStatus.health === 'excellent' ? 3 :
                          planetStatus.health === 'good' ? 2.5 :
                          planetStatus.health === 'fair' ? 2 :
                          planetStatus.health === 'poor' ? 1.5 : 1
      
      const positions = pointsRef.current.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        const brightness = 0.5 + Math.sin(time * twinkleSpeed + i) * 0.5
        positions[i + 1] += Math.sin(time * 0.5 + i) * 0.001 // 轻微的上下浮动
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <pointsMaterial
        size={0.08}
        color={planetStatus.health === 'excellent' ? '#86efac' :
               planetStatus.health === 'good' ? '#4ade80' :
               planetStatus.health === 'fair' ? '#facc15' :
               planetStatus.health === 'poor' ? '#fb923c' : '#f87171'}
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  )
}

// 环境粒子效果
const EnvironmentParticles = ({ planetStatus }) => {
  const groupRef = useRef()
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // 创建环境粒子
    const newParticles = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ],
        velocity: [
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ],
        size: Math.random() * 0.1 + 0.05
      })
    }
    setParticles(newParticles)
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        if (child.position) {
          // 粒子运动
          child.position.x += particles[index]?.velocity[0] || 0
          child.position.y += particles[index]?.velocity[1] || 0
          child.position.z += particles[index]?.velocity[2] || 0
          
          // 边界检测
          if (Math.abs(child.position.x) > 5) particles[index].velocity[0] *= -1
          if (Math.abs(child.position.y) > 5) particles[index].velocity[1] *= -1
          if (Math.abs(child.position.z) > 5) particles[index].velocity[2] *= -1
          
          // 旋转
          child.rotation.x += delta * 0.2
          child.rotation.y += delta * 0.3
        }
      })
    }
  })

  // 根据星球状态选择粒子颜色
  const getParticleColor = () => {
    switch (planetStatus.health) {
      case 'excellent': return '#22c55e'
      case 'good': return '#84cc16'
      case 'fair': return '#eab308'
      case 'poor': return '#f97316'
      case 'critical': return '#dc2626'
      default: return '#22c55e'
    }
  }

  return (
    <group ref={groupRef}>
      {particles.map((particle) => (
        <mesh key={particle.id} position={particle.position}>
          <Sphere args={[particle.size, 8, 8]} />
          <meshBasicMaterial
            color={getParticleColor()}
            transparent
            opacity={0.6}
            wireframe
          />
        </mesh>
      ))}
    </group>
  )
}

// 主星球可视化组件
const PlanetVisualization = ({ planetStatus }) => {
  return (
    <div className="planet-visualization large">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        style={{
          background: planetStatus.health === 'excellent' ?
            'linear-gradient(to bottom, #0f172a, #1e293b)' :
            planetStatus.health === 'good' ?
            'linear-gradient(to bottom, #1a1a2e, #16213e)' :
            planetStatus.health === 'fair' ?
            'linear-gradient(to bottom, #334155, #475569)' :
            planetStatus.health === 'poor' ?
            'linear-gradient(to bottom, #475569, #64748b)' :
            'linear-gradient(to bottom, #64748b, #94a3b8)',
          width: '100%',
          height: '100%'
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ade80" />
        
        {/* 星空背景 */}
        <StarField planetStatus={planetStatus} />
        
        {/* 环境粒子效果 */}
        <EnvironmentParticles planetStatus={planetStatus} />
        
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
          autoRotateSpeed={planetStatus.health === 'excellent' ? 0.8 :
                          planetStatus.health === 'good' ? 0.6 :
                          planetStatus.health === 'fair' ? 0.5 :
                          planetStatus.health === 'poor' ? 0.4 : 0.3}
        />
        
        {/* 星球光晕效果 */}
        <mesh position={[0, 0, 0]}>
          <Sphere args={[1.2, 32, 32]} />
          <meshBasicMaterial
            color={planetStatus.color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      </Canvas>
    </div>
  )
}

export default PlanetVisualization