import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';


import RegisterScreen from './register';
import MuseumPlan from './(tabs)/museumPlan';
import {FIREBASE_AUTH} from '../fireBaseConfig';
import {User} from 'firebase/auth';
import "../global.css"; // Correct import path




const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();


function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="MuseumPlan" component={MuseumPlan} options={{ headerShown: false }} />
    </InsideStack.Navigator>
  );
}

export default function Navigations() {
  const[user, setUser] =  useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('User:', user);
      setUser(user); // Set the user state
    });
  
    // Clean up the subscription
    return () => unsubscribe();
  }, []);
  

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator >
        {user ? (
          <Stack.Screen name="Inside" component={InsideLayout} options={{headerShown:false}} />

        ):(   
          <Stack.Screen name="Home" component={LoginScreen} options={{headerShown:false}}   />

        )}
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

  function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
      setLoading(true);
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        console.log(response);
        //alert('Check your email');
      } catch (error: any) {
        console.log(error);
        alert('Sign in failed: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    const signUp = async () => {
      setLoading(true);
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log(response);
        alert('Check your email');
      } catch (error: any) {
        console.log(error);
        alert('Sign up failed: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View className="py-6 px-0 flex-grow flex-shrink flex-basis-0">
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
            <KeyboardAvoidingView behavior="padding">
            <Text className="text-[31px] font-bold text-[#1D2A32] mb-1.5">
              Login{' '}
              {loading ? <Text className="text-[#075eec]">Loading...</Text> : null}
            </Text>
            </KeyboardAvoidingView>
          </View>

          <View className="mb-6 px-6 flex-grow flex-shrink flex-basis-0">
          <View className="mb-4">
            <Text className="text-[17px] font-semibold text-[#222] mb-2">
              Email address
            </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              className="h-12 bg-white px-4 rounded-xl text-[15px] font-medium text-[#222] border border-[#C9D3DB]"
              value={email}
            />
          </View>

            <View className="mb-4">
              <Text  className="text-[17px] font-semibold text-[#222] mb-2">
              Password</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(text) => setPassword(text)}
                placeholder="********"
                placeholderTextColor="#6b7280"
                className="h-12 bg-white px-4 rounded-xl text-[15px] font-medium text-[#222] border border-[#C9D3DB]"
                secureTextEntry={true}
                value={password}
              />
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>

                <View className="mt-1 mb-4">
                  <TouchableOpacity onPress={signIn}>
                    <View className="flex-row items-center justify-center rounded-full py-2.5 px-5 border border-[#075eec] bg-[#075eec]">
                      <Text className="text-[18px] leading-6 font-semibold text-white">Login</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                
              </>
            )}

            
            <Text className="text-[16px] font-semibold text-[#075eec] text-center">Forgot password?</Text>
          </View>
        </KeyboardAwareScrollView>


        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          className="mt-auto"
        >
          <Text className="text-[15px] font-semibold text-[#222] text-center tracking-[0.15px]">
            Don't have an account?{' '}
            <Text className="underline">Register</Text>
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
 


});




