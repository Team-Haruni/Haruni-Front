import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import characterData from "../../data/characterData";

const { width } = Dimensions.get("window");

const SettingPopup = ({ visible, onClose }) => {
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  return (
    <Modal
      isVisible={visible}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      backdropOpacity={0.3}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="left"
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <View style={styles.imgContainer}>
          <Image
            resizeMode="resize"
            source={characterData[characterVersion].url}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  modalContent: {
    width: width * 0.75, // 화면의 75%를 차지하도록 설정
    height: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  imgContainer: {
    marginTop: 80,
    width: 100,
    height: 100,
    borderRadius: 50, // width, height의 절반으로 설정하여 원형으로 만듦
    borderWidth: 2, // 윤곽선 두께
    borderColor: "black", // 윤곽선 색상
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // 내부 이미지가 넘치지 않도록 설정
    marginBottom: 30,
  },
  contentContainer: {
    height: "70%",
    backgroundColor: "yellow",
    width: "100%",
  },
  profileImage: {
    width: 80,
    height: 80,
  },
  closeButton: {
    marginTop: 10,
    color: "blue",
  },
});

export default SettingPopup;
