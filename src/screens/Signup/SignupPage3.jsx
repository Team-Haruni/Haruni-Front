import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import useCustomFonts from "../../hooks/useCustomFonts";
import Colors from "../../../styles/color";
import CustomButton from "../../components/CustomButton";
import CustomTextInput from "../../components/CustomTextInput";
import BackIcon from "../../../assets/back-icon.svg";
import ErrorMessage from "../../components/ErrorMessage";

const SignupPage3 = ({ nickname, setNickname, handleNext, handleBack }) => {
  const fontsLoaded = useCustomFonts();
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState("");

  useEffect(() => {
    setNicknameErrorMessage("");
    setNickname("");
  }, []);

  const isValidNickname = (nickname) => {
    if (nickname.length < 2) {
      setNicknameErrorMessage(" * 형식이 올바르지 않습니다");
      return false;
    }
    return true;
  };

  const handleSubmitNickname = () => {
    if (isValidNickname(nickname)) {
      handleNext();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.svgContainer} onPress={handleBack}>
        <BackIcon />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>닉네임을 설정해주세요</Text>
        <View style={styles.nicknameInputContainer}>
          <CustomTextInput
            placeholder="2자리 이상"
            value={nickname}
            onChangeText={setNickname}
            autoCapitalize="none"
            height={46}
            width="100%"
          />
        </View>
        {nicknameErrorMessage ? (
          <ErrorMessage message={nicknameErrorMessage} />
        ) : null}
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          text="다음"
          onPress={handleSubmitNickname}
          width="100%"
          height="100%"
          textColor="white"
          backgroundColor={Colors.pointColor}
          borderRadius={12}
          disabled={nickname.length < 2}
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
  nicknameInputContainer: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 46,
    justifyContent: "space-between",
  },
});

export default SignupPage3;
