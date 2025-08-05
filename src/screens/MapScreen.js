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
import { markers } from "../../assets/markers.js";

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
//console.log("supabase", supabase);

import * as Location from "expo-location";

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


Marker
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 34.0211573,
    longitude: -118.4503864,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  
  
 
  
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      
      const fetchData = async () => {
        const { data, error } = await supabase
        .from("LA County FY Orgs")
        .select();
        //console.log("supabase", supabase)
        console.log("inside fetchData", data, error);
        
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
        latitude: 34.0211573, //location.coords.latitude, (hardcoded for santa Moncia)
        longitude: -118.4503864, //location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      fetchData();
    })(
    );
  }, []);
  
  let text = "Waiting...";
  text = JSON.stringify(location);
  
  return (
    <View style={[styles.container, { marginBottom: tabBarHeight }]}>
        <MapView
          style={styles.map}
          region={currentRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {markers.map((marker, index) => (
            <Marker key={index} coordinate={marker} onPress={() => onMarkerSelected(marker)}>
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
