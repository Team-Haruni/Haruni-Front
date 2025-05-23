import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";
import { getDayDiary } from "../../api/oneMakingDiary";
import LoadingBar from "../Loadingbar";
import ImageDetailPopup from "./ImageDetailPopup";

const MakingDiaryPopup = ({
  isVisible,
  title,
  contextLines,
  onCancel,
  onConfirm,
  cancelText = "취소",
  confirmText = "확인",
  message,
}) => {
  const fontsLoaded = useCustomFonts();
  const [isExpanded, setIsExpanded] = useState(false);
  const [modifyMessage, setModifyMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diary, setDiary] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const animatedHeight = useRef(new Animated.Value(170)).current;
  const animatedWidth = useRef(new Animated.Value(300)).current;

  const moodToEmoji = {
    happy:
      "https://i.pinimg.com/736x/c1/c3/f0/c1c3f0084bdd7919579adf56cba8a4cd.jpg",
    normal:
      "https://i.pinimg.com/736x/fc/72/4b/fc724ba3dda6977eb410fc3e456252ba.jpg",
    sad: "https://i.pinimg.com/736x/cc/0e/a0/cc0ea0f10d01f23d5570104577f6766b.jpg",
  };

  const convertSummaryToDiaryFormat = (summary) => {
    return {
      emoji: moodToEmoji[summary.mood] || "", // ✅ mood 값에 따른 이미지 URL 매핑
      images: [{ uri: summary.daySummaryImage }],
      place: new Date(summary.date).toISOString().split("T")[0] + " 일기",
      text: summary.daySummaryDescription.split(""),
    };
  };
  console.log(diary);
  const handleConfirmPress = async () => {
    setIsExpanded(true);
    setIsLoading(true); // 로딩 시작

    if (modifyMessage) {
      try {
        const data = await getDayDiary(modifyMessage);
        const converted = convertSummaryToDiaryFormat(data);
        setDiary(converted); // ✅ diary 상태에 저장
      } catch (error) {
        console.error("요청 중 에러 발생:", error);
      } finally {
        setIsLoading(false); // 요청 완료 후 로딩 종료
      }
    }
  };
  useEffect(() => {
    if (isVisible) {
      setIsExpanded(false);
      animatedHeight.setValue(170);
      animatedWidth.setValue(300);

      const transformedMessages = message
        .map((msg) => {
          const content = msg.content || msg.ccontent || ""; // 누락된 ccontent 방어
          if (msg.mine) {
            return {
              userId: 12345, // 원하는 userId로
              content,
              timeStamp: msg.createdAt,
            };
          }
          return null;
        })
        .filter(Boolean); // null 제거

      //setModifyMessage(JSON.stringify(transformedMessages, null, 2)); // 보기 좋게
      setModifyMessage(JSON.stringify({ conversation: transformedMessages }));
    }
  }, [isVisible, message]);

  const renderImage = () => {
    if (diary.images && diary.images.length > 0) {
      return (
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => setPopupVisible(true)}>
            <Image
              source={diary.images[0]}
              style={styles.mainImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  useEffect(() => {
    if (isExpanded) {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 500,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(animatedWidth, {
          toValue: 350,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
    }
  }, [isExpanded]);

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={400}
      animationOutTiming={400}
      onBackdropPress={onCancel}
      useNativeDriver
      style={styles.popupOverlay}
    >
      <Animated.View
        style={[
          styles.popup,
          {
            height: animatedHeight,
            width: animatedWidth,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            flexDirection: "column",
            borderRadius: 10,
          },
        ]}
      >
        {!isExpanded ? (
          <>
            <Text style={styles.popupTitle}>{title}</Text>
            <Text style={styles.popupcontext}>{contextLines}</Text>

            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={styles.popupButtonDetail}
                onPress={onCancel}
              >
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
              <View style={styles.buttonDivider} />
              <TouchableOpacity
                style={styles.popupButtonDetail}
                onPress={handleConfirmPress}
              >
                <Text style={styles.cancelText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : isLoading ? (
          // 로딩 중
          <View style={styles.container}>
            <View style={styles.loadingBarContainer}>
              <LoadingBar />
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Cafe24Ssurrondair",
                color: "black",
              }}
            >
              지금까지의 대화를 일기로 만드는 중 입니다..
            </Text>
          </View>
        ) : (
          // 로딩 완료 후 보여줄 뷰
          <>
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
            <ImageDetailPopup
              isVisible={isPopupVisible}
              diaryImg={diary.images[0]}
              onCancel={() => setPopupVisible(false)}
            />
          </>
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popupOverlay: {
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#FFFBF0",
    borderRadius: 20,
    width: "100%",
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
    textAlign: "center",
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
  loadingBarContainer: {
    width: 110,
    height: 110,
    zIndex: 3,
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
    aspectRatio: 16 / 10, // 너비 대비 높이 비율 유지
    resizeMode: "cover", // 필요 시 추가
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

export default MakingDiaryPopup;
