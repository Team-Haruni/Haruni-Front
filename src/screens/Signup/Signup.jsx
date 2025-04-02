import React, { useState } from "react";
import { View, StyleSheet, Platform, Alert } from "react-native";
import ProgressBar from "../../components/Signup/ProgressBar";
import SignupPage1 from "./SignupPage1";
import SignupPage2 from "./SignupPage2";
import SignupPage3 from "./SignupPage3";
import SignupPage4 from "./SignupPage4";
import SignupPage5 from "./SignupPage5";
import SignupPage6 from "./SignupPage6";
import SignupPage7 from "./SignupPage7";
import { signupApi } from "../../api/signup"; // 방금 만든 회원가입 API 함수
import { setUserName, setNickname } from "../../../redux/slices/expSlice";
import { useDispatch } from "react-redux";

const Signup = ({ navigation }) => {
  const dispatch = useDispatch();
  const progressArray = [14, 28, 42, 57, 71, 85, 100];
  const [progress, setProgress] = useState(progressArray[0]);
  const [currentPage, setCurrentPage] = useState(1); //1로 설정
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [characterNickname, setCharacterNickname] = useState("");
  const [characterHobby, setCharacterHobby] = useState();
  const [alertDate, setAlertDate] = useState("01:00");
  const [gender, setGender] = useState("");

  const handleNext = () => {
    if (currentPage < 7) {
      setCurrentPage(currentPage + 1);
      setProgress(progressArray[currentPage]);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setProgress(progressArray[currentPage - 2]);
    }
  };

  const handleSignup = async () => {
    const formattedHobby = characterHobby.join(", ");
    const signupData = {
      email,
      password,
      nickname,
      gender,
      haruniName: characterNickname,
      prompt: formattedHobby,
      alarmActiveTime: alertDate,
      alarmActive: true,
      providerId: "NORMAL",
    };

    try {
      // 회원가입 API 호출
      const status = await signupApi(signupData);
      if (status == 200) {
        dispatch(setUserName(nickname));
        dispatch(setNickname(characterNickname));
        Alert.alert("회원가입 성공!", "회원가입이 완료되었습니다.");
        navigation.replace("Login"); // 회원가입 성공 후 페이지 이동
      }
    } catch (error) {
      Alert.alert("회원가입 실패", error.message);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <SignupPage1
            email={email}
            setEmail={setEmail}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <SignupPage2
            password={password}
            setPassword={setPassword}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 3:
        return (
          <SignupPage3
            nickname={nickname}
            setNickname={setNickname}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 4:
        return (
          <SignupPage4
            setGender={setGender}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 5:
        return (
          <SignupPage5
            characterNickname={characterNickname}
            setCharacterNickname={setCharacterNickname}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 6:
        return (
          <SignupPage6
            handleNext={handleNext}
            handleBack={handleBack}
            setCharacterHobby={setCharacterHobby}
          />
        );
      case 7:
        return (
          <SignupPage7
            setAlertDate={setAlertDate}
            handleSignup={handleSignup}
            handleBack={handleBack}
          />
        );
      default:
        return <SignupPage1 />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <ProgressBar progress={progress} duration={500} />
      </View>
      {renderPage()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? 30 : 0,
    flex: 1,
    justifyContent: "start",
    alignItems: "center",
    backgroundColor: "white",
  },
  progressBarContainer: {
    marginTop: 20,
    width: "100%",
    height: 20,
  },
});

export default Signup;
