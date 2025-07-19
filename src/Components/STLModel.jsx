"use client";

import { Html } from "@react-three/drei";
import { Box3, Vector3, Plane, Raycaster } from "three";
import * as THREE from "three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useSTLStore } from "@/store/stlStore";
import ModelChooser from "./ModelChooser";
import IModel from "./IPLYModel";

/* -------- helper to render every placed part -------- */
export const Models = () => {
  const models = useSTLStore((s) => s.models);
  return models.map(({ pos, geo, shape }, i) => {
    if (shape === "I") {
      return <IModel key={i} position={pos} geom={geo} shape={shape} />;
    } else if (shape === "Z") {
      return <STLModel key={i} position={pos} geom={geo} shape={shape} />;
    }
  });
};

/* ------------------- ONE MESH ----------------------- */
export default function STLModel({ geom, position, shape }) {
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
    const worldLocalX = new THREE.Vector3(1, 0, 0)
      .applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()))
      .normalize();

    // 3. Compare face normal to local +X and -X
    const angleToX = faceNormal.angleTo(worldLocalX);
    const angleToNegX = faceNormal.angleTo(worldLocalX.clone().negate());
    const ANGLE_TOLERANCE = THREE.MathUtils.degToRad(10);

    if (angleToNegX === 0 || angleToX === 0) {
      gl.domElement.style.cursor = "crosshair";
    }

    setHover(Math.floor(e.faceIndex / 2));
  }, []);
  const onOut = useCallback(() => {
    gl.domElement.style.cursor = "default";
  }, []);

  // const onFaceClick = useCallback(
  //   (e) => {
  //     e.stopPropagation();
  //     const mesh = meshRef.current;
  //     if (!mesh) return;

  //     mesh.updateMatrixWorld(true);

  //     // 1. Face normal in world space
  //     const faceNormal = e.face.normal
  //       .clone()
  //       .transformDirection(mesh.matrixWorld)
  //       .normalize();

  //     // 2. Mesh local +X in world space
  //     const worldLocalX = new THREE.Vector3(1, 0, 0)
  //       .applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()))
  //       .normalize();

  //     // 3. Compare face normal with ±X
  //     const angleToX = faceNormal.angleTo(worldLocalX);
  //     const angleToNegX = faceNormal.angleTo(worldLocalX.clone().negate());
  //     const ANGLE_TOLERANCE = THREE.MathUtils.degToRad(10);

  //     if (angleToX > ANGLE_TOLERANCE && angleToNegX > ANGLE_TOLERANCE) {
  //       console.log("❌ Not aligned with local ±X");
  //       return;
  //     }

  //     // 4. Get bounding box of geometry
  //     const geometry = mesh.geometry;
  //     geometry.computeBoundingBox();
  //     const bbox = geometry.boundingBox;

  //     // 5. Click point in world space
  //     const clickPoint = e.point.clone();

  //     // 6. Get all 8 corners of the bounding box (local)
  //     const corners = [
  //       new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z),
  //       new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z),
  //       new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z),
  //       new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z),
  //       new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z),
  //       new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z),
  //       new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z),
  //       new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z),
  //     ];

  //     // 7. Transform each corner to world direction (rotation only)
  //     const meshQuat = mesh.getWorldQuaternion(new THREE.Quaternion());
  //     const rotatedCorners = corners.map((c) =>
  //       c.clone().applyQuaternion(meshQuat)
  //     );

  //     // 8. Choose the best corner (most aligned with face normal)
  //     let bestCorner = null;
  //     let maxDot = -Infinity;
  //     rotatedCorners.forEach((rotated, i) => {
  //       const dot = faceNormal.dot(rotated.clone().normalize());
  //       if (dot > maxDot) {
  //         maxDot = dot;
  //         bestCorner = corners[i]; // still in local space
  //       }
  //     });

  //     // 9. Final position: clickPoint - rotated best corner
  //     const rotatedBestCorner = bestCorner.clone().applyQuaternion(meshQuat);
  //     const spawnPos = clickPoint.clone().sub(rotatedBestCorner);

  //     console.log("📦 BBox.min (local)", bbox.min);
  //     console.log("🌀 Best corner (rotated)", rotatedBestCorner);
  //     console.log("📍 Click point", clickPoint);
  //     console.log("📦 Final spawn position", spawnPos);

  //     const size = new THREE.Vector3();
  //     bbox.getSize(size);
  //     const center = new THREE.Vector3();
  //     bbox.getCenter(center);
  //     const worldCenter = center.clone().applyMatrix4(mesh.matrixWorld);

  //     const scale = [0.001, 0.001, 0.001];

  //     setPendingAttach({
  //       worldCenter: spawnPos,
  //       size,
  //       currShape: shape,
  //       negativeX: angleToNegX < ANGLE_TOLERANCE,
  //       scale,
  //     });
  //   },
  //   [geom, shape]
  // );

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
      const worldLocalX = new THREE.Vector3(1, 0, 0)
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
        // setPendingAttach({
        //   worldCenter: worldCenter,
        //   size: size,
        //   currShape: shape,
        //   negativeX: true,
        //   scale: [0.001, 0.001, 0.001]
        // });
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
        // setPendingAttach({
        //   worldCenter: worldCenter,
        //   size: size,
        //   currShape: shape,
        //   negativeX: false,
        //   scale: [0.001, 0.001, 0.001]
        // });
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
        //scale={[0.001, 0.001, 0.001]}
        position={position}
        //rotation={[Math.PI / 2, 0, 0]} // ✅ Apply rotation here
      >
        <meshStandardMaterial color="hotpink" side={THREE.DoubleSide} />
      </mesh>

      {pickBox && center && (
        <mesh
          geometry={pickBox}
          position={center}
          onPointerMove={onMove}
          onPointerOut={onOut}
          //rotation={[Math.PI / 2, 0, 0]}
          onClick={onFaceClick}
        >
          {[...Array(6)].map((_, i) => (
            <meshStandardMaterial key={i} wireframe opacity={1} />
          ))}
        </mesh>
      )}
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
    addModel(hit.x, hit.y, hit.z, dragging.geo, dragging.shape);
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
    <mesh position={hit} pointerEvents={false}>
      <primitive object={dragging.geo} />
      <meshStandardMaterial transparent opacity={0.6} color="cyan" />
    </mesh>
  ) : null;
}
