import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import characterData from "../../data/characterData";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";

const { width } = Dimensions.get("window");

const ListPopup = ({ visible, onClose, navigation }) => {
  const fontsLoaded = useCustomFonts();
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  const characterLevel = useSelector((state) => state.exp.level);
  const [nickname] = useState("하루니");
  const { selectedTraits } = useSelector((state) => state.hobby);
  return (
    <Modal
      isVisible={visible}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      backdropOpacity={0.3}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="left"
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <View style={styles.imgContainerOut}>
          <View style={styles.imgContainer}>
            <Image
              resizeMode="resize"
              source={characterData[characterVersion].url}
              style={styles.profileImage}
            />
          </View>
        </View>
        <Text style={styles.nickname}>{nickname}</Text>
        <Text style={styles.nickname}>LV{characterLevel}</Text>
        <View style={styles.contentContainer}>
          <Text style={styles.traitsTitle}>성격</Text>
          <FlatList
            style={styles.listContainer}
            data={selectedTraits}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.traitItem}>{item}</Text>
            )}
          />
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Version 1.0.0</Text>
            <TouchableOpacity onPress={() => navigation.replace("Login")}>
              <Text style={styles.footerText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  modalContent: {
    width: width * 0.75,
    height: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.yellow100,
    justifyContent: "start",
    alignItems: "center",
  },
  imgContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.gray200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 0,
    backgroundColor: "white",
  },
  imgContainerOut: {
    marginTop: 50,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.gray200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 0,
  },
  nickname: {
    marginTop: 10,
    fontSize: 15,
    color: Colors.gray300,
    fontFamily: "Cafe24Ssurrond",
  },
  contentContainer: {
    position: "absolute",
    bottom: -5,
    height: "70%",
    backgroundColor: Colors.mainYellow,
    borderRadius: 20,
    width: "100%",
    padding: 10,
  },
  traitsTitle: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: "Cafe24Ssurrondair",
    color: Colors.gray700,
    marginBottom: 10,

    textAlign: "center",
  },
  traitItem: {
    flex: 1,
    margin: 5,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    color: "white",

    fontSize: 13,
    textAlign: "center",
    borderColor: Colors.pointColor,
    borderRadius: 8,
    backgroundColor: Colors.pointColor,
  },
  profileImage: {
    width: 90,
    height: 90,
  },
  footerContainer: {
    padding: 5,
    flexDirection: "row",

    justifyContent: "space-between",
  },
  listContainer: {
    height: "80%",
    width: "100%",
  },
  footerText: {
    fontFamily: "Cafe24Ssurrondair",
  },
});

export default ListPopup;
