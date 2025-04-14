import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import Colors from "../../../../../styles/color";
import Modal from "react-native-modal";

const RequestPopup = ({
  isVisible,
  title,
  onCancel,
  onConfirm,
  cancelText = "취소",
  confirmText = "확인",
}) => {
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    setInputText("");
  }, [isVisible]);
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={400}
      animationOutTiming={400}
      onBackdropPress={onCancel}
      useNativeDriver
      style={styles.popupOverlay}
    >
      <View style={styles.popup}>
        <Text style={styles.popupTitle}>{title}</Text>

        <TextInput
          style={styles.inputBox}
          placeholder="문의 내용을 입력해주세요. (80자 이내)"
          placeholderTextColor={Colors.yellow300}
          maxLength={80}
          multiline
          value={inputText}
          onChangeText={setInputText}
        />
        <Text style={styles.charCount}>{inputText.length} / 80</Text>

        <View style={styles.popupButtons}>
          <TouchableOpacity style={styles.popupButtonDetail} onPress={onCancel}>
            <Text style={styles.cancelText}>{cancelText}</Text>
          </TouchableOpacity>
          <View style={styles.buttonDivider} />
          <TouchableOpacity
            style={styles.popupButtonDetail}
            onPress={onConfirm}
          >
            <Text style={styles.cancelText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RequestPopup;

const styles = StyleSheet.create({
  popupOverlay: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: "#FFFBF0",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 14,
    fontFamily: "Cafe24Ssurrondair",
    color: Colors.yellow700,
    marginTop: 15,
    marginBottom: 18,
  },
  inputBox: {
    width: "100%",
    height: 120,
    borderWidth: 1,
    borderColor: Colors.yellow300,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    fontFamily: "Cafe24Ssurrondair",
    color: Colors.yellow400,
    backgroundColor: "#fffdf6",
    textAlignVertical: "top",
  },
  popupButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
    marginBottom: -8,
  },
  popupButtonDetail: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
    alignItems: "center",
  },
  buttonDivider: {
    width: 1,
    marginVertical: 13,
    backgroundColor: Colors.yellow400,
  },
  cancelText: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 16,
    color: Colors.yellow400,
  },
  charCount: {
    alignSelf: "flex-end",
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Cafe24Ssurrondair",
    color: Colors.yellow400,
  },
});
