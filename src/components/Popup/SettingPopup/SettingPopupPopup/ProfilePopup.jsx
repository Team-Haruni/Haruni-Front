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
import { getUserApi } from "../../../../api/getUser";

const ProfilePopup = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const nicknameInputRef = useRef(null);
  const name = useSelector((state) => state.exp.userName);
  const emailFromRedux = useSelector((state) => state.exp.userEmail);
  const fontsLoaded = useCustomFonts();
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  //const [name, setName] = useState(nicknameFromRedux);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [email, setEmail] = useState(emailFromRedux);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const [nicknameErrorMessage, setNicknameErrorMessage] = useState("");
  const [currentPwErrorMessage, setCurrentPwErrorMessage] = useState("");
  const [newPwErrorMessage, setNewPwErrorMessage] = useState("");
  const [confirmPwErrorMessage, setConfirmPwErrorMessage] = useState("");
  const [currentPwCorrect, setCurrentPwCorrect] = useState(false);

  const [isPwFocused, setIsPwFocused] = useState(false);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+\\|[\]{};:'",<.>/?])(?=.*[a-z]).{8,15}$/;

  const handleSave = () => {
    let valid = true;

    // 닉네임 검사
    if (!name || name.length < 2) {
      setNicknameErrorMessage("* 닉네임은 2자 이상이어야 합니다.");
      valid = false;
    } else {
      setNicknameErrorMessage("");
    }

    // 비밀번호 검사 (입력했을 때만)
    if (newPw || confirmPw || currentPw) {
      if (!passwordRegex.test(newPw)) {
        setNewPwErrorMessage(
          "* 비밀번호는 8~15자, 대문자, 숫자, 소문자, 특수문자를 모두 포함해야 합니다."
        );
        valid = false;
      } else {
        setNewPwErrorMessage("");
      }

      if (newPw !== confirmPw) {
        setConfirmPwErrorMessage("* 비밀번호가 일치하지 않습니다.");
        valid = false;
      } else {
        setConfirmPwErrorMessage("");
      }
    }

    if (!valid) return;

    //dispatch(setNickname(name));
    // 여기에 저장 API 호출 또는 로직 작성
    console.log("저장됨", { name, currentPw, newPw, confirmPw });
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

  const handleCheckPassword = () => {
    // 예시: 길이로만 검사, 실제론 API 요청
    if (currentPw.length >= 6) {
      setCurrentPwCorrect(true);
      setCurrentPwErrorMessage("");
    } else {
      setCurrentPwCorrect(false);
      setCurrentPwErrorMessage("비밀번호가 올바르지 않습니다.");
    }
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
            {!isPwFocused && (
              <>
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
                      //onChangeText={(text) => setName(text)}
                      // editable={isEditingNickname}
                      editable={false}
                      textAlign="center"
                    />
                    {/* <TouchableOpacity
                      onPress={() => {
                        setIsEditingNickname(true);
                        setTimeout(() => {
                          nicknameInputRef.current?.focus();
                        }, 100);
                      }}
                    >
                      <Text style={styles.editText}>수정</Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
                {nicknameErrorMessage ? (
                  <Text style={styles.errorText}>{nicknameErrorMessage}</Text>
                ) : null}

                <Text style={styles.sectionLabel}>아이디</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  editable={false}
                  onChangeText={setEmail}
                />
              </>
            )}

            <Text style={styles.sectionLabel}>비밀번호 변경</Text>
            <Text style={styles.sectionLabel_small}>현재 비밀번호</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.inputWithButton}
                placeholder="8~12자리 숫자 및 영문을 입력하세요"
                placeholderTextColor="#BEAE81"
                secureTextEntry
                value={currentPw}
                onChangeText={setCurrentPw}
                onFocus={() => setIsPwFocused(true)}
                onBlur={() => setIsPwFocused(false)}
              />
              <TouchableOpacity
                style={styles.checkButton}
                onPress={handleCheckPassword}
              >
                <Text style={styles.checkButtonText}>검사</Text>
              </TouchableOpacity>
            </View>
            {currentPwErrorMessage ? (
              <Text style={styles.errorText}>{currentPwErrorMessage}</Text>
            ) : null}

            {currentPwCorrect && (
              <>
                <Text style={styles.sectionLabel_small}>새 비밀번호</Text>
                <TextInput
                  style={styles.input}
                  placeholder="8~12자리 숫자 및 영문을 입력하세요"
                  placeholderTextColor="#BEAE81"
                  secureTextEntry
                  value={newPw}
                  onChangeText={setNewPw}
                  onFocus={() => setIsPwFocused(true)}
                  onBlur={() => setIsPwFocused(false)}
                />
                {newPwErrorMessage ? (
                  <Text style={styles.errorText}>{newPwErrorMessage}</Text>
                ) : null}

                <TextInput
                  style={styles.input}
                  placeholder="한번 더 입력해주세요"
                  placeholderTextColor="#BEAE81"
                  secureTextEntry
                  value={confirmPw}
                  onChangeText={setConfirmPw}
                  onFocus={() => setIsPwFocused(true)}
                  onBlur={() => setIsPwFocused(false)}
                />
                {confirmPwErrorMessage ? (
                  <Text style={styles.errorText}>{confirmPwErrorMessage}</Text>
                ) : null}
              </>
            )}
          </View>

          <View style={{ marginBottom: 20, paddingHorizontal: 20 }}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>저장</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={handleWithdraw}>
              <Text style={styles.withdrawText}>회원탈퇴</Text>
            </TouchableOpacity> */}
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
    color: Colors.yellow400,
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
  errorText: {
    color: "red",
    fontSize: 11,
    marginTop: 5,
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: "Cafe24Ssurrondair",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkButton: {
    backgroundColor: Colors.yellow400,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 8,
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Cafe24Ssurrondair",
  },
  inputWithButton: {
    flex: 1,
    backgroundColor: "#FFFBF0",
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#BEAE81",
    fontFamily: "Cafe24Ssurrondair",
  },
});

export default ProfilePopup;
