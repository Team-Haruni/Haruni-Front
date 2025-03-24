// src/api/index.js
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
const REACT_NATIVE_API_URL = Constants.expoConfig.extra.REACT_NATIVE_API_URL;

const api = axios.create({
  baseURL: REACT_NATIVE_API_URL, // 기본 URL 설정
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 모든 요청에 자동으로 accessToken 추가
api.interceptors.request.use(
  async (config) => {
    try {
      const tokenData = await SecureStore.getItemAsync("userTokens");
      if (tokenData) {
        const { accessToken } = JSON.parse(tokenData);
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      }
    } catch (error) {
      console.error("토큰 불러오기 실패:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 응답 인터셉터: 리프레시 토큰으로 재발급 처리 추가 가능
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("토큰 만료됨, 리프레시 토큰 사용!");
      const tokenData = await SecureStore.getItemAsync("userTokens");
      if (tokenData) {
        const { refreshToken } = JSON.parse(tokenData);

        try {
          //나중에 로직 추가되면 수정
          const refreshResponse = await api.post("/v1/auth/refresh", {
            refreshToken,
          });

          const { accessToken: newAccessToken } = refreshResponse.data;

          // 새 액세스 토큰 저장
          await SecureStore.setItemAsync(
            "userTokens",
            JSON.stringify({ accessToken: newAccessToken, refreshToken })
          );

          // 재시도: 원래 실패했던 요청 재전송
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api.request(error.config);
        } catch (refreshError) {
          console.error("리프레시 토큰도 만료됨:", refreshError);
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// GET 요청
export const get = (url) => api.get(url);

// POST 요청
export const post = (url, data) => api.post(url, data);

// PUT 요청
export const put = (url, data) => api.put(url, data);

// DELETE 요청
export const del = (url) => api.delete(url);

// PATCH 요청
export const patch = (url, data) => api.patch(url, data);

export default api;
