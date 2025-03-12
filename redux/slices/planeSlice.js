import { createSlice } from "@reduxjs/toolkit";
import planeImages from "../../src/data/planeImages";

const planeSlice = createSlice({
  name: "plane",
  initialState: {
    planeImages: planeImages,
    currentIndex: 0,
  },
  reducers: {
    resetImages: (state) => {
      state.planeImages = planeImages;
    },
    setCurrentPlaneIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
  },
});

export const { resetImages, setCurrentPlaneIndex } = planeSlice.actions;
export default planeSlice.reducer;
