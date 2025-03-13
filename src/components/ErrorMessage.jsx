import React from "react";
import { Text, StyleSheet } from "react-native";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return <Text style={styles.errorMessage}>{message}</Text>;
};

const styles = StyleSheet.create({
  errorMessage: {
    color: "red",
    marginTop: 5,
    fontSize: 12,
  },
});

export default ErrorMessage;
