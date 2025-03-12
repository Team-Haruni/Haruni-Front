import { configureStore } from "@reduxjs/toolkit";
import landscapeReducer from "./slices/landscapeSlice";
import hatReducer from "./slices/hatSlice";
import structureReducer from "./slices/structureSlice";
import expReducer from "./slices/expSlice";
import planeReducer from "./slices/planeSlice";
import appStartLoadingReducer from "./slices/appStartLoadingSlice";

const store = configureStore({
  reducer: {
    hat: hatReducer,
    structure: structureReducer,
    landscape: landscapeReducer,
    plane: planeReducer,
    exp: expReducer,
    loading: appStartLoadingReducer,
  },
});

export default store;
