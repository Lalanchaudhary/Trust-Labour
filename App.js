import { PermissionsAndroid, Platform, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import StartScreen from './Screens/StartScreen';
import OtpScreen from './Screens/Auth/SignUp/OtpScreen';
import Adhar from './Screens/Auth/SignUp/Adhar';
import Profile from './Screens/Home/Profile';
import BottomLayout from './BottomLayout';
import Signup from './Screens/Auth/SignUp/Signup';
import ProfileImage from './Screens/Auth/SignUp/ProfileImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login  from './Screens/Auth/Login/AdharLogin';
import AdharOtp from './Screens/Auth/Login/AdharOtp';
import UserProfile from './Screens/UserProfileComponent/UserProfile';
import ChatRoom from './Screens/Home/ChatRoom';
import Notification from './Screens/Home/Notification';
import TopLayout from './TopLayout';
// import messaging from '@react-native-firebase/messaging';
const Stack = createStackNavigator();

// async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Notification permission granted.');
//   } else {
//     console.log('Notification permission denied.');
//   }
// }


// async function requestAndroidPermissions() {
//   if (Platform.OS === 'android' && Platform.Version >= 33) {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//     );

//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('POST_NOTIFICATIONS permission granted');
//     } else {
//       Alert.alert('Permission Required', 'Please allow notifications in settings.');
//     }
//   }
// }

const App = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // To manage loading state

  // useEffect(() => {
  //   requestUserPermission();
  //   requestAndroidPermissions();
  // }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
      setIsLoading(false);
    };

    fetchUserId();
  }, []);

  if (isLoading) {

    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!userId ? 'start' : 'display'}>
        <Stack.Screen
          name='start'
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='login'
          component={Login}
          options={{ headerShown: false }}
        />

<Stack.Screen
          name='userProfile'
          component={UserProfile}
          options={{ headerShown: false }}
        />

<Stack.Screen
          name='Profile'
          component={Profile}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='adharOtp'
          component={AdharOtp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='ProfileImage'
          component={ProfileImage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='signup'
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='display'
          component={TopLayout}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Otp'
          component={OtpScreen}
        />
        <Stack.Screen
          name='Adhar'
          component={Adhar}
        />
                <Stack.Screen
          name='ChatRoom'
          component={ChatRoom}
          options={{ headerShown: false }}
        />
                        <Stack.Screen
          name='Notification'
          component={Notification}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
