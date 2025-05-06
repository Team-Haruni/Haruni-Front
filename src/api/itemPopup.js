// src/api/itemPopup.js
import { get } from "./index"; 
import * as SecureStore from "expo-secure-store";

export const itemPopupApi = async () => {
  try {
    // 🔥 GET 요청엔 바디 대신 params 또는 생략
    const response = await get(`/v1/items`);
    // Axios 응답 구조: response.data === { data: [...], message: '선택된 아이탬 조회 완료' }
    const items = response.data.data;
    console.log("itemPopup 응답 아이템 배열:", items);
    return items;
  } catch (error) {
    console.error("itemPopup API 오류:", error);

    if (error.response) {
      console.error("응답 오류 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("요청 오류:", error.request);
    } else {
      console.error("오류 메시지:", error.message);
    }
    throw new Error("itemPopup 데이터를 불러오는데 실패했습니다.");
  }
};