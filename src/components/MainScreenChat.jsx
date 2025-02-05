// LoadingBar.js
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import useCustomFonts from "../hooks/useCustomFonts";
const MainScreenChat = ({ chat }) => {
  const fontsLoaded = useCustomFonts();
  return (
    <View style={styles.container}>
      <Text style={styles.content}>{chat}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 15,
    fontFamily: "Cafe24SsurrondAir",
  },
});

export default MainScreenChat;
