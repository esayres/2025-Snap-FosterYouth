import React, { useState, useEffect, use } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";


// for a new screen ( distrciptive screen when you click on a marker)
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStaticNavigation, useNavigation } from "@react-navigation/native";

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
//console.log("supabase", supabase);

import * as Location from "expo-location";


// -------------    TO DO LIST    ----------------
// CURRENTLY BEING ABLE TO TAP ONTO MARKERS TO DISPLAY DATA IS NOT WORKING AND INDVIDUAL MARKER PICTURES NEEDS TO BE ADDED

import Ionicons from "react-native-vector-icons/Ionicons";

export default function MapScreen({ navigation }) {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markerLocation, setMarker] = useState({});

  // the current Supabase Data UseStates
  const [ longAndLat , setlongAndLat ] = useState([]);
  const [ fetchError, setError] = useState(null);

  const SANTAMONICALONGITUDE = -118.4503864; // Santa Monica Longitude
  const SANTAMONICALATITUDE = 34.0211573; // Santa

Marker
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 34.0211573,
    longitude: -118.4503864,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  //
  
 
  
  // GIVE WHOLE DISCRITION
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      
      // THIS FETCHES ALL THE DATA FROM SUPABASE (CURRENTLY ONLY LONGITUDE AND LATITUDE / NAME)
      const fetchData = async () => {
        const { data, error } = await supabase
        .from("LA County FY Orgs")
        .select("LongitudeAndLatitude, name");
        console.log("Data", data)
        
        if (error) {
          setError("couldnt fetch data from supabase");
          console.log(error)
        } if (data) {
          setlongAndLat(data);
          setError(null);
          console.log("data from supabase", data);
        }
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setCurrentRegion({
        latitude: SANTAMONICALATITUDE, //location.coords.latitude, (hardcoded for santa Moncia)
        longitude: SANTAMONICALONGITUDE, //location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      fetchData();
    })(
    );
  }, []);
  
  let text = "Waiting...";
  text = JSON.stringify(location);

  // Because Supabase only gives us the LongitudeAndLatitude as an array, we need to format it to match the markers format
  // so we include latitudeDelta and longitudeDelta, and a name for each marker.
  const formatMarkers = (longAndLat) => {
  return longAndLat.map((item) => ({
    latitude: item.LongitudeAndLatitude[1], 
    longitude: item.LongitudeAndLatitude[0], 
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    name: item.name,  
  }));
};

// Handler 
  
  return (
    <View style={[styles.container, { marginBottom: tabBarHeight }]}>
        <MapView
          style={styles.map}
          region={currentRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {formatMarkers(longAndLat).map((marker, index) => ( // This SETS THE MARKERS ON THE MAP 
            <Marker key={index} coordinate={marker} onPress={() => console.log("MARKER PRESSED AND NEEDS TO NAVIGATE TO A NEW SCREEN (TBD): ", marker.name)} // need to pull from 
            > 
              <Image
                source={require('../../assets/snapchat/ghostheart.png')}
                style={styles.markerImg}
              />
            </Marker>
          ))}
          {/* <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
          title="My Location"
          description="This is a marker example" /> */}
        </MapView>

        <View style={[styles.mapHeader]}>
          <Pressable
            onPress={() => {
              navigation.navigate("GhostPins");
            }}
          >
            <View style={styles.myBitmoji}>
              <Ionicons name="heart" size={45} color="red" />
              <View style={styles.bitmojiTextContainer}>
                <Text style={styles.bitmojiText}>GhostPins</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={[styles.mapFooter]}>
          <View style={styles.locationContainer}>
            <TouchableOpacity
              style={[styles.userLocation, styles.shadow]}
              onPress={() => {
                console.log("Go to user location!");
                const { latitude, longitude } = location.coords;
                setCurrentRegion({ ...currentRegion, latitude, longitude });
              }}
            >
              <Ionicons name="navigate" size={15} color="black" />
            </TouchableOpacity>
          </View>
          <View style={[styles.bitmojiContainer, styles.shadow]}>
            <Pressable
              onPress={() => {
                navigation.navigate("Event");
              }}
            >
              <View style={styles.myBitmoji}>
                <Ionicons name="calendar-outline" size={50} color="gray" />
                <View style={styles.bitmojiTextContainer}>
                  <Text style={styles.bitmojiText}>Events</Text>
                </View>
              </View>
            </Pressable>

            <View style={styles.places}>
              <Image
                style={styles.bitmojiImage}
                source={require("../../assets/snapchat/personalBitmoji.png")}
              />
              <View style={styles.bitmojiTextContainer}>
                <Text style={styles.bitmojiText}>Places</Text>
              </View>
            </View>
            <View style={styles.myFriends}>
              <Image
                style={styles.bitmojiImage}
                source={require("../../assets/snapchat/personalBitmoji.png")}
              />
              <View style={styles.bitmojiTextContainer}>
                <Text style={styles.bitmojiText}>Friends</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapFooter: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    bottom: 0,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  markerImg: {
    width: 35,
    height: 35,
  },
  locationContainer: {
    backgroundColor: "transparent",
    width: "100%",
    paddingBottom: 8,
    alignItems: "center",
  },
  userLocation: {
    backgroundColor: "white",
    borderRadius: 100,
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  shadow: {
    shadowColor: "rgba(0, 0, 0)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 3,
    shadowOpacity: 0.5,
    elevation: 4,
  },
  bitmojiContainer: {
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  myBitmoji: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  bitmojiImage: {
    width: 50,
    height: 50,
  },
  bitmojiTextContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
  },
  bitmojiText: {
    fontSize: 10,
    fontWeight: "700",
  },
  places: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  myFriends: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarIcon: {},
});
