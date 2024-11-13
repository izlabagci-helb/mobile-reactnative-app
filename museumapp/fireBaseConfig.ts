// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { getDatabase } from 'firebase/database'; // Use firebase/database, not react-native-firebase




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// https://www.youtube.com/watch?v=ONAVmsGW6-M
// https://stackoverflow.com/questions/76914913/cannot-import-getreactnativepersistence-in-firebase10-1-0

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEIJYQPrKfmS7DdgVv-V17dyvCEli3cu4",
  authDomain: "museeapp-a8212.firebaseapp.com",
  projectId: "museeapp-a8212",
  storageBucket: "museeapp-a8212.appspot.com",
  messagingSenderId: "566389039923",
  appId: "1:566389039923:web:a6d6ec6981638d80739446",
  
  databaseURL: "https://museeapp-a8212-default-rtdb.europe-west1.firebasedatabase.app"

  
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
//export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);



/*const auth = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});*/

//const db = getDataBase();
//export {db}

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIREBASE_DB = getDatabase(FIREBASE_APP);