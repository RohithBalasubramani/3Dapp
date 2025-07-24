import { create } from "zustand";

export const useSTLStore = create((set, get) => ({
  models: [],
  addModel: (x, y, z, geo, shape) =>
    set((s) => ({
      models: [
        ...s.models,
        {
          id: s.models.length + 1,
          position: [x, y, z],
          geometry: geo,
          shape: shape,
          scale: [1, 1, 1],
          distWallNegX: 0,
          distWallPosX: 0,
          distFloor: 0,
          dimensions: {},
        },
      ],
    })),
  updateModel: (id, upd) =>
    set((s) => ({
      models: s.models.map((m) => (m.id === id ? { ...m, ...upd } : m)),
    })),

  roomDimensions: { width: 10, height: 5, depth: 10 },
  setRoomDimensions: (dimensions) => set({ roomDimensions: dimensions }),

  referenceWall: null,
  setReferenceWall: (wall) => set({ referenceWall: wall }),

  selectedAssetId: null,
  setSelectedAssetId: (id) => set({ selectedAssetId: id }),

  // Drag-and-drop state
  dragging: false,
  draggedModel: null,

  startDrag: (geometry, shape) => {
    const newModel = {
      id: `temp-${Date.now()}`,
      geometry,
      shape,
      position: [0, 0, 0],
      scale: [0.01, 0.01, 0.01],
      dimensions: {},
    };
    set({ dragging: true, draggedModel: newModel });
  },

  stopDrag: () => {
    const { draggedModel } = get();
    if (!draggedModel) return;

    set((state) => ({
      dragging: false,
      draggedModel: null,
      models: [...state.models, { ...draggedModel, id: state.models.length + 1 }],
      selectedAssetId: state.models.length + 1,
    }));
  },

  updateDragPosition: (position) => {
    set((state) => {
      if (!state.draggedModel) return {};
      return {
        draggedModel: { ...state.draggedModel, position },
      };
    });
  },

  finishDrag: () => set({ dragging: false, draggedModel: null }),

  fileList: [],
  setFileList: (files) => set({ fileList: files }),
}));