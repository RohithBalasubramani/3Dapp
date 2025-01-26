import React from "react";

function PositionControl({ position, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...position, [name]: parseFloat(value) });
  };

  return (
    <div className="position-control">
      <label>
        X Position:
        <input
          type="number"
          name="x"
          value={position.x}
          onChange={handleChange}
        />
      </label>
      <label>
        Y Position:
        <input
          type="number"
          name="y"
          value={position.y}
          onChange={handleChange}
        />
      </label>
      <label>
        Z Position:
        <input
          type="number"
          name="z"
          value={position.z}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}

export default PositionControl;
