import React, { useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const dummyGridData = [
  { id: "1", title: "2024 Euro Travels", image: "https://picsum.photos/400/400?random=1" },
  { id: "2", title: "Check this shot!", image: "https://picsum.photos/400/400?random=2" },
  { id: "3", title: "Coffee Shop Vibes", image: "https://picsum.photos/400/400?random=3" },
  { id: "4", title: "Downtown Moments", image: "https://picsum.photos/400/400?random=4" },
  { id: "5", title: "Art Workshop", image: "https://picsum.photos/400/400?random=5" },
  { id: "6", title: "Community Event", image: "https://picsum.photos/400/400?random=6" },
];

export default function NonProfitCommunityScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Stories");

  const renderGridItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem}>
      <Image source={{ uri: item.image }} style={styles.gridImage} />
      <Text style={styles.gridTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Image with Overlay */}
        <ImageBackground
          source={require("../../assets/better_youth_background.jpeg")}
          style={styles.headerImage}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay}>
            {/* <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-down" size={28} color="white" />
              </TouchableOpacity>
              <View style={styles.rightButtons}>
                <TouchableOpacity style={styles.headerButton}>
                  <Ionicons name="arrow-up" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton}>
                  <Ionicons name="ellipsis-horizontal" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
        </ImageBackground>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: "https://i.imgur.com/jg6Wx1G.jpg" }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>Better Youth</Text>
                <Ionicons name="checkmark-circle" size={20} color="#00D4AA" />
              </View>
              <Text style={styles.meta}>better.youth · 8.6K Followers · 152 Members</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="person-add" size={16} color="#000" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.joinButton}>
              <Ionicons name="add" size={16} color="white" />
              <Text style={styles.joinButtonText}>Join Community</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Our mission is to bridge resource gaps and prepare foster and system-impacted youth for success in the creative economy.
          </Text>

          <TouchableOpacity style={styles.askButton}>
            <Text style={styles.askButtonText}>Ask a Question</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
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
            data={dummyGridData}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            renderItem={renderGridItem}
            ItemSeparatorComponent={() => <View style={styles.gridSeparator} />}
            columnWrapperStyle={styles.gridRow}
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
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 8,
  },
  rightButtons: {
    flexDirection: "row",
    gap: 8,
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
    gap: 12,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#FFFF00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    gap: 6,
  },
  joinButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    marginBottom: 16,
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
});