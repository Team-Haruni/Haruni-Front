// utils/unityBridge.js
export const sendMessageToUnity = (webviewRef, eventName, data) => {
  if (webviewRef.current) {
    const message = JSON.stringify({ eventName, data });
    console.log(`Unity로 메시지 전송: eventName=${eventName}, data=${data}`);
    console.log(data);

    webviewRef.current.injectJavaScript(`
      if (window.UnityBridge && typeof window.UnityBridge.receiveMessage === "function") {
        window.UnityBridge.receiveMessage('${message}');
      } else {
        console.error("UnityBridge가 정의되지 않았습니다.");
      }
    `);

    console.log("UnityBridge 성공");
  } else {
    console.error(
      "WebView ref가 null입니다. WebView가 렌더링되었는지 확인하세요."
    );
    throw new Error("캐릭터 불러오기 실패!!");
  }
};
