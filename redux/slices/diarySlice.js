import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  diaries: [],
};

const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {
    setDiaries: (state, action) => {
      state.diaries = action.payload;
    },
    resetDiaries: (state) => {
      state.diaries = [];
    },
  },
});

export const { setDiaries } = diarySlice.actions;
export default diarySlice.reducer;
