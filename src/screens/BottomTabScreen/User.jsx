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
import DropdownSection from "../../components/DropdownSection";
import { getApp } from "@react-native-firebase/app";

const screenWidth = Dimensions.get("window").width;
const moodToValue = {
  sad: { value: 0, emoji: "😞" },
  normal: { value: 50, emoji: "😐" },
  happy: { value: 95, emoji: "😁" },
};
const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

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
  const [suggestion1, setSuggestion1] = useState("");
  const [suggestion2, setSuggestion2] = useState("");
  const [suggestion3, setSuggestion3] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [recommendation1, setRecommendation1] = useState("");
  const [recommendation2, setRecommendation2] = useState("");
  const [recommendation3, setRecommendation3] = useState("");
  const fontsLoaded = useCustomFonts();

  const convertToLineData = (dayMoods) => {
    // 요일별 기본값 설정 (null 처리)
    const weekMap = {
      월: { value: null, dataPointText: "", label: "월" },
      화: { value: null, dataPointText: "", label: "화" },
      수: { value: null, dataPointText: "", label: "수" },
      목: { value: null, dataPointText: "", label: "목" },
      금: { value: null, dataPointText: "", label: "금" },
      토: { value: null, dataPointText: "", label: "토" },
      일: { value: null, dataPointText: "", label: "일" },
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
    return ["월", "화", "수", "목", "금", "토", "일"].map(
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
        setFeedback(
          data.feedback
            .split(". ")
            .map((sentence, idx, arr) => {
              const isLast = idx === arr.length - 1;
              const finalSentence = sentence.endsWith(".")
                ? sentence
                : sentence + ".";
              return idx % 2 === 0 || isLast
                ? finalSentence
                : finalSentence + "\n\n";
            })
            .join(" ")
            .trim()
        );
        setWeekSummary(
          data.weekSummary
            .split(". ")
            .map((sentence, idx, arr) => {
              const isLast = idx === arr.length - 1;
              const finalSentence = sentence.endsWith(".")
                ? sentence
                : sentence + ".";
              return idx % 2 === 0 || isLast
                ? finalSentence
                : finalSentence + "\n\n";
            })
            .join(" ")
            .trim()
        );

        const extractItems = (text) => {
          return text
            .split(/\d\.\s/)
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
        };
        const suggestionItems = extractItems(data.suggestion);
        const recommendationItems = extractItems(data.recommendation);

        setSuggestion(data.suggestion);
        setSuggestion1(suggestionItems[0] || "");
        setSuggestion2(suggestionItems[1] || "");
        setSuggestion3(suggestionItems[2] || "");

        setRecommendation(data.recommendation);
        setRecommendation1(recommendationItems[0] || "");
        setRecommendation2(recommendationItems[1] || "");
        setRecommendation3(recommendationItems[2] || "");
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
          <ScrollView style={styles.commentsWrapper}>
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
            {/* 주간 감정 흐름 차트 */}
            <View style={styles.outerContainer}>
              <Text style={styles.chartTitle}>이번 주 감정흐름</Text>
              <View style={styles.chartContainer}>
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
                      spacing={35}
                      thickness={2}
                      width={screenWidth - 150}
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
                    <Text style={styles.comment}>
                      데이터가 충분하지 않습니다
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* 주간 피드백 */}
            <DropdownSection title="주간 피드백">
              <View
                style={{
                  width: "100%",
                  backgroundColor: Colors.myColor,
                  borderRadius: 8,
                  padding: 12,
                  minHeight: 200,
                }}
              >
                {/* 최소 높이 유지 */}
                <Text style={styles.comment}>
                  {weekData
                    ? feedback
                    : "나랑 더 얘기해줘! 일주일의 기분을 분석해줄게!!"}
                </Text>
              </View>
            </DropdownSection>

            {/* 이번 주 돌아보기 */}
            <DropdownSection title="이번 주 돌아보기">
              <View
                style={{
                  width: "100%",
                  backgroundColor: Colors.myColor,
                  borderRadius: 8,
                  padding: 12,
                  minHeight: 200,
                }}
              >
                {/* 최소 높이 유지 */}
                <Text style={styles.comment}>
                  {weekData
                    ? weekSummary
                    : "나랑 더 얘기해줘! 일주일의 돌아봐줄게!!"}
                </Text>
              </View>
            </DropdownSection>

            {/* 다음 주를 위한 작은 제안 */}
            <DropdownSection title="다음 주를 위한 작은 제안">
              <View style={{ minHeight: 150 }}>
                {weekData ? (
                  <>
                    {[suggestion1, suggestion2, suggestion3].map(
                      (item, idx) =>
                        item && (
                          <View key={idx} style={styles.suggestionBox}>
                            <Text style={styles.suggestionNumber}>
                              {idx + 1}.
                            </Text>
                            <Text style={styles.suggestionText}>{item}</Text>
                          </View>
                        )
                    )}
                  </>
                ) : (
                  <View style={styles.sBox}>
                    <Text style={styles.comment}>
                      나랑 더 얘기해줘! 작은 제안을 해줄게!!
                    </Text>
                  </View>
                )}
              </View>
            </DropdownSection>

            {/* 다음 주 추천 */}

            <DropdownSection title="다음 주 추천">
              <View style={{ minHeight: 150 }}>
                {weekData ? (
                  <>
                    {[recommendation1, recommendation2, recommendation3].map(
                      (item, idx) =>
                        item && (
                          <View key={idx} style={styles.suggestionBox}>
                            <Text style={styles.suggestionNumber}>
                              {idx + 1}.
                            </Text>
                            <Text style={styles.suggestionText}>{item}</Text>
                          </View>
                        )
                    )}
                  </>
                ) : (
                  <View style={styles.sBox}>
                    <Text style={styles.comment}>
                      나랑 더 얘기해줘! 다음 주를 위해 추천해줄게!!
                    </Text>
                  </View>
                )}
              </View>
            </DropdownSection>
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
  outerContainer: {
    width: "100%",
    backgroundColor: Colors.pointColor,
    borderRadius: 8,
    padding: 12,
    minHeight: 200,
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: Colors.myColor,
    borderRadius: 20,
    height: 200,
    textAlign: "center",
  },
  chartTitle: {
    width: "100%",
    paddingLeft: 10,
    marginBottom: 20,
    fontFamily: "Cafe24Ssurrond",
    fontSize: 15,
  },
  chartInner: {
    paddingLeft: 10,
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  commentsWrapper: {
    flex: 1,
  },
  commentContainer2: {
    width: "100%",
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.pointColor,
  },
  commentTitle: {
    marginTop: 5,
    fontFamily: "Cafe24Ssurrond",
    fontSize: 15,
    marginBottom: 15,
  },
  comment: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.3,
  },

  axisText: {
    fontFamily: "Cafe24Ssurrond",
    fontSize: 12,
    color: Colors.pointColor,
  },
  suggestionBox: {
    backgroundColor: Colors.myColor, // 반투명 배경
    borderRadius: 12,
    padding: 12,
    minHeight: 50,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  sBox: {
    backgroundColor: Colors.myColor, // 반투명 배경
    borderRadius: 12,
    padding: 12,
    minHeight: 150,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  suggestionNumber: {
    fontSize: 16,
    color: "black",
    fontFamily: "Cafe24Ssurrondair",
    marginTop: 2,
  },

  suggestionText: {
    flex: 1,
    color: "#black",
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.3,
    lineHeight: 22,
  },
});

export default User;
