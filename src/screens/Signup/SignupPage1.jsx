import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import useCustomFonts from "../../hooks/useCustomFonts";
import CustomButton from "../../components/CustomButton";
import Colors from "../../../styles/color";
import CustomTextInput from "../../components/CustomTextInput";
import ErrorMessage from "../../components/ErrorMessage";

// 이메일 정규식 검사 함수
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// 예시로 사용할 서버 API 호출 함수
const verifyEmailCode = (email, code) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === "123456") {
        resolve(true); // 인증 성공
      } else {
        reject(" * 일치하지 않습니다");
      }
    }, 1000);
  });
};

const SignupPage1 = ({ email, setEmail, handleNext }) => {
  const fontsLoaded = useCustomFonts();
  const [checkEmailCode, setCheckEmailCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false); // 코드 입력란을 보이게 하는 상태
  const [emailErrorMessage, setEmailErrorMessage] = useState(""); // 오류 메시지 상태
  const [codeErrorMessage, setCodeErrorMessage] = useState(""); // 오류 메시지 상태

  const [isLoading, setIsLoading] = useState(false); // 인증 상태
  const [timer, setTimer] = useState(180); // 3분 타이머
  const [intervalId, setIntervalId] = useState(null); // 타이머 ID

  // 타이머 함수
  useEffect(() => {
    if (isLoading && timer > 0) {
      const id = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (timer === 0) {
      clearInterval(intervalId);
      setShowCodeInput(false);
      setCodeErrorMessage("");
      setIsLoading(false);
      setTimer(180);
    }
  }, [isLoading, timer]);

  useEffect(() => {
    setCheckEmailCode("");
    setShowCodeInput(false);
    setEmailErrorMessage("");
    setCodeErrorMessage("");
    setIsLoading(false);
  }, []);

  const handleVerification = () => {
    //이메일 형식 검사
    if (!isValidEmail(email)) {
      setEmailErrorMessage(" * 올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 서버로 인증 요청 보내기
    //중복 검사도 필요함

    setIsLoading(true); // 인증 요청 시작(타이머)

    verifyEmailCode(email, "123456")
      .then(() => {
        setShowCodeInput(true);
        setTimer(180);
        setEmailErrorMessage("");
        setCheckEmailCode("");
      })
      .catch((error) => {
        setEmailErrorMessage(error);
      });
  };

  const handleSubmitCode = () => {
    // 실제 API 호출을 통해 코드 검증
    verifyEmailCode(email, checkEmailCode)
      .then(() => {
        setCodeErrorMessage(""); // 인증 성공 시 오류 메시지 초기화
        handleNext(); // 다음 페이지로 이동
      })
      .catch((error) => {
        setCodeErrorMessage(error); // 인증 실패 시 오류 메시지 설정
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>이메일을 입력해주세요</Text>
        <View style={styles.emailInputContainer}>
          <CustomTextInput
            placeholder="이메일 입력"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            height={46}
            width="75%"
          />
          {isLoading ? (
            <CustomButton
              text={`${Math.floor(timer / 60)}:${timer % 60}`}
              onPress={handleVerification}
              width={60}
              height="80%"
              textColor="white"
              backgroundColor={Colors.pointColor}
              borderRadius={55}
              disabled={!email}
              fontSize={12}
            />
          ) : (
            <CustomButton
              text="인증하기"
              onPress={handleVerification}
              width={60}
              height="80%"
              textColor="white"
              backgroundColor={Colors.pointColor}
              borderRadius={55}
              disabled={!email}
              fontSize={12}
            />
          )}
        </View>
        {emailErrorMessage ? (
          <ErrorMessage message={emailErrorMessage} />
        ) : null}
        <View style={{ height: 20 }}></View>
        {showCodeInput && (
          <CustomTextInput
            placeholder="코드를 입력하세요"
            value={checkEmailCode}
            onChangeText={setCheckEmailCode}
            autoCapitalize="none"
            height={46}
            width="100%"
          />
        )}
        {codeErrorMessage ? <ErrorMessage message={codeErrorMessage} /> : null}
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          text="다음"
          onPress={handleSubmitCode}
          width="100%"
          height="100%"
          textColor="white"
          backgroundColor={Colors.pointColor}
          borderRadius={12}
          disabled={!email || !checkEmailCode}
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
  emailInputContainer: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 46,
    justifyContent: "space-between",
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

export default SignupPage1;
