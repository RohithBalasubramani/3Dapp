import React from "react";

function AssetCard({ asset, onSelect }) {
  return (
    <div className="asset-card" onClick={onSelect}>
      <h4>{asset.name}</h4>
      <p>Type: {asset.type}</p>
      <p>Dimensions: {JSON.stringify(asset.dimensions)}</p>
    </div>
  );
}

export default AssetCard;
