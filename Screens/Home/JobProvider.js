import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Icon, Button, Rating } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon2 from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import Config from 'react-native-config';
import LoaderKit from 'react-native-loader-kit'
import man from '../../Assets/man.jpeg';
import UseSocket from '../UseSocket';
import { AirbnbRating } from "react-native-ratings";
const JobProvider = () => {
  const socket=UseSocket();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterData, setFilteredData] = useState([]);
  const Rest_API = Config.Rest_API;
  useEffect(() => {
    console.log("Rest_API:", Rest_API); // Debugging step
  }, []);

  const getAllUser = async () => {
    try {
      const res = await axios.get(`http://${Rest_API}:9000/usersroute/users`);
      const sortedUsers = res.data.sort((a, b) => b.rating - a.rating);
      const filterData=sortedUsers.filter((user)=>{
        return user.userType=="Job Provider"
      })
      setUsers(filterData);
    } catch (err) {
      console.log("Profile fetching error =", err);
      Alert.alert("Error", "Failed to fetch profile data.");
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(
        users.filter(user => 
          (user.full_name && user.full_name.toLowerCase().includes(search.toLowerCase())) ||
          (user.aadhaar_number && user.aadhaar_number.toString().includes(search)) 
        )
      );
    } else {
      setFilteredData(users); // Set original users if search is empty
    }
  }, [search, users]);
  

  const navigation = useNavigation();
  const renderContact = ({ item }) => {
    return (
        <View style={styles.contactItem}>
          <TouchableOpacity onPress={() => { navigation.navigate('userProfile', { user: item }) }}>
          <Image source={{uri:item.image}} style={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.textContainer}>
          <TouchableOpacity onPress={() => { navigation.navigate('ChatRoom', { user: item }) }}>
            <View>
            <Text style={styles.name}>{item.full_name}</Text>
            <View style={styles.starsContainer}>
              <Text>{item.aadhaar_number}</Text>
            </View>
            </View>
            </TouchableOpacity>
          </View>
          <Text>{item.rating}<Icon2 name='star' color={"green"} size={14} /></Text>
          
        </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      {/* Contact List */}
      {
        filterData?
              <FlatList
              data={filterData}
              renderItem={renderContact}
              keyExtractor={(item) => item._id}
            />:
            <LoaderKit
                    style={{ width: 50, height: 50 ,margin:'auto',marginTop:150 }}
                    name={'BallPulse'}
                    color={'green'} 
                  />
        
      }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#f3f3f3',
    paddingTop:30
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },

  userLabel:{
    borderWidth:1,
    borderColor:'gray'
  }
});

export default JobProvider;
