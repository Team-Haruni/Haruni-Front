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
import Toast from "react-native-toast-message";

const ItemSquare = ({ image, lock, index, setCount, count }) => {
  const dispatch = useDispatch();

  //이건 로컬 seleted로 redux랑은 별개
  const [selected, setSelected] = useState(image.selected);
  const handlePress = () => {
    if (lock) {
      return Toast.show({
        type: "error",
        text1: "레벨이 낮습니다",
      });
    } else {
      if (selected) {
        setCount(count - 1);
        setSelected(!selected);
        dispatch(toggleSelect(index));
      } else {
        if (count == 5) {
          return Toast.show({
            type: "error",
            text1: "아이템 개수를 5개 이하로 설정하세요!",
          });
        } else {
          setCount(count + 1);
          setSelected(!selected);
          dispatch(toggleSelect(index));
        }
      }
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
});
