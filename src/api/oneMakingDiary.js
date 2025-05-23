import axios from "axios";

export const getDayDiary = async (data) => {
  try {
    const response = await axios.post(
      "https://2c2b-61-101-24-241.ngrok-free.app/api/v1/day-diary",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("에러 발생:", error);
  }
};
