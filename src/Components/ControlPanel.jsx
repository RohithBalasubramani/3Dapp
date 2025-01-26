// ControlPanel.js
import React from "react";
import DimensionsControl from "./DimensionsControl";
import PositionControl from "./PositionControl";

function ControlPanel({ selectedAsset, onUpdateAsset }) {
  const updateDimensions = (newDimensions) => {
    onUpdateAsset({ ...selectedAsset, dimensions: newDimensions });
  };

  const updatePosition = (newPosition) => {
    onUpdateAsset({ ...selectedAsset, position: newPosition });
  };

  return (
    <div className="control-panel">
      <h3>Adjust {selectedAsset.type} Properties</h3>
      <DimensionsControl
        dimensions={selectedAsset.dimensions}
        onChange={updateDimensions}
      />
      <PositionControl
        position={selectedAsset.position}
        onChange={updatePosition}
      />
    </div>
  );
}

export default ControlPanel;
