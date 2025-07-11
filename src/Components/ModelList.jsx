"use client";
import { useLoader, useThree, useFrame } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";
import { useRef, useState, useEffect, useCallback } from "react";
import { create } from "zustand";
import { useSTLStore } from "./STLModel";

export function ModelList() {
  const models = ["/models/demo.stl"];
  const setSelectedModel = useSTLStore((state) => state.setSelectedModel);
  const { startDrag } = useSTLStore.getState();

  return (
    <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
      <h3>Select a model to place:</h3>
      <ul>
        {models.map((model, index) => (
          <li
            key={index}
            onClick={() => {
              const loader = new STLLoader();
              loader.load(model, (geometry) => {
                const g = geometry.clone();
                g.computeVertexNormals();
                g.computeBoundingBox();
                g.center();
                startDrag(g, [0.001, 0.001, 0.001]);
                setSelectedModel({ geometry });
              });
            }}
            style={{
              cursor: "pointer",
              padding: "5px",
              marginBottom: "10px",
              border: "1px solid #ccc",
            }}
          >
            Model {index + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}
