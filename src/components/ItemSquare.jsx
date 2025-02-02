import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../styles/color";
import LockIcon from "../../assets/lock-icon.svg";
import { useDispatch } from "react-redux";
import { toggleSelect } from "../../redux/slices/landscapeSlice";

const ItemSquare = ({ image, lock, index }) => {
  const dispatch = useDispatch();

  //이건 로컬 seleted로 redux랑은 별개
  const [selected, setSelected] = useState(image.selected);
  const [message, setMessage] = useState("");
  const handlePress = () => {
    if (lock) {
      alert("레벨을 더 올리세요!");
      setTimeout(() => setMessage(""), 2000); // 2초 후 메시지 사라짐
    } else {
      setSelected(!selected);
      dispatch(toggleSelect(index));
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View
        style={[
          styles.container,
          lock ? styles.lockedContainer : styles.unlockedContainer,
          selected && styles.selectedBorder, // 🔳 선택 시 검은 테두리 강조
        ]}
      >
        {lock ? (
          <LockIcon width={30} height={30} />
        ) : (
          <ImageBackground
            source={image.url}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
      {message ? <Text style={styles.lockMessage}>{message}</Text> : null}
    </TouchableOpacity>
  );
};

export default ItemSquare;

const styles = StyleSheet.create({
  container: {
    width: 65,
    height: 65,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  selectedBorder: {
    borderColor: Colors.gray700,
    borderWidth: 3,
  },
  lockedContainer: {
    backgroundColor: "#AA9A6D",
  },
  unlockedContainer: {
    backgroundColor: Colors.gray50,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  lockMessage: {
    marginTop: 5,
    color: "red",
    fontSize: 12,
    textAlign: "center",
  },
});
