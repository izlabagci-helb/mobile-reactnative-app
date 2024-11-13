import { Camera, CameraView } from "expo-camera";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import {
  AppState,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Overlay } from "./Overlay";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState, useCallback } from "react";

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [scannedData, setScannedData] = useState("");
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const url = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';
  const checkUrlRegex = new RegExp(url);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true); // Re-enable the camera when returning to this screen
      return () => setIsCameraActive(false); // Disable it when navigating away
    }, [])
  );

  const handleScannedData = (data) => {
    if (data && !qrLock.current) {
      qrLock.current = true;
      setScannedData(data);

      if (checkUrlRegex.test(data)) {
        Alert.alert("Invalid QR Code", "URLs are not supported.", [
          {
            text: "OK",
            onPress: () => {
              qrLock.current = false;
            }
          }
        ]);
      } else {
        if (data === "roomOne") router.push("/roomOne");
        else if (data === "roomTwo") router.push("/roomTwo");
        else router.push({ pathname: "/painting", params: { scannedData: data } });

        setTimeout(() => {
          qrLock.current = false;
        }, 2000);
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen options={{ title: "Scanner", headerShown: false }} />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      {isCameraActive && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={({ data }) => handleScannedData(data)}
        />
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Overlay />
      {scannedData ? (
        <Text style={styles.scannedText}>Scanned QR Code: {scannedData}</Text>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scannedText: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 62,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    zIndex: 10,
    borderRadius: 5,
  },
});
