import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInitialLevel, setInitialExp } from "../../../redux/slices/expSlice";
import { setLoading } from "../../../redux/slices/appStartLoadingSlice";
import { initFCM } from "../../utils/fcm"; // FCM 초기화 함수 import
import {
  View,
  StyleSheet,
  ImageBackground,
  Platform,
  SafeAreaView,
  Image,
  Text,
} from "react-native";
import LoadingBar from "../Loadingbar";
import { setDiaries } from "../../../redux/slices/diarySlice";
//추후제거
import diaryData from "../../data/diaryData";

const InitialSetter = ({ children }) => {
  const dispatch = useDispatch();

  // 로딩 상태를 가져옵니다.
  const loading = useSelector((state) => state.loading.loading);

  //레벨 초기 설정정
  useEffect(() => {
    // 백엔드에서 불러와서 초기 레벨을 설정 (예제: 1레벨로 설정)
    dispatch(setInitialLevel(1));
    dispatch(setInitialExp(0));
    dispatch(setDiaries(diaryData));

    // FCM 초기화
    initFCM();

    // 10초 후에 로딩 상태를 false로 변경
    setTimeout(() => {
      dispatch(setLoading());
    }, 3000); // 10초 지연 후 로딩 완료 처리
  }, [dispatch]); // 처음 앱 실행 시 한 번만 실행

  if (loading) {
    return (
      <ImageBackground
        source={require("../../../assets/background.png")} // 배경 이미지 경로
        style={styles.background} // 스타일을 적용할 배경
        resizeMode="cover" // 이미지 크기 조정 방법
      >
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.contentContainer}>
            <Image
              resizeMode="resize"
              source={require("../../../assets/logo.png")}
              style={styles.profileImage}
            />
            <View style={styles.loadingBarContainer}>
              <LoadingBar />
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
  return children;
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // 화면을 가득 채우도록 설정
  },
  safeContainer: {
    flex: 1,
    position: "relative",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  profileImage: {
    marginTop: 20,
    width: "100%",
    height: 420,
    marginBottom: 10,
  },
  loadingBarContainer: {
    width: 110,
    height: 110,
    zIndex: 3,
  },
});

export default InitialSetter;
