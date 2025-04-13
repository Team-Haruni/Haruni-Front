// redux/alarmSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meridiem: '오전',
  hour: 10,
  minute: 0,
};

const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    setAlarmTime: (state, action) => {
      const { meridiem, hour, minute } = action.payload;
      state.meridiem = meridiem;
      state.hour = hour;
      state.minute = minute;
    },
  },
});

export const { setAlarmTime } = alarmSlice.actions;
export default alarmSlice.reducer;
