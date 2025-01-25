import { useFonts } from "expo-font";

export default function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    Cafe24Ssurrond: require("../../assets/fonts/Cafe24Ssurround.ttf"),
    Cafe24Ssurrondair: require("../../assets/fonts/Cafe24Ssurroundair.ttf"),
    // 필요한 글꼴 추가 가능
  });

  return fontsLoaded;
}
