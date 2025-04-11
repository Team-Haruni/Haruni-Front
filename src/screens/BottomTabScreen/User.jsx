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
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import CalendarPopup from "../../components/Popup/CalendarPopup";
import characterData from "../../data/characterData";
import { useSelector } from "react-redux";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";
import { LineChart } from "react-native-gifted-charts";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const User = () => {
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  const nickname = useSelector((state) => state.exp.nickname);
  const [weekData, setWeekData] = useState(true);
  const fontsLoaded = useCustomFonts();

  const lineData = [
    { value: 0, dataPointText: "😞", label: "월" },
    { value: null, dataPointText: "", label: "화" }, //기록안한정보
    { value: 95, dataPointText: "😁", label: "수" },
    { value: 0, dataPointText: "😞", label: "목" },
    { value: 95, dataPointText: "😁", label: "금" },
    { value: 95, dataPointText: "😁", label: "토" },
    { value: 50, dataPointText: "😐", label: "일" },
  ];

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

            <Text style={styles.nickname}>{nickname}</Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.myColor,
              borderRadius: 20,
              padding: 10,
              paddingTop: 20,
              height: "auto",
              minHeight: 200,
              marginBottom: 30,
              alignItems: "center",
              justifyContent: "start",
              borderColor: Colors.pointColor,
              borderWidth: 1,
            }}
          >
            <View style={{ width: "100%", paddingLeft: 10, marginBottom: 30 }}>
              <Text style={{ fontFamily: "Cafe24Ssurrond", fontSize: 15 }}>
                이번 주 감정흐름
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: 200,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {weekData ? (
                <LineChart
                  rulesType="dashed" // "dashed" or "solid"
                  rulesThickness={1} // 줄 두께
                  rulesColor={Colors.pointColor} // 원하는 색으로 지정
                  data={lineData}
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
                  hideYAxisText={true} // ✅ 아예 안보이게 하기!
                  yAxisLabelWidth={15}
                  textShiftY={0}
                  textShiftX={-10}
                  xAxisColor={Colors.pointColor}
                  yAxisColor={Colors.pointColor}
                  yAxisLabelTexts={["Bad", "Normal", "Good"]}
                  yAxisTextStyle={{
                    fontFamily: "Cafe24Ssurrond",
                    fontSize: 12,
                    color: Colors.pointColor,
                  }}
                  xAxisLabelTextStyle={{
                    fontSize: 12,
                    color: Colors.pointColor,
                    fontFamily: "Cafe24Ssurrond",
                  }}
                />
              ) : (
                <Text style={styles.comment}>데이터가 충분하지 않습니다</Text>
              )}
            </View>
          </View>
          <View
            style={{
              height: "auto",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.imgContainer2}>
              <Image
                resizeMode="resize"
                source={characterData[characterVersion].url}
                style={styles.profileImage2}
              />
            </View>

            <View style={styles.commentContainer}>
              <View style={styles.bubbleTailOuter} />
              <View style={styles.bubbleTailInner} />
              <ScrollView>
                {weekData ? (
                  <Text style={styles.comment}>
                    음음 생각보다 별로네요..음음 생각보다 별로네요.. 음음
                    생각보다 별로네요.. 음음 생각보다 별로네요.. 음음 생각보다
                    별로네요.. 음음 생각보다 별로네요.. 음음 생각보다 별로네요..
                    음음 생각보다 별로네요.. 음음 생각보다 별로네요.. 음음
                    생각보다 별로네요.. 음음 생각보다 별로네요.. 음음 생각보다
                    별로네요.. 음음 생각보다 별로네요..
                  </Text>
                ) : (
                  <Text style={styles.comment}>
                    나랑 더 얘기해줘! 일주일의 기분을 분석해줄게!!
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>
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
    flexDirection: "column",
    flex: 1,
  },
  background: {
    flex: 1, // 화면을 가득 채우도록 설정
  },
  topSection: {
    height: 150,
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
  },

  imgContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.myColor,
  },
  imgContainer2: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.pointColor,
    borderWidth: 1,
    backgroundColor: Colors.myColor,
  },
  profileImage2: {
    width: 70,
    height: 70,
  },

  nickname: {
    marginTop: 15,
    fontSize: 20,
    color: "black",
    fontFamily: "Cafe24Ssurrond",

    lineHeight: 22,
    wordWrap: "break-word",
  },

  commentContainer: {
    height: 120,
    width: "75%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.myColor,
    borderColor: Colors.pointColor,
    borderWidth: 2,

    zIndex: 1,
  },
  comment: {
    fontFamily: "Cafe24Ssurrondair",
  },
  bubbleTailOuter: {
    position: "absolute",
    top: 20,
    left: -14, // 테두리를 위해 더 바깥
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderRightWidth: 14,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: Colors.pointColor, // ✅ 테두리 색
    zIndex: -2,
  },

  bubbleTailInner: {
    position: "absolute",
    top: 22, // 안쪽 삼각형이 살짝 들어가게
    left: -11,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 12,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: Colors.myColor, // ✅ 말풍선 본체 색
    zIndex: -1,
  },
});

export default User;
