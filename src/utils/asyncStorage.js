import AsyncStorage from "@react-native-async-storage/async-storage";

// 저장
export const saveTokenToStorage = async (token) => {
  try {
    await AsyncStorage.setItem("fcmToken", token);
  } catch (e) {
    console.error("토큰 저장 실패:", e);
  }
};

// 불러오기
export const getTokenFromStorage = async () => {
  try {
    return await AsyncStorage.getItem("fcmToken");
  } catch (e) {
    console.error("토큰 불러오기 실패:", e);
    return null;
  }
};
