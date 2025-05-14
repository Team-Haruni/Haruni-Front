import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../../styles/color";
import LockIcon from "../../../assets/lock-icon.svg";
import { useDispatch } from "react-redux";
import { toggleSelectLandscape } from "../../../redux/slices/landscapeSlice";
import Toast, { BaseToast } from "react-native-toast-message";

const ItemSquareLandScape = ({ image, lock, index, setCount, count }) => {
  const dispatch = useDispatch();

  // ✅ selected 초기값 설정
  const [selected, setSelected] = useState(() => {
    return image.selected;
  });
  const handlePress = () => {
    if (lock) {
      return Toast.show({
        type: "error",
        text1: "15LV 이상",
        text2: "레벨을 더 올리세요!",
        visibilityTime: 1500,
      });
    } else {
      if (selected) {
        setCount(count - 1);
        setSelected(!selected);
        console.log(index);
        dispatch(toggleSelectLandscape(index));
      } else {
        if (count == 5) {
          return Toast.show({
            type: "error",
            text1: "최대 5개 까지 가능해요",
            text2: "아이템 개수를 초과했어요",
            visibilityTime: 1500,
          });
        } else {
          setCount(count + 1);
          setSelected(!selected);
          console.log(index);
          dispatch(toggleSelectLandscape(index));
        }
      }
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View
        style={[
          styles.container,
          styles.unlockedContainer,
          selected && styles.selectedBorder, // 🔳 선택 시 검은 테두리 강조
        ]}
      >
        <ImageBackground
          source={image.url}
          style={styles.image}
          resizeMode="cover"
        >
          {lock && (
            <View style={styles.lockOverlay}>
              <LockIcon />
            </View>
          )}
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

export default ItemSquareLandScape;

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
    borderColor: "black",
    borderWidth: 3,
    backgroundColor: "white",
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  unlockedContainer: {
    backgroundColor: Colors.gray50,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
