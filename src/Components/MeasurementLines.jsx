import React from "react";
import { Line } from "@react-three/drei";

const MeasurementLines = ({ selectedAsset, roomDimensions }) => {
  if (!selectedAsset) return null;

  const { position } = selectedAsset;
  const { width, height, depth } = roomDimensions;

  const lines = [];

  // Distance from the left wall
  lines.push(
    <Line
      key="line-left"
      points={[
        [-width / 2, position.y, position.z],
        [position.x, position.y, position.z],
      ]}
      color="red"
      lineWidth={1}
    />
  );

  // Distance from the right wall
  lines.push(
    <Line
      key="line-right"
      points={[
        [position.x, position.y, position.z],
        [width / 2, position.y, position.z],
      ]}
      color="red"
      lineWidth={1}
    />
  );

  // Distance from the floor
  lines.push(
    <Line
      key="line-floor"
      points={[
        [position.x, 0, position.z],
        [position.x, position.y, position.z],
      ]}
      color="green"
      lineWidth={1}
    />
  );

  // Distance from the back wall
  lines.push(
    <Line
      key="line-back"
      points={[
        [position.x, position.y, -depth / 2],
        [position.x, position.y, position.z],
      ]}
      color="blue"
      lineWidth={1}
    />
  );

  // Distance from the front wall
  lines.push(
    <Line
      key="line-front"
      points={[
        [position.x, position.y, position.z],
        [position.x, position.y, depth / 2],
      ]}
      color="blue"
      lineWidth={1}
    />
  );

  return <group>{lines}</group>;
};

export default MeasurementLines;