import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import useCustomFonts from "../../hooks/useCustomFonts";
import Colors from "../../../styles/color";
import CustomButton from "../../components/CustomButton";
import CustomTextInput from "../../components/CustomTextInput";
import BackIcon from "../../../assets/back-icon.svg";
import ErrorMessage from "../../components/ErrorMessage";
import { Image } from "expo-image"; // expo-image에서 Image 컴포넌트 임포트

const SignupPage5 = ({
  characterNickname,
  setCharacterNickname,
  handleNext,
  handleBack,
}) => {
  const fontsLoaded = useCustomFonts();
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState("");
  useEffect(() => {
    setNicknameErrorMessage("");
    setCharacterNickname("");
  }, []);

  const isValidNickname = (nickname) => {
    if (nickname.length < 2) {
      setNicknameErrorMessage(" * 형식이 올바르지 않습니다");
      return false;
    }
    return true;
  };

  const handleSubmitNickname = () => {
    if (isValidNickname(characterNickname)) {
      handleNext();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.svgContainer} onPress={handleBack}>
        <BackIcon />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>캐릭터의 이름을 설정해 주세요</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/haruni/medium_signup.png")} // GIF 파일 경로
            style={[styles.image]} // GIF 크기 조정
            contentFit="contain" // 애니메이션 크기 조정 방식
          />
        </View>
        <CustomTextInput
          placeholder="2자리 이상"
          value={characterNickname}
          onChangeText={setCharacterNickname}
          autoCapitalize="none"
          height={46}
          width="100%"
        />
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
          disabled={!characterNickname}
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
  imageContainer: {
    marginTop: 20,
    marginBottom: 30,
    margin: "auto",
    width: 200,
    height: 220,
  },
  image: {
    width: "100%",
    height: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default SignupPage5;
