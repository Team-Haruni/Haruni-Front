import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({
  text,
  onPress,
  width,
  height,
  textColor,
  backgroundColor,
  borderRadius,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { width, height, backgroundColor, borderRadius: borderRadius },
      ]}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 16,
  },
});

export default CustomButton;
