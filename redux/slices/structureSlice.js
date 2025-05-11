import { createSlice } from "@reduxjs/toolkit";
import structureImages from "../../src/data/structureImages";

const structureSlice = createSlice({
  name: "structure",
  initialState: {
    structureImages: structureImages,
    fixStructureImages: structureImages,
  },
  reducers: {
    toggleSelectStructure: (state, action) => {
      const index = action.payload;

      const updatedImages = state.structureImages.map((image, idx) =>
        idx === index ? { ...image, selected: !image.selected } : image
      );

      // 새로운 배열을 상태로 업데이트
      state.structureImages = updatedImages;
      //console.log(state.structureImages);
    },
    resetStructureImages: (state) => {
      state.structureImages = structureImages;
    },
    submitStructureImages: (state) => {
      state.fixStructureImages = state.structureImages;
    },
  },
});

export const {
  toggleSelectStructure,
  resetStructureImages,
  submitStructureImages,
} = structureSlice.actions;
export default structureSlice.reducer;
