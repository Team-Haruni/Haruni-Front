import { get } from "./index";

export const fetchWeeklyFeedback = async () => {
  try {
    const response = await get(`/v1/weekly-feedback`);
    console.log("피드백 내역 응답:", response.data);
    return response.data.data;
  } catch (error) {
    console.log("fetchWeeklyFeedback 오류:", error);
    if (error.response) {
      console.error("응답 오류 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("요청 오류:", error.request);
    } else {
      console.error("오류 메시지:", error.message);
    }
    throw new Error("피트백 내역을 불러오는데 실패했습니다.");
  }
};
