
import React, { useEffect, useRef } from "react";
import { useControls } from "leva";

function ScaleControl({ selectedAsset, onUpdateAsset }) {
  const [scale, setScale] = useControls(
    "Scale",
    () => ({
      scaleX: {
        value: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
      },
      scaleY: {
        value: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
      },
      scaleZ: {
        value: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
      },
    }),
  );

  const prevScaleRef = useRef(scale);

  useEffect(() => {
    if (selectedAsset) {
      const newAssetScale = {
        scaleX: selectedAsset.scale?.scaleX || 1,
        scaleY: selectedAsset.scale?.scaleY || 1,
        scaleZ: selectedAsset.scale?.scaleZ || 1,
      };

      // Only update Leva controls if the asset's scale has truly changed
      if (
        newAssetScale.scaleX !== prevScaleRef.current.scaleX ||
        newAssetScale.scaleY !== prevScaleRef.current.scaleY ||
        newAssetScale.scaleZ !== prevScaleRef.current.scaleZ
      ) {
        setScale(newAssetScale);
        prevScaleRef.current = newAssetScale; // Update ref with new values
      }
    }
  }, [selectedAsset, setScale]);

  // Sync updates when Leva controls change
  useEffect(() => {
    const currentScaleValues = {
      scaleX: scale.scaleX,
      scaleY: scale.scaleY,
      scaleZ: scale.scaleZ,
    };

    // Only call onUpdateAsset if the scale values from Leva have actually changed
    if (
      currentScaleValues.scaleX !== prevScaleRef.current.scaleX ||
      currentScaleValues.scaleY !== prevScaleRef.current.scaleY ||
      currentScaleValues.scaleZ !== prevScaleRef.current.scaleZ
    ) {
      onUpdateAsset(selectedAsset.id, { scale: currentScaleValues });
      prevScaleRef.current = currentScaleValues; // Update ref with values
    }
  }, [scale.scaleX, scale.scaleY, scale.scaleZ, onUpdateAsset, selectedAsset.id]);

  return null; // This component only provides controls, no visible output
}

export default ScaleControl;
