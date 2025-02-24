import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Colors from '../../../styles/color';

import { AuthSession } from "expo"
import { useNavigation } from '@react-navigation/native';
import KakaoLogin from './WebView/KakaoLogin';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log('Login attempt with:', username, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>로그인</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="아이디를 입력하세요"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <View style={styles.checkboxContainer}>
          <View style={styles.checkbox} />
          <Text style={styles.checkboxLabel}>아이디 저장</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={styles.link}>회원가입</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.link}>아이디 찾기</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.link}>비밀번호 찾기</Text>
        </View>

        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>SNS 간편 로그인</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>N</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>navigation.navigate("KakaoLogin")}
            style={styles.socialButton}>
              <Text style={styles.socialButtonText}>K</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>A</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: -20
  },
  header: {
    padding: 20,
    left: 0,
  },
  logo: {
    fontSize: 24,
    fontFamily: "Cafe24Ssurroundair",
  },
  inputContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: Colors.gray50,
    fontFamily: "Cafe24Ssurroundair",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 38,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 3.5,
    marginRight: 10,
  },
  checkboxLabel: {
    color: '#666',
    // marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#FFB74D',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  link: {
    color: '#666',
    padding: 10,
    fontFamily: "Cafe24Ssurroundair",
  },
  separator: {
    color: '#ddd',
    padding: 10,
  },
  socialContainer: {
    alignItems: 'center',
  },
  socialText: {
    color: '#666',
    marginBottom: 15,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;