"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Line,
} from "@react-three/drei";
import { Leva, useControls } from "leva";
import AssetDragControls from "./AsssetDrag";

function Workspace({
  assets,
  selectedAssetId,
  onSelectAsset,
  onUpdateAsset,
  connections,
  setConnections,
}) {
  // Leva Controls for Zoom
  const { zoom } = useControls("Camera", {
    zoom: { value: 5, min: 1, max: 20, step: 0.1 },
  });

  // Leva Controls for Room Dimensions
  const { roomWidth, roomHeight, roomDepth } = useControls("Room Dimensions", {
    roomWidth: { value: 10, min: 5, max: 50, step: 1 },
    roomHeight: { value: 5, min: 2, max: 20, step: 1 },
    roomDepth: { value: 10, min: 5, max: 50, step: 1 },
  });

  // State to hold the OrbitControls instance once available
  const [controls, setControls] = useState(null);

  return (
    <div
      className="workspace"
      style={{
        width: "90vw",
        height: "100vh",
        backgroundColor: "black",
        margin: "0 auto",
      }}
    >
      <Canvas camera={{ position: [zoom, zoom, zoom] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        {/* Capture the OrbitControls instance via a callback ref */}
        <OrbitControls
          makeDefault
          ref={(instance) => {
            if (instance) {
              setControls(instance);
            }
          }}
        />

        <Ground />
        <RoomBorder width={roomWidth} height={roomHeight} depth={roomDepth} />

        <AssetDragControls
          assets={assets}
          selectedAssetId={selectedAssetId}
          onSelectAsset={onSelectAsset}
          onUpdateAsset={onUpdateAsset}
        />

        {/* Render the gizmo only once we have a valid controls instance */}
        {controls && (
          <GizmoHelper
            alignment="bottom-right"
            margin={[80, 80]}
            controls={controls}
          >
            <GizmoViewport
              axisColors={["red", "green", "blue"]}
              labelColor="white"
            />
          </GizmoHelper>
        )}
      </Canvas>
      <Leva collapsed={false} />
    </div>
  );
}

export default Workspace;

// Renders the room borders using lines
function RoomBorder({ width, height, depth }) {
  const points = [
    [-width / 2, 0, -depth / 2],
    [width / 2, 0, -depth / 2],
    [width / 2, 0, depth / 2],
    [-width / 2, 0, depth / 2],
    [-width / 2, 0, -depth / 2],
  ];

  return (
    <group>
      <Line points={points} color="white" lineWidth={2} />
      <Line
        points={points.map(([x, y, z]) => [x, height, z])}
        color="white"
        lineWidth={2}
      />
      {points.slice(0, 4).map(([x, y, z], index) => (
        <Line
          key={index}
          points={[
            [x, y, z],
            [x, height, z],
          ]}
          color="white"
          lineWidth={2}
        />
      ))}
    </group>
  );
}

// Configures and renders the ground grid
function Ground() {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: "#6f6f6f",
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: "#9d4b4b",
    fadeDistance: 30,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };
  return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />;
}
