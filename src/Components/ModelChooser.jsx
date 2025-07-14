"use client";

import { Html } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useState } from "react";
import { useSTLStore } from "@/store/stlStore";

export default function ModelChooser() {
  /* global store slices */
  const fileList = useSTLStore((s) => s.fileList);
  const pendingAttach = useSTLStore((s) => s.pendingAttach);
  const addModel = useSTLStore((s) => s.addModel);
  const clearPending = useSTLStore((s) => s.setPendingAttach);

  const [busy, setBusy] = useState(false);

  /* no face selected → no overlay */
  if (!pendingAttach) return null;

  /* pick + load */
  function pick(fileUrl) {
    setBusy(true);

    new STLLoader().load(fileUrl, (geom) => {
      geom.computeVertexNormals();
      geom.computeBoundingBox();
      geom.center();

      /* 🔑 grab the *current* pendingAttach safely */
      const attach = useSTLStore.getState().pendingAttach;
      if (attach && attach.pos) {
        addModel(...attach.pos, geom);
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
