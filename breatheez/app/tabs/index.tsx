import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@/components/BottomSheet";
import MapView from "react-native-maps";
import GetLocation from "react-native-get-location";
import useLocation from "@/hooks/useLocation";

const HomeScreen = () => {
  const { latitude, longitude, errorMsg } = useLocation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showsUserLocation={true} // Optional: To show the user's location
          initialRegion={{
            latitude: 45.5017, // Replace with your latitude
            longitude: -73.6893, // Replace with your longitude
            latitudeDelta: 0.922,
            longitudeDelta: 0.421,
          }}
        />
        <BottomSheet />
        {/* this is the bottom sheet drag up */}
      </View>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject, // To make the map fill the entire screen
  },
});
