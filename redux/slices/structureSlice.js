import { createSlice } from "@reduxjs/toolkit";
import structureImages from "../../src/data/structureImages";

const structureSlice = createSlice({
  name: "structure",
  initialState: {
    structureImages: structureImages,
  },
  reducers: {
    // 기존 토글 액션
    toggleSelect: (state, action) => {
      const index = action.payload;

      const updatedImages = state.structureImages.map((image, idx) =>
        idx === index ? { ...image, selected: !image.selected } : image
      );

      state.structureImages = updatedImages;
    },
    // 새로운 액션 - API에서 불러올 때 사용
    setSelected: (state, action) => {
      const targetId = action.payload;
      
      // 모든 항목을 선택 해제
      state.structureImages = state.structureImages.map(image => ({
        ...image,
        selected: false
      }));
      
      // id가 일치하는 항목을 선택
      const targetImage = state.structureImages.find(image => image.id === targetId);
      if (targetImage) {
        targetImage.selected = true;
      }
    },
    resetImages: (state) => {
      state.structureImages = structureImages;
    },
  },
});

export const { toggleSelect, setSelected, resetImages } = structureSlice.actions;
export default structureSlice.reducer;