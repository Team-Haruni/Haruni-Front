import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Platform,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Calendar } from "react-native-calendars";
import CalendarPopup from "../../components/Popup/CalendarPopup";
import characterData from "../../data/characterData";
import { useSelector } from "react-redux";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";

const diaryData = {
  "2025-04-01": {
    emoji: "🍻",
    place: "더 현대 백화점",
    images: [
      require("../../../assets/calendar/1.png"),
      require("../../../assets/calendar/2.png"),
      require("../../../assets/calendar/3.png"),
      require("../../../assets/calendar/4.png"),
    ],
    text: "시원한 맥주는 무더운 여름날 갈증을 해소해 주며, 깊고 풍부한 맛이 입안을 감싸는 기분 좋은 경험을 선사한다. 톡 쏘는 청량감과 함께 부드러운 목 넘김이 어우러져 많은 사람들이 즐겨 찾는 음료 중 하나이다. 이렇게 맛있는 맥주는 다양한 안주와도 훌륭하게 어울리며, 여유로운 시간이나 특별한 자리에서 더욱 빛을 발한다. 이상, 맥주에 대한 간략한 요약 끝!",
  },
  "2025-04-02": {
    emoji: "🍜",
    place: "신라면 건면",
    images: [
      require("../../../assets/calendar/1.png"),
      require("../../../assets/calendar/2.png"),
    ],
    text: "시원한 맥주는 무더운 여름날 갈증을 해소해 주며, 깊고 풍부한 맛이 입안을 감싸는 기분 좋은 경험을 선사한다. 톡 쏘는 청량감과 함께 부드러운 목 넘김이 어우러져 많은 사람들이 즐겨 찾는 음료 중 하나이다. 이렇게 맛있는 맥주는 다양한 안주와도 훌륭하게 어울리며, 여유로운 시간이나 특별한 자리에서 더욱 빛을 발한다. 이상, 맥주에 대한 간략한 요약 끝!",
  },
};

const CalendarPage = () => {
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  const nickname = useSelector((state) => state.exp.nickname);
  const fontsLoaded = useCustomFonts();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);

  //날짜설정
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  const openModal = (date) => {
    setSelectedDiary(diaryData[date] || null);
    setModalVisible(true);
  };

  //이모지 커스텀
  const renderDay = (day) => {
    if (!day) return null;
    const dateString = day.dateString;
    const diaryEntry = diaryData[dateString];

    return (
      <TouchableOpacity
        onPress={() => openModal(dateString)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 16,
              color: dateString === today ? Colors.pointColor : "black", // 오늘 날짜면 pointColor 적용
              fontWeight: dateString === today ? "bold" : "normal", // 오늘 날짜면 강조
            }}
          >
            {day.day}
          </Text>
          {diaryEntry && (
            <Text style={{ fontSize: 14 }}>{diaryEntry.emoji}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../../../assets/background.png")} // 배경 이미지 경로
      style={styles.background} // 스타일을 적용할 배경
      resizeMode="cover" // 이미지 크기 조정 방법
    >
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          {/* 상단: 닉네임 및 프로필 편집 */}
          <View style={styles.topSection}>
            <View style={styles.imgContainer}>
              <Image
                resizeMode="resize"
                source={characterData[characterVersion].url}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.nickname}>{nickname}</Text>
              <TouchableOpacity style={styles.profileEditButton}>
                <Text style={styles.profileEditText}>프로필 편집</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 하단: 캘린더 */}
          <View style={styles.calendarSection}>
            <Calendar
              style={styles.calendar}
              theme={styles.calendarTheme}
              dayComponent={({ date, state }) => renderDay(date)}
              monthFormat={"yyyy년 MM월"}
              hideExtraDays
            />
          </View>

          {/* Diary Modal 컴포넌트 사용 */}
          <CalendarPopup
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            diary={selectedDiary}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    position: "relative",
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  container: {
    margin: 20,
    borderRadius: 20,
    flex: 1,
  },
  background: {
    flex: 1, // 화면을 가득 채우도록 설정
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    flex: 1,
  },
  profileImage: {
    width: 60,
    height: 60,
  },
  calendar: {
    height: 400,
    borderRadius: 15, // 모서리 둥글게
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // 안드로이드 그림자 효과
  },
  calendarTheme: {
    textDayFontFamily: "Cafe24Ssurrondair",
    textMonthFontFamily: "Cafe24Ssurrondair",
    textDayHeaderFontFamily: "Cafe24Ssurrondair",
    calendarBackground: "white",
    textSectionTitleColor: Colors.gray100,
    todayTextColor: Colors.pointColor,
    dayTextColor: "black",
    textDisabledColor: "lightgray",
    arrowColor: Colors.yellow700,
    monthTextColor: "black",
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 12,
  },
  imgContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  profileRow: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 20,
    gap: 12,
  },
  nickname: {
    fontSize: 20,
    color: "black",
    fontFamily: "Cafe24Ssurrondair",

    lineHeight: 22,
    wordWrap: "break-word",
  },
  profileEditButton: {
    backgroundColor: Colors.mainYellow,
    paddingVertical: 1,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  profileEditText: {
    textAlign: "center",
    color: Colors.yellow700,
    fontSize: 12,
    fontFamily: "Cafe24Ssurrondair",
    lineHeight: 28,
    wordWrap: "break-word",
  },
  calendarSection: {
    flex: 3,
  },
});

export default CalendarPage;
