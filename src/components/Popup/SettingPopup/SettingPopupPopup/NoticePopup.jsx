import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../../../../styles/color";
import { useDispatch, useSelector } from "react-redux";
import { setAlarmTime } from "../../../../../redux/slices/alarmSlice";
import TimePicker from "../../../../components/TimePicker";
import {
  setPeriod,
  setHour,
  setMinutes,
} from "../../../../../redux/slices/alarmSlice";

const { width } = Dimensions.get("window");

const NoticePopup = ({ visible, onClose }) => {
  const dispatch = useDispatch();

  const meridiemOptions = ["오전", "오후"];
  const hourOptions = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`
  );

  const selectedPeriod = useSelector((state) => state.alarm.period);
  const selectedHour = useSelector((state) => state.alarm.hour);
  const selectedMinutes = useSelector((state) => state.alarm.minutes);

  const handleConfirm = () => {
    dispatch(setPeriod(selectedPeriod));
    dispatch(setHour(selectedHour));
    dispatch(setMinutes(selectedMinutes));
    //나중에 api 추가
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.3}
      animationInTiming={400} // 나타나는 속도 (ms)
      animationOutTiming={400} // 사라지는 속도 (ms)
      onBackdropPress={onClose}
    >
      <View style={styles.wrapper}>
        <View style={styles.modal}>
          <Text style={styles.title}>알람 시간을 설정해주세요.</Text>
          <View style={styles.timeContainer}>
            <TimePicker
              AM_PM={meridiemOptions}
              HOURS={hourOptions}
              MINUTES={minuteOptions}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                borderRightWidth: 1,
                borderColor: Colors.yellow400,
              }}
            >
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
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  modal: {
    width: width * 0.85,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 0,
    alignItems: "center",
    justifyContent: "space-between",
    height: 350,
    overflow: "hidden",
  },
  title: {
    fontSize: 15,
    color: Colors.yellow700,
    fontFamily: "Cafe24Ssurrondair",
    marginTop: 20,
    marginBottom: 10,
  },
  timeContainer: {
    height: 150,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
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
});
