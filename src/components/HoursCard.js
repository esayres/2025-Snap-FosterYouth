import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or use any icon set



const HoursCard = () => {
    console.log("Rendering HoursCard component"); // Debugging log
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={toggleExpanded} style={styles.header}>
        <Text style={styles.headerText}>Open Now</Text>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#333" />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.text}>Mon - Thu 11:00 AM - 10:00 PM</Text>
          <Text style={styles.text}>Fri - Sat 11:00 AM - 11:00 PM</Text>
          <Text style={styles.text}>Sunday 11:00 AM - 10:00 PM</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginVertical: 12, // Only vertical margin
    marginHorizontal: -10, // No left/right margin
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#08c408',
  },
  content: {
    marginTop: 12,
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
});

export default HoursCard;