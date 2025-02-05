import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";
import CustomButton from "../CustomButton";

const LevelPopup = ({ visible, onClose }) => {
  const fontsLoaded = useCustomFonts();

  return (
    <Modal
      isVisible={visible} // 모달 표시 여부
      animationIn="slideInUp" // 나타날 때 애니메이션
      animationOut="slideOutDown" // 사라질 때 애니메이션
      animationInTiming={400} // 나타나는 속도 (ms)
      animationOutTiming={400} // 사라지는 속도 (ms)
      backdropOpacity={0} // 배경 어두운 정도
      onBackdropPress={onClose} // 배경 클릭 시 닫기
      useNativeDriver={true} // 성능 최적화
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>레벨</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContent: {
    position: "relative",
    backgroundColor: "white",
    width: "100%",
    height: "200",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 40,
    alignItems: "start",
    justifyContent: "start",
  },
});

export default LevelPopup;
