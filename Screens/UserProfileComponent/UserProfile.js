import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert, Dimensions, Keyboard, Touchable, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native';
import { Avatar, Icon, Button, Rating, } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ico2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/MaterialIcons'
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon5 from 'react-native-vector-icons/AntDesign'
import Icon6 from 'react-native-vector-icons/Feather'
import Config from 'react-native-config';
import UseSocket from '../UseSocket';
import { TextInput } from 'react-native-gesture-handler';
import LoaderKit from 'react-native-loader-kit'
import ProfileImage from '../../Assets/profile.png';
import { AirbnbRating } from "react-native-ratings";
import Modal from "react-native-modal";
import IconCross from "react-native-vector-icons/MaterialIcons";
import FeedbackList from './FeedbackList';
const UserProfile = ({ route, navigation }) => {
    const [userP, setUserP] = useState({});
    const [Loading, setLoading] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [showRating, setShowRating] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [status, setStatus] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const inputRef = useRef(null);
    const socket = UseSocket();
    const { user } = route.params;
    const Rest_API = Config.Rest_API;
    // console.log('User profile data:', user);
    const HandleClick = async (receiverId) => {
        try {
            const userId = await AsyncStorage.getItem('userId');

            if (!userId) {
                Alert.alert("Error", "User ID not found. Please log in again.");
                return;
            }

            // Emit event via socket (Ensure socket is connected)
            if (socket && socket.connected) {
                socket.emit("friend-request", { userId, receiverId });
            } else {
                console.warn("Socket is not connected");
            }

            // Ensure Rest_API is defined properly
            if (!Rest_API) {
                console.error("Rest_API is undefined");
                Alert.alert("Error", "Server URL is not set.");
                return;
            }

            // Make API request
            const res = await axios.post(`http://${Rest_API}:9000/feedback/send-request`, {
                userId,
                receiverId
            });

            console.log("Friend Request Response:", res.data);
            Alert.alert("Success", "Friend request sent successfully!");

        } catch (err) {
            console.error("Friend Request Error:", err?.response?.data || err.message);
            Alert.alert("Error", err?.response?.data?.message || "Something went wrong. Please try again.");
        }
    };


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
            Alert.alert("Error", "Failed to fetch profile data.");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);
    useEffect(() => {
        if (status && inputRef.current) {
            inputRef.current.focus(); // Step 2: Focus input when status is true
        }
    }, [status]);

    const handleRating = (value) => {
        setRating(value);
        console.log("Rated:", value); // You can send this value to your backend
    };

    const HandleStatus = async () => {
        setLoading(true)
        try {
            const userId = await AsyncStorage.getItem('userId');

            if (!userId || !user._id) {
                Alert.alert("Error", "User ID not found. Please log in again.");
                return;
            }

            const res = await axios.get(`http://${Rest_API}:9000/feedback/request-status`, {
                params: { userId, receiverId: user._id } // Assuming `user._id` is the receiver's ID
            });

            if (res.data.status === "accepted") {
                setStatus(true);
            } else {
                setStatus(false);
                setIsVisible(true);
            }
        } catch (err) {
            console.error("Request Status Error:", err?.response?.data || err.message);
            Alert.alert("Error", "Failed to check request status. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        try {
            const response = await axios.post(`http://${Rest_API}:9000/feedback/send-feedback`, {
                senderId: userId,
                receiverId: user._id,
                comment,
                rating,
            });

            if (response.status === 201) {
                try {
                    const response = await axios.put(`http://${Rest_API}:9000/usersroute/update`, {
                      id:user._id,
                      rating: Number(showRating), // Ensure rating is a number
                    });
                    console.log('====================================');
                    console.log("done");
                    console.log('====================================');
                  } catch (error) {
                    setMessage(error.response?.data?.message || "Something went wrong!");
                  }
                alert("Feedback sent successfully!");
                setComment("");
                setRating(0);
                setStatus(false)
            }
        } catch (err) {
            console.log('====================================');
            console.log(err);
            console.log('====================================');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`http://${Rest_API}:9000/feedback//get-feedback/${user._id}`);
                setFeedbacks(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch feedback");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);


    useEffect(() => {
        // Listener for when the keyboard opens
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsKeyboardOpen(true);
        });

        // Listener for when the keyboard hides
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyboardOpen(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={isKeyboardOpen ? 60 : 0}
            style={{ flex: 1 }}
        >
            {
                !Loading ?
                    <ScrollView style={styles.container} >
                        <View style={styles.headerContainer}>
                            <Ico2 name='arrow-with-circle-left' style={styles.backIcon} onPress={() => { navigation.goBack() }} />
                        </View>

                        {/* Profile Info */}
                        <View style={styles.profileContainer}>
                            {user.image ? (
                                <Avatar
                                    rounded
                                    size="large"
                                    source={{
                                        uri: user.image,
                                    }}
                                />
                            ) : (
                                <Avatar
                                    rounded
                                    size="large"
                                    title={user.full_name?.charAt(0) || '?'}
                                    containerStyle={{ backgroundColor: '#ccc' }}
                                />
                            )}
                            <Text style={styles.locationText}>{user.full_name}</Text>
                            <Text style={styles.nameText}>{user.aadhaar_number}</Text>
                            <View>
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
                        </View>

                        {/* Stats (Likes, Reviews, Feedback) */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>0.00</Text>
                                <Text style={styles.statLabel}>Likes</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>10</Text>
                                <Text style={styles.statLabel}>Friends</Text>
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
                            </View>

                            <View style={styles.menuItem}>
                                <View style={{ flexDirection: 'row', gap: 20 }}>
                                    <Icon4 name='email' size={24} />
                                    <Text>{user.email}</Text>
                                </View>
                            </View>

                            <View style={styles.menuItem}>
                                <View style={{ flexDirection: 'row', gap: 20 }}>
                                    <Icon5 name='home' size={24} />
                                    <Text>{user.zip} {user.loc},{user.dist},{user.country}</Text>
                                </View>
                            </View>

                            <View style={styles.menuItem}>
                                <View style={{ flexDirection: 'row', gap: 20 }}>
                                    <Icon5 name='user' size={24} />
                                    <Text>{user.gender}</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.rate_product} onPress={HandleStatus}>
                            <Text style={styles.btn_text}>Rate Profile</Text>
                        </TouchableOpacity>
                        <FeedbackList userId={user._id} setShowRating={setShowRating} />
                    </ScrollView> : <LoaderKit
                        style={{ width: 50, height: 50, margin: 'auto', marginTop: 300 }}
                        name={'BallPulse'}
                        color={'green'}
                    />
            }

            {
                status ? <View style={styles.inputView}>
                    <View style={{ alignItems: "center", }}>
                        <AirbnbRating
                            count={5}
                            defaultRating={rating}
                            size={30}
                            onFinishRating={handleRating}
                        />
                        <Text style={{ marginVertical: 10, fontSize: 16 }}>Your Rating: {rating}</Text>
                    </View>
                    <View style={styles.inputViewInner}>
                        <Image
                            source={userP?.image ? { uri: userP.image } : ProfileImage}
                            style={styles.userImage}
                            onError={() => console.log('Image load error')}
                        />

                        <TextInput
                            style={styles.inputComment}
                            placeholder="Write a comment..."
                            ref={inputRef}
                            value={comment}
                            onChangeText={setComment}
                        />

                        <Icon6 name='send' style={styles.sendIcon} onPress={handleSubmit} />
                    </View>
                </View> : <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
                    <View style={styles.modalContainer}>
                        {/* Close Icon in Corner */}
                        <TouchableOpacity style={styles.closeButton} onPress={() => setIsVisible(false)}>
                            <IconCross name="close" size={24} color="black" />
                        </TouchableOpacity>

                        {/* Message */}
                        <Text style={styles.messageText}>You don't have access to Rate this Profile</Text>

                        {/* Send Request Button */}
                        <TouchableOpacity style={styles.requestButton} onPress={() => { HandleClick(user._id) }}>
                            <Text style={styles.requestButtonText}>Send Request</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            }
        </KeyboardAvoidingView>
    );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        padding: 5,
    },
    messageText: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
        fontWeight: "bold",
        maxWidth: 250,
    },
    requestButton: {
        backgroundColor: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: "80%",
        alignItems: "center",
    },
    requestButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    openButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    userImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        // backgroundColor: 'black',
    },
    inputComment: {
        padding: 7,
        paddingHorizontal: 20,
        borderRadius: 30,
        zIndex: 10,
        width: '78%',
        backgroundColor: "#e6e9ee"
    },
    inputViewInner: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 5,
    },
    inputView: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        // top: 654,
        padding: 5,
        backgroundColor: 'white',
        zIndex: 9,
        borderTopWidth: 0.5
    },
    commentText: {
        margin: 5,
        fontSize: 15
    },
    sendIcon: {
        fontSize: 30,
        color: 'black'
    },
    commentImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: 'black'
    },
    commentContainer: {
        padding: 15,
        borderWidth: 1,
        width: '90%',
        marginHorizontal: 'auto',
        marginVertical: 10,
        borderRadius: 15,
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
        width: '100%',
    },
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
    rate_product: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'blue',
        borderWidth: 0.7,
        width: '56%',
        margin: 'auto',
        borderRadius: 8,
        marginVertical: 30
    },
    btn_text: {
        fontSize: 16,
        color: 'blue'
    }
});

export default UserProfile;
