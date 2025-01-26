"use client";
// pages/test.js
import { useState } from "react";
import dynamic from "next/dynamic";
import { Leva, useControls } from "leva";
import { Canvas } from "@react-three/fiber";
import { Box } from "@react-three/drei";

// Dynamically import Canvas to disable SSR
const CanvasNoSSR = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
);

const LShapeBox = ({
  width,
  height,
  depth,
  thickness,
  color,
  position,
  onClick,
}) => {
  return (
    <group position={position} onClick={onClick}>
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

export default function TestPage() {
  // State to track selected asset
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Use Leva controls for selected asset position
  const { x, y, z } = useControls("Position", {
    x: { value: 0, min: -5, max: 5, step: 0.1 },
    y: { value: 0, min: -5, max: 5, step: 0.1 },
    z: { value: 0, min: -5, max: 5, step: 0.1 },
  });

  // Update the selected asset's position
  const selectedPosition = [x, y, z];

  return (
    <div style={{ width: "70vw", height: "100vh" }}>
      <Leva /> {/* Renders the Leva control panel */}
      <CanvasNoSSR>
        <ambientLight />

        {/* Box asset with onClick handler */}
        <Box
          position={selectedAsset === "Box" ? selectedPosition : [1, 1, 1]}
          onClick={() => setSelectedAsset("Box")}
        >
          <meshStandardMaterial color="orange" />
        </Box>

        {/* L-shaped box asset with onClick handler */}
        <LShapeBox
          width={2}
          height={3}
          depth={0.5}
          thickness={0.2}
          color="orange"
          position={
            selectedAsset === "LShapeBox" ? selectedPosition : [2, 1, -1]
          }
          onClick={() => setSelectedAsset("LShapeBox")}
        />
      </CanvasNoSSR>
    </div>
  );
}
