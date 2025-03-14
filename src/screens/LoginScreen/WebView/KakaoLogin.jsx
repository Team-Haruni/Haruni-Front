import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { Component } from "react";
import { WebView } from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const REST_API_KEY = Constants.expoConfig.extra.REST_API_KEY;
const REST_API_SECRET = Constants.expoConfig.extra.REST_API_SECRET;
const REDIRECT_URI = Constants.expoConfig.extra.REDIRECT_URI;
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KakaoLogin = ({ navigation }) => {
  function KakaoLoginWebView(data) {
    const exp = "code=";
    var condition = data.indexOf(exp);
    if (condition != -1) {
      var authorize_code = data.substring(condition + exp.length);
      // console.log(authorize_code);
      requestToken(authorize_code);
    }
  }

  const requestToken = async (authorize_code) => {
    var AccessToken = "none";
    axios({
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded',
      // },
      method: "post",
      url: "https://kauth.kakao.com/oauth/token",
      params: {
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        client_secret: REST_API_SECRET,
        redirect_uri: REDIRECT_URI,
        code: authorize_code,
      },
    })
      .then((response) => {
        AccessToken = response.data.access_token;

        console.log(AccessToken);
        //requestUserInfo(AccessToken);
        storeData(AccessToken);
      })
      .catch(function (error) {
        console.error("❌ Error during token request:", error.message);
        if (error.response) {
          console.error("❗ Response Data:", error.response.data);
          console.error("❗ Response Status:", error.response.status);
          console.error("❗ Response Headers:", error.response.headers);
        } else if (error.request) {
          console.error("❗ No Response received from server:", error.request);
        } else {
          console.error("❗ Error setting up request:", error.message);
        }
      });

    navigation.push("Login");
  };

  const storeData = async (returnValue) => {
    try {
      await AsyncStorage.setItem("userAccessToken", returnValue);
    } catch (error) {}
  };

  return (
    <View style={Style.container}>
      <WebView
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled
        onMessage={(event) => {
          KakaoLoginWebView(event.nativeEvent["url"]);
        }}
      />
    </View>
  );
};

export default KakaoLogin;

const Style = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
});
