import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";
import CustomButton from "../CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { setCharacterVersion } from "../../../redux/slices/expSlice";
import characterData from "../../data/characterData";
import Toast, { BaseToast } from "react-native-toast-message";
import { sendMessageToUnity } from "../../utils/unityBridge";

const LevelPopup = ({ webviewRef, visible, onClose }) => {
  const dispatch = useDispatch();

  const characterVersion = useSelector((state) => state.exp.characterVersion);
  //이거 또한 selecter 로 만들어야할듯
  const characterVersionArray = useSelector(
    (state) => state.exp.characterVersionArray
  );
  const fontsLoaded = useCustomFonts();

  const versionChangeHandlePress = (version) => {
    dispatch(setCharacterVersion(version));
    sendMessageToUnity(webviewRef, "characterVersion", {
      action: `${version}`,
    });
    onClose();
  };

  const handlePress = (version) => {
    if (version == 1) {
      return Toast.show({
        type: "error",
        text1: "2LV 이상",
        text2: "레벨을 더 올리세요!",
        visibilityTime: 1500,
      });
    } else if (version == 2) {
      return Toast.show({
        type: "error",
        text1: "4LV 이상",
        text2: "레벨을 더 올리세요!",
        visibilityTime: 1500,
      });
    }
  };

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
        <View style={styles.contentContainer}>
          <View
            style={[
              styles.container,
              characterVersion == 0 && styles.highlight,
            ]}
          >
            <View style={styles.character1}>
              <TouchableOpacity onPress={() => versionChangeHandlePress(0)}>
                <ImageBackground
                  source={characterData[0].url}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              styles.container,
              characterVersion == 1 && styles.highlight,
            ]}
          >
            <View style={styles.character2}>
              {characterVersionArray[1] ? (
                <TouchableOpacity onPress={() => versionChangeHandlePress(1)}>
                  <ImageBackground
                    source={characterData[1].url}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handlePress(1)}>
                  <ImageBackground
                    source={characterData[1].url2}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={[
              styles.container,
              characterVersion == 2 && styles.highlight,
            ]}
          >
            <View style={styles.character3}>
              {characterVersionArray[2] ? (
                <TouchableOpacity onPress={() => versionChangeHandlePress(2)}>
                  <ImageBackground
                    source={characterData[2].url}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handlePress(2)}>
                  <ImageBackground
                    source={characterData[1].url2}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    position: "relative",
    backgroundColor: "white",
    width: "100%",
    height: "200",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 25,
    alignItems: "start",
    justifyContent: "start",
  },
  title: {
    fontFamily: "Cafe24Ssurrond",
    fontSize: 15,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 15,
    width: "100%",
    height: "80%",
    flexDirection: "row",
  },
  container: {
    width: 90,
    height: 90,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.gray200,
    overflow: "hidden",
    backgroundColor: Colors.gray50,
  },

  image: {
    width: "100%",
    height: "100%",
  },
  character1: {
    width: "70%",
    height: "70%",
  },
  character2: {
    width: "85%",
    height: "85%",
  },
  character3: {
    width: "100%",
    height: "100%",
  },
  highlight: {
    borderWidth: 3,
    backgroundColor: "white",
    borderColor: "black",
  },
});

export default LevelPopup;
