import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Box } from '@react-three/drei'
import * as THREE from 'three'

// 3D卡牌组件
const Card3D = ({ food, isSelected, onClick, position, rotation }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // 轻微的浮动动画
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
      
      // 选中状态的特殊动画
      if (isSelected) {
        meshRef.current.rotation.y += delta * 0.5
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 3) * 0.02
      }
      
      // 悬停效果
      if (hovered && !isSelected) {
        meshRef.current.scale.setScalar(1.1)
      } else if (!isSelected) {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  const handleClick = () => {
    onClick()
  }

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {/* 卡牌正面 */}
        <Box args={[1, 1.4, 0.05]}>
          <meshStandardMaterial
            color={isSelected ? food.color : '#ffffff'}
            metalness={0.1}
            roughness={0.3}
            emissive={isSelected ? food.color : '#000000'}
            emissiveIntensity={isSelected ? 0.2 : 0}
          />
        </Box>
        
        {/* 卡牌边框 */}
        <Box args={[1.05, 1.45, 0.06]} position={[0, 0, -0.005]}>
          <meshStandardMaterial
            color={food.color}
            metalness={0.3}
            roughness={0.2}
          />
        </Box>
        
        {/* 卡牌背面 */}
        <Box args={[1, 1.4, 0.05]} position={[0, 0, -0.05]}>
          <meshStandardMaterial
            color="#f0f0f0"
            metalness={0.1}
            roughness={0.8}
          />
        </Box>
      </mesh>
      
      {/* 3D文字 - 食材名称 */}
      <Text
        position={[0, 0.3, 0.04]}
        fontSize={0.15}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
      >
        {food.name}
      </Text>
      
      {/* 3D图标 - 食材emoji */}
      <Text
        position={[0, 0, 0.04]}
        fontSize={0.3}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
      >
        {food.emoji}
      </Text>
      
      {/* 环保指标 */}
      <group position={[0, -0.4, 0.04]}>
        {/* 碳排放 */}
        <group position={[-0.3, 0, 0]}>
          <Text fontSize={0.08} color="#dc2626" anchorX="center" anchorY="middle">
            🌍
          </Text>
          <Text
            position={[0, -0.1, 0]}
            fontSize={0.06}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round(food.carbonFootprint * 100)}%
          </Text>
        </group>
        
        {/* 水资源 */}
        <group position={[0, 0, 0]}>
          <Text fontSize={0.08} color="#06b6d4" anchorX="center" anchorY="middle">
            💧
          </Text>
          <Text
            position={[0, -0.1, 0]}
            fontSize={0.06}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round(food.waterUsage * 100)}%
          </Text>
        </group>
        
        {/* 健康度 */}
        <group position={[0.3, 0, 0]}>
          <Text fontSize={0.08} color="#22c55e" anchorX="center" anchorY="middle">
            ❤️
          </Text>
          <Text
            position={[0, -0.1, 0]}
            fontSize={0.06}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round(food.healthScore * 100)}%
          </Text>
        </group>
      </group>
      
      {/* 选中指示器 */}
      {isSelected && (
        <group position={[0, 0, 0.1]}>
          <Box args={[1.2, 1.6, 0.02]}>
            <meshStandardMaterial
              color={food.color}
              transparent
              opacity={0.3}
              emissive={food.color}
              emissiveIntensity={0.5}
            />
          </Box>
        </group>
      )}
      
      {/* 悬停光效 */}
      {hovered && !isSelected && (
        <pointLight
          position={[0, 0, 1]}
          intensity={0.5}
          color={food.color}
          distance={2}
        />
      )}
    </group>
  )
}

// 卡牌容器组件
const FoodCard3DContainer = ({ food, isSelected, onSelect, index }) => {
  // 计算卡牌位置（扇形排列）
  const angle = (index - 2.5) * 0.3 // 5张卡牌的扇形排列
  const radius = 3
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius * 0.5
  const y = Math.sin(index * 0.5) * 0.2 // 错落有致的高度
  
  const rotation = [0, -angle, 0]
  
  return (
    <Card3D
      food={food}
      isSelected={isSelected}
      onClick={onSelect}
      position={[x, y, z]}
      rotation={rotation}
    />
  )
}

// 3D卡牌展示场景
const FoodCard3DScene = ({ foods, selectedFoods, onSelectFood }) => {
  return (
    <div className="food-card-3d-scene">
      <Canvas
        camera={{ position: [0, 2, 6], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #87ceeb, #98fb98)' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 10, -5]} intensity={0.4} />
        
        {/* 地面 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#90ee90" transparent opacity={0.3} />
        </mesh>
        
        {/* 卡牌 */}
        {foods.map((food, index) => (
          <FoodCard3DContainer
            key={food.id}
            food={food}
            isSelected={selectedFoods.some(f => f.id === food.id)}
            onSelect={() => onSelectFood(food)}
            index={index}
          />
        ))}
        
        {/* 环境光效 */}
        <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffffff" />
      </Canvas>
    </div>
  )
}

export default FoodCard3DScene