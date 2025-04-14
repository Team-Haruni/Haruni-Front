import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import PopupNavBar from "../../PopupNavBar";
import useCustomFonts from "../../../../hooks/useCustomFonts";
import Colors from "../../../../../styles/color";
import characterData from "../../../../data/characterData";
import { useSelector, useDispatch } from "react-redux";
import { setNickname } from "../../../../../redux/slices/expSlice";
import ConfirmPopup from "../../ConfirmPopup";

const ProfilePopup = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const nicknameInputRef = useRef(null);
  const nicknameFromRedux = useSelector((state) => state.exp.nickname);
  const fontsLoaded = useCustomFonts();
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  const [name, setName] = useState(nicknameFromRedux);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [email, setEmail] = useState("mallang@inu.co.kr");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  useEffect(() => {
    setName(nicknameFromRedux);
  }, [visible]);

  const handleSave = () => {
    setNickname(name);
    // 여기에 저장 API 호출 또는 로직 작성
    console.log("저장됨", { name, email, currentPw, newPw, confirmPw });
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
    <Modal
      animationType="fade"
      presentationStyle="fullScreen"
      visible={visible}
      onRequestClose={onClose}
    >
      <ImageBackground
        source={require("../../../../../assets/background.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.modalOverlay}>
          <PopupNavBar onClose={onClose} text="계정 정보" />

          <View style={styles.modalContent}>
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <View style={styles.profile}>
                <Image
                  resizeMode="resize"
                  source={characterData[characterVersion].url}
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.nicknameRow}>
                <TextInput
                  ref={nicknameInputRef}
                  style={styles.nickname}
                  value={name}
                  onChangeText={(text) => setName(text)}
                  editable={isEditingNickname}
                  textAlign="center"
                />
                <TouchableOpacity
                  onPress={() => {
                    setIsEditingNickname(true); // 3️⃣ 수정 모드 켜기
                    setTimeout(() => {
                      nicknameInputRef.current?.focus(); // 4️⃣ TextInput에 포커스
                    }, 100); // 약간의 delay 주는 게 안전함
                  }}
                >
                  <Text style={styles.editText}>수정</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionLabel}>아이디 변경</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

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

          <View style={{ marginBottom: 20, paddingHorizontal: 20 }}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>저장</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleWithdraw}>
              <Text style={styles.withdrawText}>회원탈퇴</Text>
            </TouchableOpacity>
          </View>

          {/* 회원탈퇴 확인 팝업 */}

          <ConfirmPopup
            isVisible={showConfirmPopup}
            title="탈퇴하시겠어요?"
            contextLines={[
              "탈퇴할 경우 이전 아이템 및 호감도 복원이",
              "불가능 합니다. 진행하시겠습니까?",
            ]}
            onCancel={cancelWithdraw}
            onConfirm={confirmWithdraw}
          />
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
  },
  profile: {
    width: 80,
    height: 80,
    backgroundColor: Colors.myColor,
    borderRadius: 40,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
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
});

export default ProfilePopup;
