import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors, Fonts, Radius, Spacing } from "../../theme";

type Shirt = {
  id: number;
  league: string;
  team: string;
  season: string;
  quality: string;
  size: string;
  hasSleeves: boolean;
  isPrinted: boolean;
  printedName?: string | null;
  price: number;
  priceWithVAT: number;
  pictureUrl?: string | null;
  isAvailable: boolean;
  images: unknown[];
};

export default function ShirtsScreen() {
  const [shirts, setShirts] = useState<Shirt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getAPIData = async () => {
    try {
      const response = await fetch("https://dinhjemmebaneapi.runasp.net/api/shirts");

      if (!response.ok) {
        throw new Error(`Fejl ved API-kald: ${response.status}`);
      }

      const result: Shirt[] = await response.json();
      setShirts(result);
    } catch (error) {
      console.log("Fejl ved hentning af shirts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getAPIData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getAPIData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={styles.loadingText}>Henter trøjer...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={shirts}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.gold}
          colors={[Colors.gold]}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.kicker}>KOLLEKTION</Text>
          <Text style={styles.headerTitle}>Find din næste trøje</Text>
          <Text style={styles.headerSubtitle}>
            Klassiske og moderne fodboldtrøjer fra forskellige ligaer, sæsoner og størrelser.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{shirts.length}</Text>
              <Text style={styles.statLabel}>Trøjer i alt</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {shirts.filter((s) => s.isAvailable).length}
              </Text>
              <Text style={styles.statLabel}>På lager</Text>
            </View>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() =>
            router.push({
              pathname: "/shirts/[id]",
              params: { id: item.id.toString() },
            })
          }
        >
          {item.pictureUrl ? (
            <Image source={{ uri: item.pictureUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.imagePlaceholderText}>Ingen billede</Text>
            </View>
          )}

          {!item.isAvailable && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>UDSOLGT</Text>
            </View>
          )}

          <View style={styles.cardContent}>
            <View style={styles.topRow}>
              <View style={styles.titleBlock}>
                <Text style={styles.league}>{item.league}</Text>
                <Text style={styles.title}>{item.team}</Text>
                <Text style={styles.season}>{item.season}</Text>
              </View>

              <View style={[
                styles.availabilityBadge,
                item.isAvailable ? styles.availableBadge : styles.unavailableBadge,
              ]}>
                <Text style={[
                  styles.availabilityText,
                  item.isAvailable ? styles.availableText : styles.unavailableText,
                ]}>
                  {item.isAvailable ? "På lager" : "Udsolgt"}
                </Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>Str. {item.size}</Text>
              </View>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>{item.quality}</Text>
              </View>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>
                  {item.hasSleeves ? "Med ærmer" : "Uden ærmer"}
                </Text>
              </View>
            </View>

            <View style={styles.bottomRow}>
              <View>
                <Text style={styles.priceLabel}>Pris inkl. moms</Text>
                <Text style={styles.price}>{item.priceWithVAT} kr.</Text>
              </View>
              <View style={styles.ctaPill}>
                <Text style={styles.ctaPillText}>Se detaljer →</Text>
              </View>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },

  loadingText: {
    color: Colors.text,
    marginTop: Spacing.md,
    fontSize: 16,
    fontFamily: Fonts.body,
  },

  list: {
    padding: Spacing.lg,
    paddingBottom: 32,
    backgroundColor: Colors.bg,
  },

  header: {
    marginBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },

  kicker: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 2,
    marginBottom: 8,
  },

  headerTitle: {
    color: Colors.goldLight,
    fontSize: 38,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  headerSubtitle: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
    lineHeight: 21,
    marginBottom: Spacing.lg,
  },

  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.line,
  },

  statNumber: {
    color: Colors.goldLight,
    fontSize: 28,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  statLabel: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: Fonts.bodySemiBold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xxl,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.line,
  },

  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },

  image: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
    backgroundColor: Colors.bgAlt,
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
  },

  soldOutOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.soldOutBg,
    borderWidth: 1,
    borderColor: Colors.soldOutBorder,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },

  soldOutText: {
    color: Colors.soldOut,
    fontSize: 10,
    fontFamily: Fonts.bodyExtraBold,
    letterSpacing: 1,
  },

  cardContent: {
    padding: Spacing.lg,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },

  titleBlock: {
    flex: 1,
  },

  league: {
    color: Colors.gold,
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  title: {
    color: Colors.goldLight,
    fontSize: 26,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  season: {
    color: Colors.muted,
    fontSize: 13,
    fontFamily: Fonts.bodySemiBold,
  },

  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },

  availableBadge: {
    backgroundColor: Colors.availableBg,
    borderColor: Colors.availableBorder,
  },

  unavailableBadge: {
    backgroundColor: Colors.soldOutBg,
    borderColor: Colors.soldOutBorder,
  },

  availabilityText: {
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
  },

  availableText: {
    color: Colors.available,
  },

  unavailableText: {
    color: Colors.soldOut,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  infoBadge: {
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },

  infoBadgeText: {
    color: Colors.goldLight,
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.3,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceLabel: {
    color: Colors.muted,
    fontSize: 11,
    fontFamily: Fonts.body,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  price: {
    color: Colors.goldLight,
    fontSize: 28,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
  },

  ctaPill: {
    backgroundColor: Colors.navyBtn,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },

  ctaPillText: {
    color: Colors.goldLight,
    fontSize: 12,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.3,
  },
});
