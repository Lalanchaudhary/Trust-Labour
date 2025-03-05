import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
// Import Screens
import Home from './Screens/Home/Home';
import Profile from './Screens/Home/Profile';
import logo from './Assets/logo.png';
import { Image ,Icon, Avatar} from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';
import JobProvider from './Screens/Home/JobProvider';
const Tab = createMaterialTopTabNavigator();

export default function TopLayout() {
    const [search, setSearch] = useState('');
    const [userP, setUserP] = useState({});
    const [Loading, setLoading] = useState(false);
    const navigation=useNavigation();
        const Rest_API = Config.Rest_API;
    const getProfile = async () => {
      setLoading(true)
      const userId = await AsyncStorage.getItem('userId');
      // const userId = parseInt(id, 16)
      if (!userId) {
          console.log('No user ID found');
          return;
      }


      try {
          const res = await axios.get(`http://${Rest_API}:9000/usersroute/profile/${userId}`);
          // console.log('Profile data fetched successfully:', res.data);
          setUserP(res.data);
      } catch (err) {
          console.log("Profile fetching error =", err);
          // Alert.alert("Error", "Failed to fetch profile data.");
      }
      finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      getProfile();
  }, []);
  return (
    <View style={styles.container}>
      {/* 🔹 Your Custom Content Above the Navigator */}
      <View style={styles.header}>
      {userP.image && <Image source={{uri:userP.image}} style={styles.ProfileImage} onPress={()=>{navigation.navigate('Profile')}} />
                            }
        <View style={styles.IconView}>
          <TouchableOpacity>
        <Icon3 name="bell" size={26} onPress={() => { navigation.navigate('Notification') }} />
        </TouchableOpacity>
        <Image source={logo} style={styles.header_logo} />
        </View>
      </View>
      <View>
        <TextInput
          style={styles.searchbar}
          placeholder='Search'
          onChangeText={setSearch}
          value={search}
        />
      </View>

      {/* 🔹 Navigation Tabs Below */}
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
            tabBarStyle: { backgroundColor: '#f3f3f3' }, // Custom top bar color
            tabBarIndicatorStyle: { backgroundColor: '#fff' }, // Active tab underline
          }}
        >
          <Tab.Screen name="Job Seeker" component={Home} />
          <Tab.Screen name="Job Provider" component={JobProvider} />
        </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures full-screen layout
    paddingVertical:10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  header_logo: {
    height: 50,
    width: 50,
  },
  IconView:{
    flexDirection:'row',
    alignItems:'center',
    gap:10
  },
  sub_headings: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
  },
  searchbar: {
    height: 40,
    width:'94%',
    margin:'auto',
    borderWidth: 0.5,
    paddingHorizontal: 30,
    borderRadius: 35,
    marginBottom: 20,
  },
  ProfileImage:{
    height:46,
    width:46,
    borderRadius:23
  }
});
