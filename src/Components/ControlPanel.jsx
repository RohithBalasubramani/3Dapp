import React, { useEffect } from "react";
import { useControls, Leva } from "leva";

function ControlPanel({ selectedAsset, onUpdateAsset }) {
  if (!selectedAsset) return null; // Prevents crashes if no asset is selected

  // Define Leva controls for position (Sliders)
  const [position, setPosition] = useControls(
    () => ({
      x: {
        value: selectedAsset.position?.x || 0,
        min: -10,
        max: 10,
        step: 0.1,
      },
      y: {
        value: selectedAsset.position?.y || 0,
        min: -10,
        max: 10,
        step: 0.1,
      },
      z: {
        value: selectedAsset.position?.z || 0,
        min: -10,
        max: 10,
        step: 0.1,
      },
    }),
    [selectedAsset]
  );

  // Define manual input fields for dimensions
  const [dimensions, setDimensions] = useControls(
    () => ({
      width: { value: selectedAsset.dimensions?.width || 1 },
      height: { value: selectedAsset.dimensions?.height || 1 },
      depth: { value: selectedAsset.dimensions?.depth || 1 },
    }),
    [selectedAsset]
  );

  // Define rotation controls (Sliders)
  const [rotation, setRotation] = useControls(
    () => ({
      rotX: {
        value: selectedAsset.rotation?.x || 0,
        min: -180,
        max: 180,
        step: 1,
      },
      rotY: {
        value: selectedAsset.rotation?.y || 0,
        min: -180,
        max: 180,
        step: 1,
      },
      rotZ: {
        value: selectedAsset.rotation?.z || 0,
        min: -180,
        max: 180,
        step: 1,
      },
    }),
    [selectedAsset]
  );

  // Sync updates when Leva controls change
  useEffect(() => {
    onUpdateAsset({
      ...selectedAsset,
      position,
      dimensions,
      rotation,
    });
  }, [position, dimensions, rotation]);

  return (
    <div className="control-panel">
      {/* <h3>Adjust {selectedAsset.type} Properties</h3> */}
      {/* <Leva collapsed={false} /> */}
    </div>
  );
}

export default ControlPanel;
