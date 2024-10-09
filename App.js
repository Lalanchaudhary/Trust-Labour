import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import StartScreen from './Screens/StartScreen';
import OtpScreen from './Screens/OtpScreen';
import Adhar from './Screens/Adhar'
import Profile from './Screens/Profile';
import BottomLayout from './BottomLayout';
const App = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name='start' component={StartScreen} options={{
        headerShown:false
      }} />
      <Stack.Screen name='display' component={BottomLayout}  options={{
        headerShown:false
      }} />
      <Stack.Screen name='Otp' component={OtpScreen} />
      <Stack.Screen name='Adhar' component={Adhar} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App