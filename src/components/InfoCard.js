import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or use any icon set

const handleReport = () => {
  Alert.prompt(
    'Report an issue?',
    'Would you like to report an issue?',
    [
      { 
        text: 'Cancel', 
        style: 'cancel' 
      },
      { 
        text: 'Submit', 
        onPress: (text) => {
          if (text && text.trim()) {
            Alert.alert(
              'Thanks!', 
              'Your report has been submitted!',
              [{ text: 'OK', style: 'default' }]
            );
          } else {
            Alert.alert('Error', 'Please enter a report before submitting.');
          }
        }
      }
    ],
    'plain-text',
    '', 
    'default' 
  );
};


const InfoCard = ( {address, websiteURL, phoneNumber}) => {
    // A function that asks if you want to go to website then if yes, opens the website
    const openWebsite = (url) => {
  Alert.alert('Leave App?', 'Are you sure you want to visit this website?',[{
        text: 'Cancel',
        style: 'cancel',
      },{
        text: 'Yes',
        onPress: () => {
          Linking.openURL(url).catch(err =>
            console.error('Failed to open URL:', err)
          );
        },},],{ cancelable: true });};

    // A function that asks if you want to call then if yes, opens the phone dialer

const confirmAndCall = (phoneNumber) => {
  Alert.alert('Call this number?', `Would you like to call ${phoneNumber}?`,[{
        text: 'Cancel',
        style: 'cancel',
      },{
        text: 'Call',},],{ cancelable: true });};

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.option} onPress={() => openWebsite("https://www.google.com/maps/place/" + address)}>
        <Ionicons name="location-outline" size={20} color="black" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Address</Text>
          <Text style={styles.optionSubText}>{address}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => confirmAndCall(phoneNumber)}>
        <Ionicons name="call-outline" size={20} color="black" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Call</Text>
          <Text style={styles.optionSubText}>{phoneNumber}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => openWebsite(websiteURL)}>
        <Ionicons name="globe" size={20} color="black" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Visit Website</Text>
          <Text style={styles.optionSubText}>{websiteURL}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={()=> handleReport()}>
        <Ionicons name="alert-circle-outline" size={20} color="black" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Report an Issue</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginVertical: 12,
    marginHorizontal: -10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingVertical: 12, // Increased padding for better touch targets
    paddingHorizontal: 8, // Ensures space between icon/text and edges
    paddingBottom: -12,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  optionText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  optionSubText: {
    fontSize: 14,
    color: '#777',
  },
});

export default InfoCard;
