import { ResizeMode, Video } from "expo-av";
import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors, Fonts, Radius, Spacing } from "../../theme";

export default function Index() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HERO */}
      <View style={styles.heroContainer}>
        <Video
          source={{ uri: "https://cdn.pixabay.com/video/2024/03/22/205193-926528071_large.mp4" }}
          style={styles.heroVideo}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroEyebrow}>DIN HJEMMEBANE</Text>
          <Text style={styles.heroTitle}>Find din{"\n"}næste trøje</Text>
          <Text style={styles.heroSubtitle}>
            Klassiske og moderne fodboldtrøjer fra hele verden
          </Text>
          <Link href="/shirts" asChild>
            <Pressable style={({ pressed }) => [styles.heroButton, pressed && styles.heroButtonPressed]}>
              <Text style={styles.heroButtonText}>Udforsk trøjer</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* GULD DIVIDER */}
      <View style={styles.goldBar} />

      {/* FEATURES */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>HVORFOR OS</Text>
        <Text style={styles.sectionTitle}>Skabt til fodboldentusiaster</Text>

        <View style={styles.featureRow}>
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>👕</Text>
            <Text style={styles.featureTitle}>Stort udvalg</Text>
            <Text style={styles.featureText}>
              Trøjer fra ligaer og sæsoner over hele verden.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>📸</Text>
            <Text style={styles.featureTitle}>Detaljerede billeder</Text>
            <Text style={styles.featureText}>
              Se billeder og info om hver enkelt trøje.
            </Text>
          </View>
        </View>

        <View style={styles.featureRow}>
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>⚡</Text>
            <Text style={styles.featureTitle}>Live data</Text>
            <Text style={styles.featureText}>
              Altid opdateret direkte fra vores lager.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>📦</Text>
            <Text style={styles.featureTitle}>Mystery box</Text>
            <Text style={styles.featureText}>
              Prøv lykken med en overraskelsespakke.
            </Text>
          </View>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.ctaBox}>
        <Text style={styles.ctaEyebrow}>KLAR?</Text>
        <Text style={styles.ctaTitle}>Klar til at gå{"\n"}på banen?</Text>
        <Link href="/shirts" asChild>
          <Pressable style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}>
            <Text style={styles.ctaButtonText}>Se alle trøjer</Text>
          </Pressable>
        </Link>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  heroContainer: {
    height: 380,
  },

  heroVideo: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(6, 15, 31, 0.65)",
    justifyContent: "flex-end",
    padding: Spacing.xl,
    paddingBottom: 32,
  },

  heroEyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 2,
    marginBottom: 10,
  },

  heroTitle: {
    color: Colors.goldLight,
    fontSize: 56,
    fontFamily: Fonts.display,
    letterSpacing: 1,
    lineHeight: 54,
    marginBottom: 12,
  },

  heroSubtitle: {
    color: Colors.mutedStrong,
    fontSize: 15,
    fontFamily: Fonts.body,
    lineHeight: 22,
    marginBottom: 24,
  },

  heroButton: {
    backgroundColor: Colors.navyBtn,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: Radius.lg,
    alignSelf: "flex-start",
  },

  heroButtonPressed: {
    backgroundColor: Colors.navyBtnHover,
  },

  heroButtonText: {
    color: Colors.goldLight,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 0.5,
  },

  goldBar: {
    height: 3,
    backgroundColor: Colors.gold,
    opacity: 0.5,
  },

  section: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
  },

  sectionEyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 2,
    marginBottom: 8,
  },

  sectionTitle: {
    color: Colors.goldLight,
    fontSize: 34,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: Spacing.xl,
  },

  featureRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },

  featureCard: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.line,
  },

  featureEmoji: {
    fontSize: 26,
    marginBottom: Spacing.sm,
  },

  featureTitle: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: Fonts.bodyBold,
    marginBottom: 6,
  },

  featureText: {
    color: Colors.muted,
    fontSize: 13,
    fontFamily: Fonts.body,
    lineHeight: 19,
  },

  ctaBox: {
    margin: Spacing.xl,
    marginTop: Spacing.sm,
    padding: Spacing.xxl,
    backgroundColor: Colors.card,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.line,
    alignItems: "center",
  },

  ctaEyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 2,
    marginBottom: 8,
  },

  ctaTitle: {
    color: Colors.goldLight,
    fontSize: 42,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    textAlign: "center",
    lineHeight: 40,
    marginBottom: Spacing.xl,
  },

  ctaButton: {
    backgroundColor: Colors.navyBtn,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: Radius.lg,
  },

  ctaButtonPressed: {
    backgroundColor: Colors.navyBtnHover,
  },

  ctaButtonText: {
    color: Colors.goldLight,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
