import { createSlice } from "@reduxjs/toolkit";
import hatImages from "../../src/data/hatImages";

const hatSlice = createSlice({
  name: "hat",
  initialState: {
    hatImages: hatImages,
  },
  reducers: {
    toggleSelectHat: (state, action) => {
      const indexes = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      const updatedImages = state.hatImages.map((image, idx) => {
        if (indexes.includes(idx)) {
          return { ...image, selected: !image.selected };
        }
        return image;
      });

      state.hatImages = updatedImages;
    },
    resetHatImages: (state) => {
      state.hatImages = hatImages;
    },
  },
});

export const { toggleSelectHat, resetHatImages } = hatSlice.actions;
export default hatSlice.reducer;
