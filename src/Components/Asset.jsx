import React, { useRef } from "react";
import { Box, Cylinder } from "@react-three/drei";
import LShapedDuct from "./LShape";

function Asset({ asset, isSelected, onSelect }) {
  const assetRef = useRef();

  // Set color based on selection status
  const materialColor = isSelected ? "orange" : "blue";

  // Convert rotation degrees to radians
  const rotation = [
    (asset.rotation?.rotX || 0) * (Math.PI / 180),
    (asset.rotation?.rotY || 0) * (Math.PI / 180),
    (asset.rotation?.rotZ || 0) * (Math.PI / 180),
  ];

  // Attach asset data to `userData` for access in drag events
  if (assetRef.current) {
    assetRef.current.userData = asset;
  }

  return (
    <>
      {asset.type === "Duct" && (
        <Box
          ref={assetRef}
          args={[
            asset.dimensions.width,
            asset.dimensions.height,
            asset.dimensions.depth,
          ]}
          position={[asset.position.x, asset.position.y, asset.position.z]}
          rotation={rotation} // Apply rotation
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <meshStandardMaterial color={materialColor} />
        </Box>
      )}
      {asset.type === "BusBar" && (
        <Cylinder
          ref={assetRef}
          args={[
            asset.dimensions.radiusTop,
            asset.dimensions.radiusBottom,
            asset.dimensions.height,
            32,
          ]}
          position={[asset.position.x, asset.position.y, asset.position.z]}
          rotation={rotation} // Apply rotation
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <meshStandardMaterial color={materialColor} />
        </Cylinder>
      )}
      {asset.type === "L-Shaped" && <LShapedDuct />}
      {/* Add other asset types similarly */}
    </>
  );
}

export default Asset;
