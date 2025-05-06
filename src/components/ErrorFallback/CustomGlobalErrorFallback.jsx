import React, { useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  ImageBackground,
  Animated,
} from "react-native";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";
import * as Sentry from "@sentry/react-native";

const CustomGlobalErrorFallback = ({ error, resetError }) => {
  const fontsLoaded = useCustomFonts();
  // 에러가 생기면 Sentry에 전송
  useEffect(() => {
    if (error) {
      Sentry.withScope((scope) => {
        scope.setTag("screen", "CustomGlobalErrorFallback");
        Sentry.captureException(error);
      });
    }
  }, [error]);

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.4 }}
    >
      <View style={styles.safeContainer}>
        <Animated.View style={styles.errorBox}>
          <Text style={[styles.errorText, { fontFamily: "Cafe24Ssurrondair" }]}>
            {error.message}
          </Text>
          <Text style={[styles.retryCopy, { fontFamily: "Cafe24Ssurrondair" }]}>
            잠시 후 다시 시도해주세요
          </Text>

          <TouchableOpacity onPress={resetError} style={styles.retryButton}>
            <Text
              style={[
                styles.retryButtonText,
                { fontFamily: "Cafe24Ssurrond", letterSpacing: 1 },
              ]}
            >
              다시 시도하기
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

export default CustomGlobalErrorFallback;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#00000099",
  },
  safeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 10 : 0,
    paddingHorizontal: 20,
  },
  errorBox: {
    backgroundColor: Colors.myColor,
    padding: 35,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    width: 330,
    borderWidth: 1,
    borderColor: Colors.yellow100,
  },
  errorText: {
    fontSize: 15,
    color: Colors.mainGray,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 20,
  },
  retryCopy: {
    fontSize: 14,
    color: Colors.mainGray,
    marginBottom: 24,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.pointColor,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 22,
  },
  retryButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});
