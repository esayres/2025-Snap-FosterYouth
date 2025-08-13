import { Image, Text, View, Button, StyleSheet, Pressable, ScrollView, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../utils/hooks/supabase";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { findAstrologySign } from "../utils/hooks/findAstrologySign";
import { useAuthentication } from "../utils/hooks/useAuthentication";

const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // Handle successful sign out
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuthentication();
  const [astrology, setAstrology] = useState("Pisces");
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const userSign = findAstrologySign();

  // Community data - Better Youth
  const userCommunities = [
    { id: 1, name: "Better Youth", memberCount: 158 },
  ];

  useEffect(() => {
    setAstrology(userSign.sign);
    // Set the user's joined community
    setJoinedCommunities(userCommunities);
  }, []);

  const renderCommunityItem = ({ item }) => (
    <View style={styles.communityCard}>
      <View style={styles.communityIcon}>
        <Text style={styles.iconText}>💙</Text>
      </View>
      <View style={styles.communityInfo}>
        <Text style={styles.communityName}>{item.name}</Text>
        <Text style={styles.memberCount}>{item.memberCount} Members</Text>
      </View>
      <View style={styles.chevron}>
        <Text style={styles.chevronText}>›</Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://i.imgur.com/NeWYyLe.png" }}
          style={styles.avatar}
        />
        <Text style={styles.username}>
          {user &&
            user.user_metadata &&
            user.user_metadata.email.slice(
              0,
              user.user_metadata.email.indexOf("@")
            )}
        </Text>
      </View>

      {/* Communities Section */}
      <View style={styles.communitiesSection}>
        <Text style={styles.sectionTitle}>My Communities</Text>
        {joinedCommunities.length > 0 ? (
          <View>
            {joinedCommunities.map((item) => (
              <Pressable 
                key={item.id.toString()}
                style={styles.communityCard}
                onPress={() => {
                  navigation.navigate("NonProfitCommunity", {
                    communityUsername: "better-youth"
                  });
                }}
              >
                <View style={styles.communityIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="#00D4AA" />
                </View>
                <View style={styles.communityInfo}>
                  <Text style={styles.communityName}>{item.name}</Text>
                  <Text style={styles.memberCount}>{item.memberCount} Members</Text>
                </View>
                <View style={styles.chevron}>
                  <Text style={styles.chevronText}>›</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>You haven't joined any communities yet</Text>
            <Pressable 
              style={styles.exploreButton}
              onPress={() => navigation.navigate("NonProfitCommunity")}
            >
              <Text style={styles.exploreButtonText}>Explore Communities</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          onPress={() => {
            navigation.navigate("Settings", {});
          }}
          title="Settings"
          color="0"
        />
        
        <View style={styles.buttonSpacing} />
        
        <Button onPress={handleSignOut} title="Log Out" color="#FF3B30" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  communitiesSection: {
    width: "90%",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
  },
  communitiesList: {
    maxHeight: 300, // Limit height to prevent overflow
  },
  communityCard: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },
  memberCount: {
    fontSize: 15,
    color: "#8E8E93",
  },
  chevron: {
    marginLeft: 8,
  },
  chevronText: {
    fontSize: 24,
    color: "#C7C7CC",
    fontWeight: "300",
  },
  viewButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  exploreButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "white",
    fontWeight: "600",
  },
  actionButtons: {
    width: "90%",
    gap: 10,
  },
  buttonSpacing: {
    height: 10,
  },
});