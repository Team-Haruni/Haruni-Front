import { createSlice } from "@reduxjs/toolkit";
import hatImages from "../../src/data/hatImages";

const hatSlice = createSlice({
  name: "hat",
  initialState: {
    hatImages: hatImages,
  },
  reducers: {
    // 기존 토글 액션 - 사용자가 UI에서 선택할 때 사용
    toggleSelect: (state, action) => {
      const index = action.payload;

      const updatedImages = state.hatImages.map((image, idx) =>
        idx === index ? { ...image, selected: !image.selected } : image
      );

      state.hatImages = updatedImages;
    },
    // 새로운 액션 - API에서 불러올 때 사용
    setSelected: (state, action) => {
      const targetId = action.payload;
      
      // 모든 항목을 선택 해제
      state.hatImages = state.hatImages.map(image => ({
        ...image,
        selected: false
      }));
      
      // id가 일치하는 항목을 선택
      const targetImage = state.hatImages.find(image => image.id === targetId);
      if (targetImage) {
        targetImage.selected = true;
      }
    },
    resetImages: (state) => {
      state.hatImages = hatImages;
    },
  },
});

export const { toggleSelect, setSelected, resetImages } = hatSlice.actions;
export default hatSlice.reducer;