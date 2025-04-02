import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import useCustomFonts from "../../hooks/useCustomFonts";
import Colors from "../../../styles/color";
import CustomButton from "../../components/CustomButton";
import BackIcon from "../../../assets/back-icon.svg";
import ErrorMessage from "../../components/ErrorMessage";
import TimePicker from "../../components/TimePicker";

const AM_PM = ["오전", "오후"];
const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString()); // 1~12시
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString()); // 1~60분

const SignupPage7 = ({ setAlertDate, handleSignup, handleBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(); // "오전" or "오후"
  const [selectedHour, setSelectedHour] = useState(); // "1" ~ "12"
  const [selectedMinutes, setSelectedMinutes] = useState(); // "0" ~ "59"
  const fontsLoaded = useCustomFonts();

  useEffect(() => {
    setSelectedPeriod(AM_PM[0]);
    setSelectedHour(HOURS[0]);
    setSelectedMinutes(MINUTES[0]);
  }, []);

  const handleSubmit = () => {
    let hour = parseInt(selectedHour, 10);

    // "오후"일 때 12 더하고, 12시는 그대로 유지
    if (selectedPeriod === "오후" && hour !== 12) {
      hour += 12;
    }

    // "오전"일 때 12시는 0시로 변경
    if (selectedPeriod === "오전" && hour === 12) {
      hour = 0;
    }

    const formattedTime = `${hour
      .toString()
      .padStart(2, "0")}:${selectedMinutes.padStart(2, "0")}`;

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
          <TimePicker
            AM_PM={AM_PM}
            HOURS={HOURS}
            MINUTES={MINUTES}
            setSelectedPeriod={setSelectedPeriod}
            setSelectedHour={setSelectedHour}
            setSelectedMinutes={setSelectedMinutes}
          />
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
