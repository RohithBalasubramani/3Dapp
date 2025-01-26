"use client";
import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { DragControls } from "@react-three/drei";
import Asset from "./Asset";

function AssetDragControls({
  assets,
  selectedAssetId,
  onSelectAsset,
  onUpdateAsset,
}) {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  // Create a persistent ref object to store refs for each asset
  const assetRefs = useRef({});

  // Initialize refs for assets only once in useEffect
  useEffect(() => {
    assets.forEach((asset) => {
      if (!assetRefs.current[asset.id]) {
        assetRefs.current[asset.id] = React.createRef();
      }
    });
  }, [assets]);

  const handleDragStart = (event, asset) => {
    event.object.material.color.set("orange");
    onSelectAsset(asset.id);
  };

  const handleDragEnd = (event, asset) => {
    event.object.material.color.set("blue");
    const { x, y, z } = event.object.position;
    onUpdateAsset(asset.id, { position: { x, y, z } });
  };

  return (
    <>
      <DragControls
        ref={controlsRef}
        args={[
          Object.values(assetRefs.current).map((ref) => ref.current),
          camera,
          gl.domElement,
        ]}
        onDragStart={(e) => handleDragStart(e, e.object.userData)}
        onDragEnd={(e) => handleDragEnd(e, e.object.userData)}
      />
      {assets.map((asset) => (
        <Asset
          key={asset.id}
          asset={asset}
          isSelected={asset.id === selectedAssetId}
          onSelect={() => onSelectAsset(asset.id)}
          ref={assetRefs.current[asset.id]}
        />
      ))}
    </>
  );
}

export default AssetDragControls;
