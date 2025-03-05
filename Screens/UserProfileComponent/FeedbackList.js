import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import Star from 'react-native-vector-icons/AntDesign'
import axios from "axios";
import Config from 'react-native-config';
const FeedbackList = ({ userId , setShowRating}) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const Rest_API = Config.Rest_API;
    console.log('====================================');
    console.log(userId);
    console.log('====================================');
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`http://${Rest_API}:9000/feedback//get-feedback/${userId}`);
        setFeedback(response.data);
        if (response.data.length > 0) {
          const totalRating = response.data.reduce((sum, feedback) => sum + feedback.rating, 0);
          const avgRating = totalRating / response.data.length;
          setShowRating(avgRating); // Keep one decimal place
        } else {
          setShowRating(0); // No feedback case
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch feedback");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [userId]);

  if (loading) return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users Feedback</Text>
      {feedback.length === 0 ? (
        <Text style={styles.noFeedback}>No feedback available.</Text>
      ) : (
        feedback.map((item)=>{
          return ( 
          <View style={styles.feedbackItem} key={item._id}>
            <Image source={{ uri: item.sender.image }} style={styles.avatar} />
            <View style={styles.textContainer}>
              <View style={{flexDirection:'row', alignItems:'center',gap:10}}>
              <Text style={styles.senderName}>{item.sender.full_name}</Text>
              <Text style={styles.message}>{item.rating}<Star name="star" style={{color:'green'}} /></Text>
              </View>
              <Text style={styles.message}>{item.comment}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
          )
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom:200,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  noFeedback: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },
  feedbackItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#555",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
});

export default FeedbackList;
