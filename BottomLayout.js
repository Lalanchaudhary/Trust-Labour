import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Home from './Screens/Home/Home';
import Profile from './Screens/Home/Profile';

const BottomLayout = () => {
  const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator  screenOptions={{
        tabBarStyle:styles.bottom_container,
        tabBarShowLabel:false,
        headerShown:false
      }}>
        <Tab.Screen 
          name='Home' 
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.icon_View}>
                <Icon1 name="home" size={25} color={focused ? 'black' : 'grey'} />
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name='Profile' 
          component={Profile}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.icon_View}>
                <Icon1 name="user" size={25} color={focused ? 'black' : 'grey'} />
              </View>
            ),
          }}
        /> 
      </Tab.Navigator>
  );
}

export default BottomLayout;

const styles = StyleSheet.create({
  icon_View: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
