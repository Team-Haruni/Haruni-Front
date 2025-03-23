import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import useCustomFonts from "../../hooks/useCustomFonts";
import Colors from "../../../styles/color";
import CustomButton from "../../components/CustomButton";
import CustomTextInput from "../../components/CustomTextInput";
import BackIcon from "../../../assets/back-icon.svg";
import ErrorMessage from "../../components/ErrorMessage";
import MALEIcon from "../../../assets/male-icon.svg";
import FEMALEIcon from "../../../assets/female-icon.svg";

const SignupPage4 = ({ gender, setGender, handleNext, handleBack }) => {
  const fontsLoaded = useCustomFonts();
  const [selectedGender, setSelectedGender] = useState(""); // 성별 상태 추가

  useEffect(() => {
    setGender("");
  }, []);

  const handleSubmitGender = () => {
    handleNext();
  };

  const handleGenderSelect = (genderType) => {
    setSelectedGender(genderType);
    setGender(genderType); // 선택된 성별로 `gender` 상태 업데이트
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.svgContainer} onPress={handleBack}>
        <BackIcon />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>성별을 설정해주세요</Text>
        <View style={styles.genderInputContainer}>
          <TouchableOpacity
            style={[
              styles.genderContainer,
              selectedGender === "MALE" && { borderColor: "black" }, // 선택된 성별에 borderColor 변경
            ]}
            onPress={() => handleGenderSelect("MALE")}
          >
            <MALEIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderContainer,
              selectedGender === "FEMALE" && { borderColor: "black" }, // 선택된 성별에 borderColor 변경
            ]}
            onPress={() => handleGenderSelect("FEMALE")}
          >
            <FEMALEIcon />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          text="다음"
          onPress={handleSubmitGender}
          width="100%"
          height="100%"
          textColor="white"
          backgroundColor={Colors.pointColor}
          borderRadius={12}
          disabled={selectedGender.length < 2} // 성별이 선택되지 않으면 버튼 비활성화
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
  genderInputContainer: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 100,
    gap: 60,
    marginTop: 20,
    justifyContent: "center",
  },
  genderContainer: {
    height: 95,
    width: 95,
    borderColor: Colors.gray100,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignupPage4;
