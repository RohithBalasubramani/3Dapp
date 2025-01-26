"use client";

// Workspace.js
import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  Grid,
} from "@react-three/drei";

import AssetDragControls from "./AsssetDrag";

function Workspace({ assets, selectedAssetId, onSelectAsset, onUpdateAsset }) {
  return (
    <div
      className="workspace"
      style={{
        width: "90vw",
        height: "100vh",
        backgroundColor: "black",
        marginRight: "auto",
        marginLeft: "auto",
      }}
    >
      <Canvas camera={{ position: [5, 5, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls />
        <Ground />
        <AssetDragControls
          assets={assets}
          selectedAssetId={selectedAssetId}
          onSelectAsset={onSelectAsset}
          onUpdateAsset={onUpdateAsset}
        />
        <GizmoHelper alignment="bottom-right">
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor="black"
          />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}

export default Workspace;

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
