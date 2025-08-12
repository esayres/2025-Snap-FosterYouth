import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const sampleComments = [
  {
    id: '1',
    name: 'Anna B.',
    avatar: 'https://i.pravatar.cc/150?img=1',
    comment: 'This place is awesome! So chill 🌴',
    timeAgo: '2h ago',
  },
  {
    id: '2',
    name: 'Jake L.',
    avatar: 'https://i.pravatar.cc/150?img=2',
    comment: 'Grabbed lunch here and it was amazing!',
    timeAgo: '5h ago',
  },
  {
    id: '3',
    name: 'Lara P.',
    avatar: 'https://i.pravatar.cc/150?img=3',
    comment: 'Friendly people, great vibes 🤝',
    timeAgo: '1d ago',
  },
];

export default function CommentSection({ comments = sampleComments }) {
  const renderItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Community Comments</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false} // Leave this false for embedding inside scrollable views
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: -12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
  },
  comment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  separator: {
    height: 12,
  },
});
