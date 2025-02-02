import React, { useState, forwardRef } from "react";
import { WebView } from "react-native-webview";

const UnityWebView = forwardRef(({ onLoadEnd }, ref) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadEnd = () => {
    setIsLoading(false);
    if (onLoadEnd) {
      onLoadEnd(); // 로딩 완료 콜백 호출
    }
  };

  return (
    <WebView
      ref={ref}
      // source={{ uri: "https://kgs9843.github.io/HaruniWebView/" }}
      source={{ uri: "http://192.168.219.243:8000/" }}
      onLoadEnd={handleLoadEnd} // 로딩 완료 시 호출될 함수
      style={{ flex: 1, backgroundColor: "transparent" }} // WebView 배경을 투명으로 설정
      javaScriptEnabled={true}
      injectedJavaScript={`document.body.style.background = 'transparent';`}
    />
  );
});

export default UnityWebView;
