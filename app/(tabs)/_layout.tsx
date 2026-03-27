import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Colors, Fonts } from "../../theme";

export default function TabLayout() {
  const { user } = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: {
          backgroundColor: Colors.headerBg,
          borderTopColor: Colors.line,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.bodySemiBold,
          fontSize: 11,
          letterSpacing: 0.3,
        },
        headerStyle: {
          backgroundColor: Colors.headerBg,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.goldLight,
        headerTitleStyle: {
          fontFamily: Fonts.bodyBold,
          fontSize: 16,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Hjem",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="shirts"
        options={{
          title: "Trøjer",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "shirt" : "shirt-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "Om os",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "information-circle" : "information-circle-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: user ? "Konto" : "Log ind",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={user ? (focused ? "person-circle" : "person-circle-outline") : (focused ? "person" : "person-outline")}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
