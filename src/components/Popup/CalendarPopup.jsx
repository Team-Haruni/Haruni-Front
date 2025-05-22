import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";

const CalendarPopup = ({ visible, onClose, diary }) => {
  const fontsLoaded = useCustomFonts();

  if (!diary) {
    return null;
  }

  const renderImage = () => {
    if (diary.images && diary.images.length > 0) {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={diary.images[0]}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>
      );
    }
    return null;
  };

  return (
    <Modal
      isVisible={visible} // 모달 표시 여부
      animationIn="fadeIn" // 나타날 때 애니메이션
      animationOut="fadeOut" // 사라질 때 애니메이션
      animationInTiming={400} // 나타나는 속도 (ms)
      animationOutTiming={400} // 사라지는 속도 (ms)
      backdropOpacity={0.65} // 배경 어두운 정도
      onBackdropPress={onClose} // 배경 클릭 시 닫기
      useNativeDriver={true} // 성능 최적화
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.modalContent}>
        {/* Emoji & Date */}
        <View style={styles.header}>
          <Image
            source={{ uri: diary.emoji }}
            style={{ width: 30, height: 30, marginHorizontal: 10 }}
          />
          <Text style={styles.place}>{diary.place}</Text>
        </View>
        <View
          style={{
            height: "90%",
            justifyContent: "center",
          }}
        >
          <View style={{ height: "100%" }}>
            {/* Main Image */}
            {renderImage()}

            {/* Diary Text */}
            <View style={styles.textContainer}>
              <FlatList
                data={diary.text}
                numColumns={14}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.textBox}>
                    <Text style={styles.text}>{item}</Text>
                  </View>
                )}
              />
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
    width: 350,
    height: 500,
    backgroundColor: "white",
    flexDirection: "column",
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.yellow400,
  },
  emoji: {
    marginLeft: 8,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontSize: 35,
    borderRightWidth: 1,
    borderRightColor: Colors.yellow400,
  },
  place: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 16,
    marginLeft: 5,
    color: Colors.black,
  },
  imageContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: 300,
    height: 180,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  textBox: {
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.yellow400,
    marginVertical: 4,
    padding: 4,
  },
  text: {
    fontSize: 12,
    color: Colors.black,
    fontFamily: "Cafe24Ssurrondair",
  },
});

export default CalendarPopup;
