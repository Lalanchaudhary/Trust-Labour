import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Avatar, Icon, Button, Rating } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ico2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/MaterialIcons'
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon5 from 'react-native-vector-icons/AntDesign'
import Icon6 from 'react-native-vector-icons/Feather'
import Config from 'react-native-config';
import LoaderKit from 'react-native-loader-kit'
import FeedbackList from '../UserProfileComponent/FeedbackList';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({});
      const [showRating, setShowRating] = useState(0);
  const Rest_API = Config.Rest_API;
  const getProfile = async () => {
    const userId = await AsyncStorage.getItem('userId');
    // const userId = parseInt(id, 16)
    console.log('====================================');
    console.log("profile :",userId);
    console.log('====================================');
    if (!userId) {
      console.log('No user ID found');
      return; // Handle the case where userId is null
    }


    try {
      const res = await axios.get(`http://${Rest_API}:9000/usersroute/profile/${userId}`);
      setUser(res.data);
    } catch (err) {
      console.log("Profile fetching error =", err);
      Alert.alert("Error", "Failed to fetch profile data.");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const logOut = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await AsyncStorage.removeItem("userId");
          navigation.navigate('start');
        }
      },
    ]);
  };

  // console.log('User profile data:', user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header with Icons */}
        <View style={styles.headerContainer}>
          <Ico2 name='arrow-with-circle-left' style={styles.backIcon} onPress={() => { navigation.goBack() }} />
        </View>

        {/* Profile Info */}
        {
          user ?
            <View>
              <View style={styles.profileContainer}>
                {
                  user.image && <Avatar
                    rounded
                    size="large"
                    source={{
                      uri: user.image,
                    }}
                  />
                }

                <Text style={styles.locationText}>{user.full_name}</Text>
                <Text style={styles.nameText}>{user.aadhaar_number}</Text>
                <Rating
                                    type="custom"
                                    ratingCount={5} // Total number of stars
                                    imageSize={25}
                                    ratingColor='green'
                                    startingValue={showRating}
                                    onFinishRating={(rating) => console.log("Selected Rating:", rating)}
                                    readonly
                                />
              </View>

              {/* Stats (Likes, Reviews, Feedback) */}
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>0.00</Text>
                  <Text style={styles.statLabel}>Likes</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>10</Text>
                  <Text style={styles.statLabel}>Reviews</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>0.00</Text>
                  <Text style={styles.statLabel}>Feedback</Text>
                </View>
              </View>

              <View style={styles.menuContainer}>
                <View style={styles.menuItem}>
                  <View style={{ flexDirection: 'row', gap: 20 }}>
                    <Icon3 name='call' size={24} />
                    <Text>{user.phone}</Text>
                  </View>
                  <Icon6 name='edit-2' size={20} />
                </View>

                <View style={styles.menuItem}>
                  <View style={{ flexDirection: 'row', gap: 20 }}>
                    <Icon4 name='email' size={24} />
                    <Text>{user.email}</Text>
                  </View>
                  <Icon6 name='edit-2' size={20} />
                </View>

                <View style={styles.menuItem}>
                  <View style={{ flexDirection: 'row', gap: 20 }}>
                    <Icon5 name='user' size={24} />
                    <Text>{user.gender}</Text>
                  </View>
                  <Icon6 name='edit-2' size={20} />
                </View>

                {/* <View style={styles.menuItem}>
            <Icon3 name='call' size={24} />
            <Text>{user.zip}</Text>
          </View> */}

                <TouchableOpacity style={styles.menuItem} onPress={logOut}>
                  <View style={{ flexDirection: 'row', gap: 20 }}>
                    <Icon3 name='logout' size={24} />
                    <Text>LogOut</Text>
                  </View>
                </TouchableOpacity>
                <FeedbackList userId={user._id} setShowRating={setShowRating} />
              </View>

            </View> : <LoaderKit
              style={{ width: 50, height: 50 ,margin:'auto',marginTop:300}}
              name={'BallPulse'}
              color={'green'} 
            />
        }
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  locationText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  menuContainer: {
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 20
  },
  menuText: {
    fontSize: 16,
  },
  backIcon: {
    position: 'absolute',
    fontSize: 25,
    left: 10,
    top: 10,
  },
});

export default Profile;
