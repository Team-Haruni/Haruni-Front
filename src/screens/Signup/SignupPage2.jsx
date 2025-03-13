import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import useCustomFonts from "../../hooks/useCustomFonts";
import Colors from "../../../styles/color";
import CustomButton from "../../components/CustomButton";
import CustomTextInput from "../../components/CustomTextInput";
import BackIcon from "../../../assets/back-icon.svg";
import ErrorMessage from "../../components/ErrorMessage";

const SignupPage2 = ({ password, setPassword, handleNext, handleBack }) => {
  const fontsLoaded = useCustomFonts();
  const [checkPassword, setCheckPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  useEffect(() => {
    setCheckPassword("");
    setPasswordErrorMessage("");
    setPassword("");
  }, []);

  // 비밀번호 유효성 검사 함수 (8~12자리 숫자 및 영문)
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
    if (!passwordRegex.test(password)) {
      setPasswordErrorMessage(" * 형식이 올바르지 않습니다");
      return false;
    }
    return true;
  };

  const handleSubmitPassword = () => {
    if (isValidPassword(password)) {
      handleNext();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.svgContainer} onPress={handleBack}>
        <BackIcon />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>비밀번호를 입력해주세요</Text>
        <CustomTextInput
          placeholder="8~12자리 숫자 및 영문을 입력"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
          height={46}
        />
        {passwordErrorMessage ? (
          <ErrorMessage message={passwordErrorMessage} />
        ) : null}
        <View style={{ height: 20 }}></View>
        <CustomTextInput
          placeholder="한번 더 입력"
          value={checkPassword}
          onChangeText={setCheckPassword}
          autoCapitalize="none"
          secureTextEntry
          height={46}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          text="다음"
          onPress={handleSubmitPassword}
          width="100%"
          height="100%"
          textColor="white"
          backgroundColor={Colors.pointColor}
          borderRadius={12}
          disabled={!password || !checkPassword || password !== checkPassword}
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
});

export default SignupPage2;
