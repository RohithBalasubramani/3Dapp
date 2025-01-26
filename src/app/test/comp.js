import React from "react";
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";

const LShapeBox = ({
  width = 1,
  height = 1,
  depth = 1,
  thickness = 0.2,
  color = "skyblue",
}) => {
  return (
    <>
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
    </>
  );
};

const Comp = () => {
  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <LShapeBox
        width={2}
        height={3}
        depth={0.5}
        thickness={0.2}
        color="orange"
      />
      <OrbitControls />
    </Canvas>
  );
};

export default Comp;
