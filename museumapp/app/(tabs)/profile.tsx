import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  Switch,
} from 'react-native';
import { StatusBar } from 'react-native';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { FIREBASE_AUTH, FIREBASE_DB } from '../../fireBaseConfig';
import { onValue, ref } from 'firebase/database';
import { useTheme } from '../themeContext'; // Import the ThemeContext
import "../../global.css"; 




const Profile = () => {
  const { colorScheme } = useColorScheme();
  const { toggleDarkMode } = useTheme(); // Access toggle function from theme context
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [userInfo, setUserInfo] = useState({ email: '', name: '' });

  useEffect(() => {
    const loadDarkModePreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem('isDarkMode');
        if (storedPreference !== null) {
          setIsDarkMode(storedPreference === 'true');
        }
      } catch (error) {
        console.error('Failed to load dark mode preference:', error);
      }
    };

    loadDarkModePreference();

    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
      const userEmail = currentUser.email?.replace('.', ',');
      if (userEmail) {
        const userRef = ref(FIREBASE_DB, `users/${userEmail}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserInfo({
              email: data.email,
              name: data.name,
            });
          }
        });
      }
    }
  }, []);

  // Function to toggle color scheme and save preference
  const toggleColorScheme = async () => {
    const newMode = !isDarkMode; // Toggle the mode
    setIsDarkMode(newMode); // Update local state
    toggleDarkMode(); // Update context state
    console.log('Dark mode in prof: ',isDarkMode);
    try {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newMode));
    } catch (error) {
      console.error('Failed to save dark mode preference:', error);
    }
  };

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#e8ecf4"
      />

<SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#000' : '#e8ecf4' }}>
  <View className="flex-1 justify-center items-center">
    <Text className={`text-2xl font-bold mb-5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      Profile
    </Text>
    <Text className={`text-lg my-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      Name: {userInfo.name}
    </Text>
    <Text className={`text-lg my-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      Email: {userInfo.email}
    </Text>

    <View className="flex-row items-center my-5">
      <Text className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
        Dark Mode
      </Text>
      <Switch
        value={isDarkMode}
        onValueChange={toggleColorScheme}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
      />
    </View>

    <Button title="Logout" onPress={() => FIREBASE_AUTH.signOut()} />
  </View>
</SafeAreaView>

    </>
  );
};


export default Profile;
