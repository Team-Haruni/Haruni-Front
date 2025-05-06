// src/api/calender.js
import { get } from "./index"; 
import * as SecureStore from "expo-secure-store";

export const calenderApi = async (data) => {
  try {
    const requestData = {
      ...data, 
    };
    console.log("요청 데이터:", requestData);
    console.log("요청 URL:", `/v1/diaries/month?month=${data.month}`);
    
    const response = await get(`/v1/diaries/month?month=${data.month}`, requestData);
    console.log("캘린더 응답:", response.data);

    if (response.data.data.accessToken && response.data.data.refreshToken) {
      const tokenData = JSON.stringify({
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      });
      
      console.log("토큰 데이터:", tokenData);
      await SecureStore.setItemAsync("userTokens", tokenData);
    }

    return response.data;
  } catch (error) {
    console.log("캘린더 API 오류:", error);

    if (error.response) {
      console.error("응답 오류 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("요청 오류:", error.request);
    } else {
      console.error("오류 메시지:", error.message);
    }
    throw new Error("캘린더 데이터를 불러오는데 실패했습니다.");
  }
};