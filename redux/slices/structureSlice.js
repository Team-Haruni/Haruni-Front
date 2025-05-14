import { createSlice } from "@reduxjs/toolkit";
import structureImages from "../../src/data/structureImages";

const structureSlice = createSlice({
  name: "structure",
  initialState: {
    structureImages: structureImages,
  },
  reducers: {
    toggleSelectStructure: (state, action) => {
      const indexes = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      const updatedImages = state.structureImages.map((image, idx) => {
        if (indexes.includes(idx)) {
          return { ...image, selected: !image.selected };
        }
        return image;
      });

      state.structureImages = updatedImages;
    },
    resetStructureImages: (state) => {
      state.structureImages = structureImages;
    },
  },
});

export const { toggleSelectStructure, resetStructureImages } =
  structureSlice.actions;
export default structureSlice.reducer;
