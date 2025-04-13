import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import PopupNavBar from "../../PoupNavBar";
import useCustomFonts from "../../../../hooks/useCustomFonts";
import Colors from "../../../../../styles/color";

const ProfilePopup = ({ visible, onClose }) => {
  const fontsLoaded = useCustomFonts();

  const [nickname, setNickname] = useState("닉네임");
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [email, setEmail] = useState("mallang@inu.co.kr");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleSave = () => {
    // 여기에 저장 API 호출 또는 로직 작성
    console.log("저장됨", { nickname, email, currentPw, newPw, confirmPw });
    onClose();
  };

  const handleWithdraw = () => {
    setShowConfirmPopup(true);
  };

  const confirmWithdraw = () => {
    setShowConfirmPopup(false);
    // 회원 탈퇴 로직
    console.log("회원탈퇴 완료");
    onClose();
  };

  const cancelWithdraw = () => {
    setShowConfirmPopup(false);
  };

  if (!fontsLoaded) return null;

  return (
    <Modal animationType="fade" presentationStyle="fullScreen" visible={visible} onRequestClose={onClose}>
      <ImageBackground source={require("../../../../../assets/background.png")} style={{ flex: 1 }} resizeMode="cover">
        <View style={styles.modalOverlay}>
        <PopupNavBar onClose={onClose} text="계정 정보" />

          <View style={styles.modalContent}>
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <View style={styles.profile} />
              <View style={styles.nicknameRow}>
                <TextInput
                    style={styles.nickname}
                    value={nickname}
                    onChangeText={setNickname}
                    editable={isEditingNickname}
                    textAlign="center"
                  />
                  <TouchableOpacity onPress={() => setIsEditingNickname(true)}>
                    <Text style={styles.editText}>수정</Text>
                  </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.sectionLabel}>아이디 변경</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />

            <Text style={styles.sectionLabel}>비밀번호 변경</Text>
            <Text style={styles.sectionLabel_small}>현재 비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="8~12자리 숫자 및 영문을 입력하세요"
              placeholderTextColor="#BEAE81"
              secureTextEntry
              value={currentPw}
              onChangeText={setCurrentPw}
            />            
            <Text style={styles.sectionLabel_small}>새 비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="8~12자리 숫자 및 영문을 입력하세요"
              placeholderTextColor="#BEAE81"
              secureTextEntry
              value={newPw}
              onChangeText={setNewPw}
            />
            <TextInput
              style={styles.input}
              placeholder="한번 더 입력해주세요"
              placeholderTextColor="#BEAE81"
              secureTextEntry
              value={confirmPw}
              onChangeText={setConfirmPw}
            />
          </View>

          <View style={{marginBottom: 20, paddingHorizontal: 20}}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>저장</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleWithdraw}>
              <Text style={styles.withdrawText}>회원탈퇴</Text>
            </TouchableOpacity>
          </View>


          {/* 회원탈퇴 확인 팝업 */}
          {showConfirmPopup && (
            <View style={styles.popupOverlay}>
              <View style={styles.popup}>
                <Text style={styles.popupTitle}>탈퇴하시겠어요?</Text>
                <Text style={styles.popupcontext}>탈퇴할 경우 이전 아이템 및 호감도 복원이</Text>
                <Text style={styles.popupcontext}>불가능 합니다. 진행하시겠습니까?</Text>
                <View style={styles.popupButtons}>
                  <TouchableOpacity style={styles.popupButtonDetail} onPress={cancelWithdraw}>
                    <Text style={styles.cancelText}>취소</Text>
                  </TouchableOpacity>
                  <View style={styles.buttonDivider} />
                  <TouchableOpacity style={styles.popupButtonDetail} onPress={confirmWithdraw}>
                    <Text style={styles.cancelText}>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    flex: 1,
    paddingTop: 80,
  },
  profile: {
    width: 64,
    height: 64,
    backgroundColor: "#eee",
    borderRadius: 32,
  },
  nicknameRow: {
    backgroundColor: "#FFFBF0",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 46,
    top: 20,
    overflow: "hidden",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  nickname: {
    color: "#030303",
    fontSize: 18,
    fontFamily: "Cafe24Ssurrondair",
    flex: 1,
  },
  editText: {
    color: Colors.yellow400,
    fontSize: 14,
    fontFamily: "Cafe24Ssurrondair",
  },
  sectionLabel: {
    fontSize: 15,
    fontFamily: "Cafe24Ssurrondair",
    marginTop: 16,
    marginBottom: 4,
  },
  sectionLabel_small: {
    fontSize: 12,
    fontFamily: "Cafe24Ssurrondair",
    color: "#030303",
    marginTop: 18,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFBF0",
    width: "100%",
    height: 46,
    overflow: "hidden",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    fontSize: 15,
    color: "#BEAE81",
    fontFamily: "Cafe24Ssurrondair",
  },
  saveButton: {
    backgroundColor: "#FFC045",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: {
    fontSize: 16,
    fontFamily: "Cafe24Ssurrondair",
    color: "#fff",
  },
  withdrawText: {
    marginTop: 16,
    textAlign: "center",
    color: "red",
    fontSize: 14,
    fontFamily: "Cafe24Ssurrondair",
    textDecorationLine: "underline", 
  },
  popupOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: "#FFFBF0",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 14,
    fontFamily: "Cafe24Ssurrondair",
    color: Colors.yellow700, 
    marginTop: 15,
    marginBottom: 18,
  },
  popupcontext: {
    paddingHorizontal: 18,
    fontSize: 14,
    fontFamily: "Cafe24Ssurrondair",
    color: Colors.yellow400,
  },
  popupButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
    marginBottom: -8,
  },
  popupButtonDetail: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
    alignItems: "center",
  },
  buttonDivider: {
    width: 1,
    marginVertical: 13,
    backgroundColor: Colors.yellow400,
  },
  cancelText: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 16,
    color: Colors.yellow400,
  },  
});

export default ProfilePopup;
