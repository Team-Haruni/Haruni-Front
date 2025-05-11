// src/screens/User.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Platform,
  Text,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import characterData from "../../data/characterData";
import { useSelector } from "react-redux";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";
import { LineChart } from "react-native-gifted-charts";
import * as Sentry from "@sentry/react-native";
import { fetchWeeklyFeedback } from "../../api/weeklyFeedback";

const screenWidth = Dimensions.get("window").width;
const moodToValue = {
  sad: { value: 0, emoji: "😞" },
  normal: { value: 50, emoji: "😐" },
  happy: { value: 95, emoji: "😁" },
};
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

const User = () => {
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  const nickname = useSelector((state) => state.exp.nickname);
  const [weekData, setWeekData] = useState(false);
  const [lineData, setLineData] = useState([
    { value: 50, dataPointText: "😐", label: "일" },
    { value: 0, dataPointText: "😞", label: "월" },
    { value: null, dataPointText: "", label: "화" },
    { value: 95, dataPointText: "😁", label: "수" },
    { value: 0, dataPointText: "😞", label: "목" },
    { value: 95, dataPointText: "😁", label: "금" },
    { value: 95, dataPointText: "😁", label: "토" },
  ]);
  const [feedback, setFeedback] = useState("");
  const [weekSummary, setWeekSummary] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const fontsLoaded = useCustomFonts();

  const convertToLineData = (dayMoods) => {
    // 요일별 기본값 설정 (null 처리)
    const weekMap = {
      일: { value: null, dataPointText: "", label: "일" },
      월: { value: null, dataPointText: "", label: "월" },
      화: { value: null, dataPointText: "", label: "화" },
      수: { value: null, dataPointText: "", label: "수" },
      목: { value: null, dataPointText: "", label: "목" },
      금: { value: null, dataPointText: "", label: "금" },
      토: { value: null, dataPointText: "", label: "토" },
    };
    dayMoods.forEach(({ date, mood }, index) => {
      const day = index; // 0=일요일, ..., 6=토요일
      const label = weekdays[day];
      if (moodToValue[mood]) {
        weekMap[label] = {
          value: moodToValue[mood].value,
          dataPointText: moodToValue[mood].emoji,
          label,
        };
      }
    });
    return ["일", "월", "화", "수", "목", "금", "토"].map(
      (label) => weekMap[label]
    );
  };

  useEffect(() => {
    const loadWeeklyFeedback = async () => {
      try {
        const data = await fetchWeeklyFeedback();
        console.log(data);
        const convertedLineData = convertToLineData(data.dayMoods);
        setWeekData(true);
        setLineData(convertedLineData);
        setFeedback(data.feedback.replace(/\. /g, ".\n"));
        setWeekSummary(data.weekSummary.replace(/\. /g, ".\n"));
        setSuggestion(data.suggestion.replace(/\. /g, ".\n"));
        setRecommendation(data.recommendation.replace(/\. /g, ".\n"));
      } catch (error) {
        Sentry.withScope((scope) => {
          scope.setLevel("error");
          scope.setTag("type", "api");
          scope.setTag("api", "fetchFeedback");
          Sentry.captureException(error);
        });
      }
    };
    loadWeeklyFeedback();
  }, []);

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          {/* 상단 프로필 */}
          <View style={styles.topSection}>
            <View style={styles.imgContainer}>
              <Image
                resizeMode="resize"
                source={characterData[characterVersion].url}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.nickname}>{nickname}</Text>
          </View>

          {/* 피드백 섹션: 세로 스크롤 */}
          <ScrollView style={styles.commentsWrapper}>
            {/* 주간 감정 흐름 차트 */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>이번 주 감정흐름</Text>
              <View style={styles.chartInner}>
                {weekData ? (
                  <LineChart
                    rulesType="dashed"
                    rulesThickness={1}
                    rulesColor={Colors.pointColor}
                    data={lineData}
                    curved={true}
                    curveType="bezier"
                    initialSpacing={20}
                    spacing={40}
                    thickness={2}
                    width={screenWidth - 120}
                    isAnimated
                    areaChart
                    height={120}
                    animationDuration={1200}
                    color={Colors.pointColor}
                    dataPointsColor={Colors.pointColor}
                    dataPointRadius={10}
                    startFillColor={Colors.pointColor}
                    startOpacity={0.7}
                    endOpacity={0}
                    maxValue={100}
                    noOfSections={2}
                    hideYAxisText
                    yAxisLabelWidth={15}
                    textShiftY={0}
                    textShiftX={-10}
                    xAxisColor={Colors.pointColor}
                    yAxisColor={Colors.pointColor}
                    yAxisLabelTexts={["Bad", "Normal", "Good"]}
                    yAxisTextStyle={styles.axisText}
                    xAxisLabelTextStyle={styles.axisText}
                  />
                ) : (
                  <Text style={styles.comment}>데이터가 충분하지 않습니다</Text>
                )}
              </View>
            </View>

            {/* 주간 피드백 */}
            <View style={styles.commentContainer}>
              <Text style={styles.commentTitle}>주간 피드백</Text>
              <ScrollView>
                <Text style={styles.comment}>
                  {weekData
                    ? feedback
                    : "나랑 더 얘기해줘! 일주일의 기분을 분석해줄게!!"}
                </Text>
              </ScrollView>
            </View>

            {/* 이번 주 돌아보기 */}
            <View style={styles.commentContainer}>
              <Text style={styles.commentTitle}>이번 주 돌아보기</Text>
              <ScrollView>
                <Text style={styles.comment}>
                  {weekData
                    ? weekSummary
                    : "나랑 더 얘기해줘! 일주일의 기분을 분석해줄게!!"}
                </Text>
              </ScrollView>
            </View>

            {/* 다음 주를 위한 작은 제안 */}
            <View style={styles.commentContainer}>
              <Text style={styles.commentTitle}>다음 주를 위한 작은 제안</Text>
              <ScrollView>
                <Text style={styles.comment}>
                  {weekData
                    ? suggestion
                    : "나랑 더 얘기해줘! 일주일의 기분을 분석해줄게!!"}
                </Text>
              </ScrollView>
            </View>

            {/* 다음 주 추천 */}
            <View style={styles.commentContainer}>
              <Text style={styles.commentTitle}>다음 주 추천</Text>
              <ScrollView>
                <Text style={styles.comment}>
                  {weekData
                    ? recommendation
                    : "나랑 더 얘기해줘! 일주일의 기분을 분석해줄게!!"}
                </Text>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  background: {
    flex: 1,
  },
  container: {
    margin: 20,
    flex: 1,
  },
  topSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  imgContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.myColor,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  nickname: {
    marginTop: 15,
    fontSize: 20,
    fontFamily: "Cafe24Ssurrond",
  },
  chartContainer: {
    backgroundColor: Colors.myColor,
    borderRadius: 20,
    padding: 10,
    paddingTop: 20,
    minHeight: 200,
    marginBottom: 20,
    borderColor: Colors.pointColor,
    borderWidth: 1,
    alignItems: "center",
  },
  chartTitle: {
    width: "100%",
    paddingLeft: 10,
    marginBottom: 30,
    fontFamily: "Cafe24Ssurrond",
    fontSize: 15,
  },
  chartInner: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  commentsWrapper: {
    flex: 1,
  },
  commentContainer: {
    width: "100%", // 전체 폭
    minHeight: 100,
    maxHeight: 200,
    marginBottom: 16,
    padding: 12,
    borderRadius: 20,
    backgroundColor: Colors.myColor,
    borderColor: Colors.pointColor,
    borderWidth: 1,
  },
  commentTitle: {
    fontFamily: "Cafe24Ssurrond",
    fontSize: 15,
    marginBottom: 8,
  },
  comment: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 14,
  },

  axisText: {
    fontFamily: "Cafe24Ssurrond",
    fontSize: 12,
    color: Colors.pointColor,
  },
});

export default User;
