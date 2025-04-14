import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import PopupNavBar from "../PopupNavBar";
import useCustomFonts from "../../../hooks/useCustomFonts";
import Colors from "../../../../styles/color";
import RightArrowIcon from "../../../../assets/rightArrow-icon.svg";
import ProfilePopup from "./SettingPopupPopup/ProfilePopup";
import PromptPopup from "./SettingPopupPopup/PromptPopup";
import NoticePopup from "./SettingPopupPopup/NoticePopup";
import RequestPopup from "./SettingPopupPopup/RequestPoup";
import ConfirmPopup from "../ConfirmPopup";

const SettingPopup = ({ visible, onClose, navigation }) => {
  const fontsLoaded = useCustomFonts();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [promptModalVisible, setPromptModalVisible] = useState(false);
  const [noticeModalVisible, setNoticeModalVisible] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  return (
    <Modal
      animationType="none"
      presentationStyle="fullScreen"
      visible={visible}
      onRequestClose={onClose} // Android 뒤로 가기 버튼 대응
    >
      <ImageBackground
        source={require("../../../../assets/background.png")} // 배경 이미지 경로
        style={{ flex: 1 }} //스타일을 적용할 배경
        resizeMode="cover" // 이미지 크기 조정 방법
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <PopupNavBar onClose={onClose} text="프로필 편집" />
            <Text
              style={{
                marginTop: "5%",
                color: Colors.yellow400,
                fontSize: 12,
                fontFamily: "Cafe24Ssurrondair",
                marginBottom: "3%",
              }}
            >
              내 정보 수정
            </Text>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => setProfileModalVisible(true)}
            >
              <Text style={styles.listText}>계정 정보</Text>
              <RightArrowIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => setLogoutModalVisible(true)}
            >
              <Text style={styles.listText}>로그아웃</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => setPromptModalVisible(true)}
            >
              <Text style={styles.listText}>성격 재설정</Text>
              <RightArrowIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => setNoticeModalVisible(true)}
            >
              <Text style={styles.listText}>알림</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => setRequestModalVisible(true)}
            >
              <Text style={styles.listText}>문의하기</Text>
              <RightArrowIcon />
            </TouchableOpacity>
          </View>
        </View>
        {/*프로필 팝업 컴포넌트 */}
        <ProfilePopup
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
        />
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
        {/*프롬프트 팝업 컴포넌트 */}
        <PromptPopup
          visible={promptModalVisible}
          onClose={() => setPromptModalVisible(false)}
        />
        {/*알림 팝업 컴포넌트 */}
        <NoticePopup
          visible={noticeModalVisible}
          onClose={() => setNoticeModalVisible(false)}
        />
        {/*문의 팝업 컴포넌트 */}
        <RequestPopup
          visible={requestModalVisible}
          onClose={() => setRequestModalVisible(false)}
        />
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listItem: {
    height: 56,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: Colors.mainYellow,
  },
  listText: {
    color: Colors.yellow700,
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 14,
  },
});

export default SettingPopup;
