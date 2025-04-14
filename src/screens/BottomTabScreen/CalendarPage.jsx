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
import ProfilePopup from "../../components/Popup/SettingPopup/SettingPopupPopup/ProfilePopup";

const CalendarPage = () => {
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  const nickname = useSelector((state) => state.exp.nickname);
  const diaryData = useSelector((state) => state.diary.diaries);
  const fontsLoaded = useCustomFonts();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  //날짜설정
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  const openModal = (diaryEntry) => {
    setSelectedDiary(diaryEntry || null);
    setModalVisible(true);
  };

  //이모지 커스텀
  const renderDay = (day) => {
    if (!day) return null;
    const dateString = day.dateString;
    const diaryEntry = diaryData.find((entry) => entry.date === dateString);

    return (
      <TouchableOpacity
        onPress={() => openModal(diaryEntry)}
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
              <TouchableOpacity
                style={styles.profileEditButton}
                onPress={() => setProfileModalVisible(true)}
              >
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
        {/*프로필 팝업 컴포넌트 */}
        <ProfilePopup
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
        />
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
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    height: 150,
  },
  profileImage: {
    width: 70,
    height: 70,
  },
  calendar: {
    marginTop: 20,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.myColor,
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
    height: 400,
    backgroundColor: "white",
    marginTop: 15,
    borderRadius: 15, // 모서리 둥글게
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: "start",
    elevation: 5, // 안드로이드 그림자 효과
  },
});

export default CalendarPage;
