import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import React from "react";
import Home from "./src/screens/BottomTabScreen/Home";
import Message from "./src/screens/BottomTabScreen/Message";
import Calendar from "./src/screens/BottomTabScreen/Calendar";

const App = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const BottomTabScreen = () => {
    return (
      <Tab.Navigator
        screenOptions={() => ({
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            height: 70,
          },
        })}
      >
        <Tab.Screen name="Activity" component={Message} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Profile" component={Calendar} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Bottom" component={BottomTabScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
