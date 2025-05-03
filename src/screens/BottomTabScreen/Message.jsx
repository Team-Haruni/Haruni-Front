// src/screens/Message.js
import React, { useState, useRef, useEffect } from "react";
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
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const getTodayString = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = (`0${d.getMonth() + 1}`).slice(-2);
    const dd = (`0${d.getDate()}`).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoading(true);
      try {
        const dateStr = getTodayString();
        const chatArray = await fetchChatHistory(dateStr);
        const formatted = chatArray.map((item) => ({
          mine: item.chatType === "USER",
          content: item.content,
          sendingTime: item.sendingTime, // ★ 원본 HH:MM:SS
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