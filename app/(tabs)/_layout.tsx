import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Colors, Fonts, Radius } from "../../theme";

function CartTabIcon({ color, focused }: { color: string; focused: boolean }) {
  const { itemCount } = useCart();
  return (
    <View>
      <Ionicons name={focused ? "cart" : "cart-outline"} color={color} size={24} />
      {itemCount > 0 && (
        <View style={badgeStyles.badge}>
          <Text style={badgeStyles.badgeText}>{itemCount > 9 ? "9+" : itemCount}</Text>
        </View>
      )}
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: Colors.gold,
    borderRadius: Radius.full,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.navy,
    fontSize: 9,
    fontFamily: Fonts.bodyExtraBold,
    lineHeight: 12,
  },
});

export default function TabLayout() {
  const { user } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.headerBg, paddingTop: 10 }} edges={["top"]}>
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
        headerShown: false,
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
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "shirt" : "shirt-outline"} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Kurv",
          tabBarIcon: ({ color, focused }) => (
            <CartTabIcon color={color} focused={focused} />
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
    </SafeAreaView>
  );
}
