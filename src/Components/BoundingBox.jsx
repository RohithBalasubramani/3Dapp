import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * Wireframe cuboid + invisible drag planes.
 * Guarantees width/height/depth are > 0 to avoid NaN radii.
 */
export default function BoundingBox({
  width = 10,
  height = 5,
  depth = 10,
  color = "#ffffff",
  lineWidth = 1,
}) {
  const safe = (v) => (Number.isFinite(v) && v > 0 ? v : 0.0001);
  const w = safe(width);
  const h = safe(height);
  const d = safe(depth);
  const eps = 0.001;

  /* wireframe geometry, slightly inflated to sit on top */
  const edges = useMemo(
    () =>
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(w + eps * 2, h + eps * 2, d + eps * 2)
      ),
    [w, h, d]
  );

  return (
    <lineSegments geometry={edges} position={[0, h / 2 + eps, 0]}>
      <lineBasicMaterial
        attach="material"
        color={color}
        depthTest={false}
        linewidth={lineWidth}
      />
    </lineSegments>
  );
}
