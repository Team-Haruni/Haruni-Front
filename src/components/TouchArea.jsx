import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import { sendMessageToUnity } from "../utils/unityBridge";
import characterDialogues from "../data/characterDialogues";
import { useDispatch } from "react-redux";
import { touchGrowExp } from "../../redux/slices/expSlice";
import { sendExpApi } from "../api/sendExp";

const TouchArea = ({
  width = 200,
  height = 230,
  top = "40%",
  webviewRef,
  setChat,
  level,
}) => {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);

  const getRandomDialogue = (action) => {
    const dialogues = characterDialogues[action] || [];
    return dialogues.length > 0
      ? dialogues[Math.floor(Math.random() * dialogues.length)]
      : "";
  };

  const handleDoubleTap = async () => {
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
    dispatch(touchGrowExp());
    try {
      let expGain = 5;
      if (level >= 15 && level < 30) expGain = 3;
      else if (level >= 30) expGain = 1;

      await sendExpApi(expGain); // ✅ 비동기 처리
    } catch (err) {
      console.error("경험치 전송 실패", err);
    }
  };

  const handlePress = async () => {
    if (disabled) return; // 터치가 비활성화되었으면 실행하지 않음

    setDisabled(true); // 터치 비활성화

    const randomAction = Math.random() < 0.5 ? "attack" : "die";
    sendMessageToUnity(webviewRef, "touch", { action: randomAction });
    setChat(getRandomDialogue(randomAction)); // 대사 업데이트

    setTimeout(() => {
      setDisabled(false); // 1초 후 다시 터치 활성화
    }, 300);
    dispatch(touchGrowExp());
    try {
      let expGain = 5;
      if (level >= 15 && level < 30) expGain = 3;
      else if (level >= 30) expGain = 1;

      await sendExpApi(expGain); // ✅ 비동기 처리
    } catch (err) {
      console.error("경험치 전송 실패", err);
    }
  };

  return (
    <View
      style={[
        styles.touchContianer,
        { width, height, transform: [{ translateX: -width / 2 }], top: top },
      ]}
    >
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
