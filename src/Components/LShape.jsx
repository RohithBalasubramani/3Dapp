import React, { useRef } from "react";
import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const LShapedDuct = ({
  width = 1,
  height = 1,
  depth = 1,
  thickness = 0.2,
  color = "orange",
  position = [0, 0, 0], // Default position
  ref,
  onClick,
}) => {
  const meshRef = useRef();
  // Rotate the mesh every frame
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  return (
    <group position={position} ref={meshRef} onClick={onClick}>
      {/* Vertical Box */}
      <Box
        args={[thickness, height, depth]}
        position={[-(width / 2 - thickness / 2), 0, 0]}
      >
        <meshStandardMaterial color={color} />
      </Box>

      {/* Horizontal Box */}
      <Box
        args={[width, thickness, depth]}
        position={[0, -(height / 2 - thickness / 2), 0]}
      >
        <meshStandardMaterial color={color} />
      </Box>
    </group>
  );
};

export default LShapedDuct;
