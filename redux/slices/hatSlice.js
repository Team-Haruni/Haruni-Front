import { createSlice } from "@reduxjs/toolkit";
import hatImages from "../../src/data/hatImages";

const hatSlice = createSlice({
  name: "hat",
  initialState: {
    hatImages: hatImages,
  },
  reducers: {
    toggleSelect: (state, action) => {
      const index = action.payload;

      const updatedImages = state.hatImages.map((image, idx) =>
        idx === index ? { ...image, selected: !image.selected } : image
      );

      // 새로운 배열을 상태로 업데이트
      state.hatImages = updatedImages;
      //console.log(state.hatImages);
    },
    resetImages: (state) => {
      state.hatImages = hatImages;
    },
  },
});

export const { toggleSelect, resetImages } = hatSlice.actions;
export default hatSlice.reducer;
