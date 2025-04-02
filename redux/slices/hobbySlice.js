import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  traits: [],
  selectedTraits: [],
};

const hobbySlice = createSlice({
  name: "character",
  initialState,
  reducers: {
    setSelectedTraits: (state, action) => {
      state.selectedTraits = action.payload;
    },
    setTraits: (state, action) => {
      state.traits = action.payload;
    },
    toggleTrait: (state, action) => {
      const trait = action.payload;
      if (state.selectedTraits.includes(trait)) {
        state.selectedTraits = state.selectedTraits.filter((t) => t !== trait);
      } else if (state.selectedTraits.length < 9) {
        state.selectedTraits.push(trait);
      }
    },
    resetTraits: (state) => {
      state.selectedTraits = [];
    },
  },
});

export const { setTraits, toggleTrait, resetTraits, setSelectedTraits } =
  hobbySlice.actions;
export default hobbySlice.reducer;
