import { BaseToast } from "react-native-toast-message";
import { View, Text } from "react-native";
import Colors from "../../styles/color";
import useCustomFonts from "../hooks/useCustomFonts";
import XIcon from "./../../assets/x-icon.svg";

const toastConfig = {
  error: (props) => {
    const fontsLoaded = useCustomFonts();

    if (!fontsLoaded) return null; // 폰트가 로드되지 않으면 아무것도 안 보이게 처리

    return (
      <BaseToast
        {...props}
        style={{
          backgroundColor: Colors.yellow600,
          borderRadius: 20,
          height: 75,
          width: 350,
          zIndex: 9999, // 가장 앞에 오도록 설정
          borderLeftWidth: 0, // ✅ 왼쪽 빨간색 선 제거
          top: 20,
          opacity: 0.9, // 투명도 설정
        }}
        renderLeadingIcon={() => (
          <View style={{ marginLeft: 25, marginVertical: "auto" }}>
            <XIcon />
          </View>
        )}
        text1Style={{
          fontSize: 10,
          fontFamily: "Cafe24Ssurrondair",
          color: Colors.mainYellow,
        }}
        text2Style={{
          fontSize: 16,
          fontFamily: "Cafe24Ssurrondair",
          color: Colors.yellow50,
        }}
      />
    );
  },
  success: (props) => {
    const fontsLoaded = useCustomFonts();

    if (!fontsLoaded) return null;

    return (
      <BaseToast
        {...props}
        style={{
          backgroundColor: "#D4EDDA",
          borderLeftWidth: 0,
          zIndex: 9999, // 가장 앞에 오도록 설정
          opacity: 0.9, // 투명도 설정
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        renderContent={() => (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              fontFamily: "Cafe24Ssurrond",
              color: "black",
            }}
          >
            {props.text1}
          </Text>
        )}
      />
    );
  },
};

export default toastConfig;
