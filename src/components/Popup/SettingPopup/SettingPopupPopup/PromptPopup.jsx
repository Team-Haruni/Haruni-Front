import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import Colors from "../../../../../styles/color";
import PopupNavBar from "../../PoupNavBar";
import useCustomFonts from "../../../../hooks/useCustomFonts";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleTrait,  
  resetTraits, // 프롬프트 초기화 -> api 연동 시 수정
  setTraits, // 프롬프트 초기화 -> api 연동 시 수정
} from "../../../../../redux/slices/hobbySlice";
import characterHobby from "../../../../data/characterHobby";

const PromptPopup = ({ visible, onClose }) => {
  const fontsLoaded = useCustomFonts();
  const dispatch = useDispatch();
  const { traits, selectedTraits } = useSelector((state) => state.hobby);

  if (!fontsLoaded) return null;

  const handleSave = () => {
    onClose(selectedTraits);
  };

  // 프롬프트 초기화 코드 - api 연동할때 수정
  useEffect(() => {
    if (visible) {
      const getRandomTraits = (traits, count) => {
        const mbtiTraits = traits.slice(0, 16);
        const otherTraits = traits.slice(16);
        const shuffledOthers = otherTraits
          .sort(() => 0.5 - Math.random())
          .slice(0, count - mbtiTraits.length);
        return [...mbtiTraits, ...shuffledOthers].sort(() => 0.5 - Math.random());
      };
  
      dispatch(resetTraits());
      dispatch(setTraits(getRandomTraits(characterHobby, 60)));
    }
  }, [visible]);  

  return (
    <Modal animationType="fade" presentationStyle="fullScreen" visible={visible}>
      <ImageBackground
        source={require("../../../../../assets/background.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={{paddingHorizontal: 20}}>
          <PopupNavBar text="프롬프트" onClose={() => onClose(selectedTraits)} />
        </View>

        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>
              캐릭터의 성격을 설정해 주세요{" "}
              <Text style={styles.counter}>({selectedTraits.length}/9)</Text>
            </Text>
            <View style={styles.promptContainer}>
              <FlatList
                style={styles.listContainer}
                data={traits}
                numColumns={4}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.traitButton,
                      selectedTraits.includes(item.text) &&
                        styles.traitButtonSelected,
                    ]}
                    onPress={() => dispatch(toggleTrait(item.text))}
                  >
                    <Text
                      style={[
                        styles.traitText,
                        selectedTraits.includes(item.text) &&
                          styles.traitTextSelected,
                      ]}
                    >
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                selectedTraits.length < 9 && { opacity: 0.4 },
              ]}
              onPress={handleSave}
              disabled={selectedTraits.length < 9}
            >
              <Text style={styles.saveButtonText}>저장하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    width: "100%",
    height: "100%",
    justifyContent: "start",
    alignItems: "center",
    paddingVertical: 30,
  },
  promptContainer: {
    width: "100%",
    height: "85%",
    justifyContent: "start",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    },
  listContainer: {
    height: "80%",
    width: "100%",
  },
  contentContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 20,
    marginBottom: 20,
  },
  counter: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 17,
  },
  buttonRow: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 20,
  },
  saveButton: {
    backgroundColor: Colors.pointColor,
    width: "100%",
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Cafe24Ssurrondair",
  },
  traitButton: {
    flex: 1,
    margin: 5,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.pointColor,
    borderRadius: 8,
  },
  traitButtonSelected: {
    backgroundColor: Colors.pointColor,
  },
  traitText: {
    fontSize: 14,
    color: Colors.pointColor,
  },
  traitTextSelected: {
    color: "white",
  },
});

export default PromptPopup;
