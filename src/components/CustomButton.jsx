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
  disabled = false,
  fontSize = 16,
}) => {
  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : null}
      style={[
        styles.button,
        {
          width,
          height,
          backgroundColor: disabled ? "#d3d3d3" : backgroundColor,
          borderRadius: borderRadius,
          opacity: disabled ? 0.8 : 1,
        },
      ]}
      disabled={disabled}
    >
      <Text
        style={[
          styles.buttonText,
          { color: disabled ? "#000" : textColor, fontSize: fontSize },
        ]}
      >
        {text}
      </Text>
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
  },
});

export default CustomButton;
