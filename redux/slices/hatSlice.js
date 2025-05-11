import { createSlice } from "@reduxjs/toolkit";
import hatImages from "../../src/data/hatImages";

const hatSlice = createSlice({
  name: "hat",
  initialState: {
    hatImages: hatImages,
    fixHatImages: hatImages,
  },
  reducers: {
    toggleSelectHat: (state, action) => {
      const index = action.payload;

      const updatedImages = state.hatImages.map((image, idx) =>
        idx === index ? { ...image, selected: !image.selected } : image
      );

      // 새로운 배열을 상태로 업데이트
      state.hatImages = updatedImages;
      //console.log(state.hatImages);
    },
    resetHatImages: (state) => {
      state.hatImages = hatImages;
    },
    submitHatImages: (state) => {
      state.fixHatImages = state.hatImages;
    },
  },
});

export const { toggleSelectHat, resetHatImages, submitHatImages } =
  hatSlice.actions;
export default hatSlice.reducer;
