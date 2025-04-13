import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import Colors from "../../../../../styles/color";
import PopupNavBar from "../../PopupNavBar";
import useCustomFonts from "../../../../hooks/useCustomFonts";

const PromptPopup = ({ visible, onClose }) => {
  const fontsLoaded = useCustomFonts();
  const [promptText, setPromptText] = useState("");

  if (!fontsLoaded) return null;

  const handleTempSave = () => {
    console.log("임시 저장됨:", promptText);
    onClose();
  };

  const handleSave = () => {
    console.log("저장됨:", promptText);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      presentationStyle="fullScreen"
      visible={visible}
      onRequestClose={onClose}
    >
      <ImageBackground
        source={require("../../../../../assets/background.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.modalOverlay}>
          <PopupNavBar onClose={onClose} text="프롬프트" />

          <View style={styles.modalContent}>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="내용을 작성해주세요."
              placeholderTextColor={Colors.yellow400}
              value={promptText}
              onChangeText={setPromptText}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.tempButton}
              onPress={handleTempSave}
            >
              <Text style={styles.tempButtonText}>임시저장</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>저장하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  modalContent: {
    flex: 1,
    marginTop: 20,
  },
  textArea: {
    width: "100%",
    height: 271,
    backgroundColor: "#FFFBF0",
    borderRadius: 20,
    padding: 20,
    fontSize: 16,
    fontFamily: "Cafe24Ssurrondair",
    color: "#030303",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    bottom: 26,
  },
  tempButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#FFFBF0",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tempButtonText: {
    fontSize: 16,
    color: Colors.yellow400,
    fontFamily: "Cafe24Ssurrondair",
  },
  saveButton: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.pointColor,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Cafe24Ssurrondair",
  },
});

export default PromptPopup;
//test
