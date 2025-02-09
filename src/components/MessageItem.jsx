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
  return (
    <View
      style={[
        styles.messageContainer,
        mine ? styles.mineMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {/* 내 메시지일 때 프로필 이미지 숨김 */}
      {mine ? null : (
        <Image
          resizeMode="resize"
          source={characterData[characterVersion].url}
          style={styles.profileImage}
        />
      )}

      <View
        style={[
          styles.messageContentContainer,
          loading ? styles.loadingContentContainer : "",
        ]}
      >
        {loading ? (
          <View style={styles.loadingbarContainer}>
            <LoadingBar />
          </View>
        ) : (
          <Text style={styles.messageText}>{content}</Text>
        )}
      </View>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  messageContainer: {
    display: "flex",
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
  messageContentContainer: {
    minWidth: 50,
    maxWidth: 150,
    backgroundColor: "white",
    minHeight: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },

  messageText: {
    marginHorizontal: 12,
    marginVertical: 15,
    fontFamily: "Cafe24Ssurrondair",
    fontSize: 14,
  },
  loadingContentContainer: {
    minWidth: 50,
  },
  loadingbarContainer: {
    flex: 1,
  },
});
