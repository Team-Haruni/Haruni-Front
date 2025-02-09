// LoadingBar.js
import React from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image"; // expo-image에서 Image 컴포넌트 임포트

const LoadingBar = () => {
  return (
    <Image
      source={require("../../assets/loading.gif")} // GIF 파일 경로
      style={[styles.LoadingBar]} // GIF 크기 조정
      contentFit="contain" // 애니메이션 크기 조정 방식
    />
  );
};

const styles = StyleSheet.create({
  LoadingBar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //zIndex: 100,
  },
});

export default LoadingBar;
