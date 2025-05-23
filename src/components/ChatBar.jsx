import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../styles/color";
import UpArrowIcon from "../../assets/upArrow-icon.svg";
import VoiceButton from "./VoiceButton";
import VoiceIcon from "../../assets/voice-icon.svg";
import MakingDiaryPopup from "./Popup/MakingDiaryPopup";
const ChatBar = ({
  message,
  newMessage,
  onChangeText,
  handleSendMessage,
  isLoading,
}) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="메시지를 입력하세요"
        value={newMessage}
        onChangeText={onChangeText} // 부모에서 전달된 onChangeText 사용
        onSubmitEditing={handleSendMessage}
        editable={!isLoading} // 입력 비활성화
      />
      <View style={styles.voiceButtonContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setPopupVisible(true)}
            style={styles.iconContainer}
          >
            <VoiceIcon />
          </TouchableOpacity>
        </View>
        {/* <VoiceButton setChat={onChangeText} isLoading={isLoading} /> */}
      </View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSendMessage}
        disabled={isLoading}
      >
        <UpArrowIcon />
      </TouchableOpacity>
      <MakingDiaryPopup
        isVisible={isPopupVisible}
        title="그림 일기를 생성할까요?"
        contextLines="지금까지의 대화를 바탕으로 그림 일기를 만들어드릴게요."
        onCancel={() => setPopupVisible(false)}
        onConfirm={() => {
          setPopupVisible(false);
        }}
        message={message}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  input: {
    width: "72%",
    height: 40,
    borderRadius: 14,
    borderColor: "white",
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  voiceButtonContainer: {
    height: 40,
    width: 40,
    backgroundColor: Colors.pointColor,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    height: 40,
    width: 40,
    backgroundColor: Colors.pointColor,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

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

export default ChatBar;
