import { View, Text, StyleSheet, ImageBackground } from "react-native";
import React from "react";

const Message = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/background.png")} // 배경 이미지 경로
        style={styles.background} // 스타일을 적용할 배경
        resizeMode="cover" // 이미지 크기 조정 방법
      >
        <Text>Message</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1, // 화면을 가득 채우도록 설정
  },
});
export default Message;
