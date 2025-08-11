import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or use any icon set

const InfoCard = () => {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.option}>
        <Ionicons name="location-outline" size={20} color="black" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Address</Text>
          <Text style={styles.optionSubText}>1234 Some St, City, State, 12345</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Ionicons name="call-outline" size={20} color="black" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Call</Text>
          <Text style={styles.optionSubText}>(123) 456-7890</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Ionicons name="menu-outline" size={20} color="black" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>View Menu</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Ionicons name="logo-web" size={20} color="black" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>Visit Website</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
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
    marginHorizontal: 16,
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
    marginBottom: 16,
    paddingVertical: 12, // Increased padding for better touch targets
    paddingHorizontal: 8, // Ensures space between icon/text and edges
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
