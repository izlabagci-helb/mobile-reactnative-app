import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { onValue, ref, update } from 'firebase/database';
import { FIREBASE_DB } from '../../fireBaseConfig';
import { useTheme } from '../themeContext'; // Import useTheme for dark mode
import "../../global.css"; 

//Chatgpt

const Favorite = () => {
  const [paintings, setPaintings] = useState<{ [key: string]: any } | null>(null);
  const { isDarkMode } = useTheme(); // Access the current theme

  useEffect(() => {
    const paintingsRef = ref(FIREBASE_DB, 'paintings/');
    onValue(paintingsRef, (snapshot) => {
      const data = snapshot.val();
      setPaintings(data);
    });
  }, []);

  

  console.log('Dark Mode in Fav: ', isDarkMode);

  return (

    <ScrollView 
      contentContainerStyle={[
        { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
        isDarkMode ? { backgroundColor: '#000' } : { backgroundColor: '#e8ecf4' }
      ]}
    >
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-black' : 'bg-[#e8ecf4]'}`}>
      
        <Text className={`text-2xl font-bold mb-5 ${isDarkMode ? 'text-white' : 'text-black'} text-center` }>
          All Paintings
        </Text>
        {paintings ? (
          Object.entries(paintings)
          .sort(([, paintingA], [, paintingB]) => paintingB.liked - paintingA.liked) // Sort by likes descending
          .map(([key, painting]) => (
            <View
              key={key}
              className={`mb-5 p-4 rounded-lg w-full ${isDarkMode ? 'bg-[#333]' : 'bg-white'}`}
            >
              <Text className={`text-lg my-1.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Title: {painting.title}
              </Text>
              <Text className={`text-lg my-1.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Author: {painting.author}
              </Text>
              <Text className={`text-lg my-1.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Year: {painting.year}
              </Text>
              <Text className={`text-lg my-1.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Location: {painting.location}
              </Text>
              <Text className={`text-lg my-1.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Likes: {painting.liked}
              </Text>
              <Text className={`text-lg my-1.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Description: {painting.description}
              </Text>

              

              <Text className={`text-lg font-bold mt-2.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Comments:
              </Text>
              {typeof painting.comments === 'string'
                ? painting.comments
                    .split('__')
                    .filter((sentence) => sentence.trim())
                    .map((sentence, index) => (
                      <Text key={index}  className={`text-base my-1.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        - {sentence.replace(/_/g, ' ')}
                      </Text>
                    ))
                : <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>No comments yet.</Text>}
              
            </View>
            
          ))
        ) : (
          <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>No paintings found.</Text>
        )}
     
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
   
  
});

export default Favorite;
