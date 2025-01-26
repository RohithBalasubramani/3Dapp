// Duct.js
import React from "react";
import { Box } from "@react-three/drei";

function Duct({ dimensions, position, onClick }) {
  return (
    <Box
      args={[dimensions.width, dimensions.height, dimensions.depth]}
      position={[position.x, position.y, position.z]}
      onClick={(event) => {
        event.stopPropagation(); // Prevent click from propagating to the canvas
        onClick();
      }}
    >
      <meshStandardMaterial color="blue" />
    </Box>
  );
}

export default Duct;
