import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import UnityWebView from "../../components/UnityWebView";
import LoadingBar from "../../components/Loadingbar";
import SettingIcon from "../../../assets/setting-icon.svg";
import ItemIcon from "../../../assets/item-icon.svg";
import LevelBar from "../../components/LevelBar";
import MainScreenChat from "../../components/MainScreenChat";
import SettingPopup from "../../components/Popup/SettingPopup/SettingPopup";
import Itempopup from "../../components/Popup/ItemPopup";
import TouchArea from "../../components/TouchArea";
import LevelPopup from "../../components/Popup/LevelPopup";
import characterData from "../../data/characterData";
import { useSelector, useDispatch } from "react-redux";
import LeafIcon from "../../../assets/leaf-icon.svg";
import Colors from "../../../styles/color";
import { sendMessageToUnity } from "../../utils/unityBridge";
import AuraIcon from "../../../assets/aura-icon.svg";
import { mainApi } from "../../api/main";
import * as Sentry from "@sentry/react-native";
import ErrorBoundary from "react-native-error-boundary";
import CustomWebviewErrorFallback from "../../components/ErrorFallback/CustomWebviewErrorFallback";
import { setInitialExp, setInitialLevel } from "../../../redux/slices/expSlice";

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.exp.userName);
  const webviewRef = useRef(null);
  const [chat, setChat] = useState(`안녕 ${userName} 오늘 하루도 힘내자!`);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가 (나중 수정)
  const [settingModalVisible, setSettingModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);
  const [leafEffect, setLeafEffect] = useState(false);
  const [auraEffect, setAuraEffect] = useState(false);
  const [landscapeIndex, setLandscapeIndex] = useState([]);
  const [structureIndex, setStructureIndex] = useState([]);
  const [hatIndex, setHatIndex] = useState([]);
  const [planeIndex, setPlaneIndex] = useState([]);
  const [error, setError] = useState(null);

  // console.log(landscapeIndex);
  // console.log(structureIndex);
  // console.log(hatIndex);
  // console.log(planeIndex);

  //케릭터관련
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  const exp = useSelector((state) => state.exp.exp);
  const level = useSelector((state) => state.exp.level);
  console.log(exp);
  // // 버전 증가
  // setCharacterVersion((prev) => prev + 1);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const res = await mainApi(); // mainApi 호출
        if (res) {
          const greeting = res.data.greetingMessage;
          if (greeting) {
            setChat(greeting); // 첫 화면 로딩 시 인삿말 표시
          }
          const level = res.data.haruniLevelInteger;
          const exp = res.data.haruniLevelDecimal;
          dispatch(setInitialExp(exp));
          dispatch(setInitialLevel(level));

          const itemArray = res.data.itemIndexes;

          const groupedIndexes = itemArray.reduce((acc, item) => {
            const { type, index } = item;

            if (!acc[type]) {
              acc[type] = [];
            }

            acc[type].push(index);
            return acc;
          }, {});

          const itemArray2 = groupedIndexes;

          console.log(itemArray2, "변형 리스트");
          setLandscapeIndex(itemArray2.landscape ? itemArray2.landscape : []);
          setStructureIndex(itemArray2.structure ? itemArray2.structure : []);
          setHatIndex(itemArray2.hat ? itemArray2.hat : []);
          setPlaneIndex(itemArray2.plane ? itemArray2.plane : [0]);
        }
      } catch (err) {
        Sentry.withScope((scope) => {
          scope.setLevel("error");
          scope.setTag("type", "api");
          scope.setTag("api", "main");
          Sentry.captureException(err);
        });
        console.error("Greeting 로딩 실패", err);
        setError(err);
      }
    };

    fetchGreeting();
  }, []);

  if (error) {
    throw new Error("로그인 중 문제가 발생했습니다.");
  }

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

  useEffect(() => {
    if (webviewRef) {
      const finalSend1 = JSON.stringify(landscapeIndex);
      const finalSend2 = JSON.stringify(structureIndex);
      const finalSend3 = JSON.stringify(hatIndex);
      const finalSend4 = JSON.stringify(planeIndex);

      console.log(finalSend1);
      console.log(finalSend2);
      console.log(finalSend3);
      console.log(finalSend4);

      sendMessageToUnity(webviewRef, "characterVersion", {
        action: `${characterVersion}`,
      });
      sendMessageToUnity(webviewRef, "landscape", { action: finalSend1 });
      sendMessageToUnity(webviewRef, "structure", { action: finalSend2 });
      sendMessageToUnity(webviewRef, "hat", { action: finalSend3 });
      sendMessageToUnity(webviewRef, "plane", { action: finalSend4 });

      setTimeout(() => {
        sendMessageToUnity(webviewRef, "characterVersion", {
          action: `${characterVersion}`,
        });
        sendMessageToUnity(webviewRef, "landscape", { action: finalSend1 });
        sendMessageToUnity(webviewRef, "structure", { action: finalSend2 });
        sendMessageToUnity(webviewRef, "hat", { action: finalSend3 });
        sendMessageToUnity(webviewRef, "plane", { action: finalSend4 });
      }, 10000);
      setTimeout(() => {
        sendMessageToUnity(webviewRef, "characterVersion", {
          action: `${characterVersion}`,
        });
        sendMessageToUnity(webviewRef, "landscape", { action: finalSend1 });
        sendMessageToUnity(webviewRef, "structure", { action: finalSend2 });
        sendMessageToUnity(webviewRef, "hat", { action: finalSend3 });
        sendMessageToUnity(webviewRef, "plane", { action: finalSend4 });
      }, 15000);
    }
  }, [landscapeIndex, structureIndex, hatIndex, planeIndex, webviewRef]);

  //맨처음 캐릭터 버전 및 아이템 설정
  const handleWebViewLoadEnd = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    // console.log("WebView loaded, waiting for 5 seconds...");
    // const finalSend1 = JSON.stringify(landscapeIndex);
    // const finalSend2 = JSON.stringify(structureIndex);
    // const finalSend3 = JSON.stringify(hatIndex);
    // const finalSend4 = JSON.stringify(planeIndex);

    // console.log(finalSend1);
    // console.log(finalSend2);
    // console.log(finalSend3);
    // console.log(finalSend4);
    // if (landscapeIndex || structureIndex || hatIndex || planeIndex) {
    //   setTimeout(() => {
    //     setIsLoading(false);
    //     sendMessageToUnity(webviewRef, "characterVersion", {
    //       action: `${characterVersion}`,
    //     });
    //     sendMessageToUnity(webviewRef, "characterVersion", {
    //       action: `${characterVersion}`,
    //     });
    //     sendMessageToUnity(webviewRef, "landscape", { action: finalSend1 });
    //     sendMessageToUnity(webviewRef, "structure", { action: finalSend2 });
    //     sendMessageToUnity(webviewRef, "hat", { action: finalSend3 });
    //     sendMessageToUnity(webviewRef, "plane", { action: finalSend4 });
    //   }, 10000);
    //   setTimeout(() => {
    //     sendMessageToUnity(webviewRef, "characterVersion", {
    //       action: `${characterVersion}`,
    //     });
    //     sendMessageToUnity(webviewRef, "landscape", { action: finalSend1 });
    //     sendMessageToUnity(webviewRef, "structure", { action: finalSend2 });
    //     sendMessageToUnity(webviewRef, "hat", { action: finalSend3 });
    //     sendMessageToUnity(webviewRef, "plane", { action: finalSend4 });
    //   }, 15000);
    //   setTimeout(() => {
    //     sendMessageToUnity(webviewRef, "characterVersion", {
    //       action: `${characterVersion}`,
    //     });
    //     sendMessageToUnity(webviewRef, "landscape", { action: finalSend1 });
    //     sendMessageToUnity(webviewRef, "structure", { action: finalSend2 });
    //     sendMessageToUnity(webviewRef, "hat", { action: finalSend3 });
    //     sendMessageToUnity(webviewRef, "plane", { action: finalSend4 });
    //   }, 20000);
    // }
  };

  return (
    <ImageBackground
      source={require("../../../assets/background.png")} // 배경 이미지 경로
      style={styles.background} // 스타일을 적용할 배경
      resizeMode="cover" // 이미지 크기 조정 방법
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

            {/* <TouchableOpacity
              style={styles.listIconContainer}
              onPress={() => setListModalVisible(true)}
            >
              <ListIcon />
            </TouchableOpacity> */}
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

            {/* 리스트 팝업 컴포넌트
            <ListPopup
              visible={listModalVisible}
              onClose={() => setListModalVisible(false)}
              navigation={navigation}
            /> */}
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
            {/* <View style={styles.voiceButtonContainer}>
              <VoiceButton setChat={setChat} />
            </View> */}
            <TouchArea
              // 제일 작은 버전
              width={characterData[characterVersion].width}
              height={characterData[characterVersion].height}
              top={characterData[characterVersion].top}
              webviewRef={webviewRef}
              setChat={setChat}
              level={level}
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
    flex: 1, // 화면을 가득 채우도록 설정
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
    ...StyleSheet.absoluteFillObject, // View를 화면 전체에 배치
    zIndex: 0, // 다른 컴포넌트 뒤에 배치
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
  // listIconContainer: {
  //   position: "absolute",
  //   left: 20,
  //   top: 30,
  //   zIndex: 2,
  // },
  auraIconContainer: {
    position: "absolute",
    left: 15,
    top: 80,
    zIndex: 2,
  },
  leafIconContainer: {
    position: "absolute",
    left: 20,
    top: 30,
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
  // voiceButtonContainer: {
  //   position: "absolute",
  //   width: 80,
  //   height: 80,
  //   transform: [{ translateX: -35 }],
  //   left: "50%",
  //   bottom: "15%",
  //   zIndex: 3,
  // },
});

export default Home;
