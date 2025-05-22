import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../styles/color";

const DropdownSection = ({ title, children, initialExpanded = true }) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.dropdownHeader}
        activeOpacity={0.7} // 터치 시 투명도 조절
      >
        <Text style={styles.dropdownTitle}>{title}</Text>
        <AntDesign
          name={expanded ? "up" : "down"}
          size={16}
          color="black" // 헤더 아이콘 색상도 기존 스타일과 맞춤
        />
      </TouchableOpacity>

      {expanded && <View style={styles.dropdownContent}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    marginBottom: 10, // 각 드롭다운 섹션 하단 여백
    // 기존 User.js의 outerContainer 스타일은 드롭다운 내부 컨텐츠에 적용될 것이므로 여기서는 제거
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 12, // User.js의 padding과 유사하게
    backgroundColor: Colors.pointColor, // User.js의 outerContainer 배경색과 동일
    borderRadius: 8,
    marginBottom: 8, // 헤더와 컨텐츠 사이 간격
  },
  dropdownTitle: {
    fontFamily: "Cafe24Ssurrond",
    fontSize: 15,
    color: "black", // 헤더 타이틀 색상 (배경색과 대비되도록 myColor 사용)
  },
  dropdownContent: {
    position: "relative",
    top: -14,
    backgroundColor: Colors.pointColor,
    borderBottomRightRadiusRadius: 20,
    borderBottomLeftRadius: 8,
    padding: 12,
  },
});

export default DropdownSection;
