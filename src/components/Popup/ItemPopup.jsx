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
import { setCurrentPlaneIndex } from "../../../redux/slices/planeSlice";
import { resetImages } from "../../../redux/slices/landscapeSlice";
import { sendMessageToUnity } from "../../utils/unityBridge";
import { itemPopupApi } from "../../api/itemPopup"; // API 함수 가져오기

const ItemPopup = ({ visible, onClose, webviewRef }) => {
  const dispatch = useDispatch();

  /*배경*/
  const planeImages = useSelector((state) => state.plane.planeImages);
  const currentPlaneIndex = useSelector((state) => state.plane.currentIndex);
  useEffect(() => {
    for (let i = 0; i < planeImages.length; i++) {
      if (planeImages[i].selected) {
        dispatch(setCurrentPlaneIndex(i));
        break;
      }
    }
  }, []);

  const [lockStartPlane, setLockStartPlane] = useState(3); //레벨에 따라 다르게 변경

  /*장난감*/
  const structureImages = useSelector(
    (state) => state.structure.structureImages
  );
  const initialStructureCount = structureImages.filter(
    (image) => image.selected
  ).length;
  const [structureCount, setStructureCount] = useState(initialStructureCount);
  const [lockStartStructure, setLockStartStructure] = useState(6); //레벨에 따라 다르게 변경

  /*모자*/
  const hatImages = useSelector((state) => state.hat.hatImages);
  const initialHatCount = hatImages.filter((image) => image.selected).length;
  const [hatCount, setHatCount] = useState(initialHatCount);
  const [lockStartHat, setLockStartHat] = useState(3); //레벨에 따라 다르게 변경

  /*구조물*/
  const landscapeImages = useSelector(
    (state) => state.landscape.landscapeImages
  );
  const initialLandScapeCount = landscapeImages.filter(
    (image) => image.selected
  ).length;
  const [landScapeCount, setLandScapeCount] = useState(initialLandScapeCount);
  const [lockStartLandScape, setLockStartLandScape] = useState(12); //레벨에 따라 다르게 변경

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  // 에러 상태 추가
  const [error, setError] = useState(null);

  /////////////////////////////////////

  const [menu, setMenu] = useState(0);
  const fontsLoaded = useCustomFonts();

  // API에서 선택된 아이템을 가져오는 함수
  const fetchSelectedItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await itemPopupApi({});
      
      if (response && response.data) {
        console.log("API 응답 데이터:", response.data);
        
        // 모든 아이템의 선택 상태를 초기화 (모두 선택 해제)
        // 각 타입별 선택 상태를 초기화하는 액션 필요 (필요시 구현)
        
        // API 응답을 기반으로 선택된 아이템 상태 업데이트
        response.data.forEach(item => {
          if (item.type === "hat") {
            // hatSlice의 toggleSelect 액션 사용
            // index 값이 hat 이미지 배열의 인덱스인지 확인 필요
            const hatIndex = hatImages.findIndex(hat => hat.id === item.index);
            if (hatIndex !== -1) {
              // 모자의 선택 상태를 활성화하는 액션 디스패치
              dispatch({ type: 'hat/toggleSelect', payload: hatIndex });
              
              // 선택된 모자 개수 업데이트
              setHatCount(prev => prev + 1);
            }
          } else if (item.type === "landscape") {
            // landscapeSlice의 toggleSelect 액션 사용
            const landscapeIndex = landscapeImages.findIndex(landscape => landscape.id === item.index);
            if (landscapeIndex !== -1) {
              // 구조물의 선택 상태를 활성화하는 액션 디스패치
              dispatch({ type: 'landscape/toggleSelect', payload: landscapeIndex });
              
              // 선택된 구조물 개수 업데이트
              setLandScapeCount(prev => prev + 1);
            }
          } else if (item.type === "structure") {
            // structureSlice의 toggleSelect 액션 사용
            const structureIndex = structureImages.findIndex(structure => structure.id === item.index);
            if (structureIndex !== -1) {
              // 장난감의 선택 상태를 활성화하는 액션 디스패치
              dispatch({ type: 'structure/toggleSelect', payload: structureIndex });
              
              // 선택된 장난감 개수 업데이트
              setStructureCount(prev => prev + 1);
            }
          } else if (item.type === "plane") {
            // 배경 선택 상태를 업데이트
            dispatch(setCurrentPlaneIndex(item.index));
          }
        });
        
        console.log("아이템 선택 상태 업데이트 완료");
      }
    } catch (err) {
      console.error("선택된 아이템 가져오기 오류:", err);
      console.error("오류 상세:", err.response ? err.response.data : err.message);
      setError(err.message || "선택된 아이템을 불러오는데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setLandScapeCount(initialLandScapeCount);
    setHatCount(initialHatCount);
    setStructureCount(initialStructureCount);

    // 팝업이 표시될 때 선택된 아이템 가져오기
    if (visible) {
      fetchSelectedItems();
    }
    
    //나중에 서버 연결하면 할꺼
    //dispatch(resetImages());
  }, [visible]);

  const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      
      //선택된 구조물
      const selectedLandscapeImageIds = landscapeImages
        .filter((image) => image.selected)
        .map((image) => image.id);
      console.log(selectedLandscapeImageIds);
      const finalSend1 = JSON.stringify(selectedLandscapeImageIds);
      sendMessageToUnity(webviewRef, "landscape", { action: finalSend1 }); //유니티에 메시지 보내기

      //선택된 장난감
      const selectedStructureImageIds = structureImages
        .filter((image) => image.selected)
        .map((image) => image.id);
      console.log(selectedStructureImageIds);
      const finalSend2 = JSON.stringify(selectedStructureImageIds);
      sendMessageToUnity(webviewRef, "structure", { action: finalSend2 }); //유니티에 메시지 보내기

      //선택된 모자
      const selectedHatImageIds = hatImages
        .filter((image) => image.selected)
        .map((image) => image.id);
      console.log(selectedHatImageIds);
      const finalSend3 = JSON.stringify(selectedHatImageIds);
      sendMessageToUnity(webviewRef, "hat", { action: finalSend3 }); //유니티에 메시지 보내기

      //배경
      if (currentPlaneIndex < lockStartPlane) {
        const finalSend4 = JSON.stringify([currentPlaneIndex]);
        sendMessageToUnity(webviewRef, "plane", { action: finalSend4 }); //유니티에 메시지 보내기
      }

      // 필요한 경우 여기에서 서버에 데이터를 저장할 수 있습니다
      // 예시:
      // const saveData = {
      //   selectedItems: [
      //     { type: "hat", indices: selectedHatImageIds },
      //     { type: "landscape", indices: selectedLandscapeImageIds },
      //     { type: "structure", indices: selectedStructureImageIds },
      //     { type: "plane", index: currentPlaneIndex }
      //   ]
      // };
      // await saveItemsApi(saveData);
      
      onClose();
    } catch (err) {
      console.error("아이템 저장 오류:", err);
      setError(err.message || "아이템 저장에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ["구조물", "장난감", "모자", "배경"];
  return (
    <Modal
      isVisible={visible} // 모달 표시 여부
      animationIn="slideInUp" // 나타날 때 애니메이션
      animationOut="slideOutDown" // 사라질 때 애니메이션
      animationInTiming={400} // 나타나는 속도 (ms)
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>로딩 중...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchSelectedItems}>
              <Text style={styles.retryText}>다시 시도</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
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
          </>
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
          disabled={isLoading}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  retryText: {
    color: Colors.pointColor,
    fontWeight: "bold",
  },
  // 스타일 끝
});

export default ItemPopup;