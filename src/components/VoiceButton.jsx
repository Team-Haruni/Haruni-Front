import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import LoadingBar from "./Loadingbar";
import VoiceIcon from "../../assets/voice-icon.svg";
import Color from "../../styles/color";

const VoiceButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    setIsLoading(true);

    // 원하는 기능 실행
    console.log("음성 인식 시작...");

    // 5초 후에 로딩 상태 해제
    setTimeout(() => {
      setIsLoading(false);
      console.log("음성 인식 종료");
    }, 5000);
  };

  return (
    <View style={styles.buttonContainer}>
      {isLoading ? (
        <View style={styles.LoadingBarContainer}>
          <LoadingBar />
        </View>
      ) : (
        <TouchableOpacity style={styles.iconContainer} onPress={handlePress}>
          <VoiceIcon />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VoiceButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
  },
  LoadingBarContainer: {
    flex: 1,
  },
  iconContainer: {
    margin: 15,
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.yellow500,
    borderRadius: 50,
  },
});
