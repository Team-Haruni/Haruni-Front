import { React, useEffect, useState } from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import Colors from "../../../styles/color";

const ProgressBar = ({ progress = 50, duration = 1000 }) => {
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress, // 목표 progress 값 (0에서 100)
      duration: duration, // 애니메이션 지속 시간 (ms)
      useNativeDriver: false, // 레이아웃 애니메이션을 위해 false
    }).start();
  }, [progress]);

  const barWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"], // 0에서 100까지 비율에 맞게 조정
  });
  return (
    <View style={styles.container}>
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
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 12,
    backgroundColor: Colors.gray50,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.pointColor,
  },
});

export default ProgressBar;
