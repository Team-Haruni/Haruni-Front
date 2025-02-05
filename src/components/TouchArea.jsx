import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import { sendMessageToUnity } from "../utils/unityBridge";
import characterDialogues from "../data/characterDialogues";

const TouchArea = ({ width = 200, height = 200, webviewRef, setChat }) => {
  const [disabled, setDisabled] = useState(false);
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);

  const getRandomDialogue = (action) => {
    const dialogues = characterDialogues[action] || [];
    return dialogues.length > 0
      ? dialogues[Math.floor(Math.random() * dialogues.length)]
      : "";
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      clearTimeout(tapTimeoutRef.current); // 기존 싱글 탭 취소
      sendMessageToUnity(webviewRef, "touch", { action: "move" });
      setChat(getRandomDialogue("move")); // 대사 업데이트
    } else {
      // 첫 번째 터치 → 300ms 대기 후 싱글 터치로 처리
      tapTimeoutRef.current = setTimeout(() => {
        sendMessageToUnity(webviewRef, "touch", { action: "damage" });
        setChat(getRandomDialogue("damage")); // 대사 업데이트
      }, 50);
    }
    lastTapRef.current = now;
  };

  const handlePress = () => {
    if (disabled) return; // 터치가 비활성화되었으면 실행하지 않음

    setDisabled(true); // 터치 비활성화

    const randomAction = Math.random() < 0.5 ? "attack" : "die";
    sendMessageToUnity(webviewRef, "touch", { action: randomAction });
    setChat(getRandomDialogue(randomAction)); // 대사 업데이트

    setTimeout(() => {
      setDisabled(false); // 1초 후 다시 터치 활성화
    }, 300);
  };

  return (
    <View style={[styles.touchContianer, { width, height }]}>
      <Pressable
        style={styles.touchBodyScreenContainer}
        onPressIn={handleDoubleTap} // 더블 탭 감지
        disabled={disabled} // 터치 잠금 적용
      />
      <Pressable
        style={styles.touchFootScreenContainer}
        onPress={handlePress}
        disabled={disabled} // 터치 잠금 적용
      />
    </View>
  );
};

export default TouchArea;

const styles = StyleSheet.create({
  touchContianer: {
    position: "absolute",
    top: "40%",
    transform: [{ translateX: -100 }],
    left: "50%",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
  },
  touchBodyScreenContainer: {
    width: "100%",
    height: "70%",
    zIndex: 1,
  },
  touchFootScreenContainer: {
    width: "100%",
    zIndex: 1,
    height: "30%",
  },
});
