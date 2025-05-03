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
  RefreshControl,
} from "react-native";
import ChatBar from "../../components/ChatBar";
import MessageItem from "../../components/MessageItem";
import { useDispatch } from "react-redux";
import { chatGrowExp } from "../../../redux/slices/expSlice";
import { fetchChatHistory } from "../../api/message";

const Message = () => {
  const dispatch = useDispatch();
  const flatListRef = useRef(null);

  // 상태
  const [currentDate, setCurrentDate] = useState(getTodayString());
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 날짜 포맷 함수
  function formatDate(d) {
    const yyyy = d.getFullYear();
    const mm = (`0${d.getMonth() + 1}`).slice(-2);
    const dd = (`0${d.getDate()}`).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  }
  function getTodayString() {
    return formatDate(new Date());
  }
  function getPrevDateString(dateStr) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return formatDate(d);
  }

  // 공용 로드 함수
  const loadChatForDate = useCallback(
    async (dateStr, prepend = false) => {
      try {
        prepend ? setIsRefreshing(true) : setIsLoading(true);
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
        prepend ? setIsRefreshing(false) : setIsLoading(false);
      }
    },
    []
  );

  // 초기 로드 (오늘)
  useEffect(() => {
    loadChatForDate(currentDate, false);
  }, []);

  // 메시지 자동 스크롤
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 키보드 이벤트 처리
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

  // 더미 메시지 전송 로직 (변경 없음)
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

  // Pull-to-Refresh 핸들러
  const handleRefresh = () => {
    const prevDate = getPrevDateString(currentDate);
    setCurrentDate(prevDate);
    loadChatForDate(prevDate, true);
  };

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

                // 방법 1: Pull-to-Refresh 추가
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                  />
                }
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