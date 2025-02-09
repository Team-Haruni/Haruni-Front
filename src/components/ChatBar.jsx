import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../styles/color";
import UpArrowIcon from "../../assets/upArrow-icon.svg";
const ChatBar = ({ newMessage, onChangeText, handleSendMessage }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="메시지를 입력하세요"
        value={newMessage}
        onChangeText={onChangeText} // 부모에서 전달된 onChangeText 사용
        onSubmitEditing={handleSendMessage}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSendMessage}>
        <UpArrowIcon />
      </TouchableOpacity>
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
    width: "85%",
    height: 40,
    borderRadius: 20,
    borderColor: "white",
    backgroundColor: "white",
    paddingHorizontal: 10,
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
});

export default ChatBar;
