import { configureStore } from "@reduxjs/toolkit";
import landscapeReducer from "./slices/landscapeSlice";
import expReducer from "./slices/expSlice";
import appStartLoadingReducer from "./slices/appStartLoadingSlice";

const store = configureStore({
  reducer: {
    landscape: landscapeReducer,
    exp: expReducer,
    loading: appStartLoadingReducer,
  },
});

export default store;
