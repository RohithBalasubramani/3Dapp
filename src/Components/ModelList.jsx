"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, memo } from "react";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { useSTLStore } from "@/store/stlStore";

/* ────────────────────────────────────────────────
   Tiny spinning preview mesh
   ──────────────────────────────────────────────── */
const IconMesh = ({ geometry, scale }) => {
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.8;
  });
  return (
    <mesh ref={ref} geometry={geometry} scale={scale}>
      <meshStandardMaterial metalness={0.25} roughness={0.6} color="white" />
    </mesh>
  );
};

/* ────────────────────────────────────────────────
   Single thumbnail item
   ──────────────────────────────────────────────── */
const ModelIcon = memo(function ModelIcon({ url }) {
  const [meshData, setMeshData] = useState(null);

  useEffect(() => {
    const loader = new PLYLoader();
    loader.load(url, (g) => {
      g.computeVertexNormals();
      g.computeBoundingBox();
      g.computeBoundingSphere();
      g.center();

      const radius = g.boundingSphere.radius;
      const computedScale = radius > 0 ? 1 / radius : 1;

      setMeshData({
        geo: g,
        shape: url.split("/").pop().split(".")[0],
        scale: computedScale,
      });
    });
  }, [url]);

  const startDrag = useSTLStore.getState().startDrag;
  const onClick = () => {
    if (!meshData) return;
    startDrag(meshData.geo.clone(), meshData.shape);
  };

  return (
    <div
      onClick={onClick}
      style={{
        width: 110,
        height: 110,
        margin: 8,
        border: "1px solid #444",
        borderRadius: 8,
        overflow: "hidden",
        cursor: meshData ? "pointer" : "progress",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3] }}
        dpr={[1, 2]}
        style={{ background: "black" }}
      >
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        {meshData && (
          <IconMesh geometry={meshData.geo} scale={meshData.scale} />
        )}
      </Canvas>
    </div>
  );
});

/* ────────────────────────────────────────────────
   Grid of thumbnails wrapped in a translucent panel
   with a dummy dropdown at its top‑right
   ──────────────────────────────────────────────── */
export default function ModelList(files) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "rgba(7, 7, 7, 0.88)", // translucent background
        maxWidth: 160,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Dummy dropdown in the component’s top‑right corner */}

      <h3 style={{ margin: "0 0 8px", color: "#fff" }}>Asset Library</h3>
      <select
        style={{
          alignSelf: "flex-end",
          marginBottom: 8,
        }}
      >
        <option>Busbar</option>
        <option>Other Assets</option>
      </select>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {files.map((f) => (
          <ModelIcon key={f} url={f} />
        ))}
      </div>
    </div>
  );
}
