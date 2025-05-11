import { createSlice } from "@reduxjs/toolkit";
import landscapeImages from "../../src/data/landscapeImages";

const landscapeSlice = createSlice({
  name: "landscape",
  initialState: {
    landscapeImages: landscapeImages,
    fixLandscapeImages: landscapeImages,
  },
  reducers: {
    toggleSelectLandscape: (state, action) => {
      const index = action.payload;

      const updatedImages = state.landscapeImages.map((image, idx) =>
        idx === index ? { ...image, selected: !image.selected } : image
      );

      // 새로운 배열을 상태로 업데이트
      state.landscapeImages = updatedImages;
      //console.log(state.landscapeImages);
    },
    submitLandscapeImages: (state) => {
      state.fixLandscapeImages = state.landscapeImages;
    },
    resetLandscapeImages: (state) => {
      state.landscapeImages = state.fixLandscapeImages;
    },
  },
});

export const {
  toggleSelectLandscape,
  submitLandscapeImages,
  resetLandscapeImages,
} = landscapeSlice.actions;
export default landscapeSlice.reducer;
