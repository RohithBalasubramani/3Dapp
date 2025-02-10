"use client";

import React from "react";
import { useRouter } from "next/router";

function BOQ({ assets }) {
  // Function to group assets by type and dimensions
  const groupedAssets = assets.reduce((acc, asset) => {
    // Create a unique key for asset grouping (type + dimensions)
    const key = `${asset.type}-${JSON.stringify(asset.dimensions)}`;

    if (!acc[key]) {
      acc[key] = {
        type: asset.type,
        dimensions: asset.dimensions,
        quantity: 1,
      };
    } else {
      acc[key].quantity += 1;
    }

    return acc;
  }, {});

  // Convert object to array for rendering
  const assetList = Object.values(groupedAssets);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bill of Quantities (BOQ)</h2>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Dimensions</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {assetList.map((asset, index) => (
            <tr key={index}>
              <td>{asset.type}</td>
              <td>
                {Object.entries(asset.dimensions)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ")}
              </td>
              <td>{asset.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BOQ;
