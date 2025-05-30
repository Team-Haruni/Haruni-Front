import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../styles/color";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import useCustomFonts from "../hooks/useCustomFonts";
import { setPeriod, setHour, setMinutes } from "../../redux/slices/alarmSlice";
import { useDispatch } from "react-redux";

const TimePicker = ({ AM_PM, HOURS, MINUTES }) => {
  const dispatch = useDispatch();
  const fontsLoaded = useCustomFonts();
  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        {/* 오전 / 오후 선택 */}
        <WheelPickerExpo
          height={200}
          width={100}
          items={AM_PM.map((period) => ({ label: period, value: period }))}
          onChange={({ item }) => dispatch(setPeriod(item.value))}
          initialSelectedIndex={0}
          renderItem={(item) => (
            <Text
              style={{
                fontSize: 20,
                color: Colors.yellow600,
                fontFamily: "Cafe24Ssurrondair",
              }}
            >
              {item.label}
            </Text>
          )}
          selectedStyle={{ borderColor: Colors.pointColor, borderWidth: 2 }}
          haptics={true}
        />

        {/* 시간 선택 */}
        <WheelPickerExpo
          height={200}
          width={100}
          items={HOURS.map((hour) => ({ label: hour, value: hour }))}
          onChange={({ item }) => dispatch(setHour(item.value))}
          initialSelectedIndex={0}
          renderItem={(item) => (
            <Text
              style={{
                fontSize: 20,
                color: Colors.yellow600,
                fontFamily: "Cafe24Ssurrondair",
              }}
            >
              {item.label}
            </Text>
          )}
          selectedStyle={{ borderColor: Colors.pointColor, borderWidth: 2 }}
          haptics={true}
        />
        {/* 분 선택 */}
        <WheelPickerExpo
          height={200}
          width={100}
          items={MINUTES.map((hour) => ({ label: hour, value: hour }))}
          onChange={({ item }) => dispatch(setMinutes(item.value))}
          initialSelectedIndex={0}
          renderItem={(item) => (
            <Text
              style={{
                fontSize: 20,
                color: Colors.yellow600,
                fontFamily: "Cafe24Ssurrondair",
              }}
            >
              {item.label}
            </Text>
          )}
          selectedStyle={{ borderColor: Colors.pointColor, borderWidth: 2 }}
          haptics={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default TimePicker;
