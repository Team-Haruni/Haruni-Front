// redux/slices/alarmTimeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  period: "오전", // 오전/오후
  hour: "1", // "1" ~ "12"
  minutes: "0", // "0" ~ "59"
};

const alarmSlice = createSlice({
  name: "alarm",
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    setHour: (state, action) => {
      state.hour = action.payload;
    },
    setMinutes: (state, action) => {
      state.minutes = action.payload;
    },
    resetAlarmTime: () => initialState,
  },
});

export const { setPeriod, setHour, setMinutes, resetAlarmTime } =
  alarmSlice.actions;
export default alarmSlice.reducer;
