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
        backgroundColor: "#ffffff",
      },
      package: "com.kgs9843.Haruni",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-video", "expo-font"],
    jsEngine: "hermes", // 새 아키텍처용 엔진 설정
    experiments: {
      newArchEnabled: true, // 새 아키텍처 활성화
    },
    extra: {
      REST_API_KEY: process.env.REST_API_KEY,
      REST_API_SECRET: process.env.REST_API_SECRET,
      REDIRECT_URI: process.env.REDIRECT_URI,
    },
  },
};
