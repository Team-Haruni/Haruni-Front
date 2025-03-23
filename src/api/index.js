// src/api/index.js
import axios from "axios";
import Constants from "expo-constants";
const REACT_NATIVE_API_URL = Constants.expoConfig.extra.REACT_NATIVE_API_URL;

const api = axios.create({
  baseURL: REACT_NATIVE_API_URL, // 기본 URL 설정
  headers: {
    "Content-Type": "application/json",
  },
});

// GET 요청
export const get = (url) => api.get(url);

// POST 요청
export const post = (url, data) => api.post(url, data);

// PUT 요청
export const put = (url, data) => api.put(url, data);

// DELETE 요청
export const del = (url) => api.delete(url);

export default api;
