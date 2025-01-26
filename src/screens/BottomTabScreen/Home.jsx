import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import UnityWebView from "../../components/UnityWebView"; // UnityWebView 컴포넌트 import
import LoadingBar from "../../components/Loadingbar";
import SettingIcon from "../../../assets/setting-icon.svg";
import ListIcon from "../../../assets/list-icon.svg";
import ItemIcon from "../../../assets/item-icon.svg";
import LevelBar from "../../components/LevelBar";
import MainScreenChat from "../../components/MainScreenChat";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const handleWebViewLoadEnd = () => {
    console.log("WebView loaded, waiting for 5 seconds...");

    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  return (
    <ImageBackground
      source={require("../../../assets/background.png")} // 배경 이미지 경로
      style={styles.background} // 스타일을 적용할 배경
      resizeMode="cover" // 이미지 크기 조정 방법
    >
      <SafeAreaView style={styles.safeContainer}>
        {isLoading && <LoadingBar width={150} height={150} />}
        <UnityWebView
          style={styles.unityContainer}
          onLoadEnd={handleWebViewLoadEnd}
        />

        {!isLoading && (
          <>
            <TouchableOpacity style={styles.settingIconContainer}>
              <SettingIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.listIconContainer}>
              <ListIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemIconContainer}>
              <ItemIcon />
            </TouchableOpacity>

            <View style={styles.levelContainer}>
              <LevelBar progress={50} />
            </View>
            <View style={styles.chatContainer}>
              <MainScreenChat />
            </View>
          </>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    position: "relative",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  background: {
    flex: 1, // 화면을 가득 채우도록 설정
  },
  unityContainer: {
    position: "absolute",
    ...StyleSheet.absoluteFillObject, // View를 화면 전체에 배치
    zIndex: 0, // 다른 컴포넌트 뒤에 배치
  },
  settingIconContainer: {
    position: "absolute",
    right: 20,
    top: 50,
  },
  itemIconContainer: {
    position: "absolute",
    right: 20,
    top: 100,
  },
  listIconContainer: {
    position: "absolute",
    left: 20,
    top: 50,
  },
  levelContainer: {
    position: "absolute",
    width: 250,
    height: 50,
    transform: [{ translateX: -125 }],
    bottom: "15%",
    left: "50%",
  },
  chatContainer: {
    position: "absolute",
    width: 250,
    height: 100,
    transform: [{ translateX: -125 }],
    top: "30%",
    left: "50%",
  },
});

export default Home;
