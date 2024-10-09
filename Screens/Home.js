import React from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import logo from '../Assets/logo.png'
import man from '../Assets/man.jpeg'
import { Avatar, Icon, Button } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
const contacts = [
  {
    id: '1',
    name: 'Joe Belfiore',
    status: 'In a world far away',
    imageUrl: 'https://example.com/joe.jpg', // Replace with actual image URLs
    statusIcon: 'green',
  },
  {
    id: '2',
    name: 'Bill Gates',
    status: 'What I’m doing here?',
    imageUrl: 'https://example.com/bill.jpg',
    statusIcon: 'green',
  },
  {
    id: '3',
    name: 'Mark Zuckerberg',
    status: 'Really Busy, WhatsApp only',
    imageUrl: 'https://example.com/mark.jpg',
    statusIcon: 'red',
  },
  {
    id: '4',
    name: 'Marissa Mayer',
    status: 'In a rush to catch a plane',
    imageUrl: 'https://example.com/marissa.jpg',
    statusIcon: 'red',
  },
  {
    id: '5',
    name: 'Sundar Pichai',
    status: 'Do androids dream of electric sheep?',
    imageUrl: 'https://example.com/sundar.jpg',
    statusIcon: 'green',
  },
  {
    id: '6',
    name: 'Jeff Bezos',
    status: 'Counting Zeroes: Prime time.',
    imageUrl: 'https://example.com/jeff.jpg',
    statusIcon: 'red',
  },
];

const ContactList = () => {
  const navigation=useNavigation();
  const renderContact = ({ item }) => {
    return (
      <TouchableOpacity onPress={()=>{navigation.navigate('Profile')}}>
      <View style={styles.contactItem}>
        <Image source={man} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.starsContainer}>
            {/* Star Rating (5 stars) */}
            {[...Array(5)].map((_, i) => (
              <Icon key={i} name="star" type="ionicon" color="#f1c40f" size={16} />
            ))}
          </View>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: item.statusIcon }]} />
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="menu" size={28} color="black" />
        <Image source={logo} style={styles.header_logo} />
      </View>
      <View>
        <TextInput style={styles.searchbar} placeholder='Search' />
      </View>
      <View style={styles.sub_headings}>
        <Text style={{color:'black',fontWeight:'bold'}}>Job seeker</Text>
        <Text>Job Provider</Text>
      </View>
      {/* Contact List */}
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
      />

      {/* Floating Edit Button */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#f3f3f3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal:10,
    justifyContent:'space-between',
  },
  header_logo:{
    height:50,
    width:50
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  sub_headings:{
    flexDirection:'row',
    justifyContent:'space-around',
    marginVertical:40
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
  status: {
    color: 'gray',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3498db',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  searchbar:{
    height:40,
    borderWidth:0.5,
    paddingHorizontal:30,
    borderRadius:35
  }
});

export default ContactList;
