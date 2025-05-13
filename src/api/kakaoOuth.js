import { login } from "@react-native-seoul/kakao-login";
import { post } from "./index";

export const signInWithKaKao = async () => {
  try {
    const token = await login();
    console.log(token);
    const requestData = {
      accessToken: token.accessToken,
      providerId: "KAKAO",
    };
    console.log(requestData);
    const response = await post("/v1/auth/oauth/login", requestData);

    const data = response.data;
    console.log("서버 응답:", data);
    return data;
  } catch (err) {
    console.log(err);
  }
};
