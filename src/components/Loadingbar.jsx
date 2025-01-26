// LoadingBar.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image"; // expo-image에서 Image 컴포넌트 임포트

const LoadingBar = ({ width, height }) => {
  return (
    <Image
      source={require("../../assets/loading.gif")} // GIF 파일 경로
      style={[
        styles.LoadingBar,
        {
          width: width, // 부모로부터 받은 width
          height: height, // 부모로부터 받은 height
          transform: [{ translateX: -width / 2 }, { translateY: -height / 2 }],
        },
      ]} // GIF 크기 조정
      contentFit="contain" // 애니메이션 크기 조정 방식
    />
  );
};

const styles = StyleSheet.create({
  LoadingBar: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 100, // zIndex는 숫자여야 합니다.
  },
});

export default LoadingBar;
