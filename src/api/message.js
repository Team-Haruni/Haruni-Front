// src/api/message.js
import { get } from "./index";

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
    console.error("fetchChatHistory 오류:", error);
    throw new Error("채팅 내역을 불러오는데 실패했습니다.");
  }
};