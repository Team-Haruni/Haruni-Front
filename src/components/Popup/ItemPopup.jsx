import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../../styles/color";
import useCustomFonts from "../../hooks/useCustomFonts";
import CustomButton from "../CustomButton";
import ItemSquareLandscape from "../ItemSquare/ItemSquareLandscape";
import ItemSquareStructure from "../ItemSquare/ItemSquareStructure";
import ItemSquareHat from "../ItemSquare/ItemSquareHat";
import CarouselComponent from "../CarouselComponent";
import { useSelector, useDispatch } from "react-redux";
import { sendMessageToUnity } from "../../utils/unityBridge";
import { modifyItem } from "../../api/item";
import * as Sentry from "@sentry/react-native";
import Toast from "react-native-toast-message";
import { loadItem } from "../../api/item";
import {
  toggleSelectLandscape,
  resetLandscapeImages,
} from "../../../redux/slices/landscapeSlice";
import {
  toggleSelectHat,
  resetHatImages,
} from "../../../redux/slices/hatSlice";
import {
  toggleSelectStructure,
  resetStructureImages,
} from "../../../redux/slices/structureSlice";
import {
  setCurrentPlaneIndex,
  resetImages,
} from "../../../redux/slices/planeSlice";

const ItemPopup = ({ visible, onClose, webviewRef }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await loadItem(); // mainApi 호출
        if (res) {
          const itemArray = res;

          const groupedIndexes = itemArray.reduce((acc, item) => {
            const { type, index } = item;

            if (!acc[type]) {
              acc[type] = [];
            }

            acc[type].push(index - 1);
            return acc;
          }, {});

          const itemArray2 = groupedIndexes;

          dispatch(
            toggleSelectLandscape(
              itemArray2.landscape ? itemArray2.landscape : null
            )
          );
          dispatch(
            toggleSelectStructure(
              itemArray2.structure ? itemArray2.structure : null
            )
          );
          dispatch(toggleSelectHat(itemArray2.hat ? itemArray2.hat : null));
          dispatch(
            setCurrentPlaneIndex(itemArray2.plane ? itemArray2.plane[0] + 1 : 0)
          );

          setLandScapeCount(itemArray2.landscape?.length || 0);
          setStructureCount(itemArray2.structure?.length || 0);
          setHatCount(itemArray2.hat?.length || 0);
        }
      } catch (err) {
        Sentry.withScope((scope) => {
          scope.setLevel("error");
          scope.setTag("type", "api");
          scope.setTag("api", "item");
          Sentry.captureException(err);
        });
        console.error("Item 로딩 실패", err);
      }
    };

    fetchItem();
  }, [visible]);

  useEffect(() => {
    dispatch(resetHatImages());
    dispatch(resetLandscapeImages());
    dispatch(resetStructureImages());
    dispatch(resetImages());
  }, [onClose]);

  /*배경*/
  const planeImages = useSelector((state) => state.plane.planeImages);
  const currentPlaneIndex = useSelector((state) => state.plane.currentIndex);

  const [lockStartPlane, setLockStartPlane] = useState(3); //레벨에 따라 다르게 변경

  /*장난감*/
  const structureImages = useSelector(
    (state) => state.structure.structureImages
  );
  const [structureCount, setStructureCount] = useState(0);
  const [lockStartStructure, setLockStartStructure] = useState(5); //레벨에 따라 다르게 변경

  /*모자*/
  const hatImages = useSelector((state) => state.hat.hatImages);
  const [hatCount, setHatCount] = useState(0);
  const [lockStartHat, setLockStartHat] = useState(4); //레벨에 따라 다르게 변경

  /*구조물*/
  const landscapeImages = useSelector(
    (state) => state.landscape.landscapeImages
  );
  const [landScapeCount, setLandScapeCount] = useState(0);
  const [lockStartLandScape, setLockStartLandScape] = useState(12); //레벨에 따라 다르게 변경

  /////////////////////////////////////

  const [menu, setMenu] = useState(0);
  const fontsLoaded = useCustomFonts();

  const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  };

  const onSubmit = async () => {
    try {
      //api 전송
      //unity화면 에다가 추가!
      const items = [];

      //선택된 구조물
      const selectedLandscapeImageIds = landscapeImages
        .filter((image) => image.selected)
        .map((image) => image.id);
      console.log(selectedLandscapeImageIds);
      selectedLandscapeImageIds.forEach((idx) => {
        items.push({ itemType: "landscape", itemIndex: idx });
      });
      const finalSend1 = JSON.stringify(selectedLandscapeImageIds);

      //선택된 장난감
      const selectedStructureImageIds = structureImages
        .filter((image) => image.selected)
        .map((image) => image.id);
      console.log(selectedStructureImageIds);
      selectedStructureImageIds.forEach((idx) => {
        items.push({ itemType: "structure", itemIndex: idx });
      });
      const finalSend2 = JSON.stringify(selectedStructureImageIds);

      //선택된 모자
      const selectedHatImageIds = hatImages
        .filter((image) => image.selected)
        .map((image) => image.id);
      console.log(selectedHatImageIds);
      selectedHatImageIds.forEach((idx) => {
        items.push({ itemType: "hat", itemIndex: idx });
      });
      const finalSend3 = JSON.stringify(selectedHatImageIds);

      let finalSend4 = [];
      //배경
      if (currentPlaneIndex < lockStartPlane) {
        finalSend4 = JSON.stringify([currentPlaneIndex]);
        if (currentPlaneIndex != 0) {
          items.push({ itemType: "plane", itemIndex: currentPlaneIndex });
        }
      }
      // modifyItem 호출
      await modifyItem(items);
      console.log(items);

      sendMessageToUnity(webviewRef, "landscape", { action: finalSend1 }); //유니티에 메시지 보내기
      sendMessageToUnity(webviewRef, "structure", { action: finalSend2 }); //유니티에 메시지 보내기
      sendMessageToUnity(webviewRef, "hat", { action: finalSend3 }); //유니티에 메시지 보내기
      sendMessageToUnity(webviewRef, "plane", { action: finalSend4 }); //유니티에 메시지 보내기

      onClose();
    } catch (err) {
      Sentry.withScope((scope) => {
        scope.setLevel("error");
        scope.setTag("type", "api");
        scope.setTag("api", "modifyItem");
        Sentry.captureException(err);
      });
      console.error("Greeting 로딩 실패", err);
      return Toast.show({
        type: "error",
        text1: "아이템 조건",
        text2: "아이템을 3개 이하로 맞춰주세요!",
        visibilityTime: 1500,
      });
    }
  };

  const categories = ["구조물", "장난감", "모자", "배경"];
  return (
    <Modal
      isVisible={visible} // 모달 표시 여부
      animationIn="slideInUp" // 나타날 때 애니메이션
      animationOut="slideOutDown" // 사라질 때 애니메이션
      animationInTiming={800} // 나타나는 속도 (ms)
      animationOutTiming={400} // 사라지는 속도 (ms)
      backdropOpacity={0} // 배경 어두운 정도
      onBackdropPress={onClose} // 배경 클릭 시 닫기
      useNativeDriver={true} // 성능 최적화
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        zIndex: 0,
      }}
    >
      <Text style={styles.upperText}>
        하루니의 레벨을 올려{"\n"}잠금을 해제하세요
      </Text>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          {categories.map((title, index) => (
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              key={index}
              onPress={() => setMenu(index)}
              style={[
                styles.title,
                index === 3
                  ? {
                      borderRightWidth: 1, // 오른쪽 테두리 두께
                      borderRightColor: Colors.gray100,
                    }
                  : null,
              ]}
            >
              <Text
                style={[
                  styles.titleText,
                  index === menu ? { color: "black" } : null,
                ]}
              >
                {title}
              </Text>
            </TouchableOpacity>
          ))}
          {/* <Text style={styles.number}>{count}/5</Text> */}
        </View>
        {menu === 0 && (
          <ScrollView style={styles.itemContainer}>
            {chunkArray(landscapeImages, 4).map((row, rowIndex) => (
              <View key={rowIndex} style={styles.itemRowContainer}>
                {row.map((image, index) => {
                  const globalIndex = rowIndex * 4 + index;
                  const isLocked = globalIndex >= lockStartLandScape;

                  return (
                    <ItemSquareLandscape
                      image={image}
                      lock={isLocked}
                      index={globalIndex}
                      setCount={setLandScapeCount}
                      count={landScapeCount}
                      key={index}
                    />
                  );
                })}
              </View>
            ))}
          </ScrollView>
        )}

        {menu === 1 && (
          <ScrollView style={styles.itemContainer}>
            {chunkArray(structureImages, 4).map((row, rowIndex) => (
              <View key={rowIndex} style={styles.itemRowContainer}>
                {row.map((image, index) => {
                  const globalIndex = rowIndex * 4 + index;
                  const isLocked = globalIndex >= lockStartStructure;

                  return (
                    <ItemSquareStructure
                      image={image}
                      lock={isLocked}
                      index={globalIndex}
                      setCount={setStructureCount}
                      count={structureCount}
                      key={index}
                    />
                  );
                })}
              </View>
            ))}
          </ScrollView>
        )}
        {menu === 2 && (
          <ScrollView style={styles.itemContainer}>
            {chunkArray(hatImages, 4).map((row, rowIndex) => (
              <View key={rowIndex} style={styles.itemRowContainer}>
                {row.map((image, index) => {
                  const globalIndex = rowIndex * 4 + index;
                  const isLocked = globalIndex >= lockStartHat;

                  return (
                    <ItemSquareHat
                      image={image}
                      lock={isLocked}
                      index={globalIndex}
                      setCount={setHatCount}
                      count={hatCount}
                      key={index}
                    />
                  );
                })}
              </View>
            ))}
          </ScrollView>
        )}

        {menu === 3 && (
          <View style={styles.planeContainer}>
            <CarouselComponent
              planeImages={planeImages}
              lockStartPlane={lockStartPlane}
            />
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          text="뒤로가기"
          onPress={onClose}
          width="45%"
          height="100%"
          textColor={Colors.yellow400}
          backgroundColor={Colors.yellow100}
          borderRadius={20}
        />
        <CustomButton
          text="저장하기"
          onPress={onSubmit}
          width="45%"
          height="100%"
          textColor="white"
          backgroundColor={Colors.pointColor}
          borderRadius={20}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  upperText: {
    height: 50,
    color: "black",
    position: "absolute",
    top: 50,
    textAlign: "center",
    fontFamily: "Cafe24Ssurrondair",
    color: Colors.yellow400,
  },
  titleContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalContent: {
    position: "relative",
    top: -30,
    backgroundColor: "white",
    width: "100%",
    height: "470",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 40,
    alignItems: "start",
    justifyContent: "start",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 90,
    height: 56,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    gap: "10%",
  },

  title: {
    flex: 1,
    borderLeftWidth: 1, // 왼쪽 테두리 두께
    borderLeftColor: Colors.gray100,
    textAlign: "center",
  },
  titleText: {
    textAlign: "center",
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 20,
    color: Colors.gray100,
  },
  number: {
    fontWeight: "400",
    fontSize: 17,
    color: "black",
  },
  planeContainer: {
    position: "relative",
    marginTop: 20,
    display: "flex",
    height: "92%",
    flexDirection: "column",
  },
  itemContainer: {
    marginTop: 20,
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  itemRowContainer: {
    marginBottom: 15,
    display: "flex",
    flex: 1,
    justifyContent: "start",
    flexDirection: "row",
    gap: 12,
  },
});

export default ItemPopup;
