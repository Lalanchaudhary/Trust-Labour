import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Avatar, Icon, Button } from 'react-native-elements';

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header with Icons */}
        <View style={styles.headerContainer}>
          {/* <Icon name="arrow-back" type="ionicon" size={24} />
          <Icon name="settings" type="ionicon" size={24} /> */}
        </View>

        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <Avatar
            rounded
            size="large"
            source={{
              uri: 'https://randomuser.me/api/portraits/men/41.jpg',
            }}
          />
          <Text style={styles.locationText}>Johan Smith</Text>
          <Text style={styles.nameText}>1234  5678  9123</Text>
          <View style={styles.starsContainer}>
            {/* Star Rating (5 stars) */}
            {[...Array(5)].map((_, i) => (
              <Icon key={i} name="star" type="ionicon" color="#f1c40f" size={16} />
            ))}
          </View>
        </View>

        {/* Stats (Balance, Orders, Total Spent) */}
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

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          {[
            'Adhar Information',
            'PAN Information',
            'Phone Number',
            'Email',
            'Current Address',
            'Permanent Address',
            'Logout',
          ].map((option, index) => (
            <View key={index} style={styles.menuItem}>
              <Text style={styles.menuText}>{option}</Text>
              <Icon name="chevron-forward" type="ionicon" size={18} />
            </View>
          ))}
        </View>
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
    paddingHorizontal:35,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
  },
});

export default Profile;
