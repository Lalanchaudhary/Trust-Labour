import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import man from "../../Assets/man.jpeg";
import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LoaderKit from "react-native-loader-kit";
import Ico2 from 'react-native-vector-icons/Entypo';
const Notification = ({navigation}) => {
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const Rest_API = Config.Rest_API;

  const getRequest = useCallback(async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      console.log("No user ID found");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://${Rest_API}:9000/feedback/get-request/${userId}`
      );
      console.log("Request data fetched successfully:", res.data);
      setRequest(res.data);
    } catch (err) {
      console.log("Profile fetching error =", err);
      Alert.alert("Error", "Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  }, [Rest_API]);

  useEffect(() => {
    getRequest();
  }, [getRequest,status]);

  if (loading) {
    return (
      <LoaderKit
        style={{ width: 50, height: 50, alignSelf: "center", marginTop: 300 }}
        name={"BallPulse"}
        color={"green"}
      />
    );
  }

  const handleRequest = async (requestId, newStatus) => {
    console.log('====================================');
    console.log("hello");
    console.log('====================================');
    try {
      const response = await axios.post(
        `http://${Rest_API}:9000/feedback/accept-request`,
        {
          requestId,
          status: newStatus,
        }
      );
      setStatus(response.data.message);
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  };

  return (
    <View style={styles.container}>
                <View style={styles.headerContainer}>
                  <Ico2 name='arrow-with-circle-left' style={styles.backIcon} onPress={() => { navigation.goBack() }} />
                </View>
      {(request || []).filter(req => req.status === "pending").length === 0 ? (
        <Text style={styles.noRequestText}>No requests</Text>
      ) : (
        (request || [])
          .filter(req => req.status === "pending")
          .map((req) => (
            <View key={req._id} style={styles.card}>
              {/* Profile Image */}
              <Avatar.Image size={50} source={man} />
  
              {/* User Details */}
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{req.sender?.full_name}</Text>
                <Text style={styles.title}>{req.sender?.email}</Text>
                <Text style={styles.date}>Today</Text>
              </View>
  
              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleRequest(req._id, "rejected")}
                >
                  <Icon name="close" size={22} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleRequest(req._id, "accepted")}
                >
                  <Icon name="check" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
      )}
    </View>
  );
  
};

// **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  backIcon: {
    position: 'absolute',
    fontSize: 25,
    left: 10,
    top: 10,
  },
  noRequestText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
    margin: 'auto',
  },  
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e8f4fc",
    borderRadius: 10,
    marginBottom: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    color: "#555",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  rejectButton: {
    backgroundColor: "#e6e6e6",
    padding: 8,
    borderRadius: 50,
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: "#0073b1",
    padding: 8,
    borderRadius: 50,
  },
});

export default Notification;
