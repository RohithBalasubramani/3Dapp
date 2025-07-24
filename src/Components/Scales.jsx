import React from "react";
import { useSTLStore } from "@/store/stlStore";

export default function Scales() {
  const dragging = useSTLStore((s) => s.dragging);
  const draggedModel = useSTLStore((s) => s.draggedModel);
  const roomDimensions = useSTLStore((s) => s.roomDimensions);

  if (!dragging || !draggedModel) return null;

  const [x, y, z] = draggedModel.position;
  const { width, height, depth } = roomDimensions;

  const fmt = (v) => `${v.toFixed(2)} m`;

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        padding: "6px 10px",
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        fontSize: 12,
        borderRadius: 4,
        lineHeight: 1.3,
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      <strong style={{ fontSize: 13 }}>Placement Distances</strong>
      <div>South wall: {fmt(z + depth / 2)}</div>
      <div>North wall: {fmt(depth / 2 - z)}</div>
      <div>West wall:  {fmt(x + width / 2)}</div>
      <div>East wall:  {fmt(width / 2 - x)}</div>
      <div>Floor:      {fmt(y)}</div>
      <div>Ceiling:    {fmt(height - y)}</div>
    </div>
  );
}
