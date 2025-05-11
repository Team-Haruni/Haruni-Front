import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import React, { useState, useEffect } from "react";
import LoadingBar from "./Loadingbar";
import VoiceIcon from "../../assets/voice-icon.svg";
import Color from "../../styles/color";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

// import { updateAlarmApi } from "../api/updateAlarm";

const VoiceButton = ({ setChat }) => {
  const [recognizing, setRecognizing] = useState(false);
  const [text, setText] = useState("");

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setText(event.results[0]?.transcript);
    setChat(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "ko-KR",
      interimResults: false,
      continuous: false, //지속적인 인식(3초 안하면 자동 멈춤)
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: ["하루니"], //자주 사용하는 단어
    });
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        {recognizing ? (
          <View style={styles.LoadingBarContainer}>
            <LoadingBar />
          </View>
        ) : (
          <TouchableOpacity style={styles.iconContainer} onPress={handleStart}>
            <VoiceIcon />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default VoiceButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
  },
  LoadingBarContainer: {
    position: "relative",
    left: 0,
    width: 300,
    height: 300,
    flex: 1,
  },
  iconContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
});
