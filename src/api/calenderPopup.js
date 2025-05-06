// src/api/calenderPopup.js
import { get } from "./index"; 
import * as SecureStore from "expo-secure-store";

export const calendarPopupApi = async (data) => {
  try {
    const requestData = {
      ...data, 
    };
    console.log("요청 데이터:", requestData);
    console.log("요청 URL:", `/v1/diaries/day?day=${data.day}`);
    
    const response = await get(`/v1/diaries/day?day=${data.day}`);
    console.log("캘린더 팝업 응답:", response.data);

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
    console.log("캘린더 팝업 API 오류:", error);

    if (error.response) {
      console.error("응답 오류 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("요청 오류:", error.request);
    } else {
      console.error("오류 메시지:", error.message);
    }
    throw new Error("해당 일자의 다이어리 데이터를 불러오는데 실패했습니다.");
  }
};

// 기분에 따른 이모지 매핑 함수
export const getMoodEmoji = (mood) => {
  switch(mood) {
    case 'HAPPY':
      return 'https://i.pinimg.com/736x/c1/c3/f0/c1c3f0084bdd7919579adf56cba8a4cd.jpg';
    case 'SAD':
      return 'https://i.pinimg.com/736x/cc/0e/a0/cc0ea0f10d01f23d5570104577f6766b.jpg';
    default:
      return 'https://i.pinimg.com/736x/fc/72/4b/fc724ba3dda6977eb410fc3e456252ba.jpg';
  }
};

// API 응답을 CalendarPopup 컴포넌트에 맞게 변환하는 함수
export const transformDiaryData = (apiData) => {
  if (!apiData || !apiData.data) return null;
  
  const { daySummaryDescription, daySummaryImage, mood, date } = apiData.data;
  
  // 텍스트를 한 글자씩 분리
  const textArray = daySummaryDescription ? daySummaryDescription.split('') : [];
  
  // 이미지가 단일 문자열인 경우 배열로 변환
  const images = daySummaryImage 
    ? [{ uri: daySummaryImage }] 
    : [];
  
  // // 빈 슬롯을 채워서 항상 4개의 이미지가 있도록 함
  // while (images.length < 4) {
  //   images.push(require('../../../assets/placeholder-image.png')); // 기본 이미지 경로는 실제 경로로 변경 필요
  // }
  
  return {
    emoji: getMoodEmoji(mood),
    place: `${date} 일기`, // 날짜를 장소 대신 표시
    images: images,
    text: textArray,
  };
};