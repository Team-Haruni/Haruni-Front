import { get } from "./index";

export const getUserApi = async () => {
  try {
    console.log("요청 URL:", `/v1/users`);

    const response = await get(`/v1/users`);
    console.log("유저 조회 응답:", response.data);

    return response.data;
  } catch (error) {
    console.log("유저조회 API 오류:", error);

    if (error.response) {
      console.error("응답 오류 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("요청 오류:", error.request);
    } else {
      console.error("오류 메시지:", error.message);
    }
    throw new Error("해당 유저의 데이터를 불러오는데 실패했습니다.");
  }
};
