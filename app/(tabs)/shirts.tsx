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
  useWindowDimensions,
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

const NUM_COLUMNS = 2;

export default function ShirtsScreen() {
  const [shirts, setShirts] = useState<Shirt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const cardWidth = (width - Spacing.lg * 2 - Spacing.md) / NUM_COLUMNS;

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
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={styles.columnWrapper}
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
          style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && styles.cardPressed]}
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
            <Text style={styles.league}>{item.league}</Text>
            <Text style={styles.title} numberOfLines={1}>{item.team}</Text>
            <Text style={styles.season}>{item.season}</Text>

            <View style={styles.badgeRow}>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>Str. {item.size}</Text>
              </View>
              <View style={[
                styles.infoBadge,
                item.isAvailable ? styles.availableBadge : styles.unavailableBadge,
              ]}>
                <Text style={[
                  styles.infoBadgeText,
                  item.isAvailable ? styles.availableText : styles.unavailableText,
                ]}>
                  {item.isAvailable ? "På lager" : "Udsolgt"}
                </Text>
              </View>
            </View>

            <Text style={styles.price}>{item.priceWithVAT} kr.</Text>
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

  columnWrapper: {
    gap: Spacing.md,
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
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
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
    height: 140,
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
    padding: Spacing.md,
  },

  league: {
    color: Colors.gold,
    fontSize: 9,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  title: {
    color: Colors.goldLight,
    fontSize: 15,
    fontFamily: Fonts.display,
    letterSpacing: 0.3,
    marginBottom: 1,
  },

  season: {
    color: Colors.muted,
    fontSize: 11,
    fontFamily: Fonts.bodySemiBold,
    marginBottom: Spacing.sm,
  },

  availableBadge: {
    backgroundColor: Colors.availableBg,
    borderColor: Colors.availableBorder,
  },

  unavailableBadge: {
    backgroundColor: Colors.soldOutBg,
    borderColor: Colors.soldOutBorder,
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
    gap: 4,
    marginBottom: Spacing.sm,
  },

  infoBadge: {
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },

  infoBadgeText: {
    color: Colors.goldLight,
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.2,
  },

  price: {
    color: Colors.goldLight,
    fontSize: 17,
    fontFamily: Fonts.display,
    letterSpacing: 0.3,
  },
});
