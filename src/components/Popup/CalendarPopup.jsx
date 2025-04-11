import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";

const CalendarPopup = ({ visible, onClose, diary }) => {
  const fontsLoaded = useCustomFonts();

  if (!diary) {
    return null; // If no diary data is passed, return null to prevent modal rendering
  }

  return (
    <Modal
      isVisible={visible} // 모달 표시 여부
      animationIn="fadeIn" // 나타날 때 애니메이션
      animationOut="fadeOut" // 사라질 때 애니메이션
      animationInTiming={400} // 나타나는 속도 (ms)
      animationOutTiming={400} // 사라지는 속도 (ms)
      backdropOpacity={0.3} // 배경 어두운 정도
      onBackdropPress={onClose} // 배경 클릭 시 닫기
      useNativeDriver={true} // 성능 최적화
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.modalContent}>
        {/* Emoji & Place */}
        <View style={styles.header}>
          <Text style={styles.emoji}>{diary.emoji}</Text>
          <Text style={styles.place}>{diary.place}</Text>
        </View>
        <View
          style={{
            height: "90%",
            justifyContent: "center",
          }}
        >
          <View style={{ height: "100%" }}>
            {/* Image List */}
            <View style={{ height: "auto" }}>
              <View style={styles.imageGrid}>
                {diary.images.map((item, index) => {
                  let imageStyle = styles.image;

                  if (index === 0)
                    imageStyle = { ...imageStyle, ...styles.imageTopLeft };
                  else if (index === 1)
                    imageStyle = { ...imageStyle, ...styles.imageTopRight };
                  else if (index === 2)
                    imageStyle = { ...imageStyle, ...styles.imageBottomLeft };
                  else if (index === 3)
                    imageStyle = { ...imageStyle, ...styles.imageBottomRight };

                  return <Image key={index} source={item} style={imageStyle} />;
                })}
              </View>
            </View>
            {/* Diary Text */}
            <View style={styles.textContainer}>
              <FlatList
                data={diary.text}
                numColumns={10}
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
    height: 450,
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
  imageGrid: {
    marginVertical: 10,
    flexDirection: "row",
    flexWrap: "wrap", // 이미지들이 행을 넘어가며 배치되도록 설정
    justifyContent: "center", // 가운데 정렬
    padding: 5, // 이미지 간격 조정
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  image: {
    width: 150,
    height: 91,
    margin: 1,
  },
  imageTopLeft: {
    borderTopLeftRadius: 10,
  },
  imageTopRight: {
    borderTopRightRadius: 10,
  },
  imageBottomLeft: {
    borderBottomLeftRadius: 10,
  },
  imageBottomRight: {
    borderBottomRightRadius: 10,
  },
  textBox: {
    width: 31,
    height: 31,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.yellow400,
    marginVertical: 4,
  },
  text: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: "Cafe24Ssurrondair",
  },
});

export default CalendarPopup;
