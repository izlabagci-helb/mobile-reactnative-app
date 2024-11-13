import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {useRouter } from "expo-router";


import { NavigationProp } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OpenScannerPage from './openScannerPage';
import Profile from './profile';
import Favorite from './favorite';
import { useTheme } from '../themeContext'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import "../../global.css"; // Correct import path




const Tab = createBottomTabNavigator();


export default function BottomTabs() {
  const { isDarkMode } = useTheme(); // Access the current theme

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#333' : '#fff', // Background color based on dark mode
        },
        tabBarActiveTintColor: isDarkMode ? '#e8ecf4' : '#000', // Active tab color
        tabBarInactiveTintColor: isDarkMode ? '#ccc' : '#666', // Inactive tab color
        
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'; 
          } else if (route.name === 'Painting Ranking') {
            iconName = focused ? 'bar-chart-outline' : 'bar-chart-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'scan' : 'scan-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={MuseumPlan}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Painting Ranking"
        component={Favorite}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Scanner"
        component={OpenScannerPage}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}


interface RouterProps {
  navigation: NavigationProp<any, any>;
}

function MuseumPlan({ navigation }: RouterProps) {
  const { isDarkMode } = useTheme(); // Access the current theme
  const router = useRouter(); // Router for navigation

  const handlePress = (evt) => {
    // Get the touch coordinates
    const { locationX, locationY } = evt.nativeEvent;
    //console.log(`x coord = ${locationX}, y coord = ${locationY}`);
    // Define the roomOne area
    const roomOne = {
      left: 31,
      right: 153,
      top: 177,
      bottom: 343,
    };
    const roomTwo = {
      left: 482,
      right: 615,
      top: 385,
      bottom: 472,
    };
    if (
      locationX >= roomOne.left &&
      locationX <= roomOne.right &&
      locationY >= roomOne.top &&
      locationY <= roomOne.bottom
    ) {
      //Alert.alert('You touched the defined area!');
      router.push("/roomOne");

    }

    if (
      locationX >= roomTwo.left &&
      locationX <= roomTwo.right &&
      locationY >= roomTwo.top &&
      locationY <= roomTwo.bottom
    ) {
      
      router.push("/roomTwo");

    }
  
  
  };

  return (

    
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#000' : '#e8ecf4' }}>
      <View className="flex-1 justify-center items-center">
        <Text className={`text-3xl font-bold text-center mb-7 ${isDarkMode ? 'text-white' : 'text-black'} font-mono`}>
          MUSEUM PLAN
        </Text>
        <Text className={`text-sm text-center mb-2.5 ${isDarkMode ? 'text-white' : 'text-[#333]'} font-mono`}>
          TO HAVE ANY INFORMATION ABOUT PAINTINGS SCAN QRCODE
        </Text>
        <Text className={`text-sm text-center mb-2.5 ${isDarkMode ? 'text-white' : 'text-[#333]'} font-mono`}>
          You can click on rooms to enter them
        </Text>
        <TouchableWithoutFeedback onPress={handlePress}>
          <Image
            source={require('../../assets/images/museumPlan.png')}
            className="w-[650px] h-[650px] rotate-90"
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>

  );
}


const styles = StyleSheet.create({
  
  image: {
    width: 650, 
    height: 650, 
    transform: [{ rotate: '90deg' }], // Rotate image to the left
  },
});


