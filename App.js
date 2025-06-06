import React, { Component } from "react";
import Login from "./src/screens/LoginScreen/Login";
import KakaoLogin from "./src/screens/LoginScreen/WebView/KakaoLogin";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/BottomTabScreen/Home";
import Message from "./src/screens/BottomTabScreen/Message";
import Calendar from "./src/screens/BottomTabScreen/CalendarPage";
import User from "./src/screens/BottomTabScreen/User";
import Colors from "./styles/color";
import useCustomFonts from "./src/hooks/useCustomFonts";
// SVG 아이콘 import
import UserIcon from "./assets/user-icon.svg";
import CalendarIcon from "./assets/calendar-icon.svg";
import HomeIcon from "./assets//home-icon.svg";
import MessageIcon from "./assets/message-icon.svg";
import ChartIcon from "./assets/chart-icon.svg";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import store from "./redux/store";
import Toast from "react-native-toast-message";
import InitialSetter from "./src/components/AppStart/InitialSetter";
import toastConfig from "./src/components/ToastConfig";
import Signup from "./src/screens/Signup/Signup";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import ErrorBoundary from "react-native-error-boundary";
import CustomGlobalErrorFallback from "./src/components/ErrorFallback/CustomGlobalErrorFallback";

const DSN = Constants.expoConfig.extra.DSN;

Sentry.init({
  dsn: DSN,
  integrations: [Sentry.reactNativeTracingIntegration()],
  sendDefaultPii: true,
  tracesSampleRate: 0.2,
  profilesSampleRate: 0.2,
});

const App = () => {
  const fontsLoaded = useCustomFonts();
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const BottomTabScreen = () => {
    return (
      <ImageBackground
        source={require("./assets/background.png")} // 배경 이미지 경로
        style={{
          flex: 1,
        }}
        resizeMode="cover"
      >
        <Tab.Navigator
          initialRouteName="Home" // 기본 탭을 Home으로 설정
          screenOptions={({ route }) => ({
            tabBarHideOnKeyboard: true,
            tabBarShowLabel: false, // 텍스트 레이블을 숨김
            headerShown: false,
            tabBarStyle: {
              height: 73, // 탭 바의 높이
              backgroundColor: Colors.yellow100,
              borderTopWidth: 0, // 탭 바 위쪽 테두리 제거
              elevation: 0, // 안드로이드에서 그림자 제거
              borderTopLeftRadius: 30, // 왼쪽 위
              borderTopRightRadius: 30, // 오른쪽 위
            },
            tabBarLabelStyle: {
              fontSize: 12, // 라벨 폰트 크기
              fontWeight: "bold", // 라벨 폰트 두께
            },
            tabBarIcon: ({ focused, color, size }) => {
              let IconComponent;
              let label;
              // 각 탭별로 아이콘 설정
              if (route.name === "Home") {
                IconComponent = HomeIcon;
                label = "홈";
              } else if (route.name === "Message") {
                IconComponent = MessageIcon;
                label = "메시지";
              } else if (route.name === "Calendar") {
                IconComponent = CalendarIcon;
                label = "캘린더";
              } else if (route.name === "User") {
                IconComponent = ChartIcon;
                label = "그래프";
              }
              return (
                <View
                  style={{
                    flexDirection: "column", // 아이콘과 텍스트를 세로로 배치
                    justifyContent: "center", // 아이콘과 텍스트가 세로로 중앙 정렬
                    alignItems: "center", // 수평으로 중앙 정렬
                    flex: 1, // View가 부모 요소의 공간을 다 차지하도록 함
                  }}
                >
                  <IconComponent
                    width={size}
                    height={size}
                    fill={focused ? Colors.yellow700 : "transparent"}
                  />
                  <Text
                    style={{
                      fontFamily: "Cafe24Ssurrond",
                      color: focused ? Colors.yellow700 : Colors.yellow400, // 활성화 상태에 따라 색상 변경
                      marginTop: 4, // 아이콘과 텍스트 간의 간격
                      fontSize: 8,
                    }}
                  >
                    {label}
                  </Text>
                </View>
              );
            },

            tabBarIconStyle: {
              margin: "auto",
            },
          })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Calendar" component={Calendar} />
          <Tab.Screen name="Message" component={Message} />
          <Tab.Screen name="User" component={User} />
        </Tab.Navigator>
      </ImageBackground>
    );
  };

  return (
    <>
      <ErrorBoundary FallbackComponent={CustomGlobalErrorFallback}>
        <Provider store={store}>
          <InitialSetter>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Bottom" component={BottomTabScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </InitialSetter>
        </Provider>
        <Toast config={toastConfig} />
      </ErrorBoundary>
    </>
  );
};

export default Sentry.wrap(App);
