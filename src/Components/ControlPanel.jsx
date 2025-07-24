import React, { useEffect, useRef } from "react";
import { useControls, Leva } from "leva";

function ControlPanel({ selectedAsset, onUpdateAsset }) {
  const [position, setPosition] = useControls(
    "Position",
    () => ({
      x: { value: 0, min: -10, max: 10, step: 0.1 },
      y: { value: 0, min: -10, max: 10, step: 0.1 },
      z: { value: 0, min: -10, max: 10, step: 0.1 },
    }),
  );

  const [scale, setScale] = useControls(
    "Scale",
    () => ({
      x: { value: 1, min: 0.1, max: 10, step: 0.1 },
      y: { value: 1, min: 0.1, max: 10, step: 0.1 },
      z: { value: 1, min: 0.1, max: 10, step: 0.1 },
    }),
  );

  const [distances, setDistances] = useControls(
    "Distances",
    () => ({
      distWallNegX: { value: 0, min: 0, max: 10, step: 0.1 },
      distWallPosX: { value: 0, min: 0, max: 10, step: 0.1 },
      distFloor: { value: 0, min: 0, max: 10, step: 0.1 },
    }),
  );

  const [dimensions, setDimensions] = useControls(
    "Dimensions",
    () => ({
      width: { value: 1 },
      height: { value: 1 },
      depth: { value: 1 },
    }),
  );

  const [rotation, setRotation] = useControls(
    "Rotation",
    () => ({
      rotX: { value: 0, min: -180, max: 180, step: 1 },
      rotY: { value: 0, min: -180, max: 180, step: 1 },
      rotZ: { value: 0, min: -180, max: 180, step: 1 },
    }),
  );

  const prevPositionRef = useRef(position);
  const prevScaleRef = useRef(scale);
  const prevDimensionsRef = useRef(dimensions);
  const prevRotationRef = useRef(rotation);
  const prevDistancesRef = useRef(distances);

  useEffect(() => {
    if (selectedAsset) {
      const newPosition = {
        x: selectedAsset.position?.[0] || 0,
        y: selectedAsset.position?.[1] || 0,
        z: selectedAsset.position?.[2] || 0,
      };
      if (
        newPosition.x !== prevPositionRef.current.x ||
        newPosition.y !== prevPositionRef.current.y ||
        newPosition.z !== prevPositionRef.current.z
      ) {
        setPosition(newPosition);
        prevPositionRef.current = newPosition;
      }

      const newScale = {
        x: selectedAsset.scale?.[0] || 1,
        y: selectedAsset.scale?.[1] || 1,
        z: selectedAsset.scale?.[2] || 1,
      };
      if (
        newScale.x !== prevScaleRef.current.x ||
        newScale.y !== prevScaleRef.current.y ||
        newScale.z !== prevScaleRef.current.z
      ) {
        setScale(newScale);
        prevScaleRef.current = newScale;
      }

      const newDistances = {
        distWallNegX: selectedAsset.distWallNegX || 0,
        distWallPosX: selectedAsset.distWallPosX || 0,
        distFloor: selectedAsset.distFloor || 0,
      };
      if (
        newDistances.distWallNegX !== prevDistancesRef.current.distWallNegX ||
        newDistances.distWallPosX !== prevDistancesRef.current.distWallPosX ||
        newDistances.distFloor !== prevDistancesRef.current.distFloor
      ) {
        setDistances(newDistances);
        prevDistancesRef.current = newDistances;
      }

      const newDimensions = {
        width: selectedAsset.dimensions?.width || 1,
        height: selectedAsset.dimensions?.height || 1,
        depth: selectedAsset.dimensions?.depth || 1,
      };
      if (
        newDimensions.width !== prevDimensionsRef.current.width ||
        newDimensions.height !== prevDimensionsRef.current.height ||
        newDimensions.depth !== prevDimensionsRef.current.depth
      ) {
        setDimensions(newDimensions);
        prevDimensionsRef.current = newDimensions;
      }

      const newRotation = {
        rotX: selectedAsset.rotation?.rotX || 0,
        rotY: selectedAsset.rotation?.rotY || 0,
        rotZ: selectedAsset.rotation?.rotZ || 0,
      };
      if (
        newRotation.rotX !== prevRotationRef.current.rotX ||
        newRotation.rotY !== prevRotationRef.current.rotY ||
        newRotation.rotZ !== prevRotationRef.current.rotZ
      ) {
        setRotation(newRotation);
        prevRotationRef.current = newRotation;
      }
    }
  }, [selectedAsset, setPosition, setScale, setDistances, setDimensions, setRotation]);

  useEffect(() => {
    if (selectedAsset) {
      const currentPosition = { x: position.x, y: position.y, z: position.z };
      const currentScale = { x: scale.x, y: scale.y, z: scale.z };
      const currentDimensions = { width: dimensions.width, height: dimensions.height, depth: dimensions.depth };
      const currentRotation = { rotX: rotation.rotX, rotY: rotation.rotY, rotZ: rotation.rotZ };
      const currentDistances = { distWallNegX: distances.distWallNegX, distWallPosX: distances.distWallPosX, distFloor: distances.distFloor };

      let shouldUpdate = false;

      if (
        currentPosition.x !== prevPositionRef.current.x ||
        currentPosition.y !== prevPositionRef.current.y ||
        currentPosition.z !== prevPositionRef.current.z
      ) {
        shouldUpdate = true;
        prevPositionRef.current = currentPosition;
      }

      if (
        currentScale.x !== prevScaleRef.current.x ||
        currentScale.y !== prevScaleRef.current.y ||
        currentScale.z !== prevScaleRef.current.z
      ) {
        shouldUpdate = true;
        prevScaleRef.current = currentScale;
      }

      if (
        currentDimensions.width !== prevDimensionsRef.current.width ||
        currentDimensions.height !== prevDimensionsRef.current.height ||
        currentDimensions.depth !== prevDimensionsRef.current.depth
      ) {
        shouldUpdate = true;
        prevDimensionsRef.current = currentDimensions;
      }

      if (
        currentRotation.rotX !== prevRotationRef.current.rotX ||
        currentRotation.rotY !== prevRotationRef.current.rotY ||
        currentRotation.rotZ !== prevRotationRef.current.rotZ
      ) {
        shouldUpdate = true;
        prevRotationRef.current = currentRotation;
      }

      if (
        currentDistances.distWallNegX !== prevDistancesRef.current.distWallNegX ||
        currentDistances.distWallPosX !== prevDistancesRef.current.distWallPosX ||
        currentDistances.distFloor !== prevDistancesRef.current.distFloor
      ) {
        shouldUpdate = true;
        prevDistancesRef.current = currentDistances;
      }

      if (shouldUpdate) {
        onUpdateAsset(selectedAsset.id, {
          position: [position.x, position.y, position.z],
          scale: [scale.x, scale.y, scale.z],
          dimensions: currentDimensions,
          rotation: currentRotation,
          distWallNegX: currentDistances.distWallNegX,
          distWallPosX: currentDistances.distWallPosX,
          distFloor: currentDistances.distFloor,
        });
      }
    }
  }, [
    position.x, position.y, position.z,
    scale.x, scale.y, scale.z,
    dimensions.width, dimensions.height, dimensions.depth,
    rotation.rotX, rotation.rotY, rotation.rotZ,
    distances.distWallNegX, distances.distWallPosX, distances.distFloor,
    onUpdateAsset, selectedAsset?.id,
  ]);

  return (
    <div className="control-panel">
      {/* <Leva collapsed={false} /> */}
    </div>
  );
}

export default ControlPanel;
