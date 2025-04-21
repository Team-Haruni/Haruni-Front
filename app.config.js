import "dotenv/config";

export default {
  expo: {
    name: "Haruni",
    slug: "Haruni",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFEBBA",
      },
      package: "com.kgs9843.Haruni",
      permissions: [
        "RECORD_AUDIO", // Android 오디오 권한 추가
        "MEDIA_LIBRARY", // 미디어 라이브러리 권한 추가 (필요 시)
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-video",
      "expo-font",
      "expo-secure-store",
      [
        "expo-speech-recognition",
        {
          microphonePermission: "Allow $(PRODUCT_NAME) to use the microphone.",
          speechRecognitionPermission:
            "Allow $(PRODUCT_NAME) to use speech recognition.",
          androidSpeechServicePackages: [
            "com.google.android.googlequicksearchbox",
          ],
        },
      ],
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "haruni",
          organization: "633614ae48c0",
        },
      ],
    ],
    jsEngine: "hermes", // 새 아키텍처용 엔진 설정
    experiments: {
      newArchEnabled: true, // 새 아키텍처 활성화
    },
    extra: {
      REST_API_KEY: process.env.REST_API_KEY,
      REST_API_SECRET: process.env.REST_API_SECRET,
      REDIRECT_URI: process.env.REDIRECT_URI,
      REACT_NATIVE_API_URL: process.env.REACT_NATIVE_API_URL,
      DSN: process.env.DSN,
    },
  },
};
