import { get, post } from "./index";

export const loadItem = async () => {
  try {
    const response = await get(`/v1/items`);
    return response.data.data;
  } catch (error) {
    console.log("loadItem 오류:", error);
    if (error.response) {
      console.error("응답 오류 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("요청 오류:", error.request);
    } else {
      console.error("오류 메시지:", error.message);
    }
    throw new Error("아이템 내역을 불러오는데 실패했습니다.");
  }
};

export const modifyItem = async (data) => {
  try {
    const requestData = {
      items: data, // 전달받은 data 객체의 내용
    };
    console.log("보내는 메시지:", JSON.stringify(requestData));
    const response = await post(`/v1/items`, requestData);
    console.log("채팅 응답:", response.data);
    return response.data.data;
  } catch (error) {
    console.log("modifyItem 오류:", error);

    if (error.response) {
      console.error("응답 오류 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("요청 오류:", error.request);
    } else {
      console.error("오류 메시지:", error.message);
    }
    throw new Error("아이템템 수정하하는데 실패했습니다.");
  }
};
