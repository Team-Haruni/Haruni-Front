// src/screens/Message.js
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
  ActivityIndicator,
} from "react-native";
import ChatBar from "../../components/ChatBar";
import MessageItem from "../../components/MessageItem";
import { useDispatch } from "react-redux";
import { chatGrowExp } from "../../../redux/slices/expSlice";
import { fetchChatHistory } from "../../api/message";

const Message = () => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);  // 🔥 실제 API 응답으로 초기화
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  // 🔥 오늘 날짜를 "YYYY-MM-DD" 형식으로 계산
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (`0${today.getMonth() + 1}`).slice(-2);
    const dd = (`0${today.getDate()}`).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  };

  // 🔥 컴포넌트 마운트 시 채팅 내역 불러오기
  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoading(true);
      try {
        const dateStr = getTodayString();
        const chatArray = await fetchChatHistory(dateStr);
        // 🔥 서버 데이터 → FlatList용 포맷으로 변환
        const formatted = chatArray.map((item) => ({
          mine: item.chatType === "USER",
          content: item.content,
          createdAt: new Date(`${dateStr}T${item.sendingTime}`).toISOString(),
        }));
        setMessages(formatted);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, []);

  // 🔥 새 메시지 전송(더미 로직 유지)
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      mine: true,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };
    const emptyAI = {
      mine: false,
      content: "",
      createdAt: new Date().toISOString(),
      loading: true,
    };

    setNewMessage("");
    setMessages((prev) => [...prev, userMessage, emptyAI]);
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy.length - 1;
        if (copy[last]?.loading) {
          copy[last] = {
            ...copy[last],
            content: "끝",
            loading: false,
          };
        }
        return copy;
      });
      setIsLoading(false);
      dispatch(chatGrowExp());
    }, 2000);
  };

  // 🔥 스크롤 관리
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 400)
    );
    return () => {
      show.remove();
      hide.remove();
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
            {isLoading && messages.length === 0 ? (
              <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item }) => <MessageItem message={item} />}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <ChatBar
              newMessage={newMessage}
              onChangeText={setNewMessage}
              handleSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, paddingTop: Platform.OS === "android" ? 10 : 0 },
  background: { flex: 1 },
  container: { flex: 1 },
  chatContainer: { flex: 1 },
  inputContainer: { width: "100%", height: 50 },
});

export default Message;