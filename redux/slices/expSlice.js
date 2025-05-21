import { createSlice } from "@reduxjs/toolkit";

//레벨당 겨험치
// 15레벨 이전 10씩
// 30레벨 이전 5씩(30레벨 최종 진화화)
const expSlice = createSlice({
  name: "exp",
  initialState: {
    userName: "",
    nickname: "",
    userEmail: "",
    exp: 0.0,
    level: 1, // 기본 레벨
    characterVersion: 0, // 캐릭터의 진화 버전
    characterVersionArray: [true, false, false],
  },
  reducers: {
    // ✅ 초기 레벨을 설정하는 함수 (게임 시작 시 1회만 실행)
    setInitialLevel: (state, action) => {
      state.level = action.payload; // 캐릭터의 초기 레벨 설정
      if (action.payload >= 15) {
        state.characterVersion = 1;
        state.characterVersionArray = [true, true, false];
      } else if (action.payload >= 30) {
        state.characterVersion = 2;
        state.characterVersionArray = [true, true, true];
      }
    },
    setNickname: (state, action) => {
      state.nickname = action.payload; //캐리터 닉네임설정
    },
    setEmail: (state, action) => {
      state.userEmail = action.payload; //캐리터 이메일설정
    },
    setUserName: (state, action) => {
      state.userName = action.payload; //유저네임 설정
    },
    setInitialExp: (state, action) => {
      state.exp = action.payload; // 캐릭터의 초기 레벨 설정
    },

    setCharacterVersion: (state, action) => {
      state.characterVersion = action.payload; // 캐릭터의 버전 변경
    },

    setCharacterVersionArray: (state, action) => {
      for (let i = 0; i <= action.payload; i++) {
        state.characterVersionArray[i] = true;
      }
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
        state.exp = state.exp - 100; // 레벨업 시 경험치 초기화
        if (state.level == 15) {
          state.characterVersion = 1;
          state.characterVersionArray = [true, true, false];
        } else if (state.level == 30) {
          state.characterVersion = 2;
          state.characterVersionArray = [true, true, true];
        }
      }
    },

    // 터치 경험치 증가 로직
    touchGrowExp: (state, action) => {
      // let characterLevel = state.level;
      // // 레벨에 따른 경험치 증가량 설정
      // let expGain = 0.5; // 기본 증가량
      // if (characterLevel < 15) expGain = 5; //0.5;
      // else if (characterLevel < 30) expGain = 3;
      // else expGain = 1; // 최고 레벨
      // console.log(action.payload);
      const beforeExp = state.exp;
      state.exp = action.payload;
      // 레벨업 조건 (예제: 100 경험치마다 레벨업)
      if (beforeExp > state.exp) {
        state.level += 1;
        //state.exp = state.exp - 100; // 레벨업 시 경험치 초기화
        if (state.level == 15) {
          state.characterVersion = 1;
          state.characterVersionArray = [true, true, false];
        } else if (state.level == 30) {
          state.characterVersion = 2;
          state.characterVersionArray = [true, true, true];
        }
      }
    },
  },
});

export const {
  chatGrowExp,
  setInitialLevel,
  setInitialExp,
  touchGrowExp,
  setNickname,
  setUserName,
  setCharacterVersion,
  setEmail,
} = expSlice.actions;
export default expSlice.reducer;
