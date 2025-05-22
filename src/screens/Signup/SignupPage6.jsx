import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import useCustomFonts from "../../hooks/useCustomFonts";
import Colors from "../../../styles/color";
import CustomButton from "../../components/CustomButton";
import BackIcon from "../../../assets/back-icon.svg";
import characterHobby from "../../data/characterHobby";
import { useSelector, useDispatch } from "react-redux";
import {
  setTraits,
  toggleTrait,
  resetTraits,
} from "../../../redux/slices/hobbySlice";
import AntDesign from "@expo/vector-icons/AntDesign";

const DropdownSection = ({ title, items, selectedTraits, toggleItem }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={{ marginBottom: 20 }}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.dropdownHeader}
      >
        <Text style={styles.dropdownTitle}>{title}</Text>
        <AntDesign
          name={expanded ? "up" : "down"}
          size={16}
          color={Colors.pointColor}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.dropdownContent}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.traitButton,
                selectedTraits.includes(item.text) &&
                  styles.traitButtonSelected,
              ]}
              onPress={() => toggleItem(item.text)}
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
          ))}
        </View>
      )}
    </View>
  );
};

const SignupPage6 = ({ handleNext, handleBack, setCharacterHobby }) => {
  const dispatch = useDispatch();
  const fontsLoaded = useCustomFonts();
  const { traits, selectedTraits } = useSelector((state) => state.hobby);
  const [hobbyErrorMsg, setHobbyErrorMsg] = useState("");

  useEffect(() => {
    const getRandomTraits = (traits, count) => {
      const mbtiTraits = traits.slice(0, 16);
      const otherTraits = traits.slice(16);

      const shuffledOthers = otherTraits
        .sort(() => 0.5 - Math.random())
        .slice(0, count - mbtiTraits.length);

      return [...mbtiTraits, ...shuffledOthers];
    };

    const randomTraits = getRandomTraits(characterHobby, 60);
    dispatch(resetTraits());
    dispatch(setTraits(randomTraits));
  }, [dispatch]);

  const categorizeTraits = (traits) => {
    const categories = {
      MBTI: traits.slice(0, 16),
      성격: traits.slice(16),
    };

    return categories;
  };

  const handleSubmit = () => {
    // MBTI 리스트 (traits의 앞 16개 기준)
    const mbtiTraits = [
      "ENFP",
      "ENTP",
      "ESFP",
      "ESTP",
      "ENFJ",
      "ENTJ",
      "ESFJ",
      "ESTJ",
      "INFP",
      "INTP",
      "ISFP",
      "ISTP",
      "INFJ",
      "INTJ",
      "ISFJ",
      "ISTJ",
    ];

    const selectedMBTIs = selectedTraits.filter((trait) =>
      mbtiTraits.includes(trait)
    );

    if (selectedTraits.length !== 9) {
      setHobbyErrorMsg("성격을 9개 선택해 주세요.");
      console.log(selectedTraits);
      return;
    }

    if (selectedMBTIs.length !== 1) {
      setHobbyErrorMsg("MBTI 항목을 하나만 선택해야 합니다!");
      console.log(selectedTraits);
      return;
    }

    // 조건 만족하면 통과
    setHobbyErrorMsg("");
    setCharacterHobby(selectedTraits);
    console.log(selectedTraits);
    handleNext();
  };

  const categorizedTraits = categorizeTraits(traits);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.svgContainer} onPress={handleBack}>
        <BackIcon />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          캐릭터의 성격을 설정해 주세요{" "}
          <Text style={styles.counter}>({selectedTraits.length}/9)</Text>
        </Text>

        <ScrollView style={styles.dropdownWrapper}>
          {Object.entries(categorizedTraits).map(([category, items]) => (
            <DropdownSection
              key={category}
              title={category}
              items={items}
              selectedTraits={selectedTraits}
              toggleItem={(text) => dispatch(toggleTrait(text))}
            />
          ))}
        </ScrollView>
      </View>

      {hobbyErrorMsg ? (
        <Text style={styles.errorText}>{hobbyErrorMsg}</Text>
      ) : null}
      <View style={styles.buttonContainer}>
        <CustomButton
          text="다음"
          onPress={handleSubmit}
          width="100%"
          height="100%"
          textColor="white"
          backgroundColor={Colors.pointColor}
          borderRadius={12}
          disabled={selectedTraits.length < 9}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    width: "100%",
    marginTop: "10%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 30,
    gap: 20,
  },
  contentContainer: {
    width: "100%",
    height: "85%",
  },
  errorText: {
    color: "red",
    fontSize: 11,
    marginTop: 5,
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: "Cafe24Ssurrondair",
  },
  title: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 20,
    marginBottom: 30,
  },
  counter: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 16,
  },
  svgContainer: {
    position: "absolute",
    top: -25,
    left: 30,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: 60,
    width: "100%",
    bottom: 20,
  },
  dropdownWrapper: {
    width: "95%",
    margin: "auto",
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.myColor,
    borderRadius: 12,
    marginTop: 5,
  },
  dropdownTitle: {
    fontSize: 16,
    fontFamily: "Cafe24Ssurrondair",
  },
  dropdownContent: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 5,
  },
  traitButton: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
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

export default SignupPage6;
