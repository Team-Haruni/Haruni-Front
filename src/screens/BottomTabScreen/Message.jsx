import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Platform,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import ChatBar from "../../components/ChatBar";
import chatDummyData from "../../data/chatDummyData";
import MessageItem from "../../components/MessageItem";
import { useDispatch } from "react-redux";
import { chatGrowExp } from "../../../redux/slices/expSlice";

const Message = () => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState(chatDummyData);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null); // FlatList에 대한 참조
  const [isLoading, setIsLoading] = useState(false);

  // 메시지 제출 함수
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        mine: true,
        content: newMessage,
        createdAt: new Date().toISOString(),
      };

      // 새로운 빈 AI 메시지 추가
      const emptyAIMessage = {
        mine: false, // 상대방 메시지처럼 보이게 설정
        content: "", // 일단 빈 상태
        createdAt: new Date().toISOString(),
        loading: true, // 로딩 중 표시
      };

      setNewMessage(""); // 메시지 입력 후 초기화
      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        emptyAIMessage,
      ]);

      setIsLoading(true); // 로딩 시작
      // 2초 후 마지막 메시지를 AI 응답으로 업데이트
      setTimeout(() => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastIndex = updatedMessages.length - 1;
          if (updatedMessages[lastIndex].loading) {
            updatedMessages[lastIndex] = {
              ...updatedMessages[lastIndex],
              content: "끝",
              loading: false,
            };
          }
          return updatedMessages;
        });
        setIsLoading(false); // 로딩 종료
      }, 2000);
      dispatch(chatGrowExp());
    }
  };

  // 메시지가 추가될 때마다 맨 아래로 스크롤
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 키보드가 올라오거나 내려갈 때 스크롤을 맨 아래로 이동
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 200); // 키보드가 올라온 후 약간 지연을 두고 스크롤
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 400); // 키보드가 내려간 후 스크롤
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <ImageBackground
      source={require("../../../assets/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardAvoidingView style={styles.container} behavior={"padding"}>
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatListRef} // FlatList에 ref 추가
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => <MessageItem message={item} />}
            />
          </View>

          <View style={styles.inputContainer}>
            <ChatBar
              newMessage={newMessage}
              onChangeText={setNewMessage}
              handleSendMessage={handleSendMessage}
              isLoading={isLoading} // 로딩 중이면 입력 비활성화
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },

  inputContainer: {
    width: "100%",

    height: 50,
  },
});

export default Message;
