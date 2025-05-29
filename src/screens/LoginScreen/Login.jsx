import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import Colors from "../../../styles/color";
import { loginApi } from "../../api/login";
import * as Sentry from "@sentry/react-native";
import { signInWithKaKao } from "../../api/kakaoOuth";
import NaverIcon from "../../../assets/naver-icon.svg";
import KakaoIcon from "../../../assets/kakao-icon.svg";
import AppleIcon from "../../../assets/apple-icon.svg";
import useCustomFonts from "../../hooks/useCustomFonts";
import * as SecureStore from "expo-secure-store";

const Login = ({ navigation }) => {
  const fontsLoaded = useCustomFonts();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 클릭 시 실행될 함수들
  const handleSignup = () => navigation.push("Signup");
  const handleFindID = () => Alert.alert("아이디 찾기 페이지 이동!");
  const handleFindPassword = () => Alert.alert("비밀번호 찾기 페이지 이동!");

  //자동로그인
  useEffect(() => {
    const checkTokenAndLogin = async () => {
      try {
        const tokenString = await SecureStore.getItemAsync("userTokens");
        if (tokenString) {
          const tokens = JSON.parse(tokenString);
          console.log("토큰 있음, 자동 로그인 시도:", tokens);

          navigation.replace("Bottom");
        }
      } catch (error) {
        console.error("토큰 확인 중 오류:", error);
      }
    };

    checkTokenAndLogin();
  }, []);

  const socialLogin = async (providerId) => {
    try {
      if (providerId === "KAKAO") {
        const data = await signInWithKaKao();

        console.log("카카오 로그인 응답:", data);

        if (!data) {
          throw new Error("서버 응답이 없습니다.");
        }

        if (data.needSignup === true) {
          navigation.push("Signup", {
            socialEmail: data.data,
            fromSocial: true,
            type: "KAKAO",
          });
        } else if (data.needSignup == false) {
          if (data.data.accessToken && data.data.refreshToken) {
            const tokenData = JSON.stringify({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            });

            console.log("토큰 데이터:", tokenData);
            await SecureStore.setItemAsync("userTokens", tokenData);
            navigation.replace("Bottom");
          }
        }
      }
    } catch (err) {
      Alert.alert("카카오 로그인 실패!");
      console.error("소셜 로그인 중 오류 발생:", err);
    }
  };

  const handleLogin = async () => {
    try {
      // 로그인 api
      // 스팬을 시작하여 비동기 작업 추적
      const result = await Sentry.startSpan(
        { name: "Login API Call" },
        async () => {
          const status = await loginApi({ email: username, password });
          if (status === 200) {
            navigation.replace("Bottom");
          }
        }
      );
      console.log("Login result:", result);
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setUser({
          email: username,
        });
        scope.setLevel("error");
        scope.setTag("type", "api");
        scope.setTag("api", "login");
        Sentry.captureException(error);
      });
      Alert.alert("아이디 비밀번호를 다시한번 확인해 주세요!");
      //navigation.replace("Bottom"); // 로그인 성공 후 페이지 이동
    }
    //navigation.replace("Bottom"); // 로그인 성공 후 페이지 이동
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>로그인</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="아이디를 입력하세요"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.checkboxContainer}>
          {/* <View style={styles.checkbox} />
          <Text style={styles.checkboxLabel}>아이디 저장</Text> */}
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        {/* 회원가입 버튼 */}
        <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
          <Text style={styles.link}>회원가입</Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <View style={styles.socialTextContainer}>
            <View
              style={{
                position: "relative",
                top: -8,
                height: "100%",
                flex: 1,
                borderBottomColor: "#666",
                borderBottomWidth: 1,
              }}
            />
            <View
              style={{
                flex: 1.5,
                width: "auto",
                alignItems: "center",
              }}
            >
              <Text style={styles.socialText}>SNS 간편 로그인</Text>
            </View>
            <View
              style={{
                position: "relative",
                top: -8,
                height: "100%",
                flex: 1,
                borderBottomColor: "#666",
                borderBottomWidth: 1,
              }}
            />
          </View>
          <View style={styles.socialButtons}>
            <TouchableOpacity
              onPress={() => socialLogin("KAKAO")}
              style={styles.socialButton}
            >
              <View style={styles.iconContainer}>
                <KakaoIcon />
              </View>
              <Text style={styles.kakaoText}>카카오로 시작하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: -20,
  },
  header: {
    padding: 20,
    left: 0,
  },
  logo: {
    fontSize: 24,
    fontFamily: "Cafe24Ssurrond",
  },
  inputContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: Colors.gray50,
    fontFamily: "Cafe24Ssurrondair",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginLeft: 3.5,
    marginRight: 10,
  },
  checkboxLabel: {
    color: "#666",
    // marginTop: 10,
  },
  loginButton: {
    backgroundColor: Colors.pointColor,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: "white",
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  loginButtonText: {
    fontFamily: "Cafe24Ssurrond",
    color: "white",
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  link: {
    fontFamily: "Cafe24Ssurrond",
    color: "black",
    fontSize: 16,
  },
  separator: {
    color: "#ddd",
    padding: 10,
  },
  socialContainer: {
    position: "relative",
    top: 50,
    alignItems: "center",
  },
  socialTextContainer: {
    flexDirection: "row",
    marginBottom: 20,
    height: 16,
  },
  socialText: {
    fontFamily: "Cafe24Ssurrondair",
    color: "#666",
  },
  socialButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#FEE500",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  kakaoText: { fontSize: 16 },
  iconContainer: {
    position: "absolute",
    left: 20,
    justifyContent: "center",
    width: 30,
    height: "100%",
  },
});

export default Login;
