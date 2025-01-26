import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import styles from "./Styles/AssetLib.module.css";
import LShapedDuct from "./LShape";

function Box({ position, onClick }) {
  const meshRef = useRef();
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));

  return (
    <mesh position={position} ref={meshRef} scale={1} onClick={onClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function AssetLibrary({ onAddAsset }) {
  return (
    <div className={styles.Component}>
      <h3 className={styles.head}>
        Assets Library
        <br />
        <span className={styles.span}>Select Your Assets</span>
      </h3>

      <div className={styles.Content}>
        {/* First Canvas */}
        <div className={styles.CanvasWrapper}>
          <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              decay={0}
              intensity={Math.PI}
            />
            <pointLight
              position={[-10, -10, -10]}
              decay={0}
              intensity={Math.PI}
            />
            <Box position={[-1.2, 0, 0]} onClick={() => onAddAsset("Duct")} />
          </Canvas>
          <span className={styles.span}>Add Normal Bus Duct</span>
        </div>

        {/* Second Canvas */}
        <div className={styles.CanvasWrapper}>
          <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              decay={0}
              intensity={Math.PI}
            />
            <pointLight
              position={[-10, -10, -10]}
              decay={0}
              intensity={Math.PI}
            />
            <LShapedDuct
              position={[1.2, 0, 0]}
              onClick={() => onAddAsset("L_Shaped")}
            />
          </Canvas>
          <span className={styles.span}>Add L-Shaped Bus Duct</span>
        </div>
      </div>
    </div>
  );
}

export default AssetLibrary;
