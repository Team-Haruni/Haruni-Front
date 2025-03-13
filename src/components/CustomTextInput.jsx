import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import Colors from "../../styles/color";

const CustomTextInput = ({ placeholder, value, onChangeText, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[
        styles.input,
        isFocused || value ? styles.activeInput : styles.inactiveInput,
      ]}
      placeholder={placeholder}
      placeholderTextColor={Colors.gray200}
      value={value}
      onChangeText={onChangeText}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 40,
    paddingLeft: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  inactiveInput: {
    backgroundColor: Colors.gray50,
    color: Colors.gray200,
    borderColor: Colors.gray50,
  },
  activeInput: {
    backgroundColor: "white",
    color: "#000",
    borderColor: Colors.gray200,
  },
});

export default CustomTextInput;
