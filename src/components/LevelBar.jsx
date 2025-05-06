import { React, useEffect, useState } from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import Colors from "../../styles/color";
import useCustomFonts from "../hooks/useCustomFonts";
import { mainApi } from "../api/main";

const LevelBar = () => {
  const fontsLoaded = useCustomFonts();
  const [level, setLevel] = useState(1); 
  const [progress, setProgress] = useState(0);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchMainLevel = async() => {
      try {
        const responseData = await mainApi();

        if (responseData && responseData.data) {
          const { haruniLevelInteger, haruniLevelDecimal } = responseData.data;

          setLevel(haruniLevelInteger);
          setProgress(haruniLevelDecimal*100);

          Animated.timing(animatedValue, {
            toValue: haruniLevelDecimal,
            duration: 1000,
            useNativeDriver: false,
          }).start();
        }
      } catch (err) {
        console.error("level data failed", err);
      }
    };

    fetchMainLevel();
  }, []);

  const barWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"], // 0에서 100까지 비율에 맞게 조정
  });
  return (
    <View style={styles.container}>
      <Text style={styles.levelText}>LV.{level}</Text>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: barWidth }, // width를 애니메이션 값으로 설정
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  progressBar: {
    width: 202,
    height: 12,
    borderRadius: 10,
    backgroundColor: Colors.gray50,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: Colors.pointColor,
  },
  levelText: {
    fontFamily: "Cafe24Ssurrond",
  },
});

export default LevelBar;
