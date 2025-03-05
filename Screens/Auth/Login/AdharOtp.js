import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
const AdharOtp = ({ route, navigation }) => {
  const { client_id = '',aadhaar_number, generateOtp = () => {} } = route.params || {};
  console.log('Adhar Otp : ', aadhaar_number);
  const Rest_API = Config.Rest_API;
  const box1 = useRef();
  const box2 = useRef();
  const box3 = useRef();
  const box4 = useRef();
  const box5 = useRef();
  const box6 = useRef();

  const [f1, setF1] = useState('');
  const [f2, setF2] = useState('');
  const [f3, setF3] = useState('');
  const [f4, setF4] = useState('');
  const [f5, setF5] = useState('');
  const [f6, setF6] = useState('');

  const [userOtp, setUserOtp] = useState('');
  const [count, setCount] = useState(60);
  const token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxODE4NDg1NSwianRpIjoiNDRmNzUyZDAtYzNiYy00MTQ1LThjOGItNWRjNjg3NzU2N2ZkIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmNvbXBseW1heEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxODE4NDg1NSwiZXhwIjoyMDMzNTQ0ODU1LCJlbWFpbCI6ImNvbXBseW1heEBzdXJlcGFzcy5pbyIsInRlbmFudF9pZCI6Im1haW4iLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.HZRqEIPUAx9VCS_FPoNaoMnWGcJkux8xLMjstMtNfZc';

  useEffect(() => {
    if (count > 0) {
      const interval = setInterval(() => {
        setCount(prevCount => prevCount - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [count]);

  useEffect(() => {
    const otp = `${f1}${f2}${f3}${f4}${f5}${f6}`;
    setUserOtp(otp);
  }, [f1, f2, f3, f4, f5, f6]);

  const VerifyOtp = async () => {
    try {
      const response = await axios.post(
        'https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp',
        { client_id: client_id, otp: userOtp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.success) {
        console.log('====================================');
        console.log("Ham hai");
        console.log('====================================');
        try {
            const res = await axios.post(`http://${Rest_API}:9000/usersroute/login`, {aadhaar_number});
            console.log('Login response:', res.data);
            await AsyncStorage.setItem('userId',res.data.userId);
            navigation.navigate('display');
        } catch (err) {
            console.error("Signup error =", err.response ? err.response.data : err.message);
            Alert.alert("Signup failed", err.response ? err.response.data.message : "An unexpected error occurred.");
        }
      }
    } catch (err) {
      console.log("Otp Error :", err);
    }
  };

  const ResendOtp=()=>{
    count == 0 && setCount(60);
    generateOtp();
  }

  return (
    <View style={styles.Body}>
      <Text style={styles.heading}>OTP Verification</Text>
      <View style={styles.otp_box}>
        <TextInput
          style={[styles.box, { borderColor: f1.length == 0 ? 'grey' : 'blue' }]}
          ref={box1}
          keyboardType="number-pad"
          maxLength={1}
          value={f1}
          onChangeText={txt => {
            setF1(txt);
            if (txt.length >= 1) box2.current.focus();
          }}
        />
        <TextInput
          style={[styles.box, { borderColor: f2.length == 0 ? 'grey' : 'blue' }]}
          ref={box2}
          keyboardType="number-pad"
          maxLength={1}
          value={f2}
          onChangeText={txt => {
            setF2(txt);
            if (txt.length >= 1) box3.current.focus();
          }}
        />
        <TextInput
          style={[styles.box, { borderColor: f3.length == 0 ? 'grey' : 'blue' }]}
          ref={box3}
          keyboardType="number-pad"
          maxLength={1}
          value={f3}
          onChangeText={txt => {
            setF3(txt);
            if (txt.length >= 1) box4.current.focus();
          }}
        />
        <TextInput
          style={[styles.box, { borderColor: f4.length == 0 ? 'grey' : 'blue' }]}
          ref={box4}
          keyboardType="number-pad"
          maxLength={1}
          value={f4}
          onChangeText={txt => {
            setF4(txt);
            if (txt.length >= 1) box5.current.focus();
          }}
        />
        <TextInput
          style={[styles.box, { borderColor: f5.length == 0 ? 'grey' : 'blue' }]}
          ref={box5}
          keyboardType="number-pad"
          maxLength={1}
          value={f5}
          onChangeText={txt => {
            setF5(txt);
            if (txt.length >= 1) box6.current.focus();
          }}
        />
        <TextInput
          style={[styles.box, { borderColor: f6.length == 0 ? 'grey' : 'blue' }]}
          ref={box6}
          keyboardType="number-pad"
          maxLength={1}
          value={f6}
          onChangeText={txt => {
            setF6(txt);
            if (txt.length < 1) {
              box5.current.focus();
            } else {
              box6.current.blur(); // Close the keyboard after the last input
            }
          }}
          
        />
      </View>
      <View style={styles.resend_view}>
        <Text
          style={[styles.resend, { color: count == 0 ? '#08910f' : 'grey' }]}
          onPress={ResendOtp}
        >
          Resend OTP
        </Text>
        {count > 0 && <Text style={styles.resend}>{count}</Text>}
      </View>
      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: userOtp.length !== 6 ? '#8e9db1' : '#3c69a4' },
        ]}
        onPress={VerifyOtp}
        disabled={userOtp.length !== 6}
      >
        <Text style={styles.verify_text}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdharOtp;

const styles = StyleSheet.create({
  Body: {
    width: '100%',
    height: 900,
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    marginTop: 100,
  },
  otp_box: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 70,
  },
  box: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
  },
  resend_view: {
    flexDirection: 'row',
    marginTop: 20,
  },
  resend: {
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 10,
  },
  btn: {
    height: 40,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    marginTop: 50,
  },
  verify_text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});