import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const InstancedTrees = ({ planetStatus, count }) => {
  const meshRef = useRef();
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const colors = {
    excellent: '#22c55e',
    good: '#84cc16',
    fair: '#facc15',
    poor: '#f97316',
    critical: '#ef4444',
  };
  const baseTreeColor = new THREE.Color(colors[planetStatus.health] || colors.good);

  useEffect(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      // 在球体表面随机选择一个点
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * 2 * Math.PI;

      const position = new THREE.Vector3();
      position.setFromSphericalCoords(1, phi, theta);
      
      // 将树放在表面上
      tempObject.position.set(position.x, position.y, position.z);

      // 使树垂直于球心
      tempObject.lookAt(0, 0, 0);
      tempObject.rotateX(Math.PI / 2);

      // 随机化大小和旋转
      const scale = 0.02 + Math.random() * 0.03;
      tempObject.scale.set(scale, scale * (1.5 + Math.random()), scale);
      tempObject.rotation.z = Math.random() * 2 * Math.PI;

      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
      
      // 设置颜色
      const treeColor = baseTreeColor.clone().multiplyScalar(0.8 + Math.random() * 0.4);
      meshRef.current.setColorAt(i, tempColor.set(treeColor));
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [count, planetStatus.health, baseTreeColor]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <coneGeometry args={[0.5, 1, 4]} />
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  );
};

export default InstancedTrees;