import React, { useEffect, useRef, useState } from 'react';
import { Button, View, StyleSheet, Alert, Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ToastAndroid } from 'react-native';
import axios from 'axios'; // Import axios
import Adhar from '../Assets/adhar.png';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const [firstFour, setFirstFour] = useState('');
  const [secondFour, setSecondFour] = useState('');
  const [thirdFour, setThirdFour] = useState('');
  const box1 = useRef();
  const box2 = useRef();
  const box3 = useRef();
  const token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxODE4NDg1NSwianRpIjoiNDRmNzUyZDAtYzNiYy00MTQ1LThjOGItNWRjNjg3NzU2N2ZkIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmNvbXBseW1heEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxODE4NDg1NSwiZXhwIjoyMDMzNTQ0ODU1LCJlbWFpbCI6ImNvbXBseW1heEBzdXJlcGFzcy5pbyIsInRlbmFudF9pZCI6Im1haW4iLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.HZRqEIPUAx9VCS_FPoNaoMnWGcJkux8xLMjstMtNfZc';
  const [optGenerator, setOtpGenerator] = useState(false);
  const [clientId, setClientId] = useState("");
  const [aadharNumber, setAadharNumber] = useState('');
  const [aadharData, setAadharData] = useState('');
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
    confirm_password: ""
  });

  const changeHandler = (name, value) => {
    setUserDetail({ ...userDetail, [name]: value });
  };


  const generateOtp = async (e) => {
    try {
      const response = await axios.post(
        "https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp",
        { id_number: aadharNumber },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        setOtpGenerator(true);
        setClientId(response.data.data.client_id);
        navigation.navigate('Otp',{client_id:response.data.data.client_id});
      }
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(()=>{
    const aNumber=`${firstFour}${secondFour}${thirdFour}`
    setAadharNumber(aNumber);
  },[firstFour,secondFour,thirdFour])


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
        <Image source={Adhar} style={styles.cardImage} />
        <View style={styles.cardContainer}>
          <Text style={styles.adharcard}>Aadhaar Card</Text>
          <View style={styles.cardNumberView}>
            <TextInput ref={box1} style={styles.cardField} placeholder="xxxx" keyboardType='number-pad' value={firstFour} maxLength={4}
              onChangeText={(value) => { setFirstFour(value); if (value.length >= 4) box2.current.focus(); }} />
            <TextInput ref={box2} style={styles.cardField} placeholder="xxxx" keyboardType='number-pad' value={secondFour} maxLength={4}
              onChangeText={(value) => { setSecondFour(value); if (value.length >= 4) box3.current.focus(); else if (value.length < 1) box1.current.focus(); }} />
            <TextInput ref={box3} style={styles.cardField} placeholder="xxxx" keyboardType='number-pad' value={thirdFour} maxLength={4}
              onChangeText={(value) => { setThirdFour(value); if (value.length < 1) box2.current.focus(); }} />
          </View>

          <TextInput style={[styles.cardNumberView, { paddingHorizontal: 20 }]} placeholder='Enter email' value={userDetail.email}
            onChangeText={(txt) => changeHandler("email", txt)} />
          <TextInput style={[styles.cardNumberView, { paddingHorizontal: 20 }]} placeholder='Enter Password' secureTextEntry
            onChangeText={(txt) => changeHandler("password", txt)} />
          <TextInput style={[styles.cardNumberView, { paddingHorizontal: 20 }]} placeholder='Confirm Password' secureTextEntry
            onChangeText={(txt) => changeHandler("confirm_password", txt)} />

          <View style={styles.payment_box}>
            <TouchableOpacity style={styles.payment_button} onPress={generateOtp}>
              <Text style={styles.payment_button_text}>PROCEED</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0e0e0' },
  cardContainer: { flex: 1, borderWidth: 0.5, backgroundColor: '#fff', padding: 25, borderTopEndRadius: 45, borderTopLeftRadius: 45 },
  cardImage: { height: 250, width: '90%', margin: 'auto', marginVertical: 50 },
  cardNumberView: { flexDirection: 'row', borderWidth: 0.8, paddingHorizontal: 50, justifyContent: 'center', borderRadius: 7, marginBottom: 20 },
  adharcard: { position: 'absolute', paddingHorizontal: 5, top: -10, left: 20, backgroundColor: '#fff', zIndex: 2 },
  cardField: { fontSize: 18, color: 'black' },
  payment_button: { backgroundColor: '#3c69a4', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 35, marginTop: 20 },
  payment_button_text: { color: '#fff', fontSize: 16, textAlign: 'center' }
});

export default PaymentScreen;
