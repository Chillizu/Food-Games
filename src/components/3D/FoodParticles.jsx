import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const FoodParticle = ({ food, index, total }) => {
  const ref = useRef();
  
  // 为每个粒子计算一个独特的轨道和速度
  const { radius, speed, yOffset } = useMemo(() => {
    return {
      radius: 1.5 + (index / total) * 0.8 + Math.random() * 0.2,
      speed: 0.2 + Math.random() * 0.3,
      yOffset: (Math.random() - 0.5) * 0.5
    };
  }, [index, total]);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      ref.current.position.x = radius * Math.cos(t + index * 10);
      ref.current.position.z = radius * Math.sin(t + index * 10);
      ref.current.position.y = yOffset + Math.sin(t * 2) * 0.1;
      
      // 让 emoji 始终朝向相机
      ref.current.lookAt(0,0,5);
    }
  });

  return (
    <group ref={ref}>
      <Text
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {food.emoji}
      </Text>
    </group>
  );
};

const FoodParticles = ({ foods }) => {
  if (!foods || foods.length === 0) {
    return null;
  }

  return (
    <group>
      {foods.map((food, index) => (
        <FoodParticle key={food.id} food={food} index={index} total={foods.length} />
      ))}
    </group>
  );
};

export default FoodParticles;