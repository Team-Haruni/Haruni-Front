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
const Home = () => {
  const webviewRef = useRef(null);
  const [chat, setChat] = useState("안녕 오늘 하루도 힘내자!");
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [settingModalVisible, setSettingModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [listModalVisible, setListModalVisible] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);

  const handleWebViewLoadEnd = () => {
    console.log("WebView loaded, waiting for 5 seconds...");

    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
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
            <LoadingBar width={150} height={150} />
          </View>
        )}
        <UnityWebView
          ref={webviewRef}
          style={styles.unityContainer}
          onLoadEnd={handleWebViewLoadEnd}
        />

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
            />

            <TouchableOpacity
              style={styles.listIconContainer}
              onPress={() => setListModalVisible(true)}
            >
              <ListIcon />
            </TouchableOpacity>

            {/*리스트 팝업 컴포넌트 */}
            <ListPopup
              visible={listModalVisible}
              onClose={() => setListModalVisible(false)}
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
              visible={levelModalVisible}
              onClose={() => setLevelModalVisible(false)}
            />
            <TouchableOpacity
              style={styles.levelContainer}
              onPress={() => setLevelModalVisible(true)}
            >
              <LevelBar progress={50} />
            </TouchableOpacity>

            <View style={styles.chatContainer}>
              <MainScreenChat chat={chat} />
            </View>
            <View style={styles.voiceButtonContainer}>
              <VoiceButton />
            </View>
            <TouchArea
              width={200}
              height={230}
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
    paddingTop: Platform.OS === "android" ? 30 : 0,
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
    top: 50,
    zIndex: 2,
  },
  itemIconContainer: {
    position: "absolute",
    right: 20,
    top: 100,
    zIndex: 2,
  },
  listIconContainer: {
    position: "absolute",
    left: 20,
    top: 50,
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
