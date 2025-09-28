import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import useLocation from "../hooks/useLocation";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import axios from "axios";

// Get screen height
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// How far the sheet can go up (fully open)
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

const BottomSheet = () => {
  const { latitude, longitude, errorMsg } = useLocation(); // Get location from the custom hook
  const [airQualityData, setAirQualityData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchAirQualityData = async (lat: any, lng: any) => {
    try {
      setLoading(true);
      const apiKey = "f76c0fbde94e026582f3353293e9049e762174ed"; // Use your actual token here
      const apiUrl = `http://api.waqi.info/feed/geo:${lat};${lng}/?token=${apiKey}`;

      const response = await axios.get(apiUrl);
      setAirQualityData(response.data);
      setLoading(false);
    } catch (err) {
      setApiError("Error fetching air quality data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      fetchAirQualityData(latitude, longitude);
    }
  }, [latitude, longitude]);

  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(
        event.translationY + context.value.y,
        MAX_TRANSLATE_Y
      );
      translateY.value = Math.min(translateY.value, 0);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 1.65) {
        translateY.value = withSpring(-SCREEN_HEIGHT / 3, { damping: 50 });
      } else if (translateY.value < -SCREEN_HEIGHT / 2) {
        translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
      }
    });

  useEffect(() => {
    translateY.value = withSpring(-SCREEN_HEIGHT / 3, { damping: 50 });
  }, []);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );

    return {
      transform: [{ translateY: translateY.value }],
      borderRadius,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <View style={styles.line} />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : apiError ? (
          <View>
            <Text>Error: {apiError}</Text>
            <Button
              title="Retry"
              onPress={() => fetchAirQualityData(latitude, longitude)}
            />
          </View>
        ) : airQualityData ? (
          <>
            <Text>Air Quality of MyLocation:</Text>
            <Text>City: {airQualityData.data.city.name}</Text>
            <Text>AQI: {airQualityData.data.aqi}</Text>
            <Text>PM25: {airQualityData.data.iaqi.pm25?.v ?? "N/A"}</Text>
            <Text>PM10: {airQualityData.data.iaqi.pm10?.v ?? "N/A"}</Text>
            <Text>CO: {airQualityData.data.iaqi.co?.v ?? "N/A"}</Text>
          </>
        ) : (
          <Text>No air quality data available.</Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "#eab9ff",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 5,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
  textofLocation: {
    fontFamily: "System",
    fontSize: 15,
  },
});
