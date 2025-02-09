import { createSlice } from "@reduxjs/toolkit";
const appStartLoadingSlice = createSlice({
  name: "loading",
  initialState: {
    loading: true,
  },
  reducers: {
    setLoading: (state) => {
      state.loading = !state.loading;
    },
  },
});

export const { setLoading } = appStartLoadingSlice.actions;
export default appStartLoadingSlice.reducer;
