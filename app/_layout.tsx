import { BebasNeue_400Regular, useFonts as useBebasNeue } from "@expo-google-fonts/bebas-neue";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  useFonts as useOutfit,
} from "@expo-google-fonts/outfit";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { Colors } from "../theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [bebasLoaded] = useBebasNeue({ BebasNeue_400Regular });
  const [outfitLoaded] = useOutfit({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  const fontsLoaded = bebasLoaded && outfitLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <CartProvider>
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.headerBg,
          },
          headerTintColor: Colors.goldLight,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: "Outfit_700Bold",
            fontSize: 16,
          },
          contentStyle: {
            backgroundColor: Colors.bg,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="register"
          options={{
            title: "Opret konto",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            title: "Checkout",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="payment"
          options={{
            title: "Betaling",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="order-success"
          options={{
            headerShown: false,
            presentation: "card",
          }}
        />
      </Stack>
    </AuthProvider>
    </CartProvider>
  );
}
