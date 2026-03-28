import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Radius, Spacing } from "../theme";

export default function OrderSuccessScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>✓</Text>
      </View>

      <Text style={styles.title}>Ordre bekræftet!</Text>
      <Text style={styles.subtitle}>
        Tak for din bestilling. Du modtager en bekræftelse på e-mail, og din pakke er på vej.
      </Text>

      <View style={styles.card}>
        <Row icon="📦" text="Din ordre er modtaget og behandles" />
        <Row icon="📧" text="Bekræftelse sendt til din e-mail" />
        <Row icon="🚚" text="Levering inden for 2–5 hverdage" />
      </View>

      <Pressable
        style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
        onPress={() => router.replace("/(tabs)/shop")}
      >
        <Text style={styles.btnText}>Fortsæt med at handle</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.7 }]}
        onPress={() => router.replace("/(tabs)/login")}
      >
        <Text style={styles.btnSecondaryText}>Se mine ordrer</Text>
      </Pressable>
    </View>
  );
}

function Row({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xxl,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.availableBg,
    borderWidth: 2,
    borderColor: Colors.availableBorder,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },

  icon: {
    color: Colors.available,
    fontSize: 36,
    fontFamily: Fonts.bodyBold,
  },

  title: {
    color: Colors.goldLight,
    fontSize: 42,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    textAlign: "center",
  },

  subtitle: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.lg,
    width: "100%",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  rowIcon: {
    fontSize: 18,
  },

  rowText: {
    color: Colors.text,
    fontSize: 13,
    fontFamily: Fonts.body,
    flex: 1,
    lineHeight: 19,
  },

  btn: {
    backgroundColor: Colors.gold,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: Radius.full,
    width: "100%",
    alignItems: "center",
    marginBottom: Spacing.md,
  },

  btnText: {
    color: Colors.navyDeep,
    fontSize: 15,
    fontFamily: Fonts.bodyExtraBold,
    letterSpacing: 0.5,
  },

  btnSecondary: {
    paddingVertical: 12,
    alignItems: "center",
  },

  btnSecondaryText: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
    letterSpacing: 0.3,
  },
});
