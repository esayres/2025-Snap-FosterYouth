
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
  SafeAreaView,
  PanResponder,
  TextInput,
  Linking,
  Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import  HoursCard  from "./HoursCard"; // Import the HoursCard component
import InfoCard from "./InfoCard";
import CommentSection from "./CommentSection";


import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
// TODO: 
// 1. need to add supabase data to this component (done, it gets passed in as props)
// 2. need to add style to screen
// 3. need to adjust the height of the drawer to show more data and prevent the bottom from being cut off
// 4. need to link name to the NonProfitScreen
// 5. (extra) would like to search by name but not needed for MVP


const { height } = Dimensions.get("window");
const screenWidth = Dimensions.get("window").width;
const COLLAPSED_POSITION = (height * 0.5); // 50% screen height
const EXPANDED_POSITION = (height * 0.001); // fully expanded (top of screen)

const dummyGridData = [
    { id: "1", title: "2024 Euro Travels", image: "https://picsum.photos/400/400?random=1" },
    { id: "2", title: "Check this shot!", image: "https://picsum.photos/400/400?random=2" },
];

export default function BottomDrawer({
    isVisible,
    onClose,
    profileData,
    indexPoint,
}) {
    // --- Animation ---
    const translateY = useRef(new Animated.Value(height)).current;
    const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      if(isExpanded && scrollY > 0) {
        console.log("Preventing drag while expanded and scrolled");
        return false; // Don't allow dragging if the drawer is expanded and scrolled
      }
      // Allow dragging if the gesture is significant enough
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderGrant: () => {
      translateY.stopAnimation((value) => {
        panStartY.current = value;
      });
    },
    onPanResponderMove: (evt, gestureState) => {
      const newTranslateY = panStartY.current + gestureState.dy;

      // Clamp within bounds
      if (newTranslateY >= 0 && newTranslateY <= height) {
        translateY.setValue(newTranslateY);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy < -50) {
        expandDrawer();
      } else if (gestureState.dy > 50) {
        collapseDrawer();
      } else {
        isExpanded ? expandDrawer() : collapseDrawer();
      }
    },
  })
).current;
//


const expandDrawer = () => {
  Animated.timing(translateY, {
    toValue: EXPANDED_POSITION,
    duration: 300,
    useNativeDriver: true,
  }).start(() => {
    setIsExpanded(true);
  });
};

const collapseDrawer = () => {
  Animated.timing(translateY, {
    toValue: COLLAPSED_POSITION,
    duration: 300,
    useNativeDriver: true,
  }).start(() => {
    setIsExpanded(false);
  });
};


    // --- Navigation ---
    const navigation = useNavigation();
    // Navigates to a website
    const openWebsite = (url) => {
      Alert.alert('Leave App?', 'Are you sure you want to find directions to this location?',[{
            text: 'Cancel',
            style: 'cancel',
          },{
            text: 'Yes',
            onPress: () => {
              Linking.openURL(url).catch(err =>
                console.error('Failed to open URL:', err)
              );
            },},],{ cancelable: true });};

    // --- Data Constants ---
    const miles = profileData[indexPoint]?.miles; // miles from Santa Monica to the Non-Profit
    const avgTravelTime = (miles / 30) * 60; // average time in minutes to get to the Non-Profit from Santa Monica
    const name = profileData[indexPoint]?.name; // name of the Non-Profit
    const favorite = profileData[indexPoint]?.favorites; // favorite status of the Non-Profit
    const members = profileData[indexPoint]?.members; // members of the Non-Profit
    const website = profileData[indexPoint]?.website; // website of the Non-Profit
    const description = profileData[indexPoint]?.description; // description of the Non-Profit
    const address = profileData[indexPoint]?.address; // address of the Non-Profit
    const phoneNumber = profileData[indexPoint]?.phoneNumber; // phone number of the Non-Profit
    const storedTags = profileData[indexPoint]?.tags || []; // tags of the Non-Profit, default to empty array if not present
    
    // --- State ---
    const [isExpanded, setIsExpanded] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const panStartY = useRef(0);
    const [tags, setTags] = useState(storedTags); // store multiple tags
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);


    if (isVisible){
        console.log("Printing Profile Data: ", profileData[indexPoint]);
        //console.log("Scroll Y: ", scrollY);
       // console.log('Index Point', indexPoint)
        //console.log("Miles: ", profileData[indexPoint].miles);
        //console.log("favorites: ", profileData[indexPoint].favorites);
        //console.log("id: ", profileData[indexPoint].id);
        console.log("website: ", profileData[indexPoint].website);
        console.log("address: ", profileData[indexPoint].address);
        console.log("phoneNumber: ", profileData[indexPoint].phoneNumber);
    }
  

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
  

  

  // --- Animation Effect ---

  useEffect(() => {
  setTags(profileData[indexPoint]?.tags || []);
  setIsFavorite(false)
  console.log("Updated tags:", profileData[indexPoint]);
}, [profileData, indexPoint]);

  useEffect(() => {
    if(isVisible) {
      collapseDrawer();
    }else{
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);



  const addTag = (newTag) => {
  if (newTag.trim() && !tags.includes(newTag.trim())) {
    const updatedTags = [...tags, newTag.trim()];
    setTags(updatedTags);

    // Optional: persist tags to profileData or backend here
    updateProfileTags(updatedTags);
  }
};
const updateProfileTags = async (updatedTags) => {
  try {
    // Example: call your API or Supabase update here
    await supabase
      .from('LA County FY Orgs')
      .update({ tags: updatedTags })
      .eq('id', profileData[indexPoint].id);
  } catch (error) {
    console.error("Failed to update tags:", error);
  }
};


  // --- Render ---
  return (
    < >
      {isVisible && ( 
          <TouchableWithoutFeedback>
            
          <View style={StyleSheet.absoluteFillObject}>
            <Animated.View {...panResponder.panHandlers}
            
              style={[
                styles.drawer,
                { transform: [{ translateY }], maxHeight: (height * 0.93), minHeight: COLLAPSED_POSITION, }, 
              ]}
              >
              
            <View >
              

            <SafeAreaView style={styles.safeArea}> 
        {/* Header Image with Overlay */}
        

        {/* Profile Section */}
       
        <View style={styles.profileSection}>
            <View style={styles.closeButtonContainer}>
            <Ionicons name="close" size={24} color="#4a4c4cff" onPress={onClose} />
          </View>
    <View style={{ alignItems: 'center', paddingVertical: 0 }}  >
  <View style={{ width: 30, height: 6, backgroundColor: '#ccc', borderRadius: 2 }} />
</View>
        </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}   scrollEnabled={isExpanded} 
      onScroll={(event) => {
        setScrollY(event.nativeEvent.contentOffset.y);
      }}
      scrollEventThrottle={16}>
        
          <View style={styles.profileRow}>
            <Image
              source={{ uri: "https://i.imgur.com/jg6Wx1G.jpg" }}
              style={styles.avatar}
              />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name} onPress={() => {
                  navigation.navigate("NonProfitCommunity");
                }}>{name}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#00D4AA" />
              </View>
              <Text style={styles.meta}>Non-Profit · {miles} Miles · {members} Members</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
  <View style={styles.tagsContainer}>
    {tags.length > 0 ? (
      <>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tagBubble}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        <TouchableOpacity
          style={styles.tagButton}
          onPress={() => setIsAddingTag(true)}
        >
          <Ionicons name="add" size={16} color="#4a4c4cff" />
        </TouchableOpacity>
      </>
    ) : (
      <TouchableOpacity
        style={styles.tagButton}
        onPress={() => setIsAddingTag(true)}
      >
        <Ionicons name="add" size={16} color="#4a4c4cff" />
        <Text style={styles.tagButtonText}>Tag this Place</Text>
      </TouchableOpacity>
    )}
  </View>
</View>

{isAddingTag && (
  <View style={styles.tagInputContainer}>
    <TextInput
      style={styles.tagInput}
      placeholder="Enter tag..."
      value={newTag}
      onChangeText={setNewTag}
      onSubmitEditing={() => {
        if (newTag.trim()) {
          addTag(newTag.trim())
          setNewTag("");
          setIsAddingTag(false);
        }
      }}
      autoFocus={true}
      returnKeyType="done"
    />
    <TouchableOpacity onPress={() => setIsAddingTag(false)} style={styles.tagInputClose}>
      <Ionicons name="close" size={20} color="#333" />
    </TouchableOpacity>
  </View>
)}
          <View style={styles.buttonRow}>
            
            <TouchableOpacity
            style={styles.greyButton}
            onPress={() => setIsFavorite(!isFavorite)}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "red" : "black"}/>
            <Text style={styles.greyButtonText}>
              {isFavorite ? parseInt(favorite) + 1 : favorite}
            </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.greyButton} onPress={() => openWebsite("https://www.google.com/maps/dir//" + address)}>
              <Ionicons name="car" size={24} color="black" />
              <Text style={styles.greyButtonText}>{avgTravelTime} min</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.joinButton}>
              <Ionicons name="arrow-redo-sharp" size={24} color="white" />
              <Text style={styles.joinButtonText}></Text>
            </TouchableOpacity>
          </View>
          <HoursCard />

        {/* Content Grid  (*/} 
        
          <InfoCard address={address} websiteURL={website} phoneNumber={phoneNumber}/>
          <CommentSection/>
          
    


      </ScrollView>
    </SafeAreaView>
            </View>
              
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
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 0,
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
    contentContainerStyle: { flexGrow: 1 },
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
    paddingVertical: 5,
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
    justifyContent: "space-between",
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
    flex: 1,
    backgroundColor: "#00BFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  tagButton: {
    backgroundColor: "#fdffffff",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#dce2e3ff",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  greyButton: {
    flex: 1,
    backgroundColor: "#dce2e3ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  joinButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  greyButtonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 14,
  },
  tagButtonText: {
    color: "#4a4c4cff",
    fontWeight: "600",
    fontSize: 12,
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
  tagsContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8, // or use marginRight in tagBubble
  flexWrap: "wrap",
},

tagBubble: {
  backgroundColor: "#fdffffff",  // same as tagButton background
  borderColor: "#dce2e3ff",
  borderWidth: 2,
  borderRadius: 20,
  paddingVertical: 5,
  paddingHorizontal: 20,
  justifyContent: "center",
  alignItems: "center",
  // no pointer events, so not pressable
},

tagText: {
  color: "#4a4c4cff",
  fontWeight: "600",
  fontSize: 12,
},

tagButton: {
  backgroundColor: "#fdffffff",
  borderColor: "#dce2e3ff",
  borderWidth: 2,
  paddingVertical: 5,
  paddingHorizontal: 20,
  borderRadius: 20,
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
},closeButtonContainer: {
  position: "absolute",
  top: 16,
  right: 16,
  zIndex: 10,
},
});
