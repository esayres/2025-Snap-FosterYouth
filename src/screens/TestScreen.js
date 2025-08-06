import MasterNonProfitScreen from "../screens/MasterNonProfitScreen" // New component by Elijah sayres
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

export default function TestScreen() {
  return(
    <>
    <Text>TestScreen</Text>
    <MasterNonProfitScreen>
          <Text>TestScreen</Text>
    </MasterNonProfitScreen>
    <Text>TestScreen</Text>
    </>
    
  );
}




// Just Stylesheets (no logic here)