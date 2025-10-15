import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

const FunCookingAnimation = ({ selectedFoods }) => {
  const groupRef = useRef()

  const foodParticles = useMemo(() => {
    return selectedFoods.map(food => ({
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      ],
      color: food.color || '#ffffff',
      scale: 0.2 + Math.random() * 0.3,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      )
    }))
  }, [selectedFoods])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.5 * delta
      groupRef.current.rotation.x += 0.3 * delta

      groupRef.current.children.forEach((mesh, i) => {
        const particle = foodParticles[i]
        if (particle) {
          // Move particles
          mesh.position.add(particle.velocity)

          // Bounce off container walls
          if (Math.abs(mesh.position.x) > 2) particle.velocity.x *= -1
          if (Math.abs(mesh.position.y) > 2) particle.velocity.y *= -1
          if (Math.abs(mesh.position.z) > 2) particle.velocity.z *= -1
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {foodParticles.map((particle, index) => (
        <Sphere key={index} args={[particle.scale, 16, 16]} position={particle.position}>
          <meshStandardMaterial color={particle.color} emissive={particle.color} emissiveIntensity={0.5} />
        </Sphere>
      ))}
    </group>
  )
}

export default FunCookingAnimation