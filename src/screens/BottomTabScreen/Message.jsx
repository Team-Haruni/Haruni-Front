// src/screens/Message.js
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
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
  const flatListRef = useRef(null);

  // 현재 기준으로 불러온 마지막 날짜 (YYYY-MM-DD)
  const [currentDate, setCurrentDate] = useState(getTodayString());
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  // YYYY-MM-DD 포맷 생성
  function getTodayString() {
    const d = new Date();
    return formatDate(d);
  }
  function formatDate(d) {
    const yyyy = d.getFullYear();
    const mm = (`0${d.getMonth() + 1}`).slice(-2);
    const dd = (`0${d.getDate()}`).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  }
  // 하루 전 날짜 계산
  function getPrevDateString(dateStr) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return formatDate(d);
  }

  // 초기(오늘) 채팅 불러오기
  useEffect(() => {
    loadChatForDate(currentDate, /* prepend= */ false);
  }, []);

  // 특정 날짜 채팅 불러오는 공통 함수
  const loadChatForDate = useCallback(
    async (dateStr, prepend) => {
      try {
        prepend ? setIsLoadingOlder(true) : setIsLoading(true);
        const chatArray = await fetchChatHistory(dateStr);
        const formatted = chatArray.map((item) => ({
          mine: item.chatType === "USER",
          content: item.content,
          sendingTime: item.sendingTime,
          createdAt: new Date(`${dateStr}T${item.sendingTime}`).toISOString(),
        }));
        setMessages((prev) =>
          prepend ? [...formatted, ...prev] : formatted
        );
      } catch (e) {
        console.warn("채팅 불러오기 실패:", e);
      } finally {
        prepend ? setIsLoadingOlder(false) : setIsLoading(false);
      }
    },
    []
  );

  // 맨 위로 스크롤 시 이전 날짜 불러오기
  const handleScroll = ({ nativeEvent }) => {
    if (
      nativeEvent.contentOffset.y <= 12 &&
      !isLoadingOlder &&
      !isLoading
    ) {
      const prevDate = getPrevDateString(currentDate);
      setCurrentDate(prevDate);
      loadChatForDate(prevDate, /* prepend= */ true);
    }
  };

  // 새 메시지 전송 더미 로직 (변경 없음)
  const [newMessage, setNewMessage] = useState("");
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const now = new Date();
    const hh = (`0${now.getHours()}`).slice(-2);
    const mi = (`0${now.getMinutes()}`).slice(-2);
    const sendingTime = `${hh}:${mi}:00`;

    const userMessage = {
      mine: true,
      content: newMessage,
      sendingTime,
      createdAt: now.toISOString(),
    };
    const emptyAI = {
      mine: false,
      content: "",
      sendingTime,
      createdAt: now.toISOString(),
      loading: true,
    };

    setNewMessage("");
    setMessages((prev) => [...prev, userMessage, emptyAI]);
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, content: "끝", loading: false }
            : m
        )
      );
      setIsLoading(false);
      dispatch(chatGrowExp());
    }, 2000);
  };

  // 새 메시지 또는 날짜 변경 시 맨 아래로 스크롤
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 키보드 이벤트 스크롤 유지
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
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.chatContainer}>
            {isLoading && messages.length === 0 ? (
              <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item }) => <MessageItem message={item} />}
                onScroll={handleScroll}
                scrollEventThrottle={100}
              />
            )}
            {isLoadingOlder && (
              <ActivityIndicator
                size="small"
                style={styles.loadingOlderIndicator}
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
  chatContainer: { flex: 1, position: "relative" },
  inputContainer: { width: "100%", height: 50 },
  loadingOlderIndicator: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
  },
});

export default Message;