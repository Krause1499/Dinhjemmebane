import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Radius, Spacing } from "../theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Side ikke fundet" }} />
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Siden findes ikke</Text>
        <Text style={styles.sub}>Den side du leder efter eksisterer ikke.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>← Gå tilbage til forsiden</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },

  code: {
    color: Colors.gold,
    fontSize: 96,
    fontFamily: Fonts.display,
    letterSpacing: 2,
    lineHeight: 96,
    marginBottom: Spacing.md,
  },

  title: {
    color: Colors.goldLight,
    fontSize: 28,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },

  sub: {
    color: Colors.muted,
    fontSize: 15,
    fontFamily: Fonts.body,
    marginBottom: Spacing.xxl,
    textAlign: "center",
  },

  link: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: Radius.lg,
  },

  linkText: {
    color: Colors.goldLight,
    fontSize: 14,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.3,
  },
});
