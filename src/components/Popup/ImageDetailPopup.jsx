import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Colors from "../../../styles/color";
import Modal from "react-native-modal";
import useCustomFonts from "../../hooks/useCustomFonts";

const ImageDetailPopup = ({ isVisible, diaryImg, onCancel }) => {
  console.log(diaryImg);
  const fontsLoaded = useCustomFonts();
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.85}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={100} // 나타나는 속도 (ms)
      animationOutTiming={100} // 사라지는 속도 (ms)
      onBackdropPress={onCancel}
      useNativeDriver
      style={styles.popupOverlay}
    >
      <TouchableOpacity
        style={styles.popup}
        onPress={onCancel}
        activeOpacity={1}
      >
        <Image
          source={diaryImg}
          resizeMode="contain"
          style={styles.fullImage}
        />
      </TouchableOpacity>
    </Modal>
  );
};
export default ImageDetailPopup;

const styles = StyleSheet.create({
  popupOverlay: {
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "90%",
  },
});
