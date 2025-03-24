// src/api/signup.js
import { patch, post } from "./index"; // 기본 API 요청 함수 (axios 설정이 있는 index.js 파일)

export const updateAlarmApi = async (data) => {
  try {
    const requestData = {
      alarmActiveTime: "17:30",
    };
    console.log(requestData);
    const response = await patch("/v1/users/me/alarm", requestData); // 조작한 requestData 전송
    console.log("success");
    return response.status;
  } catch (error) {
    console.log(error);

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
    throw new Error("로그인에 실패했습니다.");
  }
};
