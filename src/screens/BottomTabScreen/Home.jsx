import React, { useState, useEffect } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import UnityWebView from "../../components/UnityWebView"; // UnityWebView 컴포넌트 import
import LoadingBar from "../../components/Loadingbar";

const Home = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const handleWebViewLoadEnd = () => {
    console.log("WebView loaded, waiting for 5 seconds...");

    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/background.png")} // 배경 이미지 경로
        style={styles.background} // 스타일을 적용할 배경
        resizeMode="cover" // 이미지 크기 조정 방법
      >
        {isLoading && <LoadingBar />}
        <UnityWebView onLoadEnd={handleWebViewLoadEnd} />
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

export default Home;
