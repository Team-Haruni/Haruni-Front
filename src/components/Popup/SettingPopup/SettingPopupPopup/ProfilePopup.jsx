import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import PopupNavBar from "../../PoupNavBar";
import useCustomFonts from "../../../../hooks/useCustomFonts";
import Colors from "../../../../../styles/color";

const ProfilePopup = ({ visible, onClose }) => {
  const fontsLoaded = useCustomFonts();
  return (
    <Modal
      animationType="fade"
      presentationStyle="fullScreen"
      visible={visible}
      onRequestClose={onClose} // Android 뒤로 가기 버튼 대응
    >
      <ImageBackground
        source={require("../../../../../assets/background.png")} // 배경 이미지 경로
        style={{ flex: 1 }} //스타일을 적용할 배경
        resizeMode="cover" // 이미지 크기 조정 방법
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <PopupNavBar onClose={onClose} text="계정 정보" />
            <Text
              style={{
                marginTop: "5%",
                color: Colors.yellow400,
                fontSize: 12,
                fontFamily: "Cafe24Ssurrondair",
                marginBottom: "3%",
              }}
            >
              내 정보 수정
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default ProfilePopup;
