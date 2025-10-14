import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Text, Box, Cylinder, Cone } from '@react-three/drei'
import * as THREE from 'three'

// 食材粒子组件
const FoodParticle = ({ food, position, ...props }) => {
  const meshRef = useRef()
  const [velocity] = useState([
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02
  ])

  useFrame((state, delta) => {
    if (meshRef.current) {
      // 粒子运动
      meshRef.current.position.x += velocity[0]
      meshRef.current.position.y += velocity[1]
      meshRef.current.position.z += velocity[2]
      
      // 边界检测
      if (Math.abs(meshRef.current.position.x) > 2) velocity[0] *= -1
      if (meshRef.current.position.y > 1 || meshRef.current.position.y < -1) velocity[1] *= -1
      if (Math.abs(meshRef.current.position.z) > 2) velocity[2] *= -1
      
      // 旋转
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  // 根据食材类型创建不同的几何体
  const getGeometry = () => {
    switch (food.category) {
      case 'plant':
        return <Sphere args={[0.1, 8, 8]} />
      case 'animal':
        return <Box args={[0.15, 0.15, 0.15]} />
      case 'insect':
        return <Sphere args={[0.08, 6, 6]} />
      case 'lab':
        return <Box args={[0.12, 0.12, 0.12]} />
      default:
        return <Sphere args={[0.1, 8, 8]} />
    }
  }

  return (
    <group position={position} {...props}>
      <mesh ref={meshRef}>
        {getGeometry()}
        <meshStandardMaterial 
          color={food.color} 
          emissive={food.color}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* 食材图标 */}
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {food.emoji}
      </Text>
    </group>
  )
}

// 烹饪器具
const CookingPot = () => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      // 轻微的摇摆动画
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group ref={meshRef}>
      {/* 锅体 */}
      <Cylinder args={[0.8, 1, 0.8, 32]} position={[0, -0.4, 0]}>
        <meshStandardMaterial 
          color="#8b4513" 
          metalness={0.3}
          roughness={0.7}
        />
      </Cylinder>
      
      {/* 锅盖 */}
      <Cylinder args={[0.85, 0.85, 0.1, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#a0522d" 
          metalness={0.4}
          roughness={0.6}
        />
      </Cylinder>
      
      {/* 蒸汽效果 */}
      <group position={[0, 0.5, 0]}>
        {[...Array(5)].map((_, i) => (
          <Sphere
            key={i}
            args={[0.05, 8, 8]}
            position={[
              (Math.random() - 0.5) * 0.3,
              Math.random() * 0.5,
              (Math.random() - 0.5) * 0.3
            ]}
          >
            <meshBasicMaterial 
              color="white" 
              transparent
              opacity={0.6}
            />
          </Sphere>
        ))}
      </group>
    </group>
  )
}

// 火焰效果
const FlameEffect = () => {
  const groupRef = useRef()
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(time + delta)
    
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        const scale = 1 + Math.sin(time * 3 + index) * 0.2
        child.scale.setScalar(scale)
        child.position.y = Math.sin(time * 2 + index) * 0.1
      })
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.8, 0]}>
      {[...Array(3)].map((_, i) => (
        <Cone
          key={i}
          args={[0.2, 0.5, 8]}
          position={[0, i * 0.1, 0]}
        >
          <meshBasicMaterial 
            color={['#ff6b35', '#f7931e', '#ffcc02'][i]}
            transparent
            opacity={0.8}
          />
        </Cone>
      ))}
    </group>
  )
}

// 烹饪动画主组件
const CookingAnimation = ({ selectedFoods }) => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // 创建食材粒子
    const newParticles = selectedFoods.map((food, index) => ({
      id: food.id,
      food,
      position: [
        (Math.random() - 0.5) * 3,
        Math.random() * 2 - 1,
        (Math.random() - 0.5) * 3
      ]
    }))
    setParticles(newParticles)
  }, [selectedFoods])

  return (
    <div className="cooking-animation">
      <div className="animation-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          style={{
            background: 'linear-gradient(to bottom, #2c1810, #8b4513)',
            width: '100%',
            height: '100%'
          }}
        >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={1} color="#ff6b35" />
        <pointLight position={[0, -5, 0]} intensity={0.5} color="#4ade80" />
        
        {/* 烹饪器具 */}
        <CookingPot />
        
        {/* 火焰效果 */}
        <FlameEffect />
        
        {/* 食材粒子 */}
        {particles.map((particle) => (
          <FoodParticle
            key={particle.id}
            food={particle.food}
            position={particle.position}
          />
        ))}
        
        {/* 烹饪文字 */}
        <Text
          position={[0, 2, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          🍳 烹饪中...
        </Text>
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      </div>
    </div>
  )
}

export default CookingAnimation