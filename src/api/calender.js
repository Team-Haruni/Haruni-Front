// src/api/calender.js
import { get } from "./index"; // 기본 API 요청 함수 (axios 설정이 있는 index.js 파일)
import * as SecureStore from "expo-secure-store";

export const calenderApi = async (data) => {
  try {
    const requestData = {
      ...data, // 전달받은 data 객체의 내용
    };
    console.log("요청 데이터:", requestData);
    console.log("요청 URL:", `/v1/diaries/month?month=${data.month}`);
    
    const response = await get(`/v1/diaries/month?month=${data.month}`, requestData);
    console.log("캘린더 응답:", response.data);

    // 토큰이 응답에 포함되어 있는 경우에만 저장
    if (response.data.data.accessToken && response.data.data.refreshToken) {
      const tokenData = JSON.stringify({
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      });
      
      console.log("토큰 데이터:", tokenData);
      await SecureStore.setItemAsync("userTokens", tokenData);
    }

    // 응답 데이터 전체 반환 (캘린더에서 사용하기 위해)
    return response.data;
  } catch (error) {
    console.log("캘린더 API 오류:", error);

    // error 객체의 세부 속성 출력
    if (error.response) {
      // 서버로부터의 응답 오류
      console.error("응답 오류 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      // 서버에 요청이 보내졌으나 응답을 받지 못한 경우
      console.error("요청 오류:", error.request);
    } else {
      // 다른 유형의 에러 (예: 코드 오류)
      console.error("오류 메시지:", error.message);
    }
    throw new Error("캘린더 데이터를 불러오는데 실패했습니다.");
  }
};