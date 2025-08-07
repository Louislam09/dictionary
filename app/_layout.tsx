import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import DatabaseProvider from "@/context/DatabaseContext";
import DictionaryProvider from "@/context/DictionaryContext";
import StorageProvider from "@/context/LocalstoreContext";
import ThemeProvider from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { ToastAndroid } from "react-native";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    OpenSans: require("../assets/fonts/OpenSans-VariableFont_wdth-wght.ttf"),
    ...FontAwesome.font,
  });

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
        ToastAndroid.show("Actualizada ✅", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("🔄", ToastAndroid.SHORT);
    }
  }

  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <StorageProvider>
      <ThemeProvider>
        <DatabaseProvider>
          <DictionaryProvider>
            <StatusBar style="auto" animated />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
              <Stack.Screen
                name="dictionaySearch"
                initialParams={{ word: null }}
              />
            </Stack>
          </DictionaryProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </StorageProvider>
  );
}
