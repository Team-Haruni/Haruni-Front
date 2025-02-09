import { createSlice } from "@reduxjs/toolkit";

//레벨당 겨험치
// 15레벨 이전 10씩
// 30레벨 이전 5씩(30레벨 최종 진화화)
const expSlice = createSlice({
  name: "exp",
  initialState: {
    exp: 0.0,
    level: 1, // 기본 레벨
    characterVersion: 0, // 캐릭터의 진화 버전
  },
  reducers: {
    // ✅ 초기 레벨을 설정하는 함수 (게임 시작 시 1회만 실행)
    setInitialLevel: (state, action) => {
      state.level = action.payload; // 캐릭터의 초기 레벨 설정
      if (action.payload >= 15) {
        state.characterVersion = 1;
      } else if (action.payload >= 30) {
        state.characterVersion = 2;
      }
    },
    setInitialExp: (state, action) => {
      state.exp = action.payload; // 캐릭터의 초기 레벨 설정
    },

    // 채팅 경험치 증가 로직
    chatGrowExp: (state) => {
      let characterLevel = state.level;
      // 레벨에 따른 경험치 증가량 설정
      let expGain = 10; // 기본 증가량
      if (characterLevel < 15) expGain = 10;
      else if (characterLevel < 30) expGain = 5;
      else expGain = 3; // 최고 레벨

      state.exp += expGain;
      // 레벨업 조건 (예제: 100 경험치마다 레벨업)
      if (state.exp >= 100) {
        state.level += 1;
        state.exp = 0.0; // 레벨업 시 경험치 초기화
      }
    },

    // 터치 경험치 증가 로직
    touchGrowExp: (state) => {
      let characterLevel = state.level;
      // 레벨에 따른 경험치 증가량 설정
      let expGain = 0.5; // 기본 증가량
      if (characterLevel < 15) expGain = 0.5;
      else if (characterLevel < 30) expGain = 0.05;
      else expGain = 0.01; // 최고 레벨

      state.exp += expGain;
      // 레벨업 조건 (예제: 100 경험치마다 레벨업)
      if (state.exp >= 100) {
        state.level += 1;
        state.exp = 0.0; // 레벨업 시 경험치 초기화
      }
    },
  },
});

export const { chatGrowExp, setInitialLevel, setInitialExp, touchGrowExp } =
  expSlice.actions;
export default expSlice.reducer;
