import { configureStore } from "@reduxjs/toolkit";
import landscapeReducer from "./slices/landscapeSlice";
import hatReducer from "./slices/hatSlice";
import structureReducer from "./slices/structureSlice";
import expReducer from "./slices/expSlice";
import planeReducer from "./slices/planeSlice";
import appStartLoadingReducer from "./slices/appStartLoadingSlice";
import hobbyReducer from "./slices/hobbySlice";
import diaryReducer from "./slices/diarySlice";
import alarmReducer from './slices/alaramSlice';

const store = configureStore({
  reducer: {
    hat: hatReducer,
    structure: structureReducer,
    landscape: landscapeReducer,
    plane: planeReducer,
    exp: expReducer,
    loading: appStartLoadingReducer,
    hobby: hobbyReducer,
    diary: diaryReducer,
    alarm: alarmReducer,
  },
});

export default store;
