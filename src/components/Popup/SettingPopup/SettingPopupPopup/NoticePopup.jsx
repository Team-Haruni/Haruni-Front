import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Colors from "../../../../../styles/color";
import WheelPicker from "react-native-wheely"; 
import { useDispatch } from "react-redux";
import { setAlarmTime } from "../../../../../redux/slices/alaramSlice";
import { useEffect } from "react";



const { width } = Dimensions.get("window");

const NoticePopup = ({ visible, onClose }) => {
  const dispatch = useDispatch();

  const meridiemOptions = ["오전", "오후"];
  const hourOptions = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i < 10 ? `0${i}` : `${i}`);

  const [meridiemIndex, setMeridiemIndex] = useState(0);
  const [hourIndex, setHourIndex] = useState(9);
  const [minuteIndex, setMinuteIndex] = useState(0);

  const handleConfirm = () => {
    const meridiem = meridiemOptions[meridiemIndex];
    const hour = parseInt(hourOptions[hourIndex]);
    const minute = parseInt(minuteOptions[minuteIndex]);
    dispatch(setAlarmTime({ meridiem, hour, minute }));
    onClose();
  };

  useEffect(() => {
    if (visible) {
      const now = new Date();
      const hour24 = now.getHours();
      const minute = now.getMinutes();
  
      setMeridiemIndex(hour24 < 12 ? 0 : 1);
      setHourIndex(hour24 % 12 === 0 ? 11 : (hour24 % 12) - 1);
      setMinuteIndex(minute);
    }
  }, [visible]);
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>알람 시간을 설정해주세요.</Text>
          <View style={styles.line} />

          <View style={styles.pickerRow}>

            <WheelPicker
              selectedIndex={meridiemIndex}
              options={meridiemOptions}
              onChange={setMeridiemIndex}
              containerStyle={styles.picker}
              itemHeight={44}
              visibleRest={1}
              renderItem={(option) => (
                <Text style={styles.itemText}>{option}</Text>
              )}              selectedIndicatorStyle={styles.selectedIndicator}
            />

            <WheelPicker
              selectedIndex={hourIndex}
              options={hourOptions}
              onChange={setHourIndex}
              containerStyle={styles.picker}
              itemHeight={44}
              visibleRest={1}
              renderItem={(option) => (
                <Text style={styles.itemText}>{option}</Text>
              )}              selectedIndicatorStyle={styles.selectedIndicator}
            />

            <WheelPicker
              selectedIndex={minuteIndex}
              options={minuteOptions}
              onChange={setMinuteIndex}
              containerStyle={styles.picker}
              itemHeight={44}
              visibleRest={1}
              renderItem={(option) => (
                <Text style={styles.itemText}>{option}</Text>
              )}              
              selectedIndicatorStyle={styles.selectedIndicator}
            />

          </View>
          <View style={styles.lineBottom} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={{ flex: 1 }}>
              <Text style={styles.button}>취소</Text>
            </TouchableOpacity>
            <View style={styles.buttonDivider} />
            <TouchableOpacity onPress={handleConfirm} style={{ flex: 1 }}>
              <Text style={styles.button}>확인</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default NoticePopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 0,
    alignItems: "center",
    overflow: "hidden",
  },
  title: {
    fontSize: 15,
    color: Colors.yellow700,
    fontFamily: "Cafe24Ssurrondair",
    marginTop: 20,
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    paddingVertical: 10,
    position: "relative",
  },
  picker: {
    width: 60,
    height: 130, 
  },
  itemText: {
    fontSize: 30,         
    color: "#82754F",
    textAlign: "center",
    height: 28,           
    lineHeight: 28,       
    paddingVertical: 10,

  },
  selectedIndicator: {
    backgroundColor: "transparent",
  },  
  buttonContainer: {
    flexDirection: "row",
    borderColor: "#eee",
    width: "100%",
    height: 50,
  },
  button: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Cafe24Ssurrondair",
    color: Colors.yellow400,
    textAlign: "center",
    lineHeight: 50,
  },
  buttonDivider: {
    width: 1,
    marginVertical: 13,
    backgroundColor: Colors.yellow400,
  },
  line: {
    paddingHorizontal: 20,
    position: "absolute",
    top: "50%",
    left: 45,
    right: 45,
    height: 3,
    borderRadius: 20,
    backgroundColor: Colors.pointColor,
    zIndex: 10,
    transform: [{ translateY: -5 }],
  },
  lineBottom: {
    position: "absolute",
    top: "50%",
    left: 45,
    right: 45,
    height: 3,
    borderRadius: 20,
    backgroundColor: Colors.pointColor,
    zIndex: 10,
    transform: [{ translateY: 40 }],
  },
});
