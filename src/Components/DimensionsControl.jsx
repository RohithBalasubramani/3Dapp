import React from "react";

function DimensionsControl({ dimensions, onChange, selectedDimension }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...dimensions, [name]: parseFloat(value) });
  };

  return (
    <div className="dimensions-control">
      <label>
        Width:
        <input
          type="number"
          name="width"
          value={dimensions.width}
          onChange={handleChange}
        />
      </label>
      <label>
        Height:
        <input
          type="number"
          name="height"
          value={dimensions.height}
          onChange={handleChange}
        />
      </label>
      <label>
        Depth:
        <input
          type="number"
          name="depth"
          value={dimensions.depth}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}

export default DimensionsControl;
