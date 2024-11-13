import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Button,
  Platform,
  KeyboardAvoidingView, 
} from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { useRoute, RouteProp } from '@react-navigation/native';
import { FIREBASE_DB } from '../../fireBaseConfig';
import { useTheme } from '../themeContext'; // Accessing the dark mode
import { useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 

import "../../global.css"; 


type PaintingRouteParams = {
  scannedData: string; // The scanned data that corresponds to a painting key
};

type PaintingScreenRouteProp = RouteProp<{ params: PaintingRouteParams }, 'params'>;
const Painting = () => {
  const router = useRouter(); // Initialize the router
  const [painting, setPainting] = useState<any | null>(null); // Store the matched painting
  const [newComment, setNewComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const route = useRoute<PaintingScreenRouteProp>();
  const { scannedData } = route.params; 
  const { isDarkMode } = useTheme(); // Use theme context for dark mode

  useEffect(() => {
    const paintingsRef = ref(FIREBASE_DB, 'paintings/');
    onValue(paintingsRef, (snapshot) => {
      const paintingsData = snapshot.val();
      if (paintingsData && paintingsData[scannedData]) {
        setPainting(paintingsData[scannedData]); // Set the matched painting
      } else {
        setError('Painting not found');
      }
    });
  }, [scannedData]);

  const handleLike = (currentLikes: number) => {
    const paintingRef = ref(FIREBASE_DB, `paintings/${scannedData}`);
    update(paintingRef, { liked: currentLikes + 1 });
  };

  const handleAddComment = () => {
    if (newComment) {
      const paintingRef = ref(FIREBASE_DB, `paintings/${scannedData}`);
      const currentComments = painting?.comments || '';
      const updatedComments = currentComments
        ? `${currentComments}__${newComment.replace(/ /g, '_')}__`
        : `${newComment.replace(/ /g, '_')}__`;
      update(paintingRef, { comments: updatedComments });
      setNewComment(''); // Clear input
    }
  };

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#000' : '#e8ecf4' }]}>
      <TouchableOpacity  className="absolute left-5 top-12 bg-black/50 rounded-md p-2 z-10" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        className="flex-grow justify-center items-center p-5"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle="flex-grow items-center"  showsVerticalScrollIndicator={false} >
          {painting ? (
            <>
              {painting.image ? (
                <Image
                  className="w-full h-[350px] mb-5"
                  resizeMode="contain"
                  source={{ uri: painting.image }}
                />
              ) : (
                <Text>Loading image...</Text>
              )}
              <Text  className={`text-2xl font-bold mb-5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {painting.title}
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
                Description: {painting.description}
              </Text>
              <Text className={`text-lg my-1.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Likes: {painting.liked}
              </Text>

              <TouchableOpacity
                  style={[styles.likeButton, { backgroundColor: isDarkMode ? '#555' : '#4CAF50' }]}
                  onPress={() => handleLike(painting.liked)}
                >
                <Text style={styles.likeButtonText}>Like</Text>
              </TouchableOpacity>

              {/* Comments */}
              <Text   className={`text-lg font-bold mt-2.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Comments:
              </Text>
              {painting.comments
                ? painting.comments.split('__').map((comment: string, index: number) => (
                    <Text key={index} className={`text-base my-1.5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {comment.replace(/_/g, ' ')}
                    </Text>
                  ))
                : <Text>No comments available.</Text>}

              <TextInput
                className={`border p-2.5 mt-2.5 rounded-md w-full ${isDarkMode ? 'bg-[#555] text-white border-[#666]' : 'bg-white text-black border-[#ccc]'}`}
                placeholder="Add a comment..."
                placeholderTextColor={isDarkMode ? '#ccc' : '#666'}
                value={newComment}
                onChangeText={setNewComment}
              />
              <Button title="Submit Comment" onPress={handleAddComment} />
              
            </>
          ) : (
            <Text>Loading painting details...</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContainer: {
    flexGrow: 1,
  },
  likeButton: {
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
  width: '100%',
  },
  likeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',

  },
   errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default Painting;
