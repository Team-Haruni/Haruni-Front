import { createSlice } from "@reduxjs/toolkit";
import landscapeImages from "../../src/data/landscapeImages";

const landscapeSlice = createSlice({
  name: "landscape",
  initialState: {
    landscapeImages: landscapeImages,
  },
  reducers: {
    // 기존 토글 액션
    toggleSelect: (state, action) => {
      const index = action.payload;

      const updatedImages = state.landscapeImages.map((image, idx) =>
        idx === index ? { ...image, selected: !image.selected } : image
      );

      state.landscapeImages = updatedImages;
    },
    // 새로운 액션 - API에서 불러올 때 사용
    setSelected: (state, action) => {
      const targetId = action.payload;
      
      // 모든 항목을 선택 해제
      state.landscapeImages = state.landscapeImages.map(image => ({
        ...image,
        selected: false
      }));
      
      // id가 일치하는 항목을 선택
      const targetImage = state.landscapeImages.find(image => image.id === targetId);
      if (targetImage) {
        targetImage.selected = true;
      }
    },
    resetImages: (state) => {
      state.landscapeImages = landscapeImages;
    },
  },
});

export const { toggleSelect, setSelected, resetImages } = landscapeSlice.actions;
export default landscapeSlice.reducer;