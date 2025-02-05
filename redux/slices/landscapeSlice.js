import { createSlice } from "@reduxjs/toolkit";
import landscapeImages from "../../src/data/landscapeImages";

const landscapeSlice = createSlice({
  name: "landscape",
  initialState: {
    landscapeImages: landscapeImages,
  },
  reducers: {
    toggleSelect: (state, action) => {
      const index = action.payload;

      const updatedImages = state.landscapeImages.map((image, idx) =>
        idx === index ? { ...image, selected: !image.selected } : image
      );

      // 새로운 배열을 상태로 업데이트
      state.landscapeImages = updatedImages;
      //console.log(state.landscapeImages);
    },
    resetImages: (state) => {
      state.landscapeImages = landscapeImages;
    },
  },
});

export const { toggleSelect, resetImages } = landscapeSlice.actions;
export default landscapeSlice.reducer;
