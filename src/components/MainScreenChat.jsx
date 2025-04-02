// LoadingBar.js
import React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import useCustomFonts from "../hooks/useCustomFonts";
const MainScreenChat = ({ chat }) => {
  const fontsLoaded = useCustomFonts();
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        style={{ height: "100%", width: "100%" }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text style={styles.content}>{chat}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // 전체 배경 흰색
    justifyContent: "center", // 수직 중앙 정렬
    alignItems: "center", // 수평 중앙 정
    borderRadius: 10,
    padding: 10,
  },
  content: {
    fontSize: 15,
    fontFamily: "Cafe24SsurrondAir",
  },
});

export default MainScreenChat;
