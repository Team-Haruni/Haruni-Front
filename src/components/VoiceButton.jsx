import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import LoadingBar from "./Loadingbar";
import VoiceIcon from "../../assets/voice-icon.svg";
import Color from "../../styles/color";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import axios from "axios";

// 나중에 수정
import { updateAlarmApi } from "../api/updateAlarm";

const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // 구글 API 키

const VoiceButton = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 음성 녹음 정리
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  // 음성 녹음 시작 함수
  const startRecording = async () => {
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

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      await recording.startAsync();

      startTimeout(); // 4.5초 타이머 시작
    } catch (e) {
      console.error("음성 녹음 시작 실패:", e);
      setError("음성을 녹음할 수 없습니다.");
      setIsListening(false);
    }
  };

  // 음성 결과 처리 함수 (구글 API 호출)
  const handleGoogleSpeechAPI = async (uri) => {
    try {
      const audioData = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await axios.post(
        "https://speech.googleapis.com/v1p1beta1/speech:recognize?key=" +
          GOOGLE_API_KEY,
        {
          audio: {
            content: audioData,
          },
          config: {
            encoding: "LINEAR16", // 오디오 포맷에 맞춰 설정 (wav 형식일 경우 LINEAR16 사용)
            sampleRateHertz: 16000,
            languageCode: "ko-KR", // 한국어로 설정
          },
        }
      );

      const transcribedText =
        response.data.results[0].alternatives[0].transcript;
      setText(transcribedText);
      console.log("🎙️ 구글 인식된 텍스트:", transcribedText);
    } catch (error) {
      console.error("구글 API 호출 실패:", error);
      setError("음성 인식 실패");
    }
  };

  // 4.5초 무음 타이머 함수
  const startTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      stopRecording(); // 4.5초 후 녹음 종료
    }, 4500); // 4.5초
  };

  // 녹음 종료 함수
  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        console.log("🛑 녹음 종료");
        setIsListening(false);
        const uri = recording.getURI();
        console.log("녹음된 파일 URI:", uri);

        handleGoogleSpeechAPI(uri); // 구글 API로 텍스트 변환
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } catch (e) {
      console.error("음성 인식 중지 실패:", e);
    }
  };

  const handlePress = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
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
  listeningText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
  },
});
