import { createSlice } from "@reduxjs/toolkit";
import structureImages from "../../src/data/structureImages";

const structureSlice = createSlice({
  name: "structure",
  initialState: {
    structureImages: structureImages,
  },
  reducers: {
    toggleSelect: (state, action) => {
      const index = action.payload;

      const updatedImages = state.structureImages.map((image, idx) =>
        idx === index ? { ...image, selected: !image.selected } : image
      );

      // 새로운 배열을 상태로 업데이트
      state.structureImages = updatedImages;
      //console.log(state.structureImages);
    },
    resetImages: (state) => {
      state.structureImages = structureImages;
    },
  },
});

export const { toggleSelect, resetImages } = structureSlice.actions;
export default structureSlice.reducer;
