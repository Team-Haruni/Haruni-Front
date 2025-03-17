import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Platform,
} from "react-native";
import React from "react";

const Calendar = () => {
  return (
    <ImageBackground
      source={require("../../../assets/background.png")} // 배경 이미지 경로
      style={styles.background} // 스타일을 적용할 배경
      resizeMode="cover" // 이미지 크기 조정 방법
    >
      <SafeAreaView style={styles.safeContainer}>
        <Text>Calendar</Text>
      </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  background: {
    flex: 1, // 화면을 가득 채우도록 설정
  },
});
export default Calendar;
