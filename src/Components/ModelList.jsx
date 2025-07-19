"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useEffect, useRef, useState, memo } from "react";
import { useSTLStore } from "@/store/stlStore"; /* ← CHANGED */
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

/* ───────────────────────────────────────────────────────────
   IconMesh – spins a tiny preview
   ───────────────────────────────────────────────────────── */
const IconMesh = ({ geometry }) => {
  const meshRef = useRef();
  useFrame((_, dt) => {
    if (meshRef.current) meshRef.current.rotation.y += dt * 0.8;
  });
  return (
    <mesh ref={meshRef} geometry={geometry} scale={0.5}>
      <meshStandardMaterial metalness={0.25} roughness={0.6} />
    </mesh>
  );
};

/* ───────────────────────────────────────────────────────────
   Thumbnail with click logic
   ───────────────────────────────────────────────────────── */
const ModelIcon = memo(function ModelIcon({ url }) {
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    new PLYLoader().load(url, (g) => {
      g.computeVertexNormals();
      g.computeBoundingBox();
      g.center();
      //g.scale(0.001, 0.001, 0.001);
      setGeometry({geo: g, shape: url.split("/")[2].split(".")[0]});
    });
  }, [url]);

  const store = useSTLStore.getState();

  const handleClick = () => {
    if (!geometry) return;

    const pending = store.pendingAttach;

    if (pending) {
      /* snap to face */
      store.addModel(...pending.pos, geometry.geo.clone(), geometry.shape);
      store.setPendingAttach(null);
    } else {
      /* start drag */
      const g = geometry.geo.clone();
      g.scale(0.001, 0.001, 0.001)
      store.startDrag(g, [0.001, 0.001, 0.001], geometry.shape);
      store.setSelectedModel({ geometry: g });
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: 110,
        height: 110,
        margin: 8,
        border: "1px solid #444",
        borderRadius: 8,
        overflow: "hidden",
        cursor: geometry ? "pointer" : "progress",
      }}
    >
      <Canvas camera={{ position: [0, 0, 3] }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        {geometry && <IconMesh geometry={geometry.geo} />}
      </Canvas>
    </div>
  );
});

/* ───────────────────────────────────────────────────────────
   Grid of thumbnails
   ───────────────────────────────────────────────────────── */
function ModelList({ files = ["/models/I.PLY", "/models/demo2.PLY", "/models/Z.PLY"] }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
        display: "flex",
        flexWrap: "wrap",
        maxWidth: 240,
      }}
    >
      <h3 style={{ width: "100%", marginBottom: 8 }}>Select a model:</h3>
      {files.map((f) => (
        <ModelIcon key={f} url={f} />
      ))}
    </div>
  );
}

/* export both ways */
export { ModelList };
export default ModelList;
