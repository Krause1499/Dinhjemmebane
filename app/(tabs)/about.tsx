import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors, Fonts, Radius, Spacing } from "../../theme";

const STATS = [
  { number: "2000+", label: "TRØJER SOLGT" },
  { number: "47",    label: "LIGAER" },
  { number: "4.9★",  label: "GENNEMSNITLIG RATING" },
  { number: "48T",   label: "LEVERING" },
];

const VALUES = [
  {
    emoji: "🏆",
    title: "Kvalitet først",
    text: "Alle trøjer gennemgås og beskrives ærligt — vi skjuler ingen fejl.",
  },
  {
    emoji: "🌍",
    title: "Globalt udvalg",
    text: "Fra Premier League til lavere divisioner — vi dækker hele verden.",
  },
  {
    emoji: "📦",
    title: "Mystery box",
    text: "Prøv lykken med en mystery box fyldt med overraskende trøjer.",
  },
  {
    emoji: "🤝",
    title: "Kundefokus",
    text: "Vi hjælper gerne — send os en besked og vi svarer hurtigt.",
  },
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>OM OS</Text>
        <Text style={styles.heroTitle}>Din Hjemmebane</Text>
        <Text style={styles.heroText}>
          Vi er passionerede fodboldentusiaster der samler og sælger autentiske fodboldtrøjer.
          Fra klassiske perler til moderne favoritter — vi finder det til dig.
        </Text>
      </View>

      <View style={styles.goldDivider} />

      {/* STATS */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>I TAL</Text>
        <Text style={styles.sectionTitle}>Hvad vi har opnået</Text>

        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* VÆRDIER */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>VORES VÆRDIER</Text>
        <Text style={styles.sectionTitle}>Sådan arbejder vi</Text>

        {VALUES.map((v) => (
          <View key={v.title} style={styles.valueCard}>
            <Text style={styles.valueEmoji}>{v.emoji}</Text>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>{v.title}</Text>
              <Text style={styles.valueText}>{v.text}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaBox}>
        <Text style={styles.ctaTitle}>Klar til at handle?</Text>
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

  hero: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },

  heroEyebrow: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 2,
    marginBottom: 8,
  },

  heroTitle: {
    color: Colors.goldLight,
    fontSize: 52,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: Spacing.lg,
  },

  heroText: {
    color: Colors.mutedStrong,
    fontSize: 15,
    fontFamily: Fonts.body,
    lineHeight: 24,
  },

  goldDivider: {
    height: 3,
    backgroundColor: Colors.gold,
    opacity: 0.4,
    marginHorizontal: Spacing.xl,
    borderRadius: Radius.full,
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
    fontSize: 32,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: Spacing.xl,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },

  statCard: {
    flex: 1,
    minWidth: "44%",
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.line,
    alignItems: "center",
  },

  statNumber: {
    color: Colors.gold,
    fontSize: 36,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  statLabel: {
    color: Colors.muted,
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1.5,
    textAlign: "center",
  },

  valueCard: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.line,
    marginBottom: Spacing.md,
    gap: Spacing.lg,
    alignItems: "flex-start",
  },

  valueEmoji: {
    fontSize: 28,
    marginTop: 2,
  },

  valueContent: {
    flex: 1,
  },

  valueTitle: {
    color: Colors.text,
    fontSize: 15,
    fontFamily: Fonts.bodyBold,
    marginBottom: 6,
  },

  valueText: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
    lineHeight: 21,
  },

  ctaBox: {
    margin: Spacing.xl,
    padding: Spacing.xxl,
    backgroundColor: Colors.card,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.line,
    alignItems: "center",
    marginBottom: 32,
  },

  ctaTitle: {
    color: Colors.goldLight,
    fontSize: 32,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
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
