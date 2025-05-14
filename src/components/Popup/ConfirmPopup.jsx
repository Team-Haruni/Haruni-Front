import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../../../styles/color";
import Modal from "react-native-modal";
import useCustomFonts from "../../hooks/useCustomFonts";

const ConfirmPopup = ({
  isVisible,
  title,
  contextLines = [],
  onCancel,
  onConfirm,
  cancelText = "취소",
  confirmText = "확인",
}) => {
  const fontsLoaded = useCustomFonts();
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={400} // 나타나는 속도 (ms)
      animationOutTiming={400} // 사라지는 속도 (ms)
      onBackdropPress={onCancel}
      useNativeDriver
      style={styles.popupOverlay}
    >
      <View style={styles.popup}>
        <Text style={styles.popupTitle}>{title}</Text>
        {contextLines.map((line, index) => (
          <Text key={index} style={styles.popupContext}>
            {line}
          </Text>
        ))}
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
export default ConfirmPopup;

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
  popupcontext: {
    paddingHorizontal: 18,
    fontSize: 14,
    fontFamily: "Cafe24Ssurrondair",
    color: Colors.yellow400,
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
});
