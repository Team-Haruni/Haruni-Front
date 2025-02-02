import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import BackIcon from "../../../assets/back-icon.svg";
import useCustomFonts from "../../hooks/useCustomFonts";
import Colors from "../../../styles/color";

const PopupNavBar = ({ onClose, text }) => {
  const fontsLoaded = useCustomFonts();
  return (
    <View style={styles.modalNavBar}>
      <TouchableOpacity onPress={onClose}>
        <BackIcon />
      </TouchableOpacity>
      <Text style={styles.navText}>{text}</Text>
      <TouchableOpacity style={{ opacity: 0 }}>
        <BackIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalNavBar: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "68",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navText: {
    color: Colors.yellow400,
    fontSize: 18,
    fontFamily: "Cafe24Ssurrondair",
  },
});
export default PopupNavBar;
