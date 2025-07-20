"use client";

import { Html } from "@react-three/drei";
import { Box3, Vector3, Plane, Raycaster } from "three";
import * as THREE from "three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useSTLStore } from "@/store/stlStore";
import ModelChooser from "./ModelChooser";

export default function IModel({ geom, position, shape }) {
  const meshRef = useRef();
  const [size, setSize] = useState(null);
  const [center, setCenter] = useState(null);
  const [pickBox, setPick] = useState(null);
  const [hover, setHover] = useState(null);
  const { camera, gl, scene } = useThree();

  const setPendingAttach = useSTLStore((s) => s.setPendingAttach);

  // Cache bounding box after rotation is applied
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.updateMatrixWorld(true);

    const bbox = new Box3().setFromObject(mesh);
    const sz = new Vector3();
    const ctr = new Vector3();
    bbox.getSize(sz);
    bbox.getCenter(ctr);

    setSize(sz);
    setCenter(ctr);
    setPick(new THREE.BoxGeometry(sz.x, sz.y, sz.z));
  }, [geom]);

  const onMove = useCallback((e) => {
    e.stopPropagation();
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.updateMatrixWorld(true);

    // 1. Face normal in world space
    const faceNormal = e.face.normal
      .clone()
      .transformDirection(mesh.matrixWorld)
      .normalize();

    // 2. Mesh's local +X direction in world space
    const worldLocalY = new THREE.Vector3(0, 1, 0)
      .applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()))
      .normalize();

    // 3. Compare face normal to local +X and -X
    const angleToY = faceNormal.angleTo(worldLocalY);
    const angleToNegY = faceNormal.angleTo(worldLocalY.clone().negate());
    const ANGLE_TOLERANCE = THREE.MathUtils.degToRad(10);

     if (angleToNegY === 0 || angleToY ===0){
      gl.domElement.style.cursor = 'crosshair'
     }

    setHover(Math.floor(e.faceIndex / 2));
  }, []);
  const onOut = useCallback(() => {
    gl.domElement.style.cursor = 'default'
  }, []);

  const onFaceClick = useCallback(
    (e) => {
      e.stopPropagation();
      const mesh = meshRef.current;
      if (!mesh) return;

      mesh.updateMatrixWorld(true);

      // 1. Face normal in world space
      const faceNormal = e.face.normal
        .clone()
        .transformDirection(mesh.matrixWorld)
        .normalize();

      // 2. Mesh's local +X direction in world space
      const worldLocalX = new THREE.Vector3(0, 1, 0)
        .applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()))
        .normalize();

      // 3. Compare face normal to local +X and -X
      const angleToX = faceNormal.angleTo(worldLocalX);
      const angleToNegX = faceNormal.angleTo(worldLocalX.clone().negate());
      const ANGLE_TOLERANCE = THREE.MathUtils.degToRad(10);

      if (angleToX > ANGLE_TOLERANCE && angleToNegX > ANGLE_TOLERANCE) {
        console.log("❌ Not aligned with local ±X");
        return;
      }

      console.log("angleToX", angleToX);
      console.log("angleToNegX", angleToNegX);
      console.log("ANGLE_TOLERANCE", ANGLE_TOLERANCE);

      // 4. Compute spawn position slightly outside the face
      const clickPoint = e.point.clone();
      const offset = 0.001;
      const spawnPos = clickPoint.add(
        faceNormal.clone().multiplyScalar(offset)
      );

      // 5. Add model
      const size = new THREE.Vector3();
      mesh.geometry.computeBoundingBox();
      mesh.geometry.boundingBox.getSize(size);
      const center = new THREE.Vector3();
      mesh.geometry.boundingBox.getCenter(center);
      const worldCenter = center.clone().applyMatrix4(mesh.matrixWorld);
      console.log("worldcenter", worldCenter);
      console.log(size);
      const newCenter = new THREE.Vector3(
        center.x - size.x * 0.001,
        center.y,
        center.z + size.z * 0.001 - 0.01
      );
      console.log("newCenter", newCenter);

      // worldCenter.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
      newCenter.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);

      // console.log("rot world center", worldCenter);
      console.log("rot new center", newCenter);

      if (angleToNegX === 0) {
        useSTLStore
          .getState()
          .addModel(
            worldCenter.x - size.x * 0.001,
            worldCenter.y,
            worldCenter.z + size.z * 0.001 * (2 / 3) + 0.03,
            geom
          );
      }

      if (angleToX === 0) {
        useSTLStore
          .getState()
          .addModel(
            worldCenter.x + size.x * 0.001,
            worldCenter.y,
            worldCenter.z - size.z * 0.001 * (2 / 3) - 0.03,
            geom
          );
      }
    },
    [geom]
  );

  // const onFaceClick = useCallback(
  //   (e) => {
  //     e.stopPropagation();

  //     const mesh = meshRef.current;
  //     if (!mesh) return;

  //     // Get the clicked face's world normal
  //     const faceNormal = e.face.normal
  //       .clone()
  //       .transformDirection(mesh.matrixWorld) // converts to world space
  //       .normalize();

  //     // Get the intersection point in world space
  //     const clickPoint = e.point.clone();

  //     // Offset slightly in the direction of the face
  //     const OFFSET = 0.001;
  //     const spawnPos = clickPoint
  //       .clone()
  //       .add(faceNormal.clone().multiplyScalar(OFFSET));

  //     useSTLStore.getState().addModel(spawnPos.x, spawnPos.y, spawnPos.z, geom);
  //   },
  //   [geom]
  // );

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
        // rotation={[0, 0, Math.PI / 2]} // ✅ Apply rotation here
      >
        <meshStandardMaterial color="hotpink" side={THREE.DoubleSide} />
      </mesh>

      {pickBox && center && (
        <mesh
          geometry={pickBox}
          position={center}
          onPointerMove={onMove}
          onPointerOut={onOut}
          // rotation={[0, 0, Math.PI / 2]}
          onClick={onFaceClick}
        >
          {[...Array(6)].map((_, i) => (
            <meshStandardMaterial key={i} wireframe opacity={1} />
          ))}
        </mesh>
      )}

    </>
  );
}