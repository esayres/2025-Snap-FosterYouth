import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../utils/hooks/supabase";
import { useAuthentication } from "../utils/hooks/useAuthentication";

const screenWidth = Dimensions.get("window").width;

export default function NonProfitCommunityScreen({ route }) {
  const navigation = useNavigation();
  const { user } = useAuthentication();
  const [activeTab, setActiveTab] = useState("Stories");
  const [isMember, setIsMember] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [communityData, setCommunityData] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get community username from route params or use default
  const communityUsername = route?.params?.communityUsername || "better-youth";

  useEffect(() => {
    fetchCommunityWithMembership();
    fetchCommunityStories();
  }, [communityUsername, user]);

  useEffect(() => {
    if (user && communityData?.created_by) {
      checkFriendshipStatus();
    }
  }, [user, communityData]);

  const fetchCommunityWithMembership = async () => {
    if (!user) {
      // If no user, just fetch community data without membership check
      await fetchCommunityData();
      return;
    }

    try {
      // Try to fetch community data with membership status in single query
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          community_members!left(user_id, role)
        `)
        .eq('username', communityUsername)
        .eq('community_members.user_id', user.id)
        .single();

      if (error) throw error;
      
      setCommunityData(data);
      
      // Check if user is a member
      const membershipData = data.community_members?.find(member => member.user_id === user.id);
      setIsMember(!!membershipData);
      
      console.log('Single query - Membership check:', !!membershipData, 'for user:', user.id, 'community:', data.id);
      
    } catch (error) {
      console.error('Error fetching community with membership:', error);
      // Fallback to separate queries if single query fails
      await fetchCommunityData();
      if (communityData) {
        await checkMembershipStatus();
      }
    }
  };

  const fetchCommunityData = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('username', communityUsername)
        .single();

      if (error) throw error;
      setCommunityData(data);
      return data;
    } catch (error) {
      console.error('Error fetching community data:', error);
      // Fallback to default data if database fails
      const fallbackData = {
        id: 1,
        username: 'better-youth',
        name: 'Better Youth',
        bio: 'Our mission is to bridge resource gaps and prepare foster and system-impacted youth for success in the creative economy.',
        avatar_url: 'https://i.imgur.com/jg6Wx1G.jpg',
        header_image_url: null,
        member_count: 152,
        follower_count: 8600
      };
      setCommunityData(fallbackData);
      return fallbackData;
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityStories = async () => {
    try {
      const { data, error } = await supabase
        .from('community_stories')
        .select(`
          id,
          title,
          image_url,
          content,
          story_type,
          is_featured,
          created_at,
          communities!inner(username)
        `)
        .eq('communities.username', communityUsername)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching community stories:', error);
      setStories([]);
    }
  };

  const checkFriendshipStatus = async () => {
    if (!user || !communityData?.created_by) {
      // If no creator, just show the button as non-functional
      setIsFriend(false);
      return;
    }

    // Don't check friendship with yourself
    if (user.id === communityData.created_by) {
      setIsFriend(true); // Consider yourself "friended" 
      return;
    }

    try {
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', user.id)
        .eq('friend_id', communityData.created_by)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsFriend(!!data);
      console.log('Friendship status:', !!data);
    } catch (error) {
      console.error('Error checking friendship status:', error);
    }
  };

  const handleAddFriend = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to add friends');
      return;
    }

    if (!communityData?.created_by) {
      Alert.alert('Info', 'This community doesn\'t have a creator to add as friend');
      return;
    }

    if (user.id === communityData.created_by) {
      Alert.alert('Info', 'You cannot add yourself as a friend');
      return;
    }

    try {
      const { error } = await supabase
        .from('friendships')
        .insert([{
          user_id: user.id,
          friend_id: communityData.created_by
        }]);

      if (error) throw error;

      setIsFriend(true);
      Alert.alert(
        'Added!', 
        `You are now friends with the ${communityData.name} creator!`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Error adding friend:', error);
      if (error.code === '23505') {
        Alert.alert('Info', 'You are already friends!');
        setIsFriend(true);
      } else {
        Alert.alert('Error', 'Failed to add friend. Please try again.');
      }
    }
  };

  const checkMembershipStatus = async () => {
    if (!user || !communityData) {
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityData.id)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsMember(!!data);
      console.log('Membership check:', !!data, 'for user:', user.id, 'community:', communityData.id);
    } catch (error) {
      console.error('Error checking membership status:', error);
    }
  };

  const handleJoinCommunity = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to join the community');
      return;
    }

    if (!communityData) {
      Alert.alert('Error', 'Community data not loaded');
      return;
    }

    setIsLoading(true);

    try {
      // Auto-join the user to the community
      const { error } = await supabase
        .from('community_members')
        .insert([
          {
            community_id: communityData.id,
            user_id: user.id,
            role: 'member'
          }
        ]);

      if (error) throw error;

      // Update member count in database
      const { error: updateError } = await supabase
        .from('communities')
        .update({ member_count: communityData.member_count + 1 })
        .eq('id', communityData.id);

      if (!updateError) {
        setCommunityData(prev => ({
          ...prev,
          member_count: prev.member_count + 1
        }));
      }

      setIsMember(true);

      Alert.alert(
        'Welcome!', 
        `You've successfully joined ${communityData.name}!`,
        [{ text: 'OK', style: 'default' }]
      );

    } catch (error) {
      console.error('Error joining community:', error);
      if (error.code === '23505') {
        Alert.alert('Info', 'You are already a member of this community!');
        setIsMember(true);
      } else {
        Alert.alert('Error', 'Failed to join community. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = () => {
    // Navigate to question asking screen or open modal
    navigation.navigate('AskQuestion', { 
      communityId: communityData?.id,
      communityName: communityData?.name 
    });
  };

  const handleJoinGroupChat = () => {
    // Navigate to group chat
    navigation.navigate('GroupChat', { 
      communityId: communityData?.id,
      communityName: communityData?.name 
    });
  };

  const renderActionButton = () => {
    if (isMember) {
      return (
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={handleJoinGroupChat}
        >
          <Text style={styles.messageButtonText}>Message Group</Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity 
          style={styles.askButton}
          onPress={handleAskQuestion}
        >
          <Text style={styles.askButtonText}>Ask a Question</Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      );
    }
  };

  const renderJoinButton = () => {
    if (isMember) {
      return (
        <View style={styles.memberBadge}>
          <Text style={styles.memberBadgeText}>Community joined</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity 
          style={[styles.joinButton, isLoading && styles.joinButtonDisabled]}
          onPress={handleJoinCommunity}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.joinButtonText}>Joining...</Text>
          ) : (
            <>
              <Ionicons name="add" size={16} color="white" />
              <Text style={styles.joinButtonText}>Join Community</Text>
            </>
          )}
        </TouchableOpacity>
      );
    }
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem}>
      <Image source={{ uri: item.image_url }} style={styles.gridImage} />
      <Text style={styles.gridTitle}>{item.title}</Text>
      {item.is_featured && (
        <View style={styles.featuredBadge}>
          <Ionicons name="star" size={12} color="#FFD700" />
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading || !communityData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading community...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Image with Overlay */}
        <ImageBackground
          source={
            communityData.header_image_url 
              ? { uri: communityData.header_image_url }
              : require("../../assets/better_youth_background.jpeg")
          }
          style={styles.headerImage}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay}>
            {/* Header buttons commented out as in original */}
          </View>
        </ImageBackground>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: communityData.avatar_url }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{communityData.name}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#00D4AA" />
              </View>
              <Text style={styles.meta}>
                {communityData.username} · {communityData.follower_count?.toLocaleString() || '0'} Followers · {communityData.member_count} Members
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddFriend}
              disabled={isFriend}
            >
              {!isFriend && (
                <Ionicons name="person-add" size={16} color="#000" />
              )}
              <Text style={styles.addButtonText}>
                {isFriend ? "Added" : "Add"}
              </Text>
            </TouchableOpacity>
            {renderJoinButton()}
          </View>

          <Text style={styles.description}>
            {communityData.bio}
          </Text>

          {renderActionButton()}
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <View style={styles.tabRow}>
            {["Stories", "Spotlight", "Places"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={styles.tabButton}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
                {activeTab === tab && <View style={styles.activeTabLine} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content Grid */}
        <View style={styles.gridContainer}>
          <FlatList
            data={stories}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            renderItem={renderGridItem}
            ItemSeparatorComponent={() => <View style={styles.gridSeparator} />}
            columnWrapperStyle={stories.length > 1 ? styles.gridRow : null}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No stories yet</Text>
                <Text style={styles.emptySubtext}>Be the first to share something!</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerImage: {
    width: "100%",
    height: 320,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  profileSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginRight: 6,
  },
  meta: {
    fontSize: 14,
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#FFFF00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  addButtonText: {
    fontWeight: "600",
    color: "#000",
    fontSize: 14,
  },
  joinButton: {
    backgroundColor: "#00BFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flex: 1,
  },
  joinButtonDisabled: {
    backgroundColor: "#87CEEB",
  },
  joinButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  memberBadge: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  memberBadgeText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    marginBottom: 16,
  },
  messageButton: {
    backgroundColor: "#00BFFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  messageButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  askButton: {
    backgroundColor: "#00BFFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  askButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  chatButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  tabContainer: {
    backgroundColor: "#fff",
    paddingTop: 16,
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
  },
  tabText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  activeTabLine: {
    position: "absolute",
    bottom: 0,
    height: 2,
    width: 40,
    backgroundColor: "#000",
    borderRadius: 1,
  },
  gridContainer: {
    backgroundColor: "#fff",
    padding: 2,
    paddingBottom: 30,
  },
  gridRow: {
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  gridSeparator: {
    height: 4,
  },
  gridItem: {
    width: (screenWidth - 8) / 2,
    height: 280,
    marginBottom: 4,
    position: 'relative',
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  gridTitle: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    color: "white",
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 14,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});