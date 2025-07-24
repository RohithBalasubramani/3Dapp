import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useSTLStore } from '@/store/stlStore';

const SelectionBox = () => {
  const { selectedAssetId, models } = useSTLStore();
  const selectedModel = models.find((m) => m.id === selectedAssetId);
  const boxRef = useRef();

  useEffect(() => {
    if (selectedModel && boxRef.current) {
      // Use a BoxHelper to create a bounding box that matches the object's geometry
      const boxHelper = new THREE.BoxHelper(boxRef.current, 0xffff00);
      boxRef.current.add(boxHelper);

      return () => {
        // Clean up the box helper when the component unmounts or the selection changes
        boxRef.current.remove(boxHelper);
      };
    }
  }, [selectedModel]);

  if (!selectedModel) return null;

  // We need a parent mesh for the BoxHelper to attach to
  return (
    <mesh ref={boxRef} position={selectedModel.position} scale={selectedModel.scale}>
      <primitive object={selectedModel.geometry} attach="geometry" />
    </mesh>
  );
};

export default SelectionBox;