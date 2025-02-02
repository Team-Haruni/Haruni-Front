import React, { useState } from "react";
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
import ItemSquare from "../ItemSquare";
import { useSelector } from "react-redux";

const ItemPopup = ({ visible, onClose }) => {
  const landscapeImages = useSelector(
    (state) => state.landscape.savedLandScapeImages
  );
  const fontsLoaded = useCustomFonts();

  //lock 시작 인덱스
  const [lockStart, setLockStart] = useState(12);

  const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
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
      <Text style={styles.upperText}>
        하루니의 레벨을 올려{"\n"}잠금을 해제하세요
      </Text>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>아이템</Text>
          <Text style={styles.number}>0/5</Text>
        </View>
        <ScrollView style={styles.itemContainer}>
          {chunkArray(landscapeImages, 4).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.itemRowContainer}>
              {row.map((image, index) => {
                const globalIndex = rowIndex * 4 + index; // 전체 리스트에서의 인덱스
                const isLocked = globalIndex >= lockStart; // lockStart 이상이면 잠금

                return (
                  <ItemSquare
                    key={index}
                    image={image}
                    lock={isLocked}
                    index={index}
                  />
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          text="뒤로가기"
          onPress={onClose}
          width="45%"
          height="100%"
          textColor={Colors.yellow400}
          backgroundColor={Colors.yellow100}
          borderRadius={20}
        />
        <CustomButton
          text="저장하기"
          onPress={onClose}
          width="45%"
          height="100%"
          textColor="white"
          backgroundColor={Colors.pointColor}
          borderRadius={20}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  upperText: {
    height: 50,
    color: "black",
    position: "absolute",
    top: 50,
    textAlign: "center",
    fontFamily: "Cafe24Ssurrondair",
    color: Colors.yellow400,
  },
  titleContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContent: {
    position: "relative",
    top: -30,
    backgroundColor: "white",
    width: "100%",
    height: "470",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 40,
    alignItems: "start",
    justifyContent: "start",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 90,
    height: 56,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    gap: "10%",
  },
  title: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 20,
    color: "black",
  },
  number: {
    fontWeight: "400",
    fontSize: 17,
    color: "black",
  },
  itemContainer: {
    marginTop: 20,
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  itemRowContainer: {
    marginBottom: 15,
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 10,
  },
});

export default ItemPopup;
