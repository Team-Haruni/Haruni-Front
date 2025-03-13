import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import ProgressBar from "../../components/Signup/ProgressBar";
import SignupPage1 from "./SignupPage1";
import SignupPage2 from "./SignupPage2";
import SignupPage3 from "./SignupPage3";
import SignupPage4 from "./SignupPage4";
import SignupPage5 from "./SignupPage5";
import SignupPage6 from "./SignupPage6";

const Signup = ({ navigation }) => {
  const progressArray = [16, 32, 50, 66, 84, 100];
  const [progress, setProgress] = useState(progressArray[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [characterNickname, setCharacterNickname] = useState("");
  const [characterHobby, setCharacterHobby] = useState();
  const [alertDate, setAlertDate] = useState("");

  const handleNext = () => {
    if (currentPage < 6) {
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

  const handleSignup = () => {
    alert("회원가입 성공!");
    navigation.replace("Bottom");
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
            characterNickname={characterNickname}
            setCharacterNickname={setCharacterNickname}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 5:
        return (
          <SignupPage5
            handleNext={handleNext}
            handleBack={handleBack}
            setCharacterHobby={setCharacterHobby}
          />
        );
      case 6:
        return (
          <SignupPage6
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
