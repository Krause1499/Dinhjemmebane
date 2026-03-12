import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
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
      const url = "https://dinhjemmebaneapi.runasp.net/api/shirts";
      const response = await fetch(url);

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
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text style={styles.loadingText}>Henter trøjer...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Shirts" }} />

      <FlatList
        data={shirts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbbf24" />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>KOLLEKTION</Text>
            <Text style={styles.headerTitle}>Find din næste trøje</Text>
            <Text style={styles.headerSubtitle}>
              Udforsk klassiske og moderne fodboldtrøjer fra forskellige ligaer,
              sæsoner og størrelser.
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{shirts.length}</Text>
                <Text style={styles.statLabel}>Trøjer</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {shirts.filter((shirt) => shirt.isAvailable).length}
                </Text>
                <Text style={styles.statLabel}>Tilgængelige</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
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

            <View style={styles.cardContent}>
              <View style={styles.topRow}>
                <View style={styles.titleBlock}>
                  <Text style={styles.title}>{item.team}</Text>
                  <Text style={styles.season}>{item.season}</Text>
                </View>

                <View
                  style={[
                    styles.availabilityBadge,
                    item.isAvailable
                      ? styles.availableBadge
                      : styles.unavailableBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.availabilityText,
                      item.isAvailable
                        ? styles.availableText
                        : styles.unavailableText,
                    ]}
                  >
                    {item.isAvailable ? "På lager" : "Udsolgt"}
                  </Text>
                </View>
              </View>

              <View style={styles.badgeRow}>
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>{item.league}</Text>
                </View>

                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>Str. {item.size}</Text>
                </View>

                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>{item.quality}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  Ærmer: {item.hasSleeves ? "Ja" : "Nej"}
                </Text>
                <Text style={styles.metaText}>
                  Tryk: {item.isPrinted ? "Ja" : "Nej"}
                </Text>
              </View>

              <View style={styles.bottomRow}>
                <View>
                  <Text style={styles.priceLabel}>Pris inkl. moms</Text>
                  <Text style={styles.price}>{item.priceWithVAT} kr.</Text>
                </View>

                <View style={styles.ctaPill}>
                  <Text style={styles.ctaPillText}>Se detaljer</Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loadingText: {
    color: "#e5e7eb",
    marginTop: 12,
    fontSize: 16,
  },

  list: {
    padding: 16,
    paddingBottom: 28,
    backgroundColor: "#0f172a",
  },

  header: {
    marginBottom: 20,
    paddingTop: 4,
  },

  kicker: {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  headerTitle: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },

  headerSubtitle: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },

  statNumber: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },

  statLabel: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 22,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },

  image: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
    backgroundColor: "#0b1220",
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    color: "#64748b",
    fontSize: 14,
  },

  cardContent: {
    padding: 16,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },

  titleBlock: {
    flex: 1,
  },

  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },

  season: {
    color: "#94a3b8",
    fontSize: 15,
    fontWeight: "600",
  },

  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  availableBadge: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.35)",
  },

  unavailableBadge: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.35)",
  },

  availabilityText: {
    fontSize: 12,
    fontWeight: "700",
  },

  availableText: {
    color: "#4ade80",
  },

  unavailableText: {
    color: "#f87171",
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },

  infoBadge: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },

  infoBadgeText: {
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: "700",
  },

  metaRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },

  metaText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "500",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 4,
  },

  price: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "800",
  },

  ctaPill: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },

  ctaPillText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
});