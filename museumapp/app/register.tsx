import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../fireBaseConfig'; 
import { FIREBASE_DB } from '../fireBaseConfig';
import {ref, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Import Stack Navigator

import MuseumPlan from './(tabs)/museumPlan';
import LoginScreen from './index';


const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function Museum() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="MuseumPlan" component={MuseumPlan} options={{ headerShown: false }} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="Museum" component={Museum} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function RegisterScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  //add data on realtime db
  //https://www.youtube.com/watch?v=3GzN4KFEf7c
  const dataAddOn = (email, name) => {
    set(ref(FIREBASE_DB, 'users/' + email.replace('.', ',')), {
      email: email,
      name: name,
    }).catch(error => {
      console.error("Error adding user to database: ", error);
    });
  };
  

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, form.email, form.password);
      console.log(response);
      alert('Account created, Login to continue');
      //navigation.navigate('LoginScreen');
      dataAddOn(form.email, form.name);
      Museum();
      
      //addPaintings();
    } catch (error: any) {
      console.log(error);
      alert('Register failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              className="w-20 h-20 self-center mb-9"
              source={{
                uri: 'https://www.repro-tableaux.com/kunst/jan_vermeer_van_delft/thm_Das-Maedchen-mit-dem-Perlenohrring-Restaurierte-Version-ab-1994.jpg',
              }}
            />
            <Text className="text-[31px] font-bold text-[#1D2A32] mb-1.5">
              Register <Text className="text-[#075eec]"></Text>
            </Text>
          </View>

          <View className="mb-6 px-6 flex-grow flex-shrink">
          <View className="mb-4">
            <Text className="text-[17px] font-semibold text-[#222] mb-2">Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(name) => setForm({ ...form, name })}
              placeholder="John"
              placeholderTextColor="#6b7280"
              className="h-12 bg-white px-4 rounded-xl text-[15px] font-medium text-[#222] border border-[#C9D3DB]"
              value={form.name}
            />
          </View>

          <View className="mb-4">
            <Text className="text-[17px] font-semibold text-[#222] mb-2">Email address</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={(email) => setForm({ ...form, email })}
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              className="h-12 bg-white px-4 rounded-xl text-[15px] font-medium text-[#222] border border-[#C9D3DB]"
              value={form.email}
            />
          </View>

          <View className="mb-4">
            <Text className="text-[17px] font-semibold text-[#222] mb-2">Password</Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              className="h-12 bg-white px-4 rounded-xl text-[15px] font-medium text-[#222] border border-[#C9D3DB]"
              secureTextEntry={true}
              value={form.password}
            />
          </View>

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View className="mt-1 mb-4">
                <TouchableOpacity onPress={signUp}>
                  <View className="flex-row items-center justify-center rounded-full py-2.5 px-5 border border-[#075eec] bg-[#075eec]">
                    <Text className="text-[18px] leading-6 font-semibold text-white">Create account</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen')}
          className="auto" 
        >
        <Text className="text-[15px] font-semibold text-[#222] text-center tracking-[0.15px]">
            Have an account?{' '}
            <Text className="underline">Login</Text>
        </Text>
        </TouchableOpacity>


      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
 
});




