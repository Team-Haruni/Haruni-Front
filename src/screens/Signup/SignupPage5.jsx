import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import useCustomFonts from "../../hooks/useCustomFonts";
import Colors from "../../../styles/color";
import CustomButton from "../../components/CustomButton";
import BackIcon from "../../../assets/back-icon.svg";
import characterHobby from "../../data/characterHobby";

const getRandomTraits = (traits, count) => {
  const mbtiTraits = traits.slice(0, 16);
  const otherTraits = traits.slice(16);

  const shuffledOthers = otherTraits
    .sort(() => 0.5 - Math.random())
    .slice(0, count - mbtiTraits.length);
  return [...mbtiTraits, ...shuffledOthers].sort(() => 0.5 - Math.random());
};

const SignupPage5 = ({ handleNext, handleBack, setCharacterHobby }) => {
  const fontsLoaded = useCustomFonts();
  const [traits, setTraits] = useState([]);
  const [selectedTraits, setSelectedTraits] = useState([]);

  useEffect(() => {
    setSelectedTraits([]);
    const randomTraits = getRandomTraits(characterHobby, 60);
    setTraits(randomTraits);
  }, []);

  const toggleTrait = (trait) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== trait));
    } else if (selectedTraits.length < 7) {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  const handleSubmit = () => {
    if (selectedTraits.length == 7) {
      setCharacterHobby(selectedTraits);
      handleNext();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.svgContainer} onPress={handleBack}>
        <BackIcon />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          캐릭터의 성격을 설정해 주세요{" "}
          <Text style={styles.counter}>({selectedTraits.length}/7)</Text>
        </Text>
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
              onPress={() => toggleTrait(item.text)}
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
      <View style={styles.buttonContainer}>
        <CustomButton
          text="다음"
          onPress={handleSubmit}
          width="100%"
          height="100%"
          textColor="white"
          backgroundColor={Colors.pointColor}
          borderRadius={12}
          disabled={selectedTraits.length < 7}
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
    height: "100%",
    justifyContent: "start",
    alignItems: "center",
    paddingVertical: 30,
    gap: 20,
  },
  listContainer: {
    height: "80%",
    width: " 100%",
  },
  contentContainer: {
    width: "100%",
    height: "auto",
    justifyContent: "start",
    alignItems: "start",
  },
  counter: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 17,
  },
  title: {
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 20,
    marginBottom: 20,
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

export default SignupPage5;
