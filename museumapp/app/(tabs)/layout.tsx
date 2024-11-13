import { Stack } from "expo-router";
import * as React from 'react';
import { ThemeProvider } from '../themeContext'; // Import the ThemeProvider


export default function RootLayout() {
  return(
  <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}

