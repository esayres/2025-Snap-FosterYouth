
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


const { height } = Dimensions.get("window");
const screenWidth = Dimensions.get("window").width;

const dummyGridData = [
  { id: "1", title: "2024 Euro Travels", image: "https://picsum.photos/400/400?random=1" },
  { id: "2", title: "Check this shot!", image: "https://picsum.photos/400/400?random=2" },
];

export default function BottomDrawer({
  isVisible,
  onClose,
  entries,
  selectedPantry,
  setSelectedPantry,
}) {
  // --- Animation ---
  const translateY = useRef(new Animated.Value(height)).current;

  // --- State ---
  const [selectedCategory, setSelectedCategory] = useState(null);
  

  // --- Categories ---
//   const categorySet = new Set();
//   entries.forEach(item => {
//     for (let i = 0; i <= 6; i++) { // To be changed when we refine supabase rows
//       const category = item[`categories/${i}`];
//       if (category !== "") {
//         categorySet.add(category);
//       }
//     }
//   });
  //const uniqueCategories = Array.from(categorySet);

      const renderGridItem = ({ item }) => (
        <TouchableOpacity style={styles.gridItem}>
          <Image source={{ uri: item.image }} style={styles.gridImage} />
          <Text style={styles.gridTitle}>{item.title}</Text>
        </TouchableOpacity>
      );

  // --- Handlers ---
  const handleCardPress = (item) => {
    setSelectedPantry(item);
    console.log(`PantryCard clicked, Selected Pantry: ${item}`);
  };
  const handleFilterPress = (category) => {
    console.log(`Selected Category: ${category}`)
    setSelectedCategory(category)
  };

  // --- Animation Effect ---
  useEffect(() => {
    console.log("BottomDrawer isVisible:!!");
    Animated.timing(translateY, {
      toValue: isVisible ? height * 0.2 : height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);
  console.log("BottomDrawer isVisible:");
  // --- Render ---
  return (
    <>
      {!selectedPantry && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFillObject}>
            <Animated.View
              style={[
                styles.drawer,
                { transform: [{ translateY }] },
              ]}
            >
              

            <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Image with Overlay */}
        

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
              <Text style={styles.meta}>Non-Profit · 8.6 Miles · 152 Members</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.joinButton}>
              <Ionicons name="add" size={16} color="white" />
              <Text style={styles.joinButtonText}>Tag this Place</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            
            <TouchableOpacity style={styles.joinButton}>
              <Ionicons name="heart" size={16} color="white" />
              <Text style={styles.joinButtonText}>64</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.joinButton}>
              <Ionicons name="car" size={16} color="white" />
              <Text style={styles.joinButtonText}>15 min</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.joinButton}>
              <Ionicons name="arrow-forward" size={16} color="white" />
              <Text style={styles.joinButtonText}></Text>
            </TouchableOpacity>
          </View>

        {/* Content Grid  (*/} 
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
          <TouchableOpacity style={styles.askButton}>
            <Text style={styles.askButtonText}>Open Now</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>

          <Text style={styles.description}>You May Also Like</Text>
          
        </View>


      </ScrollView>
    </SafeAreaView>
              

              


            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
      

    </>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.6,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  entriesImage: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 25,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  subheader: {
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    marginLeft: 'auto',
    backgroundColor: "#f2f2f2",
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 100,
    marginLeft: 100,
    marginTop: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    gap: 8,
  },
  filterButton: {
    backgroundColor: 'rgba(240, 240, 240, 1) ',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedFilter: {
    backgroundColor: 'rgba(255, 209, 45, 1)',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },safeArea: {
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
