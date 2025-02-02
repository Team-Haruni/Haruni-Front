import { configureStore } from "@reduxjs/toolkit";
import landscapeReducer from "./slices/landscapeSlice";

const store = configureStore({
  reducer: {
    landscape: landscapeReducer,
  },
});

export default store;
