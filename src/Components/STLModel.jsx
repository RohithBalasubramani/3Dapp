"use client";

import { Html } from "@react-three/drei";
import { Box3, Vector3, Plane, Raycaster } from "three";
import * as THREE from "three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useSTLStore } from "@/store/stlStore";
import ModelChooser from "./ModelChooser";

/* -------- helper to render every placed part -------- */
export const Models = () => {
  const models = useSTLStore((s) => s.models);
  return models.map(({ pos, geo }, i) => (
    <STLModel key={i} position={pos} geom={geo} />
  ));
};

/* ------------------- ONE MESH ----------------------- */
export default function STLModel({ geom, position }) {
  const meshRef = useRef();
  const [size, setSize] = useState(null);
  const [center, setCenter] = useState(null);
  const [pickBox, setPick] = useState(null);
  const [hover, setHover] = useState(null);

  const setPendingAttach = useSTLStore((s) => s.setPendingAttach);

  /* cache bbox once */
  useEffect(() => {
    const bbox = new Box3().setFromObject(meshRef.current);
    const sz = new Vector3();
    bbox.getSize(sz);
    const ctr = new Vector3();
    bbox.getCenter(ctr);
    setSize(sz);
    setCenter(ctr);
    setPick(new THREE.BoxGeometry(sz.x, sz.y, sz.z));
  }, [geom]);

  /* hover / click */
  const onMove = useCallback((e) => {
    e.stopPropagation();
    setHover(Math.floor(e.faceIndex / 2));
  }, []);
  const onOut = useCallback(() => setHover(null), []);

  const onFaceClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (!size) return;
      const { x, y, z } = meshRef.current.position;
      const { x: w, y: h, z: d } = size,
        o = 0.001;
      const p = [
        [x + w * o, y, z],
        [x - w * o, y, z],
        [x, y + h * o, z],
        [x, y - h * o, z],
        [x, y, z + d * o],
        [x, y, z - d * o],
      ][Math.floor(e.faceIndex / 2)];
      setPendingAttach({ pos: p, scale: [0.001, 0.001, 0.001] });
    },
    [size]
  );

  /* + position */
  const plusPos = useMemo(() => {
    if (hover === null || !size || !center) return null;
    const n = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ][hover];
    return [
      center.x + n[0] * (size.x / 2 + 0.05),
      center.y + n[1] * (size.y / 2 + 0.05),
      center.z + n[2] * (size.z / 2 + 0.05),
    ];
  }, [hover, size, center]);

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geom}
        scale={[0.001, 0.001, 0.001]}
        position={position}
      >
        <meshStandardMaterial color="hotpink" side={THREE.DoubleSide} />
      </mesh>

      {pickBox && center && (
        <mesh
          geometry={pickBox}
          position={center}
          onPointerMove={onMove}
          onPointerOut={onOut}
          onClick={onFaceClick}
        >
          {[...Array(6)].map((_, i) => (
            <meshStandardMaterial key={i} wireframe transparent opacity={0} />
          ))}
        </mesh>
      )}

      {plusPos && (
        <Html position={plusPos} occlude>
          <div
            onClick={onFaceClick}
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            +
          </div>
        </Html>
      )}

      {/* global modal */}
      <ModelChooser />
    </>
  );
}

/* ---------------- drag ghost ----------------------- */
export function Cursor() {
  const { camera, gl } = useThree();
  const mouse = useRef(new THREE.Vector2());
  const ray = useMemo(() => new Raycaster(), []);
  const plane = useMemo(() => new Plane(new Vector3(0, 0, 1), 0), []);

  const dragging = useSTLStore((s) => s.dragging);
  const addModel = useSTLStore((s) => s.addModel);
  const finishDrag = useSTLStore((s) => s.finishDrag);
  const [hit, setHit] = useState(null);

  const move = useCallback(
    (e) => {
      const { left, top, width, height } =
        gl.domElement.getBoundingClientRect();
      mouse.current.set(
        ((e.clientX - left) / width) * 2 - 1,
        -((e.clientY - top) / height) * 2 + 1
      );
      ray.setFromCamera(mouse.current, camera);
      const p = new Vector3();
      ray.ray.intersectPlane(plane, p);
      setHit(p);
    },
    [camera, gl]
  );

  const click = useCallback(() => {
    if (!dragging || !hit) return;
    addModel(hit.x, hit.y, hit.z, dragging.geo);
    finishDrag();
  }, [dragging, hit]);

  useEffect(() => {
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", click);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", click);
    };
  }, [move, click]);

  return dragging && hit ? (
    <mesh position={hit} scale={dragging.scale} pointerEvents={false}>
      <primitive object={dragging.geo} />
      <meshStandardMaterial transparent opacity={0.6} color="cyan" />
    </mesh>
  ) : null;
}
