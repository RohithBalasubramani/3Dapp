"use client";

import { useState } from "react";
import styles from "./page.module.css";
import AssetLibrary from "@/Components/AssetLibrary";
import dynamic from "next/dynamic";
import ClientOnly from "@/Components/ClientOnly";
import { v4 as uuidv4 } from "uuid";
import { Leva, useControls } from "leva";
import BOQ from "@/Components/Boq";
import { ModelList } from "@/Components/ModelList";

const Workspace = dynamic(() => import("../Components/Workspace"), {
  ssr: false,
});

const ControlPanel = dynamic(() => import("@/Components/ControlPanel"), {
  ssr: false,
});

export default function Home() {
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  // {
  //   "assetAId": [
  //       { id: "assetBId", offset: { x, y, z } }, // how B is offset from A
  //       { id: "assetCId", offset: { x, y, z } }
  //   ],
  //   "assetBId": [...],
  //   ...
  // }
  const [connections, setConnections] = useState({});

  // const { width } = useControls({
  //   width: {
  //     value: 4,
  //     min: 0,
  //     max: 10,
  //     step: 1,
  //   },
  // });
  // const { height } = useControls({
  //   height: {
  //     value: 4,
  //     min: 0,
  //     max: 10,
  //     step: 1,
  //   },
  // });

  // const { depth } = useControls({
  //   depth: {
  //     value: 4,
  //     min: 0,
  //     max: 10,
  //     step: 1,
  //   },
  // });

  // const selectedDimension = { width, height, depth };

  const addAsset = (assetType) => {
    const newPosition = getNextPosition(); // Calculate position to avoid overlap
    const newAsset = {
      id: uuidv4(),
      type: assetType,
      dimensions:
        assetType === "Duct"
          ? { width: 1, height: 1, depth: 1 }
          : { radiusTop: 0.5, radiusBottom: 0.5, height: 2 },
      position: newPosition,
    };
    setAssets([...assets, newAsset]);
    setSelectedAssetId(newAsset.id);
  };

  const getNextPosition = () => {
    if (assets.length === 0) return { x: 0, y: 0, z: 0 };
    const maxZ = Math.max(...assets.map((asset) => asset.position.z));
    return { x: 0, y: 0, z: maxZ + 1 };
  };

  const updateAsset = (id, updatedProperties) => {
    setAssets(
      assets.map((asset) =>
        asset.id === id ? { ...asset, ...updatedProperties } : asset
      )
    );
  };

  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);

  return (
    <div className={styles.page}>
      <AssetLibrary onAddAsset={addAsset} />
      <ClientOnly>
        <Workspace
          assets={assets}
          selectedAssetId={selectedAssetId}
          onSelectAsset={setSelectedAssetId}
          onUpdateAsset={updateAsset}
          connections={connections}
          setConnections={setConnections}
        />
        <BOQ assets={assets} />
        <ModelList />
        {selectedAsset && (
          <ControlPanel
            selectedAsset={selectedAsset}
            onUpdateAsset={(updatedAsset) =>
              updateAsset(selectedAssetId, updatedAsset)
            }
          />
        )}
      </ClientOnly>
      {/* <Leva collapsed={false} /> */}
    </div>
  );
}