import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

const SocialWebView = ({ source, closeSocialModal }) => {
  const { setItem } = useAsyncStorage('토큰 key 값');

  const INJECTED_JAVASCRIPT = `
    (function() {
      if(window.document.getElementsByTagName("pre").length > 0){
        window.ReactNativeWebView.postMessage(window.document.getElementsByTagName("pre")[0].innerHTML);
      }
    })();
  `;

  const _handleMessage = async (event) => {
    const result = JSON.parse(event.nativeEvent.data);
    const success = result.message;

    if (success) {
      const userToken = result.Authorization;
      try {
        await setItem(userToken);
      } catch (e) {
        console.log(e);
      }
    }

    closeSocialModal();  // Modal 닫기
  };

  return (
    <WebView
      originWhitelist={['*']}
      injectedJavaScript={INJECTED_JAVASCRIPT}
      source={source}
      javaScriptEnabled={true}
      onMessage={_handleMessage}
    />
  );
};

export default SocialWebView;
