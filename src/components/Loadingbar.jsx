// LoadingBar.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image"; // expo-image에서 Image 컴포넌트 임포트

const LoadingBar = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/loading.gif")} // GIF 파일 경로
        style={{ width: 150, height: 150 }} // GIF 크기 조정
        contentFit="contain" // 애니메이션 크기 조정 방식
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // 부모를 기준으로 꽉 차는 스타일 적용
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 100, // zIndex는 숫자여야 합니다.
  },
});

export default LoadingBar;
