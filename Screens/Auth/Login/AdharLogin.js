import React, { useEffect, useRef, useState } from 'react';
import { Button, View, StyleSheet, Alert, Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios'; // Import axios
import Adhar from '../../../Assets/adhar.png';
import { useNavigation } from '@react-navigation/native';

const AdharLogin = () => {
  const navigation = useNavigation();
  const [aadharParts, setAadharParts] = useState({ first: '', second: '', third: '' });
  const [loading, setLoading] = useState(false);
  const box1 = useRef();
  const box2 = useRef();
  const box3 = useRef();
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxODE4NDg1NSwianRpIjoiNDRmNzUyZDAtYzNiYy00MTQ1LThjOGItNWRjNjg3NzU2N2ZkIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmNvbXBseW1heEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxODE4NDg1NSwiZXhwIjoyMDMzNTQ0ODU1LCJlbWFpbCI6ImNvbXBseW1heEBzdXJlcGFzcy5pbyIsInRlbmFudF9pZCI6Im1haW4iLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.HZRqEIPUAx9VCS_FPoNaoMnWGcJkux8xLMjstMtNfZc";
  const [optGenerator, setOtpGenerator] = useState(false);
  const [clientId, setClientId] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');

  // Handle the individual parts of the Aadhaar number
  const handleAadharChange = (part, value) => {
    setAadharParts({ ...aadharParts, [part]: value });
  };

  // Function to generate OTP
  const generateOtp = async () => {
    const fullAadharNumber = `${aadharParts.first}${aadharParts.second}${aadharParts.third}`;
    
    if (fullAadharNumber.length !== 12) {
      Alert.alert("Invalid Aadhaar Number", "Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        "https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp",
        { id_number: fullAadharNumber },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        setOtpGenerator(true);
        setClientId(response.data.data.client_id);
        navigation.navigate('adharOtp', { client_id: response.data.data.client_id,aadhaar_number:fullAadharNumber});
        navigation.setOptions({
          generateOtp: generateOtp,
        });
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to generate OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fullAadharNumber = `${aadharParts.first}${aadharParts.second}${aadharParts.third}`;
    setAadharNumber(fullAadharNumber);
  }, [aadharParts]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
        <Image source={Adhar} style={styles.cardImage} />
        <View style={styles.cardContainer}>
          <View style={styles.cardNumberView}>
          <Text style={styles.adharcard}>Aadhaar Card</Text>
            <TextInput
              ref={box1}
              style={styles.cardField}
              placeholder="xxxx"
              keyboardType='number-pad'
              value={aadharParts.first}
              maxLength={4}
              onChangeText={(value) => { handleAadharChange('first', value); if (value.length === 4) box2.current.focus(); }}
            />
            <TextInput
              ref={box2}
              style={styles.cardField}
              placeholder="xxxx"
              keyboardType='number-pad'
              value={aadharParts.second}
              maxLength={4}
              onChangeText={(value) => { handleAadharChange('second', value); if (value.length === 4) box3.current.focus(); else if (value.length === 0) box1.current.focus(); }}
            />
            <TextInput
              ref={box3}
              style={styles.cardField}
              placeholder="xxxx"
              keyboardType='number-pad'
              value={aadharParts.third}
              maxLength={4}
              onChangeText={(value) => { handleAadharChange('third', value); if (value.length === 0) box2.current.focus(); }}
            />
          </View>

          <View style={styles.payment_box}>
            <TouchableOpacity style={styles.payment_button} onPress={generateOtp} disabled={loading}>
              <Text style={styles.payment_button_text}>
                {loading ? "Processing..." : "PROCEED"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0e0e0' },
  cardContainer: { flex: 1, borderWidth: 0.5, backgroundColor: '#fff', padding: 25, borderTopEndRadius: 45, borderTopLeftRadius: 45, justifyContent: 'center' },
  cardImage: { height: 250, width: '90%', margin: 'auto', marginVertical: 50 },
  cardNumberView: { flexDirection: 'row', borderWidth: 0.8, paddingHorizontal: 50, justifyContent: 'center', borderRadius: 7, marginBottom: 20 ,position:'relative'},
  adharcard: { position: 'absolute', paddingHorizontal: 5, top:-10, left: 20, backgroundColor: '#fff', zIndex: 2 },
  cardField: { fontSize: 18, color: 'black' },
  payment_button: { backgroundColor: '#3c69a4', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 35, marginTop: 20 },
  payment_button_text: { color: '#fff', fontSize: 16, textAlign: 'center' },
});

export default AdharLogin;
