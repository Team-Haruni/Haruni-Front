import React, { useState, forwardRef, useEffect } from "react";
import { WebView } from "react-native-webview";

const UnityWebView = forwardRef(({ onLoadEnd, setIsLoading }, ref) => {
  const [error, setError] = useState(false);
  const handleLoadEnd = () => {
    if (onLoadEnd) {
      onLoadEnd(); // 로딩 완료 콜백 호출
    }
  };
  const handleError = () => {
    setError(true);
  };
  useEffect(() => setIsLoading(true), [ref]);

  if (error) {
    throw new Error("캐릭터 불러오기 실패!!");
  }

  return (
    <WebView
      ref={ref}
      //https://kgs9843.github.io/HaruniWebView/
      source={{ uri: "https://kgs9843.github.io/HaruniWebView/" }}
      //source={{ uri: "http://192.168.25.17:8000/" }}
      onLoadEnd={handleLoadEnd} // 로딩 완료 시 호출될 함수
      onError={handleError}
      originWhitelist={["*"]} // 모든 도메인 허용
      mixedContentMode="always" // HTTP, HTTPS 둘 다 허
      style={{ flex: 1, backgroundColor: "transparent" }} // WebView 배경을 투명으로 설정
      javaScriptEnabled={true}
      injectedJavaScript={`document.body.style.background = 'transparent';`}
      cacheEnabled={true} // 캐싱 활성화
      domStorageEnabled={true} // 로컬 저장소 사용
      sharedCookiesEnabled={true} // 쿠키 공유
    />
  );
});

export default UnityWebView;
