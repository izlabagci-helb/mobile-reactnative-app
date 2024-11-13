import { Stack } from "expo-router";
import * as React from 'react';
import { ThemeProvider } from './themeContext'; 




export default function App() {
  return (
    <ThemeProvider>
      <Stack 
        initialRouteName="login" 
        screenOptions={{ headerShown: false }} 
      />
    </ThemeProvider>
  );
}

