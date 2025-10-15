import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, shaderMaterial, Points, PointMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useSpring, animated, easings } from '@react-spring/three'
import InstancedTrees from './InstancedTrees'
import FoodParticles from './FoodParticles'

// 大气层辉光着色器
const GlowShaderMaterial = shaderMaterial(
  {
    glowColor: new THREE.Color(0x4ade80),
    viewVector: new THREE.Vector3(0, 0, 5),
  },
  `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform vec3 glowColor;
    uniform vec3 viewVector;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.7 - dot(vNormal, normalize(viewVector)), 2.0);
      gl_FragColor = vec4(glowColor, 1.0) * intensity;
    }
  `
);

// 星球表面着色器
const PlanetSurfaceShaderMaterial = shaderMaterial(
  {
    time: 0,
    planetColor: new THREE.Color(0x4ade80),
    oceanColor: new THREE.Color(0x22c55e),
    iceColor: new THREE.Color(0xf0f9ff),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 planetColor;
    uniform vec3 oceanColor;
    uniform vec3 iceColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    // 简单的噪声函数
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    // Perlin 噪声
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
    }
    
    void main() {
      float n = noise(vUv * 10.0 + time * 0.1);
      
      // 根据法线和噪声创建地形
      float land = step(0.5, n);
      float ice = smoothstep(0.8, 0.85, abs(vNormal.y));
      
      vec3 color = mix(oceanColor, planetColor, land);
      color = mix(color, iceColor, ice);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ GlowShaderMaterial, PlanetSurfaceShaderMaterial });

const AnimatedPlanetSurfaceMaterial = animated('planetSurfaceShaderMaterial');

const Planet = ({ planetStatus, foods, ...props }) => {
  const groupRef = useRef()
  const shaderRef = useRef()

  useFrame((state, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value += delta * 0.1;
    }
    if (groupRef.current) {
      const rotationSpeed = planetStatus.health === 'excellent' ? 0.15 :
                           planetStatus.health === 'good' ? 0.12 :
                           planetStatus.health === 'fair' ? 0.1 :
                           planetStatus.health === 'poor' ? 0.08 : 0.05
      groupRef.current.rotation.y += delta * rotationSpeed
    }
  })

  const colors = {
    excellent: '#4ade80',
    good: '#22c55e',
    fair: '#84cc16',
    poor: '#eab308',
    critical: '#f97316'
  }
  const targetColor = new THREE.Color(colors[planetStatus.health] || '#4ade80');

  const { color, scale } = useSpring({
    color: targetColor,
    scale: [1, 1, 1],
    from: { scale: [0, 0, 0] },
    config: { duration: 1500, easing: easings.easeInOutQuart }
  })

  const treeCount = useMemo(() => {
    switch (planetStatus.health) {
      case 'excellent': return 300;
      case 'good': return 200;
      case 'fair': return 100;
      case 'poor': return 20;
      default: return 5;
    }
  }, [planetStatus.health]);

  return (
    <animated.group ref={groupRef} {...props} scale={scale}>
      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <glowShaderMaterial
          glowColor={targetColor}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent={true}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <AnimatedPlanetSurfaceMaterial ref={shaderRef} attach="material" planetColor={color} />
      </mesh>
      <InstancedTrees planetStatus={planetStatus} count={treeCount} />
      <FoodParticles foods={foods} />
    </animated.group>
  )
}

const Stars = () => {
  const ref = useRef()
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const r = 5 + Math.random() * 5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  });

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 20;
    ref.current.rotation.y -= delta / 25;
  })

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="white" size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  )
}

export const PlanetScene = ({ planetStatus, selectedFoods }) => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Planet planetStatus={planetStatus} foods={selectedFoods} position={[0, 0, 0]} />
      <Stars />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

const PlanetVisualization = ({ planetStatus, selectedFoods }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: '#1a2a3a', width: '100%', height: '100%' }}
    >
      <PlanetScene planetStatus={planetStatus} selectedFoods={selectedFoods} />
    </Canvas>
  )
}

export default PlanetVisualization;