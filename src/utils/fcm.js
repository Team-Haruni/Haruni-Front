import { getApp } from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import { saveTokenToStorage } from "./asyncStorage";

// Firebase 앱 인스턴스를 한 번만 가져옵니다.
const app = getApp();

// FCM 권한 요청
const requestUserPermission = async () => {
  try {
    const authStatus = await messaging(app).requestPermission(); // 앱 인스턴스를 사용하여 권한 요청
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("FCM 권한 승인됨:", authStatus);
    }
  } catch (error) {
    console.error("FCM 권한 요청 실패:", error);
  }
};

// FCM 토큰 가져오기
const getFCMToken = async () => {
  try {
    const fcmToken = await messaging(app).getToken(); // 앱 인스턴스를 사용하여 토큰 가져오기
    if (fcmToken) {
      console.log("FCM Token:", fcmToken);
      saveTokenToStorage(fcmToken);
      // 서버에 유저 FCM 토큰 저장 (회원가입 API 같은 곳에 포함시켜도 좋음)
    } else {
      console.log("FCM 토큰을 가져오지 못했습니다!");
    }
  } catch (error) {
    console.error("FCM 토큰 가져오기 실패:", error);
  }
};

// 메시지 리스너 등록
const setupFCMListeners = () => {
  // 앱이 실행 중일 때 푸시 메시지 수신
  messaging(app).onMessage(async (remoteMessage) => {
    console.log("포그라운드 메시지 수신:", remoteMessage);
    Alert.alert("알림", remoteMessage.notification.body);
  });

  // 앱이 백그라운드에 있을 때 푸시 메시지 수신
  messaging(app).setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("백그라운드 메시지 수신:", remoteMessage);
  });
};

// FCM 초기화 실행
export const initFCM = async () => {
  await requestNotificationPermission();
  await requestUserPermission();
  await getFCMToken();
  setupFCMListeners();
};
