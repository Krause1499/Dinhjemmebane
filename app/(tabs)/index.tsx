import { ResizeMode, Video } from "expo-av";
import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function Index() {
  return (
    <ScrollView style={styles.container}>

      {/* HERO SECTION */}

      <View style={styles.heroContainer}>
        <Video
          source={{ uri: "https://matchwinner.com/cdn/shop/videos/c/vp/ac955e2412224c4c85f13fbff930d97c/ac955e2412224c4c85f13fbff930d97c.HD-1080p-7.2Mbps-64276434.mp4?v=0" }}
          style={styles.heroVideo}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
        />

        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Din Hjemmebane</Text>
          <Text style={styles.heroSubtitle}>
            Find klassiske og moderne fodboldtrøjer
          </Text>

          <Link href="/shirts" asChild>
            <Pressable style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Udforsk trøjer</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* FEATURES */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hvorfor bruge appen?</Text>

        <View style={styles.featureRow}>
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>👕</Text>
            <Text style={styles.featureTitle}>Masser af trøjer</Text>
            <Text style={styles.featureText}>
              Find trøjer fra forskellige ligaer og sæsoner.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>📸</Text>
            <Text style={styles.featureTitle}>Detaljerede billeder</Text>
            <Text style={styles.featureText}>
              Se billeder og information om hver trøje.
            </Text>
          </View>
        </View>

        <View style={styles.featureRow}>
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>⚡</Text>
            <Text style={styles.featureTitle}>Live data</Text>
            <Text style={styles.featureText}>
              Appen henter data direkte fra jeres API.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>📱</Text>
            <Text style={styles.featureTitle}>Mobiloptimeret</Text>
            <Text style={styles.featureText}>
              Designet til en hurtig mobiloplevelse.
            </Text>
          </View>
        </View>
      </View>

      {/* CALL TO ACTION */}

      <View style={styles.ctaBox}>
        <Text style={styles.ctaTitle}>Klar til at gå på banen?</Text>

        <Link href="/shirts" asChild>
          <Pressable style={styles.ctaButton}>
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
    backgroundColor: "#0f172a",
  },

  heroContainer: {
    height: 320,
  },

  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "white",
    marginBottom: 10,
  },

  heroSubtitle: {
    fontSize: 16,
    color: "#e5e7eb",
    marginBottom: 20,
    textAlign: "center",
  },

  heroButton: {
    backgroundColor: "#fbbf24",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },

  heroButtonText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
  },

  section: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 16,
  },

  featureRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  featureCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 16,
  },

  featureEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },

  featureTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  featureText: {
    color: "#cbd5f5",
    fontSize: 14,
  },

  ctaBox: {
    padding: 24,
    margin: 20,
    backgroundColor: "#1e293b",
    borderRadius: 18,
    alignItems: "center",
  },

  ctaTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },

  ctaButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },

  ctaButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  heroVideo: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});