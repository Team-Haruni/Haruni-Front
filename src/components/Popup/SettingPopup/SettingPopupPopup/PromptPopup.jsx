import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PromptPopup = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose} // Android 뒤로 가기 버튼 대응
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text>설정 팝업</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // 배경 어둡게
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    color: "blue",
  },
});

export default PromptPopup;
//test
