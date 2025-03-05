import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View, Image, PermissionsAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Ico2 from 'react-native-vector-icons/Entypo';
import Profile from '../../../Assets/profile.png';
import { useState, useEffect } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
function ProfileImage({ route, navigation }) {
    const { data } = route.params;
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [fullData, setFullData] = useState({
        full_name: data.full_name,
        aadhaar_number: data.aadhaar_number,
        dob: data.dob,
        gender: data.gender,
        country:data.address.country,
        state:data.address.state,
        dist:data.address.dist,
        loc:data.address.loc,
        zip: data.zip,
        phone: data.phone,
        email: data.email,
        password: data.password,
        image: '',
        userType:data.userType
    });

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message: "This app needs access to your camera",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const openCamera = async () => {
        if (Platform.OS === 'android') {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
                Alert.alert("Camera permission denied");
                return;
            }
        }

        const options = {
            mediaType: 'photo',
            cameraType: 'back',
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                Alert.alert('Error', response.errorMessage || 'Something went wrong');
            } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                setImageUri(uri);
            }
        });
    };

    const selectImage = () => {
        launchImageLibrary({}, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    const saveImage = async () => {
        if (!imageUri) {
            Alert.alert('No image selected');
            return;
        }
        setLoading(true);

        try {
            // Extract the file name from the image URI
            const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
            const reference = storage().ref(fileName); // Create a reference to Firebase Storage
            
            // Upload the image
            const task = reference.putFile(imageUri);

            // Monitor upload progress
            task.on('state_changed', taskSnapshot => {
                console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            });

            await task;
            const downloadURL = await reference.getDownloadURL(); // Get the image's download URL from Firebase Storage
            setImageUrl(downloadURL);
            setFullData({ ...fullData, image: downloadURL });
            Alert.alert('Image uploaded successfully!', `Image available at: ${downloadURL}`);
            console.log('Download URL:', downloadURL);
        } catch (error) {
            Alert.alert('An error occurred while uploading:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (imageUri) {
            saveImage(); // Save image automatically after selecting or taking a new one
        }
    }, [imageUri]);
    const Rest_API = Config.Rest_API;
    const handleSubmit = async () => {
        console.log('Submitting data:', fullData);
        try {
            const res = await axios.post(`http://${Rest_API}:9000/usersroute/signup`, fullData);
            console.log('Signup response:', res);
            await AsyncStorage.setItem('userId',res.data.userId);
            navigation.navigate('display');
        } catch (err) {
            console.error("Signup error =", err.response ? err.response.data : err.message);
            Alert.alert("Signup failed", err.response ? err.response.data.message : "An unexpected error occurred.");
        }
    };
    

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView>
                <Ico2 name='arrow-with-circle-left' style={styles.backIcon} onPress={() => { navigation.goBack() }} />
                <Image source={imageUri ? { uri: imageUri } : Profile} style={styles.profileImage} />
                <View style={{ marginBottom: 30 }}>
                    <Text style={styles.upload} onPress={selectImage}>Upload a Photo</Text>
                    <Text style={{ textAlign: 'center' }}>From your phone</Text>
                </View>
                <View>
                    <Text style={styles.upload} onPress={openCamera}>Take a Photo</Text>
                    <Text style={{ textAlign: 'center' }}>With your camera</Text>
                </View>
                <TouchableOpacity style={styles.next_btn} onPress={handleSubmit}>
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btn_text}>FINISH</Text>}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default ProfileImage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    backIcon: {
        position: 'absolute',
        fontSize: 25,
        left: 20,
        top: 20,
    },
    profileImage: {
        height: 150,
        width: 150,
        margin: 'auto',
        marginVertical: 70
    },
    next_btn: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3c69a4',
        borderRadius: 30,
        marginVertical: 50,
        gap: 10,
    },
    btn_text: {
        color: 'white',
        fontSize: 16,
    },
    upload: {
        fontSize: 20,
        fontWeight: '700',
        color: '#3c69a4',
        textAlign: 'center'
    }
});
