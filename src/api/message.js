// src/api/message.js
import { get, post } from "./index";

/**
 * 지정한 날짜의 채팅 내역을 조회합니다.
 * @param {string} date - "YYYY-MM-DD" 형식의 조회 날짜
 * @returns {Promise<Array<{chatType: string, content: string, sendingTime: string}>>}
 */

export const fetchChatHistory = async (date) => {
  try {
    console.log("채팅 조회 요청 날짜:", date);
    const response = await get(`/v1/haruni/chats?date=${date}`);
    console.log("채팅 내역 응답:", response.data);
    // 서버 응답 구조: { data: [ ... ], message: "채팅 내역 조회 완료" }
    return response.data.data;
  } catch (error) {
    console.log("fetchChatHistory 오류:", error);
    if (error.response) {
      console.error("응답 오류 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("요청 오류:", error.request);
    } else {
      console.error("오류 메시지:", error.message);
    }
    throw new Error("채팅 내역을 불러오는데 실패했습니다.");
  }
};

export const sendChat = async (data) => {
  try {
    const requestData = {
      content: data, // 전달받은 data 객체의 내용
    };
    console.log("보내는 메시지:", JSON.stringify(requestData));
    const response = await post(`/v1/haruni/chats`, requestData);
    console.log("채팅 응답:", response.data);
    return response.data.data;
  } catch (error) {
    console.log("sendChat 오류:", error);

    if (error.response) {
      console.error("응답 오류 데이터:", error.response.data);
      console.error("응답 상태 코드:", error.response.status);
      console.error("응답 헤더:", error.response.headers);
    } else if (error.request) {
      console.error("요청 오류:", error.request);
    } else {
      console.error("오류 메시지:", error.message);
    }
    throw new Error("채팅 내역을 불러오는데 실패했습니다.");
  }
};
