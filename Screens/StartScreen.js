import {Image, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { createRStyle } from 'react-native-full-responsive';
import Logo from '../Assets/logo.png'
import { useNavigation } from '@react-navigation/native';
const SIZE = 20;
const FONT=16;
const StartScreen = () => {
  const navigation=useNavigation();
  return (
    <View style={styles.container}>
      <View>
      <Image style={styles.logo_image} source={Logo} />
      <Text style={styles.Heading_text}>TRUST LABOUR</Text>
      </View>
      <View style={styles.button_view}>
        <Text style={styles.sub_title}>A Good Reputation is more Valuable than Money</Text>
        <TouchableOpacity style={styles.Rgister_button} onPress={()=>{navigation.navigate("Adhar")}}>
          <Text style={styles.Rgister_button_text}>Register</Text>
        </TouchableOpacity>
        <Text>or</Text>
        <TouchableOpacity style={styles.Rgister_button} onPress={()=>{navigation.navigate("login")}}>
          <Text style={styles.Rgister_button_text}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default StartScreen

const styles = createRStyle({
  container:{
    flex:1,
    padding:`${SIZE}rs`,
    alignItems:'center',
    justifyContent:'space-between'
  },
  logo_image:{
    height:`${SIZE*10}rs`,
    width:`${SIZE*10}rs`,
  },
  Heading_text:{
    fontSize:`${FONT*2}rs`,
    fontWeight:'900',
    color:'black'
  },
  Rgister_button:{
    height:`${SIZE*2+5}rs`,
    width:`${SIZE*15}rs`,
    backgroundColor:'#3c69a4',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:`${SIZE*2}rs`
  },
  Rgister_button_text:{
    fontSize:`${FONT}rs`,
    color:'white',
    fontWeight:'bold'
  },
  button_view:{
    gap:5,
    alignItems:'center',
    marginBottom:40
  },
  sub_title:{
    fontWeight:'bold',
    marginBottom:20
  }
})