import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Platform,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import UnityWebView from "../../components/UnityWebView";
import LoadingBar from "../../components/Loadingbar";
import SettingIcon from "../../../assets/setting-icon.svg";
import ListIcon from "../../../assets/list-icon.svg";
import ItemIcon from "../../../assets/item-icon.svg";
import LevelBar from "../../components/LevelBar";
import MainScreenChat from "../../components/MainScreenChat";
import SettingPopup from "../../components/Popup/SettingPopup/SettingPopup";
import ListPopup from "../../components/Popup/ListPopup";
import Itempopup from "../../components/Popup/ItemPopup";
import VoiceButton from "../../components/VoiceButton";
import TouchArea from "../../components/TouchArea";
import LevelPopup from "../../components/Popup/LevelPopup";
import characterData from "../../data/characterData";
import { useSelector, useDispatch } from "react-redux"; // useDispatch 추가
import { setSelected as setSelectedHat } from "../../../redux/slices/hatSlice";
import { setSelected as setSelectedLandscape } from "../../../redux/slices/landscapeSlice";
import { setSelected as setSelectedStructure } from "../../../redux/slices/structureSlice";
import { setCurrentPlaneIndex } from "../../../redux/slices/planeSlice";
import LeafIcon from "../../../assets/leaf-icon.svg";
import Colors from "../../../styles/color";
import { sendMessageToUnity } from "../../utils/unityBridge";
import AuraIcon from "../../../assets/aura-icon.svg";
import { mainApi } from "../../api/main";
import ErrorBoundary from "react-native-error-boundary";
import CustomWebviewErrorFallback from "../../components/ErrorFallback/CustomWebviewErrorFallback";

const Home = ({ navigation }) => {
  const dispatch = useDispatch(); // Redux dispatch 추가
  const userName = useSelector((state) => state.exp.userName);
  const webviewRef = useRef(null);
  const [chat, setChat] = useState(`안녕 ${userName} 오늘 하루도 힘내자!`);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가 (나중 수정)
  const [settingModalVisible, setSettingModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [leafEffect, setLeafEffect] = useState(false);
  const [auraEffect, setAuraEffect] = useState(false);

  //케릭터관련
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  const nickName = useSelector((state) => state.exp.nickName);
  const exp = useSelector((state) => state.exp.exp);
  const level = useSelector((state) => state.exp.level);
  
  // 각 슬라이스의 상태 가져오기
  const hatImages = useSelector((state) => state.hat.hatImages);
  const landscapeImages = useSelector((state) => state.landscape.landscapeImages);
  const structureImages = useSelector((state) => state.structure.structureImages);
  const currentPlaneIndex = useSelector((state) => state.plane.currentIndex);

  // API 데이터 불러오기 및 Redux 상태 업데이트
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log("API 호출 시작");
        const res = await mainApi(); // mainApi 호출
        console.log("API 응답 받음:", res.data);
        
        // 인사말 설정
        const greeting = res.data.greetingMessage;
        if (greeting) {
          setChat(greeting);
          console.log("인사말 설정됨:", greeting);
        }
        
        // 아이템 데이터 처리
        const itemIndexes = res.data.itemIndexes || [];
        console.log("받아온 아이템 데이터:", itemIndexes);
        
        // 타입별로 가장 마지막 인덱스만 적용
        const typeToIndex = {};
        itemIndexes.forEach(item => {
          const { type, index } = item;
          typeToIndex[type] = index;
        });
        
        // 정리된 데이터로 redux 업데이트 - 새 액션 사용
        Object.entries(typeToIndex).forEach(([type, index]) => {
          console.log(`최종 선택 아이템 - 타입: ${type}, 인덱스: ${index}`);
          
          // 타입에 따라 다른 Redux 액션 dispatch
          switch(type) {
            case 'hat':
              console.log(`hat setSelected 액션 디스패치 - 인덱스: ${index}`);
              dispatch(setSelectedHat(parseInt(index)));
              break;
            case 'landscape':
              console.log(`landscape setSelected 액션 디스패치 - 인덱스: ${index}`);
              dispatch(setSelectedLandscape(parseInt(index)));
              break;
            case 'structure':
              console.log(`structure setSelected 액션 디스패치 - 인덱스: ${index}`);
              dispatch(setSelectedStructure(parseInt(index)));
              break;
            case 'plane':
              console.log(`plane setCurrentPlaneIndex 액션 디스패치 - 인덱스: ${index}`);
              dispatch(setCurrentPlaneIndex(parseInt(index)));
              break;
            default:
              console.log(`Unknown item type: ${type}`);
          }
        });
        
      } catch (err) {
        console.error("API 데이터 로딩 실패", err);
      }
    };
    
    fetchInitialData();
  }, [dispatch]);
  
  // 모자 상태 변화 감지 및 로깅
  useEffect(() => {
    console.log("Hat 상태 변경 감지:", hatImages);
    const selectedHat = hatImages.findIndex(item => item.selected);
    console.log("선택된 Hat 인덱스:", selectedHat);
    
    if (!isLoading && webviewRef.current && selectedHat !== -1) {
      console.log(`Unity에 메시지 전송 - 타입: hat, 인덱스: ${selectedHat}`);
      sendMessageToUnity(webviewRef, "hat", { action: `${selectedHat}` });
    }
  }, [hatImages, isLoading]);

  useEffect(() => {
    if (isLoading || !webviewRef.current) return;
    
    // 풍경 아이템 확인
    const selectedLandscape = landscapeImages.findIndex(item => item.selected);
    if (selectedLandscape !== -1) {
      sendMessageToUnity(webviewRef, "landscape", { action: `${selectedLandscape}` });
      console.log(`[아이템 적용] 타입: landscape, 인덱스: ${selectedLandscape}`);
    }
  }, [landscapeImages, isLoading]);

  useEffect(() => {
    if (isLoading || !webviewRef.current) return;
    
    // 구조물 아이템 확인
    const selectedStructure = structureImages.findIndex(item => item.selected);
    if (selectedStructure !== -1) {
      sendMessageToUnity(webviewRef, "structure", { action: `${selectedStructure}` });
      console.log(`[아이템 적용] 타입: structure, 인덱스: ${selectedStructure}`);
    }
  }, [structureImages, isLoading]);

  useEffect(() => {
    if (isLoading || !webviewRef.current) return;
    
    // 배경 인덱스 전송
    if (currentPlaneIndex !== null && currentPlaneIndex !== undefined) {
      sendMessageToUnity(webviewRef, "plane", { action: `${currentPlaneIndex}` });
      console.log(`[아이템 적용] 타입: plane, 인덱스: ${currentPlaneIndex}`);
    }
  }, [currentPlaneIndex, isLoading]);

  //캐릭터 레벨에 따른 버전 증가
  useEffect(() => {
    if (level == 15) {
      sendMessageToUnity(webviewRef, "characterVersion", {
        action: `${characterVersion}`,
      });
    } else if (level == 30) {
      sendMessageToUnity(webviewRef, "characterVersion", {
        action: `${characterVersion}`,
      });
    }
  }, [level]);

  const changeLeafEffect = () => {
    //설정 필요
    sendMessageToUnity(webviewRef, "effect", { action: "leafEffect" });
    setLeafEffect(!leafEffect);
  };

  const changeAuraEffect = () => {
    //설정 필요
    sendMessageToUnity(webviewRef, "effect", { action: "auraEffect" });
    setAuraEffect(!auraEffect);
  };

  //맨처음 캐릭터 버전 설정
  const handleWebViewLoadEnd = () => {
    console.log("WebView loaded, waiting for 5 seconds...");

    setTimeout(() => {
      setIsLoading(false);
      sendMessageToUnity(webviewRef, "characterVersion", {
        action: `${characterVersion}`,
      });
    }, 10000);
    setTimeout(() => {
      sendMessageToUnity(webviewRef, "characterVersion", {
        action: `${characterVersion}`,
      });
    }, 15000);
    setTimeout(() => {
      sendMessageToUnity(webviewRef, "characterVersion", {
        action: `${characterVersion}`,
      });
    }, 20000);
  };

  return (
    <ImageBackground
      source={require("../../../assets/HaruniBackground.jpg")} 
      style={styles.background} 
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeContainer}>
        {isLoading && (
          <View style={styles.loadingBarContainer}>
            <LoadingBar />
          </View>
        )}
        <View
          style={{
            flex: 1,
            opacity: isLoading ? 0 : 1,
            pointerEvents: isLoading ? "none" : "auto",
          }}
        >
          <ErrorBoundary FallbackComponent={CustomWebviewErrorFallback}>
            <UnityWebView
              ref={webviewRef}
              style={[styles.unityContainer]}
              onLoadEnd={handleWebViewLoadEnd}
              setIsLoading={setIsLoading}
            />
          </ErrorBoundary>
        </View>

        {!isLoading && (
          <>
            <TouchableOpacity
              style={styles.settingIconContainer}
              onPress={() => setSettingModalVisible(true)}
            >
              <SettingIcon />
            </TouchableOpacity>

            {/*세팅 팝업 컴포넌트 */}
            <SettingPopup
              visible={settingModalVisible}
              onClose={() => setSettingModalVisible(false)}
              navigation={navigation}
            />

            <TouchableOpacity
              style={styles.listIconContainer}
              onPress={() => setListModalVisible(true)}
            >
              <ListIcon />
            </TouchableOpacity>
            {/* 나뭇잎 효과 */}
            <TouchableOpacity
              style={styles.leafIconContainer}
              onPress={() => changeLeafEffect()}
            >
              <LeafIcon
                style={{
                  color: leafEffect ? Colors.yellow600 : Colors.yellow400,
                }}
              />
            </TouchableOpacity>

            {/* 아우라 효과 */}
            <TouchableOpacity
              style={styles.auraIconContainer}
              onPress={() => changeAuraEffect()}
            >
              <AuraIcon
                style={{
                  color: auraEffect ? Colors.yellow600 : Colors.yellow400,
                }}
              />
            </TouchableOpacity>

            {/*리스트 팝업 컴포넌트 */}
            <ListPopup
              visible={listModalVisible}
              onClose={() => setListModalVisible(false)}
              navigation={navigation}
            />
            <TouchableOpacity
              style={styles.itemIconContainer}
              onPress={() => setItemModalVisible(true)}
            >
              <ItemIcon />
            </TouchableOpacity>
            {/*아이템 팝업 컴포넌트 */}
            <Itempopup
              visible={itemModalVisible}
              onClose={() => setItemModalVisible(false)}
              webviewRef={webviewRef}
            />

            {/*레벨벨 팝업 컴포넌트 */}
            <LevelPopup
              webviewRef={webviewRef}
              visible={levelModalVisible}
              onClose={() => setLevelModalVisible(false)}
            />
            <TouchableOpacity
              style={styles.levelContainer}
              onPress={() => setLevelModalVisible(true)}
            >
              <LevelBar progress={exp} level={level} />
            </TouchableOpacity>

            <View style={styles.chatContainer}>
              <MainScreenChat chat={chat} />
            </View>
            <View style={styles.voiceButtonContainer}>
              <VoiceButton setChat={setChat} />
            </View>
            <TouchArea
              // 제일 작은 버전
              width={characterData[characterVersion].width}
              height={characterData[characterVersion].height}
              top={characterData[characterVersion].top}
              webviewRef={webviewRef}
              setChat={setChat}
            />
          </>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    position: "relative",
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  background: {
    flex: 1, 
  },
  loadingBarContainer: {
    position: "absolute",
    top: "55%",
    left: "50%",
    width: 150,
    height: 150,
    transform: [{ translateX: -75 }, { translateY: -75 }],
    zIndex: 3,
  },
  unityContainer: {
    position: "relative",
    ...StyleSheet.absoluteFillObject, 
    zIndex: 0, 
  },
  settingIconContainer: {
    position: "absolute",
    right: 20,
    top: 30,
    zIndex: 2,
  },
  itemIconContainer: {
    position: "absolute",
    right: 20,
    top: 80,
    zIndex: 2,
  },
  listIconContainer: {
    position: "absolute",
    left: 20,
    top: 30,
    zIndex: 2,
  },
  auraIconContainer: {
    position: "absolute",
    left: 15,
    top: 125,
    zIndex: 2,
  },
  leafIconContainer: {
    position: "absolute",
    left: 20,
    top: 80,
    zIndex: 2,
  },
  levelContainer: {
    position: "absolute",
    width: 250,
    height: 50,
    transform: [{ translateX: -125 }],
    bottom: "25%",
    left: "50%",
    zIndex: 2,
  },
  chatContainer: {
    position: "absolute",
    width: 250,
    height: 100,
    transform: [{ translateX: -125 }],
    opacity: 0.8,
    top: "20%",
    left: "50%",
    zIndex: 2,
  },
  voiceButtonContainer: {
    position: "absolute",
    width: 80,
    height: 80,
    transform: [{ translateX: -35 }],
    left: "50%",
    bottom: "15%",
    zIndex: 3,
  },
});

export default Home;