import React, { useEffect } from "react";
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
import TimePicker from "../../../../components/TimePicker";
import {
  setPeriod,
  setHour,
  setMinutes,
  resetAlarmTime,
} from "../../../../../redux/slices/alarmSlice";
import { updateAlarmApi } from "../../../../api/updateAlarm";

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

  useEffect(() => {
    dispatch(resetAlarmTime());
  }, [visible]);

  const handleConfirm = async () => {
    dispatch(setPeriod(selectedPeriod));
    dispatch(setHour(selectedHour));
    dispatch(setMinutes(selectedMinutes));
    console.log(selectedHour, selectedMinutes, selectedPeriod);
    // 문자열을 숫자로 변환
    let realHour = parseInt(selectedHour, 10);
    if (selectedPeriod === "오후" && realHour < 12) {
      realHour += 12;
    } else if (selectedPeriod === "오전" && realHour === 12) {
      realHour = 0; // 오전 12시는 00시로 처리
    }

    const realMinutes =
      selectedMinutes === "0" || selectedMinutes === 0
        ? "00"
        : selectedMinutes.toString().padStart(2, "0");

    const time = `${realHour}:${realMinutes}`;

    try {
      await updateAlarmApi(time);
      console.log("알람 시간 업데이트 성공");
    } catch (error) {
      console.error("알람 시간 업데이트 실패:", error);
    }
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
