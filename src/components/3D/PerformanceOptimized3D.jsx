import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import * as THREE from 'three'

// 优化的相机组件
const OptimizedCamera = ({ position = [0, 0, 5], fov = 75, ...props }) => {
  const { camera } = useThree()
  
  useEffect(() => {
    // 设置相机参数
    camera.position.set(...position)
    camera.fov = fov
    camera.updateProjectionMatrix()
    
    // 启用相机优化
    camera.far = 1000
    camera.near = 0.1
    camera.updateProjectionMatrix()
  }, [camera, position, fov])
  
  return null
}

// 优化的灯光组件
const OptimizedLights = ({ intensity = 1 }) => {
  return (
    <>
      <ambientLight intensity={intensity * 0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={intensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={intensity * 0.5}
        castShadow
      />
    </>
  )
}

// 优化的网格组件
const OptimizedMesh = ({ 
  geometry, 
  material, 
  position, 
  castShadow = true,
  receiveShadow = true,
  ...props 
}) => {
  const meshRef = useRef()
  
  // 使用useMemo优化几何体和材质
  const memoizedGeometry = useMemo(() => {
    if (typeof geometry === 'string') {
      // 如果是几何体类型字符串，创建对应的几何体
      switch (geometry) {
        case 'box':
          return new THREE.BoxGeometry(1, 1, 1)
        case 'sphere':
          return new THREE.SphereGeometry(1, 32, 32)
        case 'cylinder':
          return new THREE.CylinderGeometry(1, 1, 2, 32)
        default:
          return new THREE.BoxGeometry(1, 1, 1)
      }
    }
    return geometry
  }, [geometry])
  
  const memoizedMaterial = useMemo(() => {
    if (typeof material === 'string') {
      // 如果是材质类型字符串，创建对应的材质
      switch (material) {
        case 'standard':
          return new THREE.MeshStandardMaterial({ color: 0x00ff00 })
        case 'basic':
          return new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        case 'phong':
          return new THREE.MeshPhongMaterial({ color: 0x00ff00 })
        default:
          return new THREE.MeshStandardMaterial({ color: 0x00ff00 })
      }
    }
    return material
  }, [material])
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      {...props}
    >
      <primitive object={memoizedGeometry} attach="geometry" />
      <primitive object={memoizedMaterial} attach="material" />
    </mesh>
  )
}

// 优化的粒子系统
const OptimizedParticles = ({ count = 1000, ...props }) => {
  const meshRef = useRef()
  const [particles] = useState(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // 位置
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10
      
      // 颜色
      colors[i3] = Math.random()
      colors[i3 + 1] = Math.random()
      colors[i3 + 2] = Math.random()
    }
    
    return { positions, colors }
  })
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // 旋转粒子系统
      meshRef.current.rotation.y += delta * 0.1
      
      // 更新粒子位置（可选）
      const positions = meshRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={meshRef} {...props}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  )
}

// 优化的场景组件
export const OptimizedScene = ({ 
  children, 
  cameraPosition = [0, 0, 5],
  enableStats = false,
  enableControls = true,
  shadows = true,
  ...props 
}) => {
  return (
    <Canvas
      shadows={shadows}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
        logarithmicDepthBuffer: false
      }}
      dpr={Math.min(window.devicePixelRatio, 2)}
      {...props}
    >
      <OptimizedCamera position={cameraPosition} />
      <OptimizedLights intensity={1} />
      
      {enableControls && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={0.5}
          minDistance={2}
          maxDistance={20}
          enableDamping={true}
          dampingFactor={0.05}
          screenSpacePanning={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      )}
      
      {enableStats && <Stats />}
      
      {children}
    </Canvas>
  )
}

// 优化的星球组件
export const OptimizedPlanet = ({ planetStatus, ...props }) => {
  const meshRef = useRef()
  const [time, setTime] = useState(0)
  
  useFrame((state, delta) => {
    setTime(time + delta)
    
    if (meshRef.current) {
      // 旋转星球
      meshRef.current.rotation.y += delta * 0.05
      
      // 脉冲效果
      const scale = 1 + Math.sin(time * 2) * 0.02
      meshRef.current.scale.setScalar(scale)
    }
  })
  
  // 优化的材质
  const planetMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: planetStatus.color,
      roughness: 0.7,
      metalness: 0.3,
      emissive: planetStatus.color,
      emissiveIntensity: 0.1
    })
  }, [planetStatus.color])
  
  return (
    <group {...props}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={planetMaterial} attach="material" />
      </mesh>
      
      {/* 大气层效果 */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial
          color={planetStatus.color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

// 优化的动画组件
export const OptimizedAnimation = ({ children, speed = 1, ...props }) => {
  const [time, setTime] = useState(0)
  
  useFrame((state, delta) => {
    setTime(time + delta * speed)
  })
  
  return (
    <group {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { time, index })
        }
        return child
      })}
    </group>
  )
}

// 性能监控组件
export const PerformanceMonitor3D = ({ children }) => {
  const [fps, setFps] = useState(0)
  const [drawCalls, setDrawCalls] = useState(0)
  const [triangles, setTriangles] = useState(0)
  
  useFrame((state) => {
    // 更新FPS
    setFps(Math.round(1 / state.delta))
    
    // 获取渲染器信息
    const renderer = state.gl
    if (renderer.info) {
      setDrawCalls(renderer.info.render.calls)
      setTriangles(renderer.info.render.triangles)
    }
  })
  
  return (
    <PerformanceContext.Provider value={{ fps, drawCalls, triangles }}>
      {children}
    </PerformanceContext.Provider>
  )
}

// 性能上下文
const PerformanceContext = React.createContext()

// 3D性能钩子
export const usePerformance3D = () => {
  const context = React.useContext(PerformanceContext)
  if (!context) {
    throw new Error('usePerformance3D must be used within a PerformanceMonitor3D')
  }
  return context
}

// 优化的批量渲染组件
export const BatchedRenderer = ({ items, batchSize = 50, renderItem }) => {
  const [visibleBatch, setVisibleBatch] = useState(0)
  
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop
    const newBatch = Math.floor(scrollTop / (batchSize * 100))
    setVisibleBatch(newBatch)
  }
  
  const visibleItems = items.slice(
    visibleBatch * batchSize,
    (visibleBatch + 1) * batchSize
  )
  
  return (
    <div className="batched-renderer" onScroll={handleScroll} style={{ height: '100%', overflow: 'auto' }}>
      {visibleItems.map((item, index) => (
        <div key={index} style={{ height: '100px' }}>
          {renderItem(item, visibleBatch * batchSize + index)}
        </div>
      ))}
    </div>
  )
}

export default OptimizedScene