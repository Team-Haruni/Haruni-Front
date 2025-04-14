import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-native-modal";
import characterData from "../../data/characterData";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";
import ConfirmPopup from "./ConfirmPopup";
import { setSelectedTraits } from "../../../redux/slices/hobbySlice";

const { width } = Dimensions.get("window");

const ListPopup = ({ visible, onClose, navigation }) => {
  const dispatch = useDispatch();
  const fontsLoaded = useCustomFonts();
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  const characterLevel = useSelector((state) => state.exp.level);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [nickname] = useState("하루니");
  useEffect(() => {
    //추후제거
    dispatch(
      setSelectedTraits([
        "infp",
        "infp",
        "infp",
        "infp",
        "infp",
        "infp",
        "infp",
        "sdfsdf",
        "infp",
      ])
    );
  }, []);
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
        <Text style={styles.levelText}>LV{characterLevel}</Text>
        <View style={styles.contentContainer}>
          <Text style={styles.traitsTitle}>성격</Text>
          <View
            style={{
              height: "auto",
              backgroundColor: Colors.mainYellow,
              borderRadius: 20,
              padding: 10,
              marginTop: 5,
            }}
          >
            <FlatList
              data={selectedTraits}
              numColumns={3}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.traitItem}>{item}</Text>
              )}
            />
          </View>
          <Text style={styles.traitsTitle}>아이템</Text>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.mainYellow,
              borderRadius: 20,
              padding: 10,
              marginVertical: 5,
              marginBottom: 20,
            }}
          >
            <Text>아이템들 추후 백엔드 아이템 조회하는거 사용</Text>
          </View>
          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={() => setLogoutModalVisible(true)}>
              <Text style={styles.footerTextLogout}>Log out</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>V1.0.0</Text>
          </View>
        </View>
      </View>
      {/*로그아웃 팝업 컴포넌트 */}
      <ConfirmPopup
        isVisible={logoutModalVisible}
        title="로그아웃 하시겠어요?"
        contextLines={[
          "로그아웃할 경우 처음 화면으로 돌아갑니다! 진행하시겠습니까?",
        ]}
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={() => {
          setLogoutModalVisible(false);
          navigation.replace("Login");
        }}
      />
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
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 0,
  },
  imgContainerOut: {
    marginTop: 50,
    width: 100,
    height: 100,

    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 0,
  },
  nickname: {
    marginTop: 10,
    fontSize: 20,
    color: "black",
    fontFamily: "Cafe24Ssurrond",
  },
  levelText: {
    marginTop: 6,
    fontSize: 15,
    color: "black",
    fontFamily: "Cafe24Ssurrond",
  },
  contentContainer: {
    position: "absolute",
    bottom: -5,
    height: "75%",
    backgroundColor: Colors.yellow100,
    borderRadius: 20,
    width: "100%",
    padding: 10,
  },
  traitsTitle: {
    borderColor: Colors.mainYellow,
    borderTopWidth: 1,
    marginTop: 15,
    paddingTop: 10,
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
    width: 120,
    height: 120,
  },
  footerContainer: {
    padding: 5,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    height: "100%",
    fontFamily: "Cafe24Ssurrondair",
  },
  footerTextLogout: {
    fontSize: 15,
    height: "100%",
    fontFamily: "Cafe24Ssurrond",
  },
});

export default ListPopup;
