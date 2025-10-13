import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere, Plane, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

// 实验台
const LaboratoryTable = () => {
  const tableRef = useRef()

  useFrame((state) => {
    if (tableRef.current) {
      // 轻微的浮动效果
      tableRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.02
    }
  })

  return (
    <group ref={tableRef}>
      {/* 台面 */}
      <Box args={[4, 0.1, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#f0f0f0" 
          metalness={0.1}
          roughness={0.8}
        />
      </Box>
      
      {/* 台腿 */}
      <Box args={[0.1, 1, 0.1]} position={[-1.8, -0.5, -1.2]}>
        <meshStandardMaterial color="#666" />
      </Box>
      <Box args={[0.1, 1, 0.1]} position={[1.8, -0.5, -1.2]}>
        <meshStandardMaterial color="#666" />
      </Box>
      <Box args={[0.1, 1, 0.1]} position={[-1.8, -0.5, 1.2]}>
        <meshStandardMaterial color="#666" />
      </Box>
      <Box args={[0.1, 1, 0.1]} position={[1.8, -0.5, 1.2]}>
        <meshStandardMaterial color="#666" />
      </Box>
    </group>
  )
}

// 实验设备
const LabEquipment = () => {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      // 设备轻微旋转
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* 显微镜 */}
      <group position={[-1.5, 0.5, 0]}>
        <Cylinder args={[0.1, 0.1, 1, 16]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#333" />
        </Cylinder>
        <Sphere args={[0.15, 16, 16]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#4169e1" transparent opacity={0.7} />
        </Sphere>
        <Box args={[0.3, 0.05, 0.3]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#666" />
        </Box>
      </group>
      
      {/* 试管架 */}
      <group position={[1.5, 0.3, 0]}>
        <Box args={[0.05, 0.6, 0.3]} position={[0, 0.3, 0]}>
          <meshStandardMaterial color="#8b4513" />
        </Box>
        {[...Array(3)].map((_, i) => (
          <Cylinder
            key={i}
            args={[0.02, 0.02, 0.4, 8]}
            position={[0, 0.5, (i - 1) * 0.1]}
          >
            <meshStandardMaterial 
              color={["#ff6b6b", "#4ecdc4", "#45b7d1"][i]} 
              transparent
              opacity={0.8}
            />
          </Cylinder>
        ))}
      </group>
      
      {/* 电脑屏幕 */}
      <group position={[0, 0.8, -1.2]}>
        <Box args={[0.8, 0.5, 0.05]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#333" />
        </Box>
        <Plane args={[0.7, 0.4]} position={[0, 0, 0.03]}>
          <meshBasicMaterial color="#000" />
        </Plane>
        <Text
          position={[0, 0, 0.04]}
          fontSize={0.1}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
        >
          FUTURE FOOD LAB
        </Text>
      </group>
    </group>
  )
}

// 漂浮的科学符号
const FloatingSymbols = () => {
  const symbols = [
    { emoji: '🧪', position: [-2, 1.5, -1] },
    { emoji: '⚗️', position: [2, 1.8, -0.5] },
    { emoji: '🔬', position: [0, 2, -1.5] },
    { emoji: '🧫', position: [-1.5, 1.2, 1] },
    { emoji: '🧬', position: [1.5, 1.5, 1] }
  ]

  return (
    <group>
      {symbols.map((symbol, index) => (
        <FloatingSymbol
          key={index}
          emoji={symbol.emoji}
          position={symbol.position}
        />
      ))}
    </group>
  )
}

const FloatingSymbol = ({ emoji, position }) => {
  const textRef = useRef()
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(time + delta)
    
    if (textRef.current) {
      // 漂浮动画
      textRef.current.position.y = position[1] + Math.sin(time * 2 + position[0]) * 0.1
      textRef.current.rotation.y = time * 0.5
    }
  })

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.2}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      {emoji}
    </Text>
  )
}

// 背景网格
const BackgroundGrid = () => {
  return (
    <group>
      <Grid args={[10, 10]} position={[0, -0.05, 0]} />
      <Grid args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} position={[0, 1, 0]} />
    </group>
  )
}

const Grid = (args) => {
  return (
    <gridHelper
      args={[args[0], args[1], '#444', '#444']}
      position={args[2]}
    />
  )
}

// 实验室场景主组件
const LaboratoryScene = ({ children }) => {
  return (
    <div className="laboratory-scene">
      <Canvas
        camera={{ position: [0, 1, 4], fov: 50 }}
        style={{ 
          background: 'linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)' 
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#4ade80" />
        <pointLight position={[-5, 5, -5]} intensity={0.6} color="#60a5fa" />
        <pointLight position={[0, -5, 0]} intensity={0.4} color="#f59e0b" />
        
        <BackgroundGrid />
        
        <LaboratoryTable />
        
        <LabEquipment />
        
        <FloatingSymbols />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2}
        />
        
        {children}
      </Canvas>
    </div>
  )
}

export default LaboratoryScene