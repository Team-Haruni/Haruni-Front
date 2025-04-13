import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import useCustomFonts from "../../hooks/useCustomFonts";
import Colors from "../../../styles/color";
import CustomButton from "../../components/CustomButton";
import BackIcon from "../../../assets/back-icon.svg";
import ErrorMessage from "../../components/ErrorMessage";
import TimePicker from "../../components/TimePicker";
import { useDispatch, useSelector } from "react-redux";
import {
  setPeriod,
  setHour,
  setMinutes,
} from "../../../redux/slices/alarmSlice";

const AM_PM = ["오전", "오후"];
const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString()); // 1~12시
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString()); // 1~60분

const SignupPage7 = ({ setAlertDate, handleSignup, handleBack }) => {
  const dispatch = useDispatch();
  const period = useSelector((state) => state.alarm.period);
  const hour = useSelector((state) => state.alarm.hour);
  const minutes = useSelector((state) => state.alarm.minutes);
  const fontsLoaded = useCustomFonts();

  useEffect(() => {
    dispatch(setPeriod(AM_PM[0]));
    dispatch(setHour(HOURS[0]));
    dispatch(setMinutes(MINUTES[0]));
  }, []);

  const handleSubmit = () => {
    let selectedHour = parseInt(hour, 10);

    // "오후"일 때 12 더하고, 12시는 그대로 유지
    if (period === "오후" && selectedHour !== 12) {
      selectedHour += 12;
    }

    // "오전"일 때 12시는 0시로 변경
    if (period === "오전" && selectedHour === 12) {
      selectedHour = 0;
    }

    const formattedTime = `${selectedHour
      .toString()
      .padStart(2, "0")}:${minutes.padStart(2, "0")}`;

    setAlertDate(formattedTime);
    handleSignup();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.svgContainer} onPress={handleBack}>
        <BackIcon />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>알림 시간을 설정해 주세요</Text>
        <View style={styles.dateContainer}>
          <TimePicker AM_PM={AM_PM} HOURS={HOURS} MINUTES={MINUTES} />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          text="다음"
          onPress={handleSubmit}
          width="100%"
          height="100%"
          textColor="white"
          backgroundColor={Colors.pointColor}
          borderRadius={12}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    width: "100%",
    marginTop: "10%",
    height: "100%",
    justifyContent: "start",
    alignItems: "center",
    paddingVertical: 30,
    gap: 50,
  },
  contentContainer: {
    width: "100%",
    height: "auto",
    justifyContent: "start",
    alignItems: "start",
  },
  title: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 20,
    marginBottom: 40,
  },
  svgContainer: {
    position: "absolute",
    top: -25,
    left: 30,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: 60,
    width: "100%",
    bottom: 20,
  },
  dateContainer: {
    marginTop: 50,
    marginBottom: 10,
    margin: "auto",
    width: "100%",
    paddingHorizontal: 5,
    height: 320,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.gray50,
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default SignupPage7;
