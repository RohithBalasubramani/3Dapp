import { useSTLStore } from "@/store/stlStore";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Raycaster, Vector3, Plane } from "three";
import * as THREE from "three";

export function SnappingCursor() {
  const { camera, gl } = useThree();
  const snap = useSTLStore((s) => s.snapModel);
  const addModel = useSTLStore((s) => s.addModel);
  const clearSnap = useSTLStore((s) => s.clearSnapModel);
  const mouse = useRef(new Vector3());
  const ray = useMemo(() => new Raycaster(), []);

  const [ghostPos, setGhostPos] = useState(null);

  const [ghostRotation, setGhostRotation] = useState(
    snap?.rotation ? snap.rotation.clone() : new THREE.Euler()
  );

  function snapTo90Radians(angle) {
    const step = Math.PI / 2; // 90 degrees
    return Math.round(angle / step) * step;
  }

  useEffect(() => {
    if (snap?.rotation) {
      setGhostRotation(snap.rotation.clone());
    }
  }, [snap]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!snap) return;

      const current = ghostRotation.clone();

      switch (e.key.toLowerCase()) {
        case "r":
          current.y += Math.PI / 2;
          break;
        case "x":
          current.x += Math.PI / 2;
          break;
        case "z":
          current.z += Math.PI / 2;
          break;
        default:
          return;
      }

      // ✅ Snap each axis to nearest 90°
      current.x = snapTo90Radians(current.x);
      current.y = snapTo90Radians(current.y);
      current.z = snapTo90Radians(current.z);

      setGhostRotation(current);
    };

    window.addEventListener("keypress", handleKeyDown);
    return () => {
      window.removeEventListener("keypress", handleKeyDown);
    };
  }, [ghostRotation, snap]);

  useEffect(() => {
    if (!snap) return;

    const onMove = (e) => {
      const { left, top, width, height } =
        gl.domElement.getBoundingClientRect();
      const mouseNDC = new THREE.Vector2(
        ((e.clientX - left) / width) * 2 - 1,
        -((e.clientY - top) / height) * 2 + 1
      );
      ray.setFromCamera(mouseNDC, camera);
      const hit = new Vector3();

      //   let offsetDistance = 0

      console.log("shape", snap.shape);

      // Drag plane
      const dragPlane = new Plane().setFromNormalAndCoplanarPoint(
        snap.offsetDir.clone(),
        snap.offsetOrigin
      );
      if (!ray.ray.intersectPlane(dragPlane, hit)) return;
      ray.ray.intersectPlane(dragPlane, hit);
      //Movement delta from initial face center (basePoint)
      const delta = hit.clone().sub(snap.offsetOrigin);
      // Project delta onto plane axes
      let uAmount = delta.dot(snap.u);
      let vAmount = delta.dot(snap.v);
      // 👇 CLAMP drag within bounding box of the face
      //   const uLimit = Math.abs(snap.size.dot(snap.u));
      //   const vLimit = Math.abs(snap.size.dot(snap.v));
      uAmount = THREE.MathUtils.clamp(uAmount, -snap.uLimit, snap.uLimit);
      vAmount = THREE.MathUtils.clamp(vAmount, -snap.vLimit, snap.vLimit);
      // Final snapped position
      const constrained = snap.offsetOrigin
        .clone()
        .add(snap.u.clone().multiplyScalar(uAmount))
        .add(snap.v.clone().multiplyScalar(vAmount));
      setGhostPos(constrained);
    };

    const onClick = () => {
      if (!ghostPos || !snap) return;
      addModel(
        ghostPos.x,
        ghostPos.y,
        ghostPos.z,
        snap.geom,
        snap.shape,
        ghostRotation
      );
      clearSnap();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, [snap, camera, gl, ghostPos]);

  if (!snap || !ghostPos) return null;

  function getPlaneRotation(u, v, normal) {
    const m = new THREE.Matrix4().makeBasis(u, v, normal);
    const euler = new THREE.Euler().setFromRotationMatrix(m);
    return euler;
  }

  return (
    <>
      <mesh position={ghostPos} rotation={ghostRotation}>
        <primitive object={snap.geom} />
        <meshStandardMaterial transparent opacity={0.5} color="cyan" />
      </mesh>
      {snap && (
        <mesh
          position={snap.offsetOrigin}
          rotation={new THREE.Euler().setFromVector3(
            getPlaneRotation(snap.u, snap.v, snap.faceNormal)
          )}
        >
          <planeGeometry args={[snap.uLimit * 2, snap.vLimit * 2]} />
          <meshBasicMaterial
            color="yellow"
            opacity={0.2}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </>
  );
}
