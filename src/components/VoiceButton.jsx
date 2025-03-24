import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import LoadingBar from "./Loadingbar";
import VoiceIcon from "../../assets/voice-icon.svg";
import Color from "../../styles/color";
import Voice from "@react-native-voice/voice";
import { Audio } from "expo-av";

//나중에 수정
import { updateAlarmApi } from "../api/updateAlarm";

const VoiceButton = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    // 음성 인식 초기화
    const initializeVoice = async () => {
      try {
        // 음성 인식 이벤트 리스너 설정
        Voice.onSpeechStart = () => setIsListening(true);
        Voice.onSpeechEnd = () => stopListening();
        Voice.onSpeechError = (e) => setError(e.error);
        Voice.onSpeechResults = (e) => handleSpeechResult(e.value[0]);
        Voice.onSpeechVolumeChanged = (e) => console.log("Volume changed:", e);

        // 초기화가 완료되었을 때 상태 업데이트
        setError(""); // 초기화 시 오류 메시지 초기화
      } catch (e) {
        console.error("음성 인식 초기화 실패:", e);
        setError("음성 인식 초기화 실패");
      }
    };

    initializeVoice();

    return () => {
      // 컴포넌트 언마운트 시 리스너 제거
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // 음성 시작 함수
  const startListening = async () => {
    console.log(Voice);
    if (Voice._loaded) {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          alert("마이크 권한이 필요합니다!");
          return;
        }

        setText("");
        setError("");
        setIsListening(true);
        console.log("🎧 음성 인식 시작...");
        await Voice.start("ko-KR");

        startTimeout();
      } catch (e) {
        console.error("음성 인식 시작 실패:", e);
        setError("음성 인식을 시작할 수 없습니다.");
        setIsListening(false);
      }
    } else {
      console.log("Voice 모듈이 아직 초기화되지 않았습니다.");
    }
  };

  // 음성 결과 처리 함수
  const handleSpeechResult = (newText) => {
    setText(newText);
    console.log("🎙️ 인식된 텍스트:", newText);
    // 새 음성 들어오면 타이머 리셋
    startTimeout();
  };

  // 3초 무음 타이머 함수
  const startTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      stopListening();
    }, 3000);
  };

  // 음성 종료 함수
  const stopListening = async () => {
    try {
      await Voice.stop();
      console.log("🛑 음성 인식 종료");
      setIsListening(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } catch (e) {
      console.error("음성 인식 중지 실패:", e);
    }
  };

  const handlePress = () => {
    //나중에 수정
    //updateAlarmApi();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <View style={styles.buttonContainer}>
      {isListening ? (
        <View style={styles.LoadingBarContainer}>
          <LoadingBar />
          <Text style={styles.listeningText}>듣는 중...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.iconContainer} onPress={handlePress}>
          <VoiceIcon />
        </TouchableOpacity>
      )}
      {text ? <Text style={styles.resultText}>🗣️ {text}</Text> : null}
      {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}
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
