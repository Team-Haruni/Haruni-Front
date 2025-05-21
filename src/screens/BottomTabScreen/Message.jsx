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
  InteractionManager,
} from "react-native";
import ChatBar from "../../components/ChatBar";
import MessageItem from "../../components/MessageItem";
import { useDispatch, useSelector } from "react-redux";
import { touchGrowExp } from "../../../redux/slices/expSlice";
import { fetchChatHistory, sendChat } from "../../api/message";
import * as Sentry from "@sentry/react-native";
import { sendExpApi } from "../../api/sendExp";

const Message = () => {
  const dispatch = useDispatch();
  const flatListRef = useRef(null);

  // 상태
  const level = useSelector((state) => state.exp.level);
  const [currentDate, setCurrentDate] = useState(getTodayString());
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 더미 메시지 전송 로직 (변경 없음)
  const [newMessage, setNewMessage] = useState("");

  // 날짜 포맷 함수
  function formatDate(d) {
    const yyyy = d.getFullYear();
    const mm = `0${d.getMonth() + 1}`.slice(-2);
    const dd = `0${d.getDate()}`.slice(-2);
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
  const loadChatForDate = useCallback(async (dateStr, prepend = false) => {
    try {
      prepend ? setIsRefreshing(true) : setIsLoading(true);
      const chatArray = await fetchChatHistory(dateStr);
      const formatted = chatArray.map((item) => ({
        mine: item.chatType === "USER",
        content: item.content,
        createdAt: item.sendingTime,
      }));
      setMessages((prev) => (prepend ? [...formatted, ...prev] : formatted));
    } catch (e) {
      Sentry.withScope((scope) => {
        scope.setLevel("error");
        scope.setTag("type", "api");
        scope.setTag("api", "fetchChat");
        Sentry.captureException(e);
      });
      console.warn("채팅 불러오기 실패:", e);
    } finally {
      prepend ? setIsRefreshing(false) : setIsLoading(false);
    }
  }, []);

  // 초기 로드 (오늘)
  useEffect(() => {
    loadChatForDate(currentDate, false);
  }, []);

  // 새로운 메시지 자동 스크롤
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, [flatListRef]);

  // 메시지 자동 스크롤
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [isLoading]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 500);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleSendMessage = async () => {
    Keyboard.dismiss();

    try {
      let expGain = 10;
      if (level >= 15 && level < 30) expGain = 5;
      else if (level >= 30) expGain = 3;

      const responseData = await sendExpApi(expGain); // ✅ 비동기 처리
      dispatch(touchGrowExp(responseData.data.haruniLevelDecimal));
    } catch (err) {
      console.error("경험치 전송 실패", err);
    }

    if (!newMessage.trim()) return;
    const now = new Date();
    const hh = `0${now.getHours()}`.slice(-2);
    const mi = `0${now.getMinutes()}`.slice(-2);
    const sendingTime = `${hh}:${mi}:00`;
    console.log(sendingTime);

    const userMessage = {
      mine: true,
      content: newMessage,
      sendingTime,
      createdAt: sendingTime,
    };
    const emptyAI = {
      mine: false,
      content: "",
      sendingTime,
      createdAt: sendingTime,
      loading: true,
    };

    setNewMessage("");
    setMessages((prev) => [...prev, userMessage, emptyAI]);
    setIsLoading(true);
    try {
      const response = await sendChat(newMessage); // 실제 서버 전송
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, content: response, loading: false }
            : m
        )
      );
    } catch (e) {
      Sentry.withScope((scope) => {
        scope.setLevel("error");
        scope.setTag("type", "api");
        scope.setTag("api", "sendChat");
        Sentry.captureException(e);
      });
      // 실패 시 에러 메시지로 대체
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1
              ? { ...m, content: "오류가 발생했어요.", loading: false }
              : m
          )
        );
      }, 2000);
    } finally {
      setIsLoading(false);
    }
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
