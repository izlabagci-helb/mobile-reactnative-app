import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet,TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { FIREBASE_DB } from '../../fireBaseConfig';
import { useTheme } from '../themeContext'; // Import useTheme for dark mode
import { useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back icon
import "../../global.css"; 


const RoomOne = () => {
  const [paintings, setPaintings] = useState<{ [key: string]: any } | null>(null); // Store filtered paintings
  const { isDarkMode } = useTheme(); // Access the current theme
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // Fetch all paintings from Firebase
    const paintingsRef = ref(FIREBASE_DB, 'paintings/');
    onValue(paintingsRef, (snapshot) => {
      const data = snapshot.val();

      // Filter paintings where location is 'Local 2106'
      const filteredPaintings = Object.entries(data || {}).filter(
        ([key, painting]) => painting.location === 'Local 2106'
      );

      // Convert the filtered result back to an object for state storage
      const filteredData = Object.fromEntries(filteredPaintings);
      setPaintings(filteredData);
    });
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#000' : '#e8ecf4' }]}>
      
      <TouchableOpacity
        className={['absolute left-5 top-1 z-10 p-2 rounded bg-black/50',isDarkMode ? 'text-white' : 'text-black']}onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
      

      <Text className={`text-2xl font-bold mb-5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Paintings in Local 2106
      </Text>

      <Text className={`mb-5 ${isDarkMode ? 'text-white' : 'text-black'}`}> 
        Dans cette salle, nous sommes ravis de vous proposer nos acquisitions 
        les plus prestigieuses et les meilleurs éléments de notre collection! 
        Vous voyagerez à travers les plus célèbres peintures du monde entier!
      </Text>

      {paintings ? (
          Object.entries(paintings).map(([key, painting]) => (
            <View
              key={key}
              className={`mb-5 p-4 rounded-lg w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <Text className={`text-lg my-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Title: {painting.title}
              </Text>
              <Text className={`text-lg my-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Author: {painting.author}
              </Text>
            </View>
          ))
      ) : (
      <Text className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
        No paintings found in Local 2106.
      </Text>
)}


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
 


});


export default RoomOne;

