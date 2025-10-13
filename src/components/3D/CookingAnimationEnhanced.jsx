import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Text, Box, Cylinder, Cone } from '@react-three/drei'
import * as THREE from 'three'

// 增强版食材粒子组件
const FoodParticle = ({ food, position, targetPosition, isMoving, ...props }) => {
  const meshRef = useRef()
  const [velocity] = useState([
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02
  ])
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(time + delta)
    
    if (meshRef.current) {
      if (isMoving && targetPosition) {
        // 向目标位置移动
        const dx = targetPosition[0] - meshRef.current.position.x
        const dy = targetPosition[1] - meshRef.current.position.y
        const dz = targetPosition[2] - meshRef.current.position.z
        
        // 使用缓动函数
        const easeFactor = 0.05
        meshRef.current.position.x += dx * easeFactor
        meshRef.current.position.y += dy * easeFactor
        meshRef.current.position.z += dz * easeFactor
        
        // 添加螺旋运动效果
        const spiralAngle = time * 2
        const spiralRadius = 0.1
        meshRef.current.position.x += Math.cos(spiralAngle) * spiralRadius * delta
        meshRef.current.position.z += Math.sin(spiralAngle) * spiralRadius * delta
      } else {
        // 自由漂浮运动
        meshRef.current.position.x += velocity[0]
        meshRef.current.position.y += velocity[1]
        meshRef.current.position.z += velocity[2]
        
        // 边界检测
        if (Math.abs(meshRef.current.position.x) > 2) velocity[0] *= -1
        if (Math.abs(meshRef.current.position.y) > 1 || Math.abs(meshRef.current.position.y) < -1) velocity[1] *= -1
        if (Math.abs(meshRef.current.position.z) > 2) velocity[2] *= -1
      }
      
      // 旋转
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
      
      // 脉冲效果
      const pulseScale = 1 + Math.sin(time * 3) * 0.1
      meshRef.current.scale.setScalar(pulseScale)
      
      // 发光效果
      const emissiveIntensity = 0.3 + Math.sin(time * 4) * 0.2
      if (meshRef.current.material) {
        meshRef.current.material.emissiveIntensity = emissiveIntensity
      }
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

// 增强版烹饪器具
const CookingPot = () => {
  const meshRef = useRef()
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(time + delta)
    
    if (meshRef.current) {
      // 轻微的摇摆动画
      meshRef.current.rotation.z = Math.sin(time * 2) * 0.05
      
      // 锅体轻微上下浮动
      meshRef.current.position.y = Math.sin(time * 1.5) * 0.02
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
      
      {/* 增强版蒸汽效果 */}
      <group position={[0, 0.5, 0]}>
        {[...Array(8)].map((_, i) => {
          const delay = i * 0.5
          return (
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
          )
        })}
      </group>
      
      {/* 锅体热气效果 */}
      <group position={[0, 0.2, 0]}>
        {[...Array(3)].map((_, i) => (
          <mesh key={i} position={[0, i * 0.1, 0]}>
            <Sphere args={[0.3, 8, 8]} />
            <meshBasicMaterial 
              color="white" 
              transparent
              opacity={0.1}
              side={THREE.BackSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// 增强版火焰效果
const FlameEffect = () => {
  const groupRef = useRef()
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(time + delta)
    
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        // 动态火焰效果
        const flameHeight = 0.5 + Math.sin(time * 3 + index) * 0.2
        const flameScale = 1 + Math.sin(time * 4 + index) * 0.3
        const flamePosition = Math.sin(time * 2 + index) * 0.1
        
        child.scale.setScalar(flameScale)
        child.position.y = flamePosition + index * 0.1
        child.scale.y = flameHeight
      })
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.8, 0]}>
      {/* 多层火焰 */}
      {[...Array(5)].map((_, i) => (
        <Cone
          key={i}
          args={[0.2 - i * 0.03, 0.5, 8]}
          position={[0, i * 0.08, 0]}
        >
          <meshBasicMaterial 
            color={['#ff6b35', '#f7931e', '#ffcc02', '#fff3b8', '#ffffff'][i]}
            transparent
            opacity={0.8 - i * 0.1}
          />
        </Cone>
      ))}
      
      {/* 火焰粒子效果 */}
      {[...Array(10)].map((_, i) => (
        <Sphere
          key={`particle-${i}`}
          args={[0.02, 6, 6]}
          position={[
            (Math.random() - 0.5) * 0.2,
            Math.random() * 0.3,
            (Math.random() - 0.5) * 0.2
          ]}
        >
          <meshBasicMaterial 
            color="#ffcc02"
            transparent
            opacity={0.6}
          />
        </Sphere>
      ))}
    </group>
  )
}

// 烹饪烟雾效果
const SmokeEffect = () => {
  const groupRef = useRef()
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // 创建烟雾粒子
    const newParticles = []
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 0.5,
          Math.random() * 0.5,
          (Math.random() - 0.5) * 0.5
        ],
        velocity: [
          (Math.random() - 0.5) * 0.01,
          Math.random() * 0.02 + 0.01,
          (Math.random() - 0.5) * 0.01
        ],
        size: Math.random() * 0.1 + 0.05,
        opacity: Math.random() * 0.3 + 0.1
      })
    }
    setParticles(newParticles)
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        if (child.position && particles[index]) {
          // 烟雾上升和扩散
          child.position.x += particles[index].velocity[0]
          child.position.y += particles[index].velocity[1]
          child.position.z += particles[index].velocity[2]
          
          // 烟雾逐渐变大变透明
          const scale = child.scale.x + delta * 0.1
          child.scale.setScalar(scale)
          
          // 重置位置
          if (child.position.y > 2) {
            child.position.y = 0
            child.position.x = (Math.random() - 0.5) * 0.5
            child.position.z = (Math.random() - 0.5) * 0.5
            child.scale.setScalar(0.05)
          }
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {particles.map((particle) => (
        <mesh key={particle.id} position={particle.position}>
          <Sphere args={[particle.size, 8, 8]} />
          <meshBasicMaterial 
            color="#cccccc"
            transparent
            opacity={particle.opacity}
          />
        </mesh>
      ))}
    </group>
  )
}

// 增强版烹饪动画主组件
const CookingAnimationEnhanced = ({ selectedFoods, onCookingComplete }) => {
  const [particles, setParticles] = useState([])
  const [cookingProgress, setCookingProgress] = useState(0)
  const [isCooking, setIsCooking] = useState(true)
  const [time, setTime] = useState(0)

  useEffect(() => {
    // 创建食材粒子
    const newParticles = selectedFoods.map((food, index) => ({
      id: food.id,
      food,
      position: [
        (Math.random() - 0.5) * 3,
        Math.random() * 2 - 1,
        (Math.random() - 0.5) * 3
      ],
      targetPosition: [
        (Math.random() - 0.5) * 0.5,
        Math.random() * 0.5 - 0.5,
        (Math.random() - 0.5) * 0.5
      ],
      isMoving: false
    }))
    setParticles(newParticles)
    
    // 开始烹饪动画
    let progress = 0
    const cookingInterval = setInterval(() => {
      progress += 2
      setCookingProgress(progress)
      
      if (progress >= 100) {
        clearInterval(cookingInterval)
        setIsCooking(false)
        if (onCookingComplete) {
          onCookingComplete()
        }
      }
    }, 100)
    
    return () => clearInterval(cookingInterval)
  }, [selectedFoods, onCookingComplete])

  useFrame((state, delta) => {
    setTime(time + delta)
    
    // 更新粒子状态
    if (isCooking && particles.length > 0) {
      const updatedParticles = particles.map((particle, index) => {
        // 延迟开始移动
        const moveDelay = index * 200
        const shouldMove = cookingProgress > moveDelay
        
        return {
          ...particle,
          isMoving: shouldMove
        }
      })
      setParticles(updatedParticles)
    }
  })

  return (
    <div className="cooking-animation enhanced">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ 
          background: 'linear-gradient(to bottom, #2c1810, #8b4513)',
          position: 'relative'
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={1} color="#ff6b35" />
        <pointLight position={[0, -5, 0]} intensity={0.5} color="#4ade80" />
        
        {/* 烹饪器具 */}
        <CookingPot />
        
        {/* 火焰效果 */}
        <FlameEffect />
        
        {/* 烹饪烟雾效果 */}
        <SmokeEffect />
        
        {/* 食材粒子 */}
        {particles.map((particle) => (
          <FoodParticle
            key={particle.id}
            food={particle.food}
            position={particle.position}
            targetPosition={particle.targetPosition}
            isMoving={particle.isMoving}
          />
        ))}
        
        {/* 烹饪进度文字 */}
        <Text
          position={[0, 2, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          🍳 烹饪中... {cookingProgress}%
        </Text>
        
        {/* 烹饪完成提示 */}
        {!isCooking && (
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.4}
            color="#22c55e"
            anchorX="center"
            anchorY="middle"
          >
            ✨ 烹饪完成！
          </Text>
        )}
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* 烹饪进度条 */}
      <div className="cooking-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${cookingProgress}%`,
              background: `linear-gradient(to right, #ff6b35, #f7931e, #ffcc02)`
            }}
          />
        </div>
        <div className="progress-text">
          烹饪进度: {cookingProgress}%
        </div>
      </div>
    </div>
  )
}

export default CookingAnimationEnhanced