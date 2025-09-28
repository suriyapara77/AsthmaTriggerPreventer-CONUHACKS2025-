import { registerRootComponent } from "expo";
import { View, Text } from "react-native";
import React from "react";

const App = () => {
  return (
    <View>
      <Text>Hello, Expo!</Text>
    </View>
  );
};

// Register the App component
registerRootComponent(App);
