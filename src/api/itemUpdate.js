// src/api/itemUpdate.js
import { post } from "./index"; 
import * as SecureStore from "expo-secure-store";

export const itemUpdateApi = async (data) => {
  try {
    const requestData = {
      ...data, 
    };
    console.log("요청 데이터:", requestData);
    console.log("요청 URL:", `/v1/items`);
    
    const response = await post(`/v1/items`, requestData);
    console.log("itemPopup 응답:", response.data);

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
    console.log("itemPopup API 오류:", error);

    if (error.response) {
      console.error("itemPopup응답 오류 데이터:", error.response.data);
      console.error("itemPopup응답 상태 코드:", error.response.status);
      console.error("itemPopup응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("itemPopup요청 오류:", error.request);
    } else {
      console.error("itemPopup오류 메시지:", error.message);
    }
    throw new Error("itemPopup 데이터를 불러오는데 실패했습니다.");
  }
};