"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Line,
} from "@react-three/drei";
import { Leva, useControls } from "leva";
import { Physics } from "@react-three/cannon";

import AssetDragControls from "./AsssetDrag";
import STLModel, { Cursor, Models } from "./STLModel";
/* ⬇️  FIXED: import the store from its new location */
import { useSTLStore } from "@/store/stlStore";

export default function Workspace({
  assets,
  selectedAssetId,
  onSelectAsset,
  onUpdateAsset,
  connections,
  setConnections,
}) {
  /* Leva knobs */
  const { zoom } = useControls("Camera", {
    zoom: { value: 5, min: 1, max: 20, step: 0.1 },
  });
  const { roomWidth, roomHeight, roomDepth } = useControls("Room Dimensions", {
    roomWidth: { value: 10, min: 5, max: 50, step: 1 },
    roomHeight: { value: 5, min: 2, max: 20, step: 1 },
    roomDepth: { value: 10, min: 5, max: 50, step: 1 },
  });

  const canvasRef = useRef();
  const dragging = useSTLStore((s) => s.dragging);
  const finishDrag = useSTLStore((s) => s.finishDrag);
  const [controls, setCtrl] = useState(null);

  /* lock rotation while dragging */
  useEffect(() => {
    if (controls) controls.enableRotate = !dragging;
  }, [dragging, controls]);

  /* cancel drag if pointer leaves canvas */
  function handleLeave() {
    if (dragging) finishDrag();
  }

  return (
    <div
      id="workspace"
      style={{
        width: "90vw",
        height: "95vh",
        background: "white",
        margin: "0 auto",
      }}
    >
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 60 }}
        onPointerLeave={handleLeave}
      >
        {/* lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        {/* drag ghost & placed STLs */}
        <Suspense fallback={null}>
          <Cursor />
          <Models />
        </Suspense>

        {/* orbit controls */}
        <OrbitControls makeDefault ref={setCtrl} />

        {/* grid + room outline */}
        <Ground />
        <RoomBorder width={roomWidth} height={roomHeight} depth={roomDepth} />

        {/* physics sandbox for your cubes or other assets */}
        <Physics>{/* … */}</Physics>

        {/* existing asset handles */}
        <AssetDragControls
          assets={assets}
          selectedAssetId={selectedAssetId}
          onSelectAsset={onSelectAsset}
          onUpdateAsset={onUpdateAsset}
        />

        {/* axis gizmo */}
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

/* ---------- helpers (unchanged) ------------------- */
function RoomBorder({ width, height, depth }) {
  const pts = [
    [-width / 2, 0, -depth / 2],
    [width / 2, 0, -depth / 2],
    [width / 2, 0, depth / 2],
    [-width / 2, 0, depth / 2],
    [-width / 2, 0, -depth / 2],
  ];
  return (
    <group>
      <Line points={pts} color="white" lineWidth={2} />
      <Line
        points={pts.map(([x, , z]) => [x, height, z])}
        color="white"
        lineWidth={2}
      />
      {pts.slice(0, 4).map(([x, y, z], i) => (
        <Line
          key={i}
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

function Ground() {
  const cfg = {
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
  return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...cfg} />;
}
