"use client";

import { Html } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useState } from "react";
import { useSTLStore } from "@/store/stlStore";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";

export default function ModelChooser() {
  /* global store slices */
  const fileList = ["/models/I.PLY", "/models/demo2.PLY", "/models/Z.PLY"];
  const pendingAttach = useSTLStore((s) => s.pendingAttach);
  const addModel = useSTLStore((s) => s.addModel);
  const clearPending = useSTLStore((s) => s.setPendingAttach);

  const [busy, setBusy] = useState(false);

  /* no face selected → no overlay */
  if (!pendingAttach) return null;

  /* pick + load */
  function pick(fileUrl) {
    setBusy(true);

    new PLYLoader().load(fileUrl, (geom) => {
      geom.computeVertexNormals();
      geom.computeBoundingBox();
      geom.center();
      geom.scale(0.001, 0.001, 0.001)

      /* 🔑 grab the *current* pendingAttach safely */
      const attach = useSTLStore.getState().pendingAttach;
      const newShape = fileUrl.split("/")[2].split(".")[0];
      let pos = [];
      if (attach && attach.worldCenter) {
        // if (attach.currShape === "Z" && newShape === "Z") {
        //   if (attach.negativeX) {
        //     pos = [
        //       attach.worldCenter.x - attach.size.x * 0.001,
        //       attach.worldCenter.y,
        //       attach.worldCenter.z + attach.size.z * 0.001 * (2 / 3) + 0.03,
        //     ];
        //   } else {
        //     pos = [
        //       attach.worldCenter.x + attach.size.x * 0.001,
        //       attach.worldCenter.y,
        //       attach.worldCenter.z - attach.size.z * 0.001 * (2 / 3) - 0.03,
        //     ];
        //   }
        // } else if (attach.currShape === "Z" && newShape === "I") {
        //   if (attach.negativeX) {
        //     pos = [
        //       attach.worldCenter.x - attach.size.x * 0.001,
        //       attach.worldCenter.y,
        //       attach.worldCenter.z + attach.size.z * 0.001 * (2 / 3) + 0.03,
        //     ];
        //   } else {
        //     pos = [
        //       attach.worldCenter.x + attach.size.x * 0.001,
        //       attach.worldCenter.y,
        //       attach.worldCenter.z - attach.size.z * 0.001 * (2 / 3) - 0.03,
        //     ];
        //   }
        // }
        addModel(attach.worldCenter.x*0.001, attach.worldCenter.y*0.001 ,attach.worldCenter.z*0.001 , geom, newShape);
        clearPending(null);
      }

      setBusy(false);
    });
  }

  return (
    <Html>
      <div
        style={{
          position: "fixed",
          top: "40%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 2px 10px #0003",
          minWidth: 240,
        }}
      >
        <h4>Select model</h4>

        <ul style={{ listStyle: "none", padding: 0, margin: "8px 0" }}>
          {fileList.map((f) => (
            <li
              key={f}
              style={{
                margin: "6px 0",
                cursor: busy ? "progress" : "pointer",
                opacity: busy ? 0.4 : 1,
              }}
              onClick={() => !busy && pick(f)}
            >
              {f.replace("/models/", "")}
            </li>
          ))}
        </ul>

        <button
          disabled={busy}
          onClick={() => clearPending(null)}
          style={{ marginTop: 12 }}
        >
          Cancel
        </button>
      </div>
    </Html>
  );
}
