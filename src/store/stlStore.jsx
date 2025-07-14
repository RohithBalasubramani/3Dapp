import { create } from "zustand";

/* A single store shared by server & client */
export const useSTLStore = create((set) => ({
  /* placed meshes */
  models: [],
  addModel: (x, y, z, geo) =>
    set((s) => ({ models: [...s.models, { pos: [x, y, z], geo }] })),

  /* thumbnail drag needs this */
  selectedModel: null,
  setSelectedModel: (model) => set({ selectedModel: model }),

  /* drag-and-drop */
  dragging: null,
  startDrag: (geo, scale) => set({ dragging: { geo, scale } }),
  finishDrag: () => set({ dragging: null }),

  /* face-attach flow */
  pendingAttach: null, // { pos, scale }
  setPendingAttach: (p) => set({ pendingAttach: p }),

  /* list of *.stl files (set once in <ClientApp>) */
  fileList: [],
  setFileList: (files) => set({ fileList: files }),
}));
