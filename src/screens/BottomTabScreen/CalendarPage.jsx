import React, { useState, useEffect } from "react";
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
import { calenderApi } from "../../api/Calender"; // Import the calendar API
import { calendarPopupApi, transformDiaryData } from "../../api/calenderPopup"; // Import the new popup API

const CalendarPage = () => {
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  const nickname = useSelector((state) => state.exp.nickname);
  const diaryData = useSelector((state) => state.diary.diaries);
  const fontsLoaded = useCustomFonts();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [moodSummaries, setMoodSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const moodToEmoji = {
    HAPPY: "😊", 
    SAD: "😢",
    NORMAL: "😶",
  };

  
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;
  
  const [selectedMonth, setSelectedMonth] = useState(`${year}-${month}`);
  const [currentDate, setCurrentDate] = useState(now.toISOString().split('T')[0]);

  // 새로운 함수: 날짜를 선택하면 API에서 해당 날짜의 다이어리 데이터를 가져옴
  const fetchDayData = async (date) => {
    try {
      setIsLoading(true);
      console.log("Fetching data for day:", date);
      
      // API 호출하여 해당 날짜의 다이어리 상세 데이터 가져오기
      const response = await calendarPopupApi({ day: date });
      
      // API 응답을 CalendarPopup 컴포넌트 형식에 맞게 변환
      const transformedData = transformDiaryData(response);
      
      if (transformedData) {
        // 변환된 데이터를 상태에 저장하고 모달 표시
        setSelectedDiary(transformedData);
        setModalVisible(true);
      } else {
        console.log("해당 날짜에 다이어리가 없습니다.");
        // 기존 다이어리 데이터가 있으면 기존 방식대로 표시
        const diaryEntry = diaryData.find((entry) => entry.date === date);
        if (diaryEntry) {
          setSelectedDiary(diaryEntry);
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.error("일일 다이어리 조회 실패:", error);
      
      // API 실패 시 기존 데이터를 사용 (폴백)
      const diaryEntry = diaryData.find((entry) => entry.date === date);
      if (diaryEntry) {
        setSelectedDiary(diaryEntry);
        setModalVisible(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 수정된 openModal 함수: API 호출 추가
  const openModal = (date, diaryEntry) => {
    // API를 통해 데이터 가져오기 시도
    fetchDayData(date);
  };

  // Fetch monthly mood data when selected month changes
  useEffect(() => {
    const fetchMonthlyDiaries = async () => {
      try {
        console.log("Fetching data for month:", selectedMonth);
        const responseData = await calenderApi({ month: selectedMonth });

        if (responseData && responseData.data && responseData.data.summaries) {
          setMoodSummaries(responseData.data.summaries);
        }
      } catch (error) {
        console.error("월간 다이어리 조회 실패:", error);
      }
    };
  
    fetchMonthlyDiaries();
  }, [selectedMonth]);

  const renderDay = (day) => {
    if (!day) return null;
    const dateString = day.dateString;
    
    const moodData = moodSummaries.find(item => item.date === dateString);
    const diaryEntry = diaryData.find((entry) => entry.date === dateString);
    const moodEmoji = moodData ? moodToEmoji[moodData.mood] || "❓" : null;
    
    // Debug logs
    if (moodData) {
      console.log(`Date: ${dateString}, Mood: ${moodData.mood}, Emoji: ${moodEmoji}`);
    }

    return (
      <TouchableOpacity
        onPress={() => openModal(dateString, diaryEntry)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 16,
              color: dateString === today ? Colors.pointColor : "black",
              fontWeight: dateString === today ? "bold" : "normal",
            }}
          >
            {day.day}
          </Text>
          {moodEmoji && (
            <Text style={{ fontSize: 18 }}>{moodEmoji}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={styles.background}
      resizeMode="cover"
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
              current={currentDate}
              onMonthChange={(month) => {
                const yearMonth = month.dateString.substring(0, 7); // Get "YYYY-MM"
                console.log("Month changed to:", yearMonth);
                setSelectedMonth(yearMonth);
                setCurrentDate(month.dateString);
              }}
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
    flex: 1,
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