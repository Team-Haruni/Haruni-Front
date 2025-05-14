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
      const indexes = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      const updatedImages = state.landscapeImages.map((image, idx) => {
        if (indexes.includes(idx)) {
          return { ...image, selected: !image.selected };
        }
        return image;
      });

      state.landscapeImages = updatedImages;
    },
    resetLandscapeImages: (state) => {
      state.landscapeImages = landscapeImages;
    },
  },
});

export const { toggleSelectLandscape, resetLandscapeImages } =
  landscapeSlice.actions;
export default landscapeSlice.reducer;
