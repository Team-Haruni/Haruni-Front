// src/components/MessageItem.js
import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import Colors from "../../styles/color";
import useCustomFonts from "../../src/hooks/useCustomFonts";
import LoadingBar from "../components/Loadingbar";
import { useSelector } from "react-redux";
import characterData from "../data/characterData";

const MessageItem = ({ message }) => {
  const characterVersion = useSelector((state) => state.exp.characterVersion);
  const fontsLoaded = useCustomFonts();
  const { mine, content, createdAt, loading } = message;

  // HH:MM:SS → HH:MM
  const timeLabel = createdAt.substring(11, 16);

  return (
    <View
      style={[
        styles.messageContainer,
        mine ? styles.mineMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {/* 상대 메시지일 때만 프로필 */}
      {!mine && (
        <Image
          resizeMode="resize"
          source={characterData[characterVersion].url}
          style={styles.profileImage}
        />
      )}

      <View
        style={[
          mine
            ? styles.messageContentContainer
            : styles.otherMessageContentContainer,
          loading ? styles.loadingContentContainer : null,
        ]}
      >
        {loading ? (
          <View style={styles.loadingbarContainer}>
            <LoadingBar />
          </View>
        ) : (
          <Text
            style={
              mine ? styles.messageText : styles.otherMessageText
            }
          >
            {content}
          </Text>
        )}

        {/* 타임스탬프 */}
        <Text
          style={[
            styles.time,
            mine ? styles.timeMine : styles.timeOther,
          ]}
        >
          {timeLabel}
        </Text>
      </View>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  mineMessageContainer: {
    paddingHorizontal: 10,
    gap: 5,
    justifyContent: "flex-end",
  },
  otherMessageContainer: {
    justifyContent: "flex-start",
  },
  profileImage: {
    width: 45,
    height: 45,
  },

  // 말풍선 컨테이너에 position: 'relative' 추가
  messageContentContainer: {
    position: "relative",
    minWidth: 50,
    maxWidth: 275,
    backgroundColor: "white",
    minHeight: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },
  otherMessageContentContainer: {
    position: "relative",
    minWidth: 50,
    maxWidth: 275,
    backgroundColor: "#ffd166",
    minHeight: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },

  messageText: {
    marginHorizontal: 10,
    marginVertical: 10,
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 14,
  },
  otherMessageText: {
    marginHorizontal: 10,
    marginVertical: 10,
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 14,
  },

  loadingContentContainer: {
    minWidth: 50,
  },
  loadingbarContainer: {
    flex: 1,
  },

  // 타임스탬프 기본 스타일
  time: {
    position: "absolute",
    fontSize: 12,
    color: "#818181",
  },
  // 내 메시지일 때 우측 아래
  timeMine: {
    bottom: 3,
    left: -35,
  },
  // 상대 메시지일 때 좌측 아래
  timeOther: {
    bottom: 3,
    right: -35.5,
  },
});