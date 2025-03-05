import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert, Touchable, TouchableOpacity, Image } from 'react-native';
import { Avatar, Icon, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ico2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialIcons'
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon5 from 'react-native-vector-icons/AntDesign'
import Icon6 from 'react-native-vector-icons/Feather'
import { TextInput } from 'react-native-gesture-handler';
const ChatRoom = ({ route, navigation }) => {
    //   const [user, setUser] = useState({});
    const { user } = route.params;

    // console.log('User profile data:', user);

    const HandleClick = () => {
        Alert.alert("You don't have Access for rate this profile")
    }

    return (
        <View style={styles.MainContainer}>
            <View style={styles.profileContainer}>
                <Icon5 name='left' style={styles.backIcon} onPress={() => { navigation.goBack() }} />
                {
                    user.image && <Image
                        rounded
                        style={styles.profile_image}
                        source={{
                            uri: user.image,
                        }}
                    />
                }
                <Text style={styles.profileName}>{user.full_name}</Text>
                <Ico2 name='call' style={styles.CallIcons} />
                <Ico2 name='videocam' style={styles.VideoCallIcons} />
            </View>
            <View style={styles.bodyContainer}>
                <View style={styles.recieveMessageBox}>
                    <Text style={styles.recieveMessageText}>Hello</Text>
                </View>
                <View style={styles.SendMessageBox}>
                    <Text style={styles.recieveMessageText}>Hello</Text>
                </View>
            </View>
            <View style={{ position: 'absolute', width: '100%', bottom: 20 }}>
                <View style={styles.InputFieldContainer}>
                    <TextInput placeholder='Type Message..' style={styles.TextField} />
                    <Icon6 name='send' style={styles.SendIcon} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    SendMessageBox:{
        padding:10,
        paddingHorizontal:20,
        backgroundColor:'#08910f',
        height:40,
        borderRadius:20,
        alignSelf:'flex-end',
        margin:14
    },
    recieveMessageText:{
        fontSize:16,
        fontWeight:'bold',
        color:'#fff'
    },
    recieveMessageBox: {
        padding:10,
        paddingHorizontal:20,
        backgroundColor:'#3b69a4',
        height:40,
        borderRadius:20,
        alignSelf:'flex-start',
        margin:14
    },
    SendIcon: {
        position: 'absolute',
        fontSize: 25,
        right: 18,
        top: 3.5,
        backgroundColor: '#DBD3D3',
        padding: 7,
        borderRadius: 40
    },
    InputFieldContainer: {
        position: 'relative',
    },
    TextField: {
        width: '94%',
        padding: 10,
        borderRadius: 30,
        marginHorizontal: 'auto',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    backIcon: {
        position: 'absolute',
        fontSize: 30,
        left: 10,
        top: 23,
        fontWeight: '900',
        zIndex: 999
    },
    profileContainer: {
        padding: 14,
        paddingLeft: 50,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    profile_image: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    profileName: {
        fontSize: 18,
        fontWeight: '800',
        color: 'grey'
    },
    CallIcons: {
        fontSize: 25,
        marginLeft: 40
    },
    VideoCallIcons: {
        fontSize: 28,
        marginLeft: 10
    },
    bodyContainer: {
        flex: 1,
        borderWidth: 1,
        display:'flex',
        // flexDirection:'row',
        position: 'relative',
    },
    MainContainer: {
        flex: 1,
        backgroundColor: '#DBD3D3',
        position: 'relative', 
    }

});

export default ChatRoom;
